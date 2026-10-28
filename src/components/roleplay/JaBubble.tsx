"use client";

import { useState } from "react";
import { ChevronDown, Languages } from "lucide-react";
import { PlayButtons } from "../AudioControls";
import { PitchAccentVisualizer } from "../PitchAccentVisualizer";
import { ScriptLayer } from "../ScriptLayer";
import type { JaLine } from "@/lib/types";

/** Uma fala em japonês: áudio, mapa de moras expansível, camada ortográfica e tradução sob demanda. */
export function JaBubble({
  line,
  speaker,
  defaultOpen = false,
  playingExternally = false,
}: {
  line: JaLine;
  speaker?: string;
  defaultOpen?: boolean;
  playingExternally?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [showPt, setShowPt] = useState(false);
  const [playing, setPlaying] = useState(false);

  return (
    <div className="max-w-full space-y-3 rounded-2xl rounded-tl-sm border border-[var(--line)] bg-[var(--panel)] p-4">
      {speaker && <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">{speaker}</p>}
      <div className="flex flex-wrap items-center gap-2">
        <PlayButtons line={{ kana: line.kana }} size="sm" onPlaying={(on) => setPlaying(on)} />
        <button
          onClick={() => setOpen(!open)}
          className="flex h-8 items-center gap-1 rounded-xl border border-[var(--line)] px-2.5 text-xs text-[var(--muted)]"
        >
          Mapa de moras <ChevronDown size={14} className={open ? "rotate-180" : ""} />
        </button>
        <button
          onClick={() => setShowPt(!showPt)}
          className="flex h-8 items-center gap-1 rounded-xl border border-[var(--line)] px-2.5 text-xs text-[var(--muted)]"
        >
          <Languages size={14} /> {showPt ? "Ocultar" : "Tradução"}
        </button>
        {line.pitch_estimado && <span className="text-[10px] text-[var(--muted)]">pitch estimado pela IA</span>}
      </div>
      {open && <PitchAccentVisualizer moras={line.moras} size="sm" playing={playing || playingExternally} />}
      <ScriptLayer kana={line.kana} kanji={line.kanji} className="text-xl" />
      {showPt && (
        <div className="text-sm">
          <p>{line.pt}</p>
          {line.literal && <p className="text-[var(--muted)]">↳ {line.literal}</p>}
        </div>
      )}
    </div>
  );
}
