import { seedCards } from "./cards";
import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 37 (Pedir e permitir): sair mais cedo do trabalho, disputar a conta e a consulta médica.
 * Usam as frases de `cards-causativa.ts` como resposta-modelo. ★ nova = palavra nova.
 */

/** Uma frase do baralho como fala do parceiro. */
function fala(id: string, pt?: string) {
  const c = seedCards.find((x) => x.id === id)!;
  return line(`${c.kana}。`, `${c.kanji}。`, pt ?? c.traducao, c.blocos);
}

const DESU = b("de._su", "LL", "é", "copula");
const KA = b("ka", "L", "[?]", "particula");
const YOU_NI_SHITE = [
  b("yo.o", "HL", "modo", "substantivo"),
  b("ni", "L", "[resultado]", "particula"),
  b("_shi.te", "LL", "fazendo (forma -te)", "verbo"),
  b("ku.da.sa.i", "LLLL", "por favor", "verbo"),
];
const DOU_SHIMASHITA = line("どうしましたか。", "どうしましたか。", "O que houve?", [
  b("do.o", "HL", "como", "pergunta"),
  b("_shi.ma._shi.ta", "LLLL", "fez", "verbo"),
  KA,
]);

export const cenariosCausativa: SeedScenario[] = [
  // ───────────── Sair mais cedo
  {
    id: "rp_cau_cedo",
    titulo: "Sair mais cedo",
    categoria: "trabalho",
    emoji: "🕔",
    parceiro: { nome: "Kobayashi-kachō · chefe", emoji: "👔" },
    missao_pt: "Você não está bem. Peça ao chefe para sair mais cedo, explique o motivo e agradeça o cuidado dele.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_469", "card_188"],
    system_prompt_cenario: "Chefe pergunta o motivo, autoriza a saída e pede que a pessoa não exagere.",
    roteiro: [
      { ia: DOU_SHIMASHITA, dica_pt: "Peça para sair mais cedo hoje.", chaves: ["かえらせて", "帰らせて"], exemplo_card: "card_469" },
      {
        ia: line("どうしてですか。", "どうしてですか。", "Por quê?", [b("do.o._shi.te", "HLLL", "por quê", "pergunta"), DESU, KA]),
        dica_pt: "Explique que está com dor de cabeça.",
        chaves: ["あたま", "頭"],
        exemplo_card: "card_188",
      },
      {
        ia: line("むりしないようにしてください。", "無理[むり]しないようにしてください。", "Procure não se esforçar demais.", [
          b("mu.ri", "LH", "exagero", "substantivo"),
          b("_shi.na.i", "HHH", "não fazer", "verbo"),
          ...YOU_NI_SHITE,
        ]),
        dica_pt: "Agradeça.",
        chaves: ["ありがとう"],
        exemplo: line("ありがとうございます。", "ありがとうございます。", "Obrigado.", [
          b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
          b("go.za.i.ma._su", "LHHHL", "[forma educada]", "expressao"),
        ]),
      },
      { ia: fala("card_395", "Bom trabalho, até amanhã. (fim)") },
    ],
  },

  // ───────────── A conta
  {
    id: "rp_cau_conta",
    titulo: "Deixe que eu pago",
    categoria: "restaurante",
    emoji: "💴",
    parceiro: { nome: "Tanaka-san · colega", emoji: "🧑" },
    missao_pt: "No fim do almoço, o Tanaka quer pagar. Insista em pagar e use a expressão certa para convidar.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_468"],
    system_prompt_cenario: "Colega tenta pagar a conta, recusa com educação e por fim aceita o convite.",
    roteiro: [
      {
        ia: line("ここはわたしがはらいます。", "ここは私[わたし]が払[はら]います。", "Aqui eu pago.", [
          b("ko.ko", "LH", "aqui", "lugar"),
          b("wa", "H", "[contraste]", "particula"),
          b("wa.ta._shi", "LHH", "eu", "sujeito"),
          b("ga", "H", "[Foco / sujeito]", "particula"),
          b("ha.ra.i.ma._su", "LHHHL", "pago", "verbo"),
        ]),
        dica_pt: "Insista: deixe que eu pago.",
        chaves: ["はらわせて", "払わせて"],
        exemplo_card: "card_468",
      },
      {
        ia: line("いいえ、だいじょうぶです。", "いいえ、大丈夫[だいじょうぶ]です。", "Não, tudo bem.", [
          b("i.i.e", "LHH", "não", "expressao"),
          b("da.i.jo.o.bu", "LHHLL", "tudo bem", "adjetivo"),
          DESU,
        ]),
        dica_pt: "Diga: hoje eu convido.",
        chaves: ["ごちそう"],
        exemplo: line("きょうはごちそうします。", "今日[きょう]はごちそうします。", "Hoje eu convido. (nova: gochisou = pagar a refeição de alguém)", [
          b("kyo.o", "HL", "hoje", "tempo"),
          b("wa", "L", "[contraste]", "particula"),
          b("go.chi.so.o", "LHHH", "convite ★ nova", "substantivo"),
          b("_shi.ma._su", "HHL", "faço", "verbo"),
        ]),
      },
      {
        ia: line("じゃあ、おねがいします。", "じゃあ、お願[ねが]いします。", "Então, obrigado. (fim)", [
          b("ja.a", "HL", "então", "expressao"),
          b("o.ne.ga.i.shi.ma._su", "LHHHHHL", "por favor", "expressao"),
        ]),
      },
    ],
  },

  // ───────────── Consulta
  {
    id: "rp_cau_medica",
    titulo: "Na consulta",
    categoria: "cidade",
    emoji: "🩺",
    parceiro: { nome: "Dra. Suzuki · médica", emoji: "👩‍⚕️" },
    missao_pt: "Conte à médica o que está sentindo, fale do seu hábito com o café e entenda a orientação dela.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_477", "card_127"],
    system_prompt_cenario: "Médica pergunta o sintoma, se a pessoa toma café e recomenda dormir cedo.",
    roteiro: [
      { ia: DOU_SHIMASHITA, dica_pt: "Diga que está com dor de cabeça.", chaves: ["あたま", "頭", "いたい", "痛い"], exemplo_card: "card_127" },
      {
        ia: line("コーヒーはのみますか。", "コーヒーは飲[の]みますか。", "Você toma café?", [
          b("ko.o.hi.i", "LHHL", "café", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("no.mi.ma._su", "LHHL", "bebe", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que procura não tomar.",
        chaves: ["のまない", "飲まない"],
        exemplo_card: "card_477",
      },
      {
        ia: line("はやくねるようにしてください。", "早[はや]く寝[ね]るようにしてください。", "Procure dormir cedo.", [
          b("ha.ya.ku", "HLL", "cedo", "adverbio"),
          b("ne.ru", "LH", "dormir", "verbo"),
          ...YOU_NI_SHITE,
        ]),
        dica_pt: "Diga que entendeu.",
        chaves: ["わかり", "分かり"],
        exemplo_card: "card_030",
      },
      {
        ia: line("おだいじに。", "お大事[だいじ]に。", "Melhoras! (fim)", [b("o.da.i.ji.ni", "LHHHH", "melhoras", "expressao")]),
      },
    ],
  },
];
