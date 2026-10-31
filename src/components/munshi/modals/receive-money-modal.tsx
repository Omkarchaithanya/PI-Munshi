import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { X, QrCode, Volume2, CheckCircle2, Copy, Check } from "lucide-react";
import { munshiApi } from "@/lib/api-client";
import { playSwarChirp, speak } from "@/lib/munshi/audio";
import { getTranslation } from "@/lib/munshi/i18n";

interface ReceiveMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
  onPaymentSuccess?: () => void;
}

export function ReceiveMoneyModal({ isOpen, onClose, lang, onPaymentSuccess }: ReceiveMoneyModalProps) {
  const t = getTranslation(lang);
  const [amount, setAmount] = useState<number>(100);
  const [copied, setCopied] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState("");

  const upiId = "ramesh.kirana@paytm";
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent("Ramesh Kirana Store")}&am=${amount.toFixed(2)}&cu=INR`;

  useEffect(() => {
    if (!isOpen) return;
    let cancel = false;
    QRCode.toDataURL(upiUri, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 320,
      color: { dark: "#111827", light: "#ffffff" },
    })
      .then((url) => {
        if (!cancel) setQrUrl(url);
      })
      .catch(() => {
        if (!cancel) setQrUrl("");
      });
    return () => {
      cancel = true;
    };
  }, [isOpen, upiUri]);

  if (!isOpen) return null;

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
      setSuccessMsg(
        lang === "kn-IN"
          ? `ಪಾವತಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ: ₹${amount}`
          : lang === "en-IN"
          ? `Payment received: ₹${amount}`
          : `भुगतान प्राप्त: ₹${amount}`
      );
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
              <h3 className="font-bold text-sm tracking-tight">{t.modalReceiveTitle}</h3>
              <p className="text-[11px] text-blue-200">{t.modalScanPay}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* QR Section */}
        <div className="p-6 flex flex-col items-center bg-gradient-to-b from-[#F0F8FF] to-white">
          <div className="text-center mb-3">
            <span className="font-extrabold text-[#002970] text-base">{t.storeName}</span>
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <span className="text-xs text-gray-500 font-mono">{upiId}</span>
              <button
                onClick={handleCopyUpi}
                className="text-[#00BAF2] hover:text-[#002970] p-1 rounded transition-colors cursor-pointer"
                title="Copy UPI ID"
              >
                {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200 p-3">
            {qrUrl ? (
              <img
                src={qrUrl}
                alt={`UPI QR for ${upiId}, ₹${amount}`}
                width={208}
                height={208}
                className="size-52"
              />
            ) : (
              <div className="size-52 bg-gray-100" />
            )}
          </div>

          {/* Amount Modifier */}
          <div className="w-full mt-4">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1 font-medium">
              <span>{t.modalCustomAmount}</span>
              <span className="font-bold text-[#002970]">₹{amount}</span>
            </div>
            <div className="flex gap-2">
              {[50, 100, 200, 500].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
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
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#00BAF2] hover:bg-[#00a8dc] text-[#002970] font-black text-sm shadow-md transition-transform active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            <Volume2 className="size-4" />
            {simulating ? "..." : `${t.modalSimulatePayment} (₹${amount})`}
          </button>
        </div>
      </div>
    </div>
  );
}
