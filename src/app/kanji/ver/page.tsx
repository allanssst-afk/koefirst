"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { Caligrafia } from "@/components/escrita/Caligrafia";
import { speakJa } from "@/lib/audio/tts";
import { KANJI, KANJI_DO_GRUPO, palavrasCom, type GrupoKanji } from "@/lib/kanji";
import { cardPorId } from "@/lib/trilha";

function Ver() {
  const router = useRouter();
  const params = useSearchParams();
  const k = params.get("k") ?? "";
  const grupo = (params.get("g") as GrupoKanji) || "app";
  const d = KANJI[k];
  const [concluiu, setConcluiu] = useState<string | null>(null);
  if (!d) {
    return (
      <div className="py-16 text-center">
        <p className="text-[var(--muted)]">Kanji não encontrado.</p>
        <Link href="/kanji" className="mt-4 inline-block font-bold text-[var(--accent)]">
          Voltar para os kanji
        </Link>
      </div>
    );
  }
  const lista = KANJI_DO_GRUPO[grupo]?.includes(k) ? KANJI_DO_GRUPO[grupo] : Object.keys(KANJI);
  const i = lista.indexOf(k);
  const ir = (passo: number) => {
    setConcluiu(null);
    const prox = lista[(i + passo + lista.length) % lista.length];
    router.replace(`/kanji/ver/?k=${encodeURIComponent(prox)}&g=${grupo}`);
  };
  const palavras = palavrasCom(k);

  return (
    <div className="mx-auto max-w-md space-y-4 pb-6 animate-rise">
      <div className="flex items-center justify-between">
        <Link href="/kanji" className="flex items-center gap-1 text-sm text-[var(--muted)]">
          <ArrowLeft size={18} /> Kanji
        </Link>
        <span className="text-xs text-[var(--muted)]">
          {i + 1} / {lista.length}
          {d.nivel ? ` · JLPT N${d.nivel}` : ""} · {d.tracos.length} traços
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => ir(-1)} aria-label="Kanji anterior" className="btn shrink-0 rounded-xl p-2 text-[var(--muted)]">
          <ChevronLeft size={28} />
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="text-2xl font-bold leading-tight">{d.sig.slice(0, 3).join(", ")}</p>
          <div className="mt-1 flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm">
            {d.kun.length > 0 && (
              <span>
                <span className="text-[var(--muted)]">kun </span>
                <span className="font-jp">{d.kun.join("、")}</span>
              </span>
            )}
            {d.on.length > 0 && (
              <span>
                <span className="text-[var(--muted)]">on </span>
                <span className="font-jp">{d.on.join("、")}</span>
              </span>
            )}
          </div>
        </div>
        <button onClick={() => ir(1)} aria-label="Próximo kanji" className="btn shrink-0 rounded-xl p-2 text-[var(--muted)]">
          <ChevronRight size={28} />
        </button>
      </div>

      <Caligrafia key={k} caractere={k} dados={d} aoConcluir={() => setConcluiu(k)} />

      {concluiu === k && (
        <button onClick={() => ir(1)} className="btn btn-primario w-full rounded-2xl py-4">
          Próximo kanji
        </button>
      )}

      {palavras.length > 0 && (
        <section className="space-y-2 rounded-2xl bg-[var(--panel)] p-3">
          <p className="text-xs font-semibold text-[var(--muted)]">Nas suas frases</p>
          {palavras.map((p) => (
            <div key={p.escrita} className="flex items-center gap-3">
              <ruby className="font-jp text-xl">
                {p.escrita}
                <rt className="text-[10px] text-[var(--muted)]">{p.leitura}</rt>
              </ruby>
              <span className="min-w-0 flex-1 text-sm text-[var(--muted)]">{cardPorId(p.card).traducao}</span>
              <button
                onClick={() => speakJa(p.leitura)}
                aria-label="Ouvir"
                className="btn flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--azul)] text-white"
              >
                <Volume2 size={16} />
              </button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

/** /kanji/ver?k=日&g=n5 — um kanji: sentido, leituras, palavras do app e caligrafia. */
export default function VerKanjiPage() {
  return (
    <Suspense>
      <Ver />
    </Suspense>
  );
}
