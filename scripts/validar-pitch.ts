// Confere a entonação (H/L por mora) dos cards contra a previsão do Suzuki-kun (OJAD, Univ. de Tóquio).
//   npx tsx scripts/validar-pitch.ts                 → todos os cards
//   npx tsx scripts/validar-pitch.ts card_043 card_044
//   npx tsx scripts/validar-pitch.ts --frase=駅の前にあります。   → só a previsão, para escrever cards novos
// As respostas ficam em cache (pasta do 1º argumento --cache=…, padrão .ojad-cache/) para não repetir consultas.
// O OJAD prevê a frase inteira por aprendizado de máquina: divergência é um alerta para revisar, não verdade
// absoluta (ele às vezes junta palavras numa frase só e aplica o "downstep").
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { seedCards } from "../src/db/seed-data/cards";
import { seedScenarios } from "../src/db/seed-data/scenarios";
import { stripFurigana } from "../src/lib/text";

const args = process.argv.slice(2);
const cache = args.find((a) => a.startsWith("--cache="))?.slice(8) ?? ".ojad-cache";
const ids = args.filter((a) => !a.startsWith("--"));
mkdirSync(cache, { recursive: true });

interface MoraOjad {
  kana: string;
  alta: boolean;
  devozeada: boolean;
}

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

function moras(html: string): MoraOjad[] {
  const out: MoraOjad[] = [];
  for (const m of html.matchAll(/<span class="([^"]*mola_\d+[^"]*)"><span class="inner"><span class="char">([^<]+)<\/span>/g)) {
    const cls = m[1];
    out.push({ kana: m[2], alta: /accent_(top|plain)/.test(cls), devozeada: /unvoiced/.test(cls) });
  }
  return out;
}

// --frase=…: só mostra a previsão do OJAD para um texto (para escrever cards novos)
const frases = args.filter((a) => a.startsWith("--frase=")).map((a) => a.slice(8));
if (frases.length) {
  for (const f of frases) {
    const ojad = moras(consultar(f));
    console.log(`${f}\n    ${ojad.map((m) => `${m.kana}${m.alta ? "↑" : "↓"}${m.devozeada ? "°" : ""}`).join(" ")}\n    ${ojad.map((m) => (m.alta ? "H" : "L")).join("")}`);
  }
  process.exit(0);
}

// cards e falas das missões (id da missão + número do passo)
const itens = [
  ...seedCards.map((c) => ({ id: c.id, traducao: c.traducao, kanji: c.kanji, moras: c.blocos.flat() })),
  ...seedScenarios.flatMap((s) =>
    s.roteiro.flatMap((p, i) =>
      [p.ia, p.exemplo].filter((l) => l !== undefined).map((l, j) => ({ id: `${s.id}#${i + 1}${j ? "r" : ""}`, traducao: l.pt, kanji: l.kanji, moras: l.moras })),
    ),
  ),
];
const alvo = ids.length ? itens.filter((c) => ids.some((x) => c.id === x || c.id.startsWith(`${x}#`))) : itens;
let divergentes = 0;
for (const c of alvo) {
  const ojad = moras(consultar(stripFurigana(c.kanji)));
  const nossas = c.moras;
  const nosso = nossas.map((m) => m.pitch).join("");
  const deles = ojad.map((m) => (m.alta ? "H" : "L")).join("");
  const ok = nosso === deles;
  if (!ok) divergentes++;
  const sons = nossas.map((m) => m.som).join(".");
  const kanaOjad = ojad.map((m) => m.kana).join("");
  console.log(
    `${ok ? "✓" : "✗"} ${c.id} ${c.traducao}\n    nós : ${nosso}  (${sons})\n    ojad: ${deles}  (${kanaOjad})` +
      (nossas.length !== ojad.length ? `  ← ${nossas.length} × ${ojad.length} moras` : ""),
  );
}
console.log(`\n${alvo.length - divergentes}/${alvo.length} iguais à previsão do OJAD`);
