"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Mic, Play, Sparkles, X } from "lucide-react";
import { PlayButtons } from "../AudioControls";
import { CognitiveBreakdown } from "../CognitiveBreakdown";
import { PitchAccentVisualizer } from "../PitchAccentVisualizer";
import { ScriptLayer } from "../ScriptLayer";
import { useVoiceCapture } from "../useVoiceCapture";
import { speakJa, stopAll } from "@/lib/audio/tts";
import { fraseMaisProxima, registrarAtividade } from "@/lib/queries";
import { bestSimilarity, stripFurigana } from "@/lib/text";
import type { JaLine } from "@/lib/types";

type Step = "ask" | "loading" | "teach" | "done";

/**
 * Botão flutuante "Sussurro do Coach (Como eu digo…?)": dúvida em português →
 * frase ensinada sonoramente → repetir 2× → retomar o diálogo.
 */
export function CoachWhisper({
  open,
  onOpenChange,
  contexto,
  onResume,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  contexto: string;
  onResume: () => void;
}) {
  const voice = useVoiceCapture();
  const [step, setStep] = useState<Step>("ask");
  const [pergunta, setPergunta] = useState("");
  const [lesson, setLesson] = useState<{ frase: JaLine; explicacao_pt: string; offline?: boolean } | null>(null);
  const [erro, setErro] = useState("");
  const [reps, setReps] = useState(0);
  const [ultima, setUltima] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const reset = () => {
    setStep("ask");
    setPergunta("");
    setLesson(null);
    setErro("");
    setReps(0);
    setUltima(null);
  };

  const close = (resume: boolean) => {
    stopAll();
    onOpenChange(false);
    reset();
    if (resume) setTimeout(onResume, 300);
  };

  const ouvirPergunta = async () => {
    const r = await voice.start({ lang: "pt-BR", maxMs: 12_000, silenceEndMs: 1500 });
    if (r.transcript) setPergunta(r.transcript);
    else setErro("Não captei sua pergunta — digite abaixo.");
  };

  const perguntar = async () => {
    if (!pergunta.trim()) return;
    setErro("");
    setStep("loading");
    // Sem servidor de IA: o Coach procura no seu baralho a frase mais parecida com a pergunta.
    const card = fraseMaisProxima(pergunta);
    if (!card) {
      setErro("Não achei uma frase parecida no seu baralho. Tente com outras palavras (ex.: «obrigado», «banheiro»).");
      setStep("ask");
      return;
    }
    const j = {
      frase: { kana: card.kana_oculto, kanji: card.kanji_oculto, pt: card.situacao_pt, literal: card.significado_cognitivo, moras: card.moras } satisfies JaLine,
      explicacao_pt: card.notas_gramaticais,
      offline: true,
    };
    setLesson(j);
    setStep("teach");
    setPlaying(true);
    await speakJa(j.frase.kana);
    setPlaying(false);
  };

  const repetir = async () => {
    if (!lesson) return;
    stopAll();
    const r = await voice.start({ lang: "ja-JP", maxMs: 9000 });
    if (r.speechMs) {
      registrarAtividade("coach", r.speechMs);
    }
    if (r.latencyMs === null) {
      setUltima(0);
      return;
    }
    // Sem STT, conta a tentativa pela fala detectada.
    const s = r.alternatives.length
      ? bestSimilarity(r.alternatives, [lesson.frase.kana, stripFurigana(lesson.frase.kanji)])
      : 1;
    setUltima(s);
    if (s >= 0.7) {
      const n = reps + 1;
      setReps(n);
      if (n >= 2) setStep("done");
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => onOpenChange(true)}
          className="fixed bottom-48 right-4 z-40 flex items-center gap-2 rounded-full bg-violet-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-900/40 md:bottom-40"
        >
          <Sparkles size={18} /> Como eu digo…?
        </button>
      )}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-3 sm:items-center" onClick={() => close(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90dvh] w-full max-w-xl space-y-4 overflow-y-auto rounded-2xl border border-violet-400/40 bg-[var(--panel)] p-5 animate-rise"
          >
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-bold text-violet-300">
                <Sparkles size={18} /> Sussurro do Coach
              </h2>
              <button onClick={() => close(false)} className="text-[var(--muted)]" aria-label="Fechar">
                <X size={18} />
              </button>
            </div>

            {(step === "ask" || step === "loading") && (
              <>
                <p className="text-sm text-[var(--muted)]">Fale ou digite em português o que você quer dizer.</p>
                <div className="flex gap-2">
                  <button
                    onClick={voice.status === "recording" ? voice.stop : ouvirPergunta}
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      voice.status === "recording" ? "bg-[var(--bad)] text-black" : "bg-violet-500 text-white"
                    }`}
                    aria-label="Falar pergunta"
                  >
                    <Mic size={18} />
                  </button>
                  <input
                    value={pergunta}
                    onChange={(e) => setPergunta(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && perguntar()}
                    placeholder="Ex.: como digo que vou me atrasar?"
                    className="flex-1 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 text-sm outline-none focus:border-violet-400"
                  />
                </div>
                {erro && <p className="text-sm text-[var(--warn)]">{erro}</p>}
                <button
                  onClick={perguntar}
                  disabled={!pergunta.trim() || step === "loading"}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet-500 font-bold text-white disabled:opacity-50"
                >
                  {step === "loading" ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />} Me ensina
                </button>
              </>
            )}

            {(step === "teach" || step === "done") && lesson && (
              <>
                <p className="text-sm text-[var(--muted)]">«{pergunta}»</p>
                <PitchAccentVisualizer moras={lesson.frase.moras} playing={playing} />
                <ScriptLayer kana={lesson.frase.kana} kanji={lesson.frase.kanji} className="text-center" lockedHint />
                <div className="flex justify-center">
                  <PlayButtons line={{ kana: lesson.frase.kana }} onPlaying={(on) => setPlaying(on)} />
                </div>
                <CognitiveBreakdown moras={lesson.frase.moras} literal={lesson.frase.literal} notas={lesson.explicacao_pt} />

                <div className="rounded-xl border border-[var(--line)] p-3 text-center">
                  <p className="text-sm font-semibold">Repita em voz alta 2 vezes</p>
                  <div className="my-2 flex justify-center gap-2">
                    {[0, 1].map((i) => (
                      <CheckCircle2 key={i} size={22} className={reps > i ? "text-[var(--ok)]" : "text-[var(--line)]"} />
                    ))}
                  </div>
                  {ultima !== null && ultima < 0.7 && (
                    <p className="text-xs text-[var(--warn)]">
                      {ultima === 0 ? "Não ouvi nada." : `Ainda distante (${Math.round(ultima * 100)}%).`} Ouça de novo e repita.
                    </p>
                  )}
                  {step === "teach" ? (
                    <button
                      onClick={voice.status === "recording" ? voice.stop : repetir}
                      className={`mt-2 inline-flex h-11 items-center gap-2 rounded-xl px-5 font-bold ${
                        voice.status === "recording" ? "bg-[var(--bad)] text-black" : "bg-[var(--accent)] text-black"
                      }`}
                    >
                      <Mic size={18} /> {voice.status === "recording" ? "Parar" : `Repetir (${reps + 1}/2)`}
                    </button>
                  ) : (
                    <button
                      onClick={() => close(true)}
                      className="mt-2 inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--ok)] px-5 font-bold text-black"
                    >
                      <Play size={18} /> Retomar diálogo
                    </button>
                  )}
                </div>
                {lesson.offline && (
                  <p className="text-[11px] text-[var(--muted)]">Frase do seu baralho mais próxima da sua pergunta.</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
