import { cardsLugares } from "./cards-lugares";
import { cardsNumeros } from "./cards-numeros";
import { cardsPedidos } from "./cards-pedidos";
import { cardsAgora } from "./cards-agora";
import { cardsAdjetivos } from "./cards-adjetivos";
import { cardsFimDeSemana } from "./cards-fimdesemana";
import { cardsFamilia } from "./cards-familia";
import { cardsSaude } from "./cards-saude";
import { cardsHobbies } from "./cards-hobbies";
import { cardsRegras } from "./cards-regras";
import { cardsCasual } from "./cards-casual";
import { cardsOpiniao } from "./cards-opiniao";
import { cardsMotivos } from "./cards-motivos";
import { cardsExperiencias } from "./cards-experiencias";
import { cardsComparar } from "./cards-comparar";
import { cardsPlanos } from "./cards-planos";
import { cardsViagem } from "./cards-viagem";
import { cardsConsegue } from "./cards-consegue";
import { cardsCondicional } from "./cards-condicional";
import { cardsDarReceber } from "./cards-dar-receber";
import { cardsDescrever } from "./cards-descrever";
import { cardsServicos } from "./cards-servicos";
import { cardsProblemas } from "./cards-problemas";
import { cardsKeigo } from "./cards-keigo";
import { cardsTelefone } from "./cards-telefone";
import { cardsAparencias } from "./cards-aparencias";
import { cardsPassiva } from "./cards-passiva";
import { cardsCausativa } from "./cards-causativa";
import { cardsConselhos } from "./cards-conselhos";
import { cardsNoticias } from "./cards-noticias";
import { cardsHistoria } from "./cards-historia";
import { cardsNegociar } from "./cards-negociar";
import { cardsEntrevista } from "./cards-entrevista";
import { cardsVidaJapao } from "./cards-vida-japao";
import { cardsTrabalho } from "./cards-trabalho";
import { b, card } from "./helpers";

/**
 * 30 cards de sobrevivência e conversa básica, na ordem de aprendizagem.
 * Pitch: padrão de Tóquio (NHK/OJAD) já aplicado no contexto da frase.
 * `_` antes da mora = mora devozeada (ex.: o "su" final de desu).
 */
const cardsBase = [
  card({
    id: "card_002",
    tipo: "speaking",
    situacao_pt: "Você encontra o vizinho à tarde. Cumprimente-o.",
    significado_cognitivo: "Olá! / Boa tarde! — expressão pronta, usada do fim da manhã ao fim da tarde",
    traducao: "Olá! / Boa tarde!",
    kana: "こんにちは",
    kanji: "今日[こんにち]は",
    blocos: [b("ko.n.ni.chi.wa", "LHHHH", "olá / boa tarde", "expressao")],
    notas:
      "Diga como um bloco só, sem pensar nas partes. Heiban (plano): sobe na 2ª mora e não cai mais; cada 'n' é uma batida inteira: ko-n-ni-chi-wa = 5 batidas. Curiosidade: vem de uma frase antiga, 'quanto ao dia de hoje…', que ficou pela metade — por isso o 'wa' final é a partícula de tópico.",
    tags: ["saudacao", "sobrevivencia", "ctx:social", "ctx:cidade"],
  }),
  card({
    id: "card_003",
    tipo: "speaking",
    situacao_pt: "Você chega ao escritório de manhã. Cumprimente a equipe de forma educada.",
    significado_cognitivo: "Bom dia! (forma educada) — expressão pronta",
    traducao: "Bom dia!",
    kana: "おはようございます",
    kanji: "おはようございます",
    blocos: [
      b("o.ha.yo.o", "LHHH", "bom dia", "expressao"),
      b("go.za.i.ma._su", "HHHHL", "[forma educada]", "expressao"),
    ],
    notas:
      "'ohayou' é plano e continua alto até 'gozaima', caindo só no 'su' (devozeado: soa como 'gozaimas'). Com amigos basta 'ohayou'. Curiosidade: a origem é 'é cedo'.",
    tags: ["saudacao", "trabalho", "ctx:trabalho"],
  }),
  card({
    id: "card_005",
    tipo: "speaking",
    situacao_pt: "Você precisa chamar o garçom (ou pedir licença para passar).",
    significado_cognitivo: "Com licença! / Desculpe! — também serve para chamar alguém (garçom, atendente)",
    traducao: "Com licença.",
    kana: "すみません",
    kanji: "すみません",
    blocos: [b("su.mi.ma.se.n", "LHHHL", "com licença / desculpe", "expressao")],
    notas:
      "A voz sobe na 2ª mora e só cai depois de 'se'. Serve para pedir desculpa, chamar alguém e agradecer por um incômodo. Curiosidade: termina em -masen (negativo educado) porque a origem é '(minha dívida com você) não se resolve'.",
    tags: ["sobrevivencia", "masen", "ctx:restaurante", "ctx:compras", "ctx:cidade"],
  }),
  card({
    id: "card_006",
    tipo: "speaking",
    situacao_pt: "Você está conhecendo um colega novo pela primeira vez.",
    significado_cognitivo: "Muito prazer! — só no primeiro encontro com alguém",
    traducao: "Muito prazer.",
    kana: "はじめまして",
    kanji: "初[はじ]めまして",
    blocos: [b("ha.ji.me.ma._shi.te", "LHHHLL", "muito prazer", "expressao")],
    notas:
      "Queda depois de 'ma'; o 'shi' quase some (hajimemash'te). Costuma vir seguido do seu nome + 'desu'. Curiosidade: a origem é 'começando (pela primeira vez)…'.",
    tags: ["apresentacao", "ctx:trabalho", "ctx:social"],
  }),
  card({
    id: "card_004",
    tipo: "speaking",
    situacao_pt: "Um colega te ajudou com um arquivo. Agradeça educadamente.",
    significado_cognitivo: "Obrigado! (forma educada) — expressão pronta",
    traducao: "Obrigado.",
    kana: "ありがとうございます",
    kanji: "ありがとうございます",
    blocos: [
      b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
      b("go.za.i.ma._su", "LHHHL", "[forma educada]", "expressao"),
    ],
    notas:
      "Nakadaka: a voz sobe em 'ri' e cai em 'ga'. 'gozaimasu' começa um novo arco melódico (sobe de novo e cai no 'su'). Com amigos basta 'arigatou'. Curiosidade: a origem é 'é raro (existir algo tão bom)'.",
    tags: ["saudacao", "sobrevivencia", "ctx:trabalho", "ctx:social", "ctx:restaurante", "ctx:compras", "ctx:cidade"],
  }),
  card({
    id: "card_030",
    tipo: "speaking",
    situacao_pt: "Seu chefe explicou uma tarefa na reunião. Diga que entendeu.",
    significado_cognitivo: "Ficou compreensível [para mim] + [polido] + [passado]",
    traducao: "Entendi.",
    kana: "わかりました",
    kanji: "分[わ]かりました",
    blocos: [b("wa.ka.ri", "LHH", "ficar compreensível", "verbo"), b("ma._shi.ta", "HLL", "[polido] + [passado]", "verbo")],
    notas:
      "-mashita = passado polido; a queda vem depois de 'ma'. Em japonês você não 'entende algo': a coisa 'se torna compreensível'.",
    tags: ["trabalho", "mashita", "ctx:trabalho"],
  }),
  card({
    id: "card_001",
    tipo: "speaking",
    situacao_pt: "Pergunte ao colega o que é aquilo na mesa.",
    significado_cognitivo: "Quanto a isto [tópico], o-que é [pergunta]?",
    traducao: "O que é isto?",
    kana: "これはなんですか",
    kanji: "これは何[なん]ですか",
    blocos: [
      b("ko.re", "LH", "isto", "topico"),
      b("wa", "H", "[Tópico]", "particula"),
      b("na.n", "HL", "o quê", "pergunta"),
      b("de._su", "LL", "é", "copula"),
      b("ka", "L", "[?]", "particula"),
    ],
    notas:
      "WA marca o assunto ('quanto a…'). KA no fim transforma qualquer frase em pergunta — a ordem das palavras não muda. 'nan' tem acento na 1ª mora: alto e cai.",
    tags: ["wa", "ka", "sobrevivencia", "ctx:trabalho", "ctx:compras"],
  }),
  card({
    id: "card_009",
    tipo: "speaking",
    situacao_pt: "Numa loja, aponte para o objeto na mão do vendedor e pergunte o preço.",
    significado_cognitivo: "Quanto a isso [perto de você] [tópico], quanto-dinheiro é [?]",
    traducao: "Quanto custa isso?",
    kana: "それはいくらですか",
    kanji: "それはいくらですか",
    blocos: [
      b("so.re", "LH", "isso (perto de você)", "topico"),
      b("wa", "H", "[Tópico]", "particula"),
      b("i.ku.ra", "HLL", "quanto (preço)", "pergunta"),
      b("de._su", "LL", "é", "copula"),
      b("ka", "L", "[?]", "particula"),
    ],
    notas: "kore = perto de mim · sore = perto de você · are = longe dos dois. Mesmo molde de 'kore wa nan desu ka'.",
    tags: ["wa", "ka", "compras", "ctx:compras"],
  }),
  card({
    id: "card_010",
    tipo: "speaking",
    situacao_pt: "Você está num restaurante e precisa achar o banheiro.",
    significado_cognitivo: "Quanto ao banheiro [tópico], onde é [?]",
    traducao: "Onde fica o banheiro?",
    kana: "トイレはどこですか",
    kanji: "トイレはどこですか",
    blocos: [
      b("to.i.re", "HLL", "banheiro", "topico"),
      b("wa", "L", "[Tópico]", "particula"),
      b("do.ko", "HL", "onde", "pergunta"),
      b("de._su", "LL", "é", "copula"),
      b("ka", "L", "[?]", "particula"),
    ],
    notas:
      "Atamadaka: 'to' alto e tudo cai depois — inclusive o 'wa'. Troque o tópico e reaproveite: 'eki wa doko desu ka' (onde é a estação?).",
    tags: ["wa", "ka", "sobrevivencia", "ctx:restaurante", "ctx:cidade"],
  }),
  card({
    id: "card_011",
    tipo: "speaking",
    situacao_pt: "Peça um copo d'água ao garçom.",
    significado_cognitivo: "Água [objeto], dê-me (por favor)",
    traducao: "Água, por favor.",
    kana: "みずをください",
    kanji: "水[みず]をください",
    blocos: [
      b("mi.zu", "LH", "água", "objeto"),
      b("o", "H", "[Objeto]", "particula"),
      b("ku.da.sa.i", "LHHL", "dê-me (por favor)", "verbo"),
    ],
    notas:
      "WO (pronunciado 'o') marca o objeto que sofre a ação. Molde de ouro: [coisa] o kudasai. O verbo sempre fecha a frase.",
    tags: ["wo", "sobrevivencia", "pedido", "ctx:restaurante"],
  }),
  card({
    id: "card_012",
    tipo: "speaking",
    situacao_pt: "Alguém pergunta se você entende japonês. Diga que entende um pouco.",
    significado_cognitivo: "Japonês [foco: sujeito] um pouco é-compreensível",
    traducao: "Eu entendo um pouco de japonês.",
    kana: "にほんごがすこしわかります",
    kanji: "日本語[にほんご]が少[すこ]しわかります",
    blocos: [
      b("ni.ho.n.go", "LHHH", "japonês (língua)", "sujeito"),
      b("ga", "H", "[Foco / sujeito]", "particula"),
      b("_su.ko.shi", "LHL", "um pouco", "adverbio"),
      b("wa.ka.ri.ma._su", "LHHHL", "é compreensível", "verbo"),
    ],
    notas:
      "wakaru usa GA, não WO: o japonês 'é compreensível' para você. GA aponta o elemento que ativa o verbo; WA só define o assunto.",
    tags: ["ga", "masu", "ctx:social", "ctx:trabalho"],
  }),
  card({
    id: "card_013",
    tipo: "speaking",
    situacao_pt: "Explicaram algo rápido demais e você não entendeu bem.",
    significado_cognitivo: "Bem, [isso] não é compreensível [para mim]",
    traducao: "Eu não entendo bem.",
    kana: "よくわかりません",
    kanji: "よく分[わ]かりません",
    blocos: [
      b("yo.ku", "HL", "bem", "adverbio"),
      b("wa.ka.ri.ma.se.n", "LHHHHL", "[polido] NÃO é compreensível", "verbo"),
    ],
    notas: "-masu → -masen: o negativo polido. A queda sai de 'ma' e passa para 'se'.",
    tags: ["masen", "sobrevivencia", "ctx:trabalho", "ctx:social", "ctx:cidade"],
  }),
  card({
    id: "card_008",
    tipo: "speaking",
    situacao_pt: "Perguntam sua profissão. Diga que é funcionário de empresa.",
    significado_cognitivo: "[Eu, subentendido] empresa-membro é",
    traducao: "Eu sou funcionário de empresa.",
    kana: "かいしゃいんです",
    kanji: "会社員[かいしゃいん]です",
    blocos: [b("ka.i.sha.i.n", "LHHLL", "empresa-membro (funcionário)", "substantivo"), b("de._su", "LL", "é", "copula")],
    notas:
      "O japonês omite o tópico quando ele é óbvio pelo contexto. Dizer 'watashi wa' o tempo todo soa repetitivo.",
    tags: ["apresentacao", "trabalho", "ctx:trabalho"],
  }),
  card({
    id: "card_007",
    tipo: "speaking",
    situacao_pt: "Apresente-se dizendo que você é brasileiro(a).",
    significado_cognitivo: "Quanto a eu [tópico], Brasil-pessoa é",
    traducao: "Eu sou brasileiro.",
    kana: "わたしはブラジルじんです",
    kanji: "私[わたし]はブラジル人[じん]です",
    blocos: [
      b("wa.ta.shi", "LHH", "eu", "topico"),
      b("wa", "H", "[Tópico]", "particula"),
      b("bu.ra.ji.ru.ji.n", "LHHHLL", "Brasil-pessoa (brasileiro)", "substantivo"),
      b("de._su", "LL", "é", "copula"),
    ],
    notas: "País + jin = pessoa daquele país. A queda fica na mora antes de 'jin'. 'desu' depois de queda fica todo baixo.",
    tags: ["wa", "apresentacao", "ctx:social", "ctx:trabalho"],
  }),
  card({
    id: "card_019",
    tipo: "listening",
    situacao_pt: "Um colega japonês te pergunta isto num evento. Entenda e responda.",
    significado_cognitivo: "Quanto ao trabalho [tópico], o-que é [?] → Qual é o seu trabalho?",
    traducao: "Qual é o seu trabalho?",
    kana: "しごとはなんですか",
    kanji: "仕事[しごと]は何[なん]ですか",
    blocos: [
      b("shi.go.to", "LHH", "trabalho", "topico"),
      b("wa", "H", "[Tópico]", "particula"),
      b("na.n", "HL", "o quê", "pergunta"),
      b("de._su", "LL", "é", "copula"),
      b("ka", "L", "[?]", "particula"),
    ],
    notas: "Resposta natural: 'kaishain desu' ou '[área] no shigoto desu'.",
    tags: ["wa", "ka", "trabalho", "listening", "ctx:trabalho"],
  }),
  card({
    id: "card_020",
    tipo: "speaking",
    situacao_pt: "Explique que você trabalha de casa (home office).",
    significado_cognitivo: "Casa [local da ação], trabalho [objeto], faço",
    traducao: "Eu trabalho em casa.",
    kana: "うちでしごとをします",
    kanji: "家[うち]で仕事[しごと]をします",
    blocos: [
      b("u.chi", "LH", "casa", "lugar"),
      b("de", "H", "[Local onde a ação acontece]", "particula"),
      b("shi.go.to", "LHH", "trabalho", "objeto"),
      b("o", "H", "[Objeto]", "particula"),
      b("shi.ma._su", "LHL", "faço", "verbo"),
    ],
    notas:
      "DE = palco da ação (onde algo é feito). NI = ponto de chegada/existência. Ordem: Local → Objeto → Verbo.",
    tags: ["de", "wo", "masu", "trabalho", "ctx:trabalho"],
  }),
  card({
    id: "card_029",
    tipo: "speaking",
    situacao_pt: "Você está numa reunião e quer dizer que vai verificar os dados agora.",
    significado_cognitivo: "Agora, dados [objeto], verificação faço",
    traducao: "Vou verificar os dados agora.",
    kana: "いまデータをかくにんします",
    kanji: "今[いま]データを確認[かくにん]します",
    blocos: [
      b("i.ma", "HL", "agora", "tempo"),
      b("de.e.ta", "HLL", "dados", "objeto"),
      b("o", "L", "[Objeto]", "particula"),
      b("ka.ku.ni.n", "LHHH", "verificação", "substantivo"),
      b("shi.ma._su", "HHL", "faço", "verbo"),
    ],
    notas:
      "Substantivo de ação + suru = verbo (kakunin suru = verificar). Tempo vem primeiro, verbo por último: Tempo → Objeto → Verbo. Presente japonês também é futuro.",
    tags: ["wo", "masu", "trabalho", "ctx:trabalho"],
  }),
  card({
    id: "card_021",
    tipo: "speaking",
    situacao_pt: "Um colega pergunta quando é a reunião. Diga que começa às 3 horas.",
    significado_cognitivo: "Quanto à reunião [tópico], 3-horas a-partir-de é",
    traducao: "A reunião começa às três.",
    kana: "かいぎはさんじからです",
    kanji: "会議[かいぎ]は三時[さんじ]からです",
    blocos: [
      b("ka.i.gi", "HLL", "reunião", "topico"),
      b("wa", "L", "[Tópico]", "particula"),
      b("sa.n.ji", "HLL", "3 horas", "tempo"),
      b("ka.ra", "LL", "a partir de", "particula"),
      b("de._su", "LL", "é", "copula"),
    ],
    notas: "KARA = 'a partir de' (MADE = 'até'). Número + ji = horas: ichiji, niji, sanji…",
    tags: ["wa", "trabalho", "horario", "ctx:trabalho"],
  }),
  card({
    id: "card_022",
    tipo: "listening",
    situacao_pt: "Um amigo japonês te pergunta isto ao combinar um encontro. Entenda.",
    significado_cognitivo: "Que-hora [ponto no tempo] encontremo-nos [?] → A que horas nos encontramos?",
    traducao: "A que horas nos encontramos?",
    kana: "なんじにあいましょうか",
    kanji: "何時[なんじ]に会[あ]いましょうか",
    blocos: [
      b("na.n.ji", "HLL", "que horas", "pergunta"),
      b("ni", "L", "[Ponto exato no tempo]", "particula"),
      b("a.i.ma.sho.o", "LHHHL", "encontrar + vamos (convite)", "verbo"),
      b("ka", "L", "[?]", "particula"),
    ],
    notas: "-mashou = 'vamos…'. Com KA vira sugestão aberta: 'que tal…?'. NI marca horário exato.",
    tags: ["ni", "ka", "horario", "listening", "ctx:social", "ctx:trabalho"],
  }),
  card({
    id: "card_023",
    tipo: "speaking",
    situacao_pt: "Seu colega sugere almoçar juntos. Concorde com entusiasmo.",
    significado_cognitivo: "Bom é, né [busca concordância]",
    traducao: "Que bom!",
    kana: "いいですね",
    kanji: "いいですね",
    blocos: [b("i.i", "HL", "bom", "adjetivo"), b("de.su", "LL", "é", "copula"), b("ne", "L", "[né? — concordância]", "particula")],
    notas: "NE no fim pede/mostra concordância (como 'né?'). Atamadaka: 'i' alto, e tudo cai até o fim.",
    tags: ["ne", "conversa", "ctx:social", "ctx:restaurante"],
  }),
  card({
    id: "card_014",
    tipo: "speaking",
    situacao_pt: "Você está perdido e quer dizer ao policial que quer ir à estação.",
    significado_cognitivo: "Estação [destino →] ir-quero é",
    traducao: "Eu quero ir à estação.",
    kana: "えきにいきたいです",
    kanji: "駅[えき]に行[い]きたいです",
    blocos: [
      b("e.ki", "HL", "estação", "lugar"),
      b("ni", "L", "[Destino →]", "particula"),
      b("i._ki.ta.i", "LHHL", "ir + quero", "verbo"),
      b("de._su", "LL", "é (polidez)", "copula"),
    ],
    notas: "Raiz -masu sem 'masu' + tai = quero. ik(i)masu → ikitai. NI marca o destino do movimento.",
    tags: ["ni", "tai", "sobrevivencia", "ctx:cidade"],
  }),
  card({
    id: "card_015",
    tipo: "speaking",
    situacao_pt: "Conte a um colega que amanhã você vai a Tóquio.",
    significado_cognitivo: "Amanhã, Tóquio [destino →] vou",
    traducao: "Amanhã eu vou a Tóquio.",
    kana: "あしたとうきょうにいきます",
    kanji: "明日[あした]東京[とうきょう]に行[い]きます",
    blocos: [
      b("a._shi.ta", "LHH", "amanhã", "tempo"),
      b("to.o.kyo.o", "LHHH", "Tóquio", "lugar"),
      b("ni", "H", "[Destino →]", "particula"),
      b("i.ki.ma._su", "LHHL", "vou", "verbo"),
    ],
    notas: "Tempo → Lugar → Verbo. 'Tou-kyou' tem 4 moras (vogais longas contam em dobro).",
    tags: ["ni", "masu", "ctx:cidade", "ctx:social"],
  }),
  card({
    id: "card_016",
    tipo: "speaking",
    situacao_pt: "Comente que você toma café todos os dias.",
    significado_cognitivo: "Todo-dia, café [objeto], bebo",
    traducao: "Eu tomo café todo dia.",
    kana: "まいにちコーヒーをのみます",
    kanji: "毎日[まいにち]コーヒーを飲[の]みます",
    blocos: [
      b("ma.i.ni.chi", "HLLL", "todo dia", "tempo"),
      b("ko.o.hi.i", "LHHL", "café", "objeto"),
      b("o", "L", "[Objeto]", "particula"),
      b("no.mi.ma._su", "LHHL", "bebo", "verbo"),
    ],
    notas: "-masu = hábito ou futuro (não existe 'presente contínuo' aqui). Palavras de frequência não levam partícula.",
    tags: ["wo", "masu", "rotina", "ctx:social", "ctx:restaurante"],
  }),
  card({
    id: "card_017",
    tipo: "speaking",
    situacao_pt: "Explique que hoje você não tomou café da manhã.",
    significado_cognitivo: "Manhã-refeição [objeto], comer-não-[passado]",
    traducao: "Eu não tomei café da manhã.",
    kana: "あさごはんをたべませんでした",
    kanji: "朝[あさ]ご飯[はん]を食[た]べませんでした",
    blocos: [
      b("a.sa.go.ha.n", "LHHLL", "café da manhã (manhã-refeição)", "objeto"),
      b("o", "L", "[Objeto]", "particula"),
      b("ta.be.ma.se.n", "LHHHL", "comer + [polido] NÃO", "verbo"),
      b("de._shi.ta", "LLL", "[passado]", "verbo"),
    ],
    notas: "Passado negativo polido = -masen + deshita. Os 4 tempos: tabemasu / tabemashita / tabemasen / tabemasen deshita.",
    tags: ["wo", "masen", "mashita", "rotina", "ctx:social"],
  }),
  card({
    id: "card_018",
    tipo: "speaking",
    situacao_pt: "Seu amigo pergunta o que você quer comer. Diga que quer sushi.",
    significado_cognitivo: "Sushi [foco do desejo], comer-quero é",
    traducao: "Eu quero comer sushi.",
    kana: "すしがたべたいです",
    kanji: "寿司[すし]が食[た]べたいです",
    blocos: [
      b("_su.shi", "LH", "sushi", "objeto"),
      b("ga", "L", "[Foco do desejo]", "particula"),
      b("ta.be.ta.i", "LHLL", "comer + quero", "verbo"),
      b("de._su", "LL", "é (polidez)", "copula"),
    ],
    notas: "Com -tai, o objeto desejado pode levar GA (ênfase no desejo) ou WO. -tai se comporta como adjetivo: + desu para polidez.",
    tags: ["ga", "tai", "comida", "ctx:restaurante", "ctx:social"],
  }),
  card({
    id: "card_024",
    tipo: "speaking",
    situacao_pt: "Um colega te chama para conversar. Diga que hoje você está ocupado.",
    significado_cognitivo: "Quanto a hoje [tópico / contraste], ocupado é",
    traducao: "Hoje eu estou ocupado.",
    kana: "きょうはいそがしいです",
    kanji: "今日[きょう]は忙[いそが]しいです",
    blocos: [
      b("kyo.o", "HL", "hoje", "topico"),
      b("wa", "L", "[Tópico / contraste]", "particula"),
      b("i.so.ga.shi.i", "LHHHL", "ocupado", "adjetivo"),
      b("de._su", "LL", "é (polidez)", "copula"),
    ],
    notas: "WA com palavra de tempo cria contraste implícito: 'hoje (diferente de outros dias)…'. Adjetivo -i + desu = polido.",
    tags: ["wa", "trabalho", "ctx:trabalho"],
  }),
  card({
    id: "card_025",
    tipo: "speaking",
    situacao_pt: "Alguém te chama, mas você precisa de um momento. Peça para esperar.",
    significado_cognitivo: "Um pouco, esperando, dê-me [esse favor]",
    traducao: "Espere um pouco, por favor.",
    kana: "ちょっとまってください",
    kanji: "ちょっと待[ま]ってください",
    blocos: [
      b("cho.t.to", "HLL", "um pouco", "adverbio"),
      b("ma.t.te", "HLL", "esperando (forma -te)", "verbo"),
      b("ku.da.sa.i", "LHHL", "dê-me (o favor)", "verbo"),
    ],
    notas: "Forma -te + kudasai = pedido educado. O 't' isolado é uma mora de silêncio (pausa curta de uma batida).",
    tags: ["pedido", "sobrevivencia", "ctx:trabalho", "ctx:compras"],
  }),
  card({
    id: "card_026",
    tipo: "listening",
    situacao_pt: "Um japonês te pergunta isto sobre seus planos. Entenda.",
    significado_cognitivo: "Japão [local da ação], o-quê [objeto] fazer-quero é [?]",
    traducao: "O que você quer fazer no Japão?",
    kana: "にほんでなにをしたいですか",
    kanji: "日本[にほん]で何[なに]をしたいですか",
    blocos: [
      b("ni.ho.n", "LHL", "Japão", "lugar"),
      b("de", "L", "[Local da ação]", "particula"),
      b("na.ni", "HL", "o quê", "pergunta"),
      b("o", "L", "[Objeto]", "particula"),
      b("_shi.ta.i", "LHL", "fazer + quero", "verbo"),
      b("de._su", "LL", "é", "copula"),
      b("ka", "L", "[?]", "particula"),
    ],
    notas: "'nani' vira 'nan' antes de d/t/n (nan desu ka) e fica 'nani' antes de o/ga.",
    tags: ["de", "wo", "tai", "ka", "listening", "ctx:social"],
  }),
  card({
    id: "card_027",
    tipo: "speaking",
    situacao_pt: "Oferecem café ou chá. Diga que você gosta de chá.",
    significado_cognitivo: "Chá [foco: o que agrada] gostável é",
    traducao: "Eu gosto de chá.",
    kana: "おちゃがすきです",
    kanji: "お茶[ちゃ]が好[す]きです",
    blocos: [
      b("o.cha", "LH", "chá (o- = cortesia)", "sujeito"),
      b("ga", "H", "[Foco: o que agrada]", "particula"),
      b("_su.ki", "LH", "gostável / querido", "adjetivo"),
      b("de._su", "LL", "é", "copula"),
    ],
    notas: "suki é um adjetivo: a coisa 'é gostável' — por isso GA, não WO. 'suki' é odaka: o desu depois fica baixo.",
    tags: ["ga", "comida", "ctx:restaurante", "ctx:compras"],
  }),
  card({
    id: "card_028",
    tipo: "listening",
    situacao_pt: "Na segunda-feira, um colega te pergunta isto. Entenda.",
    significado_cognitivo: "Quanto a ontem [tópico], o-quê [objeto] fiz [?] → O que você fez ontem?",
    traducao: "O que você fez ontem?",
    kana: "きのうはなにをしましたか",
    kanji: "昨日[きのう]は何[なに]をしましたか",
    blocos: [
      b("ki.no.o", "LHL", "ontem", "topico"),
      b("wa", "L", "[Tópico]", "particula"),
      b("na.ni", "HL", "o quê", "pergunta"),
      b("o", "L", "[Objeto]", "particula"),
      b("shi.ma._shi.ta", "LHLL", "fiz", "verbo"),
      b("ka", "L", "[?]", "particula"),
    ],
    notas: "Resposta-molde: '[lugar] de [coisa] o shimashita'.",
    tags: ["wa", "wo", "mashita", "ka", "listening", "rotina", "ctx:social", "ctx:trabalho"],
  }),
];

export const seedCards = [...cardsBase, ...cardsTrabalho, ...cardsLugares, ...cardsNumeros, ...cardsPedidos, ...cardsAgora, ...cardsAdjetivos, ...cardsFimDeSemana, ...cardsFamilia, ...cardsSaude, ...cardsHobbies, ...cardsRegras, ...cardsCasual, ...cardsOpiniao, ...cardsMotivos, ...cardsExperiencias, ...cardsComparar, ...cardsPlanos, ...cardsViagem, ...cardsConsegue, ...cardsCondicional, ...cardsDarReceber, ...cardsDescrever, ...cardsServicos, ...cardsProblemas, ...cardsKeigo, ...cardsTelefone, ...cardsAparencias, ...cardsPassiva, ...cardsCausativa, ...cardsConselhos, ...cardsNoticias, ...cardsHistoria, ...cardsNegociar, ...cardsEntrevista, ...cardsVidaJapao];
