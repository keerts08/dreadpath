"use client";

import MapPanel from "@/components/map-panel";

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
