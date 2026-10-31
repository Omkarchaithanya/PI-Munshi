import React, { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, Send, Sparkles, Volume2, Bot, Database } from "lucide-react";
import { speakMunshi, preloadSpeechVoices } from "@/lib/munshi/audio";
import { munshiApi } from "@/lib/api-client";
import { getTranslation } from "@/lib/munshi/i18n";
import {
  resolveMerchantAnswer,
  type MunshiLang,
  type MerchantAnswer,
} from "@/lib/munshi/merchant-query-service";
import { isGenericBrainVoiceReadout } from "@/lib/munshi/merchant-query";
import {
  startWavRecorder,
  type WavRecorder,
} from "@/lib/munshi/voice-input";

interface VoiceAssistantProps {
  lang: string;
}

export function VoiceAssistant({ lang }: VoiceAssistantProps) {
  const t = getTranslation(lang);
  const munshiLang = (lang === "kn-IN" || lang === "en-IN" ? lang : "hi-IN") as MunshiLang;

  const [listening, setListening] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<MerchantAnswer | null>(null);
  const [micHint, setMicHint] = useState<string | null>(null);
  const [voiceEngine, setVoiceEngine] = useState<"sarvam" | "browser" | null>(null);
  const recorderRef = useRef<WavRecorder | null>(null);

  useEffect(() => {
    preloadSpeechVoices();
  }, []);

  const suggestedQuestions = [
    { hi: "मेरा आज का पेमेंट कितना आया?", kn: "ಇಂದಿನ ಒಟ್ಟು ಪಾವತಿ ಎಷ್ಟು?", en: "What is my total payment today?" },
    { hi: "मेरा सेटलमेंट कब आएगा?", kn: "ಸೆಟಲ್ಮೆಂಟ್ ಯಾವಾಗ ಜಮೆಯಾಗುತ್ತದೆ?", en: "When will my settlement arrive?" },
    { hi: "साउंडबॉक्स में आवाज़ आ रही है?", kn: "ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಸರಿಯಾಗಿ ಕೆಲಸ ಮಾಡುತ್ತಿದೆಯೇ?", en: "Is the Soundbox working properly?" },
    { hi: "क्या ₹500 का पेमेंट आया है?", kn: "₹500 ಪಾವತಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆಯೇ?", en: "Did the ₹500 payment arrive?" },
  ];

  const stopListening = useCallback(() => {
    recorderRef.current = null;
    setListening(false);
  }, []);

  const handleAsk = useCallback(
    async (questionText: string) => {
      const q = (questionText || query).trim();
      if (!q) return;

      stopListening();
      setLoading(true);
      setAnswer(null);
      setMicHint(null);
      setLastQuestion(q);
      setQuery(q);

      let resolved = await resolveMerchantAnswer(q, munshiLang);

      try {
        const res = await munshiApi.runBrainCycle({
          query: q,
          merchantId: "DEMO_MERCHANT_RAMESH",
          language: munshiLang,
        });
        if (res.voiceReadout && !isGenericBrainVoiceReadout(q, res.voiceReadout)) {
          resolved = { ...resolved, reply: res.voiceReadout, source: "mdr_engine" };
        }
      } catch {
        /* ledger answer already computed */
      }

      setAnswer(resolved);
      const engine = await speakMunshi(resolved.reply, munshiLang);
      setVoiceEngine(engine);
      setLoading(false);
    },
    [query, munshiLang, stopListening],
  );

  const finishListening = useCallback(async () => {
    const recorder = recorderRef.current;
    recorderRef.current = null;
    setListening(false);
    setLoading(true);
    setMicHint(null);
    let spoken = "";
    if (recorder) {
      try {
        const audioBase64 = await recorder.stop();
        const heard = await munshiApi.transcribeVoice(audioBase64, munshiLang);
        if (heard?.error) {
          setMicHint(String(heard.error));
        }
        spoken = (heard?.transcript || "").trim();
      } catch (err) {
        setMicHint(err instanceof Error ? err.message : "Sarvam transcription failed");
      }
    }
    setLoading(false);
    if (spoken) {
      void handleAsk(spoken);
    } else if (!recorder) {
      setMicHint(t.voiceRetryHint);
    } else {
      setMicHint((prev) => prev || t.voiceRetryHint);
    }
  }, [handleAsk, munshiLang, t.voiceRetryHint]);

  const startListening = useCallback(() => {
    setQuery("");
    setMicHint(null);
    setLastQuestion(null);
    startWavRecorder()
      .then((recorder) => {
        recorderRef.current = recorder;
        setListening(true);
      })
      .catch(() => {
        setMicHint(t.voiceMicBlockedHint);
      });
  }, [t.voiceMicBlockedHint]);

  const toggleMic = () => {
    if (listening) {
      void finishListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    return () => stopListening();
  }, [stopListening]);

  const sourceLabel =
    answer?.source === "demo_ledger"
      ? t.voiceSourceLedger
      : answer?.source === "mdr_engine"
        ? t.voiceSourceMdr
        : answer?.source === "static_fallback"
          ? t.voiceSourceFallback
          : null;

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm border border-blue-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-[#E0F6FD]/60 to-transparent pointer-events-none rounded-bl-full" />

      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-[#00BAF2]/15 border border-[#00BAF2]/30 flex items-center justify-center text-[#002970]">
            <Sparkles className="size-4 text-[#002970]" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-[#002970]">{t.askMunshiTitle}</h3>
            <p className="text-[11px] text-gray-500">{t.askMunshiSub}</p>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-gray-500 mb-3 relative z-10 leading-snug">{t.voiceHowItWorks}</p>

      <div className="flex flex-wrap gap-1.5 mb-4 relative z-10">
        {suggestedQuestions.map((q, idx) => {
          const label = lang === "kn-IN" ? q.kn : lang === "en-IN" ? q.en : q.hi;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleAsk(label)}
              className="text-xs px-3 py-1.5 rounded-full bg-[#F0F8FF] hover:bg-[#E0F6FD] text-[#002970] font-medium border border-blue-100 transition-colors shadow-2xs cursor-pointer"
            >
              "{label}"
            </button>
          );
        })}
      </div>

      {micHint && (
        <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-3 relative z-10">
          {micHint}
        </p>
      )}

      {lastQuestion && (
        <p className="text-[11px] text-[#002970]/80 mb-2 relative z-10">
          <span className="font-bold">{t.voiceHeardLabel}</span> {lastQuestion}
        </p>
      )}

      {answer && (
        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-[#F0F8FF] to-white border border-[#00BAF2]/30 flex items-start gap-3 animate-in fade-in">
          <div className="size-8 rounded-full bg-[#002970] text-[#00BAF2] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
            <Bot className="size-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <span className="text-[11px] font-bold text-[#002970]">{t.aiResponseLabel}</span>
              {sourceLabel && (
                <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                  <Database className="size-3" />
                  {sourceLabel}
                </span>
              )}
              {voiceEngine && (
                <span className="text-[9px] text-gray-500">
                  {voiceEngine === "sarvam" ? t.voiceTtsSarvam : t.voiceTtsBrowser}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-800 leading-relaxed font-medium">{answer.reply}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              void speakMunshi(answer.reply, munshiLang).then(setVoiceEngine);
            }}
            className="p-1.5 rounded-lg text-[#002970] hover:bg-blue-100 transition-colors shrink-0 cursor-pointer"
            title={t.voiceReplay}
          >
            <Volume2 className="size-4" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 relative z-10">
        <button
          type="button"
          onClick={toggleMic}
          className={`size-12 rounded-2xl flex items-center justify-center shadow-md transition-all active:scale-95 shrink-0 cursor-pointer ${
            listening
              ? "bg-red-500 text-white animate-pulse ring-4 ring-red-200"
              : "bg-[#00BAF2] hover:bg-[#00a8dc] text-[#002970]"
          }`}
          title={listening ? t.voiceTapToSend : t.voiceTapToSpeak}
        >
          {listening ? <MicOff className="size-6" /> : <Mic className="size-6" />}
        </button>

        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk(query)}
            placeholder={listening ? t.listening : t.inputPlaceholder}
            className="w-full h-12 rounded-2xl border border-gray-200 bg-[#F8FAFC] px-4 text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:border-[#00BAF2] focus:bg-white focus:outline-hidden transition-all shadow-inner"
          />
          <button
            type="button"
            disabled={loading || !query.trim()}
            onClick={() => handleAsk(query)}
            className="absolute right-2 top-2 h-8 px-3 rounded-xl bg-[#002970] text-white hover:bg-[#001738] disabled:opacity-40 transition-colors flex items-center justify-center font-bold text-xs cursor-pointer"
          >
            {loading ? "..." : <Send className="size-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
