import { ExitDef, HotspotDef, RoomDef, RoomLayout, Vec2 } from "@/game/types";
import {
  clamp,
  dist,
  lerpVec,
  moveWithCollision,
  rectContains,
} from "@/game/physics";
import { RefObject, useEffect, useRef } from "react";

const WALK_SPEED = 190;
const RUN_SPEED = 340;
const PLAYER_RADIUS = 15;
const ENTITY_RADIUS = 22;
const CAPTURE_RADIUS = PLAYER_RADIUS + ENTITY_RADIUS - 6;
const INTERACT_PAD = 18;
const ENTITY_ACTIVATION_DISTANCE = 45;
const RUN_NOISE_INTERVAL_MS = 850;
const SPAWN_GRACE_FRAMES = 24;

const PALETTE_FILL: Record<RoomDef["palette"], { bg: string; wall: string }> = {
  amber: { bg: "#150f09", wall: "#2a1f10" },
  cold: { bg: "#0d1114", wall: "#131a1f" },
  rot: { bg: "#0e120d", wall: "#171c14" },
  void: { bg: "#0a0809", wall: "#120e10" },
};

function hotspotVisible(h: HotspotDef, flags: Record<string, boolean>) {
  if (h.requiresFlag && !flags[h.requiresFlag] && !h.lockedText) return false;
  return true;
}

function exitVisible(e: ExitDef, flags: Record<string, boolean>) {
  if (e.requiresFlag && !flags[e.requiresFlag] && !e.lockedText) return false;
  return true;
}

interface Props {
  room: RoomDef;
  layout: RoomLayout;
  spawn: Vec2;
  flags: Record<string, boolean>;
  resolvedHotspots: string[];
  isHidden: boolean;
  entityDistance: number;
  keysDown: RefObject<Set<string>>;
  onInteractHotspot: (hotspot: HotspotDef) => void;
  onToggleHide: (hotspot: HotspotDef) => void;
  onUseExit: (exit: ExitDef) => void;
  onRunNoise: () => void;
  onCaught: () => void;
}

export default function RoomCanvas({
  room,
  layout,
  spawn,
  flags,
  resolvedHotspots,
  isHidden,
  entityDistance,
  keysDown,
  onInteractHotspot,
  onToggleHide,
  onUseExit,
  onRunNoise,
  onCaught,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerPos = useRef<Vec2>({ ...spawn });
  const facing = useRef<Vec2>({ x: 0, y: 1 });
  const insideDoors = useRef<Set<string>>(new Set());
  const hasBeenCaught = useRef(false);
  const nearbyHotspot = useRef<HotspotDef | null>(null);
  const lastSeenPos = useRef<Vec2>({ ...spawn });
  const wasHidden = useRef(isHidden);
  const renderedEntityPos = useRef<Vec2>({ ...layout.entitySpawn });
  const renderedEntityOpacity = useRef(0);
  const spawnFrameCount = useRef(0)

  const lastFrameAt = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

  const latest = useRef({
    room,
    layout,
    flags,
    resolvedHotspots,
    isHidden,
    entityDistance,
    onInteractHotspot,
    onToggleHide,
    onUseExit,
    onRunNoise,
    onCaught,
  });
  useEffect(() => {
    latest.current = {
      room,
      layout,
      flags,
      resolvedHotspots,
      isHidden,
      entityDistance,
      onInteractHotspot,
      onToggleHide,
      onUseExit,
      onRunNoise,
      onCaught,
    };
  });

  useEffect(() => {
    if (!wasHidden.current && isHidden) {
      lastSeenPos.current = { ...playerPos.current };
    }
    wasHidden.current = isHidden;
  }, [isHidden]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (
        [
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
          "w",
          "a",
          "s",
          "d",
          "shift",
        ].includes(k)
      ) {
        e.preventDefault();
        keysDown.current.add(k);
      }
      if (k === "e") {
        e.preventDefault();
        const h = nearbyHotspot.current;
        if (h) {
          if (h.isHideSpot) latest.current.onToggleHide(h);
          else latest.current.onInteractHotspot(h);
        }
      }
    };
    const up = (e: KeyboardEvent) =>
      keysDown.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [keysDown]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frame = (t: number) => {
      const dtMs = lastFrameAt.current === null ? 16 : t - lastFrameAt.current;
      lastFrameAt.current = t;
      const dt = Math.min(dtMs, 48) / 1000;

      const {
        layout,
        isHidden,
        entityDistance,
        flags,
        resolvedHotspots,
        room,
      } = latest.current;
      const keys = keysDown.current;

      if (!isHidden) {
        let dx = 0;
        let dy = 0;
        if (keys.has("arrowup") || keys.has("w")) dy -= 1;
        if (keys.has("arrowdown") || keys.has("s")) dy += 1;
        if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
        if (keys.has("arrowright") || keys.has("d")) dx += 1;

        const running = keys.has("shift") && (dx !== 0 || dy !== 0);
        if (dx !== 0 || dy !== 0) {
          const len = Math.hypot(dx, dy) || 1;
          dx /= len;
          dy /= len;
          facing.current = { x: dx, y: dy };
          const speed = running ? RUN_SPEED : WALK_SPEED;
          playerPos.current = moveWithCollision(
            playerPos.current,
            { x: dx * speed * dt, y: dy * speed * dt },
            PLAYER_RADIUS,
            { width: layout.width, height: layout.height },
            layout.walls,
          );
        }
      }

      spawnFrameCount.current +=1
      if (spawnFrameCount.current > SPAWN_GRACE_FRAMES) {
      const stillInside = new Set<string>();
      for (const door of layout.doors) {
        const exitDef = room.exits.find(
          (e: ExitDef) => e.label === door.exitLabel,
        );
        if (!exitDef || !exitVisible(exitDef, flags)) continue;
        if (rectContains(door.zone, playerPos.current, PLAYER_RADIUS * 0.4)) {
          stillInside.add(door.exitLabel);
          if (!insideDoors.current.has(door.exitLabel)) {
            latest.current.onUseExit(exitDef);
          }
        }
      }
      insideDoors.current = stillInside;}

      let nearest: HotspotDef | null = null;
      let nearestDist = Infinity;
      for (const hz of layout.hotspotZones) {
        const hotspotDef = room.hotspots.find(
          (h: HotspotDef) => h.id === hz.hotspotId,
        );
        if (!hotspotDef || !hotspotVisible(hotspotDef, flags)) continue;
        if (rectContains(hz.zone, playerPos.current, INTERACT_PAD)) {
          const cx = hz.zone.x + hz.zone.w / 2;
          const cy = hz.zone.y + hz.zone.h / 2;
          const d = Math.hypot(
            cx - playerPos.current.x,
            cy - playerPos.current.y,
          );
          if (d < nearestDist) {
            nearestDist = d;
            nearest = hotspotDef;
          }
        }
      }
      nearbyHotspot.current = nearest;

      const active = entityDistance <= ENTITY_ACTIVATION_DISTANCE;
      const chaseProgress = clamp(
        (ENTITY_ACTIVATION_DISTANCE - entityDistance) /
          ENTITY_ACTIVATION_DISTANCE,
        0,
        1,
      );
      const target = isHidden ? lastSeenPos.current : playerPos.current;
      const idealPos = lerpVec(layout.entitySpawn, target, chaseProgress);
      renderedEntityPos.current = lerpVec(
        renderedEntityPos.current,
        idealPos,
        0.05,
      );
      renderedEntityOpacity.current +=
        ((active ? 1 : 0) - renderedEntityOpacity.current) * 0.06;

      if (
        !isHidden &&
        !hasBeenCaught.current &&
        renderedEntityOpacity.current > 0.55 &&
        dist(playerPos.current, renderedEntityPos.current) < CAPTURE_RADIUS
      ) {
        hasBeenCaught.current = true;
        latest.current.onCaught();
      }

      draw(
        ctx,
        canvas,
        room,
        layout,
        playerPos.current,
        facing.current,
        isHidden,
        nearest,
        renderedEntityPos.current,
        renderedEntityOpacity.current,
        resolvedHotspots,
        flags,
      );
      rafId.current = requestAnimationFrame(frame);
    };

    rafId.current = requestAnimationFrame(frame);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [keysDown]);

  return (
    <div
      className="relative w-full border border-line overflow-hidden bg-black"
      style={{ aspectRatio: `${layout.width} / ${layout.height}` }}
    >
      <canvas
        ref={canvasRef}
        width={layout.width}
        height={layout.height}
        className="w-full h-full block"
      />
    </div>
  );
}

function draw(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  room: RoomDef,
  layout: RoomLayout,
  player: Vec2,
  facingDir: Vec2,
  isHidden: boolean,
  nearestHotspot: HotspotDef | null,
  entityPos: Vec2,
  entityOpacity: number,
  resolvedHotspots: string[],
  flags: Record<string, boolean>,
) {
  const palette = PALETTE_FILL[room.palette];
  const { width, height } = layout;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#262a2b";
  ctx.lineWidth = 40;
  ctx.strokeRect(0, 0, width, height);

  ctx.font = "13px var(--font-body, monospace)";
  for (const door of layout.doors) {
    const exitDef = room.exits.find((e) => e.label === door.exitLabel);
    if (!exitDef || !exitVisible(exitDef, flags)) continue;
    ctx.fillStyle = "rgba(185,138,74,0.18)";
    ctx.fillRect(door.zone.x, door.zone.y, door.zone.w, door.zone.h);
    ctx.fillStyle = "rgba(201,197,189,0.55)";
    ctx.textAlign = "center";
    ctx.fillText(
      exitDef.endsGameAs ? "the front door" : shortDoorLabel(exitDef.label),
      door.zone.x + door.zone.w / 2,
      door.zone.y + door.zone.h / 2 + 4,
    );
  }

  for (const hz of layout.hotspotZones) {
    const h = room.hotspots.find((hh) => hh.id === hz.hotspotId);
    if (!h || !hotspotVisible(h, flags)) continue;
    const resolved = resolvedHotspots.includes(h.id);
    const isNear = nearestHotspot?.id === h.id;
    ctx.fillStyle = h.isHideSpot
      ? "rgba(75,90,69,0.28)"
      : resolved
        ? "rgba(120,116,108,0.14)"
        : "rgba(185,138,74,0.22)";
    ctx.strokeStyle = isNear ? "#b98a4a" : "rgba(120,116,108,0.35)";
    ctx.lineWidth = isNear ? 2 : 1;
    ctx.fillRect(hz.zone.x, hz.zone.y, hz.zone.w, hz.zone.h);
    ctx.strokeRect(hz.zone.x, hz.zone.y, hz.zone.w, hz.zone.h);
    ctx.fillStyle = "rgba(201,197,189,0.6)";
    ctx.textAlign = "center";
    ctx.fillText(
      h.name.replace(
        /^(Take|Examine|Open|Pry Open|Read|Search|Fix|Hide|Cut|Look).*?the /i,
        "",
      ),
      hz.zone.x + hz.zone.w / 2,
      hz.zone.y + hz.zone.h / 2 + 4,
    );
  }

  if (entityOpacity > 0.01) drawEntity(ctx, entityPos, entityOpacity);
  drawPlayer(ctx, player, facingDir, isHidden);

  if (nearestHotspot) {
    const hz = layout.hotspotZones.find(
      (z) => z.hotspotId === nearestHotspot.id,
    )!;
    ctx.font = "bold 14px var(--font-body, monospace)";
    ctx.textAlign = "center";
    ctx.fillStyle = "#e8e3d8";
    ctx.fillText(
      `[E] ${nearestHotspot.name}`,
      hz.zone.x + hz.zone.w / 2,
      hz.zone.y - 10,
    );
  }
}

function shortDoorLabel(label: string) {
  return label
    .replace(/^Go (to|down|back (up|down) to) the /i, "")
    .replace(/^Return to the /i, "")
    .replace(/^Unlock the /i, "")
    .replace(/^Open the /i, "");
}

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  pos: Vec2,
  facingDir: Vec2,
  isHidden: boolean,
) {
  ctx.save();
  ctx.globalAlpha = isHidden ? 0.28 : 1;
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.ellipse(pos.x, pos.y + 15, 13, 5.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#c9c2b0";
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y - 17);
  ctx.bezierCurveTo(
    pos.x + 12,
    pos.y - 13,
    pos.x + 15,
    pos.y + 3,
    pos.x + 12,
    pos.y + 14,
  );
  ctx.bezierCurveTo(
    pos.x + 7,
    pos.y + 18,
    pos.x - 7,
    pos.y + 18,
    pos.x - 12,
    pos.y + 14,
  );
  ctx.bezierCurveTo(
    pos.x - 15,
    pos.y + 3,
    pos.x - 12,
    pos.y - 13,
    pos.x,
    pos.y - 17,
  );
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#33302a";
  ctx.beginPath();
  ctx.arc(
    pos.x + facingDir.x * 3.5,
    pos.y - 7 + facingDir.y * 3.5,
    5.5,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.restore();
}

function drawEntity(ctx: CanvasRenderingContext2D, pos: Vec2, opacity: number) {
  ctx.save();
  ctx.globalAlpha = opacity;

  const glow = ctx.createRadialGradient(pos.x, pos.y, 4, pos.x, pos.y, 48);
  glow.addColorStop(0, "rgba(140,10,10,0.32)");
  glow.addColorStop(1, "rgba(140,10,10,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 48, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#040404";
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y - 30);
  ctx.bezierCurveTo(
    pos.x + 15,
    pos.y - 25,
    pos.x + 18,
    pos.y - 3,
    pos.x + 13,
    pos.y + 11,
  );
  ctx.bezierCurveTo(
    pos.x + 21,
    pos.y + 21,
    pos.x + 19,
    pos.y + 35,
    pos.x + 12,
    pos.y + 41,
  );
  ctx.lineTo(pos.x - 12, pos.y + 41);
  ctx.bezierCurveTo(
    pos.x - 19,
    pos.y + 35,
    pos.x - 21,
    pos.y + 21,
    pos.x - 13,
    pos.y + 11,
  );
  ctx.bezierCurveTo(
    pos.x - 18,
    pos.y - 3,
    pos.x - 15,
    pos.y - 25,
    pos.x,
    pos.y - 30,
  );
  ctx.closePath();
  ctx.fill();

  const eyeY = pos.y - 18;
  for (const ex of [-5, 5]) {
    const eyeGlow = ctx.createRadialGradient(
      pos.x + ex,
      eyeY,
      0,
      pos.x + ex,
      eyeY,
      7,
    );
    eyeGlow.addColorStop(0, "rgba(255,59,59,0.95)");
    eyeGlow.addColorStop(1, "rgba(255,59,59,0)");
    ctx.fillStyle = eyeGlow;
    ctx.beginPath();
    ctx.arc(pos.x + ex, eyeY, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#fff3ea";
  ctx.beginPath();
  ctx.arc(pos.x - 5, eyeY, 1.6, 0, Math.PI * 2);
  ctx.arc(pos.x + 5, eyeY, 1.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}