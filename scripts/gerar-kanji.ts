// Gera src/lib/kanji-dados.generated.ts: kanji do JLPT N5, N4 e N3 + todos os que aparecem no app, com significado em
// português, leituras on/kun, nível e a ordem dos traços. A lista e os significados do N3 ficam em scripts/kanji-n3.ts.
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
import { KANJI_N3 } from "./kanji-n3";

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
  落: ["cair", "descer", "deixar cair"],
  練: ["treinar", "praticar"],
  算: ["calcular", "cálculo"],
  賛: ["aprovar", "elogiar"],
  成: ["tornar-se", "realizar"],
  構: ["postura", "construção"],
  積: ["acumular", "empilhar", "volume"],
  以: ["a partir de", "por meio de"],
  意: ["ideia", "mente", "intenção"],
  門: ["portão"],
  己: ["si mesmo"],
  紹: ["apresentar", "introduzir"],
  卒: ["formar-se", "soldado"],
  営: ["administrar", "negócio"],
  御: ["honorífico", "controlar"],
  望: ["desejar", "esperança"],
  由: ["razão", "motivo"],
  任: ["responsabilidade", "confiar"],
  将: ["futuro próximo", "comandante"],
  専: ["exclusivo", "especialidade"],
  果: ["fruto", "resultado"],
  発: ["partir", "emitir", "publicar"],
  表: ["superfície", "mostrar", "tabela"],
  経: ["passar por", "longitude"],
  責: ["culpa", "responsabilizar"],
  賃: ["aluguel", "taxa", "salário"],
  敷: ["estender", "espalhar"],
  飼: ["criar (animal)", "domesticar"],
  録: ["registrar", "gravar"],
  必: ["sem falta", "necessariamente"],
  要: ["necessário", "ponto principal"],
  保: ["proteger", "manter"],
  険: ["íngreme", "perigo"],
  診: ["examinar (paciente)", "diagnosticar"],
  活: ["vida", "atividade"],
  多: ["muitos", "muito"],
  詳: ["detalhado", "conhecer bem"],
  律: ["lei", "ritmo"],
  宗: ["religião"],
  裁: ["julgar", "cortar tecido"],
  災: ["desastre"],
  津: ["porto"],
  避: ["evitar"],
  被: ["sofrer", "cobrir"],
  統: ["unificar"],
  府: ["governo local"],
  源: ["fonte", "origem"],
  誌: ["revista", "registro"],
  症: ["sintoma"],
  痢: ["diarreia"],
  吐: ["vomitar", "cuspir"],
  検: ["examinar"],
  査: ["investigar"],
  療: ["tratar (doença)"],
  箋: ["bilhete"],
  帯: ["faixa"],
  救: ["salvar"],
  健: ["saudável"],
  康: ["saúde"],
  臓: ["órgão interno"],
  肺: ["pulmão"],
  胃: ["estômago"],
  圧: ["pressão"],
  睡: ["sono"],
  菓: ["doce"],
  身: ["corpo", "si mesmo"],
  噌: ["missô"],
  汁: ["sopa", "caldo"],
  苔: ["musgo"],
  麦: ["trigo"],
  酢: ["vinagre"],
  封: ["selar"],
  筒: ["tubo"],
  印: ["selo", "marca"],
  鑑: ["modelo", "avaliar"],
  態: ["estado", "atitude"],
  勇: ["coragem"],
  希: ["desejar", "raro"],
  功: ["mérito"],
  的: ["alvo"],
  密: ["secreto", "denso"],
  冗: ["supérfluo"],
  嘘: ["mentira"],
  泊: ["hospedar-se"],
  飾: ["enfeitar"],
  植: ["plantar"],
  燃: ["queimar"],
  溶: ["dissolver", "derreter"],
  凍: ["congelar"],
  濡: ["molhar"],
  滑: ["escorregar"],
  翻: ["virar", "traduzir"],
  製: ["fabricado"],
  輸: ["transportar"],
  延: ["adiar", "estender"],
  普: ["comum", "amplo"],
  鮮: ["fresco"],
  清: ["puro"],
  潔: ["limpo"],
  豊: ["abundante"],
  賢: ["sábio"],
  秀: ["excelente"],
  素: ["elemento", "simples"],
  敵: ["inimigo"],
  賑: ["animado"],
  浅: ["raso"],
  丸: ["redondo"],
  硬: ["duro"],
  濃: ["forte, denso"],
  鋭: ["afiado"],
  撲: ["golpear"],
  伎: ["habilidade"],
  句: ["frase", "verso"],
  詩: ["poema"],
  芸: ["arte"],
  匂: ["cheirar"],
  影: ["sombra"],
  氷: ["gelo"],
  糸: ["linha"],
  針: ["agulha"],
  瓶: ["garrafa"],
  缶: ["lata"],
  械: ["mecanismo"],
  畑: ["horta"],
  宇: ["universo"],
  宙: ["espaço"],
  雲: ["nuvem"],
  虹: ["arco-íris"],
  霧: ["neblina"],
  嵐: ["tempestade"],
  丘: ["colina"],
  谷: ["vale"],
  貝: ["concha"],
  鮭: ["salmão"],
  象: ["elefante", "fenômeno"],
  改: ["mudar", "reformar"],
  各: ["cada"],
  停: ["parar"],
  往: ["ir"],
  復: ["voltar", "repetir"],
  渋: ["adstringente", "travado"],
  滞: ["ficar parado", "atrasar"],
  免: ["isentar", "licença"],
  替: ["trocar"],
  搭: ["embarcar"],
  憩: ["descansar"],
  昇: ["subir"],
  接: ["ligar", "contato"],
  標: ["marca", "sinal"],
  担: ["carregar", "assumir"],
  技: ["técnica"],
  章: ["capítulo"],
  奨: ["incentivar"],
  房: ["quarto", "cacho"],
  畳: ["tatame", "dobrar"],
  舎: ["prédio"],
  韓: ["Coreia"],
  距: ["distância"],
  均: ["igual", "média"],
  順: ["ordem"],
  倍: ["dobro", "vezes"],
  冊: ["contador de livros"],
  匹: ["contador de animais"],
  貼: ["colar"],
  戚: ["parente"],
  俳: ["ator", "haicai"],
  農: ["agricultura"],
  帽: ["chapéu"],
  袋: ["saco", "sacola"],
  輪: ["anel", "roda"],
  衣: ["roupa"],
  粧: ["maquiar-se"],
  香: ["perfume", "aroma"],
  髭: ["barba"],
  爪: ["unha"],
  祝: ["celebrar"],
  漫: ["desenho, quadrinhos"],
  柔: ["macio", "suave"],
  釣: ["pescar", "troco"],
  器: ["utensílio", "recipiente"],
  劇: ["drama", "teatro"],
  展: ["expandir", "exposição"],
  銭: ["moeda"],
  札: ["etiqueta", "nota de dinheiro"],
  領: ["território", "receber"],
  貯: ["poupar", "guardar"],
  並: ["enfileirar", "comum"],
  揚: ["fritar", "levantar"],
  乾: ["secar"],
  触: ["tocar"],
  叩: ["bater"],
  蹴: ["chutar"],
  噛: ["morder"],
  驚: ["surpreender-se"],
  諦: ["desistir"],
  悩: ["afligir-se"],
  祈: ["rezar"],
  複: ["duplo", "composto"],
  寧: ["cuidadoso", "de preferência"],
  汚: ["sujo", "sujar"],
  珍: ["raro"],
  涼: ["fresco"],
  桃: ["pêssego"],
  腐: ["apodrecer"],
  豚: ["porco"],
  鶏: ["galinha"],
  乳: ["leite"],
  油: ["óleo"],
  鼻: ["nariz"],
  腕: ["braço"],
  膝: ["joelho"],
  腰: ["lombar", "quadril"],
  胸: ["peito"],
  骨: ["osso"],
  咳: ["tosse"],
  怪: ["estranho", "suspeito"],
  我: ["eu", "ego"],
  射: ["atirar", "injetar"],
  看: ["observar", "cuidar"],
  護: ["proteger"],
  玄: ["misterioso", "escuro"],
  呂: ["coluna vertebral"],
  壁: ["parede"],
  床: ["chão", "cama"],
  井: ["poço"],
  根: ["raiz"],
  椅: ["cadeira"],
  棚: ["prateleira"],
  団: ["grupo"],
  枕: ["travesseiro"],
  鍋: ["panela"],
  包: ["embrulhar"],
  丁: ["quarteirão", "unidade"],
  碗: ["tigela"],
  博: ["amplo", "exposição"],
  郵: ["correio"],
  署: ["repartição", "posto"],
  防: ["proteger", "prevenir"],
  鉄: ["ferro"],
  幹: ["tronco"],
  駐: ["estacionar", "residir"],
  街: ["rua", "bairro"],
  蛇: ["cobra"],
  熊: ["urso"],
  課: ["seção", "lição"],
  契: ["promessa", "contrato"],
  企: ["planejar"],
  刺: ["espetar", "cartão de visita"],
  板: ["tábua", "prancha"],
  授: ["dar aula", "conceder"],
  歴: ["história", "trajetória"],
  史: ["história"],
  績: ["feito", "resultado"],
  踊: ["dançar"],
  泣: ["chorar"],
  履: ["calçar"],
  狭: ["estreito"],
  細: ["fino", "detalhado"],
  厚: ["espesso"],
  甘: ["doce"],
  酸: ["azedo", "ácido"],
  黄: ["amarelo"],
  虫: ["inseto"],
  星: ["estrela"],
  暖: ["morno", "aquecer"],
  蒸: ["vapor", "cozinhar no vapor"],
  粉: ["pó", "farinha"],
  曇: ["nublar", "tempo nublado"],
  季: ["estação do ano"],
  節: ["época", "nó", "economizar"],
  波: ["onda"],
  塗: ["passar (creme, tinta)", "pintar"],
  充: ["encher", "carregar"],
  絡: ["ligar", "enroscar"],
  緊: ["tenso", "apertado"],
  寂: ["solitário", "quieto"],
  仲: ["relação (entre pessoas)"],
  玉: ["bola", "joia"],
  炒: ["refogar", "fritar"],
  蔵: ["armazém", "guardar"],
  濯: ["lavar (roupa)"],
  皿: ["prato"],
  片: ["pedaço", "um lado"],
  捨: ["jogar fora"],
  薄: ["fino", "fraco (sabor, cor)"],
  簡: ["simples"],
  炊: ["cozinhar (arroz)"],
  減: ["diminuir", "reduzir"],
  環: ["anel", "círculo"],
  境: ["limite", "fronteira"],
  興: ["interesse", "animar"],
  挙: ["levantar", "realizar"],
  謝: ["pedir desculpas", "agradecer"],
  去: ["ir embora", "passado"],
  台: ["plataforma", "contador de máquinas"],
  池: ["lagoa"],
  別: ["separar", "outro"],
  夕: ["fim de tarde"],
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
  return [...new Set([...jlpt, ...Object.keys(KANJI_N3), ...app])].filter((k) => dic.has(k));
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
    sig: (SIG_EXTRA[k] ?? KANJI_N3[k] ?? d.pt)
      .slice(0, 4)
      .map((x) => (NOMES_PROPRIOS.test(x) ? x : x.charAt(0).toLowerCase() + x.slice(1)).replace(/\.$/, "")),
    on: d.on.slice(0, 3),
    kun: kunLegivel(d.kun),
    nivel: d.jlpt === 4 ? 5 : d.jlpt === 3 ? 4 : KANJI_N3[k] ? 3 : null,
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
  /** nível do JLPT (5 = N5, 4 = N4, 3 = N3) ou null */
  nivel: 5 | 4 | 3 | null;
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
