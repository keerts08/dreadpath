"use client";

import { useSyncExternalStore } from "react";
import { useGameStore } from "./store";

function subscribe(callback: () => void) {
  const unsub = useGameStore.persist?.onFinishHydration(callback);
  return () => unsub?.();
}

function getSnapshot() {
  return useGameStore.persist?.hasHydrated() ?? false;
}

function getServerSnapshot() {
  return false;
}

export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function hasSaveGame(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem("ravenshade-manor-save");
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return !!parsed?.state?.started;
  } catch {
    return false;
  }
}
