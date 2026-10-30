import { b, card } from "./helpers";

/**
 * Unidade 11 — Agora e sempre: forma -te + imasu para a ação em andamento (estou fazendo), o hábito (estudo
 * todo dia), o estado que dura (moro em, sou casado, a janela está aberta) e shitte imasu / shirimasen.
 * Pitch conferido com o Suzuki-kun do OJAD. Padrão: a forma -te mantém a melodia do verbo; depois de verbo com
 * queda, "imasu" fica todo baixo (tsukutte imasu); depois de verbo plano, sobe até "ma" (hataraite imasu).
 * O OJAD leu 開いて como "hiraite" e 何 como "nan": nesses, vale o padrão do app.
 */
export const cardsAgora = [
  card({
    id: "card_079",
    tipo: "speaking",
    situacao_pt: "Você liga para um amigo e quer saber o que ele está fazendo.",
    significado_cognitivo: "Agora, o quê [objeto] fazendo está [?]",
    traducao: "O que você está fazendo agora?",
    kana: "いま、なにをしていますか",
    kanji: "今[いま]、何[なに]をしていますか",
    blocos: [
      b("i.ma", "HL", "agora", "tempo"),
      b("na.ni", "HL", "o quê", "pergunta"),
      b("o", "L", "[Objeto]", "particula"),
      b("_shi.te", "LH", "fazendo (forma -te)", "verbo"),
      b("i.ma._su", "HHL", "está", "verbo"),
      b("ka", "L", "[?]", "particula"),
    ],
    notas:
      "Forma -te + 'imasu' = está fazendo agora. Literalmente 'fazendo, está (aí)': o 'imasu' é o mesmo verbo de 'a pessoa está aqui'. Em conversa o 'i' some muito: 'shitemasu'.",
    tags: ["wo", "ka", "teiru", "ctx:social", "ctx:trabalho"],
  }),
  card({
    id: "card_080",
    tipo: "speaking",
    situacao_pt: "Um amigo liga e pergunta o que você está fazendo. Você está preparando o jantar.",
    significado_cognitivo: "Jantar [objeto] preparando estou",
    traducao: "Estou fazendo o jantar.",
    kana: "ばんごはんをつくっています",
    kanji: "晩[ばん]ご飯[はん]を作[つく]っています",
    blocos: [
      b("ba.n.go.ha.n", "LHHLL", "jantar", "objeto"),
      b("o", "L", "[Objeto]", "particula"),
      b("_tsu.ku.t.te", "LHLL", "preparando (forma -te)", "verbo"),
      b("i.ma._su", "LLL", "estou", "verbo"),
    ],
    notas:
      "Refeições: asagohan (café da manhã), hirugohan (almoço), bangohan (jantar) — 'gohan' é arroz e também refeição. 'tsukutte' cai depois do 'ku', então o 'imasu' vem todo baixo.",
    tags: ["wo", "teiru", "rotina", "ctx:social", "ctx:restaurante"],
  }),
  card({
    id: "card_081",
    tipo: "speaking",
    situacao_pt: "Perguntam se está chovendo aí. Está.",
    significado_cognitivo: "Chuva [sujeito] caindo está → Está chovendo",
    traducao: "Está chovendo.",
    kana: "あめがふっています",
    kanji: "雨[あめ]が降[ふ]っています",
    blocos: [
      b("a.me", "HL", "chuva", "sujeito"),
      b("ga", "L", "[Foco / sujeito]", "particula"),
      b("_fu.t.te", "HLL", "caindo (forma -te)", "verbo"),
      b("i.ma._su", "LLL", "está", "verbo"),
    ],
    notas:
      "O japonês diz que 'a chuva está caindo': a chuva é o sujeito, com 'ga'. Lembre do treino de ouvido: 'ame' com queda (A-me) é chuva; sem queda (a-ME) é bala. Neve é 'yuki': yuki ga futte imasu.",
    tags: ["ga", "teiru", "tempo_clima", "ctx:social", "ctx:cidade"],
  }),
  card({
    id: "card_082",
    tipo: "listening",
    situacao_pt: "Você procura o Tanaka-san no escritório, e um colega explica onde ele está.",
    significado_cognitivo: "Tanaka-san [tópico], telefone [objeto] fazendo está → está ao telefone",
    traducao: "O Tanaka-san está ao telefone.",
    kana: "たなかさんはでんわをしています",
    kanji: "田中[たなか]さんは電話[でんわ]をしています",
    blocos: [
      b("ta.na.ka", "LHH", "Tanaka", "topico"),
      b("sa.n", "HH", "sr./sra.", "topico"),
      b("wa", "H", "[Tópico]", "particula"),
      b("de.n.wa", "LHH", "telefone", "objeto"),
      b("o", "H", "[Objeto]", "particula"),
      b("_shi.te", "HH", "fazendo (forma -te)", "verbo"),
      b("i.ma._su", "HHL", "está", "verbo"),
    ],
    notas:
      "'denwa o suru' = fazer telefone = telefonar. Com 'suru' o japonês cria muitos verbos: shigoto o suru (trabalhar), benkyou o suru (estudar). Tudo aqui é plano, por isso a voz fica alta até o 'ma'.",
    tags: ["wa", "wo", "teiru", "trabalho", "listening", "ctx:trabalho"],
  }),
  card({
    id: "card_083",
    tipo: "speaking",
    situacao_pt: "Um vizinho novo pergunta onde você mora.",
    significado_cognitivo: "Tóquio [lugar] morando estou → Moro em Tóquio",
    traducao: "Moro em Tóquio.",
    kana: "とうきょうにすんでいます",
    kanji: "東京[とうきょう]に住[す]んでいます",
    blocos: [
      b("to.o.kyo.o", "LHHH", "Tóquio", "lugar"),
      b("ni", "H", "[Lugar onde está]", "particula"),
      b("su.n.de", "HLL", "morando (forma -te)", "verbo"),
      b("i.ma._su", "LLL", "estou", "verbo"),
    ],
    notas:
      "'Morar' em japonês é sempre '-te imasu': 'sunde imasu' = estou morando (um estado que continua). Dizer só 'sumimasu' soa como 'vou morar'. Verbos em 'mu' viram '-nde': sumu → sunde, yomu → yonde.",
    tags: ["ni", "teiru", "apresentacao", "ctx:social"],
  }),
  card({
    id: "card_084",
    tipo: "speaking",
    situacao_pt: "Numa conversa, perguntam se você é casado(a). Você é.",
    significado_cognitivo: "Casamento feito estou → Sou casado(a)",
    traducao: "Sou casado(a).",
    kana: "けっこんしています",
    kanji: "結婚[けっこん]しています",
    blocos: [
      b("ke.k.ko.n", "LHHH", "casamento", "substantivo"),
      b("_shi.te", "HH", "feito (forma -te)", "verbo"),
      b("i.ma._su", "HHL", "estou", "verbo"),
    ],
    notas:
      "Estado que começou e continua: 'kekkon shite imasu' = casei e continuo casado. Solteiro: 'kekkon shite imasen' (ou 'dokushin desu'). Tudo é plano: sobe no 'ke' e só cai depois do 'ma'.",
    tags: ["teiru", "apresentacao", "familia", "ctx:social"],
  }),
  card({
    id: "card_085",
    tipo: "speaking",
    situacao_pt: "Perguntam como você aprende japonês. Diga que estuda todo dia.",
    significado_cognitivo: "Todo dia, japonês [objeto] estudando estou",
    traducao: "Estudo japonês todo dia.",
    kana: "まいにちにほんごをべんきょうしています",
    kanji: "毎日[まいにち]日本語[にほんご]を勉強[べんきょう]しています",
    blocos: [
      b("ma.i.ni.chi", "HLLL", "todo dia", "tempo"),
      b("ni.ho.n.go", "LHHH", "japonês (língua)", "objeto"),
      b("o", "H", "[Objeto]", "particula"),
      b("be.n.kyo.o", "LHHH", "estudo", "substantivo"),
      b("_shi.te", "HH", "fazendo (forma -te)", "verbo"),
      b("i.ma._su", "HHL", "estou", "verbo"),
    ],
    notas:
      "'-te imasu' também é hábito: algo que você vem fazendo (estudo todo dia, trabalho em banco). Compare: 'benkyou shimasu' = estudo / vou estudar; 'benkyou shite imasu' = estou estudando (nestes tempos).",
    tags: ["wo", "teiru", "rotina", "ctx:social", "ctx:trabalho"],
  }),
  card({
    id: "card_086",
    tipo: "speaking",
    situacao_pt: "Um colega pergunta sobre a sua família. Conte onde seu pai trabalha.",
    significado_cognitivo: "Meu pai [tópico], banco [local] trabalhando está",
    traducao: "Meu pai trabalha num banco.",
    kana: "ちちはぎんこうではたらいています",
    kanji: "父[ちち]は銀行[ぎんこう]で働[はたら]いています",
    blocos: [
      b("_chi.chi", "LH", "meu pai", "topico"),
      b("wa", "L", "[Tópico]", "particula"),
      b("gi.n.ko.o", "LHHH", "banco", "lugar"),
      b("de", "H", "[Local da ação]", "particula"),
      b("ha.ta.ra.i.te", "LHHHH", "trabalhando (forma -te)", "verbo"),
      b("i.ma._su", "HHL", "está", "verbo"),
    ],
    notas:
      "Família própria e dos outros tem palavras diferentes: 'chichi' (meu pai) × 'otousan' (o pai de alguém); 'haha' (minha mãe) × 'okaasan'. Profissão e emprego vêm com '-te imasu': trabalha em, ensina em.",
    tags: ["wa", "de", "teiru", "familia", "trabalho", "ctx:social", "ctx:trabalho"],
  }),
  card({
    id: "card_087",
    tipo: "speaking",
    situacao_pt: "Está ventando na sala e alguém pergunta de onde vem o vento.",
    significado_cognitivo: "Janela [sujeito] aberta está",
    traducao: "A janela está aberta.",
    kana: "まどがあいています",
    kanji: "窓[まど]が開[あ]いています",
    blocos: [
      b("ma.do", "HL", "janela", "sujeito"),
      b("ga", "L", "[Foco / sujeito]", "particula"),
      b("a.i.te", "LHH", "aberta (forma -te)", "verbo"),
      b("i.ma._su", "HHL", "está", "verbo"),
    ],
    notas:
      "Resultado que ficou: 'aku' (abrir-se, sozinho) + '-te imasu' = está aberta. Compare com o card da unidade 10: 'mado o akete' (eu abro a janela, com 'o'). Fechada: 'shimatte imasu'.",
    tags: ["ga", "teiru", "casa", "ctx:social", "ctx:trabalho"],
  }),
  card({
    id: "card_088",
    tipo: "speaking",
    situacao_pt: "Você quer apresentar um amigo. Pergunte se a pessoa conhece o Suzuki-san.",
    significado_cognitivo: "Suzuki-san [objeto] sabendo está [?] → Você conhece?",
    traducao: "Você conhece o Suzuki-san?",
    kana: "すずきさんをしっていますか",
    kanji: "鈴木[すずき]さんを知[し]っていますか",
    blocos: [
      b("su.zu._ki", "LHH", "Suzuki (sobrenome)", "objeto"),
      b("sa.n", "HH", "sr./sra.", "objeto"),
      b("o", "H", "[Objeto]", "particula"),
      b("_shi.t.te", "LHH", "sabendo (forma -te)", "verbo"),
      b("i.ma._su", "HHL", "está", "verbo"),
      b("ka", "L", "[?]", "particula"),
    ],
    notas:
      "'Saber / conhecer' é sempre 'shitte imasu' (passei a saber e continuo sabendo). O negativo é especial, veja o próximo card. O 'ki' de Suzuki e o 'shi' de 'shitte' quase somem.",
    tags: ["wo", "ka", "teiru", "ctx:social", "ctx:trabalho"],
  }),
  card({
    id: "card_089",
    tipo: "speaking",
    situacao_pt: "Perguntam se você conhece alguém, mas você não conhece.",
    significado_cognitivo: "Não, não sei",
    traducao: "Não, não conheço.",
    kana: "いいえ、しりません",
    kanji: "いいえ、知[し]りません",
    blocos: [
      b("i.i.e", "LHH", "não", "expressao"),
      b("shi.ri.ma.se.n", "LHHHL", "não sei, não conheço", "verbo"),
    ],
    notas:
      "A exceção: o positivo é 'shitte imasu', mas o negativo é 'shirimasen' (sem '-te imasu'). Para coisas que você não sabe responder, 'wakarimasen' (não entendo / não sei) soa mais suave.",
    tags: ["masen", "teiru", "ctx:social", "ctx:trabalho"],
  }),
  card({
    id: "card_090",
    tipo: "listening",
    situacao_pt: "Na estação, um aviso explica por que o trem ainda não chegou.",
    significado_cognitivo: "Trem [sujeito] atrasado está",
    traducao: "O trem está atrasado.",
    kana: "でんしゃがおくれています",
    kanji: "電車[でんしゃ]が遅[おく]れています",
    blocos: [
      b("de.n.sha", "LHH", "trem", "sujeito"),
      b("ga", "H", "[Foco / sujeito]", "particula"),
      b("o.ku.re.te", "LHHH", "atrasado (forma -te)", "verbo"),
      b("i.ma._su", "HHL", "está", "verbo"),
    ],
    notas:
      "Compare: 'okuremashita' (atrasou, card da unidade 7) conta o fato; 'okurete imasu' descreve a situação agora (continua atrasado). 'okureru' é plano: a voz sobe e só cai depois do 'ma'.",
    tags: ["ga", "teiru", "listening", "ctx:cidade", "ctx:trabalho"],
  }),
];
