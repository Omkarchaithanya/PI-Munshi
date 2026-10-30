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
} from "lucide-react";
import { munshiApi } from "@/lib/api-client";
import { speak } from "@/lib/munshi/audio";

interface FseViewProps {
  lang: string;
}

export function FseView({ lang }: FseViewProps) {
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
        "FSE अरुण शर्मा द्वारा सत्यापित: बैंक यूडीआईआर रिवर्सल स्वीकृत",
        "DEMO"
      );
      setActionMsg(`विवाद अद्यतन सफल (${action}): यूडीआईआर ऑटो-क्रेडिट लागू किया गया।`);
      speak("विवाद का निपटारा कर दिया गया है।", lang);
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
        "रमेश जी शाम 6 से 9 बजे व्यस्त रहते हैं; साउंडबॉक्स 88% बैटरी पर है; कोई लंबित शिकायत नहीं।",
        "DEMO_MERCHANT_RAMESH",
        "DEMO"
      );
      setHandoffSuccess("कार्यभार सफलतापूर्वक हस्तांतरित: FSE प्रिया नायर को संपूर्ण संदर्भ सौंपा गया।");
      speak("सुरक्षित हैंडऑफ संपन्न हुआ।", lang);
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
    <div className="flex flex-col min-h-screen bg-[#F4F7FB] text-gray-900 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-b from-[#002970] to-[#001f54] text-white px-4 pt-4 pb-6 md:px-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                <UserCheck className="size-3" />
                FSE अरुण शर्मा (अरुण - 9123456780)
              </span>
              <span className="text-[11px] text-blue-200 flex items-center gap-1">
                <MapPin className="size-3" /> कोरमंगला 4th ब्लॉक, बैंगलोर
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight">
              फील्ड ऑपरेशंस डैशबोर्ड (FSE Operations Console)
            </h1>
            <p className="text-xs text-blue-100/80 mt-0.5">
              दुकानदार दौरे, शिकायत निवारण, साउंडबॉक्स सेवा एवं सुरक्षित हैंडऑफ
            </p>
          </div>

          <button
            onClick={handleTerritoryHandoff}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#001738] font-black text-xs shadow-md transition-transform active:scale-95"
          >
            <UserMinus className="size-4" />
            क्षेत्र हैंडऑफ शुरू करें (Handover to Priya)
          </button>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full px-4 mt-4 space-y-5">
        {/* Success Banners */}
        {handoffSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>{handoffSuccess}</span>
          </div>
        )}

        {actionMsg && (
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-300 text-[#002970] text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
            <CheckCircle2 className="size-4 text-blue-600 shrink-0" />
            <span>{actionMsg}</span>
          </div>
        )}

        {/* Assigned Merchants */}
        <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <h3 className="font-extrabold text-sm text-[#002970] flex items-center gap-2">
              <Store className="size-4 text-[#00BAF2]" />
              आवंटित व्यापारी सूची (Assigned Merchants in Territory)
            </h3>
            <span className="text-xs text-gray-500 font-bold">3 सक्रिय दुकानें</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            {/* Merchant 1: Ramesh */}
            <div className="p-4 rounded-2xl border-2 border-[#00BAF2] bg-[#F0F9FF] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-[#002970]">रमेश किराना स्टोर</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                    सक्रिय
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">दैनिक बिक्री: ₹4,500.00</p>
                <p className="text-[11px] text-gray-500">साउंडबॉक्स 4.0: 88% बैटरी</p>
              </div>
              <div className="mt-3 pt-2 border-t border-blue-200/60 flex items-center justify-between text-[11px] font-bold text-[#002970]">
                <span>अगली विज़िट: आज 4:00 PM</span>
                <span className="text-[#00BAF2]">प्रोफ़ाइल &rarr;</span>
              </div>
            </div>

            {/* Merchant 2: Suresh */}
            <div className="p-4 rounded-2xl border border-gray-200 bg-white flex flex-col justify-between opacity-80">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-gray-800">सुरेश जनरल स्टोर</span>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
                    बैटरी कम
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">दैनिक बिक्री: ₹2,100.00</p>
                <p className="text-[11px] text-gray-500">साउंडबॉक्स: 14% बैटरी (चार्जर चाहिए)</p>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] font-semibold text-gray-600">
                कल 11:30 AM
              </div>
            </div>

            {/* Merchant 3: Annapurna */}
            <div className="p-4 rounded-2xl border border-gray-200 bg-white flex flex-col justify-between opacity-80">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-gray-800">अन्नपूर्णा प्रोविजन्स</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                    सक्रिय
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">दैनिक बिक्री: ₹1,850.00</p>
                <p className="text-[11px] text-gray-500">साउंडबॉक्स: 95% बैटरी</p>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] font-semibold text-gray-600">
                परसों 2:00 PM
              </div>
            </div>
          </div>
        </div>

        {/* Open Disputes & Complaints */}
        <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <h3 className="font-extrabold text-sm text-[#002970] flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-500" />
              लंबित विवाद एवं शिकायतें (Active Disputes & Escrow Holds)
            </h3>
            <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold">
              1 समीक्षाधीन
            </span>
          </div>

          <div className="mt-3 space-y-3">
            {disputes.map((d) => (
              <div
                key={d.dispute_id}
                className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#002970]">{d.dispute_id}</span>
                    <span className="font-mono text-gray-500">Txn: {d.txn_id}</span>
                    <span className="font-bold text-red-600">₹{Number(d.amount).toFixed(2)}</span>
                  </div>
                  <p className="text-gray-700 mt-1 font-medium">{d.reason}</p>
                  <span className="text-[11px] text-gray-400 block mt-0.5">
                    स्थिति: {d.status} • {d.resolution_notes || "ग्राहक बैंक से पुष्टि प्रतीक्षित"}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleResolveDispute(d.dispute_id, "SUBMIT_EVIDENCE")}
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#00BAF2] text-[#002970] font-bold hover:bg-blue-50 transition-colors"
                  >
                    प्रमाण अपलोड करें
                  </button>
                  <button
                    onClick={() => handleResolveDispute(d.dispute_id, "ACCEPT_CHARGEBACK")}
                    className="px-3 py-1.5 rounded-lg bg-[#00BAF2] text-[#002970] font-bold hover:bg-[#00a8dc] transition-colors"
                  >
                    तत्काल रिवर्सल दें
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Merchant Memory & Context Stream */}
        <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <h3 className="font-extrabold text-sm text-[#002970] flex items-center gap-2">
              <FileText className="size-4 text-[#00BAF2]" />
              व्यापारी संदर्भ एवं मेमोरी टाइमलाइन (Merchant Memory Stream)
            </h3>
            <span className="text-[11px] text-gray-400">रमेश किराना स्टोर</span>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            {memories.map((m) => (
              <div key={m.memory_id} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#002970]">{m.topic}</span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(m.created_at || Date.now()).toLocaleDateString("en-IN")}
                  </span>
                </div>
                <p className="text-gray-700 mt-0.5">{m.summary}</p>
              </div>
            ))}
          </div>

          {/* Add Field Note */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="विज़िट नोट जोड़ें (उदा. साउंडबॉक्स की आवाज़ ठीक की)..."
              className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-[#00BAF2] focus:outline-hidden"
            />
            <button
              onClick={handleAddNote}
              className="px-4 py-2 rounded-xl bg-[#002970] text-white font-bold text-xs hover:bg-[#001738] transition-colors flex items-center gap-1.5"
            >
              <Send className="size-3.5" />
              नोट सेव करें
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
