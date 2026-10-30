import React, { useState } from "react";
import { X, QrCode, Volume2, CheckCircle2, Copy, Check } from "lucide-react";
import { munshiApi } from "@/lib/api-client";
import { playSwarChirp, speak } from "@/lib/munshi/audio";

interface ReceiveMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
  onPaymentSuccess?: () => void;
}

export function ReceiveMoneyModal({ isOpen, onClose, lang, onPaymentSuccess }: ReceiveMoneyModalProps) {
  const [amount, setAmount] = useState<number>(100);
  const [copied, setCopied] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const upiId = "ramesh.kirana@paytm";
  const upiUri = `upi://pay?pa=${upiId}&pn=Ramesh%20Kirana%20Store&am=${amount}&cu=INR`;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = async () => {
    setSimulating(true);
    try {
      const orderId = `ORD_${Date.now()}`;
      await munshiApi.initiateTransaction(orderId, amount, "DEMO_MERCHANT_RAMESH", "DEMO");
      playSwarChirp(String(amount));

      const phrase =
        lang === "kn-IN"
          ? `Paytm ನಲ್ಲಿ ${amount} ರೂಪಾಯಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ.`
          : lang === "en-IN"
          ? `Received rupees ${amount} on Paytm.`
          : `पेटीएम पर ${amount} रुपये प्राप्त हुए।`;

      speak(phrase, lang);
      setSuccessMsg(`भुगतान प्राप्त: ₹${amount}`);
      onPaymentSuccess?.();
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 2500);
    } catch (err: any) {
      console.error("Simulation error:", err);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden text-gray-900">
        {/* Header */}
        <div className="bg-[#002970] px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-[#00BAF2] flex items-center justify-center text-[#002970] font-black">
              <QrCode className="size-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">पैसे प्राप्त करें (Receive Money)</h3>
              <p className="text-[11px] text-blue-200">ऑल-इन-वन यूपीआई क्यूआर कोड</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* QR Section */}
        <div className="p-6 flex flex-col items-center bg-gradient-to-b from-[#F0F8FF] to-white">
          <div className="text-center mb-3">
            <span className="font-extrabold text-[#002970] text-base">रमेश किराना स्टोर</span>
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <span className="text-xs text-gray-500 font-mono">{upiId}</span>
              <button
                onClick={handleCopyUpi}
                className="text-[#00BAF2] hover:text-[#002970] p-1 rounded transition-colors"
                title="Copy UPI ID"
              >
                {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
              </button>
            </div>
          </div>

          {/* SVG QR Code Simulation */}
          <div className="relative p-4 rounded-2xl bg-white shadow-md border-2 border-[#00BAF2]/30 flex flex-col items-center justify-center size-52">
            <div className="grid grid-cols-6 gap-1.5 size-40 p-2">
              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-sm transition-colors ${
                    i % 3 === 0 || i % 7 === 0 || i < 6 || i > 29 ? "bg-[#002970]" : "bg-[#00BAF2]"
                  }`}
                />
              ))}
            </div>
            {/* Center Paytm Logo Badge */}
            <div className="absolute inset-0 m-auto size-10 rounded-xl bg-white shadow-lg border border-[#00BAF2] flex items-center justify-center font-black text-[10px] text-[#002970]">
              Pay<span className="text-[#00BAF2]">tm</span>
            </div>
          </div>

          {/* Amount Modifier */}
          <div className="w-full mt-4">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1 font-medium">
              <span>राशि दर्ज करें (Amount in ₹):</span>
              <span className="font-bold text-[#002970]">₹{amount}</span>
            </div>
            <div className="flex gap-2">
              {[50, 100, 200, 500].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    amount === val
                      ? "bg-[#00BAF2] text-[#002970] border-[#00BAF2] shadow-sm"
                      : "bg-white text-gray-700 border-gray-200 hover:border-[#00BAF2]"
                  }`}
                >
                  ₹{val}
                </button>
              ))}
            </div>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="w-full mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 animate-in zoom-in-95">
              <CheckCircle2 className="size-4 text-emerald-600" />
              {successMsg}
            </div>
          )}

          {/* Interactive Trigger Button */}
          <button
            type="button"
            disabled={simulating}
            onClick={handleSimulatePayment}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#00BAF2] hover:bg-[#00a8dc] text-[#002970] font-black text-sm shadow-md transition-transform active:scale-[0.98] disabled:opacity-50"
          >
            <Volume2 className="size-4" />
            {simulating ? "प्रोसेसिंग..." : `ग्राहक पेमेंट टेस्ट करें (₹${amount})`}
          </button>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            *टेस्ट मोड: तुरंत साउंडबॉक्स वॉइस अलर्ट और लेजर एंट्री जनरेट होगी
          </p>
        </div>
      </div>
    </div>
  );
}
