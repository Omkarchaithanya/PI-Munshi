import { dbRepo, getDb } from "../database/db.ts";
import { eventStream } from "./event-stream.service.ts";
import { computeRealSettlement } from "./settlement.service.ts";

export class MemoryHandoffService {
  /**
   * Append a structured contextual interaction event to merchant memory stream
   */
  async recordMerchantMemory(
    merchantId: string,
    topic: string,
    summary: string,
    sentiment: "POSITIVE" | "NEUTRAL" | "CONCERNED" | "CRITICAL" = "NEUTRAL",
    mode: "LIVE" | "DEMO" = "DEMO"
  ) {
    const memoryId = `MEM_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const db = await getDb();
    await db.query(
      `INSERT INTO merchant_memory_events (memory_id, mode, merchant_id, topic, summary, sentiment)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [memoryId, mode, merchantId, topic, summary, sentiment]
    );

    return {
      memoryId,
      merchantId,
      topic,
      summary,
      sentiment,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Fetch complete contextual memory briefing for an FSE before merchant visit
   */
  async getMerchantMemory(merchantId: string, mode: "LIVE" | "DEMO" = "DEMO") {
    const db = await getDb();
    const rows = await db.query(
      `SELECT * FROM merchant_memory_events WHERE merchant_id = $1 AND mode = $2 ORDER BY created_at DESC LIMIT 20`,
      [merchantId, mode]
    );
    return rows;
  }

  /**
   * Safe FSE Territory Handoff: transfers merchant assignments with zero context loss
   */
  async initiateFseHandoff(
    merchantId: string,
    fromFseId: string,
    toFseId: string,
    contextSummary: string,
    mode: "LIVE" | "DEMO" = "DEMO"
  ) {
    const handoffId = `HND_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const db = await getDb();

    // 1. Insert handoff record
    await db.query(
      `INSERT INTO fse_handoff_records (handoff_id, mode, merchant_id, from_fse_id, to_fse_id, context_summary, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'PENDING')`,
      [handoffId, mode, merchantId, fromFseId, toFseId, contextSummary]
    );

    // 2. Add memory event
    await this.recordMerchantMemory(
      merchantId,
      "FSE_HANDOFF_INITIATED",
      `Territory reassigned from FSE ${fromFseId} to ${toFseId}. Handoff Context: ${contextSummary}`,
      "NEUTRAL",
      mode
    );

    eventStream.broadcast(
      "FSE_HANDOFF_INITIATED",
      { handoffId, merchantId, fromFseId, toFseId },
      mode
    );

    return {
      handoffId,
      merchantId,
      fromFseId,
      toFseId,
      status: "PENDING",
    };
  }

  /**
   * Accept Handoff by incoming FSE
   */
  async acceptFseHandoff(handoffId: string, toFseId: string, mode: "LIVE" | "DEMO" = "DEMO") {
    const db = await getDb();
    const rows = await db.query(
      `SELECT * FROM fse_handoff_records WHERE handoff_id = $1 AND mode = $2`,
      [handoffId, mode]
    );

    if (rows.length === 0) {
      throw new Error(`Handoff record ${handoffId} not found.`);
    }

    const handoff = rows[0];
    if (handoff.to_fse_id !== toFseId) {
      throw new Error(`Unauthorized: Handoff designated for ${handoff.to_fse_id}, not ${toFseId}.`);
    }

    // Update handoff status
    await db.query(
      `UPDATE fse_handoff_records SET status = 'ACCEPTED' WHERE handoff_id = $1`,
      [handoffId]
    );

    // Update assignment
    await db.query(
      `UPDATE merchant_fse_assignments
       SET fse_id = $1, assigned_at = NOW()
       WHERE merchant_id = $2 AND mode = $3`,
      [toFseId, handoff.merchant_id, mode]
    );

    await dbRepo.recordAuditEvent({
      actor: toFseId,
      action: "FSE_HANDOFF_ACCEPTED",
      resource_id: handoffId,
      mode,
      details: { merchantId: handoff.merchant_id },
    });

    return {
      success: true,
      handoffId,
      merchantId: handoff.merchant_id,
      assignedTo: toFseId,
      status: "ACCEPTED",
    };
  }

  /**
   * Nightly Reconciliation & Consolidation Engine
   * Pulls all unsettled transactions for a merchant, calculates deterministic MDR fees,
   * generates official settlement record with UTR, and marks transactions settled.
   */
  async nightlyConsolidation(merchantId: string, mode: "LIVE" | "DEMO" = "DEMO") {
    const db = await getDb();
    const pendingTxns = await db.query(
      `SELECT * FROM transactions WHERE merchant_id = $1 AND mode = $2 AND settlement_status = 'PENDING' AND status = 'SUCCESS'`,
      [merchantId, mode]
    );

    if (pendingTxns.length === 0) {
      return {
        merchantId,
        settledCount: 0,
        totalSettled: 0,
        netPayout: 0,
        message: "No pending transactions to settle.",
      };
    }

    let totalAmount = 0;
    for (const txn of pendingTxns) {
      totalAmount += Number(txn.amount);
    }

    // Compute deterministic settlement using settlement.service
    const settlementCalc = computeRealSettlement({ orderAmount: totalAmount });

    const settlementId = mode === "LIVE" ? `SETTLE_${Date.now()}` : `DEMO_SETTLE_${Date.now()}`;
    const utr = mode === "LIVE" ? settlementCalc.utr : `DEMO_${settlementCalc.utr}`;

    // Create settlement record in DB
    await dbRepo.createSettlement({
      settlement_id: settlementId,
      mode,
      merchant_id: merchantId,
      total_amount: totalAmount,
      mdr_fee: settlementCalc.finalMdrFee,
      net_payout: settlementCalc.netSettlement,
      utr,
      status: "SUCCESS",
      cycle_date: new Date().toISOString().split("T")[0],
    });

    // Mark transactions settled
    const txnIds = pendingTxns.map((t: any) => t.txn_id);
    for (const id of txnIds) {
      await db.query(
        `UPDATE transactions SET settlement_status = 'SETTLED', settlement_id = $1 WHERE txn_id = $2`,
        [settlementId, id]
      );
    }

    await dbRepo.recordAuditEvent({
      actor: "NIGHTLY_SETTLEMENT_CRON",
      action: "NIGHTLY_CONSOLIDATION_COMPLETED",
      resource_id: settlementId,
      mode,
      details: {
        totalAmount,
        netPayout: settlementCalc.netSettlement,
        settledTxnCount: txnIds.length,
      },
    });

    eventStream.broadcast(
      "SETTLEMENT_CONSOLIDATED",
      {
        settlementId,
        merchantId,
        totalAmount,
        netPayout: settlementCalc.netSettlement,
        utr,
      },
      mode
    );

    return {
      success: true,
      settlementId,
      utr,
      merchantId,
      settledCount: txnIds.length,
      totalSettled: totalAmount,
      mdrFee: settlementCalc.finalMdrFee,
      netPayout: settlementCalc.netSettlement,
    };
  }
}

export const memoryHandoffService = new MemoryHandoffService();
