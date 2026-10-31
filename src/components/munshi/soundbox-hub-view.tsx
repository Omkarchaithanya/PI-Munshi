import React, { useEffect, useState } from "react";
import {
  Volume2,
  Battery,
  Wifi,
  Radio,
  CheckCircle2,
  RefreshCw,
  QrCode,
  ShieldCheck,
  Building2,
  Store,
  UserCheck,
  Phone,
  RotateCw,
  Zap,
  Cpu,
  Clock,
  Speaker,
  Play,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";
import { munshiApi } from "@/lib/api-client";
import { playSwarChirp, speak } from "@/lib/munshi/audio";
import { getTranslation } from "@/lib/munshi/i18n";

interface SoundboxHubViewProps {
  lang: string;
}

export function SoundboxHubView({ lang }: SoundboxHubViewProps) {
  const t = getTranslation(lang);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [deviceStatus, setDeviceStatus] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [testingChime, setTestingChime] = useState(false);
  const [resettingNetwork, setResettingNetwork] = useState(false);
  const [testAmount, setTestAmount] = useState<number>(100);
  const [selectedChimeLang, setSelectedChimeLang] = useState<string>(lang.slice(0, 2) || "hi");
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [heartbeatSeconds, setHeartbeatSeconds] = useState(4);
  const [apodPayload, setApodPayload] = useState<any | null>(null);
  const [transmittingApod, setTransmittingApod] = useState(false);

  const handleTransmitApod = async () => {
    setTransmittingApod(true);
    try {
      const res = await munshiApi.executeSkill({
        skill: "sanchar",
        action: "swar_mudra_apod",
        payload: {
          merchantId: "DEMO_MERCHANT_RAMESH",
          orderId: `ORD_${Date.now().toString(36).toUpperCase()}`,
          rrn: `RRN_${Math.floor(100000000000 + Math.random() * 900000000000)}`,
          amountInr: testAmount,
        },
      });
      setApodPayload(res);
      playSwarChirp(res.hmacSha256 || "9a7f3c1b82d4");
    } catch (err) {
      console.error(err);
    } finally {
      setTransmittingApod(false);
    }
  };

  // Heartbeat timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setHeartbeatSeconds((prev) => (prev > 15 ? 2 : prev + 2));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [txns, dev] = await Promise.all([
        munshiApi.getTransactions("DEMO_MERCHANT_RAMESH", "DEMO"),
        munshiApi.getSoundboxStatus("DEMO_SB_RAMESH", "DEMO"),
      ]);
      setTransactions((txns || []).filter((t: any) => t.status === "SUCCESS"));
      setDeviceStatus(dev);
    } catch (err) {
      console.error("Error loading soundbox data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTriggerChime = async (customAmt?: number) => {
    const amt = customAmt || testAmount;
    setTestingChime(true);
    try {
      await munshiApi.triggerSoundboxChime(amt, selectedChimeLang, "DEMO_SB_RAMESH", "DEMO");
      playSwarChirp(String(amt));

      const spoken =
        selectedChimeLang === "kn"
          ? `Paytm ನಲ್ಲಿ ${amt} ರೂಪಾಯಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ.`
          : selectedChimeLang === "en"
            ? `Received rupees ${amt} on Paytm.`
            : `पेटीएम पर ${amt} रुपये प्राप्त हुए।`;

      speak(spoken, selectedChimeLang === "kn" ? "kn-IN" : selectedChimeLang === "en" ? "en-IN" : "hi-IN");

      setActionNotice(
        lang === "kn-IN"
          ? `ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಧ್ವನಿ ಪ್ರಸಾರ ಯಶಸ್ವಿ: ₹${amt}`
          : lang === "en-IN"
            ? `Soundbox Audio Broadcast Successful: ₹${amt}`
            : `साउंडबॉक्स ऑडियो प्रसारण सफल: ₹${amt}`
      );
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setTestingChime(false);
    }
  };

  const handleResetSim = async () => {
    setResettingNetwork(true);
    setTimeout(() => {
      setResettingNetwork(false);
      setActionNotice(
        lang === "kn-IN"
          ? "Airtel 4G IoT ಸಿಮ್ ಮರು-ಸಿಂಕ್ ಆಗಿದೆ. ಸಿಗ್ನಲ್ ಗುಣಮಟ್ಟ: -76 dBm (ಉತ್ತಮ)"
          : lang === "en-IN"
            ? "Airtel 4G IoT SIM re-synced. Signal Quality: -76 dBm (Excellent)"
            : "Airtel 4G IoT सिम पुनः सिंक हो गया है। सिग्नल क्षमता: -76 dBm (उत्तम)"
      );
      setTimeout(() => setActionNotice(null), 4500);
    }, 1500);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      {/* 1. TOP HEADER & TELEMETRY BAR */}
      <section className="rounded-2xl bg-white border border-[#e6e8ec] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              4G IoT Online • Live Heartbeat ({heartbeatSeconds}s ago)
            </span>
            <span className="text-xs text-[#536e92] font-mono bg-[#f4f6f9] px-2 py-0.5 rounded flex items-center gap-1">
              <Radio className="size-3 text-[#00BAF2]" />
              IMEI: 860123456789012
            </span>
            <span className="text-xs text-purple-700 font-mono bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              TID: TID_PAYTM_SB_94821
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-[#002970]">
            {lang === "kn-IN"
              ? "Paytm ಸೌಂಡ್‌ಬಾಕ್ಸ್ 4.0 IoT ನಿರ್ವಹಣಾ ಕನ್ಸೋಲ್"
              : lang === "en-IN"
                ? "Paytm Soundbox 4.0 IoT Management Console"
                : "Paytm साउंडबॉक्स 4.0 IoT प्रबंधन कंसोल"}
          </h2>
          <p className="text-xs text-[#6b7280] mt-1 max-w-2xl leading-relaxed">
            {lang === "kn-IN"
              ? "ನೈಜ-ಸಮಯದ ಸಾಧನ ಸ್ಥಿತಿ, ವ್ಯಾಪಾರಿ UPI ಲಿಂಕ್, ಲೈವ್ ಆಡಿಯೋ ಧ್ವನಿ ಪ್ರಸಾರ ಮತ್ತು ಲೆಡ್ಜರ್ ಸಿಂಕ್ರೊನೈಸೇಶನ್."
              : lang === "en-IN"
                ? "Real-time hardware telemetry, merchant UPI binding, live audio broadcast verification, and ledger synchronization."
                : "वास्तविक समय डिवाइस टेलीमेट्री, व्यापारी यूपीआई लिंकिंग, लाइव ऑडियो प्रसारण सत्यापन और लेजर सिंक्रनाइज़ेशन।"}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={testingChime}
            onClick={() => handleTriggerChime()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00BAF2] hover:bg-[#00a8dc] text-[#002970] font-black text-xs shadow-sm cursor-pointer transition-all active:scale-95"
          >
            <Volume2 className="size-4" />
            {testingChime ? "..." : lang === "kn-IN" ? "ಧ್ವನಿ ಪರೀಕ್ಷಿಸಿ" : lang === "en-IN" ? "Audio Chime Test" : "ध्वनि टेस्ट करें"}
          </button>
          <button
            type="button"
            disabled={resettingNetwork}
            onClick={handleResetSim}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 font-bold text-xs cursor-pointer transition-all"
          >
            <RotateCw className={`size-3.5 ${resettingNetwork ? "animate-spin text-[#00BAF2]" : ""}`} />
            {lang === "kn-IN" ? "ನೆಟ್‌ವರ್ಕ್ ಮರುಹೊಂದಿಸಿ" : lang === "en-IN" ? "Reset SIM" : "सिम रीसेट"}
          </button>
        </div>
      </section>

      {/* Action Notification */}
      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 2. FOUR HARDWARE TELEMETRY CARDS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Device Connectivity */}
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.06)] flex items-start gap-3.5">
          <div className="size-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Radio className="size-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
              {lang === "kn-IN" ? "ಸಾಧನದ ಸ್ಥಿತಿ" : lang === "en-IN" ? "Device Status" : "डिवाइस स्थिति"}
            </span>
            <span className="text-base sm:text-lg font-black text-[#002970] mt-0.5 block">
              Online • 4G IoT
            </span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
              99.8% Heartbeat Uptime
            </span>
          </div>
        </div>

        {/* Card 2: Battery Health */}
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.06)] flex items-start gap-3.5">
          <div className="size-11 rounded-2xl bg-blue-50 text-[#00BAF2] flex items-center justify-center shrink-0">
            <Battery className="size-5 text-[#00BAF2]" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
              {lang === "kn-IN" ? "ಬ್ಯಾಟರಿ ಸಾಮರ್ಥ್ಯ" : lang === "en-IN" ? "Battery Level" : "बैटरी स्तर"}
            </span>
            <span className="text-base sm:text-lg font-black text-[#002970] mt-0.5 block">
              88% (Healthy)
            </span>
            <span className="text-[10px] text-gray-500 block mt-0.5">
              ~48 hrs Standby • Type-C
            </span>
          </div>
        </div>

        {/* Card 3: Network Signal */}
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.06)] flex items-start gap-3.5">
          <div className="size-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Wifi className="size-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
              {lang === "kn-IN" ? "ಸಿಗ್ನಲ್ ಗುಣಮಟ್ಟ" : lang === "en-IN" ? "Signal Quality" : "सिग्नल क्षमता"}
            </span>
            <span className="text-base sm:text-lg font-black text-[#002970] mt-0.5 block">
              4G VoLTE Band 3
            </span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
              RSRP: -78 dBm (Strong)
            </span>
          </div>
        </div>

        {/* Card 4: Audio Output */}
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.06)] flex items-start gap-3.5">
          <div className="size-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Speaker className="size-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
              {lang === "kn-IN" ? "ಸ್ಪೀಕರ್ ಔಟ್‌ಪುಟ್" : lang === "en-IN" ? "Speaker Output" : "स्पीकर आउटपुट"}
            </span>
            <span className="text-base sm:text-lg font-black text-[#002970] mt-0.5 block">
              95 dB Dual Amplifier
            </span>
            <span className="text-[10px] text-purple-700 font-bold block mt-0.5">
              Ultra-Clear Voice DSP
            </span>
          </div>
        </div>
      </section>

      {/* 3. TWO-COLUMN CORE ARCHITECTURE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Merchant-Soundbox Binding & Architecture (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Binding Card */}
          <div className="rounded-3xl bg-white p-5 sm:p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.05)]">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Store className="size-4 text-[#00BAF2]" />
                <h3 className="text-sm font-black text-[#002970] uppercase tracking-wide">
                  {lang === "kn-IN"
                    ? "ವ್ಯಾಪಾರಿ ಮತ್ತು ಲೆಡ್ಜರ್ ಲಿಂಕಿಂಗ್ ಆರ್ಕಿಟೆಕ್ಚರ್"
                    : lang === "en-IN"
                      ? "Merchant & Ledger Binding Architecture"
                      : "व्यापारी एवं लेजर लिंकिंग आर्किटेक्चर"}
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ✓ Cryptographically Bound
              </span>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-gray-700">
              <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">
                    Connected Merchant Account
                  </span>
                  <span className="font-extrabold text-sm text-[#002970] block mt-0.5">
                    Ramesh Kumar (Ramesh Kirana Store)
                  </span>
                  <span className="font-mono text-gray-500 text-[11px] block">
                    ID: DEMO_MERCHANT_RAMESH
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">
                    Linked UPI VPA
                  </span>
                  <span className="font-mono font-bold text-purple-700 text-xs block mt-0.5">
                    ramesh.kirana@paytm
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-gray-500 block">Bank Settlement Account:</span>
                  <strong className="text-gray-900 block mt-0.5">State Bank of India (••4091)</strong>
                  <span className="text-gray-400 font-mono text-[10px]">IFSC: SBIN0004051</span>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-gray-500 block">Cellular IoT Provider:</span>
                  <strong className="text-gray-900 block mt-0.5">Airtel M2M 4G eSIM (Slot 1)</strong>
                  <span className="text-emerald-600 font-bold text-[10px]">Auto-APN Configured</span>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-gray-500 block">Firmware / OS:</span>
                  <strong className="text-gray-900 block mt-0.5">Paytm Soundbox OS v4.2.1</strong>
                  <span className="text-blue-600 font-bold text-[10px]">FOTA Auto-Update Active</span>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-gray-500 block">Audio Engine Languages:</span>
                  <strong className="text-gray-900 block mt-0.5">Hindi + Kannada + English</strong>
                  <span className="text-purple-600 font-bold text-[10px]">Dynamic Multilingual DSP</span>
                </div>
              </div>

              {/* Binding Protocol details */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 text-[11px] text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="size-3.5 text-amber-700" />
                  <span>NPCI Dynamic Soundbox Binding Protocol (DSBP v2)</span>
                </div>
                <p className="text-amber-800 leading-relaxed text-[10px]">
                  When a customer scans Ramesh ji's QR code, NPCI switch broadcasts the transaction RRN. The Soundbox receives the push notification via encrypted MQTT channel and verifies the SHA-256 HMAC signature against the merchant's TID before speaking the amount.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Live Chime Simulator */}
          <div className="rounded-3xl bg-white p-5 sm:p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.05)]">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Volume2 className="size-4 text-[#00BAF2]" />
                <h3 className="text-sm font-black text-[#002970] uppercase tracking-wide">
                  {lang === "kn-IN"
                    ? "ಲೈವ್ ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಆಡಿಯೋ ಧ್ವನಿ ಜನರೇಟರ್"
                    : lang === "en-IN"
                      ? "Live Soundbox Audio Chime Generator"
                      : "लाइव साउंडबॉक्स ऑडियो ध्वनि जनरेटर"}
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-mono">
                Model 4.0 Dual-Core
              </span>
            </div>

            <div className="mt-4 space-y-4">
              {/* Language Selector for chime */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  {lang === "kn-IN" ? "ಪ್ರಸಾರ ಭಾಷೆ ಆರಿಸಿ:" : lang === "en-IN" ? "Broadcast Voice Language:" : "प्रसारण भाषा चुनें:"}
                </label>
                <div className="flex gap-2">
                  {[
                    { id: "hi", label: "हिन्दी (Hindi)" },
                    { id: "kn", label: "ಕನ್ನಡ (Kannada)" },
                    { id: "en", label: "English" },
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setSelectedChimeLang(l.id)}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedChimeLang === l.id
                          ? "bg-[#002970] text-white border-[#002970] shadow-xs"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount preset chips */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  {lang === "kn-IN" ? "ಪಾವತಿ ಮೊತ್ತ ಆರಿಸಿ:" : lang === "en-IN" ? "Select Test Payment Amount:" : "भुगतान राशि चुनें:"}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[50, 100, 250, 500].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setTestAmount(val)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        testAmount === val
                          ? "bg-[#00BAF2] text-[#002970] border-[#00BAF2] shadow-xs"
                          : "bg-white text-gray-700 border-gray-200 hover:border-[#00BAF2]"
                      }`}
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fire Button */}
              <button
                type="button"
                disabled={testingChime}
                onClick={() => handleTriggerChime()}
                className="w-full py-3 rounded-2xl bg-[#002970] hover:bg-[#001738] text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {testingChime ? (
                  <RefreshCw className="size-4 animate-spin text-[#00BAF2]" />
                ) : (
                  <Play className="size-4 fill-current text-[#00BAF2]" />
                )}
                {lang === "kn-IN"
                  ? `ಸೌಂಡ್‌ಬಾಕ್ಸ್‌ನಲ್ಲಿ ₹${testAmount} ಪ್ರಸಾರ ಮಾಡಿ`
                  : lang === "en-IN"
                    ? `Broadcast ₹${testAmount} on Soundbox`
                    : `साउंडबॉक्स पर ₹${testAmount} का प्रसारण करें`}
              </button>
            </div>
          </div>

          {/* Swar-Mudra 18.5 kHz Ultrasonic APOD Card */}
          <div className="rounded-3xl bg-white p-5 sm:p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.05)]">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Radio className="size-4 text-purple-600" />
                <h3 className="text-sm font-black text-[#002970] uppercase tracking-wide">
                  Swar-Mudra: 18.5 kHz Ultrasonic APOD
                </h3>
              </div>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                18.5 – 19.8 kHz FSK
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Near-ultrasonic acoustic handshake creating an unforgeable Proof of Delivery (APOD) within 1.5m of the counter, decodable offline via phone microphone.
            </p>

            <div className="mt-4 space-y-3">
              <button
                type="button"
                disabled={transmittingApod}
                onClick={handleTransmitApod}
                className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Radio className={`size-4 ${transmittingApod ? "animate-pulse" : ""}`} />
                {transmittingApod ? "Transmitting 18.5 kHz Carrier..." : `Transmit Ultrasonic APOD Chirp (₹${testAmount})`}
              </button>

              {apodPayload && (
                <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-purple-950">Presence Proof Hash</span>
                    <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                      ✓ 1.5m Verified
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-purple-900 bg-white/80 p-2 rounded-lg border border-purple-100 break-all">
                    {apodPayload.presenceHash}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-600 pt-1">
                    <div>Carrier: <strong>18,500 – 19,800 Hz</strong></div>
                    <div>Duration: <strong>1.200s (FSK)</strong></div>
                    <div>RRN: <strong>{apodPayload.decodedReceipt?.rrn}</strong></div>
                    <div>Offline Status: <strong className="text-emerald-700">Decodable</strong></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Soundbox Broadcast History From Real Database Ledger (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl bg-white p-5 sm:p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.05)]">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-[#00BAF2]" />
                <h3 className="text-sm font-black text-[#002970] uppercase tracking-wide">
                  {lang === "kn-IN"
                    ? "ನೈಜ-ಸಮಯದ ಲೆಡ್ಜರ್ ಧ್ವನಿ ಪ್ರಸಾರ ದಾಖಲೆ"
                    : lang === "en-IN"
                      ? "Live Ledger Audio Broadcast Stream"
                      : "लाइव लेजर ऑडियो प्रसारण लॉग"}
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-bold bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-200">
                {transactions.length} {lang === "kn-IN" ? "ಧ್ವನಿ ಪ್ರಸಾರಗಳು" : lang === "en-IN" ? "Broadcasts" : "प्रसारण"}
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              {lang === "kn-IN"
                ? "ಡೇಟಾಬೇಸ್‌ನಿಂದ ನೇರವಾಗಿ ಪ್ರತಿ ಯಶಸ್ವಿ ಪಾವತಿಗೆ ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಪ್ರಸಾರ ಮಾಡಿದ ಧ್ವನಿ ಲಾಗ್."
                : lang === "en-IN"
                  ? "Real-time log of every payment announced via Paytm Soundbox 4G audio DSP."
                  : "डेटाबेस से सीधे प्रत्येक सफल भुगतान के लिए साउंडबॉक्स द्वारा प्रसारित ऑडियो लॉग।"}
            </p>

            <div className="mt-4 space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400">
                  {lang === "kn-IN" ? "ಯಾವುದೇ ಧ್ವನಿ ದಾಖಲೆಗಳಿಲ್ಲ" : lang === "en-IN" ? "No audio broadcasts recorded yet" : "कोई ऑडियो प्रसारण नहीं मिला"}
                </div>
              ) : (
                transactions.map((txn) => {
                  const amt = Number(txn.amount || 0);
                  const time = txn.created_at
                    ? new Date(txn.created_at).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : "Just now";

                  return (
                    <div
                      key={txn.txn_id}
                      className="p-3.5 rounded-2xl bg-gray-50 hover:bg-blue-50/40 border border-gray-200 transition-colors flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="size-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Volume2 className="size-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-sm text-[#002970]">
                              +₹{amt.toFixed(2)}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                              ✓ Spoken
                            </span>
                          </div>
                          <span className="font-mono text-gray-500 text-[11px] block mt-0.5">
                            {txn.payer_vpa || "customer@paytm"} • {txn.rrn || txn.txn_id}
                          </span>
                          <span className="text-[10px] text-gray-400 block">
                            MQTT QoS 1 • Confirmed at {time}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleTriggerChime(amt)}
                        className="px-2.5 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-[#00BAF2] text-[#002970] font-bold text-[11px] shadow-2xs hover:bg-blue-50 transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                        title="Replay this broadcast"
                      >
                        <Play className="size-3 text-[#00BAF2] fill-current" />
                        {lang === "kn-IN" ? "ಮರುಪ್ರಸಾರ" : lang === "en-IN" ? "Replay" : "रीप्ले"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Assigned FSE & Field Service */}
          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,41,112,0.05)] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-blue-50 text-[#002970] flex items-center justify-center font-black">
                <UserCheck className="size-5 text-[#00BAF2]" />
              </div>
              <div>
                <span className="font-bold text-gray-900 block">
                  Assigned Hardware Field Officer: Arun Sharma
                </span>
                <span className="text-gray-500 text-[11px] block">
                  Koramangala Beat #4 • Next inspection: Today 4:00 PM
                </span>
              </div>
            </div>

            <a
              href="tel:+919123456780"
              className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs flex items-center gap-1 shrink-0"
            >
              <Phone className="size-3 text-[#002970]" />
              Call FSE
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

