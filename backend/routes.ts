/**
 * Pi Munshi Backend Router
 * Routes incoming HTTP requests to domain controllers and persistent DB/Adapters.
 */

import { handleCalculateMdr } from "./controllers/settlement.controller.ts";
import { handleVcgMenu } from "./controllers/vcg.controller.ts";
import { handleOkfEvaluate } from "./controllers/okf.controller.ts";
import { handleBrainCycle } from "./controllers/brain.controller.ts";
import { handleGetWal, handleGetCanary } from "./controllers/governance.controller.ts";
import { handlePaytmInitiate, handlePaytmRefund, handlePaytmCredentialsStatus } from "./controllers/paytm.controller.ts";
import { paytmAdapter } from "./adapters/paytm.adapter.ts";
import { sarvamAdapter } from "./adapters/sarvam.adapter.ts";
import { soundboxAdapter } from "./adapters/soundbox.adapter.ts";
import { dbRepo } from "./database/db.ts";
import { approvalService } from "./services/approval.service.ts";
import { memoryHandoffService } from "./services/memory-handoff.service.ts";
import { eventStream } from "./services/event-stream.service.ts";
import { configuredDatabaseUrl, getDb } from "./database/db.ts";
import { samadhanSkill, surakshaSkill, vriddhiSkill, sancharSkill } from "./skills/index.ts";

export async function dispatchApiRoute(
  path: string,
  method: string,
  body: any = {}
): Promise<{ status: number; body: any }> {
  const [pathname, queryString] = path.split("?");
  const normPath = pathname.replace(/\/$/, "");
  const searchParams = new URLSearchParams(queryString || "");
  const mode = (searchParams.get("mode") || body?.mode || "DEMO") as "LIVE" | "DEMO";

  // 1. Health & Discovery
  if (method === "GET" && (normPath === "/api/v1/health" || normPath === "/health")) {
    let database: { ok: boolean; engine: string; error: string | null } = {
      ok: false,
      engine: configuredDatabaseUrl() ? "postgres" : "pglite",
      error: null,
    };
    try {
      const db = await getDb();
      database = { ok: true, engine: db.type || "postgres", error: null };
    } catch (err: any) {
      const raw = String(err?.message || "database unreachable");
      database = {
        ok: false,
        engine: configuredDatabaseUrl() ? "postgres" : "pglite",
        error: raw.replace(/postgres(?:ql)?:\/\/\S+/gi, "postgresql://…"),
      };
    }
    return {
      status: 200,
      body: {
        status: database.ok ? "UP" : "DEGRADED",
        service: "Pi Munshi Backend Gateway",
        rbiCompliant: true,
        okfVersion: "0.2.0",
        activeSseClients: eventStream.getClientCount(),
        database,
        timestamp: new Date().toISOString(),
      },
    };
  }

  // 2. Integration Health & Provider Status
  if (method === "GET" && normPath === "/api/v1/providers/status") {
    const paytmStatus = await paytmAdapter.getConnectionStatus();
    const sarvamStatus = await sarvamAdapter.getConnectionStatus();
    const soundboxStatus = await soundboxAdapter.getConnectionStatus();

    return {
      status: 200,
      body: {
        success: true,
        mode,
        providers: {
          paytm: paytmStatus,
          sarvam: sarvamStatus,
          soundbox: soundboxStatus,
        },
        timestamp: new Date().toISOString(),
      },
    };
  }

  // 3. Merchants
  if (method === "GET" && normPath === "/api/v1/merchants") {
    const merchants = await dbRepo.listMerchants(mode);
    return { status: 200, body: { success: true, mode, data: merchants } };
  }

  if (method === "GET" && normPath.startsWith("/api/v1/merchants/")) {
    const merchantId = normPath.split("/").pop() || "";
    const merchant = await dbRepo.getMerchant(merchantId, mode);
    if (!merchant) {
      return { status: 404, body: { success: false, error: "Merchant not found", mode } };
    }
    return { status: 200, body: { success: true, mode, data: merchant } };
  }

  // 4. Transactions (with idempotent deduplication)
  if (method === "GET" && normPath === "/api/v1/transactions") {
    const merchantId = searchParams.get("merchantId") || body.merchantId || "DEMO_MERCHANT_RAMESH";
    const txns = await dbRepo.listTransactions(merchantId, mode);
    return { status: 200, body: { success: true, mode, merchantId, data: txns } };
  }

  if (method === "POST" && normPath === "/api/v1/transactions/initiate") {
    const res = await paytmAdapter.initiatePayment(
      {
        orderId: body.orderId || `ORD_${Date.now()}`,
        merchantId: body.merchantId || "DEMO_MERCHANT_RAMESH",
        amount: Number(body.amount || 100),
        customerVpa: body.customerVpa,
      },
      mode
    );

    eventStream.broadcast("PAYMENT_INITIATED", { orderId: res.orderId, amount: body.amount, status: res.status }, mode);
    return { status: res.success ? 200 : 400, body: res };
  }

  // 5. Settlements & Consolidation
  if (method === "GET" && normPath === "/api/v1/settlements") {
    const merchantId = searchParams.get("merchantId") || body.merchantId || "DEMO_MERCHANT_RAMESH";
    const settlements = await dbRepo.listSettlements(merchantId, mode);
    return { status: 200, body: { success: true, mode, merchantId, data: settlements } };
  }

  if (method === "POST" && normPath === "/api/v1/settlements/consolidate") {
    const merchantId = body.merchantId || "DEMO_MERCHANT_RAMESH";
    const result = await memoryHandoffService.nightlyConsolidation(merchantId, mode);
    return { status: 200, body: result };
  }

  if (method === "POST" && normPath === "/api/v1/settlement/calculate") {
    const res = handleCalculateMdr(body);
    return { status: res.success ? 200 : 400, body: res };
  }

  // 6. Disputes
  if (method === "GET" && normPath === "/api/v1/disputes") {
    const merchantId = searchParams.get("merchantId") || body.merchantId || "DEMO_MERCHANT_RAMESH";
    const disputes = await dbRepo.listDisputes(merchantId, mode);
    return { status: 200, body: { success: true, mode, merchantId, data: disputes } };
  }

  if (method === "POST" && normPath === "/api/v1/disputes/action") {
    const { disputeId, action, resolutionNotes } = body;
    let newStatus = "UNDER_REVIEW";
    if (action === "SUBMIT_EVIDENCE") newStatus = "EVIDENCE_SUBMITTED";
    if (action === "ACCEPT_CHARGEBACK") newStatus = "REFUNDED";
    if (action === "CONTEST") newStatus = "WON";

    await dbRepo.updateDispute(
      disputeId,
      {
        status: newStatus,
        evidence_submitted: action === "SUBMIT_EVIDENCE",
        resolution_notes: resolutionNotes,
      },
      mode
    );

    eventStream.broadcast("DISPUTE_UPDATED", { disputeId, action, status: newStatus }, mode);
    return { status: 200, body: { success: true, disputeId, status: newStatus, mode } };
  }

  if (method === "POST" && normPath === "/api/v1/disputes/create") {
    const { txnId, amount, reason, merchantId = "DEMO_MERCHANT_RAMESH" } = body;
    const disputeId = `DEMO_DISP_${Date.now().toString().slice(-4)}`;
    const created = await dbRepo.createDispute({
      dispute_id: disputeId,
      mode,
      merchant_id: merchantId,
      txn_id: txnId || `TXN_${Date.now()}`,
      amount: Number(amount) || 100,
      reason: reason || "Customer reported debit without credit",
      status: "UNDER_REVIEW",
      evidence_submitted: false,
      resolution_notes: "Awaiting customer bank reversal confirmation",
    });
    eventStream.broadcast("DISPUTE_CREATED", { disputeId, txnId, amount }, mode);
    return { status: 200, body: { success: true, disputeId, mode, data: created } };
  }

  // 6b. Live Database & Ledger Overview
  if (method === "GET" && normPath === "/api/v1/database/overview") {
    try {
      const db = await getDb();
      const merchants = await db.query("SELECT * FROM merchants LIMIT 10");
      const transactions = await db.query("SELECT * FROM transactions WHERE merchant_id = 'DEMO_MERCHANT_RAMESH' ORDER BY created_at DESC LIMIT 30");
      const settlements = await db.query("SELECT * FROM settlements WHERE merchant_id = 'DEMO_MERCHANT_RAMESH' ORDER BY created_at DESC LIMIT 15");
      const devices = await db.query("SELECT * FROM soundbox_devices LIMIT 5");
      const fses = await db.query("SELECT * FROM fses LIMIT 5");
      const disputes = await db.query("SELECT * FROM disputes LIMIT 10");
      const memories = await db.query("SELECT * FROM merchant_memory_events WHERE merchant_id = 'DEMO_MERCHANT_RAMESH' ORDER BY created_at DESC LIMIT 15");
      const audits = await db.query("SELECT * FROM audit_events ORDER BY created_at DESC LIMIT 15");

      const dbUrl = configuredDatabaseUrl();
      const isRender = dbUrl.includes("render.com");
      const isTimescale = Boolean(process.env.TIMESCALE_DATABASE_URL);

      return {
        status: 200,
        body: {
          success: true,
          connection: {
            engine: isRender ? "PostgreSQL (Render Oregon)" : "PostgreSQL",
            host: "dpg-dbin98nb9u1s73c02uk0-a.oregon-postgres.render.com",
            database: "what_to_put_name_pi_munshi_db",
            ssl: "require (TLS 1.3)",
            status: "CONNECTED",
            migration: "0002_pi_munshi_core.sql",
            timescaleConfigured: isTimescale,
            timescaleHost: "d3yo06ihv7afhe0983p7.tsdb.cloud.timescale.com:38298",
          },
          counts: {
            merchants: merchants.length,
            transactions: transactions.length,
            settlements: settlements.length,
            devices: devices.length,
            fses: fses.length,
            disputes: disputes.length,
            memoryEvents: memories.length,
            auditEvents: audits.length,
          },
          tables: {
            merchants,
            transactions,
            settlements,
            devices,
            fses,
            disputes,
            memories,
            audits,
          },
        },
      };
    } catch (err: any) {
      return {
        status: 500,
        body: { success: false, error: err.message },
      };
    }
  }

  // 7. Soundbox IoT & Chimes
  if (method === "GET" && normPath === "/api/v1/soundbox/status") {
    const deviceId = searchParams.get("deviceId") || body.deviceId || "DEMO_SB_RAMESH";
    const heartbeat = await soundboxAdapter.pollHeartbeat(deviceId, mode);
    return { status: 200, body: { success: true, mode, data: heartbeat } };
  }

  if (method === "POST" && normPath === "/api/v1/soundbox/chime") {
    const { deviceId = "DEMO_SB_RAMESH", amount = 100, language = "hi" } = body;
    const chimeRes = await soundboxAdapter.sendChime(deviceId, amount, language, mode);
    eventStream.broadcast("SOUNDBOX_CHIME_TRIGGERED", { deviceId, amount, language }, mode);
    return { status: chimeRes.success ? 200 : 400, body: chimeRes };
  }

  // 8. Human Approvals (Tamper-Proof)
  if (method === "POST" && normPath === "/api/v1/approvals/create") {
    const res = await approvalService.createRequest({
      actionType: body.actionType,
      merchantId: body.merchantId,
      amount: Number(body.amount || 0),
      params: body.params || {},
      policyVersion: body.policyVersion || "0.2.0",
      ttlMinutes: body.ttlMinutes,
      mode,
    });
    return { status: 200, body: { success: true, data: res } };
  }

  if (method === "POST" && normPath === "/api/v1/approvals/review") {
    const res = await approvalService.reviewRequest(
      body.requestId,
      body.decision,
      body.reviewerId || "FSE_ARUN",
      {
        actionType: body.actionType,
        merchantId: body.merchantId,
        amount: Number(body.amount || 0),
        params: body.params || {},
        policyVersion: body.policyVersion || "0.2.0",
      },
      mode
    );
    return { status: res.success ? 200 : 400, body: res };
  }

  // 9. Merchant Memory & Safe FSE Handoff
  if (method === "GET" && normPath.startsWith("/api/v1/memory/")) {
    const merchantId = normPath.split("/").pop() || "DEMO_MERCHANT_RAMESH";
    const memories = await memoryHandoffService.getMerchantMemory(merchantId, mode);
    return { status: 200, body: { success: true, mode, merchantId, data: memories } };
  }

  if (method === "POST" && normPath === "/api/v1/memory/record") {
    const res = await memoryHandoffService.recordMerchantMemory(
      body.merchantId,
      body.topic,
      body.summary,
      body.sentiment,
      mode
    );
    return { status: 200, body: { success: true, mode, data: res } };
  }

  if (method === "POST" && normPath === "/api/v1/handoff/initiate") {
    const res = await memoryHandoffService.initiateFseHandoff(
      body.merchantId,
      body.fromFseId,
      body.toFseId,
      body.contextSummary,
      mode
    );
    return { status: 200, body: { success: true, mode, data: res } };
  }

  if (method === "POST" && normPath === "/api/v1/handoff/accept") {
    const res = await memoryHandoffService.acceptFseHandoff(body.handoffId, body.toFseId, mode);
    return { status: 200, body: { success: true, mode, data: res } };
  }

  // 10. Sarvam AI Voice STT / TTS / Translate
  if (method === "POST" && normPath === "/api/v1/voice/transcribe") {
    const res = await sarvamAdapter.transcribe(
      body.audioBase64 ? Buffer.from(body.audioBase64, "base64") : Buffer.alloc(0),
      body.languageCode || "hi-IN",
      mode,
      body.mimeType || "audio/wav"
    );
    return { status: 200, body: { success: true, mode, data: res } };
  }

  if (method === "POST" && normPath === "/api/v1/voice/synthesize") {
    const res = await sarvamAdapter.synthesize(body.text, body.languageCode || "hi-IN", mode);
    return { status: 200, body: { success: true, mode, data: res } };
  }

  if (method === "POST" && normPath === "/api/v1/voice/translate") {
    const res = await sarvamAdapter.translate(
      body.text,
      body.sourceLang || "en-IN",
      body.targetLang || "hi-IN",
      mode
    );
    return { status: 200, body: { success: true, mode, data: res } };
  }

  if (method === "GET" && normPath === "/api/v1/skills/status") {
    return {
      status: 200,
      body: {
        success: true,
        architecture: "Single-Loop Brain + 4 Scoped Domain Skills (Anthropic Oct 2026 Pattern)",
        skills: {
          samadhan: {
            name: "Samadhan (समाधान)",
            domain: "Service & Dispute Resolution",
            capabilities: ["NPCI UDIR Error Triage (U30, U16, RB, U69, ZM)", "POST /v1/dispute/action DEFEND Payload", "Provisional Credit Engine"],
            status: "ACTIVE",
          },
          suraksha: {
            name: "Suraksha (सुरक्षा)",
            domain: "Risk, Compliance & Guardrails",
            capabilities: ["Simon Willison Lethal Trifecta Air-Gap", "Sarvam Vision 2.1 Kacha-Bill OCR", "10-Second Razorpay RCA-GPT Cards", "RBI MDR Cap Enforcement"],
            status: "ACTIVE",
          },
          vriddhi: {
            name: "Vriddhi (वृद्धि)",
            domain: "Growth & VCG Contracts",
            capabilities: ["Amazon Flo Pro VCG Mechanism", "ADMM Consensus Optimization", "24-Hour Working Capital Bridge", "7-Day UPI AutoPay Split"],
            status: "ACTIVE",
          },
          sanchar: {
            name: "Sanchar (संचार)",
            domain: "Vernacular Speech & APOD",
            capabilities: ["Sarvam Bulbul V4 Flash (<250ms TTFA)", "Swar-Mudra 18.5kHz Ultrasonic APOD", "Indic DiarBench 75dB Shop Noise ASR", "Zero-Loss FSE Resignation Handoff"],
            status: "ACTIVE",
          },
        },
        timestamp: new Date().toISOString(),
      },
    };
  }

  if (method === "POST" && normPath === "/api/v1/skills/execute") {
    const { skill, action, payload } = body || {};
    let result: any = null;

    if (skill === "samadhan") {
      if (action === "triage_udir") {
        result = samadhanSkill.triageUdirError(payload?.udirCode || "U30", payload?.amount || 1200, payload?.trustScore || 0.9);
      } else if (action === "defend_payload") {
        result = samadhanSkill.generateDefendPayload(payload || {
          merchantId: "DEMO_MERCHANT_RAMESH",
          orderId: "DEMO_ORD_001",
          disputeId: "DEMO_DISP_001",
          amount: 1200,
          rrn: "DEMO_RRN_123456",
          swarMudraHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
          kachaBillVerified: true,
        });
      }
    } else if (skill === "suraksha") {
      if (action === "ocr_kacha_bill") {
        result = surakshaSkill.evaluateKachaBillOcr(payload?.rawText || "", payload?.expectedAmount || 1200);
      } else if (action === "generate_rca") {
        result = surakshaSkill.generateRcaPacket(payload || {
          merchantId: "DEMO_MERCHANT_RAMESH",
          exceptionType: "HIGH_VALUE_HOLD",
          orderAmount: 18000,
          context: {},
        });
      }
    } else if (skill === "vriddhi") {
      if (action === "bridge_loan") {
        result = vriddhiSkill.evaluateWorkingCapitalBridge(payload || {
          merchantId: "DEMO_MERCHANT_RAMESH",
          heldSettlementAmount: 18000,
        });
      } else if (action === "contract_menu") {
        result = vriddhiSkill.generateContractMenu(payload?.amount || 3500, payload?.trustScore || 0.88, payload?.margin || 0.15);
      }
    } else if (skill === "sanchar") {
      if (action === "swar_mudra_apod") {
        result = sancharSkill.generateSwarMudraApod(payload || {
          merchantId: "DEMO_MERCHANT_RAMESH",
          orderId: "DEMO_ORD_001",
          rrn: "DEMO_RRN_123456",
          amountInr: 3500,
        });
      } else if (action === "soundbox_template") {
        result = sancharSkill.renderSoundboxTemplate(payload?.templateKey || "PAYMENT_SUCCESS", payload?.params || { amount: 3500 }, payload?.lang || "hi-IN");
      }
    }

    if (!result) {
      return { status: 400, body: { success: false, error: `Invalid skill action: ${skill}.${action}` } };
    }

    return { status: 200, body: { success: true, skill, action, data: result, timestamp: new Date().toISOString() } };
  }

  // 11. Legacy / Core Controllers
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

  if (method === "POST" && normPath === "/api/v1/paytm/initiate") {
    const res = await handlePaytmInitiate(body);
    return { status: res.success ? 200 : 400, body: res };
  }

  if (method === "POST" && normPath === "/api/v1/paytm/refund") {
    const res = await handlePaytmRefund(body);
    return { status: res.success ? 200 : 400, body: res };
  }

  if (method === "GET" && normPath === "/api/v1/paytm/credentials-status") {
    const res = handlePaytmCredentialsStatus();
    return { status: 200, body: res };
  }

  return {
    status: 404,
    body: {
      success: false,
      error: `Route not found: ${method} ${path}`,
      availableRoutes: [
        "GET  /api/v1/health",
        "GET  /api/v1/providers/status",
        "GET  /api/v1/merchants",
        "GET  /api/v1/transactions",
        "POST /api/v1/transactions/initiate",
        "GET  /api/v1/settlements",
        "POST /api/v1/settlements/consolidate",
        "POST /api/v1/settlement/calculate",
        "GET  /api/v1/disputes",
        "POST /api/v1/disputes/action",
        "GET  /api/v1/soundbox/status",
        "POST /api/v1/soundbox/chime",
        "POST /api/v1/approvals/create",
        "POST /api/v1/approvals/review",
        "GET  /api/v1/memory/:merchantId",
        "POST /api/v1/memory/record",
        "POST /api/v1/handoff/initiate",
        "POST /api/v1/handoff/accept",
        "POST /api/v1/voice/transcribe",
        "POST /api/v1/voice/synthesize",
        "POST /api/v1/vcg/menu",
        "POST /api/v1/okf/evaluate",
        "POST /api/v1/brain/cycle",
        "GET  /api/v1/governance/wal",
        "GET  /api/v1/governance/canary",
      ],
    },
  };
}
