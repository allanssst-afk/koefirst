import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 20 (Dar opinião): a reunião sobre o plano, o palpite do tempo e a aula de japonês.
 * Usam as frases de `cards-opiniao.ts` como resposta-modelo. ★ nova = palavra nova.
 */

export const cenariosOpiniao: SeedScenario[] = [
  // ───────────── Reunião
  {
    id: "rp_opi_reuniao",
    titulo: "O que você acha do plano?",
    categoria: "trabalho",
    emoji: "📊",
    parceiro: { nome: "Kobayashi-kachō · chefe", emoji: "👔" },
    missao_pt: "O chefe quer sua opinião sobre um plano. Diga que acha bom, explique que é barato e discorde com educação quando ele citar outro colega.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_176", "card_181", "card_186"],
    system_prompt_cenario: "Chefe pede opinião sobre um plano, pergunta o motivo e cita a opinião contrária do Suzuki-san.",
    roteiro: [
      {
        ia: line("このけいかくをどうおもいますか。", "この計画[けいかく]をどう思[おも]いますか。", "O que você acha deste plano? (nova: keikaku = plano)", [
          b("ko.no", "LH", "este", "objeto"),
          b("ke.i.ka.ku", "HHHH", "plano ★ nova", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("do.o", "HL", "como", "pergunta"),
          b("o.mo.i.ma._su", "LHHHL", "acha", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que acha bom.",
        chaves: ["いいと", "おもいます", "思います"],
        exemplo_card: "card_176",
      },
      {
        ia: line("どうしてそうおもいますか。", "どうしてそう思[おも]いますか。", "Por que você acha isso?", [
          b("do.o._shi.te", "HLLL", "por quê", "pergunta"),
          b("so.o", "LH", "assim", "adverbio"),
          b("o.mo.i.ma._su", "HHHHL", "acha", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga: porque é barato.",
        chaves: ["やすい", "安い"],
        exemplo: line("やすいからです。", "安[やす]いからです。", "Porque é barato. (nova: yasui = barato)", [
          b("ya.su.i", "LHL", "barato ★ nova", "adjetivo"),
          b("ka.ra", "LL", "[porque]", "particula"),
          b("de._su", "LL", "é", "copula"),
        ]),
      },
      {
        ia: line("すずきさんはたかいといいました。", "鈴木[すずき]さんは高[たか]いと言[い]いました。", "O Suzuki-san disse que é caro.", [
          b("su.zu._ki", "LHH", "Suzuki", "topico"),
          b("sa.n", "HH", "sr.", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("ta.ka.i", "LHL", "caro", "adjetivo"),
          b("to", "L", "[citação: que…]", "particula"),
          b("i.i.ma._shi.ta", "LHHLL", "disse", "verbo"),
        ]),
        dica_pt: "Discorde com educação: eu não acho.",
        chaves: ["おもいません", "思いません"],
        exemplo_card: "card_181",
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

  // ───────────── O tempo de amanhã
  {
    id: "rp_opi_tempo",
    titulo: "Vai chover amanhã?",
    categoria: "social",
    emoji: "🌦️",
    parceiro: { nome: "Yuki · amiga", emoji: "👩" },
    missao_pt: "Vocês querem passear amanhã. Dê seu palpite sobre a chuva e, quando a Yuki contar o que a TV disse, tranquilize-a.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_178", "card_185"],
    system_prompt_cenario: "Amiga planejando um passeio: pergunta sobre o tempo e conta a previsão da TV.",
    roteiro: [
      {
        ia: line("あしたのてんきはどうでしょうか。", "明日[あした]の天気[てんき]はどうでしょうか。", "Como será o tempo amanhã?", [
          b("a._shi.ta", "LHH", "amanhã", "tempo"),
          b("no", "L", "[de]", "particula"),
          b("te.n.ki", "HLL", "tempo, clima", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("do.o", "HL", "como", "pergunta"),
          b("de.sho.o", "LLL", "deve ser", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que acha que vai chover.",
        chaves: ["あめ", "雨", "おもいます", "思います"],
        exemplo_card: "card_178",
      },
      {
        ia: line("テレビはあしたははれるといいましたよ。", "テレビは明日[あした]は晴[は]れると言[い]いましたよ。", "A TV disse que amanhã faz sol.", [
          b("te.re.bi", "HLL", "televisão", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("a._shi.ta", "LHH", "amanhã", "tempo"),
          b("wa", "L", "[contraste]", "particula"),
          b("ha.re.ru", "LHL", "abrir o tempo", "verbo"),
          b("to", "L", "[citação: que…]", "particula"),
          b("i.i.ma._shi.ta", "LHHLL", "disse", "verbo"),
          b("yo", "L", "[te conto]", "particula"),
        ]),
        dica_pt: "Diga que provavelmente vai dar tudo certo.",
        chaves: ["だいじょうぶ", "大丈夫", "たぶん"],
        exemplo_card: "card_185",
      },
      {
        ia: line("じゃあ、いきましょう。", "じゃあ、行[い]きましょう。", "Então, vamos! (fim)", [
          b("ja.a", "HL", "então", "expressao"),
          b("i.ki.ma.sho.o", "LHHHL", "vamos", "verbo"),
        ]),
      },
    ],
  },

  // ───────────── Aula de japonês
  {
    id: "rp_opi_aula",
    titulo: "Como se diz isto?",
    categoria: "social",
    emoji: "✏️",
    parceiro: { nome: "Prof.ª Nakamura", emoji: "👩‍🏫" },
    missao_pt: "Na aula, pergunte como se diz um objeto em japonês e conte à professora o que você acha de estudar.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_183", "card_095", "card_180"],
    system_prompt_cenario: "Professora gentil: ensina a palavra lápis e pergunta o que você acha de estudar japonês.",
    roteiro: [
      {
        ia: line("なにかしつもんはありますか。", "何[なに]か質問[しつもん]はありますか。", "Alguma pergunta?", [
          b("na.ni.ka", "HLL", "algum, alguma", "pergunta"),
          b("_shi.tsu.mo.n", "LHHH", "pergunta", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("a.ri.ma._su", "LHHL", "existe", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Aponte para um lápis e pergunte como se diz em japonês.",
        chaves: ["いいます", "言います", "なんと", "何と"],
        exemplo_card: "card_183",
      },
      {
        ia: line("それはえんぴつといいます。", "それは鉛筆[えんぴつ]と言[い]います。", "Isso se chama enpitsu (lápis). (nova: enpitsu = lápis)", [
          b("so.re", "LH", "isso", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("e.n._pi.tsu", "LHHH", "lápis ★ nova", "substantivo"),
          b("to", "H", "[citação: que…]", "particula"),
          b("i.i.ma._su", "LHHL", "diz-se", "verbo"),
        ]),
        dica_pt: "Diga que entendeu.",
        chaves: ["わかり", "分かり"],
        exemplo_card: "card_030",
      },
      {
        ia: line("にほんごのべんきょうはどうおもいますか。", "日本語[にほんご]の勉強[べんきょう]はどう思[おも]いますか。", "O que você acha de estudar japonês?", [
          b("ni.ho.n.go", "LHHH", "japonês", "substantivo"),
          b("no", "H", "[de]", "particula"),
          b("be.n.kyo.o", "LHHH", "estudo", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("do.o", "HL", "como", "pergunta"),
          b("o.mo.i.ma._su", "LHHHL", "acha", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que é difícil, mas interessante.",
        chaves: ["むずかしい", "難しい", "おもしろい", "面白い"],
        exemplo_card: "card_095",
      },
      {
        ia: line("わたしもそうおもいます。", "私[わたし]もそう思[おも]います。", "Eu também acho. (fim)", [
          b("wa.ta._shi", "LHH", "eu", "topico"),
          b("mo", "H", "[também]", "particula"),
          b("so.o", "LH", "assim", "adverbio"),
          b("o.mo.i.ma._su", "HHHHL", "penso", "verbo"),
        ]),
      },
    ],
  },
];
