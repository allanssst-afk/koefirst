"use client";

import { KANJI, KANJI_DO_GRUPO, PALAVRAS, type GrupoKanji } from "@/lib/kanji";
import { progressoKana } from "@/lib/queries";
import { embaralhar, Quiz, type PerguntaQuiz } from "./Quiz";

export type TipoQuizKanji = "significado" | "kanji" | "leitura";

export const TIPOS_QUIZ_KANJI: { id: TipoQuizKanji; nome: string; descricao: string }[] = [
  { id: "significado", nome: "Kanji → significado", descricao: "veja o kanji e escolha o sentido" },
  { id: "kanji", nome: "Significado → kanji", descricao: "leia o sentido e ache o kanji" },
  { id: "leitura", nome: "Palavra → leitura", descricao: "palavras das suas frases: como se lê?" },
];

const N_PERGUNTAS = 16;

/** os dois primeiros significados ("dia, sol") */
export const sentido = (k: string) => KANJI[k].sig.slice(0, 2).join(", ");

function gerar(grupo: GrupoKanji, tipo: TipoQuizKanji): PerguntaQuiz[] {
  const pool = KANJI_DO_GRUPO[grupo];
  const prog = progressoKana();
  const perguntas: PerguntaQuiz[] = [];

  if (tipo === "leitura") {
    // palavras com algum kanji do grupo (ou todas, se o grupo quase não aparece nas frases)
    let palavras = PALAVRAS.filter((p) => [...p.escrita].some((c) => pool.includes(c)));
    if (palavras.length < 8) palavras = PALAVRAS;
    let ultima = "";
    while (perguntas.length < N_PERGUNTAS) {
      const p = palavras[Math.floor(Math.random() * palavras.length)];
      if (p.escrita === ultima) continue;
      ultima = p.escrita;
      const erradas = embaralhar(PALAVRAS.filter((x) => x.leitura !== p.leitura))
        .map((x) => x.leitura)
        .filter((l, i, arr) => arr.indexOf(l) === i)
        .slice(0, 3);
      const opcoes = embaralhar([p.leitura, ...erradas]);
      perguntas.push({
        mostra: p.escrita,
        mostraJp: true,
        ouvir: p.leitura,
        legenda: "Como se lê esta palavra?",
        opcoes,
        opcoesJp: true,
        correta: opcoes.indexOf(p.leitura),
        registrar: [...p.escrita].filter((c) => KANJI[c]),
        revisao: { grande: p.escrita, pequeno: p.leitura },
      });
    }
    return perguntas;
  }

  // kanji ainda não dominado sai 3× mais
  const sorteio = pool.flatMap((k) => Array.from({ length: prog.get(k)?.dominado ? 1 : 3 }, () => k));
  let ultimo = "";
  while (perguntas.length < N_PERGUNTAS) {
    const k = sorteio[Math.floor(Math.random() * sorteio.length)];
    if (k === ultimo) continue;
    ultimo = k;
    const erradas = embaralhar(pool.filter((x) => x !== k && KANJI[x].sig[0] !== KANJI[k].sig[0])).slice(0, 3);
    const leitura = [...KANJI[k].kun, ...KANJI[k].on][0]?.replace(/[()]/g, "");
    if (tipo === "significado") {
      const opcoes = embaralhar([k, ...erradas]).map(sentido);
      perguntas.push({
        mostra: k,
        mostraJp: true,
        ouvir: leitura,
        legenda: "O que este kanji significa?",
        opcoes,
        opcoesJp: false,
        correta: opcoes.indexOf(sentido(k)),
        registrar: [k],
        revisao: { grande: k, pequeno: sentido(k) },
      });
    } else {
      const opcoes = embaralhar([k, ...erradas]);
      perguntas.push({
        mostra: sentido(k),
        mostraJp: false,
        ouvir: leitura,
        legenda: "Qual kanji tem este sentido?",
        opcoes,
        opcoesJp: true,
        correta: opcoes.indexOf(k),
        registrar: [k],
        revisao: { grande: k, pequeno: sentido(k) },
      });
    }
  }
  return perguntas;
}

/** Quiz de kanji: 16 perguntas com 4 alternativas e cronômetro. */
export function QuizKanji({ grupo, tipo, aoSair }: { grupo: GrupoKanji; tipo: TipoQuizKanji; aoSair: () => void }) {
  return <Quiz gerar={() => gerar(grupo, tipo)} aoSair={aoSair} />;
}
