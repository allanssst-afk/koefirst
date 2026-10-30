import { seedCards } from "./cards";
import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 38 (Conselhos): aconselhar a Yuki, orientar um colega novo e pedir um conselho à professora.
 * Usam as frases de `cards-conselhos.ts` como resposta-modelo. ★ nova = palavra nova.
 */

/** Uma frase do baralho como fala do parceiro. */
function fala(id: string, pt?: string) {
  const c = seedCards.find((x) => x.id === id)!;
  return line(`${c.kana}。`, `${c.kanji}。`, pt ?? c.traducao, c.blocos);
}

const KA = b("ka", "L", "[?]", "particula");
const DESU = b("de._su", "LL", "é", "copula");
const NARIMASEN = b("na.ri.ma.se.n", "LHHHL", "não dá", "verbo");
const OBRIGADO_FIM = line("ありがとうございます。", "ありがとうございます。", "Obrigada! (fim)", [
  b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
  b("go.za.i.ma._su", "LHHHL", "[forma educada]", "expressao"),
]);

export const cenariosConselhos: SeedScenario[] = [
  // ───────────── Aconselhar
  {
    id: "rp_ace_amiga",
    titulo: "O que eu faço?",
    categoria: "social",
    emoji: "🤒",
    parceiro: { nome: "Yuki · amiga", emoji: "👩" },
    missao_pt: "A Yuki está doente e tem trabalho. Aconselhe-a a ir ao hospital, sugira descansar e diga com quem ela deve falar.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_484", "card_491", "card_487"],
    system_prompt_cenario: "Amiga conta que está com dor de cabeça, que tem trabalho amanhã e pergunta o que dizer ao gerente.",
    roteiro: [
      { ia: fala("card_188"), dica_pt: "Diga que é melhor ir ao hospital.", chaves: ["びょういん", "病院", "ほう"], exemplo_card: "card_484" },
      {
        ia: line("あした、しごとがあります。", "明日[あした]、仕事[しごと]があります。", "Amanhã tenho trabalho.", [
          b("a._shi.ta", "LHH", "amanhã", "tempo"),
          b("shi.go.to", "LHH", "trabalho", "sujeito"),
          b("ga", "H", "[Foco / sujeito]", "particula"),
          b("a.ri.ma._su", "HHHL", "existe", "verbo"),
        ]),
        dica_pt: "Sugira descansar um pouco.",
        chaves: ["やすんだら", "休んだら"],
        exemplo_card: "card_491",
      },
      {
        ia: line("ぶちょうになんといえばいいですか。", "部長[ぶちょう]に何[なん]と言[い]えばいいですか。", "O que eu digo ao gerente?", [
          b("bu.cho.o", "LHH", "gerente", "substantivo"),
          b("ni", "H", "[alvo]", "particula"),
          b("na.n", "HL", "o quê", "pergunta"),
          b("to", "L", "[citação: que…]", "particula"),
          b("i.e.ba", "LHL", "bastando dizer", "verbo"),
          b("i.i", "HL", "bom", "adjetivo"),
          DESU,
          KA,
        ]),
        dica_pt: "Diga que acha melhor conversar com o gerente.",
        chaves: ["そうだん", "相談"],
        exemplo_card: "card_487",
      },
      { ia: OBRIGADO_FIM },
    ],
  },

  // ───────────── Colega novo
  {
    id: "rp_ace_novato",
    titulo: "Não precisa",
    categoria: "trabalho",
    emoji: "🧑‍💻",
    parceiro: { nome: "Sato-san · colega novo", emoji: "🧑" },
    missao_pt: "Um colega novo está nervoso. Diga que não precisa fazer tudo, que não precisa correr e que o erro dele não é grave.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_482", "card_498"],
    system_prompt_cenario: "Colega novo, nervoso, pergunta o que precisa fazer e conta que errou.",
    roteiro: [
      {
        ia: line("ぜんぶやらなければなりませんか。", "全部[ぜんぶ]やらなければなりませんか。", "Tenho que fazer tudo?", [
          b("ze.n.bu", "HLL", "tudo", "adverbio"),
          b("ya.ra.na.ke.re.ba", "LLLLLL", "se não fizer", "verbo"),
          NARIMASEN,
          KA,
        ]),
        dica_pt: "Diga que não precisa fazer tudo.",
        chaves: ["やらなくても"],
        exemplo_card: "card_482",
      },
      {
        ia: line("いそがなければなりませんか。", "急[いそ]がなければなりませんか。", "Tenho que me apressar?", [
          b("i.so.ga.na.ke.re.ba", "LHHLLLL", "se não apressar", "verbo"),
          NARIMASEN,
          KA,
        ]),
        dica_pt: "Diga que não precisa se apressar.",
        chaves: ["いそがなくても", "急がなくても"],
        exemplo: line("いいえ、いそがなくてもいいです。", "いいえ、急[いそ]がなくてもいいです。", "Não, não precisa se apressar.", [
          b("i.i.e", "LHH", "não", "expressao"),
          b("i.so.ga.na._ku.te.mo", "LHHLLLL", "mesmo sem apressar", "verbo"),
          b("i.i", "HL", "bom", "adjetivo"),
          DESU,
        ]),
      },
      { ia: fala("card_363"), dica_pt: "Diga para não se preocupar.", chaves: ["きにしない", "気にしない"], exemplo_card: "card_498" },
      { ia: OBRIGADO_FIM },
    ],
  },

  // ───────────── Pedir conselho
  {
    id: "rp_ace_professora",
    titulo: "Pedir um conselho",
    categoria: "social",
    emoji: "📖",
    parceiro: { nome: "Prof.ª Nakamura", emoji: "👩‍🏫" },
    missao_pt: "Peça um conselho à professora: pergunte se você precisa mesmo fazer a prova.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_495"],
    system_prompt_cenario: "Professora gentil ouve a dúvida, diz que a prova não é obrigatória e incentiva a tentar.",
    roteiro: [
      {
        ia: line("どうしましたか。", "どうしましたか。", "O que houve?", [
          b("do.o", "HL", "como", "pergunta"),
          b("_shi.ma._shi.ta", "LLLL", "fez", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que queria pedir um conselho.",
        chaves: ["そうだん", "相談"],
        exemplo_card: "card_495",
      },
      {
        ia: line("なんですか。", "何[なん]ですか。", "O que é?", [b("na.n", "HL", "o quê", "pergunta"), DESU, KA]),
        dica_pt: "Pergunte se precisa fazer a prova.",
        chaves: ["しけん", "試験", "うけなければ", "受けなければ"],
        exemplo: line("しけんをうけなければなりませんか。", "試験[しけん]を受[う]けなければなりませんか。", "Tenho que fazer a prova?", [
          b("_shi.ke.n", "LHL", "prova", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("u.ke.na.ke.re.ba", "LHHLLL", "se não fizer", "verbo"),
          NARIMASEN,
          KA,
        ]),
      },
      {
        ia: line("いいえ、うけなくてもいいです。", "いいえ、受[う]けなくてもいいです。", "Não, não precisa fazer.", [
          b("i.i.e", "LHH", "não", "expressao"),
          b("u.ke.na._ku.te.mo", "LHHLLL", "mesmo sem fazer", "verbo"),
          b("i.i", "HL", "bom", "adjetivo"),
          DESU,
        ]),
        dica_pt: "Diga que entendeu.",
        chaves: ["わかり", "分かり"],
        exemplo_card: "card_030",
      },
      { ia: fala("card_493", "Mas experimente uma vez! (fim)") },
    ],
  },
];
