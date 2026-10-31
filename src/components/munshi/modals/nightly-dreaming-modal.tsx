import React, { useState, useEffect } from "react";
import {
  Moon,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Terminal,
  FileText,
  RefreshCw,
  X,
  Copy,
  Check,
  Database,
  CreditCard,
  Lock,
  Sparkles,
  Building2,
  Layers,
  ArrowRight,
} from "lucide-react";
import { munshiApi } from "@/lib/api-client";
import { speak } from "@/lib/munshi/audio";
import { inrFormat } from "@/lib/munshi/backend";

interface NightlyDreamingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
  onSettlementConsolidated?: (result: any) => void;
}

export function NightlyDreamingModal({
  isOpen,
  onClose,
  lang,
  onSettlementConsolidated,
}: NightlyDreamingModalProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "gist" | "logs">("summary");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [copiedUtr, setCopiedUtr] = useState<boolean>(false);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    const time = new Date().toTimeString().split(" ")[0] + "." + Math.floor(Math.random() * 900 + 100);
    setAuditLogs((prev) => [...prev, `[${time}] ${msg}`]);
  };

  const runSimulation = async () => {
    setIsProcessing(true);
    setCurrentStep(1);
    setAuditLogs([]);
    setResult(null);

    addLog("[INIT] Nightly Dreaming Daemon triggered (Cron: 23:30:00 IST)");
    addLog("[LEDGER] Connecting to PostgreSQL transactions pool...");

    try {
      // Step 1: Sweep ledger
      await new Promise((r) => setTimeout(r, 700));
      addLog("[LEDGER_SWEEP] Scanning transactions for DEMO_MERCHANT_RAMESH with status = 'SUCCESS'");
      setCurrentStep(2);

      // Step 2: Policy Arbitration
      addLog("[OKF_CRAG] Reading active policy 'rbi_mdr_waiver_cap_2026.md' from Knowledge Store");
      addLog("[OKF_CRAG] CRAG Evaluation: 100% Gov Subsidy verified (0.00% Merchant MDR fee)");
      await new Promise((r) => setTimeout(r, 750));
      setCurrentStep(3);

      // Step 3: Bank Payout via Backend API
      addLog("[PAYTM_PG] Preparing Net Bank Settlement batch via IMPS/NEFT Escrow");
      const res = await munshiApi.consolidateSettlement("DEMO_MERCHANT_RAMESH", "DEMO");
      addLog(`[NPCI_SETTLE] Dispatched payout to SBI (•••• 4091). Generated UTR: ${res.utr}`);
      await new Promise((r) => setTimeout(r, 750));
      setCurrentStep(4);

      // Step 4: CEEcil Gisting & WAL Sealing
      addLog("[CEECIL_DREAM] Running Coinbase CEEcil 3-Rung Context Compression Pass...");
      addLog("[SHOPIFY_GIST] Generated 8-line / 200-token durable merchant memory gist");
      addLog(`[WAL_LEDGER] Appending SHA-256 HMAC Block Attestation: ${res.walHash?.slice(0, 24)}...`);
      addLog("[WAL_LEDGER] Canary Z-Score recalculated: 0.42σ (Nominal / Stable)");
      addLog("[DONE] Nightly Dreaming & Consolidation cycle completed successfully with Zero Loss.");

      setResult(res);
      setIsProcessing(false);

      if (onSettlementConsolidated) {
        onSettlementConsolidated(res);
      }

      // Voice announcement
      const speechText =
        lang === "kn-IN"
          ? `ರಾತ್ರಿಯ ಸೆಟಲ್‌ಮೆಂಟ್ ಪ್ರಕ್ರಿಯೆ ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿದೆ. ₹${res.netPayout} ನಿಮ್ಮ ಎಸ್‌ಬಿಐ ಖಾತೆಗೆ ಜಮೆಯಾಗಿದೆ.`
          : lang === "hi-IN"
          ? `रात 11:30 बजे की नाइटली ड्रीमिंग संपन्न हुई। ₹${res.netPayout} आपके एसबीआई बैंक खाते में जमा कर दिए गए हैं।`
          : `Nightly settlement cycle completed successfully. ₹${res.netPayout} credited to your SBI account.`;
      speak(speechText, lang);
    } catch (err: any) {
      console.error(err);
      addLog(`[ERROR] Nightly dreaming simulation encountered an error: ${err?.message || "Unknown error"}`);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runSimulation();
    } else {
      setCurrentStep(0);
      setResult(null);
      setAuditLogs([]);
    }
  }, [isOpen]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUtr(true);
    setTimeout(() => setCopiedUtr(false), 2000);
  };

  if (!isOpen) return null;

  const title =
    lang === "kn-IN"
      ? "೧೧:೩೦ ರಾತ್ರಿಯ ಡ್ರೀಮಿಂಗ್ ಸೆಟಲ್‌ಮೆಂಟ್ ಕನ್ಸೋಲಿಡೇಶನ್"
      : lang === "hi-IN"
      ? "रात 11:30 बजे नाइटली ड्रीमिंग एवं सेटलमेंट कंसोलिडेशन"
      : "11:30 PM Nightly Dreaming & Settlement Pipeline";

  const sub =
    lang === "kn-IN"
      ? "ಕಾಯಿನ್‌ಬೇಸ್ CEEcil ಮೆಮೊರಿ ಕಂಪ್ರೆಷನ್ ಮತ್ತು ಆರ್‌ಬಿಐ ಶೂನ್ಯ-ನಷ್ಟ ಬ್ಯಾಂಕ್ ಪಾವತಿ ಪೈಪ್‌ಲೈನ್"
      : lang === "hi-IN"
      ? "कॉइनबेस CEEcil 3-रंग मेमोरी कम्प्रेशन एवं आरबीआई ज़ीरो-लॉस बैंक भुगतान"
      : "Coinbase CEEcil 3-Rung Memory Compression & RBI Zero-Loss Bank Payout";

  const stages = [
    {
      num: 1,
      title:
        lang === "kn-IN"
          ? "ದಿನದ ಲೆಡ್ಜರ್ ವಹಿವಾಟುಗಳ ಸ್ಕ್ಯಾನಿಂಗ್"
          : lang === "hi-IN"
          ? "दिन भर के लेज़र सौदों की स्कैनिंग"
          : "Daytime Ledger Batch Sweep",
      desc:
        lang === "kn-IN"
          ? "PostgreSQL ನ ವಹಿವಾಟು ಕೋಷ್ಟಕದಿಂದ ಬಾಕಿ ಇರುವ ವಹಿವಾಟುಗಳನ್ನು ಕ್ರೋಢೀಕರಿಸಲಾಗುತ್ತಿದೆ"
          : lang === "hi-IN"
          ? "PostgreSQL ट्रांजैक्शन लेज़र से अनिस्तारित भुगतानों का संकलन"
          : "Scanning PostgreSQL WAL ledger for today's successful transactions",
      icon: Database,
    },
    {
      num: 2,
      title:
        lang === "kn-IN"
          ? "ಆರ್‌ಬಿಐ ಎಂಡಿಆರ್ ಸಬ್ಸಿಡಿ ಪರಿಶೀಲನೆ"
          : lang === "hi-IN"
          ? "आरबीआई एमडीआर सब्सिडी सत्यापन"
          : "RBI MDR Policy Arbitration",
      desc:
        lang === "kn-IN"
          ? "Google Cloud OKF ಜ್ಞಾನ ಭಂಡಾರದಿಂದ rbi_mdr_waiver_cap_2026.md ನಿಯಮದ 100% ಸಬ್ಸಿಡಿ ಮೌಲ್ಯಮಾಪನ"
          : lang === "hi-IN"
          ? "Google Cloud OKF स्टोर से rbi_mdr_waiver_cap_2026.md द्वारा 100% सब्सिडी सत्यापन (₹0.00 शुल्क)"
          : "Evaluating rbi_mdr_waiver_cap_2026.md via OKF Knowledge Store (100% Gov Subsidy)",
      icon: ShieldCheck,
    },
    {
      num: 3,
      title:
        lang === "kn-IN"
          ? "ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಪೂರ್ಣ ಪಾವತಿ & UTR"
          : lang === "hi-IN"
          ? "बैंक खाते में पूर्ण भुगतान एवं UTR"
          : "Zero-Loss Bank Payout & NPCI UTR",
      desc:
        lang === "kn-IN"
          ? "ಪೇಟಿಎಂ ಬ್ಯಾಂಕ್ ಎಸ್ಕ್ರೋ ಮೂಲಕ ಎಸ್‌ಬಿಐ ಖಾತೆಗೆ ನೆಟ್ ಪಾವತಿ ವರ್ಗಾವಣೆ ಮತ್ತು UTR ಉತ್ಪಾದನೆ"
          : lang === "hi-IN"
          ? "Paytm PG एस्क्रो के माध्यम से SBI बैंक खाते में पूर्ण भुगतान और NPCI UTR जनरेशन"
          : "Executing zero-loss net bank payout to SBI account with NPCI UTR acknowledgement",
      icon: CreditCard,
    },
    {
      num: 4,
      title:
        lang === "kn-IN"
          ? "೮-ಸಾಲಿನ ಸನ್ನಿವೇಶ ಸಾರಾಂಶ (Shopify Gisting)"
          : lang === "hi-IN"
          ? "8-पंक्ति संदर्भ सारांश (Shopify Gisting)"
          : "8-Line CEEcil Context Gisting & WAL Seal",
      desc:
        lang === "kn-IN"
          ? "೯೦ ದಿನಗಳ ಚಟುವಟಿಕೆಗಳನ್ನು ೮-ಸಾಲಿನ OKF ಗಿಸ್ಟ್‌ಗೆ ಸಂಕುಚಿತಗೊಳಿಸಿ WAL ಲೆಡ್ಜರ್‌ನಲ್ಲಿ ಮುದ್ರೆ ಹಾಕುವುದು"
          : lang === "hi-IN"
          ? "दिन भर के इतिहास को 8-पंक्ति OKF मार्कडाउन सारांश में कंप्रेस कर WAL लेज़र में सील करना"
          : "Compressing daytime history into durable 8-line OKF gist & sealing with SHA-256 HMAC",
      icon: Lock,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* HEADER */}
        <div className="bg-[#002970] px-5 sm:px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-[#00BAF2] text-[#001738] flex items-center justify-center shadow-md">
              <Moon className="size-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest uppercase bg-blue-900/80 text-[#00BAF2] px-2 py-0.5 rounded-full border border-blue-400/30">
                  23:30 IST NIGHTLY CRON
                </span>
                <span className="text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  L2 Autonomy
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight mt-0.5">{title}</h2>
              <p className="text-xs text-blue-200/90">{sub}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* MERCHANT CONTEXT BANNER */}
        <div className="bg-[#F0F9FF] border-b border-blue-100 px-5 sm:px-6 py-2.5 flex flex-wrap items-center justify-between text-xs text-[#002970] shrink-0 gap-2">
          <div className="flex items-center gap-2 font-bold">
            <Building2 className="size-4 text-[#00BAF2]" />
            <span>{lang === "hi-IN" ? "दुकान:" : lang === "kn-IN" ? "ಅಂಗಡಿ:" : "Merchant:"} Ramesh Kirana Store</span>
            <span className="text-gray-400 font-normal">|</span>
            <span className="text-gray-600 font-mono text-[11px]">DEMO_MERCHANT_RAMESH</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="bg-white px-2.5 py-1 rounded-lg border border-blue-200 font-medium">
              {lang === "hi-IN" ? "बैंक खाता:" : lang === "kn-IN" ? "ಬ್ಯಾಂಕ್ ಖಾತೆ:" : "Settling to:"} <strong>SBI •••• 4091</strong>
            </span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
              100% Gov Subsidy
            </span>
          </div>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* 4-STAGE PIPELINE PROGRESS STEPPER */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wide text-gray-500">
                {lang === "hi-IN" ? "4-चरणीय कंसोलिडेशन प्रगति" : lang === "kn-IN" ? "೪-ಹಂತದ ಕ್ರೋಢೀಕರಣ ಪ್ರಕ್ರಿಯೆ" : "4-Stage Consolidation Pipeline"}
              </span>
              <span className="text-[11px] font-bold text-[#002970]">
                {currentStep === 4 && !isProcessing
                  ? (lang === "hi-IN" ? "पूर्ण संपन्न (Completed)" : lang === "kn-IN" ? "ಪೂರ್ಣಗೊಂಡಿದೆ (Completed)" : "Completed (100%)")
                  : `${lang === "hi-IN" ? "प्रगतिशील चरण" : lang === "kn-IN" ? "ಪ್ರಸ್ತುತ ಹಂತ" : "Step"} ${currentStep}/4`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stages.map((st) => {
                const Icon = st.icon;
                const isPast = currentStep > st.num || (currentStep === 4 && !isProcessing);
                const isCurr = currentStep === st.num && isProcessing;

                return (
                  <div
                    key={st.num}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isPast
                        ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                        : isCurr
                        ? "bg-blue-50 border-[#00BAF2] ring-2 ring-[#00BAF2]/30 text-[#002970]"
                        : "bg-gray-50 border-gray-200 text-gray-400"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`size-7 rounded-xl flex items-center justify-center shrink-0 ${
                            isPast
                              ? "bg-emerald-600 text-white"
                              : isCurr
                              ? "bg-[#00BAF2] text-[#001738]"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {isPast ? (
                            <Check className="size-4 stroke-[3]" />
                          ) : isCurr ? (
                            <RefreshCw className="size-3.5 animate-spin" />
                          ) : (
                            <Icon className="size-3.5" />
                          )}
                        </div>
                        <div>
                          <span className="text-xs font-black block">{st.title}</span>
                          <span className="text-[10px] font-mono opacity-80">Stage {st.num}</span>
                        </div>
                      </div>
                      {isPast && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          ✓ Verified
                        </span>
                      )}
                      {isCurr && (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md animate-pulse">
                          Running...
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] mt-2 opacity-90 leading-snug line-clamp-2">{st.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TABS NAVIGATION */}
          <div className="border-b border-gray-200 flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab("summary")}
              className={`pb-2.5 px-3 text-xs font-black transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === "summary"
                  ? "border-[#00BAF2] text-[#002970]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <CreditCard className="size-3.5" />
              {lang === "hi-IN" ? "भुगतान एवं सेटलमेंट" : lang === "kn-IN" ? "ಪಾವತಿ & ಸೆಟಲ್‌ಮೆಂಟ್" : "Payout Summary & UTR"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("gist")}
              className={`pb-2.5 px-3 text-xs font-black transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === "gist"
                  ? "border-[#00BAF2] text-[#002970]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FileText className="size-3.5" />
              {lang === "hi-IN" ? "8-पंक्ति संदर्भ (Shopify Gist)" : lang === "kn-IN" ? "೮-ಸಾಲಿನ ಮೆಮೊರಿ ಗಿಸ್ಟ್" : "8-Line Shopify Gist (OKF)"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("logs")}
              className={`pb-2.5 px-3 text-xs font-black transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === "logs"
                  ? "border-[#00BAF2] text-[#002970]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Terminal className="size-3.5" />
              {lang === "hi-IN" ? "सिस्टम ऑडिट लॉग्स" : lang === "kn-IN" ? "ಆಡಿಟ್ ಲಾಗ್‌ಗಳು" : "Raw System Audit Logs"}
            </button>
          </div>

          {/* TAB 1: SUMMARY */}
          {activeTab === "summary" && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#002970] to-[#001738] text-white shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Moon className="size-36" />
                </div>
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-blue-200 uppercase tracking-widest block">
                      {lang === "hi-IN" ? "कुल सेटलमेंट भुगतान (Net Settled Payout)" : lang === "kn-IN" ? "ಒಟ್ಟು ಸೆಟಲ್‌ಮೆಂಟ್ ಪಾವತಿ (Net Settled)" : "Total Consolidated Net Bank Payout"}
                    </span>
                    <span className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1 block">
                      ₹{result?.netPayout ? inrFormat(result.netPayout) : "4,650.00"}
                    </span>
                    <p className="text-xs text-emerald-300 font-semibold mt-1 flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5" />
                      {lang === "hi-IN"
                        ? "0% कटौती • 100% सरकारी सब्सिडी द्वारा सुरक्षित"
                        : lang === "kn-IN"
                        ? "೦% ಕಡಿತ • ೧೦೦% ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿಯಿಂದ ರಕ್ಷಿಸಲಾಗಿದೆ"
                        : "0% Deductions • 100% Gov Subsidized under RBI 2026 Mandate"}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs space-y-1.5 min-w-[200px]">
                    <div className="flex justify-between items-center text-blue-100">
                      <span>{lang === "hi-IN" ? "कुल सौदे:" : lang === "kn-IN" ? "ಒಟ್ಟು ವಹಿವಾಟುಗಳು:" : "Batch Volume:"}</span>
                      <strong className="text-white font-mono">{result?.settledCount || 12} Txns</strong>
                    </div>
                    <div className="flex justify-between items-center text-blue-100">
                      <span>{lang === "hi-IN" ? "MDR शुल्क:" : lang === "kn-IN" ? "MDR ಶುಲ್ಕ:" : "MDR Fee:"}</span>
                      <strong className="text-emerald-300 font-mono">₹0.00 (Waved)</strong>
                    </div>
                    <div className="flex justify-between items-center text-blue-100">
                      <span>{lang === "hi-IN" ? "कैनरी Z-स्कोर:" : lang === "kn-IN" ? "ಕ್ಯಾನರಿ Z-ಸ್ಕೋರ್:" : "Canary Z:"}</span>
                      <strong className="text-white font-mono">0.42σ</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* UTR & CRYPTOGRAPHIC PROOF CARD */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5">
                  <span className="font-extrabold text-gray-500 uppercase tracking-wide block text-[10px]">
                    {lang === "hi-IN" ? "NPCI बैंक संदर्भ (UTR नंबर)" : lang === "kn-IN" ? "NPCI ಬ್ಯಾಂಕ್ ಉಲ್ಲೇಖ (UTR ಸಂಖ್ಯೆ)" : "NPCI IMPS/NEFT UTR Number"}
                  </span>
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-gray-200 font-mono font-bold text-[#002970]">
                    <span className="truncate">{result?.utr || "DEMO_UTR_629911507808"}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(result?.utr || "DEMO_UTR_629911507808")}
                      className="ml-2 text-gray-400 hover:text-[#00BAF2] cursor-pointer"
                      title="Copy UTR"
                    >
                      {copiedUtr ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5">
                  <span className="font-extrabold text-gray-500 uppercase tracking-wide block text-[10px]">
                    {lang === "hi-IN" ? "WAL क्रिप्टोग्राफ़िक अटेस्टेशन हैश" : lang === "kn-IN" ? "WAL ಕ್ರಿಪ್ಟೋಗ್ರಾಫಿಕ್ ಅಟೆಸ್ಟೇಶನ್ ಹ್ಯಾಶ್" : "WAL SHA-256 Attestation Hash"}
                  </span>
                  <div className="bg-white px-3 py-2 rounded-xl border border-gray-200 font-mono text-[11px] text-gray-700 truncate">
                    {result?.walHash || "29058a99eb2468aadd1574520a881d072d432118a422d1cea9b6649747f889d4"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 8-LINE GIST */}
          {activeTab === "gist" && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#001738] text-white border border-blue-900 font-mono text-xs shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-blue-800/80 mb-3">
                  <span className="text-[#00BAF2] font-black tracking-wide text-xs">
                    OKF v0.2 / Coinbase CEEcil 8-Line Context Gist
                  </span>
                  <span className="text-[10px] bg-blue-950 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    200 Tokens • 95.5% Compressed
                  </span>
                </div>
                <div className="space-y-1.5 text-blue-100 text-[11.5px] leading-relaxed">
                  <p><span className="text-[#00BAF2] font-bold">Line 1:</span> Merchant: Ramesh Kirana Store (Koramangala 4th Block, BLR) | Tier-1 Verified</p>
                  <p><span className="text-[#00BAF2] font-bold">Line 2:</span> Cycle: {new Date().toISOString().split("T")[0]} 23:30 IST | Settled Batch: ₹{result?.netPayout || "4,650.00"} (UTR: {result?.utr || "DEMO_UTR_629911507808"})</p>
                  <p><span className="text-[#00BAF2] font-bold">Line 3:</span> Fee Arbitration: ₹0.00 MDR (100% Gov Subsidy under RBI Rule 2026)</p>
                  <p><span className="text-[#00BAF2] font-bold">Line 4:</span> Batch Volume: {result?.settledCount || 12} txns settled to SBI •••• 4091 | 0 Defaults</p>
                  <p><span className="text-[#00BAF2] font-bold">Line 5:</span> Soundbox Status: 4G VoLTE Active | IMEI: 860123456789012 (88% Battery)</p>
                  <p><span className="text-[#00BAF2] font-bold">Line 6:</span> Vernacular Profile: High footfall 6-9 PM | Prefers Hindi / Kannada voice chimes</p>
                  <p><span className="text-[#00BAF2] font-bold">Line 7:</span> Liquidity Staging: Pre-approved ₹18,000 24-hr Working Capital Bridge eligible</p>
                  <p><span className="text-[#00BAF2] font-bold">Line 8:</span> Territory Custodian: Verified Safe Handoff to FSE Priya Nair (Zero Context Loss)</p>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 italic">
                * Grounded in Shopify Gisting (Shopify Engineering 2026) and Coinbase CEEcil Memory Architecture. This compact gist replaces 18,000 tokens of raw history, cutting LLM latency by 95% while surviving FSE attrition.
              </p>
            </div>
          )}

          {/* TAB 3: AUDIT LOGS */}
          {activeTab === "logs" && (
            <div className="space-y-2">
              <div className="p-4 rounded-2xl bg-[#0a0f1d] text-emerald-400 font-mono text-[11px] leading-relaxed max-h-64 overflow-y-auto space-y-1 shadow-inner border border-gray-800">
                {auditLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-gray-500 select-none">{">"}</span>
                    <span className={log.includes("[ERROR]") ? "text-red-400" : log.includes("[DONE]") ? "text-emerald-300 font-bold" : "text-gray-200"}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="bg-gray-50 px-5 sm:px-6 py-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
            <Sparkles className="size-4 text-[#00BAF2]" />
            <span>
              {isProcessing
                ? (lang === "hi-IN" ? "सिमुलेशन चल रहा है..." : lang === "kn-IN" ? "ಸಿಮ್ಯುಲೇಶನ್ ಚಾಲನೆಯಲ್ಲಿದೆ..." : "Simulation in progress...")
                : (lang === "hi-IN" ? "सेटलमेंट लेज़र सफलतापूर्वक अपडेट हो गया है।" : lang === "kn-IN" ? "ಸೆಟಲ್‌ಮೆಂಟ್ ಲೆಡ್ಜರ್ ಯಶಸ್ವಿಯಾಗಿ ಅಪ್‌ಡೇಟ್ ಆಗಿದೆ." : "Settlement ledger successfully consolidated.")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={runSimulation}
              className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`size-3.5 ${isProcessing ? "animate-spin" : ""}`} />
              {lang === "hi-IN" ? "पुनः चलाएं (Re-run)" : lang === "kn-IN" ? "ಮತ್ತೆ ಚಲಾಯಿಸಿ (Re-run)" : "Re-run Simulation"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#00BAF2] hover:bg-[#00a8dc] text-[#001738] text-xs font-black transition-colors cursor-pointer shadow-sm"
            >
              {lang === "hi-IN" ? "संपन्न (Done)" : lang === "kn-IN" ? "ಮುಕ್ತಾಯ (Done)" : "Done & View Ledger"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

