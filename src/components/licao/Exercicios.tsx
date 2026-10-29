"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Mic, Square } from "lucide-react";
import { PitchAccentVisualizer } from "../PitchAccentVisualizer";
import { usePhase } from "../PhaseProvider";
import { ScriptLayer } from "../ScriptLayer";
import { useVoiceCapture } from "../useVoiceCapture";
import { BalaoMascote, BotoesSom, Enunciado, Opcao, type ExProps } from "./comuns";
import { browserSttSupported } from "@/lib/audio/capture";
import { speakJa, stopAll } from "@/lib/audio/tts";
import { FORMAS } from "@/lib/drills";
import { registrarAtividade } from "@/lib/queries";
import { bestSimilarity, stripFurigana } from "@/lib/text";
import { traducaoPrincipal, type Exercicio } from "@/lib/trilha";

type Ex<T extends Exercicio["tipo"]> = Extract<Exercicio, { tipo: T }>;

/** Toca a frase uma vez quando o exercício aparece. */
function useTocarAoAbrir(texto: string, aoTocar?: (on: boolean) => void) {
  useEffect(() => {
    const t = setTimeout(async () => {
      aoTocar?.(true);
      await speakJa(texto);
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
  const [tocando, setTocando] = useState(false);
  useTocarAoAbrir(card.kana, setTocando);
  return (
    <div className="space-y-6">
      <Enunciado rotulo="Frase nova">Ouça e observe a melodia</Enunciado>
      <BalaoMascote>
        <div className="space-y-2">
          <BotoesSom texto={card.kana} aoTocar={(on) => setTocando(on)} />
          <PitchAccentVisualizer moras={card.moras} size="sm" playing={tocando} />
          <ScriptLayer kana={card.kana} kanji={card.kanji} className="text-xl" />
        </div>
      </BalaoMascote>
      <div className="space-y-1 text-center">
        <p className="text-2xl font-extrabold">{card.traducao}</p>
        <p className="text-sm text-[var(--muted)]">Quando usar: {card.situacao_pt}</p>
      </div>
      {card.notas && <p className="rounded-2xl bg-[var(--panel)] p-3 text-sm text-[var(--muted)]">💡 {card.notas}</p>}
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
    aoPronto(() => ({ ok: ex.opcoes[i] === certa, correta: certa, ouvir: ex.card.kana }));
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

// ───────────── Montar: traduza a frase com o banco de palavras

export function ExMontar({ ex, travado, aoPronto }: ExProps<Ex<"montar">>) {
  const [usadas, setUsadas] = useState<number[]>([]);
  const [tocando, setTocando] = useState(false);
  useTocarAoAbrir(ex.card.kana, setTocando);

  useEffect(() => {
    if (!usadas.length) return aoPronto(null);
    const dita = usadas.map((i) => ex.banco[i]).join(" ");
    aoPronto(() => ({
      ok: dita.toLowerCase() === ex.resposta.join(" ").toLowerCase(),
      correta: traducaoPrincipal(ex.card),
      ouvir: ex.card.kana,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usadas]);

  return (
    <div className="space-y-6">
      <Enunciado>Traduza esta frase</Enunciado>
      <BalaoMascote>
        <div className="space-y-2">
          <BotoesSom texto={ex.card.kana} aoTocar={(on) => setTocando(on)} />
          <PitchAccentVisualizer moras={ex.card.moras} size="sm" showFuncao={false} playing={tocando} />
          <ScriptLayer kana={ex.card.kana} kanji={ex.card.kanji} className="text-lg" />
        </div>
      </BalaoMascote>

      {/* linha da resposta */}
      <div className="flex min-h-[7.5rem] flex-wrap content-start gap-2 border-y-2 border-[var(--line)] py-3">
        {usadas.map((i) => (
          <button
            key={i}
            disabled={travado}
            onClick={() => setUsadas((u) => u.filter((x) => x !== i))}
            className="btn-3d rounded-xl border-2 border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-base font-semibold"
          >
            {ex.banco[i]}
          </button>
        ))}
      </div>

      {/* banco de palavras */}
      <div className="flex flex-wrap justify-center gap-2">
        {ex.banco.map((w, i) =>
          usadas.includes(i) ? (
            <span key={i} className="rounded-xl bg-[var(--line)] px-3 py-2 text-base text-transparent">
              {w}
            </span>
          ) : (
            <button
              key={i}
              disabled={travado}
              onClick={() => setUsadas((u) => [...u, i])}
              className="btn-3d rounded-xl border-2 border-[var(--line)] px-3 py-2 text-base font-semibold"
            >
              {w}
            </button>
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
    aoResponder({ ok: s >= 0.6, correta: `${traducaoPrincipal(ex.card)} — ouça o modelo`, ouvir: ex.card.kana });
  };

  return (
    <div className="space-y-6">
      <Enunciado>Fale esta frase em japonês</Enunciado>
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
            <button onClick={() => aoResponder({ ok: true })} className="btn-3d btn-primario rounded-2xl px-5 py-3">
              Falei certo
            </button>
            <button
              onClick={() => aoResponder({ ok: false, correta: traducaoPrincipal(ex.card), ouvir: ex.card.kana })}
              className="btn-3d btn-secundario rounded-2xl px-5 py-3 font-bold"
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
            className={`btn-3d flex h-20 w-full max-w-sm items-center justify-center gap-3 rounded-2xl border-2 text-lg font-extrabold ${
              voice.status === "recording"
                ? "border-[var(--bad)] bg-[var(--bad)]/15 text-[var(--bad)]"
                : "border-[var(--line)] text-[var(--azul)]"
            }`}
          >
            {voice.status === "recording" ? <Square /> : voice.status === "processing" ? <Loader2 className="animate-spin" /> : <Mic />}
            {voice.status === "recording" ? "Ouvindo… toque para terminar" : "Toque para falar"}
          </button>
          {fase >= 2 && voice.interim && <p className="font-jp text-[var(--muted)]">{voice.interim}</p>}
          {aviso && <p className="text-sm text-[var(--warn)]">{aviso}</p>}
          {!travado && (
            <button onClick={aoPular} className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
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
