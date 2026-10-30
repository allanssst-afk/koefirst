import { seedCards } from "./cards";
import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 26 (Revisão da Fase 2): a conversa casual de 3 minutos (marco do mês 5) e a conversa educada
 * com a professora. As falas e respostas-modelo são frases das unidades 15–25, já conferidas no OJAD.
 */

/** Uma frase do baralho como fala do parceiro. */
function fala(id: string) {
  const c = seedCards.find((x) => x.id === id)!;
  return line(/[？。]$/.test(c.kana) ? c.kana : `${c.kana}。`, /[？。]$/.test(c.kanji) ? c.kanji : `${c.kanji}。`, c.traducao, c.blocos);
}

export const cenariosRevisaoFase2: SeedScenario[] = [
  // ───────────── Conversa casual de 3 minutos
  {
    id: "rp_rev2_amigos",
    titulo: "Conversa casual de 3 minutos",
    categoria: "social",
    emoji: "💬",
    parceiro: { nome: "Yuki · amiga", emoji: "👩" },
    missao_pt:
      "O grande teste da fala casual: encontre a Yuki, conte o que fez ontem, diga se foi legal, explique por que amanhã não dá, fale do Japão e combine de ir junto. Sem formas educadas: vocês são amigos.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_163", "card_164", "card_165", "card_166", "card_168", "card_174", "card_170"],
    system_prompt_cenario: "Amiga em conversa casual: pergunta como você está, o que fez ontem, se está livre, se já foi ao Japão e convida para ir junto.",
    roteiro: [
      { ia: fala("card_163"), dica_pt: "Diga que está bem.", chaves: ["げんき", "元気"], exemplo_card: "card_164" },
      { ia: fala("card_165"), dica_pt: "Diga que viu um filme.", chaves: ["えいが", "映画", "みた", "見た"], exemplo_card: "card_166" },
      { ia: fala("card_167"), dica_pt: "Diga que não foi muito legal.", chaves: ["おもしろくなかった", "面白くなかった"], exemplo_card: "card_168" },
      { ia: fala("card_173"), dica_pt: "Diga que amanhã você trabalha.", chaves: ["バイト", "あした", "明日"], exemplo_card: "card_174" },
      {
        ia: line("にほんにいったことある？", "日本[にほん]に行[い]ったことある？", "Você já foi ao Japão?", [
          b("ni.ho.n", "LHL", "Japão", "lugar"),
          b("ni", "L", "[Destino]", "particula"),
          b("i.t.ta", "LHH", "foi", "verbo"),
          b("ko.to", "HH", "o fato, a experiência", "substantivo"),
          b("a.ru", "LL", "existe (forma plana)", "verbo"),
        ]),
        dica_pt: "Diga: não, ainda não.",
        chaves: ["まだ", "ううん"],
        exemplo: line("ううん、まだない。", "ううん、まだない。", "Não, ainda não.", [
          b("u.u.n", "LHH", "não (casual)", "expressao"),
          b("ma.da", "HL", "ainda", "adverbio"),
          b("na.i", "LL", "não há (forma plana)", "adjetivo"),
        ]),
      },
      { ia: fala("card_239"), dica_pt: "Aceite o convite.", chaves: ["いいね", "いこう", "行こう"], exemplo_card: "card_170" },
      {
        ia: line("じゃあ、またね。", "じゃあ、またね。", "Então, até mais! (fim)", [
          b("ja.a", "HL", "então", "expressao"),
          b("ma.ta", "LH", "de novo", "adverbio"),
          b("ne", "H", "[né]", "particula"),
        ]),
      },
    ],
  },

  // ───────────── Conversa educada
  {
    id: "rp_rev2_professora",
    titulo: "Conversa com a professora",
    categoria: "social",
    emoji: "🎓",
    parceiro: { nome: "Prof.ª Nakamura", emoji: "👩‍🏫" },
    missao_pt:
      "Fechando a Fase 2: a professora quer conhecer você. Fale da família e do hobby, diga quanto de japonês consegue falar, explique por que estuda e conte seus planos, sempre com educação.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_116", "card_140", "card_144", "card_196", "card_200", "card_230"],
    system_prompt_cenario: "Professora gentil pergunta sobre família, hobby, japonês, motivo de estudar, viagem ao Japão e planos do fim de semana.",
    roteiro: [
      { ia: fala("card_115"), dica_pt: "Diga quantos são na sua família.", chaves: ["かぞく", "家族"], exemplo_card: "card_116" },
      { ia: fala("card_139"), dica_pt: "Conte o seu hobby.", chaves: ["こと", "しゅみ", "趣味"], exemplo_card: "card_140" },
      { ia: fala("card_143"), dica_pt: "Diga que consegue um pouco.", chaves: ["すこし", "少し"], exemplo_card: "card_144" },
      { ia: fala("card_195"), dica_pt: "Dê o seu motivo.", chaves: ["から"], exemplo_card: "card_196" },
      { ia: fala("card_199"), dica_pt: "Diga que ainda não foi.", chaves: ["まだ", "ありません"], exemplo_card: "card_200" },
      { ia: fala("card_229"), dica_pt: "Conte o que pretende fazer.", chaves: ["つもり"], exemplo_card: "card_230" },
      {
        ia: line("がんばってくださいね。", "頑張[がんば]ってくださいね。", "Continue se esforçando! (fim)", [
          b("ga.n.ba.t.te", "LHHLL", "esforce-se", "verbo"),
          b("ku.da.sa.i", "LLLL", "por favor", "verbo"),
          b("ne", "L", "[tá?]", "particula"),
        ]),
      },
    ],
  },
];
