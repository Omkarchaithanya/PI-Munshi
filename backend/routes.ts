/**
 * Pi Munshi Backend Router
 * Routes incoming HTTP requests to domain controllers.
 */

import { handleCalculateMdr } from "./controllers/settlement.controller.ts";
import { handleVcgMenu } from "./controllers/vcg.controller.ts";
import { handleOkfEvaluate } from "./controllers/okf.controller.ts";
import { handleBrainCycle } from "./controllers/brain.controller.ts";
import { handleGetWal, handleGetCanary } from "./controllers/governance.controller.ts";

export async function dispatchApiRoute(path: string, method: string, body: any): Promise<{ status: number; body: any }> {
  const normPath = path.replace(/\/$/, "");

  if (method === "GET" && (normPath === "/api/v1/health" || normPath === "/health")) {
    return {
      status: 200,
      body: {
        status: "UP",
        service: "Pi Munshi Backend Gateway",
        rbiCompliant: true,
        okfVersion: "0.2.0",
        timestamp: new Date().toISOString(),
      },
    };
  }

  if (method === "POST" && normPath === "/api/v1/settlement/calculate") {
    const res = handleCalculateMdr(body);
    return { status: res.success ? 200 : 400, body: res };
  }

  if (method === "POST" && normPath === "/api/v1/vcg/menu") {
    const res = handleVcgMenu(body);
    return { status: res.success ? 200 : 400, body: res };
  }

  if (method === "POST" && normPath === "/api/v1/okf/evaluate") {
    const res = handleOkfEvaluate(body);
    return { status: res.success ? 200 : 400, body: res };
  }

  if (method === "POST" && normPath === "/api/v1/brain/cycle") {
    const res = await handleBrainCycle(body);
    return { status: res.success ? 200 : 400, body: res };
  }

  if (method === "GET" && normPath === "/api/v1/governance/wal") {
    const res = handleGetWal();
    return { status: 200, body: res };
  }

  if (method === "GET" && normPath === "/api/v1/governance/canary") {
    const res = handleGetCanary();
    return { status: 200, body: res };
  }

  return {
    status: 404,
    body: {
      success: false,
      error: `Route not found: ${method} ${path}`,
      availableRoutes: [
        "POST /api/v1/settlement/calculate",
        "POST /api/v1/vcg/menu",
        "POST /api/v1/okf/evaluate",
        "POST /api/v1/brain/cycle",
        "GET  /api/v1/governance/wal",
        "GET  /api/v1/governance/canary",
        "GET  /api/v1/health",
      ],
    },
  };
}
