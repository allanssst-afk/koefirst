"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftRight, Check, Mic, Play, RotateCcw, Square, Volume2, X } from "lucide-react";
import { PlayButtons } from "@/components/AudioControls";
import { AtalhosEstudo } from "@/components/AtalhosEstudo";
import { ContextPicker, lerContextoSalvo, salvarContexto, type Contexto } from "@/components/ContextPicker";
import { PitchAccentVisualizer } from "@/components/PitchAccentVisualizer";
import { usePhase } from "@/components/PhaseProvider";
import { ReflexTimer } from "@/components/ReflexTimer";
import { ScriptLayer } from "@/components/ScriptLayer";
import { useVoiceCapture } from "@/components/useVoiceCapture";
import type { CaptureResult } from "@/lib/audio/capture";
import { speakJa, stopAll, wait } from "@/lib/audio/tts";
import {
  cenasDoContexto,
  combina,
  FORMAS,
  montarDialogo,
  PARCEIRO_DRILL,
  type CenaDrill,
  type DialogoDrill,
  type FalaDrill,
  type Forma,
} from "@/lib/drills";
import { registrarAtividade } from "@/lib/queries";
import { CATEGORIAS } from "@/lib/roleplay";
import { bestSimilarity, containsAny } from "@/lib/text";

const JANELAS = [3000, 5000, 8000, 15000];
const TREINAVEIS: Forma[] = ["mashita", "masen", "masen_deshita", "tai", "mashou", "te_kudasai", "te_imasu", "koto", "nakereba", "ta", "nakatta", "ta_koto", "ou_to"];

type Stage = "setup" | "cue" | "ready" | "listening" | "result";
/** completo = frase inteira · parcial = só o verbo transformado · erro = nem o verbo */
type Nota = "completo" | "parcial" | "erro";

interface Round {
  cena: CenaDrill;
  forma: Forma;
  dialogo: DialogoDrill;
  result: CaptureResult | null;
  nota: Nota | null;
}

/** Avalia a frase falada: verbo transformado + palavra principal do complemento. */
function avaliar(alts: string[], d: DialogoDrill): Nota {
  const verbo = containsAny(alts, d.alvos.verbo) || bestSimilarity(alts, d.alvos.verbo) >= 0.8;
  const complemento = containsAny(alts, d.alvos.complemento) || bestSimilarity(alts, d.alvos.frase) >= 0.75;
  if (verbo && complemento) return "completo";
  return verbo ? "parcial" : "erro";
}

export default function DrillsPage() {
  const { fase } = usePhase();
  const voice = useVoiceCapture();
  const [contexto, setContexto] = useState<Contexto>("todos");
  const [formas, setFormas] = useState<Forma[]>(["mashita", "masen", "tai"]);
  const [janela, setJanela] = useState(8000);
  const [stage, setStage] = useState<Stage>("setup");
  const [round, setRound] = useState<Round | null>(null);
  const [placar, setPlacar] = useState({ rodadas: 0, acertos: 0, seq: 0, melhorSeq: 0, latSoma: 0, latN: 0 });
  const [tocando, setTocando] = useState<"pergunta" | "resposta" | null>(null);
  const last = useRef<string>("");
  const roundRef = useRef<Round | null>(null);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    setContexto(lerContextoSalvo());
    return () => {
      alive.current = false;
      stopAll();
    };
  }, []);

  const registrar = useCallback((r: Round, nota: Nota) => {
    const acertou = nota === "completo";
    setRound({ ...r, nota });
    setPlacar((p) => {
      const seq = acertou ? p.seq + 1 : 0;
      const lat = r.result?.latencyMs;
      return {
        rodadas: p.rodadas + 1,
        acertos: p.acertos + (acertou ? 1 : 0),
        seq,
        melhorSeq: Math.max(p.melhorSeq, seq),
        latSoma: p.latSoma + (lat ?? 0),
        latN: p.latN + (lat != null ? 1 : 0),
      };
    });
    registrarAtividade("drills", r.result?.speechMs ?? 0, acertou);
  }, []);

  const tocar = useCallback(async (qual: "pergunta" | "resposta", f: FalaDrill, rate = 1) => {
    setTocando(qual);
    await speakJa(f.kana, { rate });
    setTocando(null);
  }, []);

  const novaRodada = useCallback(async () => {
    if (!formas.length) return;
    stopAll();
    // sorteia entre os pares (situação, transformação) que combinam; sem repetir a rodada anterior
    const pares = cenasDoContexto(contexto).flatMap((c) => formas.filter((f) => combina(c, f)).map((f) => [c, f] as const));
    if (!pares.length) return;
    const semRepetir = pares.filter(([c, f]) => `${c.verbo}-${c.obj}-${f}` !== last.current);
    const [cena, forma] = (semRepetir.length ? semRepetir : pares)[Math.floor(Math.random() * (semRepetir.length || pares.length))];
    last.current = `${cena.verbo}-${cena.obj}-${forma}`;
    const r: Round = { cena, forma, dialogo: montarDialogo(cena, forma), result: null, nota: null };
    roundRef.current = r;
    setRound(r);
    setStage("cue");

    // 1. o parceiro pergunta em japonês → 2. você lê o contexto com calma e decide quando responder
    await tocar("pergunta", r.dialogo.pergunta);
    if (alive.current && roundRef.current === r) setStage("ready");
  }, [formas, contexto, tocar]);

  /** Só agora o tempo começa a contar: o usuário já entendeu a situação. */
  const responder = useCallback(async () => {
    const r = roundRef.current;
    if (!r) return;
    stopAll();
    setStage("listening");
    const result = await voice.start({
      lang: "ja-JP",
      maxMs: janela + 5000,
      silenceStartMs: janela + 1500,
      silenceEndMs: 1100,
    });
    if (!alive.current) return;
    const withResult = { ...r, result };
    setStage("result");
    if (result.alternatives.length) registrar(withResult, avaliar(result.alternatives, r.dialogo));
    else if (result.latencyMs === null) registrar(withResult, "erro");
    else setRound(withResult); // sem STT: autoavaliação
    await wait(300);
    if (alive.current) await tocar("resposta", r.dialogo.resposta);
  }, [voice, registrar, janela, tocar]);

  const comecar = () => {
    salvarContexto(contexto);
    setPlacar({ rodadas: 0, acertos: 0, seq: 0, melhorSeq: 0, latSoma: 0, latN: 0 });
    novaRodada();
  };

  const voltarAoInicio = () => {
    roundRef.current = null;
    stopAll();
    voice.stop();
    setRound(null);
    setStage("setup");
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      e.preventDefault();
      if (stage === "ready") responder();
      else if (stage === "listening") voice.stop();
      else if (stage === "result" && round?.nota) novaRodada();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage, round, voice, novaRodada, responder]);

  // Mantém pelo menos uma transformação ligada (dá para ajustar também durante a sessão).
  // a combinação escolhida tem pelo menos uma situação possível (o pedido não serve para lazer, por exemplo)
  const possivel = cenasDoContexto(contexto).some((c) => formas.some((f) => combina(c, f)));
  const toggle = (f: Forma) =>
    setFormas((fs) => (fs.includes(f) ? (fs.length > 1 ? fs.filter((x) => x !== f) : fs) : [...fs, f]));
  const pctAcerto = placar.rodadas ? Math.round((placar.acertos / placar.rodadas) * 100) : 0;
  const latMedia = placar.latN ? (placar.latSoma / placar.latN / 1000).toFixed(1) : "—";
  const ctxInfo = CATEGORIAS.find((c) => c.id === contexto);

  if (stage === "setup" || !round) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 animate-rise">
        <header>
          <h1 className="text-2xl font-black">Ping-Pong de Ginástica Gramatical</h1>
          <p className="text-sm text-[var(--muted)]">
            Uma pessoa te faz uma pergunta em japonês. Você responde com a frase inteira, educada, transformando o verbo
            (passado, negativo, desejo…). As palavras da frase aparecem como peças para você montar a resposta.
          </p>
        </header>

        <AtalhosEstudo />

        <section className="space-y-2">
          <h2 className="text-sm font-semibold">1. Em que contexto você vai usar?</h2>
          <ContextPicker
            value={contexto}
            onChange={setContexto}
            detalhe={(c) => `${cenasDoContexto(c).length} situações`}
          />
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold">2. Quais transformações treinar?</h2>
          <FormasChips formas={formas} onToggle={toggle} />
          {formas.length > 0 && !possivel && (
            <p className="text-xs text-[var(--warn)]">
              Nenhuma situação deste contexto combina com essas transformações (o pedido serve para tarefas, como no
              trabalho e nas compras). Inclua outra transformação ou troque o contexto.
            </p>
          )}
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold">3. Quanto tempo para responder?</h2>
          <span className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
            {JANELAS.map((ms) => (
              <button
                key={ms}
                onClick={() => setJanela(ms)}
                className={`rounded-lg border px-2.5 py-1 ${
                  janela === ms ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--line)]"
                }`}
              >
                {ms / 1000}s{ms === 3000 && " (meta)"}
              </button>
            ))}
          </span>
        </section>

        <button
          onClick={comecar}
          disabled={!formas.length || !possivel}
          className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[var(--accent)] text-lg font-black text-black disabled:opacity-40"
        >
          <Play /> Começar
        </button>
      </div>
    );
  }

  const { dialogo } = round;
  const f = FORMAS[round.forma];

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <header className="flex items-center gap-2">
        <h1 className="flex-1 text-lg font-black">Ping-Pong</h1>
        <button
          onClick={voltarAoInicio}
          className="flex items-center gap-1.5 rounded-full border border-[var(--line)] px-3 py-1 text-xs text-[var(--muted)] hover:text-[var(--fg)]"
          title="Trocar contexto ou transformações"
        >
          {ctxInfo ? `${ctxInfo.emoji} ${ctxInfo.label}` : "🎲 Tudo misturado"}
          <ArrowLeftRight size={12} />
        </button>
      </header>

      <FormasChips formas={formas} onToggle={toggle} atual={round.forma} />

      <section className="grid grid-cols-4 gap-2 text-center">
        {[
          ["Rodadas", placar.rodadas],
          ["Frases completas", `${pctAcerto}%`],
          [`Seq. (máx ${placar.melhorSeq})`, placar.seq],
          ["Reação média", `${latMedia}s`],
        ].map(([l, v]) => (
          <div key={l} className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-2">
            <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">{l}</p>
            <p className="text-lg font-bold tabular-nums">{v}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 animate-rise">
        {/* Pergunta do parceiro, em japonês */}
        <div className="max-w-[92%] space-y-2 rounded-2xl rounded-tl-sm bg-[var(--bg)] p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold text-[var(--muted)]">{PARCEIRO_DRILL[contexto]}</p>
            <button
              onClick={() => tocar("pergunta", dialogo.pergunta)}
              className="flex items-center gap-1 rounded-lg border border-[var(--line)] px-2 py-1 text-[11px] text-[var(--muted)]"
            >
              <Volume2 size={12} /> ouvir de novo
            </button>
          </div>
          <PitchAccentVisualizer moras={dialogo.pergunta.moras} size="sm" playing={tocando === "pergunta"} />
          <ScriptLayer kana={dialogo.pergunta.kana} kanji={dialogo.pergunta.kanji} className="text-lg" />
          <p className="text-sm text-[var(--muted)]">“{dialogo.pergunta.pt}”</p>
        </div>

        {/* Sua resposta */}
        <div className="ml-auto max-w-[92%] space-y-1 rounded-2xl rounded-tr-sm border border-[var(--accent)]/60 bg-[var(--accent)]/10 p-4 text-right">
          <p className="text-[11px] font-semibold text-[var(--accent)]">Você responde em japonês, com a frase inteira:</p>
          <p className="text-lg font-black text-[var(--accent)]">«{dialogo.resposta.pt}»</p>
          {stage !== "result" && (
            <p className="text-xs text-[var(--muted)]">
              Transformação: <span className="font-mono text-[var(--fg)]">{f.regra}</span>
              {round.forma === "te_kudasai"
                ? " · quem vai fazer é a outra pessoa"
                : dialogo.resposta.pt.includes("(eu)")
                  ? " · o «(eu)» fica implícito em japonês"
                  : ""}
            </p>
          )}
        </div>

        {/* Peças para montar a resposta */}
        {stage !== "result" && (
          <div className="space-y-2">
            <p className="text-center text-[10px] uppercase tracking-wider text-[var(--muted)]">Peças da frase</p>
            <div className="flex flex-wrap items-start justify-center gap-3">
              {dialogo.pecas.map((p, i) => (
                <button
                  key={i}
                  onClick={() => speakJa(p.kana)}
                  title="Ouvir esta peça"
                  className="rounded-xl border border-[var(--line)] bg-[var(--bg)] px-2 pb-2 pt-1 hover:border-[var(--muted)]"
                >
                  <PitchAccentVisualizer moras={p.moras} size="sm" showFuncao={false} />
                  <span className="mt-1 flex items-center justify-center gap-1 text-[11px] text-[var(--muted)]">
                    <Volume2 size={11} /> {p.pt}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {(stage === "cue" || stage === "ready") && (
          <div className="flex flex-col items-center gap-2 pt-1">
            <button
              onClick={responder}
              disabled={stage !== "ready"}
              className="flex h-14 w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] text-lg font-black text-black disabled:opacity-40"
            >
              <Mic size={20} /> {stage === "cue" ? "Ouvindo a pergunta…" : "Estou pronto — responder"}
              <kbd className="ml-1 hidden rounded bg-black/15 px-1.5 text-[10px] sm:inline">espaço</kbd>
            </button>
            <p className="text-xs text-[var(--muted)]">
              Leia a situação e ouça as peças com calma. O tempo de {janela / 1000}s só começa quando você apertar.
            </p>
          </div>
        )}

        {stage === "listening" && (
          <div className="flex flex-col items-center gap-3">
            <ReflexTimer durationMs={janela} running latencyMs={voice.latency} level={voice.level} size={112} />
            <button onClick={voice.stop} className="flex items-center gap-2 rounded-xl bg-[var(--bad)] px-4 py-2 text-sm font-bold text-black">
              <Square size={14} /> Terminei
            </button>
          </div>
        )}

        {stage === "result" && (
          <div className="space-y-4 text-center">
            {round.nota === null ? (
              <div className="space-y-2">
                <p className="text-sm text-[var(--muted)]">Sem reconhecimento de voz: compare com o modelo e avalie-se.</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button onClick={() => registrar(round, "completo")} className="flex items-center gap-1 rounded-xl bg-[var(--ok)] px-4 py-2 font-bold text-black">
                    <Check size={16} /> Disse a frase inteira
                  </button>
                  <button onClick={() => registrar(round, "parcial")} className="rounded-xl bg-[var(--warn)] px-4 py-2 font-bold text-black">
                    Só o verbo
                  </button>
                  <button onClick={() => registrar(round, "erro")} className="flex items-center gap-1 rounded-xl bg-[var(--bad)] px-4 py-2 font-bold text-black">
                    <X size={16} /> Errei
                  </button>
                </div>
              </div>
            ) : (
              <p
                className={`text-xl font-black ${
                  round.nota === "completo" ? "text-[var(--ok)]" : round.nota === "parcial" ? "text-[var(--warn)]" : "text-[var(--bad)]"
                }`}
              >
                {round.nota === "completo"
                  ? "✓ Frase completa!"
                  : round.nota === "parcial"
                    ? `◐ Verbo certo — faltou «${round.cena.obj}»`
                    : round.result?.latencyMs == null
                      ? "✗ Tempo esgotado"
                      : "✗ Ainda não — ouça o modelo e repita"}
                {round.result?.latencyMs != null && (
                  <span className="ml-2 text-sm font-normal text-[var(--muted)]">
                    reação {(round.result.latencyMs / 1000).toFixed(1)}s
                  </span>
                )}
              </p>
            )}
            <PitchAccentVisualizer moras={dialogo.resposta.moras} playing={tocando === "resposta"} />
            <ScriptLayer kana={dialogo.resposta.kana} kanji={dialogo.resposta.kanji} className="text-center" />
            <p className="text-sm text-[var(--muted)]">
              = <b className="text-[var(--fg)]">{dialogo.resposta.pt}</b> · <span className="font-mono">{f.regra}</span>
            </p>
            {fase >= 2 && round.result?.transcript && (
              <p className="font-jp text-sm text-[var(--muted)]">Você disse: {round.result.transcript}</p>
            )}
            <div className="flex flex-wrap justify-center gap-2">
              <PlayButtons
                line={{ kana: dialogo.resposta.kana }}
                onPlaying={(on) => setTocando(on ? "resposta" : null)}
              />
              {round.nota !== null && (
                <button onClick={novaRodada} className="flex h-11 items-center gap-2 rounded-xl border border-[var(--accent)] px-4 text-sm font-bold text-[var(--accent)]">
                  <RotateCcw size={16} /> Próximo
                  <kbd className="hidden rounded bg-white/10 px-1.5 text-[10px] sm:inline">espaço</kbd>
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

/** Legenda das transformações: liga/desliga cada uma e destaca a pedida na rodada atual. */
function FormasChips({ formas, onToggle, atual }: { formas: Forma[]; onToggle: (f: Forma) => void; atual?: Forma }) {
  return (
    <div className="flex flex-wrap gap-2">
      {TREINAVEIS.map((f) => {
        const ligada = formas.includes(f);
        const agora = atual === f;
        return (
          <button
            key={f}
            onClick={() => onToggle(f)}
            title={`${FORMAS[f].regra} · ${ligada ? "clique para tirar da sessão" : "clique para incluir na sessão"}`}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              agora
                ? "border-[var(--accent)] bg-[var(--accent)] text-black"
                : ligada
                  ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)]"
                  : "border-[var(--line)] text-[var(--muted)]"
            }`}
          >
            {FORMAS[f].label} <span className={agora ? "opacity-70" : "opacity-60"}>-{f.replace("_", " ")}</span>
          </button>
        );
      })}
    </div>
  );
}
