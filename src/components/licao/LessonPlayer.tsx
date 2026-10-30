"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Target, Volume2, X, XCircle, Zap } from "lucide-react";
import { Mascote } from "../Mascote";
import { usePhase } from "../PhaseProvider";
import { ExDialogo, ExEscuta, ExFalar, ExImediata, ExMelodia, ExMontar, ExNova, ExProvaKana, ExQuiz, ExSituacao, ExSombra } from "./Exercicios";
import { ExExplica } from "./Tutorial";
import type { ExProps, Resposta } from "./comuns";
import { somAcerto, somConclusao, somErro } from "@/lib/audio/som";
import { speakJa, stopAll } from "@/lib/audio/tts";
import { concluirLicao, notaDaLicao } from "@/lib/queries";
import { cardPorId, montarLicao, PARTES_SIMULADO, traducaoPrincipal, type Exercicio, type Licao } from "@/lib/trilha";

/** Exercícios só de leitura/apresentação: o botão é CONTINUAR direto, sem verificar. */
const INFORMATIVO: Exercicio["tipo"][] = ["nova", "explica", "sombra"];

/** Uma questão respondida no simulado (a correção só aparece no fim). */
interface Questao {
  tipo: Exercicio["tipo"];
  r: Resposta;
}

interface Item {
  ex: Exercicio;
  /** já voltou para o fim da fila depois de um erro */
  repetido: boolean;
}

/**
 * Lição: um exercício por tela, barra de progresso no topo, botão grande embaixo
 * (VERIFICAR → painel de acerto/erro → CONTINUAR). Exercícios errados voltam no fim da lição.
 * Simulado = modo prova: sem correção a cada questão, sem repetir erros; o resultado por parte vem no fim.
 */
export function LessonPlayer({ licao }: { licao: Licao }) {
  const router = useRouter();
  const { fase } = usePhase();
  const inicial = useMemo(() => montarLicao(licao, fase).map((ex) => ({ ex, repetido: false })), [licao, fase]);
  const [fila, setFila] = useState<Item[]>(inicial);
  const [idx, setIdx] = useState(0);
  const [verificador, setVerificador] = useState<(() => Resposta) | null>(null);
  const [resposta, setResposta] = useState<Resposta | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [respondidos, setRespondidos] = useState(0);
  const [erros, setErros] = useState(0);
  /** erros por frase (card): viram a nota FSRS de cada uma no fim da lição */
  const [errosPorFrase, setErrosPorFrase] = useState<Record<string, number>>({});
  const [fim, setFim] = useState<{ xp: number; resultados: { card: string; erros: number }[] } | null>(null);
  const prova = licao.tipo === "simulado";
  const [folha, setFolha] = useState<Questao[]>([]);

  const item = fila[idx];
  const concluidos = idx + (resposta?.ok ? 1 : 0);
  const progresso = Math.min(1, concluidos / Math.max(1, fila.length));

  const registrarVerificador = useCallback((f: (() => Resposta) | null) => setVerificador(() => f), []);

  const responder = useCallback(
    (r: Resposta) => {
      setResposta(r);
      if (prova) setFolha((f) => [...f, { tipo: item.ex.tipo, r }]);
      else if (r.ok) somAcerto();
      else somErro();
      if (!item.repetido) {
        setRespondidos((n) => n + 1);
        if (r.ok) setAcertos((n) => n + 1);
      }
      if (!r.ok) setErros((n) => n + 1);
      const ex = item.ex;
      // o treino de ouvido mede percepção da melodia, não a memória da frase: fica fora da nota FSRS
      if ("card" in ex && ex.tipo !== "melodia") setErrosPorFrase((m) => ({ ...m, [ex.card.id]: (m[ex.card.id] ?? 0) + (r.ok ? 0 : 1) }));
    },
    [item, prova],
  );

  const avancar = useCallback(async () => {
    stopAll();
    let novaFila = fila;
    if (resposta && !resposta.ok && !item.repetido && !prova) {
      novaFila = [...fila, { ex: item.ex, repetido: true }];
      setFila(novaFila);
    }
    setResposta(null);
    setVerificador(null);
    window.scrollTo(0, 0);
    if (idx + 1 < novaFila.length) {
      setIdx(idx + 1);
      return;
    }
    const xp = prova ? 20 : 10 + (erros === 0 ? 5 : 0);
    // Lição de frases: toda frase apresentada entra no FSRS com a nota do desempenho.
    // Revisão e simulado: só as frases erradas voltam ao FSRS (como lapso).
    const resultados =
      licao.tipo === "frases"
        ? licao.cards.map((card) => ({ card, erros: errosPorFrase[card] ?? 0 }))
        : licao.tipo === "revisao" || prova
          ? Object.entries(errosPorFrase)
              .filter(([, e]) => e > 0)
              .map(([card, e]) => ({ card, erros: e }))
          : [];
    await concluirLicao(licao.id, xp, acertos, respondidos, resultados);
    somConclusao();
    setFim({ xp, resultados });
  }, [fila, item, resposta, idx, erros, acertos, respondidos, licao, errosPorFrase, prova]);

  // Modo prova: registrou a resposta, segue direto para a próxima questão.
  useEffect(() => {
    if (prova && resposta) void avancar();
  }, [prova, resposta, avancar]);

  if (fim) {
    const pct = respondidos ? Math.round((acertos / respondidos) * 100) : 100;
    return (
      <div className="mx-auto flex min-h-[80dvh] max-w-md flex-col items-center justify-center gap-6 text-center animate-rise">
        <div className="animate-pulo">
          <Mascote humor="feliz" tamanho={140} />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--muted)]">{prova ? "Simulado concluído" : "Estação concluída"}</p>
          <h1 className="text-3xl font-bold">{licao.titulo}</h1>
        </div>
        <div className="grid w-full grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[var(--panel)] p-4 text-left">
            <p className="flex items-center gap-1.5 text-2xl font-bold">
              <Zap size={20} className="text-[var(--pitch)]" /> {fim.xp}
            </p>
            <p className="text-xs text-[var(--muted)]">XP ganho</p>
          </div>
          <div className="rounded-2xl bg-[var(--panel)] p-4 text-left">
            <p className="flex items-center gap-1.5 text-2xl font-bold">
              <Target size={20} className="text-[var(--ok)]" /> {pct}%
            </p>
            <p className="text-xs text-[var(--muted)]">de acertos</p>
          </div>
        </div>
        {licao.tipo === "frases" && <ResumoAgenda resultados={fim.resultados} />}
        {prova && <ResultadoSimulado folha={folha} />}
        {(licao.tipo === "revisao" || prova) && fim.resultados.length > 0 && (
          <p className="text-sm text-[var(--muted)]">
            {fim.resultados.length === 1 ? "A frase que você errou volta" : `As ${fim.resultados.length} frases que você errou voltam`}{" "}
            para a revisão daqui a pouco, para fixar de novo.
          </p>
        )}
        <button onClick={() => router.push("/")} className="btn btn-primario w-full rounded-2xl py-4">
          Continuar
        </button>
      </div>
    );
  }

  if (!item) return null;

  const informativo = INFORMATIVO.includes(item.ex.tipo);
  const painel = prova ? null : resposta;
  const travado = resposta !== null;
  const props: Omit<ExProps<never>, "ex"> = {
    travado,
    aoPronto: registrarVerificador,
    aoResponder: responder,
    aoPular: () => void avancar(),
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-xl flex-col px-4 pt-4">
      {/* topo: fechar + progresso */}
      <div className="flex items-center gap-3">
        <Link href="/" aria-label="Sair da lição" className="text-[var(--muted)]">
          <X size={24} />
        </Link>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--line)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
            style={{ width: `${Math.max(2, progresso * 100)}%` }}
          />
        </div>
        <span className="w-12 text-right font-mono text-xs text-[var(--muted)]">
          {Math.min(concluidos, fila.length)}/{fila.length}
        </span>
      </div>

      {/* exercício */}
      <div key={idx} className="flex-1 py-6 pb-44 animate-rise">
        {prova && <CabecalhoParte tipo={item.ex.tipo} fila={fila} />}
        {prova && licao.completo && fase < 2 && (
          <p className="mb-3 text-xs text-[var(--warn)]">
            Na Fase 1 o simulado fica só com a escuta. Para incluir vocabulário, gramática e leitura em kana, mude para a Fase 2 no Perfil.
          </p>
        )}
        {item.repetido && (
          <p className="mb-3 text-sm font-semibold text-[var(--warn)]">De novo: você errou esta antes</p>
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
            case "melodia":
              return <ExMelodia ex={ex} {...props} />;
            case "sombra":
              return <ExSombra ex={ex} {...props} />;
            case "situacao":
              return <ExSituacao ex={ex} {...props} />;
            case "imediata":
              return <ExImediata ex={ex} {...props} />;
            case "vocabulario":
            case "gramatica":
            case "leitura":
              return <ExProvaKana ex={ex} {...props} />;
          }
        })()}
      </div>

      {/* rodapé fixo: botão ou painel de resposta (no simulado não há painel) */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 pb-[max(1rem,env(safe-area-inset-bottom))] ${
          painel
            ? "rounded-t-3xl border-t-4 bg-[var(--panel-2)] animate-subir"
            : "border-t border-[var(--line)] bg-[var(--bg)]"
        }`}
        style={painel ? { borderTopColor: painel.ok ? "var(--ok)" : "var(--bad)" } : undefined}
      >
        <div className="mx-auto max-w-xl space-y-3 px-4 pt-4">
          {painel && (
            <div className="flex items-start gap-3">
              {painel.ok ? (
                <CheckCircle2 size={28} className="shrink-0 text-[var(--ok)]" />
              ) : (
                <XCircle size={28} className="shrink-0 text-[var(--bad)]" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold" style={{ color: painel.ok ? "var(--ok)" : "var(--bad)" }}>
                  {painel.ok ? "Isso mesmo" : "Resposta certa:"}
                </p>
                {!painel.ok && painel.correta && <p className="text-base font-medium">{painel.correta}</p>}
                {painel.literal && (
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    <span className="font-semibold text-[var(--pitch)]">Lógica japonesa:</span> {painel.literal}
                  </p>
                )}
              </div>
              {painel.ouvir && (
                <button onClick={() => speakJa(painel.ouvir!)} aria-label="Ouvir a frase" className="rounded-xl p-2 text-[var(--azul)]">
                  <Volume2 size={24} />
                </button>
              )}
            </div>
          )}
          {painel ? (
            <button
              onClick={avancar}
              className="btn w-full rounded-2xl py-4 text-[1.05rem] font-bold text-[#11131c]"
              style={{ background: painel.ok ? "var(--ok)" : "var(--bad)" }}
            >
              Continuar
            </button>
          ) : informativo ? (
            <button onClick={avancar} className="btn btn-primario w-full rounded-2xl py-4">
              Continuar
            </button>
          ) : (
            <button
              onClick={() => verificador && responder(verificador())}
              disabled={!verificador}
              className="btn btn-primario w-full rounded-2xl py-4 disabled:bg-[var(--line)] disabled:text-[var(--muted)]"
            >
              {prova ? "Confirmar" : "Verificar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const AGENDA: Record<1 | 2 | 3, { rotulo: string; quando: string; cor: string }> = {
  3: { rotulo: "Fácil de lembrar", quando: "volta em ~10 min", cor: "var(--ok)" },
  2: { rotulo: "Com esforço", quando: "volta em poucos minutos", cor: "var(--pitch)" },
  1: { rotulo: "Ainda não fixou", quando: "volta em 1 min", cor: "var(--bad)" },
};

/** Como cada frase entrou na repetição espaçada, conforme os erros da lição. */
function ResumoAgenda({ resultados }: { resultados: { card: string; erros: number }[] }) {
  return (
    <div className="w-full space-y-2 rounded-2xl bg-[var(--panel)] p-3 text-left">
      <p className="text-xs font-semibold text-[var(--muted)]">Entrou na sua revisão (FSRS)</p>
      {resultados.map(({ card, erros }) => {
        const a = AGENDA[notaDaLicao(erros) as 1 | 2 | 3];
        return (
          <p key={card} className="flex items-center justify-between gap-2 text-sm">
            <span className="min-w-0 truncate font-bold">{traducaoPrincipal(cardPorId(card))}</span>
            <span className="shrink-0 text-xs font-bold" style={{ color: a.cor }}>
              {a.rotulo} · {a.quando}
            </span>
          </p>
        );
      })}
    </div>
  );
}

function CabecalhoParte({ tipo, fila }: { tipo: Exercicio["tipo"]; fila: Item[] }) {
  // numera só as partes desta prova: o simulado de unidade começa na escuta
  const partes = PARTES_SIMULADO.filter((p) => fila.some((x) => x.ex.tipo === p.tipo));
  const i = partes.findIndex((p) => p.tipo === tipo);
  if (i < 0) return null;
  const p = partes[i];
  return (
    <p className="mb-3 text-xs text-[var(--muted)]">
      <b className="text-[var(--fg)]">Parte {i + 1} · {p.nome}</b> — {p.descricao}. Sem correção agora: o resultado vem no fim.
    </p>
  );
}

/**
 * Resultado no estilo do JLPT, que exige a nota total e um mínimo em cada seção (nota alta numa parte não
 * compensa outra zerada). Aqui: 60% no total e pelo menos 1/3 de cada parte.
 */
function ResultadoSimulado({ folha }: { folha: Questao[] }) {
  const partes = PARTES_SIMULADO.map((p) => {
    const qs = folha.filter((q) => q.tipo === p.tipo);
    return { ...p, total: qs.length, certas: qs.filter((q) => q.r.ok).length };
  }).filter((p) => p.total > 0);
  const certas = folha.filter((q) => q.r.ok).length;
  const aprovado = certas / Math.max(1, folha.length) >= 0.6 && partes.every((p) => p.certas / p.total >= 1 / 3);
  const erradas = folha.filter((q) => !q.r.ok);
  const cor = aprovado ? "var(--ok)" : "var(--warn)";
  return (
    <div className="w-full space-y-3 text-left">
      <div className="rounded-2xl border-l-4 bg-[var(--panel)] p-4" style={{ borderLeftColor: cor }}>
        <p className="text-sm font-semibold" style={{ color: cor }}>
          {aprovado ? "Aprovado no simulado" : "Ainda não passou — refaça depois de revisar"}
        </p>
        <p className="text-2xl font-bold">
          {certas} de {folha.length} questões
        </p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Critério no estilo do JLPT: nota total (60%) e um mínimo em cada parte (1/3).
        </p>
      </div>
      {partes.map((p) => {
        const passou = p.certas / p.total >= 1 / 3;
        return (
          <div key={p.tipo} className="space-y-1">
            <p className="flex justify-between text-sm">
              <span className="font-semibold">{p.nome}</span>
              <span style={{ color: passou ? "var(--fg)" : "var(--bad)" }}>
                {p.certas}/{p.total}
              </span>
            </p>
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--line)]">
              <div className="h-full rounded-full" style={{ width: `${(p.certas / p.total) * 100}%`, background: passou ? "var(--ok)" : "var(--bad)" }} />
            </div>
          </div>
        );
      })}
      {erradas.length > 0 && (
        <div className="space-y-2 rounded-2xl bg-[var(--panel)] p-3">
          <p className="text-xs font-semibold text-[var(--muted)]">Correção</p>
          {erradas.map((q, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{q.r.correta}</p>
                {q.r.literal && <p className="text-xs text-[var(--muted)]">Lógica japonesa: {q.r.literal}</p>}
              </div>
              {q.r.ouvir && (
                <button onClick={() => speakJa(q.r.ouvir!)} aria-label="Ouvir" className="shrink-0 p-1 text-[var(--azul)]">
                  <Volume2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
