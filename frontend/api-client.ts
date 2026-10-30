/**
 * Pi Munshi Frontend API Client
 * Connects the Paytm UI directly to the real backend services and endpoints.
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
  ApiResponse,
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
}

export const munshiApi = MunshiApiClient.getInstance();

