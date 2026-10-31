// Gera src/db/seed-data/palavras-pitch.generated.ts: a melodia (H/L por mora) de cada palavra de `palavras-temas.ts`, pela
// previsão do Suzuki-kun (OJAD). Respostas em cache em .ojad-cache/, como no validar-pitch.ts.
//   npx tsx scripts/gerar-palavras.ts
// Avisa quando o OJAD lê a palavra errado ou devolve outro número de moras: nesses casos a palavra não entra na trilha.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { TEMAS_PALAVRAS } from "../src/db/seed-data/palavras-temas";
import { kanaParaMoras } from "../src/db/seed-data/helpers";
import { stripFurigana, toHiragana } from "../src/lib/text";

const cache = ".ojad-cache";
mkdirSync(cache, { recursive: true });

function consultar(texto: string): string {
  const arq = join(cache, createHash("sha1").update(texto).digest("hex") + ".html");
  if (existsSync(arq)) return readFileSync(arq, "utf8");
  const html = execFileSync("curl", [
    "-s", "--max-time", "60", "-X", "POST", "https://www.gavo.t.u-tokyo.ac.jp/ojad/phrasing/index",
    "--data-urlencode", `data[Phrasing][text]=${texto}`,
    "--data", "data[Phrasing][curve]=advanced&data[Phrasing][accent]=advanced&data[Phrasing][accent_mark]=all&data[Phrasing][estimation]=crf&data[Phrasing][analyze]=true&data[Phrasing][phrase_component]=invisible&data[Phrasing][param]=invisible&data[Phrasing][subscript]=visible&data[Phrasing][jeita]=invisible",
  ]).toString("utf8");
  writeFileSync(arq, html);
  return html;
}

function prever(texto: string) {
  const ms = [...consultar(texto).matchAll(/<span class="([^"]*mola_\d+[^"]*)"><span class="inner"><span class="char">([^<]+)<\/span>/g)];
  return { kana: toHiragana(ms.map((m) => m[2]).join("")), pitch: ms.map((m) => (/accent_(top|plain)/.test(m[1]) ? "H" : "L")).join("") };
}

/** O OJAD devolve a sílaba sem o "ゃ" pequeno e sem o "ー": compara só o que sobra. */
const esqueleto = (k: string) => toHiragana(k).replace(/[ゃゅょぁぃぅぇぉー]/g, "");

const saida: Record<string, string> = {};
const avisos: string[] = [];
for (const tema of TEMAS_PALAVRAS) {
  for (const [kana, kanji] of tema.palavras) {
    const n = kanaParaMoras(kana).length;
    const chave = stripFurigana(kanji);
    let p = prever(chave);
    // lido errado (o kanji tem outra leitura): tenta pelo kana
    if (esqueleto(p.kana) !== esqueleto(kana)) p = prever(kana);
    if (p.pitch.length !== n || esqueleto(p.kana) !== esqueleto(kana)) {
      avisos.push(`${tema.numero} ${kanji}: ojad "${p.kana}" ${p.pitch} (${n} moras)`);
      continue;
    }
    // sem contexto o OJAD deixa a mora única baixa: 目, 手 e 歯 são altos
    saida[chave] = n === 1 ? "H" : p.pitch;
  }
}

writeFileSync(
  new URL("../src/db/seed-data/palavras-pitch.generated.ts", import.meta.url),
  `// Gerado por scripts/gerar-palavras.ts — não editar. Melodia de cada palavra, pelo OJAD (Suzuki-kun).
export const PITCH_PALAVRAS: Record<string, string> = ${JSON.stringify(saida).replace(/,"/g, ',\n  "')};
`,
);
console.log(`${Object.keys(saida).length} palavras gravadas`);
console.log(avisos.join("\n"));
