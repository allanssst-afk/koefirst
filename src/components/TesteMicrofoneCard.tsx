"use client";

import { useState } from "react";
import { Mic } from "lucide-react";
import { testarMicrofone, type TesteMicrofone } from "@/lib/audio/teste-microfone";

const TESTES: { id: TesteMicrofone; nome: string }[] = [
  { id: "gravacao", nome: "1. Gravação" },
  { id: "reconhecimento", nome: "2. Reconhecimento" },
  { id: "juntos", nome: "3. Os dois juntos" },
];

/** Testa cada parte do microfone à parte. Cada teste dura 4 segundos, com a pessoa falando. */
export function TesteMicrofoneCard() {
  const [rodando, setRodando] = useState<TesteMicrofone | null>(null);
  const [resultado, setResultado] = useState<Partial<Record<TesteMicrofone, string[]>>>({});
  const testar = async (qual: TesteMicrofone) => {
    setRodando(qual);
    const linhas = await testarMicrofone(qual).catch((e: Error) => [`Erro: ${e.name}`]);
    setResultado((r) => ({ ...r, [qual]: linhas }));
    setRodando(null);
  };
  return (
    <section className="space-y-3 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4">
      <h2 className="flex items-center gap-2 font-bold">
        <Mic size={18} className="text-[var(--accent)]" /> Teste do microfone
      </h2>
      <p className="text-sm text-[var(--muted)]">Toque em cada teste e fale em japonês por 4 segundos, sem parar. Se pedir permissão, permita.</p>
      <div className="flex flex-wrap gap-2">
        {TESTES.map((t) => (
          <button key={t.id} onClick={() => testar(t.id)} disabled={rodando !== null} className="btn btn-secundario rounded-xl px-3 py-2 text-sm disabled:opacity-50">
            {rodando === t.id ? "Fale agora…" : t.nome}
          </button>
        ))}
      </div>
      {TESTES.filter((t) => resultado[t.id]).map((t) => (
        <div key={t.id} className="text-sm">
          <p className="font-semibold">{t.nome}</p>
          {resultado[t.id]!.map((l) => (
            <p key={l} className="break-words text-[var(--muted)]">
              {l}
            </p>
          ))}
        </div>
      ))}
    </section>
  );
}
