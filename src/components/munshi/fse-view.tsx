import React, { useState, useEffect } from "react";
import {
  MapPin,
  Store,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  Send,
  Volume2,
  ArrowRight,
  ShieldAlert,
  FileText,
  UserMinus,
  Sparkles,
  RefreshCw,
  Phone,
  Calendar,
  CheckSquare,
} from "lucide-react";
import { munshiApi } from "@/lib/api-client";
import { speak } from "@/lib/munshi/audio";
import { getTranslation } from "@/lib/munshi/i18n";

interface FseViewProps {
  lang: string;
}

export function FseView({ lang }: FseViewProps) {
  const t = getTranslation(lang);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [memories, setMemories] = useState<any[]>([]);
  const [handoffSuccess, setHandoffSuccess] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");

  const loadFseData = async () => {
    try {
      const d = await munshiApi.getDisputes("DEMO_MERCHANT_RAMESH", "DEMO");
      setDisputes(d);
      const m = await munshiApi.getMemories("DEMO_MERCHANT_RAMESH", "DEMO");
      setMemories(m);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadFseData();
  }, []);

  const handleResolveDispute = async (disputeId: string, action: string) => {
    try {
      await munshiApi.updateDispute(
        disputeId,
        action,
        lang === "kn-IN"
          ? "FSE ಅರುಣ್ ಶರ್ಮಾ ಪರಿಶೀಲಿಸಿದ್ದಾರೆ: ಯುಡಿಐಆರ್ ರಿವರ್ಸಲ್ ಅನುಮೋದಿಸಲಾಗಿದೆ"
          : lang === "en-IN"
            ? "Verified by FSE Arun Sharma: Bank UDIR reversal approved"
            : "FSE अरुण शर्मा द्वारा सत्यापित: बैंक यूडीआईआर रिवर्सल स्वीकृत",
        "DEMO"
      );
      setActionMsg(lang === "kn-IN" ? `ವಿವಾದ ನವೀಕರಣ ಯಶಸ್ವಿ (${action}): ಯುಡಿಐಆರ್ ಆಟೋ-ಕ್ರೆಡಿಟ್ ಅನ್ವಯಿಸಲಾಗಿದೆ.` : lang === "en-IN" ? `Dispute updated (${action}): UDIR auto-credit processed.` : `विवाद अद्यतन सफल (${action}): यूडीआईआर ऑटो-क्रेडिट लागू किया गया।`);
      speak(lang === "kn-IN" ? "ವಿವಾದವನ್ನು ಇತ್ಯರ್ಥಪಡಿಸಲಾಗಿದೆ." : lang === "en-IN" ? "Dispute has been resolved." : "विवाद का निपटारा कर दिया गया है।", lang);
      loadFseData();
      setTimeout(() => setActionMsg(null), 4000);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleTerritoryHandoff = async () => {
    try {
      const res = await munshiApi.initiateHandoff(
        "DEMO_FSE_ARUN",
        "DEMO_FSE_PRIYA",
        lang === "kn-IN"
          ? "ರಮೇಶ್ ಜಿ ಸಂಜೆ 6 ರಿಂದ 9 ರವರೆಗೆ ಕಾರ್ಯನಿರತರಾಗಿರುತ್ತಾರೆ; ಸೌಂಡ್‌ಬಾಕ್ಸ್ 88% ಬ್ಯಾಟರಿಯಲ್ಲಿದೆ; ಯಾವುದೇ ಬಾಕಿ ದೂರುಗಳಿಲ್ಲ."
          : lang === "en-IN"
            ? "Ramesh ji is busy 6-9 PM; Soundbox at 88% battery; zero pending issues."
            : "रमेश जी शाम 6 से 9 बजे व्यस्त रहते हैं; साउंडबॉक्स 88% बैटरी पर है; कोई लंबित शिकायत नहीं।",
        "DEMO_MERCHANT_RAMESH",
        "DEMO"
      );
      setHandoffSuccess(lang === "kn-IN" ? "ಕಾರ್ಯಭಾರ ಯಶಸ್ವಿಯಾಗಿ ವರ್ಗಾವಣೆಯಾಗಿದೆ: FSE ಪ್ರಿಯಾ ನಾಯರ್ ಅವರಿಗೆ ವಿವರ ಒಪ್ಪಿಸಲಾಗಿದೆ." : lang === "en-IN" ? "Territory handoff successful: Full context transferred to FSE Priya Nair." : "कार्यभार सफलतापूर्वक हस्तांतरित: FSE प्रिया नायर को संपूर्ण संदर्भ सौंपा गया।");
      speak(lang === "kn-IN" ? "ಸುರಕ್ಷಿತ ವರ್ಗಾವಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ." : lang === "en-IN" ? "Safe territory handoff completed." : "सुरक्षित हैंडऑफ संपन्न हुआ।", lang);
      loadFseData();
      setTimeout(() => setHandoffSuccess(null), 5000);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      await fetch("/api/v1/memory/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantId: "DEMO_MERCHANT_RAMESH",
          topic: "FSE_FIELD_VISIT",
          summary: newNote,
          sentiment: "POSITIVE",
          mode: "DEMO",
        }),
      });
      setNewNote("");
      loadFseData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full space-y-4">
      <section className="rounded-lg bg-white border border-[#e6e8ec] px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <UserCheck className="size-3" />
              {lang === "hi-IN"
                ? "FSE अरुण शर्मा (ID: DEMO_FSE_ARUN • 9123456780)"
                : lang === "kn-IN"
                  ? "FSE ಅರುಣ್ ಶರ್ಮಾ (ID: DEMO_FSE_ARUN • 9123456780)"
                  : "FSE Arun Sharma (ID: DEMO_FSE_ARUN • 9123456780)"}
            </span>
            <span className="text-xs text-[#536e92] font-mono bg-[#f4f6f9] px-2 py-0.5 rounded flex items-center gap-1">
              <MapPin className="size-3 text-[#00BAF2]" />
              {lang === "hi-IN"
                ? "कोरमंगला 4th ब्लॉक, बैंगलोर"
                : lang === "kn-IN"
                  ? "ಕೋರಮಂಗಲ 4 ನೇ ಬ್ಲಾಕ್, ಬೆಂಗಳೂರು"
                  : "Koramangala 4th Block, Bangalore"}
            </span>
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-[#1a1a1a]">
            {t.fseConsoleTitle}
          </h2>
          <p className="text-xs text-[#6b7280] mt-1 max-w-xl">
            {t.fseConsoleSub}
          </p>
        </div>

        <button
          type="button"
          onClick={handleTerritoryHandoff}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-[#001738] font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <UserMinus className="size-4" />
          {t.handoverBtn}
        </button>
      </section>

      {/* 2. DAILY OPERATIONS KPI SUMMARY */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.06)]">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
            {t.statAssignedMerchants}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#002970] mt-1 block">3</span>
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
            {t.allActivePill}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.06)]">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
            {t.statActiveDisputes}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-amber-600 mt-1 block">1</span>
          <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
            {t.underReviewPill}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.06)]">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
            {t.statNextVisit}
          </span>
          <span className="text-xl sm:text-2xl font-bold text-[#002970] mt-1 block">4:00 PM</span>
          <span className="text-[10px] text-gray-500 block mt-0.5">
            {lang === "hi-IN" ? "रमेश किराना स्टोर" : lang === "kn-IN" ? "ರಮೇಶ್ ಕಿರಾಣಿ ಸ್ಟೋರ್" : "Ramesh Kirana Store"}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.06)]">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
            {t.statSoundboxUptime}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 block">98.5%</span>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
            {t.connected100Pill}
          </span>
        </div>
      </section>

      {/* Success Messages */}
      {handoffSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{handoffSuccess}</span>
        </div>
      )}

      {actionMsg && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-300 text-[#002970] text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="size-4 text-blue-600 shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* 3. TWO-COLUMN FSE BODY */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Assigned Merchants Beat List (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,41,112,0.05)] border border-gray-100">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Store className="size-4 text-[#00BAF2]" />
                <h3 className="text-sm font-black text-[#002970] uppercase tracking-wide">
                  {t.assignedMerchantsTitle}
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-bold bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">
                3 {t.activeCountBadge}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3.5 mt-4">
              {/* Merchant 1: Ramesh */}
              <div className="p-4 rounded-2xl border-2 border-[#00BAF2] bg-[#F0F9FF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-[#002970]">
                      {lang === "hi-IN" ? "रमेश किराना स्टोर" : lang === "kn-IN" ? "ರಮೇಶ್ ಕಿರಾಣಿ ಸ್ಟೋರ್" : "Ramesh Kirana Store"}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {lang === "hi-IN" ? "सक्रिय • प्राथमिकता" : lang === "kn-IN" ? "ಸಕ್ರಿಯ • ಆದ್ಯತೆ" : "Active • Priority"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {lang === "hi-IN" ? "मालिक: रमेश कुमार • दैनिक बिक्री: ₹4,500.00" : lang === "kn-IN" ? "ಮಾಲೀಕ: ರಮೇಶ್ ಕುಮಾರ್ • ದೈನಂದಿನ ಮಾರಾಟ: ₹4,500.00" : "Owner: Ramesh Kumar • Daily Sales: ₹4,500.00"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {lang === "hi-IN" ? "साउंडबॉक्स 4.0: 88% बैटरी • 4G VoLTE" : lang === "kn-IN" ? "ಸೌಂಡ್‌ಬಾಕ್ಸ್ 4.0: 88% ಬ್ಯಾಟರಿ • 4G VoLTE" : "Soundbox 4.0: 88% Battery • 4G VoLTE"}
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-blue-200">
                  <span className="text-[11px] font-bold text-[#002970] block">
                    {lang === "hi-IN" ? "अगला दौरा: आज 4:00 PM" : lang === "kn-IN" ? "ಮುಂದಿನ ಭೇಟಿ: ಇಂದು 4:00 PM" : "Next Visit: Today 4:00 PM"}
                  </span>
                  <span className="text-xs text-[#00BAF2] font-black hover:underline cursor-pointer">
                    {t.viewProfile} &rarr;
                  </span>
                </div>
              </div>

              {/* Merchant 2: Suresh */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-gray-300 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900">
                      {lang === "hi-IN" ? "सुरेश जनरल स्टोर" : lang === "kn-IN" ? "ಸುರೇಶ್ ಜನರಲ್ ಸ್ಟೋರ್" : "Suresh General Store"}
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      {t.lowBattery}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {lang === "hi-IN" ? "मालिक: सुरेश वर्मा • दैनिक बिक्री: ₹2,100.00" : lang === "kn-IN" ? "ಮಾಲೀಕ: ಸುರೇಶ್ ವರ್ಮಾ • ದೈನಂದಿನ ಮಾರಾಟ: ₹2,100.00" : "Owner: Suresh Verma • Daily Sales: ₹2,100.00"}
                  </p>
                  <p className="text-xs text-amber-600 font-medium">
                    {lang === "hi-IN" ? "साउंडबॉक्स: 14% बैटरी (चार्जर केबल जांचें)" : lang === "kn-IN" ? "ಸೌಂಡ್‌ಬಾಕ್ಸ್: 14% ಬ್ಯಾಟರಿ (ಚಾರ್ಜರ್ ಕೇಬಲ್ ಪರಿಶೀಲಿಸಿ)" : "Soundbox: 14% Battery (Check charger cable)"}
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                  <span className="text-[11px] text-gray-500 block">
                    {lang === "hi-IN" ? "अगला दौरा: कल 11:30 AM" : lang === "kn-IN" ? "ಮುಂದಿನ ಭೇಟಿ: ನಾಳೆ 11:30 AM" : "Next Visit: Tomorrow 11:30 AM"}
                  </span>
                </div>
              </div>

              {/* Merchant 3: Annapurna */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-gray-300 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900">
                      {lang === "hi-IN" ? "अन्नपूर्णा प्रोविजन्स" : lang === "kn-IN" ? "ಅನ್ನಪೂರ್ಣ ಪ್ರಾವಿಷನ್ಸ್" : "Annapurna Provisions"}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {lang === "hi-IN" ? "सक्रिय" : lang === "kn-IN" ? "ಸಕ್ರಿಯ" : "Active"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {lang === "hi-IN" ? "मालिक: अन्नपूर्णा देवी • दैनिक बिक्री: ₹1,850.00" : lang === "kn-IN" ? "ಮಾಲೀಕ: ಅನ್ನಪೂರ್ಣ ದೇವಿ • ದೈನಂದಿನ ಮಾರಾಟ: ₹1,850.00" : "Owner: Annapurna Devi • Daily Sales: ₹1,850.00"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {lang === "hi-IN" ? "साउंडबॉक्स: 95% बैटरी • ऑनलाइन" : lang === "kn-IN" ? "ಸೌಂಡ್‌ಬಾಕ್ಸ್: 95% ಬ್ಯಾಟರಿ • ಆನ್‌ಲೈನ್" : "Soundbox: 95% Battery • Online"}
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                  <span className="text-[11px] text-gray-500 block">
                    {lang === "hi-IN" ? "अगला दौरा: परसों 2:00 PM" : lang === "kn-IN" ? "ಮುಂದಿನ ಭೇಟಿ: ನಾಡಿದ್ದು 2:00 PM" : "Next Visit: Day after tomorrow 2:00 PM"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Merchant Memory & Field Notes Stream */}
          <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,41,112,0.05)] border border-gray-100">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-[#00BAF2]" />
                <h3 className="text-sm font-black text-[#002970] uppercase tracking-wide">
                  {t.memoryStreamTitle}
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-mono">
                {lang === "hi-IN" ? "रमेश किराना स्टोर" : lang === "kn-IN" ? "ರಮೇಶ್ ಕಿರಾಣಿ ಸ್ಟೋರ್" : "Ramesh Kirana Store"}
              </span>
            </div>

            <div className="mt-3.5 space-y-2.5 max-h-56 overflow-y-auto">
              {memories.map((m) => (
                <div key={m.memory_id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#002970]">{m.topic}</span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(m.created_at || Date.now()).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1 leading-relaxed">{m.summary}</p>
                </div>
              ))}
            </div>

            {/* Add Field Note Input */}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                placeholder={t.notePlaceholder}
                className="flex-1 rounded-2xl border border-gray-200 px-4 py-2.5 text-xs focus:border-[#00BAF2] focus:bg-white focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddNote}
                className="px-4 py-2.5 rounded-2xl bg-[#002970] text-white font-bold text-xs hover:bg-[#001738] transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Send className="size-3.5" />
                {t.saveNoteBtn}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Active Disputes & Safe Handoff (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Disputes & Escrow Holds */}
          <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,41,112,0.05)] border border-gray-100">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-amber-500" />
                <h3 className="text-sm font-black text-[#002970] uppercase tracking-wide">
                  {t.activeDisputesTitle}
                </h3>
              </div>
              <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-bold border border-amber-200">
                1 {t.reviewRequiredBadge}
              </span>
            </div>

            <div className="mt-4 space-y-3.5">
              {disputes.map((d) => (
                <div
                  key={d.dispute_id}
                  className="p-4 rounded-2xl border border-amber-200 bg-amber-50/60 text-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#002970]">{d.dispute_id}</span>
                    <span className="font-black text-sm text-red-600">₹{Number(d.amount).toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-mono text-[11px] block">Txn: {d.txn_id}</span>
                    <p className="text-gray-800 font-semibold mt-1">{d.reason}</p>
                    <span className="text-[11px] text-gray-500 block mt-1">
                      {lang === "hi-IN" ? "स्थिति:" : lang === "kn-IN" ? "ಸ್ಥಿತಿ:" : "Status:"} {d.status} • {d.resolution_notes || (lang === "hi-IN" ? "ग्राहक बैंक से पुष्टि प्रतीक्षित" : lang === "kn-IN" ? "ಗ್ರಾಹಕರ ಬ್ಯಾಂಕ್‌ನಿಂದ ದೃಢೀಕರಣ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ" : "Awaiting customer bank reversal confirmation")}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleResolveDispute(d.dispute_id, "SUBMIT_EVIDENCE")}
                      className="flex-1 py-2 px-3 rounded-xl bg-white border border-[#00BAF2] text-[#002970] font-bold hover:bg-blue-50 transition-colors text-center cursor-pointer"
                    >
                      {t.uploadEvidenceBtn}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResolveDispute(d.dispute_id, "ACCEPT_CHARGEBACK")}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#00BAF2] text-[#002970] font-black hover:bg-[#00a8dc] transition-colors text-center cursor-pointer shadow-xs"
                    >
                      {t.instantReversalBtn}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safe FSE Territory Handoff Card */}
          <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,41,112,0.05)] border border-gray-100">
            <div className="flex items-center gap-2 pb-3.5 border-b border-gray-100">
              <UserMinus className="size-4 text-amber-500" />
              <h3 className="text-sm font-black text-[#002970] uppercase tracking-wide">
                {t.safeHandoffTitle}
              </h3>
            </div>

            <p className="text-xs text-gray-600 mt-3 leading-relaxed">
              {t.safeHandoffDesc}
            </p>

            <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-[#002970]">
              <span className="font-bold block">{t.recipientOfficer}</span>
            </div>

            <button
              type="button"
              onClick={handleTerritoryHandoff}
              className="w-full mt-4 py-2.5 px-4 rounded-xl bg-[#002970] hover:bg-[#001738] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <UserCheck className="size-4" />
              {t.confirmHandoffBtn}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
