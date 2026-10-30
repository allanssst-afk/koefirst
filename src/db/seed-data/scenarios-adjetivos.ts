import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 12 (Como é?): contar a viagem, escolher onde comer e falar do chefe novo.
 * Usam as frases de `cards-adjetivos.ts` como resposta-modelo. ★ nova = palavra nova.
 */

export const cenariosAdjetivos: SeedScenario[] = [
  // ───────────── Volta de viagem
  {
    id: "rp_adj_viagem",
    titulo: "Como foi a viagem?",
    categoria: "social",
    emoji: "🧳",
    parceiro: { nome: "Yamada-san · colega", emoji: "👩‍💼" },
    missao_pt:
      "Você voltou de uma viagem. Conte à colega que foi muito boa, que fez muito calor e que o quarto do hotel não era grande.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_098", "card_099", "card_093", "card_100"],
    system_prompt_cenario: "Colega curiosa pergunta como foi a viagem, o tempo e o hotel.",
    roteiro: [
      {
        ia: line("りょこうはどうでしたか。", "旅行[りょこう]はどうでしたか。", "Como foi a viagem? (nova: ryokou = viagem)", [
          b("ryo.ko.o", "LHH", "viagem ★ nova", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("do.o", "HL", "como", "pergunta"),
          b("de._shi.ta", "LLL", "foi", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que foi muito bom.",
        chaves: ["よかった", "良かった"],
        exemplo_card: "card_099",
      },
      {
        ia: line("てんきはどうでしたか。", "天気[てんき]はどうでしたか。", "Como estava o tempo? (nova: tenki = tempo, clima)", [
          b("te.n.ki", "HLL", "tempo, clima ★ nova", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("do.o", "HL", "como", "pergunta"),
          b("de._shi.ta", "LLL", "foi", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que ontem fez muito calor.",
        chaves: ["あつかった", "暑かった"],
        exemplo_card: "card_093",
      },
      {
        ia: line("ホテルはどうでしたか。", "ホテルはどうでしたか。", "E o hotel, como foi?", [
          b("ho.te.ru", "HLL", "hotel", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("do.o", "HL", "como", "pergunta"),
          b("de._shi.ta", "LLL", "foi", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que o quarto não era grande.",
        chaves: ["ひろくなかった", "広くなかった", "へや", "部屋"],
        exemplo_card: "card_100",
      },
      {
        ia: line("そうですか。ざんねんでしたね。", "そうですか。残念[ざんねん]でしたね。", "Ah, é? Que pena! (fim)", [
          b("so.o", "HL", "assim", "expressao"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
          b("za.n.ne.n", "LHHL", "que pena", "adjetivo"),
          b("de._shi.ta", "LLL", "foi", "copula"),
          b("ne", "L", "[né]", "particula"),
        ]),
      },
    ],
  },

  // ───────────── Onde comer
  {
    id: "rp_adj_ramen",
    titulo: "Vamos comer ramen?",
    categoria: "restaurante",
    emoji: "🍜",
    parceiro: { nome: "Kenji · amigo", emoji: "🧑" },
    missao_pt: "Um amigo quer escolher onde almoçar. Indique a casa de ramen: diga que é muito gostosa e não muito cara.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_091", "card_097"],
    system_prompt_cenario: "Amigo indeciso: pergunta o que você acha da casa de ramen e se é cara.",
    roteiro: [
      {
        ia: line("このラーメンや、どうですか。", "このラーメン屋[や]、どうですか。", "O que acha desta casa de ramen?", [
          b("ko.no", "LH", "esta", "topico"),
          b("ra.a.me.n.ya", "HLLLL", "casa de ramen", "topico"),
          b("do.o", "HL", "como", "pergunta"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que o ramen daqui é muito gostoso.",
        chaves: ["おいしい", "美味しい"],
        exemplo_card: "card_091",
      },
      {
        ia: line("たかいですか。", "高[たか]いですか。", "É caro?", [
          b("ta.ka.i", "LHL", "caro", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que não é muito caro.",
        chaves: ["たかくない", "高くない"],
        exemplo_card: "card_097",
      },
      {
        ia: line("じゃあ、ここにしましょう。", "じゃあ、ここにしましょう。", "Então vamos de aqui. (fim)", [
          b("ja.a", "HL", "então", "expressao"),
          b("ko.ko", "LH", "aqui", "lugar"),
          b("ni", "H", "[escolha →]", "particula"),
          b("shi.ma.sho.o", "LHHL", "vamos fazer (decidir)", "verbo"),
        ]),
      },
    ],
  },

  // ───────────── Chefe novo
  {
    id: "rp_adj_chefe",
    titulo: "O diretor novo",
    categoria: "trabalho",
    emoji: "👔",
    parceiro: { nome: "Suzuki-san · colega", emoji: "🧑‍💻" },
    missao_pt: "Um colega conheceu o diretor novo. Pergunte que tipo de pessoa ele é e reaja à resposta.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_102", "card_023"],
    system_prompt_cenario: "Colega conta que conheceu o diretor novo: é gentil, mas um pouco rigoroso.",
    roteiro: [
      {
        ia: line("あたらしいぶちょうにあいましたよ。", "新[あたら]しい部長[ぶちょう]に会[あ]いましたよ。", "Conheci o diretor novo! (nova: atarashii = novo)", [
          b("a.ta.ra._shi.i", "LHHHL", "novo ★ nova", "adjetivo"),
          b("bu.cho.o", "LHH", "diretor", "substantivo"),
          b("ni", "H", "[com quem]", "particula"),
          b("a.i.ma._shi.ta", "LHHLL", "encontrei", "verbo"),
          b("yo", "L", "[te informo]", "particula"),
        ]),
        dica_pt: "Pergunte que tipo de pessoa ele é.",
        chaves: ["どんな"],
        exemplo_card: "card_102",
      },
      {
        ia: line("とてもやさしいひとです。", "とても優[やさ]しい人[ひと]です。", "É uma pessoa muito gentil. (nova: yasashii = gentil)", [
          b("to.te.mo", "LHH", "muito", "adverbio"),
          b("ya.sa._shi.i", "LHHH", "gentil ★ nova", "adjetivo"),
          b("_hi.to", "HH", "pessoa", "substantivo"),
          b("de._su", "HL", "é", "copula"),
        ]),
        dica_pt: "Diga: que bom!",
        chaves: ["いい"],
        exemplo_card: "card_023",
      },
      {
        ia: line("でも、ちょっときびしいです。", "でも、ちょっと厳[きび]しいです。", "Mas é um pouco rigoroso. (nova: kibishii = rigoroso) (fim)", [
          b("de.mo", "HL", "mas", "expressao"),
          b("cho.t.to", "HLL", "um pouco", "adverbio"),
          b("ki.bi._shi.i", "LHHL", "rigoroso ★ nova", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
      },
    ],
  },
];
