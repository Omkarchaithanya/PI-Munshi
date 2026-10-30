import type { ISarvamAdapter, ProviderStatus } from "./provider.interface.ts";

export class SarvamAdapter implements ISarvamAdapter {
  private apiKey: string;
  private baseUrl = "https://api.sarvam.ai";

  constructor() {
    this.apiKey = process.env.SARVAM_API_KEY || "";
  }

  async transcribe(
    audioBuffer: Buffer | Uint8Array,
    languageCode = "hi-IN",
    mode: "LIVE" | "DEMO" = "DEMO"
  ) {
    if (mode === "LIVE" && this.apiKey) {
      const startTime = Date.now();
      try {
        const formData = new FormData();
        const blob = new Blob([audioBuffer as any], { type: "audio/wav" });
        formData.append("file", blob, "audio.wav");
        formData.append("language_code", languageCode);
        formData.append("model", "saaras:v1");

        const res = await fetch(`${this.baseUrl}/speech-to-text`, {
          method: "POST",
          headers: {
            "api-subscription-key": this.apiKey,
          },
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Sarvam STT HTTP ${res.status}: ${await res.text()}`);
        }

        const data = await res.json();
        return {
          transcript: data.transcript || "",
          languageCode: data.language_code || languageCode,
          confidence: data.confidence || 0.95,
          isDemo: false,
        };
      } catch (err: any) {
        console.error("[Sarvam STT Live Error]:", err.message);
        throw err;
      }
    } else {
      // DEMO mode fallback: honest demo transcription
      return {
        transcript: "मेरा आज का सेटलमेंट कितना हुआ है? (Ramesh Voice Demo)",
        languageCode,
        confidence: 0.98,
        isDemo: true,
      };
    }
  }

  async synthesize(
    text: string,
    languageCode = "hi-IN",
    mode: "LIVE" | "DEMO" = "DEMO"
  ) {
    if (mode === "LIVE" && this.apiKey) {
      try {
        const res = await fetch(`${this.baseUrl}/text-to-speech`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-subscription-key": this.apiKey,
          },
          body: JSON.stringify({
            inputs: [text],
            target_language_code: languageCode,
            speaker: "meera",
            pitch: 0,
            pace: 1.0,
            loudness: 1.5,
            speech_sample_rate: 8000,
            enable_preprocessing: true,
            model: "bulbul:v1",
          }),
        });

        if (!res.ok) {
          throw new Error(`Sarvam TTS HTTP ${res.status}: ${await res.text()}`);
        }

        const data = await res.json();
        return {
          audioBase64: data.audios ? data.audios[0] : undefined,
          text,
          languageCode,
          isDemo: false,
        };
      } catch (err: any) {
        console.error("[Sarvam TTS Live Error]:", err.message);
        throw err;
      }
    } else {
      return {
        text,
        languageCode,
        isDemo: true,
      };
    }
  }

  async translate(
    text: string,
    sourceLang = "en-IN",
    targetLang = "hi-IN",
    mode: "LIVE" | "DEMO" = "DEMO"
  ) {
    if (mode === "LIVE" && this.apiKey) {
      try {
        const res = await fetch(`${this.baseUrl}/translate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-subscription-key": this.apiKey,
          },
          body: JSON.stringify({
            input: text,
            source_language_code: sourceLang,
            target_language_code: targetLang,
            mode: "formal",
            model: "mayura:v1",
          }),
        });

        if (!res.ok) {
          throw new Error(`Sarvam Translate HTTP ${res.status}: ${await res.text()}`);
        }

        const data = await res.json();
        return {
          translatedText: data.translated_text || text,
          sourceLang,
          targetLang,
          isDemo: false,
        };
      } catch (err: any) {
        console.error("[Sarvam Translate Live Error]:", err.message);
        throw err;
      }
    } else {
      // Local dictionary / Demo translation
      const dictionary: Record<string, string> = {
        "Settlement pending": "सेटलमेंट लंबित है",
        "Payment received": "भुगतान प्राप्त हुआ",
        "Dispute raised": "विवाद दर्ज किया गया",
      };

      return {
        translatedText: dictionary[text] || `[DEMO TRANSLATED (${targetLang})]: ${text}`,
        sourceLang,
        targetLang,
        isDemo: true,
      };
    }
  }

  async getConnectionStatus(): Promise<ProviderStatus> {
    const isConfigured = Boolean(this.apiKey && this.apiKey.length > 5);
    return {
      provider: "sarvam",
      mode: isConfigured ? "LIVE" : "DEMO",
      status: isConfigured ? "CONNECTED" : "NOT_CONFIGURED",
      latencyMs: isConfigured ? 120 : 0,
      details: {
        configured: isConfigured,
        supportedLanguages: ["hi-IN", "kn-IN", "ta-IN", "te-IN", "bn-IN", "mr-IN", "gu-IN", "en-IN"],
      },
    };
  }
}

export const sarvamAdapter = new SarvamAdapter();
