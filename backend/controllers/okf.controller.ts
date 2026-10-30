/**
 * Pi Munshi Backend OKF Controller
 */

import { okfKnowledge } from "../services/okf-knowledge.service.ts";
import type { ApiResponse, OkfEvaluateRequest, OkfEvaluateResponse } from "../types.ts";

export function handleOkfEvaluate(body: OkfEvaluateRequest): ApiResponse<OkfEvaluateResponse> {
  try {
    const data = okfKnowledge.evaluatePolicy(body);
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data,
      attestationSignature: data.attestationHash,
    };
  } catch (err: any) {
    return {
      success: false,
      timestamp: new Date().toISOString(),
      error: err?.message || "Failed to evaluate OKF policy",
    };
  }
}
