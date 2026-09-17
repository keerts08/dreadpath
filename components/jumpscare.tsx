"use client";

import { useEffect, useState } from "react";

export default function Jumpscare({ onDone }: { onDone: () => void }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const id = setTimeout(() => {
            setVisible(false);
            onDone();
        }, 9000);
        return () => clearTimeout(id); 
    }, [onDone]);

    if (!visible) return null;

    return (
      <div className="jumpscare-flash fixed inset-0 z-[100] bg-black flex items-center justify-center">
        <svg
          viewBox="0 0 300 400"
          className="jumpscare-figure h-[70vh] w-auto"
          aria-hidden
        >
          <defs>
            <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff3b3b" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ff3b3b" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d="M150 20
             C 175 20 188 55 185 90
             C 210 110 220 170 205 230
             C 230 260 235 340 220 390
             L 195 390 L 190 300
             L 150 380 L 110 300
             L 105 390 L 80 390
             C 65 340 70 260 95 230
             C 80 170 90 110 115 90
             C 112 55 125 20 150 20 Z"
            fill="#050505"
            stroke="#000"
          />
          <circle cx="132" cy="95" r="20" fill="url(#eyeGlow)" />
          <circle cx="168" cy="95" r="20" fill="url(#eyeGlow)" />
          <ellipse cx="132" cy="95" rx="5" ry="8" fill="#fff" />
          <ellipse cx="168" cy="95" rx="5" ry="8" fill="#fff" />
        </svg>
      </div>
    );
}