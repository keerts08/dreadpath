import { ItemId, RoomDef } from "./types";

export const ITEM_NAMES: Record<ItemId, string> = {
  letterOpener: "Brass Letter Opener",
  rustyKey: "Rusted Iron Key",
  journalPage1: "Torn Journal Page (I)",
  journalPage2: "Torn Journal Page (II)",
  matches: "Box of Matches",
  kitchenKnife: "Kitchen Knife",
  copperFuse: "Copper Fuse",
  atticKey: "Small Brass Key",
  sigilMoon: "Ward Sigil — Moon",
  sigilSun: "Ward Sigil — Sun",
  sigilVine: "Ward Sigil — Vine",
};

export const ITEM_DESCRIPTIONS: Record<ItemId, string> = {
  letterOpener: "Tarnished brass, sharp enough to pry a stuck drawer open.",
  rustyKey:
    "Cold, heavy, orange with rust. It smells like old blood, or maybe just iron.",
  journalPage1:
    "\"...she counts the rooms at night. Nine, always nine, but I have only ever found eight. The ninth she calls the Quiet Room, and she says it moves.\"",
  journalPage2:
    "\"...if it learns your footsteps it will start to walk in time with them, so you stop hearing it under your own. Wear soft shoes. Read the pages together, before the shelf.\"",
  matches: "A half-empty box. Enough light to see by, for a while.",
  kitchenKnife: "Plain, sharp, and heavier than it looks in your hand.",
  copperFuse:
    "A fat copper fuse, still good. The fuse box in the cellar is missing exactly one.",
  atticKey:
    "Small and brass, worn smooth like it's been turned a thousand times.",
  sigilMoon:
    "A disc of tarnished silver etched with a crescent. It is faintly warm to the touch.",
  sigilSun:
    "A disc of dull gold etched with rays. It hums almost below hearing.",
  sigilVine:
    "A disc of green-black bronze etched with creeping vines. It smells of wet earth.",
};

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
      {
        id: "drawer",
        name: "Pry Open the Stuck Drawer",
        examineText: "The bottom drawer is swollen shut. It won't budge by hand.",
        requiresItem: "letterOpener",
        setsFlag: "drawerOpen",
        resolveText: "You work the letter opener into the seam and the drawer gives.",
        afterText: "The drawer sits open and empty.",
        lockedText: "It's stuck fast. You'd need something to pry it with.",
        noise: "medium"
      },
      {
        id: "drawerKey",
        name: "Take the Rusted Key",
        examineText: "A heavy iron key, sitting in the open drawer.",
        requiresFlag: "drawerOpen",
        lockedText: "The drawer is still stuck shut.",
        givesItem: "rustyKey",
        resolveText: "You pocket the key.",
        noise: "low",
      }
    ],
  },
};

export const START_ROOM: RoomDef["id"] = "foyer";

export const ROOM_LIST = Object.values(ROOMS)