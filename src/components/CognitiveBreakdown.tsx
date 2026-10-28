import { ArrowRight, Brain } from "lucide-react";
import { roleOf } from "@/lib/roles";
import { groupBlocks } from "@/lib/text";
import type { Mora } from "@/lib/types";

/** A lógica literal da frase japonesa, bloco a bloco, na ordem em que o japonês pensa. */
export function CognitiveBreakdown({ moras, literal, notas }: { moras: Mora[]; literal?: string; notas?: string }) {
  const groups = groupBlocks(moras);
  return (
    <section className="space-y-3 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4">
      <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        <Brain size={14} /> Decomposição cognitiva
      </h3>
      {literal && <p className="text-lg leading-snug text-[var(--fg)]">{literal}</p>}
      <div className="flex flex-wrap items-center gap-1.5">
        {groups.map((g, i) => {
          const r = roleOf(g.moras[0].papel);
          return (
            <span key={g.start} className="flex items-center gap-1.5">
              {i > 0 && <ArrowRight size={12} className="text-[var(--muted)]" />}
              <span className={`rounded-lg border px-2 py-1 text-xs ${r.chip}`}>
                <span className="block text-[9px] uppercase tracking-wider opacity-70">{r.label}</span>
                {g.moras[0].funcao}
              </span>
            </span>
          );
        })}
      </div>
      {notas && <p className="text-sm leading-relaxed text-[var(--muted)]">{notas}</p>}
    </section>
  );
}
