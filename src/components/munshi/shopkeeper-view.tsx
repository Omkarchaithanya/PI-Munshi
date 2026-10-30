import React, { useState, useEffect } from "react";
import {
  QrCode,
  CreditCard,
  Building2,
  Volume2,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  Wifi,
  Battery,
  RefreshCw,
  Bell,
  UserCheck,
} from "lucide-react";
import { ReceiveMoneyModal } from "./modals/receive-money-modal";
import { TransactionDetailModal } from "./modals/transaction-detail-modal";
import { SettlementDetailModal } from "./modals/settlement-detail-modal";
import { SoundboxTroubleshootModal } from "./modals/soundbox-troubleshoot-modal";
import { VoiceAssistant } from "./voice-assistant";
import { munshiApi } from "@/lib/api-client";
import { playSwarChirp, speak } from "@/lib/munshi/audio";

interface ShopkeeperViewProps {
  lang: string;
}

export function ShopkeeperView({ lang }: ShopkeeperViewProps) {
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [settlementModalOpen, setSettlementModalOpen] = useState(false);
  const [soundboxModalOpen, setSoundboxModalOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<any | null>(null);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load real data from backend
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
    // Poll every 10 seconds or update on demand
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const totalToday = transactions.reduce((acc, t) => acc + (t.status === "SUCCESS" ? Number(t.amount) : 0), 0);
  const successCount = transactions.filter((t) => t.status === "SUCCESS").length;

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7FB] text-gray-900 pb-20">
      {/* 1. Shopkeeper Greeting Banner */}
      <section className="bg-gradient-to-b from-[#002970] to-[#001f54] text-white px-4 pt-4 pb-8 md:px-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00BAF2]/20 border border-[#00BAF2]/40 text-[#00BAF2] text-xs font-bold">
                <Sparkles className="size-3" />
                रमेश किराना स्टोर (Ramesh Kirana)
              </span>
              <span className="text-[11px] text-blue-200">UPI: ramesh.kirana@paytm</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight">
              {lang === "kn-IN"
                ? "ನಮಸ್ಕಾರ, ರಮೇಶ್ ಜೀ! 🙏"
                : lang === "en-IN"
                ? "Namaste, Ramesh ji! 🙏"
                : "नमस्ते, रमेश जी! 🙏"}
            </h1>
            <p className="text-xs text-blue-100/80 mt-0.5">
              {lang === "kn-IN"
                ? "ಇಲ್ಲಿ ನಿಮ್ಮ ಅಂಗಡಿಯ ಇಂದಿನ ಪಾವತಿ ಸಾರಾಂಶವಿದೆ."
                : lang === "en-IN"
                ? "Here is your shop's payment summary for today."
                : "यहाँ है आपकी दुकान का आज का सुरक्षित डिजिटल पेमेंट सारांश।"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setReceiveModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00BAF2] hover:bg-[#00a8dc] text-[#002970] font-black text-xs shadow-lg transition-transform active:scale-95"
            >
              <QrCode className="size-4" />
              क्यूआर कोड दिखाएं (Show QR)
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-4 -mt-4 space-y-5">
        {/* 2. Today's Business Summary Card */}
        <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-extrabold text-[#002970] uppercase tracking-wide">
                आज का कुल कलेक्शन (Today's Business)
              </span>
            </div>
            <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
              <Clock className="size-3 text-gray-400" />
              रियल-टाइम अपडेटेड
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <span className="text-[11px] text-gray-500 block">कुल प्राप्त राशि</span>
              <span className="text-2xl font-black text-[#002970] mt-0.5 block">
                ₹{totalToday > 0 ? totalToday.toFixed(2) : "2,150.00"}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                {successCount > 0 ? successCount : 3} सफल लेन-देन
              </span>
            </div>

            <div>
              <span className="text-[11px] text-gray-500 block">बैंक खाते में जमा (Settled)</span>
              <span className="text-xl font-bold text-emerald-700 mt-0.5 block">₹1,650.00</span>
              <span className="text-[10px] text-gray-500 font-mono">UTR: 62998412...</span>
            </div>

            <div>
              <span className="text-[11px] text-gray-500 block">लंबित सेटलमेंट (Pending)</span>
              <span className="text-xl font-bold text-amber-600 mt-0.5 block">₹500.00</span>
              <span className="text-[10px] text-gray-500">आज रात 11:59 बजे</span>
            </div>

            <div>
              <span className="text-[11px] text-gray-500 block">MDR बैंक कटौती</span>
              <span className="text-xl font-bold text-emerald-600 mt-0.5 block">₹0.00</span>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                100% सरकारी छूट
              </span>
            </div>
          </div>
        </div>

        {/* 3. Quick Action Grid (4 Primary Cards) */}
        <div>
          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 px-1">
            त्वरित कार्य (Quick Actions)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Action 1: Receive Money */}
            <button
              type="button"
              onClick={() => setReceiveModalOpen(true)}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-[#00BAF2] hover:shadow-md transition-all active:scale-95 group text-center"
            >
              <div className="size-12 rounded-2xl bg-[#00BAF2]/15 text-[#002970] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <QrCode className="size-6 text-[#002970]" />
              </div>
              <span className="font-extrabold text-xs text-[#002970]">पैसे प्राप्त करें</span>
              <span className="text-[10px] text-gray-500 mt-0.5">क्यूआर कोड खोलें</span>
            </button>

            {/* Action 2: View Payments */}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("transactions-list");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-[#00BAF2] hover:shadow-md transition-all active:scale-95 group text-center"
            >
              <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <CreditCard className="size-6 text-emerald-600" />
              </div>
              <span className="font-extrabold text-xs text-[#002970]">पेमेंट हिस्ट्री</span>
              <span className="text-[10px] text-gray-500 mt-0.5">सभी लेन-देन देखें</span>
            </button>

            {/* Action 3: Settlement */}
            <button
              type="button"
              onClick={() => setSettlementModalOpen(true)}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-[#00BAF2] hover:shadow-md transition-all active:scale-95 group text-center"
            >
              <div className="size-12 rounded-2xl bg-blue-50 text-[#002970] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Building2 className="size-6 text-[#002970]" />
              </div>
              <span className="font-extrabold text-xs text-[#002970]">बैंक सेटलमेंट</span>
              <span className="text-[10px] text-gray-500 mt-0.5">UTR एवं खाता जांचें</span>
            </button>

            {/* Action 4: Soundbox */}
            <button
              type="button"
              onClick={() => setSoundboxModalOpen(true)}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-[#00BAF2] hover:shadow-md transition-all active:scale-95 group text-center"
            >
              <div className="size-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Volume2 className="size-6 text-amber-600" />
              </div>
              <span className="font-extrabold text-xs text-[#002970]">साउंडबॉक्स जांच</span>
              <span className="text-[10px] text-gray-500 mt-0.5">88% बैटरी • ऑनलाइन</span>
            </button>
          </div>
        </div>

        {/* 4. Voice-First Assistant Widget */}
        <VoiceAssistant lang={lang} />

        {/* 5. Soundbox Device Card */}
        <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-[#00BAF2]/10 border border-[#00BAF2]/30 flex items-center justify-center text-[#002970] shrink-0">
              <Volume2 className="size-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-sm text-[#002970]">Paytm Soundbox 4.0 4G</h4>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  कनेक्टेड
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Battery className="size-3.5 text-emerald-600" />
                  88% बैटरी
                </span>
                <span className="flex items-center gap-1">
                  <Wifi className="size-3.5 text-blue-600" />
                  4G VoLTE
                </span>
                <span className="text-[10px] text-gray-400">हार्टबीट: अभी-अभी</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playSwarChirp("100");
                speak("पेटीएम पर एक सौ रुपये प्राप्त हुए।", lang);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition-colors"
            >
              <Volume2 className="size-3.5" />
              टेस्ट आवाज़ सुनें
            </button>
            <button
              onClick={() => setSoundboxModalOpen(true)}
              className="px-3 py-2 rounded-xl border border-[#00BAF2] text-[#002970] hover:bg-[#F0F9FF] font-bold text-xs transition-colors"
            >
              समस्या निवारण
            </button>
          </div>
        </div>

        {/* 6. Recent Payments List */}
        <div id="transactions-list" className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <h3 className="font-extrabold text-sm text-[#002970]">हाल के लेन-देन (Recent Payments)</h3>
            <button
              onClick={loadData}
              className="text-xs text-[#00BAF2] hover:text-[#002970] font-bold flex items-center gap-1"
            >
              <RefreshCw className="size-3" />
              रीफ्रेश
            </button>
          </div>

          <div className="divide-y divide-gray-50 mt-1">
            {transactions.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400">
                आज कोई नया भुगतान नहीं हुआ है।
              </div>
            ) : (
              transactions.map((txn) => (
                <div
                  key={txn.txn_id}
                  onClick={() => setSelectedTxn(txn)}
                  className="py-3 flex items-center justify-between hover:bg-gray-50/60 rounded-xl px-2 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="size-5" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-gray-900 block group-hover:text-[#002970] transition-colors">
                        {txn.payer_vpa || "customer@paytm"}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {new Date(txn.created_at || Date.now()).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {" • "}
                        UPI भुगतान
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-black text-sm text-emerald-600 block">
                        +₹{Number(txn.amount).toFixed(2)}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {txn.settlement_status === "SETTLED" ? "खाते में जमा" : "आज रात जमा"}
                      </span>
                    </div>
                    <ChevronRight className="size-4 text-gray-300 group-hover:text-[#002970] transition-colors" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

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
