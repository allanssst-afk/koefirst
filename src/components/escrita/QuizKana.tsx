"use client";

import { useEffect, useMemo, useState } from "react";
import { Timer, Volume2, X } from "lucide-react";
import { somAcerto, somConclusao, somErro } from "@/lib/audio/som";
import { speakJa, stopAll } from "@/lib/audio/tts";
import { caractere, TODOS_KANA, type GrupoKana, type Kana, type Silabario } from "@/lib/kana";
import { progressoKana, registrarKana } from "@/lib/queries";

export type TipoQuiz = "ler" | "ouvir" | "par";

export const TIPOS_QUIZ: { id: TipoQuiz; nome: string; descricao: string }[] = [
  { id: "ler", nome: "Kana → som", descricao: "veja o caractere e escolha o som" },
  { id: "ouvir", nome: "Som → kana", descricao: "ouça e escolha o caractere" },
  { id: "par", nome: "Hiragana ↔ katakana", descricao: "ache o par do outro silabário" },
];

export interface ConfigQuiz {
  silabario: Silabario | "ambos";
  grupos: GrupoKana[];
  tipo: TipoQuiz;
}

interface Pergunta {
  kana: Kana;
  /** o caractere mostrado (ou tocado) */
  mostra: string;
  opcoes: string[];
  correta: number;
}

const N_PERGUNTAS = 16;

function embaralhar<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Sorteio com peso: kana ainda não dominado aparece 3× mais. Sons repetidos (ji, zu) nunca são alternativas juntas. */
function gerar(cfg: ConfigQuiz): Pergunta[] {
  const pool = TODOS_KANA.filter((k) => cfg.grupos.includes(k.grupo));
  const prog = progressoKana();
  const silabarioDe = (): Silabario =>
    cfg.silabario === "ambos" ? (Math.random() < 0.5 ? "hiragana" : "katakana") : cfg.silabario;
  const sorteio = pool.flatMap((k) => {
    const peso = prog.get(k.hiragana)?.dominado && prog.get(k.katakana)?.dominado ? 1 : 3;
    return Array.from({ length: peso }, () => k);
  });
  const perguntas: Pergunta[] = [];
  let ultimo = "";
  while (perguntas.length < N_PERGUNTAS) {
    const kana = sorteio[Math.floor(Math.random() * sorteio.length)];
    if (kana.romaji === ultimo) continue;
    ultimo = kana.romaji;
    const s = silabarioDe();
    const outro: Silabario = s === "hiragana" ? "katakana" : "hiragana";
    const erradas = embaralhar(pool.filter((k) => k.romaji !== kana.romaji)).filter(
      (k, i, arr) => arr.findIndex((x) => x.romaji === k.romaji) === i,
    ).slice(0, 3);
    const op = (k: Kana) => (cfg.tipo === "ler" ? k.romaji : cfg.tipo === "ouvir" ? caractere(k, s) : caractere(k, outro));
    const opcoes = embaralhar([kana, ...erradas]).map(op);
    perguntas.push({ kana, mostra: caractere(kana, s), opcoes, correta: opcoes.indexOf(op(kana)) });
  }
  return perguntas;
}

const fmt = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

/** Quiz de 16 perguntas com 4 alternativas e cronômetro; cada resposta entra no progresso do kana. */
export function QuizKana({ cfg, aoSair }: { cfg: ConfigQuiz; aoSair: () => void }) {
  const [rodada, setRodada] = useState(0);
  const perguntas = useMemo(() => gerar(cfg), [cfg, rodada]); // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [inicio, setInicio] = useState(() => Date.now());
  const [agora, setAgora] = useState(() => Date.now());
  const [erros, setErros] = useState<Pergunta[]>([]);
  const [fim, setFim] = useState<number | null>(null);

  const p = perguntas[i];

  useEffect(() => {
    if (fim !== null) return;
    const t = setInterval(() => setAgora(Date.now()), 250);
    return () => clearInterval(t);
  }, [fim]);

  // "Som → kana": a pergunta é só o áudio
  useEffect(() => {
    if (cfg.tipo !== "ouvir" || fim !== null || !p) return;
    const t = setTimeout(() => speakJa(p.mostra), 250);
    return () => {
      clearTimeout(t);
      stopAll();
    };
  }, [p, cfg.tipo, fim]);

  const responder = (k: number) => {
    if (escolha !== null) return;
    setEscolha(k);
    const ok = k === p.correta;
    registrarKana(p.mostra, "quiz", ok);
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
      ok ? 650 : 1400,
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
                  onClick={() => speakJa(e.mostra)}
                  className="btn flex items-center gap-2 rounded-xl border border-[var(--line)] px-3 py-2"
                >
                  <span className="font-jp text-2xl">{e.mostra}</span>
                  <span className="text-sm text-[var(--muted)]">{e.kana.romaji}</span>
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

  const opcaoEhKana = cfg.tipo !== "ler";
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

      <div key={i} className="flex min-h-[180px] flex-col items-center justify-center gap-2 animate-rise">
        {cfg.tipo === "ouvir" ? (
          <button
            onClick={() => speakJa(p.mostra)}
            aria-label="Ouvir de novo"
            className="btn flex h-24 w-24 items-center justify-center rounded-3xl bg-[var(--azul)] text-white"
          >
            <Volume2 size={44} />
          </button>
        ) : (
          <span className="font-jp text-8xl leading-none">{p.mostra}</span>
        )}
        <span className="text-sm text-[var(--muted)]">
          {cfg.tipo === "ouvir"
            ? escolha !== null
              ? `som: ${p.kana.romaji}`
              : "Qual caractere tem este som?"
            : cfg.tipo === "par"
              ? `Ache o par em ${p.mostra === p.kana.hiragana ? "katakana" : "hiragana"}`
              : p.mostra === p.kana.hiragana
                ? "Hiragana"
                : "Katakana"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {p.opcoes.map((o, k) => {
          const estado =
            escolha === null ? "" : k === p.correta ? "certa" : k === escolha ? "errada" : "apagada";
          return (
            <button
              key={k}
              onClick={() => responder(k)}
              className={`btn flex h-24 items-center justify-center rounded-2xl border text-3xl font-semibold transition-colors ${
                opcaoEhKana ? "font-jp" : ""
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
