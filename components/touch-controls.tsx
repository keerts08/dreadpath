"use client";

type DirKey = "w" | "a" | "s" | "d";

const BUTTON =
  "pointer-events-auto flex items-center justify-center border border-line bg-panel/40 text-ink-dim select-none";

function DirButton({
  label,
  dirKey,
  onDown,
  onUp,
  className,
}: {
  label: string;
  dirKey: DirKey;
  onDown: (key: string) => void;
  onUp: (key: string) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={`Move ${label}`}
      onPointerDown={(e) => {
        e.preventDefault();
        onDown(dirKey);
      }}
      onPointerUp={() => onUp(dirKey)}
      onPointerLeave={() => onUp(dirKey)}
      onPointerCancel={() => onUp(dirKey)}
      style={{ touchAction: "none" }}
      className={`${BUTTON} h-12 w-12 text-lg active:border-amber active:text-amber ${className ?? ""}`}
    >
      {label}
    </button>
  );
}

export default function TouchControls({
  running,
  onDirDown,
  onDirUp,
  onInteract,
  onRunToggle,
}: {
  running: boolean;
  onDirDown: (key: string) => void;
  onDirUp: (key: string) => void;
  onInteract: () => void;
  onRunToggle: () => void;
}) {
  return (
    <div className="absolute inset-0 z-10 hidden small-touch:flex pointer-events-none select-none">
      <div className="absolute bottom-4 left-4 grid grid-cols-3 grid-rows-3 gap-1">
        <div />
        <DirButton label="▲" dirKey="w" onDown={onDirDown} onUp={onDirUp} />
        <div />
        <DirButton label="◀" dirKey="a" onDown={onDirDown} onUp={onDirUp} />
        <button
          type="button"
          aria-label="Toggle run"
          onPointerDown={(e) => {
            e.preventDefault();
            onRunToggle();
          }}
          style={{ touchAction: "none" }}
          className={`${BUTTON} h-12 w-12 text-[10px] tracking-widest ${
            running ? "border-amber text-amber" : ""
          }`}
        >
          RUN
        </button>
        <DirButton label="▶" dirKey="d" onDown={onDirDown} onUp={onDirUp} />
        <div />
        <DirButton label="▼" dirKey="s" onDown={onDirDown} onUp={onDirUp} />
        <div />
      </div>

      <button
        type="button"
        aria-label="Interact"
        onPointerDown={(e) => {
          e.preventDefault();
          onInteract();
        }}
        style={{ touchAction: "none" }}
        className={`${BUTTON} absolute bottom-6 right-6 h-16 w-16 rounded-full text-sm tracking-widest active:border-amber active:text-amber`}
      >
        E
      </button>
    </div>
  );
}
