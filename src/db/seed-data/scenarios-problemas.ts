import { seedCards } from "./cards";
import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 32 (Problemas e reclamações): o telefonema para a recepção (marco do mês 8), a troca na loja e
 * o prato errado. Usam as frases de `cards-problemas.ts` como resposta-modelo. ★ nova = palavra nova.
 */

/** Uma frase do baralho como fala do parceiro. */
function fala(id: string) {
  const c = seedCards.find((x) => x.id === id)!;
  return line(`${c.kana}。`, `${c.kanji}。`, c.traducao, c.blocos);
}

const DESU = b("de._su", "LL", "é", "copula");
const KA = b("ka", "L", "[?]", "particula");
const MOUSHIWAKE = [b("mo.o._shi.wa.ke", "LHHHH", "justificativa", "expressao"), b("a.ri.ma.se.n", "HHHHL", "não tenho", "expressao")];

export const cenariosProblemas: SeedScenario[] = [
  // ───────────── Telefone (marco do mês 8)
  {
    id: "rp_pro_telefone",
    titulo: "Ligando para a recepção",
    categoria: "cidade",
    emoji: "☎️",
    parceiro: { nome: "Recepção do hotel", emoji: "🧑‍💼" },
    missao_pt:
      "O marco do mês 8: resolver um problema por telefone. O ar-condicionado do quarto não liga. Explique o problema, dê o número do quarto, diga desde quando está assim e peça que venham consertar.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_368", "card_375"],
    system_prompt_cenario: "Recepcionista ao telefone pede o número do quarto, pergunta desde quando há o problema e manda alguém consertar.",
    roteiro: [
      {
        ia: line("おでんわありがとうございます。フロントです。", "お電話[でんわ]ありがとうございます。フロントです。", "Obrigada por ligar. Aqui é a recepção. (nova: furonto = recepção)", [
          b("o.de.n.wa", "LHHH", "telefonema", "substantivo"),
          b("a.ri.ga.to.o", "HHLLL", "obrigado", "expressao"),
          b("go.za.i.ma._su", "LHHHL", "[forma educada]", "expressao"),
          b("fu.ro.n.to", "LHHH", "recepção ★ nova", "substantivo"),
          b("de._su", "HL", "é", "copula"),
        ]),
        dica_pt: "Diga que o ar-condicionado não liga.",
        chaves: ["エアコン", "つかない"],
        exemplo_card: "card_368",
      },
      {
        ia: line("もうしわけありません。おへやはなんばんですか。", "申[もう]し訳[わけ]ありません。お部屋[へや]は何番[なんばん]ですか。", "Sinto muito. Qual é o número do quarto?", [
          ...MOUSHIWAKE,
          b("o.he.ya", "LHH", "quarto", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("na.n.ba.n", "LHHL", "que número", "pergunta"),
          DESU,
          KA,
        ]),
        dica_pt: "Diga: 305.",
        chaves: ["さんびゃくご", "三百五"],
        exemplo: line("さんびゃくごです。", "三百五[さんびゃくご]です。", "É o 305.", [b("sa.n.bya.ku.go", "HLLLH", "305", "substantivo"), DESU]),
      },
      {
        ia: line("いつからですか。", "いつからですか。", "Desde quando?", [
          b("i.tsu", "HL", "quando", "pergunta"),
          b("ka.ra", "LL", "a partir de", "particula"),
          DESU,
          KA,
        ]),
        dica_pt: "Diga: desde ontem.",
        chaves: ["きのう", "昨日"],
        exemplo: line("きのうからです。", "昨日[きのう]からです。", "Desde ontem.", [
          b("ki.no.o", "LHL", "ontem", "tempo"),
          b("ka.ra", "LL", "a partir de", "particula"),
          DESU,
        ]),
      },
      { ia: fala("card_378"), dica_pt: "Peça que venham consertar.", chaves: ["しゅうり", "修理"], exemplo_card: "card_375" },
      {
        ia: line("はい、いまからいきます。", "はい、今[いま]から行[い]きます。", "Sim, estamos indo agora. (fim)", [
          b("ha.i", "HL", "sim", "expressao"),
          b("i.ma", "HL", "agora", "tempo"),
          b("ka.ra", "LL", "a partir de", "particula"),
          b("i.ki.ma._su", "LHHL", "vamos", "verbo"),
        ]),
      },
    ],
  },

  // ───────────── Troca na loja
  {
    id: "rp_pro_loja",
    titulo: "Trocar na loja",
    categoria: "compras",
    emoji: "🧾",
    parceiro: { nome: "Vendedora", emoji: "🧑‍💼" },
    missao_pt: "A roupa que você comprou não serviu. Explique o problema, mostre o recibo e peça a troca com educação.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_371", "card_372"],
    system_prompt_cenario: "Vendedora pede o recibo, desculpa-se e faz a troca.",
    roteiro: [
      {
        ia: line("いらっしゃいませ。", "いらっしゃいませ。", "Seja bem-vindo!", [b("i.ra.s.sha.i.ma.se", "LHHHHHL", "seja bem-vindo", "expressao")]),
        dica_pt: "Diga que o tamanho está errado.",
        chaves: ["サイズ", "ちがいます", "違います"],
        exemplo_card: "card_371",
      },
      {
        ia: line("レシートはありますか。", "レシートはありますか。", "Você tem o recibo? (nova: reshiito = recibo)", [
          b("re.shi.i.to", "LHLL", "recibo ★ nova", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("a.ri.ma._su", "LHHL", "existe", "verbo"),
          KA,
        ]),
        dica_pt: "Entregue: aqui está.",
        chaves: ["どうぞ"],
        exemplo: line("はい、どうぞ。", "はい、どうぞ。", "Sim, aqui está.", [b("ha.i", "HL", "sim", "expressao"), b("do.o.zo", "HLL", "aqui está", "expressao")]),
      },
      { ia: fala("card_377"), dica_pt: "Peça a troca.", chaves: ["こうかん", "交換"], exemplo_card: "card_372" },
      {
        ia: line("すぐこうかんします。", "すぐ交換[こうかん]します。", "Vou trocar agora mesmo. (fim)", [
          b("su.gu", "HL", "logo, já", "adverbio"),
          b("ko.o.ka.n", "LHHH", "troca", "substantivo"),
          b("_shi.ma._su", "HHL", "faço", "verbo"),
        ]),
      },
    ],
  },

  // ───────────── Prato errado
  {
    id: "rp_pro_restaurante",
    titulo: "Não foi isso que pedi",
    categoria: "restaurante",
    emoji: "🍲",
    parceiro: { nome: "Garçonete", emoji: "🧑‍🍳" },
    missao_pt: "Chegou um prato que você não pediu. Avise a garçonete com calma e diga o que tinha pedido.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_370"],
    system_prompt_cenario: "Garçonete atende o chamado, desculpa-se, pergunta o que foi pedido e vai verificar.",
    roteiro: [
      {
        ia: line("なんでしょうか。", "何[なん]でしょうか。", "Pois não?", [
          b("na.n", "HL", "o quê", "pergunta"),
          b("de.sho.o", "LLL", "deve ser", "copula"),
          KA,
        ]),
        dica_pt: "Diga que isto você não pediu.",
        chaves: ["ちゅうもん", "注文", "していません"],
        exemplo_card: "card_370",
      },
      {
        ia: line("もうしわけありません。なにをちゅうもんしましたか。", "申[もう]し訳[わけ]ありません。何[なに]を注文[ちゅうもん]しましたか。", "Sinto muito. O que você pediu?", [
          ...MOUSHIWAKE,
          b("na.ni", "HL", "o quê", "pergunta"),
          b("o", "L", "[Objeto]", "particula"),
          b("chu.u.mo.n", "LHHH", "pedido", "substantivo"),
          b("_shi.ma._shi.ta", "HHLL", "fez", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que pediu ramen.",
        chaves: ["ラーメン", "ちゅうもん", "注文"],
        exemplo: line("ラーメンをちゅうもんしました。", "ラーメンを注文[ちゅうもん]しました。", "Pedi ramen.", [
          b("ra.a.me.n", "HLLL", "ramen", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("chu.u.mo.n", "LHHH", "pedido", "substantivo"),
          b("_shi.ma._shi.ta", "HHLL", "fiz", "verbo"),
        ]),
      },
      { ia: { ...fala("card_378"), pt: "Vou verificar agora mesmo. (fim)" } },
    ],
  },
];
