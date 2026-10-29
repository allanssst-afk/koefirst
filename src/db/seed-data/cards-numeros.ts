import { b, card } from "./helpers";

/**
 * Unidade 9 — Números, horas e preços: horas (~ji, han), preços (~en, centenas e milhares), contadores
 * (~tsu, ~nin, ~mai), de… até… (~kara ~made) e datas (~gatsu, dias). Pitch conferido com o Suzuki-kun do OJAD;
 * onde ele leu 何時 errado (nandoki, itsu), vale o padrão de "nanji" já validado no app. 二つ: NHK aceita plano
 * e odaka; usamos o plano (como o OJAD). いくら: cai na 1ª mora, como no resto do app.
 */
export const cardsNumeros = [
  card({
    id: "card_055",
    tipo: "speaking",
    situacao_pt: "Seu celular descarregou. Pergunte as horas a alguém.",
    significado_cognitivo: "Agora, que horas é [?]",
    traducao: "Que horas são agora?",
    kana: "いまなんじですか",
    kanji: "今[いま]何時[なんじ]ですか",
    blocos: [
      b("i.ma", "HL", "agora", "tempo"),
      b("na.n.ji", "HLL", "que horas", "pergunta"),
      b("de._su", "LL", "é", "copula"),
      b("ka", "L", "[?]", "particula"),
    ],
    notas:
      "'nan' (que) + 'ji' (hora) = que horas. Horas: ichiji, niji, sanji, yoji (não 'yonji'), goji, rokuji, shichiji, hachiji, kuji (não 'kyuuji'), juuji, juuichiji, juuniji.",
    tags: ["ka", "horario", "numeros", "ctx:social", "ctx:cidade"],
  }),
  card({
    id: "card_056",
    tipo: "speaking",
    situacao_pt: "Alguém pergunta as horas e o relógio marca 9h30. Responda.",
    significado_cognitivo: "Nove horas e meia é",
    traducao: "São nove e meia.",
    kana: "くじはんです",
    kanji: "九時半[くじはん]です",
    blocos: [
      b("ku.ji", "LH", "nove horas", "tempo"),
      b("ha.n", "HL", "e meia", "tempo"),
      b("de._su", "LL", "é", "copula"),
    ],
    notas:
      "'han' (metade) depois da hora = e meia. Para os minutos: hora + número + 'fun/pun' (kuji juppun = 9h10). Nove horas é sempre 'kuji'; o 'kyuu' do nove não serve aqui.",
    tags: ["horario", "numeros", "ctx:social", "ctx:trabalho"],
  }),
  card({
    id: "card_057",
    tipo: "speaking",
    situacao_pt: "No café, você e um amigo querem um café cada. Faça o pedido.",
    significado_cognitivo: "Café [objeto] duas unidades dê-me",
    traducao: "Dois cafés, por favor.",
    kana: "コーヒーをふたつください",
    kanji: "コーヒーを二[ふた]つください",
    blocos: [
      b("ko.o.hi.i", "LHHL", "café", "objeto"),
      b("o", "L", "[Objeto]", "particula"),
      b("_fu.ta._tsu", "LHH", "duas (unidades)", "substantivo"),
      b("ku.da.sa.i", "HHHL", "dê-me (por favor)", "verbo"),
    ],
    notas:
      "Para contar coisas sem forma definida (pedidos, objetos), o japonês usa os números 'nativos': hitotsu, futatsu, mittsu, yottsu, itsutsu. A quantidade vem depois da coisa e antes do verbo, sem partícula.",
    tags: ["wo", "kudasai", "contador", "numeros", "ctx:restaurante", "ctx:compras"],
  }),
  card({
    id: "card_058",
    tipo: "speaking",
    situacao_pt: "Na hora de pagar a conta, pergunte quanto dá tudo.",
    significado_cognitivo: "Tudo [em conjunto], quanto é [?]",
    traducao: "Quanto dá tudo?",
    kana: "ぜんぶでいくらですか",
    kanji: "全部[ぜんぶ]でいくらですか",
    blocos: [
      b("ze.n.bu", "HLL", "tudo", "substantivo"),
      b("de", "L", "[no total]", "particula"),
      b("i.ku.ra", "HLL", "quanto (preço)", "pergunta"),
      b("de._su", "LL", "é", "copula"),
      b("ka", "L", "[?]", "particula"),
    ],
    notas:
      "'de' aqui junta as coisas: 'tudo junto, quanto fica?'. É a mesma partícula do meio e do lugar da ação, com a ideia de 'por meio de / em conjunto'.",
    tags: ["de", "ka", "compras", "numeros", "ctx:compras", "ctx:restaurante"],
  }),
  card({
    id: "card_059",
    tipo: "listening",
    situacao_pt: "O caixa diz o total da sua compra.",
    significado_cognitivo: "Mil e quinhentos ienes é",
    traducao: "São 1.500 ienes.",
    kana: "せんごひゃくえんです",
    kanji: "千五百円[せんごひゃくえん]です",
    blocos: [
      b("se.n", "HL", "mil", "substantivo"),
      b("go.hya.ku.e.n", "LHHLL", "quinhentos ienes", "substantivo"),
      b("de._su", "LL", "é", "copula"),
    ],
    notas:
      "Números grandes: hyaku (100), sen (1.000), man (10.000). Algumas centenas mudam de som: sanbyaku (300), roppyaku (600), happyaku (800). Atenção: 10.000 é 'ichiman', uma unidade que o português não tem.",
    tags: ["numeros", "compras", "listening", "ctx:compras", "ctx:restaurante"],
  }),
  card({
    id: "card_060",
    tipo: "listening",
    situacao_pt: "Você entra num restaurante e o atendente faz a primeira pergunta.",
    significado_cognitivo: "Quantas pessoas (muito educado) é [?]",
    traducao: "Quantas pessoas?",
    kana: "なんめいさまですか",
    kanji: "何名様[なんめいさま]ですか",
    blocos: [
      b("na.n.me.i", "LHHL", "quantas pessoas (formal)", "pergunta"),
      b("sa.ma", "LL", "[respeito ao cliente]", "pergunta"),
      b("de._su", "LL", "é", "copula"),
      b("ka", "L", "[?]", "particula"),
    ],
    notas:
      "Pergunta de atendente: 'mei' é o contador formal de pessoas e 'sama' mostra respeito ao cliente. Você responde com o contador comum: hitori (1), futari (2), sannin (3)… Também se usa mostrar os dedos.",
    tags: ["ka", "contador", "keigo", "listening", "ctx:restaurante"],
  }),
  card({
    id: "card_061",
    tipo: "speaking",
    situacao_pt: "O atendente pergunta quantas pessoas são. Vocês são três.",
    significado_cognitivo: "Três pessoas é",
    traducao: "Somos três.",
    kana: "さんにんです",
    kanji: "三人[さんにん]です",
    blocos: [
      b("sa.n.ni.n", "LHHL", "três pessoas", "substantivo"),
      b("de._su", "LL", "é", "copula"),
    ],
    notas:
      "Pessoas: hitori (1) e futari (2) são especiais; do 3 em diante é número + 'nin': sannin, yonin (não 'yonnin'), gonin. A resposta curta basta: o japonês não precisa de 'nós somos'.",
    tags: ["contador", "numeros", "ctx:restaurante", "ctx:social"],
  }),
  card({
    id: "card_062",
    tipo: "speaking",
    situacao_pt: "No correio, você precisa de dois selos para mandar cartões.",
    significado_cognitivo: "Selo [objeto] duas folhas dê-me",
    traducao: "Dois selos, por favor.",
    kana: "きってをにまいください",
    kanji: "切手[きって]を二枚[にまい]ください",
    blocos: [
      b("_ki.t.te", "LHH", "selo", "objeto"),
      b("o", "H", "[Objeto]", "particula"),
      b("ni.ma.i", "HLL", "duas folhas", "substantivo"),
      b("ku.da.sa.i", "LLLL", "dê-me (por favor)", "verbo"),
    ],
    notas:
      "'mai' conta coisas finas e planas: selos, papéis, camisetas, ingressos (ichimai, nimai, sanmai). Depois da queda de 'nimai', o 'kudasai' fica todo baixo. O 'ki' de 'kitte' quase some.",
    tags: ["wo", "kudasai", "contador", "numeros", "ctx:compras"],
  }),
  card({
    id: "card_063",
    tipo: "speaking",
    situacao_pt: "Você quer saber o horário de funcionamento de uma loja.",
    significado_cognitivo: "Loja [tópico], que horas a partir de, que horas até é [?]",
    traducao: "A loja abre de que horas a que horas?",
    kana: "みせはなんじからなんじまでですか",
    kanji: "店[みせ]は何時[なんじ]から何時[なんじ]までですか",
    blocos: [
      b("mi.se", "LH", "loja", "topico"),
      b("wa", "L", "[Tópico]", "particula"),
      b("na.n.ji", "HLL", "que horas", "pergunta"),
      b("ka.ra", "LL", "a partir de", "particula"),
      b("na.n.ji", "HLL", "que horas", "pergunta"),
      b("ma.de", "LL", "[até]", "particula"),
      b("de._su", "LL", "é", "copula"),
      b("ka", "L", "[?]", "particula"),
    ],
    notas:
      "'kara … made' = de … até: serve para horas, datas e lugares (Tóquio kara Osaka made). 'mise' tem a queda escondida: sobe no 'se' e o 'wa' sai baixo.",
    tags: ["wa", "kara", "made", "ka", "horario", "ctx:compras", "ctx:cidade"],
  }),
  card({
    id: "card_064",
    tipo: "listening",
    situacao_pt: "O funcionário da loja responde o horário de funcionamento.",
    significado_cognitivo: "Dez horas a partir de, oito horas até é",
    traducao: "Das 10 às 8.",
    kana: "じゅうじからはちじまでです",
    kanji: "十時[じゅうじ]から八時[はちじ]までです",
    blocos: [
      b("ju.u.ji", "HLL", "dez horas", "tempo"),
      b("ka.ra", "LL", "a partir de", "particula"),
      b("ha.chi.ji", "LHL", "oito horas", "tempo"),
      b("ma.de", "LL", "[até]", "particula"),
      b("de._su", "LL", "é", "copula"),
    ],
    notas:
      "No Japão também se usa o relógio de 24 horas em horários de loja e trem: 'juuhachiji' (18h). Com 12 horas, 'gozen' é de manhã e 'gogo' é à tarde: 'gogo hachiji' = 8 da noite.",
    tags: ["kara", "made", "horario", "listening", "ctx:compras", "ctx:cidade"],
  }),
  card({
    id: "card_065",
    tipo: "speaking",
    situacao_pt: "Um colega novo quer saber a data do seu aniversário. Pergunte o dele também.",
    significado_cognitivo: "Aniversário [tópico], que mês que dia é [?]",
    traducao: "Quando é o seu aniversário?",
    kana: "たんじょうびはなんがつなんにちですか",
    kanji: "誕生日[たんじょうび]は何月[なんがつ]何日[なんにち]ですか",
    blocos: [
      b("ta.n.jo.o.bi", "LHHLL", "aniversário", "topico"),
      b("wa", "L", "[Tópico]", "particula"),
      b("na.n.ga._tsu", "HLLL", "que mês", "pergunta"),
      b("na.n.ni.chi", "LHHL", "que dia", "pergunta"),
      b("de._su", "LL", "é", "copula"),
      b("ka", "L", "[?]", "particula"),
    ],
    notas:
      "Data em japonês vai do maior para o menor: mês e depois dia (e o ano antes de tudo). Os meses são número + 'gatsu': ichigatsu (janeiro), nigatsu (fevereiro)… juunigatsu (dezembro).",
    tags: ["wa", "ka", "data", "numeros", "ctx:social", "ctx:trabalho"],
  }),
  card({
    id: "card_066",
    tipo: "speaking",
    situacao_pt: "Perguntam a data do seu aniversário: é 10 de abril.",
    significado_cognitivo: "Abril, dia dez é",
    traducao: "É 10 de abril.",
    kana: "しがつとおかです",
    kanji: "四月[しがつ]十日[とおか]です",
    blocos: [
      b("shi.ga._tsu", "LHH", "abril (mês 4)", "tempo"),
      b("to.o.ka", "LHH", "dia 10", "tempo"),
      b("de._su", "HL", "é", "copula"),
    ],
    notas:
      "Abril é 'shigatsu' (nunca 'yongatsu'). Os dias 1 a 10 têm nomes próprios: tsuitachi, futsuka, mikka, yokka, itsuka, muika, nanoka, youka, kokonoka, tooka; do 11 em diante é número + 'nichi' (juuichinichi), com exceções como hatsuka (20).",
    tags: ["data", "numeros", "ctx:social"],
  }),
];
