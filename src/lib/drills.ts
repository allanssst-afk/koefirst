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
  /** forma -te: sons (prefixo _ = devozeada), mora em que a voz cai (0 = plano), kana e kanji com furigana */
  te: { som: string; acento: number; kana: string; kanji: string };
  /** forma de dicionário: sons, mora em que a voz cai (0 = plano), kana e kanji com furigana */
  dicio: { som: string; acento: number; kana: string; kanji: string };
  /** base da forma -nai (o que vem antes de "nai": kaka, tabe, shi), em sons, kana e kanji com furigana */
  nai: { som: string; kana: string; kanji: string };
  /** imperativo educado em português, para o pedido ("envie") */
  ptPedido: string;
  /** gerúndio em português, para a ação em andamento ("enviando") */
  ptGerundio: string;
}

export const VERBOS: Verbo[] = [
  { dict: "taberu", sem: ["te_kudasai"], pt: "comer", ptPres: "como", ptPret: "comi", vcPres: "come", vcPret: "comeu", raiz: ["ta", "be"], raizKana: "たべ", raizKanji: "食[た]べ", te: { som: "ta.be.te", acento: 1, kana: "たべて", kanji: "食[た]べて" }, ptGerundio: "comendo", dicio: { som: "ta.be.ru", acento: 2, kana: "たべる", kanji: "食[た]べる" }, nai: { som: "ta.be", kana: "たべ", kanji: "食[た]べ" }, ptPedido: "coma", heiban: false },
  { dict: "nomu", sem: ["te_kudasai"], pt: "beber", ptPres: "bebo", ptPret: "bebi", vcPres: "bebe", vcPret: "bebeu", raiz: ["no", "mi"], raizKana: "のみ", raizKanji: "飲[の]み", te: { som: "no.n.de", acento: 1, kana: "のんで", kanji: "飲[の]んで" }, ptGerundio: "bebendo", dicio: { som: "no.mu", acento: 1, kana: "のむ", kanji: "飲[の]む" }, nai: { som: "no.ma", kana: "のま", kanji: "飲[の]ま" }, ptPedido: "beba", heiban: false },
  { dict: "iku", sem: ["te_imasu"], pt: "ir", ptPres: "vou", ptPret: "fui", vcPres: "vai", vcPret: "foi", ptVamos: "", raiz: ["i", "ki"], raizKana: "いき", raizKanji: "行[い]き", te: { som: "i.t.te", acento: 0, kana: "いって", kanji: "行[い]って" }, ptGerundio: "indo", dicio: { som: "i.ku", acento: 0, kana: "いく", kanji: "行[い]く" }, nai: { som: "i.ka", kana: "いか", kanji: "行[い]か" }, ptPedido: "vá", heiban: true },
  { dict: "kuru", pt: "vir", ptPres: "venho", ptPret: "vim", vcPres: "vem", vcPret: "veio", sem: ["te_imasu", "mashou"], raiz: ["ki"], raizKana: "き", raizKanji: "来[き]", te: { som: "_ki.te", acento: 1, kana: "きて", kanji: "来[き]て" }, ptGerundio: "vindo", dicio: { som: "ku.ru", acento: 1, kana: "くる", kanji: "来[く]る" }, nai: { som: "ko", kana: "こ", kanji: "来[こ]" }, ptPedido: "venha", heiban: false },
  { dict: "suru", pt: "fazer", ptPres: "faço", ptPret: "fiz", vcPres: "faz", vcPret: "fez", raiz: ["shi"], raizKana: "し", raizKanji: "し", te: { som: "_shi.te", acento: 0, kana: "して", kanji: "して" }, ptGerundio: "fazendo", dicio: { som: "su.ru", acento: 0, kana: "する", kanji: "する" }, nai: { som: "shi", kana: "し", kanji: "し" }, ptPedido: "faça", heiban: true },
  { dict: "miru", pt: "ver", ptPres: "vejo", ptPret: "vi", vcPres: "vê", vcPret: "viu", raiz: ["mi"], raizKana: "み", raizKanji: "見[み]", te: { som: "mi.te", acento: 1, kana: "みて", kanji: "見[み]て" }, ptGerundio: "vendo", dicio: { som: "mi.ru", acento: 1, kana: "みる", kanji: "見[み]る" }, nai: { som: "mi", kana: "み", kanji: "見[み]" }, ptPedido: "veja", heiban: false },
  { dict: "kaku", pt: "escrever", ptPres: "escrevo", ptPret: "escrevi", vcPres: "escreve", vcPret: "escreveu", raiz: ["ka", "ki"], raizKana: "かき", raizKanji: "書[か]き", te: { som: "ka.i.te", acento: 1, kana: "かいて", kanji: "書[か]いて" }, ptGerundio: "escrevendo", dicio: { som: "ka.ku", acento: 1, kana: "かく", kanji: "書[か]く" }, nai: { som: "ka.ka", kana: "かか", kanji: "書[か]か" }, ptPedido: "escreva", heiban: false },
  { dict: "yomu", pt: "ler", ptPres: "leio", ptPret: "li", vcPres: "lê", vcPret: "leu", raiz: ["yo", "mi"], raizKana: "よみ", raizKanji: "読[よ]み", te: { som: "yo.n.de", acento: 1, kana: "よんで", kanji: "読[よ]んで" }, ptGerundio: "lendo", dicio: { som: "yo.mu", acento: 1, kana: "よむ", kanji: "読[よ]む" }, nai: { som: "yo.ma", kana: "よま", kanji: "読[よ]ま" }, ptPedido: "leia", heiban: false },
  { dict: "kau", pt: "comprar", ptPres: "compro", ptPret: "comprei", vcPres: "compra", vcPret: "comprou", raiz: ["ka", "i"], raizKana: "かい", raizKanji: "買[か]い", te: { som: "ka.t.te", acento: 0, kana: "かって", kanji: "買[か]って" }, ptGerundio: "comprando", dicio: { som: "ka.u", acento: 0, kana: "かう", kanji: "買[か]う" }, nai: { som: "ka.wa", kana: "かわ", kanji: "買[か]わ" }, ptPedido: "compre", heiban: true },
  { dict: "hanasu", pt: "falar", ptPres: "falo", ptPret: "falei", vcPres: "fala", vcPret: "falou", raiz: ["ha", "na", "shi"], raizKana: "はなし", raizKanji: "話[はな]し", te: { som: "ha.na._shi.te", acento: 2, kana: "はなして", kanji: "話[はな]して" }, ptGerundio: "falando", dicio: { som: "ha.na._su", acento: 2, kana: "はなす", kanji: "話[はな]す" }, nai: { som: "ha.na.sa", kana: "はなさ", kanji: "話[はな]さ" }, ptPedido: "fale", heiban: false },
  { dict: "kaeru", sem: ["te_imasu"], pt: "voltar", ptPres: "volto", ptPret: "voltei", vcPres: "volta", vcPret: "voltou", raiz: ["ka", "e", "ri"], raizKana: "かえり", raizKanji: "帰[かえ]り", te: { som: "ka.e.t.te", acento: 1, kana: "かえって", kanji: "帰[かえ]って" }, ptGerundio: "voltando", dicio: { som: "ka.e.ru", acento: 1, kana: "かえる", kanji: "帰[かえ]る" }, nai: { som: "ka.e.ra", kana: "かえら", kanji: "帰[かえ]ら" }, ptPedido: "volte", heiban: false },
  { dict: "okiru", sem: ["te_imasu", "te_kudasai"], pt: "acordar", ptPres: "acordo", ptPret: "acordei", vcPres: "acorda", vcPret: "acordou", raiz: ["o", "ki"], raizKana: "おき", raizKanji: "起[お]き", te: { som: "o.ki.te", acento: 1, kana: "おきて", kanji: "起[お]きて" }, ptGerundio: "acordando", dicio: { som: "o.ki.ru", acento: 2, kana: "おきる", kanji: "起[お]きる" }, nai: { som: "o.ki", kana: "おき", kanji: "起[お]き" }, ptPedido: "acorde", heiban: false },
  { dict: "neru", sem: ["te_imasu", "te_kudasai"], pt: "dormir", ptPres: "durmo", ptPret: "dormi", vcPres: "dorme", vcPret: "dormiu", raiz: ["ne"], raizKana: "ね", raizKanji: "寝[ね]", te: { som: "ne.te", acento: 0, kana: "ねて", kanji: "寝[ね]て" }, ptGerundio: "dormindo", dicio: { som: "ne.ru", acento: 0, kana: "ねる", kanji: "寝[ね]る" }, nai: { som: "ne", kana: "ね", kanji: "寝[ね]" }, ptPedido: "durma", heiban: true },
  { dict: "hataraku", sem: ["te_kudasai"], pt: "trabalhar", ptPres: "trabalho", ptPret: "trabalhei", vcPres: "trabalha", vcPret: "trabalhou", raiz: ["ha", "ta", "ra", "ki"], raizKana: "はたらき", raizKanji: "働[はたら]き", te: { som: "ha.ta.ra.i.te", acento: 0, kana: "はたらいて", kanji: "働[はたら]いて" }, ptGerundio: "trabalhando", dicio: { som: "ha.ta.ra.ku", acento: 0, kana: "はたらく", kanji: "働[はたら]く" }, nai: { som: "ha.ta.ra.ka", kana: "はたらか", kanji: "働[はたら]か" }, ptPedido: "trabalhe", heiban: true },
  { dict: "kiku", pt: "ouvir", ptPres: "ouço", ptPret: "ouvi", vcPres: "ouve", vcPret: "ouviu", raiz: ["ki", "ki"], raizKana: "きき", raizKanji: "聞[き]き", te: { som: "ki.i.te", acento: 0, kana: "きいて", kanji: "聞[き]いて" }, ptGerundio: "ouvindo", dicio: { som: "_ki.ku", acento: 0, kana: "きく", kanji: "聞[き]く" }, nai: { som: "_ki.ka", kana: "きか", kanji: "聞[き]か" }, ptPedido: "ouça", heiban: true },
  { dict: "matsu", pt: "esperar", ptPres: "espero", ptPret: "esperei", vcPres: "espera", vcPret: "esperou", raiz: ["ma", "chi"], raizKana: "まち", raizKanji: "待[ま]ち", te: { som: "ma.t.te", acento: 1, kana: "まって", kanji: "待[ま]って" }, ptGerundio: "esperando", dicio: { som: "ma.tsu", acento: 1, kana: "まつ", kanji: "待[ま]つ" }, nai: { som: "ma.ta", kana: "また", kanji: "待[ま]た" }, ptPedido: "espere", heiban: false },
  { dict: "au", pt: "encontrar", ptPres: "encontro", ptPret: "encontrei", vcPres: "encontra", vcPret: "encontrou", raiz: ["a", "i"], raizKana: "あい", raizKanji: "会[あ]い", te: { som: "a.t.te", acento: 1, kana: "あって", kanji: "会[あ]って" }, ptGerundio: "encontrando", dicio: { som: "a.u", acento: 1, kana: "あう", kanji: "会[あ]う" }, nai: { som: "a.wa", kana: "あわ", kanji: "会[あ]わ" }, ptPedido: "encontre", heiban: false },
  { dict: "okuru", pt: "enviar", ptPres: "envio", ptPret: "enviei", vcPres: "envia", vcPret: "enviou", raiz: ["o", "ku", "ri"], raizKana: "おくり", raizKanji: "送[おく]り", te: { som: "o.ku.t.te", acento: 0, kana: "おくって", kanji: "送[おく]って" }, ptGerundio: "enviando", dicio: { som: "o.ku.ru", acento: 0, kana: "おくる", kanji: "送[おく]る" }, nai: { som: "o.ku.ra", kana: "おくら", kanji: "送[おく]ら" }, ptPedido: "envie", heiban: true },
  { dict: "tsukau", pt: "usar", ptPres: "uso", ptPret: "usei", vcPres: "usa", vcPret: "usou", raiz: ["tsu", "ka", "i"], raizKana: "つかい", raizKanji: "使[つか]い", te: { som: "_tsu.ka.t.te", acento: 0, kana: "つかって", kanji: "使[つか]って" }, ptGerundio: "usando", dicio: { som: "_tsu.ka.u", acento: 0, kana: "つかう", kanji: "使[つか]う" }, nai: { som: "_tsu.ka.wa", kana: "つかわ", kanji: "使[つか]わ" }, ptPedido: "use", heiban: true },
  { dict: "tsukuru", pt: "preparar", ptPres: "preparo", ptPret: "preparei", vcPres: "prepara", vcPret: "preparou", raiz: ["tsu", "ku", "ri"], raizKana: "つくり", raizKanji: "作[つく]り", te: { som: "_tsu.ku.t.te", acento: 2, kana: "つくって", kanji: "作[つく]って" }, ptGerundio: "preparando", dicio: { som: "_tsu.ku.ru", acento: 2, kana: "つくる", kanji: "作[つく]る" }, nai: { som: "_tsu.ku.ra", kana: "つくら", kanji: "作[つく]ら" }, ptPedido: "prepare", heiban: false },
  { dict: "harau", pt: "pagar", ptPres: "pago", ptPret: "paguei", vcPres: "paga", vcPret: "pagou", raiz: ["ha", "ra", "i"], raizKana: "はらい", raizKanji: "払[はら]い", te: { som: "ha.ra.t.te", acento: 2, kana: "はらって", kanji: "払[はら]って" }, ptGerundio: "pagando", dicio: { som: "ha.ra.u", acento: 2, kana: "はらう", kanji: "払[はら]う" }, nai: { som: "ha.ra.wa", kana: "はらわ", kanji: "払[はら]わ" }, ptPedido: "pague", heiban: false },
  { dict: "noru", sem: ["te_imasu"], pt: "pegar", ptPres: "pego", ptPret: "peguei", vcPres: "pega", vcPret: "pegou", raiz: ["no", "ri"], raizKana: "のり", raizKanji: "乗[の]り", te: { som: "no.t.te", acento: 0, kana: "のって", kanji: "乗[の]って" }, ptGerundio: "pegando", dicio: { som: "no.ru", acento: 0, kana: "のる", kanji: "乗[の]る" }, nai: { som: "no.ra", kana: "のら", kanji: "乗[の]ら" }, ptPedido: "pegue", heiban: true },
  { dict: "hajimeru", sem: ["te_imasu"], pt: "começar", ptPres: "começo", ptPret: "comecei", vcPres: "começa", vcPret: "começou", raiz: ["ha", "ji", "me"], raizKana: "はじめ", raizKanji: "始[はじ]め", te: { som: "ha.ji.me.te", acento: 0, kana: "はじめて", kanji: "始[はじ]めて" }, ptGerundio: "começando", dicio: { som: "ha.ji.me.ru", acento: 0, kana: "はじめる", kanji: "始[はじ]める" }, nai: { som: "ha.ji.me", kana: "はじめ", kanji: "始[はじ]め" }, ptPedido: "comece", heiban: true },
  { dict: "tetsudau", sem: ["te_kudasai"], pt: "ajudar", ptPres: "ajudo", ptPret: "ajudei", vcPres: "ajuda", vcPret: "ajudou", raiz: ["te", "tsu", "da", "i"], raizKana: "てつだい", raizKanji: "手伝[てつだ]い", te: { som: "te.tsu.da.t.te", acento: 3, kana: "てつだって", kanji: "手伝[てつだ]って" }, ptGerundio: "ajudando", dicio: { som: "te.tsu.da.u", acento: 3, kana: "てつだう", kanji: "手伝[てつだ]う" }, nai: { som: "te.tsu.da.wa", kana: "てつだわ", kanji: "手伝[てつだ]わ" }, ptPedido: "ajude", heiban: false },
  { dict: "modoru", sem: ["te_imasu"], pt: "retornar", ptPres: "retorno", ptPret: "retornei", vcPres: "retorna", vcPret: "retornou", raiz: ["mo", "do", "ri"], raizKana: "もどり", raizKanji: "戻[もど]り", te: { som: "mo.do.t.te", acento: 2, kana: "もどって", kanji: "戻[もど]って" }, ptGerundio: "retornando", dicio: { som: "mo.do.ru", acento: 2, kana: "もどる", kanji: "戻[もど]る" }, nai: { som: "mo.do.ra", kana: "もどら", kanji: "戻[もど]ら" }, ptPedido: "retorne", heiban: false },
  { dict: "aruku", sem: ["te_kudasai"], pt: "andar", ptPres: "ando", ptPret: "andei", vcPres: "anda", vcPret: "andou", raiz: ["a", "ru", "ki"], raizKana: "あるき", raizKanji: "歩[ある]き", te: { som: "a.ru.i.te", acento: 2, kana: "あるいて", kanji: "歩[ある]いて" }, ptGerundio: "andando", dicio: { som: "a.ru.ku", acento: 2, kana: "あるく", kanji: "歩[ある]く" }, nai: { som: "a.ru.ka", kana: "あるか", kanji: "歩[ある]か" }, ptPedido: "ande", heiban: false },
  {
    dict: "benkyou suru", sem: ["te_kudasai"],
    pt: "estudar", ptPres: "estudo", ptPret: "estudei", vcPres: "estuda", vcPret: "estudou",
    raiz: ["be", "n", "kyo", "o", "shi"],
    raizKana: "べんきょうし",
    raizKanji: "勉強[べんきょう]し",
    te: { som: "be.n.kyo.o._shi.te", acento: 0, kana: "べんきょうして", kanji: "勉強[べんきょう]して" }, ptGerundio: "estudando", dicio: { som: "be.n.kyo.o.su.ru", acento: 0, kana: "べんきょうする", kanji: "勉強[べんきょう]する" }, nai: { som: "be.n.kyo.o.shi", kana: "べんきょうし", kanji: "勉強[べんきょう]し" }, ptPedido: "estude", heiban: true,
  },
];

const junta = (...partes: (string | undefined)[]) => partes.filter(Boolean).join(" ");

export type Forma = "masu" | "mashita" | "masen" | "masen_deshita" | "tai" | "mashou" | "te_kudasai" | "te_imasu" | "koto" | "nakereba";

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
  te_kudasai: {
    pergunta: () => "Quer que eu ajude?",
    abertura: "Sim, por favor,",
    quando: "Pedir um favor a quem oferece ajuda",
    regra: "-masu → forma -te + kudasai",
    frase: (v, obj) => junta(v.ptPedido, obj),
    label: "Pedido",
    comando: "Peça!",
    sufixo: [],
    kana: "てください",
    funcao: "por favor (pedido)",
  },
  te_imasu: {
    pergunta: () => "O que você está fazendo agora?",
    abertura: "",
    quando: "Ação em andamento (agora)",
    regra: "-masu → forma -te + imasu",
    frase: (v, obj) => junta("eu estou", v.ptGerundio, obj),
    label: "Agora",
    comando: "Agora!",
    sufixo: [],
    kana: "ています",
    funcao: "está (em andamento)",
  },
  koto: {
    pergunta: () => "Qual é o seu hobby?",
    abertura: "",
    quando: "Falar do seu hobby",
    regra: "forma de dicionário + koto desu",
    frase: (v, obj) => junta("meu hobby é", v.pt, obj),
    label: "Hobby",
    comando: "Hobby!",
    sufixo: [],
    kana: "ことです",
    funcao: "o ato de",
  },
  nakereba: {
    pergunta: () => "O que você tem que fazer amanhã?",
    abertura: "",
    quando: "Dizer o que você tem que fazer",
    regra: "forma -nai: -nai → -nakereba narimasen",
    frase: (v, obj) => junta("eu tenho que", v.pt, obj),
    label: "Obrigação",
    comando: "Tenho que!",
    sufixo: [],
    kana: "なければなりません",
    funcao: "se não fizer",
  },
};

/** Pitch da forma -te pela mora da queda: 0 = plano (LHH…), 1 = cai depois da 1ª (HLL…), n = LH…H depois L. */
function pitchTe(n: number, acento: number): string {
  return Array.from({ length: n }, (_, i) =>
    acento === 0 ? (i === 0 ? "L" : "H") : acento === 1 ? (i === 0 ? "H" : "L") : i === 0 ? "L" : i < acento ? "H" : "L",
  ).join("");
}

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
 * - -te kudasai: a forma -te tem o acento do próprio verbo; depois de verbo com queda, "kudasai" fica todo baixo
 *   (káite kudasai); depois de verbo plano, sobe até "sa" (magatte kudasái). Conferido no OJAD.
 * - -te imasu: igual — depois de verbo com queda, "imasu" fica todo baixo (tábete imasu); depois de verbo plano,
 *   fica alto até "ma" (hataraite imása). Conferido no OJAD.
 * - koto desu (hobby): forma de dicionário com o acento do verbo; depois de verbo plano "koto" fica alto e cai
 *   antes de "desu" (kiku kotó desu); depois de queda na 1ª mora fica baixo (míru koto desu); depois de queda
 *   mais adiante sobe de novo (hanásu | kotó desu). Padrão da maioria das previsões do OJAD.
 * - -nakereba narimasen: verbo com queda cai na última mora da base, antes de "na" (kaká-nakereba); verbo plano
 *   cai depois do "na" (ikaná-kereba); "narimasen" sobe de novo e cai depois de "se". OJAD, 27 verbos.
 */
export function conjugar(verbo: Verbo, forma: Forma): Conjugacao {
  const raizBloco = verbo.raiz.join("");
  const raizFn = verbo.pt;
  const mora = (som: string, pitch: "H" | "L", bloco: string, funcao: string, papel: Mora["papel"], dev?: boolean): Mora =>
    dev ? { som, pitch, bloco, funcao, papel, devozeada: true } : { som, pitch, bloco, funcao, papel };

  if (forma === "te_kudasai" || forma === "te_imasu") {
    const te = verbo.te;
    const pede = forma === "te_kudasai";
    const moras = [
      ...b(te.som, pitchTe(te.som.split(".").length, te.acento), `${raizFn} (forma -te)`, "verbo"),
      ...(pede
        ? b("ku.da.sa.i", te.acento ? "LLLL" : "HHHL", FORMAS.te_kudasai.funcao, "verbo")
        : b("i.ma._su", te.acento ? "LLL" : "HHL", FORMAS.te_imasu.funcao, "verbo")),
    ];
    const fim = pede ? "ください" : "います";
    const kana = te.kana + fim;
    const kanji = te.kanji + fim;
    // na fala, "-te imasu" vira "-temasu" (o "i" some)
    const alvos = [kana, stripFurigana(kanji), te.kana, stripFurigana(te.kanji)];
    if (!pede) alvos.push(te.kana + "ます", stripFurigana(te.kanji) + "ます");
    return { verbo, forma, moras, kana, kanji, alvos };
  }

  if (forma === "nakereba") {
    const n = verbo.nai;
    const sons = n.som.split(".");
    const plano = verbo.dicio.acento === 0;
    // base: LHH… (ou H se tem uma mora só e a queda vem logo); "na" alto só no verbo plano
    const base = sons.map((_, i) => (i === 0 ? (sons.length === 1 && !plano ? "H" : "L") : "H")).join("");
    const moras = [
      ...b(`${n.som}.na.ke.re.ba`, `${base}${plano ? "H" : "L"}LLL`, `${raizFn} — se não…`, "verbo"),
      ...b("na.ri.ma.se.n", "LHHHL", "não dá", "verbo"),
    ];
    const kana = n.kana + "なければなりません";
    const kanji = n.kanji + "なければなりません";
    const plain = stripFurigana(n.kanji);
    return { verbo, forma, moras, kana, kanji, alvos: [kana, stripFurigana(kanji), n.kana + "なきゃ", plain + "なきゃ", n.kana + "ないと", plain + "ないと"] };
  }

  if (forma === "koto") {
    const d = verbo.dicio;
    const moras = [
      ...b(d.som, pitchTe(d.som.split(".").length, d.acento), `${raizFn} (forma de dicionário)`, "verbo"),
      ...b("ko.to", d.acento === 0 ? "HH" : d.acento === 1 ? "LL" : "LH", FORMAS.koto.funcao, "substantivo"),
      ...b("de._su", "LL", "é", "copula"),
    ];
    const kana = d.kana + "ことです";
    const kanji = d.kanji + "ことです";
    return { verbo, forma, moras, kana, kanji, alvos: [kana, stripFurigana(kanji), d.kana + "こと", stripFurigana(d.kanji) + "こと"] };
  }

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
    { verbo: "miru", obj: "um filme", ja: comp("えいがを", "映画[えいが]を", ["えいが", "映画"], b("e.i.ga", "LHH", "filme", "objeto"), o("H")) },
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

/**
 * Pedido (-te kudasai) responde a "Quer que eu ajude?": só vale para tarefas que alguém pode fazer por você
 * (escrever, enviar, comprar, pagar, esperar o cliente…). Lazer e deslocamentos pessoais ("veja televisão",
 * "pegue o táxi") ficam fora.
 */
const PEDIDOS_OK = new Set([
  "kaku|o e-mail", "yomu|os documentos", "hanasu|com o gerente", "au|o cliente", "iku|à reunião", "matsu|o cliente",
  "suru|o trabalho", "okuru|o e-mail", "yomu|o e-mail", "tsukuru|os documentos", "au|o gerente", "hajimeru|a reunião",
  "hajimeru|o trabalho", "okuru|os documentos ao cliente", "kaku|o relatório",
  "kau|um café", "suru|o pedido", "harau|a conta", "matsu|os amigos",
  "kau|roupas", "kau|um presente", "miru|o preço", "iku|à loja de departamentos", "kau|sapatos", "kau|um livro",
  "harau|com cartão", "iku|ao supermercado", "iku|ao konbini",
  "miru|o mapa", "kau|a passagem", "kau|uma lembrancinha",
]);
/** Hobby (koto desu) responde a "Qual é o seu hobby?": só lazer (ver filme, ouvir música, ir ao karaokê…). */
const HOBBIES_OK = new Set([
  "miru|um filme", "kiku|música", "yomu|um livro", "iku|ao karaokê", "iku|à praia", "miru|televisão",
  "hanasu|com os amigos", "au|os amigos", "taberu|com os amigos", "kau|roupas", "kau|sapatos", "kau|um livro",
  "taberu|sushi", "taberu|ramen", "iku|ao templo", "benkyou suru|japonês", "benkyou suru|inglês",
]);
/** Obrigação (-nakereba) responde a "O que você tem que fazer amanhã?": tarefas e compromissos. */
const OBRIGACOES_OK = new Set([
  "kaku|o e-mail", "yomu|os documentos", "hanasu|com o gerente", "au|o cliente", "iku|à reunião", "matsu|o cliente",
  "suru|o trabalho", "okuru|o e-mail", "tsukuru|os documentos", "au|o gerente", "iku|à empresa", "kaeru|cedo",
  "benkyou suru|japonês", "benkyou suru|inglês", "hajimeru|a reunião", "hajimeru|o trabalho", "modoru|ao escritório",
  "okuru|os documentos ao cliente", "kaku|o relatório", "hataraku|na empresa", "neru|cedo", "okiru|cedo",
  "harau|a conta", "iku|ao supermercado", "kau|um presente", "kau|a passagem", "iku|à estação", "noru|o trem",
]);
for (const cenas of Object.values(CENAS_DRILL))
  for (const c of cenas) {
    const chave = `${c.verbo}|${c.obj}`;
    if (!OBRIGACOES_OK.has(chave)) c.sem = [...(c.sem ?? []), "nakereba"];
    if (!PEDIDOS_OK.has(chave)) c.sem = [...(c.sem ?? []), "te_kudasai"];
    if (!HOBBIES_OK.has(chave)) c.sem = [...(c.sem ?? []), "koto"];
  }

/** A transformação combina com a situação (nem o verbo nem a cena a excluem). */
export const combina = (cena: CenaDrill, forma: Forma) => !verboPorDict(cena.verbo).sem?.includes(forma) && !cena.sem?.includes(forma);

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
const SHUMI_NAN_DESU_KA = [
  ...b("shu.mi", "HL", "hobby", "topico"),
  ...b("wa", "L", "[Tópico]", "particula"),
  ...b("na.n", "HL", "o quê", "pergunta"),
  ...b("de._su", "LL", "é", "copula"),
  ...b("ka", "L", "[?]", "particula"),
];
const ASHITA = { kana: "あした、", kanji: "明日[あした]、", moras: b("a._shi.ta", "LHH", "amanhã", "tempo") };
const IMA = { kana: "いま、", kanji: "今[いま]、", moras: b("i.ma", "HL", "agora", "tempo") };
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
 * - Pedido:            手伝いましょうか → はい、[complemento][verbo -te]ください
 * - Agora:             今、何をしていますか → [complemento][verbo -te]います
 * - Hobby:             趣味は何ですか → [complemento][forma de dicionário]ことです
 * - Obrigação:         明日、何をしなければなりませんか → [complemento][base -nai]なければなりません
 */
export function montarDialogo(cena: CenaDrill, forma: Forma): DialogoDrill {
  const v = verboPorDict(cena.verbo);
  const f = FORMAS[forma];
  const c = cena.ja;
  const suru = verboPorDict("suru");
  const fim = (t: string) => `${t}。`;

  let pergunta: FalaDrill;
  if (forma === "nakereba") {
    const q = conjugar(suru, "nakereba");
    pergunta = fala(fim(ASHITA.kana + NANI_O.kana + q.kana + "か"), fim(ASHITA.kanji + NANI_O.kanji + q.kanji + "か"), f.pergunta(v, cena.obj), ASHITA.moras, NANI_O.moras, q.moras, KA);
  } else if (forma === "koto") {
    pergunta = fala(fim("しゅみはなんですか"), fim("趣味[しゅみ]は何[なん]ですか"), f.pergunta(v, cena.obj), SHUMI_NAN_DESU_KA);
  } else if (forma === "te_imasu") {
    const q = conjugar(suru, "te_imasu");
    pergunta = fala(fim(IMA.kana + NANI_O.kana + q.kana + "か"), fim(IMA.kanji + NANI_O.kanji + q.kanji + "か"), f.pergunta(v, cena.obj), IMA.moras, NANI_O.moras, q.moras, KA);
  } else if (forma === "te_kudasai") {
    const q = conjugar(verboPorDict("tetsudau"), "mashou");
    pergunta = fala(fim(q.kana + "か"), fim(q.kanji + "か"), f.pergunta(v, cena.obj), q.moras, KA);
  } else if (forma === "tai" || forma === "mashou") {
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
  const inicio = forma === "mashita" || forma === "te_kudasai" ? HAI : forma === "masen" || forma === "masen_deshita" ? IIE : null;
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
