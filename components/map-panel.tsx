"use client";

import { RoomId } from "@/game/types";
import { MAP_EDGES, MAP_GRID } from "@/game/mapLayout";
import { ROOMS } from "@/game/world";
import React, { useRef, useState } from "react";

const CELL = 52;
const GAP = 16;
const UNIT = CELL + GAP;
const BRIDGE = 18;
const MIN_ZOOM = 0.7;
const MAX_ZOOM = 2.4;
const BASE_HALF = 190;

function shortName(id: RoomId) {
  return ROOMS[id].name.replace(/^The /, "");
}

function bridgeRect(a: RoomId, b: RoomId) {
  const ga = MAP_GRID[a];
  const gb = MAP_GRID[b];
  const dc = gb.col - ga.col;
  const dr = gb.row - ga.row;
  if (dc === 1 || dc === -1) {
    const left = dc === 1 ? ga : gb;
    return {
      x: left.col * UNIT + CELL / 2,
      y: left.row * UNIT - BRIDGE / 2,
      w: GAP,
      h: BRIDGE,
    };
  }
  if (dr === 1 || dr === -1) {
    const top = dr === 1 ? ga : gb;
    return {
      x: top.col * UNIT - BRIDGE / 2,
      y: top.row * UNIT + CELL / 2,
      w: BRIDGE,
      h: GAP,
    };
  }
  return null;
}

export default function MapPanel({
  currentRoom,
  visitedRooms,
}: {
  currentRoom: RoomId;
  visitedRooms: RoomId[];
}) {
  const [zoom, setZoom] = useState(1.1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{
    startX: number;
    startY: number;
    panX: number;
    panY: number;
  } | null>(null);

  const [prevRoom, setPrevRoom] = useState(currentRoom);
  if (currentRoom !== prevRoom) {
    setPrevRoom(currentRoom);
    setPan({ x: 0, y: 0 });
  }

  const visited = new Set(visitedRooms);
  const known = new Set(visited);
  for (const { a, b } of MAP_EDGES) {
    if (visited.has(a)) known.add(b);
    if (visited.has(b)) known.add(a);
  }

  const half = BASE_HALF / zoom;
  const cx = MAP_GRID[currentRoom].col * UNIT - pan.x;
  const cy = MAP_GRID[currentRoom].row * UNIT - pan.y;
  const viewBox = `${cx - half} ${cy - half} ${half * 2} ${half * 2}`;

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const unitsPerPx = (half * 2) / rect.width;
    const dx = (e.clientX - drag.current.startX) * unitsPerPx;
    const dy = (e.clientY - drag.current.startY) * unitsPerPx;
    setPan({ x: drag.current.panX + dx, y: drag.current.panY + dy });
  };

  const endDrag = () => {
    drag.current = null;
  };

  return (
    <div className="border border-line bg-panel/60 p-3">
      <div className="flex item-center justify-between mb-2">
        <p className="text-[11px] tracking-widest text-ink-faint">MAP</p>
        <div className="flex gap-1">
          <button
            onClick={() =>
              setZoom((z) => Math.max(MIN_ZOOM, +(z - 0.35).toFixed(2)))
            }
            className="h-5 w-5 border border-line text-ink-dim hover:border-amber hover:text-amber text-xs leading-none"
            aria-label="Zoom out"
          >
            -
          </button>
          <button
            onClick={() =>
              setZoom((z) => Math.min(MAX_ZOOM, +(z + 0.35).toFixed(2)))
            }
            className="h-5 w-5 border border-line text-ink-dim hover:border-amber hover:text-amber text-xs leading-none"
            aria-label="Zoom in"
          >
            +
          </button>
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={viewBox}
        className="w-full h-36 overflow-hidden cursor-grab active-cursor-grabbing touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        {MAP_EDGES.filter(({ a, b }) => known.has(a) && known.has(b)).map(
          ({ a, b }) => {
            const r = bridgeRect(a, b);
            if (!r) return null;
            return (
              <rect
                key={`${a}-${b}`}
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                fill="#171a1b"
                stroke="#3a3835"
                strokeWidth={1}
              />
            );
          },
        )}

        {Array.from(known).map((id) => {
          const { col, row } = MAP_GRID[id];
          const x = col * UNIT - CELL / 2;
          const y = row * UNIT - CELL / 2;
          const isCurrent = id === currentRoom;
          const isVisited = visited.has(id);
          return (
            <g key={id}>
              <rect
                x={x}
                y={y}
                width={CELL}
                height={CELL}
                rx={6}
                fill={
                  isCurrent
                    ? "rgba(185,138,74,0.28)"
                    : isVisited
                      ? "#1c1a17"
                      : "transparent"
                }
                stroke={
                  isCurrent ? "#b98a4a" : isVisited ? "#55534f" : "#33312e"
                }
                strokeWidth={isCurrent ? 2 : 1.3}
                strokeDasharray={isVisited ? undefined : "3 3"}
              />
              {isVisited && (
                <text
                  x={col * UNIT}
                  y={row * UNIT + 3}
                  textAnchor="middle"
                  fontSize={8.5}
                  fill={isCurrent ? "#e0b57a" : "#8b8781"}
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
