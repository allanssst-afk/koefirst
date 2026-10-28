import type { CardTipo, JaLine, Mora, Papel } from "../../lib/types";

/** Um bloco gramatical já expandido em moras. */
export type Bloco = Mora[];

/**
 * Cria um bloco: `b("ko.re", "LH", "isto", "topico")`.
 * - moras separadas por ponto; prefixe com `_` uma mora devozeada (`"de._su"`).
 * - `pitch` tem uma letra H/L por mora (Tokyo pitch, já no contexto da frase).
 */
export function b(moras: string, pitch: string, funcao: string, papel: Papel): Bloco {
  const parts = moras.split(".");
  if (parts.length !== pitch.length) {
    throw new Error(`Pitch "${pitch}" não bate com moras "${moras}"`);
  }
  const bloco = parts.map((p) => p.replace(/^_/, "")).join("");
  return parts.map((raw, i) => {
    const m: Mora = {
      som: raw.replace(/^_/, ""),
      pitch: pitch[i] as "H" | "L",
      bloco,
      funcao,
      papel,
    };
    if (raw.startsWith("_")) m.devozeada = true;
    return m;
  });
}

export interface SeedCard {
  id: string;
  tipo: CardTipo;
  situacao_pt: string;
  significado_cognitivo: string;
  kana: string;
  /** Kanji com furigana em colchetes: `何[なん]` */
  kanji: string;
  blocos: Bloco[];
  notas: string;
  tags: string[];
  fase?: number;
}

export function card(c: SeedCard) {
  return c;
}

export function line(kana: string, kanji: string, pt: string, blocos: Bloco[], literal?: string): JaLine {
  return { kana, kanji, pt, literal, moras: blocos.flat() };
}
