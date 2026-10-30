import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 22 (Experiências): a viagem que você ainda não fez, a comida que nunca provou e a entrevista
 * de emprego. Usam as frases de `cards-experiencias.ts` como resposta-modelo. ★ nova = palavra nova.
 */

const KOTO_ALTO = b("ko.to", "HH", "o fato, a experiência", "substantivo");
const KOTO_SOBE = b("ko.to", "LH", "o fato, a experiência", "substantivo");
const GA = b("ga", "L", "[Foco / sujeito]", "particula");
const ARIMASU = b("a.ri.ma._su", "LHHL", "existe", "verbo");
const KA = b("ka", "L", "[?]", "particula");

export const cenariosExperiencias: SeedScenario[] = [
  // ───────────── Viagem ao Japão
  {
    id: "rp_exp_viagem",
    titulo: "Você já foi ao Japão?",
    categoria: "social",
    emoji: "🗻",
    parceiro: { nome: "Yuki · amiga", emoji: "👩" },
    missao_pt: "A Yuki quer saber das suas viagens. Diga que ainda não foi ao Japão, conte o que quer fazer lá e pergunte como foi a experiência dela.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_199", "card_200"],
    system_prompt_cenario: "Amiga pergunta se você já foi ao Japão e conta que subiu o Monte Fuji.",
    roteiro: [
      {
        ia: line("にほんにいったことがありますか。", "日本[にほん]に行[い]ったことがありますか。", "Você já foi ao Japão?", [
          b("ni.ho.n", "LHL", "Japão", "lugar"),
          b("ni", "L", "[Destino]", "particula"),
          b("i.t.ta", "LHH", "foi", "verbo"),
          KOTO_ALTO,
          GA,
          ARIMASU,
          KA,
        ]),
        dica_pt: "Diga que ainda não foi.",
        chaves: ["まだ", "ありません"],
        exemplo_card: "card_200",
      },
      {
        ia: line("にほんでなにをしたいですか。", "日本[にほん]で何[なに]をしたいですか。", "O que você quer fazer no Japão?", [
          b("ni.ho.n", "LHL", "Japão", "lugar"),
          b("de", "L", "[Local da ação]", "particula"),
          b("na.ni", "HL", "o quê", "pergunta"),
          b("o", "L", "[Objeto]", "particula"),
          b("_shi.ta.i", "LHL", "quer fazer", "verbo"),
          b("de._su", "LL", "é", "copula"),
          KA,
        ]),
        dica_pt: "Diga que quer subir o Monte Fuji.",
        chaves: ["ふじさん", "富士山", "のぼりたい", "登りたい"],
        exemplo: line("ふじさんにのぼりたいです。", "富士山[ふじさん]に登[のぼ]りたいです。", "Quero subir o Monte Fuji.", [
          b("fu.ji.sa.n", "HLLL", "Monte Fuji", "lugar"),
          b("ni", "L", "[Destino]", "particula"),
          b("no.bo.ri.ta.i", "LHHHL", "quero subir", "verbo"),
          b("de._su", "LL", "é", "copula"),
        ]),
      },
      {
        ia: line("わたしはのぼったことがありますよ。", "私[わたし]は登[のぼ]ったことがありますよ。", "Eu já subi, viu?", [
          b("wa.ta._shi", "LHH", "eu", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("no.bo.t.ta", "LHHH", "subi", "verbo"),
          KOTO_ALTO,
          GA,
          ARIMASU,
          b("yo", "L", "[te conto]", "particula"),
        ]),
        dica_pt: "Pergunte como foi.",
        chaves: ["どうでした"],
        exemplo: line("どうでしたか。", "どうでしたか。", "Como foi?", [
          b("do.o", "HL", "como", "pergunta"),
          b("de._shi.ta", "LLL", "foi", "copula"),
          KA,
        ]),
      },
      {
        ia: line("とてもきれいでしたよ。", "とてもきれいでしたよ。", "Foi lindo demais! (fim)", [
          b("to.te.mo", "LHH", "muito", "adverbio"),
          b("ki.re.i", "HLL", "bonito", "adjetivo"),
          b("de._shi.ta", "LLL", "foi", "copula"),
          b("yo", "L", "[te conto]", "particula"),
        ]),
      },
    ],
  },

  // ───────────── Comida nova
  {
    id: "rp_exp_natto",
    titulo: "Nunca comi!",
    categoria: "restaurante",
    emoji: "🥢",
    parceiro: { nome: "Tanaka-san · colega", emoji: "🧑" },
    missao_pt: "No almoço, o Tanaka oferece natto. Diga que nunca comeu, aceite experimentar e conte o que achou.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_203", "card_204"],
    system_prompt_cenario: "Colega no almoço oferece natto, propõe provar hoje e pergunta o que achou.",
    roteiro: [
      {
        ia: line("なっとうをたべたことがありますか。", "納豆[なっとう]を食[た]べたことがありますか。", "Você já comeu natto?", [
          b("na.t.to.o", "LHHL", "natto", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("ta.be.ta", "HLL", "comeu", "verbo"),
          KOTO_SOBE,
          GA,
          ARIMASU,
          KA,
        ]),
        dica_pt: "Diga que nunca comeu.",
        chaves: ["いちども", "一度も", "ありません"],
        exemplo_card: "card_204",
      },
      {
        ia: line("じゃあ、きょうたべましょう。", "じゃあ、今日[きょう]食[た]べましょう。", "Então vamos comer hoje!", [
          b("ja.a", "HL", "então", "expressao"),
          b("kyo.o", "HL", "hoje", "tempo"),
          b("ta.be.ma.sho.o", "LHHHL", "vamos comer", "verbo"),
        ]),
        dica_pt: "Aceite: sim, vamos comer.",
        chaves: ["たべましょう", "食べましょう"],
        exemplo: line("はい、たべましょう。", "はい、食[た]べましょう。", "Sim, vamos comer.", [
          b("ha.i", "HL", "sim", "expressao"),
          b("ta.be.ma.sho.o", "LHHHL", "vamos comer", "verbo"),
        ]),
      },
      {
        ia: line("どうですか。", "どうですか。", "E aí, que tal?", [b("do.o", "HL", "como", "pergunta"), b("de._su", "LL", "é", "copula"), KA]),
        dica_pt: "Diga que é gostoso.",
        chaves: ["おいしい"],
        exemplo: line("おいしいです。", "おいしいです。", "É gostoso.", [
          b("o.i.shi.i", "LHHL", "gostoso", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
      },
      {
        ia: line("よかったです。", "よかったです。", "Que bom! (fim)", [b("yo.ka.t.ta", "HLLL", "que bom", "adjetivo"), b("de._su", "LL", "é", "copula")]),
      },
    ],
  },

  // ───────────── Entrevista de emprego
  {
    id: "rp_exp_entrevista",
    titulo: "Entrevista de emprego",
    categoria: "trabalho",
    emoji: "📝",
    parceiro: { nome: "Kobayashi-kachō · entrevistador", emoji: "👔" },
    missao_pt: "Em uma entrevista, conte que ainda não trabalhou no Japão, que já trabalhou no Brasil e que já falou em japonês. Diga onde estudou.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_211"],
    system_prompt_cenario: "Entrevistador educado pergunta sobre experiência de trabalho, uso do japonês e onde estudou.",
    roteiro: [
      {
        ia: line("にほんではたらいたことがありますか。", "日本[にほん]で働[はたら]いたことがありますか。", "Você já trabalhou no Japão?", [
          b("ni.ho.n", "LHL", "Japão", "lugar"),
          b("de", "L", "[Local da ação]", "particula"),
          b("ha.ta.ra.i.ta", "LHHHH", "trabalhou", "verbo"),
          KOTO_ALTO,
          GA,
          ARIMASU,
          KA,
        ]),
        dica_pt: "Diga apenas que não.",
        chaves: ["いいえ", "ありません"],
        exemplo: line("いいえ、ありません。", "いいえ、ありません。", "Não, nunca.", [
          b("i.i.e", "LHH", "não", "expressao"),
          b("a.ri.ma.se.n", "LHHHL", "não existe", "verbo"),
        ]),
      },
      {
        ia: line("ブラジルではたらいたことがありますか。", "ブラジルで働[はたら]いたことがありますか。", "Você já trabalhou no Brasil?", [
          b("bu.ra.ji.ru", "LHHH", "Brasil", "lugar"),
          b("de", "H", "[Local da ação]", "particula"),
          b("ha.ta.ra.i.ta", "LHHHH", "trabalhou", "verbo"),
          KOTO_ALTO,
          GA,
          ARIMASU,
          KA,
        ]),
        dica_pt: "Diga que já trabalhou no Brasil.",
        chaves: ["はたらいた", "働いた", "あります"],
        exemplo: line("はい、ブラジルではたらいたことがあります。", "はい、ブラジルで働[はたら]いたことがあります。", "Sim, já trabalhei no Brasil.", [
          b("ha.i", "HL", "sim", "expressao"),
          b("bu.ra.ji.ru", "LHHH", "Brasil", "lugar"),
          b("de", "H", "[Local da ação]", "particula"),
          b("ha.ta.ra.i.ta", "LHHHH", "trabalhei", "verbo"),
          KOTO_ALTO,
          GA,
          ARIMASU,
        ]),
      },
      {
        ia: line("にほんごではなしたことがありますか。", "日本語[にほんご]で話[はな]したことがありますか。", "Você já falou em japonês?", [
          b("ni.ho.n.go", "LHHH", "japonês", "substantivo"),
          b("de", "H", "[Meio / instrumento]", "particula"),
          b("ha.na._shi.ta", "LHLL", "falou", "verbo"),
          KOTO_SOBE,
          GA,
          ARIMASU,
          KA,
        ]),
        dica_pt: "Diga que já falou em japonês.",
        chaves: ["はなした", "話した"],
        exemplo_card: "card_211",
      },
      {
        ia: line("どこでべんきょうしましたか。", "どこで勉強[べんきょう]しましたか。", "Onde você estudou?", [
          b("do.ko", "HL", "onde", "pergunta"),
          b("de", "L", "[Local da ação]", "particula"),
          b("be.n.kyo.o", "LHHH", "estudo", "substantivo"),
          b("_shi.ma._shi.ta", "HHLL", "fez", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que estudou na faculdade.",
        chaves: ["だいがく", "大学"],
        exemplo: line("だいがくでべんきょうしました。", "大学[だいがく]で勉強[べんきょう]しました。", "Estudei na faculdade. (nova: daigaku = faculdade)", [
          b("da.i.ga.ku", "LHHH", "faculdade ★ nova", "lugar"),
          b("de", "H", "[Local da ação]", "particula"),
          b("be.n.kyo.o", "LHHH", "estudo", "substantivo"),
          b("_shi.ma._shi.ta", "HHLL", "fiz", "verbo"),
        ]),
      },
      {
        ia: line("わかりました。ありがとうございます。", "わかりました。ありがとうございます。", "Entendi. Obrigado. (fim)", [
          b("wa.ka.ri.ma._shi.ta", "LHHHLL", "entendi", "verbo"),
          b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
          b("go.za.i.ma._su", "LHHHL", "[forma educada]", "expressao"),
        ]),
      },
    ],
  },
];
