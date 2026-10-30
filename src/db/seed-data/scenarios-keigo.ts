import { seedCards } from "./cards";
import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 33 (Keigo no trabalho): a visita a uma empresa, a apresentação a um cliente e o pedido de folga
 * ao chefe. Usam as frases de `cards-keigo.ts` como resposta-modelo. ★ nova = palavra nova.
 */

/** Uma frase do baralho como fala do parceiro. */
function fala(id: string) {
  const c = seedCards.find((x) => x.id === id)!;
  return line(`${c.kana}。`, `${c.kanji}。`, c.traducao, c.blocos);
}

const KA = b("ka", "L", "[?]", "particula");
const WAKARIMASHITA = b("wa.ka.ri.ma._shi.ta", "LHHHLL", "entendi", "verbo");
const YOROSHIKU = b("yo.ro._shi.ku", "LHHH", "conto com você", "expressao");
const ONEGAI_ITASHIMASU = b("o.ne.ga.i.i.ta._shi.ma._su", "LHHHHHHHL", "peço (humilde)", "expressao");

export const cenariosKeigo: SeedScenario[] = [
  // ───────────── Visita
  {
    id: "rp_kei_recepcao",
    titulo: "Na recepção da empresa",
    categoria: "trabalho",
    emoji: "🏢",
    parceiro: { nome: "Recepcionista", emoji: "🧑‍💼" },
    missao_pt: "Você chegou para uma reunião em outra empresa. Identifique-se, pergunte pelo gerente e agradeça quando for levado à sala. Use keigo.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_398"],
    system_prompt_cenario: "Recepcionista formal pede para aguardar, leva o visitante à sala e avisa que o gerente já vem.",
    roteiro: [
      {
        ia: line("いらっしゃいませ。", "いらっしゃいませ。", "Seja bem-vindo!", [b("i.ra.s.sha.i.ma.se", "LHHHHHL", "seja bem-vindo", "expressao")]),
        dica_pt: "Identifique-se e pergunte se o gerente está.",
        chaves: ["もうします", "申します", "いらっしゃいますか"],
        exemplo_card: "card_398",
      },
      {
        ia: fala("card_357"),
        dica_pt: "Diga que entendeu.",
        chaves: ["はい", "わかり"],
        exemplo: line("はい、わかりました。", "はい、わかりました。", "Sim, entendi.", [b("ha.i", "HL", "sim", "expressao"), WAKARIMASHITA]),
      },
      {
        ia: line("こちらへどうぞ。おかけください。", "こちらへどうぞ。お掛[か]けください。", "Por aqui, por favor. Sente-se.", [
          b("ko.chi.ra", "LHH", "este lado", "lugar"),
          b("e", "H", "[direção]", "particula"),
          b("do.o.zo", "HLL", "por favor", "expressao"),
          b("o.ka.ke", "LHH", "sentar (respeito)", "verbo"),
          b("ku.da.sa.i", "HHHL", "por favor", "verbo"),
        ]),
        dica_pt: "Agradeça.",
        chaves: ["ありがとう"],
        exemplo: line("ありがとうございます。", "ありがとうございます。", "Obrigado.", [
          b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
          b("go.za.i.ma._su", "LHHHL", "[forma educada]", "expressao"),
        ]),
      },
      {
        ia: line("ぶちょうはすぐまいります。", "部長[ぶちょう]はすぐ参[まい]ります。", "O gerente já vem. (fim)", [
          b("bu.cho.o", "LHH", "gerente", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("su.gu", "HL", "logo, já", "adverbio"),
          b("ma.i.ri.ma._su", "LLLLL", "vem (humilde)", "verbo"),
        ]),
      },
    ],
  },

  // ───────────── Apresentação
  {
    id: "rp_kei_apresentacao",
    titulo: "Prazer em conhecer",
    categoria: "trabalho",
    emoji: "💼",
    parceiro: { nome: "Yamada-san · cliente", emoji: "🧑‍💼" },
    missao_pt: "Em um primeiro encontro de negócios, apresente-se, diga de onde veio, retribua o cumprimento e confirme a visita de amanhã.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_387", "card_386", "card_392"],
    system_prompt_cenario: "Cliente formal se apresenta, pergunta de onde você veio e confirma a visita de amanhã.",
    roteiro: [
      {
        ia: line("はじめまして。やまだです。", "はじめまして。山田[やまだ]です。", "Muito prazer. Sou o Yamada.", [
          b("ha.ji.me.ma._shi.te", "LHHHLL", "muito prazer", "expressao"),
          b("ya.ma.da", "LHH", "Yamada", "substantivo"),
          b("de._su", "HL", "é", "copula"),
        ]),
        dica_pt: "Responda e diga seu nome em forma humilde.",
        chaves: ["もうします", "申します"],
        exemplo: line("はじめまして。シルバともうします。", "はじめまして。シルバと申[もう]します。", "Muito prazer. Chamo-me Silva.", [
          b("ha.ji.me.ma._shi.te", "LHHHLL", "muito prazer", "expressao"),
          b("shi.ru.ba", "HLL", "Silva", "substantivo"),
          b("to", "L", "[citação: que…]", "particula"),
          b("mo.o._shi.ma._su", "LHHHL", "digo (humilde)", "verbo"),
        ]),
      },
      {
        ia: line("どちらからいらっしゃいましたか。", "どちらからいらっしゃいましたか。", "De onde o senhor veio?", [
          b("do.chi.ra", "HLL", "qual, onde (educado)", "pergunta"),
          b("ka.ra", "LL", "a partir de", "particula"),
          b("i.ra.s.sha.i.ma._shi.ta", "LHHHHHLL", "veio (respeito)", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que veio do Brasil.",
        chaves: ["ブラジル", "まいりました", "参りました"],
        exemplo_card: "card_386",
      },
      {
        ia: line("どうぞよろしくおねがいいたします。", "どうぞよろしくお願[ねが]いいたします。", "Muito prazer, conto com você.", [
          b("do.o.zo", "HLL", "por favor", "expressao"),
          YOROSHIKU,
          ONEGAI_ITASHIMASU,
        ]),
        dica_pt: "Retribua: eu que digo.",
        chaves: ["こちらこそ"],
        exemplo: line("こちらこそ、よろしくおねがいいたします。", "こちらこそ、よろしくお願[ねが]いいたします。", "Eu é que agradeço, conto com você. (nova: kochira koso = eu é que)", [
          b("ko.chi.ra.ko.so", "LHHHL", "eu é que ★ nova", "expressao"),
          YOROSHIKU,
          ONEGAI_ITASHIMASU,
        ]),
      },
      {
        ia: line("あした、いらっしゃいますか。", "明日[あした]、いらっしゃいますか。", "O senhor vem amanhã?", [
          b("a._shi.ta", "LHH", "amanhã", "tempo"),
          b("i.ra.s.sha.i.ma._su", "LHHHHHL", "vem (respeito)", "verbo"),
          KA,
        ]),
        dica_pt: "Confirme que irá amanhã.",
        chaves: ["うかがいます", "伺います"],
        exemplo_card: "card_392",
      },
      {
        ia: line("おまちしています。", "お待[ま]ちしています。", "Estarei esperando. (fim)", [
          b("o.ma._chi", "LHH", "esperar (humilde)", "verbo"),
          b("_shi.te", "HH", "fazendo (forma -te)", "verbo"),
          b("i.ma._su", "HHL", "estou", "verbo"),
        ]),
      },
    ],
  },

  // ───────────── Folga
  {
    id: "rp_kei_folga",
    titulo: "Pedir folga ao chefe",
    categoria: "trabalho",
    emoji: "🗓️",
    parceiro: { nome: "Kobayashi-kachō · chefe", emoji: "👔" },
    missao_pt: "Peça ao chefe para folgar amanhã, diga que vai enviar os documentos antes e despeça-se da forma certa ao sair.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_396", "card_389", "card_394"],
    system_prompt_cenario: "Chefe aceita a folga, pergunta sobre os documentos e se despede.",
    roteiro: [
      {
        ia: line("どうしましたか。", "どうしましたか。", "O que houve?", [
          b("do.o", "HL", "como", "pergunta"),
          b("_shi.ma._shi.ta", "LLLL", "fez", "verbo"),
          KA,
        ]),
        dica_pt: "Peça com muita educação para folgar amanhã.",
        chaves: ["やすませて", "休ませて", "いただきたい"],
        exemplo_card: "card_396",
      },
      {
        ia: line("わかりました。しりょうはどうしますか。", "わかりました。資料[しりょう]はどうしますか。", "Entendi. E os documentos?", [
          WAKARIMASHITA,
          b("shi.ryo.o", "HLL", "documentos", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("do.o", "HL", "como", "pergunta"),
          b("_shi.ma._su", "LLL", "faz", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que vai enviar.",
        chaves: ["おおくり", "お送り"],
        exemplo_card: "card_389",
      },
      {
        ia: line("はい、おねがいします。", "はい、お願[ねが]いします。", "Sim, por favor.", [
          b("ha.i", "HL", "sim", "expressao"),
          b("o.ne.ga.i.shi.ma._su", "LHHHHHL", "por favor", "expressao"),
        ]),
        dica_pt: "Despeça-se ao sair antes dos colegas.",
        chaves: ["しつれい", "失礼"],
        exemplo_card: "card_394",
      },
      { ia: { ...fala("card_395"), pt: "Bom trabalho, até mais. (fim)" } },
    ],
  },
];
