import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 24 (Planos): as férias com a Yuki, o futuro conversado com a professora e a data da reunião.
 * Usam as frases de `cards-planos.ts` como resposta-modelo. ★ nova = palavra nova.
 */

const OMOIMASU = b("o.mo.i.ma._su", "LHHHL", "penso", "verbo");
const TO = b("to", "L", "[citação: que…]", "particula");
const DESU = b("de._su", "LL", "é", "copula");
const KA = b("ka", "L", "[?]", "particula");

export const cenariosPlanos: SeedScenario[] = [
  // ───────────── Férias
  {
    id: "rp_pla_ferias",
    titulo: "Planos para as férias",
    categoria: "social",
    emoji: "🏖️",
    parceiro: { nome: "Yuki · amiga", emoji: "👩" },
    missao_pt: "A Yuki pergunta dos seus planos. Diga que ainda não decidiu, aceite o convite para Kyoto e conte o que pensa em fazer lá.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_236", "card_238", "card_239"],
    system_prompt_cenario: "Amiga pergunta sobre as férias, convida para ir a Kyoto e pergunta o que fazer lá.",
    roteiro: [
      {
        ia: line("なつやすみのよていはなんですか。", "夏休[なつやす]みの予定[よてい]は何[なん]ですか。", "Quais são seus planos para as férias de verão?", [
          b("na.tsu.ya.su.mi", "LHHLL", "férias de verão", "tempo"),
          b("no", "L", "[de]", "particula"),
          b("yo.te.i", "LHH", "programação", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("na.n", "HL", "o quê", "pergunta"),
          DESU,
          KA,
        ]),
        dica_pt: "Diga que ainda não decidiu.",
        chaves: ["まだ", "きめて", "決めて"],
        exemplo_card: "card_238",
      },
      {
        ia: line("じゃあ、いっしょにきょうとにいこう。", "じゃあ、一緒[いっしょ]に京都[きょうと]に行[い]こう。", "Então vamos juntos a Kyoto!", [
          b("ja.a", "HL", "então", "expressao"),
          b("i.s.sho", "LHH", "juntos", "adverbio"),
          b("ni", "H", "[modo]", "particula"),
          b("kyo.o.to", "HLL", "Kyoto", "lugar"),
          b("ni", "L", "[Destino]", "particula"),
          b("i.ko.o", "LHL", "vamos", "verbo"),
        ]),
        dica_pt: "Aceite: que bom, vamos!",
        chaves: ["いいですね", "いきましょう", "行きましょう"],
        exemplo: line("いいですね。いきましょう。", "いいですね。行[い]きましょう。", "Que bom! Vamos.", [
          b("i.i", "HL", "bom", "adjetivo"),
          DESU,
          b("ne", "L", "[né]", "particula"),
          b("i.ki.ma.sho.o", "LHHHL", "vamos", "verbo"),
        ]),
      },
      {
        ia: line("きょうとでなにをしようか。", "京都[きょうと]で何[なに]をしようか。", "O que vamos fazer em Kyoto?", [
          b("kyo.o.to", "HLL", "Kyoto", "lugar"),
          b("de", "L", "[Local da ação]", "particula"),
          b("na.ni", "HL", "o quê", "pergunta"),
          b("o", "L", "[Objeto]", "particula"),
          b("_shi.yo.o", "LHL", "vamos fazer", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que pensa em ver os templos.",
        chaves: ["おてら", "お寺", "みよう", "見よう"],
        exemplo: line("おてらをみようとおもいます。", "お寺[てら]を見[み]ようと思[おも]います。", "Estou pensando em ver os templos.", [
          b("o.te.ra", "LHH", "templo", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("mi.yo.o", "LHL", "ver (volitiva)", "verbo"),
          TO,
          OMOIMASU,
        ]),
      },
      {
        ia: line("いいですね。", "いいですね。", "Boa ideia! (fim)", [b("i.i", "HL", "bom", "adjetivo"), DESU, b("ne", "L", "[né]", "particula")]),
      },
    ],
  },

  // ───────────── Futuro
  {
    id: "rp_pla_futuro",
    titulo: "O que você vai fazer no ano que vem?",
    categoria: "social",
    emoji: "🎯",
    parceiro: { nome: "Prof.ª Nakamura", emoji: "👩‍🏫" },
    missao_pt: "A professora pergunta dos seus planos. Conte que pensa em ir ao Japão, explique o motivo e diga que vai fazer a prova.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_231", "card_196", "card_233"],
    system_prompt_cenario: "Professora gentil pergunta o plano para o ano que vem, o motivo e se o aluno fará a prova.",
    roteiro: [
      {
        ia: line("らいねんはなにをするつもりですか。", "来年[らいねん]は何[なに]をするつもりですか。", "O que você pretende fazer no ano que vem?", [
          b("ra.i.ne.n", "LHHH", "ano que vem", "tempo"),
          b("wa", "H", "[Tópico]", "particula"),
          b("na.ni", "HL", "o quê", "pergunta"),
          b("o", "L", "[Objeto]", "particula"),
          b("su.ru", "LH", "fazer", "verbo"),
          b("tsu.mo.ri", "HHH", "intenção", "substantivo"),
          b("de._su", "HL", "é", "copula"),
          KA,
        ]),
        dica_pt: "Diga que pensa em ir ao Japão.",
        chaves: ["にほん", "日本", "いこう", "行こう"],
        exemplo_card: "card_231",
      },
      {
        ia: line("どうしてですか。", "どうしてですか。", "Por quê?", [b("do.o._shi.te", "HLLL", "por quê", "pergunta"), DESU, KA]),
        dica_pt: "Diga: porque quer trabalhar no Japão.",
        chaves: ["はたらきたい", "働きたい", "から"],
        exemplo_card: "card_196",
      },
      {
        ia: line("しけんもうけますか。", "試験[しけん]も受[う]けますか。", "Vai fazer a prova também?", [
          b("_shi.ke.n", "LHL", "prova", "topico"),
          b("mo", "L", "[também]", "particula"),
          b("u.ke.ma._su", "LHHL", "recebe", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que sim, que pensa em fazer.",
        chaves: ["うけよう", "受けよう"],
        exemplo: line("はい、うけようとおもいます。", "はい、受[う]けようと思[おも]います。", "Sim, estou pensando em fazer.", [
          b("ha.i", "HL", "sim", "expressao"),
          b("u.ke.yo.o", "LHHL", "receber (volitiva)", "verbo"),
          TO,
          OMOIMASU,
        ]),
      },
      {
        ia: line("がんばってください。", "頑張[がんば]ってください。", "Boa sorte, esforce-se! (fim)", [
          b("ga.n.ba.t.te", "LHHLL", "esforce-se", "verbo"),
          b("ku.da.sa.i", "LLLL", "por favor", "verbo"),
        ]),
      },
    ],
  },

  // ───────────── Marcar a reunião
  {
    id: "rp_pla_reuniao",
    titulo: "Marcar a reunião",
    categoria: "trabalho",
    emoji: "📅",
    parceiro: { nome: "Kobayashi-kachō · chefe", emoji: "👔" },
    missao_pt: "O chefe quer marcar uma reunião na sexta. Diga com educação que você tem compromisso e aceite o outro dia.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_237"],
    system_prompt_cenario: "Chefe propõe reunião na sexta, aceita mudar para a quinta e combina o horário.",
    roteiro: [
      {
        ia: line("らいしゅうのきんようびにかいぎをしようとおもいます。", "来週[らいしゅう]の金曜日[きんようび]に会議[かいぎ]をしようと思[おも]います。", "Penso em fazer a reunião na sexta da semana que vem.", [
          b("ra.i.shu.u", "LHHH", "semana que vem", "tempo"),
          b("no", "H", "[de]", "particula"),
          b("ki.n.yo.o.bi", "LHHLL", "sexta-feira", "tempo"),
          b("ni", "L", "[Momento]", "particula"),
          b("ka.i.gi", "HLL", "reunião", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("_shi.yo.o", "LHL", "fazer (volitiva)", "verbo"),
          TO,
          OMOIMASU,
        ]),
        dica_pt: "Desculpe-se: na sexta você tem compromisso.",
        chaves: ["よてい", "予定", "きんようび", "金曜日"],
        exemplo: line("すみません、きんようびはよていがあります。", "すみません、金曜日[きんようび]は予定[よてい]があります。", "Desculpe, na sexta tenho compromisso.", [
          b("su.mi.ma.se.n", "LHHHL", "desculpe", "expressao"),
          b("ki.n.yo.o.bi", "LHHLL", "sexta-feira", "tempo"),
          b("wa", "L", "[contraste]", "particula"),
          b("yo.te.i", "LHH", "programação", "sujeito"),
          b("ga", "H", "[Foco / sujeito]", "particula"),
          b("a.ri.ma._su", "LHHL", "existe", "verbo"),
        ]),
      },
      {
        ia: line("じゃあ、もくようびはどうですか。", "じゃあ、木曜日[もくようび]はどうですか。", "Então, que tal quinta-feira?", [
          b("ja.a", "HL", "então", "expressao"),
          b("mo.ku.yo.o.bi", "LHHLL", "quinta-feira", "tempo"),
          b("wa", "L", "[Tópico]", "particula"),
          b("do.o", "HL", "como", "pergunta"),
          DESU,
          KA,
        ]),
        dica_pt: "Diga que na quinta está tudo bem.",
        chaves: ["もくようび", "木曜日", "だいじょうぶ", "大丈夫"],
        exemplo: line("もくようびはだいじょうぶです。", "木曜日[もくようび]は大丈夫[だいじょうぶ]です。", "Quinta está bom.", [
          b("mo.ku.yo.o.bi", "LHHLL", "quinta-feira", "tempo"),
          b("wa", "L", "[contraste]", "particula"),
          b("da.i.jo.o.bu", "LHHLL", "tudo bem", "adjetivo"),
          DESU,
        ]),
      },
      {
        ia: line("もくようびのじゅうじにはじめましょう。", "木曜日[もくようび]の十時[じゅうじ]に始[はじ]めましょう。", "Vamos começar na quinta às dez.", [
          b("mo.ku.yo.o.bi", "LHHLL", "quinta-feira", "tempo"),
          b("no", "L", "[de]", "particula"),
          b("ju.u.ji", "HLL", "dez horas", "tempo"),
          b("ni", "L", "[Momento]", "particula"),
          b("ha.ji.me.ma.sho.o", "LHHHHL", "vamos começar", "verbo"),
        ]),
        dica_pt: "Diga que entendeu.",
        chaves: ["わかり", "分かり"],
        exemplo_card: "card_030",
      },
      {
        ia: line("ありがとうございます。", "ありがとうございます。", "Obrigado. (fim)", [
          b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
          b("go.za.i.ma._su", "LHHHL", "[forma educada]", "expressao"),
        ]),
      },
    ],
  },
];
