"use client";

import { Check } from "lucide-react";
import { CATEGORIAS, type Categoria } from "@/lib/roleplay";

export type Contexto = Categoria | "todos";

const OPCOES: { id: Contexto; label: string; emoji: string; desc: string }[] = [
  { id: "todos", label: "Tudo misturado", emoji: "🎲", desc: "Todas as situações, na ordem do curso" },
  ...CATEGORIAS,
];

const STORAGE_KEY = "koefirst:contexto";

export function lerContextoSalvo(): Contexto {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v && OPCOES.some((o) => o.id === v)) return v as Contexto;
  } catch {}
  return "todos";
}

export function salvarContexto(c: Contexto) {
  try {
    localStorage.setItem(STORAGE_KEY, c);
  } catch {}
}

/** Escolha da situação de vida em que a sessão vai aplicar o japonês. */
export function ContextPicker({
  value,
  onChange,
  detalhe,
}: {
  value: Contexto;
  onChange: (c: Contexto) => void;
  /** texto extra por opção, ex.: "3 frases novas" */
  detalhe?: (c: Contexto) => string | null;
}) {
  return (
    <div role="radiogroup" aria-label="Contexto da sessão" className="grid gap-2 sm:grid-cols-2">
      {OPCOES.map((o) => {
        const ativo = value === o.id;
        const extra = detalhe?.(o.id);
        return (
          <button
            key={o.id}
            role="radio"
            aria-checked={ativo}
            onClick={() => onChange(o.id)}
            className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
              ativo ? "border-[var(--accent)] bg-[var(--accent)]/10" : "border-[var(--line)] bg-[var(--panel)] hover:border-[var(--muted)]"
            }`}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--bg)] text-2xl" aria-hidden>
              {o.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{o.label}</span>
              <span className="block text-xs text-[var(--muted)]">{o.desc}</span>
              {extra && <span className="mt-0.5 block text-[11px] text-[var(--accent)]">{extra}</span>}
            </span>
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                ativo ? "border-[var(--accent)] bg-[var(--accent)] text-black" : "border-[var(--muted)]"
              }`}
            >
              {ativo && <Check size={12} strokeWidth={3} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
