export type RoomId =
  | "foyer"
  | "study"
  | "library"
  | "diningHall"
  | "kitchen"
  | "hallway"
  | "bathroom"
  | "bedroom"
  | "cellar"
  | "attic"
  | "crawlspace";

export type ItemId =
  | "letterOpener"
  | "rustyKey"
  | "journalPage1"
  | "journalPage2"
  | "matches"
  | "kitchenKnife"
  | "copperFuse"
  | "atticKey"
  | "sigilMoon"
  | "sigilSun"
  | "sigilVine"
  | "fadedPhotograph";

export type NoiseLevel = "none" | "low" | "medium" | "high";

export type Ending = "escaped" | "banished" | "caught" | "madness" | null;

export type Difficulty = "easy" | "normal" | "hard";

export type LogTone =
  "narration" | "system" | "dread" | "whisper" | "item" | "hallucination";

export interface LogEntry {
  id: string;
  turn: number;
  text: string;
  tone: LogTone;
}

export interface HotspotDef {
  id: string;
  name: string;
  examineText: string | string[];
  givesItem?: ItemId;
  requiresItem?: ItemId;
  consumesItem?: boolean;
  requiresFlag?: string;
  lockedText?: string;
  setsFlag?: string;
  resolveText?: string;
  afterText?: string;
  isHideSpot?: boolean;
  noise: NoiseLevel;
  sanityOnFirstExamine?: number;
  endsGameAs?: Ending;
}

export interface ExitDef {
  to: RoomId;
  label: string;
  requiresItem?: ItemId;
  requiresFlag?: string;
  lockedText?: string;
  noise: NoiseLevel;
  endsGameAs?: Ending;
}

export interface RoomDef {
  id: RoomId;
  name: string;
  description: string;
  firstVisitText?: string;
  dangerLevel: 0 | 1 | 2 | 3;
  exits: ExitDef[];
  hotspots: HotspotDef[];
  palette: "amber" | "cold" | "rot" | "void";
}

export interface EntityState {
  distance: number;
  alertness: number;
  lastEvent: string | null;
}

export interface GameState {
  started: boolean;
  ending: Ending;
  turn: number;
  currentRoom: RoomId;
  visitedRooms: RoomId[];
  inventory: ItemId[];
  flags: Record<string, boolean>;
  resolvedHotspots: string[];
  examinedOnce: string[];
  sanity: number;
  entity: EntityState;
  isHidden: boolean;
  hideStreak: number;
  log: LogEntry[];
  audioEnabled: boolean;
  volume: number;
  reduceMotion: boolean;
  difficulty: Difficulty;
  unlockedEndings: Exclude<Ending, null>[];
}

export interface Vec2 {
  x: number;
  y: number;
}

export interface RectZone {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DoorZone {
  exitLabel: string;
  zone: RectZone;
  spawn: Vec2;
}

export interface HotspotZone {
  hotspotId: string;
  zone: RectZone;
  shape?: "circle";
}

export interface RoomLayout {
  width: number;
  height: number;
  playerStart: Vec2;
  walls: RectZone[];
  doors: DoorZone[];
  hotspotZones: HotspotZone[];
  entitySpawn: Vec2;
}
