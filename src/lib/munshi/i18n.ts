export type LangCode = "hi-IN" | "kn-IN" | "en-IN";

export type TranslationDictionary = {
  appName: string;
  brandTagline: string;
  liveSwitch: string;
  okfBadge: string;
  shopViewBtn: string;
  judgeViewBtn: string;

  // 4 Scenes
  scene1Title: string;
  scene1Hint: string;
  scene2Title: string;
  scene2Hint: string;
  scene3Title: string;
  scene3Hint: string;
  scene4Title: string;
  scene4Hint: string;

  // Shop Info
  shopkeeperLabel: string;
  fseRepLabel: string;
  okfVerifiedBadge: string;

  // Hero Card
  paymentCreditedPill: string;
  listenAloudBtn: string;
  soundboxHeader: string;
  utrLabel: string;
  orderIdLabel: string;
  settlementDoneLabel: string;

  // Real-Time Tester
  testRealValuesTitle: string;
  testRealValuesDesc: string;
  calculateBtn: string;
  waiverCheckboxLabel: string;

  // 4 Breakdown Cards
  card1Title: string;
  card1Subtitle: string;
  card2Title: string;
  card2SubtitleFree: string;
  card2SubtitleCharged: string;
  card3Title: string;
  card3SubtitleApplied: string;
  card3SubtitleNone: string;
  card4Title: string;
  card4Subtitle: string;

  // Human Gate
  humanGateTitle: string;
  humanGateQuestion: string;
  haanBtn: string;
  naBtn: string;
  disbursedSuccessTitle: string;
  disbursedSuccessDesc: string;

  // Live Ticker
  liveTickerTitle: string;

  // Engine View
  okfStoreTitle: string;
  okfStoreDesc: string;
  fiveTrustSignalsTitle: string;
  signal1Provenance: string;
  signal2TrustTier: string;
  signal3Freshness: string;
  signal4Lifecycle: string;
  signal5Attestation: string;
  runCragBtn: string;
  cragVerifiedTitle: string;

  fseCardTitle: string;
  fseDualKeyLabel: string;
  activeFseLabel: string;
  inheritedNotice: string;
  runDreamBtn: string;
  arunResignBtn: string;

  routerTitle: string;
  activeSkillLabel: string;
  codeModeTitle: string;
  codeModeSub: string;
  auditLogTitle: string;
  walTitle: string;
  canaryTitle: string;
  canaryDesc: string;
  shieldTitle: string;
  shieldDesc: string;
  testInjectionBtn: string;
};

export const I18N: Record<LangCode, TranslationDictionary> = {
  "hi-IN": {
    appName: "Pi Munshi",
    brandTagline: "पेटीएम स्वायत्त फ्रंटलाइन साथी · Google Cloud OKF v0.2 ट्रस्ट सिग्नल्स · साउंडबॉक्स वॉइस",
    liveSwitch: "लाइव बैंक स्विच",
    okfBadge: "OKF v0.2 मानक",
    shopViewBtn: "🏪 दुकान दृश्य (Shop View)",
    judgeViewBtn: "⚙️ OKF v0.2 व जज (Judge View)",

    scene1Title: "1 · बिल बचाव (POD)",
    scene1Hint: "11s स्वर-मुद्रा APOD",
    scene2Title: "2 · चेकआउट रक्षा (VCG)",
    scene2Hint: "Flo Pro मेनू + 'हाँ'",
    scene3Title: "3 · हमला रोकें (FSM)",
    scene3Hint: "Outlines शील्ड + RCA",
    scene4Title: "4 · रात्रि हिसाब व इस्तीफा",
    scene4Hint: "अरुण → नेहा हस्तांतरण",

    shopkeeperLabel: "दुकानदार:",
    fseRepLabel: "FSE प्रतिनिधि:",
    okfVerifiedBadge: "✓ OKF v0.2 प्रमाणित (Verified)",

    paymentCreditedPill: "कल का पेमेंट बैंक में आ गया!",
    listenAloudBtn: "🔊 बोलकर सुनें (आवाज़ में सुनें)",
    soundboxHeader: "🎙️ साउंडबॉक्स घोषणा (Soundbox Audio Outcome)",
    utrLabel: "UTR:",
    orderIdLabel: "ऑर्डर ID:",
    settlementDoneLabel: "T+1 ऑटो-सेटलमेंट पूरा",

    testRealValuesTitle: "⚡ रियल-टाइम बिल राशि जांचें (Test Real-Time Values)",
    testRealValuesDesc: "कोई भी असली राशि डालकर तुरंत असली MDR फीस, OKF v0.2 नियम और साउंडबॉक्स आवाज़ चेक करें",
    calculateBtn: "गणना करें",
    waiverCheckboxLabel: "दुकानदार छूट लागू करें (Apply OKF v0.2 Discretionary MDR Waiver ≤ ₹15)",

    card1Title: "1. कुल बिल राशि (Bill)",
    card1Subtitle: "ग्राहक द्वारा क्यूआर स्कैन",
    card2Title: "2. आरबीआई नियम MDR फीस (0.4%)",
    card2SubtitleFree: "₹2,000 तक 100% फ्री",
    card2SubtitleCharged: "₹2,000 से ऊपर 0.4% फीस (कैप ₹300)",
    card3Title: "3. मुंशी पॉलिसी छूट (Waiver)",
    card3SubtitleApplied: "✓ OKF v0.2 नियम के तहत माफ",
    card3SubtitleNone: "छूट लागू नहीं",
    card4Title: "4. खाते में नेट जमा (In Bank)",
    card4Subtitle: "बैंक UTR से पुष्टीकृत",

    humanGateTitle: "मानव सह-हस्ताक्षर आवश्यक (Level 2 Human Approval Required)",
    humanGateQuestion: "शर्मा जी, मंगलवार थोक व्यापारी के लिए ₹18,000 का 24-घंटे वाला ज़ीरो-फीस पेटीएम ब्रिज क्रेडिट चालू खाते में डालना है?",
    haanBtn: "👍 हाँ (Haan - मंजूर करें)",
    naBtn: "👎 ना (रद्द करें)",
    disbursedSuccessTitle: "₹18,000 चालू खाते में सफलतापूर्वक भेज दिए गए!",
    disbursedSuccessDesc: "मानव सह-हस्ताक्षर द्वारा स्वीकृत · Write-Ahead Log (WAL) में दर्ज · ऑटोनॉमी स्तर 3 में पदोन्नत",

    liveTickerTitle: "लाइव ट्रांजैक्शन फीड (Live Countertop Activity)",

    okfStoreTitle: "Google Cloud OKF v0.2 नॉलेज स्टोर",
    okfStoreDesc: "Google Cloud के खुले मानक पर आधारित। 5 ट्रस्ट सिग्नल्स के साथ गिट-वर्जन्ड मार्कडाउन।",
    fiveTrustSignalsTitle: "OKF v0.2 के पाँच ट्रस्ट सिग्नल्स (Five Trust Signals)",
    signal1Provenance: "1. उद्गम / Provenance (Sources):",
    signal2TrustTier: "2. विश्वसनीयता श्रेणी / Trust Tier:",
    signal3Freshness: "3. ताजगी / Freshness (Validity):",
    signal4Lifecycle: "4. जीवन चक्र / Lifecycle Status:",
    signal5Attestation: "5. सत्यापन / Attested Computation:",
    runCragBtn: "OKF v0.2 CRAG मूल्यांकन चलाएं",
    cragVerifiedTitle: "CRAG उद्धरण सत्यापित (Citation Verified)",

    fseCardTitle: "FSE एट्रिशन व टेरिटरी हस्तांतरण",
    fseDualKeyLabel: "दोहरी-कुंजी मेमोरी",
    activeFseLabel: "सक्रिय FSE:",
    inheritedNotice: "✓ अरुण की 12-दुकानों की टेरिटरी शून्य वादा नुकसान के साथ हस्तांतरित।",
    runDreamBtn: "🌙 रात्रि 11:30 हिसाब चलाएं",
    arunResignBtn: "🔄 अरुण का इस्तीफा (7 PM)",

    routerTitle: "लागत-आधारित 3-रंग कॉग्निशन रूटर",
    activeSkillLabel: "सक्रिय स्किल:",
    codeModeTitle: "Cloudflare Code Mode MCP (~980 टोकन)",
    codeModeSub: "पारंपरिक JSON टूल्स की तुलना में 99.3% टोकन बचत",
    auditLogTitle: "डिटरमिनिस्टिक बॉडी व एजेंट ऑडिट लॉग",
    walTitle: "Write-Ahead Log (WAL)",
    canaryTitle: "Netflix Data Canary",
    canaryDesc: "रिफंड वेलोसिटी पर नज़र रखता है। Z > 3.0σ होने पर 150s में लेवल 3 स्वतः रद्द।",
    shieldTitle: "Lethal Trifecta Shield (Outlines FSM)",
    shieldDesc: "अविश्वसनीय टेक्स्ट को वित्तीय टूल्स से अलग रखता है। सिर्फ टाइप किए गए एनम की अनुमति।",
    testInjectionBtn: "प्रॉम्प्ट इंजेक्शन हमला टेस्ट करें",
  },

  "kn-IN": {
    appName: "ಪೈ ಮುನ್ಷಿ (Pi Munshi)",
    brandTagline: "ಪೇಟಿಎಂ ಸ್ವಾಯತ್ತ ಫ್ರಂಟ್‌ಲೈನ್ ಒಡನಾಡಿ · Google Cloud OKF v0.2 ಟ್ರಸ್ಟ್ ಸಿಗ್ನಲ್‌ಗಳು · ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಧ್ವನಿ",
    liveSwitch: "ಲೈವ್ ಬ್ಯಾಂಕ್ ಸ್ವಿಚ್",
    okfBadge: "OKF v0.2 ಮಾನದಂಡ",
    shopViewBtn: "🏪 ಅಂಗಡಿ ವೀಕ್ಷಣೆ (Shop View)",
    judgeViewBtn: "⚙️ OKF v0.2 ಮತ್ತು ಜಡ್ಜ್ (Judge View)",

    scene1Title: "1 · ಬಿಲ್ ರಕ್ಷಣೆ (POD)",
    scene1Hint: "11s ಸ್ವರ-ಮುದ್ರಾ APOD",
    scene2Title: "2 · ಚೆಕ್‌ಔಟ್ ರಕ್ಷಣೆ (VCG)",
    scene2Hint: "Flo Pro ಮೆನು + 'ಹೌದು'",
    scene3Title: "3 · ದಾಳಿ ತಡೆಯಿರಿ (FSM)",
    scene3Hint: "Outlines ಶೀಲ್ಡ್ + RCA",
    scene4Title: "4 · ರಾತ್ರಿ ಲೆಕ್ಕ & ರಾಜೀನಾಮೆ",
    scene4Hint: "ಅರುಣ್ → ನೇಹಾ ವರ್ಗಾವಣೆ",

    shopkeeperLabel: "ಅಂಗಡಿಯವರು:",
    fseRepLabel: "FSE ಪ್ರತಿನಿಧಿ:",
    okfVerifiedBadge: "✓ OKF v0.2 ಪರಿಶೀಲಿಸಲಾಗಿದೆ (Verified)",

    paymentCreditedPill: "ನಿನ್ನೆಯ ಪಾವತಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆಯಾಗಿದೆ!",
    listenAloudBtn: "🔊 ಧ್ವನಿ ಕೇಳಿ (ಆಡಿಯೋದಲ್ಲಿ ಕೇಳಿ)",
    soundboxHeader: "🎙️ ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಧ್ವನಿ ಘೋಷಣೆ (Soundbox Audio)",
    utrLabel: "UTR:",
    orderIdLabel: "ಆರ್ಡರ್ ID:",
    settlementDoneLabel: "T+1 ಆಟೋ-ಸೆಟಲ್‌ಮೆಂಟ್ ಪೂರ್ಣಗೊಂಡಿದೆ",

    testRealValuesTitle: "⚡ ನೈಜ-ಸಮಯದ ಬಿಲ್ ಮೊತ್ತ ಪರೀಕ್ಷಿಸಿ (Real-Time Values)",
    testRealValuesDesc: "ಯಾವುದೇ ನಿಜವಾದ ಮೊತ್ತ ನಮೂದಿಸಿ ತಕ್ಷಣವೇ MDR ಶುಲ್ಕ, OKF v0.2 ನಿಯಮ ಮತ್ತು ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಧ್ವನಿ ಪರಿಶೀಲಿಸಿ",
    calculateBtn: "ಲೆಕ್ಕಾಚಾರ ಮಾಡಿ",
    waiverCheckboxLabel: "ಅಂಗಡಿಯವರಿಗೆ ಶುಲ್ಕ ಮನ್ನಾ ಅನ್ವಯಿಸಿ (OKF v0.2 MDR Waiver ≤ ₹15)",

    card1Title: "1. ಒಟ್ಟು ಬಿಲ್ ಮೊತ್ತ (Bill)",
    card1Subtitle: "ಗ್ರಾಹಕರಿಂದ ಕ್ಯೂಆರ್ ಸ್ಕ್ಯಾನ್",
    card2Title: "2. RBI ನಿಯಮ MDR ಶುಲ್ಕ (0.4%)",
    card2SubtitleFree: "₹2,000 ವರೆಗೆ 100% ಉಚಿತ",
    card2SubtitleCharged: "₹2,000 ಕ್ಕಿಂತ ಹೆಚ್ಚು 0.4% ಶುಲ್ಕ (ಗರಿಷ್ಠ ₹300)",
    card3Title: "3. ಮುನ್ಷಿ ರಿಯಾಯಿತಿ (Waiver)",
    card3SubtitleApplied: "✓ OKF v0.2 ನಿಯಮದಡಿ ಮನ್ನಾ ಮಾಡಲಾಗಿದೆ",
    card3SubtitleNone: "ರಿಯಾಯಿತಿ ಅನ್ವಯಿಸಿಲ್ಲ",
    card4Title: "4. ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ನಿವ್ವಳ ಜಮೆ (In Bank)",
    card4Subtitle: "ಬ್ಯಾಂಕ್ UTR ನಿಂದ ದೃಢೀಕರಿಸಲಾಗಿದೆ",

    humanGateTitle: "ಮಾನವ ಸಹ-ಸಹಿಯ ಅಗತ್ಯವಿದೆ (Level 2 Human Approval Required)",
    humanGateQuestion: "ಶರ್ಮಾ ಅವರೇ, ಮಂಗಳವಾರ ಸಗಟು ವ್ಯಾಪಾರಿಗೆ ಪಾವತಿಸಲು ₹18,000 ಮೊತ್ತದ 24-ಗಂಟೆಗಳ ಶೂನ್ಯ-ಶುಲ್ಕ ಬ್ರಿಡ್ಜ್ ಕ್ರೆಡಿಟ್ ಖಾತೆಗೆ ಜಮೆ ಮಾಡಬೇಕೇ?",
    haanBtn: "👍 ಹೌದು (Haan - ಅನುಮೋದಿಸಿ)",
    naBtn: "👎 ಇಲ್ಲ (ತಿರಸ್ಕರಿಸಿ)",
    disbursedSuccessTitle: "₹18,000 ಯಶಸ್ವಿಯಾಗಿ ಚಾಲ್ತಿ ಖಾತೆಗೆ ವರ್ಗಾಯಿಸಲಾಗಿದೆ!",
    disbursedSuccessDesc: "ಮಾನವ ಅನುಮೋದನೆಯೊಂದಿಗೆ ಜಮೆ · Write-Ahead Log ನಲ್ಲಿ ದಾಖಲು · ಹಂತ 3 ಸ್ವಾಯತ್ತತೆಗೆ ಬಡ್ತಿ",

    liveTickerTitle: "ಲೈವ್ ವಹಿವಾಟು ಫೀಡ್ (Live Activity)",

    okfStoreTitle: "Google Cloud OKF v0.2 ನಾಲೆಡ್ಜ್ ಸ್ಟೋರ್",
    okfStoreDesc: "Google Cloud ಮುಕ್ತ ಮಾನದಂಡ. 5 ಟ್ರಸ್ಟ್ ಸಿಗ್ನಲ್‌ಗಳೊಂದಿಗೆ ಗಿಟ್-ವರ್ಷನ್ ಮಾರ್ಕ್‌ಡೌನ್.",
    fiveTrustSignalsTitle: "OKF v0.2 ಐದು ಟ್ರಸ್ಟ್ ಸಿಗ್ನಲ್‌ಗಳು (Five Trust Signals)",
    signal1Provenance: "1. ಮೂಲ / Provenance (Sources):",
    signal2TrustTier: "2. ವಿಶ್ವಾಸಾರ್ಹತೆ / Trust Tier:",
    signal3Freshness: "3. ತಾಜಾತನ / Freshness (Validity):",
    signal4Lifecycle: "4. ಜೀವನ ಚಕ್ರ / Lifecycle Status:",
    signal5Attestation: "5. ದೃಢೀಕರಣ / Attested Computation:",
    runCragBtn: "OKF v0.2 CRAG ಮೌಲ್ಯಮಾಪನ ನಡೆಸಿ",
    cragVerifiedTitle: "CRAG ಉಲ್ಲೇಖ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",

    fseCardTitle: "FSE ರಾಜೀನಾಮೆ ಮತ್ತು ಜವಾಬ್ದಾರಿ ವರ್ಗಾವಣೆ",
    fseDualKeyLabel: "ಡ್ಯುಯಲ್-ಕೀ ಮೆಮೊರಿ",
    activeFseLabel: "ಸಕ್ರಿಯ FSE:",
    inheritedNotice: "✓ ಅರುಣ್ ಅವರ 12 ಅಂಗಡಿಗಳ ಜವಾಬ್ದಾರಿ ಯಾವುದೇ ಭರವಸೆ ಕಳೆದುಕೊಳ್ಳದೆ ವರ್ಗಾವಣೆಗೊಂಡಿದೆ.",
    runDreamBtn: "🌙 ರಾತ್ರಿ 11:30 ಲೆಕ್ಕಾಚಾರ ನಡೆಸಿ",
    arunResignBtn: "🔄 ಅರುಣ್ ರಾಜೀನಾಮೆ (7 PM)",

    routerTitle: "ವೆಚ್ಚ-ಆಧಾರಿತ 3-ಹಂತದ ಕಾಗ್ನಿಷನ್ ರೂಟರ್",
    activeSkillLabel: "ಸಕ್ರಿಯ ಸ್ಕಿಲ್:",
    codeModeTitle: "Cloudflare Code Mode MCP (~980 ಟೋಕನ್)",
    codeModeSub: "ಸಾಂಪ್ರದಾಯಿಕ JSON ಟೂಲ್ಸ್‌ಗಿಂತ 99.3% ಟೋಕನ್ ಕಡಿತ",
    auditLogTitle: "ಡಿಟರ್ಮಿನಿಸ್ಟಿಕ್ ಬಾಡಿ & ಆಡಿಟ್ ಲಾಗ್",
    walTitle: "Write-Ahead Log (WAL)",
    canaryTitle: "Netflix Data Canary",
    canaryDesc: "ಮರುಪಾವತಿ ವೇಗವನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡುತ್ತದೆ. Z > 3.0σ ಆದರೆ 150 ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಹಂತ 3 ರದ್ದು.",
    shieldTitle: "Lethal Trifecta Shield (Outlines FSM)",
    shieldDesc: "ಅನಧಿಕೃತ ಪಠ್ಯವನ್ನು ಹಣಕಾಸು ಟೂಲ್ಸ್‌ಗಳಿಂದ ಪ್ರತ್ಯೇಕಿಸುತ್ತದೆ.",
    testInjectionBtn: "ಪ್ರಾಮ್ಟ್ ಇಂಜೆಕ್ಷನ್ ಪರೀಕ್ಷಿಸಿ",
  },

  "en-IN": {
    appName: "Pi Munshi",
    brandTagline: "Paytm Autonomous Frontline Teammate · Google Cloud OKF v0.2 Trust Signals · Voice-First Soundbox",
    liveSwitch: "Live Bank Switch",
    okfBadge: "OKF v0.2 Standard",
    shopViewBtn: "🏪 Shopkeeper View",
    judgeViewBtn: "⚙️ OKF v0.2 & Judge View",

    scene1Title: "1 · Defend bill (POD)",
    scene1Hint: "11s Swar-Mudra APOD",
    scene2Title: "2 · Save checkout (VCG)",
    scene2Hint: "Flo Pro menu + Haan",
    scene3Title: "3 · Block attack (FSM)",
    scene3Hint: "Outlines shield + RCA",
    scene4Title: "4 · Nightly Dream & Resign",
    scene4Hint: "Arun → Neha handoff",

    shopkeeperLabel: "Merchant:",
    fseRepLabel: "FSE Representative:",
    okfVerifiedBadge: "✓ OKF v0.2 Verified",

    paymentCreditedPill: "Yesterday's Payment Credited in Bank!",
    listenAloudBtn: "🔊 Listen Outcome Aloud",
    soundboxHeader: "🎙️ Soundbox Audio Outcome",
    utrLabel: "UTR:",
    orderIdLabel: "Order ID:",
    settlementDoneLabel: "T+1 Auto-Settlement Completed",

    testRealValuesTitle: "⚡ Test Real-Time Values (Stop Fake Values)",
    testRealValuesDesc: "Enter any real bill amount to calculate live MDR fees, OKF v0.2 rules, and listen to the Soundbox audio in real time",
    calculateBtn: "Calculate",
    waiverCheckboxLabel: "Apply Retention Fee Waiver (OKF v0.2 Discretionary MDR Waiver ≤ ₹15)",

    card1Title: "1. Total Bill Amount",
    card1Subtitle: "Scanned via counter QR",
    card2Title: "2. RBI MDR Fee (0.4%)",
    card2SubtitleFree: "100% Free up to ₹2,000",
    card2SubtitleCharged: "0.40% fee on >₹2,000 (Cap ₹300)",
    card3Title: "3. Munshi Policy Waiver",
    card3SubtitleApplied: "✓ Waived under OKF v0.2 policy",
    card3SubtitleNone: "Waiver not applied",
    card4Title: "4. Net Credited to Bank",
    card4Subtitle: "Verified via bank UTR",

    humanGateTitle: "Level 2 Human Approval Required (Multi-Sig Gate)",
    humanGateQuestion: "Sharma ji, disburse ₹18,000 24-hour zero-fee Paytm bridge credit to current account for Tuesday wholesaler payout?",
    haanBtn: "👍 Haan (Approve Disbursal)",
    naBtn: "👎 Na (Reject)",
    disbursedSuccessTitle: "₹18,000 successfully disbursed to current account!",
    disbursedSuccessDesc: "Approved via human co-signature · Committed to Write-Ahead Log · Promoted to Level 3 Autonomy",

    liveTickerTitle: "Live Countertop Activity Feed",

    okfStoreTitle: "Google Cloud OKF v0.2 Knowledge Store",
    okfStoreDesc: "Standardized on Google Cloud vendor-neutral specification. Replaces opaque vector embeddings with Git-versioned Markdown & Five Opt-In Trust Signals.",
    fiveTrustSignalsTitle: "OKF v0.2 Five Opt-In Trust Signals",
    signal1Provenance: "1. Provenance (Sources & Lineage):",
    signal2TrustTier: "2. Trust Tier (Verification):",
    signal3Freshness: "3. Freshness (Validity Window):",
    signal4Lifecycle: "4. Lifecycle Status:",
    signal5Attestation: "5. Attestation / Attested Computation:",
    runCragBtn: "Run OKF v0.2 CRAG Evaluation",
    cragVerifiedTitle: "CRAG Statutory Citation Verified",

    fseCardTitle: "FSE Attrition & Territory Memory Handoff",
    fseDualKeyLabel: "Dual-Key Memory",
    activeFseLabel: "Active FSE:",
    inheritedNotice: "✓ Inherited Arun's 12-shop beat with zero promise or memory loss.",
    runDreamBtn: "🌙 Run 11:30 PM Dreaming",
    arunResignBtn: "🔄 Arun Resigned (7:00 PM)",

    routerTitle: "Cost-Tiered 3-Rung Cognition Router",
    activeSkillLabel: "Active Skill:",
    codeModeTitle: "Cloudflare Code Mode MCP (~980 Tokens)",
    codeModeSub: "99.3% token reduction compared to 150+ raw JSON tools",
    auditLogTitle: "Deterministic Body & Agent Audit Log",
    walTitle: "Write-Ahead Log (WAL)",
    canaryTitle: "Netflix Data Canary",
    canaryDesc: "Monitors refund velocity in Upstash Redis. Auto-revokes Level 3 within 150s if Z > 3.0σ.",
    shieldTitle: "Lethal Trifecta Shield (Outlines FSM)",
    shieldDesc: "Air-gaps untrusted text from financial tools. Emits strictly typed enums only.",
    testInjectionBtn: "Test Adversarial Injection",
  },
};

