"use client";

import { useEffect } from "react";
import { useGameStore } from "@/game/store";
import { houseAudio } from "@/game/audio";

export default function AmbientAudioEngine() {
  const audioEnabled = useGameStore((s) => s.audioEnabled);
  const volume = useGameStore((s) => s.volume);

  useEffect(() => {
    houseAudio.applySettings(audioEnabled, volume);
  }, [audioEnabled, volume]);

  return null
}
