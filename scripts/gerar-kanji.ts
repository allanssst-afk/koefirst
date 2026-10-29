// Gera src/lib/kanji-dados.generated.ts: kanji do JLPT N5 e N4 + todos os que aparecem no app, com significado em
// português, leituras on/kun, nível e a ordem dos traços.
// Fontes: KANJIDIC2 (EDRDG, CC BY-SA 4.0 — https://www.edrdg.org/edrdg/licence.html) e KanjiVG (© Ulrich Apel,
// CC BY-SA 3.0 — https://kanjivg.tagaini.net).
//
//   npx tsx scripts/gerar-kanji.ts --lista                      → códigos (hex) dos kanji, para baixar o KanjiVG
//   npx tsx scripts/gerar-kanji.ts <kanjidic2.xml.gz> <pasta-kanjivg>
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";
import { seedCards } from "../src/db/seed-data/cards";
import { seedScenarios } from "../src/db/seed-data/scenarios";
import { cenasDoContexto } from "../src/lib/drills";

const KANJI_RE = /[一-龯]/g;

/**
 * Significados escritos à mão: os que faltam em português no KANJIDIC2 e os de kanji muito usados no app
 * em que o primeiro sentido da lista engana (私 vinha como "particular", 好 como "apaixonado").
 */
const SIG_EXTRA: Record<string, string[]> = {
  藤: ["glicínia"],
  箸: ["pauzinhos (de comer)"],
  私: ["eu", "particular"],
  好: ["gostar", "agradável"],
  事: ["coisa", "fato", "negócios"],
  部: ["seção", "departamento"],
  戻: ["voltar", "retornar"],
  何: ["o quê", "quanto"],
  様: ["senhor(a)", "estilo", "maneira"],
  鍵: ["chave", "fechadura"],
  歩: ["andar", "caminhar", "passo"],
  曲: ["curvar", "virar", "música"],
};

const NOMES_PROPRIOS = /^(Japão|China|Coreia|Tóquio|Buda)/;

/** kanji usados pelo app (frases, missões e Ping-Pong) */
function kanjiDoApp(): string[] {
  const texto = JSON.stringify([seedCards, seedScenarios, cenasDoContexto("todos")]);
  return [...new Set(texto.match(KANJI_RE) ?? [])];
}

interface Bruto {
  jlpt: number | null;
  tracosN: number;
  freq: number | null;
  on: string[];
  kun: string[];
  pt: string[];
}

function lerKanjidic(arquivo: string): Map<string, Bruto> {
  const xml = gunzipSync(readFileSync(arquivo)).toString("utf8");
  const m = new Map<string, Bruto>();
  for (const [, bloco] of xml.matchAll(/<character>([\s\S]*?)<\/character>/g)) {
    const lit = bloco.match(/<literal>(.+?)<\/literal>/)![1];
    const num = (tag: string) => {
      const x = bloco.match(new RegExp(`<${tag}>(\\d+)</${tag}>`));
      return x ? Number(x[1]) : null;
    };
    const todos = (re: RegExp) => [...bloco.matchAll(re)].map((x) => x[1]);
    m.set(lit, {
      jlpt: num("jlpt"),
      tracosN: num("stroke_count") ?? 0,
      freq: num("freq"),
      on: todos(/<reading r_type="ja_on">(.+?)<\/reading>/g),
      kun: todos(/<reading r_type="ja_kun">(.+?)<\/reading>/g),
      pt: todos(/<meaning m_lang="pt">(.+?)<\/meaning>/g),
    });
  }
  return m;
}

/** "た.べる" → "た(べる)"; tira os hifens de prefixo/sufixo e repetições */
const kunLegivel = (ks: string[]) =>
  [...new Set(ks.map((k) => k.replace(/-/g, "").replace(/\.(.+)$/, "($1)")))].slice(0, 4);

function selecao(dic: Map<string, Bruto>): string[] {
  const app = kanjiDoApp();
  // nível antigo do KANJIDIC2: 4 ≈ N5, 3 ≈ N4
  const jlpt = [...dic].filter(([, v]) => v.jlpt === 4 || v.jlpt === 3).map(([k]) => k);
  return [...new Set([...jlpt, ...app])].filter((k) => dic.has(k));
}

const args = process.argv.slice(2);
if (args[0] === "--lista") {
  // sem o KANJIDIC2 ainda: lista os do app; os do JLPT vêm do arquivo
  const dic = args[1] ? lerKanjidic(args[1]) : new Map<string, Bruto>();
  const lista = args[1] ? selecao(dic) : kanjiDoApp();
  console.log(lista.map((k) => k.codePointAt(0)!.toString(16).padStart(5, "0")).join("\n"));
  process.exit(0);
}

const [arquivo, pasta] = args;
const dic = lerKanjidic(arquivo);
const app = new Set(kanjiDoApp());
const saida: Record<string, unknown> = {};
for (const k of selecao(dic)) {
  const d = dic.get(k)!;
  const hex = k.codePointAt(0)!.toString(16).padStart(5, "0");
  const local = join(pasta, `${hex}.svg`);
  if (!existsSync(local)) throw new Error(`falta o KanjiVG de ${k} (${hex}.svg)`);
  const svg = readFileSync(local, "utf8");
  const tracos = [...svg.matchAll(/<path id="kvg:[0-9a-f]+-s(\d+)"[^>]*\sd="([^"]+)"/g)]
    .sort((a, b) => Number(a[1]) - Number(b[1]))
    .map((x) => x[2]);
  const numeros = [...svg.matchAll(/<text transform="matrix\(1 0 0 1 ([\d.]+) ([\d.]+)\)">(\d+)<\/text>/g)]
    .sort((a, b) => Number(a[3]) - Number(b[3]))
    .map((x) => [Number(x[1]), Number(x[2])]);
  if (!tracos.length || tracos.length !== numeros.length) throw new Error(`${k}: ${tracos.length} traços, ${numeros.length} números`);
  saida[k] = {
    sig: (SIG_EXTRA[k] ?? d.pt)
      .slice(0, 4)
      .map((x) => (NOMES_PROPRIOS.test(x) ? x : x.charAt(0).toLowerCase() + x.slice(1)).replace(/\.$/, "")),
    on: d.on.slice(0, 3),
    kun: kunLegivel(d.kun),
    nivel: d.jlpt === 4 ? 5 : d.jlpt === 3 ? 4 : null,
    freq: d.freq,
    noApp: app.has(k),
    tracos,
    numeros,
  };
}

const corpo = JSON.stringify(saida).replace(/\},"/g, '},\n  "');
writeFileSync(
  new URL("../src/lib/kanji-dados.generated.ts", import.meta.url),
  `// Gerado por scripts/gerar-kanji.ts — não editar.
// Significados e leituras: KANJIDIC2 (EDRDG, CC BY-SA 4.0). Ordem dos traços: KanjiVG © Ulrich Apel, CC BY-SA 3.0.
export interface KanjiDados {
  /** significados em português */
  sig: string[];
  /** leituras on (katakana) e kun (hiragana, okurigana entre parênteses) */
  on: string[];
  kun: string[];
  /** nível do JLPT (5 = N5, 4 = N4) ou null */
  nivel: 5 | 4 | null;
  /** posição entre os 2.500 kanji mais usados em jornais */
  freq: number | null;
  /** aparece nas frases, missões ou Ping-Pong do app */
  noApp: boolean;
  tracos: string[];
  numeros: [number, number][];
}

export const KANJI: Record<string, KanjiDados> = ${corpo};
`,
);
console.log(`${Object.keys(saida).length} kanji gravados`);
