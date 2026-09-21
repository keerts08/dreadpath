"use client";
import { useState } from "react";
import HomeLayout from "@/components/home-layout";
import Layer from "@/components/layer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { houseAudio } from "@/game/audio";
import { useGameStore } from "@/game/store";
import { hasSaveGame, useHydrated } from "@/game/useHydrated";
import { useRouter } from "next/navigation";

import { Difficulty, Ending } from "@/game/types";
import { CONTENT } from "@/components/ending-screen";

const DIFFICULTIES: Difficulty[] = ["easy", "normal", "hard"];

const ALL_ENDINGS: Exclude<Ending, null>[] = [
  "escaped",
  "banished",
  "caught",
  "madness",
];

const BUTTON =
  "w-full rounded-none border-line bg-transparent py-3 text-sm tracking-widest shadow-none h-auto";

export default function Home() {
  const router = useRouter();
  const hydrated = useHydrated();
  const newGame = useGameStore((s) => s.newGame);

  const audioEnabled = useGameStore((s) => s.audioEnabled);
  const volume = useGameStore((s) => s.volume);
  const reduceMotion = useGameStore((s) => s.reduceMotion);
  const difficulty = useGameStore((s) => s.difficulty)
  const setDifficulty = useGameStore((s) => s.setDifficulty);
  const unlockedEndings = useGameStore((s) => s.unlockedEndings);
  const toggleAudio = useGameStore((s) => s.toggleAudio);
  const setVolume = useGameStore((s) => s.setVolume);
  const toggleReduceMotion = useGameStore((s) => s.toggleReduceMotion);

  const [settingsOpen, setSettingsOpen] = useState(false);

  const canContinue = hydrated && hasSaveGame();

  const begin = (fresh: boolean) => {
    houseAudio.ensureStarted();
    if (fresh) newGame();
    router.push("/play");
  };

  return (
    <HomeLayout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <Layer showRec={false} />
        <div className="relative z-10 max-w-sm w-full text-center space-y-8 py-16 bg-void/50 rounded-xl px-4">
          <div className="space-y-2">
            <h1 className="font-display text-4xl sm:text-5xl text-bone">
              DREADPATH
            </h1>
            <p className="text-xs tracking-widest text-ink-faint caret">
              SOMETHING ELSE LIVES HERE
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <Button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 border px-3 py-2 text-xs tracking-widest uppercase transition-colors ${
                    difficulty === d
                      ? "border-amber text-amber"
                      : "border-line text-ink-dim hover:border-ink-dim hover:text-ink"
                  }`}
                >
                  {d}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => begin(true)}
              variant="outline"
              className={`${BUTTON} hover:border-amber hover:text-amber`}
            >
              PLAY
            </Button>

            {canContinue && (
              <Button
                onClick={() => begin(false)}
                variant="outline"
                className={`${BUTTON} hover:border-amber hover:text-amber`}
              >
                CONTINUE
              </Button>
            )}

            <Button
              onClick={() => setSettingsOpen(true)}
              className={`${BUTTON} text-ink-dim hover:border-ink-dim hover:text-ink`}
            >
              SETTINGS
            </Button>

            <Dialog>
              <DialogTrigger
                render={
                  <Button
                    className={`${BUTTON} text-ink-dim hover:border-ink-dim hover:text-ink`}
                  >
                    ENDINGS
                  </Button>
                }
              />
              <DialogContent
                showCloseButton={false}
                className="max-w-md rounded-none bg-panel text-ink-dim ring-line"
              >
                <DialogHeader>
                  <DialogTitle className="font-display text-base text-bone tracking-widest">
                    ENDINGS
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-2">
                  {ALL_ENDINGS.map((ending) => {
                    const unlocked = unlockedEndings.includes(ending);
                    return (
                      <div
                        key={ending}
                        className="border border-line px-3 py-2 flex items-center justify-between"
                      >
                        <span className="text-ink">
                          {unlocked ? CONTENT[ending].title : "??"}
                        </span>
                        {!unlocked && (
                          <span className="text-[10px] tracking-widest text-ink-faint">
                            LOCKED
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger
                render={
                  <Button
                    className={`${BUTTON} text-ink-dim hover:border-ink-dim hover:text-ink`}
                  >
                    HOW TO PLAY
                  </Button>
                }
              />
              <DialogContent
                showCloseButton={false}
                className="max-w-md rounded-none bg-panel text-ink-dim ring-line"
              >
                <DialogHeader>
                  <DialogTitle className="font-display text-base text-bone tracking-widest">
                    HOW TO PLAY
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    How to play Dreadpath
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 text-sm leading-relaxed text-left">
                  <p>
                    You wake up inside Ravenshade Manor with no memory of how
                    you got there. Explore the house, gather what you find, and
                    get out.
                  </p>
                  <p>
                    You are not alone. Every action — moving, searching, forcing
                    something open — makes noise, and noise draws it closer.
                    Careful, quiet play is safer than rushing.
                  </p>
                  <p>
                    If it gets close, look for somewhere to hide. Staying hidden
                    too long isn&rsquo;t free either — it will start to check.
                  </p>
                  <p>
                    There may be more than one way for your night in this house
                    to end.
                  </p>
                </div>

                <DialogFooter>
                  <DialogClose
                    render={
                      <Button
                        variant="outline"
                        className="h-auto rounded-none border-line bg-transparent px-4 py-2 text-xs tracking-widest shadow-none hover:border-amber hover:text-amber"
                      >
                        CLOSE
                      </Button>
                    }
                  />
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogContent
                showCloseButton={false}
                className="max-w-sm rounded-none bg-panel text-ink-dim ring-line"
              >
                <DialogHeader>
                  <DialogTitle className="font-display text-base text-bone tracking-widest">
                    SETTINGS
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    Sound and accessibility settings
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-5">
                  <div className="flex items-center justify-between text-sm">
                    <span>SOUND</span>
                    <Button
                      onClick={toggleAudio}
                      variant="outline"
                      size="sm"
                      className={`h-auto rounded-none bg-transparent px-3 py-1 shadow-none ${
                        audioEnabled
                          ? "border-amber text-amber"
                          : "border-line text-ink-dim"
                      }`}
                    >
                      {audioEnabled ? "ON" : "OFF"}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] tracking-widest text-ink-faint">
                      <span>VOLUME</span>
                      <span className="text-ink tabular-nums">
                        {Math.round(volume * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      disabled={!audioEnabled}
                      className="w-full accent-amber"
                      aria-label="Volume"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-[11px] tracking-widest text-ink-faint">
                    <input
                      type="checkbox"
                      checked={reduceMotion}
                      onChange={toggleReduceMotion}
                      className="accent-amber"
                    />
                    REDUCE SCREEN SHAKE
                  </label>
                </div>

                <DialogFooter>
                  <DialogClose
                    render={
                      <Button
                        variant="outline"
                        className="h-auto rounded-none border-line bg-transparent px-4 py-2 text-xs tracking-widest shadow-none hover:border-amber hover:text-amber"
                      >
                        CLOSE
                      </Button>
                    }
                  />
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <p className="text-[11px] text-ink-faint leading-relaxed">
              made by keerthii
            </p>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
