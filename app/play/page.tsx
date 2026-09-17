"use client";

import { useGameStore } from "@/game/store";

export default function Play() {
    const currentRoom = useGameStore((s) => s.currentRoom);
    const log = useGameStore((s) => s.log);
    const move = useGameStore((s) => s.move);
    const newGame = useGameStore((s) => s.newGame);

    return (
        <div className="p-24 font-monospace">
            <button onClick={() => newGame()}>New Game</button>
            <p>Current room: {currentRoom}</p>
            <button onClick={() => move({ to: "study", label: "Go to the Study", noise: "low"})}>
                Go to the Study
            </button>
            <pre>{log.map((l) => l.text).join("\n\n")}</pre>
        </div>
    )
}