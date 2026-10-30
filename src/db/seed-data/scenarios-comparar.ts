import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 23 (Comparar e escolher): a loja de sapatos, o almoço e a conversa sobre Brasil e Japão.
 * Usam as frases de `cards-comparar.ts` como resposta-modelo. ★ nova = palavra nova.
 */

const GA = b("ga", "L", "[Foco / sujeito]", "particula");
const DESU = b("de._su", "LL", "é", "copula");
const KA = b("ka", "L", "[?]", "particula");
const YO = b("yo", "L", "[te conto]", "particula");
const ICHIBAN = b("i.chi.ba.n", "LHHH", "o mais (número um)", "adverbio");
const DOCHIRA = b("do.chi.ra", "HLL", "qual dos dois", "pergunta");
const II = b("i.i", "HL", "bom", "adjetivo");
const ATSUI = b("a.tsu.i", "LHL", "quente (clima)", "adjetivo");

export const cenariosComparar: SeedScenario[] = [
  // ───────────── Loja de sapatos
  {
    id: "rp_cmp_loja",
    titulo: "Qual é o mais barato?",
    categoria: "compras",
    emoji: "👟",
    parceiro: { nome: "Vendedora", emoji: "🧑‍💼" },
    missao_pt: "Na loja de sapatos, diga que a cor tanto faz, pergunte qual é o par mais barato e escolha.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_222", "card_228"],
    system_prompt_cenario: "Vendedora pergunta a cor, mostra sapatos e indica o par mais barato.",
    roteiro: [
      {
        ia: line("しろとくろと、どちらがいいですか。", "白[しろ]と黒[くろ]と、どちらがいいですか。", "Branco ou preto, qual você prefere? (novas: shiro = branco, kuro = preto)", [
          b("shi.ro", "HL", "branco ★ nova", "substantivo"),
          b("to", "L", "[e]", "particula"),
          b("ku.ro", "HL", "preto ★ nova", "substantivo"),
          b("to", "L", "[e]", "particula"),
          DOCHIRA,
          GA,
          II,
          DESU,
          KA,
        ]),
        dica_pt: "Diga que tanto faz.",
        chaves: ["どちらでも", "いいです"],
        exemplo_card: "card_222",
      },
      {
        ia: line("このくつはどうですか。", "この靴[くつ]はどうですか。", "Que tal estes sapatos?", [
          b("ko.no", "LH", "este", "substantivo"),
          b("ku.tsu", "HH", "sapatos", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("do.o", "HL", "como", "pergunta"),
          DESU,
          KA,
        ]),
        dica_pt: "Pergunte qual é o mais barato.",
        chaves: ["どれが", "いちばん", "一番", "やすい", "安い"],
        exemplo: line("どれがいちばんやすいですか。", "どれが一番[いちばん]安[やす]いですか。", "Qual é o mais barato?", [
          b("do.re", "HL", "qual (de vários)", "pergunta"),
          GA,
          ICHIBAN,
          b("ya.su.i", "LHL", "barato", "adjetivo"),
          DESU,
          KA,
        ]),
      },
      {
        ia: line("これがいちばんやすいです。", "これが一番[いちばん]安[やす]いです。", "Este é o mais barato.", [
          b("ko.re", "LH", "isto", "sujeito"),
          b("ga", "H", "[Foco / sujeito]", "particula"),
          ICHIBAN,
          b("ya.su.i", "LHL", "barato", "adjetivo"),
          DESU,
        ]),
        dica_pt: "Diga que vai ficar com ele.",
        chaves: ["これに", "します"],
        exemplo_card: "card_228",
      },
      {
        ia: line("ありがとうございました。", "ありがとうございました。", "Muito obrigada! (fim)", [
          b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
          b("go.za.i.ma._shi.ta", "LHHHLL", "[forma educada]", "expressao"),
        ]),
      },
    ],
  },

  // ───────────── Almoço
  {
    id: "rp_cmp_almoco",
    titulo: "Carne ou peixe?",
    categoria: "restaurante",
    emoji: "🍱",
    parceiro: { nome: "Garçonete", emoji: "🧑‍🍳" },
    missao_pt: "No almoço, escolha entre carne e peixe, depois a bebida, e peça que a garçonete indique a melhor sobremesa.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_214", "card_215", "card_226", "card_228"],
    system_prompt_cenario: "Garçonete oferece carne ou peixe, bebida e sobremesa, e indica a sobremesa mais gostosa.",
    roteiro: [
      {
        ia: line("にくとさかなと、どちらがいいですか。", "肉[にく]と魚[さかな]と、どちらがいいですか。", "Carne ou peixe, o que prefere?", [
          b("ni.ku", "LH", "carne", "substantivo"),
          b("to", "L", "[e]", "particula"),
          b("sa.ka.na", "LHH", "peixe", "substantivo"),
          b("to", "H", "[e]", "particula"),
          DOCHIRA,
          GA,
          II,
          DESU,
          KA,
        ]),
        dica_pt: "Escolha o peixe.",
        chaves: ["さかな", "魚", "ほう"],
        exemplo: line("さかなのほうがいいです。", "魚[さかな]のほうがいいです。", "Prefiro peixe.", [
          b("sa.ka.na", "LHH", "peixe", "substantivo"),
          b("no", "H", "[de]", "particula"),
          b("ho.o", "HL", "lado, direção", "substantivo"),
          GA,
          II,
          DESU,
        ]),
      },
      {
        ia: line("コーヒーとこうちゃと、どちらがすきですか。", "コーヒーと紅茶[こうちゃ]と、どちらが好[す]きですか。", "Você prefere café ou chá?", [
          b("ko.o.hi.i", "LHHL", "café", "substantivo"),
          b("to", "L", "[e]", "particula"),
          b("ko.o.cha", "LHH", "chá preto", "substantivo"),
          b("to", "H", "[e]", "particula"),
          DOCHIRA,
          GA,
          b("_su.ki", "LH", "gostado", "adjetivo"),
          DESU,
          KA,
        ]),
        dica_pt: "Diga que prefere chá.",
        chaves: ["こうちゃ", "紅茶"],
        exemplo_card: "card_215",
      },
      {
        ia: line("デザートもありますよ。", "デザートもありますよ。", "Também temos sobremesa. (nova: dezaato = sobremesa)", [
          b("de.za.a.to", "LHLL", "sobremesa ★ nova", "topico"),
          b("mo", "L", "[também]", "particula"),
          b("a.ri.ma._su", "LHHL", "existe", "verbo"),
          YO,
        ]),
        dica_pt: "Pergunte qual é a mais gostosa.",
        chaves: ["どれが", "いちばん", "一番", "おいしい"],
        exemplo_card: "card_226",
      },
      {
        ia: line("これがいちばんおいしいですよ。", "これが一番[いちばん]おいしいですよ。", "Esta é a mais gostosa.", [
          b("ko.re", "LH", "isto", "sujeito"),
          b("ga", "H", "[Foco / sujeito]", "particula"),
          ICHIBAN,
          b("o.i.shi.i", "LHHL", "gostoso", "adjetivo"),
          DESU,
          YO,
        ]),
        dica_pt: "Diga que vai querer essa.",
        chaves: ["これに", "します"],
        exemplo_card: "card_228",
      },
      {
        ia: line("わかりました。", "わかりました。", "Certo! (fim)", [b("wa.ka.ri.ma._shi.ta", "LHHHLL", "entendi", "verbo")]),
      },
    ],
  },

  // ───────────── Brasil e Japão
  {
    id: "rp_cmp_paises",
    titulo: "Brasil ou Japão?",
    categoria: "social",
    emoji: "🌡️",
    parceiro: { nome: "Yuki · amiga", emoji: "👩" },
    missao_pt: "A Yuki quer comparar o Brasil e o Japão. Diga onde faz mais calor, conte qual é o mês mais quente e responda que, entre Tóquio e Osaka, tanto faz.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_221", "card_222"],
    system_prompt_cenario: "Amiga compara o calor do Brasil e do Japão, pergunta entre Tóquio e Osaka e convida para viajar.",
    roteiro: [
      {
        ia: line("ブラジルとにほんと、どちらがあついですか。", "ブラジルと日本[にほん]と、どちらが暑[あつ]いですか。", "Onde é mais quente, no Brasil ou no Japão?", [
          b("bu.ra.ji.ru", "LHHH", "Brasil", "lugar"),
          b("to", "H", "[e]", "particula"),
          b("ni.ho.n", "LHL", "Japão", "lugar"),
          b("to", "L", "[e]", "particula"),
          DOCHIRA,
          GA,
          ATSUI,
          DESU,
          KA,
        ]),
        dica_pt: "Diga que o Brasil é mais quente.",
        chaves: ["ブラジル", "ほう", "あつい", "暑い"],
        exemplo: line("ブラジルのほうがあついです。", "ブラジルのほうが暑[あつ]いです。", "O Brasil é mais quente.", [
          b("bu.ra.ji.ru", "LHHH", "Brasil", "lugar"),
          b("no", "H", "[de]", "particula"),
          b("ho.o", "HL", "lado, direção", "substantivo"),
          GA,
          ATSUI,
          DESU,
        ]),
      },
      {
        ia: line("いちねんで、いつがいちばんあついですか。", "一年[いちねん]で、いつが一番[いちばん]暑[あつ]いですか。", "Qual é a época mais quente do ano?", [
          b("i.chi.ne.n", "LHLL", "um ano", "tempo"),
          b("de", "L", "[âmbito]", "particula"),
          b("i.tsu", "HL", "quando", "pergunta"),
          GA,
          ICHIBAN,
          ATSUI,
          DESU,
          KA,
        ]),
        dica_pt: "Diga que é fevereiro.",
        chaves: ["にがつ", "二月", "いちばん", "一番"],
        exemplo: line("にがつがいちばんあついです。", "二月[にがつ]が一番[いちばん]暑[あつ]いです。", "Fevereiro é o mês mais quente.", [
          b("ni.ga.tsu", "LHH", "fevereiro", "tempo"),
          b("ga", "H", "[Foco / sujeito]", "particula"),
          ICHIBAN,
          ATSUI,
          DESU,
        ]),
      },
      {
        ia: line("とうきょうとおおさかと、どちらがすきですか。", "東京[とうきょう]と大阪[おおさか]と、どちらが好[す]きですか。", "Você prefere Tóquio ou Osaka?", [
          b("to.o.kyo.o", "LHHH", "Tóquio", "lugar"),
          b("to", "H", "[e]", "particula"),
          b("o.o.sa.ka", "LHHH", "Osaka", "lugar"),
          b("to", "H", "[e]", "particula"),
          DOCHIRA,
          GA,
          b("_su.ki", "LH", "gostado", "adjetivo"),
          DESU,
          KA,
        ]),
        dica_pt: "Diga que tanto faz.",
        chaves: ["どちらでも", "いいです"],
        exemplo_card: "card_222",
      },
      {
        ia: line("じゃあ、いっしょにいきましょう。", "じゃあ、一緒[いっしょ]に行[い]きましょう。", "Então vamos juntos! (fim)", [
          b("ja.a", "HL", "então", "expressao"),
          b("i.s.sho", "LHH", "juntos", "adverbio"),
          b("ni", "H", "[modo]", "particula"),
          b("i.ki.ma.sho.o", "HHHHL", "vamos", "verbo"),
        ]),
      },
    ],
  },
];
