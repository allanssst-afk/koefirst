"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Volume2, X, XCircle } from "lucide-react";
import { Mascote } from "../Mascote";
import { ExDialogo, ExEscuta, ExFalar, ExMontar, ExNova, ExQuiz } from "./Exercicios";
import { ExExplica } from "./Tutorial";
import type { ExProps, Resposta } from "./comuns";
import { somAcerto, somConclusao, somErro } from "@/lib/audio/som";
import { speakJa, stopAll } from "@/lib/audio/tts";
import { concluirLicao } from "@/lib/queries";
import { montarLicao, type Exercicio, type Licao } from "@/lib/trilha";

/** Exercícios só de leitura/apresentação: o botão é CONTINUAR direto, sem verificar. */
const INFORMATIVO: Exercicio["tipo"][] = ["nova", "explica"];

interface Item {
  ex: Exercicio;
  /** já voltou para o fim da fila depois de um erro */
  repetido: boolean;
}

/**
 * Lição no estilo Duolingo: um exercício por tela, barra de progresso no topo, botão grande embaixo
 * (VERIFICAR → painel verde/vermelho → CONTINUAR). Exercícios errados voltam no fim da lição.
 */
export function LessonPlayer({ licao }: { licao: Licao }) {
  const router = useRouter();
  const inicial = useMemo(() => montarLicao(licao).map((ex) => ({ ex, repetido: false })), [licao]);
  const [fila, setFila] = useState<Item[]>(inicial);
  const [idx, setIdx] = useState(0);
  const [verificador, setVerificador] = useState<(() => Resposta) | null>(null);
  const [resposta, setResposta] = useState<Resposta | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [respondidos, setRespondidos] = useState(0);
  const [erros, setErros] = useState(0);
  const [fim, setFim] = useState<{ xp: number } | null>(null);

  const item = fila[idx];
  const concluidos = idx + (resposta?.ok ? 1 : 0);
  const progresso = Math.min(1, concluidos / Math.max(1, fila.length));

  const registrarVerificador = useCallback((f: (() => Resposta) | null) => setVerificador(() => f), []);

  const responder = useCallback(
    (r: Resposta) => {
      setResposta(r);
      if (r.ok) somAcerto();
      else somErro();
      if (!item.repetido) {
        setRespondidos((n) => n + 1);
        if (r.ok) setAcertos((n) => n + 1);
      }
      if (!r.ok) setErros((n) => n + 1);
    },
    [item],
  );

  const avancar = useCallback(async () => {
    stopAll();
    let novaFila = fila;
    if (resposta && !resposta.ok && !item.repetido) {
      novaFila = [...fila, { ex: item.ex, repetido: true }];
      setFila(novaFila);
    }
    setResposta(null);
    setVerificador(null);
    if (idx + 1 < novaFila.length) {
      setIdx(idx + 1);
      return;
    }
    const xp = 10 + (erros === 0 ? 5 : 0);
    const apresentados = licao.tipo === "frases" ? licao.cards : [];
    await concluirLicao(licao.id, xp, acertos, respondidos, apresentados);
    somConclusao();
    setFim({ xp });
  }, [fila, item, resposta, idx, erros, acertos, respondidos, licao]);

  if (fim) {
    const pct = respondidos ? Math.round((acertos / respondidos) * 100) : 100;
    return (
      <div className="mx-auto flex min-h-[80dvh] max-w-md flex-col items-center justify-center gap-6 text-center animate-rise">
        <div className="animate-pulo">
          <Mascote humor="feliz" tamanho={140} />
        </div>
        <h1 className="text-3xl font-black text-[var(--pitch)]">Lição concluída!</h1>
        <div className="grid w-full grid-cols-2 gap-3">
          <div className="overflow-hidden rounded-2xl border-2 border-[var(--pitch)]">
            <p className="bg-[var(--pitch)] py-1 text-xs font-extrabold uppercase text-[#131f24]">Total de XP</p>
            <p className="py-3 text-2xl font-black text-[var(--pitch)]">⚡ {fim.xp}</p>
          </div>
          <div className="overflow-hidden rounded-2xl border-2 border-[var(--accent)]">
            <p className="bg-[var(--accent)] py-1 text-xs font-extrabold uppercase text-[#131f24]">Precisão</p>
            <p className="py-3 text-2xl font-black text-[var(--accent)]">🎯 {pct}%</p>
          </div>
        </div>
        {licao.tipo === "frases" && (
          <p className="text-sm text-[var(--muted)]">As frases desta lição entraram na sua revisão (aba Revisar).</p>
        )}
        <button onClick={() => router.push("/")} className="btn-3d btn-primario w-full rounded-2xl py-4">
          Continuar
        </button>
      </div>
    );
  }

  if (!item) return null;

  const informativo = INFORMATIVO.includes(item.ex.tipo);
  const travado = resposta !== null;
  const props: Omit<ExProps<never>, "ex"> = {
    travado,
    aoPronto: registrarVerificador,
    aoResponder: responder,
    aoPular: () => void avancar(),
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-xl flex-col px-4 pt-4">
      {/* topo: fechar + barra de progresso */}
      <div className="flex items-center gap-4">
        <Link href="/" aria-label="Sair da lição" className="text-[var(--muted)]">
          <X size={28} />
        </Link>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-[var(--line)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
            style={{ width: `${Math.max(4, progresso * 100)}%` }}
          />
        </div>
      </div>

      {/* exercício */}
      <div key={idx} className="flex-1 py-6 pb-44 animate-rise">
        {item.repetido && (
          <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-[var(--warn)]">Erro anterior</p>
        )}
        {(() => {
          const ex = item.ex;
          switch (ex.tipo) {
            case "nova":
              return <ExNova ex={ex} {...props} />;
            case "explica":
              return <ExExplica slide={ex.slide} />;
            case "escuta":
              return <ExEscuta ex={ex} {...props} />;
            case "montar":
              return <ExMontar ex={ex} {...props} />;
            case "falar":
              return <ExFalar ex={ex} {...props} />;
            case "dialogo":
              return <ExDialogo ex={ex} {...props} />;
            case "quiz":
              return <ExQuiz ex={ex} {...props} />;
          }
        })()}
      </div>

      {/* rodapé fixo: botão ou painel de resposta */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t-2 pb-[max(1rem,env(safe-area-inset-bottom))] ${
          resposta
            ? resposta.ok
              ? "border-transparent bg-[#d7ffb8] text-[#58a700] animate-subir"
              : "border-transparent bg-[#ffdfe0] text-[#ea2b2b] animate-subir"
            : "border-[var(--line)] bg-[var(--bg)]"
        }`}
      >
        <div className="mx-auto max-w-xl space-y-3 px-4 pt-4">
          {resposta && (
            <div className="flex items-start gap-3">
              {resposta.ok ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
              <div className="min-w-0 flex-1">
                <p className="text-xl font-black">{resposta.ok ? "Muito bem!" : "Resposta correta:"}</p>
                {!resposta.ok && resposta.correta && <p className="text-base font-semibold">{resposta.correta}</p>}
              </div>
              {resposta.ouvir && (
                <button onClick={() => speakJa(resposta.ouvir!)} aria-label="Ouvir a frase" className="rounded-xl p-2">
                  <Volume2 size={24} />
                </button>
              )}
            </div>
          )}
          {resposta ? (
            <button
              onClick={avancar}
              className={`btn-3d w-full rounded-2xl py-4 font-extrabold uppercase tracking-wider text-white ${
                resposta.ok ? "border-[#46a302] bg-[#58cc02]" : "border-[#c41e1e] bg-[#ff4b4b]"
              }`}
            >
              Continuar
            </button>
          ) : informativo ? (
            <button onClick={avancar} className="btn-3d btn-primario w-full rounded-2xl py-4">
              Continuar
            </button>
          ) : (
            <button
              onClick={() => verificador && responder(verificador())}
              disabled={!verificador}
              className="btn-3d btn-primario w-full rounded-2xl py-4 disabled:border-[var(--line)] disabled:bg-[var(--line)] disabled:text-[var(--muted)]"
            >
              Verificar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
