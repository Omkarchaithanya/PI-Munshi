import React, { useState } from "react";
import { useMunshi } from "@/lib/munshi/store";
import { ShopkeeperView } from "./shopkeeper-view";
import { FseView } from "./fse-view";
import { JudgeView } from "./judge-view";
import { I18N } from "@/lib/munshi/i18n";
import {
  ShieldCheck,
  Store,
  UserCheck,
  Terminal,
  Home,
  CreditCard,
  Building2,
  Volume2,
  HelpCircle,
  Bell,
  Play,
  RotateCw,
} from "lucide-react";

export function CommandCenter() {
  const lang = useMunshi((s) => s.lang);
  const setLang = useMunshi((s) => s.setLang);
  const t = I18N[lang] || I18N["hi-IN"];

  // 3 Clear User Experiences: Shopkeeper (Primary) | FSE (Ops) | Judge (Technical)
  const [activeTab, setActiveTab] = useState<"shopkeeper" | "fse" | "judge">("shopkeeper");

  const running = useMunshi((s) => s.running);
  const scene = useMunshi((s) => s.scene);
  const runDefend = useMunshi((s) => s.runDefend);
  const runCheckout = useMunshi((s) => s.runCheckout);
  const runAttack = useMunshi((s) => s.runAttack);
  const runDream = useMunshi((s) => s.runDream);

  const scenes = [
    { id: 1, title: t.scene1Title, hint: t.scene1Hint, run: "defend" as const },
    { id: 2, title: t.scene2Title, hint: t.scene2Hint, run: "checkout" as const },
    { id: 3, title: t.scene3Title, hint: t.scene3Hint, run: "attack" as const },
    { id: 4, title: t.scene4Title, hint: t.scene4Hint, run: "dream" as const },
  ];

  const launch = (id: (typeof scenes)[number]["run"]) => {
    if (id === "defend") runDefend();
    else if (id === "checkout") runCheckout();
    else if (id === "attack") runAttack();
    else runDream();
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F7FB] text-gray-900 font-sans selection:bg-[#00BAF2] selection:text-[#002970]">
      {/* 1. Primary Paytm Header */}
      <header className="sticky top-0 z-40 bg-[#002970] text-white shadow-md border-b border-[#001f54]">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-2.5">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-xl bg-gradient-to-r from-[#001738] to-[#002970] px-3.5 py-1.5 border border-[#00BAF2]/40 shadow-sm">
              <span className="text-white font-black text-2xl tracking-tighter">Pay</span>
              <span className="text-[#00BAF2] font-black text-2xl tracking-tighter">tm</span>
              <span className="ml-2 rounded-md bg-[#00BAF2] px-2 py-0.5 text-xs font-black text-[#001738] tracking-tight">
                मुंशी AI
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white tracking-wide">
                  Paytm for Business
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#00BAF2]/20 px-2 py-0.5 text-[10px] font-bold text-[#00BAF2] border border-[#00BAF2]/30">
                  <ShieldCheck className="size-3" />
                  OKF v0.2
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/40">
                  <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
                  DEMO MODE (SANDBOX)
                </span>
              </div>
              <p className="text-[11px] text-blue-200/80 hidden sm:block">
                पेटीएम स्वायत्त फ्रंटलाइन साथी · 100% आरबीआई एवं एनपीसीआई यूडीआईआर अनुपालन
              </p>
            </div>
          </div>

          {/* Controls: Language Selector & 3-Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Language Switcher */}
            <div className="flex rounded-xl bg-white/10 p-0.5 text-xs border border-white/15">
              <button
                type="button"
                onClick={() => setLang("hi-IN")}
                className={`rounded-lg px-2.5 py-1 font-bold transition-all ${
                  lang === "hi-IN" ? "bg-[#00BAF2] text-[#002970] shadow-sm" : "text-blue-100 hover:text-white"
                }`}
              >
                🇮🇳 हिंदी
              </button>
              <button
                type="button"
                onClick={() => setLang("kn-IN")}
                className={`rounded-lg px-2.5 py-1 font-bold transition-all ${
                  lang === "kn-IN" ? "bg-[#00BAF2] text-[#002970] shadow-sm" : "text-blue-100 hover:text-white"
                }`}
              >
                🌾 ಕನ್ನಡ
              </button>
              <button
                type="button"
                onClick={() => setLang("en-IN")}
                className={`rounded-lg px-2.5 py-1 font-bold transition-all ${
                  lang === "en-IN" ? "bg-[#00BAF2] text-[#002970] shadow-sm" : "text-blue-100 hover:text-white"
                }`}
              >
                🌐 English
              </button>
            </div>

            {/* 3 User Experiences Tabs */}
            <div className="flex rounded-xl bg-white/10 p-0.5 text-xs border border-white/15">
              <button
                type="button"
                onClick={() => setActiveTab("shopkeeper")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-bold transition-all ${
                  activeTab === "shopkeeper"
                    ? "bg-white text-[#002970] shadow-sm"
                    : "text-blue-100 hover:text-white"
                }`}
              >
                <Store className="size-3.5" />
                <span>दुकानदार (Shop)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("fse")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-bold transition-all ${
                  activeTab === "fse"
                    ? "bg-white text-[#002970] shadow-sm"
                    : "text-blue-100 hover:text-white"
                }`}
              >
                <UserCheck className="size-3.5" />
                <span>FSE (फ़ील्ड)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("judge")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-bold transition-all ${
                  activeTab === "judge"
                    ? "bg-[#00BAF2] text-[#002970] shadow-sm font-black"
                    : "text-blue-100 hover:text-white"
                }`}
              >
                <Terminal className="size-3.5" />
                <span>जज / इंजन (Judge)</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Interactive Hackathon Evaluation Scenarios Banner */}
        <div className="border-t border-[#001f54] bg-[#001738]/80 px-4 py-2">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider flex items-center gap-1.5">
              <Play className="size-3 text-[#00BAF2]" />
              लाइव हैकथॉन टेस्ट परिदृश्य (One-Click Scenario Triggers):
            </span>

            <div className="flex flex-wrap gap-1.5">
              {scenes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={running}
                  onClick={() => launch(item.run)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    scene === item.id
                      ? "bg-[#00BAF2] text-[#002970] border-[#00BAF2] shadow-sm"
                      : "bg-white/5 border-white/10 text-blue-100 hover:bg-white/15"
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Selected User Experience */}
      <div className="flex-1">
        {activeTab === "shopkeeper" && <ShopkeeperView lang={lang} />}
        {activeTab === "fse" && <FseView lang={lang} />}
        {activeTab === "judge" && <JudgeView lang={lang} />}
      </div>

      {/* 3. Mobile / Responsive Docked Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 shadow-lg py-2 px-4 md:hidden">
        <div className="flex items-center justify-around text-center">
          <button
            type="button"
            onClick={() => setActiveTab("shopkeeper")}
            className={`flex flex-col items-center gap-0.5 text-[11px] font-bold ${
              activeTab === "shopkeeper" ? "text-[#002970]" : "text-gray-400"
            }`}
          >
            <Home className="size-5" />
            होम
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("shopkeeper");
              setTimeout(() => {
                document.getElementById("transactions-list")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="flex flex-col items-center gap-0.5 text-[11px] font-bold text-gray-400 hover:text-[#002970]"
          >
            <CreditCard className="size-5" />
            भुगतान
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("fse")}
            className={`flex flex-col items-center gap-0.5 text-[11px] font-bold ${
              activeTab === "fse" ? "text-[#002970]" : "text-gray-400"
            }`}
          >
            <UserCheck className="size-5" />
            FSE
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("judge")}
            className={`flex flex-col items-center gap-0.5 text-[11px] font-bold ${
              activeTab === "judge" ? "text-[#00BAF2]" : "text-gray-400"
            }`}
          >
            <Terminal className="size-5" />
            इंजन
          </button>
        </div>
      </nav>

      {/* 4. Footer */}
      <footer className="border-t border-gray-200 bg-white py-3 px-4 text-xs text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#002970]">Paytm Build for India AI Hackathon</span>
            <span>·</span>
            <span>Track 3: Autonomous AI Teammates</span>
            <span>·</span>
            <span className="text-[#00BAF2] font-extrabold">Pi Munshi (पाई-मुंशी)</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <ShieldCheck className="size-3.5" />
              100% NPCI UDIR & RBI FREE-AI Compliant
            </span>
            <span>·</span>
            <span className="font-mono text-[#002970] font-semibold">Google Cloud OKF v0.2</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
