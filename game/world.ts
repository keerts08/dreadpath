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
    '"...she counts the rooms at night. Nine, always nine, but I have only ever found eight. The ninth she calls the Quiet Room, and she says it moves."',
  journalPage2:
    '"...if it learns your footsteps it will start to walk in time with them, so you stop hearing it under your own. Wear soft shoes. Read the pages together, before the shelf."',
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
      "You wake up on cold marble. The last thing you remember is headlights, and rain, and a gate that shouldn't have been open. Above you a chandelier hangs dark and still. The front door is bolted three times over, and none of the bolts look like they open from the inside.",
    description:
      "The foyer is wide and cold, marble underfoot, a dead chandelier overhead. A staircase climbs into darkness. The front door waits, bolted and silent.",
    exits: [
      { to: "study", label: "Go to the Study", noise: "low" },
      { to: "diningHall", label: "Go to the Dining Hall", noise: "low" },
      { to: "hallway", label: "Go down the Hallway", noise: "low" },
      {
        to: "foyer",
        label: "Open the Front Door",
        endsGameAs: "escaped",
        requiresFlag: "canEscape",
        lockedText:
          "The door is bolted with a mechanism you don't understand — three sockets shaped like coins, and a keypad gone dark for lack of power. It will not open like this.",
        noise: "medium",
      },
    ],
    hotspots: [
      {
        id: "chandelier",
        name: "Examine the Chandelier",
        examineText:
          "Wrought iron, cobwebbed, its candles long burned to stubs. You get the feeling it hasn't been lit in a very long time — or that something prefers it that way.",
        noise: "none",
      },
      {
        id: "doorMechanism",
        name: "Examine the Door Mechanism",
        examineText: [
          "Three round sockets are set into the door, each shaped like a coin with strange engravings worn into their rims — moon, sun, vine. Beside them, a small keypad, screen dark.",
          "The three sockets are still empty. The keypad is still dark.",
        ],
        noise: "none",
      },
      {
        id: "placeWards",
        name: "Place the Ward Sigils in the Door",
        examineText: "You press the sigils into their sockets.",
        requiresFlag: "hasAllSigilsAndPower",
        lockedText:
          "You need all three ward sigils, and the house needs its power back, before this door will listen to you.",
        setsFlag: "canEscape",
        resolveText:
          "The three sigils click into their sockets and the keypad flickers to life, then goes green. Somewhere behind you, deep in the house, something exhales — a long, disappointed breath. The bolts retract, one, two, three.",
        noise: "medium",
      },
      {
        id: "speakName",
        name: "Speak Its Name",
        examineText:
          "You say the name you found written three times in the house, once in a dead woman's hand, once scratched into a beam, once carved into your own memory since you arrived. You are not sure why you know it is a name at all.",
        requiresFlag: "loreComplete",
        endsGameAs: "banished",
        resolveText:
          "The house goes utterly silent — no pipes, no wind, no breathing but your own. Then, very softly, something says it back to you.",
        noise: "medium",
      },
    ],
  },

  study: {
    id: "study",
    name: "The Study",
    palette: "amber",
    dangerLevel: 1,
    description:
      "Bookshelves line the walls, mostly empty. A writing desk sits under a shuttered window, one drawer swollen shut. A portrait of a woman hangs slightly askew.",
    exits: [
      { to: "foyer", label: "Return to the Foyer", noise: "low" },
      { to: "library", label: "Go to the Library", noise: "low" },
    ],
    hotspots: [
      {
        id: "desk",
        name: "Take the Letter Opener",
        examineText:
          "A brass letter opener rests on the blotter, next to a dried-out inkwell.",
        givesItem: "letterOpener",
        resolveText: "You take the letter opener. It's colder than the room.",
        afterText: "The blotter, empty now but for an old inkwell.",
        noise: "low",
      },
      {
        id: "drawer",
        name: "Pry Open the Stuck Drawer",
        examineText:
          "The bottom drawer is swollen shut, warped with damp. It won't budge by hand.",
        requiresItem: "letterOpener",
        setsFlag: "drawerOpen",
        resolveText:
          "You work the letter opener into the seam and the drawer gives with a splintering crack. Inside: a rusted key, and a torn page of handwriting, hidden under the lining.",
        afterText: "The drawer sits open and empty.",
        lockedText: "It's stuck fast. You'd need something to pry it with.",
        noise: "medium",
      },
      {
        id: "drawerKey",
        name: "Take the Rusted Key",
        examineText:
          "A heavy iron key, orange with rust, sitting in the open drawer.",
        requiresFlag: "drawerOpen",
        lockedText: "The drawer is still stuck shut.",
        givesItem: "rustyKey",
        resolveText: "You pocket the key.",
        noise: "low",
      },
      {
        id: "drawerPage",
        name: "Take the Torn Page",
        examineText:
          "A page torn from a journal, hidden under the drawer's lining.",
        requiresFlag: "drawerOpen",
        lockedText: "The drawer is still stuck shut.",
        givesItem: "journalPage1",
        setsFlag: "page1Read",
        resolveText: "You read it once, twice, and wish you hadn't.",
        sanityOnFirstExamine: -4,
        noise: "low",
      },
      {
        id: "portrait",
        name: "Examine the Portrait",
        examineText:
          "A woman in mourning black, painted with her eyes slightly too wide, slightly too fixed on the viewer no matter where you stand. A brass plate reads no name at all.",
        setsFlag: "portraitSeen",
        sanityOnFirstExamine: -3,
        noise: "none",
      },
    ],
  },

  library: {
    id: "library",
    name: "The Library",
    palette: "amber",
    dangerLevel: 1,
    description:
      "Floor-to-ceiling shelves, most books swollen with damp. One shelf sits slightly proud of the wall, as though it isn't finished with the rest of them.",
    exits: [{ to: "study", label: "Return to the Study", noise: "low" }],
    hotspots: [
      {
        id: "loreBooks",
        name: "Read the Old Records",
        examineText:
          "Estate ledgers, mostly rot. One entry survives: a household of nine rooms, and a live-in ward who 'does not eat with the family, and is not to be spoken of outside these walls.'",
        setsFlag: "recordsRead",
        sanityOnFirstExamine: -2,
        noise: "none",
      },
      {
        id: "bookshelf",
        name: "Open the Loose Shelf",
        examineText:
          "This shelf isn't flush with the wall. There's a seam behind it, like a door — but it won't move.",
        requiresFlag: "bothPagesRead",
        lockedText:
          "You need something more before this will open — the two torn journal pages, read together, feel like they're missing something. Perhaps there's a second page somewhere in the house.",
        setsFlag: "bookshelfOpen",
        resolveText:
          "Both pages, read together, name a date — and somehow the shelf knows it too. It grinds aside, revealing a small stone alcove, and inside it, a disc of tarnished silver.",
        noise: "high",
      },
      {
        id: "sigilMoonSpot",
        name: "Take the Silver Sigil",
        examineText:
          "A disc of tarnished silver, etched with a crescent moon, warm in the alcove.",
        requiresFlag: "bookshelfOpen",
        lockedText: "The shelf is still sealed.",
        givesItem: "sigilMoon",
        resolveText:
          "You take the Moon sigil. It's warmer than the room around it.",
        noise: "low",
      },
    ],
  },

  diningHall: {
    id: "diningHall",
    name: "The Dining Hall",
    palette: "cold",
    dangerLevel: 1,
    description:
      "A long table set for a dinner no one is coming to. Twelve chairs, one pushed back as though someone just left it. A door to the cellar is set into the far wall, bolted.",
    exits: [
      { to: "foyer", label: "Return to the Foyer", noise: "low" },
      { to: "kitchen", label: "Go to the Kitchen", noise: "low" },
      {
        to: "cellar",
        label: "Unlock the Cellar Door",
        requiresItem: "rustyKey",
        lockedText:
          "The cellar door is bolted shut. It looks like it wants a key.",
        noise: "medium",
      },
    ],
    hotspots: [
      {
        id: "table",
        name: "Examine the Table Setting",
        examineText:
          "Fine china, tarnished silver, all laid out and thick with dust — except one setting, which is spotless, as if used recently. Or often.",
        sanityOnFirstExamine: -2,
        noise: "none",
      },
      {
        id: "pushedChair",
        name: "Examine the Pushed-Back Chair",
        examineText:
          "One chair is pulled away from the table at an angle, like whoever sat there stood up in a hurry. The seat is still faintly warm.",
        sanityOnFirstExamine: -3,
        noise: "none",
      },
    ],
  },

  kitchen: {
    id: "kitchen",
    name: "The Kitchen",
    palette: "cold",
    dangerLevel: 1,
    description:
      "Iron pots hang from hooks, none of them recently used. A pantry door stands ajar in the corner, dark inside.",
    exits: [
      { to: "diningHall", label: "Return to the Dining Hall", noise: "low" },
    ],
    hotspots: [
      {
        id: "counter",
        name: "Take the Box of Matches",
        examineText: "A half-full box of matches sits by the cold stove.",
        givesItem: "matches",
        resolveText: "You pocket the matches.",
        afterText: "The stove, cold and bare.",
        noise: "low",
      },
      {
        id: "knifeBlock",
        name: "Take the Kitchen Knife",
        examineText: "A plain, well-worn knife sits in a wooden block.",
        givesItem: "kitchenKnife",
        resolveText:
          "You take the knife. It feels good to be holding something with an edge.",
        afterText: "An empty knife block.",
        noise: "low",
      },
      {
        id: "pantry",
        name: "Hide in the Pantry",
        examineText:
          "A dark, narrow pantry, just big enough for a person who doesn't want to be found.",
        isHideSpot: true,
        noise: "none",
      },
    ],
  },

  hallway: {
    id: "hallway",
    name: "The Upstairs Hallway",
    palette: "rot",
    dangerLevel: 2,
    description:
      "A long corridor lined with closed doors and peeling wallpaper. The air is colder here than it has any right to be.",
    exits: [
      { to: "foyer", label: "Return to the Foyer", noise: "low" },
      { to: "bedroom", label: "Go to the Bedroom", noise: "low" },
      { to: "bathroom", label: "Go to the Bathroom", noise: "low" },
      {
        to: "attic",
        label: "Unlock the Attic Stairs",
        requiresItem: "atticKey",
        lockedText:
          "A narrow door, painted over and locked. It needs a small key.",
        noise: "medium",
      },
    ],
    hotspots: [
      {
        id: "wallpaper",
        name: "Examine the Peeling Wallpaper",
        examineText:
          "Underneath the paper, scratched into the plaster in a small, careful hand: tally marks, dozens of them, in groups of nine.",
        sanityOnFirstExamine: -3,
        noise: "none",
      },
    ],
  },

  bathroom: {
    id: "bathroom",
    name: "The Bathroom",
    palette: "rot",
    dangerLevel: 2,
    description:
      "A cracked porcelain tub, a sink stained brown at the drain, and a mirror over the sink.",
    exits: [{ to: "hallway", label: "Return to the Hallway", noise: "low" }],
    hotspots: [
      {
        id: "mirror",
        name: "Look in the Mirror",
        examineText:
          "Your reflection is a half-second slow to catch up with you. You decide not to test that again.",
        sanityOnFirstExamine: -5,
        noise: "none",
      },
      {
        id: "tub",
        name: "Hide Behind the Tub",
        examineText: "Cramped and cold, but out of sight of the door.",
        isHideSpot: true,
        noise: "none",
      },
    ],
  },

  bedroom: {
    id: "bedroom",
    name: "The Bedroom",
    palette: "rot",
    dangerLevel: 2,
    description:
      "A narrow bed, neatly made despite everything else in this house. A nightstand and a wardrobe stand against the wall.",
    exits: [{ to: "hallway", label: "Return to the Hallway", noise: "low" }],
    hotspots: [
      {
        id: "mattress",
        name: "Search Under the Mattress",
        examineText: "The mattress is thin. Something crinkles underneath it.",
        givesItem: "journalPage2",
        setsFlag: "page2Read",
        resolveText: "A second torn page. Reading it makes your skin crawl.",
        sanityOnFirstExamine: -4,
        noise: "low",
      },
      {
        id: "nightstand",
        name: "Open the Nightstand Drawer",
        examineText: "A small drawer in the nightstand, slightly ajar.",
        givesItem: "atticKey",
        resolveText: "Inside, a small brass key on a faded ribbon.",
        afterText: "The nightstand drawer, empty now.",
        noise: "low",
      },
      {
        id: "wardrobe",
        name: "Hide in the Wardrobe",
        examineText:
          "It smells of mothballs and something else, underneath. There's just enough room.",
        isHideSpot: true,
        noise: "none",
      },
    ],
  },

  cellar: {
    id: "cellar",
    name: "The Cellar",
    palette: "void",
    dangerLevel: 3,
    firstVisitText:
      "The stairs groan under you. Cold, wet stone, and a darkness at the edges that the meager light doesn't reach. This feels like the room the house built itself around.",
    description:
      "Cold stone, a workbench, an old wine rack against the far wall, and a fuse box hanging open.",
    exits: [
      {
        to: "diningHall",
        label: "Go back up to the Dining Hall",
        noise: "low",
      },
    ],
    hotspots: [
      {
        id: "workbench",
        name: "Search the Workbench",
        examineText:
          "Tools, rust, and — half-buried under a rag — a fat copper fuse.",
        requiresItem: "matches",
        lockedText:
          "It's too dark in this corner to make anything out. You need a light.",
        givesItem: "copperFuse",
        resolveText: "You take the fuse.",
        afterText: "Just tools and rust now.",
        noise: "low",
      },
      {
        id: "fuseBox",
        name: "Fix the Fuse Box",
        examineText:
          "An old fuse box, one socket empty where a fuse should sit.",
        requiresItem: "copperFuse",
        consumesItem: true,
        setsFlag: "powerRestored",
        resolveText:
          "You seat the fuse. Somewhere above, lights stutter on for the first time since you woke here. The hum of electricity feels like the first honest sound in this house.",
        noise: "medium",
      },
      {
        id: "wineRack",
        name: "Search the Wine Rack",
        examineText:
          "Bottles gone to vinegar, and behind them, wedged into the stone, something metallic.",
        requiresItem: "matches",
        lockedText:
          "It's too dark in this corner to make anything out. You need a light.",
        givesItem: "sigilVine",
        resolveText:
          "You work loose a disc of green-black bronze — the Vine sigil.",
        afterText: "Empty bottles, nothing more.",
        noise: "low",
      },
      {
        id: "cellarNote",
        name: "Read the Note Pinned to the Wall",
        examineText:
          "A note, pinned with a rusted nail: 'It was born here, or it was kept here, I no longer know which. We do not go into the ninth room. There is no ninth room. That is the point.'",
        setsFlag: "cellarNoteRead",
        sanityOnFirstExamine: -4,
        requiresItem: "matches",
        lockedText: "You can't read anything in this dark. You need a light.",
        noise: "none",
      },
    ],
  },

  attic: {
    id: "attic",
    name: "The Attic",
    palette: "void",
    dangerLevel: 3,
    firstVisitText:
      "Dust and slanted beams and a single small window admitting a sliver of grey light. An old trunk sits beneath it, bound shut with rope.",
    description:
      "Dust, slanted beams, a sliver of grey window-light, and a bound trunk.",
    exits: [
      { to: "hallway", label: "Go back down to the Hallway", noise: "low" },
    ],
    hotspots: [
      {
        id: "trunk",
        name: "Cut the Rope Binding the Trunk",
        examineText: "An old trunk, tied shut with rope gone stiff with age.",
        requiresItem: "kitchenKnife",
        setsFlag: "trunkOpen",
        resolveText:
          "The rope parts easily under the knife. The trunk creaks open.",
        noise: "medium",
      },
      {
        id: "trunkSigil",
        name: "Take the Gold Sigil",
        examineText:
          "Inside the trunk: folded linens, a child's shoe, and a disc of dull gold.",
        requiresFlag: "trunkOpen",
        lockedText: "The trunk is still bound shut.",
        givesItem: "sigilSun",
        setsFlag: "loreTrunk",
        resolveText:
          "You take the Sun sigil. The child's shoe you leave exactly where it is.",
        sanityOnFirstExamine: -5,
        noise: "low",
      },
    ],
  },
};

export const START_ROOM: RoomDef["id"] = "foyer";

export const ROOM_LIST = Object.values(ROOMS);
