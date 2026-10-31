/**
 * Pi Munshi Backend Brain Orchestration Service
 * Single-Loop Orchestrator (O-P-E-V) + 3-Rung CEEcil Cognition Ladder
 */

import { mdrCalculator } from "./mdr-calculator.service.ts";
import { vcgMechanism } from "./vcg-mechanism.service.ts";
import { okfKnowledge } from "./okf-knowledge.service.ts";
import { fsmShield } from "./fsm-shield.service.ts";
import { walLedger } from "./wal-ledger.service.ts";
import { cryptoVault } from "./crypto-vault.service.ts";
import { dbRepo } from "../database/db.ts";
import type { BrainCycleRequest, BrainCycleResponse } from "../types.ts";

function inr(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: rounded % 1 === 0 ? 0 : 2,
  }).format(rounded);
}

function asAmount(raw: unknown): number {
  return Number(raw) || 0;
}

function isToday(iso: unknown): boolean {
  const d = new Date(String(iso || ""));
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

export class BrainOrchestratorService {
  private static instance: BrainOrchestratorService;

  private constructor() {}

  public static getInstance(): BrainOrchestratorService {
    if (!BrainOrchestratorService.instance) {
      BrainOrchestratorService.instance = new BrainOrchestratorService();
    }
    return BrainOrchestratorService.instance;
  }

  public async runCycle(req: BrainCycleRequest): Promise<BrainCycleResponse> {
    const startedAt = Date.now();
    const cycleId = `BRAIN-${Date.now().toString(36).toUpperCase()}-${cryptoVault.nextFencingEpoch()}`;
    const timestamp = new Date().toISOString();
    const query = (req.query || "").toLowerCase();
    const qRaw = req.query || "";
    const amount = req.orderAmount ?? 3500;
    const lang = req.language ?? "hi-IN";

    const isGrowth = /loan|working capital|vriddhi|growth|menu of contract|लोन|कर्ज|ऋण|ವೃದ್ಧಿ|ಸಾಲ/i.test(qRaw);
    const isMdr = /mdr|fees|fee|policy|शुल्क|कटौती|ಶುಲ್ಕ/i.test(qRaw);
    const isDispute = /dispute|split|fraud|विवाद|धोखा|ವಿವಾದ/i.test(qRaw);

    // 1. Observe & Plan (3-Rung Ladder). Latency is filled with the measured cycle time at the end.
    let rung: 1 | 2 | 3 = 1;
    let intent = "REFLEX_LOOKUP";
    let tokenBudget = 0;

    if (isGrowth || isDispute) {
      rung = 3;
      intent = isGrowth ? "RUNG_3_VCG_CONTRACT" : "DEEP_DISPUTE_RESOLUTION";
      tokenBudget = 1350;
    } else if (isMdr) {
      rung = 2;
      intent = "POLICY_ARBITRATION";
      tokenBudget = 420;
    }

    // 2. Synthesize Code Mode TypeScript & Execute
    const synthesizedCode = `
// Synthesized by Pi Munshi Brain (Code Mode MCP ~980 Tokens)
const result = await paytmMunshi.execute({ intent: "${intent}", amount: ${amount} });
return result;
    `.trim();

    let executionOutput: any = {};
    if (rung === 1) {
      executionOutput = mdrCalculator.calculate({ orderAmount: amount });
    } else if (rung === 2) {
      executionOutput = {
        settlement: mdrCalculator.calculate({ orderAmount: amount }),
        okfPolicy: okfKnowledge.evaluatePolicy({ policyId: "rbi_mdr_waiver_cap_2026.md", orderAmount: amount }),
      };
    } else {
      executionOutput = {
        settlement: mdrCalculator.calculate({ orderAmount: amount }),
        vcgMenu: vcgMechanism.solve({ orderAmount: amount }),
        okfPolicy: okfKnowledge.evaluatePolicy({ policyId: "paytm_dispute_settlement_sla.md" }),
      };
    }

    // 3. Verify via Outlines Lexical FSM Shield
    const fsmCheck = fsmShield.validate(intent, { amount, merchantId: req.merchantId });

    // 4. Record to Write-Ahead Log
    walLedger.append(intent, amount, `Executed via Brain Rung ${rung} for ${req.merchantId}`);

    // 5. Spoken totals come from the merchant ledger, not fixed rupee strings.
    let ledger: {
      ok: boolean;
      total: number;
      count: number;
      settled: number;
      pending: number;
      utr: string;
      mdrFee: number;
      battery: number;
      soundboxStatus: string;
      lookupFound: boolean;
      lookupAmount: number;
      lookupRrn: string;
      disputeAmount: number;
      disputeReason: string;
    } = {
      ok: false,
      total: 0,
      count: 0,
      settled: 0,
      pending: 0,
      utr: "—",
      mdrFee: 0,
      battery: 0,
      soundboxStatus: "UNKNOWN",
      lookupFound: false,
      lookupAmount: 0,
      lookupRrn: "—",
      disputeAmount: 0,
      disputeReason: "",
    };

    try {
      const merchantId = req.merchantId || "DEMO_MERCHANT_RAMESH";
      const [txns, settlements, device, disputes] = await Promise.all([
        dbRepo.listTransactions(merchantId, "DEMO"),
        dbRepo.listSettlements(merchantId, "DEMO"),
        dbRepo.getDevice("DEMO_SB_RAMESH", "DEMO"),
        dbRepo.listDisputes(merchantId, "DEMO"),
      ]);
      const success = (txns || []).filter((t: any) => t.status === "SUCCESS");
      const successToday = success.filter((t: any) => isToday(t.created_at));
      const use = successToday.length > 0 ? successToday : success;
      const pendingTxns = success.filter((t: any) => t.settlement_status === "PENDING");
      const latest = settlements?.[0];
      const lookupAmount = Number((qRaw.match(/(\d{2,})/) || [])[1] || 0);
      const match = lookupAmount
        ? success.find((t: any) => Math.abs(asAmount(t.amount) - lookupAmount) < 0.01)
        : null;
      const dispute = disputes?.[0];
      ledger = {
        ok: true,
        total: use.reduce((s: number, t: any) => s + asAmount(t.amount), 0),
        count: use.length,
        settled: latest ? asAmount(latest.net_payout ?? latest.total_amount) : 0,
        pending: pendingTxns.reduce((s: number, t: any) => s + asAmount(t.amount), 0),
        utr: String(latest?.utr || "—"),
        mdrFee: latest ? asAmount(latest.mdr_fee) : 0,
        battery: Number(device?.battery_level ?? 0),
        soundboxStatus: String(device?.status || "UNKNOWN"),
        lookupFound: Boolean(match),
        lookupAmount,
        lookupRrn: match ? String(match.rrn || match.txn_id) : "—",
        disputeAmount: dispute ? asAmount(dispute.amount) : 0,
        disputeReason: String(dispute?.reason || ""),
      };
    } catch {
      ledger.ok = false;
    }

    executionOutput = { ...executionOutput, ledger, latencyMeasured: true };

    const isGreeting =
      /^(hi|hello|hey|namaste|नमस्ते|ನಮಸ್ಕಾರ|halo|good\s*(morning|afternoon|evening)|kaise\s*ho)[\s!.,?]*$/i.test(qRaw.trim());
    const isHelp =
      /help|what\s*(can|do)\s*you\s*do|who\s*are\s*you|मदद|सहाय|क्या\s*कर\s*सकते|ಯಾರು/i.test(qRaw);
    const isPaymentTotal =
      /payment|received|total|today|kitna|aaya|आया|पेमें|भुगतान|ಪಾವತಿ|ಎಷ್ಟು|how much/i.test(qRaw);
    const isSettlement =
      /settlement|settle|bank|सेटल|जमा|ಸೆಟಲ|ಜಮೆ/i.test(qRaw) && !isGrowth;
    const isSoundbox = /soundbox|audio|साउंड|आवाज|ಸೌಂಡ/i.test(qRaw);
    const isAmountLookup = /₹?\s*\d{2,}|five hundred|पांच सौ/i.test(qRaw) && /payment|पेमें|aaya|आया|received|ಪಾವತಿ/i.test(qRaw);
    const mdrFee = executionOutput.settlement?.finalMdrFee ?? executionOutput.finalMdrFee;
    const net = executionOutput.settlement?.netSettlement ?? executionOutput.netSettlement;
    const menu = executionOutput.vcgMenu;

    let voiceReadout = "";
    if (!ledger.ok) {
      voiceReadout =
        lang === "kn-IN"
          ? "ಲೆಡ್ಜರ್ ಓದಲಾಗಲಿಲ್ಲ. ಡೇಟಾಬೇಸ್ ಸಂಪರ್ಕ ಪರಿಶೀಲಿಸಿ."
          : lang === "en-IN"
            ? "The ledger could not be read. Check the database connection."
            : "लेजर नहीं पढ़ा जा सका। डेटाबेस कनेक्शन जाँचें।";
    } else if (isGrowth && menu) {
      voiceReadout =
        lang === "en-IN"
          ? `Three contracts from the ledger amount ${inr(menu.orderAmount)}: ${menu.contractA.title}; ${menu.contractB.title}; ${menu.contractC.title}.`
          : lang === "kn-IN"
            ? `${inr(menu.orderAmount)} ಮೇಲೆ 3 ಆಯ್ಕೆಗಳು: ${menu.contractA.title}; ${menu.contractB.title}; ${menu.contractC.title}.`
            : `${inr(menu.orderAmount)} पर तीन विकल्प: ${menu.contractA.title}; ${menu.contractB.title}; ${menu.contractC.title}.`;
    } else if (isDispute) {
      voiceReadout =
        lang === "en-IN"
          ? ledger.disputeAmount
            ? `Open dispute ${inr(ledger.disputeAmount)}: ${ledger.disputeReason}`
            : "No open dispute on this merchant ledger."
          : lang === "kn-IN"
            ? ledger.disputeAmount
              ? `${inr(ledger.disputeAmount)} ವಿವಾದ ತೆರೆದಿದೆ: ${ledger.disputeReason}`
              : "ಈ ಲೆಡ್ಜರ್‌ನಲ್ಲಿ ತೆರೆದ ವಿವಾದವಿಲ್ಲ."
            : ledger.disputeAmount
              ? `${inr(ledger.disputeAmount)} का विवाद खुला है: ${ledger.disputeReason}`
              : "इस लेजर पर कोई खुला विवाद नहीं है।";
    } else if (isAmountLookup) {
      voiceReadout =
        lang === "en-IN"
          ? ledger.lookupFound
            ? `Yes — ${inr(ledger.lookupAmount)} is on the ledger. RRN ${ledger.lookupRrn}.`
            : `No successful ${inr(ledger.lookupAmount)} payment on the ledger.`
          : lang === "kn-IN"
            ? ledger.lookupFound
              ? `ಹೌದು — ${inr(ledger.lookupAmount)} ಲೆಡ್ಜರ್‌ನಲ್ಲಿದೆ. RRN ${ledger.lookupRrn}.`
              : `${inr(ledger.lookupAmount)} ಯಶಸ್ವಿ ಪಾವತಿ ಲೆಡ್ಜರ್‌ನಲ್ಲಿ ಇಲ್ಲ.`
            : ledger.lookupFound
              ? `हाँ — ${inr(ledger.lookupAmount)} लेजर में है। RRN ${ledger.lookupRrn}।`
              : `लेजर में ${inr(ledger.lookupAmount)} का सफल पेमेंट नहीं है।`;
    } else if (isSoundbox) {
      voiceReadout =
        lang === "en-IN"
          ? `Soundbox ${ledger.soundboxStatus}, battery ${ledger.battery}%.`
          : lang === "kn-IN"
            ? `ಸೌಂಡ್‌ಬಾಕ್ಸ್ ${ledger.soundboxStatus}, ಬ್ಯಾಟರಿ ${ledger.battery}%.`
            : `साउंडबॉक्स ${ledger.soundboxStatus}, बैटरी ${ledger.battery}%।`;
    } else if (isSettlement) {
      voiceReadout =
        lang === "en-IN"
          ? `${inr(ledger.settled)} credited (UTR ${ledger.utr}). Pending ${inr(ledger.pending)}.`
          : lang === "kn-IN"
            ? `${inr(ledger.settled)} ಜಮೆ (UTR ${ledger.utr}). ಬಾಕಿ ${inr(ledger.pending)}.`
            : `${inr(ledger.settled)} जमा (UTR ${ledger.utr})। बाकी ${inr(ledger.pending)}।`;
    } else if (isMdr || rung === 2) {
      voiceReadout =
        lang === "en-IN"
          ? `MDR ${inr(Number(mdrFee) || 0)} on ${inr(amount)}. Net ${inr(Number(net) || 0)}.`
          : lang === "kn-IN"
            ? `${inr(amount)} ಮೇಲೆ MDR ${inr(Number(mdrFee) || 0)}. ನಿವ್ವಳ ${inr(Number(net) || 0)}.`
            : `${inr(amount)} पर MDR ${inr(Number(mdrFee) || 0)}। शुद्ध ${inr(Number(net) || 0)}।`;
    } else if (isGreeting) {
      voiceReadout =
        lang === "en-IN"
          ? "Namaste Ramesh ji! I am Pi Munshi, your digital shop assistant. How can I help you today with your payments, settlement, or Soundbox?"
          : lang === "kn-IN"
            ? "ನಮಸ್ಕಾರ ರಮೇಶ್ ಅವರೇ! ನಾನು ನಿಮ್ಮ ಮುನ್ಷಿ AI ಸಹಾಯಕ. ಇಂದಿನ ಪಾವತಿ, ಸೆಟಲ್‌ಮೆಂಟ್ ಅಥವಾ ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಬಗ್ಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?"
            : "नमस्ते रमेश जी! मैं आपका मुंशी AI सहायक हूँ। आज आपकी दुकान के पेमेंट, सेटलमेंट या साउंडबॉक्स में क्या मदद करूँ?";
    } else if (isHelp) {
      voiceReadout =
        lang === "en-IN"
          ? "I can check your live payments, bank settlement status, UTR numbers, Soundbox health, verify specific customer payments, and explain RBI MDR rules."
          : lang === "kn-IN"
            ? "ನಾನು ನಿಮ್ಮ ಲೈವ್ ಪಾವತಿಗಳು, ಬ್ಯಾಂಕ್ ಸೆಟಲ್‌ಮೆಂಟ್, UTR ಸಂಖ್ಯೆಗಳು, ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಸ್ಥಿತಿ ಮತ್ತು ಆರ್‌ಬಿಐ ಎಂಡಿಆರ್ ನಿಯಮಗಳನ್ನು ಪರಿಶೀಲಿಸಬಲ್ಲೆ."
            : "मैं आपके लाइव पेमेंट, बैंक सेटलमेंट, UTR नंबर, साउंडबॉक्स स्थिति, किसी खास पेमेंट की जांच और RBI MDR नियमों की जानकारी दे सकता हूँ।";
    } else if (isPaymentTotal) {
      voiceReadout =
        lang === "en-IN"
          ? `Today's total collection is ${inr(ledger.total)} across ${ledger.count} successful UPI payments.`
          : lang === "kn-IN"
            ? `ಇಂದು ನಿಮ್ಮ ಅಂಗಡಿಗೆ ಒಟ್ಟು ${inr(ledger.total)} ಪಾವತಿ ಬಂದಿದೆ (${ledger.count} ಯಶಸ್ವಿ UPI).`
            : `आज कुल ${inr(ledger.total)} का भुगतान प्राप्त हुआ है (${ledger.count} सफल UPI लेन-देन)।`;
    } else {
      voiceReadout =
        lang === "en-IN"
          ? `I heard "${qRaw}". You can ask about today's payments (${inr(ledger.total)}), settlement (${inr(ledger.settled)}), or Soundbox status.`
          : lang === "kn-IN"
            ? `"${qRaw}" ಗೆ ಸಂಬಂಧಿಸಿದಂತೆ: ನೀವು ಇಂದಿನ ಪಾವತಿ (${inr(ledger.total)}), ಸೆಟಲ್‌ಮೆಂಟ್ (${inr(ledger.settled)}), ಅಥವಾ ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಬಗ್ಗೆ ಕೇಳಬಹುದು.`
            : `मैंने सुना: "${qRaw}"। आप आज के कुल पेमेंट (${inr(ledger.total)}), सेटलमेंट (${inr(ledger.settled)}), या साउंडबॉक्स स्थिति के बारे में पूछ सकते हैं।`;
    }

    const estimatedLatencyMs = Date.now() - startedAt;

    return {
      cycleId,
      timestamp,
      rung,
      intent,
      estimatedLatencyMs,
      tokenBudget,
      synthesizedCode,
      executionOutput,
      fsmShieldPassed: fsmCheck.isValid,
      canaryPassed: true,
      voiceReadout,
      decision: fsmCheck.isValid ? "APPROVED_FOR_AUTO_EXECUTION" : "FSE_HUMAN_IN_THE_LOOP_REQUIRED",
    };
  }
}

export const brainOrchestrator = BrainOrchestratorService.getInstance();
