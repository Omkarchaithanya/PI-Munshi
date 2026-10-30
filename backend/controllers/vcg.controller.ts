/**
 * Pi Munshi Backend VCG Controller
 */

import { vcgMechanism } from "../services/vcg-mechanism.service.ts";
import type { ApiResponse, VcgMenuRequest, VcgMenuResponse } from "../types.ts";

export function handleVcgMenu(body: VcgMenuRequest): ApiResponse<VcgMenuResponse> {
  try {
    const data = vcgMechanism.solve(body);
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data,
    };
  } catch (err: any) {
    return {
      success: false,
      timestamp: new Date().toISOString(),
      error: err?.message || "Failed to solve VCG contract menu",
    };
  }
}
