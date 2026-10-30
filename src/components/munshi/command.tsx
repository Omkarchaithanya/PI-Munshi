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
  User,
  ExternalLink,
} from "lucide-react";

export function CommandCenter() {
  const lang = useMunshi((s) => s.lang);
  const setLang = useMunshi((s) => s.setLang);
  const t = I18N[lang] || I18N["hi-IN"];

  // 3 Primary User Experiences
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
    <div className="flex min-h-screen flex-col bg-[#F4F7FB] text-gray-900 font-sans antialiased selection:bg-[#00BAF2] selection:text-[#002970]">
      {/* 1. COMPACT ~72px DEEP PAYTM-BLUE HEADER */}
      <header className="sticky top-0 z-40 bg-[#002970] text-white shadow-md border-b border-[#001f54] h-[72px] flex items-center">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Branding & Merchant Indicator */}
          <div className="flex items-center gap-3.5 shrink-0">
            <div className="flex items-center rounded-xl bg-gradient-to-r from-[#001738] to-[#002970] px-3.5 py-1.5 border border-[#00BAF2]/40 shadow-xs">
              <span className="text-white font-black text-2xl tracking-tighter">Pay</span>
              <span className="text-[#00BAF2] font-black text-2xl tracking-tighter">tm</span>
              <span className="ml-2 rounded-md bg-[#00BAF2] px-2 py-0.5 text-xs font-black text-[#001738] tracking-tight">
                मुंशी AI
              </span>
            </div>

            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white tracking-wide">
                  Paytm for Business
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#00BAF2]/20 px-2 py-0.5 text-[10px] font-bold text-[#00BAF2] border border-[#00BAF2]/30">
                  <ShieldCheck className="size-3" />
                  OKF v0.2
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/40">
                  <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
                  DEMO MODE
                </span>
              </div>
            </div>
          </div>

          {/* Center/Right: View Switcher, Language & Profile Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Switcher Segment */}
            <div className="flex rounded-xl bg-white/10 p-1 text-xs border border-white/15">
              <button
                type="button"
                onClick={() => setActiveTab("shopkeeper")}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1 font-bold transition-all cursor-pointer ${
                  activeTab === "shopkeeper"
                    ? "bg-white text-[#002970] shadow-sm"
                    : "text-blue-100 hover:text-white"
                }`}
              >
                <Store className="size-3.5" />
                <span className="hidden xs:inline">दुकानदार</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("fse")}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1 font-bold transition-all cursor-pointer ${
                  activeTab === "fse"
                    ? "bg-white text-[#002970] shadow-sm"
                    : "text-blue-100 hover:text-white"
                }`}
              >
                <UserCheck className="size-3.5" />
                <span className="hidden xs:inline">फ़ील्ड FSE</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("judge")}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1 font-bold transition-all cursor-pointer ${
                  activeTab === "judge"
                    ? "bg-[#00BAF2] text-[#002970] shadow-sm font-black"
                    : "text-blue-100 hover:text-white"
                }`}
              >
                <Terminal className="size-3.5" />
                <span className="hidden xs:inline">जज / इंजन</span>
              </button>
            </div>

            {/* Language Selector */}
            <div className="hidden md:flex rounded-xl bg-white/10 p-1 text-xs border border-white/15">
              <button
                type="button"
                onClick={() => setLang("hi-IN")}
                className={`rounded-lg px-2 py-0.5 font-bold transition-all cursor-pointer ${
                  lang === "hi-IN" ? "bg-[#00BAF2] text-[#002970]" : "text-blue-100 hover:text-white"
                }`}
              >
                हिंदी
              </button>
              <button
                type="button"
                onClick={() => setLang("kn-IN")}
                className={`rounded-lg px-2 py-0.5 font-bold transition-all cursor-pointer ${
                  lang === "kn-IN" ? "bg-[#00BAF2] text-[#002970]" : "text-blue-100 hover:text-white"
                }`}
              >
                ಕನ್ನಡ
              </button>
              <button
                type="button"
                onClick={() => setLang("en-IN")}
                className={`rounded-lg px-2 py-0.5 font-bold transition-all cursor-pointer ${
                  lang === "en-IN" ? "bg-[#00BAF2] text-[#002970]" : "text-blue-100 hover:text-white"
                }`}
              >
                EN
              </button>
            </div>

            {/* Bell & User Avatar */}
            <button
              type="button"
              onClick={() => alert("कोई नई चेतावनी नहीं। सभी 3 साउंडबॉक्स ऑनलाइन हैं।")}
              className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="सूचनाएं"
            >
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-emerald-400" />
            </button>

            <div className="size-8 rounded-full bg-[#00BAF2] text-[#002970] flex items-center justify-center font-black text-xs shadow-inner cursor-pointer" title="रमेश किराना स्टोर प्रोफ़ाइल">
              RK
            </div>
          </div>
        </div>
      </header>

      {/* Slim One-Click Evaluation Triggers Strip */}
      <div className="border-b border-[#001f54]/40 bg-[#001738] px-4 py-1.5 text-xs text-blue-200">
        <div className="w-full max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold text-[11px] text-[#00BAF2]">
            <Play className="size-3 fill-current" />
            <span>लाइव हैकथॉन टेस्ट परिदृश्य (One-Click Scenario Triggers):</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {scenes.map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={running}
                onClick={() => launch(item.run)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-all cursor-pointer ${
                  scene === item.id
                    ? "bg-[#00BAF2] text-[#002970] border-[#00BAF2] shadow-xs"
                    : "bg-white/5 border-white/10 text-blue-100 hover:bg-white/15"
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. MAIN ACTIVE EXPERIENCE VIEW */}
      <main className="flex-1">
        {activeTab === "shopkeeper" && <ShopkeeperView lang={lang} />}
        {activeTab === "fse" && <FseView lang={lang} />}
        {activeTab === "judge" && <JudgeView lang={lang} />}
      </main>

      {/* 3. DOCKED BOTTOM NAVIGATION (Home | Payments | Settlements | Soundbox | Help) - MOBILE ONLY */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-xl py-2 px-4">
        <div className="max-w-md mx-auto flex items-center justify-between text-center">
          <button
            type="button"
            onClick={() => setActiveTab("shopkeeper")}
            className={`flex flex-col items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors ${
              activeTab === "shopkeeper" ? "text-[#002970]" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Home className="size-5" />
            <span>होम</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("shopkeeper");
              setTimeout(() => {
                document.getElementById("transactions-list")?.scrollIntoView({ behavior: "smooth" });
              }, 50);
            }}
            className="flex flex-col items-center gap-1 text-[11px] font-bold text-gray-400 hover:text-[#002970] cursor-pointer transition-colors"
          >
            <CreditCard className="size-5" />
            <span>भुगतान</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("shopkeeper");
              // triggers settlement modal via DOM trigger
              const el = document.querySelector('button:has-text("बैंक सेटलमेंट")') as HTMLButtonElement;
              el?.click();
            }}
            className="flex flex-col items-center gap-1 text-[11px] font-bold text-gray-400 hover:text-[#002970] cursor-pointer transition-colors"
          >
            <Building2 className="size-5" />
            <span>सेटलमेंट</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("shopkeeper");
              const el = document.querySelector('button:has-text("साउंडबॉक्स")') as HTMLButtonElement;
              el?.click();
            }}
            className="flex flex-col items-center gap-1 text-[11px] font-bold text-gray-400 hover:text-[#002970] cursor-pointer transition-colors"
          >
            <Volume2 className="size-5" />
            <span>साउंडबॉक्स</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("fse");
            }}
            className="flex flex-col items-center gap-1 text-[11px] font-bold text-gray-400 hover:text-[#002970] cursor-pointer transition-colors"
          >
            <HelpCircle className="size-5" />
            <span>सहायता / FSE</span>
          </button>
        </div>
      </nav>

      {/* 4. FOOTER */}
      <footer className="border-t border-gray-200 bg-white py-3 px-4 text-xs text-gray-500 mb-14 md:mb-0">
        <div className="w-full max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#002970]">Paytm Build for India AI Hackathon</span>
            <span>·</span>
            <span>Track 3: Autonomous AI Teammates</span>
            <span>·</span>
            <span className="text-[#00BAF2] font-black">Pi Munshi (पाई-मुंशी)</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <ShieldCheck className="size-3.5" />
              100% NPCI UDIR & RBI FREE-AI Compliant
            </span>
            <span>·</span>
            <span className="font-mono text-[#002970] font-bold">Google Cloud OKF v0.2</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
