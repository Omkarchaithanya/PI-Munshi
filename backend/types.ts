/**
 * Pi Munshi Backend Domain Types
 * Paytm Build for India AI Hackathon (Track 3: Autonomous AI Teammates)
 */

export type ApiResponse<T> = {
  success: boolean;
  timestamp: string;
  data?: T;
  error?: string;
  attestationSignature?: string;
};

export type MdrCalculationRequest = {
  orderAmount: number;
  paymentRail?: "UPI" | "RUPAY_CREDIT" | "WALLET" | "CARD";
  waiverOverride?: boolean;
};

export type MdrCalculationResponse = {
  orderAmount: number;
  threshold: number;
  mdrRatePercent: number;
  rawMdrFee: number;
  waiverApplied: boolean;
  waiverAmount: number;
  finalMdrFee: number;
  netSettlement: number;
  utr: string;
  orderId: string;
  timestamp: string;
  hmacSha256: string;
  swarMudraPayload: string;
  rbiCapVerified: boolean;
};

export type VcgMenuRequest = {
  orderAmount: number;
  customerTrustScore?: number;
  merchantMargin?: number;
};

export type VcgMenuResponse = {
  orderAmount: number;
  customerTrustScore: number;
  merchantMargin: number;
  contractA: {
    title: string;
    description: string;
    upfrontQrInr: number;
    autoPayMandateInr: number;
    tenureDays: number;
  };
  contractB: {
    title: string;
    description: string;
    voucherAmountInr: number;
    bonusPercent: number;
    retainedGmvPercent: number;
  };
  contractC: {
    title: string;
    description: string;
    reversalInr: number;
    arnNumber: string;
  };
};

export type OkfEvaluateRequest = {
  policyId: string;
  orderAmount?: number;
  disputeId?: string;
  hoursElapsed?: number;
};

export type OkfEvaluateResponse = {
  policyId: string;
  version: string;
  allowed: boolean;
  trustTier: string;
  provenance: {
    author: string;
    authority: string;
    reference: string;
  };
  freshness: {
    validFrom: string;
    validUntil: string;
    isStale: boolean;
  };
  lifecycle: string;
  attestationHash: string;
  cragScore: number;
  cragVerdict: "HIGH_CONFIDENCE_AUTHORITATIVE" | "AMBIGUOUS_POLICY_REVIEW" | "REJECTED_STALE_POLICY" | "REJECTED_MISSING_POLICY" | "REJECTED_INACTIVE_POLICY";
  resultMessage: string;
};

export type BrainCycleRequest = {
  query: string;
  merchantId: string;
  orderAmount?: number;
  language?: "hi-IN" | "kn-IN" | "en-IN";
  model?: string;
};

export type BrainCycleResponse = {
  cycleId: string;
  timestamp: string;
  rung: 1 | 2 | 3;
  intent: string;
  estimatedLatencyMs: number;
  tokenBudget: number;
  synthesizedCode: string;
  executionOutput: any;
  fsmShieldPassed: boolean;
  canaryPassed: boolean;
  voiceReadout: string;
  decision: "APPROVED_FOR_AUTO_EXECUTION" | "FSE_HUMAN_IN_THE_LOOP_REQUIRED";
  thoughtChain?: Array<{
    step: string;
    title: string;
    detail: string;
    status: "done" | "in_progress" | "verified";
  }>;
};

export type WalEntry = {
  id: string;
  action: string;
  status: "PRE_COMMITTED" | "EXECUTED" | "BLOCKED" | "RECONCILED";
  level: number;
  idempotencyKey: string;
  amount: number;
  timestamp: string;
  note: string;
};

