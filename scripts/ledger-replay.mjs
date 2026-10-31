/**
 * Small ledger replay. Not a 500-trace accuracy gate.
 * Hits the running app and checks spoken totals and rung routing.
 */
const base = process.env.PI_MUNSHI_BASE || "http://127.0.0.1:8080";

const cases = [
  {
    name: "today payments use ledger total",
    body: { query: "aaj ka payment kitna hai", merchantId: "DEMO_MERCHANT_RAMESH", language: "hi-IN" },
    check(data) {
      const total = data.executionOutput?.ledger?.total;
      return data.rung === 1 && data.executionOutput?.latencyMeasured === true && data.voiceReadout.includes(formatInr(total));
    },
  },
  {
    name: "settlement uses ledger UTR and pending",
    body: { query: "settlement kab aayega", merchantId: "DEMO_MERCHANT_RAMESH", language: "hi-IN" },
    check(data) {
      const ledger = data.executionOutput?.ledger;
      if (!ledger) return false;
      return (
        data.voiceReadout.includes(ledger.utr) &&
        data.voiceReadout.includes(formatInr(ledger.pending)) &&
        !data.voiceReadout.includes("629984129984")
      );
    },
  },
  {
    name: "mdr uses calculator",
    body: { query: "mdr fees on this payment", merchantId: "DEMO_MERCHANT_RAMESH", orderAmount: 3500, language: "en-IN" },
    check(data) {
      return data.rung === 2 && data.voiceReadout.includes("14");
    },
  },
  {
    name: "loan question is rung 3",
    body: { query: "loan credit vriddhi growth", merchantId: "DEMO_MERCHANT_RAMESH", language: "hi-IN" },
    check(data) {
      return data.rung === 3 && data.intent === "RUNG_3_VCG_CONTRACT" && /विकल्प|contract/i.test(data.voiceReadout);
    },
  },
  {
    name: "dispute question is rung 3",
    body: { query: "dispute status", merchantId: "DEMO_MERCHANT_RAMESH", language: "en-IN" },
    check(data) {
      const amount = data.executionOutput?.ledger?.disputeAmount;
      return data.rung === 3 && amount > 0 && data.voiceReadout.includes(formatInr(amount));
    },
  },
  {
    name: "latency is measured, not the old constants",
    body: { query: "aaj ka payment kitna hai", merchantId: "DEMO_MERCHANT_RAMESH", language: "en-IN" },
    check(data) {
      return typeof data.estimatedLatencyMs === "number" && data.executionOutput?.latencyMeasured === true;
    },
  },
];

function formatInr(n) {
  const rounded = Math.round(Number(n) * 100) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: rounded % 1 === 0 ? 0 : 2,
  }).format(rounded);
}

let passed = 0;
for (const item of cases) {
  const res = await fetch(`${base}/api/v1/brain/cycle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item.body),
  });
  const json = await res.json();
  const data = json.data || {};
  const ok = res.ok && json.success && item.check(data);
  if (ok) passed += 1;
  console.log(
    JSON.stringify({
      name: item.name,
      ok,
      http: res.status,
      rung: data.rung,
      intent: data.intent,
      ms: data.estimatedLatencyMs,
      voice: data.voiceReadout,
      ledgerOk: data.executionOutput?.ledger?.ok,
    }),
  );
}

console.log(JSON.stringify({ passed, total: cases.length, note: "not a 500-trace accuracy claim" }));
if (passed !== cases.length) process.exit(1);
