"use client";

import { Lock } from "lucide-react";
import { parseFurigana, stripFurigana } from "@/lib/text";
import { usePhase } from "./PhaseProvider";

interface Props {
  kana: string;
  kanji: string;
  className?: string;
  /** mostra um aviso discreto na Fase 1 em vez de não renderizar nada */
  lockedHint?: boolean;
}

/** Aplica a camada ortográfica da fase atual. Na Fase 1 nada de escrita japonesa aparece. */
export function ScriptLayer({ kana, kanji, className = "", lockedHint = false }: Props) {
  const { fase } = usePhase();
  if (fase === 1) {
    return lockedHint ? (
      <p className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
        <Lock size={12} /> Escrita oculta na Fase 1 — confie no som.
      </p>
    ) : null;
  }
  if (fase === 2) return <p className={`font-jp text-2xl tracking-wide ${className}`}>{kana}</p>;
  if (fase === 4) return <p className={`font-jp text-2xl tracking-wide ${className}`}>{stripFurigana(kanji)}</p>;
  return (
    <p className={`font-jp text-2xl leading-[2.4] tracking-wide ${className}`}>
      {parseFurigana(kanji).map((s, i) =>
        s.ruby ? (
          <ruby key={i}>
            {s.text}
            <rt className="text-[11px] text-[var(--muted)]">{s.ruby}</rt>
          </ruby>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </p>
  );
}
