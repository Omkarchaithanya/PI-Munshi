import React, { useState } from "react";
import { useMunshi } from "@/lib/munshi/store";
import { ShopkeeperView } from "./shopkeeper-view";
import { FseView } from "./fse-view";
import { JudgeView } from "./judge-view";
import { SplitSettlementView } from "./split-settlement-view";
import { getTranslation } from "@/lib/munshi/i18n";
import {
  Home,
  CreditCard,
  Building2,
  FileText,
  Scale,
  Split,
  Volume2,
  Mic,
  ArrowLeftRight,
  ScrollText,
  BarChart3,
  QrCode,
  ChevronDown,
  Bell,
} from "lucide-react";

type Page =
  | "home"
  | "payments"
  | "settlements"
  | "disputes"
  | "split"
  | "soundbox"
  | "voice"
  | "transfers"
  | "history"
  | "reports"
  | "accept";

export function CommandCenter() {
  const lang = useMunshi((s) => s.lang);
  const setLang = useMunshi((s) => s.setLang);
  const t = getTranslation(lang);
  const [page, setPage] = useState<Page>("home");

  const running = useMunshi((s) => s.running);
  const scene = useMunshi((s) => s.scene);
  const runDefend = useMunshi((s) => s.runDefend);
  const runCheckout = useMunshi((s) => s.runCheckout);
  const runAttack = useMunshi((s) => s.runAttack);
  const runDream = useMunshi((s) => s.runDream);

  const go = (next: Page) => setPage(next);

  const shopPane =
    page === "payments" || page === "history"
      ? "payments"
      : page === "settlements" || page === "transfers"
        ? "settlements"
        : page === "soundbox"
          ? "soundbox"
          : page === "voice"
            ? "voice"
            : page === "accept"
              ? "receive"
              : "all";

  const showShop = page !== "disputes" && page !== "reports" && page !== "split";

  const getPageTitle = (p: Page): string => {
    switch (p) {
      case "home":
        return t.navHome;
      case "payments":
        return t.navPayments;
      case "settlements":
        return t.navSettlement;
      case "disputes":
        return t.navDisputes;
      case "split":
        return t.navSplit;
      case "soundbox":
        return t.navSoundbox;
      case "voice":
        return t.navVoice;
      case "transfers":
        return t.navTransfers;
      case "history":
        return t.navHistory;
      case "reports":
        return t.navReports;
      case "accept":
        return t.navAccept;
      default:
        return t.navHome;
    }
  };

  const item = (id: Page, label: string, Icon: React.ComponentType<{ className?: string }>) => {
    const active = page === id;
    return (
      <button
        key={id}
        type="button"
        onClick={() => go(id)}
        className={`w-full flex items-center gap-3 px-4 py-2 text-[13px] text-left cursor-pointer ${active
            ? "text-[#00baf2] bg-[#f3fbfe] border-l-2 border-[#00baf2] font-semibold"
            : "text-[#4a4a4a] border-l-2 border-transparent hover:bg-[#f7f8fa]"
          }`}
      >
        <Icon className="size-4 shrink-0" />
        <span className="truncate">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fb] text-[#1a1a1a] font-sans antialiased">
      <aside className="hidden md:flex w-[232px] shrink-0 flex-col bg-white border-r border-[#e6e8ec]">
        <div className="h-16 flex items-center px-4 border-b border-[#eef0f3]">
          <div>
            <div className="text-[18px] font-extrabold text-[#002970] leading-none tracking-tight">Pi Munshi</div>
            <div className="text-[11px] font-semibold text-[#00baf2] mt-1">
              {lang === "kn-IN" ? "ಪೈ-ಮುನ್ಷಿ · Paytm PG" : lang === "en-IN" ? "Pi-Munshi · Paytm PG" : "पाई-मुंशी · Paytm PG"}
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          <p className="px-4 pt-2 pb-1 text-[11px] font-semibold text-[#8b93a7] uppercase tracking-wider">{t.menuGetStarted}</p>
          {item("home", t.navHome, Home)}

          <p className="px-4 pt-4 pb-1 text-[11px] font-semibold text-[#8b93a7] uppercase tracking-wider">{t.menuDashboard}</p>
          {item("payments", t.navPayments, CreditCard)}
          {item("settlements", t.navSettlement, Building2)}
          {item("disputes", t.navDisputes, Scale)}
          {item("split", t.navSplit, Split)}
          {item("soundbox", t.navSoundbox, Volume2)}
          {item("voice", t.navVoice, Mic)}

          <p className="px-4 pt-4 pb-1 text-[11px] font-semibold text-[#8b93a7] uppercase tracking-wider">{t.menuBusinessPayments}</p>
          {item("transfers", t.navTransfers, ArrowLeftRight)}
          {item("history", t.navHistory, ScrollText)}
          {item("reports", t.navReports, BarChart3)}

          <p className="px-4 pt-4 pb-1 text-[11px] font-semibold text-[#8b93a7] uppercase tracking-wider">{t.menuAcceptPayments}</p>
          {item("accept", t.navAccept, QrCode)}
        </nav>

        <div className="px-4 py-3 border-t border-[#eef0f3] text-[10px] text-[#8b93a7]">
          {t.demoBadge} · {t.okfBadge}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="h-14 bg-white border-b border-[#e6e8ec] flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2 min-w-0">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-[#00baf2] leading-none">Pi Munshi</p>
              <h1 className="text-[15px] font-semibold text-[#1a1a1a] truncate mt-0.5">
                {getPageTitle(page)}
                <span className="inline-flex items-center gap-1 ml-2 px-2.5 py-0.5 rounded-full border border-[#d9dee7] bg-white text-[12px] font-medium text-[#4a4a4a]">
                  {t.dateToday}
                  <ChevronDown className="size-3.5 text-[#6b7280]" />
                </span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-[#e6e8ec] p-0.5 text-[11px]">
              {(["hi-IN", "kn-IN", "en-IN"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`px-2 py-1 rounded cursor-pointer transition-colors ${lang === code ? "bg-[#e8f7fd] text-[#0077a8] font-bold shadow-2xs" : "text-[#6b7280] hover:text-[#1a1a1a]"}`}
                >
                  {code === "hi-IN" ? "हिंदी" : code === "kn-IN" ? "ಕನ್ನಡ" : "EN"}
                </button>
              ))}
            </div>
            <button type="button" className="p-2 text-[#6b7280] hover:text-[#1a1a1a] transition-colors" title="Notifications">
              <Bell className="size-4" />
            </button>
            <div className="size-8 rounded-full border border-[#e6e8ec] text-[11px] font-semibold text-[#002970] flex items-center justify-center bg-blue-50">
              RK
            </div>
          </div>
        </header>

        <div className="md:hidden flex gap-1 overflow-x-auto bg-white border-b border-[#e6e8ec] px-2 py-2">
          {(
            [
              ["home", t.navHome],
              ["payments", t.navPayments],
              ["settlements", t.navSettlement],
              ["disputes", t.navDisputes],
              ["voice", t.navVoice],
              ["reports", t.navReports],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => go(id)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs cursor-pointer ${page === id ? "bg-[#e8f7fd] text-[#0077a8] font-semibold" : "text-[#4a4a4a]"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        <main className="flex-1 px-4 sm:px-6 py-4">
          {showShop && <ShopkeeperView lang={lang} pane={shopPane} />}
          {page === "disputes" && <FseView lang={lang} />}
          {page === "reports" && <JudgeView lang={lang} />}
          {page === "split" && (
            <div className="rounded-lg bg-white border border-[#e6e8ec] p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#1a1a1a]">
                <FileText className="size-4 text-[#00baf2]" />
                {lang === "kn-IN" ? "ಚೆಕ್‌ಔಟ್ ರಕ್ಷಣಾ ಸನ್ನಿವೇಶಗಳು" : lang === "en-IN" ? "Checkout Defence Scenarios" : "चेकआउट डिफेंस परिदृश्य"}
              </div>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["defend", t.scene1Short, runDefend, 1],
                    ["checkout", t.scene2Short, runCheckout, 2],
                    ["attack", t.scene3Short, runAttack, 3],
                    ["dream", t.scene4Short, runDream, 4],
                  ] as const
                ).map(([id, label, run, n]) => (
                  <button
                    key={id}
                    type="button"
                    disabled={running}
                    onClick={() => run()}
                    className={`px-3 py-1.5 rounded-md text-xs border cursor-pointer ${scene === n
                        ? "bg-[#00baf2] text-white border-[#00baf2]"
                        : "bg-white text-[#1a1a1a] border-[#d9dee7]"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <SplitSettlementView lang={lang} />
            </div>
          )}
        </main>

        <footer className="bg-white border-t border-[#e6e8ec] px-4 sm:px-6 py-3 text-[11px] text-[#8b93a7] flex flex-wrap items-center justify-between gap-2">
          <span>© 2026, Pi Munshi · {t.paytmForBusiness}</span>
          <span className="flex gap-3">
            <span>{t.footerCompliance}</span>
            <span>{t.okfBadge}</span>
          </span>
        </footer>
        <div className="h-1 bg-[#00baf2]" />
      </div>
    </div>
  );
}
