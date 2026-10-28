import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões do dia a dia (trabalho, vida social, restaurante, compras, cidade).
 * Mesmo padrão do seed: pitch de Tóquio já aplicado na frase; ★ nova = palavra nova do diálogo.
 */

const obrigadoPassado = line("ありがとうございました！", "ありがとうございました！", "Muito obrigado! (fim)", [
  b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
  b("go.za.i.ma._shi.ta", "LHHHLL", "[educado, pelo que já aconteceu]", "expressao"),
]);

const porFavor = line("はい、おねがいします。", "はい、お願[ねが]いします。", "Sim, por favor.", [
  b("ha.i", "HL", "sim", "expressao"),
  b("o.ne.ga.i.shi.ma._su", "LHHHHHL", "peço (por favor)", "verbo"),
]);

export const cenariosCotidiano: SeedScenario[] = [
  // ───────────── Trabalho
  {
    id: "rp_trab_reuniao",
    titulo: "Manhã no escritório com o chefe",
    categoria: "trabalho",
    emoji: "📋",
    parceiro: { nome: "Sato-buchō · chefe", emoji: "👔" },
    missao_pt:
      "Seu chefe passa na sua mesa logo cedo. Cumprimente, confirme que entendeu o horário da reunião e diga que vai verificar os dados agora.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_003", "card_030", "card_029", "card_021"],
    system_prompt_cenario:
      "Você é Sato (佐藤), chefe de departamento, numa manhã no escritório. Cumprimente, informe o horário da reunião, pergunte se o usuário verificou os dados, agradeça e encerre com よろしくお願いします.",
    roteiro: [
      {
        ia: line("おはようございます。", "おはようございます。", "Bom dia.", [
          b("o.ha.yo.o", "LHHH", "bom dia", "expressao"),
          b("go.za.i.ma._su", "HHHHL", "[forma educada]", "expressao"),
        ]),
        dica_pt: "Cumprimente o chefe de manhã, de forma educada.",
        chaves: ["おはよう"],
        exemplo_card: "card_003",
      },
      {
        ia: line("きょうのかいぎはじゅうじからです。", "今日[きょう]の会議[かいぎ]は十時[じゅうじ]からです。", "A reunião de hoje é a partir das 10h. (nova: juuji = 10 horas)", [
          b("kyo.o", "HL", "hoje", "tempo"),
          b("no", "L", "[de]", "particula"),
          b("ka.i.gi", "HLL", "reunião", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("ju.u.ji", "HLL", "10 horas ★ nova", "tempo"),
          b("ka.ra", "LL", "a partir de", "particula"),
          b("de._su", "LL", "é", "copula"),
        ]),
        dica_pt: "Diga que entendeu.",
        chaves: ["わかりました", "分かりました"],
        exemplo_card: "card_030",
      },
      {
        ia: line("データをかくにんしましたか。", "データを確認[かくにん]しましたか。", "Você já verificou os dados?", [
          b("de.e.ta", "HLL", "dados", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("ka.ku.ni.n", "LHHH", "verificação", "substantivo"),
          b("shi.ma._shi.ta", "HHLL", "fez", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que vai verificar os dados agora.",
        chaves: ["かくにん", "確認"],
        exemplo_card: "card_029",
      },
      {
        ia: line("ありがとうございます。よろしくおねがいします。", "ありがとうございます。よろしくお願[ねが]いします。", "Obrigado. Conto com você. (fim)", [
          b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
          b("go.za.i.ma._su", "LHHHL", "[forma educada]", "expressao"),
          b("yo.ro._shi.ku", "LHHH", "conto com você", "expressao"),
          b("o.ne.ga.i.shi.ma._su", "LHHHHHL", "[por favor, educado]", "expressao"),
        ]),
      },
    ],
  },

  // ───────────── Restaurante
  {
    id: "rp_rest_sushi",
    titulo: "Jantar sozinho num restaurante de sushi",
    categoria: "restaurante",
    emoji: "🍣",
    parceiro: { nome: "Garçom", emoji: "🧑‍🍳" },
    missao_pt:
      "Você entra sozinho num restaurante de sushi. Diga quantas pessoas são, peça a comida e a bebida e agradeça antes de comer.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_011", "card_018", "card_027", "card_004"],
    system_prompt_cenario:
      "Você é o garçom de um restaurante de sushi. Recepcione (いらっしゃいませ), pergunte quantas pessoas (何名様), o pedido, a bebida, sirva (はい、どうぞ) e encerre agradecendo.",
    roteiro: [
      {
        ia: line("いらっしゃいませ。なんめいさまですか。", "いらっしゃいませ。何名様[なんめいさま]ですか。", "Bem-vindo! Quantas pessoas? (nova: nanmei-sama)", [
          b("i.ra.s.sha.i.ma.se", "LHHHHHL", "bem-vindo", "expressao"),
          b("na.n.me.i.sa.ma", "HLLLLL", "quantas pessoas (honorífico) ★ nova", "pergunta"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que é só uma pessoa.",
        chaves: ["ひとり", "一人", "1人"],
        exemplo: line("ひとりです。", "一人[ひとり]です。", "Uma pessoa.", [
          b("_hi.to.ri", "LHL", "uma pessoa", "substantivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
      },
      {
        ia: line("なににしますか。", "何[なに]にしますか。", "O que vai pedir? (literal: vai decidir por o quê?)", [
          b("na.ni", "HL", "o quê", "pergunta"),
          b("ni", "L", "[escolha →]", "particula"),
          b("shi.ma._su", "LHL", "faz (decide)", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Peça sushi educadamente.",
        chaves: ["ください", "下さい"],
        exemplo: line("すしをください。", "寿司[すし]をください。", "Sushi, por favor.", [
          b("_su.shi", "LH", "sushi", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("ku.da.sa.i", "LHHL", "dê-me (por favor)", "verbo"),
        ]),
      },
      {
        ia: line("のみものは？", "飲[の]み物[もの]は？", "E para beber? (nova: nomimono = 'coisa de beber')", [
          b("no.mi.mo.no", "LHLL", "bebida (beber + coisa) ★ nova", "topico"),
          b("wa", "L", "[e quanto a…?]", "particula"),
        ]),
        dica_pt: "Peça um chá.",
        chaves: ["ください", "下さい", "おちゃ", "お茶"],
        exemplo: line("おちゃをください。", "お茶[ちゃ]をください。", "Chá, por favor.", [
          b("o.cha", "LH", "chá", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("ku.da.sa.i", "LHHL", "dê-me (por favor)", "verbo"),
        ]),
      },
      {
        ia: line("はい、どうぞ。", "はい、どうぞ。", "Aqui está.", [
          b("ha.i", "HL", "sim", "expressao"),
          b("do.o.zo", "HLL", "por favor (pegue)", "expressao"),
        ]),
        dica_pt: "Antes de comer, diga a expressão de agradecimento pela comida.",
        chaves: ["いただきます", "頂きます"],
        exemplo: line("いただきます。", "いただきます。", "Recebo humildemente — dito antes de comer.", [
          b("i.ta.da.ki.ma._su", "LHHHHL", "obrigado pela comida (antes de comer)", "expressao"),
        ]),
      },
      { ia: obrigadoPassado },
    ],
  },

  // ───────────── Compras
  {
    id: "rp_comp_loja",
    titulo: "Achando um produto e comprando",
    categoria: "compras",
    emoji: "🛍️",
    parceiro: { nome: "Vendedora", emoji: "🧑‍💼" },
    missao_pt: "Numa loja, pergunte onde fica a água, agradeça a ajuda e compre o item que a vendedora mostrar.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_010", "card_011", "card_009", "card_004"],
    system_prompt_cenario:
      "Você é vendedora numa loja de departamentos. Recepcione, indique onde fica o produto que o cliente procura (あちら), diga o preço e encerre agradecendo.",
    roteiro: [
      {
        ia: line("いらっしゃいませ。", "いらっしゃいませ。", "Bem-vindo!", [
          b("i.ra.s.sha.i.ma.se", "LHHHHHL", "bem-vindo", "expressao"),
        ]),
        dica_pt: "Pergunte onde fica a água.",
        chaves: ["どこ"],
        exemplo: line("みずはどこですか。", "水[みず]はどこですか。", "Onde fica a água?", [
          b("mi.zu", "LH", "água", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("do.ko", "HL", "onde", "pergunta"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
      },
      {
        ia: line("あちらです。", "あちらです。", "É por ali. (nova: achira = ali, forma educada)", [
          b("a.chi.ra", "LHH", "ali (educado) ★ nova", "lugar"),
          b("de._su", "HL", "é", "copula"),
        ]),
        dica_pt: "Agradeça a ajuda.",
        chaves: ["ありがとう"],
        exemplo_card: "card_004",
      },
      {
        ia: line("これですか。ひゃくえんです。", "これですか。百円[ひゃくえん]です。", "É isto? São 100 ienes.", [
          b("ko.re", "LH", "isto", "topico"),
          b("de.su", "HL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
          b("hya.ku.e.n", "LHLL", "100 ienes", "substantivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
        dica_pt: "Diga que vai levar (peça educadamente).",
        chaves: ["ください", "下さい"],
        exemplo: line("これをください。", "これをください。", "Vou levar isto (dê-me isto, por favor).", [
          b("ko.re", "LH", "isto", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("ku.da.sa.i", "LHHL", "dê-me (por favor)", "verbo"),
        ]),
      },
      {
        ia: line("はい、ありがとうございます。", "はい、ありがとうございます。", "Pronto, obrigada! (fim)", [
          b("ha.i", "HL", "sim", "expressao"),
          b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
          b("go.za.i.ma._su", "LHHHL", "[forma educada]", "expressao"),
        ]),
      },
    ],
  },
  {
    id: "rp_comp_konbini",
    titulo: "No konbini: bentô, hashi e pagamento",
    categoria: "compras",
    emoji: "🏪",
    parceiro: { nome: "Atendente do konbini", emoji: "🧑‍🔧" },
    missao_pt:
      "Na loja de conveniência (konbini) você compra um bentô. Responda às perguntas do atendente e pague.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_004", "card_005", "card_011"],
    system_prompt_cenario:
      "Você é atendente de um konbini. Pergunte se pode esquentar o bentô (温めますか), se o cliente precisa de hashi (お箸は要りますか), diga o valor e agradeça (ありがとうございました).",
    roteiro: [
      {
        ia: line("おべんとう、あたためますか。", "お弁当[べんとう]、温[あたた]めますか。", "Quer que eu esquente o bentô? (nova: atatamemasu = esquentar)", [
          b("o.be.n.to.o", "LHHHH", "marmita (bentô)", "objeto"),
          b("a.ta.ta.me.ma._su", "LHHHHL", "esquento ★ nova", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Aceite educadamente: «sim, por favor».",
        chaves: ["おねがい", "お願い"],
        exemplo: porFavor,
      },
      {
        ia: line("おはしはいりますか。", "お箸[はし]は要[い]りますか。", "Precisa de hashi? (irimasu = é necessário)", [
          b("o.ha.shi", "LHL", "hashi (palitinhos)", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("i.ri.ma._su", "LHHL", "é necessário", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Recuse com educação: «não precisa, está tudo bem».",
        chaves: ["だいじょうぶ", "大丈夫"],
        exemplo: line("だいじょうぶです。", "大丈夫[だいじょうぶ]です。", "Não precisa, obrigado (está tudo bem).", [
          b("da.i.jo.o.bu", "LHHLL", "tudo bem / sem problema", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
      },
      {
        ia: line("せんえんです。", "千円[せんえん]です。", "São 1000 ienes.", [
          b("se.n.e.n", "HLLL", "1000 ienes", "substantivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
        dica_pt: "Entregue o dinheiro dizendo «com isto, por favor».",
        chaves: ["これで", "おねがい", "お願い"],
        exemplo: line("これでおねがいします。", "これでお願[ねが]いします。", "Com isto, por favor (entregando dinheiro ou cartão).", [
          b("ko.re", "LH", "isto", "substantivo"),
          b("de", "H", "[Meio / instrumento]", "particula"),
          b("o.ne.ga.i.shi.ma._su", "LHHHHHL", "peço (por favor)", "verbo"),
        ]),
      },
      { ia: obrigadoPassado },
    ],
  },

  // ───────────── Cidade e transporte
  {
    id: "rp_cid_estacao",
    titulo: "Perdido perto da estação",
    categoria: "cidade",
    emoji: "🚉",
    parceiro: { nome: "Senhor na rua", emoji: "🧓" },
    missao_pt:
      "Você está perdido e um senhor oferece ajuda. Diga para onde quer ir, pergunte onde fica o banheiro e agradeça.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_014", "card_010", "card_004"],
    system_prompt_cenario:
      "Você é um senhor simpático na rua, perto de uma estação. Ofereça ajuda (どうしましたか), indique os lugares com あそこ e responda ao agradecimento com どういたしまして.",
    roteiro: [
      {
        ia: line("どうしましたか。", "どうしましたか。", "Aconteceu alguma coisa? (= posso ajudar?)", [
          b("do.o", "HL", "como", "pergunta"),
          b("shi.ma._shi.ta", "LHLL", "ficou / fez", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que quer ir à estação.",
        chaves: ["えき", "駅"],
        exemplo_card: "card_014",
      },
      {
        ia: line("えきはあそこです。", "駅[えき]はあそこです。", "A estação é ali. (nova: asoko = lá)", [
          b("e.ki", "HL", "estação", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("a.so.ko", "LHH", "lá / ali ★ nova", "lugar"),
          b("de._su", "HL", "é", "copula"),
        ]),
        dica_pt: "Antes de ir, pergunte onde fica o banheiro.",
        chaves: ["トイレ", "どこ"],
        exemplo_card: "card_010",
      },
      {
        ia: line("トイレもあそこです。", "トイレもあそこです。", "O banheiro também é lá. (mo = também)", [
          b("to.i.re", "HLL", "banheiro", "topico"),
          b("mo", "L", "[também]", "particula"),
          b("a.so.ko", "LHH", "lá / ali", "lugar"),
          b("de._su", "HL", "é", "copula"),
        ]),
        dica_pt: "Agradeça.",
        chaves: ["ありがとう"],
        exemplo_card: "card_004",
      },
      {
        ia: line("どういたしまして。", "どういたしまして。", "De nada. (fim)", [
          b("do.o.i.ta.shi.ma._shi.te", "HLLLLLLL", "de nada (não foi nada)", "expressao"),
        ]),
      },
    ],
  },

  // ───────────── Vida social
  {
    id: "rp_soc_programa",
    titulo: "Combinando um programa com uma amiga",
    categoria: "social",
    emoji: "🍱",
    parceiro: { nome: "Yuki · amiga", emoji: "🙋‍♀️" },
    missao_pt: "Sua amiga Yuki quer combinar algo para amanhã. Diga que está livre, aceite o convite e marque o horário.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_023", "card_022", "card_018", "card_021"],
    system_prompt_cenario:
      "Você é Yuki (ゆき), amiga do usuário. Pergunte se ele está livre amanhã (暇), convide com -ませんか, combine o horário e se despeça com じゃ、また明日.",
    roteiro: [
      {
        ia: line("あしたひまですか。", "明日[あした]暇[ひま]ですか。", "Você está livre amanhã? (nova: hima = tempo livre)", [
          b("a._shi.ta", "LHH", "amanhã", "tempo"),
          b("hi.ma", "LH", "livre / desocupado ★ nova", "adjetivo"),
          b("de._su", "HL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que sim, está livre.",
        chaves: ["はい", "ひま", "暇"],
        exemplo: line("はい、ひまです。", "はい、暇[ひま]です。", "Sim, estou livre.", [
          b("ha.i", "HL", "sim", "expressao"),
          b("hi.ma", "LH", "livre", "adjetivo"),
          b("de._su", "HL", "é", "copula"),
        ]),
      },
      {
        ia: line("すしをたべませんか。", "寿司[すし]を食[た]べませんか。", "Que tal comer sushi? (-masen ka = convite)", [
          b("_su.shi", "LH", "sushi", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("ta.be.ma.se.n", "LHHHL", "comer + não…", "verbo"),
          b("ka", "L", "[?] → vira convite", "particula"),
        ]),
        dica_pt: "Aceite com entusiasmo.",
        chaves: ["いいです", "いいね", "いい"],
        exemplo_card: "card_023",
      },
      {
        ia: line("なんじにあいましょうか。", "何時[なんじ]に会[あ]いましょうか。", "A que horas nos encontramos?", [
          b("na.n.ji", "HLL", "que horas", "pergunta"),
          b("ni", "L", "[Ponto no tempo]", "particula"),
          b("a.i.ma.sho.o", "LHHHL", "encontrar + vamos", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Proponha às 3 horas.",
        chaves: ["さんじ", "三時", "3時"],
        exemplo: line("さんじにあいましょう。", "三時[さんじ]に会[あ]いましょう。", "Vamos nos encontrar às 3.", [
          b("sa.n.ji", "HLL", "3 horas", "tempo"),
          b("ni", "L", "[Ponto no tempo]", "particula"),
          b("a.i.ma.sho.o", "LHHHL", "encontrar + vamos", "verbo"),
        ]),
      },
      {
        ia: line("じゃ、またあした。", "じゃ、また明日[あした]。", "Então, até amanhã! (fim)", [
          b("ja", "H", "então", "expressao"),
          b("ma.ta", "LH", "de novo", "adverbio"),
          b("a._shi.ta", "LHH", "amanhã", "tempo"),
        ]),
      },
    ],
  },
  {
    id: "rp_soc_vizinho",
    titulo: "Conversa rápida com o vizinho",
    categoria: "social",
    emoji: "🏡",
    parceiro: { nome: "Yamada-san · vizinho", emoji: "👴" },
    missao_pt: "Você encontra o vizinho na frente de casa. Cumprimente, comente o tempo e diga aonde está indo.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_002", "card_023", "card_015", "card_014"],
    system_prompt_cenario:
      "Você é Yamada (山田), vizinho idoso e simpático. Cumprimente, comente o tempo (いい天気ですね), pergunte aonde o usuário vai e se despeça com じゃ、また.",
    roteiro: [
      {
        ia: line("こんにちは。", "こんにちは。", "Boa tarde!", [
          b("ko.n.ni.chi.wa", "LHHHH", "olá / boa tarde", "expressao"),
        ]),
        dica_pt: "Cumprimente de volta.",
        chaves: ["こんにちは", "今日は"],
        exemplo_card: "card_002",
      },
      {
        ia: line("いいてんきですね。", "いい天気[てんき]ですね。", "Que tempo bom, né? (nova: tenki = clima)", [
          b("i.i", "HL", "bom", "adjetivo"),
          b("te.n.ki", "HLL", "clima ★ nova", "substantivo"),
          b("de.su", "LL", "é", "copula"),
          b("ne", "L", "[né?]", "particula"),
        ]),
        dica_pt: "Concorde: «é mesmo, né».",
        chaves: ["そう", "いい"],
        exemplo: line("そうですね。", "そうですね。", "É mesmo, né.", [
          b("so.o", "HL", "assim", "adverbio"),
          b("de.su", "LL", "é", "copula"),
          b("ne", "L", "[né]", "particula"),
        ]),
      },
      {
        ia: line("どこにいきますか。", "どこに行[い]きますか。", "Aonde você vai?", [
          b("do.ko", "HL", "onde", "pergunta"),
          b("ni", "L", "[Destino →]", "particula"),
          b("i.ki.ma._su", "LHHL", "vai", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que vai à estação.",
        chaves: ["いきます", "行きます", "えき", "駅"],
        exemplo: line("えきにいきます。", "駅[えき]に行[い]きます。", "Vou à estação.", [
          b("e.ki", "HL", "estação", "lugar"),
          b("ni", "L", "[Destino →]", "particula"),
          b("i.ki.ma._su", "LHHL", "vou", "verbo"),
        ]),
      },
      {
        ia: line("そうですか。じゃ、また。", "そうですか。じゃ、また。", "Ah, é? Então, até mais! (fim)", [
          b("so.o", "HL", "assim", "adverbio"),
          b("de.su", "LL", "é", "copula"),
          b("ka", "L", "[?] ('ah, é?')", "particula"),
          b("ja", "H", "então", "expressao"),
          b("ma.ta", "LH", "de novo", "adverbio"),
        ]),
      },
    ],
  },
];
