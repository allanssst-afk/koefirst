// Gera src/lib/kanji-dados.generated.ts: kanji do JLPT N5 e N4 + todos os que aparecem no app, com significado em
// português, leituras on/kun, nível e a ordem dos traços.
// Fontes: KANJIDIC2 (EDRDG, CC BY-SA 4.0 — https://www.edrdg.org/edrdg/licence.html) e KanjiVG (© Ulrich Apel,
// CC BY-SA 3.0 — https://kanjivg.tagaini.net).
//
//   npx tsx scripts/gerar-kanji.ts --lista <kanjidic2.xml.gz>   → códigos (hex) dos kanji SEM traços ainda,
//                                                                 para baixar só esses do KanjiVG
// Os traços dos kanji que já estão no arquivo gerado são reaproveitados: só os novos precisam do .svg.
//   npx tsx scripts/gerar-kanji.ts <kanjidic2.xml.gz> <pasta-kanjivg>
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";
import { seedCards } from "../src/db/seed-data/cards";
import { seedScenarios } from "../src/db/seed-data/scenarios";
import { cenasDoContexto } from "../src/lib/drills";
import { KANJI as ANTERIOR } from "../src/lib/kanji-dados.generated";

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
  枚: ["folha", "contador de coisas finas (papéis, selos)"],
  張: ["esticar", "estender"],
  頑: ["teimoso", "persistente"],
  難: ["difícil", "problema"],
  優: ["gentil", "excelente"],
  誰: ["quem"],
  映: ["refletir", "projetar (filme)"],
  末: ["fim", "final"],
  楽: ["divertido", "confortável", "música"],
  介: ["intermediar", "apresentar"],
  歳: ["idade", "anos (de idade)"],
  奥: ["interior", "fundo"],
  喉: ["garganta"],
  休: ["descansar", "folga"],
  回: ["vezes", "girar"],
  趣: ["interesse", "gosto", "encanto"],
  弾: ["tocar (instrumento)", "bala (de arma)"],
  英: ["inglês", "Inglaterra"],
  転: ["rodar", "virar"],
  守: ["proteger", "cumprir (regra, horário)"],
  出: ["sair", "pôr para fora"],
  当: ["acertar", "correto, este mesmo"],
  鉛: ["chumbo"],
  安: ["barato", "tranquilo"],
  計: ["plano", "medir"],
  画: ["desenho", "traçar um plano"],
  納: ["entregar", "guardar", "pagar"],
  豆: ["feijão", "soja", "ervilha"],
  阪: ["ladeira", "Osaka"],
  予: ["de antemão", "prévio"],
  決: ["decidir", "fixar"],
  受: ["receber", "aceitar"],
  除: ["remover", "excluir"],
  約: ["promessa", "aproximadamente"],
  荷: ["bagagem", "carga"],
  預: ["depositar", "deixar guardado"],
  換: ["trocar", "mudar"],
  迷: ["perder-se", "em dúvida"],
  階: ["andar (de prédio)", "degrau"],
  辛: ["apimentado", "ardido"],
  押: ["empurrar", "apertar"],
  咲: ["florescer"],
  探: ["procurar", "pesquisar"],
  供: ["oferecer", "acompanhar"],
  座: ["sentar", "assento"],
  票: ["cédula", "bilhete", "voto"],
  在: ["existir", "estar em"],
  留: ["ficar", "reter"],
  越: ["ultrapassar", "mudar-se"],
  変: ["mudar", "estranho"],
  記: ["anotar", "registro"],
  数: ["número", "contar"],
  布: ["pano", "tecido"],
  束: ["feixe", "promessa"],
  割: ["partir", "quebrar", "proporção"],
  坊: ["menino", "monge"],
  困: ["ter problemas", "ficar em apuros"],
  交: ["trocar", "misturar-se"],
  壊: ["quebrar", "destruir"],
  修: ["consertar", "estudar"],
  申: ["dizer (humilde)"],
  訳: ["motivo", "traduzir"],
  召: ["chamar", "comer (respeito)"],
  覧: ["ver", "ler com atenção"],
  掛: ["pendurar", "sentar-se"],
  存: ["existir", "saber (humilde)"],
  参: ["ir (humilde)", "visitar"],
  拝: ["reverenciar", "ver (humilde)"],
  伺: ["visitar (humilde)", "perguntar (humilde)"],
  添: ["anexar", "acompanhar"],
  信: ["acreditar", "confiança", "mensagem"],
  商: ["comércio", "vender"],
  混: ["misturar", "lotar"],
  若: ["jovem"],
  踏: ["pisar"],
  褒: ["elogiar"],
  叱: ["repreender"],
  騒: ["fazer barulho", "agitar"],
  誘: ["convidar", "atrair"],
  警: ["alertar", "polícia"],
  察: ["observar", "polícia"],
  届: ["entregar", "chegar"],
  離: ["separar", "afastar"],
  笑: ["rir", "sorrir"],
  配: ["distribuir", "preocupar-se"],
  相: ["mútuo", "consultar"],
  談: ["conversa", "discutir"],
  閉: ["fechar"],
  震: ["tremer", "terremoto"],
  故: ["acidente", "motivo", "falecido"],
  歯: ["dente"],
  磨: ["polir", "escovar"],
  泥: ["lama", "ladrão (em palavras)"],
  最: ["o mais", "extremo"],
  局: ["repartição", "conclusão"],
};

const NOMES_PROPRIOS = /^(Japão|China|Coreia|Tóquio|Buda|Inglaterra)/;

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
    const entidades: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
    const todos = (re: RegExp) => [...bloco.matchAll(re)].map((x) => x[1].replace(/&(amp|lt|gt|quot|apos);/g, (_, e: string) => entidades[e]));
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
  const lista = (args[1] ? selecao(dic) : kanjiDoApp()).filter((k) => !ANTERIOR[k]);
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
  const local = join(pasta ?? ".", `${hex}.svg`);
  let tracos: string[];
  let numeros: number[][];
  if (pasta && existsSync(local)) {
    const svg = readFileSync(local, "utf8");
    tracos = [...svg.matchAll(/<path id="kvg:[0-9a-f]+-s(\d+)"[^>]*\sd="([^"]+)"/g)]
      .sort((a, b) => Number(a[1]) - Number(b[1]))
      .map((x) => x[2]);
    numeros = [...svg.matchAll(/<text transform="matrix\(1 0 0 1 ([\d.]+) ([\d.]+)\)">(\d+)<\/text>/g)]
      .sort((a, b) => Number(a[3]) - Number(b[3]))
      .map((x) => [Number(x[1]), Number(x[2])]);
  } else if (ANTERIOR[k]) {
    ({ tracos, numeros } = ANTERIOR[k]);
  } else throw new Error(`falta o KanjiVG de ${k} (${hex}.svg)`);
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
