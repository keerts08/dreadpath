import { RoomId } from "./types";
import { ROOMS } from "./world";

export const MAP_GRID: Record<RoomId, { col: number; row: number }> = {
  foyer: { col: 0, row: 0 },
  study: { col: -1, row: 0 },
  library: { col: -1, row: 1 },
  diningHall: { col: 1, row: 0 },
  kitchen: { col: 2, row: 0 },
  cellar: { col: 1, row: 1 },
  hallway: { col: 0, row: -1 },
  bathroom: { col: -1, row: -1 },
  bedroom: { col: 1, row: -1 },
  attic: { col: 0, row: -2 },
  crawlspace: { col: 0, row: -3}
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
