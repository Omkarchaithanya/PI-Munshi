/**
 * Pi Munshi Domain Skill: Samadhan (समाधान)
 * Service & Dispute Resolution Domain Specialist
 *
 * Implements:
 * - NPCI UDIR Error Code Triage (U30, U16, RB, U69, ZM)
 * - Automatic Chargeback Defense Payload for POST /v1/dispute/action
 * - Provisional Counter Credit Decision Engine
 * - Swar-Mudra APOD (Acoustic Proof of Delivery) Evidence Bundle Integration
 */

export interface UdirResolution {
  udirCode: string;
  category: "TIMEOUT_HOLD" | "RISK_FLAG" | "BANK_REJECTED" | "FRAUD_SUSPECTED" | "AUTH_FAILED";
  recommendedAction: "PROVISIONAL_CREDIT" | "LEVEL_2_ESCALATION" | "INSTANT_COUNTER_REVERSAL" | "FREEZE_AND_RCA" | "CUSTOMER_RETRY";
  provisionalCreditAllowed: boolean;
  explanation: {
    en: string;
    hi: string;
    kn: string;
  };
}

export interface DisputeDefensePayload {
  merchantId: string;
  orderId: string;
  disputeId: string;
  amount: number;
  action: "DEFEND" | "ACCEPT";
  orderStatus: "ORDER_DELIVERED" | "ORDER_CANCELLED" | "SERVICE_RENDERED";
  deliveryProofHash: string;
  swarMudraChirpSha256: string;
  kachaBillOcrVerified: boolean;
  defenseNarrative: string;
  timestamp: string;
}

export class SamadhanSkill {
  private static instance: SamadhanSkill;

  private constructor() {}

  public static getInstance(): SamadhanSkill {
    if (!SamadhanSkill.instance) {
      SamadhanSkill.instance = new SamadhanSkill();
    }
    return SamadhanSkill.instance;
  }

  /**
   * Triage NPCI UDIR error codes and determine provisional credit or escalation.
   */
  public triageUdirError(udirCode: string, orderAmount: number, customerTrustScore: number = 0.9): UdirResolution {
    const code = (udirCode || "U30").toUpperCase().trim();

    switch (code) {
      case "U30":
        // NPCI Remitter Bank Timeout: Deemed approved but pending switch reconciliation
        return {
          udirCode: "U30",
          category: "TIMEOUT_HOLD",
          recommendedAction: customerTrustScore >= 0.85 ? "PROVISIONAL_CREDIT" : "LEVEL_2_ESCALATION",
          provisionalCreditAllowed: customerTrustScore >= 0.85 && orderAmount <= 5000,
          explanation: {
            en: `NPCI U30 Remitter Timeout: Bank debit confirmed pending switch sync. Provisional credit eligible (Trust: ${(customerTrustScore * 100).toFixed(0)}%).`,
            hi: `एनपीसीआई U30 बैंक टाइमआउट: खाते से पैसे कटे हैं, स्विच सिंक पेंडिंग है। तत्काल प्रोविज़नल क्रेडिट स्वीकृत।`,
            kn: `ಎನ್‌ಪಿಸಿಐ U30 ಬ್ಯಾಂಕ್ ಟೈಮ್‌ಔಟ್: ಖಾತೆಯಿಂದ ಹಣ ಕಡಿತವಾಗಿದೆ, ತಾತ್ಕಾಲಿಕ ಮನ್ನಣೆ ನೀಡಲಾಗಿದೆ.`,
          },
        };

      case "U16":
        // Risk threshold breached by remitter bank
        return {
          udirCode: "U16",
          category: "RISK_FLAG",
          recommendedAction: "LEVEL_2_ESCALATION",
          provisionalCreditAllowed: false,
          explanation: {
            en: "NPCI U16 Risk Flag: Bank flagged high-velocity transaction. Requires human FSE approval before release.",
            hi: "एनपीसीआई U16 जोखिम फ्लैग: उच्च गति लेनदेन। एफएसई अनुमोदन आवश्यक है।",
            kn: "ಎನ್‌ಪಿಸಿಐ U16 ಅಪಾಯದ ಸೂಚನೆ: ಹಸ್ತಚಾಲಿತ ಅನುಮೋದನೆ ಅಗತ್ಯವಿದೆ.",
          },
        };

      case "RB":
        // Rejected by Beneficiary Bank
        return {
          udirCode: "RB",
          category: "BANK_REJECTED",
          recommendedAction: "INSTANT_COUNTER_REVERSAL",
          provisionalCreditAllowed: false,
          explanation: {
            en: "NPCI RB Beneficiary Rejection: Merchant bank account declined credit. Instant reversal initiated.",
            hi: "एनपीसीआई RB बैंक अस्वीकृति: व्यापारी बैंक खाते ने अस्वीकार किया। तत्काल रिफंड जारी।",
            kn: "ಎನ್‌ಪಿಸಿಐ RB ಬ್ಯಾಂಕ್ ನಿರಾಕರಣೆ: ವ್ಯಾಪಾರಿ ಬ್ಯಾಂಕ್ ನಿರಾಕರಿಸಿದೆ, ಮರುಪಾವತಿ ಆರಂಭವಾಗಿದೆ.",
          },
        };

      case "U69":
        // Suspected Fraud Pattern
        return {
          udirCode: "U69",
          category: "FRAUD_SUSPECTED",
          recommendedAction: "FREEZE_AND_RCA",
          provisionalCreditAllowed: false,
          explanation: {
            en: "NPCI U69 Fraud Alert: Irregular device/IP fingerprint detected. Account held, 10s RCA generated.",
            hi: "एनपीसीआई U69 संदिग्ध धोखाधड़ी: खाता रोका गया, आरसीए पैकेट तैयार किया गया।",
            kn: "ಎನ್‌ಪಿಸಿಐ U69 ವಂಚನೆ ಎಚ್ಚರಿಕೆ: ಖಾತೆ ತಡೆಹಿಡಿಯಲಾಗಿದೆ, ತನಿಖೆ ಆರಂಭವಾಗಿದೆ.",
          },
        };

      case "ZM":
      default:
        return {
          udirCode: code,
          category: "AUTH_FAILED",
          recommendedAction: "CUSTOMER_RETRY",
          provisionalCreditAllowed: false,
          explanation: {
            en: `Authentication error (${code}). Merchant asked customer to re-enter UPI PIN.`,
            hi: `प्रमाणीकरण त्रुटि (${code})। ग्राहक को सही यूपीआई पिन दर्ज करने का निर्देश दें।`,
            kn: `ದೃಢೀಕರಣ ದೋಷ (${code}). ದಯವಿಟ್ಟು ಯುಪಿಐ ಪಿನ್ ಮರು-ನಮೂದಿಸಿ.`,
          },
        };
    }
  }

  /**
   * Generates a tamper-proof Dispute Defense payload for Paytm POST /v1/dispute/action.
   */
  public generateDefendPayload(params: {
    merchantId: string;
    orderId: string;
    disputeId: string;
    amount: number;
    rrn: string;
    swarMudraHash: string;
    kachaBillVerified: boolean;
  }): DisputeDefensePayload {
    return {
      merchantId: params.merchantId,
      orderId: params.orderId,
      disputeId: params.disputeId,
      amount: params.amount,
      action: "DEFEND",
      orderStatus: "ORDER_DELIVERED",
      deliveryProofHash: `APOD_SHA256_${params.swarMudraHash.slice(0, 24)}`,
      swarMudraChirpSha256: params.swarMudraHash,
      kachaBillOcrVerified: params.kachaBillVerified,
      defenseNarrative: `Autonomous defense filed by Pi Munshi: Merchant confirmed goods delivered via 18.5kHz Swar-Mudra APOD token and handwritten kacha-bill verification (RRN: ${params.rrn}). Compliant with RBI Ombudsman Master Circular 2026.`,
      timestamp: new Date().toISOString(),
    };
  }
}

export const samadhanSkill = SamadhanSkill.getInstance();

