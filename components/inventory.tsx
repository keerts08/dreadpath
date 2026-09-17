"use client";

import { ItemId } from "@/game/types";
import { ITEM_DESCRIPTIONS, ITEM_NAMES } from "@/game/world";
import { useState } from "react";

export default function Inventory({ items }: { items: ItemId[] }) {
  const [active, setActive] = useState<ItemId | null>(null);

  if (items.length === 0) {
    return (
      <div className="border border-line bg-panel/60 p-3">
        <p className="text-[11px] tracking-widest text-ink-faint">
          POCKETS - EMPTY
        </p>
      </div>
    );
  }

  return (
    <div className="border border-line bg-panel/60 p-3">
      <p className="text-[11px] tracking-widest text-ink-faint mb-2">POCKETS</p>
      <div className="flex flex-wrap gap-2">
        {items.map((id) => (
          <button
            key={id}
            onClick={() => setActive(active === id ? null : id)}
            className={`border px-2 py-1 text-xs transition-colors ${active === id ? "border-amber text-amber" : "border-line text-ink-dim hover:border-ink-dim hover:text-ink"}`}
          >
            {ITEM_NAMES[id]}
          </button>
        ))}
      </div>
      {active && (
        <p className="mt-2 text-sm text-ink-dim italic">
          {ITEM_DESCRIPTIONS[active]}
        </p>
      )}
    </div>
  );
}
