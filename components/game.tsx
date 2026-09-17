import { useGameStore } from "@/game/store";
import { useHydrated } from "@/game/useHydrated";
import { useRouter } from "next/navigation";
import Layer from "./layer";
import { useState } from "react";
import { ROOMS } from "@/game/world";
import { tensionBand } from "@/game/entity";
import JumpscareOverlay from "./jumpscare";
import EndingScreen from "./ending-screen";
import CorruptionWrapper from "./corruption-wrapper";
import RoomStage from "./room-stage";
import StatusHUD from "./status-hud";
import ActionLog from "./action-log";
import ChoicePanel from "./choice-panel";
import Inventory from "./inventory";

export default function Game() {
    const hydrated = useHydrated();
    const router = useRouter();
    const [scareShown, setScareShown] = useState(false);

    const started = useGameStore((s) => s.started)
    const ending = useGameStore((s) => s.ending);
    const turn = useGameStore((s) => s.turn);
    const currentRoom = useGameStore((s) => s.currentRoom);
    const inventory = useGameStore((s) => s.inventory);
    const flags = useGameStore((s) => s.flags);
    const sanity = useGameStore((s) => s.sanity);
    const entity = useGameStore((s) => s.entity);
    const isHidden = useGameStore((s) => s.isHidden);
    const log = useGameStore((s) => s.log);
    const audioEnabled = useGameStore((s) => s.audioEnabled);

    const move = useGameStore((s) => s.move);
    const interact = useGameStore((s) => s.interact);
    const hide = useGameStore((s) => s.hide);
    const stopHiding = useGameStore((s) => s.stopHiding);
    const wait = useGameStore((s) => s.wait);
    const toggleAudio = useGameStore((s) => s.toggleAudio);
    const newGame = useGameStore((s) => s.newGame);

    if (!hydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center text-ink-dim text-sm tracking-widest">
                LOADING...
            </div>
        )
    }

    if (!started) {
        router.replace("/")
        return null
    }

    const room = ROOMS[currentRoom]
    const band = tensionBand(entity.distance)
    const lowSanity = sanity < 40;
    const hasHideSpot = room.hotspots.some((h) => h.isHideSpot);

    const showJumpscare = ending === "caught" && !scareShown;
    const showEnding = ending && (ending !== "caught" || scareShown)

    return (
        <div className="min-h-screen">
            <Layer />
            {showJumpscare && <JumpscareOverlay onDone={() => setScareShown(true)} />}
                {showEnding && (
                    <EndingScreen
                    ending={ending}
                    onRestart={() => {
                        newGame();
                        setScareShown(false);
                        router.push("/");
                    }}
                    />
                )}

                <CorruptionWrapper band={band} lowSanity={lowSanity}>
                    <div className="mx-auto max-w-2xl px-4 py-6 space-y-3">
                        <RoomStage room={room} band={band} isHidden={isHidden} />
                        <StatusHUD sanity={sanity} band={band} isHidden={isHidden} turn={turn} />
                        <p className="text-sm text-ink-dim italic leading-relaxed">{room.description}</p>
                        <ActionLog entries={log}/>
                        <ChoicePanel
                        room={room}
                        flags={flags}
                        isHidden={isHidden}
                        hasHideSpot={hasHideSpot}
                        onMove={move}
                        onInteract={interact}
                        onHide={hide}
                        onStopHiding={stopHiding}
                        onWait={wait}
                        />
                        <Inventory items={inventory}/>
                        </div>
                </CorruptionWrapper>
        </div>
    )

}