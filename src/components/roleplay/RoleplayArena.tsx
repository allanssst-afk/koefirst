"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  Loader2,
  Mic,
  RotateCcw,
  SkipForward,
  Square,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import { usePhase } from "../PhaseProvider";
import { useVoiceCapture } from "../useVoiceCapture";
import { CoachWhisper } from "./CoachWhisper";
import { JaBubble } from "./JaBubble";
import { useRouter } from "next/navigation";
import { somConclusao } from "@/lib/audio/som";
import { playUrl, speakJa, stopAll } from "@/lib/audio/tts";
import { CATEGORIAS, type Categoria, type Pessoa } from "@/lib/roleplay";
import { concluirLicao, registrarAtividade } from "@/lib/queries";
import { containsAny } from "@/lib/text";
import type { JaLine } from "@/lib/types";

export interface PassoView {
  ia: JaLine;
  quem: Pessoa | null;
  dica_pt: string | null;
  chaves: string[];
  exemplo: JaLine | null;
}

export interface ScenarioView {
  id: string;
  titulo: string;
  missao_pt: string;
  nivel: number;
  categoria: Categoria;
  emoji: string;
  parceiro: Pessoa;
  vocabTotal: number;
  vocabAprendido: number;
  roteiro: PassoView[];
}

type Msg =
  | { kind: "ia"; line: JaLine; quem: Pessoa }
  | { kind: "user"; text: string; url: string | null; ms: number }
  | { kind: "feedback"; ok: boolean; text: string }
  | { kind: "modelo"; line: JaLine };

export function RoleplayArena({
  scenarios,
  missaoInicial,
  licao,
}: {
  scenarios: ScenarioView[];
  /** missão aberta direto (vindo de um nó de Diálogo da trilha) */
  missaoInicial?: string | null;
  /** lição da trilha a marcar como concluída quando a missão terminar */
  licao?: string | null;
}) {
  const router = useRouter();
  const [active, setActive] = useState<ScenarioView | null>(() => scenarios.find((s) => s.id === missaoInicial) ?? null);
  const [rodada, setRodada] = useState(0);
  const [filtro, setFiltro] = useState<Categoria | "todas">("todas");

  const porCategoria = useMemo(
    () =>
      CATEGORIAS.map((c) => ({ ...c, cenarios: scenarios.filter((s) => s.categoria === c.id) })).filter(
        (c) => c.cenarios.length > 0,
      ),
    [scenarios],
  );

  if (active) {
    return (
      <div className="mx-auto max-w-3xl">
        <Conversation
          key={`${active.id}-${rodada}`}
          scenario={active}
          onExit={() => (licao ? router.push("/") : setActive(null))}
          onRestart={() => setRodada((r) => r + 1)}
          daTrilha={!!licao}
          aoConcluir={licao ? (acertos, etapas) => void concluirLicao(licao, 15, acertos, etapas) : undefined}
        />
      </div>
    );
  }

  const visiveis = filtro === "todas" ? porCategoria : porCategoria.filter((c) => c.id === filtro);

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-rise">
      <header className="space-y-2">
        <h1 className="text-2xl font-black">Arena de Diálogos</h1>
        <p className="max-w-2xl text-sm text-[var(--muted)]">
          Simulações de conversas do dia a dia, por voz. Escolha uma situação, ouça o parceiro e responda em japonês. Se
          travar, use <b className="text-[var(--fg)]">💡 Como responder?</b> ou o Coach.
        </p>
      </header>

      <nav className="flex flex-wrap gap-2">
        <Chip ativo={filtro === "todas"} onClick={() => setFiltro("todas")}>
          Todas <span className="opacity-60">{scenarios.length}</span>
        </Chip>
        {porCategoria.map((c) => (
          <Chip key={c.id} ativo={filtro === c.id} onClick={() => setFiltro(c.id)}>
            {c.emoji} {c.label} <span className="opacity-60">{c.cenarios.length}</span>
          </Chip>
        ))}
      </nav>

      {visiveis.map((c) => (
        <section key={c.id} className="space-y-3">
          <div className="flex items-baseline gap-2">
            <h2 className="text-lg font-bold">
              {c.emoji} {c.label}
            </h2>
            <span className="text-xs text-[var(--muted)]">{c.desc}</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {c.cenarios.map((s) => (
              <ScenarioCard key={s.id} s={s} onClick={() => setActive(s)} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function Chip({ ativo, onClick, children }: { ativo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        ativo
          ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)]"
          : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg)]"
      }`}
    >
      {children}
    </button>
  );
}

function ScenarioCard({ s, onClick }: { s: ScenarioView; onClick: () => void }) {
  const falas = s.roteiro.filter((p) => p.chaves.length > 0).length;
  const pronto = s.vocabAprendido / Math.max(1, s.vocabTotal);
  return (
    <button
      onClick={onClick}
      className="group flex h-full gap-4 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 text-left transition hover:border-[var(--accent)]/60 hover:bg-[var(--panel-2)]"
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--bg)] text-3xl" aria-hidden>
        {s.emoji}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-bold leading-snug group-hover:text-[var(--accent)]">{s.titulo}</span>
        <span className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{s.missao_pt}</span>
        <span className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 text-[11px] text-[var(--muted)]">
          <span>
            {s.parceiro.emoji} {s.parceiro.nome}
          </span>
          <span>🎙 {falas} falas</span>
          <span>nível {s.nivel}</span>
          <span className="flex items-center gap-1.5" title="Frases-base desta missão que você já praticou no Estúdio">
            <span className="h-1 w-10 overflow-hidden rounded-full bg-[var(--line)]">
              <span className="block h-full bg-[var(--ok)]" style={{ width: `${pronto * 100}%` }} />
            </span>
            {s.vocabAprendido}/{s.vocabTotal}
          </span>
        </span>
      </span>
    </button>
  );
}

function Conversation({
  scenario,
  onExit,
  onRestart,
  daTrilha = false,
  aoConcluir,
}: {
  scenario: ScenarioView;
  onExit: () => void;
  onRestart: () => void;
  daTrilha?: boolean;
  aoConcluir?: (acertos: number, etapas: number) => void;
}) {
  const { fase } = usePhase();
  const voice = useVoiceCapture();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [passo, setPasso] = useState(0);
  const [falhas, setFalhas] = useState(0);
  const [modeloVisto, setModeloVisto] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [fim, setFim] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const bottom = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const categoria = CATEGORIAS.find((c) => c.id === scenario.categoria);
  const etapas = scenario.roteiro.filter((p) => p.chaves.length > 0).length;

  const concluiu = useRef(false);
  useEffect(() => {
    if (fim && !concluiu.current) {
      concluiu.current = true;
      somConclusao();
      aoConcluir?.(acertos, etapas);
    }
  }, [fim, acertos, etapas, aoConcluir]);

  const lastIa = [...msgs].reverse().find((m): m is Extract<Msg, { kind: "ia" }> => m.kind === "ia")?.line;

  const sayIa = useCallback(
    (line: JaLine, quem?: Pessoa | null) => {
      setMsgs((m) => [...m, { kind: "ia", line, quem: quem ?? scenario.parceiro }]);
      speakJa(line.kana);
    },
    [scenario.parceiro],
  );

  useEffect(() => {
    if (!started.current) {
      started.current = true;
      sayIa(scenario.roteiro[0].ia, scenario.roteiro[0].quem);
    }
    return () => stopAll();
  }, [scenario, sayIa]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, thinking]);


  const avancar = () => {
    const next = passo + 1;
    setFalhas(0);
    setModeloVisto(false);
    if (next < scenario.roteiro.length) {
      setPasso(next);
      setTimeout(() => sayIa(scenario.roteiro[next].ia, scenario.roteiro[next].quem), 400);
      if (!scenario.roteiro[next].chaves.length) setFim(true);
    } else setFim(true);
  };

  const handleUser = async (alternatives: string[], url: string | null, ms: number) => {
    const text = alternatives[0] ?? "";
    setMsgs((m) => [...m, { kind: "user", text, url, ms }]);
    if (ms) {
      registrarAtividade("roleplay", ms);
    }


    // Roteiro guiado
    const step = scenario.roteiro[passo];
    const ok = alternatives.length > 0 && containsAny(alternatives, step.chaves);
    if (ok) {
      if (falhas === 0 && !modeloVisto) setAcertos((a) => a + 1);
      setMsgs((m) => [...m, { kind: "feedback", ok: true, text: "Entendido! ✓" }]);
      avancar();
    } else {
      setFalhas((n) => n + 1);
      setMsgs((m) => [
        ...m,
        {
          kind: "feedback",
          ok: false,
          text: alternatives.length ? "Não foi bem isso. Tente de novo ou veja como responder." : "Não consegui ouvir. Fale mais perto do microfone.",
        },
      ]);
      if (falhas + 1 >= 2 && step.exemplo && !modeloVisto) mostrarModelo();
    }
  };

  const mostrarModelo = () => {
    const ex = scenario.roteiro[passo]?.exemplo;
    if (!ex || modeloVisto) return;
    setModeloVisto(true);
    setMsgs((m) => [...m, { kind: "modelo", line: ex }]);
    speakJa(ex.kana);
  };

  const falar = async () => {
    stopAll();
    const r = await voice.start({ lang: "ja-JP", maxMs: 12_000, silenceStartMs: 8000 });
    if (r.latencyMs === null && !r.alternatives.length) {
      setMsgs((m) => [...m, { kind: "feedback", ok: false, text: "Não ouvi nada. Toque no microfone e fale." }]);
      return;
    }
    handleUser(r.alternatives, r.url, r.speechMs);
  };

  const enviarTexto = () => {
    if (!typed.trim()) return;
    handleUser([typed.trim()], null, 0);
    setTyped("");
  };

  const step = scenario.roteiro[passo];
  const feitas = Math.min(passo, etapas);

  return (
    <div className="space-y-4">
      {/* Cena */}
      <header className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4">
        <div className="flex items-start gap-3">
          <button onClick={onExit} className="rounded-lg border border-[var(--line)] p-1.5 text-[var(--muted)]" aria-label="Voltar às missões">
            <ArrowLeft size={16} />
          </button>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--bg)] text-2xl" aria-hidden>
            {scenario.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
              {categoria?.emoji} {categoria?.label}
            </p>
            <h1 className="text-lg font-black leading-tight">{scenario.titulo}</h1>
          </div>
        </div>
        <p className="mt-3 text-sm text-[var(--muted)]">
          <b className="text-[var(--fg)]">Missão:</b> {scenario.missao_pt}
        </p>
        {(
          <div className="mt-3 flex items-center gap-1.5" aria-label={`Etapa ${feitas} de ${etapas}`}>
            {Array.from({ length: etapas }, (_, i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full ${
                  i < feitas || fim ? "bg-[var(--ok)]" : i === passo ? "bg-[var(--accent)]" : "bg-[var(--line)]"
                }`}
              />
            ))}
          </div>
        )}
      </header>

      {/* Conversa */}
      <div className="space-y-4">
        {msgs.map((m, i) =>
          m.kind === "ia" ? (
            <div key={i} className="flex items-start gap-2 animate-rise">
              <Avatar emoji={m.quem.emoji} />
              <div className="min-w-0 flex-1 sm:max-w-[85%]">
                <p className="mb-1 text-xs font-semibold text-[var(--muted)]">{m.quem.nome}</p>
                <JaBubble line={m.line} defaultOpen={fase === 1} />
              </div>
            </div>
          ) : m.kind === "user" ? (
            <div key={i} className="flex justify-end animate-rise">
              <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-[var(--accent)]/15 px-4 py-3 text-right">
                <p className="text-xs font-semibold text-[var(--accent)]">Você</p>
                {fase >= 2 || !m.url ? (
                  <p className="font-jp text-lg">{m.text || "…"}</p>
                ) : (
                  <p className="text-sm text-[var(--muted)]">🎙 fala de {(m.ms / 1000).toFixed(1)}s (texto oculto na Fase 1)</p>
                )}
                {m.url && (
                  <button onClick={() => playUrl(m.url!)} className="mt-1 text-xs text-[var(--accent)] underline">
                    ouvir minha fala
                  </button>
                )}
              </div>
            </div>
          ) : m.kind === "feedback" ? (
            <p
              key={i}
              className={`mx-auto flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs animate-rise ${
                m.ok ? "bg-[var(--ok)]/10 text-[var(--ok)]" : "bg-[var(--warn)]/10 text-[var(--warn)]"
              }`}
            >
              {m.ok ? <CheckCircle2 size={14} /> : <XCircle size={14} />} {m.text}
            </p>
          ) : (
            <div key={i} className="ml-10 border-l-2 border-[var(--accent)]/60 pl-3 animate-rise">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)]">
                <Lightbulb size={14} /> Como responder — ouça e repita:
              </p>
              <JaBubble line={m.line} defaultOpen />
            </div>
          ),
        )}
        {thinking && (
          <p className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <Loader2 size={14} className="animate-spin" /> {scenario.parceiro.nome} está pensando…
          </p>
        )}
        <div ref={bottom} />
      </div>

      {/* Painel de resposta */}
      {fim ? (
        <div className="space-y-3 rounded-2xl border border-[var(--ok)]/40 bg-[var(--ok)]/10 p-5 text-center">
          <Trophy className="mx-auto text-[var(--ok)]" />
          <p className="font-bold">Missão cumprida!</p>
          {(
            <p className="text-sm text-[var(--muted)]">
              {acertos} de {etapas} respostas certas de primeira, sem ajuda.
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-2">
            <button onClick={onRestart} className="flex items-center gap-2 rounded-xl border border-[var(--line)] px-4 py-2 text-sm">
              <RotateCcw size={16} /> Repetir missão
            </button>
            <button onClick={onExit} className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-bold text-black">
              {daTrilha ? "Voltar para a trilha" : "Escolher outra missão"}
            </button>
          </div>
        </div>
      ) : (
        <div className="sticky bottom-20 z-10 space-y-2.5 rounded-2xl border border-[var(--line)] bg-[var(--bg)]/95 p-3 shadow-xl shadow-black/40 backdrop-blur md:bottom-3">
          <p className="flex items-start gap-2 text-sm">
            <Target size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />
            <span>
              <b>Sua vez:</b>{" "}
              <span className="text-[var(--muted)]">
                {step?.dica_pt ? step.dica_pt : `responda a ${lastIa ? "esta fala" : "o parceiro"} em japonês.`}
              </span>
            </span>
          </p>
          <div className="flex items-center gap-2">
            {voice.status === "recording" ? (
              <button onClick={voice.stop} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--bad)] font-bold text-black">
                <Square size={16} /> Parar {voice.latency !== null && "· ouvindo"}
              </button>
            ) : (
              <button
                onClick={falar}
                disabled={thinking}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] font-bold text-black disabled:opacity-50"
              >
                <Mic size={18} /> Responder em japonês
              </button>
            )}
            {step?.exemplo && (
              <button
                onClick={mostrarModelo}
                disabled={modeloVisto}
                title="Mostra e toca uma resposta-modelo"
                className="flex h-12 items-center gap-1.5 rounded-xl border border-[var(--line)] px-3 text-xs text-[var(--fg)] disabled:opacity-40"
              >
                <Lightbulb size={16} className="text-[var(--warn)]" />
                <span className="hidden sm:inline">Como responder?</span>
              </button>
            )}
            {(falhas > 0 || modeloVisto) && (
              <button
                onClick={avancar}
                className="flex h-12 items-center gap-1 rounded-xl border border-[var(--line)] px-3 text-xs text-[var(--muted)]"
              >
                <SkipForward size={14} /> Pular
              </button>
            )}
          </div>
          {fase >= 2 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                enviarTexto();
              }}
            >
              <input
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder="ou digite em japonês…"
                className="font-jp w-full rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
              />
            </form>
          )}
        </div>
      )}

      {!fim && (
        <CoachWhisper
        open={coachOpen}
        onOpenChange={setCoachOpen}
        contexto={lastIa ? `${scenario.titulo}. Última fala do parceiro: ${lastIa.kana} (${lastIa.pt})` : scenario.titulo}
        onResume={() => lastIa && speakJa(lastIa.kana)}
        />
      )}
    </div>
  );
}

function Avatar({ emoji }: { emoji: string }) {
  return (
    <span className="mt-5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--panel)] text-lg" aria-hidden>
      {emoji}
    </span>
  );
}
