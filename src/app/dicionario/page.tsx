"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search, Volume2 } from "lucide-react";
import { PitchAccentVisualizer } from "@/components/PitchAccentVisualizer";
import { usePhase } from "@/components/PhaseProvider";
import { ScriptLayer } from "@/components/ScriptLayer";
import { speakJa } from "@/lib/audio/tts";
import { buscarFrases, buscarVerbetes, type Verbete } from "@/lib/dicionario";
import { roleOf } from "@/lib/roles";
import { cardPorId, type CardTrilha } from "@/lib/trilha";
import type { Papel } from "@/lib/types";

const FILTROS: { nome: string; papeis: Papel[] | null }[] = [
  { nome: "Tudo", papeis: null },
  { nome: "Verbos", papeis: ["verbo"] },
  { nome: "Nomes", papeis: ["substantivo", "objeto", "lugar", "tempo", "topico", "sujeito"] },
  { nome: "Expressões", papeis: ["expressao"] },
  { nome: "Adjetivos", papeis: ["adjetivo", "adverbio"] },
  { nome: "Partículas", papeis: ["particula", "pergunta", "copula"] },
];

/** Dicionário: as palavras e frases do app, com som, melodia e função; busca em português ou pelo som. */
export default function Dicionario() {
  const [aba, setAba] = useState<"palavras" | "frases">("palavras");
  const [q, setQ] = useState("");
  const [filtro, setFiltro] = useState(0);
  const [aberto, setAberto] = useState<string | null>(null);

  const verbetes = useMemo(() => buscarVerbetes(q, FILTROS[filtro].papeis), [q, filtro]);
  const frases = useMemo(() => buscarFrases(q), [q]);

  return (
    <div className="mx-auto max-w-md space-y-4 pb-8 animate-rise">
      <div>
        <h1 className="text-2xl font-bold">Dicionário</h1>
        <p className="text-sm text-[var(--muted)]">Tudo o que o app ensina: busque em português ou pelo som.</p>
      </div>

      <label className="flex items-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--panel)] px-3">
        <Search size={18} className="shrink-0 text-[var(--muted)]" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ex.: obrigado, comer, reunião, taberu"
          className="h-12 min-w-0 flex-1 bg-transparent outline-none placeholder:text-[var(--muted)]"
          type="search"
        />
      </label>

      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-[var(--panel)] p-1">
        {(["palavras", "frases"] as const).map((a) => (
          <button
            key={a}
            onClick={() => setAba(a)}
            className={`rounded-xl py-2 font-semibold capitalize ${aba === a ? "bg-[var(--accent)] text-[#1c0b05]" : "text-[var(--muted)]"}`}
          >
            {a} <span className="text-xs opacity-70">({a === "palavras" ? verbetes.length : frases.length})</span>
          </button>
        ))}
      </div>

      {aba === "palavras" && (
        <div className="flex flex-wrap gap-2">
          {FILTROS.map((f, i) => (
            <button
              key={f.nome}
              onClick={() => setFiltro(i)}
              className={`rounded-full border px-3 py-1 text-sm ${
                filtro === i ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)]" : "border-[var(--line)] text-[var(--muted)]"
              }`}
            >
              {f.nome}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {aba === "palavras"
          ? verbetes.map((v) => (
              <LinhaVerbete key={v.chave} v={v} aberto={aberto === v.chave} alternar={() => setAberto(aberto === v.chave ? null : v.chave)} />
            ))
          : frases.map((c) => (
              <LinhaFrase key={c.id} c={c} aberto={aberto === c.id} alternar={() => setAberto(aberto === c.id ? null : c.id)} />
            ))}
        {(aba === "palavras" ? verbetes : frases).length === 0 && (
          <p className="py-8 text-center text-sm text-[var(--muted)]">Nada encontrado. Tente outra palavra.</p>
        )}
      </div>
    </div>
  );
}

function Som({ texto }: { texto: string }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        speakJa(texto);
      }}
      aria-label="Ouvir"
      className="btn flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--azul)] text-white"
    >
      <Volume2 size={18} />
    </button>
  );
}

/** Som do verbete: moras separadas na Fase 1 (sem escrita japonesa), kana a partir da Fase 2. */
function SomDoBloco({ v }: { v: Verbete }) {
  const { fase } = usePhase();
  return fase >= 2 ? (
    <span className="font-jp text-base">{v.kana}</span>
  ) : (
    <span className="font-mono text-xs text-[var(--muted)]">{v.moras.map((m) => m.som).join("·")}</span>
  );
}

function LinhaVerbete({ v, aberto, alternar }: { v: Verbete; aberto: boolean; alternar: () => void }) {
  const r = roleOf(v.papel);
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)]">
      <div role="button" tabIndex={0} onClick={alternar} className="flex cursor-pointer items-center gap-3 p-3">
        <span className="h-9 w-1 shrink-0 rounded-full" style={{ background: r.hex }} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-tight">{v.funcao}</p>
          <p className="flex flex-wrap items-center gap-x-2">
            <span className="text-[11px]" style={{ color: r.hex }}>
              {r.label}
            </span>
            <SomDoBloco v={v} />
          </p>
        </div>
        <Som texto={v.kana} />
        <ChevronDown size={18} className={`shrink-0 text-[var(--muted)] transition-transform ${aberto ? "rotate-180" : ""}`} />
      </div>
      {aberto && (
        <div className="space-y-3 border-t border-[var(--line)] p-3">
          <PitchAccentVisualizer moras={v.moras} size="sm" />
          <p className="text-[11px] text-[var(--muted)]">Melodia como aparece na frase.</p>
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-[var(--muted)]">Aparece em</p>
            {v.frases.slice(0, 4).map((id) => {
              const c = cardPorId(id);
              return (
                <div key={id} className="flex items-center gap-2 text-sm">
                  <span className="min-w-0 flex-1">{c.traducao}</span>
                  <Som texto={c.kana} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function LinhaFrase({ c, aberto, alternar }: { c: CardTrilha; aberto: boolean; alternar: () => void }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)]">
      <div role="button" tabIndex={0} onClick={alternar} className="flex cursor-pointer items-center gap-3 p-3">
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-tight">{c.traducao}</p>
          <p className="truncate text-xs text-[var(--muted)]">{c.situacao_pt}</p>
        </div>
        <Som texto={c.kana} />
        <ChevronDown size={18} className={`shrink-0 text-[var(--muted)] transition-transform ${aberto ? "rotate-180" : ""}`} />
      </div>
      {aberto && (
        <div className="space-y-2 border-t border-[var(--line)] p-3">
          <PitchAccentVisualizer moras={c.moras} size="sm" />
          <ScriptLayer kana={c.kana} kanji={c.kanji} className="text-lg" />
          <p className="text-sm">
            <span className="font-semibold text-[var(--pitch)]">Lógica japonesa:</span> {c.significado_cognitivo}
          </p>
          {c.notas && <p className="text-xs text-[var(--muted)]">💡 {c.notas}</p>}
        </div>
      )}
    </div>
  );
}
