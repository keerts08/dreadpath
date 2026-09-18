import { TensionBand } from "@/game/entity";
import { ReactNode } from "react";

const BAND_CLASS: Record<TensionBand, string> = {
    far: "",
    noticed: "tension-1",
    close: "tension-2",
    veryClose: "tension-3",
    chase: "tension-4"
}

export default function CorruptionWrapper({
    band,
    lowSanity,
    reduceMotion,
    children,
}: {
    band: TensionBand;
    lowSanity: boolean;
    reduceMotion: boolean;
    children: ReactNode;
}) {
    const bandClass = reduceMotion && BAND_CLASS[band] === "tension-4" ? "tension-3" : BAND_CLASS[band]
    const cls = [bandClass, lowSanity ? "tension-2" : ""].filter(Boolean).join(" ");
    return <div className={`corruption-root ${cls}`}>{children}</div> 
}