export type RoomId = "foyer" | "study";

export type ItemId = "letterOpener" | "rustyKey" | "journalPage1";

export type NoiseLevel = "none" | "low" | "medium" | "high";

export type Ending = "escaped" | "banished" | "caught" | "madness" | null;

export type LogTone =
  | "narration"
  | "system"
  | "dread"
  | "whisper"
  | "item"
  | "hallucination";

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
  requiredItem?: ItemId;
  consumesItem?: boolean;
  requiredFlag?: string;
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
}
