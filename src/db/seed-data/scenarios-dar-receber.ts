import { seedCards } from "./cards";
import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 29 (Dar e receber): o presente da Yuki, o pedido de ajuda ao colega e a foto em um ponto
 * turístico. Usam as frases de `cards-dar-receber.ts` como resposta-modelo. ★ nova = palavra nova.
 */

/** Uma frase do baralho como fala do parceiro. */
function fala(id: string) {
  const c = seedCards.find((x) => x.id === id)!;
  return line(`${c.kana}。`, `${c.kanji}。`, c.traducao, c.blocos);
}

const DESU = b("de._su", "LL", "é", "copula");
const KA = b("ka", "L", "[?]", "particula");
const YO = b("yo", "L", "[te conto]", "particula");
const II = b("i.i", "HL", "bom", "adjetivo");
const DOU_ITASHIMASHITE = line("いいえ、どういたしまして。", "いいえ、どういたしまして。", "Imagina, de nada. (fim)", [
  b("i.i.e", "LHH", "não", "expressao"),
  b("do.o.i.ta.shi.ma._shi.te", "HLLLLLLL", "de nada", "expressao"),
]);

export const cenariosDarReceber: SeedScenario[] = [
  // ───────────── Presente
  {
    id: "rp_dar_presente",
    titulo: "Um presente para você",
    categoria: "social",
    emoji: "🎁",
    parceiro: { nome: "Yuki · amiga", emoji: "👩" },
    missao_pt: "A Yuki traz um presente de aniversário. Agradeça, conte o que você ganhou de outras pessoas e o que sua mãe fez por você.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_306", "card_301", "card_310"],
    system_prompt_cenario: "Amiga entrega um presente de aniversário e pergunta o que você ganhou e o que sua família fez.",
    roteiro: [
      {
        ia: line("これ、どうぞ。プレゼントです。", "これ、どうぞ。プレゼントです。", "Isto é para você. É um presente.", [
          b("ko.re", "LH", "isto", "substantivo"),
          b("do.o.zo", "HLL", "aqui está", "expressao"),
          b("pu.re.ze.n.to", "LHLLL", "presente", "substantivo"),
          DESU,
        ]),
        dica_pt: "Agradeça e diga que vai cuidar bem.",
        chaves: ["ありがとう", "たいせつ", "大切"],
        exemplo_card: "card_306",
      },
      {
        ia: fala("card_303"),
        dica_pt: "Diga que ganhou um livro do Tanaka.",
        chaves: ["もらいました", "ほん", "本"],
        exemplo_card: "card_301",
      },
      {
        ia: line("ごかぞくはなにをくれましたか。", "ご家族[かぞく]は何[なに]をくれましたか。", "E a sua família, o que deu a você?", [
          b("go.ka.zo.ku", "LHLL", "sua família", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("na.ni", "HL", "o quê", "pergunta"),
          b("o", "L", "[Objeto]", "particula"),
          b("ku.re.ma._shi.ta", "LHHLL", "deu a você", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que sua mãe cozinhou para você.",
        chaves: ["つくって", "作って", "くれました"],
        exemplo_card: "card_310",
      },
      {
        ia: line("いいですね。", "いいですね。", "Que bom! (fim)", [II, DESU, b("ne", "L", "[né]", "particula")]),
      },
    ],
  },

  // ───────────── Ajuda no trabalho
  {
    id: "rp_dar_ajuda",
    titulo: "Pode me ajudar?",
    categoria: "trabalho",
    emoji: "🤝",
    parceiro: { nome: "Tanaka-san · colega", emoji: "🧑" },
    missao_pt: "Você precisa de ajuda com uma bagagem pesada. Peça a um colega, diga o que ele pode fazer e agradeça pela ajuda.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_314"],
    system_prompt_cenario: "Colega gentil pergunta o que houve, aceita ajudar a carregar a bagagem e responde ao agradecimento.",
    roteiro: [
      {
        ia: line("どうしましたか。", "どうしましたか。", "O que houve?", [
          b("do.o", "HL", "como", "pergunta"),
          b("_shi.ma._shi.ta", "LLLL", "fez", "verbo"),
          KA,
        ]),
        dica_pt: "Peça uma ajuda.",
        chaves: ["てつだって", "手伝って", "くれません"],
        exemplo_card: "card_314",
      },
      {
        ia: line("いいですよ。なにをしましょうか。", "いいですよ。何[なに]をしましょうか。", "Claro. O que eu faço?", [
          II,
          b("de.su", "LL", "é", "copula"),
          YO,
          b("na.ni", "HL", "o quê", "pergunta"),
          b("o", "L", "[Objeto]", "particula"),
          b("_shi.ma.sho.o", "LHHL", "vamos fazer", "verbo"),
          KA,
        ]),
        dica_pt: "Peça para ele carregar a bagagem.",
        chaves: ["にもつ", "荷物", "もって", "持って"],
        exemplo: line("にもつをもってくれませんか。", "荷物[にもつ]を持[も]ってくれませんか。", "Pode carregar a bagagem?", [
          b("ni.mo.tsu", "HLL", "bagagem", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("mo.t.te", "HLL", "carregar (forma -te)", "verbo"),
          b("ku.re.ma.se.n", "LHHHL", "não me dá", "verbo"),
          KA,
        ]),
      },
      {
        ia: line("はい、いいですよ。", "はい、いいですよ。", "Sim, claro.", [b("ha.i", "HL", "sim", "expressao"), II, b("de.su", "LL", "é", "copula"), YO]),
        dica_pt: "Agradeça por ele ter ajudado.",
        chaves: ["てつだって", "手伝って", "ありがとう"],
        exemplo: line("てつだってくれて、ありがとうございます。", "手伝[てつだ]ってくれて、ありがとうございます。", "Obrigado por me ajudar.", [
          b("te.tsu.da.t.te", "LHHLL", "ajudar (forma -te)", "verbo"),
          b("ku.re.te", "LLL", "me dar (forma -te)", "verbo"),
          b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
          b("go.za.i.ma._su", "LHHHL", "[forma educada]", "expressao"),
        ]),
      },
      { ia: DOU_ITASHIMASHITE },
    ],
  },

  // ───────────── Foto
  {
    id: "rp_dar_foto",
    titulo: "Pode tirar uma foto?",
    categoria: "cidade",
    emoji: "📸",
    parceiro: { nome: "Pessoa na rua", emoji: "🧑" },
    missao_pt: "Em um ponto turístico, peça a alguém que tire uma foto sua, confirme o lugar e agradeça.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_313"],
    system_prompt_cenario: "Pessoa gentil aceita tirar a foto, confirma o lugar e devolve o celular.",
    roteiro: [
      {
        ia: line("どうしましたか。", "どうしましたか。", "O que houve?", [
          b("do.o", "HL", "como", "pergunta"),
          b("_shi.ma._shi.ta", "LLLL", "fez", "verbo"),
          KA,
        ]),
        dica_pt: "Peça que tire uma foto sua.",
        chaves: ["しゃしん", "写真", "もらえます"],
        exemplo_card: "card_313",
      },
      {
        ia: line("はい、いいですよ。ここでいいですか。", "はい、いいですよ。ここでいいですか。", "Sim, claro. Aqui está bom?", [
          b("ha.i", "HL", "sim", "expressao"),
          II,
          b("de.su", "LL", "é", "copula"),
          YO,
          b("ko.ko", "LH", "aqui", "lugar"),
          b("de", "H", "[Local da ação]", "particula"),
          II,
          DESU,
          KA,
        ]),
        dica_pt: "Diga que sim, por favor.",
        chaves: ["おねがい", "お願い"],
        exemplo: line("はい、おねがいします。", "はい、お願[ねが]いします。", "Sim, por favor.", [
          b("ha.i", "HL", "sim", "expressao"),
          b("o.ne.ga.i.shi.ma._su", "LHHHHHL", "por favor", "expressao"),
        ]),
      },
      {
        ia: line("とりましたよ。", "撮[と]りましたよ。", "Pronto, tirei.", [b("to.ri.ma._shi.ta", "LHHLL", "tirei", "verbo"), YO]),
        dica_pt: "Agradeça.",
        chaves: ["ありがとう"],
        exemplo: line("ありがとうございました。", "ありがとうございました。", "Muito obrigado.", [
          b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
          b("go.za.i.ma._shi.ta", "LHHHLL", "[forma educada]", "expressao"),
        ]),
      },
      { ia: DOU_ITASHIMASHITE },
    ],
  },
];
