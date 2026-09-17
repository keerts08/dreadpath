"use client";

import { ExitDef, HotspotDef, RoomDef } from "@/game/types";

function exitVisible(e: ExitDef, flags: Record<string, boolean>) {
  if (e.requiresFlag && !flags[e.requiresFlag] && !e.lockedText) return false;
  return true;
}

function hotspotVisible(h: HotspotDef, flags: Record<string, boolean>) {
  if (h.requiresFlag && !flags[h.requiresFlag] && !h.lockedText) return false;
  return true;
}

export default function ChoicePanel({
  room,
  flags,
  isHidden,
  hasHideSpot,
  onMove,
  onInteract,
  onHide,
  onStopHiding,
  onWait,
}: {
  room: RoomDef;
  flags: Record<string, boolean>;
  isHidden: boolean;
  hasHideSpot: boolean;
  onMove: (exit: ExitDef) => void;
  onInteract: (hotspot: HotspotDef) => void;
  onHide: () => void;
  onStopHiding: () => void;
  onWait: () => void;
}) {
  if (isHidden) {
    return (
      <div className="border border-line bg-panel/60 p-3 space-y-2">
        <p className="text-[11px] tracking-widest text-ink-faint mb-1">
          HOLDING STILL
        </p>
        <button
          onClick={onWait}
          className="w-full text-left border border-line px-3 py-2 text-sm hover:border-amber hover:text-amber transition-colors"
        >
          Stay hidden and wait
        </button>
        <button
          onClick={onStopHiding}
          className="w-full text-left border border-line px-3 py-2 text-sm hover:border-amber hover:text-amber transition-colors"
        >
          Come out of hiding
        </button>
      </div>
    );
  }
  const visibleHotspots = room.hotspots.filter((h) => hotspotVisible(h, flags));
  const visibleExits = room.exits.filter((e) => exitVisible(e, flags));

  return (
    <div className="border border-line bg-panel/60 p-3 space-y-3">
      {visibleHotspots.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] tracking-widest text-ink-faint">
            LOOK AROUND
          </p>
          {visibleHotspots.map((h) => (
            <button
              key={h.id}
              onClick={() => onInteract(h)}
              className="block w-full text-left border border-line px-3 py-2 text-sm hover:border-amber hover:text-amber transition-colors"
            >
              {/**need to better svg */}
              {h.name}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-1.5">
        <p className="text-[11px] tracking-widest text-ink-faint">MOVE</p>
        {visibleExits.map((e, i) => (
          <button
            key={`${e.to}-${i}`}
            onClick={() => onMove(e)}
            className="block w-full text-left border border-line px-3 py-2 text-sm hover:border-amber hover:text-amber transition-colors"
          >
            {e.label}
          </button>
        ))}
        {hasHideSpot && (
          <button
            onClick={onHide}
            className="block w-full text-left border border-line px-3 py-2 text-sm hover:border-sick hover:text-sick transition-colors"
          >
            Hide
          </button>
        )}

        <button
          onClick={onWait}
          className="block w-full text-left border border-line px-3 py-2 text-sm text-ink-dim hover:border-ink-dim hover:text-ink transition-colors"
        >
          Wait and listen
        </button>
      </div>
    </div>
  );
}
