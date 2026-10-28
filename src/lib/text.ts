import type { Mora } from "./types";

/** Katakana → hiragana (mantém ー). */
export function toHiragana(s: string): string {
  return s.replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}

/** Remove a notação de furigana `漢字[かんじ]` → `漢字`. */
export function stripFurigana(s: string): string {
  return s.replace(/\[[^\]]*\]/g, "");
}

/** Lê a notação de furigana e devolve o texto só em kana: `何[なん]です` → `なんです`. */
export function furiganaToKana(s: string): string {
  return s.replace(/[一-龯々〆]+\[([^\]]+)\]/g, "$1");
}

export interface RubySegment {
  text: string;
  ruby?: string;
}

export function parseFurigana(s: string): RubySegment[] {
  const out: RubySegment[] = [];
  const re = /([一-龯々〆]+)\[([^\]]+)\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push({ text: s.slice(last, m.index) });
    out.push({ text: m[1], ruby: m[2] });
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push({ text: s.slice(last) });
  return out;
}

/** Normaliza japonês para comparação: NFKC, hiragana, sem pontuação/espaços. */
export function normalizeJa(s: string): string {
  return toHiragana(stripFurigana(s).normalize("NFKC"))
    .replace(/[\s、。，．,.!?！？「」『』・…~〜]/g, "")
    .toLowerCase();
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

export function similarity(a: string, b: string): number {
  const x = normalizeJa(a);
  const y = normalizeJa(b);
  if (!x || !y) return 0;
  return 1 - levenshtein(x, y) / Math.max(x.length, y.length);
}

/** Melhor correspondência entre várias alternativas do STT e várias formas-alvo. */
export function bestSimilarity(heard: string[], targets: string[]): number {
  let best = 0;
  for (const h of heard) for (const t of targets) best = Math.max(best, similarity(h, t));
  return best;
}

/** Algum fragmento-chave aparece na fala? */
export function containsAny(heard: string[], keys: string[]): boolean {
  const hs = heard.map(normalizeJa);
  return keys.some((k) => {
    const nk = normalizeJa(k);
    return nk.length > 0 && hs.some((h) => h.includes(nk));
  });
}

/** Agrupa moras consecutivas do mesmo bloco. */
export function groupBlocks(moras: Mora[]): { start: number; moras: Mora[] }[] {
  const groups: { start: number; moras: Mora[] }[] = [];
  moras.forEach((m, i) => {
    const g = groups[groups.length - 1];
    if (g && g.moras[0].bloco === m.bloco && g.moras[0].funcao === m.funcao) g.moras.push(m);
    else groups.push({ start: i, moras: [m] });
  });
  return groups;
}

const MORA_KANA: Record<string, string> = Object.fromEntries(
  (
    "a あ i い u う e え o お ka か ki き ku く ke け ko こ ga が gi ぎ gu ぐ ge げ go ご " +
    "sa さ shi し su す se せ so そ za ざ ji じ zu ず ze ぜ zo ぞ ta た chi ち tsu つ te て to と " +
    "da だ de で do ど na な ni に nu ぬ ne ね no の ha は hi ひ fu ふ he へ ho ほ " +
    "ba ば bi び bu ぶ be べ bo ぼ pa ぱ pi ぴ pu ぷ pe ぺ po ぽ ma ま mi み mu む me め mo も " +
    "ya や yu ゆ yo よ ra ら ri り ru る re れ ro ろ wa わ n ん " +
    "kya きゃ kyu きゅ kyo きょ gya ぎゃ gyu ぎゅ gyo ぎょ sha しゃ shu しゅ sho しょ " +
    "ja じゃ ju じゅ jo じょ cha ちゃ chu ちゅ cho ちょ nya にゃ nyu にゅ nyo にょ " +
    "hya ひゃ hyu ひゅ hyo ひょ bya びゃ byu びゅ byo びょ pya ぴゃ pyu ぴゅ pyo ぴょ " +
    "mya みゃ myu みゅ myo みょ rya りゃ ryu りゅ ryo りょ t っ k っ p っ s っ"
  )
    .split(" ")
    .reduce<[string, string][]>((acc, v, i, arr) => (i % 2 ? acc : [...acc, [v, arr[i + 1]]]), []),
);

/** Moras romanizadas → hiragana aproximado (para tocar só um trecho da frase no TTS). */
export function morasToKana(moras: Mora[]): string {
  return moras.map((m) => MORA_KANA[m.som] ?? "").join("");
}

/** Texto ideal para TTS: kana puro evita leituras erradas de kanji. */
export function ttsText(kana: string, kanji?: string): string {
  return kana || (kanji ? furiganaToKana(kanji) : "");
}
