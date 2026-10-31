import { stripFurigana } from "../../lib/text";
import { b, card, kanaParaMoras } from "./helpers";
import { PITCH_PALAVRAS } from "./palavras-pitch.generated";
import { TEMAS_PALAVRAS } from "./palavras-temas";

/** Id estável: número da linha + som, porque a mesma leitura pode ter dois sentidos (はし = ponte, pauzinhos). */
const idDaPalavra = (numero: number, kana: string) => `pal_${numero}_${kanaParaMoras(kana).join("")}`;

/** Cards de uma palavra só: `b()` com a melodia do OJAD; `situacao_pt` serve de pergunta no simulado. */
export const cardsPalavras = TEMAS_PALAVRAS.flatMap((t) =>
  t.palavras.map(([kana, kanji, pt, papel]) =>
    card({
      id: idDaPalavra(t.numero, kana),
      tipo: "speaking",
      situacao_pt: `Como se diz "${pt}"?`,
      significado_cognitivo: pt,
      traducao: pt,
      kana,
      kanji,
      blocos: [b(kanaParaMoras(kana).join("."), PITCH_PALAVRAS[stripFurigana(kanji)], pt, papel ?? t.papel)],
      notas: "",
      tags: ["palavra", `ctx:${t.ctx}`],
    }),
  ),
);

export const idsDoTema = (numero: number) => TEMAS_PALAVRAS.find((t) => t.numero === numero)!.palavras.map(([kana]) => idDaPalavra(numero, kana));
