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
    children,
}: {
    band: TensionBand;
    lowSanity: boolean;
    children: ReactNode;
}) {
    const cls = [BAND_CLASS[band], lowSanity ? "tension-2" : ""].filter(Boolean).join(" ");
    return <div className={`corruption-root ${cls}`}>{children}</div> 
}