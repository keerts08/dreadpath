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
import RotatePrompt from "@/components/rotate-prompt";
import { tensionBand } from "@/game/entity";
import MapPanel from "@/components/map-panel";
import StatusHUD from "@/components/status-hud";
import RoomCanvas from "@/components/room-canvas";
import Inventory from "@/components/inventory";
import { ExitDef, HotspotDef, Vec2 } from "@/game/types";
import ActionLog from "@/components/action-log";
import AmbientAudioEngine from "@/components/audio-engine";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AnimatePresence, motion } from "motion/react";

const AMBIENT_TICK_MS = 4200;

const PAUSE_BUTTON =
  "w-full rounded-none border-line bg-transparent py-2 text-sm tracking-widest shadow-none h-auto hover:border-amber hover:text-amber";
const HEADER_BUTTON =
  "rounded-none border-line bg-transparent text-xs tracking-widest text-ink-dim shadow-none h-auto px-3 py-1 hover:border-amber hover:text-amber";
const MOBILE_ICON_BUTTON =
  "pointer-events-auto flex h-9 w-9 items-center justify-center border border-line bg-panel/70 text-ink-dim active:border-amber active:text-amber";
type MobilePanel = "map" | "inventory" | "log" | "status" | null;

function MapGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden
    >
      <path
        d="M4 5 L9 3 L15 5 L20 3 V19 L15 21 L9 19 L4 21 Z"
        strokeLinejoin="round"
      />
      <path d="M9 3 V19 M15 5 V21" strokeDasharray="2 2" />
    </svg>
  );
}

function BagGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden
    >
      <path d="M7 8 V6 a5 5 0 0 1 10 0 v2" strokeLinecap="round" />
      <rect x="4" y="8" width="16" height="13" rx="1.5" />
    </svg>
  );
}

function LogGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden
    >
      <path d="M5 6 H19 M5 12 H19 M5 18 H13" strokeLinecap="round" />
    </svg>
  );
}

function PulseGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden
    >
      <path
        d="M3 12 H8 L10 6 L14 18 L16 12 H21"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PauseGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden
    >
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

function HelpGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path
        d="M9.5 9.3 a2.5 2.5 0 1 1 3.5 2.3 c-1 0.5 -1 1.2 -1 2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function GameShell() {
  const hydrated = useHydrated();
  const router = useRouter();
  const [scareShown, setScareShown] = useState(false);
  const [doorSpawn, setDoorSpawn] = useState<Vec2 | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>(null);

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
  const setVolume = useGameStore((s) => s.setVolume);
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

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && started && !ending) return;
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [started, ending]);

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

  useEffect(() => {
    if (!started) {
      router.replace("/");
    }
  }, [started, router]);

  if (!hydrated) {
    return (
      <div className="min-h-dvh flex items-center justify-center text-ink-dim text-sm tracking-widest">
        LOADING...
      </div>
    );
  }

  if (!started) {
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
    <div className="min-h-dvh small-touch:landscape:h-dvh small-touch:landscape:overflow-hidden">
      <Layer />
      <RotatePrompt />
      {showJumpscare && (
        <JumpscareOverlay
          onDone={() => setScareShown(true)}
          reduceMotion={reduceMotion}
        />
      )}
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
      <Dialog
        open={mobilePanel !== null}
        onOpenChange={(o) => !o && setMobilePanel(null)}
      >
        <DialogContent
          showCloseButton
          className="max-w-sm rounded-none bg-panel text-ink-dim ring-line"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-base text-bone tracking-widest">
              {mobilePanel === "map" && "MAP"}
              {mobilePanel === "inventory" && "POCKETS"}
              {mobilePanel === "log" && "LOG"}
              {mobilePanel === "status" && "STATUS"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {mobilePanel} panel
            </DialogDescription>
          </DialogHeader>
          {mobilePanel === "map" && (
            <MapPanel
              currentRoom={currentRoom}
              visitedRooms={visitedRooms}
              svgClassName="mx-auto aspect-square w-[min(100%,48dvh)]"
            />
          )}
          {mobilePanel === "inventory" && <Inventory items={inventory} />}
          {mobilePanel === "log" && <ActionLog entries={log} />}
          {mobilePanel === "status" && (
            <StatusHUD
              sanity={sanity}
              band={band}
              isHidden={isHidden}
              turn={turn}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-md rounded-none bg-panel text-ink-dim ring-line"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-base text-bone tracking-widest">
              HOW THIS WORKS
            </DialogTitle>
            <DialogDescription className="sr-only">
              Controls and mechanics
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              Move with WASD or the arrow keys, or the on-screen stick on a
              phone. Hold Shift — or tap RUN — to move faster, but louder.
            </p>
            <p>
              Walk up to something and press E, or the on-screen E button, to
              examine, take, or use it. Walking into a doorway moves you through
              it.
            </p>
            <p>
              Something else is in the house. Noise draws it closer, and in the
              wrong room it may start pursuing you for real — you&rsquo;ll see
              it coming. Find a hiding spot and interact with it to duck inside
              if it gets close.
            </p>
            <p>
              Your grip on things will fray the longer you stay, and faster if
              you dwell on what you find. Read carefully.
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setHelpOpen(false)}
              variant="outline"
              className="h-auto rounded-none border-line bg-transparent px-4 py-2 text-xs tracking-widest shadow-none hover:border-amber hover:text-amber"
            >
              CLOSE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={paused && !ending} onOpenChange={setPaused}>
        <DialogContent
          showCloseButton={false}
          className="max-w-sm rounded-none bg-panel text-center text-ink-dim ring-line"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-2xl tracking-widest text-bone">
              PAUSED
            </DialogTitle>
            <DialogDescription className="text-xs text-ink-faint">
              The house waits too.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button
              onClick={() => setPaused(false)}
              variant="outline"
              className={PAUSE_BUTTON}
            >
              RESUME
            </Button>
            <Button
              onClick={() => setSettingsOpen(true)}
              variant="outline"
              className={PAUSE_BUTTON}
            >
              SETTINGS
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className={PAUSE_BUTTON}
            >
              QUIT TO MENU
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-sm rounded-none bg-panel text-ink-dim ring-line"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-base text-bone tracking-widest">
              SETTINGS
            </DialogTitle>
            <DialogDescription className="sr-only">
              Sound and accessibility settings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="flex items-center justify-between text-sm">
              <span>SOUND</span>
              <Button
                onClick={toggleAudio}
                variant="outline"
                size="sm"
                className={`h-auto rounded-none bg-transparent px-3 py-1 shadow-none ${
                  audioEnabled
                    ? "border-amber text-amber"
                    : "border-line text-ink-dim"
                }`}
              >
                {audioEnabled ? "ON" : "OFF"}
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] tracking-widest text-ink-faint">
                <span>VOLUME</span>
                <span className="text-ink tabular-nums">
                  {Math.round(volume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                disabled={!audioEnabled}
                className="w-full accent-amber"
                aria-label="Volume"
              />
            </div>

            <label className="flex items-center gap-2 text-[11px] tracking-widest text-ink-faint">
              <input
                type="checkbox"
                checked={reduceMotion}
                onChange={toggleReduceMotion}
                className="accent-amber"
              />
              REDUCE SCREEN SHAKE
            </label>
          </div>

          <DialogFooter>
            <DialogClose
              render={
                <Button
                  variant="outline"
                  className="h-auto rounded-none border-line bg-transparent px-4 py-2 text-xs tracking-widest shadow-none hover:border-amber hover:text-amber"
                >
                  CLOSE
                </Button>
              }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CorruptionWrapper
        band={band}
        lowSanity={lowSanity}
        reduceMotion={reduceMotion}
      >
        <div className="mx-auto max-w-6xl px-4 py-6 space-y-3 small-touch:landscape:flex small-touch:landscape:h-dvh small-touch:landscape:max-w-none small-touch:landscape:flex-col small-touch:landscape:space-y-0 small-touch:landscape:px-0 small-touch:landscape:py-0">
          <header className="flex items-center justify-between border-b border-line pb-2 small-touch:landscape:hidden">
            <h1 className="font-display text-sm tracking-widest text-ink-dim">
              DREADPATH
            </h1>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setPaused(true)}
                variant="outline"
                className={HEADER_BUTTON}
              >
                PAUSE
              </Button>

              <Button
                onClick={() => setHelpOpen(true)}
                variant="outline"
                className={HEADER_BUTTON}
              >
                HELP
              </Button>

              <Button
                onClick={toggleAudio}
                variant="outline"
                className={HEADER_BUTTON}
              >
                SOUND: {audioEnabled ? "ON" : "OFF"}
              </Button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_240px] gap-3 items-start small-touch:landscape:grid-cols-1 small-touch:landscape:flex-1 small-touch:landscape:items-stretch small-touch:landscape:gap-0 small-touch:landscape:min-h-0">
            <div className="order-2 lg:order-1 space-y-3 small-touch:landscape:hidden">
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
            <div className="order-1 lg:order-2 space-y-3 small-touch:landscape:flex small-touch:landscape:h-full small-touch:landscape:flex-row small-touch:landscape:items-stretch small-touch:landscape:space-y-0 small-touch:landscape:gap-1 small-touch:landscape:min-h-0">
              <div className="hidden small-touch:landscape:flex small-touch:landscape:w-9 small-touch:landscape:shrink-0 small-touch:landscape:flex-col small-touch:landscape:items-center small-touch:landscape:justify-center small-touch:landscape:gap-1.5">
                <button
                  type="button"
                  aria-label="Status"
                  onClick={() => setMobilePanel("status")}
                  className={`${MOBILE_ICON_BUTTON} ${lowSanity || isHidden ? "border-amber text-amber" : ""}`}
                >
                  <PulseGlyph />
                </button>
                <button
                  type="button"
                  aria-label="Map"
                  onClick={() => setMobilePanel("map")}
                  className={MOBILE_ICON_BUTTON}
                >
                  <MapGlyph />
                </button>
                <button
                  type="button"
                  aria-label="Inventory"
                  onClick={() => setMobilePanel("inventory")}
                  className={MOBILE_ICON_BUTTON}
                >
                  <BagGlyph />
                </button>
              </div>

              <div className="min-w-0 flex-1 small-touch:landscape:flex small-touch:landscape:h-full small-touch:landscape:items-center small-touch:landscape:justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentRoom}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="w-full small-touch:landscape:flex small-touch:landscape:h-full small-touch:landscape:min-h-0 small-touch:landscape:items-center small-touch:landscape:justify-center"
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
                <p className="text-sm text-ink-dim italic leading-relaxed small-touch:landscape:hidden">
                  {room.description}
                </p>
                <div className="small-touch:landscape:hidden">
                  <ActionLog entries={log} />
                </div>
              </div>

              <div className="hidden small-touch:landscape:flex small-touch:landscape:w-9 small-touch:landscape:shrink-0 small-touch:landscape:flex-col small-touch:landscape:items-center small-touch:landscape:justify-center small-touch:landscape:gap-1.5">
                <button
                  type="button"
                  aria-label="Log"
                  onClick={() => setMobilePanel("log")}
                  className={MOBILE_ICON_BUTTON}
                >
                  <LogGlyph />
                </button>
                <button
                  type="button"
                  aria-label="Help"
                  onClick={() => setHelpOpen(true)}
                  className={MOBILE_ICON_BUTTON}
                >
                  <HelpGlyph />
                </button>
                <button
                  type="button"
                  aria-label="Pause"
                  onClick={() => setPaused(true)}
                  className={MOBILE_ICON_BUTTON}
                >
                  <PauseGlyph />
                </button>
              </div>
            </div>
            <div className="order-3 space-y-3 small-touch:landscape:hidden">
              <Inventory items={inventory} />
            </div>
          </div>
        </div>
      </CorruptionWrapper>
    </div>
  );
}
