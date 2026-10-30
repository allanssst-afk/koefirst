import { seedCards } from "./cards";
import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 35 (Aparências e impressões): o céu que fechou, os boatos do escritório e a vitrine da confeitaria.
 * Usam as frases de `cards-aparencias.ts` como resposta-modelo. ★ nova = palavra nova.
 */

/** Uma frase do baralho como fala do parceiro. */
function fala(id: string, pt?: string) {
  const c = seedCards.find((x) => x.id === id)!;
  return line(`${c.kana}。`, `${c.kanji}。`, pt ?? c.traducao, c.blocos);
}

const DESU = b("de._su", "LL", "é", "copula");
const KA = b("ka", "L", "[?]", "particula");

export const cenariosAparencias: SeedScenario[] = [
  // ───────────── Céu fechado
  {
    id: "rp_apa_tempo",
    titulo: "Parece que vai chover",
    categoria: "social",
    emoji: "🌧️",
    parceiro: { nome: "Yuki · amiga", emoji: "👩" },
    missao_pt: "Passeando com a Yuki, o céu fecha. Agradeça o elogio, diga o que acha que vai acontecer e conte que está sem guarda-chuva.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_420"],
    system_prompt_cenario: "Amiga comenta a aparência, nota o céu escuro, pergunta pelo guarda-chuva e sugere correr.",
    roteiro: [
      {
        ia: fala("card_422"),
        dica_pt: "Agradeça.",
        chaves: ["ありがとう"],
        exemplo: line("ありがとうございます。", "ありがとうございます。", "Obrigado.", [
          b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
          b("go.za.i.ma._su", "LHHHL", "[forma educada]", "expressao"),
        ]),
      },
      {
        ia: line("そらがくらいですね。", "空[そら]が暗[くら]いですね。", "O céu está escuro, né. (novas: sora = céu, kurai = escuro)", [
          b("so.ra", "HL", "céu ★ nova", "sujeito"),
          b("ga", "L", "[Foco / sujeito]", "particula"),
          b("ku.ra.i", "LHL", "escuro ★ nova", "adjetivo"),
          b("de.su", "LL", "é", "copula"),
          b("ne", "L", "[né]", "particula"),
        ]),
        dica_pt: "Diga que parece que vai chover.",
        chaves: ["ふりそう", "降りそう"],
        exemplo_card: "card_420",
      },
      {
        ia: line("かさはありますか。", "傘[かさ]はありますか。", "Você tem guarda-chuva?", [
          b("ka.sa", "HL", "guarda-chuva", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("a.ri.ma._su", "LHHL", "existe", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que não.",
        chaves: ["ありません"],
        exemplo: line("いいえ、ありません。", "いいえ、ありません。", "Não, não tenho.", [
          b("i.i.e", "LHH", "não", "expressao"),
          b("a.ri.ma.se.n", "LHHHL", "não existe", "verbo"),
        ]),
      },
      {
        ia: line("じゃあ、いそぎましょう。", "じゃあ、急[いそ]ぎましょう。", "Então vamos correr! (nova: isogu = apressar-se) (fim)", [
          b("ja.a", "HL", "então", "expressao"),
          b("i.so.gi.ma.sho.o", "LHHHHL", "vamos apressar-nos ★ nova", "verbo"),
        ]),
      },
    ],
  },

  // ───────────── Boatos
  {
    id: "rp_apa_boato",
    titulo: "Ouvi dizer que…",
    categoria: "trabalho",
    emoji: "🗣️",
    parceiro: { nome: "Suzuki-san · colega", emoji: "🧑" },
    missao_pt: "Um colega procura o Tanaka. Conte o que ouviu sobre a folga dele, diga o motivo provável e passe a novidade sobre o novo gerente.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_430", "card_428", "card_432"],
    system_prompt_cenario: "Colega pergunta pelo Tanaka e pelo novo gerente, e reage à novidade.",
    roteiro: [
      {
        ia: line("たなかさんはきていますか。", "田中[たなか]さんは来[き]ていますか。", "O Tanaka veio?", [
          b("ta.na.ka", "LHH", "Tanaka", "topico"),
          b("sa.n", "HH", "sr., sra.", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("ki.te", "HL", "vir (forma -te)", "verbo"),
          b("i.ma._su", "LHL", "está", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que parece que ele está de folga.",
        chaves: ["やすみらしい", "休みらしい"],
        exemplo_card: "card_430",
      },
      {
        ia: line("どうしてですか。", "どうしてですか。", "Por quê?", [b("do.o._shi.te", "HLLL", "por quê", "pergunta"), DESU, KA]),
        dica_pt: "Diga que parece ter pegado um resfriado.",
        chaves: ["かぜ", "風邪"],
        exemplo: fala("card_428", "Parece que pegou um resfriado."),
      },
      {
        ia: line("あたらしいぶちょうのはなしをききましたか。", "新[あたら]しい部長[ぶちょう]の話[はなし]を聞[き]きましたか。", "Você ouviu a história do novo gerente?", [
          b("a.ta.ra._shi.i", "LHHHL", "novo", "adjetivo"),
          b("bu.cho.o", "LHH", "gerente", "substantivo"),
          b("no", "H", "[de]", "particula"),
          b("ha.na._shi", "LHH", "história, conversa", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("_ki.ki.ma._shi.ta", "LHHLL", "ouviu", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que parece que vem no mês que vem.",
        chaves: ["らいげつ", "来月", "らしい"],
        exemplo_card: "card_432",
      },
      {
        ia: line("そうですか。しりませんでした。", "そうですか。知[し]りませんでした。", "Ah, é? Eu não sabia. (fim)", [
          b("so.o", "HL", "assim", "expressao"),
          DESU,
          KA,
          b("_shi.ri.ma.se.n", "LHHHL", "não sei", "verbo"),
          b("de._shi.ta", "LLL", "[passado]", "copula"),
        ]),
      },
    ],
  },

  // ───────────── Confeitaria
  {
    id: "rp_apa_doce",
    titulo: "Parece gostoso",
    categoria: "restaurante",
    emoji: "🍰",
    parceiro: { nome: "Yuki · amiga", emoji: "👩" },
    missao_pt: "Diante da vitrine, comente a aparência do doce, aceite provar e diga como foi. Use o que já aprendeu sobre impressões.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_419", "card_434"],
    system_prompt_cenario: "Amiga mostra um bolo, convida para comer e comenta a alegria do outro.",
    roteiro: [
      {
        ia: line("このケーキはどうですか。", "このケーキはどうですか。", "Que tal este bolo?", [
          b("ko.no", "LH", "este", "topico"),
          b("ke.e.ki", "HLL", "bolo", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("do.o", "HL", "como", "pergunta"),
          DESU,
          KA,
        ]),
        dica_pt: "Diga que parece gostoso.",
        chaves: ["おいしそう"],
        exemplo_card: "card_419",
      },
      {
        ia: line("たべませんか。", "食[た]べませんか。", "Vamos comer?", [b("ta.be.ma.se.n", "LHHHL", "não vamos comer", "verbo"), KA]),
        dica_pt: "Aceite.",
        chaves: ["たべます", "食べます"],
        exemplo: line("はい、たべます。", "はい、食[た]べます。", "Sim, vou comer.", [
          b("ha.i", "HL", "sim", "expressao"),
          b("ta.be.ma._su", "LHHL", "como", "verbo"),
        ]),
      },
      {
        ia: line("どうですか。", "どうですか。", "E aí, como está?", [b("do.o", "HL", "como", "pergunta"), DESU, KA]),
        dica_pt: "Diga que parece um sonho.",
        chaves: ["ゆめ", "夢"],
        exemplo_card: "card_434",
      },
      { ia: fala("card_437", "Você parece feliz, né. (fim)") },
    ],
  },
];
