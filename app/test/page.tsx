"use client";

import { LAYOUTS } from "@/game/layouts";
import { RoomId } from "@/game/types";
import { useState } from "react";

const ROOM_IDS = Object.keys(LAYOUTS) as RoomId[];

export default function LayoutPreview() {
  const [room, setRoom] = useState<RoomId>(ROOM_IDS[9]);
  const layout = LAYOUTS[room];

  if (!layout) {
    return (
      <div style={{ padding: 20, color: "red" }}>Invalid room: {room}</div>
    );
  }

  return (
    <div
      style={{
        padding: 20,
        background: "#111",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1>{room}</h1>

      <select
        value={room}
        onChange={(e) => setRoom(e.target.value as RoomId)}
        style={{ marginBottom: 20, padding: 8 }}
      >
        {ROOM_IDS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      {/* ROOM */}
      <div
        style={{
          position: "relative",
          width: layout.width,
          height: layout.height,
          background: "#222",
          border: "2px solid white",
        }}
      >
        {/* walls */}
        {layout.walls.map((w, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: w.x,
              top: w.y,
              width: w.w,
              height: w.h,
              background: "#555",
              border: "2px solid white",
            }}
          />
        ))}

        {/* doors */}
        {layout.doors.map((d, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: d.zone.x,
              top: d.zone.y,
              width: d.zone.w,
              height: d.zone.h,
              background: "#2563eb",
              opacity: 0.7,
              fontSize: 11,
            }}
            title={d.exitLabel}
          >
            {d.exitLabel}
          </div>
        ))}

        {/* hotspots */}
        {layout.hotspotZones.map((h) => (
          <div
            key={h.hotspotId}
            style={{
              position: "absolute",
              left: h.zone.x,
              top: h.zone.y,
              width: h.zone.w,
              height: h.zone.h,
              background: "#f59e0b",
              opacity: 0.7,
              fontSize: 11,
            }}
            title={h.hotspotId}
          >
            {h.hotspotId}
          </div>
        ))}

        {/* player */}
        <div
          style={{
            position: "absolute",
            left: layout.playerStart.x - 8,
            top: layout.playerStart.y - 8,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#22c55e",
            border: "2px solid white",
          }}
          title={`Player: ${layout.playerStart.x}, ${layout.playerStart.y}`}
        />

        {/* entity */}
        <div
          style={{
            position: "absolute",
            left: layout.entitySpawn.x - 8,
            top: layout.entitySpawn.y - 8,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#ef4444",
            border: "2px solid white",
          }}
          title={`Entity: ${layout.entitySpawn.x}, ${layout.entitySpawn.y}`}
        />
      </div>

      {/* LEGEND */}
      <div style={{ marginTop: 20, lineHeight: 2 }}>
        🟩 Player spawn
        <br />
        🔴 Entity spawn
        <br />
        🟦 Doors
        <br />
        🟧 Hotspots
        <br />⬜ Walls
      </div>
    </div>
  );
}
