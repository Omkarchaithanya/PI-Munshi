/**
 * Voice / text answers backed by DEMO ledger APIs (IMPLEMENTATION_STATUS § Rule 1).
 * Totals and UTRs come from PGlite demo transactions — not hard-coded ₹2,150.
 */

import { munshiApi } from "@/lib/api-client";
import { classifyQueryIntent, parseAmountFromQuestion, type QueryIntent } from "@/lib/munshi/query-intent";

export type MunshiLang = "hi-IN" | "kn-IN" | "en-IN";

export type MerchantAnswer = {
  reply: string;
  intent: QueryIntent;
  /** Where numbers were computed from */
  source: "demo_ledger" | "mdr_engine" | "static_fallback";
  facts: Record<string, string | number>;
};

const MERCHANT_ID = "DEMO_MERCHANT_RAMESH";

function inr(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

function txnAmount(raw: unknown): number {
  return Number(raw) || 0;
}

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function formatReply(
  lang: MunshiLang,
  intent: QueryIntent,
  facts: Record<string, string | number>,
): string {
  const total = facts.totalToday as number;
  const count = facts.txnCount as number;
  const settled = facts.settledAmount as number;
  const pending = facts.pendingAmount as number;
  const utr = facts.utr as string;
  const battery = facts.battery as number;
  const sbStatus = facts.soundboxStatus as string;
  const mdrFee = facts.mdrFee as number;
  const net = facts.netSettlement as number;
  const orderAmt = facts.orderAmount as number;
  const lookupAmt = facts.lookupAmount as number;
  const lookupFound = facts.lookupFound as string;
  const lookupRrn = facts.lookupRrn as string;

  if (lang === "kn-IN") {
    switch (intent) {
      case "PAYMENT_TOTAL":
        return `ರಮೇಶ್ ಅವರೇ, DEMO ಲೆಡ್ಜರ್ ಪ್ರಕಾರ ಇಂದು ಒಟ್ಟು ${inr(total)} (${count} ಯಶಸ್ವಿ UPI).`;
      case "SETTLEMENT":
        return settled > 0
          ? `${inr(settled)} ಸೆಟಲ್‌ಮೆಂಟ್ ಬ್ಯಾಂಕ್‌ಗೆ ಜಮೆ (UTR ${utr}). ಬಾಕಿ ${inr(pending)} ಇಂದು ರಾತ್ರಿ 11:59 ಕ್ಕೆ.`
          : `ಬಾಕಿ ${inr(pending)} ಇಂದು ರಾತ್ರಿ 11:59 ಕ್ಕೆ ಜಮೆಯಾಗಲಿದೆ.`;
      case "SOUNDBOX":
        return `ಸೌಂಡ್‌ಬಾಕ್ಸ್ ${sbStatus} — ${battery}% ಬ್ಯಾಟರಿ (DEMO IoT ಟೆಲಿಮೆಟ್ರಿ).`;
      case "AMOUNT_LOOKUP":
        return lookupFound === "yes"
          ? `ಹೌದು — ${inr(lookupAmt)} ಪಾವತಿ ದಾಖಲಾಗಿದೆ. RRN ${lookupRrn}.`
          : `${inr(lookupAmt)} ಗಾಗಿ DEMO ಲೆಡ್ಜರ್‌ನಲ್ಲಿ ಯಾವುದೇ ಯಶಸ್ವಿ ಪಾವತಿ ಕಂಡುಬಂದಿಲ್ಲ.`;
      case "MDR":
        return `${inr(orderAmt)} ಮೇಲೆ RBI MDR ${inr(mdrFee)}. ನಿವ್ವಳ ${inr(net)} (MDR ಕ್ಯಾಲ್ಕುಲೇಟರ್).`;
      case "GROWTH":
        return `ವೃದ್ಧಿ: ${facts.growthSummary || "3 ಒಪ್ಪಂದ ಆಯ್ಕೆಗಳು ಲೆಡ್ಜರ್ ಮೊತ್ತದಿಂದ."}`;
      default:
        return "ನಮಸ್ಕಾರ! ಪಾವತಿ, ಸೆಟಲ್‌ಮೆಂಟ್, MDR ಅಥವಾ ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಬಗ್ಗೆ ಕೇಳಿ.";
    }
  }

  if (lang === "en-IN") {
    switch (intent) {
      case "PAYMENT_TOTAL":
        return `Ramesh ji, per the DEMO ledger today: ${inr(total)} across ${count} successful UPI payments.`;
      case "SETTLEMENT":
        return settled > 0
          ? `${inr(settled)} credited to bank (UTR ${utr}). Pending ${inr(pending)} settles tonight by 11:59 PM.`
          : `Pending settlement ${inr(pending)} tonight by 11:59 PM.`;
      case "SOUNDBOX":
        return `Soundbox is ${sbStatus} at ${battery}% battery (live DEMO telemetry).`;
      case "AMOUNT_LOOKUP":
        return lookupFound === "yes"
          ? `Yes — ${inr(lookupAmt)} payment recorded. RRN ${lookupRrn}.`
          : `No successful ${inr(lookupAmt)} payment in the DEMO ledger.`;
      case "MDR":
        return `On ${inr(orderAmt)}, RBI MDR is ${inr(mdrFee)}. Net settlement ${inr(net)} (MDR engine).`;
      case "GROWTH":
        return `Growth menu from the ledger: ${facts.growthSummary || "three contract options."}`;
      default:
        return "Ask about payments, settlement, MDR, or Soundbox — answers use the DEMO merchant ledger.";
    }
  }

  switch (intent) {
    case "PAYMENT_TOTAL":
      return `रमेश जी, DEMO लेजर के अनुसार आज कुल ${inr(total)} (${count} सफल UPI)।`;
    case "SETTLEMENT":
      return settled > 0
        ? `${inr(settled)} बैंक में जमा (UTR ${utr})। बाकी ${inr(pending)} आज रात 11:59 बजे।`
        : `बाकी ${inr(pending)} आज रात 11:59 बजे ट्रांसफर होगा।`;
    case "SOUNDBOX":
      return `साउंडबॉक्स ${sbStatus} — ${battery}% बैटरी (DEMO IoT डेटा)।`;
    case "AMOUNT_LOOKUP":
      return lookupFound === "yes"
        ? `हाँ — ${inr(lookupAmt)} का पेमेंट दर्ज है। RRN ${lookupRrn}।`
        : `DEMO लेजर में ${inr(lookupAmt)} का सफल पेमेंट नहीं मिला।`;
    case "MDR":
      return `${inr(orderAmt)} पर RBI MDR ${inr(mdrFee)}। शुद्ध जमा ${inr(net)} (MDR इंजन)।`;
    case "GROWTH":
      return `लेजर राशि पर वृद्धि मेनू: ${facts.growthSummary || "तीन अनुबंध विकल्प।"}`;
    default:
      return "नमस्ते! पेमेंट, सेटलमेंट, MDR या साउंडबॉक्स पूछें — जवाब DEMO लेजर से।";
  }
}

export async function resolveMerchantAnswer(
  question: string,
  lang: MunshiLang,
): Promise<MerchantAnswer> {
  const intent = classifyQueryIntent(question);
  const facts: Record<string, string | number> = {};

  try {
    const [txns, settlements, soundbox] = await Promise.all([
      munshiApi.getTransactions(MERCHANT_ID, "DEMO"),
      munshiApi.getSettlements(MERCHANT_ID, "DEMO"),
      munshiApi.getSoundboxStatus("DEMO_SB_RAMESH", "DEMO"),
    ]);

    const successToday = txns.filter(
      (t) => t.status === "SUCCESS" && isToday(String(t.created_at || "")),
    );
    const successAll = txns.filter((t) => t.status === "SUCCESS");
    const use = successToday.length > 0 ? successToday : successAll;

    const totalToday = use.reduce((s, t) => s + txnAmount(t.amount), 0);
    const pendingTxns = txns.filter((t) => t.settlement_status === "PENDING" && t.status === "SUCCESS");
    const pendingAmount = pendingTxns.reduce((s, t) => s + txnAmount(t.amount), 0);

    const latestSettlement = settlements[0];
    const settledAmount = latestSettlement ? txnAmount(latestSettlement.net_payout ?? latestSettlement.total_amount) : 0;
    const utr = String(latestSettlement?.utr || "—");

    facts.totalToday = totalToday;
    facts.txnCount = use.length;
    facts.settledAmount = settledAmount;
    facts.pendingAmount = pendingAmount;
    facts.utr = utr;
    facts.battery = Number(soundbox?.battery_level ?? 88);
    facts.soundboxStatus = String(soundbox?.status ?? "ONLINE");

    if (intent === "AMOUNT_LOOKUP" || /₹?\s*500|500/.test(question)) {
      const lookupAmount = parseAmountFromQuestion(question) ?? 500;
      const match = txns.find(
        (t) => t.status === "SUCCESS" && Math.abs(txnAmount(t.amount) - lookupAmount) < 0.01,
      );
      facts.lookupAmount = lookupAmount;
      facts.lookupFound = match ? "yes" : "no";
      facts.lookupRrn = match ? String(match.rrn || match.txn_id) : "—";
    }

    if (intent === "MDR") {
      const orderAmount = parseAmountFromQuestion(question) ?? 3500;
      const mdr = await munshiApi.calculateMdr({ orderAmount });
      facts.orderAmount = orderAmount;
      facts.mdrFee = Number(mdr.finalMdrFee ?? mdr.rawMdrFee ?? 0);
      facts.netSettlement = Number(mdr.netSettlement ?? orderAmount);
    }

    if (intent === "GROWTH") {
      const orderAmount = parseAmountFromQuestion(question) ?? (totalToday || 3500);
      const menu = await munshiApi.getVcgMenu({ orderAmount });
      facts.growthSummary = [menu?.contractA?.title, menu?.contractB?.title, menu?.contractC?.title]
        .filter(Boolean)
        .join("; ");
    }

    return {
      reply: formatReply(lang, intent === "GREETING" ? "GREETING" : intent, facts),
      intent,
      source: intent === "MDR" || intent === "GROWTH" ? "mdr_engine" : "demo_ledger",
      facts,
    };
  } catch {
    return {
      reply:
        lang === "en-IN"
          ? "Could not reach the DEMO ledger. Check dev server API, then try again."
          : lang === "kn-IN"
            ? "DEMO ಲೆಡ್ಜರ್ ಸಂಪರ್ಕ ವಿಫಲ. dev ಸರ್ವರ್ ಪರಿಶೀಲಿಸಿ."
            : "DEMO लेजर से कनेक्ट नहीं हो पाया। dev सर्वर चालू करें।",
      intent,
      source: "static_fallback",
      facts,
    };
  }
}
