export function speak(text: string, lang: string = "hi-IN") {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      // Find exact or prefix match for language
      const targetPrefix = lang.slice(0, 2).toLowerCase();
      const bestVoice =
        voices.find((v) => v.lang.toLowerCase() === lang.toLowerCase()) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(targetPrefix)) ||
        voices.find((v) => v.name.toLowerCase().includes("india") || v.name.toLowerCase().includes("hindi"));
      if (bestVoice) {
        utterance.voice = bestVoice;
      }
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn("Speech synthesis error:", err);
  }
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
