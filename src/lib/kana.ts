/**
 * Tabela dos kana (silabários): hiragana e katakana com o som em romaji (Hepburn), organizados em linhas de
 * 5 colunas (a · i · u · e · o), como a tabela tradicional. A ordem dos traços vem de kana-tracos.generated.ts.
 */
import { KANA_TRACOS } from "./kana-tracos.generated";

export type Silabario = "hiragana" | "katakana";
export type GrupoKana = "basico" | "tenten";

export interface Kana {
  hiragana: string;
  katakana: string;
  romaji: string;
  /** nota curta de pronúncia ou de uso (em português, sem escrita japonesa) */
  dica?: string;
  grupo: GrupoKana;
}

const k = (hiragana: string, romaji: string, grupo: GrupoKana, dica?: string): Kana => ({
  hiragana,
  katakana: String.fromCodePoint(hiragana.codePointAt(0)! + 0x60),
  romaji,
  grupo,
  dica,
});

/** Linhas da tabela; `null` = casa vazia (ex.: linha do "ya" só tem ya, yu, yo). */
export const LINHAS: { nome: string; grupo: GrupoKana; kana: (Kana | null)[] }[] = [
  { nome: "vogais", grupo: "basico", kana: [k("あ", "a", "basico"), k("い", "i", "basico"), k("う", "u", "basico", "lábios sem arredondar"), k("え", "e", "basico"), k("お", "o", "basico")] },
  { nome: "k", grupo: "basico", kana: [k("か", "ka", "basico"), k("き", "ki", "basico"), k("く", "ku", "basico"), k("け", "ke", "basico"), k("こ", "ko", "basico")] },
  { nome: "s", grupo: "basico", kana: [k("さ", "sa", "basico"), k("し", "shi", "basico", "como «xi»"), k("す", "su", "basico", "o «u» final quase some"), k("せ", "se", "basico"), k("そ", "so", "basico")] },
  { nome: "t", grupo: "basico", kana: [k("た", "ta", "basico"), k("ち", "chi", "basico", "como «tchi»"), k("つ", "tsu", "basico", "«ts» rápido"), k("て", "te", "basico", "«te», nunca «tchi»"), k("と", "to", "basico")] },
  { nome: "n", grupo: "basico", kana: [k("な", "na", "basico"), k("に", "ni", "basico"), k("ぬ", "nu", "basico"), k("ね", "ne", "basico"), k("の", "no", "basico")] },
  { nome: "h", grupo: "basico", kana: [k("は", "ha", "basico", "como partícula de tópico, lê-se «wa»"), k("ひ", "hi", "basico"), k("ふ", "fu", "basico", "sopro suave, entre «f» e «h»"), k("へ", "he", "basico", "como partícula de direção, lê-se «e»"), k("ほ", "ho", "basico")] },
  { nome: "m", grupo: "basico", kana: [k("ま", "ma", "basico"), k("み", "mi", "basico"), k("む", "mu", "basico"), k("め", "me", "basico"), k("も", "mo", "basico")] },
  { nome: "y", grupo: "basico", kana: [k("や", "ya", "basico"), null, k("ゆ", "yu", "basico"), null, k("よ", "yo", "basico")] },
  { nome: "r", grupo: "basico", kana: [k("ら", "ra", "basico", "«r» de «caro», um toque só"), k("り", "ri", "basico"), k("る", "ru", "basico"), k("れ", "re", "basico"), k("ろ", "ro", "basico")] },
  { nome: "w", grupo: "basico", kana: [k("わ", "wa", "basico"), null, null, null, k("を", "wo", "basico", "lê-se «o»; só é usado como partícula de objeto")] },
  { nome: "n final", grupo: "basico", kana: [k("ん", "n", "basico", "vale uma batida inteira"), null, null, null, null] },
  { nome: "g", grupo: "tenten", kana: [k("が", "ga", "tenten"), k("ぎ", "gi", "tenten", "«gui»"), k("ぐ", "gu", "tenten"), k("げ", "ge", "tenten", "«gue»"), k("ご", "go", "tenten")] },
  { nome: "z", grupo: "tenten", kana: [k("ざ", "za", "tenten"), k("じ", "ji", "tenten", "como «dji»"), k("ず", "zu", "tenten"), k("ぜ", "ze", "tenten"), k("ぞ", "zo", "tenten")] },
  { nome: "d", grupo: "tenten", kana: [k("だ", "da", "tenten"), k("ぢ", "ji", "tenten", "mesmo som do «ji» da linha z; raro"), k("づ", "zu", "tenten", "mesmo som do «zu» da linha z; raro"), k("で", "de", "tenten", "«de», nunca «dji»"), k("ど", "do", "tenten")] },
  { nome: "b", grupo: "tenten", kana: [k("ば", "ba", "tenten"), k("び", "bi", "tenten"), k("ぶ", "bu", "tenten"), k("べ", "be", "tenten"), k("ぼ", "bo", "tenten")] },
  { nome: "p", grupo: "tenten", kana: [k("ぱ", "pa", "tenten"), k("ぴ", "pi", "tenten"), k("ぷ", "pu", "tenten"), k("ぺ", "pe", "tenten"), k("ぽ", "po", "tenten")] },
];

export const TODOS_KANA: Kana[] = LINHAS.flatMap((l) => l.kana.filter((x): x is Kana => x !== null));

export const caractere = (kana: Kana, s: Silabario) => (s === "hiragana" ? kana.hiragana : kana.katakana);

export function kanaPorCaractere(c: string): { kana: Kana; silabario: Silabario } | undefined {
  for (const kana of TODOS_KANA) {
    if (kana.hiragana === c) return { kana, silabario: "hiragana" };
    if (kana.katakana === c) return { kana, silabario: "katakana" };
  }
}

export const tracosDe = (c: string) => KANA_TRACOS[c];

// ───────────────────────── Correção do traço (caligrafia)

export type Ponto = [number, number];

/** Reamostra uma linha em `n` pontos igualmente espaçados ao longo do comprimento. */
export function reamostrar(pts: Ponto[], n = 24): Ponto[] {
  if (pts.length < 2) return Array.from({ length: n }, () => pts[0] ?? [0, 0]);
  const dist = (a: Ponto, b: Ponto) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  let total = 0;
  for (let i = 1; i < pts.length; i++) total += dist(pts[i - 1], pts[i]);
  if (total === 0) return Array.from({ length: n }, () => pts[0]);
  const passo = total / (n - 1);
  const out: Ponto[] = [pts[0]];
  let acum = 0;
  let i = 1;
  let ant = pts[0];
  while (out.length < n - 1 && i < pts.length) {
    const d = dist(ant, pts[i]);
    if (acum + d >= passo) {
      const t = (passo - acum) / d;
      const novo: Ponto = [ant[0] + t * (pts[i][0] - ant[0]), ant[1] + t * (pts[i][1] - ant[1])];
      out.push(novo);
      ant = novo;
      acum = 0;
    } else {
      acum += d;
      ant = pts[i];
      i++;
    }
  }
  while (out.length < n) out.push(pts[pts.length - 1]);
  return out;
}

/**
 * Compara o traço do aluno com o traço de referência (caixa 109×109): distância média entre os pontos
 * reamostrados, na mesma ordem — então traço no sentido contrário não passa. Também confere o tamanho,
 * para um risquinho não valer por um traço longo.
 */
export function tracoConfere(aluno: Ponto[], referencia: Ponto[], tolerancia = 17): boolean {
  if (aluno.length < 2) return false;
  const a = reamostrar(aluno);
  const r = reamostrar(referencia);
  const media = a.reduce((s, p, i) => s + Math.hypot(p[0] - r[i][0], p[1] - r[i][1]), 0) / a.length;
  const comp = (pts: Ponto[]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
  const razao = comp(a) / Math.max(1, comp(r));
  return media <= tolerancia && razao > 0.4 && razao < 2.2;
}
