import { RoomDef, RoomLayout, Vec2 } from "@/game/types";
import { moveWithCollision } from "@/game/physics";
import { useEffect, useRef } from "react";

const WALK_SPEED = 190;
const RUN_SPEED = 340;
const PLAYER_RADIUS = 15;

const PALETTE_FILL: Record<RoomDef["palette"], { bg: string; wall: string }> = {
  amber: { bg: "#150f09", wall: "#2a1f10" },
  cold: { bg: "#0d1114", wall: "#131a1f" },
  rot: { bg: "#0e120d", wall: "#171c14" },
  void: { bg: "#0a0809", wall: "#120e10" },
};

export default function RoomCanvas({
  room,
  layout,
  spawn,
}: {
  room: RoomDef;
  layout: RoomLayout;
  spawn: Vec2;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerPos = useRef<Vec2>({ ...spawn });
  const facing = useRef<Vec2>({ x: 0, y: 1 });
  const keysDown = useRef<Set<string>>(new Set());
  const lastFrameAt = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

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
    };
    const up = (e: KeyboardEvent) =>
      keysDown.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frame = (t: number) => {
      const dtMs = lastFrameAt.current === null ? 16 : t - lastFrameAt.current;
      lastFrameAt.current = t;
      const dt = Math.min(dtMs, 48) / 1000;
      const keys = keysDown.current;

      let dx = 0;
      let dy = 0;
      if (keys.has("arrowup") || keys.has("w")) dy -= 1;
      if (keys.has("arrowdown") || keys.has("s")) dy += 1;
      if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
      if (keys.has("arrowright") || keys.has("d")) dx += 1;

      if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy) || 1;
        dx /= len;
        dy /= len;
        facing.current = { x: dx, y: dy };
        const speed = keys.has("shift") ? RUN_SPEED : WALK_SPEED;
        playerPos.current = moveWithCollision(
          playerPos.current,
          { x: dx * speed * dt, y: dy * speed * dt },
          PLAYER_RADIUS,
          { width: layout.width, height: layout.height },
          layout.walls,
        );
      }

      draw(ctx, canvas, room, layout, playerPos.current, facing.current);
      rafId.current = requestAnimationFrame(frame);
    };

    rafId.current = requestAnimationFrame(frame);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [room, layout]);

  return (
    <div
      className="relative w-full border border-line overflow-hiden bg-black"
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
) {
  const palette = PALETTE_FILL[room.palette];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, layout.width, layout.height);

  ctx.strokeStyle = "#262a2b";
  ctx.lineWidth = 40;
  ctx.strokeRect(0, 0, layout.width, layout.height);

  drawPlayer(ctx, player, facingDir);
}

function drawPlayer(ctx: CanvasRenderingContext2D, pos: Vec2, facingDir: Vec2) {
  ctx.save();
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