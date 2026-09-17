import { TensionBand } from "@/game/entity";
import { RoomDef } from "@/game/types";

const PALETTES: Record<
  RoomDef["palette"],
  { bg: string; glow: string; flicker: "flicker-slow" | "flicker-fast" | "" }
> = {
  amber: {
    bg: "radial-gradient(ellipse at 50% 20%, #2a1f10 0%, #150f09 55%, #07080a 100%)",
    glow: "rgba(185,138,74,0.18)",
    flicker: "flicker-slow",
  },
  cold: {
    bg: "radial-gradient(ellipse at 50% 15%, #131a1f 0%, #0d1114 55%, #07080a 100%)",
    glow: "rgba(120,150,170,0.12)",
    flicker: "flicker-slow",
  },
  rot: {
    bg: "radial-gradient(ellipse at 50% 10%, #171c14 0%, #0e120d 55%, #07080a 100%)",
    glow: "rgba(75,90,69,0.16)",
    flicker: "flicker-fast",
  },
  void: {
    bg: "radial-gradient(ellipse at 50% 8%, #120e10 0%, #0a0809 50%, #050505 100%)",
    glow: "rgba(110,20,20,0.12)",
    flicker: "flicker-fast",
  },
};

export default function RoomStage({
  room,
  band,
  isHidden,
}: {
  room: RoomDef;
  band: TensionBand;
  isHidden: boolean;
}) {
  const palette = PALETTES[room.palette];
  const danger = band === "veryClose" || band === "chase";

  return (
    <div
      className="relative overflow-hidden rounded-sm border border-line h-40 sm:h-42 flex items-end"
      style={{ background: palette.bg }}
    >
      <div
        className={`absolute inset-0 ${palette.flicker}`}
        style={{
          background: `radial-gradient(circle at 50% 0%, ${palette.glow}, transparent 65%)`,
        }}
      />
      {danger && (
        <div className="absolute inset-0 bg-blood/10 mix-blend-multiply animate-pulse" />
      )}
      {isHidden && <div className="absolute inset-0 bg-black/55" />}
      <div className="relative z-10 w-full p-4 bg-gradient-to-t from-void/90 via-void/40 to-transparent">
        <p className="font-display text-lg sm:text-xl text-bone">
          {room.name}
          {isHidden && (
            <span className="text-ink-dim text-sm font-body">- hidden</span>
          )}
        </p>
      </div>
    </div>
  );
}
