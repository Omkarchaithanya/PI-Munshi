export type Lang = "hi-IN" | "kn-IN" | "en-IN";

export type Shop = {
  id: string;
  name: string;
  owner: string;
  area: string;
  lang: Lang;
  langLabel: string;
  category: string;
  gmv30d: number;
  piTrust: number;
  margin: number;
  sundayCounter: string;
  payout: string;
  gist: string[];
  chip: string;
  chipTone: "work" | "done" | "quiet";
};

export type AutonomyRow = {
  actionClass: string;
  label: string;
  level: number;
  clean: number;
  required: number;
};

export type WalStatus = "PRE_COMMITTED" | "EXECUTED" | "BLOCKED" | "RECONCILED";

export type WalRow = {
  id: string;
  action: string;
  status: WalStatus;
  level: number;
  key: string;
  note: string;
};

export type TraceTone = "info" | "ok" | "warn" | "block" | "money";

export type Trace = {
  id: string;
  rung: 0 | 1 | 2 | 3;
  title: string;
  detail: string;
  tone: TraceTone;
};

export type BillItem = { name: string; amt: number };

export type VcgMenu = {
  order: number;
  trust: number;
  upfrontRatio: number;
  splitQr: number;
  autopay: number;
  bonusPct: number;
  voucher: number;
  reversal: number;
};

export type ShieldVerdict = "empty" | "blocked" | "pass" | "note";

export type ShieldResult = {
  verdict: ShieldVerdict;
  intent: "DISPUTE_STATUS" | "SPLIT_REQUEST" | "REFUND_CHECK" | "UNTRUSTED_NOTE" | "NOTE" | "NONE";
  reason: string;
};

export const HERO_ID = "skm";

export const BILL: { shop: string; date: string; gstin: string; items: BillItem[]; total: number } = {
  shop: "श्री कृष्ण मेडिकल्स",
  date: "30 Oct 2026",
  gstin: "29AABCU9603R1ZM",
  items: [
    { name: "Dolo 650 × 3", amt: 96 },
    { name: "Azithral 500", amt: 214 },
    { name: "ORS × 6", amt: 120 },
    { name: "Betadine 100ml", amt: 145 },
    { name: "Surgical gauze", amt: 85 },
    { name: "Insulin syringes", amt: 190 },
    { name: "Volini gel", amt: 160 },
    { name: "Cough syrup", amt: 180 },
    { name: "Gloves box", amt: 240 },
    { name: "Misc counter", amt: 420 },
  ],
  total: 1850,
};

export const SETTLEMENT = {
  amount: 4280,
  utr: "629910482217",
  utrShort: "629910",
  orderId: "PTM2026103004280",
  disputeId: "2026103109",
  mdrBase: 2400,
  mdrFee: 9.6,
  mid: "MIDBELL4KRISHNA",
};

export const CHECKOUT = {
  amount: 2800,
  code: "U30",
  bank: "SBI",
  bridge: 18000,
  wholesale: 25000,
};

export function inr(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

export function digest(input: string): string {
  let a = 0x811c9dc5;
  let b = 0x01000193;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    a ^= c;
    a = Math.imul(a, 0x01000193);
    b = Math.imul(b ^ c, 0x85ebca6b);
  }
  const hex = (n: number) => (n >>> 0).toString(16).padStart(8, "0");
  return (hex(a) + hex(b)).slice(0, 16);
}

export function swarPayload(amount: number): { payload: string; hmac: string; band: string } {
  const canonical = `${SETTLEMENT.mid}|${SETTLEMENT.orderId}|${SETTLEMENT.utr}|${amount}|1730350000`;
  const hmac = digest(canonical);
  return {
    hmac,
    band: "18.5–19.8 kHz",
    payload: `SM1:${SETTLEMENT.orderId.slice(-6)}:${SETTLEMENT.utrShort}:${amount}:${hmac}`,
  };
}

export function idempotency(action: string): string {
  return digest(`${SETTLEMENT.mid}|${SETTLEMENT.orderId}|${action}|2026-10-31`).slice(0, 16);
}

export function computeVcg(order: number, trust: number, margin = 0.22): VcgMenu {
  const upfrontRatio = trust >= 0.9 ? 0.285 : 0.5;
  const splitQr = Math.round(order * upfrontRatio);
  const autopay = order - splitQr;
  const bonusPct = Math.min(0.15, Math.round(margin * 0.68 * 100) / 100);
  const voucher = Math.round(order * (1 + bonusPct));
  return {
    order,
    trust,
    upfrontRatio,
    splitQr,
    autopay,
    bonusPct,
    voucher,
    reversal: order,
  };
}

export function shield(text: string): ShieldResult {
  const t = text.trim();
  if (!t) {
    return { verdict: "empty", intent: "NONE", reason: "Nothing to file." };
  }
  const override =
    /(system\s*override|ignore\s+(all\s+|previous\s+)?(policy|rules|instructions)|jailbreak|bypass|forget\s+(the\s+)?(policy|rules)|do\s+not\s+follow)/i.test(
      t,
    );
  const money = /(refund|waive|waiver|transfer|disburse|credit)/i.test(t);
  const amount = /(?:₹|rs\.?\s*)?\d{3,}/i.test(t);
  if (override || (money && amount)) {
    return {
      verdict: "blocked",
      intent: "UNTRUSTED_NOTE",
      reason:
        "Outlines FSM refused a money verb from untrusted text. Logged as a note. Zero tool access.",
    };
  }
  if (/(split|autopay|hundi)/i.test(t)) {
    return {
      verdict: "pass",
      intent: "SPLIT_REQUEST",
      reason: "Enum only. Hands may draft a split. They may not move money.",
    };
  }
  if (/refund\s*check|status of refund/i.test(t)) {
    return {
      verdict: "pass",
      intent: "REFUND_CHECK",
      reason: "Enum only. Read-only refund status.",
    };
  }
  if (/(status|payment|settlement|utr|aaya|आया|kitna|कितना)/i.test(t)) {
    return {
      verdict: "pass",
      intent: "DISPUTE_STATUS",
      reason: "Rung 1 status lookup. No ledger write.",
    };
  }
  return {
    verdict: "note",
    intent: "NOTE",
    reason: "Not an allowed enum. Filed on the shop. No tool ran.",
  };
}

export const ARUN = {
  id: "arun",
  name: "Arun Kumar",
  role: "FSE · Bellandur",
  note: "On the beat. 30 m out from shop 4.",
};

export const NEHA = {
  id: "neha",
  name: "Neha Rao",
  role: "FSE · day-one handoff",
  note: "Inherited Arun’s Munshi. No chat history. Same promises.",
};

export function seedShops(): Shop[] {
  return [
    {
      id: HERO_ID,
      name: "Sri Krishna Medicals",
      owner: "Sharma",
      area: "Bellandur main",
      lang: "hi-IN",
      langLabel: "Hindi",
      category: "Pharmacy",
      gmv30d: 612000,
      piTrust: 0.994,
      margin: 0.22,
      sundayCounter: "Wife at the counter",
      payout: "Tuesday 14:00 · ₹25,000 wholesale",
      chip: "Needs defend",
      chipTone: "work",
      gist: [
        "Sharma · Hindi counter · Sundays: wife",
        "Soundbox live · last heartbeat 09:14",
        "T+1 ₹4,280 stuck · UTR 629910482217",
        "Dispute 2026103109 · ₹1,850 kacha-bill",
        "₹2,400 bill showed ₹9.60 MDR · waiver unused",
        "Wholesaler Tuesday 14:00 · ₹25,000 due",
        "Pi trust 99.4% · split eligible to ₹5,000",
        "Bridge-loan class sits at Level 2 · 4/5",
      ],
    },
    {
      id: "om",
      name: "Om Mobile",
      owner: "Ramesh",
      area: "Kaikondrahalli",
      lang: "kn-IN",
      langLabel: "Kannada",
      category: "Electronics",
      gmv30d: 188400,
      piTrust: 0.91,
      margin: 0.18,
      sundayCounter: "Closed Sundays",
      payout: "Friday supplier",
      chip: "Ticket #1842 · Munshi",
      chipTone: "done",
      gist: [
        "Ramesh · Kannada · do not visit Sundays",
        "Soundbox silent 6 hours · battery suspect",
        "Munshi opened ticket #1842 before the visit",
        "Replacement slot tomorrow 11:00–13:00",
        "Route updated · Arun skips the basement",
        "No fee waiver on file",
        "Last dispute closed clean · Aug",
        "Level 1 on device tickets · already earned",
      ],
    },
    {
      id: "anna",
      name: "Annapurna Kirana",
      owner: "Lakshmi",
      area: "Devarabisanahalli",
      lang: "kn-IN",
      langLabel: "Kannada",
      category: "Kirana",
      gmv30d: 240100,
      piTrust: 0.88,
      margin: 0.16,
      sundayCounter: "Son, after 4pm",
      payout: "Monday milk co-op",
      chip: "Clear",
      chipTone: "quiet",
      gist: [
        "Lakshmi · prefers Kannada, short gist",
        "QR still Paytm after the fee rumour",
        "No open settlement",
        "Asked once about a ₹15 festive waiver cap",
        "Visit after 4pm · counter is the son",
        "Soundbox rental current",
        "No loan appetite this week",
        "Memory keyed to the shop, not the rep",
      ],
    },
    {
      id: "tea",
      name: "Bellandur Tea Stall",
      owner: "Imran",
      area: "Outer Ring Rd",
      lang: "hi-IN",
      langLabel: "Hindi",
      category: "F&B",
      gmv30d: 74200,
      piTrust: 0.8,
      margin: 0.35,
      sundayCounter: "Owner",
      payout: "Daily cash-and-UPI",
      chip: "MDR explained",
      chipTone: "quiet",
      gist: [
        "Imran · Hindi · ticket size under ₹200",
        "MDR does not bite this shop",
        "Soundbox is the only screen he uses",
        "No open case",
        "Keep the sentence under one breath",
        "Do not pitch a loan",
        "Gist stays eight lines",
        "Rep may skip if the stall is slammed",
      ],
    },
    {
      id: "silks",
      name: "Lakshmi Silks",
      owner: "Padma",
      area: "Sarjapur Rd",
      lang: "kn-IN",
      langLabel: "Kannada",
      category: "Apparel",
      gmv30d: 890000,
      piTrust: 0.96,
      margin: 0.28,
      sundayCounter: "Both sisters",
      payout: "Thursday weaver",
      chip: "High ticket",
      chipTone: "quiet",
      gist: [
        "Padma · Kannada · bills often above ₹2,000",
        "MDR conversation already had, calmly",
        "No waiver promised",
        "Soundbox near the trial room",
        "Pi trust high · split would land",
        "No dispute open",
        "Visit late afternoon",
        "Do not lead with a product pitch",
      ],
    },
    {
      id: "pharma",
      name: "Metro Pharma",
      owner: "Joseph",
      area: "Ecospace",
      lang: "en-IN",
      langLabel: "English",
      category: "Pharmacy",
      gmv30d: 410000,
      piTrust: 0.93,
      margin: 0.2,
      sundayCounter: "Chemist",
      payout: "Wednesday distributor",
      chip: "Clear",
      chipTone: "quiet",
      gist: [
        "Joseph · English gist is fine",
        "Settlement on time this week",
        "Soundbox healthy",
        "No waiver on file",
        "Distributor debit Wednesday",
        "Trust score stable",
        "No escalation",
        "Beat stop is optional today",
      ],
    },
    {
      id: "leaf",
      name: "Green Leaf Vegetables",
      owner: "Gowda",
      area: "Kadubeesanahalli",
      lang: "kn-IN",
      langLabel: "Kannada",
      category: "Fresh",
      gmv30d: 96000,
      piTrust: 0.77,
      margin: 0.12,
      sundayCounter: "Owner, dawn",
      payout: "Daily mandi",
      chip: "Clear",
      chipTone: "quiet",
      gist: [
        "Gowda · Kannada · dawn visit only",
        "Tiny tickets · MDR rarely applies",
        "Soundbox dusty but online",
        "No open money case",
        "Do not offer credit",
        "Speaks outcome, never a lecture",
        "Eight lines is the whole memory",
        "Shop stays if the box keeps working",
      ],
    },
    {
      id: "hardware",
      name: "Sri Ganesh Hardware",
      owner: "Suresh",
      area: "Bellandur gate",
      lang: "kn-IN",
      langLabel: "Kannada",
      category: "Hardware",
      gmv30d: 530000,
      piTrust: 0.9,
      margin: 0.19,
      sundayCounter: "Closed",
      payout: "Tuesday steel yard",
      chip: "Clear",
      chipTone: "quiet",
      gist: [
        "Suresh · Kannada · closed Sunday",
        "Large tickets · fee is a live worry",
        "No waiver given yet",
        "Soundbox at the billing desk",
        "Wholesale Tuesday, like Sharma",
        "No stuck UTR",
        "Eligible to hear a bridge only if stuck",
        "Rep should not invent a promise",
      ],
    },
    {
      id: "cafe",
      name: "Cafe Namma",
      owner: "Aisha",
      area: "RMZ",
      lang: "en-IN",
      langLabel: "English",
      category: "Cafe",
      gmv30d: 310000,
      piTrust: 0.92,
      margin: 0.4,
      sundayCounter: "Manager",
      payout: "Daily",
      chip: "Clear",
      chipTone: "quiet",
      gist: [
        "Aisha · English · manager on Sundays",
        "Card plus UPI · Soundbox is the UPI desk",
        "No dispute",
        "Asked what 0.4% looks like on a ₹2,400 bill",
        "Answer on file: ₹9.60, cap ₹300",
        "No waiver",
        "Happy with one-sentence answers",
        "Do not upsell at lunch rush",
      ],
    },
    {
      id: "dental",
      name: "Shree Dental",
      owner: "Dr. Iyer",
      area: "Haralur",
      lang: "en-IN",
      langLabel: "English",
      category: "Clinic",
      gmv30d: 275000,
      piTrust: 0.97,
      margin: 0.45,
      sundayCounter: "Closed",
      payout: "Monthly lab",
      chip: "Clear",
      chipTone: "quiet",
      gist: [
        "Dr. Iyer · English · closed Sunday",
        "High trust · few tickets, large",
        "Soundbox in reception",
        "No open case",
        "Lab payment is monthly, not weekly",
        "Would tolerate a split on a large case",
        "No loan conversation started",
        "Keep clinical hours quiet",
      ],
    },
    {
      id: "petals",
      name: "Petals Florist",
      owner: "Meera",
      area: "Bellandur lake",
      lang: "kn-IN",
      langLabel: "Kannada",
      category: "Retail",
      gmv30d: 64000,
      piTrust: 0.84,
      margin: 0.33,
      sundayCounter: "Owner",
      payout: "Wedding season spikes",
      chip: "Clear",
      chipTone: "quiet",
      gist: [
        "Meera · Kannada · Sunday is a work day",
        "Small GMV · relationship is the product",
        "Soundbox new, last month",
        "No dispute",
        "No waiver",
        "Do not pitch insurance",
        "One sentence, then leave",
        "Memory is the shop’s, not Meera’s app",
      ],
    },
    {
      id: "daily",
      name: "Daily Needs Supermart",
      owner: "Kulkarni",
      area: "Kasavanahalli",
      lang: "kn-IN",
      langLabel: "Kannada",
      category: "Supermarket",
      gmv30d: 1204000,
      piTrust: 0.95,
      margin: 0.14,
      sundayCounter: "Floor manager",
      payout: "Daily distributor",
      chip: "Clear",
      chipTone: "quiet",
      gist: [
        "Kulkarni · Kannada gist, English numbers",
        "Highest GMV on the beat",
        "MDR on large bills is the retention risk",
        "No waiver promised",
        "Soundbox at checkout 2",
        "Settlements clean this week",
        "Floor manager, not the owner, after 6pm",
        "A lost QR here hurts the beat’s number",
      ],
    },
  ];
}

export function seedAutonomy(): AutonomyRow[] {
  return [
    { actionClass: "RETRY_SETTLEMENT", label: "Retry settlement", level: 1, clean: 12, required: 5 },
    { actionClass: "DEVICE_TICKET", label: "Device ticket", level: 1, clean: 9, required: 5 },
    { actionClass: "DEFEND_POD", label: "Defend with POD", level: 1, clean: 6, required: 5 },
    { actionClass: "MDR_WAIVER_UNDER_20", label: "MDR waiver ≤ ₹20", level: 2, clean: 4, required: 5 },
    { actionClass: "BRIDGE_LOAN_OFFER", label: "24h bridge credit", level: 2, clean: 4, required: 5 },
    { actionClass: "REFUND_OVER_500", label: "Refund > ₹500", level: 2, clean: 1, required: 5 },
  ];
}

export function seedWal(): WalRow[] {
  return [
    {
      id: "wal-seed",
      action: "ticket.create #1842",
      status: "EXECUTED",
      level: 1,
      key: idempotency("ticket.create"),
      note: "Om Mobile · reversible · told the rep, did not ask",
    },
  ];
}

export function levelName(level: number): string {
  if (level <= 0) return "Prepare";
  if (level === 1) return "Reversible";
  if (level === 2) return "Needs Haan";
  return "Earned";
}

export function settlementLine(rep: string): { hi: string; en: string } {
  return {
    hi: `शर्मा जी, कल के ₹${SETTLEMENT.amount.toLocaleString("en-IN")} बैंक में आ गए हैं। UTR 6 2 9 9 1 0। ₹2,400 के बिल पर ₹9.60 MDR लगा। ${rep} बाहर हैं।`,
    en: `Sharma ji, yesterday’s ₹4,280 is in the bank (UTR ${SETTLEMENT.utrShort}). The ₹2,400 bill had a ₹9.60 MDR fee. ${rep} is outside.`,
  };
}
