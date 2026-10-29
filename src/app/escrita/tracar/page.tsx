"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Caligrafia } from "@/components/escrita/Caligrafia";
import { caractere, kanaPorCaractere, TODOS_KANA } from "@/lib/kana";

function Tracar() {
  const router = useRouter();
  const c = useSearchParams().get("k") ?? "";
  const achado = kanaPorCaractere(c);
  const [concluiu, setConcluiu] = useState<string | null>(null);
  if (!achado) {
    return (
      <div className="py-16 text-center">
        <p className="text-[var(--muted)]">Caractere não encontrado.</p>
        <Link href="/escrita" className="mt-4 inline-block font-bold text-[var(--accent)]">
          Voltar para a tabela
        </Link>
      </div>
    );
  }
  const { kana, silabario } = achado;
  const i = TODOS_KANA.indexOf(kana);
  const ir = (d: number) => {
    const prox = TODOS_KANA[(i + d + TODOS_KANA.length) % TODOS_KANA.length];
    setConcluiu(null);
    router.replace(`/escrita/tracar/?k=${encodeURIComponent(caractere(prox, silabario))}`);
  };

  return (
    <div className="mx-auto max-w-md space-y-4 pb-6 animate-rise">
      <div className="flex items-center justify-between">
        <Link href="/escrita" aria-label="Voltar para a tabela" className="flex items-center gap-1 text-sm text-[var(--muted)]">
          <ArrowLeft size={18} /> Tabela
        </Link>
        <span className="text-sm font-semibold capitalize text-[var(--muted)]">{silabario}</span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <button onClick={() => ir(-1)} aria-label="Caractere anterior" className="btn rounded-xl p-2 text-[var(--muted)]">
          <ChevronLeft size={28} />
        </button>
        <div className="text-center">
          <p className="text-4xl font-bold">{kana.romaji.toUpperCase()}</p>
          {kana.dica && <p className="text-xs text-[var(--muted)]">{kana.dica}</p>}
        </div>
        <button onClick={() => ir(1)} aria-label="Próximo caractere" className="btn rounded-xl p-2 text-[var(--muted)]">
          <ChevronRight size={28} />
        </button>
      </div>

      <Caligrafia key={c} caractere={c} aoConcluir={() => setConcluiu(c)} />

      {concluiu === c && (
        <button onClick={() => ir(1)} className="btn btn-primario w-full rounded-2xl py-4">
          Próximo caractere
        </button>
      )}
    </div>
  );
}

/** /escrita/tracar?k=あ — caligrafia de um kana (página estática; o caractere vem da URL). */
export default function TracarPage() {
  return (
    <Suspense>
      <Tracar />
    </Suspense>
  );
}
