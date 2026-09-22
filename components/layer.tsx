"use client";

import { useEffect, useState } from "react";

function useElapsed() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(
      () => setSeconds(Math.floor((Date.now() - start) / 1000)),
      1000,
    );
    return () => clearInterval(id);
  }, []);
  return seconds;
}

function formatTimecode(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600) % 24;
  const m = Math.floor(totalSeconds / 60) % 60;
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export default function Layer({ showRec = true }: { showRec?: boolean }) {
  const seconds = useElapsed();
  return (
    <>
      <div className="vignette" />
      <div className="scanlines" />
      <div className="tracking-glitch" />
      <div className="grain-overlay" />
      {showRec && (
        <div className="fixed top-3 right-3 small-touch:landscape:top-auto small-touch:landscape:bottom-3 z-[62] flex items-center gap-2 text-[11px] tracking-widest text-ink-dim pointer-events-none select-none">
          <span className="rec-dot inline-block h-1.5 w-1.5 rounded-full bg-blood-bright" />
          <span>REC</span>
          <span className="tabular-nums">{formatTimecode(seconds)}</span>
          <span className="opacity-60">CAM 09</span>
        </div>
      )}
    </>
  );
}
