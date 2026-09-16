import { ItemId, RoomDef } from "./types";

export const ITEM_NAMES: Record<ItemId, string> = {
    letterOpener: "Brass Letter Opener",
    rustyKey: "Rusted Iron Key",
    journalPage1: "Torn Journal Page (I)",
}

export const ITEM_DESCRIPTIONS: Record<ItemId, string> = {
    letterOpener: "Tarnished brass, sharp enough to pry a stuck drawer open.",
    rustyKey: "Cold, heavy, orange with rust.",
    journalPage1: "\"...she counts the rooms at night. Nine, always nine...\"",
}

export const ROOMS: Record<string, RoomDef> = {
  foyer: {
    id: "foyer",
    name: "The Foyer",
    palette: "amber",
    dangerLevel: 1,
    firstVisitText:
      "You wake up on cold marble. The last thing you remember is headlights, rain, and a gate that shouldn't have been open.",
    description:
      "The foyer is wide and cold, marble underfoot, a dead chandelier overhead.",
    exits: [{ to: "study", label: "Go to the Study", noise: "low" }],
    hotspots: [
      {
        id: "chandelier",
        name: "Examine the Chandelier",
        examineText:
          "Wrought iron, cobwebbed, its candles long burned to stubs.",
        noise: "none",
      },
    ],
  },

  study: {
    id: "study",
    name: "The Study",
    palette: "amber",
    dangerLevel: 1,
    description:
      "Bookshelves line the walls. A writing desk sits under a shuttered window.",
    exits: [{ to: "foyer", label: "Return to the Foyer", noise: "low" }],
    hotspots: [
      {
        id: "desk",
        name: "Take the Letter Opener",
        examineText: "A brass letter opener rests on the blotter.",
        givesItem: "letterOpener",
        resolveText: "You take the letter opener. It's colder than the room.",
        afterText: "The blotter, empty now but for an old inkwell.",
        noise: "low"
      },
    ],
  },
};

export const START_ROOM: RoomDef["id"] = "foyer";