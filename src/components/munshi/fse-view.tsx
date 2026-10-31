import React, { useState, useEffect } from "react";
import {
  MapPin,
  Store,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  Send,
  Volume2,
  ArrowRight,
  ShieldAlert,
  FileText,
  UserMinus,
  Sparkles,
  RefreshCw,
  Phone,
  Calendar,
  CheckSquare,
  X,
  Camera,
  UploadCloud,
  RotateCcw,
  Building2,
  QrCode,
  Battery,
  Wifi,
  FileCheck,
  Check,
} from "lucide-react";
import { munshiApi } from "@/lib/api-client";
import { speak } from "@/lib/munshi/audio";
import { getTranslation } from "@/lib/munshi/i18n";

interface FseViewProps {
  lang: string;
}

interface MerchantDossier {
  id: string;
  name: { en: string; hi: string; kn: string };
  category: { en: string; hi: string; kn: string };
  owner: string;
  phone: string;
  address: string;
  upiId: string;
  gstin: string;
  dailySales: string;
  dailyTxns: number;
  nextVisit: { en: string; hi: string; kn: string };
  status: "active_priority" | "low_battery" | "active";
  soundbox: {
    model: string;
    imei: string;
    battery: number;
    batteryStatus: string;
    signal: string;
    sim: string;
    lang: string;
  };
  bankAccount: {
    bank: string;
    accountNo: string;
    ifsc: string;
    cycle: string;
  };
}

const MERCHANTS_DATA: MerchantDossier[] = [
  {
    id: "DEMO_MERCHANT_RAMESH",
    name: {
      en: "Ramesh Kirana Store",
      hi: "रमेश किराना स्टोर",
      kn: "ರಮೇಶ್ ಕಿರಾಣಿ ಸ್ಟೋರ್",
    },
    category: {
      en: "Daily Groceries & Provisions",
      hi: "दैनिक किराना एवं राशन",
      kn: "ದೈನಂದಿನ ದಿನಸಿ ಮತ್ತು ಸಾಮಗ್ರಿಗಳು",
    },
    owner: "Ramesh Kumar",
    phone: "+91 98450 12345",
    address: "Shop 14, 8th Main, 4th Block, Koramangala, Bengaluru, Karnataka 560034",
    upiId: "ramesh.kirana@paytm",
    gstin: "29AABCR1234F1Z5",
    dailySales: "₹4,500.00",
    dailyTxns: 18,
    nextVisit: {
      en: "Today 4:00 PM",
      hi: "आज 4:00 PM",
      kn: "ಇಂದು 4:00 PM",
    },
    status: "active_priority",
    soundbox: {
      model: "Paytm Soundbox 4.0 4G",
      imei: "864902041289410",
      battery: 88,
      batteryStatus: "Good",
      signal: "Strong 4G VoLTE (-68 dBm)",
      sim: "Airtel IoT 4G",
      lang: "Hindi + Kannada (Multilingual)",
    },
    bankAccount: {
      bank: "State Bank of India (Koramangala Branch)",
      accountNo: "•••• •••• 4091",
      ifsc: "SBIN0004051",
      cycle: "T+0 Nightly Auto-Settlement (11:59 PM)",
    },
  },
  {
    id: "DEMO_MERCHANT_SURESH",
    name: {
      en: "Suresh General Store",
      hi: "सुरेश जनरल स्टोर",
      kn: "ಸುರೇಶ್ ಜನರಲ್ ಸ್ಟೋರ್",
    },
    category: {
      en: "Stationery & Daily Needs",
      hi: "स्टेशनरी एवं दैनिक जरूरतें",
      kn: "ಸ್ಟೇಷನರಿ ಮತ್ತು ದೈನಂದಿನ ಅಗತ್ಯಗಳು",
    },
    owner: "Suresh Verma",
    phone: "+91 98451 98765",
    address: "58, 1st Cross, Near Ganapathi Temple, Koramangala 4th Block, Bengaluru 560034",
    upiId: "suresh.verma@paytm",
    gstin: "29AAEFV8765P1Z8",
    dailySales: "₹2,100.00",
    dailyTxns: 9,
    nextVisit: {
      en: "Tomorrow 11:30 AM",
      hi: "कल 11:30 AM",
      kn: "ನಾಳೆ 11:30 AM",
    },
    status: "low_battery",
    soundbox: {
      model: "Paytm Soundbox 4.0 4G",
      imei: "864902041992011",
      battery: 14,
      batteryStatus: "Low Battery (Needs Cable Check)",
      signal: "Good 4G (-82 dBm)",
      sim: "Jio IoT 4G",
      lang: "Hindi",
    },
    bankAccount: {
      bank: "HDFC Bank (Koramangala 4th Block)",
      accountNo: "•••• •••• 8821",
      ifsc: "HDFC0000133",
      cycle: "T+0 Nightly Auto-Settlement (11:59 PM)",
    },
  },
  {
    id: "DEMO_MERCHANT_ANNAPURNA",
    name: {
      en: "Annapurna Provisions",
      hi: "अन्नपूर्णा प्रोविजन्स",
      kn: "ಅನ್ನಪೂರ್ಣ ಪ್ರಾವಿಷನ್ಸ್",
    },
    category: {
      en: "Organic Grains & Spices",
      hi: "जैविक अनाज एवं मसाले",
      kn: "ಸಾವಯವ ಧಾನ್ಯಗಳು ಮತ್ತು ಮಸಾಲೆಗಳು",
    },
    owner: "Annapurna Devi",
    phone: "+91 98452 33445",
    address: "89, 5th Cross, Koramangala 4th Block, Bengaluru 560034",
    upiId: "annapurna.devi@paytm",
    gstin: "29AAGCA4433D1Z2",
    dailySales: "₹1,850.00",
    dailyTxns: 7,
    nextVisit: {
      en: "Day after tomorrow 2:00 PM",
      hi: "परसों 2:00 PM",
      kn: "ನಾಡಿದ್ದು 2:00 PM",
    },
    status: "active",
    soundbox: {
      model: "Paytm Soundbox 4.0 4G",
      imei: "864902041773099",
      battery: 95,
      batteryStatus: "Optimal",
      signal: "Excellent 4G (-65 dBm)",
      sim: "Airtel IoT 4G",
      lang: "Kannada + English",
    },
    bankAccount: {
      bank: "Canara Bank (Koramangala Branch)",
      accountNo: "•••• •••• 1042",
      ifsc: "CNRB0000212",
      cycle: "T+0 Nightly Auto-Settlement (11:59 PM)",
    },
  },
];

export function FseView({ lang }: FseViewProps) {
  const t = getTranslation(lang);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [memories, setMemories] = useState<any[]>([]);
  const [handoffSuccess, setHandoffSuccess] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");

  // Officer & Handoff State
  const [currentOfficer, setCurrentOfficer] = useState<"ARUN" | "PRIYA">("ARUN");
  const [isHandoffModalOpen, setIsHandoffModalOpen] = useState(false);
  const [isExecutingHandoff, setIsExecutingHandoff] = useState(false);
  const [handoffProgress, setHandoffProgress] = useState(0);
  const [handoffStepText, setHandoffStepText] = useState("");
  const [handoffRemarks, setHandoffRemarks] = useState(
    "Ramesh ji is busy 6-9 PM; visit at 4:00 PM sharp. Suresh General Store needs Type-C charger cable. 1 dispute on Ramesh Kirana under review."
  );

  // Modals state
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantDossier | null>(null);
  const [evidenceDispute, setEvidenceDispute] = useState<any | null>(null);
  const [reversalDispute, setReversalDispute] = useState<any | null>(null);

  // Evidence modal inputs
  const [evidenceType, setEvidenceType] = useState<string>("CCTV_FOOTAGE");
  const [evidenceNotes, setEvidenceNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      if (file.type.startsWith("image/") || file.type.startsWith("audio/")) {
        const url = URL.createObjectURL(file);
        setFilePreview(url);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleRemoveFile = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setUploadedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const loadFseData = async () => {
    try {
      const d = await munshiApi.getDisputes("DEMO_MERCHANT_RAMESH", "DEMO");
      setDisputes(d);
      const m = await munshiApi.getMemories("DEMO_MERCHANT_RAMESH", "DEMO");
      setMemories(m);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadFseData();
  }, []);

  const activeDisputesCount = disputes.filter(
    (d) => d.status === "UNDER_REVIEW" || d.status === "OPEN"
  ).length;

  const handleOpenEvidenceModal = (d: any) => {
    setEvidenceDispute(d);
    setEvidenceType("CCTV_FOOTAGE");
    setUploadedFile(null);
    setFilePreview(null);
    setEvidenceNotes(
      lang === "kn-IN"
        ? `ಅಂಗಡಿಯ ಸಿಸಿಟಿವಿ ದೃಶ್ಯಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗಿದೆ (${d.txn_id}). ಗ್ರಾಹಕರು ₹${d.amount} ಮೌಲ್ಯದ ದಿನಸಿ ತೆಗೆದುಕೊಂಡು ಹೋಗಿದ್ದಾರೆ.`
        : lang === "hi-IN"
          ? `दुकान के सीसीटीवी फुटेज की पुष्टि की गई (${d.txn_id})। ग्राहक ने ₹${d.amount} का राशन प्राप्त किया।`
          : `Verified store CCTV camera footage for Txn ${d.txn_id}. Customer received goods worth ₹${d.amount} and exited.`
    );
  };

  const handleSubmitEvidence = async () => {
    if (!evidenceDispute) return;
    setIsSubmitting(true);
    try {
      const typeLabel =
        evidenceType === "CCTV_FOOTAGE"
          ? "📹 CCTV Footage"
          : evidenceType === "SOUNDBOX_CHIRP"
            ? "🔊 Soundbox Audio Log"
            : evidenceType === "BILLING_SLIP"
              ? "🧾 Counter Cash Memo"
              : "📱 UPI App Screenshot";

      const fileAttachment = uploadedFile
        ? ` • [Attached Proof: ${uploadedFile.name} (${(uploadedFile.size / 1024).toFixed(1)} KB)]`
        : " • [Counter Verified Attachment]";

      const fullResolution = `[${typeLabel}] ${evidenceNotes}${fileAttachment} (Verified by FSE Arun Sharma • ID: DEMO_FSE_ARUN)`;

      await munshiApi.updateDispute(
        evidenceDispute.dispute_id,
        "SUBMIT_EVIDENCE",
        fullResolution,
        "DEMO"
      );

      setActionMsg(
        lang === "kn-IN"
          ? `ಸಾಕ್ಷ್ಯವನ್ನು NPCI UDIR ಗೆ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ (${evidenceDispute.dispute_id}).`
          : lang === "hi-IN"
            ? `एनपीसीआई यूडीआईआर को साक्ष्य सफलतापूर्वक प्रस्तुत किया गया (${evidenceDispute.dispute_id})।`
            : `Evidence successfully submitted to NPCI UDIR for ${evidenceDispute.dispute_id}.`
      );

      speak(
        lang === "kn-IN"
          ? "ಸಾಕ್ಷ್ಯವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ."
          : lang === "hi-IN"
            ? "साक्ष्य सफलतापूर्वक जमा कर दिया गया है।"
            : "Dispute evidence successfully submitted to NPCI gateway.",
        lang
      );

      setEvidenceDispute(null);
      await loadFseData();
      setTimeout(() => setActionMsg(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenReversalModal = (d: any) => {
    setReversalDispute(d);
  };

  const handleConfirmReversal = async () => {
    if (!reversalDispute) return;
    setIsSubmitting(true);
    try {
      const refundNotes =
        lang === "kn-IN"
          ? `FSE ಅರುಣ್ ಶರ್ಮಾ ಅವರಿಂದ ₹${reversalDispute.amount} ತ್ವರಿತ ಮರುಪಾವತಿ ಅನುಮೋದಿಸಲಾಗಿದೆ (NPCI UDIR ಆಟೋ-ರಿವರ್ಸಲ್). ಗ್ರಾಹಕ ಖಾತೆಗೆ ಮರುಜಮಾ ಮಾಡಲಾಗಿದೆ.`
          : lang === "hi-IN"
            ? `FSE अरुण शर्मा द्वारा ₹${reversalDispute.amount} का तत्काल रिवर्सल स्वीकृत (NPCI UDIR ऑटो-रिफंड)। ग्राहक खाते में राशि प्रेषित।`
            : `Instant refund of ₹${reversalDispute.amount} approved by FSE Arun Sharma under NPCI UDIR protocol. Credited to customer bank account.`;

      await munshiApi.updateDispute(
        reversalDispute.dispute_id,
        "ACCEPT_CHARGEBACK",
        refundNotes,
        "DEMO"
      );

      setActionMsg(
        lang === "kn-IN"
          ? `ತ್ವರಿತ ಮರುಪಾವತಿ ಯಶಸ್ವಿ: ₹${reversalDispute.amount} ಗ್ರಾಹಕರ ಖಾತೆಗೆ ಕಳುಹಿಸಲಾಗಿದೆ.`
          : lang === "hi-IN"
            ? `तत्काल रिवर्सल सफल: ₹${reversalDispute.amount} ग्राहक खाते में प्रेषित की गई।`
            : `Instant reversal executed: ₹${reversalDispute.amount} credited back to customer.`
      );

      speak(
        lang === "kn-IN"
          ? "ತ್ವರಿತ ಮರುಪಾವತಿಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗಿದೆ."
          : lang === "hi-IN"
            ? "तत्काल रिवर्सल सफलतापूर्वक जारी कर दिया गया है।"
            : "Instant reversal processed successfully.",
        lang
      );

      setReversalDispute(null);
      await loadFseData();
      setTimeout(() => setActionMsg(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenHandoffModal = () => {
    setIsHandoffModalOpen(true);
    setHandoffProgress(0);
    setHandoffStepText("");
    setIsExecutingHandoff(false);
  };

  const handleExecuteHandoff = async () => {
    setIsExecutingHandoff(true);
    setHandoffProgress(25);
    setHandoffStepText("Packaging 3 merchant dossiers & contextual memory streams...");
    await new Promise((r) => setTimeout(r, 600));

    setHandoffProgress(60);
    setHandoffStepText("Transferring active dispute arbitration & escrow holds...");
    await new Promise((r) => setTimeout(r, 600));

    setHandoffProgress(85);
    setHandoffStepText("Re-assigning territory cryptographic token in PostgreSQL...");
    try {
      const fromId = currentOfficer === "ARUN" ? "DEMO_FSE_ARUN" : "DEMO_FSE_PRIYA";
      const toId = currentOfficer === "ARUN" ? "DEMO_FSE_PRIYA" : "DEMO_FSE_ARUN";

      await munshiApi.initiateHandoff(
        fromId,
        toId,
        handoffRemarks,
        "DEMO_MERCHANT_RAMESH",
        "DEMO"
      );

      setHandoffProgress(100);
      setHandoffStepText(
        currentOfficer === "ARUN"
          ? "Accepted by FSE Priya Nair (ID: DEMO_FSE_PRIYA)!"
          : "Accepted by FSE Arun Sharma (ID: DEMO_FSE_ARUN)!"
      );
      await new Promise((r) => setTimeout(r, 500));

      const nextOfficer = currentOfficer === "ARUN" ? "PRIYA" : "ARUN";
      setCurrentOfficer(nextOfficer);
      setIsHandoffModalOpen(false);
      setIsExecutingHandoff(false);

      const successNotice =
        nextOfficer === "PRIYA"
          ? (lang === "kn-IN"
              ? "ಕಾರ್ಯಭಾರ ಯಶಸ್ವಿಯಾಗಿ ವರ್ಗಾವಣೆಯಾಗಿದೆ: FSE ಪ್ರಿಯಾ ನಾಯರ್ ಅವರು ಕೊರಮಂಗಲ ಬೀಟ್ #4 ರ ಜವಾಬ್ದಾರಿ ವಹಿಸಿಕೊಂಡಿದ್ದಾರೆ."
              : lang === "hi-IN"
                ? "कार्यभार सफलतापूर्वक हस्तांतरित: FSE प्रिया नायर ने कोरमंगला बीट #4 का कार्यभार संभाल लिया है।"
                : "Territory handoff successful: Full portfolio transferred to FSE Priya Nair.")
          : (lang === "kn-IN"
              ? "ಕಾರ್ಯಭಾರವನ್ನು FSE ಅರುಣ್ ಶರ್ಮಾ ಅವರಿಗೆ ಹಿಂತಿರುಗಿಸಲಾಗಿದೆ."
              : lang === "hi-IN"
                ? "कार्यभार FSE अरुण शर्मा को पुनः हस्तांतरित किया गया।"
                : "Territory handoff returned to FSE Arun Sharma.");

      setHandoffSuccess(successNotice);

      speak(
        nextOfficer === "PRIYA"
          ? (lang === "kn-IN"
              ? "ಸುರಕ್ಷಿತ ವರ್ಗಾವಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ. FSE ಪ್ರಿಯಾ ನಾಯರ್ ಈಗ ಸಕ್ರಿಯರಾಗಿದ್ದಾರೆ."
              : lang === "hi-IN"
                ? "सुरक्षित हैंडऑफ संपन्न हुआ। FSE प्रिया नायर अब सक्रिय अधिकारी हैं।"
                : "Safe territory handoff completed. FSE Priya Nair is now in charge.")
          : (lang === "kn-IN"
              ? "ಕಾರ್ಯಭಾರ ವರ್ಗಾವಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ."
              : lang === "hi-IN"
                ? "हैंडऑफ संपन्न हुआ।"
                : "Handoff completed."),
        lang
      );

      await loadFseData();
      setTimeout(() => setHandoffSuccess(null), 6000);
    } catch (err: any) {
      console.error("Handoff execution error:", err);
      setIsExecutingHandoff(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      await fetch("/api/v1/memory/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantId: "DEMO_MERCHANT_RAMESH",
          topic: "FSE_FIELD_VISIT",
          summary: newNote,
          sentiment: "POSITIVE",
          mode: "DEMO",
        }),
      });
      setNewNote("");
      loadFseData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* 1. FSE HEADER */}
      <section className="rounded-lg bg-white border border-[#e6e8ec] px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <UserCheck className="size-3" />
              {currentOfficer === "ARUN"
                ? (lang === "hi-IN"
                    ? "FSE अरुण शर्मा (ID: DEMO_FSE_ARUN • 9123456780)"
                    : lang === "kn-IN"
                      ? "FSE ಅರುಣ್ ಶರ್ಮಾ (ID: DEMO_FSE_ARUN • 9123456780)"
                      : "FSE Arun Sharma (ID: DEMO_FSE_ARUN • 9123456780)")
                : (lang === "hi-IN"
                    ? "FSE प्रिया नायर (ID: DEMO_FSE_PRIYA • 9123456789)"
                    : lang === "kn-IN"
                      ? "FSE ಪ್ರಿಯಾ ನಾಯರ್ (ID: DEMO_FSE_PRIYA • 9123456789)"
                      : "FSE Priya Nair (ID: DEMO_FSE_PRIYA • 9123456789)")}
            </span>
            <span className="text-xs text-[#536e92] font-mono bg-[#f4f6f9] px-2 py-0.5 rounded flex items-center gap-1">
              <MapPin className="size-3 text-[#00BAF2]" />
              {lang === "hi-IN"
                ? "कोरमंगला 4th ब्लॉक, बैंगलोर"
                : lang === "kn-IN"
                  ? "ಕೋರಮಂಗಲ 4 ನೇ ಬ್ಲಾಕ್, ಬೆಂಗಳೂರು"
                  : "Koramangala 4th Block, Bangalore"}
            </span>
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-[#1a1a1a]">
            {t.fseConsoleTitle}
          </h2>
          <p className="text-xs text-[#6b7280] mt-1 max-w-xl">
            {t.fseConsoleSub}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenHandoffModal}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer shrink-0 ${
            currentOfficer === "ARUN"
              ? "bg-amber-500 hover:bg-amber-600 text-[#001738]"
              : "bg-[#00BAF2] hover:bg-[#00a8dc] text-[#002970]"
          }`}
        >
          <UserMinus className="size-4" />
          {currentOfficer === "ARUN"
            ? (lang === "kn-IN" ? "ಪ್ರಿಯಾಗೆ ವರ್ಗಾಯಿಸಿ (Handover to Priya)" : lang === "hi-IN" ? "प्रिया को हैंडओवर करें" : "Handover to Priya")
            : (lang === "kn-IN" ? "ಅರುಣ್‌ಗೆ ಹಿಂತಿರುಗಿಸಿ (Return to Arun)" : lang === "hi-IN" ? "अरुण को वापस सौंपें" : "Return to Arun")}
        </button>
      </section>

      {/* 2. DAILY OPERATIONS KPI SUMMARY */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.06)]">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
            {t.statAssignedMerchants}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#002970] mt-1 block">3</span>
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
            {t.allActivePill}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.06)]">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
            {t.statActiveDisputes}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-amber-600 mt-1 block">
            {activeDisputesCount}
          </span>
          <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
            {t.underReviewPill}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.06)]">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
            {t.statNextVisit}
          </span>
          <span className="text-xl sm:text-2xl font-bold text-[#002970] mt-1 block">4:00 PM</span>
          <span className="text-[10px] text-gray-500 block mt-0.5">
            {lang === "hi-IN" ? "रमेश किराना स्टोर" : lang === "kn-IN" ? "ರಮೇಶ್ ಕಿರಾಣಿ ಸ್ಟೋರ್" : "Ramesh Kirana Store"}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.06)]">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
            {t.statSoundboxUptime}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 block">98.5%</span>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
            {t.connected100Pill}
          </span>
        </div>
      </section>

      {/* Success Messages */}
      {handoffSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{handoffSuccess}</span>
        </div>
      )}

      {actionMsg && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-300 text-[#002970] text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="size-4 text-blue-600 shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* 3. TWO-COLUMN FSE BODY */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Assigned Merchants Beat List (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,41,112,0.05)] border border-gray-100">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Store className="size-4 text-[#00BAF2]" />
                <h3 className="text-sm font-black text-[#002970] uppercase tracking-wide">
                  {t.assignedMerchantsTitle}
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-bold bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">
                3 {t.activeCountBadge}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3.5 mt-4">
              {MERCHANTS_DATA.map((merchant, idx) => {
                const isSelected = selectedMerchant?.id === merchant.id;
                const isPriority = merchant.status === "active_priority";
                const isLowBattery = merchant.status === "low_battery";

                return (
                  <div
                    key={merchant.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isPriority
                        ? "border-2 border-[#00BAF2] bg-[#F0F9FF] shadow-xs"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-[#002970]">
                            {lang === "hi-IN"
                              ? merchant.name.hi
                              : lang === "kn-IN"
                                ? merchant.name.kn
                                : merchant.name.en}
                          </span>
                          {isPriority && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              {lang === "hi-IN" ? "सक्रिय • प्राथमिकता" : lang === "kn-IN" ? "ಸಕ್ರಿಯ • ಆದ್ಯತೆ" : "Active • Priority"}
                            </span>
                          )}
                          {isLowBattery && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                              {t.lowBattery}
                            </span>
                          )}
                          {!isPriority && !isLowBattery && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              {lang === "hi-IN" ? "सक्रिय" : lang === "kn-IN" ? "ಸಕ್ರಿಯ" : "Active"}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-600 mt-1">
                          {lang === "hi-IN"
                            ? `मालिक: ${merchant.owner} • दैनिक बिक्री: ${merchant.dailySales}`
                            : lang === "kn-IN"
                              ? `ಮಾಲೀಕ: ${merchant.owner} • ದೈನಂದಿನ ಮಾರಾಟ: ${merchant.dailySales}`
                              : `Owner: ${merchant.owner} • Daily Sales: ${merchant.dailySales}`}
                        </p>

                        <p className={`text-xs ${isLowBattery ? "text-amber-600 font-medium" : "text-gray-500"}`}>
                          {merchant.soundbox.model}: {merchant.soundbox.battery}% {lang === "hi-IN" ? "बैटरी" : lang === "kn-IN" ? "ಬ್ಯಾಟರಿ" : "Battery"} • {merchant.soundbox.batteryStatus}
                        </p>
                      </div>

                      <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100 flex sm:flex-col justify-between items-end gap-1">
                        <span className="text-[11px] font-bold text-[#002970] block">
                          {lang === "hi-IN"
                            ? `अगला दौरा: ${merchant.nextVisit.hi}`
                            : lang === "kn-IN"
                              ? `ಮುಂದಿನ ಭೇಟಿ: ${merchant.nextVisit.kn}`
                              : `Next Visit: ${merchant.nextVisit.en}`}
                        </span>

                        <button
                          type="button"
                          onClick={() => setSelectedMerchant(merchant)}
                          className="text-xs text-[#00BAF2] hover:text-[#008db8] font-black hover:underline cursor-pointer inline-flex items-center gap-1"
                        >
                          {t.viewProfile} &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Merchant Memory & Field Notes Stream */}
          <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,41,112,0.05)] border border-gray-100">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-[#00BAF2]" />
                <h3 className="text-sm font-black text-[#002970] uppercase tracking-wide">
                  {t.memoryStreamTitle}
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-mono">
                {lang === "hi-IN" ? "रमेश किराना स्टोर" : lang === "kn-IN" ? "ರಮೇಶ್ ಕಿರಾಣಿ ಸ್ಟೋರ್" : "Ramesh Kirana Store"}
              </span>
            </div>

            <div className="mt-3.5 space-y-2.5 max-h-56 overflow-y-auto">
              {memories.map((m) => (
                <div key={m.memory_id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#002970]">{m.topic}</span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(m.created_at || Date.now()).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1 leading-relaxed">{m.summary}</p>
                </div>
              ))}
            </div>

            {/* Add Field Note Input */}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                placeholder={t.notePlaceholder}
                className="flex-1 rounded-2xl border border-gray-200 px-4 py-2.5 text-xs focus:border-[#00BAF2] focus:bg-white focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddNote}
                className="px-4 py-2.5 rounded-2xl bg-[#002970] text-white font-bold text-xs hover:bg-[#001738] transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Send className="size-3.5" />
                {t.saveNoteBtn}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Active Disputes & Safe Handoff (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Disputes & Escrow Holds */}
          <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,41,112,0.05)] border border-gray-100">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-amber-500" />
                <h3 className="text-sm font-black text-[#002970] uppercase tracking-wide">
                  {t.activeDisputesTitle}
                </h3>
              </div>
              <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-bold border border-amber-200">
                {activeDisputesCount} {t.reviewRequiredBadge}
              </span>
            </div>

            <div className="mt-4 space-y-3.5">
              {disputes.map((d) => {
                const isRefunded = d.status === "REFUNDED";
                const isEvidenceSubmitted = d.status === "EVIDENCE_SUBMITTED";

                return (
                  <div
                    key={d.dispute_id}
                    className={`p-4 rounded-2xl border text-xs space-y-3 transition-all ${
                      isRefunded
                        ? "border-emerald-200 bg-emerald-50/40"
                        : isEvidenceSubmitted
                          ? "border-blue-200 bg-blue-50/40"
                          : "border-amber-200 bg-amber-50/60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#002970]">{d.dispute_id}</span>
                        {isRefunded && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="size-2.5" />
                            {lang === "kn-IN" ? "ಮರುಪಾವತಿಸಲಾಗಿದೆ" : lang === "hi-IN" ? "रिफंड संपन्न" : "REFUNDED"}
                          </span>
                        )}
                        {isEvidenceSubmitted && (
                          <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <FileCheck className="size-2.5" />
                            {lang === "kn-IN" ? "ಸಾಕ್ಷ್ಯ ಸಲ್ಲಿಸಲಾಗಿದೆ" : lang === "hi-IN" ? "साक्ष्य प्रस्तुत" : "EVIDENCE SUBMITTED"}
                          </span>
                        )}
                        {!isRefunded && !isEvidenceSubmitted && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Clock className="size-2.5" />
                            {lang === "kn-IN" ? "ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ" : lang === "hi-IN" ? "समीक्षाधीन" : "UNDER REVIEW"}
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        {isRefunded ? (
                          <div className="flex items-center gap-1">
                            <span className="line-through text-gray-400 font-bold">
                              ₹{Number(d.amount).toFixed(2)}
                            </span>
                            <span className="text-xs text-emerald-600 font-black">
                              ₹0.00
                            </span>
                          </div>
                        ) : (
                          <span className="font-black text-sm text-red-600">
                            ₹{Number(d.amount).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500 font-mono text-[11px] block">
                        Txn: {d.txn_id}
                      </span>
                      <p className="text-gray-800 font-semibold mt-1">{d.reason}</p>
                      <span className="text-[11px] text-gray-500 block mt-1">
                        {lang === "hi-IN" ? "स्थिति:" : lang === "kn-IN" ? "ಸ್ಥಿತಿ:" : "Status:"}{" "}
                        <strong className="text-gray-700">{d.status}</strong> •{" "}
                        {d.resolution_notes ||
                          (lang === "hi-IN"
                            ? "ग्राहक बैंक से पुष्टि प्रतीक्षित"
                            : lang === "kn-IN"
                              ? "ಗ್ರಾಹಕರ ಬ್ಯಾಂಕ್‌ನಿಂದ ದೃಢೀಕರಣ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ"
                              : "Awaiting customer bank reversal confirmation")}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-1">
                      {isRefunded ? (
                        <div className="w-full py-2 px-3 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-center text-xs flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="size-3.5 text-emerald-700" />
                          {lang === "kn-IN"
                            ? "ವಿವಾದ ಇತ್ಯರ್ಥಗೊಂಡಿದೆ (NPCI UDIR ಮರುಪಾವತಿ)"
                            : lang === "hi-IN"
                              ? "विवाद निपटाया गया (NPCI UDIR ऑटो-रिफंड)"
                              : "Dispute Resolved (NPCI UDIR Auto-Refunded)"}
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenEvidenceModal(d)}
                            className="flex-1 py-2 px-3 rounded-xl bg-white border border-[#00BAF2] text-[#002970] font-bold hover:bg-blue-50 transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <UploadCloud className="size-3.5 text-[#00BAF2]" />
                            {isEvidenceSubmitted ? (lang === "kn-IN" ? "ಸಾಕ್ಷ್ಯ ಪರಿಷ್ಕರಿಸಿ" : lang === "hi-IN" ? "साक्ष्य अपडेट करें" : "Update Evidence") : t.uploadEvidenceBtn}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenReversalModal(d)}
                            className="flex-1 py-2 px-3 rounded-xl bg-[#00BAF2] text-[#002970] font-black hover:bg-[#00a8dc] transition-colors text-center cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                          >
                            <RotateCcw className="size-3.5 text-[#002970]" />
                            {t.instantReversalBtn}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Safe FSE Territory Handoff Card */}
          <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,41,112,0.05)] border border-gray-100">
            <div className="flex items-center gap-2 pb-3.5 border-b border-gray-100">
              <UserMinus className="size-4 text-amber-500" />
              <h3 className="text-sm font-black text-[#002970] uppercase tracking-wide">
                {t.safeHandoffTitle}
              </h3>
            </div>

            <p className="text-xs text-gray-600 mt-3 leading-relaxed">
              {t.safeHandoffDesc}
            </p>

            <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-[#002970]">
              <span className="font-bold block">
                {currentOfficer === "ARUN"
                  ? (lang === "kn-IN"
                      ? "ಸ್ವೀಕರಿಸುವ ಅಧಿಕಾರಿ: FSE ಪ್ರಿಯಾ ನಾಯರ್ (ID: DEMO_FSE_PRIYA • 9123456789)"
                      : lang === "hi-IN"
                        ? "प्राप्तकर्ता अधिकारी: FSE प्रिया नायर (ID: DEMO_FSE_PRIYA • 9123456789)"
                        : "Recipient Officer: FSE Priya Nair (ID: DEMO_FSE_PRIYA • 9123456789)")
                  : (lang === "kn-IN"
                      ? "ಸ್ವೀಕರಿಸುವ ಅಧಿಕಾರಿ: FSE ಅರುಣ್ ಶರ್ಮಾ (ID: DEMO_FSE_ARUN • 9123456780)"
                      : lang === "hi-IN"
                        ? "प्राप्तकर्ता अधिकारी: FSE अरुण शर्मा (ID: DEMO_FSE_ARUN • 9123456780)"
                        : "Recipient Officer: FSE Arun Sharma (ID: DEMO_FSE_ARUN • 9123456780)")}
              </span>
            </div>

            <button
              type="button"
              onClick={handleOpenHandoffModal}
              className="w-full mt-4 py-2.5 px-4 rounded-xl bg-[#002970] hover:bg-[#001738] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <UserCheck className="size-4" />
              {currentOfficer === "ARUN" ? t.confirmHandoffBtn : (lang === "kn-IN" ? "ಅರುಣ್‌ಗೆ ವರ್ಗಾಯಿಸಿ" : lang === "hi-IN" ? "अरुण को हस्तांतरित करें" : "Transfer back to Arun")}
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* MODAL 1: MERCHANT DOSSIER / PROFILE MODAL                       */}
      {/* ============================================================== */}
      {selectedMerchant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#002970] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#00BAF2] uppercase font-bold tracking-wider">
                  {lang === "kn-IN" ? "ವ್ಯಾಪಾರಿ ಸಂಪೂರ್ಣ ಪ್ರೊಫೈಲ್" : lang === "hi-IN" ? "व्यापारी संपूर्ण प्रोफ़ाइल" : "Merchant Complete Dossier"}
                </span>
                <h3 className="text-lg font-bold">
                  {lang === "hi-IN"
                    ? selectedMerchant.name.hi
                    : lang === "kn-IN"
                      ? selectedMerchant.name.kn
                      : selectedMerchant.name.en}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMerchant(null)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 space-y-5 overflow-y-auto text-xs text-gray-700">
              {/* Store & Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <div>
                  <span className="text-gray-400 font-semibold uppercase text-[10px] block">
                    {lang === "kn-IN" ? "ಮಾಲೀಕ / ಸಂಪರ್ಕ" : lang === "hi-IN" ? "मालिक / संपर्क" : "Owner / Contact"}
                  </span>
                  <span className="font-bold text-sm text-[#002970] block mt-0.5">
                    {selectedMerchant.owner}
                  </span>
                  <span className="text-gray-600 flex items-center gap-1 mt-0.5">
                    <Phone className="size-3 text-[#00BAF2]" />
                    {selectedMerchant.phone}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 font-semibold uppercase text-[10px] block">
                    {lang === "kn-IN" ? "ವರ್ಗ / GSTIN" : lang === "hi-IN" ? "श्रेणी / GSTIN" : "Category / GSTIN"}
                  </span>
                  <span className="font-bold text-gray-900 block mt-0.5">
                    {lang === "hi-IN"
                      ? selectedMerchant.category.hi
                      : lang === "kn-IN"
                        ? selectedMerchant.category.kn
                        : selectedMerchant.category.en}
                  </span>
                  <span className="text-gray-500 font-mono text-[11px] block mt-0.5">
                    GSTIN: {selectedMerchant.gstin}
                  </span>
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-gray-200">
                  <span className="text-gray-400 font-semibold uppercase text-[10px] block">
                    {lang === "kn-IN" ? "ಅಂಗಡಿಯ ವಿಳಾಸ" : lang === "hi-IN" ? "दुकान का पता" : "Store Address"}
                  </span>
                  <span className="text-gray-700 flex items-start gap-1 mt-0.5">
                    <MapPin className="size-3.5 text-[#00BAF2] shrink-0 mt-0.5" />
                    {selectedMerchant.address}
                  </span>
                </div>
              </div>

              {/* Soundbox Device Telemetry */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="size-4 text-[#00BAF2]" />
                    <span className="font-extrabold text-[#002970] text-sm">
                      {selectedMerchant.soundbox.model}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    4G IoT Online
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-2.5 rounded-xl bg-white border border-blue-100">
                    <span className="text-[10px] text-gray-500 block">Battery Level</span>
                    <span className="text-sm font-bold text-gray-900 flex items-center gap-1 mt-0.5">
                      <Battery className={`size-3.5 ${selectedMerchant.soundbox.battery < 20 ? "text-amber-500" : "text-emerald-500"}`} />
                      {selectedMerchant.soundbox.battery}%
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-blue-100">
                    <span className="text-[10px] text-gray-500 block">Signal Quality</span>
                    <span className="text-sm font-bold text-gray-900 flex items-center gap-1 mt-0.5">
                      <Wifi className="size-3.5 text-blue-500" />
                      {selectedMerchant.soundbox.signal.split(" ")[0]}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-blue-100 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-gray-500 block">Voice Preference</span>
                    <span className="text-xs font-bold text-gray-900 block truncate mt-0.5">
                      {selectedMerchant.soundbox.lang}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-gray-500 flex flex-wrap justify-between pt-1">
                  <span>IMEI: <strong className="font-mono text-gray-700">{selectedMerchant.soundbox.imei}</strong></span>
                  <span>SIM: <strong className="text-gray-700">{selectedMerchant.soundbox.sim}</strong></span>
                </div>
              </div>

              {/* Settlement Bank Details */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-[#002970]" />
                  <span className="font-extrabold text-[#002970]">
                    {lang === "kn-IN" ? "ಸೆಟಲ್‌ಮೆಂಟ್ ಬ್ಯಾಂಕ್ ಖಾತೆ" : lang === "hi-IN" ? "सेटलमेंट बैंक खाता" : "Settlement Bank Account"}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-gray-500">Bank:</span>{" "}
                    <strong className="text-gray-800">{selectedMerchant.bankAccount.bank}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">A/c No:</span>{" "}
                    <strong className="text-gray-800 font-mono">{selectedMerchant.bankAccount.accountNo}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">IFSC:</span>{" "}
                    <strong className="text-gray-800 font-mono">{selectedMerchant.bankAccount.ifsc}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">Settlement:</span>{" "}
                    <strong className="text-gray-800">{selectedMerchant.bankAccount.cycle}</strong>
                  </div>
                </div>
              </div>

              {/* Sales & Payment Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                    {lang === "kn-IN" ? "ಇಂದಿನ ಒಟ್ಟು ವ್ಯಾಪಾರ" : lang === "hi-IN" ? "आज की कुल बिक्री" : "Today's Gross Sales"}
                  </span>
                  <span className="text-lg font-black text-emerald-900 mt-0.5 block">
                    {selectedMerchant.dailySales}
                  </span>
                  <span className="text-[10px] text-emerald-700">
                    {selectedMerchant.dailyTxns} {lang === "kn-IN" ? "ಯಶಸ್ವಿ ಪಾವತಿಗಳು" : lang === "hi-IN" ? "सफल भुगतान" : "Successful Txns"}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-200">
                  <span className="text-[10px] uppercase font-bold text-purple-800 block">
                    {lang === "kn-IN" ? "ಸಕ್ರಿಯ UPI ID" : lang === "hi-IN" ? "सक्रिय यूपीआई आईडी" : "Active UPI VPA"}
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-900 mt-1 block truncate">
                    {selectedMerchant.upiId}
                  </span>
                  <span className="text-[10px] text-purple-700">
                    All-in-One Dynamic QR Active
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedMerchant(null)}
                className="px-5 py-2 rounded-xl bg-[#002970] text-white font-bold text-xs hover:bg-[#001738] transition-colors cursor-pointer"
              >
                {lang === "kn-IN" ? "ಮುಚ್ಚಿ" : lang === "hi-IN" ? "बंद करें" : "Close Dossier"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: UPLOAD EVIDENCE TO NPCI UDIR                           */}
      {/* ============================================================== */}
      {evidenceDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#002970] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UploadCloud className="size-5 text-[#00BAF2]" />
                <div>
                  <h3 className="text-base font-bold">
                    {lang === "kn-IN" ? "NPCI UDIR ಗೆ ಸಾಕ್ಷ್ಯ ಸಲ್ಲಿಸಿ" : lang === "hi-IN" ? "NPCI UDIR को साक्ष्य प्रस्तुत करें" : "Submit Evidence to NPCI UDIR"}
                  </h3>
                  <span className="text-[11px] text-[#00BAF2]">
                    Dispute ID: {evidenceDispute.dispute_id} • ₹{Number(evidenceDispute.amount).toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEvidenceDispute(null)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                <span className="font-bold block">
                  Txn ID: {evidenceDispute.txn_id}
                </span>
                <p className="mt-0.5 text-[11px]">
                  Reason: {evidenceDispute.reason}
                </p>
              </div>

              {/* Evidence Type Selection */}
              <div>
                <label className="font-bold text-gray-800 block mb-2">
                  {lang === "kn-IN" ? "ಸಾಕ್ಷ್ಯದ ಪ್ರಕಾರವನ್ನು ಆರಿಸಿ:" : lang === "hi-IN" ? "साक्ष्य का प्रकार चुनें:" : "Select Evidence Artifact Type:"}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "CCTV_FOOTAGE", label: "📹 CCTV Camera", desc: "Counter exit recording" },
                    { id: "SOUNDBOX_CHIRP", label: "🔊 Soundbox Audio", desc: "Verified chirp timestamp" },
                    { id: "BILLING_SLIP", label: "🧾 Cash Register", desc: "Physical printed invoice" },
                    { id: "UPI_SCREENSHOT", label: "📱 Passbook Screenshot", desc: "Merchant app success" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setEvidenceType(item.id)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        evidenceType === item.id
                          ? "border-[#00BAF2] bg-[#F0F9FF] ring-2 ring-[#00BAF2]/30"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <span className="font-bold text-gray-900 block">{item.label}</span>
                      <span className="text-[10px] text-gray-500 block">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Statement / Notes */}
              <div>
                <label className="font-bold text-gray-800 block mb-1">
                  {lang === "kn-IN" ? "FSE ಪರಿಶೀಲನಾ ಹೇಳಿಕೆ / ಟಿಪ್ಪಣಿ:" : lang === "hi-IN" ? "FSE सत्यापन वक्तव्य / विवरण:" : "FSE Attestation & Inspection Notes:"}
                </label>
                <textarea
                  rows={3}
                  value={evidenceNotes}
                  onChange={(e) => setEvidenceNotes(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-3 text-xs focus:border-[#00BAF2] focus:outline-hidden"
                  placeholder="Enter detailed inspection statement..."
                />
              </div>

              {/* Real Interactive File Upload Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-800 block text-xs">
                    {lang === "kn-IN"
                      ? "ಪುರಾವೆ ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ (CCTV / ಆಡಿಯೋ / ರಶೀದಿ):"
                      : lang === "hi-IN"
                        ? "सबूत फ़ाइल अपलोड करें (CCTV / ऑडियो / रसीद):"
                        : "Upload Proof Artifact (CCTV / Soundbox Audio / Receipt):"}
                  </label>
                  {uploadedFile && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Check className="size-2.5" /> File Attached
                    </span>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept={
                    evidenceType === "SOUNDBOX_CHIRP"
                      ? "audio/*,.wav,.mp3"
                      : evidenceType === "CCTV_FOOTAGE" || evidenceType === "UPI_SCREENSHOT"
                        ? "image/*,.jpg,.jpeg,.png,.webp,.pdf"
                        : "*/*"
                  }
                  className="hidden"
                />

                {!uploadedFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-4 rounded-2xl border-2 border-dashed border-[#00BAF2]/60 hover:border-[#00BAF2] bg-[#F0F9FF]/50 hover:bg-[#F0F9FF] text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 group"
                  >
                    <div className="size-9 rounded-full bg-white text-[#00BAF2] group-hover:scale-110 shadow-xs flex items-center justify-center transition-transform">
                      <UploadCloud className="size-4.5" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#002970] block">
                        {lang === "kn-IN"
                          ? "ಸಾಕ್ಷ್ಯ ಫೈಲ್ ಆಯ್ಕೆ ಮಾಡಲು ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ"
                          : lang === "hi-IN"
                            ? "सबूत फ़ाइल चुनने के लिए यहां क्लिक करें"
                            : "Click to browse & select evidence file from device"}
                      </span>
                      <span className="text-[10px] text-gray-500 block mt-0.5">
                        {evidenceType === "SOUNDBOX_CHIRP"
                          ? "Supports WAV, MP3 Soundbox audio recordings (Max 15MB)"
                          : "Supports JPG, PNG CCTV frames, counter slips, PDF (Max 15MB)"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-gray-50 border border-emerald-300 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        {uploadedFile.type.startsWith("image/") ? (
                          <div className="size-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                            <Camera className="size-4" />
                          </div>
                        ) : uploadedFile.type.startsWith("audio/") ? (
                          <div className="size-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                            <Volume2 className="size-4" />
                          </div>
                        ) : (
                          <div className="size-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <FileCheck className="size-4" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="font-bold text-gray-900 block truncate">
                            {uploadedFile.name}
                          </span>
                          <span className="text-[10px] text-gray-500 block font-mono">
                            {(uploadedFile.size / 1024).toFixed(1)} KB • {uploadedFile.type || "Document"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 hover:border-[#00BAF2] text-[#002970] text-[11px] font-bold cursor-pointer"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="p-1 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remove file"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    </div>

                    {/* Image Preview thumbnail if image */}
                    {filePreview && uploadedFile.type.startsWith("image/") && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 max-h-32 bg-black/5 flex items-center justify-center">
                        <img
                          src={filePreview}
                          alt="Evidence preview"
                          className="max-h-32 object-contain"
                        />
                      </div>
                    )}

                    {/* Audio Player if audio */}
                    {filePreview && uploadedFile.type.startsWith("audio/") && (
                      <div className="mt-2 p-2 bg-white rounded-xl border border-gray-200">
                        <audio controls src={filePreview} className="w-full h-8" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <p className="text-[10px] text-gray-500 italic">
                * Submitted directly to NPCI UDIR Dispute Arbitrage under RBI Ombudsman Rules 2024.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setEvidenceDispute(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 cursor-pointer"
              >
                {lang === "kn-IN" ? "ರದ್ದುಮಾಡಿ" : lang === "hi-IN" ? "रद्द करें" : "Cancel"}
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitEvidence}
                className="px-5 py-2 rounded-xl bg-[#00BAF2] text-[#002970] font-black text-xs hover:bg-[#00a8dc] transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <RefreshCw className="size-3.5 animate-spin" />
                ) : (
                  <UploadCloud className="size-3.5" />
                )}
                {lang === "kn-IN" ? "NPCI ಗೆ ಸಲ್ಲಿಸಿ" : lang === "hi-IN" ? "NPCI को प्रस्तुत करें" : "Submit to NPCI UDIR"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: INSTANT REVERSAL CONFIRMATION (NPCI UDIR)              */}
      {/* ============================================================== */}
      {reversalDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw className="size-5" />
                <div>
                  <h3 className="text-base font-bold">
                    {lang === "kn-IN" ? "ತ್ವರಿತ ಮರುಪಾವತಿ ದೃಢೀಕರಣ" : lang === "hi-IN" ? "तत्काल रिवर्सल पुष्टिकरण" : "Confirm Instant Reversal"}
                  </h3>
                  <span className="text-[11px] text-red-100">
                    NPCI UDIR Auto-Refund Protocol
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReversalDispute(null)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="text-center p-4 rounded-2xl bg-red-50 border border-red-200">
                <span className="text-[11px] text-gray-500 uppercase font-bold block">
                  {lang === "kn-IN" ? "ಮರುಪಾವತಿ ಮಾಡಬೇಕಾದ ಮೊತ್ತ" : lang === "hi-IN" ? "रिफंड की जाने वाली राशि" : "Amount to be Refunded"}
                </span>
                <span className="text-3xl font-black text-red-600 mt-1 block">
                  ₹{Number(reversalDispute.amount).toFixed(2)}
                </span>
                <span className="text-[10px] text-gray-500 block mt-1">
                  Dispute: <strong>{reversalDispute.dispute_id}</strong> • Txn: <strong>{reversalDispute.txn_id}</strong>
                </span>
              </div>

              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Destination:</span>
                  <span className="font-bold text-gray-900">Original Customer VPA (Auto)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">SLA Timeline:</span>
                  <span className="font-bold text-emerald-700">&lt; 15 Minutes (Instant IMPS)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Merchant Charge:</span>
                  <span className="font-bold text-emerald-700">₹0.00 (Zero Penalty Protection)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px]">
                <span className="font-bold block mb-0.5">RBI Compliance Guarantee:</span>
                Under RBI Ombudsman & NPCI circular 2024, failed merchant credits resolved on-spot avoid regulatory debit penalties.
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setReversalDispute(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 cursor-pointer"
              >
                {lang === "kn-IN" ? "ರದ್ದುಮಾಡಿ" : lang === "hi-IN" ? "रद्द करें" : "Cancel"}
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmReversal}
                className="px-5 py-2 rounded-xl bg-red-600 text-white font-black text-xs hover:bg-red-700 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <RefreshCw className="size-3.5 animate-spin" />
                ) : (
                  <RotateCcw className="size-3.5" />
                )}
                {lang === "kn-IN" ? "ತಕ್ಷಣ ಮರುಪಾವತಿಸಿ" : lang === "hi-IN" ? "तत्काल रिफंड जारी करें" : "Execute Instant Refund"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ============================================================== */}
      {/* MODAL 4: TERRITORY HANDOFF DOSSIER & VERIFICATION              */}
      {/* ============================================================== */}
      {isHandoffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#002970] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserMinus className="size-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold">
                    {lang === "kn-IN"
                      ? "ಅಧಿಕೃತ ಕಾರ್ಯಕ್ಷೇತ್ರ ವರ್ಗಾವಣೆ ಪ್ರೋಟೋಕಾಲ್"
                      : lang === "hi-IN"
                        ? "आधिकारिक क्षेत्र कार्यभार हस्तांतरण (Safe Handoff)"
                        : "Official Territory Portfolio Handoff"}
                  </h3>
                  <span className="text-[11px] text-[#00BAF2]">
                    Koramangala 4th Block (Beat #4, Bangalore South)
                  </span>
                </div>
              </div>
              <button
                type="button"
                disabled={isExecutingHandoff}
                onClick={() => setIsHandoffModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 space-y-4 overflow-y-auto text-xs text-gray-700">
              {/* Officer Handshake Cards */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-3">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Departing Officer</span>
                  <strong className="text-sm text-[#002970] block mt-0.5">
                    {currentOfficer === "ARUN" ? "FSE Arun Sharma" : "FSE Priya Nair"}
                  </strong>
                  <span className="font-mono text-gray-500 text-[11px] block">
                    ID: {currentOfficer === "ARUN" ? "DEMO_FSE_ARUN" : "DEMO_FSE_PRIYA"}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    NPCI DSBP v2.4
                  </span>
                  <ArrowRight className="size-5 text-[#00BAF2] my-1" />
                  <span className="text-[9px] text-gray-400 font-mono">Zero Loss</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Incoming Officer</span>
                  <strong className="text-sm text-[#002970] block mt-0.5">
                    {currentOfficer === "ARUN" ? "FSE Priya Nair" : "FSE Arun Sharma"}
                  </strong>
                  <span className="font-mono text-gray-500 text-[11px] block">
                    ID: {currentOfficer === "ARUN" ? "DEMO_FSE_PRIYA" : "DEMO_FSE_ARUN"}
                  </span>
                </div>
              </div>

              {/* What is being handed over */}
              <div className="space-y-2">
                <span className="font-bold text-gray-900 block text-xs uppercase tracking-wide">
                  📦 Complete Territory Portfolio Being Handed Over:
                </span>

                <div className="space-y-2">
                  {/* Item 1: 3 Assigned Merchants */}
                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
                    <div className="flex items-center justify-between font-bold text-[#002970]">
                      <span className="flex items-center gap-1.5">
                        <Store className="size-3.5 text-[#00BAF2]" />
                        3 Assigned Merchants in Beat #4
                      </span>
                      <span className="text-[10px] bg-blue-100 px-2 py-0.5 rounded-full text-blue-800">
                        100% Retained
                      </span>
                    </div>
                    <ul className="text-[11px] text-gray-600 pl-5 list-disc space-y-0.5">
                      <li><strong>Ramesh Kirana Store:</strong> Daily ₹4,500 • Soundbox 88% • Visit today 4:00 PM</li>
                      <li><strong>Suresh General Store:</strong> Daily ₹2,100 • <span className="text-amber-700 font-semibold">Soundbox 14% [Needs charger cable check]</span></li>
                      <li><strong>Annapurna Provisions:</strong> Daily ₹1,850 • Soundbox 95% • Visit day after tomorrow 2:00 PM</li>
                    </ul>
                  </div>

                  {/* Item 2: Active Disputes */}
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
                    <div className="flex items-center justify-between font-bold text-amber-900">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="size-3.5 text-amber-600" />
                        Active Dispute Escrow Holds
                      </span>
                      <span className="text-[10px] bg-amber-100 px-2 py-0.5 rounded-full text-amber-800">
                        {activeDisputesCount} Under Review
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      Dispute arbitration records transferred: Txn DEMO_TXN_001 (₹450.00). UDIR auto-credit liability reassigned.
                    </p>
                  </div>

                  {/* Item 3: Memory Stream & Context */}
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                    <div className="flex items-center justify-between font-bold text-emerald-900">
                      <span className="flex items-center gap-1.5">
                        <FileText className="size-3.5 text-emerald-600" />
                        Full Merchant Memory & Verbal Commitments
                      </span>
                      <span className="text-[10px] bg-emerald-100 px-2 py-0.5 rounded-full text-emerald-800">
                        Complete History
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      Merchant Ramesh footfall hours (6-9 PM), Hindi voice preferences, and customer visit promises.
                    </p>
                  </div>
                </div>
              </div>

              {/* Editable Remarks from Departing Officer */}
              <div>
                <label className="font-bold text-gray-800 block mb-1">
                  Handoff Attestation Notes & Special Instructions:
                </label>
                <textarea
                  rows={2}
                  value={handoffRemarks}
                  onChange={(e) => setHandoffRemarks(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-[#00BAF2] focus:outline-hidden"
                  placeholder="Enter specific instructions for the incoming officer..."
                />
              </div>

              {/* Progress Simulation Bar during Execution */}
              {isExecutingHandoff && (
                <div className="p-3.5 rounded-2xl bg-[#F0F9FF] border border-[#00BAF2]/40 space-y-2 animate-in fade-in">
                  <div className="flex justify-between items-center text-xs font-bold text-[#002970]">
                    <span>Executing Safe Handoff Protocol...</span>
                    <span>{handoffProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-blue-100 overflow-hidden">
                    <div
                      className="h-full bg-[#00BAF2] transition-all duration-300"
                      style={{ width: `${handoffProgress}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-gray-600 block animate-pulse">
                    {handoffStepText}
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
              <button
                type="button"
                disabled={isExecutingHandoff}
                onClick={() => setIsHandoffModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isExecutingHandoff}
                onClick={handleExecuteHandoff}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#001738] font-black text-xs transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                {isExecutingHandoff ? (
                  <RefreshCw className="size-3.5 animate-spin" />
                ) : (
                  <UserCheck className="size-3.5" />
                )}
                {currentOfficer === "ARUN" ? "Confirm & Handover to Priya" : "Confirm & Return to Arun"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
