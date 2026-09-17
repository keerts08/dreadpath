"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "./store";

export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(
    useGameStore.persist?.hasHydrated() ?? false,
  );

  useEffect(() => {
    if (useGameStore.persist?.hasHydrated()) {
      setHydrated(true);
      return;
    }
    const unsub = useGameStore.persist?.onFinishHydration(() =>
      setHydrated(true),
    );
    return unsub;
  }, []);

  return hydrated;
}

export function hasSaveGame(): boolean {
    if (typeof window === "undefined") return false;
    try {
        const raw = window.localStorage.getItem("ravenshade-manor-save");
        if (!raw) return false;
        const parsed = JSON.parse(raw);
        return !!parsed?.state?.started;
    } catch {
        return false
    }
}