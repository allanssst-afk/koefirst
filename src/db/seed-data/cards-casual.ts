import { b, card } from "./helpers";

/**
 * Unidade 19 — Conversa com amigos: a forma plana (casual) — passado -ta, negativo -nai, passado negativo
 * -nakatta, "da" no lugar de "desu", convites com -nai? e -ou, interjeições (un, uun, sokka, yatta) e a pergunta
 * sem "ka", só com a voz subindo. Pitch conferido com o Suzuki-kun do OJAD (que leu 明日 como "asu" e 何 como "nan";
 * nesses vale o padrão do app). A forma -ta tem a mesma melodia da forma -te.
 */
export const cardsCasual = [
  card({
    id: "card_163",
    tipo: "speaking",
    situacao_pt: "Você encontra um amigo próximo. Pergunte se ele está bem, do jeito casual.",
    significado_cognitivo: "Bem? (com a voz subindo)",
    traducao: "Tudo bem?",
    kana: "げんき？",
    kanji: "元気[げんき]？",
    blocos: [b("ge.n.ki", "HLL", "bem, com saúde", "adjetivo")],
    notas:
      "Entre amigos, a forma educada some: sem 'desu', sem 'ka'. A pergunta é feita só com a voz subindo no fim — isso é entonação de frase, não muda o desenho de cada palavra.",
    tags: ["casual", "saudacao", "ctx:social"],
  }),
  card({
    id: "card_164",
    tipo: "speaking",
    situacao_pt: "Um amigo pergunta se você está bem. Responda do jeito casual.",
    significado_cognitivo: "Sim, bem é (te conto)",
    traducao: "Tô bem!",
    kana: "うん、げんきだよ",
    kanji: "うん、元気[げんき]だよ",
    blocos: [
      b("u.n", "HL", "sim (casual)", "expressao"),
      b("ge.n.ki", "HLL", "bem", "adjetivo"),
      b("da", "L", "é (casual)", "copula"),
      b("yo", "L", "[te conto]", "particula"),
    ],
    notas:
      "'un' = 'hai' entre amigos; 'da' = 'desu' casual. Com adjetivo -i não se põe 'da': 'oishii yo' (tá gostoso), nunca 'oishii da'.",
    tags: ["casual", "saudacao", "ctx:social"],
  }),
  card({
    id: "card_165",
    tipo: "speaking",
    situacao_pt: "Pergunte a um amigo o que ele fez ontem, do jeito casual.",
    significado_cognitivo: "Ontem, o que fez? (voz subindo)",
    traducao: "O que você fez ontem?",
    kana: "きのう、なにした？",
    kanji: "昨日[きのう]、何[なに]した？",
    blocos: [
      b("ki.no.o", "LHL", "ontem", "tempo"),
      b("na.ni", "HL", "o quê", "pergunta"),
      b("_shi.ta", "LL", "fez (forma -ta)", "verbo"),
    ],
    notas:
      "Passado casual = forma -ta: é a forma -te trocando o 'e' por 'a' (shite → shita, tabete → tabeta, itte → itta). Na fala casual a partícula 'o' muitas vezes cai.",
    tags: ["casual", "passado", "ta", "ctx:social"],
  }),
  card({
    id: "card_166",
    tipo: "speaking",
    situacao_pt: "Seu amigo pergunta o que você fez ontem. Você viu um filme.",
    significado_cognitivo: "Filme [objeto] vi",
    traducao: "Vi um filme.",
    kana: "えいがをみた",
    kanji: "映画[えいが]を見[み]た",
    blocos: [
      b("e.i.ga", "LHH", "filme", "objeto"),
      b("o", "H", "[Objeto]", "particula"),
      b("mi.ta", "HL", "vi (forma -ta)", "verbo"),
    ],
    notas:
      "'mita' = 'mimashita' entre amigos. A melodia do verbo é a mesma da forma -te (mite → mita): se você já sabe a -te, já sabe a -ta.",
    tags: ["casual", "passado", "ta", "wo", "ctx:social"],
  }),
  card({
    id: "card_167",
    tipo: "speaking",
    situacao_pt: "Seu amigo viu um filme. Pergunte se foi legal.",
    significado_cognitivo: "Interessante foi? (voz subindo)",
    traducao: "Foi legal?",
    kana: "おもしろかった？",
    kanji: "面白[おもしろ]かった？",
    blocos: [b("o.mo.shi.ro.ka.t.ta", "LHHHLLL", "foi interessante, divertido", "adjetivo")],
    notas:
      "Adjetivo -i no casual é o mesmo do educado, só sem 'desu': omoshirokatta (desu). Pergunta casual = voz subindo no fim.",
    tags: ["casual", "adjetivo", "passado", "ctx:social"],
  }),
  card({
    id: "card_168",
    tipo: "speaking",
    situacao_pt: "Perguntam se o filme foi legal. Não foi muito.",
    significado_cognitivo: "Não, não muito interessante não foi",
    traducao: "Não, não foi muito legal.",
    kana: "ううん、あんまりおもしろくなかった",
    kanji: "ううん、あんまり面白[おもしろ]くなかった",
    blocos: [
      b("u.u.n", "LHH", "não (casual)", "expressao"),
      b("a.n.ma.ri", "LHHH", "não muito (casual)", "adverbio"),
      b("o.mo.shi.ro.ku.na.ka.t.ta", "LHHHLLLLL", "não foi interessante", "adjetivo"),
    ],
    notas:
      "'uun' = 'iie' entre amigos; 'anmari' = 'amari' falado. Cuidado com 'un' (sim) × 'uun' (não): a diferença é a duração e a melodia.",
    tags: ["casual", "adjetivo", "negativo", "passado", "ctx:social"],
  }),
  card({
    id: "card_169",
    tipo: "speaking",
    situacao_pt: "Convide um amigo para ir junto, do jeito casual.",
    significado_cognitivo: "Juntos não vamos? → Vamos juntos?",
    traducao: "Vamos juntos?",
    kana: "いっしょにいかない？",
    kanji: "一緒[いっしょ]に行[い]かない？",
    blocos: [
      b("i.s.sho", "LHH", "juntos", "adverbio"),
      b("ni", "H", "[de modo]", "particula"),
      b("i.ka.na.i", "LHHH", "não ir (forma -nai)", "verbo"),
    ],
    notas:
      "É o '-masen ka' da unidade 13 na versão casual: 'não vamos?' com a voz subindo. 'ikanai' é plano: fica alto até o fim.",
    tags: ["casual", "nai", "convite", "ctx:social"],
  }),
  card({
    id: "card_170",
    tipo: "speaking",
    situacao_pt: "Um amigo convida você para sair. Aceite com animação.",
    significado_cognitivo: "Bom, né! Vamos!",
    traducao: "Boa, vamos!",
    kana: "いいね、いこう",
    kanji: "いいね、行[い]こう",
    blocos: [
      b("i.i", "HL", "bom", "adjetivo"),
      b("ne", "L", "[né]", "particula"),
      b("i.ko.o", "LHL", "vamos (forma volitiva)", "verbo"),
    ],
    notas:
      "'ikou' é o 'ikimashou' casual (forma volitiva: vamos!). Ela volta no mês 6; por enquanto, guarde as mais usadas: ikou (vamos), tabeyou (vamos comer), shiyou (vamos fazer).",
    tags: ["casual", "convite", "ctx:social"],
  }),
  card({
    id: "card_171",
    tipo: "speaking",
    situacao_pt: "Seu amigo já está saindo e você ainda não terminou. Peça para ele esperar.",
    significado_cognitivo: "Um pouco espera",
    traducao: "Espera aí!",
    kana: "ちょっとまって",
    kanji: "ちょっと待[ま]って",
    blocos: [
      b("cho.t.to", "HLL", "um pouco", "adverbio"),
      b("ma.t.te", "HLL", "espera (forma -te)", "verbo"),
    ],
    notas:
      "Entre amigos, a forma -te sozinha já é um pedido: 'matte' (espera), 'mite' (olha), 'kiite' (escuta). O 'kudasai' fica para quem você trata com cerimônia.",
    tags: ["casual", "te", "pedido", "ctx:social"],
  }),
  card({
    id: "card_172",
    tipo: "speaking",
    situacao_pt: "Um amigo conta uma novidade que você não fazia ideia.",
    significado_cognitivo: "Não sabia",
    traducao: "Eu não sabia!",
    kana: "しらなかった",
    kanji: "知[し]らなかった",
    blocos: [b("shi.ra.na.ka.t.ta", "LHHLLL", "não sabia (passado negativo)", "verbo")],
    notas:
      "Passado negativo casual: '-nai' vira '-nakatta' (shiranai → shiranakatta, ikanai → ikanakatta). É o 'shirimasen deshita' entre amigos.",
    tags: ["casual", "nai", "passado", "ctx:social"],
  }),
  card({
    id: "card_173",
    tipo: "speaking",
    situacao_pt: "Você quer chamar um amigo para sair amanhã. Pergunte se ele está livre.",
    significado_cognitivo: "Amanhã, livre? (voz subindo)",
    traducao: "Tá livre amanhã?",
    kana: "あした、ひま？",
    kanji: "明日[あした]、暇[ひま]？",
    blocos: [
      b("a._shi.ta", "LHH", "amanhã", "tempo"),
      b("hi.ma", "LH", "livre, sem nada para fazer", "adjetivo"),
    ],
    notas:
      "'hima' é ter tempo livre (com amigos é normal; com o chefe, prefira 'ojikan arimasu ka'). O contrário é 'isogashii' (ocupado).",
    tags: ["casual", "adjetivo", "convite", "ctx:social"],
  }),
  card({
    id: "card_174",
    tipo: "speaking",
    situacao_pt: "Um amigo chama você para amanhã, mas você vai trabalhar no seu bico.",
    significado_cognitivo: "Desculpa, amanhã [contraste] bico [sujeito] existe",
    traducao: "Foi mal, amanhã tenho trabalho.",
    kana: "ごめん、あしたはバイトがある",
    kanji: "ごめん、明日[あした]はバイトがある",
    blocos: [
      b("go.me.n", "LHH", "desculpa (casual)", "expressao"),
      b("a._shi.ta", "LHH", "amanhã", "tempo"),
      b("wa", "L", "[contraste]", "particula"),
      b("ba.i.to", "LHH", "trabalho de meio período, bico", "sujeito"),
      b("ga", "H", "[Foco / sujeito]", "particula"),
      b("a.ru", "HL", "existe, tem (forma de dicionário)", "verbo"),
    ],
    notas:
      "'gomen' = 'sumimasen' entre amigos. No casual o verbo fica na forma de dicionário: 'aru' no lugar de 'arimasu'. 'baito' (de 'arubaito') é o emprego de meio período de estudantes.",
    tags: ["casual", "ga", "aru", "ctx:social"],
  }),
];
