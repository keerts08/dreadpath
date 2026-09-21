"use client";

import { useEffect, useState } from "react";

const DURATION_MS = 1100;

function ScreamerFace() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="jumpscare-punch h-[110vh] w-[110vw] max-w-none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <radialGradient id="screamerGlow" cx="48%" cy="40%" r="72%">
          <stop offset="0%" stopColor="#f2ece7" />
          <stop offset="50%" stopColor="#5f5658" />
          <stop offset="100%" stopColor="#020202" />
        </radialGradient>

        <filter id="screamerWarp" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.012 0.04"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="9"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      <rect width="200" height="200" fill="#020202" />
      <g filter="url(#screamerWarp)">
        <ellipse cx="100" cy="106" rx="74" ry="94" fill="url(#screamerGlow)" />
        <ellipse cx="68" cy="90" rx="16" ry="22" fill="#020202" />
        <ellipse cx="133" cy="94" rx="12" ry="17" fill="#020202" />
        <circle cx="68" cy="90" r="4.5" fill="var(--blood-bright)" />
        <circle cx="133" cy="94" r="3.2" fill="var(--blood-bright)" />
        {[0, 1, 2].map((i) => (
          <path
            key={`vl${i}`}
            d={`M${52 + i * 6} ${82 + i * 4} Q${62 + i * 4} ${88} ${68} ${90}`}
            stroke="var(--blood-bright)"
            strokeWidth="0.6"
            fill="none"
            opacity="0.7"
          />
        ))}
        {[0, 1, 2].map((i) => (
          <path
            key={`vr${i}`}
            d={`M${150 - i * 5} ${86 + i * 4} Q${140 - i * 3} ${90} ${133} ${94}`}
            stroke="var(--blood-bright)"
            strokeWidth="0.6"
            fill="none"
            opacity="0.7"
          />
        ))}
        <path
          d="M56 152 Q100 200 144 152 Q120 178 100 176 Q80 178 56 152 Z"
          fill="#020202"
        />
        {Array.from({ length: 11 }).map((_, i) => (
          <rect
            key={i}
            x={62 + i * 6.8}
            y="150"
            width="4.2"
            height="18"
            fill="#efe8e4"
          />
        ))}
      </g>
    </svg>
  );
}

export default function JumpscareOverlay({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.classList.add("shake");
    const shakeId = setTimeout(() => document.body.classList.remove("shake"), 500);
    const id = setTimeout(() => {
      setVisible(false);
      onDone();
    }, DURATION_MS);
    return () => {
      clearTimeout(id);
      clearTimeout(shakeId);
      document.body.classList.remove("shake");
    };
  }, [onDone]);

  if (!visible) return null;

  return (
    <div className="jumpscare-overlay">
      <div className="jumpscare-static" />
      <ScreamerFace />
    </div>
  );
}