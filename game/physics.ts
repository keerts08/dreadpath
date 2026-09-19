import { RectZone, Vec2 } from "./types";

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function rectContains(zone: RectZone, p: Vec2, pad = 0) {
  return (
    p.x >= zone.x - pad &&
    p.x <= zone.x + zone.w + pad &&
    p.y >= zone.y - pad &&
    p.y <= zone.y + zone.h + pad
  );
}

export function dist(a: Vec2, b: Vec2) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function lerpVec(a: Vec2, b: Vec2, t: number): Vec2 {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
}

export function moveWithCollision(
  pos: Vec2,
  delta: Vec2,
  radius: number,
  bounds: { width: number; height: number },
  walls: RectZone[],
): Vec2 {
  let { x, y } = pos;

  const blocked = (px: number, py: number) => {
    if (px - radius < 0 || px + radius > bounds.width) return true;
    if (py - radius < 0 || py + radius > bounds.height) return true;
    for (const w of walls) {
      if (
        px + radius > w.x &&
        px - radius < w.x + w.w &&
        py + radius > w.y &&
        py - radius < w.y + w.h
      ) {
        return true;
      }
    }
    return false;
  };

  const nx = x + delta.x;
  if (!blocked(nx, y)) x = nx;

  const ny = y + delta.y;
  if (!blocked(x, ny)) y = ny;

  return { x, y };
}
