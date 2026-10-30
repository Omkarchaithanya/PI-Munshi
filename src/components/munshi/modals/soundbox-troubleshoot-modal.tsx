import React, { useState } from "react";
import { X, Volume2, Battery, Wifi, CheckCircle2, RotateCw } from "lucide-react";
import { munshiApi } from "@/lib/api-client";
import { playSwarChirp, speak } from "@/lib/munshi/audio";
import { getTranslation } from "@/lib/munshi/i18n";

interface SoundboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

export function SoundboxTroubleshootModal({ isOpen, onClose, lang }: SoundboxModalProps) {
  const t = getTranslation(lang);
  const [testing, setTesting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestChime = async () => {
    setTesting(true);
    try {
      await munshiApi.triggerSoundboxChime(100, "hi", "DEMO_SB_RAMESH", "DEMO");
      playSwarChirp("100");
      const phrase =
        lang === "kn-IN"
          ? "ಪೇಟಿಎಂ ನಲ್ಲಿ 100 ರೂಪಾಯಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ."
          : lang === "en-IN"
          ? "Received 100 rupees on Paytm."
          : "पेटीएम पर एक सौ रुपये प्राप्त हुए।";
      speak(phrase, lang);
      setStatusMsg(
        lang === "kn-IN"
          ? "ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಸ್ಪೀಕರ್ ಮತ್ತು ಅಲ್ಟ್ರಾಸಾನಿಕ್ ಸ್ವರ್ ಮುದ್ರಾ ಸಕ್ರಿಯವಾಗಿದೆ!"
          : lang === "en-IN"
          ? "Soundbox speaker and Swar-Mudra APOD are fully active!"
          : "साउंडबॉक्स स्पीकर एवं अल्ट्रासोनिक स्वर्म मुद्रा सक्रिय है!"
      );
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setTesting(false);
    }
  };

  const handleResetNetwork = async () => {
    setResetting(true);
    setTimeout(() => {
      setResetting(false);
      setStatusMsg(
        lang === "kn-IN"
          ? "4G ಸಿಮ್ ಮರುಸಂಪರ್ಕಗೊಂಡಿದೆ. ಸಿಗ್ನಲ್ ಸಾಮರ್ಥ್ಯ: ಅತ್ಯುತ್ತಮ (98%)"
          : lang === "en-IN"
          ? "4G SIM reconnected. Signal Strength: Excellent (98%)"
          : "4G सिम पुनः कनेक्ट हो गया है। सिग्नल क्षमता: उत्तम (98%)"
      );
      speak(
        lang === "kn-IN"
          ? "ನೆಟ್‌ವರ್ಕ್ ಯಶಸ್ವಿಯಾಗಿ ಮರುಹೊಂದಿಸಲಾಗಿದೆ."
          : lang === "en-IN"
          ? "Network reset successfully."
          : "नेटवर्क सफलतापूर्वक रीसेट हो गया है।",
        lang
      );
      setTimeout(() => setStatusMsg(null), 3500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden text-gray-900">
        {/* Header */}
        <div className="bg-[#002970] px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-tight">{t.modalSoundboxTitle}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-gradient-to-b from-[#F0F9FF] to-white">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <div className="size-14 rounded-2xl bg-[#00BAF2]/15 flex items-center justify-center text-[#002970] border border-[#00BAF2]/30">
              <Volume2 className="size-7 text-[#002970]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-black text-sm text-[#002970]">{t.qaSoundbox}</h4>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t.online}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-mono mt-0.5">IMEI: 860123456789012</p>
            </div>
          </div>

          {/* Telemetry Stats */}
          <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
            <div className="p-3 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center gap-2.5">
              <Battery className="size-4 text-emerald-600" />
              <div>
                <span className="text-[10px] text-gray-500 block">{t.battery}</span>
                <span className="font-bold text-gray-800">88% (OK)</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center gap-2.5">
              <Wifi className="size-4 text-blue-600" />
              <div>
                <span className="text-[10px] text-gray-500 block">{t.modalSignalStrength}</span>
                <span className="font-bold text-gray-800">4G VoLTE</span>
              </div>
            </div>
          </div>

          {/* Status Message */}
          {statusMsg && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-5 space-y-2">
            <button
              type="button"
              disabled={testing}
              onClick={handleTestChime}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#00BAF2] hover:bg-[#00a8dc] text-[#002970] font-black text-xs shadow-sm transition-all cursor-pointer"
            >
              <Volume2 className="size-4" />
              {testing ? "..." : t.modalPlayTestChime}
            </button>
            <button
              type="button"
              disabled={resetting}
              onClick={handleResetNetwork}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs transition-colors cursor-pointer"
            >
              <RotateCw className={`size-3.5 ${resetting ? "animate-spin" : ""}`} />
              {t.modalResetConnection}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
