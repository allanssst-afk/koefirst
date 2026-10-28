"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, GraduationCap, Mic, Square } from "lucide-react";
import { PlayButtons } from "../AudioControls";
import { CognitiveBreakdown } from "../CognitiveBreakdown";
import { PitchAccentVisualizer, RoleLegend } from "../PitchAccentVisualizer";
import { PitchContourView } from "../PitchContourView";
import { usePhase } from "../PhaseProvider";
import { ScriptLayer } from "../ScriptLayer";
import { useVoiceCapture } from "../useVoiceCapture";
import type { CaptureResult } from "@/lib/audio/capture";
import { speakJa, stopAll } from "@/lib/audio/tts";
import { registrarAtividade } from "@/lib/queries";
import { bestSimilarity, stripFurigana } from "@/lib/text";
import type { CardDTO } from "@/lib/types";

const REPETICOES = 2;
const LIMIAR = 0.6;

interface Tentativa {
  sim: number | null;
  result: CaptureResult;
}

/**
 * Primeiro contato com uma frase nova: ouvir (normal/devagar) → entender a lógica →
 * repetir em voz alta (shadowing). Só depois o card vai para o teste de memória.
 */
export function LearnPanel({ card, onDone }: { card: CardDTO; onDone: () => void }) {
  const { fase } = usePhase();
  const voice = useVoiceCapture();
  const [playing, setPlaying] = useState<{ on: boolean; rate: number }>({ on: false, rate: 1 });
  const [tentativas, setTentativas] = useState<Tentativa[]>([]);

  const boas = tentativas.filter((t) => t.result.latencyMs !== null && (t.sim === null || t.sim >= LIMIAR)).length;
  const pronto = boas >= REPETICOES;
  const ultima = tentativas[tentativas.length - 1];

  const ouvir = async (rate = 1) => {
    setPlaying({ on: true, rate });
    await speakJa(card.kana_oculto, { url: card.audio_url, rate });
    setPlaying({ on: false, rate });
  };

  // Ao abrir: toca a frase uma vez em velocidade normal.
  useEffect(() => {
    const t = setTimeout(() => ouvir(1), 350);
    return () => {
      clearTimeout(t);
      stopAll();
    };
  }, [card.id]);

  const repetir = async () => {
    stopAll();
    const r = await voice.start({ lang: "ja-JP", maxMs: 9000, silenceStartMs: 5000 });
    const sim = r.alternatives.length
      ? bestSimilarity(r.alternatives, [card.kana_oculto, stripFurigana(card.kanji_oculto)])
      : null;
    setTentativas((t) => [...t, { sim, result: r }]);
    if (r.speechMs) {
      registrarAtividade("study", r.speechMs, sim === null ? null : sim >= LIMIAR);
    }
  };

  // Atalhos: espaço = repetir/parar · R = ouvir · enter = ir para o teste
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        if (voice.status === "recording") voice.stop();
        else repetir();
      } else if (e.key.toLowerCase() === "r") ouvir(1);
      else if (e.key === "Enter" && pronto) onDone();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="space-y-4 animate-rise">
      <section className="space-y-4 rounded-2xl border border-sky-400/40 bg-[var(--panel)] p-5">
        <div className="text-center">
          <p className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wider text-sky-300">
            <GraduationCap size={14} /> Frase nova · aprenda antes de testar
          </p>
          <h1 className="mt-2 text-xl font-semibold leading-snug sm:text-2xl">{card.situacao_pt}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Ouça, observe a melodia e repita em voz alta.</p>
        </div>

        <PitchAccentVisualizer moras={card.moras} playing={playing.on} moraMs={165 / playing.rate} />
        <ScriptLayer kana={card.kana_oculto} kanji={card.kanji_oculto} className="text-center" lockedHint />
        <div className="flex justify-center">
          <PlayButtons line={{ kana: card.kana_oculto, audio_url: card.audio_url }} onPlaying={(on, r) => setPlaying({ on, rate: r })} />
        </div>
        <div className="flex justify-center">
          <RoleLegend moras={card.moras} />
        </div>
      </section>

      <CognitiveBreakdown moras={card.moras} literal={card.significado_cognitivo} notas={card.notas_gramaticais} />

      {/* Shadowing */}
      <section className="space-y-3 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 text-center">
        <p className="font-semibold">Repita em voz alta {REPETICOES} vezes, imitando a melodia</p>
        <div className="flex justify-center gap-2">
          {Array.from({ length: REPETICOES }, (_, i) => (
            <CheckCircle2 key={i} size={24} className={boas > i ? "text-[var(--ok)]" : "text-[var(--line)]"} />
          ))}
        </div>
        {ultima && (
          <p
            className={`text-sm ${
              ultima.result.latencyMs === null
                ? "text-[var(--warn)]"
                : ultima.sim === null || ultima.sim >= LIMIAR
                  ? "text-[var(--ok)]"
                  : "text-[var(--warn)]"
            }`}
          >
            {ultima.result.latencyMs === null
              ? "Não ouvi nada — fale mais perto do microfone."
              : ultima.sim === null
                ? "Fala registrada (sem reconhecimento de voz neste navegador)."
                : ultima.sim >= LIMIAR
                  ? `Boa! ${Math.round(ultima.sim * 100)}% de correspondência sonora.`
                  : `${Math.round(ultima.sim * 100)}% — ouça de novo (tente o Devagar) e repita.`}
            {fase >= 2 && ultima.result.transcript && (
              <span className="font-jp block text-[var(--muted)]">Reconhecido: {ultima.result.transcript}</span>
            )}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-2">
          {voice.status === "recording" ? (
            <button onClick={voice.stop} className="flex h-12 items-center gap-2 rounded-xl bg-[var(--bad)] px-6 font-bold text-black">
              <Square size={18} /> Parar
            </button>
          ) : (
            <button
              onClick={repetir}
              className={`flex h-12 items-center gap-2 rounded-xl px-6 font-bold ${
                pronto ? "border border-[var(--line)] text-[var(--fg)]" : "bg-[var(--accent)] text-black"
              }`}
            >
              <Mic size={20} /> {pronto ? "Repetir mais" : `Repetir (${Math.min(boas + 1, REPETICOES)}/${REPETICOES})`}
              <kbd className="ml-1 hidden rounded bg-black/15 px-1.5 text-[10px] sm:inline">espaço</kbd>
            </button>
          )}
          <button
            onClick={onDone}
            className={`flex h-12 items-center gap-2 rounded-xl px-5 text-sm font-bold ${
              pronto ? "bg-[var(--ok)] text-black" : "border border-[var(--line)] text-[var(--muted)]"
            }`}
          >
            {pronto ? "Pronto, me teste depois" : "Pular repetição"}
            {pronto && <kbd className="ml-1 hidden rounded bg-black/15 px-1.5 text-[10px] sm:inline">enter</kbd>}
          </button>
        </div>
        <p className="text-xs text-[var(--muted)]">
          A frase volta daqui a alguns cards para você dizer sozinho, sem ouvir antes.
        </p>
      </section>

      {ultima?.result.blob && <PitchContourView blob={ultima.result.blob} moras={card.moras} />}
    </div>
  );
}
