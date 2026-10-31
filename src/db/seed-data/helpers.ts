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

/** Várias falas em uma só: a resposta-modelo de um turno de fala longa. */
export function emendar(...falas: JaLine[]): JaLine {
  return {
    kana: falas.map((f) => f.kana).join(""),
    kanji: falas.map((f) => f.kanji).join(""),
    pt: falas.map((f) => f.pt).join(" "),
    moras: falas.flatMap((f) => f.moras),
  };
}

const SONS: Record<string, string> = Object.fromEntries(
  "あa いi うu えe おo かka きki くku けke こko がga ぎgi ぐgu げge ごgo さsa しshi すsu せse そso ざza じji ずzu ぜze ぞzo たta ちchi つtsu てte とto だda ぢji づzu でde どdo なna にni ぬnu ねne のno はha ひhi ふfu へhe ほho ばba びbi ぶbu べbe ぼbo ぱpa ぴpi ぷpu ぺpe ぽpo まma みmi むmu めme もmo やya ゆyu よyo らra りri るru れre ろro わwa をo んn"
    .split(" ")
    .map((x) => [x[0], x.slice(1)]),
);
const YOON: Record<string, string> = { ゃ: "a", ゅ: "u", ょ: "o" };

/** Kana → sons do mapa de moras: きょう = kyo.o, きっぷ = ki.p.pu, ノート = no.o.to. "ou" longo vira "o.o", como nos cards. */
export function kanaParaMoras(kana: string): string[] {
  const k = [...kana].map((c) => (c >= "ァ" && c <= "ン" ? String.fromCharCode(c.charCodeAt(0) - 0x60) : c));
  const out: string[] = [];
  let preso = false;
  for (let i = 0; i < k.length; i++) {
    const c = k[i];
    if (c === "っ") {
      preso = true;
      out.push("");
      continue;
    }
    let som: string;
    if (c === "ー") som = out[out.length - 1].slice(-1);
    else if (c === "う" && out[out.length - 1]?.endsWith("o")) som = "o";
    else if (YOON[k[i + 1]]) {
      const base = SONS[c];
      som = (/^(shi|chi|ji)$/.test(base) ? base.slice(0, -1) : base.slice(0, -1) + "y") + YOON[k[++i]];
    } else som = SONS[c];
    if (preso) {
      out[out.length - 1] = som[0];
      preso = false;
    }
    out.push(som);
  }
  return out;
}

export interface SeedCard {
  id: string;
  tipo: CardTipo;
  situacao_pt: string;
  significado_cognitivo: string;
  /** tradução natural em português (exercícios da trilha); alternativas separadas por " / " */
  traducao: string;
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
