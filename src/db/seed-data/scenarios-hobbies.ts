import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 17 (Hobbies): conversar sobre passatempos, dizer o que sabe fazer numa entrevista e responder
 * a um convite. Usam as frases de `cards-hobbies.ts` como resposta-modelo. ★ nova = palavra nova.
 */

const iidesune = line("いいですね。", "いいですね。", "Que legal!", [
  b("i.i", "HL", "bom", "adjetivo"),
  b("de.su", "LL", "é", "copula"),
  b("ne", "L", "[né]", "particula"),
]);

export const cenariosHobbies: SeedScenario[] = [
  // ───────────── Conversa sobre hobbies
  {
    id: "rp_hob_conversa",
    titulo: "Qual é o seu hobby?",
    categoria: "social",
    emoji: "🎸",
    parceiro: { nome: "Mika · amiga nova", emoji: "👩‍🎤" },
    missao_pt:
      "Uma amiga nova quer saber dos seus hobbies. Diga que é ver filmes, conte que tipo de filme gosta, reaja quando ela disser que toca piano e conte que está aprendendo violão.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_139", "card_140", "card_149"],
    system_prompt_cenario: "Amiga nova: pergunta seus hobbies e o tipo de filme, conta que gosta de música e toca piano.",
    roteiro: [
      {
        ia: line("しゅみはなんですか。", "趣味[しゅみ]は何[なん]ですか。", "Qual é o seu hobby?", [
          b("shu.mi", "HL", "hobby", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("na.n", "HL", "o quê", "pergunta"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que seu hobby é ver filmes.",
        chaves: ["えいが", "映画", "みる", "見る"],
        exemplo_card: "card_140",
      },
      {
        ia: line("どんなえいががすきですか。", "どんな映画[えいが]が好[す]きですか。", "Que tipo de filme você gosta?", [
          b("do.n.na", "HLL", "que tipo de", "pergunta"),
          b("e.i.ga", "LHH", "filme", "objeto"),
          b("ga", "H", "[Foco do gosto]", "particula"),
          b("_su.ki", "LH", "gosta", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que gosta de anime.",
        chaves: ["アニメ", "あにめ"],
        exemplo: line("アニメがすきです。", "アニメが好[す]きです。", "Gosto de anime.", [
          b("a.ni.me", "HLL", "anime", "objeto"),
          b("ga", "L", "[Foco do gosto]", "particula"),
          b("_su.ki", "LH", "gosto", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
      },
      {
        ia: line("わたしはピアノをひくことができますよ。", "私[わたし]はピアノを弾[ひ]くことができますよ。", "Eu sei tocar piano!", [
          b("wa.ta._shi", "LHH", "eu", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("pi.a.no", "LHH", "piano", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("_hi.ku", "LH", "tocar", "verbo"),
          b("ko.to", "HL", "o ato de", "substantivo"),
          b("ga", "L", "[Foco]", "particula"),
          b("de.ki.ma.su", "LHHL", "consigo", "verbo"),
          b("yo", "L", "[te conto]", "particula"),
        ]),
        dica_pt: "Reaja: que incrível!",
        chaves: ["すごい"],
        exemplo: line("すごいですね。", "すごいですね。", "Que incrível! (nova: sugoi)", [
          b("su.go.i", "LHL", "incrível ★ nova", "adjetivo"),
          b("de.su", "LL", "é", "copula"),
          b("ne", "L", "[né]", "particula"),
        ]),
      },
      {
        ia: line("なにかひくことができますか。", "何[なに]か弾[ひ]くことができますか。", "Você toca alguma coisa? (nanika = algo)", [
          b("na.ni.ka", "HLL", "algo, alguma coisa", "pergunta"),
          b("_hi.ku", "LH", "tocar", "verbo"),
          b("ko.to", "HL", "o ato de", "substantivo"),
          b("ga", "L", "[Foco]", "particula"),
          b("de.ki.ma._su", "LHHL", "consegue", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Conte que está aprendendo violão.",
        chaves: ["ギター", "ならって", "習って"],
        exemplo_card: "card_149",
      },
      { ia: { ...iidesune, pt: "Que legal! (fim)" } },
    ],
  },

  // ───────────── Entrevista
  {
    id: "rp_hob_entrevista",
    titulo: "O que você sabe fazer?",
    categoria: "trabalho",
    emoji: "📋",
    parceiro: { nome: "Entrevistador", emoji: "🧑‍💼" },
    missao_pt: "Numa entrevista de emprego, responda com honestidade o que você consegue fazer: japonês, inglês e dirigir.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_143", "card_144"],
    system_prompt_cenario: "Entrevistador educado: pergunta se você fala japonês, inglês e se dirige.",
    roteiro: [
      {
        ia: line("にほんごではなすことができますか。", "日本語[にほんご]で話[はな]すことができますか。", "Você consegue falar em japonês?", [
          b("ni.ho.n.go", "LHHH", "japonês", "substantivo"),
          b("de", "H", "[Meio / instrumento]", "particula"),
          b("ha.na._su", "LHL", "falar", "verbo"),
          b("ko.to", "LH", "o ato de", "substantivo"),
          b("ga", "L", "[Foco]", "particula"),
          b("de.ki.ma._su", "LHHL", "é possível", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que consegue um pouco.",
        chaves: ["すこし", "少し", "できます"],
        exemplo_card: "card_144",
      },
      {
        ia: line("えいごは。", "英語[えいご]は。", "E inglês? (nova: eigo = inglês)", [
          b("e.i.go", "LHH", "inglês ★ nova", "topico"),
          b("wa", "H", "[e quanto a…?]", "particula"),
        ]),
        dica_pt: "Diga que sim, consegue.",
        chaves: ["できます"],
        exemplo: line("はい、できます。", "はい、できます。", "Sim, consigo.", [
          b("ha.i", "HL", "sim", "expressao"),
          b("de.ki.ma._su", "LHHL", "consigo", "verbo"),
        ]),
      },
      {
        ia: line("うんてんすることができますか。", "運転[うんてん]することができますか。", "Você sabe dirigir? (nova: unten = direção)", [
          b("u.n.te.n", "LHHH", "direção (de carro) ★ nova", "substantivo"),
          b("su.ru", "HH", "fazer (forma de dicionário)", "verbo"),
          b("ko.to", "HH", "o ato de", "substantivo"),
          b("ga", "L", "[Foco]", "particula"),
          b("de.ki.ma._su", "LHHL", "é possível", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que não sabe.",
        chaves: ["できません"],
        exemplo: line("いいえ、できません。", "いいえ、できません。", "Não, não sei.", [
          b("i.i.e", "LHH", "não", "expressao"),
          b("de.ki.ma.se.n", "LHHHL", "não consigo", "verbo"),
        ]),
      },
      {
        ia: line("わかりました。ありがとうございました。", "わかりました。ありがとうございました。", "Entendi. Muito obrigado. (fim)", [
          b("wa.ka.ri.ma._shi.ta", "LHHHLL", "entendi", "verbo"),
          b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
          b("go.za.i.ma._shi.ta", "LHHHLL", "[educado, pelo que já aconteceu]", "expressao"),
        ]),
      },
    ],
  },

  // ───────────── Convite para a piscina
  {
    id: "rp_hob_convite",
    titulo: "Piscina ou montanha?",
    categoria: "social",
    emoji: "⛰️",
    parceiro: { nome: "Kenji · amigo", emoji: "🧑" },
    missao_pt: "Um amigo convida você para a piscina, mas você não sabe nadar. Conte do que você gosta de fazer no fim de semana e aceite o novo plano.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_145", "card_147"],
    system_prompt_cenario: "Amigo animado: convida para a piscina, depois propõe a montanha no domingo.",
    roteiro: [
      {
        ia: line("いっしょにプールにいきませんか。", "一緒[いっしょ]にプールに行[い]きませんか。", "Vamos juntos à piscina? (nova: puuru = piscina)", [
          b("i.s.sho", "LHH", "juntos", "adverbio"),
          b("ni", "H", "[de modo]", "particula"),
          b("pu.u.ru", "HLL", "piscina ★ nova", "lugar"),
          b("ni", "L", "[Destino →]", "particula"),
          b("i.ki.ma.se.n", "LHHHL", "não vamos", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que não sabe nadar.",
        chaves: ["およぐ", "泳ぐ", "できません"],
        exemplo_card: "card_145",
      },
      {
        ia: line("そうですか。じゃあ、やまはどうですか。", "そうですか。じゃあ、山[やま]はどうですか。", "Ah, é? Então, que tal a montanha?", [
          b("so.o", "HL", "assim", "expressao"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
          b("ja.a", "HL", "então", "expressao"),
          b("ya.ma", "LH", "montanha", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("do.o", "HL", "como", "pergunta"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Conte que costuma subir montanhas no fim de semana.",
        chaves: ["やま", "山", "のぼります", "登ります"],
        exemplo_card: "card_147",
      },
      {
        ia: line("いいですね。こんどのにちようびにいきましょう。", "いいですね。今度[こんど]の日曜日[にちようび]に行[い]きましょう。", "Boa! Vamos no próximo domingo.", [
          b("i.i", "HL", "bom", "adjetivo"),
          b("de.su", "LL", "é", "copula"),
          b("ne", "L", "[né]", "particula"),
          b("ko.n.do", "HLL", "próximo, desta vez", "tempo"),
          b("no", "L", "[de]", "particula"),
          b("ni.chi.yo.o.bi", "LHHLL", "domingo", "tempo"),
          b("ni", "L", "[Ponto no tempo]", "particula"),
          b("i.ki.ma.sho.o", "LHHHL", "vamos", "verbo"),
        ]),
        dica_pt: "Aceite: sim, vamos.",
        chaves: ["いきましょう", "行きましょう"],
        exemplo: line("はい、いきましょう。", "はい、行[い]きましょう。", "Sim, vamos!", [
          b("ha.i", "HL", "sim", "expressao"),
          b("i.ki.ma.sho.o", "LHHHL", "vamos", "verbo"),
        ]),
      },
      {
        ia: line("たのしみです。", "楽[たの]しみです。", "Mal posso esperar! (nova: tanoshimi = expectativa boa) (fim)", [
          b("ta.no._shi.mi", "LHHL", "algo esperado com alegria ★ nova", "substantivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
      },
    ],
  },
];
