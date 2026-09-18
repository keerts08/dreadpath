"use client";

import MapPanel from "@/components/map-panel";
import { ROOM_MAP_POS, MAP_EDGES } from "@/game/mapLayout";

export default function MapPreview() {
  return (
    <MapPanel
      currentRoom="foyer"
      visitedRooms={[
        "foyer" ,
          "study" ,
          "library" ,
          "diningHall",
      ]}
    />
  );
}
