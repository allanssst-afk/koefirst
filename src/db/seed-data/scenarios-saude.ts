import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 16 (Saúde e farmácia): consulta, farmácia e o colega gripado.
 * Usam as frases de `cards-saude.ts` como resposta-modelo. ★ nova = palavra nova.
 */

const odaijini = line("おだいじに。", "お大事[だいじ]に。", "Melhoras! (fim)", [b("o.da.i.ji.ni", "LHHHH", "melhoras", "expressao")]);

export const cenariosSaude: SeedScenario[] = [
  // ───────────── Consultório
  {
    id: "rp_sau_medico",
    titulo: "No consultório",
    categoria: "cidade",
    emoji: "🩺",
    parceiro: { nome: "Dra. Kato · clínica", emoji: "👩‍⚕️" },
    missao_pt:
      "Você foi ao médico. Explique que a garganta dói desde ontem, diga que tem febre, entenda como tomar o remédio e agradeça.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_130", "card_129", "card_128", "card_135", "card_136"],
    system_prompt_cenario: "Médica atenciosa: pergunta o que houve e se tem febre, receita remédio 3 vezes ao dia e aconselha descanso.",
    roteiro: [
      {
        ia: line("どうしましたか。", "どうしましたか。", "O que houve?", [
          b("do.o", "HL", "como, o quê", "pergunta"),
          b("shi.ma._shi.ta", "LLLL", "aconteceu", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que está com dor de garganta desde ontem.",
        chaves: ["のど", "喉", "いたい", "痛い"],
        exemplo_card: "card_129",
      },
      {
        ia: line("ねつはありますか。", "熱[ねつ]はありますか。", "Tem febre?", [
          b("ne.tsu", "LH", "febre", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("a.ri.ma._su", "LHHL", "existe", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que tem febre.",
        chaves: ["ねつ", "熱"],
        exemplo_card: "card_128",
      },
      {
        ia: line("かぜですね。このくすりをいちにちにさんかいのんでください。", "風邪[かぜ]ですね。この薬[くすり]を一日[いちにち]に三回[さんかい]飲[の]んでください。", "É resfriado. Tome este remédio três vezes ao dia.", [
          b("ka.ze", "LH", "resfriado", "substantivo"),
          b("de.su", "HL", "é", "copula"),
          b("ne", "L", "[né]", "particula"),
          b("ko.no", "LH", "este", "objeto"),
          b("_ku.su.ri", "HHH", "remédio", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("i.chi.ni.chi", "LHHH", "um dia", "tempo"),
          b("ni", "L", "[por]", "particula"),
          b("sa.n.ka.i", "LHHL", "três vezes", "substantivo"),
          b("no.n.de", "LLL", "tome", "verbo"),
          b("ku.da.sa.i", "LLLL", "por favor", "verbo"),
        ]),
        dica_pt: "Diga que entendeu.",
        chaves: ["わかり", "分かり"],
        exemplo_card: "card_030",
      },
      {
        ia: line("きょうはやすんだほうがいいですよ。", "今日[きょう]は休[やす]んだほうがいいですよ。", "Hoje é melhor descansar.", [
          b("kyo.o", "HL", "hoje", "tempo"),
          b("wa", "L", "[Tópico]", "particula"),
          b("ya.su.n.da", "LHLL", "descansado", "verbo"),
          b("ho.o", "HL", "o lado", "substantivo"),
          b("ga", "L", "[Foco / sujeito]", "particula"),
          b("i.i", "HL", "bom", "adjetivo"),
          b("de.su", "LL", "é", "copula"),
          b("yo", "L", "[te digo]", "particula"),
        ]),
        dica_pt: "Agradeça.",
        chaves: ["ありがと"],
        exemplo_card: "card_004",
      },
      { ia: odaijini },
    ],
  },

  // ───────────── Farmácia
  {
    id: "rp_sau_farmacia",
    titulo: "Na farmácia",
    categoria: "compras",
    emoji: "💊",
    parceiro: { nome: "Farmacêutico", emoji: "🧑‍⚕️" },
    missao_pt:
      "Você precisa de um remédio para dor de cabeça. Explique o sintoma, responda sobre alergia, aceite o remédio sugerido e pague.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_127", "card_046", "card_136"],
    system_prompt_cenario: "Farmacêutico: pergunta o problema e se há alergia, sugere um remédio de 1.000 ienes.",
    roteiro: [
      {
        ia: line("いらっしゃいませ。", "いらっしゃいませ。", "Bem-vindo!", [b("i.ra.s.sha.i.ma.se", "LHHHHHL", "bem-vindo (loja)", "expressao")]),
        dica_pt: "Diga que está com dor de cabeça.",
        chaves: ["あたま", "頭", "いたい", "痛い"],
        exemplo_card: "card_127",
      },
      {
        ia: line("アレルギーはありますか。", "アレルギーはありますか。", "Tem alguma alergia?", [
          b("a.re.ru.gi.i", "LHLLL", "alergia", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("a.ri.ma._su", "LHHL", "existe", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que não tem.",
        chaves: ["ありません"],
        exemplo_card: "card_046",
      },
      {
        ia: line("じゃあ、このくすりはどうですか。", "じゃあ、この薬[くすり]はどうですか。", "Então, que tal este remédio?", [
          b("ja.a", "HL", "então", "expressao"),
          b("ko.no", "LH", "este", "topico"),
          b("_ku.su.ri", "HHH", "remédio", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("do.o", "HL", "como", "pergunta"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Aceite: esse, por favor.",
        chaves: ["それ", "ください"],
        exemplo: line("それをください。", "それをください。", "Esse, por favor.", [
          b("so.re", "LH", "esse", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("ku.da.sa.i", "HHHL", "dê-me (por favor)", "verbo"),
        ]),
      },
      {
        ia: line("せんえんです。", "千円[せんえん]です。", "São 1.000 ienes.", [
          b("se.n.e.n", "HLLL", "mil ienes", "substantivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
        dica_pt: "Pague e agradeça.",
        chaves: ["ありがと"],
        exemplo_card: "card_004",
      },
      { ia: odaijini },
    ],
  },

  // ───────────── Colega gripado
  {
    id: "rp_sau_colega",
    titulo: "O colega gripado",
    categoria: "trabalho",
    emoji: "🤧",
    parceiro: { nome: "Suzuki-san · colega", emoji: "🧑‍💻" },
    missao_pt:
      "Seu colega chegou com cara de doente. Pergunte se está bem, aconselhe que descanse hoje e peça para ele não se esforçar demais.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_137", "card_131", "card_133", "card_134"],
    system_prompt_cenario: "Colega gripado que insiste em trabalhar, mas acaba aceitando ir para casa mais cedo.",
    roteiro: [
      {
        ia: line("おはようございます。", "おはようございます。", "Bom dia. (com voz de gripe)", [
          b("o.ha.yo.o", "LHHH", "bom dia", "expressao"),
          b("go.za.i.ma._su", "HHHHL", "[forma educada]", "expressao"),
        ]),
        dica_pt: "Ele parece doente. Pergunte se está bem.",
        chaves: ["だいじょうぶ", "大丈夫"],
        exemplo_card: "card_137",
      },
      {
        ia: line("ちょっとかぜをひきました。", "ちょっと風邪[かぜ]をひきました。", "Peguei um resfriado.", [
          b("cho.t.to", "HLL", "um pouco", "adverbio"),
          b("ka.ze", "LH", "resfriado", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("_hi.ki.ma._shi.ta", "LHHLL", "peguei", "verbo"),
        ]),
        dica_pt: "Aconselhe: hoje é melhor descansar.",
        chaves: ["やすんだ", "休んだ", "ほうがいい"],
        exemplo_card: "card_133",
      },
      {
        ia: line("でも、しごとがたくさんありますから。", "でも、仕事[しごと]がたくさんありますから。", "Mas tenho muito trabalho… (nova: takusan = muito)", [
          b("de.mo", "HL", "mas", "expressao"),
          b("shi.go.to", "LHH", "trabalho", "sujeito"),
          b("ga", "H", "[Foco / sujeito]", "particula"),
          b("ta._ku.sa.n", "LHHH", "muito ★ nova", "adverbio"),
          b("a.ri.ma._su", "HHHL", "existe", "verbo"),
          b("ka.ra", "LL", "[porque]", "particula"),
        ]),
        dica_pt: "Peça para ele não se esforçar demais.",
        chaves: ["むり", "無理", "しないで"],
        exemplo_card: "card_134",
      },
      {
        ia: line("ありがとうございます。じゃあ、きょうははやくかえります。", "ありがとうございます。じゃあ、今日[きょう]は早[はや]く帰[かえ]ります。", "Obrigado. Então hoje vou embora mais cedo. (fim)", [
          b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
          b("go.za.i.ma._su", "LHHHL", "[forma educada]", "expressao"),
          b("ja.a", "HL", "então", "expressao"),
          b("kyo.o", "HL", "hoje", "tempo"),
          b("wa", "L", "[Tópico]", "particula"),
          b("ha.ya.ku", "HLL", "cedo", "adverbio"),
          b("ka.e.ri.ma._su", "LHHHL", "volto (para casa)", "verbo"),
        ]),
      },
    ],
  },
];
