/**
 * Questões em kana do simulado N5 completo (marco da Fase 2): vocabulário, gramática e leitura, no formato das
 * seções do JLPT N5. Só usam palavras e formas das frases do baralho. Enunciados em português, para testar o
 * japonês e não a compreensão da instrução. A lacuna da gramática é sempre "（　）".
 */

export interface PalavraProva {
  kana: string;
  pt: string;
}

/** Sentidos sem sobreposição: as erradas saem desta mesma lista. */
export const VOCABULARIO_N5: PalavraProva[] = [
  { kana: "ともだち", pt: "amigo" },
  { kana: "かぞく", pt: "família" },
  { kana: "いもうと", pt: "irmã mais nova" },
  { kana: "くすり", pt: "remédio" },
  { kana: "ねつ", pt: "febre" },
  { kana: "あたま", pt: "cabeça" },
  { kana: "やま", pt: "montanha" },
  { kana: "でんしゃ", pt: "trem" },
  { kana: "えき", pt: "estação" },
  { kana: "しゅみ", pt: "hobby" },
  { kana: "おんがく", pt: "música" },
  { kana: "りょこう", pt: "viagem" },
  { kana: "きっぷ", pt: "passagem" },
  { kana: "にもつ", pt: "bagagem" },
  { kana: "さかな", pt: "peixe" },
  { kana: "にく", pt: "carne" },
  { kana: "やすい", pt: "barato" },
  { kana: "おおきい", pt: "grande" },
  { kana: "あつい", pt: "quente" },
  { kana: "たのしい", pt: "divertido" },
  { kana: "いそがしい", pt: "ocupado" },
  { kana: "おいしい", pt: "gostoso" },
  { kana: "きのう", pt: "ontem" },
  { kana: "あした", pt: "amanhã" },
  { kana: "らいねん", pt: "ano que vem" },
  { kana: "まだ", pt: "ainda" },
];

export interface QuestaoGramatica {
  frase: string;
  certa: string;
  /** só opções que deixam a frase errada: nada de duas respostas possíveis */
  erradas: string[];
  pt: string;
  por: string;
}

export const GRAMATICA_N5: QuestaoGramatica[] = [
  { frase: "にほん（　）いったことが あります。", certa: "に", erradas: ["を", "で", "から"], pt: "Já fui ao Japão.", por: "Destino de movimento leva 'ni'." },
  { frase: "まいにち コーヒー（　）のみます。", certa: "を", erradas: ["に", "で", "と"], pt: "Tomo café todo dia.", por: "O objeto do verbo leva 'o'." },
  { frase: "かいしゃ（　）はたらいて います。", certa: "で", erradas: ["を", "が", "から"], pt: "Trabalho na empresa.", por: "O lugar onde a ação acontece leva 'de'." },
  { frase: "ともだち（　）えいがを みました。", certa: "と", erradas: ["を", "に", "から"], pt: "Vi um filme com um amigo.", por: "Companhia leva 'to'." },
  { frase: "コーヒーと こうちゃと、（　）が すきですか。", certa: "どちら", erradas: ["どこ", "いつ", "なに"], pt: "Você prefere café ou chá?", por: "Para escolher entre dois: 'dochira'." },
  { frase: "とうきょうは おおさか（　）おおきいです。", certa: "より", erradas: ["ほど", "を", "で"], pt: "Tóquio é maior que Osaka.", por: "'yori' marca a base da comparação; 'hodo' pede negativo." },
  { frase: "おおさかは とうきょう（　）おおきくないです。", certa: "ほど", erradas: ["を", "に", "で"], pt: "Osaka não é tão grande quanto Tóquio.", por: "'hodo' + negativo = não tão … quanto." },
  { frase: "あたまが（　）んです。", certa: "いたい", erradas: ["いたく", "いたくて", "いたいです"], pt: "É que estou com dor de cabeça.", por: "Antes de 'n desu' vem a forma plana." },
  { frase: "いちど すしを（　）ことが あります。", certa: "たべた", erradas: ["たべて", "たべます", "たべましょう"], pt: "Já comi sushi uma vez.", por: "Experiência: forma -ta + 'koto ga arimasu'." },
  { frase: "らいねん にほんに（　）と おもいます。", certa: "いこう", erradas: ["いって", "いきます", "いきましょう"], pt: "Estou pensando em ir ao Japão no ano que vem.", por: "Plano: volitiva + 'to omoimasu'." },
  { frase: "しゅうまつは そうじを したり、かいものを（　）しました。", certa: "したり", erradas: ["して", "した", "します"], pt: "No fim de semana fiz faxina, compras e outras coisas.", por: "'-tari' vem nas duas ações, e 'shimasu' fecha a frase." },
  { frase: "あしたは はやく（　）なりません。", certa: "おきなければ", erradas: ["おきて", "おきる", "おきた"], pt: "Amanhã tenho que acordar cedo.", por: "Obrigação: '-nakereba narimasen'." },
  { frase: "すみません、ちょっと（　）ください。", certa: "まって", erradas: ["まつ", "まった", "まちます"], pt: "Com licença, espere um pouco, por favor.", por: "Pedido: forma -te + 'kudasai'." },
  { frase: "いま、なにを（　）いますか。", certa: "して", erradas: ["する", "した", "しない"], pt: "O que você está fazendo agora?", por: "Ação em andamento: forma -te + 'imasu'." },
  { frase: "しゅみは ほんを よむ（　）です。", certa: "こと", erradas: ["を", "が", "に"], pt: "Meu hobby é ler livros.", por: "'koto' transforma o verbo em substantivo." },
  { frase: "きょうは あめが ふって いる（　）、いきません。", certa: "から", erradas: ["を", "に", "で"], pt: "Como está chovendo hoje, não vou.", por: "Motivo + 'kara': o motivo vem antes da conclusão." },
];

export interface TextoLeitura {
  texto: string;
  perguntas: { pergunta: string; certa: string; erradas: string[] }[];
}

export const LEITURA_N5: TextoLeitura[] = [
  {
    texto: "きのう、ともだちと きょうとに いきました。おてらを みたり、しゃしんを とったり しました。ひるごはんは ラーメンを たべました。とても おいしかったです。",
    perguntas: [
      { pergunta: "Com quem a pessoa foi a Kyoto?", certa: "Com amigos", erradas: ["Com a família", "Com o chefe", "Sozinha"] },
      { pergunta: "O que a pessoa comeu no almoço?", certa: "Ramen", erradas: ["Sushi", "Natto", "Bentô"] },
    ],
  },
  {
    texto: "たなかさんへ。あしたの かいぎは じゅうじからです。レポートを かかなければ なりません。おねがいします。こばやし",
    perguntas: [
      { pergunta: "A que horas começa a reunião?", certa: "Às 10h", erradas: ["Às 9h", "Às 7h", "Às 3h"] },
      { pergunta: "O que o Tanaka tem que fazer?", certa: "Escrever o relatório", erradas: ["Enviar um e-mail", "Comprar um presente", "Ligar para o cliente"] },
    ],
  },
  {
    texto: "わたしは ブラジルじんです。いま、にほんごを べんきょうして います。らいねん、にほんに いこうと おもいます。にほんで はたらきたいからです。",
    perguntas: [
      { pergunta: "Quando a pessoa pensa em ir ao Japão?", certa: "No ano que vem", erradas: ["Neste ano", "No mês que vem", "Na semana que vem"] },
      { pergunta: "Por que a pessoa quer ir ao Japão?", certa: "Para trabalhar lá", erradas: ["Para estudar lá", "Para ver a família", "Para ver templos"] },
    ],
  },
  {
    texto: "とうきょうは おおさかより おおきいです。でも、わたしは おおさかの ほうが すきです。たべものが おいしいからです。",
    perguntas: [
      { pergunta: "Qual cidade a pessoa prefere?", certa: "Osaka", erradas: ["Tóquio", "Kyoto", "Nenhuma das duas"] },
      { pergunta: "Por que a pessoa prefere essa cidade?", certa: "A comida é gostosa", erradas: ["É mais barata", "É maior", "Tem mais amigos lá"] },
    ],
  },
  {
    texto: "きょうは あたまが いたいです。ねつも あります。くすりを のんで、はやく ねようと おもいます。",
    perguntas: [
      { pergunta: "Como a pessoa está hoje?", certa: "Com dor de cabeça e febre", erradas: ["Com fome", "Com dor de garganta", "Muito bem"] },
      { pergunta: "O que a pessoa pensa em fazer?", certa: "Tomar remédio e dormir cedo", erradas: ["Ir ao hospital", "Trabalhar até tarde", "Sair com amigos"] },
    ],
  },
  {
    texto: "ここで しゃしんを とらないで ください。くつを ぬいで ください。おてらの なかでは、でんわを しないで ください。",
    perguntas: [
      { pergunta: "O que não se pode fazer neste lugar?", certa: "Tirar fotos", erradas: ["Entrar", "Sentar", "Falar baixo"] },
      { pergunta: "O que os visitantes devem fazer?", certa: "Tirar os sapatos", erradas: ["Pagar a entrada", "Comprar uma passagem", "Escrever o nome"] },
    ],
  },
];
