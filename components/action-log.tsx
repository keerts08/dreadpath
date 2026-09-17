"use client"

import { LogEntry } from "@/game/types";
import { useEffect, useRef } from "react";

const TONE_CLASS: Record<LogEntry["tone"], string> = {
    narration: "text-ink",
    system: "text-ink-dim italic",
    dread: "text-blood-bright",
    whisper: "text-ink-dim italic",
    item: "text-amber",
    hallucination: "text-sick line-through decoration-1"
}

export default function ActionLog({entries} : {entries: LogEntry[]}) {
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ block: "end" })
    }, [entries.length])

    return (
      <div className="dread-scroll h-56 sm:h-64 overflow-y-auto border">
        {entries.map((e) => (
          <p key={e.id} className={TONE_CLASS[e.tone]}>
            {e.tone === "whisper" && (
              <span className="opacity-60">&ldquo;</span>
            )}
            {e.text}
            {e.tone === "whisper" && (
              <span className="opacity-60">&rdquo;</span>
            )}
          </p>
        ))}
        <div ref={bottomRef} />
      </div>
    );
}