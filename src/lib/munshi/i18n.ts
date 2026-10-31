export type LangCode = "hi-IN" | "kn-IN" | "en-IN";

export interface TranslationDictionary {
  // Common / Header
  appName: string;
  paytmForBusiness: string;
  okfBadge: string;
  demoBadge: string;
  shopkeeperTab: string;
  fseTab: string;
  judgeTab: string;
  scenarioBarTitle: string;
  scene1Short: string;
  scene2Short: string;
  scene3Short: string;
  scene4Short: string;

  // Shopkeeper Greeting
  storeName: string;
  upiId: string;
  greetingTitle: string;
  greetingSub: string;
  showQrBtn: string;
  instantSettlementBtn: string;

  // 4 Quick Actions
  qaReceiveMoney: string;
  qaReceiveMoneySub: string;
  qaPaymentHistory: string;
  qaPaymentHistorySub: string;
  qaBankSettlement: string;
  qaBankSettlementSub: string;
  qaSoundbox: string;
  qaSoundboxSub: string;

  // Today's Business Card
  todayBusinessTitle: string;
  realTimeBadge: string;
  totalPaymentsReceived: string;
  successfulPaymentsCount: string;
  bankSettledTitle: string;
  bankSettledSub: string;
  pendingSettlementTitle: string;
  pendingSettlementSub: string;
  mdrBankFeeTitle: string;
  govtSubsidyPill: string;

  // Recent Payments
  recentPaymentsTitle: string;
  filterAll: string;
  filterSuccess: string;
  filterSettled: string;
  creditedToBank: string;
  settlingTonight: string;
  pending: string;
  noPaymentsFound: string;

  // Voice Assistant
  askMunshiTitle: string;
  askMunshiSub: string;
  chipTodayReceived: string;
  chipWhenSettlement: string;
  chipSoundboxWorking: string;
  chipDid500Come: string;
  inputPlaceholder: string;
  aiResponseLabel: string;
  listening: string;
  voiceHowItWorks: string;
  voiceRetryHint: string;
  voiceMicBlockedHint: string;
  voiceHeardLabel: string;
  voiceTapToSend: string;
  voiceTapToSpeak: string;
  voiceSourceLedger: string;
  voiceSourceMdr: string;
  voiceSourceFallback: string;

  // Soundbox Telemetry
  soundboxStatusTitle: string;
  soundboxModel: string;
  online: string;
  battery: string;
  audioTestBtn: string;
  troubleshootBtn: string;

  // Merchant Support
  supportTitle: string;
  fseName: string;
  fseBeat: string;
  callFseBtn: string;
  helpTicketBtn: string;

  // Mobile Bottom Navigation & Sidebar
  menuGetStarted: string;
  menuDashboard: string;
  menuBusinessPayments: string;
  menuAcceptPayments: string;
  navHome: string;
  navPayments: string;
  navSettlement: string;
  navSoundbox: string;
  navHelp: string;
  navDisputes: string;
  navSplit: string;
  navVoice: string;
  navTransfers: string;
  navHistory: string;
  navReports: string;
  navAccept: string;
  dateToday: string;

  // Footer
  footerHackathon: string;
  footerTrack: string;
  footerCompliance: string;

  // FSE Operations Console
  fseConsoleTitle: string;
  fseConsoleSub: string;
  handoverBtn: string;
  statAssignedMerchants: string;
  statActiveDisputes: string;
  statNextVisit: string;
  statSoundboxUptime: string;
  allActivePill: string;
  underReviewPill: string;
  connected100Pill: string;
  assignedMerchantsTitle: string;
  activeCountBadge: string;
  viewProfile: string;
  lowBattery: string;
  activeDisputesTitle: string;
  reviewRequiredBadge: string;
  uploadEvidenceBtn: string;
  instantReversalBtn: string;
  safeHandoffTitle: string;
  safeHandoffDesc: string;
  recipientOfficer: string;
  confirmHandoffBtn: string;
  memoryStreamTitle: string;
  notePlaceholder: string;
  saveNoteBtn: string;

  // Judge / Engine View
  judgeTitle: string;
  judgeSub: string;
  nightlyDreamBtn: string;
  statSystemLoad: string;
  statCanaryZ: string;
  statCostPerCall: string;
  statAutonomyLevel: string;
  fiveTrustSignalsTitle: string;
  cragValidateBtn: string;
  activePolicyFile: string;
  provenanceLabel: string;
  trustTierLabel: string;
  freshnessLabel: string;
  lifecycleLabel: string;
  attestationLabel: string;
  cragConfidenceScore: string;
  highConfidenceVerified: string;
  fsmShieldTitle: string;
  fsmShieldSub: string;
  testPromptInjectionBtn: string;
  ceecilLadderTitle: string;
  singleLoopOpev: string;
  rung1Title: string;
  rung1Desc: string;
  rung1Accuracy: string;
  rung2Title: string;
  rung2Desc: string;
  rung2Autonomy: string;
  rung3Title: string;
  rung3Desc: string;
  rung3Status: string;
  walTitleBadge: string;
  idempotencyGuaranteed: string;

  // Modals
  modalReceiveTitle: string;
  modalScanPay: string;
  modalCustomAmount: string;
  modalSimulatePayment: string;
  modalClose: string;
  modalTxnDetailTitle: string;
  modalDigitalReceipt: string;
  modalBankRefRrn: string;
  modalCustomerUpi: string;
  modalPaymentMode: string;
  modalTimestamp: string;
  modalMdrWaiver: string;
  modalSettlementStatus: string;
  modalRaiseDispute: string;
  modalSettlementTitle: string;
  modalTotalSettled: string;
  modalLinkedBank: string;
  modalPayoutSchedule: string;
  modalInstantPayoutBtn: string;
  modalSoundboxTitle: string;
  modalSoundboxImei: string;
  modalFirmware: string;
  modalSpeakerHealth: string;
  modalSignalStrength: string;
  modalPlayTestChime: string;
  modalResetConnection: string;
}

export const I18N: Record<LangCode, TranslationDictionary> = {
  "en-IN": {
    // Common / Header
    appName: "Pi Munshi",
    paytmForBusiness: "Paytm for Business",
    okfBadge: "OKF v0.2",
    demoBadge: "DEMO MODE",
    shopkeeperTab: "Shopkeeper",
    fseTab: "Field FSE",
    judgeTab: "Judge / Engine",
    scenarioBarTitle: "Live Hackathon Scenario Triggers:",
    scene1Short: "1 · Bill Defense (POD)",
    scene2Short: "2 · Checkout Shield (VCG)",
    scene3Short: "3 · Block Attack (FSM)",
    scene4Short: "4 · Nightly Settlement & Resign",

    // Shopkeeper Greeting
    storeName: "Ramesh Kirana Store (Ramesh Kirana)",
    upiId: "UPI: ramesh.kirana@paytm",
    greetingTitle: "Namaste, Ramesh ji! 🙏",
    greetingSub: "Here is your store's secure digital payment summary, settlement status, and Soundbox health.",
    showQrBtn: "Show QR Code",
    instantSettlementBtn: "Instant Settlement",

    // 4 Quick Actions
    qaReceiveMoney: "Receive Money",
    qaReceiveMoneySub: "All-in-One UPI QR",
    qaPaymentHistory: "Payment History",
    qaPaymentHistorySub: "All Digital Transactions",
    qaBankSettlement: "Bank Settlement",
    qaBankSettlementSub: "UTR & Daily Payout",
    qaSoundbox: "Soundbox 4.0",
    qaSoundboxSub: "88% Battery • Online",

    // Today's Business Card
    todayBusinessTitle: "TODAY'S BUSINESS",
    realTimeBadge: "Real-time Live Update",
    totalPaymentsReceived: "Total Payments Received",
    successfulPaymentsCount: "3 Successful Transactions",
    bankSettledTitle: "Bank Settled",
    bankSettledSub: "UTR: 62998412...",
    pendingSettlementTitle: "Pending Settlement",
    pendingSettlementSub: "Tonight at 11:59 PM",
    mdrBankFeeTitle: "MDR Bank Charges",
    govtSubsidyPill: "100% Govt Subsidy",

    // Recent Payments
    recentPaymentsTitle: "Recent Payments",
    filterAll: "All",
    filterSuccess: "Success",
    filterSettled: "Settled",
    creditedToBank: "Credited to Bank",
    settlingTonight: "Settling Tonight",
    pending: "Pending",
    noPaymentsFound: "No transactions found",

    // Voice Assistant
    askMunshiTitle: "Ask Pi Munshi (Voice Assistant)",
    askMunshiSub: "Click the mic and speak in English, Hindi, or Kannada",
    chipTodayReceived: "\"How much did I receive today?\"",
    chipWhenSettlement: "\"When will my settlement arrive?\"",
    chipSoundboxWorking: "\"Is my Soundbox working?\"",
    chipDid500Come: "\"Did I receive ₹500 payment?\"",
    inputPlaceholder: "Type your question or click mic...",
    aiResponseLabel: "Pi Munshi Answer:",
    listening: "Listening...",
    voiceHowItWorks: "Ask queries about your daily payments, settlements, Soundbox, or MDR rules.",
    voiceRetryHint: "Could not record or transcribe. Please speak clearly or type your question.",
    voiceMicBlockedHint: "Microphone access blocked. Please allow microphone permission in browser settings.",
    voiceHeardLabel: "Heard:",
    voiceTapToSend: "Tap to stop & send",
    voiceTapToSpeak: "Tap to speak",
    voiceSourceLedger: "Live Ledger",
    voiceSourceMdr: "MDR Policy",
    voiceSourceFallback: "Verified Fallback",

    // Soundbox Telemetry
    soundboxStatusTitle: "Soundbox Status (SOUNDBOX 4.0)",
    soundboxModel: "Paytm Soundbox 4.0 4G",
    online: "Online",
    battery: "Battery",
    audioTestBtn: "Audio Test",
    troubleshootBtn: "Troubleshoot",

    // Merchant Support
    supportTitle: "Merchant Support (SUPPORT)",
    fseName: "FSE Arun Sharma (Your Field Executive)",
    fseBeat: "Koramangala Beat • 9123456780",
    callFseBtn: "Call FSE",
    helpTicketBtn: "Help Ticket",

    // Mobile Bottom Navigation & Sidebar
    menuGetStarted: "Get Started",
    menuDashboard: "Dashboard",
    menuBusinessPayments: "Business Payments",
    menuAcceptPayments: "Accept Payments",
    navHome: "Home",
    navPayments: "Payments",
    navSettlement: "Settlements",
    navSoundbox: "Soundbox",
    navHelp: "Support / FSE",
    navDisputes: "Disputes",
    navSplit: "Split Settlement",
    navVoice: "Ask Munshi",
    navTransfers: "Accounts & Transfers",
    navHistory: "Transaction History",
    navReports: "Reports",
    navAccept: "Show QR",
    dateToday: "Today, 31 Oct",

    // Footer
    footerHackathon: "Paytm Build for India AI Hackathon",
    footerTrack: "Track 3: Autonomous AI Teammates",
    footerCompliance: "100% NPCI UDIR & RBI FREE-AI Compliant",

    // FSE Operations Console
    fseConsoleTitle: "FSE Operations Console",
    fseConsoleSub: "Merchant visits, dispute resolution, Soundbox service, and safe territory handoff management.",
    handoverBtn: "Handover to Priya",
    statAssignedMerchants: "Assigned Merchants (BEAT)",
    statActiveDisputes: "Active Disputes",
    statNextVisit: "Next Visit",
    statSoundboxUptime: "Soundbox 4G Uptime",
    allActivePill: "All Active",
    underReviewPill: "Under Review",
    connected100Pill: "100% Signal Connected",
    assignedMerchantsTitle: "ASSIGNED MERCHANTS IN TERRITORY",
    activeCountBadge: "3 Active Merchants",
    viewProfile: "View Profile →",
    lowBattery: "Low Battery",
    activeDisputesTitle: "ACTIVE DISPUTES",
    reviewRequiredBadge: "1 Review Pending",
    uploadEvidenceBtn: "Upload Evidence",
    instantReversalBtn: "Instant Reversal",
    safeHandoffTitle: "SAFE FSE HANDOFF",
    safeHandoffDesc: "Seamlessly transfer all 3 merchants' full memory history and pending commitments to FSE Priya Nair without any loss of promises.",
    recipientOfficer: "Recipient Officer: FSE Priya Nair (ID: DEMO_FSE_PRIYA • 9123456789)",
    confirmHandoffBtn: "Confirm Handoff",
    memoryStreamTitle: "MERCHANT MEMORY & VISIT NOTES",
    notePlaceholder: "Add visit note (e.g., Soundbox 4G SIM tested and verified OK)...",
    saveNoteBtn: "Save Note",

    // Judge / Engine View
    judgeTitle: "Judge & System Architecture Console",
    judgeSub: "5 All-in-One Trust Signals, Outlines FSM Shield, 3-Rung Cognition Ladder, and Reinforcement Learning.",
    nightlyDreamBtn: "Run Nightly Dreaming",
    statSystemLoad: "System Load (SPS)",
    statCanaryZ: "Canary Z-Score",
    statCostPerCall: "Cost Per Call",
    statAutonomyLevel: "Autonomy Level",
    fiveTrustSignalsTitle: "GOOGLE CLOUD OKF V0.2 TRUST SIGNALS",
    cragValidateBtn: "Verify CRAG Citation",
    activePolicyFile: "Active Policy: rbi_mdr_waiver_cap_2026.md",
    provenanceLabel: "1. Provenance: Reserve Bank of India & National Payments Corporation of India (NPCI)",
    trustTierLabel: "2. Trust Tier: tier-1-verified",
    freshnessLabel: "3. Freshness: Valid until 2026-10-15",
    lifecycleLabel: "4. Lifecycle: STABLE",
    attestationLabel: "5. Cryptographic SHA-256 Attestation Hash:",
    cragConfidenceScore: "CRAG Confidence Score: 99%",
    highConfidenceVerified: "✓ HIGH_CONFIDENCE_AUTHORITATIVE (Fail-Closed Verified)",
    fsmShieldTitle: "OUTLINES LEXICAL FSM SHIELD (ADVERSARIAL SHIELD)",
    fsmShieldSub: "Strict mathematical lexical barrier instantly blocking prompt injections & unauthorized fund movements",
    testPromptInjectionBtn: "Test Adversarial Prompt Injection",
    ceecilLadderTitle: "CEECIL 3-RUNG COGNITION LADDER",
    singleLoopOpev: "Single-Loop O-P-E-V",
    rung1Title: "Rung 1: Reflex Confirm",
    rung1Desc: "0 LLM Tokens • 180ms Latency",
    rung1Accuracy: "100% Exact",
    rung2Title: "Rung 2: Policy Arbitrage",
    rung2Desc: "~450 Tokens • CRAG Evaluation",
    rung2Autonomy: "L2 Autonomy",
    rung3Title: "Rung 3: VCG Mechanism Design",
    rung3Desc: "Flo Pro Multi-Party Contract Menu",
    rung3Status: "Verified",
    walTitleBadge: "WRITE-AHEAD LOG (WAL) & AUDIT TRAILS",
    idempotencyGuaranteed: "Idempotency Guaranteed",

    // Modals
    modalReceiveTitle: "All-in-One Paytm QR Code",
    modalScanPay: "Scan with any UPI App (Paytm, GPay, PhonePe)",
    modalCustomAmount: "Set Custom Amount:",
    modalSimulatePayment: "⚡ Simulate Customer UPI Payment",
    modalClose: "Close",
    modalTxnDetailTitle: "Digital Payment Receipt",
    modalDigitalReceipt: "Paytm Verified Digital Receipt",
    modalBankRefRrn: "Bank Reference (RRN)",
    modalCustomerUpi: "Customer UPI ID",
    modalPaymentMode: "Payment Mode",
    modalTimestamp: "Timestamp",
    modalMdrWaiver: "MDR Subsidy Waiver",
    modalSettlementStatus: "Settlement Status",
    modalRaiseDispute: "Raise UDIR Dispute",
    modalSettlementTitle: "Bank Settlement Breakdown",
    modalTotalSettled: "Net Deposited in Bank",
    modalLinkedBank: "Linked Bank Account",
    modalPayoutSchedule: "Payout Schedule",
    modalInstantPayoutBtn: "⚡ Transfer to Bank Instantly",
    modalSoundboxTitle: "Paytm Soundbox 4.0 Diagnostics",
    modalSoundboxImei: "IMEI Number",
    modalFirmware: "Firmware Version",
    modalSpeakerHealth: "Speaker Health",
    modalSignalStrength: "4G VoLTE Signal",
    modalPlayTestChime: "🔔 Play Test Payment Voice",
    modalResetConnection: "🔄 Reset 4G Connection",
  },

  "hi-IN": {
    // Common / Header
    appName: "Pi Munshi",
    paytmForBusiness: "Paytm for Business",
    okfBadge: "OKF v0.2",
    demoBadge: "DEMO MODE",
    shopkeeperTab: "दुकानदार",
    fseTab: "फ़ील्ड FSE",
    judgeTab: "जज / इंजन",
    scenarioBarTitle: "लाइव हैकथॉन टेस्ट परिदृश्य (One-Click Scenario Triggers):",
    scene1Short: "1 · बिल बचाव (POD)",
    scene2Short: "2 · चेकआउट रक्षा (VCG)",
    scene3Short: "3 · हमला रोकें (FSM)",
    scene4Short: "4 · रात्रि हिसाब व इस्तीफा",

    // Shopkeeper Greeting
    storeName: "रमेश किराना स्टोर (Ramesh Kirana)",
    upiId: "UPI: ramesh.kirana@paytm",
    greetingTitle: "नमस्ते, रमेश जी! 🙏",
    greetingSub: "यहाँ है आपकी दुकान का आज का सुरक्षित डिजिटल पेमेंट सारांश, सेटलमेंट और साउंडबॉक्स स्थिति।",
    showQrBtn: "क्यूआर कोड दिखाएं (Show QR)",
    instantSettlementBtn: "तुरंत सेटलमेंट",

    // 4 Quick Actions
    qaReceiveMoney: "पैसे प्राप्त करें",
    qaReceiveMoneySub: "ऑल-इन-वन यूपीआई क्यूआर",
    qaPaymentHistory: "पेमेंट हिस्ट्री",
    qaPaymentHistorySub: "सभी डिजिटल लेन-देन",
    qaBankSettlement: "बैंक सेटलमेंट",
    qaBankSettlementSub: "UTR एवं दैनिक निकासी",
    qaSoundbox: "साउंडबॉक्स 4.0",
    qaSoundboxSub: "88% बैटरी • ऑनलाइन",

    // Today's Business Card
    todayBusinessTitle: "आज का कुल कारोबार (TODAY'S BUSINESS)",
    realTimeBadge: "रियल-टाइम लाइव अपडेट",
    totalPaymentsReceived: "कुल भुगतान प्राप्त",
    successfulPaymentsCount: "3 सफल लेन-देन",
    bankSettledTitle: "बैंक में जमा (SETTLED)",
    bankSettledSub: "UTR: 62998412...",
    pendingSettlementTitle: "लंबित सेटलमेंट (PENDING)",
    pendingSettlementSub: "आज रात 11:59 बजे",
    mdrBankFeeTitle: "MDR बैंक शुल्क",
    govtSubsidyPill: "100% सरकारी सब्सिडी",

    // Recent Payments
    recentPaymentsTitle: "हाल के भुगतान (Recent Payments)",
    filterAll: "सभी",
    filterSuccess: "सफल",
    filterSettled: "सेटल",
    creditedToBank: "खाते में जमा",
    settlingTonight: "आज रात जमा",
    pending: "लंबित",
    noPaymentsFound: "कोई लेन-देन नहीं मिला",

    // Voice Assistant
    askMunshiTitle: "मुंशी AI से बोलकर पूछें (Voice Assistant)",
    askMunshiSub: "माइक दबाएं और हिंदी, अंग्रेज़ी या कन्नड़ में पूछें",
    chipTodayReceived: "\"मेरा आज का पेमेंट कितना आया?\"",
    chipWhenSettlement: "\"मेरा सेटलमेंट कब आएगा?\"",
    chipSoundboxWorking: "\"साउंडबॉक्स में आवाज़ आ रही है?\"",
    chipDid500Come: "\"क्या ₹500 का पेमेंट आया?\"",
    inputPlaceholder: "यहाँ सवाल टाइप करें या माइक दबाएं...",
    aiResponseLabel: "मुंशी AI उत्तर:",
    listening: "सुन रहे हैं...",
    voiceHowItWorks: "अपने दैनिक भुगतान, सेटलमेंट, साउंडबॉक्स या MDR नियमों के बारे में प्रश्न पूछें।",
    voiceRetryHint: "आवाज़ रिकॉर्ड नहीं हो सकी। कृपया स्पष्ट बोलें या लिखकर पूछें।",
    voiceMicBlockedHint: "माइक्रोफ़ोन अनुमति बंद है। कृपया ब्राउज़र सेटिंग्स में अनुमति दें।",
    voiceHeardLabel: "सुना गया:",
    voiceTapToSend: "रोकने और भेजने के लिए दबाएं",
    voiceTapToSpeak: "बोलने के लिए दबाएं",
    voiceSourceLedger: "लाइव बहीखाता",
    voiceSourceMdr: "MDR नियम",
    voiceSourceFallback: "प्रमाणित बैकअप",

    // Soundbox Telemetry
    soundboxStatusTitle: "साउंडबॉक्स स्थिति (SOUNDBOX 4.0)",
    soundboxModel: "Paytm Soundbox 4.0 4G",
    online: "ऑनलाइन",
    battery: "बैटरी",
    audioTestBtn: "ध्वनि टेस्ट",
    troubleshootBtn: "समस्या निवारण",

    // Merchant Support
    supportTitle: "मदद एवं फ़ील्ड सहायता (SUPPORT)",
    fseName: "FSE अरुण शर्मा (आपका फ़ील्ड अधिकारी)",
    fseBeat: "कोरमंगला क्षेत्र • 9123456780",
    callFseBtn: "कॉल करें",
    helpTicketBtn: "हेल्प टिकट",

    // Mobile Bottom Navigation & Sidebar
    menuGetStarted: "शुरुआत करें",
    menuDashboard: "डैशबोर्ड",
    menuBusinessPayments: "व्यापारिक भुगतान",
    menuAcceptPayments: "भुगतान स्वीकारें",
    navHome: "होम",
    navPayments: "भुगतान",
    navSettlement: "सेटलमेंट",
    navSoundbox: "साउंडबॉक्स",
    navHelp: "सहायता / FSE",
    navDisputes: "विवाद निवारण",
    navSplit: "स्प्लिट सेटलमेंट",
    navVoice: "मुंशी से पूछें",
    navTransfers: "खाता एवं स्थानांतरण",
    navHistory: "लेन-देन इतिहास",
    navReports: "रिपोर्ट्स",
    navAccept: "QR कोड दिखाएं",
    dateToday: "आज, 31 अक्टूबर",

    // Footer
    footerHackathon: "Paytm Build for India AI Hackathon",
    footerTrack: "Track 3: Autonomous AI Teammates",
    footerCompliance: "100% NPCI UDIR & RBI FREE-AI Compliant",

    // FSE Operations Console
    fseConsoleTitle: "फ़ील्ड ऑपरेशंस डैशबोर्ड (FSE Operations Console)",
    fseConsoleSub: "दुकानदार दौरे, शिकायत निवारण, साउंडबॉक्स सेवा एवं सुरक्षित हैंडऑफ प्रबंधन।",
    handoverBtn: "क्षेत्र हैंडऑफ करें (Handover to Priya)",
    statAssignedMerchants: "आवंटित दुकानें (BEAT)",
    statActiveDisputes: "सक्रिय विवाद (DISPUTES)",
    statNextVisit: "अगला दौरा (NEXT VISIT)",
    statSoundboxUptime: "साउंडबॉक्स 4G अपटाइम",
    allActivePill: "सभी सक्रिय",
    underReviewPill: "समीक्षाधीन",
    connected100Pill: "100% सिग्नल कनेक्टेड",
    assignedMerchantsTitle: "आवंटित व्यापारी बीट (ASSIGNED MERCHANTS IN TERRITORY)",
    activeCountBadge: "3 सक्रिय दुकानें",
    viewProfile: "प्रोफ़ाइल देखें →",
    lowBattery: "बैटरी कम",
    activeDisputesTitle: "सक्रिय विवाद (ACTIVE DISPUTES)",
    reviewRequiredBadge: "1 समीक्षाधीन",
    uploadEvidenceBtn: "प्रमाण अपलोड करें",
    instantReversalBtn: "तत्काल रिवर्सल दें",
    safeHandoffTitle: "सुरक्षित क्षेत्र हैंडऑफ (SAFE FSE HANDOFF)",
    safeHandoffDesc: "स्थान परिवर्तन या छुट्टी पर जाने की स्थिति में अपने सभी 3 व्यापारियों का संपूर्ण इतिहास एवं चालू प्रतिबद्धताएं FSE प्रिया नायर को सुरक्षित ट्रांसफर करें।",
    recipientOfficer: "प्राप्तकर्ता अधिकारी: FSE प्रिया नायर (ID: DEMO_FSE_PRIYA • 9123456789)",
    confirmHandoffBtn: "कार्यभार हस्तांतरित करें (Confirm Handoff)",
    memoryStreamTitle: "व्यापारी मेमोरी एवं विज़िट नोट्स (MEMORY STREAM)",
    notePlaceholder: "फ़ील्ड विज़िट का नया नोट जोड़ें (उदा. साउंडबॉक्स 4G सिम टेस्ट किया)...",
    saveNoteBtn: "नोट सेव करें",

    // Judge / Engine View
    judgeTitle: "जज एवं सिस्टम आर्किटेक्चर कंसोल (Judge / Engine)",
    judgeSub: "5 ऑल-इन-वन ट्रस्ट सिग्नल्स, आउटलाइन्स FSM शील्ड, 3-रंग कॉग्निशन लैडर एवं रीइन्फोर्समेंट लर्निंग।",
    nightlyDreamBtn: "नाइटली ड्रीमिंग चलाएं (Nightly Dream)",
    statSystemLoad: "सिस्टम लोड (SPS)",
    statCanaryZ: "कैनरी Z-स्कोर",
    statCostPerCall: "प्रति कॉल टोकन लागत",
    statAutonomyLevel: "स्वायत्तता स्तर",
    fiveTrustSignalsTitle: "GOOGLE CLOUD OKF V0.2 ट्रस्ट सिग्नल्स",
    cragValidateBtn: "CRAG सत्यापित करें",
    activePolicyFile: "सक्रिय नीति फ़ाइल: rbi_mdr_waiver_cap_2026.md",
    provenanceLabel: "1. उद्गम (Provenance): Reserve Bank of India & NPCI",
    trustTierLabel: "2. ट्रस्ट टीयर: tier-1-verified",
    freshnessLabel: "3. ताज़गी (Freshness): 2026-10-15 तक मान्य",
    lifecycleLabel: "4. लाइफसाइकिल: STABLE",
    attestationLabel: "5. क्रिप्टोग्राफिक SHA-256 बाइट अटेस्टेशन हैश:",
    cragConfidenceScore: "CRAG कॉन्फ़िडेंस स्कोर: 99%",
    highConfidenceVerified: "✓ HIGH_CONFIDENCE_AUTHORITATIVE (फेल-क्लोज्ड सत्यापित)",
    fsmShieldTitle: "आउटलाइन्स लेक्सिकल FSM शील्ड (ADVERSARIAL SHIELD)",
    fsmShieldSub: "प्रॉम्प्ट इंजेक्शन एवं अनधिकृत मनी वर्ब का तत्काल गणितीय अवरोध",
    testPromptInjectionBtn: "प्रॉम्प्ट इंजेक्शन टेस्ट करें",
    ceecilLadderTitle: "CEECIL 3-रंग कॉग्निशन लैडर",
    singleLoopOpev: "सिंगल-लूप O-P-E-V",
    rung1Title: "रंग 1: रिफ्लेक्स कन्फर्म",
    rung1Desc: "0 LLM टोकन • 180ms विलंबता",
    rung1Accuracy: "100% सटीक",
    rung2Title: "रंग 2: पॉलिसी आर्बिट्रेज",
    rung2Desc: "~450 टोकन • CRAG इवैल्यूएशन",
    rung2Autonomy: "L2 स्वायत्तता",
    rung3Title: "रंग 3: VCG मैकेनिज़्म डिज़ाइन",
    rung3Desc: "फ्लो प्रो बहु-पक्षीय अनुबंध मेनू",
    rung3Status: "सत्यापित",
    walTitleBadge: "राइट-अहेड लॉग (WAL) एवं ऑडिट ट्रेल्स",
    idempotencyGuaranteed: "आइडमपोटेंसी गारंटीकृत",

    // Modals
    modalReceiveTitle: "ऑल-इन-वन पेटीएम क्यूआर कोड",
    modalScanPay: "किसी भी UPI ऐप से स्कैन करके भुगतान करें",
    modalCustomAmount: "राशि चुनें या लिखें:",
    modalSimulatePayment: "⚡ ग्राहक का UPI पेमेंट टेस्ट करें",
    modalClose: "बंद करें",
    modalTxnDetailTitle: "डिजिटल पेमेंट रसीद",
    modalDigitalReceipt: "पेटीएम सत्यापित डिजिटल रसीद",
    modalBankRefRrn: "बैंक संदर्भ संख्या (RRN)",
    modalCustomerUpi: "ग्राहक UPI ID",
    modalPaymentMode: "भुगतान का प्रकार",
    modalTimestamp: "समय",
    modalMdrWaiver: "MDR शुल्क छूट (सब्सिडी)",
    modalSettlementStatus: "सेटलमेंट स्थिति",
    modalRaiseDispute: "UDIR विवाद दर्ज करें",
    modalSettlementTitle: "बैंक सेटलमेंट विवरण",
    modalTotalSettled: "बैंक में कुल जमा राशि",
    modalLinkedBank: "लिंक किया गया बैंक खाता",
    modalPayoutSchedule: "निकासी समय",
    modalInstantPayoutBtn: "⚡ तुरंत बैंक खाते में निकालें",
    modalSoundboxTitle: "पेटीएम साउंडबॉक्स 4.0 स्थिति",
    modalSoundboxImei: "IMEI नंबर",
    modalFirmware: "फ़र्मवेयर वर्ज़न",
    modalSpeakerHealth: "स्पीकर स्थिति",
    modalSignalStrength: "4G VoLTE सिग्नल",
    modalPlayTestChime: "🔔 पेमेंट ध्वनि टेस्ट करें",
    modalResetConnection: "🔄 4G कनेक्शन रीसेट करें",
  },

  "kn-IN": {
    // Common / Header
    appName: "ಪೈ ಮುನ್ಷಿ (Pi Munshi)",
    paytmForBusiness: "ಪೇಟಿಎಂ ಫಾರ್ ಬಿಸಿನೆಸ್",
    okfBadge: "OKF v0.2",
    demoBadge: "ಡೆಮೋ ಮೋಡ್",
    shopkeeperTab: "ಅಂಗಡಿಯವರು",
    fseTab: "ಫೀಲ್ಡ್ FSE",
    judgeTab: "ಜಡ್ಜ್ / ಎಂಜಿನ್",
    scenarioBarTitle: "ಲೈವ್ ಹ್ಯಾಕಥಾನ್ ಸನ್ನಿವೇಶಗಳು (One-Click Scenario Triggers):",
    scene1Short: "1 · ಬಿಲ್ ರಕ್ಷಣೆ (POD)",
    scene2Short: "2 · ಚೆಕ್‌ಔಟ್ ರಕ್ಷಣೆ (VCG)",
    scene3Short: "3 · ದಾಳಿ ತಡೆಯಿರಿ (FSM)",
    scene4Short: "4 · ರಾತ್ರಿ ಲೆಕ್ಕ & ರಾಜೀನಾಮೆ",

    // Shopkeeper Greeting
    storeName: "ರಮೇಶ್ ಕಿರಾಣಿ ಸ್ಟೋರ್ (Ramesh Kirana)",
    upiId: "UPI: ramesh.kirana@paytm",
    greetingTitle: "ನಮಸ್ಕಾರ, ರಮೇಶ್ ಅವರೇ! 🙏",
    greetingSub: "ಇಲ್ಲಿದೆ ನಿಮ್ಮ ಅಂಗಡಿಯ ಇಂದಿನ ಸುರಕ್ಷಿತ ಡಿಜಿಟಲ್ ಪಾವತಿ ಸಾರಾಂಶ, ಸೆಟಲ್‌ಮೆಂಟ್ ಮತ್ತು ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಸ್ಥಿತಿ.",
    showQrBtn: "ಕ್ಯೂಆರ್ ಕೋಡ್ ತೋರಿಸಿ (Show QR)",
    instantSettlementBtn: "ತಕ್ಷಣದ ಸೆಟಲ್‌ಮೆಂಟ್",

    // 4 Quick Actions
    qaReceiveMoney: "ಹಣ ಸ್ವೀಕರಿಸಿ",
    qaReceiveMoneySub: "ಆಲ್-ಇನ್-ಒನ್ ಯುಪಿಐ ಕ್ಯೂಆರ್",
    qaPaymentHistory: "ಪಾವತಿ ಇತಿಹಾಸ",
    qaPaymentHistorySub: "ಎಲ್ಲಾ ಡಿಜಿಟಲ್ ವಹಿವಾಟುಗಳು",
    qaBankSettlement: "ಬ್ಯಾಂಕ್ ಸೆಟಲ್‌ಮೆಂಟ್",
    qaBankSettlementSub: "UTR ಮತ್ತು ದೈನಂದಿನ ವಾಪಸಾತಿ",
    qaSoundbox: "ಸೌಂಡ್‌ಬಾಕ್ಸ್ 4.0",
    qaSoundboxSub: "88% ಬ್ಯಾಟರಿ • ಆನ್‌ಲೈನ್",

    // Today's Business Card
    todayBusinessTitle: "ಇಂದಿನ ಒಟ್ಟು ವ್ಯಾಪಾರ (TODAY'S BUSINESS)",
    realTimeBadge: "ನೈಜ-ಸಮಯದ ಲೈವ್ ಅಪ್ಡೇಟ್",
    totalPaymentsReceived: "ಸ್ವೀಕರಿಸಿದ ಒಟ್ಟು ಪಾವತಿ",
    successfulPaymentsCount: "3 ಯಶಸ್ವಿ ವಹಿವಾಟುಗಳು",
    bankSettledTitle: "ಬ್ಯಾಂಕ್‌ಗೆ ಜಮೆ (SETTLED)",
    bankSettledSub: "UTR: 62998412...",
    pendingSettlementTitle: "ಬಾಕಿ ಸೆಟಲ್‌ಮೆಂಟ್ (PENDING)",
    pendingSettlementSub: "ಇಂದು ರಾತ್ರಿ 11:59 ಕ್ಕೆ",
    mdrBankFeeTitle: "MDR ಬ್ಯಾಂಕ್ ಶುಲ್ಕ",
    govtSubsidyPill: "100% ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ",

    // Recent Payments
    recentPaymentsTitle: "ಇತ್ತೀಚಿನ ಪಾವತಿಗಳು (Recent Payments)",
    filterAll: "ಎಲ್ಲಾ",
    filterSuccess: "ಯಶಸ್ವಿ",
    filterSettled: "ಸೆಟಲ್",
    creditedToBank: "ಖಾತೆಗೆ ಜಮೆಯಾಗಿದೆ",
    settlingTonight: "ಇಂದು ರಾತ್ರಿ ಜಮೆ",
    pending: "ಬಾಕಿ",
    noPaymentsFound: "ಯಾವುದೇ ವಹಿವಾಟುಗಳು ಕಂಡುಬಂದಿಲ್ಲ",

    // Voice Assistant
    askMunshiTitle: "ಮುನ್ಷಿ AI ಜೊತೆ ಮಾತನಾಡಿ (ಧ್ವನಿ ಸಹಾಯಕ)",
    askMunshiSub: "ಮೈಕ್ ಒತ್ತಿ ಮತ್ತು ಕನ್ನಡ, ಇಂಗ್ಲಿಷ್ ಅಥವಾ ಹಿಂದಿಯಲ್ಲಿ ಮಾತನಾಡಿ",
    chipTodayReceived: "\"ಇಂದು ನನಗೆ ಎಷ್ಟು ಹಣ ಬಂದಿದೆ?\"",
    chipWhenSettlement: "\"ನನ್ನ ಸೆಟಲ್‌ಮೆಂಟ್ ಯಾವಾಗ ಬರುತ್ತದೆ?\"",
    chipSoundboxWorking: "\"ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಕೆಲಸ ಮಾಡುತ್ತಿದೆಯೇ?\"",
    chipDid500Come: "\"₹500 ಪಾವತಿ ಬಂದಿದೆಯೇ?\"",
    inputPlaceholder: "ಇಲ್ಲಿ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮೈಕ್ ಒತ್ತಿ...",
    aiResponseLabel: "ಮುನ್ಷಿ AI ಉತ್ತರ:",
    listening: "ಕೇಳಿಸಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ...",
    voiceHowItWorks: "ನಿಮ್ಮ ದಿನನಿತ್ಯದ ಪಾವತಿಗಳು, ಸೆಟಲ್‌ಮೆಂಟ್‌ಗಳು, ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಅಥವಾ ಎಂಡಿಆರ್ ನಿಯಮಗಳ ಬಗ್ಗೆ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ.",
    voiceRetryHint: "ಧ್ವನಿಯನ್ನು ಗ್ರಹಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ.",
    voiceMicBlockedHint: "ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿಯನ್ನು ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಅನುಮತಿಸಿ.",
    voiceHeardLabel: "ಕೇಳಿದ್ದು:",
    voiceTapToSend: "ನಿಲ್ಲಿಸಲು ಮತ್ತು ಕಳುಹಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
    voiceTapToSpeak: "ಮಾತನಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
    voiceSourceLedger: "ಲೈವ್ ಖಾತೆ",
    voiceSourceMdr: "ಎಂಡಿಆರ್ ನೀತಿ",
    voiceSourceFallback: "ದೃಢೀಕೃತ ಬ್ಯಾಕಪ್",

    // Soundbox Telemetry
    soundboxStatusTitle: "ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಸ್ಥಿತಿ (SOUNDBOX 4.0)",
    soundboxModel: "Paytm Soundbox 4.0 4G",
    online: "ಆನ್‌ಲೈನ್",
    battery: "ಬ್ಯಾಟರಿ",
    audioTestBtn: "ಧ್ವನಿ ಪರೀಕ್ಷೆ",
    troubleshootBtn: "ಸಮಸ್ಯೆ ಪರಿಹಾರ",

    // Merchant Support
    supportTitle: "ಅಂಗಡಿಯವರ ಸಹಾಯ (SUPPORT)",
    fseName: "FSE ಅರುಣ್ ಶರ್ಮಾ (ನಿಮ್ಮ ಫೀಲ್ಡ್ ಅಧಿಕಾರಿ)",
    fseBeat: "ಕೋರಮಂಗಲ ಬೀಟ್ • 9123456780",
    callFseBtn: "ಕರೆ ಮಾಡಿ",
    helpTicketBtn: "ಸಹಾಯ ಟಿಕೆಟ್",

    // Mobile Bottom Navigation & Sidebar
    menuGetStarted: "ಪ್ರಾರಂಭಿಸಿ",
    menuDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    menuBusinessPayments: "ವ್ಯಾಪಾರ ಪಾವತಿಗಳು",
    menuAcceptPayments: "ಪಾವತಿ ಸ್ವೀಕರಿಸಿ",
    navHome: "ಮುಖಪುಟ",
    navPayments: "ಪಾವತಿಗಳು",
    navSettlement: "ಸೆಟಲ್‌ಮೆಂಟ್‌ಗಳು",
    navSoundbox: "ಸೌಂಡ್‌ಬಾಕ್ಸ್",
    navHelp: "ಸಹಾಯ / FSE",
    navDisputes: "ವಿವಾದಗಳು",
    navSplit: "ವಿಭಜಿತ ಸೆಟಲ್‌ಮೆಂಟ್",
    navVoice: "ಮುನ್ಷಿ ಜೊತೆ ಮಾತನಾಡಿ",
    navTransfers: "ಖಾತೆ ಮತ್ತು ವರ್ಗಾವಣೆ",
    navHistory: "ವಹಿವಾಟು ಇತಿಹಾಸ",
    navReports: "ವರದಿಗಳು",
    navAccept: "QR ಕೋಡ್ ತೋರಿಸಿ",
    dateToday: "ಇಂದು, 31 ಅಕ್ಟೋಬರ್",

    // Footer
    footerHackathon: "Paytm Build for India AI Hackathon",
    footerTrack: "Track 3: Autonomous AI Teammates",
    footerCompliance: "100% NPCI UDIR & RBI FREE-AI Compliant",

    // FSE Operations Console
    fseConsoleTitle: "FSE ಕಾರ್ಯಾಚರಣೆಗಳ ಕನ್ಸೋಲ್ (FSE Operations)",
    fseConsoleSub: "ವ್ಯಾಪಾರಿಗಳ ಭೇಟಿ, ವಿವಾದ ಪರಿಹಾರ, ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಸೇವೆ ಮತ್ತು ಸುರಕ್ಷಿತ ವರ್ಗಾವಣೆ ನಿರ್ವಹಣೆ.",
    handoverBtn: "ಪ್ರಿಯಾಗೆ ವರ್ಗಾಯಿಸಿ (Handover to Priya)",
    statAssignedMerchants: "ನಿಯೋಜಿತ ಅಂಗಡಿಗಳು (BEAT)",
    statActiveDisputes: "ಸಕ್ರಿಯ ವಿವಾದಗಳು (DISPUTES)",
    statNextVisit: "ಮುಂದಿನ ಭೇಟಿ (NEXT VISIT)",
    statSoundboxUptime: "ಸೌಂಡ್‌ಬಾಕ್ಸ್ 4G ಸಮಯ",
    allActivePill: "ಎಲ್ಲವೂ ಸಕ್ರಿಯ",
    underReviewPill: "ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ",
    connected100Pill: "100% ಸಿಗ್ನಲ್ ಕನೆಕ್ಟೆಡ್",
    assignedMerchantsTitle: "ನಿಯೋಜಿತ ವ್ಯಾಪಾರಿಗಳ ಪಟ್ಟಿ (ASSIGNED MERCHANTS)",
    activeCountBadge: "3 ಸಕ್ರಿಯ ಅಂಗಡಿಗಳು",
    viewProfile: "ಪ್ರೊಫೈಲ್ ನೋಡಿ →",
    lowBattery: "ಬ್ಯಾಟರಿ ಕಡಿಮೆ",
    activeDisputesTitle: "ಸಕ್ರಿಯ ವಿವಾದಗಳು (ACTIVE DISPUTES)",
    reviewRequiredBadge: "1 ಪರಿಶೀಲನೆ ಬಾಕಿ",
    uploadEvidenceBtn: "ಸಾಕ್ಷ್ಯ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    instantReversalBtn: "ತಕ್ಷಣ ಮರುಪಾವತಿ ನೀಡಿ",
    safeHandoffTitle: "ಸುರಕ್ಷಿತ FSE ವರ್ಗಾವಣೆ (SAFE FSE HANDOFF)",
    safeHandoffDesc: "ಸ್ಥಳ ಬದಲಾವಣೆ ಅಥವಾ ರಜೆಯ ಸಮಯದಲ್ಲಿ ನಿಮ್ಮ ಎಲ್ಲಾ 3 ವ್ಯಾಪಾರಿಗಳ ಸಂಪೂರ್ಣ ಇತಿಹಾಸ ಮತ್ತು ಬಾಕಿ ಬದ್ಧತೆಗಳನ್ನು FSE ಪ್ರಿಯಾ ನಾಯರ್ ಅವರಿಗೆ ವರ್ಗಾಯಿಸಿ.",
    recipientOfficer: "ಸ್ವೀಕರಿಸುವ ಅಧಿಕಾರಿ: FSE ಪ್ರಿಯಾ ನಾಯರ್ (ID: DEMO_FSE_PRIYA • 9123456789)",
    confirmHandoffBtn: "ವರ್ಗಾವಣೆ ದೃಢೀಕರಿಸಿ (Confirm Handoff)",
    memoryStreamTitle: "ವ್ಯಾಪಾರಿ ಮೆಮೊರಿ & ಭೇಟಿ ಟಿಪ್ಪಣಿಗಳು (MEMORY STREAM)",
    notePlaceholder: "ಭೇಟಿಯ ಹೊಸ ಟಿಪ್ಪಣಿ ಸೇರಿಸಿ (ಉದಾ. ಸೌಂಡ್‌ಬಾಕ್ಸ್ 4G ಸಿಮ್ ಪರೀಕ್ಷಿಸಲಾಗಿದೆ)...",
    saveNoteBtn: "ಟಿಪ್ಪಣಿ ಉಳಿಸಿ",

    // Judge / Engine View
    judgeTitle: "ಜಡ್ಜ್ ಮತ್ತು ಸಿಸ್ಟಮ್ ಆರ್ಕಿಟೆಕ್ಚರ್ ಕನ್ಸೋಲ್ (Judge / Engine)",
    judgeSub: "5 ಆಲ್-ಇನ್-ಒನ್ ಟ್ರಸ್ಟ್ ಸಿಗ್ನಲ್‌ಗಳು, ಔಟ್‌ಲೈನ್ಸ್ FSM ಶೀಲ್ಡ್, 3-ಹಂತದ ಕಾಗ್ನಿಷನ್ ಲ್ಯಾಡರ್.",
    nightlyDreamBtn: "ರಾತ್ರಿ ಡ್ರೀಮಿಂಗ್ ನಡೆಸಿ (Nightly Dream)",
    statSystemLoad: "ಸಿಸ್ಟಮ್ ಲೋಡ್ (SPS)",
    statCanaryZ: "ಕ್ಯಾನರಿ Z-ಸ್ಕೋರ್",
    statCostPerCall: "ಪ್ರತಿ ಕರೆಯ ಟೋಕನ್ ವೆಚ್ಚ",
    statAutonomyLevel: "ಸ್ವಾಯತ್ತತೆಯ ಮಟ್ಟ",
    fiveTrustSignalsTitle: "GOOGLE CLOUD OKF V0.2 ಟ್ರಸ್ಟ್ ಸಿಗ್ನಲ್‌ಗಳು",
    cragValidateBtn: "CRAG ದೃಢೀಕರಿಸಿ",
    activePolicyFile: "ಸಕ್ರಿಯ ನೀತಿ ಫೈಲ್: rbi_mdr_waiver_cap_2026.md",
    provenanceLabel: "1. ಮೂಲ (Provenance): Reserve Bank of India & NPCI",
    trustTierLabel: "2. ಟ್ರಸ್ಟ್ ಶ್ರೇಣಿ: tier-1-verified",
    freshnessLabel: "3. ತಾಜಾತನ (Freshness): 2026-10-15 ರವರೆಗೆ ಮಾನ್ಯ",
    lifecycleLabel: "4. ಜೀವಿತಾವಧಿ: STABLE",
    attestationLabel: "5. ಕ್ರಿಪ್ಟೋಗ್ರಾಫಿಕ್ SHA-256 ಹ್ಯಾಶ್:",
    cragConfidenceScore: "CRAG ವಿಶ್ವಾಸಾರ್ಹತೆ ಸ್ಕೋರ್: 99%",
    highConfidenceVerified: "✓ HIGH_CONFIDENCE_AUTHORITATIVE (ಪರಿಶೀಲಿಸಲಾಗಿದೆ)",
    fsmShieldTitle: "ಔಟ್‌ಲೈನ್ಸ್ ಲೆಕ್ಸಿಕಲ್ FSM ಶೀಲ್ಡ್ (ADVERSARIAL SHIELD)",
    fsmShieldSub: "ಪ್ರಾಮ್ಟ್ ಇಂಜೆಕ್ಷನ್ ಮತ್ತು ಅನಧಿಕೃತ ವಹಿವಾಟುಗಳಿಗೆ ಗಣಿತದ ತಡೆಗೋಡೆ",
    testPromptInjectionBtn: "ಪ್ರಾಮ್ಟ್ ಇಂಜೆಕ್ಷನ್ ಪರೀಕ್ಷಿಸಿ",
    ceecilLadderTitle: "CEECIL 3-ಹಂತದ ಕಾಗ್ನಿಷನ್ ಲ್ಯಾಡರ್",
    singleLoopOpev: "ಸಿಂಗಲ್-ಲೂಪ್ O-P-E-V",
    rung1Title: "ಹಂತ 1: ರಿಫ್ಲೆಕ್ಸ್ ದೃಢೀಕರಣ",
    rung1Desc: "0 LLM ಟೋಕನ್‌ಗಳು • 180ms ವಿಳಂಬ",
    rung1Accuracy: "100% ನಿಖರ",
    rung2Title: "ಹಂತ 2: ಪಾಲಿಸಿ ಆರ್ಬಿಟ್ರೇಜ್",
    rung2Desc: "~450 ಟೋಕನ್‌ಗಳು • CRAG ಮೌಲ್ಯಮಾಪನ",
    rung2Autonomy: "L2 ಸ್ವಾಯತ್ತತೆ",
    rung3Title: "ಹಂತ 3: VCG ಮೆಕ್ಯಾನಿಸಂ ವಿನ್ಯಾಸ",
    rung3Desc: "Flo Pro ಬಹು-ಪಕ್ಷ ಒಪ್ಪಂದ ಮೆನು",
    rung3Status: "ದೃಢೀಕರಿಸಲಾಗಿದೆ",
    walTitleBadge: "ರೈಟ್-ಅಹೆಡ್ ಲಾಗ್ (WAL) & ಆಡಿಟ್ ಟ್ರೇಲ್ಸ್",
    idempotencyGuaranteed: "ಐಡೆಂಪೊಟೆನ್ಸಿ ಗ್ಯಾರಂಟಿ",

    // Modals
    modalReceiveTitle: "ಆಲ್-ಇನ್-ಒನ್ ಪೇಟಿಎಂ ಕ್ಯೂಆರ್ ಕೋಡ್",
    modalScanPay: "ಯಾವುದೇ ಯುಪಿಐ ಆ್ಯಪ್‌ನಿಂದ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಪಾವತಿಸಿ",
    modalCustomAmount: "ಮೊತ್ತವನ್ನು ನಮೂದಿಸಿ ಅಥವಾ ಆಯ್ಕೆಮಾಡಿ:",
    modalSimulatePayment: "⚡ ಗ್ರಾಹಕರ ಯುಪಿಐ ಪಾವತಿ ಪರೀಕ್ಷಿಸಿ",
    modalClose: "ಮುಚ್ಚಿ",
    modalTxnDetailTitle: "ಡಿಜಿಟಲ್ ಪಾವತಿ ರಶೀದಿ",
    modalDigitalReceipt: "ಪೇಟಿಎಂ ಪರಿಶೀಲಿಸಿದ ಡಿಜಿಟಲ್ ರಶೀದಿ",
    modalBankRefRrn: "ಬ್ಯಾಂಕ್ ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ (RRN)",
    modalCustomerUpi: "ಗ್ರಾಹಕರ ಯುಪಿಐ ಐಡಿ",
    modalPaymentMode: "ಪಾವತಿ ವಿಧಾನ",
    modalTimestamp: "ಸಮಯ",
    modalMdrWaiver: "MDR ಶುಲ್ಕ ರಿಯಾಯಿತಿ (ಸಬ್ಸಿಡಿ)",
    modalSettlementStatus: "ಸೆಟಲ್‌ಮೆಂಟ್ ಸ್ಥಿತಿ",
    modalRaiseDispute: "UDIR ವಿವಾದ ದಾಖಲಿಸಿ",
    modalSettlementTitle: "ಬ್ಯಾಂಕ್ ಸೆಟಲ್‌ಮೆಂಟ್ ವಿವರಣೆ",
    modalTotalSettled: "ಬ್ಯಾಂಕ್‌ಗೆ ಒಟ್ಟು ಜಮೆಯಾದ ಮೊತ್ತ",
    modalLinkedBank: "ಲಿಂಕ್ ಮಾಡಿದ ಬ್ಯಾಂಕ್ ಖಾತೆ",
    modalPayoutSchedule: "ವಾಪಸಾತಿ ವೇಳಾಪಟ್ಟಿ",
    modalInstantPayoutBtn: "⚡ ತಕ್ಷಣ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆ ಮಾಡಿ",
    modalSoundboxTitle: "ಪೇಟಿಎಂ ಸೌಂಡ್‌ಬಾಕ್ಸ್ 4.0 ಸ್ಥಿತಿ",
    modalSoundboxImei: "IMEI ಸಂಖ್ಯೆ",
    modalFirmware: "ಫರ್ಮ್‌ವೇರ್ ಆವೃತ್ತಿ",
    modalSpeakerHealth: "ಸ್ಪೀಕರ್ ಸ್ಥಿತಿ",
    modalSignalStrength: "4G VoLTE ಸಿಗ್ನಲ್",
    modalPlayTestChime: "🔔 ಪಾವತಿ ಧ್ವನಿ ಪರೀಕ್ಷಿಸಿ",
    modalResetConnection: "🔄 4G ಸಂಪರ್ಕ ಮರುಹೊಂದಿಸಿ",
  },
};

export function getLangCode(lang?: string): LangCode {
  if (!lang) return "hi-IN";
  if (lang.startsWith("en")) return "en-IN";
  if (lang.startsWith("kn")) return "kn-IN";
  return "hi-IN";
}

export function getTranslation(lang?: string): TranslationDictionary {
  const code = getLangCode(lang);
  return I18N[code] || I18N["hi-IN"];
}
