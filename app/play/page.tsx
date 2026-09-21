"use client";

import { LAYOUTS } from "@/game/layouts";
import { useGameStore } from "@/game/store";
import { useHydrated } from "@/game/useHydrated";
import { ROOMS } from "@/game/world";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Layer from "@/components/layer";
import JumpscareOverlay from "@/components/jumpscare";
import EndingScreen from "@/components/ending-screen";
import CorruptionWrapper from "@/components/corruption-wrapper";
import { tensionBand } from "@/game/entity";
import MapPanel from "@/components/map-panel";
import StatusHUD from "@/components/status-hud";
import RoomCanvas from "@/components/room-canvas";
import Inventory from "@/components/inventory";
import { ExitDef, HotspotDef, Vec2 } from "@/game/types";
import ActionLog from "@/components/action-log";
import AmbientAudioEngine from "@/components/audio-engine";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";

const AMBIENT_TICK_MS = 4200;

export default function GameShell() {
  const hydrated = useHydrated();
  const router = useRouter();
  const [scareShown, setScareShown] = useState(false);
  const [doorSpawn, setDoorSpawn] = useState<Vec2 | null>(null);
  const [paused, setPaused] = useState(false);

  const started = useGameStore((s) => s.started);
  const ending = useGameStore((s) => s.ending);
  const turn = useGameStore((s) => s.turn);
  const currentRoom = useGameStore((s) => s.currentRoom);
  const visitedRooms = useGameStore((s) => s.visitedRooms);
  const inventory = useGameStore((s) => s.inventory);
  const flags = useGameStore((s) => s.flags);
  const resolvedHotspots = useGameStore((s) => s.resolvedHotspots);
  const sanity = useGameStore((s) => s.sanity);
  const entity = useGameStore((s) => s.entity);
  const isHidden = useGameStore((s) => s.isHidden);
  const log = useGameStore((s) => s.log);
  const audioEnabled = useGameStore((s) => s.audioEnabled);
  const volume = useGameStore((s) => s.volume);
  const reduceMotion = useGameStore((s) => s.reduceMotion);

  const move = useGameStore((s) => s.move);
  const interact = useGameStore((s) => s.interact);
  const hide = useGameStore((s) => s.hide);
  const stopHiding = useGameStore((s) => s.stopHiding);
  const ambientTick = useGameStore((s) => s.ambientTick);
  const pulseNoise = useGameStore((s) => s.pulseNoise);
  const capture = useGameStore((s) => s.capture);
  const toggleAudio = useGameStore((s) => s.toggleAudio);
  const toggleVolume = useGameStore((s) => s.setVolume);
  const toggleReduceMotion = useGameStore((s) => s.toggleReduceMotion);
  const newGame = useGameStore((s) => s.newGame);

  const isHiddenRef = useRef(isHidden);
  useEffect(() => {
    isHiddenRef.current = isHidden;
  }, [isHidden]);

  const keysDown = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!started || ending || paused) return;
    const id = setInterval(ambientTick, AMBIENT_TICK_MS);
    return () => clearInterval(id);
  }, [started, ending, paused, ambientTick]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPaused((p) => !p);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleUseExit = useCallback(
    (exit: ExitDef) => {
      const door = LAYOUTS[currentRoom].doors.find(
        (d) => d.exitLabel === exit.label,
      );
      if (door) setDoorSpawn(door.spawn);
      move(exit);
    },
    [currentRoom, move],
  );

  const handleInteract = useCallback(
    (h: HotspotDef) => interact(h),
    [interact],
  );

  const handleToggleHide = useCallback(() => {
    if (isHiddenRef.current) stopHiding();
    else hide();
  }, [hide, stopHiding]);

  const handleRunNoise = useCallback(() => pulseNoise("low"), [pulseNoise]);
  const handleCaught = useCallback(() => capture(), [capture]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink-dim text-sm tracking-widest">
        LOADING...
      </div>
    );
  }

  if (!started) {
    router.replace("/");
    return null;
  }

  const room = ROOMS[currentRoom];
  const layout = LAYOUTS[currentRoom];
  const spawnPoint = doorSpawn ?? layout.playerStart;
  const band = tensionBand(entity.distance);
  const lowSanity = sanity < 40;

  const showJumpscare = ending === "caught" && !scareShown;
  const showEnding = ending && (ending !== "caught" || scareShown);

  return (
    <div className="min-h-screen">
      <Layer />
      {showJumpscare && <JumpscareOverlay onDone={() => setScareShown(true)} />}
      {showEnding && (
        <EndingScreen
          ending={ending}
          onRestart={() => {
            newGame();
            setScareShown(false);
            router.push("/");
          }}
        />
      )}

      <AmbientAudioEngine />

      {paused && !ending && (
        <div className="fixed inset-0 z-[92] bg-black/90 flex items-center justify-center p-6">
          <div className="max-w-sm w-full text-center space-y-6">
            <h2 className="font-display text-2xl tracking-widest text-bone">
              PAUSED
            </h2>
            <p className="text-xs text-ink-faint">The house waits too.</p>
            <div className="space-y-3">
              <Button
                onClick={() => setPaused(false)}
                className="w-full border border-line px-6 py-3 text-sm tracking-widest hover:border-amber hover:text-amber transition-colors"
              >
                RESUME
              </Button>
              <Button
                onClick={() => router.push("/")}
                className="w-full border border-line px-6 py-3 text-sm tracking-widest text-ink-dim hover:border-ink-dim hover:text-ink transition-colors"
              >
                QUIT TO MENU
              </Button>
            </div>
          </div>
        </div>
      )}

      <CorruptionWrapper
        band={band}
        lowSanity={lowSanity}
        reduceMotion={reduceMotion}
      >
        <div className="mx-auto max-w-6xl px-4 py-6 space-y-3">
          <header className="flex items-center justify-between border-b border-line pb-2">
            <h1 className="font-display text-sm tracking-widest text-ink-dim">
              DREADPATH
            </h1>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setPaused(true)}
                className="rounded-none border-line bg-transparent text-xs tracking-widest text-ink-dim shadow-none h-auto px-3 py-1 hover:border-amber hover:text-amber"
              >
                PAUSE
              </Button>

              <Button className="rounded-none border-line bg-transparent text-xs tracking-widest text-ink-dim shadow-none h-auto px-3 py-1 hover:border-amber hover:text-amber">
                HELP DIALOG HERE
              </Button>

              <Button
                onClick={toggleAudio}
                className="rounded-none border-line bg-transparent text-xs tracking-widest text-ink-dim shadow-none h-auto px-3 py-1 hover:border-amber hover:text-amber"
              >
                SOUND: {audioEnabled ? "ON" : "OFF"}
              </Button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_240px] gap-3 items-start">
            <div className="order-2 lg:order-1 space-y-3">
              <MapPanel currentRoom={currentRoom} visitedRooms={visitedRooms} />
              <div className="border border-line bg-panel/60 p-3 space-y-3">
                <StatusHUD
                  sanity={sanity}
                  band={band}
                  isHidden={isHidden}
                  turn={turn}
                />
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRoom}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                >
                  <RoomCanvas
                    room={room}
                    layout={layout}
                    spawn={spawnPoint}
                    flags={flags}
                    resolvedHotspots={resolvedHotspots}
                    isHidden={isHidden}
                    paused={paused}
                    entityDistance={entity.distance}
                    keysDown={keysDown}
                    onInteractHotspot={handleInteract}
                    onToggleHide={handleToggleHide}
                    onUseExit={handleUseExit}
                    onRunNoise={handleRunNoise}
                    onCaught={handleCaught}
                  />
                </motion.div>
              </AnimatePresence>
              <p className="text-sm text-ink-dim italic leading-relaxed">
                {room.description}
              </p>
              <ActionLog entries={log} />
            </div>
            <div className="order-3 space-y-3">
              <Inventory items={inventory} />
            </div>
          </div>
        </div>
      </CorruptionWrapper>
    </div>
  );
}
