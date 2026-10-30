export interface ProviderStatus {
  provider: "paytm" | "sarvam" | "soundbox";
  mode: "LIVE" | "DEMO";
  status: "CONNECTED" | "SANDBOX" | "VIRTUAL_SIMULATOR" | "NOT_CONFIGURED" | "OFFLINE";
  latencyMs: number;
  details?: Record<string, unknown>;
}

export interface PaymentInitiateRequest {
  orderId: string;
  merchantId: string;
  amount: number;
  customerVpa?: string;
  currency?: string;
}

export interface PaymentInitiateResponse {
  success: boolean;
  orderId: string;
  txnId: string;
  status: "SUCCESS" | "PENDING" | "FAILED";
  qrData?: string;
  gatewayResponse?: any;
  mode: "LIVE" | "DEMO";
  isDemo: boolean;
  message: string;
}

export interface IPaytmAdapter {
  initiatePayment(req: PaymentInitiateRequest, mode: "LIVE" | "DEMO"): Promise<PaymentInitiateResponse>;
  checkPaymentStatus(orderId: string, mode: "LIVE" | "DEMO"): Promise<any>;
  applyRefund(txnId: string, refundAmount: number, reason: string, mode: "LIVE" | "DEMO"): Promise<any>;
  getConnectionStatus(): Promise<ProviderStatus>;
}

export interface ISarvamAdapter {
  transcribe(audioBuffer: Buffer | Uint8Array, languageCode?: string, mode?: "LIVE" | "DEMO"): Promise<{
    transcript: string;
    languageCode: string;
    confidence: number;
    isDemo: boolean;
  }>;
  synthesize(text: string, languageCode?: string, mode?: "LIVE" | "DEMO"): Promise<{
    audioBase64?: string;
    text: string;
    languageCode: string;
    isDemo: boolean;
  }>;
  translate(text: string, sourceLang: string, targetLang: string, mode?: "LIVE" | "DEMO"): Promise<{
    translatedText: string;
    sourceLang: string;
    targetLang: string;
    isDemo: boolean;
  }>;
  getConnectionStatus(): Promise<ProviderStatus>;
}

export interface ISoundboxAdapter {
  sendChime(deviceId: string, amount: number, language: string, mode: "LIVE" | "DEMO"): Promise<{
    success: boolean;
    deviceId: string;
    chimeType: string;
    mode: "LIVE" | "DEMO";
    isDemo: boolean;
    audioChimeUrl?: string;
  }>;
  pollHeartbeat(deviceId: string, mode: "LIVE" | "DEMO"): Promise<{
    deviceId: string;
    batteryLevel: number;
    status: "ONLINE" | "OFFLINE" | "LOW_BATTERY";
    firmwareVersion: string;
    lastHeartbeat: string;
    mode: "LIVE" | "DEMO";
  }>;
  getConnectionStatus(): Promise<ProviderStatus>;
}
