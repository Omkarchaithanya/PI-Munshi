import { Volume2, CheckCircle2 } from "lucide-react";
import { Spectrogram } from "@/components/munshi/spectrogram";
import { inrFormat } from "@/lib/munshi/backend";

export type PaytmSoundboxProps = {
  orderAmount: number;
  utr: string;
  orderId: string;
  soundHi: string;
  soundEn: string;
  lang: "hi-IN" | "kn-IN" | "en-IN";
  speaking: boolean;
  chirping: boolean;
  chirpSeed: string;
  onSpeak: () => void;
  listenAloudBtnText: string;
  soundboxHeaderText: string;
  paymentCreditedPillText: string;
  settlementDoneLabelText: string;
};

export function PaytmSoundbox({
  orderAmount,
  utr,
  orderId,
  soundHi,
  soundEn,
  lang,
  speaking,
  chirping,
  chirpSeed,
  onSpeak,
  listenAloudBtnText,
  soundboxHeaderText,
  paymentCreditedPillText,
  settlementDoneLabelText,
}: PaytmSoundboxProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-[#00BAF2]/40 bg-gradient-to-br from-[#002970] via-[#001C4D] to-[#001438] p-6 shadow-2xl">
      {/* Hardware Soundbox Top Status Bezel */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#00BAF2]/20 pb-3 text-xs text-blue-200">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00BAF2] opacity-75"></span>
            <span className="relative inline-flex size-2.5 rounded-full bg-[#00BAF2]"></span>
          </span>
          <span className="font-bold tracking-wider text-white">PAYTM SOUNDBOX 4.0 IoT</span>
          <span className="rounded bg-[#00BAF2]/20 px-1.5 py-0.5 font-mono text-[10px] text-[#00BAF2] font-semibold">
            4G VoLTE · SIM CONNECTED
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-blue-200/80">
          <span>🔋 98%</span>
          <span>📶 -72 dBm</span>
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-300 font-semibold">
            ACTIVE
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#00B569]/20 px-3.5 py-1 text-xs font-bold text-[#00B569] border border-[#00B569]/40 shadow-sm">
            <CheckCircle2 className="size-4" />
            <span>{paymentCreditedPillText}</span>
          </div>

          {/* Giant Rupee Value */}
          <div className="mt-2 text-4xl font-black tracking-tight text-white md:text-5xl">
            {inrFormat(orderAmount)}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-blue-200/80">
            <span>UTR: <strong className="font-mono text-[#00BAF2] font-bold">{utr}</strong></span>
            <span>·</span>
            <span>ऑर्डर ID: <strong className="font-mono text-white">{orderId}</strong></span>
            <span>·</span>
            <span className="text-[#00B569] font-bold">{settlementDoneLabelText}</span>
          </div>
        </div>

        {/* Giant Paytm Cyan Voice Button: बोलकर सुनें */}
        <button
          type="button"
          onClick={onSpeak}
          className={`flex items-center justify-center gap-3 rounded-2xl border-2 px-6 py-4 text-base font-black shadow-xl transition-all ${
            speaking
              ? "border-[#FFA400] bg-[#FFA400] text-[#001738] animate-pulse ring-4 ring-[#FFA400]/40"
              : "border-[#00BAF2] bg-[#00BAF2] text-[#001738] hover:bg-[#38c8f5] hover:scale-105 active:scale-95 shadow-[#00BAF2]/30"
          }`}
        >
          <Volume2 className="size-6 text-[#001738]" />
          <span className="tracking-tight">{listenAloudBtnText}</span>
        </button>
      </div>

      {/* Spoken Utterance Transcript in Big Readable Text */}
      <div className="mt-5 rounded-2xl border border-[#00BAF2]/30 bg-[#001738]/80 p-4 shadow-inner">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold tracking-wider text-[#FFA400] uppercase">
            📢 {soundboxHeaderText}
          </p>
          <span className="font-mono text-[10px] text-[#00BAF2]">Indic Bulbul TTS 3.0</span>
        </div>
        <p className="mt-1 text-base font-semibold leading-relaxed text-white">
          "{lang === "en-IN" ? soundEn : soundHi}"
        </p>
      </div>

      {/* Audio Spectrogram Waveform */}
      <div className="mt-3">
        <Spectrogram active={chirping || speaking} seed={chirpSeed} />
      </div>

      {/* Paytm Acceptance Footnote */}
      <div className="mt-4 flex flex-wrap items-center justify-between border-t border-[#00BAF2]/15 pt-3 text-[11px] text-blue-200/70">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">पेटीएम स्वीकार है</span>
          <span>·</span>
          <span>All-in-One UPI QR</span>
          <span>·</span>
          <span>RuPay</span>
          <span>·</span>
          <span>Paytm Wallet</span>
        </div>
        <div className="font-mono text-[#00BAF2]">
          100% RBI & NPCI UDIR Compliant
        </div>
      </div>
    </div>
  );
}
