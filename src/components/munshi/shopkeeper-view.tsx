import React, { useState, useEffect } from "react";
import {
  QrCode,
  CreditCard,
  Building2,
  Volume2,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  Wifi,
  Battery,
  RefreshCw,
  Phone,
  HelpCircle,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { ReceiveMoneyModal } from "./modals/receive-money-modal";
import { TransactionDetailModal } from "./modals/transaction-detail-modal";
import { SettlementDetailModal } from "./modals/settlement-detail-modal";
import { SoundboxTroubleshootModal } from "./modals/soundbox-troubleshoot-modal";
import { VoiceAssistant } from "./voice-assistant";
import { munshiApi } from "@/lib/api-client";
import { playSwarChirp, speak } from "@/lib/munshi/audio";
import { getTranslation } from "@/lib/munshi/i18n";

interface ShopkeeperViewProps {
  lang: string;
  pane?: "all" | "payments" | "settlements" | "soundbox" | "voice" | "receive";
}

export function ShopkeeperView({ lang, pane = "all" }: ShopkeeperViewProps) {
  const t = getTranslation(lang);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [settlementModalOpen, setSettlementModalOpen] = useState(false);
  const [soundboxModalOpen, setSoundboxModalOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<any | null>(null);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "SUCCESS" | "SETTLED">("ALL");
  const [dbLive, setDbLive] = useState<{ ok: boolean; engine: string; error: string | null } | null>(null);
  const [livePulse, setLivePulse] = useState(false);

  const loadData = async () => {
    try {
      const txns = await munshiApi.getTransactions("DEMO_MERCHANT_RAMESH", "DEMO");
      setTransactions(txns);
    } catch (err) {
      console.error("Error loading transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 8000);
    munshiApi.getSystemHealth().then((health) => {
      if (health.database) setDbLive(health.database);
    }).catch(() => {
      setDbLive({ ok: false, engine: "postgres", error: "Health check failed" });
    });
    const stream = new EventSource("/api/v1/events/stream");
    stream.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as { type?: string };
        if (!payload.type || payload.type === "STREAM_CONNECTED") {
          setLivePulse(true);
          return;
        }
        setLivePulse(true);
        void loadData();
      } catch {
        /* ignore keepalives */
      }
    };
    return () => {
      clearInterval(interval);
      stream.close();
    };
  }, []);

  useEffect(() => {
    if (pane === "receive") setReceiveModalOpen(true);
  }, [pane]);

  const settledTotal = transactions
    .filter((row) => row.status === "SUCCESS" && row.settlement_status === "SETTLED")
    .reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const pendingTotal = transactions
    .filter((row) => row.status === "SUCCESS" && row.settlement_status !== "SETTLED")
    .reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const rupee = (n: number) =>
    n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const totalToday = transactions.reduce(
    (acc, t) => acc + (t.status === "SUCCESS" ? Number(t.amount) : 0),
    0
  );
  const successCount = transactions.filter((t) => t.status === "SUCCESS").length;

  const filteredTransactions = transactions.filter((t) => {
    if (activeFilter === "SUCCESS") return t.status === "SUCCESS";
    if (activeFilter === "SETTLED") return t.settlement_status === "SETTLED";
    return true;
  });

  return (
    <div className="w-full space-y-4 pb-8">
      <section className={`${pane === "all" || pane === "receive" ? "" : "hidden"} rounded-lg bg-white border border-[#e6e8ec] px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e8f7fd] text-[#0077a8] text-xs font-semibold">
              <Sparkles className="size-3" />
              {t.storeName}
            </span>
            <span className="text-xs text-[#536e92] font-mono bg-[#f4f6f9] px-2 py-0.5 rounded">
              {t.upiId}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${dbLive?.ok
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
                }`}
            >
              <span className={`size-1.5 rounded-full ${livePulse && dbLive?.ok ? "bg-emerald-500 animate-pulse" : "bg-current"}`} />
              {dbLive == null
                ? "Checking database…"
                : dbLive.ok
                  ? `Live ${dbLive.engine === "postgres" ? "PostgreSQL" : "PGlite"}`
                  : "PostgreSQL not connected"}
            </span>
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-[#1a1a1a]">
            {t.greetingTitle}
          </h2>
          <p className="text-xs text-[#6b7280] mt-1 max-w-xl">
            {t.greetingSub}
          </p>
          {dbLive && !dbLive.ok && (
            <p className="text-[11px] text-amber-800 mt-2 max-w-xl">
              Render PostgreSQL refused this DATABASE_URL. Copy External Database URL from the Render Connections panel. Until then the payment list is a local fallback, not the hosted database.
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setReceiveModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#00baf2] hover:bg-[#00a8dc] text-white font-semibold text-xs shadow-sm cursor-pointer"
          >
            <QrCode className="size-4" />
            {t.showQrBtn}
          </button>
          <button
            type="button"
            onClick={() => setSettlementModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-white border border-[#d9dee7] text-[#1a1a1a] font-semibold text-xs cursor-pointer"
          >
            <Zap className="size-4 text-[#00baf2]" />
            {t.instantSettlementBtn}
          </button>
        </div>
      </section>

      {/* 2. FOUR EQUAL-WIDTH QUICK ACTIONS IN ONE HORIZONTAL ROW */}
      <section className={pane === "all" ? "" : "hidden"}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Quick Action 1: Receive Money */}
          <button
            type="button"
            onClick={() => setReceiveModalOpen(true)}
            className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.06)] hover:border-[#00BAF2] hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="size-11 sm:size-12 rounded-2xl bg-[#00BAF2]/15 text-[#002970] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <QrCode className="size-5 sm:size-6 text-[#002970]" />
            </div>
            <div className="min-w-0">
              <span className="block font-black text-xs sm:text-sm text-[#002970] truncate">
                {t.qaReceiveMoney}
              </span>
              <span className="block text-[11px] text-gray-500 truncate mt-0.5">
                {t.qaReceiveMoneySub}
              </span>
            </div>
          </button>

          {/* Quick Action 2: View Payments */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("transactions-list");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.06)] hover:border-[#00BAF2] hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="size-11 sm:size-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CreditCard className="size-5 sm:size-6 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <span className="block font-black text-xs sm:text-sm text-[#002970] truncate">
                {t.qaPaymentHistory}
              </span>
              <span className="block text-[11px] text-gray-500 truncate mt-0.5">
                {t.qaPaymentHistorySub}
              </span>
            </div>
          </button>

          {/* Quick Action 3: Settlement */}
          <button
            type="button"
            onClick={() => setSettlementModalOpen(true)}
            className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.06)] hover:border-[#00BAF2] hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="size-11 sm:size-12 rounded-2xl bg-blue-50 text-[#002970] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Building2 className="size-5 sm:size-6 text-[#002970]" />
            </div>
            <div className="min-w-0">
              <span className="block font-black text-xs sm:text-sm text-[#002970] truncate">
                {t.qaBankSettlement}
              </span>
              <span className="block text-[11px] text-gray-500 truncate mt-0.5">
                {t.qaBankSettlementSub}
              </span>
            </div>
          </button>

          {/* Quick Action 4: Soundbox */}
          <button
            type="button"
            onClick={() => setSoundboxModalOpen(true)}
            className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.06)] hover:border-[#00BAF2] hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="size-11 sm:size-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Volume2 className="size-5 sm:size-6 text-amber-600" />
            </div>
            <div className="min-w-0">
              <span className="block font-black text-xs sm:text-sm text-[#002970] truncate">
                {t.qaSoundbox}
              </span>
              <span className="block text-[11px] text-emerald-600 font-bold truncate mt-0.5">
                {t.qaSoundboxSub}
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* 3. CLEAN TWO-COLUMN DESKTOP DASHBOARD (65% LEFT / 35% RIGHT) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ============================================================== */}
        {/* LEFT COLUMN (lg:col-span-7 xl:col-span-8)                      */}
        {/* ============================================================== */}
        <div className={`${pane === "all" || pane === "payments" || pane === "settlements" ? "" : "hidden"} ${pane === "all" ? "lg:col-span-7 xl:col-span-8" : "lg:col-span-12"} space-y-6`}>
          {/* Today's Business Card */}
          <div className={`${pane === "all" || pane === "settlements" ? "" : "hidden"} rounded-3xl bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,41,112,0.05)] border border-gray-100`}>
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs sm:text-sm font-black text-[#002970] uppercase tracking-wider">
                  {t.todayBusinessTitle}
                </h3>
              </div>
              <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200/60">
                <Clock className="size-3 text-gray-400" />
                {t.realTimeBadge}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
              {/* Total Today */}
              <div className="p-3 rounded-2xl bg-[#F0F8FF]/80 border border-blue-100">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
                  {t.totalPaymentsReceived}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#002970] mt-1 block">
                  ₹{loading ? "…" : rupee(totalToday)}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold mt-1 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="size-3" />
                  {successCount} {t.successfulPaymentsCount}
                </span>
              </div>

              {/* Settled in Bank */}
              <div className="p-3 rounded-2xl bg-white border border-gray-100">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
                  {t.bankSettledTitle}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1 block">
                  ₹{loading ? "…" : rupee(settledTotal)}
                </span>
                <span className="text-[10px] text-gray-500 font-mono block mt-1">
                  {t.bankSettledSub}
                </span>
              </div>

              {/* Pending Settlement */}
              <div className="p-3 rounded-2xl bg-white border border-gray-100">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
                  {t.pendingSettlementTitle}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-amber-600 mt-1 block">
                  ₹{loading ? "…" : rupee(pendingTotal)}
                </span>
                <span className="text-[10px] text-gray-500 block mt-1">
                  {t.pendingSettlementSub}
                </span>
              </div>

              {/* MDR Fee */}
              <div className="p-3 rounded-2xl bg-white border border-gray-100">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
                  {t.mdrBankFeeTitle}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1 block">
                  ₹0.00
                </span>
                <span className="inline-block text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded mt-1 border border-emerald-200">
                  {t.govtSubsidyPill}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Payments Card (Readable Table/List) */}
          <div id="transactions-list" className={`${pane === "all" || pane === "payments" ? "" : "hidden"} rounded-3xl bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,41,112,0.05)] border border-gray-100`}>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <CreditCard className="size-4 text-[#00BAF2]" />
                <h3 className="text-sm font-black text-[#002970] tracking-wide">
                  {t.recentPaymentsTitle}
                </h3>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5">
                {(["ALL", "SUCCESS", "SETTLED"] as const).map((filterKey) => (
                  <button
                    key={filterKey}
                    type="button"
                    onClick={() => setActiveFilter(filterKey)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeFilter === filterKey
                        ? "bg-[#002970] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {filterKey === "ALL" ? t.filterAll : filterKey === "SUCCESS" ? t.filterSuccess : t.filterSettled}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={loadData}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-[#002970] hover:bg-gray-100 transition-colors cursor-pointer"
                  title={lang === "kn-IN" ? "ರಿಫ್ರೆಶ್ ಮಾಡಿ" : lang === "en-IN" ? "Refresh" : "रीफ्रेश करें"}
                >
                  <RefreshCw className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Structured Payment List */}
            <div className="divide-y divide-gray-100 mt-2">
              {filteredTransactions.length === 0 ? (
                <div className="py-10 text-center text-xs text-gray-400 font-medium">
                  {t.noPaymentsFound}
                </div>
              ) : (
                filteredTransactions.map((txn) => (
                  <div
                    key={txn.txn_id}
                    onClick={() => setSelectedTxn(txn)}
                    className="py-3.5 px-3 -mx-3 flex items-center justify-between hover:bg-[#F8FAFC] rounded-2xl transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="size-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs">
                        <CheckCircle2 className="size-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs sm:text-sm text-gray-900 group-hover:text-[#002970] transition-colors">
                            {txn.payer_vpa || "customer@paytm"}
                          </span>
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                            UPI
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400 mt-0.5 block">
                          {new Date(txn.created_at || Date.now()).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {" • "}
                          RRN: {txn.rrn || "RRN-482910"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-black text-sm sm:text-base text-emerald-600 block">
                          +₹{Number(txn.amount).toFixed(2)}
                        </span>
                        <span
                          className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${txn.settlement_status === "SETTLED"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                            }`}
                        >
                          {txn.settlement_status === "SETTLED" ? t.creditedToBank : t.settlingTonight}
                        </span>
                      </div>
                      <ChevronRight className="size-4 text-gray-300 group-hover:text-[#002970] transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN (lg:col-span-5 xl:col-span-4)                     */}
        {/* ============================================================== */}
        <div className={`${pane === "all" || pane === "voice" || pane === "soundbox" ? "" : "hidden"} ${pane === "all" ? "lg:col-span-5 xl:col-span-4" : "lg:col-span-12"} space-y-6`}>
          <div id="voice-panel" className={pane === "all" || pane === "voice" ? "" : "hidden"}>
            <VoiceAssistant lang={lang} />
          </div>

          {/* Soundbox 4.0 Telemetry Card */}
          <div id="soundbox-panel" className={`${pane === "all" || pane === "soundbox" ? "" : "hidden"} rounded-lg bg-white p-5 shadow-sm border border-[#e6e8ec]`}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Volume2 className="size-4 text-[#00BAF2]" />
                <h3 className="text-xs sm:text-sm font-black text-[#002970] uppercase tracking-wide">
                  {t.soundboxStatusTitle}
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t.online}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3.5">
              <div className="size-13 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shrink-0">
                <Volume2 className="size-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-[#002970]">
                  {t.soundboxModel}
                </h4>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">IMEI: 860123456789012</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-600">
                  <span className="flex items-center gap-1 font-bold">
                    <Battery className="size-3.5 text-emerald-600" />
                    88% {t.battery}
                  </span>
                  <span className="flex items-center gap-1 font-bold">
                    <Wifi className="size-3.5 text-blue-600" />
                    4G VoLTE
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  playSwarChirp("100");
                  const phrase =
                    lang === "kn-IN"
                      ? "ಪೇಟಿಎಂ ನಲ್ಲಿ ₹100 ಸ್ವೀಕರಿಸಲಾಗಿದೆ."
                      : lang === "en-IN"
                        ? "Received 100 rupees on Paytm."
                        : "पेटीएम पर एक सौ रुपये प्राप्त हुए।";
                  speak(phrase, lang);
                }}
                className="py-2.5 px-3 rounded-xl bg-[#F0F8FF] hover:bg-[#E0F6FD] text-[#002970] font-black text-xs border border-blue-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="size-3.5" />
                {t.audioTestBtn}
              </button>
              <button
                type="button"
                onClick={() => setSoundboxModalOpen(true)}
                className="py-2.5 px-3 rounded-xl border border-gray-200 hover:border-[#00BAF2] text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer"
              >
                {t.troubleshootBtn}
              </button>
            </div>
          </div>

          {/* Merchant Support / Field Executive Contact Card */}
          <div className={`${pane === "all" ? "" : "hidden"} rounded-3xl bg-white p-5 shadow-[0_2px_12px_rgba(0,41,112,0.05)] border border-gray-100`}>
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <ShieldCheck className="size-4 text-[#00BAF2]" />
              <h3 className="text-xs sm:text-sm font-black text-[#002970] uppercase tracking-wide">
                {t.supportTitle}
              </h3>
            </div>

            <div className="mt-3.5 flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-blue-50 text-[#002970] flex items-center justify-center font-black text-sm shrink-0 border border-blue-200">
                {lang === "kn-IN" ? "ಅರುಣ್" : lang === "en-IN" ? "Arun" : "अरुण"}
              </div>
              <div className="min-w-0">
                <span className="font-extrabold text-xs text-[#002970] block truncate">
                  {t.fseName}
                </span>
                <span className="text-[11px] text-gray-500 block truncate">
                  {t.fseBeat}
                </span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() =>
                  alert(
                    lang === "kn-IN"
                      ? "ಫೀಲ್ಡ್ ಅಧಿಕಾರಿ ಅರುಣ್ ಶರ್ಮಾ ಅವರಿಗೆ ಕರೆ ಮಾಡಲಾಗುತ್ತಿದೆ: +91 9123456780"
                      : lang === "en-IN"
                        ? "Calling Field Executive Arun Sharma: +91 9123456780"
                        : "फ़ील्ड अधिकारी अरुण शर्मा को कॉल किया जा रहा है: +91 9123456780"
                  )
                }
                className="flex-1 py-2 px-3 rounded-xl bg-[#002970] hover:bg-[#001738] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Phone className="size-3" />
                {t.callFseBtn}
              </button>
              <button
                type="button"
                onClick={() =>
                  alert(
                    lang === "kn-IN"
                      ? "ಪೇಟಿಎಂ ಮರ್ಚೆಂಟ್ ಸಹಾಯವಾಣಿ ಟಿಕೆಟ್ #TKT-884 ದಾಖಲಾಗಿದೆ."
                      : lang === "en-IN"
                        ? "Paytm Merchant Helpdesk Ticket #TKT-884 has been created."
                        : "Paytm मर्चेंट हेल्पडेस्क टिकट #TKT-884 दर्ज हो चुका है।"
                  )
                }
                className="flex-1 py-2 px-3 rounded-xl border border-gray-200 hover:border-[#00BAF2] text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="size-3" />
                {t.helpTicketBtn}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <ReceiveMoneyModal
        isOpen={receiveModalOpen}
        onClose={() => setReceiveModalOpen(false)}
        lang={lang}
        onPaymentSuccess={loadData}
      />

      <SettlementDetailModal
        isOpen={settlementModalOpen}
        onClose={() => setSettlementModalOpen(false)}
        lang={lang}
        onSettled={loadData}
      />

      <SoundboxTroubleshootModal
        isOpen={soundboxModalOpen}
        onClose={() => setSoundboxModalOpen(false)}
        lang={lang}
      />

      <TransactionDetailModal
        transaction={selectedTxn}
        onClose={() => setSelectedTxn(null)}
        lang={lang}
      />
    </div>
  );
}
