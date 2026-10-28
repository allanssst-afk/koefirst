"use client";

import { Check, Layers } from "lucide-react";
import { PitchAccentVisualizer } from "./PitchAccentVisualizer";
import { FASES, usePhase } from "./PhaseProvider";
import { ScriptLayer } from "./ScriptLayer";
import type { Fase, Mora } from "@/lib/types";

const DEMO: Mora[] = [
  { som: "ko", pitch: "L", bloco: "kore", funcao: "isto", papel: "topico" },
  { som: "re", pitch: "H", bloco: "kore", funcao: "isto", papel: "topico" },
  { som: "wa", pitch: "H", bloco: "wa", funcao: "[Tópico]", papel: "particula" },
  { som: "na", pitch: "H", bloco: "nan", funcao: "o quê", papel: "pergunta" },
  { som: "n", pitch: "L", bloco: "nan", funcao: "o quê", papel: "pergunta" },
  { som: "de", pitch: "L", bloco: "desu", funcao: "é", papel: "copula" },
  { som: "su", pitch: "L", bloco: "desu", funcao: "é", papel: "copula", devozeada: true },
  { som: "ka", pitch: "L", bloco: "ka", funcao: "[?]", papel: "particula" },
];

/** Seletor global de "Camada Ortográfica" com prévia ao vivo. */
export function PhaseCard({ faseRecomendada }: { faseRecomendada: Fase }) {
  const { fase, setFase } = usePhase();
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <Layers size={16} /> Camada ortográfica
      </h2>
      <div className="mt-3 space-y-1.5">
        {FASES.map((f) => (
          <button
            key={f.fase}
            onClick={() => setFase(f.fase)}
            className={`flex w-full items-start gap-3 rounded-xl border px-3 py-2 text-left transition ${
              fase === f.fase ? "border-[var(--accent)] bg-[var(--accent)]/10" : "border-[var(--line)] hover:border-[var(--muted)]"
            }`}
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                fase === f.fase ? "border-[var(--accent)] bg-[var(--accent)] text-black" : "border-[var(--muted)]"
              }`}
            >
              {fase === f.fase && <Check size={12} strokeWidth={3} />}
            </span>
            <span>
              <span className="block text-sm font-semibold">
                {f.nome}
                {f.fase === faseRecomendada && (
                  <span className="ml-2 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-normal text-[var(--muted)]">
                    recomendada agora
                  </span>
                )}
              </span>
              <span className="block text-xs text-[var(--muted)]">{f.desc}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-[var(--bg)] p-3">
        <p className="mb-2 text-[10px] uppercase tracking-wider text-[var(--muted)]">Prévia</p>
        <PitchAccentVisualizer moras={DEMO} size="sm" />
        <ScriptLayer kana="これはなんですか" kanji="これは何[なん]ですか" className="mt-2 text-center text-xl" lockedHint />
      </div>
    </section>
  );
}
