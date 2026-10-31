"use client";

import { useEffect, useState } from "react";
import { MicOff, X } from "lucide-react";

/** Faixa no topo com o motivo real de uma falha do microfone (qualquer tela: quem avisa é `startCapture`). */
export function AvisoMicrofone() {
  const [texto, setTexto] = useState<string | null>(null);
  useEffect(() => {
    const ouvir = (e: Event) => setTexto((e as CustomEvent<string | null>).detail);
    window.addEventListener("koe-microfone", ouvir);
    return () => window.removeEventListener("koe-microfone", ouvir);
  }, []);
  if (!texto) return null;
  return (
    <div role="alert" className="fixed inset-x-3 top-3 z-50 mx-auto flex max-w-xl items-start gap-2 rounded-2xl border border-[var(--warn)]/50 bg-[var(--panel-2)] p-3 text-sm shadow-xl shadow-black/40">
      <MicOff size={18} className="mt-0.5 shrink-0 text-[var(--warn)]" />
      <p className="min-w-0 flex-1">{texto}</p>
      <button onClick={() => setTexto(null)} aria-label="Fechar aviso" className="shrink-0 rounded-lg p-1 text-[var(--muted)]">
        <X size={16} />
      </button>
    </div>
  );
}
