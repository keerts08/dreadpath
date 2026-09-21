"use client";

import { TensionBand } from "@/game/entity";

function sanityLabel(sanity: number) {
  if (sanity > 75) return "STEADY";
  if (sanity > 50) return "UNEASY";
  if (sanity > 25) return "FRAYING";
  return "SLIPPING";
}

function presenceLabel(band: TensionBand) {
  switch (band) {
    case "far":
      return "QUIET";
    case "noticed":
      return "STIRRING";
    case "close":
      return "NEAR";
    case "veryClose":
      return "CLOSE";
    case "chase":
      return "HERE";
  }
}

export default function StatusHUD({
  sanity,
  band,
  isHidden,
  turn,
}: {
  sanity: number;
  band: TensionBand;
  isHidden: boolean;
  turn: number;
}) {
  const presence = presenceLabel(band);
  const presenceColor =
    band === "far"
      ? "bg-ink-faint"
      : band === "noticed"
        ? "bg-amber"
        : band === "close"
          ? "bg-amber"
          : "bg-blood-bright";

  return (
    <div className="border border-line bg-panel/60 px-3 py-2 text-[11px] tracking-widest text-ink-dim">
      <div className="flex items-center gap-2">
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full ${presenceColor} ${
            band === "chase" ? "rec-dot" : ""
          }`}
        />
        <span>
          PRESENCE: <span className="text-ink">{presence}</span>
        </span>
      </div>
      <div className="mt-2">
        CLARITY:{" "}
        <span className="text-ink">
          {isHidden ? "HIDDEN" : sanityLabel(sanity)}
        </span>
      </div>
      <div className="mt-2">
        TURN <span className="text-ink tabular-nums">{turn}</span>
      </div>
    </div>
  );
}
