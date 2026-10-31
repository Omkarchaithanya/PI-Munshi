/** Shared intent detection for voice / text merchant queries (PRD Rung 1–2 reflex). */

export type QueryIntent =
  | "PAYMENT_TOTAL"
  | "SETTLEMENT"
  | "SOUNDBOX"
  | "AMOUNT_LOOKUP"
  | "MDR"
  | "GROWTH"
  | "GREETING"
  | "HELP"
  | "UNKNOWN";

export function classifyQueryIntent(question: string): QueryIntent {
  const q = question.trim();
  if (!q) return "GREETING";

  if (/^(hi|hello|hey|namaste|नमस्ते|ನಮಸ್ಕಾರ|halo|good\s*(morning|afternoon|evening)|kaise\s*ho)[\s!.,?]*$/i.test(q)) {
    return "GREETING";
  }
  if (/help|what\s*(can|do)\s*you\s*do|who\s*are\s*you|मदद|सहाय|क्या\s*कर\s*सकते|ಯಾರು/i.test(q)) {
    return "HELP";
  }
  if (/loan|working capital|vriddhi|growth|menu of contract|लोन|कर्ज|ऋण|ವೃದ್ಧಿ|ಸಾಲ/i.test(q)) {
    return "GROWTH";
  }
  if (/mdr|fee|fees|charge|deduct|कटौती|शुल्क|फीस|ಎಂಡಿಆರ್|ಶುಲ್ಕ|kyu kata|why.*deduct/i.test(q)) {
    return "MDR";
  }
  if (/₹?\s*\d{2,}|rs\.?\s*\d|rupee|रुप|ರೂ/i.test(q) && /payment|पेमें|aaya|आया|received|swipe|ಪಾವತಿ|ಬಂದ/i.test(q)) {
    return "AMOUNT_LOOKUP";
  }
  if (/soundbox|audio|voice|chime|साउंड|आवाज|ध्वन|ಸೌಂಡ|ಧ್ವನಿ|ಕೆಲಸ/i.test(q)) {
    return "SOUNDBOX";
  }
  if (/settlement|settle|bank|credit|transfer|सेटल|जमा|खात|ಸೆಟಲ|ಜಮೆ|ಬ್ಯಾಂಕ|when|kab|कब|ಯಾವಾಗ/i.test(q)) {
    return "SETTLEMENT";
  }
  if (/payment|received|total|today|kitna|aaya|आया|पेमें|भुगतान|ಪಾವತಿ|ಎಷ್ಟು|ಹಣ ಬಂದ|how much/i.test(q)) {
    return "PAYMENT_TOTAL";
  }
  return "UNKNOWN";
}

/** Pull a rupee amount from natural language (e.g. "₹3500", "3500 rupees"). */
export function parseAmountFromQuestion(question: string): number | null {
  const m = question.match(/(?:₹|rs\.?\s*)?\s*(\d{1,3}(?:,\d{2,3})*(?:\.\d+)?|\d+)/i);
  if (!m) return null;
  const n = Number(m[1].replace(/,/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}
