"use client";

import { RoomId } from "@/game/types";
import { MAP_EDGES, MAP_GRID } from "@/game/mapLayout";
import { ROOMS } from "@/game/world";
import React, { useId, useRef, useState } from "react";
import { ROOM_ICONS } from "./map-icons";

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

const BASE_LABEL_SIZE = 7.6;
const LABEL_LINE_HEIGHT = 8;

function estLabelWidth(s: string) {
  return s.length * 4.9;
}

function wrapLabel(label: string): string[] {
  const maxWidth = CELL - 4;
  if (estLabelWidth(label) <= maxWidth) return [label];
  const words = label.split(" ");
  if (words.length < 2) return [label];
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const c = current ? `${current} ${w}` : w;
    if (estLabelWidth(c) <= maxWidth) {
      current = c;
    } else {
      if (current) lines.push(current)
        current = w;
    }
  }
  if (current) lines.push(current)
  return lines
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

const ICON_SIZE = 19;
const ICON_SCALE = ICON_SIZE / 24;

export default function MapPanel({
  currentRoom,
  visitedRooms,
  svgClassName = "h-36",
}: {
  currentRoom: RoomId;
  visitedRooms: RoomId[];
  svgClassName?: string;
}) {
  const uid = useId();
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
      <div className="flex items-center justify-between mb-2">
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
        className={`w-full ${svgClassName} overflow-hidden cursor-grab active:cursor-grabbing touch-none`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        <defs>
          <pattern
            id={`grid-${uid}`}
            width={UNIT / 2}
            height={UNIT / 2}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={1} cy={1} r={1} fill="#2a2825" />
          </pattern>
          <filter
            id={`glow-${uid}`}
            x="-80%"
            y="-80%"
            width="260%"
            height="260%"
          >
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect
          x={-4000}
          y={-4000}
          width={8000}
          height={8000}
          fill={`url(#grid-${uid})`}
          opacity={0.5}
        />

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
          const cx = col * UNIT;
          const cy = row * UNIT;
          const x = cx - CELL / 2;
          const y = cy - CELL / 2;
          const isCurrent = id === currentRoom;
          const isVisited = visited.has(id);
          const Icon = ROOM_ICONS[id];
          return (
            <g key={id}>
              {isCurrent && (
                <rect
                  x={x}
                  y={y}
                  width={CELL}
                  height={CELL}
                  rx={6}
                  fill="none"
                  stroke="#b98a4a"
                  strokeWidth={2}
                  filter={`url(#glow-${uid})`}
                  opacity={0.55}
                />
              )}
              <rect
                x={x}
                y={y}
                width={CELL}
                height={CELL}
                rx={6}
                fill={
                  isCurrent
                    ? "rgba(185,138,74,0.24)"
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
              {isVisited && Icon && (
                <g
                  transform={`translate(${cx - ICON_SIZE / 2},${cy - CELL / 2 + 7}) scale(${ICON_SCALE})`}
                  className={isCurrent ? "text-amber" : "text-ink-dim"}
                  opacity={isCurrent ? 1 : 0.85}
                >
                  <Icon />
                </g>
              )}
              {isVisited &&
                wrapLabel(shortName(id)).map((line, i, lines) => (
                  <text
                    key={i}
                    x={cx}
                    y={
                      y + CELL - 7 - (lines.length - 1 - i) * LABEL_LINE_HEIGHT
                    }
                    textAnchor="middle"
                    fontSize={BASE_LABEL_SIZE}
                    letterSpacing={0.2}
                    fill={isCurrent ? "#e0b57a" : "#8b8781"}
                  >
                    {line}
                  </text>
                ))}
              {isCurrent && (
                <g transform={`translate(${x + CELL - 8},${y + 8})`}>
                  <circle
                    r={5}
                    fill="none"
                    stroke="#e0b57a"
                    strokeWidth={1.4}
                    className="map-ping"
                  />
                  <circle r={2.4} fill="#e0b57a" />
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
