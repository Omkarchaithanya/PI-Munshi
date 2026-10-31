import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Volume2,
  Bot,
  Settings2,
  ChevronDown,
  ChevronUp,
  Brain,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Activity,
  Layers,
  Database,
  Lock,
  Radio,
  Sliders,
} from "lucide-react";
import { speakMunshi, preloadSpeechVoices } from "@/lib/munshi/audio";
import { munshiApi } from "@/lib/api-client";
import { getTranslation } from "@/lib/munshi/i18n";
import {
  resolveMerchantAnswer,
  type MunshiLang,
  type MerchantAnswer,
} from "@/lib/munshi/merchant-query-service";
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
  const [brainData, setBrainData] = useState<any | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("sarvam-105b-conversations");
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showThinking, setShowThinking] = useState<boolean>(true);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);
  const recorderRef = useRef<WavRecorder | null>(null);

  useEffect(() => {
    preloadSpeechVoices();
  }, []);

  const suggestedQuestions = [
    { hi: "मेरा आज का पेमेंट कितना आया?", kn: "ಇಂದಿನ ಒಟ್ಟು ಪಾವತಿ ಎಷ್ಟು?", en: "What is my total payment today?" },
    { hi: "मेरा सेटलमेंट कब आएगा?", kn: "ಸೆಟಲ್ಮೆಂಟ್ ಯಾವಾಗ ಜಮೆಯಾಗುತ್ತದೆ?", en: "When will my settlement arrive?" },
    { hi: "साउंडबॉक्स में आवाज़ आ रही है?", kn: "ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಸರಿಯಾಗಿ ಕೆಲಸ ಮಾಡುತ್ತಿದೆಯೇ?", en: "Is the Soundbox working properly?" },
    { hi: "क्या ₹500 का पेमेंट आया है?", kn: "₹500 ಪಾವತಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆಯೇ?", en: "Did the ₹500 payment arrive?" },
    { hi: "क्या मैं दैनिक QR लिमिट बढ़ा सकता हूँ?", kn: "ನನ್ನ ದೈನಂದಿನ QR ಮಿತಿಯನ್ನು ಹೆಚ್ಚಿಸಬಹುದೇ?", en: "Can I increase my daily QR limit?" },
    { hi: "क्या मुझे ₹25,000 का लोन मिल सकता है?", kn: "ನನಗೆ ₹25,000 ಸಾಲ ಸಿಗಬಹುದೇ?", en: "Can I get a loan for ₹25,000?" },
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
      setBrainData(null);
      setMicHint(null);
      setLastQuestion(q);
      setQuery("");

      try {
        let resolved: MerchantAnswer | null = null;
        let brainCycleRes: any = null;

        try {
          brainCycleRes = await munshiApi.runBrainCycle({
            query: q,
            merchantId: "DEMO_MERCHANT_RAMESH",
            language: munshiLang,
            model: selectedModel,
          });

          setBrainData(brainCycleRes);

          const brainReadout = (brainCycleRes?.voiceReadout || "").trim();
          if (brainReadout) {
            resolved = {
              reply: brainReadout,
              intent: brainCycleRes?.intent || "UNKNOWN",
              source: "brain_llm",
              facts: brainCycleRes?.executionOutput?.ledger || {},
            };
          }
        } catch (brainErr) {
          console.warn("[VoiceAssistant] Brain LLM cycle error, using ledger fallback:", brainErr);
        }

        if (!resolved) {
          resolved = await resolveMerchantAnswer(q, munshiLang);
        }

        setAnswer(resolved);

        if (autoSpeak) {
          await speakMunshi(resolved.reply, munshiLang);
        }
      } catch (err) {
        console.error("handleAsk error:", err);
      } finally {
        setLoading(false);
      }
    },
    [query, munshiLang, selectedModel, autoSpeak, stopListening],
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
        const heard: any = await munshiApi.transcribeVoice(audioBase64, munshiLang);
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

  const modelLabels: Record<string, { title: string; tag: string }> = {
    "sarvam-105b-conversations": {
      title: lang === "kn-IN" ? "ಸರ್ವಂ ಇಂಡಸ್ 105B (Indic MoE)" : lang === "hi-IN" ? "सर्वम इंडस 105B (Indic MoE)" : "Sarvam Indus 105B (Indic MoE)",
      tag: "Vernacular Thinking",
    },
    "pi-agent-autonomous": {
      title: lang === "kn-IN" ? "ಪೈ ಮುನ್ಷಿ ಸ್ವಾಯತ್ತ ಏಜೆಂಟ್" : lang === "hi-IN" ? "पाई मुंशी स्वायत्त एजेंट" : "Pi Munshi Autonomous Agent",
      tag: "Multi-Rung CoT",
    },
    "ceecil-reflex": {
      title: lang === "kn-IN" ? "CEEcil ರಿಫ್ಲೆಕ್ಸ್ ಎಂಜಿನ್" : lang === "hi-IN" ? "CEEcil रिफ्लेक्स इंजन" : "CEEcil Rung 1 Reflex",
      tag: "<200ms Deterministic",
    },
  };

  const currentModelInfo = modelLabels[selectedModel] || modelLabels["sarvam-105b-conversations"];

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm border border-blue-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-[#E0F6FD]/60 to-transparent pointer-events-none rounded-bl-full" />

      {/* TOP HEADER & MODEL SELECTOR */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-2xl bg-[#002970] text-[#00BAF2] flex items-center justify-center shadow-sm">
            <Bot className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-[#002970]">{t.askMunshiTitle}</h3>
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#002970] border border-blue-200 px-2 py-0.5 rounded-full">
                L2 Autonomy
              </span>
            </div>
            <p className="text-[11px] text-gray-500">{t.askMunshiSub}</p>
          </div>
        </div>

        {/* ACTIVE MODEL PILL & SETTINGS BUTTON */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F0F8FF] hover:bg-[#E0F6FD] border border-blue-200 text-[#002970] text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Configure LLM Agent Model & Thinking Settings"
          >
            <Brain className="size-3.5 text-[#00BAF2]" />
            <span className="max-w-[130px] sm:max-w-none truncate">{currentModelInfo.title}</span>
            <Settings2 className="size-3.5 text-gray-500 ml-0.5" />
          </button>
        </div>
      </div>

      {/* SETTINGS PANEL (EXPANDABLE) */}
      {showSettings && (
        <div className="p-4 mb-4 rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-blue-50/50 border border-blue-200 text-xs text-[#002970] space-y-3 relative z-10 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <span className="font-extrabold uppercase tracking-wide flex items-center gap-1.5 text-[11px]">
              <Sliders className="size-3.5 text-[#00BAF2]" />
              {lang === "hi-IN" ? "एजेंट मॉडल एवं थिंकिंग सेटिंग्स" : lang === "kn-IN" ? "ಏಜೆಂಟ್ ಮಾದರಿ & ಥಿಂಕಿಂಗ್ ಸೆಟ್ಟಿಂಗ್ಸ್" : "Agent Model & Thinking Settings"}
            </span>
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="text-gray-400 hover:text-gray-700 font-bold"
            >
              ✕
            </button>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-600 block mb-1.5">
              {lang === "hi-IN" ? "सक्रिय LLM मॉडल चुनें:" : lang === "kn-IN" ? "ಸಕ್ರಿಯ LLM ಮಾದರಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:" : "Select Active LLM Agent Model:"}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: "sarvam-105b-conversations", label: "Sarvam Indus 105B", desc: "Indic MoE Vernacular", icon: Brain },
                { id: "pi-agent-autonomous", label: "Autonomous Agent", desc: "Multi-Rung Cognitive CoT", icon: Cpu },
                { id: "ceecil-reflex", label: "CEEcil Reflex", desc: "Sub-200ms Deterministic", icon: Zap },
              ].map((m) => {
                const isSelected = selectedModel === m.id;
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setSelectedModel(m.id);
                      setShowSettings(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#002970] text-white border-[#002970] shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[11px]">{m.label}</span>
                      <Icon className={`size-3.5 ${isSelected ? "text-[#00BAF2]" : "text-gray-400"}`} />
                    </div>
                    <span className={`text-[10px] block ${isSelected ? "text-blue-200" : "text-gray-500"}`}>
                      {m.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-gray-200/60 text-[11px]">
            <label className="flex items-center gap-2 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={showThinking}
                onChange={(e) => setShowThinking(e.target.checked)}
                className="rounded text-[#00BAF2] focus:ring-0 cursor-pointer"
              />
              <span>{lang === "hi-IN" ? "थिंकिंग प्रोसेस (CoT) दिखाएं" : lang === "kn-IN" ? "ಥಿಂಕಿಂಗ್ ಪ್ರಕ್ರಿಯೆ ತೋರಿಸಿ" : "Show Agent Thinking Process"}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={autoSpeak}
                onChange={(e) => setAutoSpeak(e.target.checked)}
                className="rounded text-[#00BAF2] focus:ring-0 cursor-pointer"
              />
              <span>{lang === "hi-IN" ? "ध्वनि में उत्तर सुनाएं (Auto-Speak)" : lang === "kn-IN" ? "ಧ್ವನಿಯಲ್ಲಿ ಉತ್ತರ ಪ್ಲೇ ಮಾಡಿ" : "Auto-Speak Response"}</span>
            </label>
          </div>
        </div>
      )}

      {/* SUGGESTED QUESTIONS CAROUSEL */}
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
        <p className="text-[11px] text-[#002970]/80 mb-2 relative z-10 flex items-center gap-1.5">
          <span className="font-bold">{t.voiceHeardLabel}</span>
          <span className="font-medium bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200">
            "{lastQuestion}"
          </span>
        </p>
      )}

      {/* LOADING / THINKING ANIMATION */}
      {loading && (
        <div className="mb-4 p-4 rounded-2xl bg-blue-50/70 border border-[#00BAF2]/40 flex items-center gap-3 animate-pulse">
          <div className="size-9 rounded-2xl bg-[#00BAF2] text-[#001738] flex items-center justify-center shrink-0">
            <Brain className="size-5 animate-spin" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-black text-[#002970] block">
              {lang === "hi-IN"
                ? "मुंशी एजेंट विचार कर रहा है एवं लेज़र तथ्यों की पुष्टि कर रहा है..."
                : lang === "kn-IN"
                ? "ಮುನ್ಷಿ ಏಜೆಂಟ್ ಆಲೋಚಿಸುತ್ತಿದೆ ಮತ್ತು ಲೆಡ್ಜರ್ ಸತ್ಯಗಳನ್ನು ಪರಿಶೀಲಿಸುತ್ತಿದೆ..."
                : "Agent Thinking & Grounding in Store Facts..."}
            </span>
            <p className="text-[11px] text-gray-500 font-mono">
              Observation → Ledger Recall → FSM Lexical Shield → Vernacular Synthesis
            </p>
          </div>
        </div>
      )}

      {/* ANSWER CARD */}
      {answer && (
        <div className="mb-4 rounded-2xl bg-gradient-to-r from-[#F0F8FF] to-white border border-[#00BAF2]/30 p-4 space-y-3 shadow-xs animate-in fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="size-9 rounded-2xl bg-[#002970] text-[#00BAF2] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Bot className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black text-[#002970]">{t.aiResponseLabel}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-[#002970]">
                    {brainData?.executionOutput?.llmModel || currentModelInfo.title}
                  </span>
                  {brainData?.estimatedLatencyMs && (
                    <span className="text-[10px] text-gray-500 font-mono">
                      {brainData.estimatedLatencyMs}ms
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-semibold">
                  {answer.reply}
                </p>
              </div>
            </div>

            <button
              onClick={() => speakMunshi(answer.reply, munshiLang)}
              className="p-2 rounded-xl text-[#002970] hover:bg-blue-100 transition-colors shrink-0 cursor-pointer shadow-2xs bg-white"
              title={lang === "hi-IN" ? "पुनः सुनें" : lang === "kn-IN" ? "ಮತ್ತೆ ಕೇಳಿ" : "Listen again"}
            >
              <Volume2 className="size-4.5" />
            </button>
          </div>

          {/* AGENT THINKING PROCESS ACCORDION */}
          {showThinking && brainData?.thoughtChain && brainData.thoughtChain.length > 0 && (
            <div className="pt-2 border-t border-blue-100">
              <div className="p-3 rounded-xl bg-white border border-blue-100 text-xs space-y-2">
                <div className="flex items-center justify-between text-[#002970]">
                  <span className="font-extrabold uppercase tracking-wide flex items-center gap-1.5 text-[11px]">
                    <Brain className="size-3.5 text-[#00BAF2]" />
                    {lang === "hi-IN" ? "एजेंट थिंकिंग प्रोसेस (Chain of Thought)" : lang === "kn-IN" ? "ಏಜೆಂಟ್ ಥಿಂಕಿಂಗ್ ಪ್ರಕ್ರಿಯೆ (Chain of Thought)" : "Agent Cognitive Thought Process"}
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="size-3" />
                    5/5 Verified
                  </span>
                </div>

                <div className="space-y-1.5 pt-1 text-[11px]">
                  {brainData.thoughtChain.map((step: any, sIdx: number) => (
                    <div key={sIdx} className="flex items-start gap-2 bg-[#F8FAFC] p-2 rounded-lg border border-gray-100">
                      <span className="size-5 rounded-md bg-[#002970] text-[#00BAF2] font-black text-[10px] flex items-center justify-center shrink-0">
                        {step.step}
                      </span>
                      <div className="flex-1">
                        <span className="font-bold text-[#002970] block leading-tight">{step.title}</span>
                        <p className="text-gray-600 mt-0.5 leading-snug">{step.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* INPUT FIELD & VOICE MIC */}
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
