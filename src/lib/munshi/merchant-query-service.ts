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
  source: "brain_llm" | "demo_ledger" | "mdr_engine" | "static_fallback";
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
  const rawQ = String(facts.rawQuery || "");

  if (lang === "kn-IN") {
    switch (intent) {
      case "GREETING":
        return "ನಮಸ್ಕಾರ ರಮೇಶ್ ಅವರೇ! ನಾನು ನಿಮ್ಮ ಮುನ್ಷಿ AI ಸಹಾಯಕ. ಇಂದಿನ ಪಾವತಿ, ಸೆಟಲ್‌ಮೆಂಟ್ ಅಥವಾ ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಬಗ್ಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?";
      case "HELP":
        return "ನಾನು ನಿಮ್ಮ ಲೈವ್ ಪಾವತಿಗಳು, ಬ್ಯಾಂಕ್ ಸೆಟಲ್‌ಮೆಂಟ್, UTR ಸಂಖ್ಯೆಗಳು, ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಸ್ಥಿತಿ ಮತ್ತು ಆರ್‌ಬಿಐ ಎಂಡಿಆರ್ ನಿಯಮಗಳನ್ನು ಪರಿಶೀಲಿಸಬಲ್ಲೆ.";
      case "PAYMENT_TOTAL":
        return `ರಮೇಶ್ ಅವರೇ, ಇಂದು ನಿಮ್ಮ ಅಂಗಡಿಗೆ ಒಟ್ಟು ${inr(total)} ಪಾವತಿ ಬಂದಿದೆ (${count} ಯಶಸ್ವಿ UPI).`;
      case "SETTLEMENT":
        return settled > 0
          ? `${inr(settled)} ಸೆಟಲ್‌ಮೆಂಟ್ ಬ್ಯಾಂಕ್‌ಗೆ ಜಮೆ (UTR ${utr}). ಬಾಕಿ ${inr(pending)} ಇಂದು ರಾತ್ರಿ 11:59 ಕ್ಕೆ.`
          : `ಬಾಕಿ ${inr(pending)} ಇಂದು ರಾತ್ರಿ 11:59 ಕ್ಕೆ ಜಮೆಯಾಗಲಿದೆ.`;
      case "SOUNDBOX":
        return `ಸೌಂಡ್‌ಬಾಕ್ಸ್ ${sbStatus} — ${battery}% ಬ್ಯಾಟರಿ (ಲೈವ್ IoT ಟೆಲಿಮೆಟ್ರಿ).`;
      case "AMOUNT_LOOKUP":
        return lookupFound === "yes"
          ? `ಹೌದು — ${inr(lookupAmt)} ಪಾವತಿ ದಾಖಲಾಗಿದೆ. RRN ${lookupRrn}.`
          : `${inr(lookupAmt)} ಗಾಗಿ ಯಾವುದೇ ಯಶಸ್ವಿ ಪಾವತಿ ಕಂಡುಬಂದಿಲ್ಲ.`;
      case "MDR":
        return `${inr(orderAmt)} ಮೇಲೆ RBI MDR ${inr(mdrFee)}. ನಿವ್ವಳ ${inr(net)} (MDR ಕ್ಯಾಲ್ಕುಲೇಟರ್).`;
      case "GROWTH":
        return `ವೃದ್ಧಿ: ${facts.growthSummary || "3 ಒಪ್ಪಂದ ಆಯ್ಕೆಗಳು ಲೆಡ್ಜರ್ ಮೊತ್ತದಿಂದ."}`;
      default:
        return `"${rawQ}" ಗೆ ಸಂಬಂಧಿಸಿದಂತೆ: ನೀವು ಇಂದಿನ ಪಾವತಿ (${inr(total)}), ಸೆಟಲ್‌ಮೆಂಟ್ (${inr(settled)}), ಅಥವಾ ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಬಗ್ಗೆ ಕೇಳಬಹುದು.`;
    }
  }

  if (lang === "en-IN") {
    switch (intent) {
      case "GREETING":
        return "Namaste Ramesh ji! I am Pi Munshi, your digital shop assistant. How can I help you today with your payments, settlement, or Soundbox?";
      case "HELP":
        return "I can check your live payments, bank settlement status, UTR numbers, Soundbox health, verify specific customer payments, and explain RBI MDR rules.";
      case "PAYMENT_TOTAL":
        return `Ramesh ji, today's total collection is ${inr(total)} across ${count} successful UPI payments.`;
      case "SETTLEMENT":
        return settled > 0
          ? `${inr(settled)} credited to bank (UTR ${utr}). Pending ${inr(pending)} settles tonight by 11:59 PM.`
          : `Pending settlement ${inr(pending)} tonight by 11:59 PM.`;
      case "SOUNDBOX":
        return `Soundbox is ${sbStatus} at ${battery}% battery (live telemetry).`;
      case "AMOUNT_LOOKUP":
        return lookupFound === "yes"
          ? `Yes — ${inr(lookupAmt)} payment recorded. RRN ${lookupRrn}.`
          : `No successful ${inr(lookupAmt)} payment found in today's ledger.`;
      case "MDR":
        return `On ${inr(orderAmt)}, RBI MDR is ${inr(mdrFee)}. Net settlement ${inr(net)} (MDR engine).`;
      case "GROWTH":
        return `Growth menu: ${facts.growthSummary || "three contract options."}`;
      default:
        return `I heard "${rawQ}". You can ask about today's payments (${inr(total)}), settlement (${inr(settled)}), or Soundbox status.`;
    }
  }

  switch (intent) {
    case "GREETING":
      return "नमस्ते रमेश जी! मैं आपका मुंशी AI सहायक हूँ। आज आपकी दुकान के पेमेंट, सेटलमेंट या साउंडबॉक्स में क्या मदद करूँ?";
    case "HELP":
      return "मैं आपके लाइव पेमेंट, बैंक सेटलमेंट, UTR नंबर, साउंडबॉक्स स्थिति, किसी खास पेमेंट की जांच और RBI MDR नियमों की जानकारी दे सकता हूँ।";
    case "PAYMENT_TOTAL":
      return `रमेश जी, आज आपकी दुकान पर कुल ${inr(total)} प्राप्त हुआ है (${count} सफल UPI लेन-देन)।`;
    case "SETTLEMENT":
      return settled > 0
        ? `${inr(settled)} बैंक में जमा (UTR ${utr})। बाकी ${inr(pending)} आज रात 11:59 बजे।`
        : `बाकी ${inr(pending)} आज रात 11:59 बजे ट्रांसफर होगा।`;
    case "SOUNDBOX":
      return `साउंडबॉक्स ${sbStatus} — ${battery}% बैटरी (लाइव IoT डेटा)।`;
    case "AMOUNT_LOOKUP":
      return lookupFound === "yes"
        ? `हाँ — ${inr(lookupAmt)} का पेमेंट दर्ज है। RRN ${lookupRrn}।`
        : `आज ${inr(lookupAmt)} का कोई सफल पेमेंट नहीं मिला।`;
    case "MDR":
      return `${inr(orderAmt)} पर RBI MDR ${inr(mdrFee)}। शुद्ध जमा ${inr(net)} (MDR इंजन)।`;
    case "GROWTH":
      return `वृद्धि मेनू: ${facts.growthSummary || "तीन अनुबंध विकल्प।"}`;
    default:
      return `मैंने सुना: "${rawQ}"। आप आज के कुल पेमेंट (${inr(total)}), सेटलमेंट (${inr(settled)}), या साउंडबॉक्स स्थिति के बारे में पूछ सकते हैं।`;
  }
}

export async function resolveMerchantAnswer(
  question: string,
  lang: MunshiLang,
): Promise<MerchantAnswer> {
  const intent = classifyQueryIntent(question);
  const facts: Record<string, string | number> = { rawQuery: question };

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
      reply: formatReply(lang, intent, facts),
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
