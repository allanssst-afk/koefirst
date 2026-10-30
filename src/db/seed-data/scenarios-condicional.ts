import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 28 (Se…): o passeio que depende do tempo, o caminho até a estação e o computador com
 * problema. Usam as frases de `cards-condicional.ts` como resposta-modelo. ★ nova = palavra nova.
 */

const DESU = b("de._su", "LL", "é", "copula");
const KA = b("ka", "L", "[?]", "particula");
const YO = b("yo", "L", "[te conto]", "particula");
const WAKARIMASHITA = b("wa.ka.ri.ma._shi.ta", "LHHHLL", "entendi", "verbo");

export const cenariosCondicional: SeedScenario[] = [
  // ───────────── Depende do tempo
  {
    id: "rp_con_passeio",
    titulo: "E se chover?",
    categoria: "social",
    emoji: "☔",
    parceiro: { nome: "Yuki · amiga", emoji: "👩" },
    missao_pt: "A Yuki quer combinar o passeio de amanhã. Diga o que você faz se chover e se fizer sol, e combine de ligar depois do trabalho.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_279"],
    system_prompt_cenario: "Amiga pergunta o que fazer se chover ou se fizer sol e pede que você ligue depois do trabalho.",
    roteiro: [
      {
        ia: line("あした、あめがふったら、どうしますか。", "明日[あした]、雨[あめ]が降[ふ]ったら、どうしますか。", "Se chover amanhã, o que você faz?", [
          b("a._shi.ta", "LHH", "amanhã", "tempo"),
          b("a.me", "HL", "chuva", "sujeito"),
          b("ga", "L", "[Foco / sujeito]", "particula"),
          b("fu.t.ta.ra", "HLLL", "se cair", "verbo"),
          b("do.o", "HL", "como", "pergunta"),
          b("_shi.ma._su", "LLL", "faz", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que, se chover, não vai.",
        chaves: ["ふったら", "降ったら", "いきません", "行きません"],
        exemplo_card: "card_279",
      },
      {
        ia: line("はれたら、どうしますか。", "晴[は]れたら、どうしますか。", "E se fizer sol, o que você faz?", [
          b("ha.re.ta.ra", "HLLL", "se abrir o tempo", "verbo"),
          b("do.o", "HL", "como", "pergunta"),
          b("_shi.ma._su", "LLL", "faz", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que quer ir à praia.",
        chaves: ["うみ", "海"],
        exemplo: line("うみにいきたいです。", "海[うみ]に行[い]きたいです。", "Quero ir à praia.", [
          b("u.mi", "HL", "praia, mar", "lugar"),
          b("ni", "L", "[Destino]", "particula"),
          b("i.ki.ta.i", "LHHL", "quero ir", "verbo"),
          DESU,
        ]),
      },
      {
        ia: line("じゃあ、しごとがおわったら、でんわしてください。", "じゃあ、仕事[しごと]が終[お]わったら、電話[でんわ]してください。", "Então, quando acabar o trabalho, me ligue.", [
          b("ja.a", "HL", "então", "expressao"),
          b("shi.go.to", "LHH", "trabalho", "sujeito"),
          b("ga", "H", "[Foco / sujeito]", "particula"),
          b("o.wa.t.ta.ra", "LHHHL", "quando terminar", "verbo"),
          b("de.n.wa", "LHH", "telefonema", "substantivo"),
          b("_shi.te", "HH", "fazer (forma -te)", "verbo"),
          b("ku.da.sa.i", "HHHL", "por favor", "verbo"),
        ]),
        dica_pt: "Diga que entendeu.",
        chaves: ["わかり", "分かり"],
        exemplo_card: "card_030",
      },
      {
        ia: line("じゃあ、またね。", "じゃあ、またね。", "Então, até mais! (fim)", [
          b("ja.a", "HL", "então", "expressao"),
          b("ma.ta", "LH", "de novo", "adverbio"),
          b("ne", "H", "[né]", "particula"),
        ]),
      },
    ],
  },

  // ───────────── Perdido
  {
    id: "rp_con_caminho",
    titulo: "Virando à direita",
    categoria: "cidade",
    emoji: "🧭",
    parceiro: { nome: "Pessoa na rua", emoji: "🧑" },
    missao_pt: "Você se perdeu. Diga isso a alguém na rua, conte aonde quer ir, entenda a explicação e agradeça.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_255"],
    system_prompt_cenario: "Pessoa gentil na rua pergunta o que houve, aonde você vai e explica o caminho até a estação.",
    roteiro: [
      {
        ia: line("どうしましたか。", "どうしましたか。", "O que houve?", [
          b("do.o", "HL", "como", "pergunta"),
          b("_shi.ma._shi.ta", "LLLL", "fez", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que se perdeu.",
        chaves: ["まよい", "迷い"],
        exemplo_card: "card_255",
      },
      {
        ia: line("どこにいきたいですか。", "どこに行[い]きたいですか。", "Aonde você quer ir?", [
          b("do.ko", "HL", "onde", "pergunta"),
          b("ni", "L", "[Destino]", "particula"),
          b("i.ki.ta.i", "LHHL", "quer ir", "verbo"),
          DESU,
          KA,
        ]),
        dica_pt: "Diga que quer ir à estação.",
        chaves: ["えき", "駅"],
        exemplo: line("えきにいきたいです。", "駅[えき]に行[い]きたいです。", "Quero ir à estação.", [
          b("e.ki", "HL", "estação", "lugar"),
          b("ni", "L", "[Destino]", "particula"),
          b("i.ki.ta.i", "LHHL", "quero ir", "verbo"),
          DESU,
        ]),
      },
      {
        ia: line("みぎにまがると、えきがありますよ。", "右[みぎ]に曲[ま]がると、駅[えき]がありますよ。", "Virando à direita, tem a estação.", [
          b("mi.gi", "LH", "direita", "lugar"),
          b("ni", "H", "[direção]", "particula"),
          b("ma.ga.ru", "LHH", "virar", "verbo"),
          b("to", "L", "[sempre que]", "particula"),
          b("e.ki", "HL", "estação", "sujeito"),
          b("ga", "L", "[Foco / sujeito]", "particula"),
          b("a.ri.ma._su", "LHHL", "existe", "verbo"),
          YO,
        ]),
        dica_pt: "Agradeça.",
        chaves: ["ありがとう"],
        exemplo: line("ありがとうございます。", "ありがとうございます。", "Obrigado.", [
          b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
          b("go.za.i.ma._su", "LHHHL", "[forma educada]", "expressao"),
        ]),
      },
      {
        ia: line("きをつけて。", "気[き]をつけて。", "Vá com cuidado! (fim)", [b("ki.o._tsu.ke.te", "LHHLL", "vá com cuidado", "expressao")]),
      },
    ],
  },

  // ───────────── Computador
  {
    id: "rp_con_computador",
    titulo: "O computador não funciona",
    categoria: "trabalho",
    emoji: "💻",
    parceiro: { nome: "Tanaka-san · colega", emoji: "🧑" },
    missao_pt: "Seu computador parou. Conte ao Tanaka, peça um conselho e pergunte o que fazer se a solução dele não funcionar.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_295"],
    system_prompt_cenario: "Colega ajuda com o computador: indica o botão e, se não resolver, sugere perguntar ao gerente.",
    roteiro: [
      {
        ia: line("どうしましたか。", "どうしましたか。", "O que houve?", [
          b("do.o", "HL", "como", "pergunta"),
          b("_shi.ma._shi.ta", "LLLL", "fez", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que o computador não funciona e pergunte o que fazer.",
        chaves: ["パソコン", "うごきません", "動きません"],
        exemplo: line("パソコンがうごきません。どうすればいいですか。", "パソコンが動[うご]きません。どうすればいいですか。", "O computador não funciona. O que devo fazer? (nova: ugoku = funcionar)", [
          b("pa.so.ko.n", "LHHH", "computador", "sujeito"),
          b("ga", "H", "[Foco / sujeito]", "particula"),
          b("u.go.ki.ma.se.n", "LHHHHL", "não funciona ★ nova", "verbo"),
          b("do.o", "HL", "como", "pergunta"),
          b("su.re.ba", "LLL", "bastando fazer", "verbo"),
          b("i.i", "HL", "bom", "adjetivo"),
          DESU,
          KA,
        ]),
      },
      {
        ia: line("このボタンをおすと、うごきますよ。", "このボタンを押[お]すと、動[うご]きますよ。", "Apertando este botão, ele funciona.", [
          b("ko.no", "LH", "este", "objeto"),
          b("bo.ta.n", "HHH", "botão", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("o.su", "LH", "apertar", "verbo"),
          b("to", "H", "[sempre que]", "particula"),
          b("u.go.ki.ma._su", "LHHHL", "funciona", "verbo"),
          YO,
        ]),
        dica_pt: "Pergunte o que fazer se não funcionar.",
        chaves: ["うごかなければ", "動かなければ", "どうしたら"],
        exemplo: line("うごかなければ、どうしたらいいですか。", "動[うご]かなければ、どうしたらいいですか。", "E se não funcionar, o que é melhor eu fazer?", [
          b("u.go.ka.na.ke.re.ba", "LHHLLLL", "bastando não funcionar", "verbo"),
          b("do.o", "HL", "como", "pergunta"),
          b("_shi.ta.ra", "LLL", "se fizer", "verbo"),
          b("i.i", "HL", "bom", "adjetivo"),
          DESU,
          KA,
        ]),
      },
      {
        ia: line("ぶちょうにきいたらいいですよ。", "部長[ぶちょう]に聞[き]いたらいいですよ。", "É bom perguntar ao gerente.", [
          b("bu.cho.o", "LHH", "gerente", "substantivo"),
          b("ni", "H", "[alvo]", "particula"),
          b("ki.i.ta.ra", "LHHL", "se perguntar", "verbo"),
          b("i.i", "HL", "bom", "adjetivo"),
          DESU,
          YO,
        ]),
        dica_pt: "Diga que entendeu.",
        chaves: ["わかり", "分かり"],
        exemplo: line("わかりました。", "わかりました。", "Entendi.", [WAKARIMASHITA]),
      },
      {
        ia: line("がんばってください。", "頑張[がんば]ってください。", "Boa sorte! (fim)", [
          b("ga.n.ba.t.te", "LHHLL", "esforce-se", "verbo"),
          b("ku.da.sa.i", "LLLL", "por favor", "verbo"),
        ]),
      },
    ],
  },
];
