import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 15 (Família e pessoas): fotos da família, a vizinha que pergunta por todos e "quem é aquela
 * pessoa?" numa festa. Usam as frases de `cards-familia.ts` como resposta-modelo. ★ nova = palavra nova.
 */

const obrigado = line("ありがとうございます。", "ありがとうございます。", "Obrigado.", [
  b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
  b("go.za.i.ma._su", "LHHHL", "[forma educada]", "expressao"),
]);

export const cenariosFamilia: SeedScenario[] = [
  // ───────────── Fotos da família
  {
    id: "rp_fam_fotos",
    titulo: "Fotos da família",
    categoria: "social",
    emoji: "📸",
    parceiro: { nome: "Yamada-san · colega", emoji: "👩‍💼" },
    missao_pt:
      "Você mostra fotos da família para a colega. Diga quantas pessoas são, quem é o rapaz alto da foto e quantos anos ele tem.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_115", "card_116", "card_119"],
    system_prompt_cenario: "Colega olhando fotos: pergunta quantas pessoas, quem é o alto e a idade dele.",
    roteiro: [
      {
        ia: line("なんにんかぞくですか。", "何人[なんにん]家族[かぞく]ですか。", "Quantas pessoas tem na sua família?", [
          b("na.n.ni.n", "HLLL", "quantas pessoas", "pergunta"),
          b("ka.zo.ku", "HLL", "família", "substantivo"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que são quatro.",
        chaves: ["よにん", "四人", "4人"],
        exemplo_card: "card_116",
      },
      {
        ia: line("このせがたかいひとはだれですか。", "この背[せ]が高[たか]い人[ひと]は誰[だれ]ですか。", "Quem é esta pessoa alta?", [
          b("ko.no", "LH", "esta", "topico"),
          b("se", "H", "altura", "sujeito"),
          b("ga", "L", "[Foco / sujeito]", "particula"),
          b("ta.ka.i", "LHL", "alta", "adjetivo"),
          b("_hi.to", "LH", "pessoa", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("da.re", "HL", "quem", "pergunta"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que é o seu irmão mais velho.",
        chaves: ["あに", "兄"],
        exemplo: line("あにです。", "兄[あに]です。", "É meu irmão.", [
          b("a.ni", "HL", "meu irmão mais velho", "substantivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
      },
      {
        ia: line("おにいさんはなんさいですか。", "お兄[にい]さんは何歳[なんさい]ですか。", "Quantos anos tem seu irmão?", [
          b("o.ni.i.sa.n", "LHLLL", "seu irmão mais velho", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("na.n.sa.i", "HLLL", "quantos anos", "pergunta"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que ele tem 35 anos.",
        chaves: ["さんじゅうご", "三十五", "35"],
        exemplo_card: "card_119",
      },
      {
        ia: line("かっこいいですね。", "かっこいいですね。", "Ele é bonitão, hein! (nova: kakkoii = bonito, estiloso) (fim)", [
          b("ka.k.ko.i.i", "LHHHL", "bonito, estiloso ★ nova", "adjetivo"),
          b("de.su", "LL", "é", "copula"),
          b("ne", "L", "[né]", "particula"),
        ]),
      },
    ],
  },

  // ───────────── A vizinha pergunta
  {
    id: "rp_fam_vizinha",
    titulo: "Como vai a família?",
    categoria: "social",
    emoji: "🏡",
    parceiro: { nome: "Sra. Watanabe · vizinha", emoji: "👵" },
    missao_pt:
      "A vizinha pergunta pela sua família. Diga que todos estão bem, conte o que sua irmã mais nova faz e agradeça os cumprimentos.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_122", "card_123", "card_124"],
    system_prompt_cenario: "Vizinha atenciosa: pergunta pela família, pela irmã e manda lembranças.",
    roteiro: [
      {
        ia: line("ごかぞくはおげんきですか。", "ご家族[かぞく]はお元気[げんき]ですか。", "Sua família vai bem?", [
          b("go.ka.zo.ku", "LHLL", "sua família", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("o.ge.n.ki", "LHLL", "bem (respeito)", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que, graças a Deus, todos estão bem.",
        chaves: ["おかげさま", "げんき", "元気"],
        exemplo_card: "card_123",
      },
      {
        ia: line("いもうとさんは。", "妹[いもうと]さんは。", "E sua irmã mais nova?", [
          b("i.mo.o.to", "LHHH", "irmã mais nova", "topico"),
          b("sa.n", "LL", "(respeito)", "topico"),
          b("wa", "L", "[e quanto a…?]", "particula"),
        ]),
        dica_pt: "Diga que ela é universitária.",
        chaves: ["だいがくせい", "大学生"],
        exemplo_card: "card_124",
      },
      {
        ia: line("よろしくおつたえください。", "よろしくお伝[つた]えください。", "Mande lembranças a eles. (fórmula)", [
          b("yo.ro._shi.ku", "LHHH", "bem (lembranças)", "expressao"),
          b("o._tsu.ta.e", "LHHH", "transmita (respeito)", "verbo"),
          b("ku.da.sa.i", "HHHL", "por favor", "verbo"),
        ]),
        dica_pt: "Agradeça.",
        chaves: ["ありがと"],
        exemplo: obrigado,
      },
      {
        ia: line("では、また。", "では、また。", "Então, até mais! (fim)", [
          b("de.wa", "HL", "então", "expressao"),
          b("ma.ta", "LH", "até mais", "expressao"),
        ]),
      },
    ],
  },

  // ───────────── Quem é aquela pessoa?
  {
    id: "rp_fam_festa",
    titulo: "Quem é aquela pessoa?",
    categoria: "trabalho",
    emoji: "🥂",
    parceiro: { nome: "Suzuki-san · colega", emoji: "🧑‍💻" },
    missao_pt: "Na festa da empresa, você vê uma pessoa que não conhece. Pergunte quem é, reaja e diga que acha ótimo.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_125", "card_023"],
    system_prompt_cenario: "Colega na festa: explica que é a esposa do Tanaka-san, uma pessoa gentil, e promete apresentar.",
    roteiro: [
      {
        ia: line("こんばんは。", "こんばんは。", "Boa noite!", [b("ko.n.ba.n.wa", "LHHHH", "boa noite (ao chegar)", "expressao")]),
        dica_pt: "Pergunte quem é aquela pessoa.",
        chaves: ["だれ", "誰"],
        exemplo_card: "card_125",
      },
      {
        ia: line("たなかさんのおくさんです。", "田中[たなか]さんの奥[おく]さんです。", "É a esposa do Tanaka-san. (nova: okusan = esposa de alguém)", [
          b("ta.na.ka", "LHH", "Tanaka", "substantivo"),
          b("sa.n", "HH", "sr.", "substantivo"),
          b("no", "H", "[de]", "particula"),
          b("o._ku.sa.n", "HLLL", "esposa (de outra pessoa) ★ nova", "substantivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
        dica_pt: "Reaja: ah, é?",
        chaves: ["そう"],
        exemplo: line("そうですか。", "そうですか。", "Ah, é?", [
          b("so.o", "HL", "assim", "expressao"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
      },
      {
        ia: line("とてもやさしいひとですよ。", "とても優[やさ]しい人[ひと]ですよ。", "Ela é uma pessoa muito gentil.", [
          b("to.te.mo", "LHH", "muito", "adverbio"),
          b("ya.sa._shi.i", "LHHH", "gentil", "adjetivo"),
          b("_hi.to", "LL", "pessoa", "substantivo"),
          b("de.su", "LL", "é", "copula"),
          b("yo", "L", "[te informo]", "particula"),
        ]),
        dica_pt: "Diga: que bom!",
        chaves: ["いい"],
        exemplo_card: "card_023",
      },
      {
        ia: line("あとでしょうかいしますね。", "後[あと]で紹介[しょうかい]しますね。", "Depois eu te apresento. (nova: shoukai = apresentação) (fim)", [
          b("a.to", "HL", "depois", "tempo"),
          b("de", "L", "[em]", "particula"),
          b("sho.o.ka.i", "LHHH", "apresentação ★ nova", "substantivo"),
          b("shi.ma.su", "HHL", "faço", "verbo"),
          b("ne", "L", "[tá?]", "particula"),
        ]),
      },
    ],
  },
];
