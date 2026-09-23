"use client";

export default function RotatePrompt() {
  return (
    <div className="fixed inset-0 z-[110] hidden small-touch:portrait:flex items-center justify-center bg-black/95 p-6 text-center">
      <div className="max-w-xs space-y-4">
        <svg
          viewBox="0 0 24 24"
          className="mx-auto h-12 w-12 text-ink-dim"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          aria-hidden
        >
          <rect x="7" y="2" width="10" height="16" rx="1.5" />
          <path d="M12 21 A6 6 0 0 0 17.5 17.5" strokeLinecap="round" />
          <path
            d="M17.5 13.5 L17.5 17.5 L13.5 17.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="font-display text-base tracking-widest text-bone">
          TURN YOUR PHONE
        </p>
        <p className="text-sm text-ink-dim">
          The house is easier to see sideways. Rotate to landscape to keep
          going.
        </p>
      </div>
    </div>
  );
}
