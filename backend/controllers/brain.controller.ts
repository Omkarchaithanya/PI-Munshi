/**
 * Pi Munshi Backend Brain Controller
 */

import { brainOrchestrator } from "../services/brain-orchestrator.service.ts";
import type { ApiResponse, BrainCycleRequest, BrainCycleResponse } from "../types.ts";

export async function handleBrainCycle(body: BrainCycleRequest): Promise<ApiResponse<BrainCycleResponse>> {
  try {
    const data = await brainOrchestrator.runCycle(body);
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data,
    };
  } catch (err: any) {
    return {
      success: false,
      timestamp: new Date().toISOString(),
      error: err?.message || "Failed to execute brain cycle",
    };
  }
}
