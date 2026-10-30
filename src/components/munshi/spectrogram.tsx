export function Spectrogram({ active, seed }: { active: boolean; seed: string }) {
  const bars = Array.from({ length: 36 }, (_, i) => {
    const nibble = Number.parseInt(seed[i % Math.max(seed.length, 1)] ?? "4", 16);
    const carrier = i > 25;
    const energy = carrier ? 36 + (Number.isFinite(nibble) ? nibble : 4) * 4 : 10 + (i % 4) * 4;
    return { energy, carrier, i };
  });

  return (
    <div className="flex h-16 items-end gap-0.5" aria-hidden="true">
      {bars.map((bar) => (
        <span
          key={bar.i}
          className={
            "min-w-0 flex-1 rounded-sm " +
            (bar.carrier && active ? "bg-cyan" : bar.carrier ? "bg-brass" : "bg-line") +
            (active && bar.carrier ? " animate-pulse" : "")
          }
          style={{ height: `${Math.min(bar.energy, 100)}%` }}
        />
      ))}
    </div>
  );
}
