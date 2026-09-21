import { RoomId, RoomLayout, Vec2 } from "./types";

const W = 900;
const H = 520;

const WEST_LANDING: Vec2 = { x: 170, y: 270 };
const EAST_LANDING: Vec2 = { x: 730, y: 270 };
const NORTH_LANDING: Vec2 = { x: 450, y: 170 };
const SOUTH_LANDING: Vec2 = { x: 450, y: 350 };

const ATTIC_SOUTH_LANDING: Vec2 = { x: 450, y: 365 };
const CELLAR_NORTH_LANDING: Vec2 = { x: 450, y: 220 };
const LIBRARY_NORTH_LANDING: Vec2 = { x: 490, y: 200 };

const FRONT_DOOR_SPAWN: Vec2 = { x: 450, y: 300 };

export const LAYOUTS: Record<RoomId, RoomLayout> = {
  foyer: {
    width: W,
    height: H,
    playerStart: { x: 450, y: 300 },
    walls: [],
    doors: [
      {
        exitLabel: "Go to the Study",
        zone: { x: 40, y: 220, w: 20, h: 100 },
        spawn: EAST_LANDING,
      },
      {
        exitLabel: "Go to the Dining Hall",
        zone: { x: 840, y: 220, w: 20, h: 100 },
        spawn: WEST_LANDING,
      },
      {
        exitLabel: "Go down the Hallway",
        zone: { x: 400, y: 40, w: 100, h: 20 },
        spawn: SOUTH_LANDING,
      },
      {
        exitLabel: "Open the Front Door",
        zone: { x: 400, y: 460, w: 100, h: 20 },
        spawn: FRONT_DOOR_SPAWN,
      },
    ],
    hotspotZones: [
      { hotspotId: "chandelier", zone: { x: 400, y: 120, w: 100, h: 70 } },
      { hotspotId: "doorMechanism", zone: { x: 305, y: 400, w: 90, h: 50 } },
      { hotspotId: "placeWards", zone: { x: 405, y: 400, w: 90, h: 50 } },
      { hotspotId: "speakName", zone: { x: 505, y: 400, w: 90, h: 50 } },
    ],
    entitySpawn: { x: 100, y: 100 },
  },
  study: {
    width: W,
    height: H,
    playerStart: { x: 450, y: 320 },
    walls: [{ x: 380, y: 120, w: 140, h: 110 }],
    doors: [
      {
        exitLabel: "Return to the Foyer",
        zone: { x: 840, y: 220, w: 20, h: 100 },
        spawn: WEST_LANDING,
      },
      {
        exitLabel: "Go to the Library",
        zone: { x: 400, y: 460, w: 100, h: 20 },
        spawn: LIBRARY_NORTH_LANDING,
      },
    ],
    hotspotZones: [
      { hotspotId: "desk", zone: { x: 380, y: 120, w: 140, h: 60 } },
      { hotspotId: "drawer", zone: { x: 380, y: 190, w: 140, h: 40 } },
      { hotspotId: "drawerKey", zone: { x: 380, y: 240, w: 60, h: 35 } },
      { hotspotId: "drawerPage", zone: { x: 460, y: 240, w: 60, h: 35 } },
      { hotspotId: "portrait", zone: { x: 670, y: 120, w: 60, h: 90 } },
    ],
    entitySpawn: { x: 780, y: 420 },
  },
  library: {
    width: W,
    height: H,
    walls: [
      { x: 350, y: 120, w: 120, h: 60 },
      { x: 550, y: 120, w: 120, h: 120 },
    ],
    playerStart: { x: 450, y: 320 },
    doors: [
      {
        exitLabel: "Return to the Study",
        zone: { x: 400, y: 40, w: 100, h: 20 },
        spawn: SOUTH_LANDING,
      },
    ],
    hotspotZones: [
      { hotspotId: "loreBooks", zone: { x: 350, y: 120, w: 120, h: 60 } },
      { hotspotId: "bookshelf", zone: { x: 550, y: 120, w: 120, h: 60 } },
      { hotspotId: "sigilMoonSpot", zone: { x: 550, y: 190, w: 120, h: 50 } },
    ],
    entitySpawn: { x: 780, y: 420 },
  },
  diningHall: {
    width: W,
    height: H,
    playerStart: { x: 450, y: 380 },
    walls: [{ x: 350, y: 200, w: 200, h: 70 }],
    doors: [
      {
        exitLabel: "Return to the Foyer",
        zone: { x: 40, y: 220, w: 20, h: 100 },
        spawn: EAST_LANDING,
      },
      {
        exitLabel: "Go to the Kitchen",
        zone: { x: 840, y: 220, w: 20, h: 100 },
        spawn: WEST_LANDING,
      },
      {
        exitLabel: "Unlock the Cellar Door",
        zone: { x: 400, y: 460, w: 100, h: 20 },
        spawn: CELLAR_NORTH_LANDING,
      },
    ],
    hotspotZones: [
      { hotspotId: "table", zone: { x: 350, y: 200, w: 200, h: 70 } },
      { hotspotId: "pushedChair", zone: { x: 380, y: 300, w: 80, h: 50 } },
    ],
    entitySpawn: { x: 780, y: 100 },
  },
  kitchen: {
    width: W,
    height: H,
    playerStart: { x: 450, y: 260 },
    walls: [
      { x: 300, y: 120, w: 140, h: 50 },
      { x: 520, y: 120, w: 80, h: 50 },
    ],
    doors: [
      {
        exitLabel: "Return to the Dining Hall",
        zone: { x: 40, y: 220, w: 20, h: 100 },
        spawn: EAST_LANDING,
      },
    ],
    hotspotZones: [
      { hotspotId: "counter", zone: { x: 300, y: 120, w: 140, h: 50 } },
      { hotspotId: "knifeBlock", zone: { x: 520, y: 120, w: 80, h: 50 } },
      { hotspotId: "pantry", zone: { x: 700, y: 300, w: 100, h: 80 } },
    ],
    entitySpawn: { x: 750, y: 120 },
  },
  hallway: {
    width: W,
    height: H,
    playerStart: { x: 450, y: 380 },
    walls: [],
    doors: [
      {
        exitLabel: "Return to the Foyer",
        zone: { x: 400, y: 460, w: 100, h: 20 },
        spawn: NORTH_LANDING,
      },
      {
        exitLabel: "Go to the Bedroom",
        zone: { x: 840, y: 220, w: 20, h: 100 },
        spawn: WEST_LANDING,
      },
      {
        exitLabel: "Go to the Bathroom",
        zone: { x: 40, y: 220, w: 20, h: 100 },
        spawn: EAST_LANDING,
      },
      {
        exitLabel: "Unlock the Attic Stairs",
        zone: { x: 400, y: 40, w: 100, h: 20 },
        spawn: ATTIC_SOUTH_LANDING,
      },
    ],
    hotspotZones: [
      { hotspotId: "wallpaper", zone: { x: 520, y: 180, w: 140, h: 60 } },
    ],
    entitySpawn: { x: 100, y: 400 },
  },
  bathroom: {
    width: W,
    height: H,
    playerStart: { x: 500, y: 260 },
    walls: [],
    doors: [
      {
        exitLabel: "Return to the Hallway",
        zone: { x: 840, y: 220, w: 20, h: 100 },
        spawn: WEST_LANDING,
      },
    ],
    hotspotZones: [
      { hotspotId: "mirror", zone: { x: 300, y: 120, w: 80, h: 100 } },
      { hotspotId: "tub", zone: { x: 350, y: 330, w: 140, h: 80 } },
    ],
    entitySpawn: { x: 700, y: 400 },
  },
  bedroom: {
    width: W,
    height: H,
    playerStart: { x: 450, y: 260 },
    walls: [
      { x: 350, y: 300, w: 160, h: 60 },
      { x: 550, y: 300, w: 70, h: 50 },
    ],
    doors: [
      {
        exitLabel: "Return to the Hallway",
        zone: { x: 40, y: 220, w: 20, h: 100 },
        spawn: EAST_LANDING,
      },
    ],
    hotspotZones: [
      { hotspotId: "mattress", zone: { x: 350, y: 300, w: 160, h: 60 } },
      { hotspotId: "nightstand", zone: { x: 550, y: 300, w: 70, h: 50 } },
      { hotspotId: "wardrobe", zone: { x: 650, y: 120, w: 90, h: 110 } },
    ],
    entitySpawn: { x: 100, y: 120 },
  },
  cellar: {
    width: W,
    height: H,
    playerStart: { x: 450, y: 260 },
    walls: [
      { x: 350, y: 120, w: 140, h: 60 },
      { x: 550, y: 120, w: 70, h: 60 },
      { x: 350, y: 340, w: 160, h: 60 },
    ],
    doors: [
      {
        exitLabel: "Go back up to the Dining Hall",
        zone: { x: 400, y: 40, w: 100, h: 20 },
        spawn: SOUTH_LANDING,
      },
    ],
    hotspotZones: [
      { hotspotId: "workbench", zone: { x: 350, y: 120, w: 140, h: 60 } },
      { hotspotId: "fuseBox", zone: { x: 550, y: 120, w: 70, h: 60 } },
      { hotspotId: "wineRack", zone: { x: 350, y: 340, w: 160, h: 60 } },
      { hotspotId: "cellarNote", zone: { x: 600, y: 300, w: 70, h: 50 } },
    ],
    entitySpawn: { x: 780, y: 420 },
  },
  attic: {
    width: W,
    height: H,
    playerStart: { x: 450, y: 400 },
    walls: [
      { x: 360, y: 220, w: 120, h: 70 },
      { x: 500, y: 220, w: 90, h: 60 },
    ],
    doors: [
      {
        exitLabel: "Go back down to the Hallway",
        zone: { x: 400, y: 460, w: 100, h: 20 },
        spawn: NORTH_LANDING,
      },
      {
        exitLabel: "Squeeze Into the CrawlSpace",
        zone: { x: 400, y: 40, w: 100, h: 20 },
        spawn: { x: 450, y: 400 },
      },
    ],
    hotspotZones: [
      { hotspotId: "trunk", zone: { x: 360, y: 220, w: 120, h: 70 } },
      { hotspotId: "trunkSigil", zone: { x: 500, y: 220, w: 90, h: 60 } },
    ],
    entitySpawn: { x: 100, y: 120 },
  },
  crawlspace: {
    width: W,
    height: H,
    playerStart: { x: 450, y: 400 },
    walls: [{ x: 380, y: 150, w: 140, h: 90 }],
    doors: [
      {
        exitLabel: "Squeeze Back Into the Attic",
        zone: { x: 400, y: 460, w: 100, h: 20 },
        spawn: SOUTH_LANDING,
      },
    ],
    hotspotZones: [
      { hotspotId: "bundle", zone: { x: 380, y: 150, w: 140, h: 90 } },
    ],
    entitySpawn: { x: 100, y: 120 },
  },
};
