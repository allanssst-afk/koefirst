import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 10 (Peça e oriente): regras no templo, cadastro no balcão e o primeiro dia no escritório.
 * Usam as frases de `cards-pedidos.ts` como resposta-modelo. ★ nova = palavra nova.
 */

const obrigado = line("ありがとうございます。", "ありがとうございます。", "Obrigado.", [
  b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
  b("go.za.i.ma._su", "LHHHL", "[forma educada]", "expressao"),
]);

const entendi = line("わかりました。", "わかりました。", "Entendi.", [b("wa.ka.ri.ma._shi.ta", "LHHHLL", "entendi", "verbo")]);

const simAVontade = line("はい、どうぞ。", "はい、どうぞ。", "Sim, à vontade.", [
  b("ha.i", "HL", "sim", "expressao"),
  b("do.o.zo", "HLL", "à vontade", "expressao"),
]);

export const cenariosPedidos: SeedScenario[] = [
  // ───────────── Templo
  {
    id: "rp_ped_templo",
    titulo: "Visita ao templo",
    categoria: "cidade",
    emoji: "⛩️",
    parceiro: { nome: "Monge do templo", emoji: "🧘" },
    missao_pt:
      "Você visita um templo. Entenda o pedido para tirar os sapatos, pergunte se pode tirar foto, aceite a recusa educada e agradeça.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_070", "card_071", "card_075"],
    system_prompt_cenario:
      "Monge gentil: pede para tirar os sapatos, recusa fotos dentro do salão com 'chotto…' e diz que do lado de fora pode.",
    roteiro: [
      {
        ia: line("くつをぬいでください。", "靴[くつ]を脱[ぬ]いでください。", "Tire os sapatos, por favor.", [
          b("_ku.tsu", "LH", "sapatos", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("nu.i.de", "HLL", "tire", "verbo"),
          b("ku.da.sa.i", "LLLL", "por favor", "verbo"),
        ]),
        dica_pt: "Diga que entendeu.",
        chaves: ["わかり", "分かり", "はい"],
        exemplo: entendi,
      },
      {
        ia: line("どうぞ、こちらへ。", "どうぞ、こちらへ。", "Por favor, por aqui.", [
          b("do.o.zo", "HLL", "por favor", "expressao"),
          b("ko.chi.ra", "LHH", "por aqui", "lugar"),
          b("e", "H", "[Direção →]", "particula"),
        ]),
        dica_pt: "Pergunte se pode tirar foto.",
        chaves: ["しゃしん", "写真", "いいですか"],
        exemplo_card: "card_071",
      },
      {
        ia: line("すみません、ここではちょっと。", "すみません、ここではちょっと。", "Desculpe, aqui não dá.", [
          b("su.mi.ma.se.n", "LHHHL", "desculpe", "expressao"),
          b("ko.ko", "LH", "aqui", "lugar"),
          b("de", "H", "[Local da ação]", "particula"),
          b("wa", "L", "[contraste]", "particula"),
          b("cho.t.to", "HLL", "um pouco… (= não dá)", "expressao"),
        ]),
        dica_pt: "É um não educado. Diga que entendeu, sem insistir.",
        chaves: ["わかり", "分かり"],
        exemplo: entendi,
      },
      {
        ia: line("そとはだいじょうぶです。", "外[そと]は大丈夫[だいじょうぶ]です。", "Lá fora pode. (nova: soto = lado de fora)", [
          b("so.to", "HL", "lado de fora ★ nova", "lugar"),
          b("wa", "L", "[contraste]", "particula"),
          b("da.i.jo.o.bu", "LHHLL", "tudo bem, pode", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
        dica_pt: "Agradeça.",
        chaves: ["ありがと"],
        exemplo: obrigado,
      },
      {
        ia: line("ごゆっくりどうぞ。", "ごゆっくりどうぞ。", "Fique à vontade. (fim)", [
          b("go.yu.k.ku.ri", "LHHHL", "com calma (respeito)", "expressao"),
          b("do.o.zo", "HLL", "por favor", "expressao"),
        ]),
      },
    ],
  },

  // ───────────── Cadastro no balcão
  {
    id: "rp_ped_cadastro",
    titulo: "Preenchendo o cadastro",
    categoria: "compras",
    emoji: "📝",
    parceiro: { nome: "Atendente do balcão", emoji: "🧑‍💼" },
    missao_pt:
      "Você vai se inscrever numa academia. O atendente fala rápido: peça para repetir, depois para falar devagar, peça a caneta emprestada e agradeça.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_067", "card_068", "card_069", "card_074", "card_072"],
    system_prompt_cenario: "Atendente apressado: pede nome e telefone, repete devagar quando pedem e empresta a caneta.",
    roteiro: [
      {
        ia: line("なまえとでんわばんごうをかいてください。", "名前[なまえ]と電話番号[でんわばんごう]を書[か]いてください。", "Escreva o nome e o telefone, por favor.", [
          b("na.ma.e", "LHH", "nome", "objeto"),
          b("to", "H", "[e]", "particula"),
          b("de.n.wa.ba.n.go.o", "LHHHLLL", "número de telefone", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("ka.i.te", "HLL", "escreva", "verbo"),
          b("ku.da.sa.i", "LLLL", "por favor", "verbo"),
        ]),
        dica_pt: "Ele falou rápido demais. Peça para repetir.",
        chaves: ["もういちど", "もう一度", "いって", "言って"],
        exemplo_card: "card_067",
      },
      {
        ia: line("なまえと、でんわばんごうを、かいてください。", "名前[なまえ]と、電話番号[でんわばんごう]を、書[か]いてください。", "Nome e telefone, escreva, por favor. (de novo)", [
          b("na.ma.e", "LHH", "nome", "objeto"),
          b("to", "H", "[e]", "particula"),
          b("de.n.wa.ba.n.go.o", "LHHHLLL", "número de telefone", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("ka.i.te", "HLL", "escreva", "verbo"),
          b("ku.da.sa.i", "LLLL", "por favor", "verbo"),
        ]),
        dica_pt: "Ainda está rápido. Peça para falar devagar.",
        chaves: ["ゆっくり"],
        exemplo_card: "card_068",
      },
      {
        ia: line("ここにかいてください。", "ここに書[か]いてください。", "Escreva aqui, por favor.", [
          b("ko.ko", "LH", "aqui", "lugar"),
          b("ni", "H", "[Lugar onde fica]", "particula"),
          b("ka.i.te", "HLL", "escreva", "verbo"),
          b("ku.da.sa.i", "LLLL", "por favor", "verbo"),
        ]),
        dica_pt: "Você está sem caneta. Pergunte se pode usar esta caneta.",
        chaves: ["ペン", "つかって", "使って"],
        exemplo_card: "card_074",
      },
      {
        ia: simAVontade,
        dica_pt: "Agradeça.",
        chaves: ["ありがと"],
        exemplo: obrigado,
      },
      {
        ia: line("ありがとうございました。", "ありがとうございました。", "Muito obrigado! (fim)", [
          b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
          b("go.za.i.ma._shi.ta", "LHHHLL", "[educado, pelo que já aconteceu]", "expressao"),
        ]),
      },
    ],
  },

  // ───────────── Primeiro dia no escritório
  {
    id: "rp_ped_escritorio",
    titulo: "As regras do escritório novo",
    categoria: "trabalho",
    emoji: "🏢",
    parceiro: { nome: "Sato-san · colega", emoji: "👩‍💼" },
    missao_pt:
      "É seu primeiro dia num escritório novo. A colega mostra a sala de reunião: peça para abrir a janela, pergunte se pode fumar ali, entenda a regra e agradeça.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_073", "card_076", "card_072"],
    system_prompt_cenario: "Colega simpática apresenta a sala de reunião, deixa abrir a janela e explica que não se pode fumar ali.",
    roteiro: [
      {
        ia: line("ここはかいぎしつです。", "ここは会議室[かいぎしつ]です。", "Esta é a sala de reunião.", [
          b("ko.ko", "LH", "aqui", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("ka.i.gi._shi.tsu", "LHHLL", "sala de reunião", "substantivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
        dica_pt: "A sala está abafada. Pergunte se pode abrir a janela.",
        chaves: ["まど", "窓", "あけて", "開けて"],
        exemplo_card: "card_073",
      },
      {
        ia: simAVontade,
        dica_pt: "Pergunte se pode fumar aqui.",
        chaves: ["たばこ", "タバコ", "すって", "吸って"],
        exemplo: line("ここでたばこをすってもいいですか。", "ここでたばこを吸[す]ってもいいですか。", "Posso fumar aqui?", [
          b("ko.ko", "LH", "aqui", "lugar"),
          b("de", "H", "[Local da ação]", "particula"),
          b("ta.ba.ko", "LHH", "cigarro", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("_su.t.te", "HHH", "fumar", "verbo"),
          b("mo", "L", "mesmo que", "particula"),
          b("i.i", "HL", "está bom", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
      },
      {
        ia: line("いいえ、ここでたばこをすってはいけません。", "いいえ、ここでたばこを吸[す]ってはいけません。", "Não, aqui não pode fumar.", [
          b("i.i.e", "LHH", "não", "expressao"),
          b("ko.ko", "LH", "aqui", "lugar"),
          b("de", "H", "[Local da ação]", "particula"),
          b("ta.ba.ko", "LHH", "cigarro", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("_su.t.te", "HHH", "fumar", "verbo"),
          b("wa", "L", "[isso]", "particula"),
          b("i.ke.ma.se.n", "LHHHL", "não pode", "verbo"),
        ]),
        dica_pt: "Diga que entendeu e agradeça.",
        chaves: ["わかり", "分かり", "ありがと"],
        exemplo: entendi,
      },
      {
        ia: line("じゃあ、がんばってください。", "じゃあ、頑張[がんば]ってください。", "Então, boa sorte no trabalho! (fim)", [
          b("ja.a", "HL", "então", "expressao"),
          b("ga.n.ba.t.te", "LHHLL", "esforce-se, força", "verbo"),
          b("ku.da.sa.i", "LLLL", "por favor", "verbo"),
        ]),
      },
    ],
  },
];
