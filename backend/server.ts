/**
 * Pi Munshi Standalone Backend HTTP API Server
 * Listens on port 8082 (or PORT env) to provide REST endpoints for all frontend and external consumers.
 */

import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { dispatchApiRoute } from "./routes.ts";
import { eventStream } from "./services/event-stream.service.ts";

const PORT = parseInt(process.env.BACKEND_PORT || "8082", 10);

export function startBackendServer(port: number = PORT) {
  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    // Enable CORS for frontend integration
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Idempotency-Key");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    const pathname = url.pathname;
    const method = req.method || "GET";

    // Server-Sent Events (SSE) real-time streaming endpoint
    if (method === "GET" && pathname === "/api/v1/events/stream") {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      });
      res.write(`data: ${JSON.stringify({ type: "STREAM_CONNECTED", timestamp: new Date().toISOString() })}\n\n`);

      const unsubscribe = eventStream.subscribe((event) => {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
      });

      const pingTimer = setInterval(() => {
        res.write(": ping\n\n");
      }, 15000);

      req.on("close", () => {
        clearInterval(pingTimer);
        unsubscribe();
      });
      return;
    }

    let body: any = {};
    if (method === "POST" || method === "PUT") {
      try {
        const buffers: Buffer[] = [];
        for await (const chunk of req) {
          buffers.push(chunk);
        }
        const rawBody = Buffer.concat(buffers).toString("utf-8");
        if (rawBody.trim()) {
          body = JSON.parse(rawBody);
        }
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Malformed JSON payload" }));
        return;
      }
    }

    const response = await dispatchApiRoute(pathname, method, body);
    res.writeHead(response.status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response.body, null, 2));
  });

  server.listen(port, "0.0.0.0", () => {
    console.log(`[Pi Munshi Backend] Running on http://0.0.0.0:${port}/`);
    console.log(`[Pi Munshi Backend] Health Check: http://0.0.0.0:${port}/api/v1/health`);
  });

  return server;
}

// Auto-start if invoked directly
if (process.argv[1]?.includes("server.ts") || process.argv[1]?.includes("server.js")) {
  startBackendServer();
}
