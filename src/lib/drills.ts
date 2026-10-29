import { b } from "../db/seed-data/helpers";
import type { Categoria } from "./roleplay";
import { stripFurigana } from "./text";
import type { Mora } from "./types";

export interface Verbo {
  dict: string;
  /** infinitivo em português */
  pt: string;
  /** "eu ___" no presente e no passado */
  ptPres: string;
  ptPret: string;
  /** "você ___" no presente e no passado (para a fala do parceiro no diálogo) */
  vcPres: string;
  vcPret: string;
  /** forma após "vamos" quando difere do infinitivo ("vamos ao…", não "vamos ir ao…") */
  ptVamos?: string;
  /** formas que soam artificiais com este verbo */
  sem?: Forma[];
  /** moras da raiz -masu (ex.: ta.be) */
  raiz: string[];
  raizKana: string;
  /** raiz com kanji na notação de furigana: 食[た]べ */
  raizKanji: string;
  /** verbo heiban (plano) muda o pitch da forma -tai */
  heiban: boolean;
}

export const VERBOS: Verbo[] = [
  { dict: "taberu", pt: "comer", ptPres: "como", ptPret: "comi", vcPres: "come", vcPret: "comeu", raiz: ["ta", "be"], raizKana: "たべ", raizKanji: "食[た]べ", heiban: false },
  { dict: "nomu", pt: "beber", ptPres: "bebo", ptPret: "bebi", vcPres: "bebe", vcPret: "bebeu", raiz: ["no", "mi"], raizKana: "のみ", raizKanji: "飲[の]み", heiban: false },
  { dict: "iku", pt: "ir", ptPres: "vou", ptPret: "fui", vcPres: "vai", vcPret: "foi", ptVamos: "", raiz: ["i", "ki"], raizKana: "いき", raizKanji: "行[い]き", heiban: true },
  { dict: "kuru", pt: "vir", ptPres: "venho", ptPret: "vim", vcPres: "vem", vcPret: "veio", sem: ["mashou"], raiz: ["ki"], raizKana: "き", raizKanji: "来[き]", heiban: false },
  { dict: "suru", pt: "fazer", ptPres: "faço", ptPret: "fiz", vcPres: "faz", vcPret: "fez", raiz: ["shi"], raizKana: "し", raizKanji: "し", heiban: true },
  { dict: "miru", pt: "ver", ptPres: "vejo", ptPret: "vi", vcPres: "vê", vcPret: "viu", raiz: ["mi"], raizKana: "み", raizKanji: "見[み]", heiban: false },
  { dict: "kaku", pt: "escrever", ptPres: "escrevo", ptPret: "escrevi", vcPres: "escreve", vcPret: "escreveu", raiz: ["ka", "ki"], raizKana: "かき", raizKanji: "書[か]き", heiban: false },
  { dict: "yomu", pt: "ler", ptPres: "leio", ptPret: "li", vcPres: "lê", vcPret: "leu", raiz: ["yo", "mi"], raizKana: "よみ", raizKanji: "読[よ]み", heiban: false },
  { dict: "kau", pt: "comprar", ptPres: "compro", ptPret: "comprei", vcPres: "compra", vcPret: "comprou", raiz: ["ka", "i"], raizKana: "かい", raizKanji: "買[か]い", heiban: true },
  { dict: "hanasu", pt: "falar", ptPres: "falo", ptPret: "falei", vcPres: "fala", vcPret: "falou", raiz: ["ha", "na", "shi"], raizKana: "はなし", raizKanji: "話[はな]し", heiban: false },
  { dict: "kaeru", pt: "voltar", ptPres: "volto", ptPret: "voltei", vcPres: "volta", vcPret: "voltou", raiz: ["ka", "e", "ri"], raizKana: "かえり", raizKanji: "帰[かえ]り", heiban: false },
  { dict: "okiru", pt: "acordar", ptPres: "acordo", ptPret: "acordei", vcPres: "acorda", vcPret: "acordou", raiz: ["o", "ki"], raizKana: "おき", raizKanji: "起[お]き", heiban: false },
  { dict: "neru", pt: "dormir", ptPres: "durmo", ptPret: "dormi", vcPres: "dorme", vcPret: "dormiu", raiz: ["ne"], raizKana: "ね", raizKanji: "寝[ね]", heiban: true },
  { dict: "hataraku", pt: "trabalhar", ptPres: "trabalho", ptPret: "trabalhei", vcPres: "trabalha", vcPret: "trabalhou", raiz: ["ha", "ta", "ra", "ki"], raizKana: "はたらき", raizKanji: "働[はたら]き", heiban: true },
  { dict: "kiku", pt: "ouvir", ptPres: "ouço", ptPret: "ouvi", vcPres: "ouve", vcPret: "ouviu", raiz: ["ki", "ki"], raizKana: "きき", raizKanji: "聞[き]き", heiban: true },
  { dict: "matsu", pt: "esperar", ptPres: "espero", ptPret: "esperei", vcPres: "espera", vcPret: "esperou", raiz: ["ma", "chi"], raizKana: "まち", raizKanji: "待[ま]ち", heiban: false },
  { dict: "au", pt: "encontrar", ptPres: "encontro", ptPret: "encontrei", vcPres: "encontra", vcPret: "encontrou", raiz: ["a", "i"], raizKana: "あい", raizKanji: "会[あ]い", heiban: false },
  { dict: "okuru", pt: "enviar", ptPres: "envio", ptPret: "enviei", vcPres: "envia", vcPret: "enviou", raiz: ["o", "ku", "ri"], raizKana: "おくり", raizKanji: "送[おく]り", heiban: true },
  { dict: "tsukau", pt: "usar", ptPres: "uso", ptPret: "usei", vcPres: "usa", vcPret: "usou", raiz: ["tsu", "ka", "i"], raizKana: "つかい", raizKanji: "使[つか]い", heiban: true },
  { dict: "tsukuru", pt: "preparar", ptPres: "preparo", ptPret: "preparei", vcPres: "prepara", vcPret: "preparou", raiz: ["tsu", "ku", "ri"], raizKana: "つくり", raizKanji: "作[つく]り", heiban: false },
  { dict: "harau", pt: "pagar", ptPres: "pago", ptPret: "paguei", vcPres: "paga", vcPret: "pagou", raiz: ["ha", "ra", "i"], raizKana: "はらい", raizKanji: "払[はら]い", heiban: false },
  { dict: "noru", pt: "pegar", ptPres: "pego", ptPret: "peguei", vcPres: "pega", vcPret: "pegou", raiz: ["no", "ri"], raizKana: "のり", raizKanji: "乗[の]り", heiban: true },
  { dict: "hajimeru", pt: "começar", ptPres: "começo", ptPret: "comecei", vcPres: "começa", vcPret: "começou", raiz: ["ha", "ji", "me"], raizKana: "はじめ", raizKanji: "始[はじ]め", heiban: true },
  { dict: "tetsudau", pt: "ajudar", ptPres: "ajudo", ptPret: "ajudei", vcPres: "ajuda", vcPret: "ajudou", raiz: ["te", "tsu", "da", "i"], raizKana: "てつだい", raizKanji: "手伝[てつだ]い", heiban: false },
  { dict: "modoru", pt: "retornar", ptPres: "retorno", ptPret: "retornei", vcPres: "retorna", vcPret: "retornou", raiz: ["mo", "do", "ri"], raizKana: "もどり", raizKanji: "戻[もど]り", heiban: false },
  { dict: "aruku", pt: "andar", ptPres: "ando", ptPret: "andei", vcPres: "anda", vcPret: "andou", raiz: ["a", "ru", "ki"], raizKana: "あるき", raizKanji: "歩[ある]き", heiban: false },
  {
    dict: "benkyou suru",
    pt: "estudar", ptPres: "estudo", ptPret: "estudei", vcPres: "estuda", vcPret: "estudou",
    raiz: ["be", "n", "kyo", "o", "shi"],
    raizKana: "べんきょうし",
    raizKanji: "勉強[べんきょう]し",
    heiban: true,
  },
];

const junta = (...partes: (string | undefined)[]) => partes.filter(Boolean).join(" ");

export type Forma = "masu" | "mashita" | "masen" | "masen_deshita" | "tai" | "mashou";

interface FormaDef {
  label: string;
  comando: string;
  /** situação que dá contexto à forma */
  quando: string;
  /** regra de transformação a partir de -masu */
  regra: string;
  /** frase completa em português, com o complemento da situação */
  frase: (v: Verbo, obj?: string) => string;
  /** fala do parceiro que pede esta forma como resposta */
  pergunta: (v: Verbo, obj?: string) => string;
  /** como a resposta começa em português ("Sim," / "Não,") */
  abertura: string;
  /** sufixo em moras com pitch e devozeamento */
  sufixo: { som: string; pitch: "H" | "L"; dev?: boolean }[];
  kana: string;
  funcao: string;
}

export const FORMAS: Record<Forma, FormaDef> = {
  masu: {
    pergunta: (v, obj) => `${junta("Você", v.vcPres, obj)} todo dia?`,
    abertura: "Sim,",
    quando: "Hábito ou plano (todo dia / amanhã)",
    regra: "forma base: -masu",
    frase: (v, obj) => junta("eu", v.ptPres, obj),
    label: "Presente/Futuro",
    comando: "Forma base",
    sufixo: [{ som: "ma", pitch: "H" }, { som: "su", pitch: "L", dev: true }],
    kana: "ます",
    funcao: "[polido]",
  },
  mashita: {
    pergunta: (v, obj) => `${junta("Ontem você", v.vcPret, obj)}?`,
    abertura: "Sim,",
    quando: "Já aconteceu (ontem, hoje cedo)",
    regra: "-masu → -mashita",
    frase: (v, obj) => junta("eu", v.ptPret, obj),
    label: "Passado",
    comando: "Passado!",
    sufixo: [{ som: "ma", pitch: "H" }, { som: "shi", pitch: "L", dev: true }, { som: "ta", pitch: "L" }],
    kana: "ました",
    funcao: "[polido] + [passado]",
  },
  masen: {
    pergunta: (v, obj) => `${junta("Você", v.vcPres, obj)} todo dia?`,
    abertura: "Não,",
    quando: "Não é hábito nem plano",
    regra: "-masu → -masen",
    frase: (v, obj) => junta("eu não", v.ptPres, obj),
    label: "Negativo",
    comando: "Negativo!",
    sufixo: [{ som: "ma", pitch: "H" }, { som: "se", pitch: "H" }, { som: "n", pitch: "L" }],
    kana: "ません",
    funcao: "[polido] + NÃO",
  },
  masen_deshita: {
    pergunta: (v, obj) => `${junta("E ontem, você", v.vcPret, obj)}?`,
    abertura: "Não,",
    quando: "Não aconteceu (ontem eu não…)",
    regra: "-masu → -masen deshita",
    frase: (v, obj) => junta("eu não", v.ptPret, obj),
    label: "Passado negativo",
    comando: "Passado negativo!",
    sufixo: [
      { som: "ma", pitch: "H" },
      { som: "se", pitch: "H" },
      { som: "n", pitch: "L" },
      { som: "de", pitch: "L" },
      { som: "shi", pitch: "L", dev: true },
      { som: "ta", pitch: "L" },
    ],
    kana: "ませんでした",
    funcao: "[polido] + NÃO + [passado]",
  },
  tai: {
    pergunta: () => "O que você quer fazer?",
    abertura: "",
    quando: "Desejo agora",
    regra: "-masu → -tai desu",
    frase: (v, obj) => junta("eu quero", v.pt, obj),
    label: "Desejo",
    comando: "Quero…!",
    sufixo: [],
    kana: "たいです",
    funcao: "quero + [polido]",
  },
  mashou: {
    pergunta: () => "O que vamos fazer?",
    abertura: "",
    quando: "Convidando alguém",
    regra: "-masu → -mashou",
    frase: (v, obj) => `${junta("vamos", v.ptVamos ?? v.pt, obj)}!`,
    label: "Convite",
    comando: "Vamos…!",
    sufixo: [{ som: "ma", pitch: "H" }, { som: "sho", pitch: "H" }, { som: "o", pitch: "L" }],
    kana: "ましょう",
    funcao: "[polido] + vamos",
  },
};

export interface Conjugacao {
  verbo: Verbo;
  forma: Forma;
  moras: Mora[];
  kana: string;
  /** kanji com furigana (camada ortográfica) */
  kanji: string;
  /** formas aceitas no STT */
  alvos: string[];
}

/**
 * Gera a conjugação com pitch de Tóquio:
 * - famílias -masu: 1ª mora baixa, sobe até o núcleo (ma / se / sho) e cai.
 * - -tai: verbos planos caem depois de "ta" (ikitái); verbos acentuados caem na última mora da raiz (tabé-tai).
 */
export function conjugar(verbo: Verbo, forma: Forma): Conjugacao {
  const raizBloco = verbo.raiz.join("");
  const raizFn = verbo.pt;
  const mora = (som: string, pitch: "H" | "L", bloco: string, funcao: string, papel: Mora["papel"], dev?: boolean): Mora =>
    dev ? { som, pitch, bloco, funcao, papel, devozeada: true } : { som, pitch, bloco, funcao, papel };

  let moras: Mora[];
  if (forma === "tai") {
    const n = verbo.raiz.length;
    let raizPitch: ("H" | "L")[];
    let taPitch: "H" | "L";
    if (verbo.heiban) {
      raizPitch = verbo.raiz.map((_, i) => (i === 0 ? "L" : "H"));
      taPitch = "H";
    } else if (n === 1) {
      raizPitch = ["H"];
      taPitch = "L";
    } else {
      raizPitch = verbo.raiz.map((_, i) => (i === 0 ? "L" : "H"));
      taPitch = "L";
    }
    moras = [
      ...verbo.raiz.map((s, i) => mora(s, raizPitch[i], raizBloco, raizFn, "verbo")),
      mora("ta", taPitch, "tai", "quero", "verbo"),
      mora("i", "L", "tai", "quero", "verbo"),
      mora("de", "L", "desu", "[polidez]", "copula"),
      mora("su", "L", "desu", "[polidez]", "copula", true),
    ];
  } else {
    const def = FORMAS[forma];
    const sufBloco = def.sufixo.map((s) => s.som).join("");
    moras = [
      ...verbo.raiz.map((s, i) => mora(s, i === 0 ? "L" : "H", raizBloco, raizFn, "verbo")),
      ...def.sufixo.map((s) => mora(s.som, s.pitch, sufBloco, def.funcao, "verbo", s.dev)),
    ];
  }
  const suf = FORMAS[forma].kana;
  const kana = verbo.raizKana + suf;
  const kanjiPlano = stripFurigana(verbo.raizKanji);
  const alvos = [kana, kanjiPlano + suf];
  if (forma === "tai") alvos.push(verbo.raizKana + "たい", kanjiPlano + "たい");
  return { verbo, forma, moras, kana, kanji: verbo.raizKanji + suf, alvos };
}

export function romanizar(moras: Mora[]): string {
  return moras.map((m) => m.som).join("");
}

/** Complemento da frase em japonês (palavra + partícula), com pitch, para montar frases completas. */
export interface Complemento {
  kana: string;
  /** com furigana: 会議[かいぎ]に */
  kanji: string;
  moras: Mora[];
  /** formas da palavra principal aceitas no STT */
  nucleo: string[];
}

/** Uma situação concreta para o drill: o verbo aplicado a algo do contexto escolhido. */
export interface CenaDrill {
  verbo: string;
  /** complemento em português ("com o gerente") */
  obj: string;
  ja: Complemento;
  /** transformações que soam estranhas nesta situação */
  sem?: Forma[];
}

const comp = (kana: string, kanji: string, nucleo: string[], ...blocos: Mora[][]): Complemento => ({
  kana,
  kanji,
  nucleo,
  moras: blocos.flat(),
});
// Partículas: depois de palavra plana (heiban) ficam altas; depois de queda, baixas.
const o = (p: "H" | "L") => b("o", p, "[Objeto]", "particula");
const ni = (p: "H" | "L") => b("ni", p, "[Destino →]", "particula");
const niAlvo = (p: "H" | "L") => b("ni", p, "[com quem]", "particula");
const to = (p: "H" | "L") => b("to", p, "[com]", "particula");
const de = (p: "H" | "L") => b("de", p, "[Local da ação]", "particula");
const made = (p: "H" | "L") => b("ma.de", p + p, "[até]", "particula");
const deMeio = (p: "H" | "L") => b("de", p, "[meio: com]", "particula");

const UCHI = comp("うちに", "家[うち]に", ["うち", "家"], b("u.chi", "LH", "casa", "lugar"), ni("H"));
const OKYAKU = (part: Mora[]) => b("o.kya._ku.sa.n", "LHHHH", "cliente", "substantivo").concat(part);
const TOMODACHI = b("to.mo.da.chi", "LHHH", "amigos", "substantivo");
const OSOKU = comp("おそく", "遅[おそ]く", ["おそく", "遅く"], b("o.so.ku", "LHH", "tarde", "adverbio"));
const MEERU = comp("メールを", "メールを", ["めーる", "メール"], b("me.e.ru", "LHH", "e-mail", "objeto"), o("H"));
const SHIRYOU = comp("しりょうを", "資料[しりょう]を", ["しりょう", "資料"], b("shi.ryo.o", "HLL", "documentos", "objeto"), o("L"));
const BUCHOU = (part: Mora[]) => b("bu.cho.o", "LHH", "gerente (do setor)", "substantivo").concat(part);
const NIHONGO = comp("にほんごを", "日本語[にほんご]を", ["にほんご", "日本語"], b("ni.ho.n.go", "LHHH", "japonês (língua)", "objeto"), o("H"));
const HON = comp("ほんを", "本[ほん]を", ["ほん", "本"], b("ho.n", "HL", "livro", "objeto"), o("L"));
const KOOHII = comp("コーヒーを", "コーヒーを", ["こーひー", "コーヒー"], b("ko.o.hi.i", "LHHL", "café", "objeto"), o("L"));
const BIIRU = comp("ビールを", "ビールを", ["びーる", "ビール"], b("bi.i.ru", "HLL", "cerveja", "objeto"), o("L"));
const RAAMEN = comp("ラーメンを", "ラーメンを", ["らーめん", "ラーメン"], b("ra.a.me.n", "HLLL", "ramen", "objeto"), o("L"));
const OKAIKEI = comp("おかいけいを", "お会計[かいけい]を", ["かいけい", "会計"], b("o.ka.i.ke.i", "LHHHH", "conta", "objeto"), o("H"));
const FUKU = comp("ふくを", "服[ふく]を", ["ふく", "服"], b("_fu.ku", "LH", "roupa", "objeto"), o("L"));
const BASU = (part: Mora[]) => b("ba.su", "HL", "ônibus", "substantivo").concat(part);
const DENSHA = (part: Mora[]) => b("de.n.sha", "LHH", "trem", "substantivo").concat(part);
const KAZOKU = (part: Mora[]) => b("ka.zo.ku", "HLL", "família", "substantivo").concat(part);
const HAYAKU = comp("はやく", "早[はや]く", ["はやく", "早く"], b("ha.ya.ku", "HLL", "cedo", "adverbio"));

export const CENAS_DRILL: Record<Categoria, CenaDrill[]> = {
  trabalho: [
    { verbo: "hataraku", obj: "na empresa", ja: comp("かいしゃで", "会社[かいしゃ]で", ["かいしゃ", "会社"], b("ka.i.sha", "LHH", "empresa", "lugar"), de("H")) },
    { verbo: "kaku", obj: "o e-mail", ja: comp("メールを", "メールを", ["めーる", "メール"], b("me.e.ru", "LHH", "e-mail", "objeto"), o("H")) },
    { verbo: "yomu", obj: "os documentos", ja: comp("しりょうを", "資料[しりょう]を", ["しりょう", "資料"], b("shi.ryo.o", "HLL", "documentos", "objeto"), o("L")) },
    { verbo: "hanasu", obj: "com o gerente", ja: comp("ぶちょうと", "部長[ぶちょう]と", ["ぶちょう", "部長"], b("bu.cho.o", "LHH", "gerente (do setor)", "substantivo"), to("H")) },
    { verbo: "au", obj: "o cliente", ja: comp("おきゃくさんに", "お客[きゃく]さんに", ["きゃく", "客"], OKYAKU(niAlvo("H"))) },
    { verbo: "iku", obj: "à reunião", ja: comp("かいぎに", "会議[かいぎ]に", ["かいぎ", "会議"], b("ka.i.gi", "HLL", "reunião", "lugar"), ni("L")) },
    { verbo: "kaeru", obj: "para casa", ja: UCHI },
    { verbo: "matsu", obj: "o cliente", ja: comp("おきゃくさんを", "お客[きゃく]さんを", ["きゃく", "客"], OKYAKU(o("H"))) },
    { verbo: "suru", obj: "o trabalho", ja: comp("しごとを", "仕事[しごと]を", ["しごと", "仕事"], b("shi.go.to", "LHH", "trabalho", "objeto"), o("H")) },
    { verbo: "kiku", obj: "a explicação", ja: comp("せつめいを", "説明[せつめい]を", ["せつめい", "説明"], b("se.tsu.me.i", "LHHH", "explicação", "objeto"), o("H")) },
    { verbo: "benkyou suru", obj: "japonês", ja: comp("にほんごを", "日本語[にほんご]を", ["にほんご", "日本語"], b("ni.ho.n.go", "LHHH", "japonês (língua)", "objeto"), o("H")) },
    { verbo: "okuru", obj: "o e-mail", ja: MEERU },
    { verbo: "yomu", obj: "o e-mail", ja: MEERU },
    { verbo: "tsukuru", obj: "os documentos", ja: SHIRYOU },
    { verbo: "tsukau", obj: "o computador", ja: comp("パソコンを", "パソコンを", ["ぱそこん", "パソコン"], b("pa.so.ko.n", "LHHH", "computador", "objeto"), o("H")) },
    { verbo: "au", obj: "o gerente", ja: comp("ぶちょうに", "部長[ぶちょう]に", ["ぶちょう", "部長"], BUCHOU(niAlvo("H"))) },
    { verbo: "iku", obj: "à empresa", ja: comp("かいしゃに", "会社[かいしゃ]に", ["かいしゃ", "会社"], b("ka.i.sha", "LHH", "empresa", "lugar"), ni("H")) },
    { verbo: "kaeru", obj: "cedo", ja: HAYAKU },
    { verbo: "kaeru", obj: "tarde", ja: OSOKU },
    { verbo: "benkyou suru", obj: "inglês", ja: comp("えいごを", "英語[えいご]を", ["えいご", "英語"], b("e.i.go", "LHH", "inglês", "objeto"), o("H")) },
    { verbo: "noru", obj: "o trem", ja: comp("でんしゃに", "電車[でんしゃ]に", ["でんしゃ", "電車"], DENSHA(ni("H"))) },
    { verbo: "hajimeru", obj: "a reunião", ja: comp("かいぎを", "会議[かいぎ]を", ["かいぎ", "会議"], b("ka.i.gi", "HLL", "reunião", "objeto"), o("L")) },
    { verbo: "hajimeru", obj: "o trabalho", ja: comp("しごとを", "仕事[しごと]を", ["しごと", "仕事"], b("shi.go.to", "LHH", "trabalho", "objeto"), o("H")) },
    { verbo: "tetsudau", obj: "o colega", ja: comp("どうりょうを", "同僚[どうりょう]を", ["どうりょう", "同僚"], b("do.o.ryo.o", "LHHH", "colega de trabalho", "objeto"), o("H")) },
    { verbo: "tetsudau", obj: "o gerente", ja: comp("ぶちょうを", "部長[ぶちょう]を", ["ぶちょう", "部長"], BUCHOU(o("H"))) },
    { verbo: "modoru", obj: "ao escritório", ja: comp("じむしょに", "事務所[じむしょ]に", ["じむしょ", "事務所"], b("ji.mu.sho", "LHL", "escritório", "lugar"), ni("L")) },
    { verbo: "modoru", obj: "para a empresa", ja: comp("かいしゃに", "会社[かいしゃ]に", ["かいしゃ", "会社"], b("ka.i.sha", "LHH", "empresa", "lugar"), ni("H")) },
    {
      verbo: "okuru",
      obj: "os documentos ao cliente",
      ja: comp("おきゃくさんにしりょうを", "お客[きゃく]さんに資料[しりょう]を", ["しりょう", "資料"], OKYAKU(ni("H")), b("shi.ryo.o", "HLL", "documentos", "objeto"), o("L")),
    },
    { verbo: "kaku", obj: "o relatório", ja: comp("ほうこくしょを", "報告書[ほうこくしょ]を", ["ほうこくしょ", "報告書"], b("ho.o.ko.ku.sho", "LHHHH", "relatório", "objeto"), o("H")) },
  ],
  social: [
    { verbo: "au", obj: "os amigos", ja: comp("ともだちに", "友達[ともだち]に", ["ともだち", "友達"], TOMODACHI, niAlvo("H")) },
    { verbo: "iku", obj: "à festa", ja: comp("パーティーに", "パーティーに", ["ぱーてぃー", "パーティー"], b("pa.a.ti.i", "HLLL", "festa", "lugar"), ni("L")) },
    { verbo: "miru", obj: "um filme", ja: comp("えいがを", "映画[えいが]を", ["えいが", "映画"], b("e.i.ga", "HLL", "filme", "objeto"), o("L")) },
    { verbo: "nomu", obj: "cerveja", ja: comp("ビールを", "ビールを", ["びーる", "ビール"], b("bi.i.ru", "HLL", "cerveja", "objeto"), o("L")) },
    { verbo: "taberu", obj: "com os amigos", ja: comp("ともだちと", "友達[ともだち]と", ["ともだち", "友達"], TOMODACHI, to("H")) },
    { verbo: "hanasu", obj: "com a família", ja: comp("かぞくと", "家族[かぞく]と", ["かぞく", "家族"], b("ka.zo.ku", "HLL", "família", "substantivo"), to("L")) },
    { verbo: "kiku", obj: "música", ja: comp("おんがくを", "音楽[おんがく]を", ["おんがく", "音楽"], b("o.n.ga.ku", "HLLL", "música", "objeto"), o("L")) },
    { verbo: "matsu", obj: "os amigos", ja: comp("ともだちを", "友達[ともだち]を", ["ともだち", "友達"], TOMODACHI, o("H")) },
    { verbo: "neru", obj: "cedo", ja: HAYAKU },
    { verbo: "okiru", obj: "tarde", ja: comp("おそく", "遅[おそ]く", ["おそく", "遅く"], b("o.so.ku", "LHH", "tarde", "adverbio")) },
    { verbo: "iku", obj: "ao karaokê", ja: comp("カラオケに", "カラオケに", ["からおけ", "カラオケ"], b("ka.ra.o.ke", "LHHH", "karaokê", "lugar"), ni("H")) },
    { verbo: "iku", obj: "à praia", ja: comp("うみに", "海[うみ]に", ["うみ", "海"], b("u.mi", "HL", "mar / praia", "lugar"), ni("L")) },
    { verbo: "taberu", obj: "o jantar", ja: comp("ばんごはんを", "晩[ばん]ご飯[はん]を", ["ばんごはん", "晩ご飯"], b("ba.n.go.ha.n", "LHHLL", "jantar", "objeto"), o("L")) },
    { verbo: "hanasu", obj: "com os amigos", ja: comp("ともだちと", "友達[ともだち]と", ["ともだち", "友達"], TOMODACHI, to("H")) },
    { verbo: "miru", obj: "televisão", ja: comp("テレビを", "テレビを", ["てれび", "テレビ"], b("te.re.bi", "HLL", "televisão", "objeto"), o("L")) },
    { verbo: "yomu", obj: "um livro", ja: HON },
    { verbo: "nomu", obj: "café", ja: KOOHII },
    { verbo: "au", obj: "a família", ja: comp("かぞくに", "家族[かぞく]に", ["かぞく", "家族"], KAZOKU(niAlvo("L"))) },
    { verbo: "kaeru", obj: "tarde", ja: OSOKU },
    { verbo: "benkyou suru", obj: "japonês", ja: NIHONGO },
  ],
  restaurante: [
    { verbo: "taberu", obj: "sushi", ja: comp("すしを", "寿司[すし]を", ["すし", "寿司"], b("_su.shi", "LH", "sushi", "objeto"), o("L")) },
    { verbo: "nomu", obj: "chá", ja: comp("おちゃを", "お茶[ちゃ]を", ["おちゃ", "お茶"], b("o.cha", "LH", "chá", "objeto"), o("H")) },
    { verbo: "iku", obj: "ao restaurante", ja: comp("レストランに", "レストランに", ["れすとらん", "レストラン"], b("re._su.to.ra.n", "HLLLL", "restaurante", "lugar"), ni("L")) },
    { verbo: "miru", obj: "o cardápio", ja: comp("メニューを", "メニューを", ["めにゅー", "メニュー"], b("me.nyu.u", "HLL", "cardápio", "objeto"), o("L")) },
    { verbo: "kau", obj: "um café", ja: comp("コーヒーを", "コーヒーを", ["こーひー", "コーヒー"], b("ko.o.hi.i", "LHHL", "café", "objeto"), o("L")) },
    { verbo: "suru", obj: "o pedido", ja: comp("ちゅうもんを", "注文[ちゅうもん]を", ["ちゅうもん", "注文"], b("chu.u.mo.n", "LHHH", "pedido", "objeto"), o("H")) },
    { verbo: "taberu", obj: "ramen", ja: RAAMEN },
    { verbo: "taberu", obj: "o almoço", ja: comp("ひるごはんを", "昼[ひる]ご飯[はん]を", ["ひるごはん", "昼ご飯"], b("hi.ru.go.ha.n", "LHHLL", "almoço", "objeto"), o("L")) },
    { verbo: "nomu", obj: "cerveja", ja: BIIRU },
    { verbo: "nomu", obj: "água", ja: comp("みずを", "水[みず]を", ["みず", "水"], b("mi.zu", "LH", "água", "objeto"), o("H")) },
    { verbo: "iku", obj: "ao café", ja: comp("カフェに", "カフェに", ["かふぇ", "カフェ"], b("ka.fe", "HL", "café (lugar)", "lugar"), ni("L")) },
    { verbo: "harau", obj: "a conta", ja: OKAIKEI },
    { verbo: "matsu", obj: "os amigos", ja: comp("ともだちを", "友達[ともだち]を", ["ともだち", "友達"], TOMODACHI, o("H")) },
  ],
  compras: [
    { verbo: "kau", obj: "roupas", ja: comp("ふくを", "服[ふく]を", ["ふく", "服"], b("_fu.ku", "LH", "roupa", "objeto"), o("L")) },
    { verbo: "kau", obj: "um presente", ja: comp("プレゼントを", "プレゼントを", ["ぷれぜんと", "プレゼント"], b("pu.re.ze.n.to", "LHLLL", "presente", "objeto"), o("L")) },
    { verbo: "miru", obj: "o preço", ja: comp("ねだんを", "値段[ねだん]を", ["ねだん", "値段"], b("ne.da.n", "LHH", "preço", "objeto"), o("H")) },
    { verbo: "iku", obj: "à loja de departamentos", ja: comp("デパートに", "デパートに", ["でぱーと", "デパート"], b("de.pa.a.to", "LHLL", "loja de departamentos", "lugar"), ni("L")) },
    { verbo: "taberu", obj: "um bentô", ja: comp("おべんとうを", "お弁当[べんとう]を", ["べんとう", "弁当"], b("o.be.n.to.o", "LHHHH", "bentô (marmita)", "objeto"), o("H")) },
    { verbo: "nomu", obj: "um suco", ja: comp("ジュースを", "ジュースを", ["じゅーす", "ジュース"], b("ju.u.su", "HLL", "suco", "objeto"), o("L")) },
    { verbo: "kaeru", obj: "para casa", ja: UCHI },
    { verbo: "kau", obj: "sapatos", ja: comp("くつを", "靴[くつ]を", ["くつ", "靴"], b("_ku.tsu", "LH", "sapatos", "objeto"), o("L")) },
    { verbo: "kau", obj: "um livro", ja: HON },
    { verbo: "miru", obj: "as roupas", ja: FUKU },
    { verbo: "harau", obj: "com cartão", ja: comp("カードで", "カードで", ["かーど", "カード"], b("ka.a.do", "HLL", "cartão", "substantivo"), deMeio("L")) },
    { verbo: "harau", obj: "a conta", ja: OKAIKEI },
    { verbo: "iku", obj: "ao supermercado", ja: comp("スーパーに", "スーパーに", ["すーぱー", "スーパー"], b("su.u.pa.a", "HLLL", "supermercado", "lugar"), ni("L")) },
    { verbo: "iku", obj: "ao konbini", ja: comp("コンビニに", "コンビニに", ["こんびに", "コンビニ"], b("ko.n.bi.ni", "LHHH", "loja de conveniência", "lugar"), ni("H")) },
    { verbo: "kau", obj: "um café", ja: KOOHII },
  ],
  cidade: [
    { verbo: "iku", obj: "à estação", ja: comp("えきに", "駅[えき]に", ["えき", "駅"], b("e.ki", "HL", "estação", "lugar"), ni("L")) },
    { verbo: "matsu", obj: "o trem", ja: comp("でんしゃを", "電車[でんしゃ]を", ["でんしゃ", "電車"], b("de.n.sha", "LHH", "trem", "objeto"), o("H")) },
    { verbo: "miru", obj: "o mapa", ja: comp("ちずを", "地図[ちず]を", ["ちず", "地図"], b("chi.zu", "HL", "mapa", "objeto"), o("L")) },
    { verbo: "kau", obj: "a passagem", ja: comp("きっぷを", "切符[きっぷ]を", ["きっぷ", "切符"], b("_ki.p.pu", "LHH", "passagem", "objeto"), o("H")) },
    { verbo: "kaeru", obj: "para o hotel", ja: comp("ホテルに", "ホテルに", ["ほてる", "ホテル"], b("ho.te.ru", "HLL", "hotel", "lugar"), ni("L")) },
    { verbo: "kuru", obj: "ao Japão", sem: ["masen"], ja: comp("にほんに", "日本[にほん]に", ["にほん", "日本"], b("ni.ho.n", "LHL", "Japão", "lugar"), ni("L")) },
    { verbo: "okiru", obj: "cedo", ja: HAYAKU },
    { verbo: "taberu", obj: "ramen", ja: comp("ラーメンを", "ラーメンを", ["らーめん", "ラーメン"], b("ra.a.me.n", "HLLL", "ramen", "objeto"), o("L")) },
    { verbo: "noru", obj: "o trem", ja: comp("でんしゃに", "電車[でんしゃ]に", ["でんしゃ", "電車"], DENSHA(ni("H"))) },
    { verbo: "noru", obj: "o ônibus", ja: comp("バスに", "バスに", ["ばす", "バス"], BASU(ni("L"))) },
    { verbo: "noru", obj: "o táxi", ja: comp("タクシーに", "タクシーに", ["たくしー", "タクシー"], b("ta._ku.shi.i", "HLLL", "táxi", "substantivo"), ni("L")) },
    { verbo: "aruku", obj: "até a estação", ja: comp("えきまで", "駅[えき]まで", ["えき", "駅"], b("e.ki", "HL", "estação", "lugar"), made("L")) },
    { verbo: "matsu", obj: "o ônibus", ja: comp("バスを", "バスを", ["ばす", "バス"], BASU(o("L"))) },
    { verbo: "iku", obj: "ao templo", ja: comp("おてらに", "お寺[てら]に", ["おてら", "お寺"], b("o.te.ra", "LHH", "templo", "lugar"), ni("H")) },
    { verbo: "kau", obj: "uma lembrancinha", ja: comp("おみやげを", "お土産[みやげ]を", ["おみやげ", "お土産"], b("o.mi.ya.ge", "LHHH", "lembrancinha", "objeto"), o("H")) },
    { verbo: "kaeru", obj: "para o Brasil", ja: comp("ブラジルに", "ブラジルに", ["ぶらじる", "ブラジル"], b("bu.ra.ji.ru", "LHHH", "Brasil", "lugar"), ni("H")) },
    { verbo: "nomu", obj: "água", ja: comp("みずを", "水[みず]を", ["みず", "水"], b("mi.zu", "LH", "água", "objeto"), o("H")) },
    { verbo: "taberu", obj: "o almoço", ja: comp("ひるごはんを", "昼[ひる]ご飯[はん]を", ["ひるごはん", "昼ご飯"], b("hi.ru.go.ha.n", "LHHLL", "almoço", "objeto"), o("L")) },
  ],
};

/** Situações do contexto; "todos" mistura as de todos os contextos. */
export function cenasDoContexto(ctx: Categoria | "todos"): CenaDrill[] {
  return ctx === "todos" ? Object.values(CENAS_DRILL).flat() : CENAS_DRILL[ctx];
}

export function verboPorDict(dict: string): Verbo {
  const v = VERBOS.find((x) => x.dict === dict);
  if (!v) throw new Error(`verbo desconhecido: ${dict}`);
  return v;
}

/** Uma fala completa do diálogo do drill. */
export interface FalaDrill {
  kana: string;
  kanji: string;
  pt: string;
  moras: Mora[];
}

export interface DialogoDrill {
  /** o parceiro pergunta em japonês */
  pergunta: FalaDrill;
  /** a resposta completa e educada que o usuário deve dizer */
  resposta: FalaDrill;
  /** peças para montar a resposta: complemento + verbo na forma base */
  pecas: FalaDrill[];
  alvos: { frase: string[]; verbo: string[]; complemento: string[] };
}

const fala = (kana: string, kanji: string, pt: string, ...partes: Mora[][]): FalaDrill => ({
  kana,
  kanji,
  pt,
  moras: partes.flat(),
});

const MAINICHI = { kana: "まいにち、", kanji: "毎日[まいにち]、", moras: b("ma.i.ni.chi", "HLLL", "todo dia", "tempo") };
const KINOU = { kana: "きのう、", kanji: "昨日[きのう]、", moras: b("ki.no.o", "LHL", "ontem", "tempo") };
const HAI = { kana: "はい、", kanji: "はい、", moras: b("ha.i", "HL", "sim", "expressao") };
const IIE = { kana: "いいえ、", kanji: "いいえ、", moras: b("i.i.e", "LHH", "não", "expressao") };
const NANI_O = { kana: "なにを", kanji: "何[なに]を", moras: [...b("na.ni", "HL", "o quê", "pergunta"), ...b("o", "L", "[Objeto]", "particula")] };
const KA = b("ka", "L", "[?]", "particula");

/** "(eu)" deixa explícito que o sujeito existe em português mas some em japonês. */
const comEuImplicito = (frase: string) => frase.replace(/^eu\b/, "(eu)").replace(/^(Sim|Não), eu\b/, "$1, (eu)");
const maiuscula = (t: string) => t.replace(/^(\(?)(\p{L})/u, (_, par: string, l: string) => par + l.toUpperCase());
const ponto = (t: string) => (/[.!?]$/.test(t) ? t : `${t}.`);

/**
 * Monta pergunta e resposta completas para a cena:
 * - Negativo:          毎日、[complemento][verbo]ますか → いいえ、[complemento][verbo]ません
 * - Passado:           昨日、[complemento][verbo]ましたか → はい、[complemento][verbo]ました
 * - Passado negativo:  昨日、…ましたか → いいえ、[complemento][verbo]ませんでした
 * - Desejo:            何をしたいですか → [complemento][verbo]たいです
 * - Convite:           何をしましょうか → [complemento][verbo]ましょう
 */
export function montarDialogo(cena: CenaDrill, forma: Forma): DialogoDrill {
  const v = verboPorDict(cena.verbo);
  const f = FORMAS[forma];
  const c = cena.ja;
  const suru = verboPorDict("suru");
  const fim = (t: string) => `${t}。`;

  let pergunta: FalaDrill;
  if (forma === "tai" || forma === "mashou") {
    const q = conjugar(suru, forma === "tai" ? "tai" : "mashou");
    pergunta = fala(fim(NANI_O.kana + q.kana + "か"), fim(NANI_O.kanji + q.kanji + "か"), f.pergunta(v, cena.obj), NANI_O.moras, q.moras, KA);
  } else {
    const tempo = forma === "masen" ? MAINICHI : KINOU;
    const q = conjugar(v, forma === "masen" ? "masu" : "mashita");
    pergunta = fala(
      fim(tempo.kana + c.kana + q.kana + "か"),
      fim(tempo.kanji + c.kanji + q.kanji + "か"),
      f.pergunta(v, cena.obj),
      tempo.moras,
      c.moras,
      q.moras,
      KA,
    );
  }

  const alvo = conjugar(v, forma);
  const inicio = forma === "mashita" ? HAI : forma === "masen" || forma === "masen_deshita" ? IIE : null;
  const ptResposta = ponto(maiuscula(comEuImplicito([f.abertura, f.frase(v, cena.obj)].filter(Boolean).join(" "))));
  const resposta = fala(
    fim((inicio?.kana ?? "") + c.kana + alvo.kana),
    fim((inicio?.kanji ?? "") + c.kanji + alvo.kanji),
    ptResposta,
    inicio?.moras ?? [],
    c.moras,
    alvo.moras,
  );

  const base = conjugar(v, "masu");
  const pecas = [
    fala(c.kana, c.kanji, cena.obj, c.moras),
    fala(base.kana, base.kanji, `${v.pt} (forma base)`, base.moras),
  ];

  const plano = (t: string) => stripFurigana(t);
  return {
    pergunta,
    resposta,
    pecas,
    alvos: {
      frase: [resposta.kana, plano(resposta.kanji), c.kana + alvo.kana, plano(c.kanji) + alvo.kana],
      verbo: alvo.alvos,
      complemento: c.nucleo,
    },
  };
}

/** Quem puxa a conversa no drill, conforme o contexto. */
export const PARCEIRO_DRILL: Record<Categoria | "todos", string> = {
  todos: "Amigo",
  trabalho: "Colega de trabalho",
  social: "Yuki (amiga)",
  restaurante: "Amigo no restaurante",
  compras: "Amiga nas compras",
  cidade: "Companheiro de viagem",
};
