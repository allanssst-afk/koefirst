import { seedCards } from "./cards";
import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 31 (Banco, correio e prefeitura): abrir uma conta, enviar uma encomenda e mudar o endereço.
 * Usam as frases de `cards-servicos.ts` como resposta-modelo. ★ nova = palavra nova.
 */

/** Uma frase do baralho como fala do parceiro. */
function fala(id: string) {
  const c = seedCards.find((x) => x.id === id)!;
  return line(`${c.kana}。`, `${c.kanji}。`, c.traducao, c.blocos);
}

const DESU = b("de._su", "LL", "é", "copula");
const KA = b("ka", "L", "[?]", "particula");
const IRASSHAIMASE = line("いらっしゃいませ。", "いらっしゃいませ。", "Seja bem-vindo!", [b("i.ra.s.sha.i.ma.se", "LHHHHHL", "seja bem-vindo", "expressao")]);
const ARIGATOU = line("ありがとうございます。", "ありがとうございます。", "Obrigado.", [
  b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
  b("go.za.i.ma._su", "LHHHL", "[forma educada]", "expressao"),
]);
const ARIGATOU_FIM = line("ありがとうございました。", "ありがとうございました。", "Obrigado! (fim)", [
  b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
  b("go.za.i.ma._shi.ta", "LHHHLL", "[forma educada]", "expressao"),
]);

export const cenariosServicos: SeedScenario[] = [
  // ───────────── Banco
  {
    id: "rp_ser_banco",
    titulo: "Abrir uma conta",
    categoria: "cidade",
    emoji: "🏦",
    parceiro: { nome: "Atendente do banco", emoji: "🧑‍💼" },
    missao_pt: "No banco, diga que quer abrir uma conta, entregue o cartão de residente, peça ajuda com o formulário e explique que não tem carimbo.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_339", "card_347", "card_354"],
    system_prompt_cenario: "Atendente educada pede o cartão de residente, entrega o formulário, pergunta pelo carimbo e aceita assinatura.",
    roteiro: [
      { ia: IRASSHAIMASE, dica_pt: "Diga que quer abrir uma conta.", chaves: ["こうざ", "口座"], exemplo_card: "card_339" },
      {
        ia: fala("card_351"),
        dica_pt: "Entregue o cartão: aqui está.",
        chaves: ["どうぞ"],
        exemplo: line("はい、どうぞ。", "はい、どうぞ。", "Sim, aqui está.", [b("ha.i", "HL", "sim", "expressao"), b("do.o.zo", "HLL", "aqui está", "expressao")]),
      },
      { ia: fala("card_353"), dica_pt: "Peça que ensinem como preencher.", chaves: ["かきかた", "書き方"], exemplo_card: "card_347" },
      {
        ia: line("はんこはありますか。", "はんこはありますか。", "Você tem carimbo?", [
          b("ha.n.ko", "LHH", "carimbo", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("a.ri.ma._su", "LHHL", "existe", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que não tem.",
        chaves: ["はんこ", "もっていません", "持っていません"],
        exemplo_card: "card_354",
      },
      {
        ia: line("サインでもいいですよ。", "サインでもいいですよ。", "Pode ser assinatura. (fim)", [
          b("sa.i.n", "HLL", "assinatura", "substantivo"),
          b("de.mo", "LL", "mesmo", "particula"),
          b("i.i", "HL", "bom", "adjetivo"),
          b("de.su", "LL", "é", "copula"),
          b("yo", "L", "[te conto]", "particula"),
        ]),
      },
    ],
  },

  // ───────────── Correio
  {
    id: "rp_ser_correio",
    titulo: "Enviar uma encomenda",
    categoria: "cidade",
    emoji: "📮",
    parceiro: { nome: "Atendente do correio", emoji: "🧑‍💼" },
    missao_pt: "No correio, diga que quer enviar a encomenda para o Brasil, conte o que tem dentro e pergunte quanto tempo leva.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_342", "card_346"],
    system_prompt_cenario: "Atendente pergunta o conteúdo da encomenda, informa o preço e o prazo de entrega.",
    roteiro: [
      { ia: IRASSHAIMASE, dica_pt: "Diga que quer enviar esta encomenda para o Brasil.", chaves: ["ブラジル", "おくりたい", "送りたい"], exemplo_card: "card_342" },
      {
        ia: line("なにがはいっていますか。", "何[なに]が入[はい]っていますか。", "O que tem dentro?", [
          b("na.ni", "HL", "o quê", "pergunta"),
          b("ga", "L", "[Foco / sujeito]", "particula"),
          b("ha.i.t.te", "HLLL", "entrando (forma -te)", "verbo"),
          b("i.ma._su", "LHL", "está", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que tem livros.",
        chaves: ["ほん", "本"],
        exemplo: line("ほんがはいっています。", "本[ほん]が入[はい]っています。", "Tem livros dentro.", [
          b("ho.n", "HL", "livro", "sujeito"),
          b("ga", "L", "[Foco / sujeito]", "particula"),
          b("ha.i.t.te", "HLLL", "entrando (forma -te)", "verbo"),
          b("i.ma._su", "LLL", "está", "verbo"),
        ]),
      },
      {
        ia: line("ごせんえんです。", "五千円[ごせんえん]です。", "São cinco mil ienes.", [b("go.se.n.e.n", "LHHHL", "cinco mil ienes", "substantivo"), DESU]),
        dica_pt: "Pergunte quanto tempo leva.",
        chaves: ["どのくらい", "かかります"],
        exemplo_card: "card_346",
      },
      {
        ia: line("いっしゅうかんくらいです。", "一週間[いっしゅうかん]くらいです。", "Mais ou menos uma semana. (nova: isshuukan = uma semana)", [
          b("i.s.shu.u.ka.n", "LHHHHH", "uma semana ★ nova", "tempo"),
          b("ku.ra.i", "HLL", "mais ou menos", "particula"),
          DESU,
        ]),
        dica_pt: "Agradeça.",
        chaves: ["ありがとう"],
        exemplo: ARIGATOU,
      },
      { ia: ARIGATOU_FIM },
    ],
  },

  // ───────────── Prefeitura
  {
    id: "rp_ser_prefeitura",
    titulo: "Mudança de endereço",
    categoria: "cidade",
    emoji: "🏛️",
    parceiro: { nome: "Funcionário da prefeitura", emoji: "🧑‍💼" },
    missao_pt: "Na prefeitura, explique que se mudou e quer trocar o endereço. Quando a pessoa falar rápido, peça calma e confirme o guichê.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_352", "card_349"],
    system_prompt_cenario: "Funcionário pergunta o que a pessoa precisa e indica o guichê número 3.",
    roteiro: [
      {
        ia: line("なにかごようですか。", "何[なに]かご用[よう]ですか。", "Posso ajudar? (nova: goyou = assunto)", [
          b("na.ni.ka", "HLL", "algo", "pergunta"),
          b("go.yo.o", "LHL", "assunto ★ nova", "substantivo"),
          DESU,
          KA,
        ]),
        dica_pt: "Explique que se mudou e quer trocar o endereço.",
        chaves: ["ひっこした", "引っ越した", "じゅうしょ", "住所"],
        exemplo_card: "card_352",
      },
      {
        ia: line("さんばんのまどぐちにいってください。", "三番[さんばん]の窓口[まどぐち]に行[い]ってください。", "Vá ao guichê número 3, por favor.", [
          b("sa.n.ba.n", "HLLL", "número três", "substantivo"),
          b("no", "L", "[de]", "particula"),
          b("ma.do.gu.chi", "LHLL", "guichê", "lugar"),
          b("ni", "L", "[Destino]", "particula"),
          b("i.t.te", "LHH", "ir (forma -te)", "verbo"),
          b("ku.da.sa.i", "HHHL", "por favor", "verbo"),
        ]),
        dica_pt: "Peça que fale devagar.",
        chaves: ["ゆっくり"],
        exemplo_card: "card_349",
      },
      {
        ia: line("さんばんのまどぐちです。", "三番[さんばん]の窓口[まどぐち]です。", "É o guichê número 3.", [
          b("sa.n.ba.n", "HLLL", "número três", "substantivo"),
          b("no", "L", "[de]", "particula"),
          b("ma.do.gu.chi", "LHLL", "guichê", "lugar"),
          DESU,
        ]),
        dica_pt: "Diga que entendeu.",
        chaves: ["わかり", "分かり"],
        exemplo_card: "card_030",
      },
      { ia: ARIGATOU_FIM },
    ],
  },
];
