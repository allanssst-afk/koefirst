import { seedCards } from "./cards";
import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 36 (O que me aconteceu): o roubo contado à polícia (marco do mês 10: contar um incidente em
 * 2 minutos), a bronca no trabalho e a boa notícia. Usam as frases de `cards-passiva.ts` como resposta-modelo.
 */

/** Uma frase do baralho como fala do parceiro. */
function fala(id: string, pt?: string) {
  const c = seedCards.find((x) => x.id === id)!;
  return line(`${c.kana}。`, `${c.kanji}。`, pt ?? c.traducao, c.blocos);
}

const DESU = b("de._su", "LL", "é", "copula");
const KA = b("ka", "L", "[?]", "particula");
const GA = b("ga", "L", "[Foco / sujeito]", "particula");
const ARIMASHITA = b("a.ri.ma._shi.ta", "LHHLL", "havia", "verbo");

export const cenariosPassiva: SeedScenario[] = [
  // ───────────── Marco do mês 10
  {
    id: "rp_pas_incidente",
    titulo: "Contar um incidente",
    categoria: "cidade",
    emoji: "🚓",
    parceiro: { nome: "Policial do posto", emoji: "👮" },
    missao_pt:
      "O marco do mês 10: contar um incidente. Roubaram sua carteira. Conte ao policial o que houve, onde, quando, como ela é e o que tinha dentro.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_439", "card_453"],
    system_prompt_cenario: "Policial calmo pergunta o que aconteceu, onde, quando, como é a carteira e o que havia dentro.",
    roteiro: [
      { ia: fala("card_453"), dica_pt: "Diga que roubaram sua carteira.", chaves: ["さいふ", "財布", "ぬすまれ", "盗まれ"], exemplo_card: "card_439" },
      {
        ia: line("どこでですか。", "どこでですか。", "Onde foi?", [b("do.ko", "HL", "onde", "pergunta"), b("de", "L", "[Local da ação]", "particula"), DESU, KA]),
        dica_pt: "Diga: dentro do trem.",
        chaves: ["でんしゃ", "電車"],
        exemplo: line("でんしゃのなかです。", "電車[でんしゃ]の中[なか]です。", "Dentro do trem.", [
          b("de.n.sha", "LHH", "trem", "lugar"),
          b("no", "H", "[de]", "particula"),
          b("na.ka", "HL", "dentro", "lugar"),
          DESU,
        ]),
      },
      {
        ia: line("いつですか。", "いつですか。", "Quando foi?", [b("i.tsu", "HL", "quando", "pergunta"), DESU, KA]),
        dica_pt: "Diga: ontem à noite.",
        chaves: ["きのう", "昨日", "よる", "夜"],
        exemplo: line("きのうのよるです。", "昨日[きのう]の夜[よる]です。", "Ontem à noite.", [
          b("ki.no.o", "LHL", "ontem", "tempo"),
          b("no", "L", "[de]", "particula"),
          b("yo.ru", "HL", "noite", "tempo"),
          DESU,
        ]),
      },
      {
        ia: line("どんなさいふですか。", "どんな財布[さいふ]ですか。", "Como é a carteira?", [
          b("do.n.na", "HLL", "que tipo de", "pergunta"),
          b("sa.i.fu", "LHH", "carteira", "substantivo"),
          b("de._su", "HL", "é", "copula"),
          KA,
        ]),
        dica_pt: "Diga que é preta e pequena.",
        chaves: ["くろくて", "黒くて", "ちいさい", "小さい"],
        exemplo: line("くろくて、ちいさいさいふです。", "黒[くろ]くて、小[ちい]さい財布[さいふ]です。", "É preta e pequena.", [
          b("ku.ro._ku.te", "HLLL", "preta, e", "adjetivo"),
          b("chi.i.sa.i", "LHHL", "pequena", "adjetivo"),
          b("sa.i.fu", "LHH", "carteira", "substantivo"),
          b("de._su", "HL", "é", "copula"),
        ]),
      },
      {
        ia: line("なかになにがありましたか。", "中[なか]に何[なに]がありましたか。", "O que tinha dentro?", [
          b("na.ka", "HL", "dentro", "lugar"),
          b("ni", "L", "[Lugar]", "particula"),
          b("na.ni", "HL", "o quê", "pergunta"),
          GA,
          ARIMASHITA,
          KA,
        ]),
        dica_pt: "Diga: dinheiro e cartão.",
        chaves: ["おかね", "お金", "カード"],
        exemplo: line("おかねとカードがありました。", "お金[かね]とカードがありました。", "Tinha dinheiro e cartão.", [
          b("o.ka.ne", "LHH", "dinheiro", "sujeito"),
          b("to", "H", "[e]", "particula"),
          b("ka.a.do", "HLL", "cartão", "sujeito"),
          GA,
          ARIMASHITA,
        ]),
      },
      { ia: fala("card_458", "Que difícil, né. (fim)") },
    ],
  },

  // ───────────── Bronca
  {
    id: "rp_pas_bronca",
    titulo: "Levei uma bronca",
    categoria: "trabalho",
    emoji: "😣",
    parceiro: { nome: "Tanaka-san · colega", emoji: "🧑" },
    missao_pt: "Você levou uma bronca do gerente. Conte ao Tanaka o que houve, diga o motivo e explique por que chegou atrasado.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_441"],
    system_prompt_cenario: "Colega pergunta o que houve, por que e como foi o atraso, e mostra empatia.",
    roteiro: [
      {
        ia: fala("card_187"),
        dica_pt: "Diga que levou uma bronca do gerente.",
        chaves: ["しかられ", "叱られ"],
        exemplo: line("ぶちょうにしかられました。", "部長[ぶちょう]に叱[しか]られました。", "Levei uma bronca do gerente.", [
          b("bu.cho.o", "LHH", "gerente", "substantivo"),
          b("ni", "H", "[por]", "particula"),
          b("_shi.ka.ra.re.ma._shi.ta", "LHHHHLL", "fui repreendido", "verbo"),
        ]),
      },
      {
        ia: line("どうしてですか。", "どうしてですか。", "Por quê?", [b("do.o._shi.te", "HLLL", "por quê", "pergunta"), DESU, KA]),
        dica_pt: "Diga: porque se atrasou.",
        chaves: ["おくれた", "遅れた"],
        exemplo: line("おくれたからです。", "遅[おく]れたからです。", "Porque me atrasei.", [
          b("o.ku.re.ta", "LHHH", "atrasei", "verbo"),
          b("ka.ra", "LL", "porque", "particula"),
          DESU,
        ]),
      },
      { ia: fala("card_189"), dica_pt: "Diga que pegou chuva.", chaves: ["あめ", "雨", "ふられ", "降られ"], exemplo_card: "card_441" },
      { ia: fala("card_458", "Que difícil, né. (fim)") },
    ],
  },

  // ───────────── Boa notícia
  {
    id: "rp_pas_noticia",
    titulo: "Uma boa notícia",
    categoria: "social",
    emoji: "🎉",
    parceiro: { nome: "Yuki · amiga", emoji: "👩" },
    missao_pt: "A Yuki nota que você está feliz. Conte que foi elogiado pelo gerente e que foi convidado para uma festa.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_442", "card_449"],
    system_prompt_cenario: "Amiga nota a alegria, pergunta o plano do fim de semana e comemora.",
    roteiro: [
      { ia: fala("card_437"), dica_pt: "Diga que foi elogiado pelo gerente.", chaves: ["ほめられ", "褒められ"], exemplo_card: "card_442" },
      {
        ia: line("しゅうまつはなにをしますか。", "週末[しゅうまつ]は何[なに]をしますか。", "O que você vai fazer no fim de semana?", [
          b("shu.u.ma.tsu", "LHHH", "fim de semana", "tempo"),
          b("wa", "H", "[Tópico]", "particula"),
          b("na.ni", "HL", "o quê", "pergunta"),
          b("o", "L", "[Objeto]", "particula"),
          b("_shi.ma._su", "LHL", "faz", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que foi convidado para uma festa.",
        chaves: ["パーティー", "さそわれ", "誘われ"],
        exemplo_card: "card_449",
      },
      {
        ia: line("いいですね。", "いいですね。", "Que bom! (fim)", [b("i.i", "HL", "bom", "adjetivo"), DESU, b("ne", "L", "[né]", "particula")]),
      },
    ],
  },
];
