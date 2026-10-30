/**
 * Pi Munshi Backend Paytm Gateway Controller
 * Handles real transaction initiation, refund dispatch, and credential status verification.
 */

import { paytmGateway, type PaytmInitiateTxnRequest, type PaytmRefundRequest } from "../services/paytm-gateway.service.ts";
import type { ApiResponse } from "../types.ts";

export async function handlePaytmInitiate(body: PaytmInitiateTxnRequest): Promise<ApiResponse<any>> {
  try {
    const data = await paytmGateway.initiateTransaction(body);
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data,
      attestationSignature: data.signature,
    };
  } catch (err: any) {
    return {
      success: false,
      timestamp: new Date().toISOString(),
      error: err?.message || "Failed to initiate Paytm transaction",
    };
  }
}

export async function handlePaytmRefund(body: PaytmRefundRequest): Promise<ApiResponse<any>> {
  try {
    const data = await paytmGateway.applyRefund(body);
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data,
      attestationSignature: data.signature,
    };
  } catch (err: any) {
    return {
      success: false,
      timestamp: new Date().toISOString(),
      error: err?.message || "Failed to apply Paytm refund",
    };
  }
}

export function handlePaytmCredentialsStatus(): ApiResponse<any> {
  const status = paytmGateway.testCredentials();
  return {
    success: true,
    timestamp: new Date().toISOString(),
    data: status,
    attestationSignature: status.testChecksum,
  };
}
