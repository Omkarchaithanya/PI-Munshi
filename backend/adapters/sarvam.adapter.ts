import type { ISarvamAdapter, ProviderStatus } from "./provider.interface.ts";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export class SarvamAdapter implements ISarvamAdapter {
  private apiKey: string;
  private baseUrl = "https://api.sarvam.ai";

  constructor() {
    this.apiKey = process.env.SARVAM_API_KEY || "";
  }

  private liveKey(): string {
    const fromProcess = (process.env.SARVAM_API_KEY || this.apiKey || "").trim();
    if (fromProcess) return fromProcess;
    try {
      const raw = readFileSync(join(process.cwd(), ".env"), "utf8");
      const line = raw.split(/\r?\n/).find((row) => row.startsWith("SARVAM_API_KEY="));
      return (line?.slice("SARVAM_API_KEY=".length) || "").trim().replace(/^"|"$/g, "");
    } catch {
      return "";
    }
  }

  async transcribe(
    audioBuffer: Buffer | Uint8Array,
    languageCode = "hi-IN",
    mode: "LIVE" | "DEMO" = "DEMO",
    mimeType = "audio/wav"
  ) {
    const apiKey = this.liveKey();
    if (apiKey && audioBuffer.length > 0) {
      try {
        const formData = new FormData();
        const bytes = audioBuffer instanceof Uint8Array ? audioBuffer : new Uint8Array(audioBuffer);
        const blob = new Blob([bytes as unknown as BlobPart], { type: mimeType || "audio/wav" });
        const ext = mimeType.includes("webm") ? "webm" : mimeType.includes("mpeg") ? "mp3" : "wav";
        formData.append("file", blob, `audio.${ext}`);
        formData.append("language_code", languageCode === "en-IN" ? "en-IN" : languageCode);
        formData.append("model", "saaras:v3");

        const res = await fetch(`${this.baseUrl}/speech-to-text`, {
          method: "POST",
          headers: {
            "api-subscription-key": apiKey,
          },
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Sarvam STT HTTP ${res.status}: ${await res.text()}`);
        }

        const data = await res.json();
        return {
          transcript: (data.transcript || "").trim(),
          languageCode: data.language_code || languageCode,
          confidence: data.confidence || 0.95,
          isDemo: false,
        };
      } catch (err: any) {
        console.error("[Sarvam STT Live Error]:", err.message);
        return {
          transcript: "",
          languageCode,
          confidence: 0,
          isDemo: false,
          error: String(err.message || err).slice(0, 280),
        };
      }
    } else {
      return {
        transcript: '',
        languageCode,
        confidence: 0,
        isDemo: false,
        error: audioBuffer.length === 0 ? 'No audio captured' : 'Sarvam API key not configured',
      };
    }
  }

  async synthesize(
    text: string,
    languageCode = "hi-IN",
    mode: "LIVE" | "DEMO" = "DEMO"
  ) {
    const apiKey = this.liveKey();
    if (apiKey && text.trim()) {
      try {
        const res = await fetch(`${this.baseUrl}/text-to-speech`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-subscription-key": apiKey,
          },
          body: JSON.stringify({
            text,
            target_language_code: languageCode,
            speaker: "priya",
            pace: 1.0,
            model: "bulbul:v3",
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
        return { text, languageCode, isDemo: true, error: String(err.message || err).slice(0, 280) };
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
    const isConfigured = Boolean(this.liveKey().length > 5);
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
