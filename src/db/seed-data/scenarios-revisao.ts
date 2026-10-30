import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 14 (Revisão da Fase 1): a conversa de 2 minutos (marco do mês 3) e um dia na cidade.
 * As respostas-modelo são frases das unidades 1–13; as falas do parceiro foram conferidas no OJAD.
 */

const SATO = { nome: "Sato-san · numa festa", emoji: "🧑" };
const CAIXA = { nome: "Caixa da loja de conveniência", emoji: "🧑‍💼" };

export const cenariosRevisao: SeedScenario[] = [
  // ───────────── Conversa de 2 minutos
  {
    id: "rp_rev_conversa",
    titulo: "Conversa de 2 minutos",
    categoria: "social",
    emoji: "🗣️",
    parceiro: SATO,
    missao_pt:
      "O grande teste da Fase 1: numa festa, o Sato-san puxa conversa. Apresente-se, diga de onde é, onde mora e o que faz, conte o que acha do japonês e do seu fim de semana, convide-o para um filme e se despeça. Tudo só falando.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_006", "card_007", "card_083", "card_008", "card_024", "card_095", "card_104", "card_114"],
    system_prompt_cenario:
      "Pessoa simpática numa festa, conversa de 2 minutos: apresentação, origem, moradia, trabalho, japonês, fim de semana, filmes e convite.",
    roteiro: [
      {
        ia: line("はじめまして。さとうです。", "はじめまして。佐藤[さとう]です。", "Muito prazer. Sou o Sato.", [
          b("ha.ji.me.ma._shi.te", "LHHHLL", "muito prazer", "expressao"),
          b("sa.to.o", "HLL", "Sato (sobrenome)", "substantivo"),
          b("de._su", "LL", "sou", "copula"),
        ]),
        dica_pt: "Responda: muito prazer.",
        chaves: ["はじめまして", "初めまして"],
        exemplo_card: "card_006",
      },
      {
        ia: line("おくにはどちらですか。", "お国[くに]はどちらですか。", "De que país você é? (nova: okuni = seu país; dochira = qual, onde — educado)", [
          b("o.ku.ni", "LHH", "o seu país ★ nova", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("do.chi.ra", "HLL", "qual, onde (educado) ★ nova", "pergunta"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que é brasileiro(a).",
        chaves: ["ブラジル"],
        exemplo_card: "card_007",
      },
      {
        ia: line("どこにすんでいますか。", "どこに住[す]んでいますか。", "Onde você mora?", [
          b("do.ko", "HL", "onde", "pergunta"),
          b("ni", "L", "[Lugar onde está]", "particula"),
          b("su.n.de", "HLL", "morando", "verbo"),
          b("i.ma._su", "LLL", "está", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga onde mora.",
        chaves: ["すんで", "住んで"],
        exemplo_card: "card_083",
      },
      {
        ia: line("おしごとは。", "お仕事[しごと]は。", "E o trabalho?", [
          b("o.shi.go.to", "LHHH", "o trabalho (de você)", "topico"),
          b("wa", "H", "[e quanto a…?]", "particula"),
        ]),
        dica_pt: "Diga que é funcionário(a) de empresa.",
        chaves: ["かいしゃいん", "会社員"],
        exemplo_card: "card_008",
      },
      {
        ia: line("まいにちいそがしいですか。", "毎日[まいにち]忙[いそが]しいですか。", "Você é ocupado todo dia?", [
          b("ma.i.ni.chi", "HLLL", "todo dia", "tempo"),
          b("i.so.ga._shi.i", "LHHHL", "ocupado", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que hoje está ocupado(a).",
        chaves: ["いそがしい", "忙しい"],
        exemplo_card: "card_024",
      },
      {
        ia: line("にほんごはどうですか。", "日本語[にほんご]はどうですか。", "E o japonês, como está?", [
          b("ni.ho.n.go", "LHHH", "japonês", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("do.o", "HL", "como", "pergunta"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que é difícil, mas interessante.",
        chaves: ["むずかしい", "難しい", "おもしろい", "面白い"],
        exemplo_card: "card_095",
      },
      {
        ia: line("しゅうまつはなにをしましたか。", "週末[しゅうまつ]は何[なに]をしましたか。", "O que você fez no fim de semana?", [
          b("shu.u.ma.tsu", "LHHH", "fim de semana", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("na.ni", "HL", "o quê", "pergunta"),
          b("o", "L", "[Objeto]", "particula"),
          b("shi.ma._shi.ta", "LHLL", "fez", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Conte que viu um filme com amigos no sábado.",
        chaves: ["えいが", "映画", "みました", "見ました"],
        exemplo_card: "card_104",
      },
      {
        ia: line("えいががすきですか。", "映画[えいが]が好[す]きですか。", "Você gosta de filmes?", [
          b("e.i.ga", "LHH", "filme", "objeto"),
          b("ga", "H", "[Foco do gosto]", "particula"),
          b("_su.ki", "LH", "gosta", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que sim, gosta.",
        chaves: ["すき", "好き"],
        exemplo: line("はい、すきです。", "はい、好[す]きです。", "Sim, gosto.", [
          b("ha.i", "HL", "sim", "expressao"),
          b("_su.ki", "LH", "gosto", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
      },
      {
        ia: line("わたしもえいががすきです。", "私[わたし]も映画[えいが]が好[す]きです。", "Eu também gosto de filmes.", [
          b("wa.ta._shi", "LHH", "eu", "topico"),
          b("mo", "H", "[também]", "particula"),
          b("e.i.ga", "LHH", "filme", "objeto"),
          b("ga", "H", "[Foco do gosto]", "particula"),
          b("_su.ki", "LH", "gosto", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
        dica_pt: "Convide-o para irem juntos da próxima vez.",
        chaves: ["いっしょ", "一緒", "いきません", "行きません"],
        exemplo_card: "card_114",
      },
      {
        ia: line("いいですね。いきましょう。", "いいですね。行[い]きましょう。", "Boa! Vamos!", [
          b("i.i", "HL", "bom", "adjetivo"),
          b("de.su", "LL", "é", "copula"),
          b("ne", "L", "[né]", "particula"),
          b("i.ki.ma.sho.o", "LHHHL", "vamos", "verbo"),
        ]),
        dica_pt: "Despeça-se: foi divertido, vamos conversar de novo.",
        chaves: ["たのしかった", "楽しかった", "はなしましょう", "話しましょう"],
        exemplo: line("たのしかったです。またはなしましょう。", "楽[たの]しかったです。また話[はな]しましょう。", "Foi divertido. Vamos conversar de novo.", [
          b("ta.no._shi.ka.t.ta", "LHHLLL", "foi divertido", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
          b("ma.ta", "LH", "de novo", "adverbio"),
          b("ha.na._shi.ma.sho.o", "LHHHHL", "vamos conversar", "verbo"),
        ]),
      },
      {
        ia: line("では、また。", "では、また。", "Então, até mais! (fim)", [
          b("de.wa", "HL", "então", "expressao"),
          b("ma.ta", "LH", "até mais", "expressao"),
        ]),
      },
    ],
  },

  // ───────────── Um dia na cidade
  {
    id: "rp_rev_cidade",
    titulo: "Um dia na cidade",
    categoria: "cidade",
    emoji: "🗾",
    parceiro: { nome: "Senhora na rua", emoji: "👵" },
    missao_pt:
      "Você está sozinho(a) num bairro novo. Pergunte onde tem uma loja de conveniência, entenda a resposta, compre um café e agradeça.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_043", "card_030", "card_004"],
    system_prompt_cenario: "Senhora indica a loja em frente à estação; na loja, o caixa cobra 200 ienes pelo café.",
    roteiro: [
      {
        ia: line("はい、なんですか。", "はい、何[なん]ですか。", "Sim, pois não?", [
          b("ha.i", "HL", "sim", "expressao"),
          b("na.n", "HL", "o quê", "pergunta"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Pergunte onde tem uma loja de conveniência.",
        chaves: ["コンビニ", "こんびに", "どこ"],
        exemplo_card: "card_043",
      },
      {
        ia: line("えきのまえにありますよ。", "駅[えき]の前[まえ]にありますよ。", "Fica em frente à estação.", [
          b("e.ki", "HL", "estação", "lugar"),
          b("no", "L", "[de]", "particula"),
          b("ma.e", "LL", "frente", "lugar"),
          b("ni", "L", "[Lugar onde está]", "particula"),
          b("a.ri.ma.su", "LHHL", "fica", "verbo"),
          b("yo", "L", "[te informo]", "particula"),
        ]),
        dica_pt: "Diga que entendeu.",
        chaves: ["わかり", "分かり"],
        exemplo_card: "card_030",
      },
      {
        quem: CAIXA,
        ia: line("いらっしゃいませ。", "いらっしゃいませ。", "Bem-vindo!", [b("i.ra.s.sha.i.ma.se", "LHHHHHL", "bem-vindo (loja)", "expressao")]),
        dica_pt: "Peça um café.",
        chaves: ["コーヒー", "ひとつ", "一つ"],
        exemplo: line("コーヒーをひとつください。", "コーヒーを一[ひと]つください。", "Um café, por favor.", [
          b("ko.o.hi.i", "LHHL", "café", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("_hi.to._tsu", "LHL", "um (unidade)", "substantivo"),
          b("ku.da.sa.i", "LLLL", "dê-me (por favor)", "verbo"),
        ]),
      },
      {
        quem: CAIXA,
        ia: line("にひゃくえんです。", "二百円[にひゃくえん]です。", "São 200 ienes.", [
          b("ni.hya.ku.e.n", "LHHLL", "duzentos ienes", "substantivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
        dica_pt: "Pague e agradeça.",
        chaves: ["ありがと"],
        exemplo_card: "card_004",
      },
      {
        quem: CAIXA,
        ia: line("ありがとうございました。", "ありがとうございました。", "Muito obrigado! (fim)", [
          b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
          b("go.za.i.ma._shi.ta", "LHHHLL", "[educado, pelo que já aconteceu]", "expressao"),
        ]),
      },
    ],
  },
];
