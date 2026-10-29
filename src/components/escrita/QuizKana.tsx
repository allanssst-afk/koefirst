"use client";

import { caractere, TODOS_KANA, type GrupoKana, type Kana, type Silabario } from "@/lib/kana";
import { progressoKana } from "@/lib/queries";
import { embaralhar, Quiz, type PerguntaQuiz } from "./Quiz";

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

const N_PERGUNTAS = 16;

/** Sorteio com peso: kana ainda não dominado aparece 3× mais. Sons repetidos (ji, zu) nunca são alternativas juntas. */
function gerar(cfg: ConfigQuiz): PerguntaQuiz[] {
  const pool = TODOS_KANA.filter((k) => cfg.grupos.includes(k.grupo));
  const prog = progressoKana();
  const silabarioDe = (): Silabario =>
    cfg.silabario === "ambos" ? (Math.random() < 0.5 ? "hiragana" : "katakana") : cfg.silabario;
  const sorteio = pool.flatMap((k) => {
    const peso = prog.get(k.hiragana)?.dominado && prog.get(k.katakana)?.dominado ? 1 : 3;
    return Array.from({ length: peso }, () => k);
  });
  const perguntas: PerguntaQuiz[] = [];
  let ultimo = "";
  while (perguntas.length < N_PERGUNTAS) {
    const kana = sorteio[Math.floor(Math.random() * sorteio.length)];
    if (kana.romaji === ultimo) continue;
    ultimo = kana.romaji;
    const s = silabarioDe();
    const outro: Silabario = s === "hiragana" ? "katakana" : "hiragana";
    const erradas = embaralhar(pool.filter((k) => k.romaji !== kana.romaji))
      .filter((k, i, arr) => arr.findIndex((x) => x.romaji === k.romaji) === i)
      .slice(0, 3);
    const op = (k: Kana) => (cfg.tipo === "ler" ? k.romaji : cfg.tipo === "ouvir" ? caractere(k, s) : caractere(k, outro));
    const opcoes = embaralhar([kana, ...erradas]).map(op);
    const c = caractere(kana, s);
    perguntas.push({
      mostra: cfg.tipo === "ouvir" ? null : c,
      mostraJp: true,
      ouvir: c,
      legenda:
        cfg.tipo === "ouvir"
          ? "Qual caractere tem este som?"
          : cfg.tipo === "par"
            ? `Ache o par em ${outro}`
            : s === "hiragana"
              ? "Hiragana"
              : "Katakana",
      revelar: cfg.tipo === "ouvir" ? `som: ${kana.romaji}` : undefined,
      opcoes,
      opcoesJp: cfg.tipo !== "ler",
      correta: opcoes.indexOf(op(kana)),
      registrar: [c],
      revisao: { grande: c, pequeno: kana.romaji },
    });
  }
  return perguntas;
}

/** Quiz de kana: 16 perguntas com 4 alternativas e cronômetro. */
export function QuizKana({ cfg, aoSair }: { cfg: ConfigQuiz; aoSair: () => void }) {
  return <Quiz gerar={() => gerar(cfg)} aoSair={aoSair} />;
}
