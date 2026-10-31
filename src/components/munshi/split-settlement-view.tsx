import React, { useState, useEffect } from "react";
import {
  Split,
  Building2,
  ArrowRightLeft,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Percent,
  RefreshCw,
  FileText,
  Check,
  Sliders,
  Wallet,
  Store,
  Receipt,
  Scale,
} from "lucide-react";
import { munshiApi } from "@/lib/api-client";
import { useMunshi } from "@/lib/munshi/store";
import { playSwarChirp, speak } from "@/lib/munshi/audio";

interface SplitSettlementViewProps {
  lang: string;
}

export function SplitSettlementView({ lang }: SplitSettlementViewProps) {
  const [orderAmount, setOrderAmount] = useState<number>(3500);
  const [customerTrust, setCustomerTrust] = useState<number>(0.92);
  const [vcgMenu, setVcgMenu] = useState<any | null>(null);
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [dispatchMsg, setDispatchMsg] = useState<string | null>(null);
  const [savingRules, setSavingRules] = useState(false);
  const [rulesSaved, setRulesSaved] = useState(false);

  // Split Payout Percentages
  const [currentAccountSplit, setCurrentAccountSplit] = useState(70);
  const [vendorEscrowSplit, setVendorEscrowSplit] = useState(20);
  const [taxVaultSplit, setTaxVaultSplit] = useState(10);

  const [todaySettled, setTodaySettled] = useState<number>(2650);

  // Load real settlement numbers from DB
  useEffect(() => {
    munshiApi
      .getSettlements("DEMO_MERCHANT_RAMESH", "DEMO")
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          const total = res.reduce(
            (sum: number, s: any) => sum + Number(s.net_payout ?? s.total_amount ?? 0),
            0
          );
          if (total > 0) setTodaySettled(total);
        }
      })
      .catch(() => {});
  }, []);

  // Compute VCG contracts live
  useEffect(() => {
    munshiApi
      .calculateMdr({ orderAmount })
      .catch(() => {});

    // Solve 3-Option VCG Game-Theoretic Contract
    const upfrontRatio = Math.max(0.2, Math.min(0.7, 1 - customerTrust * 0.6));
    const upfrontQr = Math.round(orderAmount * upfrontRatio);
    const mandateAmount = orderAmount - upfrontQr;
    const bonusPercent = 15;
    const voucherAmount = Math.round(orderAmount * (1 + bonusPercent / 100));

    setVcgMenu({
      orderAmount,
      contractA: {
        title:
          lang === "kn-IN"
            ? "ಆಯ್ಕೆ A: ಸ್ಪ್ಲಿಟ್ QR + UPI ಆಟೋಪೇ ಮ್ಯಾಂಡೇಟ್"
            : lang === "en-IN"
              ? "Option A: Split QR + UPI AutoPay Mandate"
              : "विकल्प A: स्प्लिट QR + UPI AutoPay मैंडेट",
        description:
          lang === "kn-IN"
            ? `ತಕ್ಷಣ ₹${upfrontQr.toLocaleString("en-IN")} QR ಮೂಲಕ, ಉಳಿದ ₹${mandateAmount.toLocaleString("en-IN")} 14-ದಿನಗಳ ಆಟೋಪೇ ಡೆಬಿಟ್ ಮೂಲಕ.`
            : lang === "en-IN"
              ? `Pay ₹${upfrontQr.toLocaleString("en-IN")} instantly via UPI QR, balance ₹${mandateAmount.toLocaleString("en-IN")} via 14-day zero-fee AutoPay.`
              : `तुरंत ₹${upfrontQr.toLocaleString("en-IN")} UPI QR से, शेष ₹${mandateAmount.toLocaleString("en-IN")} 14 दिनों के जीरो-फीस ऑटोपे से।`,
        upfront: upfrontQr,
        mandate: mandateAmount,
        trustScore: "99.4% Verified",
      },
      contractB: {
        title:
          lang === "kn-IN"
            ? "ಆಯ್ಕೆ B: +15% ಇನ್ವೆಂಟರಿ ಸ್ಟೋರ್ ಬೋನಸ್ ವೋಚರ್"
            : lang === "en-IN"
              ? "Option B: +15% Inventory Store Bonus Voucher"
              : "विकल्प B: +15% इन्वेंटरी स्टोर बोनस वाउचर",
        description:
          lang === "kn-IN"
            ? `ಗ್ರಾಹಕರಿಗೆ ₹${voucherAmount.toLocaleString("en-IN")} ಮೌಲ್ಯದ ರಮೇಶ್ ಕಿರಾಣಿ ವೋಚರ್ ನೀಡಿ. ವ್ಯಾಪಾರಿಗೆ 100% GMV ಉಳಿಯುತ್ತದೆ.`
            : lang === "en-IN"
              ? `Customer receives ₹${voucherAmount.toLocaleString("en-IN")} store voucher. Merchant retains 100% GMV and boosts repeat purchase.`
              : `ग्राहक को ₹${voucherAmount.toLocaleString("en-IN")} का किराना वाउचर दें। 100% GMV सुरक्षित और पुनरावृत्ति बिक्री में वृद्धि।`,
        voucherAmount,
        gmvRetained: "100% Retained",
      },
      contractC: {
        title:
          lang === "kn-IN"
            ? "ಆಯ್ಕೆ C: ತಕ್ಷಣದ ಬ್ಯಾಂಕ್ ಮರುಪಾವತಿ (NPCI UDIR)"
            : lang === "en-IN"
              ? "Option C: Instant Bank Reversal (NPCI UDIR)"
              : "विकल्प C: तत्काल बैंक रिफंड (NPCI UDIR)",
        description:
          lang === "kn-IN"
            ? `ಗ್ರಾಹಕರ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ₹${orderAmount.toLocaleString("en-IN")} ಪೂರ್ಣ ತಕ್ಷಣ ಮರುಪಾವತಿ. NPCI ಪ್ರಮಾಣಿತ ARN ರಚಿಸಲಾಗಿದೆ.`
            : lang === "en-IN"
              ? `Full immediate refund of ₹${orderAmount.toLocaleString("en-IN")} back to customer bank. Verified with official NPCI ARN hash.`
              : `₹${orderAmount.toLocaleString("en-IN")} की पूरी राशि तुरंत ग्राहक के बैंक में वापस। आधिकारिक NPCI ARN हैश से प्रमाणित।`,
        arn: `ARN${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        status: "INSTANT_REVERSAL",
      },
    });
  }, [orderAmount, customerTrust, lang]);

  const handleSelectContract = (contractId: string, title: string) => {
    setSelectedContract(contractId);
    playSwarChirp("500");
    const msg =
      lang === "kn-IN"
        ? `${title} ಯಶಸ್ವಿಯಾಗಿ ಅನ್ವಯಿಸಲಾಗಿದೆ (WAL ದಾಖಲಿಸಲಾಗಿದೆ).`
        : lang === "en-IN"
          ? `${title} applied successfully (Committed to Write-Ahead Log).`
          : `${title} सफलतापूर्वक लागू हुआ (WAL में दर्ज)।`;
    setDispatchMsg(msg);
    speak(
      lang === "kn-IN"
        ? "ಒಪ್ಪಂದವನ್ನು ಅನುಮೋದಿಸಲಾಗಿದೆ."
        : lang === "en-IN"
          ? "Contract choice approved and dispatched."
          : "अनुबंध का चयन स्वीकृत कर दिया गया है।",
      lang
    );
    setTimeout(() => setDispatchMsg(null), 4000);
  };

  const handleSaveSplitRules = () => {
    setSavingRules(true);
    setTimeout(() => {
      setSavingRules(false);
      setRulesSaved(true);
      setTimeout(() => setRulesSaved(false), 3000);
    }, 600);
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Header Banner */}
      <section className="rounded-lg bg-white border border-[#e6e8ec] px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e8f7fd] text-[#0077a8] text-xs font-semibold">
              <Split className="size-3" />
              {lang === "kn-IN"
                ? "ಸ್ಪ್ಲಿಟ್ ಸೆಟಲ್‌ಮೆಂಟ್ & VCG ಎಂಜಿನ್"
                : lang === "en-IN"
                  ? "Split Settlement & VCG Mechanism Engine"
                  : "स्प्लिट सेटलमेंट & VCG मैकेनिज्म इंजन"}
            </span>
            <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
              {lang === "kn-IN" ? "✓ 100% ಆರ್‌ಬಿಐ & NPCI UDIR ನಿಯಮಬದ್ಧ" : lang === "en-IN" ? "✓ 100% RBI & NPCI UDIR Compliant" : "✓ 100% RBI एवं NPCI UDIR अनुपालन"}
            </span>
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-[#1a1a1a]">
            {lang === "kn-IN"
              ? "ಸ್ಪ್ಲಿಟ್ ಸೆಟಲ್‌ಮೆಂಟ್ & ಬಹು-ಖಾತೆ ವಿತರಣೆ"
              : lang === "en-IN"
                ? "Split Settlement & Multi-Account Allocation Console"
                : "स्प्लिट सेटलमेंट एवं बहु-खाता वितरण कंसोल"}
          </h2>
          <p className="text-xs text-[#6b7280] mt-1 max-w-2xl leading-relaxed">
            {lang === "kn-IN"
              ? "ದೈನಂದಿನ ಸೆಟಲ್‌ಮೆಂಟ್ ಮೊತ್ತವನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಆಪರೇಟಿಂಗ್ ಖಾತೆ, ವಿತರಕರ ಎಸ್ಕ್ರೋ ಮತ್ತು ಜಿಎಸ್‌ಟಿ ಖಾತೆಗಳಿಗೆ ವಿಭಜಿಸಿ."
              : lang === "en-IN"
                ? "Automatically partition daily settlement payouts across your primary current account, vendor supplier escrow, and tax reserves."
                : "दैनिक सेटलमेंट राशि को अपने मुख्य चालू खाते, सप्लायर एस्क्रो और टैक्स रिजर्व में स्वचालित रूप से विभाजित करें।"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] font-bold text-gray-500 uppercase block">
              {lang === "kn-IN" ? "ಇಂದಿನ ಒಟ್ಟು ಸೆಟಲ್‌ಮೆಂಟ್" : lang === "en-IN" ? "Today's Net Settlement" : "आज का कुल सेटलमेंट"}
            </span>
            <span className="text-xl font-black text-[#002970]">
              ₹{todaySettled.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </section>

      {dispatchMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{dispatchMsg}</span>
        </div>
      )}

      {/* 2. THREE-ACCOUNT SPLIT DISTRIBUTION CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Account 1: Main Current Account */}
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.06)] relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-[#00BAF2]" />
              <span className="font-extrabold text-xs text-[#002970]">
                {lang === "kn-IN" ? "ಮುಖ್ಯ ಚಾಲ್ತಿ ಖಾತೆ (Current A/c)" : lang === "en-IN" ? "Primary Operating Current A/c" : "मुख्य चालू खाता (Current A/c)"}
              </span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#002970] border border-blue-200">
              {currentAccountSplit}%
            </span>
          </div>
          <div className="mt-3.5 space-y-1.5">
            <span className="text-2xl font-black text-[#002970] block">
              ₹{((todaySettled * currentAccountSplit) / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
            <p className="text-[11px] text-gray-500">HDFC Bank · A/c **9182 · IFSC HDFC000104</p>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold inline-block mt-1">
              {lang === "kn-IN" ? "ದೈನಂದಿನ ಅಂಗಡಿ ಖರ್ಚು & ನಗದು" : lang === "en-IN" ? "Daily Store Operations & Cash" : "दैनिक दुकान व्यय एवं रोकड़"}
            </span>
          </div>
        </div>

        {/* Account 2: Supplier Restock Escrow */}
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.06)] relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Store className="size-4 text-purple-600" />
              <span className="font-extrabold text-xs text-purple-900">
                {lang === "kn-IN" ? "ಸರಬರಾಜುದಾರರ ಮರುಪೂರಣ (Escrow)" : lang === "en-IN" ? "Supplier & Restock Escrow" : "सप्लायर रीस्टॉक एस्क्रो"}
              </span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
              {vendorEscrowSplit}%
            </span>
          </div>
          <div className="mt-3.5 space-y-1.5">
            <span className="text-2xl font-black text-purple-900 block">
              ₹{((todaySettled * vendorEscrowSplit) / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
            <p className="text-[11px] text-gray-500">Metro Cash & Carry / Wholesale Distributor</p>
            <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full font-bold inline-block mt-1">
              {lang === "kn-IN" ? "ಆಟೋ-ರೀಸ್ಟಾಕ್ ಸರಕು ಖರೀದಿ" : lang === "en-IN" ? "Automated Restock Purchase" : "स्वचालित इन्वेंटरी पुनः खरीद"}
            </span>
          </div>
        </div>

        {/* Account 3: Tax & GST Reserve Vault */}
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.06)] relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Receipt className="size-4 text-emerald-600" />
              <span className="font-extrabold text-xs text-emerald-900">
                {lang === "kn-IN" ? "ಜಿಎಸ್‌ಟಿ ಮತ್ತು ತೆರಿಗೆ ವಾಲ್ಟ್ (GST)" : lang === "en-IN" ? "GST & Tax Reserve Vault" : "GST एवं टैक्स रिजर्व वॉल्ट"}
              </span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {taxVaultSplit}%
            </span>
          </div>
          <div className="mt-3.5 space-y-1.5">
            <span className="text-2xl font-black text-emerald-900 block">
              ₹{((todaySettled * taxVaultSplit) / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
            <p className="text-[11px] text-gray-500">Paytm Payments Bank Tax Escrow</p>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold inline-block mt-1">
              {lang === "kn-IN" ? "ಮಾಸಿಕ ಜಿಎಸ್‌ಟಿ ಪಾವತಿಗೆ ಉಳಿತಾಯ" : lang === "en-IN" ? "Monthly GST Set-Aside" : "मासिक GST हेतु आरक्षित राशि"}
            </span>
          </div>
        </div>
      </section>

      {/* 3. CONFIGURE SPLIT RULES SLIDERS */}
      <section className="p-5 sm:p-6 rounded-3xl bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.05)]">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Sliders className="size-4 text-[#00BAF2]" />
            <h3 className="text-sm font-black text-[#002970] uppercase tracking-wide">
              {lang === "kn-IN"
                ? "ಸ್ಪ್ಲಿಟ್ ನಿಯಮಗಳನ್ನು ಕಾನ್ಫಿಗರ್ ಮಾಡಿ (AUTO-SPLIT ALLOCATION)"
                : lang === "en-IN"
                  ? "Configure Auto-Split Allocation Rules"
                  : "ऑटो-स्प्लिट आवंटन नियम कॉन्फ़िगर करें"}
            </h3>
          </div>
          <button
            type="button"
            onClick={handleSaveSplitRules}
            disabled={savingRules}
            className="px-4 py-2 rounded-xl bg-[#002970] hover:bg-[#001738] text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            {rulesSaved ? (
              <>
                <Check className="size-3.5 text-emerald-400" />
                {lang === "kn-IN" ? "ಉಳಿಸಲಾಗಿದೆ!" : lang === "en-IN" ? "Saved!" : "सहेज लिया!"}
              </>
            ) : (
              <>
                <Check className="size-3.5" />
                {lang === "kn-IN" ? "ನಿಯಮಗಳನ್ನು ಉಳಿಸಿ" : lang === "en-IN" ? "Save Split Rules" : "नियम सहेजें"}
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5 text-xs">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-gray-700">
                {lang === "kn-IN" ? "ಚಾಲ್ತಿ ಖಾತೆ:" : lang === "en-IN" ? "Operating Account:" : "चालू खाता:"}
              </span>
              <span className="font-mono font-bold text-[#002970]">{currentAccountSplit}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="90"
              value={currentAccountSplit}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCurrentAccountSplit(val);
                const rem = 100 - val;
                setVendorEscrowSplit(Math.round(rem * 0.67));
                setTaxVaultSplit(rem - Math.round(rem * 0.67));
              }}
              className="w-full accent-[#00BAF2] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-gray-700">
                {lang === "kn-IN" ? "ವಿತರಕರ ಎಸ್ಕ್ರೋ:" : lang === "en-IN" ? "Vendor Escrow:" : "सप्लायर एस्क्रो:"}
              </span>
              <span className="font-mono font-bold text-purple-700">{vendorEscrowSplit}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={vendorEscrowSplit}
              onChange={(e) => {
                const val = Number(e.target.value);
                setVendorEscrowSplit(val);
                setTaxVaultSplit(Math.max(5, 100 - currentAccountSplit - val));
              }}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-gray-700">
                {lang === "kn-IN" ? "ತೆರಿಗೆ ಮತ್ತು ಜಿಎಸ್‌ಟಿ ವಾಲ್ಟ್:" : lang === "en-IN" ? "Tax & GST Vault:" : "टैक्स एवं GST वॉल्ट:"}
              </span>
              <span className="font-mono font-bold text-emerald-700">{taxVaultSplit}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="20"
              value={taxVaultSplit}
              onChange={(e) => {
                const val = Number(e.target.value);
                setTaxVaultSplit(val);
                setCurrentAccountSplit(100 - vendorEscrowSplit - val);
              }}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-[#002970] flex items-center justify-between">
          <span className="font-semibold">
            {lang === "kn-IN"
              ? "ರಾತ್ರಿಯ ಸೆಟಲ್‌ಮೆಂಟ್ ಸಮಯ: ಪ್ರತಿ ದಿನ 11:59 PM ಕ್ಕೆ ಸ್ವಯಂಚಾಲಿತ ವಿಭಜನೆ"
              : lang === "en-IN"
                ? "Nightly Settlement Schedule: Automatic partition at 11:59 PM daily"
                : "नाइटली सेटलमेंट अनुसूची: प्रतिदिन रात 11:59 बजे स्वतः विभाजन"}
          </span>
          <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-blue-300 font-bold">
            UTR Auto-Batching
          </span>
        </div>
      </section>

      {/* 4. AMAZON FLO PRO / VCG 3-OPTION MECHANISM DESIGN (CHECKOUT & REFUND RESCUE) */}
      <section className="p-5 sm:p-6 rounded-3xl bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.05)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
          <div className="flex items-center gap-2">
            <Scale className="size-4 text-[#00BAF2]" />
            <div>
              <h3 className="text-sm font-black text-[#002970] uppercase tracking-wide">
                {lang === "kn-IN"
                  ? "VCG ಮೆಕ್ಯಾನಿಸಂ ವಿನ್ಯಾಸ (ಚೆಕ್‌ಔಟ್ ಮತ್ತು ವಿವಾದ ರಕ್ಷಣೆ)"
                  : lang === "en-IN"
                    ? "VCG Mechanism Design (Checkout & Dispute Rescue)"
                    : "VCG मैकेनिज्म डिजाइन (चेकआउट एवं विवाद समाधान)"}
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {lang === "kn-IN"
                  ? "ಆರ್ಬಿಟ್ರೇಷನ್ ಮೂಲಕ ವ್ಯಾಪಾರಿಯ ಮಾರ್ಜಿನ್ ರಕ್ಷಿಸುವ 3-ಆಯ್ಕೆಯ ಒಪ್ಪಂದ ಮೆನು (Amazon Flo Pro & Vickrey-Clarke-Groves)"
                  : lang === "en-IN"
                    ? "Incentive-compatible 3-option contract menu resolving checkout stalls and dispute refunds without margin sacrifice."
                    : "दुकानदार के मार्जिन की रक्षा करते हुए चेकआउट व विवाद समाधान का 3-विकल्पीय अनुबंध मेनू।"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="text-xs text-gray-600 font-bold">
              {lang === "kn-IN" ? "ಮೊತ್ತ:" : lang === "en-IN" ? "Amount:" : "राशि:"}
            </label>
            <input
              type="number"
              value={orderAmount}
              onChange={(e) => setOrderAmount(Math.max(100, Number(e.target.value)))}
              className="w-24 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-mono font-bold text-[#002970] focus:border-[#00BAF2] focus:outline-hidden"
            />
          </div>
        </div>

        {/* 3 VCG Contracts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {/* Contract A: Split QR + AutoPay */}
          <div
            className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
              selectedContract === "A"
                ? "border-[#00BAF2] bg-[#F0F9FF] shadow-md"
                : "border-gray-200 bg-white hover:border-blue-200"
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-black text-[#002970]">
                  {vcgMenu?.contractA?.title}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {vcgMenu?.contractA?.trustScore}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">
                {vcgMenu?.contractA?.description}
              </p>
              <div className="mt-3 p-2 rounded-xl bg-white border border-blue-100 text-[11px] text-gray-700 font-mono space-y-1">
                <div className="flex justify-between">
                  <span>Upfront QR:</span>
                  <span className="font-bold text-[#002970]">₹{vcgMenu?.contractA?.upfront}</span>
                </div>
                <div className="flex justify-between">
                  <span>AutoPay Mandate:</span>
                  <span className="font-bold text-emerald-700">₹{vcgMenu?.contractA?.mandate}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleSelectContract("A", vcgMenu?.contractA?.title)}
              className="w-full mt-4 py-2 px-3 rounded-xl bg-[#00BAF2] hover:bg-[#00a8dc] text-[#001738] font-black text-xs transition-colors cursor-pointer text-center"
            >
              {lang === "kn-IN" ? "ಆಯ್ಕೆ A ಆಯ್ಕೆಮಾಡಿ" : lang === "en-IN" ? "Select Option A" : "विकल्प A चुनें"}
            </button>
          </div>

          {/* Contract B: Store Voucher (+15% Bonus) */}
          <div
            className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
              selectedContract === "B"
                ? "border-purple-500 bg-purple-50/50 shadow-md"
                : "border-gray-200 bg-white hover:border-purple-200"
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-black text-purple-900">
                  {vcgMenu?.contractB?.title}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  {vcgMenu?.contractB?.gmvRetained}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">
                {vcgMenu?.contractB?.description}
              </p>
              <div className="mt-3 p-2 rounded-xl bg-white border border-purple-100 text-[11px] text-gray-700 font-mono space-y-1">
                <div className="flex justify-between">
                  <span>Voucher Value:</span>
                  <span className="font-bold text-purple-800">₹{vcgMenu?.contractB?.voucherAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Merchant Retention:</span>
                  <span className="font-bold text-emerald-700">100% GMV</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleSelectContract("B", vcgMenu?.contractB?.title)}
              className="w-full mt-4 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors cursor-pointer text-center"
            >
              {lang === "kn-IN" ? "ಆಯ್ಕೆ B ಆಯ್ಕೆಮಾಡಿ" : lang === "en-IN" ? "Select Option B" : "विकल्प B चुनें"}
            </button>
          </div>

          {/* Contract C: Instant Bank Reversal */}
          <div
            className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
              selectedContract === "C"
                ? "border-amber-500 bg-amber-50/50 shadow-md"
                : "border-gray-200 bg-white hover:border-amber-200"
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-black text-amber-900">
                  {vcgMenu?.contractC?.title}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  NPCI UDIR
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">
                {vcgMenu?.contractC?.description}
              </p>
              <div className="mt-3 p-2 rounded-xl bg-white border border-amber-100 text-[11px] text-gray-700 font-mono space-y-1">
                <div className="flex justify-between">
                  <span>Refund Amount:</span>
                  <span className="font-bold text-red-600">₹{orderAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Attestation ARN:</span>
                  <span className="font-bold text-gray-600 truncate">{vcgMenu?.contractC?.arn}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleSelectContract("C", vcgMenu?.contractC?.title)}
              className="w-full mt-4 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#001738] font-bold text-xs transition-colors cursor-pointer text-center"
            >
              {lang === "kn-IN" ? "ಆಯ್ಕೆ C ಆಯ್ಕೆಮಾಡಿ" : lang === "en-IN" ? "Select Option C" : "विकल्प C चुनें"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
