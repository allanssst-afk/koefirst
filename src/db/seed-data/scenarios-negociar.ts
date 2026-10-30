import { seedCards } from "./cards";
import { b, emendar, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 41 (Discutir e negociar): negociar um preço, discordar em uma reunião e reclamar de um amigo.
 * Usam as frases de `cards-negociar.ts` como resposta-modelo. ★ nova = palavra nova.
 */

/** Uma frase do baralho como fala do parceiro. */
function fala(id: string, pt?: string) {
  const c = seedCards.find((x) => x.id === id)!;
  return line(`${c.kana}。`, `${c.kanji}。`, pt ?? c.traducao, c.blocos);
}

const DESU = b("de._su", "LL", "é", "copula");
const KA = b("ka", "L", "[?]", "particula");

export const cenariosNegociar: SeedScenario[] = [
  // ───────────── Preço
  {
    id: "rp_neg_preco",
    titulo: "Negociar o preço",
    categoria: "trabalho",
    emoji: "🤝",
    parceiro: { nome: "Nakamura-san · fornecedor", emoji: "🧑‍💼" },
    missao_pt: "O fornecedor passou um orçamento alto. Peça para baixar, diga quanto você tem e feche o acordo.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_550", "card_551", "card_558"],
    system_prompt_cenario: "Fornecedor apresenta 70 mil ienes, pergunta o orçamento e propõe 60 mil.",
    roteiro: [
      {
        ia: line("みつもりはななまんえんです。", "見積[みつ]もりは七万円[ななまんえん]です。", "O orçamento é de 70 mil ienes. (nova: mitsumori = orçamento do fornecedor)", [
          b("mi.tsu.mo.ri", "LHHH", "orçamento ★ nova", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("na.na.ma.n.e.n", "LHHHHH", "70 mil ienes", "substantivo"),
          b("de._su", "HL", "é", "copula"),
        ]),
        dica_pt: "Pergunte se dá para baixar um pouco.",
        chaves: ["やすく", "安く", "なりません"],
        exemplo_card: "card_550",
      },
      {
        ia: line("よさんはいくらですか。", "予算[よさん]はいくらですか。", "Qual é o seu orçamento?", [
          b("yo.sa.n", "HLL", "orçamento", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("i.ku.ra", "HLL", "quanto", "pergunta"),
          DESU,
          KA,
        ]),
        dica_pt: "Diga que é de 50 mil ienes.",
        chaves: ["ごまんえん", "五万円"],
        exemplo_card: "card_551",
      },
      { ia: fala("card_557"), dica_pt: "Aceite o acordo.", chaves: ["それで", "けっこう", "結構"], exemplo_card: "card_558" },
      {
        ia: line("ありがとうございます。", "ありがとうございます。", "Obrigado! (fim)", [
          b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
          b("go.za.i.ma._su", "LHHHL", "[forma educada]", "expressao"),
        ]),
      },
    ],
  },

  // ───────────── Reunião
  {
    id: "rp_neg_reuniao",
    titulo: "Discordar com jeito",
    categoria: "trabalho",
    emoji: "🗂️",
    parceiro: { nome: "Kobayashi-kachō · chefe", emoji: "👔" },
    missao_pt: "O chefe pede sua opinião sobre o plano. Discorde com respeito, explique o motivo e proponha outra saída.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_553", "card_556"],
    system_prompt_cenario: "Chefe pergunta a opinião sobre o plano, o motivo da discordância e aceita a proposta.",
    roteiro: [
      {
        ia: line("このけいかくをどうおもいますか。", "この計画[けいかく]をどう思[おも]いますか。", "O que você acha deste plano?", [
          b("ko.no", "LH", "este", "objeto"),
          b("ke.i.ka.ku", "HHHH", "plano", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("do.o", "HL", "como", "pergunta"),
          b("o.mo.i.ma._su", "LHHHL", "acha", "verbo"),
          KA,
        ]),
        dica_pt: "Discorde com respeito.",
        chaves: ["おっしゃること", "わかります"],
        exemplo_card: "card_553",
      },
      {
        ia: line("どうしてですか。", "どうしてですか。", "Por quê?", [b("do.o._shi.te", "HLLL", "por quê", "pergunta"), DESU, KA]),
        dica_pt: "Diga que acha um pouco caro.",
        chaves: ["たかい", "高い"],
        exemplo: line("すこしたかいとおもいます。", "少[すこ]し高[たか]いと思[おも]います。", "Acho um pouco caro.", [
          b("_su.ko._shi", "LHL", "um pouco", "adverbio"),
          b("ta.ka.i", "LHL", "caro", "adjetivo"),
          b("to", "L", "[citação: que…]", "particula"),
          b("o.mo.i.ma._su", "LHHHL", "penso", "verbo"),
        ]),
      },
      {
        ia: line("じゃあ、どうしたらいいですか。", "じゃあ、どうしたらいいですか。", "Então, o que é melhor fazer?", [
          b("ja.a", "HL", "então", "expressao"),
          b("do.o", "HL", "como", "pergunta"),
          b("_shi.ta.ra", "LLL", "se fizer", "verbo"),
          b("i.i", "HL", "bom", "adjetivo"),
          DESU,
          KA,
        ]),
        dica_pt: "Proponha: que tal fazer assim?",
        chaves: ["こうしたら", "どうでしょうか"],
        exemplo_card: "card_556",
      },
      {
        ia: line("もうすこしくわしくきかせてください。", "もう少[すこ]し詳[くわ]しく聞[き]かせてください。", "Conte com mais detalhes, por favor. (nova: kuwashiku = em detalhes)", [
          b("mo.o", "HL", "mais", "adverbio"),
          b("_su.ko._shi", "LHL", "um pouco", "adverbio"),
          b("ku.wa._shi.ku", "LHHL", "em detalhes ★ nova", "adverbio"),
          b("ki.ka.se.te", "LHHH", "deixar ouvir (forma -te)", "verbo"),
          b("ku.da.sa.i", "HHHL", "por favor", "verbo"),
        ]),
        dica_pt: "Reconheça a posição do chefe, dê sua opinião e proponha uma saída.",
        aberto: {
          segundos: 60,
          pontos: [
            { rotulo: "Mostrar que entendeu", chaves: ["わかります", "おっしゃる"] },
            { rotulo: "Sua opinião", chaves: ["おもいます", "思います"] },
            { rotulo: "Um motivo", chaves: ["からです", "だから", "ので", "たかい", "高い"] },
            { rotulo: "Uma proposta", chaves: ["こうしたら", "どうでしょう", "たらどう"] },
          ],
        },
        exemplo: emendar(fala("card_553"), fala("card_542"), fala("card_556")),
      },
      { ia: fala("card_554", "Concordo. (fim)") },
    ],
  },

  // ───────────── Reclamar
  {
    id: "rp_neg_amigo",
    titulo: "Ele prometeu!",
    categoria: "social",
    emoji: "😤",
    parceiro: { nome: "Yuki · amiga", emoji: "👩" },
    missao_pt: "Um amigo faltou ao encontro. Conte à Yuki o que houve e reclame.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_543"],
    system_prompt_cenario: "Amiga pergunta o que houve, se ligaram e concorda que foi ruim.",
    roteiro: [
      { ia: fala("card_187"), dica_pt: "Diga que ele prometeu e não veio.", chaves: ["やくそく", "約束", "のに"], exemplo_card: "card_543" },
      {
        ia: line("でんわしましたか。", "電話[でんわ]しましたか。", "Você ligou?", [
          b("de.n.wa", "LHH", "telefonema", "substantivo"),
          b("_shi.ma._shi.ta", "HHLL", "fez", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que ligou, e ele não atendeu.",
        chaves: ["でんわした", "電話した", "でませんでした", "出ませんでした"],
        exemplo: line("でんわしたのに、でませんでした。", "電話[でんわ]したのに、出[で]ませんでした。", "Liguei, e mesmo assim não atendeu.", [
          b("de.n.wa", "LHH", "telefonema", "substantivo"),
          b("_shi.ta", "HH", "fiz (forma -ta)", "verbo"),
          b("no.ni", "LL", "apesar de", "particula"),
          b("de.ma.se.n", "LHHL", "não atendeu", "verbo"),
          b("de._shi.ta", "LLL", "[passado]", "copula"),
        ]),
      },
      {
        ia: line("ひどいですね。", "ひどいですね。", "Que coisa, né. (nova: hidoi = terrível) (fim)", [
          b("hi.do.i", "LHL", "terrível ★ nova", "adjetivo"),
          b("de.su", "LL", "é", "copula"),
          b("ne", "L", "[né]", "particula"),
        ]),
      },
    ],
  },
];
