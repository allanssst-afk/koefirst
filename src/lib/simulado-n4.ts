import type { PalavraProva, QuestaoGramatica, TextoLeitura } from "./simulado-n5";

/**
 * Questões com kanji do simulado N4 completo (marco do mês 9): vocabulário, gramática e leitura, com a gramática das
 * Fases 2 e 3. O vocabulário cobra a leitura do kanji, sem furigana; gramática e leitura usam a notação 漢字[よみ],
 * que `ExProvaKana` mostra como furigana na Fase 3 e sem ele na Fase 4.
 */

/** Só palavras do baralho, e com sentidos sem sobreposição: as erradas saem desta lista. */
export const VOCABULARIO_N4: PalavraProva[] = [
  { kana: "会議", pt: "reunião" },
  { kana: "資料", pt: "documentos" },
  { kana: "約束", pt: "compromisso" },
  { kana: "予定", pt: "programação" },
  { kana: "旅行", pt: "viagem" },
  { kana: "料理", pt: "comida" },
  { kana: "運転", pt: "direção (dirigir)" },
  { kana: "説明", pt: "explicação" },
  { kana: "住所", pt: "endereço" },
  { kana: "窓口", pt: "guichê" },
  { kana: "財布", pt: "carteira" },
  { kana: "荷物", pt: "bagagem" },
  { kana: "切符", pt: "passagem" },
  { kana: "試験", pt: "prova" },
  { kana: "番号", pt: "número" },
  { kana: "修理", pt: "conserto" },
  { kana: "予約", pt: "reserva" },
  { kana: "部屋", pt: "quarto" },
  { kana: "写真", pt: "foto" },
  { kana: "音楽", pt: "música" },
  { kana: "家族", pt: "família" },
  { kana: "友達", pt: "amigo" },
  { kana: "医者", pt: "médico" },
  { kana: "自転車", pt: "bicicleta" },
];

export const GRAMATICA_N4: QuestaoGramatica[] = [
  { frase: "雨[あめ]が（　）、行[い]きません。", certa: "降[ふ]ったら", erradas: ["降[ふ]りたい", "降[ふ]ろう", "降[ふ]ります"], pt: "Se chover, não vou.", por: "Condição: forma -ta + 'ra'." },
  { frase: "どう（　）いいですか。", certa: "すれば", erradas: ["する", "した", "しよう"], pt: "O que devo fazer?", por: "'dou sureba ii desu ka' pede um conselho." },
  { frase: "母[はは]が私[わたし]に料理[りょうり]を作[つく]って（　）。", certa: "くれました", erradas: ["あげました", "もらいました", "いただきました"], pt: "Minha mãe cozinhou para mim.", por: "Quando a ação vem até mim, o verbo é 'kuremashita'." },
  { frase: "これは友達[ともだち]が（　）ケーキです。", certa: "作[つく]った", erradas: ["作[つく]って", "作[つく]ります", "作[つく]りましょう"], pt: "Este é o bolo que meu amigo fez.", por: "Antes do substantivo, o verbo fica na forma plana." },
  { frase: "ここから富士山[ふじさん]が（　）。", certa: "見[み]えます", erradas: ["見[み]ます", "見[み]せます", "見[み]ましょう"], pt: "Daqui dá para ver o Monte Fuji.", por: "'miemasu' é o que aparece aos olhos, sem esforço." },
  { frase: "財布[さいふ]を忘[わす]れて（　）。", certa: "しまいました", erradas: ["しました", "なりました", "できました"], pt: "Esqueci a carteira.", por: "Algo que aconteceu sem querer: forma -te + 'shimaimashita'." },
  { frase: "このケーキはおいし（　）です。", certa: "そう", erradas: ["らしい", "よう", "みたい"], pt: "Este bolo parece gostoso.", por: "Pela aparência: adjetivo sem '-i' + 'sou'." },
  { frase: "雨[あめ]が（　）そうです。", certa: "降[ふ]り", erradas: ["降[ふ]って", "降[ふ]らな", "降[ふ]ろう"], pt: "Parece que vai chover.", por: "Prestes a acontecer: raiz -masu + 'sou desu'." },
  { frase: "田中[たなか]さんは今日[きょう]休[やす]み（　）です。", certa: "らしい", erradas: ["ます", "ませ", "よう"], pt: "Parece que o Tanaka está de folga hoje.", por: "Informação que veio de fora: 'rashii'." },
  { frase: "お客様[きゃくさま]は今[いま]、会議室[かいぎしつ]に（　）。", certa: "いらっしゃいます", erradas: ["参[まい]ります", "おります", "いたします"], pt: "O cliente está na sala de reunião.", por: "Para elevar o outro: 'irasshaimasu'." },
  { frase: "私[わたし]はブラジルから（　）。", certa: "参[まい]りました", erradas: ["いらっしゃいました", "なさいました", "召[め]し上[あ]がりました"], pt: "Vim do Brasil.", por: "Sobre si mesmo, a forma é humilde: 'mairimashita'." },
  { frase: "お金[かね]が（　）、買[か]えません。", certa: "なくて", erradas: ["ない", "なかった", "なる"], pt: "Estou sem dinheiro e não consigo comprar.", por: "'-nakute' liga o problema à consequência." },
];

export const LEITURA_N4: TextoLeitura[] = [
  {
    texto: "昨日[きのう]、財布[さいふ]を電車[でんしゃ]に忘[わす]れてしまいました。駅員[えきいん]に聞[き]いたら、駅[えき]の窓口[まどぐち]にありました。とてもうれしかったです。",
    perguntas: [
      { pergunta: "O que a pessoa esqueceu no trem?", certa: "A carteira", erradas: ["O guarda-chuva", "O celular", "A bagagem"] },
      { pergunta: "Onde a pessoa encontrou o que perdeu?", certa: "No guichê da estação", erradas: ["No trem", "Em casa", "Na delegacia"] },
    ],
  },
  {
    texto: "田中[たなか]さんは今日[きょう]休[やす]みらしいです。風邪[かぜ]をひいたようです。明日[あした]の会議[かいぎ]は、鈴木[すずき]さんが説明[せつめい]します。",
    perguntas: [
      { pergunta: "Por que o Tanaka faltou?", certa: "Parece que pegou um resfriado", erradas: ["Foi viajar", "Teve uma reunião", "Perdeu o trem"] },
      { pergunta: "Quem vai explicar na reunião de amanhã?", certa: "O Suzuki", erradas: ["O Tanaka", "O gerente", "O cliente"] },
    ],
  },
  {
    texto: "友達[ともだち]が作[つく]ったケーキを食[た]べました。とてもおいしかったです。友達[ともだち]は料理[りょうり]が上手[じょうず]で、いつも作[つく]り方[かた]を教[おし]えてくれます。",
    perguntas: [
      { pergunta: "Quem fez o bolo?", certa: "Um amigo da pessoa", erradas: ["A própria pessoa", "A mãe da pessoa", "Uma loja"] },
      { pergunta: "O que o amigo sempre faz?", certa: "Ensina como preparar", erradas: ["Compra bolos", "Pede a receita", "Sai para jantar"] },
    ],
  },
  {
    texto: "お客様[きゃくさま]へ。資料[しりょう]をメールでお送[おく]りしました。ご確認[かくにん]ください。来週[らいしゅう]の月曜日[げつようび]に伺[うかが]います。よろしくお願[ねが]いいたします。",
    perguntas: [
      { pergunta: "O que foi enviado ao cliente?", certa: "Os documentos, por e-mail", erradas: ["Uma encomenda", "Um presente", "Uma passagem"] },
      { pergunta: "Quando será a visita?", certa: "Na segunda da semana que vem", erradas: ["Amanhã", "Nesta sexta", "No mês que vem"] },
    ],
  },
  {
    texto: "日本語[にほんご]の試験[しけん]を受[う]けようと思[おも]っています。時間[じかん]があれば、毎日[まいにち]漢字[かんじ]を勉強[べんきょう]します。合格[ごうかく]したら、日本[にほん]で働[はたら]きたいです。",
    perguntas: [
      { pergunta: "O que a pessoa pretende fazer?", certa: "Fazer a prova de japonês", erradas: ["Mudar de emprego", "Viajar pelo Japão", "Dar aulas de japonês"] },
      { pergunta: "O que a pessoa quer fazer se passar?", certa: "Trabalhar no Japão", erradas: ["Estudar inglês", "Voltar ao Brasil", "Comprar um carro"] },
    ],
  },
];
