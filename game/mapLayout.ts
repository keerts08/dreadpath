import { RoomId } from "./types";
import { ROOMS } from "./world";

export const ROOM_MAP_POS: Record<RoomId, { x: number; y: number }> = {
  foyer: { x: 160, y: 140 },
  study: { x: 40, y: 140 },
  library: { x: 40, y: 40 },
  diningHall: { x: 280, y: 140 },
  kitchen: { x: 280, y: 40 },
  cellar: { x: 280, y: 240 },
  hallway: { x: 160, y: 40 },
  bathroom: { x: 60, y: 240 },
  bedroom: { x: 260, y: 240 },
  attic: { x: 160, y: 240 },
};

export interface MapEdge {
  a: RoomId;
  b: RoomId;
}

export const MAP_EDGES: MapEdge[] = (() => {
  const seen = new Set<string>();
  const edges: MapEdge[] = [];
  for (const r of Object.values(ROOMS)) {
    for (const e of r.exits) {
      if (e.to === r.id) continue;
      const key = [r.id, e.to].sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ a: r.id as RoomId, b: e.to });
    }
  }
  return edges;
})();
