/**
 * Pi Munshi Frontend API Client
 * Clean HTTP Fetch Client connecting the React UI to the Port 8082 REST Gateway.
 * Zero Node.js runtime imports (no node:crypto / node:fs) for 100% browser compatibility.
 */

/** Same-origin in dev (Vite proxy → :8082); falls back to direct port if needed. */
const BACKEND_BASE = typeof window !== "undefined" ? "" : "http://127.0.0.1:8082";

async function request<T>(endpoint: string, method: "GET" | "POST" = "GET", body?: any): Promise<T> {
  const url = `${BACKEND_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }
    return res.json();
  } catch (err: any) {
    console.warn(`[ApiClient] Outbound call to ${endpoint} failed:`, err.message);
    throw err;
  }
}

export class MunshiApiClient {
  private static instance: MunshiApiClient;

  private constructor() {}

  public static getInstance(): MunshiApiClient {
    if (!MunshiApiClient.instance) {
      MunshiApiClient.instance = new MunshiApiClient();
    }
    return MunshiApiClient.instance;
  }

  public async calculateMdr(req: { orderAmount: number; paymentRail?: string; waiverOverride?: boolean }) {
    const json = await request<any>("/api/v1/settlement/calculate", "POST", req);
    return json.data;
  }

  public async getVcgMenu(req: { orderAmount: number; customerTrustScore?: number; merchantMargin?: number }) {
    const json = await request<any>("/api/v1/vcg/menu", "POST", req);
    return json.data;
  }

  public async evaluateOkf(req: { policyId: string; orderAmount?: number }) {
    const json = await request<any>("/api/v1/okf/evaluate", "POST", req);
    return json.data;
  }

  public async synthesizeVoice(text: string, languageCode = "hi-IN", mode = "DEMO") {
    const json = await request<any>("/api/v1/voice/synthesize", "POST", { text, languageCode, mode });
    return json.data;
  }

  public async runBrainCycle(req: { query: string; merchantId: string; language?: string }) {
    const json = await request<any>("/api/v1/brain/cycle", "POST", req);
    return json.data;
  }

  public async getWal() {
    const json = await request<any>("/api/v1/governance/wal", "GET");
    return json.data || [];
  }

  public async getCanaryStatus() {
    const json = await request<any>("/api/v1/governance/canary", "GET");
    return json.data;
  }

  public async getProviderStatus() {
    const json = await request<any>("/api/v1/providers/status", "GET");
    return json.providers;
  }

  public async transcribeVoice(audioBase64: string, languageCode = "hi-IN") {
    const json = await request<any>("/api/v1/voice/transcribe", "POST", {
      audioBase64,
      languageCode,
      mimeType: "audio/wav",
      mode: "LIVE",
    });
    return json.data as { transcript?: string; isDemo?: boolean; error?: string };
  }

  public async getSystemHealth(): Promise<{
    status: string;
    database?: { ok: boolean; engine: string; error: string | null };
  }> {
    return request("/api/v1/health");
  }

  public async getTransactions(merchantId = "DEMO_MERCHANT_RAMESH", mode = "DEMO"): Promise<any[]> {
    try {
      const json = await request<any>(`/api/v1/transactions?merchantId=${merchantId}&mode=${mode}`, "GET");
      return json.data || [];
    } catch {
      // Fallback records
      return [
        { txn_id: "DEMO_TXN_001", amount: 450, status: "SUCCESS", payer_vpa: "customer1@paytm", settlement_status: "SETTLED", created_at: new Date().toISOString() },
        { txn_id: "DEMO_TXN_002", amount: 1200, status: "SUCCESS", payer_vpa: "customer2@okhdfcbank", settlement_status: "SETTLED", created_at: new Date().toISOString() },
        { txn_id: "DEMO_TXN_003", amount: 500, status: "SUCCESS", payer_vpa: "customer3@paytm", settlement_status: "PENDING", created_at: new Date().toISOString() },
      ];
    }
  }

  public async initiateTransaction(orderId: string, amount: number, merchantId = "DEMO_MERCHANT_RAMESH", mode = "DEMO") {
    return request<any>("/api/v1/transactions/initiate", "POST", { orderId, amount, merchantId, mode });
  }

  public async getSettlements(merchantId = "DEMO_MERCHANT_RAMESH", mode = "DEMO"): Promise<any[]> {
    try {
      const json = await request<any>(`/api/v1/settlements?merchantId=${merchantId}&mode=${mode}`, "GET");
      return json.data || [];
    } catch {
      return [
        { settlement_id: "DEMO_SETTLE_001", total_amount: 1650, net_payout: 1650, utr: "629984129984", status: "SUCCESS" },
      ];
    }
  }

  public async consolidateSettlement(merchantId = "DEMO_MERCHANT_RAMESH", mode = "DEMO") {
    return request<any>("/api/v1/settlements/consolidate", "POST", { merchantId, mode });
  }

  public async getDisputes(merchantId = "DEMO_MERCHANT_RAMESH", mode = "DEMO"): Promise<any[]> {
    try {
      const json = await request<any>(`/api/v1/disputes?merchantId=${merchantId}&mode=${mode}`, "GET");
      return json.data || [];
    } catch {
      return [
        { dispute_id: "DEMO_DISP_001", txn_id: "DEMO_TXN_002", amount: 1200, reason: "Customer claims amount debited twice", status: "UNDER_REVIEW" },
      ];
    }
  }

  public async updateDispute(disputeId: string, action: string, resolutionNotes: string, mode = "DEMO") {
    return request<any>("/api/v1/disputes/action", "POST", { disputeId, action, resolutionNotes, mode });
  }

  public async getSoundboxStatus(deviceId = "DEMO_SB_RAMESH", mode = "DEMO") {
    try {
      const json = await request<any>(`/api/v1/soundbox/status?deviceId=${deviceId}&mode=${mode}`, "GET");
      return json.data;
    } catch {
      return { device_id: deviceId, battery_level: 88, status: "ONLINE", firmware_version: "v4.2.1-prod" };
    }
  }

  public async triggerSoundboxChime(amount: number, language = "hi", deviceId = "DEMO_SB_RAMESH", mode = "DEMO") {
    return request<any>("/api/v1/soundbox/chime", "POST", { deviceId, amount, language, mode });
  }

  public async getMemories(merchantId = "DEMO_MERCHANT_RAMESH", mode = "DEMO"): Promise<any[]> {
    try {
      const json = await request<any>(`/api/v1/memory/${merchantId}?mode=${mode}`, "GET");
      return json.data || [];
    } catch {
      return [
        { memory_id: "MEM_01", topic: "MERCHANT_PROFILE", summary: "रमेश जी शाम 6 से 9 बजे व्यस्त रहते हैं। हिंदी वॉइस अलर्ट पसंद करते हैं।" },
      ];
    }
  }

  public async initiateHandoff(fromFseId: string, toFseId: string, contextSummary: string, merchantId = "DEMO_MERCHANT_RAMESH", mode = "DEMO") {
    return request<any>("/api/v1/handoff/initiate", "POST", { merchantId, fromFseId, toFseId, contextSummary, mode });
  }
}

export const munshiApi = MunshiApiClient.getInstance();
