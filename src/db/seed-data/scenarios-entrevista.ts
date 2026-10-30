import { seedCards } from "./cards";
import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 42 (Entrevista e apresentação profissional): a entrevista de emprego, a apresentação na reunião e
 * falar de si em partes. Usam as frases de `cards-entrevista.ts` como resposta-modelo.
 */

/** Uma frase do baralho como fala do parceiro. */
function fala(id: string, pt?: string) {
  const c = seedCards.find((x) => x.id === id)!;
  return line(`${c.kana}。`, `${c.kanji}。`, pt ?? c.traducao, c.blocos);
}

const DESU = b("de._su", "LL", "é", "copula");
const KA = b("ka", "L", "[?]", "particula");
const DOU = b("do.o", "HL", "como", "pergunta");

export const cenariosEntrevista: SeedScenario[] = [
  // ───────────── Entrevista
  {
    id: "rp_ent_entrevista",
    titulo: "A entrevista de emprego",
    categoria: "trabalho",
    emoji: "💼",
    parceiro: { nome: "Mori-san · recursos humanos", emoji: "👩‍💼" },
    missao_pt: "É a sua entrevista. Apresente-se, conte a experiência, explique o motivo, diga seu ponto forte e faça uma pergunta no fim.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_560", "card_562", "card_564", "card_565", "card_569", "card_570"],
    system_prompt_cenario: "Entrevistadora pede a apresentação, a experiência, o motivo, o ponto forte, a data de início e abre para perguntas.",
    roteiro: [
      {
        ia: line("じこしょうかいをおねがいします。", "自己紹介[じこしょうかい]をお願[ねが]いします。", "Apresente-se, por favor.", [
          b("ji.ko.sho.o.ka.i", "LHHLLL", "apresentação pessoal", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("o.ne.ga.i", "LHHH", "pedido", "expressao"),
          b("_shi.ma._su", "HHL", "faço", "verbo"),
        ]),
        dica_pt: "Diga que vai se apresentar.",
        chaves: ["じこしょうかい", "自己紹介"],
        exemplo_card: "card_560",
      },
      {
        ia: line("どんなしごとをしていましたか。", "どんな仕事[しごと]をしていましたか。", "Com o que você trabalhava?", [
          b("do.n.na", "HLL", "que tipo de", "pergunta"),
          b("_shi.go.to", "LHH", "trabalho", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("_shi.te", "HH", "fazer (forma -te)", "verbo"),
          b("i.ma._shi.ta", "HHLL", "estava", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que trabalhou com vendas por cinco anos.",
        chaves: ["えいぎょう", "営業"],
        exemplo_card: "card_562",
      },
      {
        ia: line("どうしてとうしゃをえらびましたか。", "どうして当社[とうしゃ]を選[えら]びましたか。", "Por que escolheu a nossa empresa?", [
          b("do.o._shi.te", "HLLL", "por quê", "pergunta"),
          b("to.o.sha", "HLL", "nossa empresa", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("e.ra.bi.ma._shi.ta", "LHHHLL", "escolheu", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que é porque quer trabalhar no Japão.",
        chaves: ["はたらきたい", "働きたい"],
        exemplo_card: "card_564",
      },
      {
        ia: line("ちょうしょはなんですか。", "長所[ちょうしょ]は何[なん]ですか。", "Qual é o seu ponto forte?", [
          b("cho.o.sho", "HLL", "ponto forte", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("na.n", "HL", "o que", "pergunta"),
          DESU,
          KA,
        ]),
        dica_pt: "Diga que é o seu senso de responsabilidade.",
        chaves: ["せきにんかん", "責任感"],
        exemplo_card: "card_565",
      },
      {
        ia: line("いつからはたらけますか。", "いつから働[はたら]けますか。", "A partir de quando você pode trabalhar?", [
          b("i.tsu", "HL", "quando", "pergunta"),
          b("ka.ra", "LL", "a partir de", "particula"),
          b("ha.ta.ra.ke.ma._su", "LHHHHL", "pode trabalhar", "verbo"),
          KA,
        ]),
        dica_pt: "Diga: a partir do mês que vem.",
        chaves: ["らいげつ", "来月"],
        exemplo_card: "card_569",
      },
      { ia: fala("card_578", "Você tem alguma pergunta?"), dica_pt: "Peça para fazer uma pergunta.", chaves: ["しつもん", "質問"], exemplo_card: "card_570" },
      {
        ia: line("けっかはごじつおしらせします。", "結果[けっか]は後日[ごじつ]お知[し]らせします。", "Avisaremos o resultado depois. (nova: gojitsu = em outro dia) (fim)", [
          b("ke.k.ka", "LHH", "resultado", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("go.ji.tsu", "HLL", "em outro dia ★ nova", "tempo"),
          b("o._shi.ra.se", "LHHH", "aviso", "substantivo"),
          b("_shi.ma._su", "HHL", "faço", "verbo"),
        ]),
      },
    ],
  },

  // ───────────── Apresentação
  {
    id: "rp_ent_apresentacao",
    titulo: "A sua apresentação",
    categoria: "trabalho",
    emoji: "📊",
    parceiro: { nome: "Kobayashi-kachō · chefe", emoji: "👔" },
    missao_pt: "Apresente o novo plano à equipe: diga o assunto, comente as vendas, proponha uma saída e encerre.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_572", "card_575", "card_577"],
    system_prompt_cenario: "Chefe pede para começar, pergunta das vendas, pede a opinião e elogia a apresentação.",
    roteiro: [
      {
        ia: line("では、はじめてください。", "では、始[はじ]めてください。", "Então, pode começar.", [
          b("de.wa", "HL", "então", "expressao"),
          b("ha.ji.me.te", "LHHH", "começar (forma -te)", "verbo"),
          b("ku.da.sa.i", "HHHL", "por favor", "verbo"),
        ]),
        dica_pt: "Diga que hoje vai falar sobre o novo plano.",
        chaves: ["けいかく", "計画", "について"],
        exemplo_card: "card_572",
      },
      {
        ia: line("うりあげはどうでしたか。", "売[う]り上[あ]げはどうでしたか。", "Como foram as vendas?", [
          b("u.ri.a.ge", "LHHH", "vendas", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          DOU,
          b("de._shi.ta", "LLL", "foi", "copula"),
          KA,
        ]),
        dica_pt: "Mostre pelo gráfico que as vendas estão aumentando.",
        chaves: ["グラフ", "ふえて", "増えて"],
        exemplo_card: "card_575",
      },
      {
        ia: line("どうしたらいいとおもいますか。", "どうしたらいいと思[おも]いますか。", "O que você acha que devemos fazer?", [
          DOU,
          b("_shi.ta.ra", "LLL", "se fizer", "verbo"),
          b("i.i", "HL", "bom", "adjetivo"),
          b("to", "L", "[citação: que…]", "particula"),
          b("o.mo.i.ma._su", "LHHHL", "acha", "verbo"),
          KA,
        ]),
        dica_pt: "Proponha: que tal fazer assim?",
        chaves: ["こうしたら", "どうでしょうか"],
        exemplo_card: "card_556",
      },
      {
        ia: line("いいはっぴょうでしたね。", "いい発表[はっぴょう]でしたね。", "Foi uma boa apresentação. (nova: happyou = apresentação) (fim)", [
          b("i.i", "HL", "bom", "adjetivo"),
          b("ha.p.pyo.o", "LHHH", "apresentação ★ nova", "substantivo"),
          b("de._shi.ta", "HLL", "foi", "copula"),
          b("ne", "L", "[né]", "particula"),
        ]),
      },
    ],
  },

  // ───────────── Falar de si
  {
    id: "rp_ent_sobre_mim",
    titulo: "Fale sobre você",
    categoria: "trabalho",
    emoji: "🎙️",
    parceiro: { nome: "Prof.ª Nakamura", emoji: "👩‍🏫" },
    missao_pt: "Treine a fala longa: quem você é, o que já fez, como está o seu japonês e o que quer para o futuro.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_386", "card_562", "card_567", "card_568"],
    system_prompt_cenario: "Professora pede nome e país, a experiência, o nível de japonês e os planos para o futuro.",
    roteiro: [
      {
        ia: line("おなまえとくにをおしえてください。", "お名前[なまえ]と国[くに]を教[おし]えてください。", "Diga o seu nome e o seu país, por favor.", [
          b("o.na.ma.e", "LHHH", "nome (educado)", "objeto"),
          b("to", "H", "[e]", "particula"),
          b("ku.ni", "LH", "país", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("o._shi.e.te", "LHHH", "ensinar (forma -te)", "verbo"),
          b("ku.da.sa.i", "HHHL", "por favor", "verbo"),
        ]),
        dica_pt: "Diga que veio do Brasil.",
        chaves: ["ブラジル"],
        exemplo_card: "card_386",
      },
      {
        ia: line("どんなけいけんがありますか。", "どんな経験[けいけん]がありますか。", "Que experiência você tem?", [
          b("do.n.na", "HLL", "que tipo de", "pergunta"),
          b("ke.i.ke.n", "LHHH", "experiência", "sujeito"),
          b("ga", "H", "[Foco / sujeito]", "particula"),
          b("a.ri.ma._su", "LHHL", "existe", "verbo"),
          KA,
        ]),
        dica_pt: "Conte o que você fez no trabalho.",
        chaves: ["しごと", "仕事"],
        exemplo_card: "card_562",
      },
      {
        ia: line("にほんごはどうですか。", "日本語[にほんご]はどうですか。", "E o seu japonês, como está?", [
          b("ni.ho.n.go", "LHHH", "japonês", "topico"),
          b("wa", "H", "[contraste]", "particula"),
          DOU,
          DESU,
          KA,
        ]),
        dica_pt: "Diga que ainda está estudando, mas pratica todo dia.",
        chaves: ["べんきょうちゅう", "勉強中", "れんしゅう", "練習"],
        exemplo_card: "card_567",
      },
      {
        ia: line("これからどうしたいですか。", "これからどうしたいですか。", "O que você quer fazer daqui em diante?", [
          b("ko.re.ka.ra", "LHHH", "daqui em diante", "tempo"),
          DOU,
          b("_shi.ta.i", "LLL", "quer fazer", "verbo"),
          DESU,
          KA,
        ]),
        dica_pt: "Conte o seu plano para o futuro.",
        chaves: ["しょうらい", "将来"],
        exemplo_card: "card_568",
      },
      {
        ia: line("よくわかりました。", "よくわかりました。", "Entendi bem. (fim)", [
          b("yo.ku", "HL", "bem", "adverbio"),
          b("wa.ka.ri.ma._shi.ta", "LHHHLL", "entendi", "verbo"),
        ]),
      },
    ],
  },
];
