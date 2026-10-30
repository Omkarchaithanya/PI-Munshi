import React from "react";
import { X, CheckCircle2, ShieldCheck, Share2, HelpCircle, ArrowDownLeft } from "lucide-react";
import { getTranslation } from "@/lib/munshi/i18n";

interface TransactionDetailModalProps {
  transaction: any | null;
  onClose: () => void;
  lang: string;
}

export function TransactionDetailModal({ transaction, onClose, lang }: TransactionDetailModalProps) {
  const t = getTranslation(lang);
  if (!transaction) return null;

  const isSuccess = transaction.status === "SUCCESS";
  const amount = Number(transaction.amount || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden text-gray-900">
        {/* Top Pattern Header */}
        <div className="bg-[#002970] px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-tight">{t.modalTxnDetailTitle}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6 bg-gradient-to-b from-[#F0F9FF] to-white">
          {/* Status Icon */}
          <div className="flex flex-col items-center text-center">
            <div className="size-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2 shadow-inner">
              <CheckCircle2 className="size-8" />
            </div>
            <h2 className="text-xl font-black text-[#002970]">₹{amount.toFixed(2)}</h2>
            <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-1 border border-emerald-200">
              {t.filterSuccess} ✓
            </p>
            <span className="text-[11px] text-gray-400 mt-1">
              {new Date(transaction.created_at || Date.now()).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
              {" • "}
              {new Date(transaction.created_at || Date.now()).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Details Card */}
          <div className="mt-5 rounded-2xl bg-white p-4 border border-gray-100 shadow-sm space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
              <span className="text-gray-500">{t.modalCustomerUpi}:</span>
              <span className="font-mono font-bold text-gray-800">{transaction.payer_vpa || "customer@paytm"}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
              <span className="text-gray-500">Txn ID:</span>
              <span className="font-mono text-gray-700 text-[11px] truncate max-w-[160px]">{transaction.txn_id}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
              <span className="text-gray-500">{t.modalBankRefRrn}:</span>
              <span className="font-mono text-gray-700 text-[11px]">{transaction.rrn || "RRN-482910"}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
              <span className="text-gray-500">{t.modalSettlementStatus}:</span>
              <span className={`font-bold ${transaction.settlement_status === "SETTLED" ? "text-emerald-600" : "text-amber-600"}`}>
                {transaction.settlement_status === "SETTLED" ? t.creditedToBank : t.settlingTonight}
              </span>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-gray-500">{t.modalMdrWaiver}:</span>
              <span className="font-bold text-emerald-600">₹0.00 ({t.govtSubsidyPill})</span>
            </div>
          </div>

          {/* Trust Banner */}
          <div className="mt-3 flex items-center justify-center gap-1 text-[11px] text-[#002970] font-medium">
            <ShieldCheck className="size-3.5 text-[#00BAF2]" />
            {t.footerCompliance}
          </div>

          {/* Action Buttons */}
          <div className="mt-5 flex gap-2">
            <button
              onClick={() => alert("Receipt ready to share via WhatsApp / SMS!")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#00BAF2] text-[#002970] font-bold text-xs hover:bg-[#F0F9FF] transition-colors cursor-pointer"
            >
              <Share2 className="size-3.5" />
              {lang === "kn-IN" ? "ರಶೀದಿ ಹಂಚಿಕೊಳ್ಳಿ" : lang === "en-IN" ? "Share Receipt" : "शेयर रसीद"}
            </button>
            <button
              onClick={() => alert("Ticket created and assigned to FSE.")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition-colors cursor-pointer"
            >
              <HelpCircle className="size-3.5" />
              {t.modalRaiseDispute}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

