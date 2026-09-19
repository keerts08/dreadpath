import { LAYOUTS } from "@/game/layouts";
import { useGameStore } from "@/game/store";
import { useHydrated } from "@/game/useHydrated";
import { ROOMS } from "@/game/world";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Layer from "./layer";
import JumpscareOverlay from "./jumpscare";
import EndingScreen from "./ending-screen";
import CorruptionWrapper from "./corruption-wrapper";
import { tensionBand } from "@/game/entity";
import MapPanel from "./map-panel";
import StatusHUD from "./status-hud";
import RoomCanvas from "./room-canvas";
import Inventory from "./inventory";
import { ExitDef, HotspotDef, Vec2 } from "@/game/types";
import ActionLog from "./action-log";

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
  const pulseNosie = useGameStore((s) => s.pulseNosie);
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

  const handleRunNoise = useCallback(() => pulseNosie("low"), [pulseNosie]);
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

      {paused && !ending && (
        <div className="fixed inset-0 z-[92] bg-black/90">paused</div>
      )}

      <CorruptionWrapper
        band={band}
        lowSanity={lowSanity}
        reduceMotion={reduceMotion}
      >
        <div className="mx-auto max-w-6xl px-4 py-6">
          <MapPanel currentRoom={currentRoom} visitedRooms={visitedRooms} />
          <StatusHUD
            sanity={sanity}
            band={band}
            isHidden={isHidden}
            turn={turn}
          />

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
          <p>{room.description}</p>
          <ActionLog entries={log} />
          <Inventory items={inventory} />
        </div>
      </CorruptionWrapper>
    </div>
  );
}
