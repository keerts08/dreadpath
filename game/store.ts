"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Ending,
  EntityState,
  ExitDef,
  GameState,
  HotspotDef,
  ItemId,
  LogEntry,
  LogTone,
  NoiseLevel,
} from "./types";
import { ITEM_NAMES, ROOMS, START_ROOM } from "./world";
import { tickEntity, tensionBand } from "./entity";
import {
  AMBIENT_CLOSE,
  AMBIENT_NOTICED,
  AMBIENT_VERY_CLOSE,
  CLOSE_CALL_LINES,
  HALLUCINATION_ROOM_LINES,
  SANITY_LOW_SYSTEM_LINES,
  pick,
} from "./narrative";

const INITIAL_ENTITY: EntityState = {
  distance: 100,
  alertness: 8,
  lastEvent: null,
};

function freshState(started = false): GameState {
  return {
    started,
    ending: null,
    turn: 0,
    currentRoom: START_ROOM,
    visitedRooms: [START_ROOM],
    inventory: [],
    flags: {},
    resolvedHotspots: [],
    examinedOnce: [],
    sanity: 100,
    entity: { ...INITIAL_ENTITY },
    isHidden: false,
    hideStreak: 0,
    log: [
      makeEntry(
        0,
        ROOMS[START_ROOM].firstVisitText ?? ROOMS[START_ROOM].description,
        "narration",
      ),
    ],
    audioEnabled: true,
    volume: 0.75,
    reduceMotion: false,
  };
}

let logCounter = 0;
function makeEntry(turn: number, text: string, tone: LogTone): LogEntry {
  logCounter += 1;
  return { id: `l${logCounter}-${turn}`, turn, text, tone };
}

function pickText(text: string | string[], variant: number): string {
  if (Array.isArray(text)) return text[Math.min(variant, text.length - 1)];
  return text;
}

interface GameActions {
  newGame: () => void;
  move: (exit: ExitDef) => void;
  interact: (hotspot: HotspotDef) => void;
  hide: () => void;
  stopHiding: () => void;
  ambientTick: () => void;
  pulseNosie: (noise: NoiseLevel) => void;
  capture: () => void;
  toggleAudio: () => void;
  setVolume: (volume: number) => void;
  toggleReduceMotion: () => void;
}

type Store = GameState & GameActions;
type SetFn = (partial: Partial<Store> | ((s: Store) => Partial<Store>)) => void;

function recomputeDerivedFlags(
  flags: Record<string, boolean>,
  inventory: ItemId[],
) {
  const has = (id: ItemId) => inventory.includes(id);
  flags.bothPagesRead = !!(flags.page1Read && flags.page2Read);
  flags.hasAllSigilsAndPower = !!(
    has("sigilMoon") &&
    has("sigilSun") &&
    has("sigilVine") &&
    flags.powerRestored
  );
  flags.loreComplete = !!(
    flags.page1Read &&
    flags.page2Read &&
    flags.portraitSeen &&
    flags.cellarNoteRead &&
    flags.loreTrunk &&
    flags.recordsRead
  );
}

export const useGameStore = create<Store>()(
  persist(
    (set, get) => ({
      ...freshState(),

      newGame: () => set(freshState(true)),
      toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      toggleReduceMotion: () => set((s) => ({ reduceMotion: !s.reduceMotion })),

      move: (exit) => {
        const s = get();
        if (s.ending) return;
        if (exit.requiresItem && !s.inventory.includes(exit.requiresItem)) {
          appendLog(
            set,
            s.turn,
            exit.lockedText ?? "That won't budge.",
            "dread",
          );
          return;
        }
        if (exit.requiresFlag && !s.flags[exit.requiresFlag]) {
          appendLog(set, s.turn, exit.lockedText ?? "Not yet.", "dread");
          return;
        }
        if (exit.endsGameAs) {
          finishGame(set, get, exit.endsGameAs);
          return;
        }
        const turn = s.turn + 1;
        const visited = s.visitedRooms.includes(exit.to)
          ? s.visitedRooms
          : [...s.visitedRooms, exit.to];
        const room = ROOMS[exit.to];
        const isFirstVisit = !s.visitedRooms.includes(exit.to);
        set({
          currentRoom: exit.to,
          visitedRooms: visited,
          turn,
          isHidden: false,
          hideStreak: 0,
        });
        appendLog(
          set,
          turn,
          isFirstVisit && room.firstVisitText
            ? room.firstVisitText
            : room.description,
          "narration",
        );
        runEntityTick(set, get, exit.noise, room.dangerLevel);
        checkEndings(set, get);
        maybeHallucinate(set, get);
      },

      interact: (hotspot) => {
        const s = get();
        if (s.ending || s.isHidden) return;
        if (
          hotspot.requiresItem &&
          !s.inventory.includes(hotspot.requiresItem)
        ) {
          appendLog(
            set,
            s.turn,
            hotspot.lockedText ?? "You need something else for that.",
            "dread",
          );
          return;
        }
        if (hotspot.requiresFlag && !s.flags[hotspot.requiresFlag]) {
          appendLog(set, s.turn, hotspot.lockedText ?? "Not yet.", "dread");
          return;
        }
        const alreadyResolved = s.resolvedHotspots.includes(hotspot.id);
        const text = alreadyResolved
          ? (hotspot.afterText ?? pickText(hotspot.examineText, 1))
          : (hotspot.resolveText ?? pickText(hotspot.examineText, 0));
        appendLog(set, s.turn, text, "narration");

        const newFlags = { ...s.flags };
        let newInventory = [...s.inventory];
        let newResolved = s.resolvedHotspots;
        if (!alreadyResolved) {
          if (hotspot.givesItem) {
            newInventory.push(hotspot.givesItem);
            appendLog(
              set,
              s.turn,
              `Obtained: ${ITEM_NAMES[hotspot.givesItem]}.`,
              "item",
            );
          }
          if (hotspot.consumesItem && hotspot.requiresItem) {
            newInventory = newInventory.filter(
              (i) => i !== hotspot.requiresItem,
            );
          }
          if (hotspot.setsFlag) newFlags[hotspot.setsFlag] = true;
          newResolved = [...s.resolvedHotspots, hotspot.id];
        }
        recomputeDerivedFlags(newFlags, newInventory);

        let sanity = s.sanity;
        let examinedOnce = s.examinedOnce;
        if (
          !s.examinedOnce.includes(hotspot.id) &&
          hotspot.sanityOnFirstExamine
        ) {
          sanity = clampSanity(sanity + hotspot.sanityOnFirstExamine);
          examinedOnce = [...s.examinedOnce, hotspot.id];
        }

        const turn = s.turn + 1;
        set({
          flags: newFlags,
          inventory: newInventory,
          resolvedHotspots: newResolved,
          sanity,
          examinedOnce,
          turn,
        });

        if (hotspot.endsGameAs) {
          finishGame(set, get, hotspot.endsGameAs);
          return;
        }
        const room = ROOMS[s.currentRoom];
        runEntityTick(set, get, hotspot.noise, room.dangerLevel);
        checkEndings(set, get);
        maybeHallucinate(set, get);
      },

      hide: () => {
        const s = get();
        if (s.ending || s.isHidden) return;
        const turn = s.turn + 1;
        set({ isHidden: true, hideStreak: 0, turn });
        appendLog(
          set,
          turn,
          "You tuck yourself out of sight and go still.",
          "system",
        );
        runEntityTick(set, get, "none", ROOMS[s.currentRoom].dangerLevel);
        checkEndings(set, get);
      },

      stopHiding: () => {
        const s = get();
        if (s.ending || !s.isHidden) return;
        set({ isHidden: false, hideStreak: 0 });
        appendLog(
          set,
          s.turn,
          "You ease back out, joints stiff from holding still.",
          "system",
        );
      },

      ambientTick: () => {
        const s = get();
        if (s.ending) return;
        const turn = s.turn + 1;
        const hideStreak = s.isHidden ? s.hideStreak + 1 : 0;
        set({ turn, hideStreak });
        runEntityTick(set, get, "none", ROOMS[s.currentRoom].dangerLevel);
        checkEndings(set, get);
        if (!s.isHidden) maybeHallucinate(set, get);
      },

      pulseNosie: (noise) => {
        const s = get();
        if (s.ending || s.isHidden) return;
        runEntityTick(set, get, noise, ROOMS[s.currentRoom].dangerLevel);
        checkEndings(set, get);
      },

      capture: () => {
        const s = get();
        if (s.ending || s.isHidden) return;
        appendLog(set, s.turn, "It has you now.", "dread");
        finishGame(set, get, "caught");
      },
    }),
    { name: "ravenshade-manor-save" },
  ),
);

function clampSanity(n: number) {
  return Math.max(0, Math.min(100, n));
}

function appendLog(set: SetFn, turn: number, text: string, tone: LogTone) {
  set((s) => ({ log: [...s.log, makeEntry(turn, text, tone)].slice(-200) }));
}

function runEntityTick(
  set: SetFn,
  get: () => Store,
  noise: Parameters<typeof tickEntity>[0]["noise"],
  dangerLevel: 0 | 1 | 2 | 3,
) {
  const s = get();
  const prevBand = tensionBand(s.entity.distance);
  const result = tickEntity({
    entity: s.entity,
    noise,
    dangerLevel,
    isHidden: s.isHidden,
    hideStreak: s.hideStreak,
  });

  if (result.foundWhileHidden) {
    set({ entity: { ...result.entity, distance: 0 } });
    appendLog(
      set,
      s.turn,
      "It finds you anyway. There is no more hiding from this.",
      "dread",
    );
    finishGame(set, get, "caught");
    return;
  }
  set({ entity: result.entity });

  if (result.closeCall) {
    appendLog(set, s.turn, pick(CLOSE_CALL_LINES), "whisper");
    set((st) => ({ sanity: clampSanity(st.sanity - 2) }));
  } else {
    const newBand = tensionBand(result.entity.distance);
    if (newBand !== prevBand) {
      if (newBand === "noticed")
        appendLog(set, s.turn, pick(AMBIENT_NOTICED), "whisper");
      else if (newBand === "close") {
        appendLog(set, s.turn, pick(AMBIENT_CLOSE), "whisper");
        set((st) => ({ sanity: clampSanity(st.sanity - 1) }));
      } else if (newBand === "veryClose" || newBand === "chase") {
        appendLog(set, s.turn, pick(AMBIENT_VERY_CLOSE), "dread");
        set((st) => ({ sanity: clampSanity(st.sanity - 2) }));
      }
    }
  }

  if (result.captured) {
    appendLog(set, s.turn, "It has you now.", "dread");
    finishGame(set, get, "caught");
  }
}

function maybeHallucinate(set: SetFn, get: () => Store) {
  const s = get();
  if (s.ending || s.sanity >= 40 || Math.random() > 0.3) return;
  const roomLines = HALLUCINATION_ROOM_LINES[s.currentRoom];
  const line =
    roomLines && Math.random() < 0.5
      ? pick(roomLines)
      : pick(SANITY_LOW_SYSTEM_LINES);
  appendLog(set, s.turn, line, "hallucination");
}

function checkEndings(set: SetFn, get: () => Store) {
  if (get().ending) return;
  if (get().sanity <= 0) finishGame(set, get, "madness");
}

function finishGame(set: SetFn, get: () => Store, ending: Ending) {
  if (get().ending) return;
  set({ ending });
}
