import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 21 (Explicar motivos): justificar um atraso, recusar um convite e contar por que estuda
 * japonês. Usam as frases de `cards-motivos.ts` como resposta-modelo. ★ nova = palavra nova.
 */

export const cenariosMotivos: SeedScenario[] = [
  // ───────────── Atraso e hora extra
  {
    id: "rp_mot_atraso",
    titulo: "Por que você se atrasou?",
    categoria: "trabalho",
    emoji: "🚧",
    parceiro: { nome: "Kobayashi-kachō · chefe", emoji: "👔" },
    missao_pt:
      "Você chegou atrasado. Explique ao chefe que o trem parou, diga que está tudo bem e recuse a hora extra com educação, dando o motivo.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_189", "card_190"],
    system_prompt_cenario: "Chefe pergunta o motivo do atraso, se está tudo bem e pede hora extra; aceita deixar para amanhã.",
    roteiro: [
      {
        ia: line("どうしておくれたんですか。", "どうして遅[おく]れたんですか。", "Por que você se atrasou?", [
          b("do.o._shi.te", "HLLL", "por quê", "pergunta"),
          b("o.ku.re.ta", "LHHH", "atrasou", "verbo"),
          b("n", "L", "[é que: explicação]", "particula"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Explique que o trem parou.",
        chaves: ["でんしゃ", "電車", "とまった", "止まった"],
        exemplo_card: "card_190",
      },
      {
        ia: line("そうですか。だいじょうぶですか。", "そうですか。大丈夫[だいじょうぶ]ですか。", "Ah, é? Está tudo bem?", [
          b("so.o", "HL", "assim", "expressao"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
          b("da.i.jo.o.bu", "LHHLL", "tudo bem", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que sim, está tudo bem.",
        chaves: ["だいじょうぶ", "大丈夫"],
        exemplo: line("はい、だいじょうぶです。", "はい、大丈夫[だいじょうぶ]です。", "Sim, está tudo bem.", [
          b("ha.i", "HL", "sim", "expressao"),
          b("da.i.jo.o.bu", "LHHLL", "tudo bem", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
      },
      {
        ia: line("じゃあ、きょうはざんぎょうできますか。", "じゃあ、今日[きょう]は残業[ざんぎょう]できますか。", "Então, hoje dá para fazer hora extra? (nova: zangyou = hora extra)", [
          b("ja.a", "HL", "então", "expressao"),
          b("kyo.o", "HL", "hoje", "tempo"),
          b("wa", "L", "[Tópico]", "particula"),
          b("za.n.gyo.o", "LHHH", "hora extra ★ nova", "substantivo"),
          b("de.ki.ma._su", "HHHL", "é possível", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Recuse: desculpe, tenho um compromisso, então não dá.",
        chaves: ["ようじ", "用事", "できません"],
        exemplo: line("すみません、ようじがあるので、できません。", "すみません、用事[ようじ]があるので、できません。", "Desculpe, tenho um compromisso, então não dá. (nova: youji = compromisso)", [
          b("su.mi.ma.se.n", "LHHHL", "desculpe", "expressao"),
          b("yo.o.ji", "LHH", "compromisso ★ nova", "sujeito"),
          b("ga", "H", "[Foco / sujeito]", "particula"),
          b("a.ru", "HL", "existe (forma de dicionário)", "verbo"),
          b("no.de", "LL", "como, porque (suave)", "particula"),
          b("de.ki.ma.se.n", "LHHHL", "não dá", "verbo"),
        ]),
      },
      {
        ia: line("わかりました。じゃあ、あしたおねがいします。", "わかりました。じゃあ、明日[あした]お願[ねが]いします。", "Entendi. Então, amanhã, por favor. (fim)", [
          b("wa.ka.ri.ma._shi.ta", "LHHHLL", "entendi", "verbo"),
          b("ja.a", "HL", "então", "expressao"),
          b("a._shi.ta", "LHH", "amanhã", "tempo"),
          b("o.ne.ga.i.shi.ma._su", "LHHHHHL", "por favor", "verbo"),
        ]),
      },
    ],
  },

  // ───────────── Recusar um convite
  {
    id: "rp_mot_convite",
    titulo: "Hoje não vai dar",
    categoria: "social",
    emoji: "🛌",
    parceiro: { nome: "Yuki · amiga", emoji: "👩" },
    missao_pt: "A Yuki chama você para uma festa, mas você não está bem. Recuse com jeito, explique o motivo e diga que vai dormir.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_192", "card_187", "card_188"],
    system_prompt_cenario: "Amiga convida para a festa, pergunta o que houve e deseja melhoras.",
    roteiro: [
      {
        ia: line("こんばんのパーティー、いきませんか。", "今晩[こんばん]のパーティー、行[い]きませんか。", "Vamos à festa de hoje à noite? (nova: konban = hoje à noite)", [
          b("ko.n.ba.n", "HLLL", "hoje à noite ★ nova", "tempo"),
          b("no", "L", "[de]", "particula"),
          b("pa.a.ti.i", "HLLL", "festa", "lugar"),
          b("i.ki.ma.se.n", "LHHHL", "não vamos", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Recuse: como está ocupado, não pode ir.",
        chaves: ["いけません", "行けません", "いそがしい", "忙しい"],
        exemplo_card: "card_192",
      },
      {
        ia: line("どうしたんですか。", "どうしたんですか。", "O que aconteceu?", [
          b("do.o", "HL", "como, o quê", "pergunta"),
          b("_shi.ta", "LL", "aconteceu", "verbo"),
          b("n", "L", "[é que: explicação]", "particula"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Explique que está com dor de cabeça.",
        chaves: ["あたま", "頭", "いたい", "痛い"],
        exemplo_card: "card_188",
      },
      {
        ia: line("そうですか。だいじょうぶですか。", "そうですか。大丈夫[だいじょうぶ]ですか。", "Ah, é? Você está bem?", [
          b("so.o", "HL", "assim", "expressao"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
          b("da.i.jo.o.bu", "LHHLL", "tudo bem", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que sim e que hoje já vai dormir.",
        chaves: ["ねます", "寝ます"],
        exemplo: line("はい。きょうはもうねます。", "はい。今日[きょう]はもう寝[ね]ます。", "Sim. Hoje já vou dormir.", [
          b("ha.i", "HL", "sim", "expressao"),
          b("kyo.o", "HL", "hoje", "tempo"),
          b("wa", "L", "[Tópico]", "particula"),
          b("mo.o", "LH", "já", "adverbio"),
          b("ne.ma._su", "HHL", "durmo", "verbo"),
        ]),
      },
      {
        ia: line("おだいじに。", "お大事[だいじ]に。", "Melhoras! (fim)", [b("o.da.i.ji.ni", "LHHHH", "melhoras", "expressao")]),
      },
    ],
  },

  // ───────────── Por que japonês?
  {
    id: "rp_mot_japones",
    titulo: "Por que japonês?",
    categoria: "social",
    emoji: "🇯🇵",
    parceiro: { nome: "Sato-san · conhecido", emoji: "🧑" },
    missao_pt: "Um conhecido quer saber por que você estuda japonês. Dê o seu motivo e conte o que acha do idioma.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_195", "card_196", "card_095"],
    system_prompt_cenario: "Conhecido curioso e simpático: pergunta o motivo de estudar japonês e se é difícil.",
    roteiro: [
      {
        ia: line("どうしてにほんごをべんきょうしているんですか。", "どうして日本語[にほんご]を勉強[べんきょう]しているんですか。", "Por que você estuda japonês?", [
          b("do.o._shi.te", "HLLL", "por quê", "pergunta"),
          b("ni.ho.n.go", "LHHH", "japonês", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("be.n.kyo.o", "LHHH", "estudo", "substantivo"),
          b("_shi.te", "HH", "fazendo", "verbo"),
          b("i.ru", "HH", "está", "verbo"),
          b("n", "L", "[é que: explicação]", "particula"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga: porque quer trabalhar no Japão.",
        chaves: ["はたらきたい", "働きたい", "から"],
        exemplo_card: "card_196",
      },
      {
        ia: line("すごいですね。にほんごはむずかしくないですか。", "すごいですね。日本語[にほんご]は難[むずか]しくないですか。", "Que incrível! Japonês não é difícil?", [
          b("su.go.i", "LHL", "incrível", "adjetivo"),
          b("de.su", "LL", "é", "copula"),
          b("ne", "L", "[né]", "particula"),
          b("ni.ho.n.go", "LHHH", "japonês", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("mu.zu.ka._shi.ku.na.i", "LHHHHHL", "não é difícil", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que é difícil, mas interessante.",
        chaves: ["むずかしい", "難しい", "おもしろい", "面白い"],
        exemplo_card: "card_095",
      },
      {
        ia: line("がんばってくださいね。", "頑張[がんば]ってくださいね。", "Força nos estudos! (fim)", [
          b("ga.n.ba.t.te", "LHHLL", "esforce-se", "verbo"),
          b("ku.da.sa.i", "LLLL", "por favor", "verbo"),
          b("ne", "L", "[tá?]", "particula"),
        ]),
      },
    ],
  },
];
