import React, { useState } from "react";
import { X, CheckCircle2, ShieldCheck, ArrowRight, Zap, RefreshCw } from "lucide-react";
import { munshiApi } from "@/lib/api-client";
import { playSwarChirp, speak } from "@/lib/munshi/audio";

interface SettlementDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
  onSettled?: () => void;
}

export function SettlementDetailModal({ isOpen, onClose, lang, onSettled }: SettlementDetailModalProps) {
  const [settling, setSettling] = useState(false);
  const [settledResult, setSettledResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleInstantSettle = async () => {
    setSettling(true);
    try {
      const res = await munshiApi.consolidateSettlement("DEMO_MERCHANT_RAMESH", "DEMO");
      playSwarChirp("500");
      speak("सेटलमेंट सफल रहा। राशि आपके बैंक खाते में भेज दी गई है।", lang);
      setSettledResult(res);
      onSettled?.();
    } catch (err: any) {
      console.error("Settlement error:", err);
    } finally {
      setSettling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden text-gray-900">
        {/* Header */}
        <div className="bg-[#002970] px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-tight">दैनिक सेटलमेंट विवरण (Settlement Details)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-gradient-to-b from-[#F0F9FF] to-white">
          <div className="text-center">
            <span className="text-xs font-semibold text-gray-500">बैंक खाते में जमा राशि</span>
            <h2 className="text-2xl font-black text-[#002970] mt-0.5">₹1,650.00</h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mt-2">
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              UTR: 629984129984 (जमा संपन्न)
            </div>
          </div>

          {/* Bank Account Info */}
          <div className="mt-5 rounded-2xl bg-white p-4 border border-gray-100 shadow-sm space-y-2.5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
              <span className="text-gray-500">प्राप्तकर्ता खाता:</span>
              <span className="font-bold text-gray-800">State Bank of India (••4092)</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
              <span className="text-gray-500">कुल भुगतान:</span>
              <span className="font-bold text-gray-800">₹1,650.00</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
              <span className="text-gray-500">सरकारी MDR छूट:</span>
              <span className="font-bold text-emerald-600">₹0.00 (₹2,000 सीमा छूट)</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-gray-500">लंबित सेटलमेंट (आज का):</span>
              <span className="font-bold text-amber-600">₹500.00</span>
            </div>
          </div>

          {/* Settled Result Notice */}
          {settledResult && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
              <span className="font-bold">सफल: </span>
              {settledResult.message || `₹${settledResult.totalSettled} सेटल हो चुका है!`}
            </div>
          )}

          {/* Immediate Settlement Button */}
          <button
            type="button"
            disabled={settling}
            onClick={handleInstantSettle}
            className="w-full mt-5 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#00BAF2] hover:bg-[#00a8dc] text-[#002970] font-black text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {settling ? (
              <RefreshCw className="size-4 animate-spin" />
            ) : (
              <Zap className="size-4 fill-current" />
            )}
            तुरंत सेटलमेंट करें (Instant Payout)
          </button>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            *सामान्य रूप से सेटलमेंट हर रात 11:59 बजे अपने-आप हो जाता है
          </p>
        </div>
      </div>
    </div>
  );
}
