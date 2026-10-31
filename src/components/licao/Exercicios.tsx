"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Mic, Play, RotateCcw, Square, Volume2 } from "lucide-react";
import { CognitiveBreakdown } from "../CognitiveBreakdown";
import { PitchAccentVisualizer } from "../PitchAccentVisualizer";
import { usePhase } from "../PhaseProvider";
import { ScriptLayer } from "../ScriptLayer";
import { useVoiceCapture } from "../useVoiceCapture";
import { BalaoMascote, BotoesSom, Enunciado, Opcao, type ExProps } from "./comuns";
import { browserSttSupported } from "@/lib/audio/capture";
import { speakJa, stopAll, wait } from "@/lib/audio/tts";
import { FORMAS } from "@/lib/drills";
import { registrarAtividade } from "@/lib/queries";
import { roleOf } from "@/lib/roles";
import { bestSimilarity, morasToKana, parseFurigana, stripFurigana } from "@/lib/text";
import { chaveBloco, traducaoPrincipal, type Exercicio, type ProvaKana } from "@/lib/trilha";
import type { Mora } from "@/lib/types";

type Ex<T extends Exercicio["tipo"]> = Extract<Exercicio, { tipo: T }>;

/** Toca a frase uma vez quando o exercício aparece. */
function useTocarAoAbrir(texto: string, aoTocar?: (on: boolean) => void, voz?: number) {
  useEffect(() => {
    const t = setTimeout(async () => {
      aoTocar?.(true);
      await speakJa(texto, { voz });
      aoTocar?.(false);
    }, 350);
    return () => {
      clearTimeout(t);
      stopAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texto]);
}

// ───────────── Frase nova: apresentação (sem teste)

export function ExNova({ ex }: ExProps<Ex<"nova">>) {
  const { card } = ex;
  const palavra = card.tags.includes("palavra");
  const [tocando, setTocando] = useState(false);
  useTocarAoAbrir(card.kana, setTocando);
  return (
    <div className="space-y-6">
      <Enunciado rotulo={palavra ? "Palavra nova" : "Frase nova"}>Ouça e observe a melodia</Enunciado>
      <BalaoMascote>
        <div className="space-y-2">
          <BotoesSom texto={card.kana} aoTocar={(on) => setTocando(on)} />
          <PitchAccentVisualizer moras={card.moras} size="sm" playing={tocando} />
          <ScriptLayer kana={card.kana} kanji={card.kanji} className="text-xl" />
        </div>
      </BalaoMascote>
      <div className="space-y-1 text-center">
        <p className="text-2xl font-extrabold">{card.traducao}</p>
        {!palavra && <p className="text-sm text-[var(--muted)]">Quando usar: {card.situacao_pt}</p>}
      </div>
      {/* a lógica literal: como o japonês monta a ideia, bloco a bloco */}
      {!palavra && <CognitiveBreakdown moras={card.moras} literal={card.significado_cognitivo} notas={card.notas ? `💡 ${card.notas}` : undefined} />}
    </div>
  );
}

// ───────────── Escuta: ouça e escolha o significado

export function ExEscuta({ ex, travado, aoPronto }: ExProps<Ex<"escuta">>) {
  const [escolha, setEscolha] = useState<number | null>(null);
  useTocarAoAbrir(ex.card.kana);
  const certa = traducaoPrincipal(ex.card);
  const escolher = (i: number) => {
    setEscolha(i);
    aoPronto(() => ({ ok: ex.opcoes[i] === certa, correta: certa, literal: ex.card.significado_cognitivo, ouvir: ex.card.kana }));
  };
  return (
    <div className="space-y-6">
      <Enunciado>O que você ouviu?</Enunciado>
      <div className="flex justify-center py-4">
        <BotoesSom texto={ex.card.kana} grande />
      </div>
      <div className="space-y-3">
        {ex.opcoes.map((o, i) => (
          <Opcao key={o} numero={i + 1} ativo={escolha === i} travado={travado} onClick={() => escolher(i)}>
            {o}
          </Opcao>
        ))}
      </div>
    </div>
  );
}

// ───────────── Montar: ponha os blocos na ordem em que o japonês pensa

/** Um bloco do banco: função em português + o som (moras na Fase 1, kana depois), tocável. */
function PecaBloco({ bloco, onClick, travado }: { bloco: Mora[]; onClick: () => void; travado: boolean }) {
  const { fase } = usePhase();
  const r = roleOf(bloco[0].papel);
  return (
    <button
      disabled={travado}
      onClick={onClick}
      className={`btn rounded-xl border px-3 py-1.5 text-left ${r.chip}`}
      style={{ borderColor: r.hex }}
    >
      <span className="block text-[10px] font-extrabold uppercase tracking-wider opacity-70">{r.label}</span>
      <span className="block text-base font-bold leading-tight">{bloco[0].funcao}</span>
      <span className={`block text-xs opacity-80 ${fase >= 2 ? "font-jp" : ""}`}>
        {fase >= 2 ? morasToKana(bloco) : bloco.map((m) => m.som).join("·")}
      </span>
    </button>
  );
}

export function ExMontar({ ex, travado, aoPronto }: ExProps<Ex<"montar">>) {
  const [usadas, setUsadas] = useState<number[]>([]);

  useEffect(() => {
    if (!usadas.length) return aoPronto(null);
    const montada = usadas.map((i) => chaveBloco(ex.banco[i])).join(" ");
    aoPronto(() => ({
      ok: montada === ex.resposta.join(" "),
      correta: ex.card.blocos.map((b) => b[0].funcao).join(" → "),
      literal: ex.card.significado_cognitivo,
      ouvir: ex.card.kana,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usadas]);

  const pegar = (i: number) => {
    setUsadas((u) => [...u, i]);
    speakJa(morasToKana(ex.banco[i]));
  };

  return (
    <div className="space-y-6">
      <Enunciado rotulo="Ordem japonesa">Monte a frase em japonês</Enunciado>
      <BalaoMascote humor="feliz">
        <p className="text-xl font-bold">{traducaoPrincipal(ex.card)}</p>
        <p className="text-xs text-[var(--muted)]">{ex.card.situacao_pt}</p>
      </BalaoMascote>
      <p className="text-center text-xs text-[var(--muted)]">
        Toque nos blocos na ordem em que o japonês fala. {ex.banco.length - ex.resposta.length} blocos sobram.
      </p>

      {/* linha da resposta */}
      <div className="flex min-h-[6.5rem] flex-wrap content-start gap-2 border-y-2 border-[var(--line)] py-3">
        {usadas.map((i) => (
          <PecaBloco key={i} bloco={ex.banco[i]} travado={travado} onClick={() => setUsadas((u) => u.filter((x) => x !== i))} />
        ))}
      </div>

      {/* banco de blocos */}
      <div className="flex flex-wrap justify-center gap-2">
        {ex.banco.map((b, i) =>
          usadas.includes(i) ? (
            <span key={i} className="invisible">
              <PecaBloco bloco={b} travado onClick={() => {}} />
            </span>
          ) : (
            <PecaBloco key={i} bloco={b} travado={travado} onClick={() => pegar(i)} />
          ),
        )}
      </div>
    </div>
  );
}

// ───────────── Falar: diga a frase em japonês

export function ExFalar({ ex, travado, aoResponder, aoPular }: ExProps<Ex<"falar">>) {
  const { fase } = usePhase();
  const voice = useVoiceCapture();
  const [aviso, setAviso] = useState("");
  const [semStt, setSemStt] = useState(false);
  const [gravou, setGravou] = useState(false);

  useEffect(() => setSemStt(!browserSttSupported()), []);

  const falar = async () => {
    setAviso("");
    stopAll();
    const r = await voice.start({ lang: "ja-JP", maxMs: 10_000, silenceStartMs: 7000 });
    if (r.latencyMs === null) return setAviso("Não ouvi nada. Toque e fale mais perto do microfone.");
    if (r.speechMs) registrarAtividade("study", r.speechMs);
    if (!r.alternatives.length) {
      setGravou(true); // sem reconhecimento de voz: o próprio aluno compara com o modelo
      return;
    }
    const s = bestSimilarity(r.alternatives, [ex.card.kana, stripFurigana(ex.card.kanji)]);
    aoResponder({
      ok: s >= 0.6,
      correta: `${traducaoPrincipal(ex.card)} — ouça o modelo`,
      literal: ex.card.significado_cognitivo,
      ouvir: ex.card.kana,
    });
  };

  return (
    <div className="space-y-6">
      <Enunciado>Fale esta {ex.card.tags.includes("palavra") ? "palavra" : "frase"} em japonês</Enunciado>
      <BalaoMascote humor="feliz">
        <p className="text-xl font-bold">{ex.card.traducao}</p>
        <p className="text-xs text-[var(--muted)]">{ex.card.situacao_pt}</p>
      </BalaoMascote>

      {semStt && gravou && !travado ? (
        <div className="space-y-3 text-center">
          <p className="text-sm text-[var(--muted)]">Ouça o modelo e compare com o que você disse:</p>
          <div className="flex justify-center">
            <BotoesSom texto={ex.card.kana} />
          </div>
          <PitchAccentVisualizer moras={ex.card.moras} size="sm" />
          <div className="flex justify-center gap-2">
            <button
              onClick={() => aoResponder({ ok: true, literal: ex.card.significado_cognitivo })}
              className="btn btn-primario rounded-2xl px-5 py-3"
            >
              Falei certo
            </button>
            <button
              onClick={() =>
                aoResponder({ ok: false, correta: traducaoPrincipal(ex.card), literal: ex.card.significado_cognitivo, ouvir: ex.card.kana })
              }
              className="btn btn-secundario rounded-2xl px-5 py-3 font-bold"
            >
              Errei
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 pt-4">
          <button
            onClick={voice.status === "recording" ? voice.stop : falar}
            disabled={travado || voice.status === "processing"}
            className={`btn flex h-20 w-full max-w-sm items-center justify-center gap-3 rounded-full border text-lg font-bold ${
              voice.status === "recording"
                ? "border-[var(--bad)] bg-[var(--bad)]/15 text-[var(--bad)]"
                : "border-[var(--accent)]/50 bg-[var(--accent)]/10 text-[var(--accent)]"
            }`}
          >
            {voice.status === "recording" ? <Square /> : voice.status === "processing" ? <Loader2 className="animate-spin" /> : <Mic />}
            {voice.status === "recording" ? "Ouvindo… toque para terminar" : "Toque para falar"}
          </button>
          {fase >= 2 && voice.interim && <p className="font-jp text-[var(--muted)]">{voice.interim}</p>}
          {aviso && <p className="text-sm text-[var(--warn)]">{aviso}</p>}
          {!travado && (
            <button onClick={aoPular} className="text-sm font-semibold text-[var(--muted)] underline underline-offset-4">
              Não posso falar agora
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ───────────── Diálogo: escolha a resposta certa em japonês

export function ExDialogo({ ex, travado, aoPronto }: ExProps<Ex<"dialogo">>) {
  const [escolha, setEscolha] = useState<number | null>(null);
  const [tocando, setTocando] = useState(false);
  const { pergunta, resposta } = ex.dialogo;
  useTocarAoAbrir(pergunta.kana, setTocando);
  const escolher = (i: number) => {
    setEscolha(i);
    speakJa(ex.opcoes[i].kana);
    aoPronto(() => ({ ok: i === ex.correta, correta: resposta.pt, ouvir: resposta.kana }));
  };
  return (
    <div className="space-y-5">
      <Enunciado>Escolha a resposta em japonês</Enunciado>
      <BalaoMascote>
        <div className="space-y-2">
          <BotoesSom texto={pergunta.kana} aoTocar={(on) => setTocando(on)} />
          <PitchAccentVisualizer moras={pergunta.moras} size="sm" playing={tocando} />
          <ScriptLayer kana={pergunta.kana} kanji={pergunta.kanji} className="text-lg" />
          <p className="text-sm text-[var(--muted)]">“{pergunta.pt}”</p>
        </div>
      </BalaoMascote>
      <p className="text-center text-sm">
        Você quer dizer: <b className="text-[var(--azul)]">«{resposta.pt}»</b>{" "}
        <span className="text-[var(--muted)]">({FORMAS[ex.forma].regra})</span>
      </p>
      <div className="space-y-3">
        {ex.opcoes.map((o, i) => (
          <Opcao key={i} ativo={escolha === i} travado={travado} onClick={() => escolher(i)}>
            <PitchAccentVisualizer moras={o.moras} size="sm" showFuncao={false} />
            <ScriptLayer kana={o.kana} kanji={o.kanji} className="mt-1 text-base" />
          </Opcao>
        ))}
      </div>
    </div>
  );
}

// ───────────── Quiz (tutorial)

export function ExQuiz({ ex, travado, aoPronto }: ExProps<Ex<"quiz">>) {
  const [escolha, setEscolha] = useState<number | null>(null);
  const escolher = (i: number) => {
    setEscolha(i);
    const fala = ex.opcoes[i].falar;
    if (fala) speakJa(fala);
    aoPronto(() => ({ ok: i === ex.correta, correta: ex.explicacao }));
  };
  const temAudio = useMemo(() => ex.opcoes.some((o) => o.falar), [ex]);
  return (
    <div className="space-y-6">
      <Enunciado>{ex.pergunta}</Enunciado>
      {temAudio && <p className="text-sm text-[var(--muted)]">Toque em cada opção para ouvir.</p>}
      <div className="space-y-3">
        {ex.opcoes.map((o, i) => (
          <Opcao key={i} numero={i + 1} ativo={escolha === i} travado={travado} onClick={() => escolher(i)}>
            {o.falar ? `🔊 ${o.texto}` : o.texto}
          </Opcao>
        ))}
      </div>
    </div>
  );
}

// ───────────── Leitura: um texto curto, com as frases da unidade em sequência

/** O texto: cada frase com som e a camada de escrita da fase; o mapa de som é opcional (sempre aberto na Fase 1). */
function TextoLeitura({ frases }: { frases: Ex<"texto">["frases"] }) {
  const { fase } = usePhase();
  const [mapa, setMapa] = useState(false);
  const comMapa = mapa || fase === 1;
  return (
    <div className="space-y-3 rounded-2xl bg-[var(--panel)] p-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => speakJa(frases.map((c) => c.kana).join("。"))}
          className="flex items-center gap-1.5 rounded-xl border border-[var(--line)] px-3 py-1.5 text-sm"
        >
          <Volume2 size={16} /> Ouvir tudo
        </button>
        {fase > 1 && (
          <button onClick={() => setMapa(!mapa)} className="rounded-xl border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--muted)]">
            {mapa ? "Esconder mapa de som" : "Mapa de som"}
          </button>
        )}
      </div>
      {frases.map((c) => (
        <div key={c.id} className="flex items-start gap-2">
          <button onClick={() => speakJa(c.kana)} aria-label="Ouvir esta frase" className="mt-1 shrink-0 rounded-lg p-1 text-[var(--azul)]">
            <Volume2 size={18} />
          </button>
          <div className="min-w-0 flex-1 space-y-1">
            {comMapa && <PitchAccentVisualizer moras={c.moras} size="sm" />}
            <ScriptLayer kana={c.kana} kanji={c.kanji} className="text-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ExTexto({ ex }: ExProps<Ex<"texto">>) {
  return (
    <div className="space-y-5">
      <Enunciado rotulo="Leitura">Leia o texto</Enunciado>
      <p className="text-sm text-[var(--muted)]">São frases que você já conhece. Ouça quantas vezes quiser; depois vêm as perguntas.</p>
      <TextoLeitura frases={ex.frases} />
    </div>
  );
}

export function ExCompreensao({ ex, travado, aoPronto }: ExProps<Ex<"compreensao">>) {
  const [escolha, setEscolha] = useState<number | null>(null);
  const escolher = (i: number) => {
    setEscolha(i);
    aoPronto(() => ({ ok: i === ex.correta, correta: ex.opcoes[ex.correta] }));
  };
  return (
    <div className="space-y-5">
      <Enunciado>{ex.pergunta}</Enunciado>
      <div className="space-y-3">
        {ex.opcoes.map((o, i) => (
          <Opcao key={o} numero={i + 1} ativo={escolha === i} travado={travado} onClick={() => escolher(i)}>
            {o}
          </Opcao>
        ))}
      </div>
      <TextoLeitura frases={ex.frases} />
    </div>
  );
}

// ───────────── Melodia: treino de ouvido com pares mínimos de entonação

export function ExMelodia({ ex, travado, aoPronto }: ExProps<Ex<"melodia">>) {
  const [escolha, setEscolha] = useState<number | null>(null);
  useTocarAoAbrir(ex.card.kana, undefined, ex.voz);
  const escolher = (i: number) => {
    setEscolha(i);
    aoPronto(() => ({
      ok: i === ex.correta,
      correta: `${traducaoPrincipal(ex.card)} — a melodia certa é a ${ex.correta === 0 ? "1" : "2"}`,
      ouvir: ex.card.kana,
    }));
  };
  return (
    <div className="space-y-5">
      <Enunciado rotulo="Treino de ouvido">Qual melodia você ouviu?</Enunciado>
      <p className="text-sm text-[var(--muted)]">
        Mesmos sons, entonação diferente. Siga a voz subindo e descendo. A voz muda de um treino para outro, para o
        ouvido aprender a melodia e não um falante só.
      </p>
      <div className="flex justify-center">
        <BotoesSom texto={ex.card.kana} voz={ex.voz} grande />
      </div>
      <div className="space-y-3">
        {ex.opcoes.map((m, i) => (
          <Opcao key={i} numero={i + 1} ativo={escolha === i} travado={travado} onClick={() => escolher(i)}>
            <PitchAccentVisualizer moras={m} size="sm" showFuncao={false} />
          </Opcao>
        ))}
      </div>
    </div>
  );
}

// ───────────── Sombra (shadowing): falar junto com o áudio

const RODADAS = [0.7, 0.7, 1, 1];

export function ExSombra({ ex }: ExProps<Ex<"sombra">>) {
  const { card } = ex;
  /** -1 = parado; 0…3 = rodada atual; 4 = terminou */
  const [passo, setPasso] = useState(-1);
  const vivo = useRef(true);
  useEffect(() => {
    vivo.current = true;
    return () => {
      vivo.current = false;
      stopAll();
    };
  }, []);

  const rodar = async () => {
    for (let i = 0; i < RODADAS.length; i++) {
      if (!vivo.current) return;
      setPasso(i);
      const ate = await speakJa(card.kana, { rate: RODADAS[i] });
      if (!ate || !vivo.current) return setPasso(-1);
      await wait(1200);
    }
    if (vivo.current) setPasso(RODADAS.length);
  };

  const rodando = passo >= 0 && passo < RODADAS.length;
  return (
    <div className="space-y-5">
      <Enunciado rotulo="Shadowing">Fale junto com a voz</Enunciado>
      <p className="text-sm text-[var(--muted)]">
        Fale <b className="text-[var(--fg)]">ao mesmo tempo</b> que o áudio, como uma sombra, copiando a melodia e o ritmo, não
        só os sons. São 4 rodadas: 2 devagar e 2 na velocidade normal.
      </p>
      <div className="space-y-3 rounded-2xl bg-[var(--panel)] p-4">
        <PitchAccentVisualizer moras={card.moras} size="sm" playing={rodando} />
        <ScriptLayer kana={card.kana} kanji={card.kanji} className="text-lg" />
        <p className="text-center font-bold">{card.traducao}</p>
      </div>
      <div className="flex justify-center gap-2">
        {RODADAS.map((r, i) => (
          <span
            key={i}
            className={`flex h-9 w-16 items-center justify-center rounded-full text-xs font-semibold ${
              i < passo || passo === RODADAS.length
                ? "bg-[var(--ok)]/20 text-[var(--ok)]"
                : i === passo
                  ? "bg-[var(--accent)] text-[#1c0b05]"
                  : "bg-[var(--panel-2)] text-[var(--muted)]"
            }`}
          >
            {r < 1 ? "devagar" : "normal"}
          </span>
        ))}
      </div>
      <button
        onClick={rodando ? stopAll : rodar}
        className="btn mx-auto flex h-14 w-full max-w-sm items-center justify-center gap-2 rounded-full border border-[var(--accent)]/50 bg-[var(--accent)]/10 text-lg font-bold text-[var(--accent)]"
      >
        {rodando ? <Square size={20} /> : passo === RODADAS.length ? <RotateCcw size={20} /> : <Play size={20} />}
        {rodando ? `Rodada ${passo + 1} de 4 — fale junto!` : passo === RODADAS.length ? "Fazer de novo" : "Começar a sombra"}
      </button>
    </div>
  );
}

// ───────────── Simulado: opções só em áudio (como na prova de escuta)

function OpcaoAudio({ i, texto, ativo, travado, legenda, onClick }: {
  i: number;
  texto: string;
  ativo: boolean;
  travado: boolean;
  legenda?: string;
  onClick: () => void;
}) {
  return (
    <Opcao
      numero={i + 1}
      ativo={ativo}
      travado={travado}
      onClick={() => {
        speakJa(texto);
        onClick();
      }}
    >
      <span className="flex items-center gap-2">
        <Volume2 size={18} className="text-[var(--azul)]" /> Opção {"ABC"[i]}
      </span>
      {legenda && <span className="block text-sm text-[var(--muted)]">{legenda}</span>}
    </Opcao>
  );
}

export function ExSituacao({ ex, travado, aoPronto }: ExProps<Ex<"situacao">>) {
  const [escolha, setEscolha] = useState<number | null>(null);
  const escolher = (i: number) => {
    setEscolha(i);
    aoPronto(() => ({
      ok: i === ex.correta,
      correta: `Opção ${"ABC"[ex.correta]}: ${traducaoPrincipal(ex.card)}`,
      literal: ex.card.significado_cognitivo,
      ouvir: ex.card.kana,
    }));
  };
  return (
    <div className="space-y-5">
      <Enunciado>O que você diz?</Enunciado>
      <BalaoMascote humor="feliz">
        <p className="text-lg font-bold">{ex.card.situacao_pt}</p>
      </BalaoMascote>
      <p className="text-sm text-[var(--muted)]">Toque em cada opção para ouvir e escolha a que serve.</p>
      <div className="space-y-3">
        {ex.opcoes.map((c, i) => (
          <OpcaoAudio
            key={c.id}
            i={i}
            texto={c.kana}
            ativo={escolha === i}
            travado={travado}
            legenda={travado ? traducaoPrincipal(c) : undefined}
            onClick={() => escolher(i)}
          />
        ))}
      </div>
    </div>
  );
}

// ───────────── Simulado completo: vocabulário, gramática e leitura (só texto em kana, sem áudio)

/** Texto da prova na notação 漢字[よみ]: furigana na Fase 3, sem ele na Fase 4; sem colchetes, sai como está. */
function TextoProva({ texto }: { texto: string }) {
  const { fase } = usePhase();
  if (fase >= 4) return <>{stripFurigana(texto)}</>;
  return (
    <>
      {parseFurigana(texto).map((s, i) =>
        s.ruby ? (
          <ruby key={i}>
            {s.text}
            <rt className="text-[10px] text-[var(--muted)]">{s.ruby}</rt>
          </ruby>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </>
  );
}

export function ExProvaKana({ ex, travado, aoPronto }: ExProps<ProvaKana>) {
  const [escolha, setEscolha] = useState<number | null>(null);
  const escolher = (i: number) => {
    setEscolha(i);
    aoPronto(() => ({ ok: i === ex.correta, correta: ex.gabarito, literal: ex.explicacao, ouvir: ex.ouvir }));
  };
  return (
    <div className="space-y-5">
      <Enunciado>{ex.enunciado}</Enunciado>
      <p
        className={`font-jp rounded-2xl bg-[var(--panel)] p-4 leading-[2.2] ${
          ex.tipo === "vocabulario" ? "text-center text-3xl" : ex.tipo === "gramatica" ? "text-xl" : "text-lg"
        }`}
      >
        <TextoProva texto={ex.texto} />
      </p>
      <div className="space-y-3">
        {ex.opcoes.map((o, i) => (
          <Opcao key={o} numero={i + 1} ativo={escolha === i} travado={travado} onClick={() => escolher(i)}>
            {ex.opcoesKana ? (
              <span className="font-jp text-lg">
                <TextoProva texto={o} />
              </span>
            ) : (
              o
            )}
          </Opcao>
        ))}
      </div>
    </div>
  );
}

export function ExImediata({ ex, travado, aoPronto }: ExProps<Ex<"imediata">>) {
  const [escolha, setEscolha] = useState<number | null>(null);
  const { pergunta, resposta } = ex.dialogo;
  useTocarAoAbrir(pergunta.kana);
  const escolher = (i: number) => {
    setEscolha(i);
    aoPronto(() => ({ ok: i === ex.correta, correta: `“${pergunta.pt}” → ${resposta.pt}`, ouvir: resposta.kana }));
  };
  return (
    <div className="space-y-5">
      <Enunciado>Ouça e escolha a melhor resposta</Enunciado>
      <BalaoMascote>
        <div className="flex items-center gap-3">
          <BotoesSom texto={pergunta.kana} />
          <span className="text-sm text-[var(--muted)]">Só o som: sem texto, como na prova.</span>
        </div>
      </BalaoMascote>
      <div className="space-y-3">
        {ex.opcoes.map((o, i) => (
          <OpcaoAudio
            key={i}
            i={i}
            texto={o.kana}
            ativo={escolha === i}
            travado={travado}
            legenda={travado ? o.pt : undefined}
            onClick={() => escolher(i)}
          />
        ))}
      </div>
    </div>
  );
}
