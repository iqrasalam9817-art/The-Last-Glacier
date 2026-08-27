import { useEffect, useState } from "react";

export function ArchiveLoader() {
  const [progress, setProgress] = useState(4);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let raf = 0;
    let value = 4;
    const tick = () => {
      value += Math.max(0.4, (100 - value) * 0.035);
      setProgress(Math.min(100, value));
      if (value < 99.5) raf = requestAnimationFrame(tick);
      else setTimeout(() => setGone(true), 420);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (gone) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[70] flex flex-col items-center justify-center bg-abyss transition-opacity duration-700"
      style={{ opacity: progress > 99 ? 0 : 1 }}
      aria-hidden
    >
      <div className="relative h-12 w-12">
        <span className="absolute inset-0 rotate-45 border border-glacier/70 [animation:drift_3s_ease-in-out_infinite]" />
        <span className="absolute inset-2 rotate-45 border border-mint/50 [animation:shimmer_2.2s_ease-in-out_infinite]" />
      </div>
      <p className="mt-6 font-display text-xl text-frost">Preparing the archive…</p>
      <p className="mt-2 text-[11px] uppercase tracking-[0.32em] text-mist">
        {Math.round(progress)}%
      </p>
      <div className="mt-4 h-px w-40 bg-frost/15">
        <div className="h-full bg-glacier" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
