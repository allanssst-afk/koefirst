"use client";

import { useEffect, useMemo, useState } from "react";
import { Timer, Volume2, X } from "lucide-react";
import { somAcerto, somConclusao, somErro } from "@/lib/audio/som";
import { speakJa, stopAll } from "@/lib/audio/tts";
import { registrarKana } from "@/lib/queries";

/** Uma pergunta de múltipla escolha da escrita (kana ou kanji). */
export interface PerguntaQuiz {
  /** o que aparece em destaque; null = a pergunta é só o áudio de `ouvir` */
  mostra: string | null;
  /** destaque em escrita japonesa (fonte grande) ou texto em português */
  mostraJp: boolean;
  /** texto em japonês para o botão de som (e para tocar sozinho quando `mostra` é null) */
  ouvir?: string;
  legenda: string;
  /** legenda depois de responder (ex.: o som da pergunta de áudio) */
  revelar?: string;
  opcoes: string[];
  opcoesJp: boolean;
  correta: number;
  /** caracteres que entram no progresso (kana_log) com o resultado */
  registrar: string[];
  /** como a pergunta aparece na lista "Para revisar" */
  revisao: { grande: string; pequeno: string };
}

export const embaralhar = <T,>(xs: T[]): T[] => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const fmt = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

/** Quiz com 4 alternativas e cronômetro; cada resposta entra no progresso dos caracteres. */
export function Quiz({ gerar, aoSair }: { gerar: () => PerguntaQuiz[]; aoSair: () => void }) {
  const [rodada, setRodada] = useState(0);
  const perguntas = useMemo(() => gerar(), [rodada]); // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [inicio, setInicio] = useState(() => Date.now());
  const [agora, setAgora] = useState(() => Date.now());
  const [erros, setErros] = useState<PerguntaQuiz[]>([]);
  const [fim, setFim] = useState<number | null>(null);

  const p = perguntas[i];

  useEffect(() => {
    if (fim !== null) return;
    const t = setInterval(() => setAgora(Date.now()), 250);
    return () => clearInterval(t);
  }, [fim]);

  // pergunta só de áudio: toca sozinha
  useEffect(() => {
    if (!p || p.mostra !== null || !p.ouvir || fim !== null) return;
    const t = setTimeout(() => speakJa(p.ouvir!), 250);
    return () => {
      clearTimeout(t);
      stopAll();
    };
  }, [p, fim]);

  const responder = (k: number) => {
    if (escolha !== null) return;
    setEscolha(k);
    const ok = k === p.correta;
    for (const c of p.registrar) registrarKana(c, "quiz", ok);
    if (ok) somAcerto();
    else {
      somErro();
      setErros((e) => [...e, p]);
    }
    setTimeout(
      () => {
        setEscolha(null);
        if (i + 1 < perguntas.length) setI(i + 1);
        else {
          setFim(Date.now() - inicio);
          somConclusao();
        }
      },
      ok ? 650 : 1500,
    );
  };

  const deNovo = () => {
    setRodada((r) => r + 1);
    setI(0);
    setErros([]);
    setFim(null);
    setInicio(Date.now());
  };

  if (fim !== null) {
    const certas = perguntas.length - erros.length;
    return (
      <div className="mx-auto max-w-md space-y-5 py-4 text-center animate-rise">
        <p className="text-sm font-semibold text-[var(--muted)]">Quiz concluído</p>
        <p className="text-4xl font-bold">
          {certas}/{perguntas.length}
        </p>
        <p className="flex items-center justify-center gap-1.5 text-[var(--muted)]">
          <Timer size={16} /> {fmt(fim)} · {(fim / 1000 / perguntas.length).toFixed(1)} s por pergunta
        </p>
        {erros.length > 0 && (
          <div className="space-y-2 rounded-2xl bg-[var(--panel)] p-4 text-left">
            <p className="text-xs font-semibold text-[var(--muted)]">Para revisar</p>
            <div className="flex flex-wrap gap-2">
              {erros.map((e, k) => (
                <button
                  key={k}
                  onClick={() => e.ouvir && speakJa(e.ouvir)}
                  className="btn flex items-center gap-2 rounded-xl border border-[var(--line)] px-3 py-2 text-left"
                >
                  <span className="font-jp text-2xl">{e.revisao.grande}</span>
                  <span className="text-sm text-[var(--muted)]">{e.revisao.pequeno}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={aoSair} className="btn btn-secundario rounded-2xl py-3 font-bold">
            Voltar
          </button>
          <button onClick={deNovo} className="btn btn-primario rounded-2xl py-3">
            De novo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <button onClick={aoSair} aria-label="Sair do quiz" className="text-[var(--muted)]">
            <X size={24} />
          </button>
          <span className="text-xs text-[var(--muted)]">
            Pergunta {i + 1} / {perguntas.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--line)]">
            <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${(i / perguntas.length) * 100}%` }} />
          </div>
          <span className="flex items-center gap-1 font-mono text-sm">
            <Timer size={16} /> {fmt(agora - inicio)}
          </span>
        </div>
      </div>

      <div key={i} className="flex min-h-[180px] flex-col items-center justify-center gap-2 text-center animate-rise">
        {p.mostra === null ? (
          <button
            onClick={() => p.ouvir && speakJa(p.ouvir)}
            aria-label="Ouvir de novo"
            className="btn flex h-24 w-24 items-center justify-center rounded-3xl bg-[var(--azul)] text-white"
          >
            <Volume2 size={44} />
          </button>
        ) : p.mostraJp ? (
          <span
            className={`font-jp leading-none ${
              p.mostra.length <= 2 ? "text-8xl" : p.mostra.length <= 4 ? "text-6xl" : p.mostra.length <= 5 ? "text-5xl" : "text-4xl"
            }`}
          >
            {p.mostra}
          </span>
        ) : (
          <span className="text-3xl font-bold">{p.mostra}</span>
        )}
        <span className="text-sm text-[var(--muted)]">{escolha !== null && p.revelar ? p.revelar : p.legenda}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {p.opcoes.map((o, k) => {
          const estado = escolha === null ? "" : k === p.correta ? "certa" : k === escolha ? "errada" : "apagada";
          return (
            <button
              key={k}
              onClick={() => responder(k)}
              className={`btn flex h-24 items-center justify-center rounded-2xl border px-2 font-semibold leading-tight transition-colors ${
                p.opcoesJp ? `font-jp ${o.length > 3 ? "text-xl" : "text-3xl"}` : o.length > 14 ? "text-base" : "text-xl"
              } ${
                estado === "certa"
                  ? "border-[var(--ok)] bg-[var(--ok)] text-[#11131c]"
                  : estado === "errada"
                    ? "border-[var(--bad)] bg-[var(--bad)] text-[#11131c]"
                    : estado === "apagada"
                      ? "border-[var(--line)] bg-[var(--panel)] opacity-50"
                      : "border-[var(--line)] bg-[var(--panel)]"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
