import { seedCards } from "./cards";
import { b, emendar, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 44 (Revisão final): o ensaio com turnos curtos, uma conversa com um colega que mistura boato e conselho
 * e a avaliação oral B1 (marco do mês 12: 5 minutos de fala longa, sobre si, narrando e opinando). As respostas-modelo são
 * frases do baralho, já conferidas no OJAD.
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
const HANASHITE_KUDASAI = [b("ha.na._shi.te", "LHLL", "falar (forma -te)", "verbo"), b("ku.da.sa.i", "LLLL", "por favor", "verbo")];
const O = b("o", "H", "[Objeto]", "particula");
const OPINIAO = line("たいへんですが、たのしいとおもいます。", "大変[たいへん]ですが、楽[たの]しいと思[おも]います。", "É difícil, mas acho divertido.", [
  b("ta.i.he.n", "LHHH", "difícil", "adjetivo"),
  b("de._su", "HL", "é", "copula"),
  b("ga", "L", "[mas…]", "particula"),
  b("ta.no._shi.i", "LHHL", "divertido", "adjetivo"),
  b("to", "L", "[citação: que…]", "particula"),
  b("o.mo.i.ma._su", "LHHHL", "penso", "verbo"),
]);

export const cenariosRevisaoFinal: SeedScenario[] = [
  // ───────────── Ensaio
  {
    id: "rp_rev4_ensaio",
    titulo: "Ensaio da avaliação",
    categoria: "social",
    emoji: "🎓",
    parceiro: { nome: "Prof.ª Nakamura", emoji: "👩‍🏫" },
    missao_pt:
      "Ensaio em turnos curtos: fale de você, conte um incidente do começo ao fim, dê sua opinião com um motivo e diga o que quer para o futuro.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_386", "card_562", "card_196", "card_567", "card_538", "card_439", "card_454", "card_536", "card_547", "card_568", "card_570"],
    system_prompt_cenario: "Professora conduz a avaliação: nome e país, experiência, motivo, japonês, um incidente recente, opinião sobre a vida no Japão e planos.",
    roteiro: [
      // Sobre você
      {
        ia: line("おなまえとくにをおしえてください。", "お名前[なまえ]と国[くに]を教[おし]えてください。", "Diga o seu nome e o seu país, por favor.", [
          b("o.na.ma.e", "LHHH", "nome (educado)", "objeto"),
          b("to", "H", "[e]", "particula"),
          b("ku.ni", "LH", "país", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("o._shi.e.te", "LHHH", "ensinar (forma -te)", "verbo"),
          b("ku.da.sa.i", "HHHL", "por favor", "verbo"),
        ]),
        dica_pt: "Diga de onde você veio.",
        chaves: ["ブラジル", "まいりました", "参りました"],
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
        dica_pt: "Conte o seu trabalho.",
        chaves: ["しごと", "仕事"],
        exemplo_card: "card_562",
      },
      { ia: fala("card_195"), dica_pt: "Dê o seu motivo.", chaves: ["から"], exemplo_card: "card_196" },
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

      // Narrar
      {
        ia: line("きのうはどうでしたか。", "昨日[きのう]はどうでしたか。", "Como foi ontem?", [
          b("ki.no.o", "LHL", "ontem", "tempo"),
          b("wa", "L", "[Tópico]", "particula"),
          DOU,
          b("de._shi.ta", "LLL", "foi", "copula"),
          KA,
        ]),
        dica_pt: "Diga que, na verdade, foi um dia difícil.",
        chaves: ["じつは", "実は", "たいへん", "大変"],
        exemplo_card: "card_538",
      },
      { ia: fala("card_453"), dica_pt: "Conte que roubaram a sua carteira.", chaves: ["さいふ", "財布", "ぬすまれ", "盗まれ"], exemplo_card: "card_439" },
      {
        ia: line("それで、どうしましたか。", "それで、どうしましたか。", "E então, o que você fez?", [
          b("so.re.de", "LHH", "e então", "expressao"),
          DOU,
          b("_shi.ma._shi.ta", "LLLL", "fez", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que avisou a polícia.",
        chaves: ["けいさつ", "警察"],
        exemplo_card: "card_454",
      },
      { ia: fala("card_458"), dica_pt: "Conte como terminou: no fim, voltou de táxi.", chaves: ["けっきょく", "結局", "タクシー"], exemplo_card: "card_536" },

      // Opinar
      {
        ia: line("にほんのせいかつをどうおもいますか。", "日本[にほん]の生活[せいかつ]をどう思[おも]いますか。", "O que você acha da vida no Japão? (nova: seikatsu = vida, dia a dia)", [
          b("ni.ho.n", "LHH", "Japão", "lugar"),
          b("no", "H", "[de]", "particula"),
          b("se.i.ka.tsu", "LHHH", "vida, dia a dia ★ nova", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          DOU,
          OMOIMASU,
          KA,
        ]),
        dica_pt: "Dê sua opinião: é difícil, mas é divertida.",
        chaves: ["たいへん", "大変", "たのしい", "楽しい"],
        exemplo: OPINIAO,
      },
      {
        ia: line("にほんごはまいにちべんきょうしたほうがいいとおもいますか。", "日本語[にほんご]は毎日[まいにち]勉強[べんきょう]したほうがいいと思[おも]いますか。", "Você acha que é melhor estudar japonês todo dia?", [
          b("ni.ho.n.go", "LHHH", "japonês", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("ma.i.ni.chi", "HLLL", "todo dia", "tempo"),
          b("be.n.kyo.o", "LHHH", "estudo", "substantivo"),
          b("_shi.ta", "HH", "fez (forma -ta)", "verbo"),
          b("ho.o", "HL", "lado, opção", "substantivo"),
          b("ga", "L", "[Foco / sujeito]", "particula"),
          b("i.i", "HL", "bom", "adjetivo"),
          b("to", "L", "[citação: que…]", "particula"),
          OMOIMASU,
          KA,
        ]),
        dica_pt: "Responda: quanto mais pratica, melhor fica.",
        chaves: ["れんしゅう", "練習", "ほど"],
        exemplo_card: "card_547",
      },

      // Futuro e fechamento
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
      { ia: fala("card_578", "Você tem alguma pergunta?"), dica_pt: "Peça para fazer uma pergunta.", chaves: ["しつもん", "質問"], exemplo_card: "card_570" },
      {
        ia: line("がんばってくださいね。", "頑張[がんば]ってくださいね。", "Continue se esforçando! (fim)", [
          b("ga.n.ba.t.te", "LHHLL", "esforce-se", "verbo"),
          b("ku.da.sa.i", "LLLL", "por favor", "verbo"),
          b("ne", "L", "[tá?]", "particula"),
        ]),
      },
    ],
  },

  // ───────────── Conversa com um colega
  {
    id: "rp_rev4_colega",
    titulo: "Conversa com um colega",
    categoria: "trabalho",
    emoji: "☕",
    parceiro: { nome: "Suzuki-san · colega", emoji: "🧑" },
    missao_pt: "O Suzuki traz uma novidade e depois pede um conselho. Reaja, pergunte o que houve e ajude com sugestões.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_516", "card_512", "card_187", "card_491", "card_487"],
    system_prompt_cenario: "Colega conta um boato, diz que está cheio de trabalho, pede conselho e agradece.",
    roteiro: [
      { ia: fala("card_503"), dica_pt: "Pergunte de quem ele ouviu.", chaves: ["だれ", "誰", "きき", "聞き"], exemplo_card: "card_516" },
      { ia: fala("card_515"), dica_pt: "Diga que ficou surpreso.", chaves: ["びっくり"], exemplo_card: "card_512" },
      { ia: fala("card_495"), dica_pt: "Pergunte o que houve.", chaves: ["どうした"], exemplo_card: "card_187" },
      {
        ia: line("しごとがおおくて、ねられません。", "仕事[しごと]が多[おお]くて、寝[ね]られません。", "Tenho tanto trabalho que não consigo dormir.", [
          b("_shi.go.to", "LHH", "trabalho", "sujeito"),
          b("ga", "H", "[Foco / sujeito]", "particula"),
          b("o.o.ku.te", "HLLL", "muito e", "adjetivo"),
          b("ne.ra.re.ma.se.n", "LHHHHL", "não consigo dormir", "verbo"),
        ]),
        dica_pt: "Sugira descansar um pouco.",
        chaves: ["やすんだら", "休んだら"],
        exemplo_card: "card_491",
      },
      {
        ia: line("でも、いまはやすめません。", "でも、今[いま]は休[やす]めません。", "Mas agora não posso descansar.", [
          b("de.mo", "HL", "mas", "expressao"),
          b("i.ma", "HL", "agora", "tempo"),
          b("wa", "L", "[contraste]", "particula"),
          b("ya._su.me.ma.se.n", "LHHHHL", "não posso descansar", "verbo"),
        ]),
        dica_pt: "Diga que acha melhor conversar com o gerente.",
        chaves: ["そうだん", "相談"],
        exemplo_card: "card_487",
      },
      {
        ia: line("そうですね。ありがとうございます。", "そうですね。ありがとうございます。", "É verdade. Obrigado! (fim)", [
          b("so.o", "HL", "assim", "expressao"),
          DESU,
          b("ne", "L", "[né]", "particula"),
          b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
          b("go.za.i.ma._su", "LHHHL", "[forma educada]", "expressao"),
        ]),
      },
    ],
  },

  // ───────────── Avaliação oral (marco do mês 12)
  {
    id: "rp_rev4_avaliacao",
    titulo: "Avaliação oral B1",
    categoria: "social",
    emoji: "🎓",
    parceiro: { nome: "Prof.ª Nakamura", emoji: "👩‍🏫" },
    missao_pt: "O marco final: 5 minutos de fala, em quatro partes. Fale de você, conte algo que aconteceu, dê sua opinião e diga o que quer para o futuro.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_386", "card_562", "card_538", "card_439", "card_547", "card_568"],
    system_prompt_cenario: "Professora pede quatro falas longas: sobre a pessoa, um acontecimento, uma opinião e os planos.",
    roteiro: [
      {
        ia: line("まず、じぶんについてはなしてください。", "まず、自分[じぶん]について話[はな]してください。", "Primeiro, fale sobre você.", [
          b("ma.zu", "HL", "primeiro", "adverbio"),
          b("ji.bu.n", "LHH", "si mesmo", "substantivo"),
          b("ni.tsu.i.te", "HHLL", "sobre", "particula"),
          ...HANASHITE_KUDASAI,
        ]),
        dica_pt: "Diga quem você é, o que faz, por que estuda japonês e do que gosta.",
        aberto: {
          segundos: 90,
          pontos: [
            { rotulo: "Quem você é", chaves: ["ブラジル", "もうします", "申します", "まいりました", "参りました", "なまえ", "名前"] },
            { rotulo: "O que você faz", chaves: ["しごと", "仕事", "えいぎょう", "営業", "かいしゃ", "会社", "がくせい", "学生", "だいがく", "大学"] },
            { rotulo: "Por que estuda japonês", chaves: ["からです", "だから", "たいから", "ので", "ために"] },
            { rotulo: "Do que você gosta", chaves: ["しゅみ", "趣味", "すき", "好き"] },
          ],
        },
        exemplo: emendar(fala("card_386"), fala("card_562"), fala("card_196"), fala("card_567"), fala("card_140")),
      },
      {
        ia: line("つぎに、さいきんあったことをはなしてください。", "次[つぎ]に、最近[さいきん]あったことを話[はな]してください。", "Agora, conte algo que aconteceu há pouco tempo.", [
          b("tsu.gi", "LH", "em seguida", "adverbio"),
          b("ni", "L", "[em]", "particula"),
          b("sa.i.ki.n", "LHHH", "recentemente", "tempo"),
          b("a.t.ta", "HLL", "houve (forma -ta)", "verbo"),
          b("ko.to", "LH", "coisa", "substantivo"),
          b("o", "L", "[Objeto]", "particula"),
          ...HANASHITE_KUDASAI,
        ]),
        dica_pt: "Conte com começo, meio e fim: quando foi, o que aconteceu, o que você fez e como terminou.",
        aberto: {
          segundos: 90,
          pontos: [
            { rotulo: "Quando foi", chaves: ["きのう", "昨日", "せんしゅう", "先週", "このあいだ", "この間", "さいきん", "最近", "まえ", "前"] },
            { rotulo: "O que aconteceu", chaves: ["ました", "ったんです", "たんです"] },
            { rotulo: "A ordem dos fatos", chaves: ["それから", "そのあと", "その後", "ところが", "でも", "さいしょ", "最初"] },
            { rotulo: "Como terminou", chaves: ["けっきょく", "結局", "さいご", "最後"] },
          ],
        },
        exemplo: emendar(fala("card_538"), fala("card_439"), fala("card_454"), fala("card_534"), fala("card_536")),
      },
      {
        ia: line("にほんごのべんきょうについてどうおもいますか。", "日本語[にほんご]の勉強[べんきょう]についてどう思[おも]いますか。", "O que você acha de estudar japonês?", [
          b("ni.ho.n.go", "LHHH", "japonês", "substantivo"),
          b("no", "H", "[de]", "particula"),
          b("be.n.kyo.o", "LHHH", "estudo", "substantivo"),
          b("ni.tsu.i.te", "HHLL", "sobre", "particula"),
          DOU,
          OMOIMASU,
          KA,
        ]),
        dica_pt: "Dê sua opinião, explique o motivo e mostre o outro lado.",
        aberto: {
          segundos: 60,
          pontos: [
            { rotulo: "Sua opinião", chaves: ["おもいます", "思います", "おもって", "思って"] },
            { rotulo: "Um motivo", chaves: ["からです", "だから", "たいから", "ので", "ために"] },
            { rotulo: "O outro lado", chaves: ["でも", "しかし", "けど", "ですが", "のに"] },
          ],
        },
        exemplo: emendar(fala("card_533"), OPINIAO, fala("card_196"), fala("card_547")),
      },
      {
        ia: line("さいごに、これからのけいかくをはなしてください。", "最後[さいご]に、これからの計画[けいかく]を話[はな]してください。", "Por último, fale dos seus planos.", [
          b("sa.i.go", "HLL", "por último", "tempo"),
          b("ni", "L", "[em]", "particula"),
          b("ko.re.ka.ra", "LHHH", "daqui em diante", "tempo"),
          b("no", "L", "[de]", "particula"),
          b("ke.i.ka.ku", "LHHH", "plano", "objeto"),
          O,
          ...HANASHITE_KUDASAI,
        ]),
        dica_pt: "Diga o que quer fazer, quando e por quê.",
        aberto: {
          segundos: 60,
          pontos: [
            { rotulo: "O que quer fazer", chaves: ["たいです", "たいと", "つもり", "よてい", "予定", "おもって", "思って"] },
            { rotulo: "Quando", chaves: ["しょうらい", "将来", "らいねん", "来年", "らいげつ", "来月", "いつか", "ねんご", "年後"] },
            { rotulo: "Por quê", chaves: ["からです", "だから", "たいから", "ので", "ために"] },
          ],
        },
        exemplo: emendar(fala("card_568"), fala("card_196")),
      },
      {
        ia: line("がんばってくださいね。", "頑張[がんば]ってくださいね。", "Continue se esforçando! (fim)", [
          b("ga.n.ba.t.te", "LHHLL", "esforce-se", "verbo"),
          b("ku.da.sa.i", "LLLL", "por favor", "verbo"),
          b("ne", "L", "[tá?]", "particula"),
        ]),
      },
    ],
  },
];
