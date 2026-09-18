"use client";

import { RoomId } from "@/game/types";
import { MAP_EDGES, ROOM_MAP_POS } from "@/game/mapLayout";
import { ROOMS } from "@/game/world";

function shortName(id: RoomId) {
  return ROOMS[id].name.replace(/^The /, "");
}

export default function MapPanel({
  currentRoom,
  visitedRooms,
}: {
  currentRoom: RoomId;
  visitedRooms: RoomId[];
}) {
  const visited = new Set(visitedRooms);
  const known = new Set(visited);
  for (const { a, b } of MAP_EDGES) {
    if (visited.has(a)) known.add(b);
    if (visited.has(b)) known.add(a);
  }

  return (
    <div className="border border-line bg-panel/60 p-3">
      <p className="text-[11px] tracking-widest text-ink-faint mb-2">MAP</p>
      <svg viewBox="0 0 320 280" className="w-full h-36">
        {MAP_EDGES.filter(({ a, b }) => known.has(a) && known.has(b)).map(
          ({ a, b }) => (
            <line
              key={`${a}-${b}`}
              x1={ROOM_MAP_POS[a].x}
              y1={ROOM_MAP_POS[a].y}
              x2={ROOM_MAP_POS[b].x}
              y2={ROOM_MAP_POS[b].y}
              stroke="#3a3835"
              strokeWidth={2}
            />
          ),
        )}
        {Array.from(known).map((id) => {
          const { x, y } = ROOM_MAP_POS[id];
          const isCurrent = id === currentRoom;
          const isVisited = visited.has(id);

          return (
            <g key={id}>
              <circle
                cx={x}
                cy={y}
                r={isCurrent ? 7 : 5}
                fill={isCurrent ? "#b98a4a" : isVisited ? "#8b8781" : "#33312e"}
              />
              {isVisited && (
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  fontSize="8.5"
                  fill="#8b8781"
                >
                  {shortName(id)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
