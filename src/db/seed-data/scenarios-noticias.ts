import { seedCards } from "./cards";
import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 39 (Notícias e boatos): a previsão do tempo, o boato do escritório e a notícia do dia.
 * Usam as frases de `cards-noticias.ts` como resposta-modelo. ★ nova = palavra nova.
 */

/** Uma frase do baralho como fala do parceiro. */
function fala(id: string, pt?: string) {
  const c = seedCards.find((x) => x.id === id)!;
  return line(`${c.kana}。`, `${c.kanji}。`, pt ?? c.traducao, c.blocos);
}

const DESU = b("de._su", "LL", "é", "copula");
const KA = b("ka", "L", "[?]", "particula");

export const cenariosNoticias: SeedScenario[] = [
  // ───────────── Previsão
  {
    id: "rp_not_tempo",
    titulo: "Vai nevar amanhã",
    categoria: "social",
    emoji: "⛄",
    parceiro: { nome: "Yuki · amiga", emoji: "👩" },
    missao_pt: "Vocês iam sair amanhã. Conte à Yuki a previsão do tempo e diga como ficou sabendo.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_500", "card_514"],
    system_prompt_cenario: "Amiga pergunta o tempo de amanhã, confirma a notícia e sugere ficar em casa.",
    roteiro: [
      {
        ia: line("あしたのてんきはどうですか。", "明日[あした]の天気[てんき]はどうですか。", "Como vai estar o tempo amanhã?", [
          b("a._shi.ta", "LHH", "amanhã", "tempo"),
          b("no", "L", "[de]", "particula"),
          b("te.n.ki", "HLL", "tempo, clima", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("do.o", "HL", "como", "pergunta"),
          DESU,
          KA,
        ]),
        dica_pt: "Diga que, segundo a previsão, vai nevar.",
        chaves: ["よほう", "予報", "ゆき", "雪"],
        exemplo_card: "card_500",
      },
      { ia: fala("card_511"), dica_pt: "Diga que viu no noticiário.", chaves: ["ニュース"], exemplo_card: "card_514" },
      {
        ia: line("じゃあ、いえにいましょう。", "じゃあ、家[いえ]にいましょう。", "Então vamos ficar em casa. (fim)", [
          b("ja.a", "HL", "então", "expressao"),
          b("i.e", "LH", "casa", "lugar"),
          b("ni", "L", "[Lugar onde está]", "particula"),
          b("i.ma.sho.o", "LHHL", "vamos ficar", "verbo"),
        ]),
      },
    ],
  },

  // ───────────── Boato
  {
    id: "rp_not_boato",
    titulo: "Você soube?",
    categoria: "trabalho",
    emoji: "🤫",
    parceiro: { nome: "Suzuki-san · colega", emoji: "🧑" },
    missao_pt: "Conte ao colega a novidade do escritório e diga de quem você ouviu.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_502"],
    system_prompt_cenario: "Colega pergunta se há novidade, quer saber a fonte e fica surpreso.",
    roteiro: [
      {
        ia: line("なにかききましたか。", "何[なに]か聞[き]きましたか。", "Ouviu alguma coisa?", [
          b("na.ni.ka", "HLL", "algo", "pergunta"),
          b("_ki.ki.ma._shi.ta", "LHHLL", "ouviu", "verbo"),
          KA,
        ]),
        dica_pt: "Conte que o Tanaka se casou.",
        chaves: ["けっこん", "結婚"],
        exemplo_card: "card_502",
      },
      {
        ia: line("ほんとうですか。だれからききましたか。", "本当[ほんとう]ですか。誰[だれ]から聞[き]きましたか。", "Verdade? De quem você ouviu?", [
          b("ho.n.to.o", "LHHH", "verdade", "substantivo"),
          b("de._su", "HL", "é", "copula"),
          KA,
          b("da.re", "HL", "quem", "pergunta"),
          b("ka.ra", "LL", "a partir de", "particula"),
          b("_ki.ki.ma._shi.ta", "LHHLL", "ouviu", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que ouviu do gerente.",
        chaves: ["ぶちょう", "部長"],
        exemplo: line("ぶちょうからききました。", "部長[ぶちょう]から聞[き]きました。", "Ouvi do gerente.", [
          b("bu.cho.o", "LHH", "gerente", "substantivo"),
          b("ka.ra", "HH", "a partir de", "particula"),
          b("_ki.ki.ma._shi.ta", "LHHLL", "ouvi", "verbo"),
        ]),
      },
      { ia: fala("card_512", "Fiquei surpreso. (fim)") },
    ],
  },

  // ───────────── Notícia do dia
  {
    id: "rp_not_acidente",
    titulo: "A notícia de hoje",
    categoria: "cidade",
    emoji: "📰",
    parceiro: { nome: "Tanaka-san · colega", emoji: "🧑" },
    missao_pt: "Comente a notícia da manhã: diga que houve um acidente e onde foi.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_507"],
    system_prompt_cenario: "Colega pergunta da notícia, quer saber onde foi e lamenta.",
    roteiro: [
      {
        ia: line("けさのニュースをみましたか。", "今朝[けさ]のニュースを見[み]ましたか。", "Você viu a notícia de hoje de manhã? (nova: kesa = hoje de manhã)", [
          b("ke.sa", "HL", "hoje de manhã ★ nova", "tempo"),
          b("no", "L", "[de]", "particula"),
          b("nyu.u.su", "HLL", "notícia", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("mi.ma._shi.ta", "LHLL", "viu", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que houve um acidente.",
        chaves: ["じこ", "事故"],
        exemplo_card: "card_507",
      },
      {
        ia: line("どこであったんですか。", "どこであったんですか。", "Onde foi?", [
          b("do.ko", "HL", "onde", "pergunta"),
          b("de", "L", "[Local da ação]", "particula"),
          b("a.t.ta", "HLL", "houve (forma -ta)", "verbo"),
          b("n", "L", "[é que: explicação]", "particula"),
          DESU,
          KA,
        ]),
        dica_pt: "Diga: perto da estação.",
        chaves: ["えき", "駅", "ちかく", "近く"],
        exemplo: line("えきのちかくです。", "駅[えき]の近[ちか]くです。", "Perto da estação.", [
          b("e.ki", "HL", "estação", "lugar"),
          b("no", "L", "[de]", "particula"),
          b("chi.ka.ku", "HLL", "perto", "lugar"),
          DESU,
        ]),
      },
      {
        ia: line("たいへんですね。", "大変[たいへん]ですね。", "Que coisa séria, né. (fim)", [
          b("ta.i.he.n", "LHHH", "difícil, sério", "adjetivo"),
          b("de.su", "HL", "é", "copula"),
          b("ne", "L", "[né]", "particula"),
        ]),
      },
    ],
  },
];
