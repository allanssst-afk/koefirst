// Gera src/lib/kana-tracos.generated.ts com a ordem dos traços dos kana, a partir do KanjiVG
// (© Ulrich Apel, CC BY-SA 3.0 — https://kanjivg.tagaini.net). Rodar só quando mudar a lista:
//   node scripts/gerar-kana.mjs [pasta-com-os-svg]
// Com a pasta, lê os arquivos já baixados (03042.svg…) em vez de buscar na rede.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PASTA = process.argv[2];

const HIRA =
  "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん" +
  "がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ";
const KATA = [...HIRA].map((c) => String.fromCodePoint(c.codePointAt(0) + 0x60)).join("");

const saida = {};
for (const c of [...HIRA, ...KATA]) {
  const hex = c.codePointAt(0).toString(16).padStart(5, "0");
  const local = PASTA && join(PASTA, `${hex}.svg`);
  let svg;
  if (local && existsSync(local)) svg = readFileSync(local, "utf8");
  else {
    const res = await fetch(`https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${hex}.svg`);
    if (!res.ok) throw new Error(`${c} (${hex}): HTTP ${res.status}`);
    svg = await res.text();
  }
  const tracos = [...svg.matchAll(/<path id="kvg:[0-9a-f]+-s(\d+)"[^>]*\sd="([^"]+)"/g)]
    .sort((a, b) => Number(a[1]) - Number(b[1]))
    .map((m) => m[2]);
  const numeros = [...svg.matchAll(/<text transform="matrix\(1 0 0 1 ([\d.]+) ([\d.]+)\)">(\d+)<\/text>/g)]
    .sort((a, b) => Number(a[3]) - Number(b[3]))
    .map((m) => [Number(m[1]), Number(m[2])]);
  if (!tracos.length || tracos.length !== numeros.length) throw new Error(`${c}: ${tracos.length} traços, ${numeros.length} números`);
  saida[c] = { tracos, numeros };
}

const corpo = JSON.stringify(saida).replace(/\},"/g, '},\n  "');
writeFileSync(
  new URL("../src/lib/kana-tracos.generated.ts", import.meta.url),
  `// Gerado por scripts/gerar-kana.mjs — não editar.
// Ordem dos traços: KanjiVG © Ulrich Apel, CC BY-SA 3.0 (https://kanjivg.tagaini.net). Caixa 109×109.
export const KANA_TRACOS: Record<string, { tracos: string[]; numeros: [number, number][] }> = ${corpo};
`,
);
console.log(`${Object.keys(saida).length} kana gravados`);
