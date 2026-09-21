"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/game/store";
import { houseAudio } from "@/game/audio";

export default function AmbientAudioEngine() {
  const audioEnabled = useGameStore((s) => s.audioEnabled);
  const volume = useGameStore((s) => s.volume);
  const distance = useGameStore((s) => s.entity.distance);
  const sanity = useGameStore((s) => s.sanity);
  const isHidden = useGameStore((s) => s.isHidden);
  const ending = useGameStore((s) => s.ending);
  const scaredRef = useRef(false);

  useEffect(() => {
    houseAudio.setVolume(audioEnabled ? volume : 0);
  }, [audioEnabled, volume]);

  useEffect(() => {
    const tension = Math.max(0, Math.min(1, (100 - distance) / 100));
    houseAudio.update({ tension, lowSanity: sanity < 40, hidden: isHidden });
  }, [distance, sanity, isHidden]);

  useEffect(() => {
    if (ending === "caught" && !scaredRef.current) {
      scaredRef.current = true;
      houseAudio.jumpscare();
    }
    if (!ending) {
      scaredRef.current = false;
    }
  }, [ending]);

  return null;
}
