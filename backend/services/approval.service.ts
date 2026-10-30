import { cryptoVault } from "./crypto-vault.service.ts";
import { dbRepo } from "../database/db.ts";
import { eventStream } from "./event-stream.service.ts";

export interface CreateApprovalInput {
  actionType: string;
  merchantId: string;
  amount: number;
  params: Record<string, unknown>;
  policyVersion: string;
  ttlMinutes?: number;
  mode?: "LIVE" | "DEMO";
}

export class ApprovalService {
  /**
   * Computes deterministic canonical SHA256 hash over approval parameters
   * Any tampering of amount, action, merchant, or params invalidates this hash.
   */
  public computeParamsHash(
    actionType: string,
    merchantId: string,
    amount: number,
    params: Record<string, unknown>,
    policyVersion: string
  ): string {
    const canonicalPayload = JSON.stringify({
      actionType,
      merchantId,
      amount: Number(amount).toFixed(2),
      params: Object.keys(params).sort().reduce((acc: any, key) => {
        acc[key] = params[key];
        return acc;
      }, {}),
      policyVersion,
    });
    return cryptoVault.sha256(canonicalPayload);
  }

  /**
   * Creates a tamper-evident human approval request in the database
   */
  public async createRequest(input: CreateApprovalInput) {
    const mode = input.mode || "DEMO";
    const requestId = `APP_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const ttl = input.ttlMinutes ?? 15;
    const expiresAt = new Date(Date.now() + ttl * 60 * 1000).toISOString();

    const paramsHash = this.computeParamsHash(
      input.actionType,
      input.merchantId,
      input.amount,
      input.params,
      input.policyVersion
    );

    const record = {
      request_id: requestId,
      mode,
      action_type: input.actionType,
      merchant_id: input.merchantId,
      amount: input.amount,
      params_hash: paramsHash,
      policy_version: input.policyVersion,
      status: "PENDING",
      expires_at: expiresAt,
    };

    await dbRepo.createApprovalRequest(record);

    // Broadcast live event
    eventStream.broadcast(
      "APPROVAL_REQUESTED",
      {
        requestId,
        actionType: input.actionType,
        merchantId: input.merchantId,
        amount: input.amount,
        expiresAt,
      },
      mode
    );

    return {
      requestId,
      paramsHash,
      expiresAt,
      status: "PENDING",
    };
  }

  /**
   * Verifies parameters against hash, checks expiry, and records human decision
   */
  public async reviewRequest(
    requestId: string,
    decision: "APPROVED" | "REJECTED",
    reviewerId: string,
    verificationParams: {
      actionType: string;
      merchantId: string;
      amount: number;
      params: Record<string, unknown>;
      policyVersion: string;
    },
    mode: "LIVE" | "DEMO" = "DEMO"
  ) {
    const existing = await dbRepo.getApprovalRequest(requestId, mode);
    if (!existing) {
      return {
        success: false,
        error: "APPROVAL_NOT_FOUND",
        message: `Approval request ${requestId} does not exist in mode ${mode}.`,
      };
    }

    if (existing.status !== "PENDING") {
      return {
        success: false,
        error: "ALREADY_RESOLVED",
        message: `Approval request is already in status: ${existing.status}.`,
      };
    }

    // Check expiry
    if (new Date() > new Date(existing.expires_at)) {
      await dbRepo.updateApprovalStatus(requestId, "EXPIRED", reviewerId, mode);
      return {
        success: false,
        error: "APPROVAL_EXPIRED",
        message: "The approval window for this action has elapsed. Fail-closed rejection.",
      };
    }

    // Tamper detection: recompute hash over current params and compare with stored hash
    const currentHash = this.computeParamsHash(
      verificationParams.actionType,
      verificationParams.merchantId,
      verificationParams.amount,
      verificationParams.params,
      verificationParams.policyVersion
    );

    if (currentHash !== existing.params_hash) {
      await dbRepo.updateApprovalStatus(requestId, "REJECTED", reviewerId, mode);
      await dbRepo.recordAuditEvent({
        actor: reviewerId,
        action: "APPROVAL_TAMPER_DETECTED",
        resource_id: requestId,
        mode,
        details: {
          expectedHash: existing.params_hash,
          computedHash: currentHash,
          verificationParams,
        },
      });

      return {
        success: false,
        error: "TAMPERING_DETECTED",
        message: "Cryptographic signature mismatch! Action parameters were altered after approval creation.",
      };
    }

    // Update status to APPROVED or REJECTED
    await dbRepo.updateApprovalStatus(requestId, decision, reviewerId, mode);
    await dbRepo.recordAuditEvent({
      actor: reviewerId,
      action: `APPROVAL_${decision}`,
      resource_id: requestId,
      mode,
      details: { decision, reviewerId },
    });

    eventStream.broadcast(
      `APPROVAL_${decision}`,
      {
        requestId,
        decision,
        reviewerId,
        actionType: existing.action_type,
        merchantId: existing.merchant_id,
      },
      mode
    );

    return {
      success: true,
      requestId,
      status: decision,
      message: `Approval request successfully ${decision.toLowerCase()} by ${reviewerId}.`,
    };
  }
}

export const approvalService = new ApprovalService();
