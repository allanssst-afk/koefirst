import type { PalavraProva, QuestaoGramatica, TextoLeitura } from "./simulado-n5";

/**
 * Questões do simulado N3 completo (marco do mês 12), com a gramática das unidades 36–43. O vocabulário cobra a leitura do
 * kanji, sem furigana; gramática e leitura usam a notação 漢字[よみ], que `ExProvaKana` mostra como furigana na Fase 3 e sem
 * ele na Fase 4. Os textos são mais longos que os do N4 e pedem a ideia, não só um dado.
 */

/** Só palavras do baralho, e com sentidos sem sobreposição: as erradas saem desta lista. */
export const VOCABULARIO_N3: PalavraProva[] = [
  { kana: "結婚", pt: "casamento" },
  { kana: "警察", pt: "polícia" },
  { kana: "泥棒", pt: "ladrão" },
  { kana: "地震", pt: "terremoto" },
  { kana: "事故", pt: "acidente" },
  { kana: "新聞", pt: "jornal" },
  { kana: "値段", pt: "preço" },
  { kana: "予算", pt: "orçamento" },
  { kana: "家賃", pt: "aluguel" },
  { kana: "保険", pt: "seguro" },
  { kana: "書類", pt: "documento" },
  { kana: "計画", pt: "plano" },
  { kana: "結果", pt: "resultado" },
  { kana: "問題", pt: "problema" },
  { kana: "意見", pt: "opinião" },
  { kana: "営業", pt: "vendas" },
  { kana: "将来", pt: "futuro" },
  { kana: "理由", pt: "motivo" },
  { kana: "長所", pt: "ponto forte" },
  { kana: "短所", pt: "ponto fraco" },
  { kana: "専門家", pt: "especialista" },
  { kana: "卒業", pt: "formatura" },
  { kana: "相談", pt: "conversa para pedir conselho" },
  { kana: "出張", pt: "viagem de trabalho" },
  { kana: "留守", pt: "ausência de casa" },
  { kana: "引っ越し", pt: "mudança de casa" },
];

export const GRAMATICA_N3: QuestaoGramatica[] = [
  { frase: "先生[せんせい]（　）叱[しか]られました。", certa: "に", erradas: ["を", "で", "へ"], pt: "Levei uma bronca do professor.", por: "Na passiva, quem faz a ação leva 'ni'." },
  { frase: "母[はは]は私[わたし]に野菜[やさい]を（　）。", certa: "食[た]べさせました", erradas: ["食[た]べたいです", "食[た]べましょう", "食[た]べながら"], pt: "Minha mãe me fez comer legumes.", por: "'X wa Y ni … sasemashita': X faz Y fazer algo. É a causativa." },
  { frase: "今日[きょう]は早[はや]く（　）ください。", certa: "帰[かえ]らせて", erradas: ["帰[かえ]ろう", "帰[かえ]る", "帰[かえ]った"], pt: "Hoje, deixe-me sair mais cedo, por favor.", por: "Causativa na forma -te + 'kudasai' pede permissão para fazer algo." },
  { frase: "遅[おく]れない（　）にしてください。", certa: "よう", erradas: ["そう", "ほど", "ながら"], pt: "Procure não se atrasar.", por: "'-nai you ni shite kudasai' pede atenção e esforço." },
  { frase: "今[いま]すぐ決[き]めなくても（　）です。", certa: "いい", erradas: ["ほしい", "たい", "そう"], pt: "Não precisa decidir agora.", por: "'-nakute mo ii desu' = não precisa." },
  { frase: "病院[びょういん]に行[い]った（　）がいいですよ。", certa: "ほう", erradas: ["そう", "よう", "うち"], pt: "É melhor você ir ao hospital.", por: "Forma -ta + 'hou ga ii' dá um conselho." },
  { frase: "無理[むり]を（　）ほうがいいです。", certa: "しない", erradas: ["して", "しよう", "します"], pt: "É melhor não exagerar.", por: "Conselho negativo: forma -nai + 'hou ga ii'." },
  { frase: "天気予報[てんきよほう]（　）、明日[あした]は雪[ゆき]だそうです。", certa: "によると", erradas: ["にとって", "のために", "のあとで"], pt: "Segundo a previsão, amanhã vai nevar.", por: "'ni yoru to' dá a fonte, e a frase termina com 'sou desu'." },
  { frase: "田中[たなか]さんは結婚[けっこん]（　）そうです。", certa: "した", erradas: ["して", "しよう", "しながら"], pt: "Ouvi dizer que o Tanaka se casou.", por: "Para dizer 'ouvi dizer', 'sou desu' vem depois da forma plana." },
  { frase: "山田[やまだ]（　）人[ひと]を知[し]っていますか。", certa: "という", erradas: ["による", "について", "ながら"], pt: "Você conhece alguém chamado Yamada?", por: "'to iu' = chamado, que se chama." },
  { frase: "ご飯[はん]を食[た]べて（　）、出[で]かけました。", certa: "から", erradas: ["ほど", "のに", "うちに"], pt: "Depois de comer, saí.", por: "Forma -te + 'kara' = depois de." },
  { frase: "日本[にほん]に来[く]る（　）に、日本語[にほんご]を勉強[べんきょう]しました。", certa: "前[まえ]", erradas: ["後[あと]", "ほう", "そう"], pt: "Antes de vir ao Japão, estudei japonês.", por: "'mae ni' vem depois da forma de dicionário, mesmo falando do passado." },
  { frase: "留守[るす]の（　）に、泥棒[どろぼう]が入[はい]りました。", certa: "間[あいだ]", erradas: ["ほう", "こと", "ほど"], pt: "Enquanto eu estava fora, entrou um ladrão.", por: "'aida ni' marca que algo aconteceu dentro de um período." },
  { frase: "熱[あつ]い（　）に、食[た]べてください。", certa: "うち", erradas: ["ほう", "そう", "こと"], pt: "Coma enquanto está quente.", por: "'uchi ni' = enquanto ainda está assim, antes que mude." },
  { frase: "音楽[おんがく]を聞[き]き（　）、勉強[べんきょう]します。", certa: "ながら", erradas: ["たら", "てから", "ほど"], pt: "Estudo ouvindo música.", por: "Raiz da forma -masu + 'nagara': duas ações ao mesmo tempo." },
  { frase: "たくさん勉強[べんきょう]した（　）、試験[しけん]に落[お]ちました。", certa: "のに", erradas: ["ながら", "ほど", "うちに"], pt: "Estudei muito e, mesmo assim, reprovei.", por: "'noni' mostra um resultado contrário ao esperado." },
  { frase: "練習[れんしゅう]すれば（　）ほど、上手[じょうず]になります。", certa: "する", erradas: ["した", "して", "しよう"], pt: "Quanto mais você pratica, melhor fica.", por: "'-ba … hodo': forma -ba + forma de dicionário + 'hodo'." },
  { frase: "資料[しりょう]を（　）します。", certa: "お送[おく]り", erradas: ["送[おく]る", "送[おく]って", "送[おく]った"], pt: "Vou enviar os documentos.", por: "Humilde: 'o' + raiz da forma -masu + 'shimasu'." },
];

export const LEITURA_N3: TextoLeitura[] = [
  {
    texto:
      "先週[せんしゅう]の金曜日[きんようび]、電車[でんしゃ]の中[なか]で財布[さいふ]を盗[ぬす]まれました。ちょっと目[め]を離[はな]したら、なくなっていたのです。すぐ駅員[えきいん]に話[はな]して、交番[こうばん]にも届[とど]けました。次[つぎ]の日[ひ]、警察[けいさつ]から電話[でんわ]がありました。財布[さいふ]は見[み]つかりましたが、お金[かね]はなくなっていたそうです。カードは無事[ぶじ]だったので、少[すこ]し安心[あんしん]しました。",
    perguntas: [
      { pergunta: "O que a polícia avisou?", certa: "A carteira foi achada, mas sem o dinheiro", erradas: ["A carteira não foi achada", "O ladrão foi preso", "O dinheiro foi devolvido"] },
      { pergunta: "Por que a pessoa ficou um pouco aliviada?", certa: "O cartão estava a salvo", erradas: ["Recuperou todo o dinheiro", "O seguro pagou a perda", "O funcionário encontrou a carteira"] },
    ],
  },
  {
    texto:
      "ごみの出[だ]し方[かた]についてお知[し]らせします。燃[も]えるごみは、月曜日[げつようび]と木曜日[もくようび]の朝[あさ]八時[はちじ]までに出[だ]してください。前[まえ]の日[ひ]の夜[よる]には出[だ]さないようにしてください。大[おお]きいごみを捨[す]てるときは、市役所[しやくしょ]に電話[でんわ]してください。わからないことがあれば、管理人[かんりにん]に聞[き]いてください。",
    perguntas: [
      { pergunta: "Quando se deve colocar o lixo que queima?", certa: "Na manhã de segunda ou quinta, até as 8h", erradas: ["Na noite anterior à coleta", "Todos os dias de manhã", "Às segundas, depois das 8h"] },
      { pergunta: "O que fazer com o lixo grande?", certa: "Telefonar para a prefeitura", erradas: ["Deixar na frente do prédio", "Levar à estação", "Entregar ao zelador"] },
    ],
  },
  {
    texto:
      "部長[ぶちょう]、お疲[つか]れ様[さま]です。山田[やまだ]です。来週[らいしゅう]の出張[しゅっちょう]について、ご相談[そうだん]があります。お客様[きゃくさま]によると、会議[かいぎ]は火曜日[かようび]から水曜日[すいようび]に変[か]わったそうです。そのため、帰[かえ]りの新幹線[しんかんせん]を一日[いちにち]遅[おそ]らせたいのですが、よろしいでしょうか。お返事[へんじ]をお待[ま]ちしております。",
    perguntas: [
      { pergunta: "O que mudou?", certa: "O dia da reunião com o cliente", erradas: ["O lugar da viagem", "O nome do cliente", "O horário do trem de ida"] },
      { pergunta: "O que o Yamada pede ao gerente?", certa: "Voltar da viagem um dia depois", erradas: ["Cancelar a viagem", "Mudar a reunião para terça", "Ir de carro em vez de trem"] },
    ],
  },
  {
    texto:
      "外国語[がいこくご]は、話[はな]せば話[はな]すほど上手[じょうず]になると言[い]われます。しかし、私[わたし]は最初[さいしょ]、間違[まちが]えるのが怖[こわ]くて、あまり話[はな]せませんでした。ある日[ひ]、先生[せんせい]に「間違[まちが]えてもいいから、毎日[まいにち]少[すこ]しずつ話[はな]してみてください」と言[い]われました。それから毎日[まいにち]話[はな]すようにしたら、だんだん楽[たの]しくなりました。今[いま]は、間違[まちが]えることも大切[たいせつ]だと思[おも]っています。",
    perguntas: [
      { pergunta: "Por que a pessoa falava pouco no começo?", certa: "Tinha medo de errar", erradas: ["Não tinha tempo", "Não tinha com quem falar", "Não gostava da aula"] },
      { pergunta: "O que a pessoa pensa agora?", certa: "Que errar também é importante", erradas: ["Que é melhor falar só com o professor", "Que falar todo dia é cansativo", "Que deve estudar mais gramática"] },
    ],
  },
  {
    texto:
      "ニュースによると、今夜[こんや]から明日[あした]の朝[あさ]にかけて、大[おお]きい台風[たいふう]が来[く]るそうです。電車[でんしゃ]が止[と]まるかもしれないので、明日[あした]は会社[かいしゃ]に来[こ]なくてもいいです。家[いえ]で仕事[しごと]をしてください。ただし、午後[ごご]三時[さんじ]の会議[かいぎ]はオンラインで行[おこな]います。資料[しりょう]は今日[きょう]のうちに確認[かくにん]しておいてください。",
    perguntas: [
      { pergunta: "Por que não é preciso ir à empresa amanhã?", certa: "O tufão pode parar os trens", erradas: ["A empresa vai fechar para reforma", "A reunião foi cancelada", "Amanhã é feriado"] },
      { pergunta: "O que é preciso fazer hoje?", certa: "Conferir os documentos da reunião", erradas: ["Comprar comida para casa", "Telefonar para o cliente", "Levar o computador para o conserto"] },
    ],
  },
  {
    texto:
      "日本[にほん]に来[き]てから、三年[さんねん]になります。来[き]たばかりのころは、言葉[ことば]がわからなくて、銀行[ぎんこう]の口座[こうざ]を開[ひら]くのも大変[たいへん]でした。そのとき、隣[となり]に住[す]んでいる鈴木[すずき]さんが市役所[しやくしょ]や病院[びょういん]に一緒[いっしょ]に行[い]ってくれました。今[いま]は私[わたし]も、困[こま]っている外国人[がいこくじん]を手伝[てつだ]うようにしています。",
    perguntas: [
      { pergunta: "Quem ajudou a pessoa no começo?", certa: "O vizinho Suzuki", erradas: ["Um funcionário do banco", "Um médico do hospital", "Um colega da empresa"] },
      { pergunta: "O que a pessoa procura fazer agora?", certa: "Ajudar estrangeiros em dificuldade", erradas: ["Trabalhar na prefeitura", "Mudar para outra cidade", "Ensinar português ao vizinho"] },
    ],
  },
];
