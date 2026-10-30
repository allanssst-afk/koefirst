import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 19 (Conversa com amigos): tudo na fala casual. Usam as frases de `cards-casual.ts` como
 * resposta-modelo. ★ nova = palavra nova.
 */

const KENJI = { nome: "Kenji · amigo", emoji: "🧑" };
const YUKI = { nome: "Yuki · amiga", emoji: "👩" };

export const cenariosCasual: SeedScenario[] = [
  // ───────────── Conversa com o Kenji
  {
    id: "rp_cas_kenji",
    titulo: "E aí, Kenji?",
    categoria: "social",
    emoji: "🤙",
    parceiro: KENJI,
    missao_pt:
      "Você encontra o Kenji. Converse do jeito casual: diga que está bem, conte que viu um filme ontem, diga que não foi muito legal e aceite o convite dele.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_164", "card_166", "card_168", "card_170"],
    system_prompt_cenario: "Amigo próximo, fala casual: pergunta se você está bem, o que fez ontem, se o filme foi bom e convida para sair.",
    roteiro: [
      {
        ia: line("げんき？", "元気[げんき]？", "Tudo bem?", [b("ge.n.ki", "HLL", "bem", "adjetivo")]),
        dica_pt: "Diga que está bem, casual.",
        chaves: ["げんき", "元気", "うん"],
        exemplo_card: "card_164",
      },
      {
        ia: line("きのう、なにした？", "昨日[きのう]、何[なに]した？", "O que você fez ontem?", [
          b("ki.no.o", "LHL", "ontem", "tempo"),
          b("na.ni", "HL", "o quê", "pergunta"),
          b("_shi.ta", "LL", "fez", "verbo"),
        ]),
        dica_pt: "Conte que viu um filme.",
        chaves: ["えいが", "映画", "みた", "見た"],
        exemplo_card: "card_166",
      },
      {
        ia: line("おもしろかった？", "面白[おもしろ]かった？", "Foi legal?", [b("o.mo.shi.ro.ka.t.ta", "LHHHLLL", "foi legal", "adjetivo")]),
        dica_pt: "Diga que não foi muito legal.",
        chaves: ["おもしろくなかった", "面白くなかった", "ううん"],
        exemplo_card: "card_168",
      },
      {
        ia: line("そっか。じゃあ、こんどいっしょにいかない？", "そっか。じゃあ、今度[こんど]一緒[いっしょ]に行[い]かない？", "Ah, tá. Então, vamos juntos da próxima vez? (nova: sokka = ah, entendi)", [
          b("so.k.ka", "HLL", "ah, entendi ★ nova", "expressao"),
          b("ja.a", "HL", "então", "expressao"),
          b("ko.n.do", "HLL", "da próxima vez", "tempo"),
          b("i.s.sho", "LHH", "juntos", "adverbio"),
          b("ni", "H", "[de modo]", "particula"),
          b("i.ka.na.i", "LHHH", "não vamos?", "verbo"),
        ]),
        dica_pt: "Aceite com animação.",
        chaves: ["いこう", "行こう", "いいね"],
        exemplo_card: "card_170",
      },
      {
        ia: line("じゃあ、またね。", "じゃあ、またね。", "Então, até mais! (fim)", [
          b("ja.a", "HL", "então", "expressao"),
          b("ma.ta", "LH", "até mais", "expressao"),
          b("ne", "H", "[tá]", "particula"),
        ]),
      },
    ],
  },

  // ───────────── Combinar o fim de semana
  {
    id: "rp_cas_yuki",
    titulo: "Tá livre amanhã?",
    categoria: "social",
    emoji: "🎤",
    parceiro: YUKI,
    missao_pt: "A Yuki quer sair amanhã, mas você trabalha. Explique, diga que no sábado está livre e aceite ir ao karaokê.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_173", "card_174", "card_170"],
    system_prompt_cenario: "Amiga animada, fala casual: chama para amanhã, depois para sábado no karaokê.",
    roteiro: [
      {
        ia: line("あした、ひま？", "明日[あした]、暇[ひま]？", "Tá livre amanhã?", [
          b("a._shi.ta", "LHH", "amanhã", "tempo"),
          b("hi.ma", "LH", "livre", "adjetivo"),
        ]),
        dica_pt: "Diga que, foi mal, amanhã tem o bico.",
        chaves: ["ごめん", "バイト", "ばいと"],
        exemplo_card: "card_174",
      },
      {
        ia: line("そっか。じゃあ、どようびは？", "そっか。じゃあ、土曜日[どようび]は？", "Ah, tá. E sábado?", [
          b("so.k.ka", "HLL", "ah, entendi", "expressao"),
          b("ja.a", "HL", "então", "expressao"),
          b("do.yo.o.bi", "LHLL", "sábado", "topico"),
          b("wa", "L", "[e quanto a…?]", "particula"),
        ]),
        dica_pt: "Diga que no sábado está livre.",
        chaves: ["ひま", "暇", "どようび", "土曜日"],
        exemplo: line("どようびはひまだよ。", "土曜日[どようび]は暇[ひま]だよ。", "Sábado tô livre!", [
          b("do.yo.o.bi", "LHLL", "sábado", "topico"),
          b("wa", "L", "[contraste]", "particula"),
          b("hi.ma", "LH", "livre", "adjetivo"),
          b("da", "H", "é (casual)", "copula"),
          b("yo", "L", "[te conto]", "particula"),
        ]),
      },
      {
        ia: line("じゃあ、カラオケいかない？", "じゃあ、カラオケ行[い]かない？", "Então, bora no karaokê?", [
          b("ja.a", "HL", "então", "expressao"),
          b("ka.ra.o.ke", "LHHH", "karaokê", "lugar"),
          b("i.ka.na.i", "HHHH", "não vamos?", "verbo"),
        ]),
        dica_pt: "Aceite: boa, vamos!",
        chaves: ["いこう", "行こう", "いいね"],
        exemplo_card: "card_170",
      },
      {
        ia: line("やった！", "やった！", "Oba! (nova: yatta = oba, consegui) (fim)", [b("ya.t.ta", "LHH", "oba! ★ nova", "expressao")]),
      },
    ],
  },

  // ───────────── Novidade
  {
    id: "rp_cas_novidade",
    titulo: "Você sabia?",
    categoria: "trabalho",
    emoji: "💍",
    parceiro: { nome: "Mika · colega próxima", emoji: "👩‍💼" },
    missao_pt: "Uma colega próxima conta uma novidade sobre o Suzuki-san. Reaja dizendo que não sabia e mostre que quer ir à festa.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_172"],
    system_prompt_cenario: "Colega próxima, fala casual: conta que o Suzuki-san casou e que haverá festa no mês que vem.",
    roteiro: [
      {
        ia: line("ねえ、すずきさん、けっこんしたよ。", "ねえ、鈴木[すずき]さん、結婚[けっこん]したよ。", "Ei, o Suzuki-san casou!", [
          b("ne.e", "HL", "ei", "expressao"),
          b("su.zu._ki", "LHH", "Suzuki", "topico"),
          b("sa.n", "HH", "sr.", "topico"),
          b("ke.k.ko.n", "LHHH", "casamento", "substantivo"),
          b("_shi.ta", "HH", "fez (forma -ta)", "verbo"),
          b("yo", "L", "[te conto]", "particula"),
        ]),
        dica_pt: "Reaja: eu não sabia!",
        chaves: ["しらなかった", "知らなかった"],
        exemplo_card: "card_172",
      },
      {
        ia: line("うん。らいげつ、パーティーがあるよ。", "うん。来月[らいげつ]、パーティーがあるよ。", "É. Mês que vem tem festa. (nova: raigetsu = mês que vem)", [
          b("u.n", "HL", "é, sim", "expressao"),
          b("ra.i.ge.tsu", "HLLL", "mês que vem ★ nova", "tempo"),
          b("pa.a.ti.i", "HLLL", "festa", "sujeito"),
          b("ga", "L", "[Foco / sujeito]", "particula"),
          b("a.ru", "HL", "existe, tem", "verbo"),
          b("yo", "L", "[te conto]", "particula"),
        ]),
        dica_pt: "Diga: sério? Quero ir!",
        chaves: ["いきたい", "行きたい", "ほんとう", "本当"],
        exemplo: line("ほんとう？いきたい！", "本当[ほんとう]？行[い]きたい！", "Sério? Quero ir! (nova: hontou = sério, verdade)", [
          b("ho.n.to.o", "LHHH", "sério?, verdade ★ nova", "expressao"),
          b("i._ki.ta.i", "LHHL", "quero ir", "verbo"),
        ]),
      },
      {
        ia: line("いっしょにいこう！", "一緒[いっしょ]に行[い]こう！", "Vamos juntas! (fim)", [
          b("i.s.sho", "LHH", "juntos", "adverbio"),
          b("ni", "H", "[de modo]", "particula"),
          b("i.ko.o", "HHH", "vamos", "verbo"),
        ]),
      },
    ],
  },
];
