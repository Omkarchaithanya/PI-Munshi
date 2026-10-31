function pickVoice(lang: string): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return undefined;
  const targetPrefix = lang.slice(0, 2).toLowerCase();
  return (
    voices.find((v) => v.lang.toLowerCase() === lang.toLowerCase()) ||
    voices.find((v) => v.lang.toLowerCase().startsWith(targetPrefix)) ||
    voices.find((v) => v.name.toLowerCase().includes("india") || v.name.toLowerCase().includes("hindi"))
  );
}

function speakUtterance(text: string, lang: string) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  const bestVoice = pickVoice(lang);
  if (bestVoice) utterance.voice = bestVoice;
  window.speechSynthesis.speak(utterance);
}

/** Warm up voices (Chrome loads them asynchronously). Call once on app mount. */
export function preloadSpeechVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

export function speak(text: string, lang: string = "hi-IN") {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        speakUtterance(text, lang);
      };
      window.speechSynthesis.getVoices();
      return;
    }
    speakUtterance(text, lang);
  } catch (err) {
    console.warn("Speech synthesis error:", err);
  }
}

function playBase64Audio(base64: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const isWav = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46;
      const blob = new Blob([bytes], { type: isWav ? "audio/wav" : "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Audio playback failed"));
      };
      void audio.play();
    } catch (e) {
      reject(e);
    }
  });
}

/** Browser TTS by default; Sarvam Bulbul when SARVAM_API_KEY is configured on the server. */
export async function speakMunshi(
  text: string,
  lang: string = "hi-IN",
): Promise<"sarvam" | "browser"> {
  if (typeof window === "undefined") return "browser";
  try {
    const res = await fetch("/api/v1/voice/synthesize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, languageCode: lang, mode: "DEMO" }),
    });
    if (res.ok) {
      const json = (await res.json()) as { data?: { audioBase64?: string; isDemo?: boolean } };
      if (json.data?.audioBase64 && json.data.isDemo === false) {
        await playBase64Audio(json.data.audioBase64);
        return "sarvam";
      }
    }
  } catch {
    /* fall through */
  }
  speak(text, lang);
  return "browser";
}

export function playSwarChirp(hex: string) {
  if (typeof window === "undefined") return;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;

  try {
    const ctx = new Ctx();
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.07, now + 0.03);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 1.25);
    master.connect(ctx.destination);

    // 18.5 kHz harmonic tone simulator
    const symbols = (hex || "9a7f3c1b82d4").slice(0, 12).split("");
    symbols.forEach((ch, i) => {
      const n = parseInt(ch, 16);
      const freq = 1200 + (Number.isFinite(n) ? n : 4) * 85;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      const start = now + i * 0.07;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.85, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.06);
      osc.connect(gain);
      gain.connect(master);
      osc.start(start);
      osc.stop(start + 0.07);
    });

    window.setTimeout(() => {
      void ctx.close();
    }, 1500);
  } catch (err) {
    console.warn("WebAudio chirp error:", err);
  }
}
