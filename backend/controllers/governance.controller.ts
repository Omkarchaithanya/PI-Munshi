/**
 * Pi Munshi Backend Governance Controller (WAL & Canary)
 */

import { walLedger } from "../services/wal-ledger.service.ts";
import { canaryMonitor } from "../services/canary-monitor.service.ts";
import type { ApiResponse, WalEntry } from "../types.ts";

export function handleGetWal(): ApiResponse<WalEntry[]> {
  return {
    success: true,
    timestamp: new Date().toISOString(),
    data: walLedger.getEntries(),
  };
}

export function handleGetCanary(): ApiResponse<any> {
  return {
    success: true,
    timestamp: new Date().toISOString(),
    data: canaryMonitor.getStatus(),
  };
}
