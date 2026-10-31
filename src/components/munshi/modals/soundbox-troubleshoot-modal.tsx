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
      await munshiApi.triggerSoundboxChime(100, lang.slice(0, 2), "DEMO_SB_RAMESH", "DEMO");
      playSwarChirp("100");

      const chimeSpoken =
        lang === "kn-IN"
          ? "ಪೇಟಿಎಂನಲ್ಲಿ ನೂರು ರೂಪಾಯಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ."
          : lang === "en-IN"
            ? "Received one hundred rupees on Paytm."
            : "पेटीएम पर एक सौ रुपये प्राप्त हुए।";

      speak(chimeSpoken, lang);

      const msg =
        lang === "kn-IN"
          ? "ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಸ್ಪೀಕರ್ ಮತ್ತು ಅಲ್ಟ್ರಾಸಾನಿಕ್ ಸ್ವರ್ ಸಕ್ರಿಯವಾಗಿದೆ!"
          : lang === "en-IN"
            ? "Soundbox speaker and ultrasonic chime active!"
            : "साउंडबॉक्स स्पीकर एवं अल्ट्रासोनिक स्वर मुद्रा सक्रिय है!";

      setStatusMsg(msg);
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
      const msg =
        lang === "kn-IN"
          ? "4G ಸಿಮ್ ಮರು-ಸಂಪರ್ಕಗೊಂಡಿದೆ. ಸಿಗ್ನಲ್ ಗುಣಮಟ್ಟ: ಅತ್ಯುತ್ತಮ (98%)"
          : lang === "en-IN"
            ? "4G SIM reconnected. Signal quality: Excellent (98%)"
            : "4G सिम पुनः कनेक्ट हो गया है। सिग्नल क्षमता: उत्तम (98%)";

      setStatusMsg(msg);

      const spoken =
        lang === "kn-IN"
          ? "ನೆಟ್‌ವರ್ಕ್ ಯಶಸ್ವಿಯಾಗಿ ಮರುಹೊಂದಿಸಲಾಗಿದೆ."
          : lang === "en-IN"
            ? "Network reset completed successfully."
            : "नेटवर्क सफलतापूर्वक रीसेट हो गया है।";

      speak(spoken, lang);
      setTimeout(() => setStatusMsg(null), 3500);
    }, 1200);
  };

  const batteryLabel =
    lang === "kn-IN" ? "ಬ್ಯಾಟರಿ ಮಟ್ಟ" : lang === "en-IN" ? "Battery Level" : "बैटरी स्तर";

  const batteryValue =
    lang === "kn-IN" ? "88% (ಚಾರ್ಜ್ ಆಗಿದೆ)" : lang === "en-IN" ? "88% (Charged)" : "88% (चार्ज्ड)";

  const signalLabel =
    lang === "kn-IN" ? "ನೆಟ್‌ವರ್ಕ್ ಸಿಗ್ನಲ್" : lang === "en-IN" ? "Network Signal" : "नेटवर्क सिग्नल";

  const signalValue =
    lang === "kn-IN" ? "4G VoLTE (ಉತ್ತಮ)" : lang === "en-IN" ? "4G VoLTE (Strong)" : "4G VoLTE (पूर्ण)";

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
                <h4 className="font-black text-sm text-[#002970]">{t.soundboxModel}</h4>
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
                <span className="text-[10px] text-gray-500 block">{batteryLabel}</span>
                <span className="font-bold text-gray-800">{batteryValue}</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center gap-2.5">
              <Wifi className="size-4 text-blue-600" />
              <div>
                <span className="text-[10px] text-gray-500 block">{signalLabel}</span>
                <span className="font-bold text-gray-800">{signalValue}</span>
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
          <div className="flex gap-2 mt-5">
            <button
              disabled={testing}
              onClick={handleTestChime}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#002970] hover:bg-[#001738] text-white font-bold text-xs transition-colors cursor-pointer"
            >
              <Volume2 className="size-3.5" />
              {testing ? "..." : t.modalPlayTestChime}
            </button>
            <button
              disabled={resetting}
              onClick={handleResetNetwork}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 hover:border-[#00BAF2] text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <RotateCw className={`size-3.5 ${resetting ? "animate-spin" : ""}`} />
              {resetting ? "..." : t.modalResetConnection}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
