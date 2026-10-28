"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { abrirBanco } from "@/db";
import { atualizarConfig, getSettings } from "@/lib/queries";
import type { Capabilities, Fase } from "@/lib/types";

interface Ctx {
  fase: Fase;
  setFase: (f: Fase) => void;
  caps: Capabilities;
}

/** App estático (GitHub Pages): sem servidor, só as APIs do navegador (Web Speech) — nada de IA/TTS externos. */
const SEM_INTEGRACOES: Capabilities = { ai: null, tts: null, stt: null };

const PhaseContext = createContext<Ctx | null>(null);

/** Abre o banco do aparelho e só então mostra as telas (que podem consultar o banco direto na renderização). */
export function PhaseProvider({ children }: { children: ReactNode }) {
  const [fase, setLocal] = useState<Fase>(1);
  const [pronto, setPronto] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    abrirBanco()
      .then(() => {
        setLocal(getSettings().fase_atual);
        setPronto(true);
      })
      .catch((e) => setErro(String(e)));
  }, []);

  const setFase = (f: Fase) => {
    setLocal(f);
    atualizarConfig({ fase_atual: f });
  };

  if (!pronto) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-sm text-[var(--muted)]">
        {erro ? (
          <p className="max-w-sm text-center text-[var(--bad)]">Não foi possível abrir o banco deste aparelho: {erro}</p>
        ) : (
          <>
            <Loader2 className="animate-spin" /> Carregando seu progresso…
          </>
        )}
      </div>
    );
  }

  return <PhaseContext.Provider value={{ fase, setFase, caps: SEM_INTEGRACOES }}>{children}</PhaseContext.Provider>;
}

export function usePhase() {
  const ctx = useContext(PhaseContext);
  if (!ctx) throw new Error("usePhase fora do PhaseProvider");
  return ctx;
}

export const FASES: { fase: Fase; curto: string; nome: string; desc: string }[] = [
  { fase: 1, curto: "Som", nome: "Fase 1 · Mapa de Som/Pitch", desc: "Sem escrita japonesa: só moras, entonação e função." },
  { fase: 2, curto: "Kana", nome: "Fase 2 · Som + Hiragana", desc: "Mostra a frase em kana junto do mapa sonoro." },
  { fase: 3, curto: "Kanji", nome: "Fase 3 · Kanji Inteligente", desc: "Kanji com furigana sobre a leitura." },
  { fase: 4, curto: "B1", nome: "Fase 4 · Imersão B1", desc: "Kanji sem furigana, como um nativo lê." },
];

export function PhaseSelector({ compact = false }: { compact?: boolean }) {
  const { fase, setFase } = usePhase();
  return (
    <div role="radiogroup" aria-label="Camada ortográfica" className="flex rounded-xl border border-[var(--line)] bg-[var(--panel)] p-1">
      {FASES.map((f) => (
        <button
          key={f.fase}
          role="radio"
          aria-checked={fase === f.fase}
          title={`${f.nome} — ${f.desc}`}
          onClick={() => setFase(f.fase)}
          className={`flex-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
            fase === f.fase ? "bg-[var(--accent)] text-black" : "text-[var(--muted)] hover:text-[var(--fg)]"
          }`}
        >
          {compact ? f.fase : `${f.fase} · ${f.curto}`}
        </button>
      ))}
    </div>
  );
}
