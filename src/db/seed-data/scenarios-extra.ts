import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Mais situações do dia a dia (hotel, farmácia, bilheteria, almoço com colega, festa).
 * Mesmo padrão: pitch de Tóquio na frase, ★ nova = palavra nova, resposta-modelo para "Como responder?".
 */

const obrigadoPassado = line("ありがとうございました！", "ありがとうございました！", "Muito obrigado! (fim)", [
  b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
  b("go.za.i.ma._shi.ta", "LHHHLL", "[educado, pelo que já aconteceu]", "expressao"),
]);

const comIsto = line("これでおねがいします。", "これでお願[ねが]いします。", "Com isto, por favor (entregando dinheiro ou cartão).", [
  b("ko.re", "LH", "isto", "substantivo"),
  b("de", "H", "[Meio / instrumento]", "particula"),
  b("o.ne.ga.i.shi.ma._su", "LHHHHHL", "peço (por favor)", "verbo"),
]);

export const cenariosExtra: SeedScenario[] = [
  // ───────────── Cidade: hotel
  {
    id: "rp_cid_hotel",
    titulo: "Fazendo check-in no hotel",
    categoria: "cidade",
    emoji: "🏨",
    parceiro: { nome: "Recepcionista", emoji: "🛎️" },
    missao_pt: "Você chega ao hotel à tarde. Cumprimente a recepcionista, agradeça e confirme o horário do café da manhã.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_002", "card_004", "card_030"],
    system_prompt_cenario: "Recepcionista de hotel: recebe o hóspede, indica o quarto, informa o café da manhã e se despede.",
    roteiro: [
      {
        ia: line("いらっしゃいませ。", "いらっしゃいませ。", "Bem-vindo!", [b("i.ra.s.sha.i.ma.se", "LHHHHHL", "bem-vindo", "expressao")]),
        dica_pt: "Cumprimente (é de tarde).",
        chaves: ["こんにちは", "今日は"],
        exemplo_card: "card_002",
      },
      {
        ia: line("おへやはこちらです。", "お部屋[へや]はこちらです。", "Seu quarto é por aqui. (nova: heya = quarto)", [
          b("o.he.ya", "LHH", "quarto ★ nova", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("ko.chi.ra", "LHH", "por aqui (educado)", "lugar"),
          b("de._su", "HL", "é", "copula"),
        ]),
        dica_pt: "Agradeça.",
        chaves: ["ありがとう"],
        exemplo_card: "card_004",
      },
      {
        ia: line("あさごはんはしちじからです。", "朝[あさ]ご飯[はん]は七時[しちじ]からです。", "O café da manhã é a partir das 7. (nova: shichiji = 7 horas)", [
          b("a.sa.go.ha.n", "LHHLL", "café da manhã", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("shi.chi.ji", "LHL", "7 horas ★ nova", "tempo"),
          b("ka.ra", "LL", "a partir de", "particula"),
          b("de._su", "LL", "é", "copula"),
        ]),
        dica_pt: "Diga que entendeu.",
        chaves: ["わかりました", "分かりました"],
        exemplo_card: "card_030",
      },
      {
        ia: line("ごゆっくりどうぞ。", "ごゆっくりどうぞ。", "Fique à vontade! (fim)", [
          b("go.yu.k.ku.ri", "LHHHL", "com calma, à vontade", "adverbio"),
          b("do.o.zo", "HLL", "por favor (fique)", "expressao"),
        ]),
      },
    ],
  },

  // ───────────── Cidade: bilheteria
  {
    id: "rp_cid_passagem",
    titulo: "Comprando passagem de trem",
    categoria: "cidade",
    emoji: "🎫",
    parceiro: { nome: "Atendente da estação", emoji: "🧑‍✈️" },
    missao_pt: "Na bilheteria, diga para onde vai, receba a passagem e descubra onde fica o trem.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_015", "card_004", "card_030"],
    system_prompt_cenario: "Atendente de bilheteria: pergunta o destino, entrega a passagem e indica onde fica o trem.",
    roteiro: [
      {
        ia: line("どちらまでですか。", "どちらまでですか。", "Até onde você vai?", [
          b("do.chi.ra", "HLL", "onde (educado)", "pergunta"),
          b("ma.de", "LL", "[até]", "particula"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga: até Tóquio, por favor.",
        chaves: ["とうきょう", "東京", "まで"],
        exemplo: line("とうきょうまでおねがいします。", "東京[とうきょう]までお願[ねが]いします。", "Até Tóquio, por favor.", [
          b("to.o.kyo.o", "LHHH", "Tóquio", "lugar"),
          b("ma.de", "HH", "[até]", "particula"),
          b("o.ne.ga.i.shi.ma._su", "LHHHHHL", "peço (por favor)", "verbo"),
        ]),
      },
      {
        ia: line("はい、どうぞ。", "はい、どうぞ。", "Aqui está.", [b("ha.i", "HL", "sim", "expressao"), b("do.o.zo", "HLL", "por favor (pegue)", "expressao")]),
        dica_pt: "Agradeça.",
        chaves: ["ありがとう"],
        exemplo_card: "card_004",
      },
      {
        ia: line("でんしゃはあそこです。", "電車[でんしゃ]はあそこです。", "O trem é ali.", [
          b("de.n.sha", "LHH", "trem", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("a.so.ko", "LHH", "ali", "lugar"),
          b("de._su", "HL", "é", "copula"),
        ]),
        dica_pt: "Diga que entendeu.",
        chaves: ["わかりました", "分かりました"],
        exemplo_card: "card_030",
      },
      { ia: obrigadoPassado },
    ],
  },

  // ───────────── Compras: farmácia
  {
    id: "rp_comp_farmacia",
    titulo: "Na farmácia com dor de cabeça",
    categoria: "compras",
    emoji: "💊",
    parceiro: { nome: "Farmacêutica", emoji: "👩‍⚕️" },
    missao_pt: "Você está com dor de cabeça. Explique o problema, pergunte o preço do remédio e pague.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_009", "card_004"],
    system_prompt_cenario: "Farmacêutica: pergunta o que houve, oferece um remédio, diz o preço e deseja melhoras.",
    roteiro: [
      {
        ia: line("どうしましたか。", "どうしましたか。", "O que houve?", [
          b("do.o", "HL", "como", "pergunta"),
          b("shi.ma._shi.ta", "LHLL", "ficou / fez", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que está com dor de cabeça.",
        chaves: ["あたま", "頭", "いたい", "痛い"],
        exemplo: line("あたまがいたいです。", "頭[あたま]が痛[いた]いです。", "Estou com dor de cabeça. (literal: a cabeça dói)", [
          b("a.ta.ma", "LHH", "cabeça ★ nova", "sujeito"),
          b("ga", "L", "[Foco: o que dói]", "particula"),
          b("i.ta.i", "LHL", "dói ★ nova", "adjetivo"),
          b("de._su", "LL", "é (polidez)", "copula"),
        ]),
      },
      {
        ia: line("このくすりをどうぞ。", "この薬[くすり]をどうぞ。", "Tome este remédio. (nova: kusuri = remédio)", [
          b("ko.no", "LH", "este", "substantivo"),
          b("_ku.su.ri", "HHH", "remédio ★ nova", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("do.o.zo", "HLL", "por favor (pegue)", "expressao"),
        ]),
        dica_pt: "Pergunte quanto custa.",
        chaves: ["いくら"],
        exemplo: line("いくらですか。", "いくらですか。", "Quanto custa?", [
          b("i.ku.ra", "HLL", "quanto (preço)", "pergunta"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
      },
      {
        ia: line("せんえんです。", "千円[せんえん]です。", "São 1000 ienes.", [b("se.n.e.n", "HLLL", "1000 ienes", "substantivo"), b("de._su", "LL", "é", "copula")]),
        dica_pt: "Pague dizendo «com isto, por favor».",
        chaves: ["これで", "おねがい", "お願い"],
        exemplo: comIsto,
      },
      {
        ia: line("おだいじに。", "お大事[だいじ]に。", "Melhoras! (fim)", [b("o.da.i.ji.ni", "LHHHH", "melhoras, cuide-se", "expressao")]),
      },
    ],
  },

  // ───────────── Trabalho: almoço com colega
  {
    id: "rp_trab_almoco",
    titulo: "Convite para almoçar com a colega",
    categoria: "trabalho",
    emoji: "🥢",
    parceiro: { nome: "Kimura-san · colega", emoji: "👩‍💼" },
    missao_pt: "Na hora do almoço, a colega Kimura te chama. Diga se já comeu, aceite o convite e conte o que quer comer.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_017", "card_023", "card_018"],
    system_prompt_cenario: "Colega de trabalho na hora do almoço: pergunta se já comeu, convida e pergunta o que quer comer.",
    roteiro: [
      {
        ia: line("ひるごはんをたべましたか。", "昼[ひる]ご飯[はん]を食[た]べましたか。", "Você já almoçou?", [
          b("hi.ru.go.ha.n", "LHHLL", "almoço", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("ta.be.ma._shi.ta", "LHHLL", "comeu", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que ainda não comeu.",
        chaves: ["たべ", "食べ"],
        exemplo: line("いいえ、たべませんでした。", "いいえ、食[た]べませんでした。", "Não, não comi.", [
          b("i.i.e", "LHH", "não", "expressao"),
          b("ta.be.ma.se.n", "LHHHL", "comer + não", "verbo"),
          b("de._shi.ta", "LLL", "[passado]", "verbo"),
        ]),
      },
      {
        ia: line("いっしょにたべませんか。", "一緒[いっしょ]に食[た]べませんか。", "Vamos comer juntos? (nova: issho ni = juntos)", [
          b("i.s.sho", "LHH", "juntos ★ nova", "adverbio"),
          b("ni", "H", "[de modo]", "particula"),
          b("ta.be.ma.se.n", "LHHHL", "comer + não…", "verbo"),
          b("ka", "L", "[?] → convite", "particula"),
        ]),
        dica_pt: "Aceite com entusiasmo.",
        chaves: ["いいです", "いい"],
        exemplo_card: "card_023",
      },
      {
        ia: line("なにがたべたいですか。", "何[なに]が食[た]べたいですか。", "O que você quer comer?", [
          b("na.ni", "HL", "o quê", "pergunta"),
          b("ga", "L", "[Foco do desejo]", "particula"),
          b("ta.be.ta.i", "LHLL", "comer + quero", "verbo"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que quer comer sushi.",
        chaves: ["たべたい", "食べたい"],
        exemplo_card: "card_018",
      },
      {
        ia: line("いいですね。いきましょう。", "いいですね。行[い]きましょう。", "Boa! Vamos lá. (fim)", [
          b("i.i", "HL", "bom", "adjetivo"),
          b("de.su", "LL", "é", "copula"),
          b("ne", "L", "[né]", "particula"),
          b("i.ki.ma.sho.o", "LHHHL", "ir + vamos", "verbo"),
        ]),
      },
    ],
  },

  // ───────────── Vida social: festa
  {
    id: "rp_soc_festa",
    titulo: "Conhecendo alguém numa festa",
    categoria: "social",
    emoji: "🎉",
    parceiro: { nome: "Aiko · nova amiga", emoji: "👩" },
    missao_pt: "Numa festa, você conhece a Aiko. Responda ao cumprimento, diga de onde veio e conte o que está achando do Japão.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_006", "card_007"],
    system_prompt_cenario: "Aiko, japonesa simpática numa festa: se apresenta, pergunta de onde o usuário veio e o que acha do Japão.",
    roteiro: [
      {
        ia: line("はじめまして。あいこです。", "初[はじ]めまして。愛子[あいこ]です。", "Muito prazer. Sou a Aiko.", [
          b("ha.ji.me.ma._shi.te", "LHHHLL", "muito prazer", "expressao"),
          b("a.i.ko", "HLL", "Aiko (nome)", "substantivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
        dica_pt: "Responda ao cumprimento.",
        chaves: ["はじめまして", "初めまして"],
        exemplo_card: "card_006",
      },
      {
        ia: line("どこからきましたか。", "どこから来[き]ましたか。", "De onde você veio?", [
          b("do.ko", "HL", "onde", "pergunta"),
          b("ka.ra", "LL", "[de / a partir de]", "particula"),
          b("ki.ma._shi.ta", "LHLL", "veio", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que veio do Brasil.",
        chaves: ["ブラジル", "ぶらじる"],
        exemplo: line("ブラジルからきました。", "ブラジルから来[き]ました。", "Vim do Brasil.", [
          b("bu.ra.ji.ru", "LHHH", "Brasil", "lugar"),
          b("ka.ra", "HH", "[de]", "particula"),
          b("ki.ma._shi.ta", "LHLL", "vim", "verbo"),
        ]),
      },
      {
        ia: line("にほんはどうですか。", "日本[にほん]はどうですか。", "O que está achando do Japão?", [
          b("ni.ho.n", "LHL", "Japão", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("do.o", "HL", "como", "pergunta"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que está sendo divertido.",
        chaves: ["たのし", "楽し", "いい"],
        exemplo: line("たのしいです。", "楽[たの]しいです。", "É divertido! (nova: tanoshii)", [
          b("ta.no.shi.i", "LHHL", "divertido ★ nova", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
      },
      {
        ia: line("よかったです！", "よかったです！", "Que bom! (fim)", [b("yo.ka.t.ta", "HLLL", "foi bom", "adjetivo"), b("de._su", "LL", "é", "copula")]),
      },
    ],
  },
];
