/**
 * Pi Munshi Backend Settlement Controller
 */

import { mdrCalculator } from "../services/mdr-calculator.service.ts";
import type { ApiResponse, MdrCalculationRequest, MdrCalculationResponse } from "../types.ts";

export function handleCalculateMdr(body: MdrCalculationRequest): ApiResponse<MdrCalculationResponse> {
  try {
    const data = mdrCalculator.calculate(body);
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data,
      attestationSignature: data.hmacSha256,
    };
  } catch (err: any) {
    return {
      success: false,
      timestamp: new Date().toISOString(),
      error: err?.message || "Failed to calculate MDR settlement",
    };
  }
}
