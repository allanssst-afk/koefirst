import { seedCards } from "./cards";
import { b, emendar, line } from "./helpers";
import { DE_NOVO } from "./scenarios-passiva";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 40 (Contar uma história): um dia difícil, a rotina e a sua história com o japonês.
 * Usam as frases de `cards-historia.ts` como resposta-modelo. ★ nova = palavra nova.
 */

/** Uma frase do baralho como fala do parceiro. */
function fala(id: string, pt?: string) {
  const c = seedCards.find((x) => x.id === id)!;
  return line(`${c.kana}。`, `${c.kanji}。`, pt ?? c.traducao, c.blocos);
}

const DESU = b("de._su", "LL", "é", "copula");
const KA = b("ka", "L", "[?]", "particula");
const WA = b("wa", "L", "[Tópico]", "particula");
const DOU = b("do.o", "HL", "como", "pergunta");
const DESHITA = b("de._shi.ta", "LLL", "foi", "copula");
const NANI_O = [b("na.ni", "HL", "o quê", "pergunta"), b("o", "L", "[Objeto]", "particula")];
const SHIMASU = b("_shi.ma._su", "LHL", "faz", "verbo");
const II_DESU_NE = line("いいですね。", "いいですね。", "Que bom! (fim)", [b("i.i", "HL", "bom", "adjetivo"), DESU, b("ne", "L", "[né]", "particula")]);

export const cenariosHistoria: SeedScenario[] = [
  // ───────────── Um dia difícil
  {
    id: "rp_his_dia",
    titulo: "Um dia difícil",
    categoria: "social",
    emoji: "📖",
    parceiro: { nome: "Yuki · amiga", emoji: "👩" },
    missao_pt: "A Yuki quer saber do seu dia. Conte a história com começo, meio e fim: o trem não veio, e você voltou de táxi.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_538", "card_536"],
    system_prompt_cenario: "Amiga pergunta como foi o dia, o que houve, como a pessoa voltou e mostra empatia.",
    roteiro: [
      {
        ia: line("きのうはどうでしたか。", "昨日[きのう]はどうでしたか。", "Como foi ontem?", [b("ki.no.o", "LHL", "ontem", "tempo"), WA, DOU, DESHITA, KA]),
        dica_pt: "Diga que, na verdade, foi um dia difícil.",
        chaves: ["じつは", "実は", "たいへん", "大変"],
        exemplo_card: "card_538",
      },
      {
        ia: fala("card_453"),
        dica_pt: "Conte que foi à estação, mas o trem não veio.",
        chaves: ["でんしゃ", "電車", "きませんでした", "来ませんでした"],
        exemplo: line("えきにいきましたが、でんしゃがきませんでした。", "駅[えき]に行[い]きましたが、電車[でんしゃ]が来[き]ませんでした。", "Fui à estação, mas o trem não veio.", [
          b("e.ki", "HL", "estação", "lugar"),
          b("ni", "L", "[Destino]", "particula"),
          b("i.ki.ma._shi.ta", "LHHLL", "fui", "verbo"),
          b("ga", "L", "[mas…]", "particula"),
          b("de.n.sha", "LHH", "trem", "sujeito"),
          b("ga", "H", "[Foco / sujeito]", "particula"),
          b("ki.ma.se.n", "LHHL", "não veio", "verbo"),
          DESHITA,
        ]),
      },
      {
        ia: line("どうやってかえりましたか。", "どうやって帰[かえ]りましたか。", "Como você voltou?", [
          b("do.o.ya.t.te", "HLLLL", "de que jeito", "pergunta"),
          b("ka.e.ri.ma._shi.ta", "LLLLLL", "voltou", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que, no fim, voltou de táxi.",
        chaves: ["タクシー", "けっきょく", "結局"],
        exemplo_card: "card_536",
      },
      {
        ia: DE_NOVO,
        dica_pt: "Conte a história inteira, com começo, meio e fim.",
        aberto: {
          segundos: 60,
          pontos: [
            { rotulo: "Quando foi", chaves: ["きのう", "昨日", "あさ", "朝"] },
            { rotulo: "A ordem dos fatos", chaves: ["それから", "そのあと", "その後", "まず"] },
            { rotulo: "O problema", chaves: ["ところが", "でも", "けど", "きませんでした", "来ませんでした"] },
            { rotulo: "Como terminou", chaves: ["けっきょく", "結局", "さいご", "最後"] },
          ],
        },
        exemplo: emendar(fala("card_538"), fala("card_534"), fala("card_535"), fala("card_536")),
      },
      { ia: fala("card_458", "Que difícil, né. (fim)") },
    ],
  },

  // ───────────── Rotina
  {
    id: "rp_his_rotina",
    titulo: "Conte o seu dia",
    categoria: "social",
    emoji: "🌅",
    parceiro: { nome: "Sato-san · conhecido", emoji: "🧑" },
    missao_pt: "Conte a sua rotina em ordem: de manhã, à noite e quando estuda japonês.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_522", "card_530"],
    system_prompt_cenario: "Conhecido pergunta sobre a manhã, a noite e o horário de estudo.",
    roteiro: [
      {
        ia: line("あさはなにをしますか。", "朝[あさ]は何[なに]をしますか。", "O que você faz de manhã?", [b("a.sa", "HL", "manhã", "tempo"), WA, ...NANI_O, SHIMASU, KA]),
        dica_pt: "Diga que, depois do café, vai à empresa.",
        chaves: ["たべてから", "食べてから", "かいしゃ", "会社"],
        exemplo: line("あさごはんをたべてから、かいしゃにいきます。", "朝[あさ]ごはんを食[た]べてから、会社[かいしゃ]に行[い]きます。", "Depois do café da manhã, vou à empresa.", [
          b("a.sa.go.ha.n", "LHHLL", "café da manhã", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("ta.be.te", "HLL", "comer (forma -te)", "verbo"),
          b("ka.ra", "LL", "depois de", "particula"),
          b("ka.i.sha", "LHH", "empresa", "lugar"),
          b("ni", "H", "[Destino]", "particula"),
          b("i.ki.ma._su", "HHHL", "vou", "verbo"),
        ]),
      },
      {
        ia: line("よるはなにをしますか。", "夜[よる]は何[なに]をしますか。", "O que você faz à noite?", [b("yo.ru", "HL", "noite", "tempo"), WA, ...NANI_O, SHIMASU, KA]),
        dica_pt: "Conte o que faz antes de dormir.",
        chaves: ["まえに", "前に", "みがきます", "磨きます"],
        exemplo_card: "card_522",
      },
      {
        ia: line("いつにほんごをべんきょうしますか。", "いつ日本語[にほんご]を勉強[べんきょう]しますか。", "Quando você estuda japonês?", [
          b("i.tsu", "HL", "quando", "pergunta"),
          b("ni.ho.n.go", "LHHH", "japonês", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("be.n.kyo.o", "LHHH", "estudo", "substantivo"),
          b("_shi.ma._su", "HHL", "faz", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que estuda ouvindo música.",
        chaves: ["ききながら", "聞きながら"],
        exemplo_card: "card_530",
      },
      { ia: II_DESU_NE },
    ],
  },

  // ───────────── Minha história com o japonês
  {
    id: "rp_his_japones",
    titulo: "Sua história com o japonês",
    categoria: "social",
    emoji: "🗾",
    parceiro: { nome: "Prof.ª Nakamura", emoji: "👩‍🏫" },
    missao_pt: "Conte à professora como você começou: quando estudou, como foi no início e como está agora.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_523", "card_533"],
    system_prompt_cenario: "Professora pergunta quando o aluno estudou, como foi no início e como está agora.",
    roteiro: [
      {
        ia: line("いつにほんごをべんきょうしましたか。", "いつ日本語[にほんご]を勉強[べんきょう]しましたか。", "Quando você estudou japonês?", [
          b("i.tsu", "HL", "quando", "pergunta"),
          b("ni.ho.n.go", "LHHH", "japonês", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("be.n.kyo.o", "LHHH", "estudo", "substantivo"),
          b("_shi.ma._shi.ta", "HHLL", "fez", "verbo"),
          KA,
        ]),
        dica_pt: "Diga: antes de vir ao Japão.",
        chaves: ["くるまえに", "来る前に"],
        exemplo_card: "card_523",
      },
      {
        ia: line("さいしょはどうでしたか。", "最初[さいしょ]はどうでしたか。", "Como foi no começo?", [
          b("sa.i.sho", "LHH", "começo", "tempo"),
          b("wa", "H", "[contraste]", "particula"),
          DOU,
          DESHITA,
          KA,
        ]),
        dica_pt: "Diga que no começo foi difícil.",
        chaves: ["むずかしかった", "難しかった"],
        exemplo_card: "card_533",
      },
      {
        ia: line("いまはどうですか。", "今[いま]はどうですか。", "E agora?", [b("i.ma", "HL", "agora", "tempo"), WA, DOU, DESU, KA]),
        dica_pt: "Diga que agora é muito divertido.",
        chaves: ["たのしい", "楽しい"],
        exemplo: line("いまはとてもたのしいです。", "今[いま]はとても楽[たの]しいです。", "Agora é muito divertido.", [
          b("i.ma", "HL", "agora", "tempo"),
          WA,
          b("to.te.mo", "LHH", "muito", "adverbio"),
          b("ta.no.shi.i", "LHHL", "divertido", "adjetivo"),
          DESU,
        ]),
      },
      { ia: II_DESU_NE },
    ],
  },
];
