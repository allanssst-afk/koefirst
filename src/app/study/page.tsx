"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeftRight, Ear, Eye, Lightbulb, Loader2, Mic, PartyPopper, Play, Sparkles, Square } from "lucide-react";
import { CompareButton, PlayButtons } from "@/components/AudioControls";
import { CognitiveBreakdown } from "@/components/CognitiveBreakdown";
import { ContextPicker, lerContextoSalvo, salvarContexto, type Contexto } from "@/components/ContextPicker";
import { PitchAccentVisualizer, RoleLegend } from "@/components/PitchAccentVisualizer";
import { PitchContourView } from "@/components/PitchContourView";
import { usePhase } from "@/components/PhaseProvider";
import { RatingButtons } from "@/components/RatingButtons";
import { ReflexTimer } from "@/components/ReflexTimer";
import { ScriptLayer } from "@/components/ScriptLayer";
import { LearnPanel } from "@/components/study/LearnPanel";
import { useVoiceCapture } from "@/components/useVoiceCapture";
import { browserSttSupported, type CaptureResult } from "@/lib/audio/capture";
import { speakJa, stopAll } from "@/lib/audio/tts";
import { previewIntervals, type Grade } from "@/lib/fsrs";
import { bestSimilarity, groupBlocks, morasToKana, stripFurigana } from "@/lib/text";
import { CATEGORIAS } from "@/lib/roleplay";
import { getContextSummary, getQueue, salvarRevisao } from "@/lib/queries";
import type { QueueItem } from "@/lib/types";

const REFLEX_MS = 5000;

type Stage = "setup" | "loading" | "learn" | "prompt" | "capturing" | "revealed" | "done";

/** Quantos cards depois a frase recém-aprendida volta para o teste. */
const REINSERIR_APOS = 3;

interface Resumo {
  vencidos: number;
  novosRestantesHoje: number;
  novosPorContexto: Record<Contexto, number>;
}

interface AiEval {
  faz_sentido: boolean;
  nota: number;
  feedback_pt: string;
}

export default function StudyPage() {
  const { fase, caps } = usePhase();
  const voice = useVoiceCapture();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [stage, setStage] = useState<Stage>("setup");
  const [contexto, setContexto] = useState<Contexto>("todos");
  const [resumo, setResumo] = useState<Resumo | null>(null);
  const ctxRef = useRef<Contexto>("todos");
  const [result, setResult] = useState<CaptureResult | null>(null);
  const [sim, setSim] = useState<number | null>(null);
  const [aiEval, setAiEval] = useState<AiEval | "loading" | null>(null);
  const [intervals, setIntervals] = useState<Record<Grade, string> | null>(null);
  const [playing, setPlaying] = useState<{ on: boolean; rate: number }>({ on: false, rate: 1 });
  const [saving, setSaving] = useState(false);
  const [sessao, setSessao] = useState({ feitos: 0, again: 0, falaMs: 0 });
  const [sttOk, setSttOk] = useState(true);
  const [dica, setDica] = useState(0);
  const shownAt = useRef(0);
  const aprendidos = useRef(new Set<string>());

  /** Cards de fala nunca vistos passam primeiro pela etapa "Aprender". */
  const stageFor = (it: QueueItem | undefined): Stage =>
    !it ? "done" : it.fsrs.state === 0 && it.card.tipo === "speaking" && !aprendidos.current.has(it.card.id) ? "learn" : "prompt";

  const item = queue[idx];

  const load = useCallback(async () => {
    setStage("loading");
    const j = getQueue(ctxRef.current === "todos" ? null : ctxRef.current);
    setQueue(j.items);
    setIdx(0);
    setStage(stageFor(j.items[0]));
  }, []);

  const carregarResumo = useCallback(() => {
    setResumo(getContextSummary());
  }, []);

  useEffect(() => {
    setSttOk(browserSttSupported() || caps.stt !== null);
    setContexto(lerContextoSalvo());
    carregarResumo();
    return () => stopAll();
  }, [caps.stt, carregarResumo]);

  /** Começa a sessão no contexto escolhido. */
  const iniciar = () => {
    salvarContexto(contexto);
    ctxRef.current = contexto;
    load();
  };

  const trocarContexto = () => {
    stopAll();
    setStage("setup");
    carregarResumo();
  };

  // Preparação de cada card
  useEffect(() => {
    if (!item) return;
    setResult(null);
    setSim(null);
    setAiEval(null);
    setIntervals(null);
    setDica(0);
    shownAt.current = performance.now();
    previewIntervals(item.card.id, item.fsrs).then(setIntervals).catch(() => setIntervals(null));
  }, [item]);

  const playNative = useCallback(
    async (rate = 1) => {
      if (!item) return;
      setPlaying({ on: true, rate });
      await speakJa(item.card.kana_oculto, { url: item.card.audio_url, rate });
      setPlaying({ on: false, rate });
    },
    [item],
  );

  const reveal = useCallback(
    (r: CaptureResult | null) => {
      if (!item) return;
      setStage("revealed");
      if (r && r.alternatives.length) {
        const s = bestSimilarity(r.alternatives, [item.card.kana_oculto, stripFurigana(item.card.kanji_oculto)]);
        setSim(s);
      }
      playNative();
    },
    [item, playNative],
  );

  const speak = useCallback(async () => {
    if (!item || stage !== "prompt") return;
    stopAll();
    setStage("capturing");
    const r = await voice.start({ lang: "ja-JP", maxMs: 10_000, silenceStartMs: REFLEX_MS + 1500 });
    setResult(r);
    reveal(r);
  }, [item, stage, voice, reveal]);

  const rate = useCallback(
    async (g: Grade) => {
      if (!item || saving) return;
      setSaving(true);
      stopAll();
      await salvarRevisao({
        card_id: item.card.id,
        rating: g,
        tempo_resposta_ms: result?.latencyMs ?? null,
        duracao_fala_ms: result?.speechMs ?? null,
        transcricao: result?.transcript || null,
        similaridade: sim,
      });
      setSessao((s) => ({ feitos: s.feitos + 1, again: s.again + (g === 1 ? 1 : 0), falaMs: s.falaMs + (result?.speechMs ?? 0) }));
      setSaving(false);
      if (idx + 1 < queue.length) {
        setIdx(idx + 1);
        setStage(stageFor(queue[idx + 1]));
      } else {
        load();
      }
    },
    [item, saving, result, sim, idx, queue.length, load],
  );

  /** Fim da etapa Aprender: o card volta alguns cards depois, agora como teste sem áudio. */
  const finishLearning = useCallback(() => {
    if (!item) return;
    stopAll();
    aprendidos.current.add(item.card.id);
    const rest = queue.filter((_, i) => i !== idx);
    const pos = Math.min(idx + REINSERIR_APOS, rest.length);
    const next = [...rest.slice(0, pos), item, ...rest.slice(pos)];
    setQueue(next);
    setStage(stageFor(next[idx]));
  }, [item, queue, idx]);

  /** Dica nas revisões: 1ª = só o primeiro bloco · 2ª = frase inteira. Usar dica limita a sugestão a Hard. */
  const darDica = useCallback(async () => {
    if (!item || stage !== "prompt") return;
    const nivel = Math.min(2, dica + 1);
    setDica(nivel);
    const inicio = groupBlocks(item.card.moras)[0]?.moras ?? [];
    const texto = nivel === 1 && inicio.length < item.card.moras.length ? morasToKana(inicio) : item.card.kana_oculto;
    await speakJa(texto, { url: nivel === 2 ? item.card.audio_url : null, rate: 0.85 });
  }, [item, stage, dica]);

  // Ouvintes: tocam o áudio sozinhos ao aparecer
  useEffect(() => {
    if (item?.card.tipo === "listening" && stage === "prompt") {
      const t = setTimeout(() => playNative(), 350);
      return () => clearTimeout(t);
    }
  }, [item, stage, playNative]);

  const suggested = suggestGrade(item?.card.tipo, result, sim, dica);

  // Atalhos de teclado
  useEffect(() => {
    if (stage === "learn") return; // a etapa Aprender tem atalhos próprios
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        if (stage === "prompt") speak();
        else if (stage === "capturing") voice.stop();
      } else if (e.key === "Enter" && stage === "prompt") reveal(null);
      else if (e.key.toLowerCase() === "h" && stage === "prompt" && item?.card.tipo === "speaking") darDica();
      else if (e.key.toLowerCase() === "r" && (stage === "revealed" || item?.card.tipo === "listening")) playNative();
      else if (stage === "revealed" && ["1", "2", "3", "4"].includes(e.key)) rate(Number(e.key) as Grade);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage, speak, voice, reveal, rate, playNative, item, darDica]);

  if (stage === "setup") {
    const novosNoContexto = resumo ? Math.min(resumo.novosPorContexto[contexto] ?? 0, resumo.novosRestantesHoje) : null;
    return (
      <div className="mx-auto max-w-3xl space-y-5 animate-rise">
        <header>
          <h1 className="text-2xl font-black">Sessão de estudo</h1>
          <p className="text-sm text-[var(--muted)]">
            Em que situação você quer usar o japonês hoje? As frases novas da sessão vêm desse contexto.
          </p>
        </header>
        <ContextPicker
          value={contexto}
          onChange={setContexto}
          detalhe={(c) => {
            if (!resumo) return null;
            const n = resumo.novosPorContexto[c] ?? 0;
            return n ? `${n} ${n === 1 ? "frase nova" : "frases novas"} no baralho` : "sem frases novas, só revisões";
          }}
        />
        <div className="space-y-3 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4">
          {resumo && (
            <p className="text-sm text-[var(--muted)]">
              Nesta sessão: <b className="text-[var(--fg)]">{resumo.vencidos}</b>{" "}
              {resumo.vencidos === 1 ? "revisão vencida" : "revisões vencidas"} (entram sempre, de qualquer contexto) +{" "}
              <b className="text-[var(--fg)]">{novosNoContexto}</b> {novosNoContexto === 1 ? "frase nova" : "frases novas"}
              {resumo.novosRestantesHoje === 0 && " (meta de frases novas de hoje já cumprida)"}.
            </p>
          )}
          <button
            onClick={iniciar}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] font-bold text-black"
          >
            <Play size={18} /> Iniciar sessão
          </button>
        </div>
      </div>
    );
  }

  if (stage === "loading") {
    return (
      <div className="flex h-64 items-center justify-center text-[var(--muted)]">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (stage === "done" || !item) {
    return (
      <div className="mx-auto max-w-md space-y-4 py-16 text-center animate-rise">
        <PartyPopper className="mx-auto text-[var(--accent)]" size={48} />
        <h1 className="text-2xl font-black">Fila do dia concluída</h1>
        {sessao.feitos > 0 && (
          <p className="text-[var(--muted)]">
            {sessao.feitos} cards nesta sessão · {Math.round(((sessao.feitos - sessao.again) / sessao.feitos) * 100)}% sem travar ·{" "}
            {Math.round(sessao.falaMs / 1000)}s falando
          </p>
        )}
        <p className="text-sm text-[var(--muted)]">
          Cards em aprendizagem voltam em minutos. Enquanto isso, treine conjugação no Ping-Pong.
        </p>
        <div className="flex justify-center gap-2">
          <button onClick={load} className="rounded-xl border border-[var(--line)] px-4 py-2 text-sm">
            Verificar de novo
          </button>
          <button
            onClick={trocarContexto}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--line)] px-4 py-2 text-sm"
          >
            <ArrowLeftRight size={14} /> Trocar contexto
          </button>
          <Link href="/drills" className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black">
            Ir para Drills
          </Link>
        </div>
      </div>
    );
  }

  const { card } = item;
  const isNew = item.fsrs.state === 0;
  const recemAprendido = isNew && aprendidos.current.has(card.id);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Cabeçalho da fila */}
      <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
        <button onClick={trocarContexto} title="Trocar contexto" className="rounded bg-white/5 px-1.5 py-0.5 hover:text-[var(--fg)]">
          {ctxRef.current === "todos" ? "🎲 Misturado" : `${CATEGORIAS.find((c) => c.id === ctxRef.current)?.emoji} ${CATEGORIAS.find((c) => c.id === ctxRef.current)?.label}`}
        </button>
        <span>
          {idx + 1} / {queue.length}
        </span>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--line)]">
          <div className="h-full bg-[var(--accent)]" style={{ width: `${(idx / queue.length) * 100}%` }} />
        </div>
        {isNew && (
          <span className="rounded bg-sky-500/20 px-1.5 py-0.5 text-sky-300">{stage === "learn" ? "aprender" : "novo · teste"}</span>
        )}
        <span className="flex items-center gap-1 rounded bg-white/5 px-1.5 py-0.5">
          {card.tipo === "listening" ? <Ear size={12} /> : <Mic size={12} />}
          {card.tipo === "listening" ? "escuta" : "fala"}
        </span>
      </div>

      {!sttOk && (
        <p className="rounded-xl border border-[var(--warn)]/40 bg-[var(--warn)]/10 p-3 text-xs text-[var(--warn)]">
          Este navegador não tem reconhecimento de voz (use Chrome, Edge ou Safari). A gravação e a comparação continuam
          funcionando; avalie-se pelos botões.
        </p>
      )}

      {stage === "learn" && <LearnPanel key={card.id} card={card} onDone={finishLearning} />}

      {/* Frente */}
      {stage !== "learn" && (
      <section key={card.id} className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6 text-center animate-rise">
        <p className="text-[11px] uppercase tracking-wider text-[var(--muted)]">
          {card.tipo === "listening" ? "Ouça o nativo" : "Situação"}
        </p>
        <h1 className="mt-2 text-xl font-semibold leading-snug sm:text-2xl">{card.situacao_pt}</h1>

        {card.tipo === "listening" && stage === "prompt" && (
          <div className="mt-5 flex justify-center">
            <PlayButtons line={{ kana: card.kana_oculto, audio_url: card.audio_url }} />
          </div>
        )}

        {(stage === "prompt" || stage === "capturing") && (
          <div className="mt-6 flex flex-col items-center gap-4">
            {card.tipo === "speaking" && (
              <ReflexTimer durationMs={REFLEX_MS} running={stage === "capturing"} latencyMs={voice.latency} level={voice.level} />
            )}
            {stage === "capturing" && fase >= 2 && voice.interim && (
              <p className="font-jp text-lg text-[var(--muted)]">{voice.interim}</p>
            )}
            {stage === "capturing" && fase === 1 && (
              <p className="text-sm text-[var(--muted)]">{voice.latency === null ? "Microfone aberto…" : "Ouvindo…"}</p>
            )}
            <div className="flex flex-wrap justify-center gap-2">
              {stage === "prompt" ? (
                <button
                  onClick={speak}
                  className="flex h-12 items-center gap-2 rounded-xl bg-[var(--accent)] px-6 font-bold text-black"
                >
                  <Mic size={20} /> {card.tipo === "listening" ? "Responder falando" : "Falar"}
                  <kbd className="ml-1 hidden rounded bg-black/15 px-1.5 text-[10px] sm:inline">espaço</kbd>
                </button>
              ) : (
                <button onClick={voice.stop} className="flex h-12 items-center gap-2 rounded-xl bg-[var(--bad)] px-6 font-bold text-black">
                  <Square size={18} /> Parar
                </button>
              )}
              {stage === "prompt" && card.tipo === "speaking" && (
                <button
                  onClick={darDica}
                  disabled={dica >= 2}
                  title="1ª dica: o começo da frase · 2ª: a frase inteira (limita a nota a Hard)"
                  className="flex h-12 items-center gap-2 rounded-xl border border-[var(--line)] px-4 text-sm text-[var(--muted)] disabled:opacity-40"
                >
                  <Lightbulb size={18} className={dica ? "text-[var(--warn)]" : ""} />
                  {dica === 0 ? "Ouvir dica" : dica === 1 ? "Dica: frase inteira" : "Dicas usadas"}
                  <kbd className="ml-1 hidden rounded bg-white/10 px-1.5 text-[10px] sm:inline">H</kbd>
                </button>
              )}
              {stage === "prompt" && (
                <button
                  onClick={() => reveal(null)}
                  className="flex h-12 items-center gap-2 rounded-xl border border-[var(--line)] px-5 text-sm text-[var(--muted)]"
                >
                  <Eye size={18} /> Revelar
                  <kbd className="ml-1 hidden rounded bg-white/10 px-1.5 text-[10px] sm:inline">enter</kbd>
                </button>
              )}
            </div>
          </div>
        )}
        {stage === "prompt" && recemAprendido && (
          <p className="mt-4 text-xs text-sky-300">Você acabou de aprender esta frase — agora diga sozinho, sem ouvir antes.</p>
        )}
        {stage === "prompt" && dica > 0 && (
          <p className="mt-2 text-xs text-[var(--warn)]">Dica usada: a avaliação sugerida fica no máximo em Hard.</p>
        )}
      </section>
      )}

      {/* Verso */}
      {stage === "revealed" && (
        <div className="space-y-4 animate-rise">
          <section className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
            <PitchAccentVisualizer moras={card.moras} playing={playing.on} moraMs={165 / playing.rate} />
            <ScriptLayer kana={card.kana_oculto} kanji={card.kanji_oculto} className="text-center" lockedHint />
            <div className="flex flex-wrap items-center justify-center gap-2">
              <PlayButtons
                line={{ kana: card.kana_oculto, audio_url: card.audio_url }}
                onPlaying={(on, r) => setPlaying({ on, rate: r })}
              />
              <CompareButton
                line={{ kana: card.kana_oculto, audio_url: card.audio_url }}
                userUrl={result?.url ?? null}
                onPlaying={(on, r) => setPlaying({ on, rate: r })}
              />
            </div>
            <div className="flex justify-center">
              <RoleLegend moras={card.moras} />
            </div>
          </section>

          {result && <SpeechFeedback result={result} sim={sim} aiEval={aiEval} fase={fase} />}

          <PitchContourView blob={result?.blob ?? null} moras={card.moras} />

          <CognitiveBreakdown moras={card.moras} literal={card.significado_cognitivo} notas={card.notas_gramaticais} />

          <div className="sticky bottom-20 z-10 rounded-2xl bg-[var(--bg)]/90 py-2 backdrop-blur md:bottom-2">
            <RatingButtons intervals={intervals} suggested={suggested} disabled={saving} onRate={rate} />
          </div>
        </div>
      )}
    </div>
  );
}

function SpeechFeedback({
  result,
  sim,
  aiEval,
  fase,
}: {
  result: CaptureResult;
  sim: number | null;
  aiEval: AiEval | "loading" | null;
  fase: number;
}) {
  const pct = sim === null ? null : Math.round(sim * 100);
  const tone = pct === null ? "var(--muted)" : pct >= 85 ? "var(--ok)" : pct >= 60 ? "var(--warn)" : "var(--bad)";
  return (
    <section className="grid gap-3 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 sm:grid-cols-3">
      <Stat label="Reação" value={result.latencyMs === null ? "silêncio" : `${(result.latencyMs / 1000).toFixed(1)}s`} />
      <Stat
        label="Correspondência sonora"
        value={pct === null ? (result.sttSource === "none" ? "sem STT" : "—") : `${pct}%`}
        color={tone}
      />
      <Stat label="Duração da fala" value={`${(result.speechMs / 1000).toFixed(1)}s`} />
      {fase >= 2 && result.transcript && (
        <p className="font-jp text-sm text-[var(--muted)] sm:col-span-3">
          Reconhecido: <span className="text-[var(--fg)]">{result.transcript}</span>
        </p>
      )}
      {aiEval === "loading" && (
        <p className="flex items-center gap-2 text-sm text-[var(--muted)] sm:col-span-3">
          <Loader2 size={14} className="animate-spin" /> Coach avaliando o sentido…
        </p>
      )}
      {aiEval && aiEval !== "loading" && (
        <p className="flex items-start gap-2 text-sm sm:col-span-3">
          <Sparkles size={16} className={aiEval.faz_sentido ? "text-[var(--ok)]" : "text-[var(--warn)]"} />
          <span>
            <b>{aiEval.faz_sentido ? "Faz sentido!" : "Ainda não comunica a ideia."}</b> {aiEval.feedback_pt}
          </span>
        </p>
      )}
    </section>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">{label}</p>
      <p className="text-xl font-bold tabular-nums" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

function suggestGrade(tipo: string | undefined, r: CaptureResult | null, sim: number | null, dica: number): Grade | null {
  const g = gradeFromSpeech(tipo, r, sim);
  return g !== null && dica > 0 ? (Math.min(g, 2) as Grade) : g;
}

function gradeFromSpeech(tipo: string | undefined, r: CaptureResult | null, sim: number | null): Grade | null {
  if (tipo !== "speaking" || !r) return null;
  if (r.latencyMs === null) return 1;
  if (sim === null) return r.latencyMs > REFLEX_MS ? 2 : null;
  if (sim < 0.5) return 1;
  if (sim < 0.75 || r.latencyMs > REFLEX_MS) return 2;
  if (sim >= 0.9 && r.latencyMs <= 1500) return 4;
  return 3;
}
