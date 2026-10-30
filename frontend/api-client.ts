/**
 * Pi Munshi Frontend API Client
 * Connects the Paytm UI directly to the real backend services and database.
 */

import { dispatchApiRoute } from "../backend/routes.ts";
import type {
  MdrCalculationRequest,
  MdrCalculationResponse,
  VcgMenuRequest,
  VcgMenuResponse,
  OkfEvaluateRequest,
  OkfEvaluateResponse,
  BrainCycleRequest,
  BrainCycleResponse,
  WalEntry,
} from "../backend/types.ts";

export class MunshiApiClient {
  private static instance: MunshiApiClient;

  private constructor() {}

  public static getInstance(): MunshiApiClient {
    if (!MunshiApiClient.instance) {
      MunshiApiClient.instance = new MunshiApiClient();
    }
    return MunshiApiClient.instance;
  }

  public async calculateMdr(req: MdrCalculationRequest): Promise<MdrCalculationResponse> {
    const res = await dispatchApiRoute("/api/v1/settlement/calculate", "POST", req);
    if (!res.body.success) throw new Error(res.body.error || "Failed to calculate MDR");
    return res.body.data;
  }

  public async getVcgMenu(req: VcgMenuRequest): Promise<VcgMenuResponse> {
    const res = await dispatchApiRoute("/api/v1/vcg/menu", "POST", req);
    if (!res.body.success) throw new Error(res.body.error || "Failed to get VCG menu");
    return res.body.data;
  }

  public async evaluateOkf(req: OkfEvaluateRequest): Promise<OkfEvaluateResponse> {
    const res = await dispatchApiRoute("/api/v1/okf/evaluate", "POST", req);
    if (!res.body.success) throw new Error(res.body.error || "Failed to evaluate OKF policy");
    return res.body.data;
  }

  public async runBrainCycle(req: BrainCycleRequest): Promise<BrainCycleResponse> {
    const res = await dispatchApiRoute("/api/v1/brain/cycle", "POST", req);
    if (!res.body.success) throw new Error(res.body.error || "Failed to run brain cycle");
    return res.body.data;
  }

  public async getWal(): Promise<WalEntry[]> {
    const res = await dispatchApiRoute("/api/v1/governance/wal", "GET", {});
    return res.body.data || [];
  }

  public async getCanaryStatus(): Promise<any> {
    const res = await dispatchApiRoute("/api/v1/governance/canary", "GET", {});
    return res.body.data;
  }

  public async getProviderStatus(): Promise<any> {
    const res = await dispatchApiRoute("/api/v1/providers/status", "GET", {});
    return res.body.providers;
  }

  public async getTransactions(merchantId = "DEMO_MERCHANT_RAMESH", mode = "DEMO"): Promise<any[]> {
    const res = await dispatchApiRoute(`/api/v1/transactions?merchantId=${merchantId}&mode=${mode}`, "GET", {});
    return res.body.data || [];
  }

  public async initiateTransaction(orderId: string, amount: number, merchantId = "DEMO_MERCHANT_RAMESH", mode = "DEMO"): Promise<any> {
    const res = await dispatchApiRoute("/api/v1/transactions/initiate", "POST", { orderId, amount, merchantId, mode });
    return res.body;
  }

  public async getSettlements(merchantId = "DEMO_MERCHANT_RAMESH", mode = "DEMO"): Promise<any[]> {
    const res = await dispatchApiRoute(`/api/v1/settlements?merchantId=${merchantId}&mode=${mode}`, "GET", {});
    return res.body.data || [];
  }

  public async consolidateSettlement(merchantId = "DEMO_MERCHANT_RAMESH", mode = "DEMO"): Promise<any> {
    const res = await dispatchApiRoute("/api/v1/settlements/consolidate", "POST", { merchantId, mode });
    return res.body;
  }

  public async getDisputes(merchantId = "DEMO_MERCHANT_RAMESH", mode = "DEMO"): Promise<any[]> {
    const res = await dispatchApiRoute(`/api/v1/disputes?merchantId=${merchantId}&mode=${mode}`, "GET", {});
    return res.body.data || [];
  }

  public async updateDispute(disputeId: string, action: string, resolutionNotes: string, mode = "DEMO"): Promise<any> {
    const res = await dispatchApiRoute("/api/v1/disputes/action", "POST", { disputeId, action, resolutionNotes, mode });
    return res.body;
  }

  public async getSoundboxStatus(deviceId = "DEMO_SB_RAMESH", mode = "DEMO"): Promise<any> {
    const res = await dispatchApiRoute(`/api/v1/soundbox/status?deviceId=${deviceId}&mode=${mode}`, "GET", {});
    return res.body.data;
  }

  public async triggerSoundboxChime(amount: number, language = "hi", deviceId = "DEMO_SB_RAMESH", mode = "DEMO"): Promise<any> {
    const res = await dispatchApiRoute("/api/v1/soundbox/chime", "POST", { deviceId, amount, language, mode });
    return res.body;
  }

  public async getMemories(merchantId = "DEMO_MERCHANT_RAMESH", mode = "DEMO"): Promise<any[]> {
    const res = await dispatchApiRoute(`/api/v1/memory/${merchantId}?mode=${mode}`, "GET", {});
    return res.body.data || [];
  }

  public async initiateHandoff(fromFseId: string, toFseId: string, contextSummary: string, merchantId = "DEMO_MERCHANT_RAMESH", mode = "DEMO"): Promise<any> {
    const res = await dispatchApiRoute("/api/v1/handoff/initiate", "POST", { merchantId, fromFseId, toFseId, contextSummary, mode });
    return res.body;
  }
}

export const munshiApi = MunshiApiClient.getInstance();
