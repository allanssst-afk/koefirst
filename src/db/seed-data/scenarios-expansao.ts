import { seedCards } from "./cards";
import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões das unidades 45–49 (expansão do B1). Usam as frases de `cards-expansao.ts` como resposta-modelo.
 */

/** Uma frase do baralho como fala do parceiro. */
function fala(id: string, pt?: string) {
  const c = seedCards.find((x) => x.id === id)!;
  return line(`${c.kana}。`, `${c.kanji}。`, pt ?? c.traducao, c.blocos);
}

const DESU = b("de._su", "LL", "é", "copula");
const KA = b("ka", "L", "[?]", "particula");
const DOU = b("do.o", "HL", "como", "pergunta");
const OMOIMASU = b("o.mo.i.ma._su", "LHHHL", "acha", "verbo");
const YUKI = { nome: "Yuki · amiga", emoji: "👩" };
const SUZUKI = { nome: "Suzuki-san · colega", emoji: "🧑" };

const DAIJOUBU = (pt: string) =>
  line("だいじょうぶですよ。", "大丈夫[だいじょうぶ]ですよ。", pt, [
    b("da.i.jo.o.bu", "LHHLL", "tudo bem", "adjetivo"),
    DESU,
    b("yo", "L", "[afirmação]", "particula"),
  ]);
const SEM_ANIMO = line("げんきがないですね。", "元気[げんき]がないですね。", "Você está desanimado, né.", [
  b("ge.n.ki", "HLL", "ânimo", "sujeito"),
  b("ga", "L", "[Foco / sujeito]", "particula"),
  b("na.i", "HL", "não existe", "adjetivo"),
  DESU,
  b("ne", "L", "[né]", "particula"),
]);

export const cenariosExpansao: SeedScenario[] = [
  // ───────────── Unidade 45
  {
    id: "rp_exp_clima",
    titulo: "Falar do tempo",
    categoria: "social",
    emoji: "☀️",
    parceiro: YUKI,
    missao_pt: "A Yuki puxa conversa sobre o calor. Comente a temperatura, fale do Brasil e diga a sua estação preferida.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_611", "card_613", "card_612"],
    system_prompt_cenario: "Amiga comenta o calor, pergunta do Brasil e da estação preferida.",
    roteiro: [
      {
        ia: line("きょうはあついですね。", "今日[きょう]は暑[あつ]いですね。", "Hoje está quente, né.", [
          b("kyo.o", "HL", "hoje", "tempo"),
          b("wa", "L", "[Tópico]", "particula"),
          b("a.tsu.i", "LHL", "quente", "adjetivo"),
          DESU,
          b("ne", "L", "[né]", "particula"),
        ]),
        dica_pt: "Diga que está fazendo 30 graus.",
        chaves: ["さんじゅうど", "三十度", "30度"],
        exemplo_card: "card_611",
      },
      {
        ia: line("ブラジルはどうですか。", "ブラジルはどうですか。", "E o Brasil?", [
          b("bu.ra.ji.ru", "LHHH", "Brasil", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          DOU,
          DESU,
          KA,
        ]),
        dica_pt: "Explique que lá o verão é em dezembro.",
        chaves: ["じゅうにがつ", "十二月", "12月"],
        exemplo_card: "card_613",
      },
      {
        ia: line("どのきせつがすきですか。", "どの季節[きせつ]が好[す]きですか。", "De que estação você gosta?", [
          b("do.no", "HL", "qual", "pergunta"),
          b("ki.se.tsu", "HLL", "estação do ano", "sujeito"),
          b("ga", "L", "[Foco / sujeito]", "particula"),
          b("su.ki", "LH", "gostar", "adjetivo"),
          DESU,
          KA,
        ]),
        dica_pt: "Diga qual é a sua favorita.",
        chaves: ["きせつ", "季節", "あき", "秋"],
        exemplo_card: "card_612",
      },
      {
        ia: line("いいですね。", "いいですね。", "Que bom! (fim)", [b("i.i", "HL", "bom", "adjetivo"), DESU, b("ne", "L", "[né]", "particula")]),
      },
    ],
  },
  {
    id: "rp_exp_tufao",
    titulo: "Vem um tufão",
    categoria: "cidade",
    emoji: "🌀",
    parceiro: SUZUKI,
    missao_pt: "O Suzuki viu que vem um tufão. Conte o que ouviu da previsão e dê um conselho.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_614", "card_606"],
    system_prompt_cenario: "Colega avisa do tufão, pergunta se precisa de guarda-chuva e aceita o conselho.",
    roteiro: [
      { ia: fala("card_601"), dica_pt: "Diga que, segundo ouviu, abre a partir do fim da tarde.", chaves: ["はれる", "晴れる", "ゆうがた", "夕方"], exemplo_card: "card_614" },
      {
        ia: line("かさはいりますか。", "傘[かさ]はいりますか。", "Precisa de guarda-chuva?", [
          b("ka.sa", "HL", "guarda-chuva", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("i.ri.ma._su", "LHHL", "precisa", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que é melhor levar.",
        chaves: ["かさ", "傘", "ほうがいい"],
        exemplo_card: "card_606",
      },
      {
        ia: line("そうしましょう。", "そうしましょう。", "Vamos fazer isso. (fim)", [b("so.o", "LH", "assim", "adverbio"), b("_shi.ma.sho.o", "HHHL", "façamos", "verbo")]),
      },
    ],
  },

  // ───────────── Unidade 46
  {
    id: "rp_exp_bateria",
    titulo: "Sem bateria",
    categoria: "social",
    emoji: "🔋",
    parceiro: YUKI,
    missao_pt: "O seu celular apagou. Conte à Yuki o que houve e peça para carregar.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_619", "card_620"],
    system_prompt_cenario: "Amiga pergunta o que houve e oferece a tomada.",
    roteiro: [
      { ia: fala("card_187"), dica_pt: "Diga que a bateria acabou.", chaves: ["でんち", "電池"], exemplo_card: "card_619" },
      {
        ia: line("ここでじゅうでんできますよ。", "ここで充電[じゅうでん]できますよ。", "Dá para carregar aqui.", [
          b("ko.ko", "LH", "aqui", "lugar"),
          b("de", "H", "[Local da ação]", "particula"),
          b("ju.u.de.n", "LHHH", "carga", "substantivo"),
          b("de.ki.ma._su", "HHHL", "é possível", "verbo"),
          b("yo", "L", "[afirmação]", "particula"),
        ]),
        dica_pt: "Peça permissão para carregar.",
        chaves: ["じゅうでん", "充電"],
        exemplo_card: "card_620",
      },
      { ia: DAIJOUBU("Pode, sim. (fim)") },
    ],
  },
  {
    id: "rp_exp_senha",
    titulo: "Não consigo entrar",
    categoria: "trabalho",
    emoji: "🔑",
    parceiro: SUZUKI,
    missao_pt: "O sistema da empresa não abre. Explique ao colega do suporte o que aconteceu.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_630", "card_625"],
    system_prompt_cenario: "Colega pergunta o que houve, se lembra a senha e manda criar outra.",
    roteiro: [
      { ia: fala("card_187"), dica_pt: "Diga que não consegue entrar na conta.", chaves: ["ログイン", "ろぐいん"], exemplo_card: "card_630" },
      {
        ia: line("パスワードはおぼえていますか。", "パスワードは覚[おぼ]えていますか。", "Você lembra a senha?", [
          b("pa._su.wa.a.do", "LHHLL", "senha", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("o.bo.e.te", "LHLL", "lembrar (forma -te)", "verbo"),
          b("i.ma._su", "LLL", "está", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que esqueceu.",
        chaves: ["わすれました", "忘れました"],
        exemplo_card: "card_625",
      },
      {
        ia: line("あたらしいパスワードをつくってください。", "新[あたら]しいパスワードを作[つく]ってください。", "Crie uma senha nova, por favor. (fim)", [
          b("a.ta.ra._shi.i", "LHHHL", "novo", "adjetivo"),
          b("pa._su.wa.a.do", "LHHLL", "senha", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("tsu.ku.t.te", "LHLL", "criar (forma -te)", "verbo"),
          b("ku.da.sa.i", "LLLL", "por favor", "verbo"),
        ]),
      },
    ],
  },

  // ───────────── Unidade 47
  {
    id: "rp_exp_briga",
    titulo: "A briga",
    categoria: "social",
    emoji: "💔",
    parceiro: YUKI,
    missao_pt: "A Yuki percebe que você está para baixo. Conte que brigou com um amigo e diga o que quer fazer.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_650", "card_651"],
    system_prompt_cenario: "Amiga nota o desânimo, aconselha pedir desculpas e tranquiliza.",
    roteiro: [
      { ia: SEM_ANIMO, dica_pt: "Conte que brigou com um amigo.", chaves: ["けんか"], exemplo_card: "card_650" },
      {
        ia: line("あやまったらどうですか。", "謝[あやま]ったらどうですか。", "Que tal pedir desculpas? (nova: ayamaru = pedir desculpas)", [
          b("a.ya.ma.t.ta.ra", "LHHLLL", "se pedir desculpas ★ nova", "verbo"),
          DOU,
          DESU,
          KA,
        ]),
        dica_pt: "Diga que quer fazer as pazes.",
        chaves: ["なかなおり", "仲直り"],
        exemplo_card: "card_651",
      },
      { ia: DAIJOUBU("Vai dar tudo certo. (fim)") },
    ],
  },
  {
    id: "rp_exp_nervoso",
    titulo: "Antes da apresentação",
    categoria: "trabalho",
    emoji: "😰",
    parceiro: SUZUKI,
    missao_pt: "Falta pouco para a sua apresentação. Conte como está se sentindo e agradeça o apoio do colega.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_642", "card_656"],
    system_prompt_cenario: "Colega nota a tensão, tranquiliza e deseja boa sorte.",
    roteiro: [
      { ia: SEM_ANIMO, dica_pt: "Diga que está nervoso.", chaves: ["きんちょう", "緊張"], exemplo_card: "card_642" },
      { ia: DAIJOUBU("Vai dar tudo certo."), dica_pt: "Agradeça: você ficou mais animado.", chaves: ["げんき", "元気"], exemplo_card: "card_656" },
      {
        ia: line("がんばってくださいね。", "頑張[がんば]ってくださいね。", "Boa sorte! (fim)", [
          b("ga.n.ba.t.te", "LHHLL", "esforce-se", "verbo"),
          b("ku.da.sa.i", "LLLL", "por favor", "verbo"),
          b("ne", "L", "[tá?]", "particula"),
        ]),
      },
    ],
  },

  // ───────────── Unidade 48
  {
    id: "rp_exp_cozinhar",
    titulo: "Cozinhar juntos",
    categoria: "restaurante",
    emoji: "🍛",
    parceiro: YUKI,
    missao_pt: "Você e a Yuki vão fazer o jantar. Escolha o prato, diga por onde começar e comente o sabor.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_674", "card_659", "card_661", "card_676"],
    system_prompt_cenario: "Amiga pergunta o que fazer, cada passo e prova o sabor.",
    roteiro: [
      {
        ia: line("なにをつくりましょうか。", "何[なに]を作[つく]りましょうか。", "O que vamos fazer?", [
          b("na.ni", "HL", "o quê", "pergunta"),
          b("o", "L", "[Objeto]", "particula"),
          b("tsu.ku.ri.ma.sho.o", "LHHHHL", "façamos", "verbo"),
          KA,
        ]),
        dica_pt: "Sugira fazer curry.",
        chaves: ["カレー", "かれー"],
        exemplo_card: "card_674",
      },
      {
        ia: line("まずなにをしますか。", "まず何[なに]をしますか。", "O que fazemos primeiro?", [
          b("ma.zu", "HL", "primeiro", "adverbio"),
          b("na.ni", "HL", "o quê", "pergunta"),
          b("o", "L", "[Objeto]", "particula"),
          b("_shi.ma._su", "LHL", "faz", "verbo"),
          KA,
        ]),
        dica_pt: "Peça para cortar os legumes.",
        chaves: ["やさい", "野菜", "きって", "切って"],
        exemplo_card: "card_659",
      },
      {
        ia: line("つぎはどうしますか。", "次[つぎ]はどうしますか。", "E depois?", [
          b("tsu.gi", "LH", "próximo", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          DOU,
          b("_shi.ma._su", "LLL", "faz", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que vai ferver água.",
        chaves: ["おゆ", "お湯", "わかし", "沸かし"],
        exemplo_card: "card_661",
      },
      {
        ia: line("あじはどうですか。", "味[あじ]はどうですか。", "Como está o sabor?", [
          b("a.ji", "LH", "sabor", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          DOU,
          DESU,
          KA,
        ]),
        dica_pt: "Diga que está fraco.",
        chaves: ["うすい", "薄い"],
        exemplo_card: "card_676",
      },
      { ia: fala("card_662", "Vou colocar um pouco de sal. (fim)") },
    ],
  },
  {
    id: "rp_exp_tarefas",
    titulo: "As tarefas de casa",
    categoria: "social",
    emoji: "🧺",
    parceiro: YUKI,
    missao_pt: "É sábado, e vocês dividem a casa. Diga o que precisa fazer e sugira o jantar.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_667", "card_674"],
    system_prompt_cenario: "Colega de casa pergunta os planos do dia, o jantar e assume a limpeza.",
    roteiro: [
      {
        ia: line("きょうはなにをしますか。", "今日[きょう]は何[なに]をしますか。", "O que você vai fazer hoje?", [
          b("kyo.o", "HL", "hoje", "tempo"),
          b("wa", "L", "[Tópico]", "particula"),
          b("na.ni", "HL", "o quê", "pergunta"),
          b("o", "L", "[Objeto]", "particula"),
          b("_shi.ma._su", "LHL", "faz", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que tem que lavar a roupa.",
        chaves: ["せんたく", "洗濯"],
        exemplo_card: "card_667",
      },
      { ia: fala("card_673"), dica_pt: "Sugira fazer curry.", chaves: ["カレー", "かれー"], exemplo_card: "card_674" },
      {
        ia: line("じゃあ、わたしがそうじします。", "じゃあ、私[わたし]が掃除[そうじ]します。", "Então eu faço a limpeza. (fim)", [
          b("ja.a", "HL", "então", "expressao"),
          b("wa.ta._shi", "LHH", "eu", "sujeito"),
          b("ga", "H", "[Foco / sujeito]", "particula"),
          b("so.o.ji", "LHH", "limpeza", "substantivo"),
          b("_shi.ma._su", "HHL", "faço", "verbo"),
        ]),
      },
    ],
  },

  // ───────────── Unidade 49
  {
    id: "rp_exp_opiniao",
    titulo: "Os problemas do Japão",
    categoria: "trabalho",
    emoji: "🗾",
    parceiro: { nome: "Prof.ª Nakamura", emoji: "👩‍🏫" },
    missao_pt: "A professora quer saber a sua opinião. Diga qual é o problema, comente e fale do que preocupa você.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_688", "card_698"],
    system_prompt_cenario: "Professora pergunta o maior problema do Japão, comenta os idosos e concorda.",
    roteiro: [
      {
        ia: line("にほんのもんだいはなんだとおもいますか。", "日本[にほん]の問題[もんだい]は何[なん]だと思[おも]いますか。", "Qual você acha que é o problema do Japão?", [
          b("ni.ho.n", "LHH", "Japão", "lugar"),
          b("no", "H", "[de]", "particula"),
          b("mo.n.da.i", "HHHH", "problema", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("na.n", "HL", "o que", "pergunta"),
          b("da", "L", "é (casual)", "copula"),
          b("to", "L", "[citação: que…]", "particula"),
          OMOIMASU,
          KA,
        ]),
        dica_pt: "Fale da queda da natalidade.",
        chaves: ["しょうしか", "少子化"],
        exemplo_card: "card_688",
      },
      { ia: fala("card_681"), dica_pt: "Diga que está preocupado com o futuro.", chaves: ["しんぱい", "心配"], exemplo_card: "card_698" },
      {
        ia: line("そうですね、わたしもそうおもいます。", "そうですね、私[わたし]もそう思[おも]います。", "É mesmo, eu também acho. (fim)", [
          b("so.o", "HL", "assim", "expressao"),
          DESU,
          b("ne", "L", "[né]", "particula"),
          b("wa.ta._shi", "LHH", "eu", "topico"),
          b("mo", "H", "também", "particula"),
          b("so.o", "LH", "assim", "adverbio"),
          b("o.mo.i.ma._su", "HHHHL", "penso", "verbo"),
        ]),
      },
    ],
  },
  {
    id: "rp_exp_trabalho",
    titulo: "Trabalhar no Japão",
    categoria: "trabalho",
    emoji: "🏢",
    parceiro: SUZUKI,
    missao_pt: "O Suzuki pergunta o que você acha do trabalho no Japão. Diga o que incomoda e o que deveria mudar.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_691", "card_700"],
    system_prompt_cenario: "Colega pede a opinião sobre o trabalho no Japão e o que fazer.",
    roteiro: [
      {
        ia: line("にほんのしごとをどうおもいますか。", "日本[にほん]の仕事[しごと]をどう思[おも]いますか。", "O que você acha do trabalho no Japão?", [
          b("ni.ho.n", "LHH", "Japão", "lugar"),
          b("no", "H", "[de]", "particula"),
          b("_shi.go.to", "LHH", "trabalho", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          DOU,
          OMOIMASU,
          KA,
        ]),
        dica_pt: "Diga que há muita hora extra.",
        chaves: ["ざんぎょう", "残業"],
        exemplo_card: "card_691",
      },
      {
        ia: line("どうしたらいいとおもいますか。", "どうしたらいいと思[おも]いますか。", "O que você acha que devemos fazer?", [
          DOU,
          b("_shi.ta.ra", "LLL", "se fizer", "verbo"),
          b("i.i", "HL", "bom", "adjetivo"),
          b("to", "L", "[citação: que…]", "particula"),
          OMOIMASU,
          KA,
        ]),
        dica_pt: "Diga que é melhor mudar o jeito de trabalhar.",
        chaves: ["はたらきかた", "働き方"],
        exemplo_card: "card_700",
      },
      { ia: fala("card_554", "Concordo. (fim)") },
    ],
  },
];
