import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 9 (Números, horas e preços): café, correio e horário da loja.
 * Usam as frases de `cards-numeros.ts` como resposta-modelo. ★ nova = palavra nova.
 */

const obrigado = line("ありがとうございます。", "ありがとうございます。", "Obrigado.", [
  b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
  b("go.za.i.ma._su", "LHHHL", "[forma educada]", "expressao"),
]);

const obrigadoAtendente = line("ありがとうございました。", "ありがとうございました。", "Muito obrigado! (fim)", [
  b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
  b("go.za.i.ma._shi.ta", "LHHHLL", "[educado, pelo que já aconteceu]", "expressao"),
]);

const irasshaimase = b("i.ra.s.sha.i.ma.se", "LHHHHHL", "bem-vindo (loja)", "expressao");

export const cenariosNumeros: SeedScenario[] = [
  // ───────────── Café
  {
    id: "rp_num_cafe",
    titulo: "Café para três",
    categoria: "restaurante",
    emoji: "☕",
    parceiro: { nome: "Atendente do café", emoji: "🧑‍🍳" },
    missao_pt:
      "Você chega a um café com dois amigos. Diga quantas pessoas são, peça dois cafés e, na hora de pagar, pergunte quanto dá tudo e agradeça.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_060", "card_061", "card_057", "card_058", "card_059"],
    system_prompt_cenario:
      "Atendente de café: pergunta quantas pessoas, leva à mesa, anota o pedido e informa o total de 1.500 ienes.",
    roteiro: [
      {
        ia: line("いらっしゃいませ。なんめいさまですか。", "いらっしゃいませ。何名様[なんめいさま]ですか。", "Bem-vindos! Quantas pessoas?", [
          irasshaimase,
          b("na.n.me.i", "LHHL", "quantas pessoas (formal)", "pergunta"),
          b("sa.ma", "LL", "[respeito]", "pergunta"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que são três.",
        chaves: ["さんにん", "三人", "3人"],
        exemplo_card: "card_061",
      },
      {
        ia: line("こちらへどうぞ。ごちゅうもんは。", "こちらへどうぞ。ご注文[ちゅうもん]は。", "Por aqui. E o pedido? (nova: chuumon = pedido)", [
          b("ko.chi.ra", "LHH", "por aqui", "lugar"),
          b("e", "H", "[Direção →]", "particula"),
          b("do.o.zo", "HLL", "por favor (oferecendo)", "expressao"),
          b("go.chu.u.mo.n", "LHHHH", "o pedido ★ nova", "topico"),
          b("wa", "H", "[e quanto a…?]", "particula"),
        ]),
        dica_pt: "Peça dois cafés.",
        chaves: ["コーヒー", "ふたつ", "二つ"],
        exemplo_card: "card_057",
      },
      {
        ia: line("はい、かしこまりました。", "はい、かしこまりました。", "Certo, entendido.", [
          b("ha.i", "HL", "sim", "expressao"),
          b("ka._shi.ko.ma.ri.ma._shi.ta", "LHHHHHLL", "entendido (muito educado)", "expressao"),
        ]),
        dica_pt: "Depois do café, pergunte quanto dá tudo.",
        chaves: ["いくら", "ぜんぶ", "全部"],
        exemplo_card: "card_058",
      },
      {
        ia: line("せんごひゃくえんです。", "千五百円[せんごひゃくえん]です。", "São 1.500 ienes.", [
          b("se.n", "HL", "mil", "substantivo"),
          b("go.hya.ku.e.n", "LHHLL", "quinhentos ienes", "substantivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
        dica_pt: "Pague e agradeça.",
        chaves: ["ありがと"],
        exemplo: obrigado,
      },
      { ia: obrigadoAtendente },
    ],
  },

  // ───────────── Correio
  {
    id: "rp_num_correio",
    titulo: "Selos no correio",
    categoria: "compras",
    emoji: "📮",
    parceiro: { nome: "Atendente do correio", emoji: "🧑‍💼" },
    missao_pt: "Você vai ao correio mandar dois cartões. Peça dois selos, pergunte quanto dá e agradeça.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_062", "card_058"],
    system_prompt_cenario: "Atendente do correio: confirma dois selos e cobra 220 ienes.",
    roteiro: [
      {
        ia: line("いらっしゃいませ。", "いらっしゃいませ。", "Bem-vindo!", [irasshaimase]),
        dica_pt: "Peça dois selos.",
        chaves: ["きって", "切手", "にまい", "二枚"],
        exemplo_card: "card_062",
      },
      {
        ia: line("はい、にまいですね。", "はい、二枚[にまい]ですね。", "Certo, dois, não é?", [
          b("ha.i", "HL", "sim", "expressao"),
          b("ni.ma.i", "HLL", "duas folhas", "substantivo"),
          b("de._su", "LL", "é", "copula"),
          b("ne", "L", "[né]", "particula"),
        ]),
        dica_pt: "Pergunte quanto dá tudo.",
        chaves: ["いくら", "ぜんぶ", "全部"],
        exemplo_card: "card_058",
      },
      {
        ia: line("にひゃくにじゅうえんです。", "二百二十円[にひゃくにじゅうえん]です。", "São 220 ienes.", [
          b("ni.hya.ku", "LHH", "duzentos", "substantivo"),
          b("ni.ju.u.e.n", "LHLLL", "vinte ienes", "substantivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
        dica_pt: "Pague e agradeça.",
        chaves: ["ありがと"],
        exemplo: obrigado,
      },
      { ia: obrigadoAtendente },
    ],
  },

  // ───────────── Horário da loja
  {
    id: "rp_num_horario",
    titulo: "Que horas a loja abre?",
    categoria: "compras",
    emoji: "🕙",
    parceiro: { nome: "Vendedor", emoji: "🧑" },
    missao_pt:
      "Você quer voltar a uma loja outro dia. Pergunte o horário de funcionamento, entenda o dia de folga e agradeça.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_063", "card_064"],
    system_prompt_cenario: "Vendedor: diz que a loja abre das 10 às 8 e fecha aos domingos.",
    roteiro: [
      {
        ia: line("いらっしゃいませ。", "いらっしゃいませ。", "Bem-vindo!", [irasshaimase]),
        dica_pt: "Pergunte de que horas a que horas a loja abre.",
        chaves: ["なんじ", "何時", "まで"],
        exemplo_card: "card_063",
      },
      {
        ia: line("じゅうじからはちじまでです。", "十時[じゅうじ]から八時[はちじ]までです。", "Das 10 às 8.", [
          b("ju.u.ji", "HLL", "dez horas", "tempo"),
          b("ka.ra", "LL", "a partir de", "particula"),
          b("ha.chi.ji", "LHL", "oito horas", "tempo"),
          b("ma.de", "LL", "[até]", "particula"),
          b("de._su", "LL", "é", "copula"),
        ]),
        dica_pt: "Diga que entendeu.",
        chaves: ["わかり", "分かり"],
        exemplo: line("わかりました。", "わかりました。", "Entendi.", [b("wa.ka.ri.ma._shi.ta", "LHHHLL", "entendi", "verbo")]),
      },
      {
        ia: line("やすみはにちようびです。", "休[やす]みは日曜日[にちようび]です。", "A folga é domingo. (nova: yasumi = folga)", [
          b("ya.su.mi", "LHH", "folga, descanso ★ nova", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("ni.chi.yo.o.bi", "LHHLL", "domingo ★ nova", "tempo"),
          b("de._su", "LL", "é", "copula"),
        ]),
        dica_pt: "Agradeça.",
        chaves: ["ありがと"],
        exemplo: obrigado,
      },
      {
        ia: line("またどうぞ。", "またどうぞ。", "Volte sempre! (fim)", [
          b("ma.ta", "LH", "de novo", "adverbio"),
          b("do.o.zo", "HLL", "por favor (venha)", "expressao"),
        ]),
      },
    ],
  },
];
