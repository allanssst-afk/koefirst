/**
 * Textos da estação de leitura de cada unidade (Fase 2 em diante): frases do baralho em sequência, que já trazem mapa de som,
 * kana, kanji e entonação conferida, mais duas perguntas de compreensão. A resposta tem de sair do texto, não da memória.
 */
export interface LeituraUnidade {
  titulo: string;
  /** ids dos cards, na ordem do texto */
  frases: string[];
  perguntas: { pergunta: string; certa: string; erradas: string[] }[];
}

export const LEITURAS: Record<string, LeituraUnidade> = {
  u15: {
    titulo: "Minha família",
    frases: ["card_116", "card_117", "card_119", "card_121", "card_120"],
    perguntas: [
      { pergunta: "Quantas pessoas há na família?", certa: "Quatro", erradas: ["Três", "Cinco", "Seis"] },
      { pergunta: "Quem usa óculos?", certa: "O irmão mais velho", erradas: ["O pai", "A mãe", "A irmã mais nova"] },
    ],
  },
  u16: {
    titulo: "Na farmácia",
    frases: ["card_129", "card_128", "card_131", "card_135", "card_136"],
    perguntas: [
      { pergunta: "Desde quando a garganta dói?", certa: "Desde ontem", erradas: ["Desde hoje de manhã", "Há uma semana", "Desde o mês passado"] },
      { pergunta: "Quantas vezes por dia é o remédio?", certa: "Três", erradas: ["Uma", "Duas", "Quatro"] },
    ],
  },
  u17: {
    titulo: "Meus hobbies",
    frases: ["card_140", "card_141", "card_142", "card_145", "card_147"],
    perguntas: [
      { pergunta: "O que a pessoa não sabe fazer?", certa: "Nadar", erradas: ["Cozinhar", "Tocar piano", "Subir montanhas"] },
      { pergunta: "O que ela costuma fazer no fim de semana?", certa: "Subir montanhas", erradas: ["Ver filmes", "Ir à praia", "Trabalhar"] },
    ],
  },
  u18: {
    titulo: "Aviso do prédio",
    frases: ["card_158", "card_159", "card_155", "card_162"],
    perguntas: [
      { pergunta: "Quando o lixo deve ser colocado para fora?", certa: "Na segunda-feira", erradas: ["Na sexta-feira", "No domingo", "Todos os dias"] },
      { pergunta: "O que não pode ser feito ali?", certa: "Deixar a bicicleta", erradas: ["Tirar os sapatos", "Falar ao telefone", "Tirar fotos"] },
    ],
  },
  u19: {
    titulo: "Conversa de amigos",
    frases: ["card_165", "card_166", "card_167", "card_168", "card_173", "card_174"],
    perguntas: [
      { pergunta: "O que a pessoa fez ontem?", certa: "Viu um filme", erradas: ["Foi trabalhar", "Encontrou a família", "Ficou doente"] },
      { pergunta: "Por que amanhã não dá?", certa: "Tem trabalho", erradas: ["Vai ao cinema", "Está doente", "Tem prova"] },
    ],
  },
  u20: {
    titulo: "O que eu acho de amanhã",
    frases: ["card_182", "card_179", "card_178", "card_185"],
    perguntas: [
      { pergunta: "O que o diretor disse?", certa: "Que vai faltar amanhã", erradas: ["Que vai viajar hoje", "Que a reunião acabou", "Que o Tanaka vem"] },
      { pergunta: "Como a pessoa acha que estará o tempo?", certa: "Vai chover", erradas: ["Vai fazer sol", "Vai nevar", "Vai ventar"] },
    ],
  },
  u21: {
    titulo: "Um dia ruim",
    frases: ["card_190", "card_193", "card_188", "card_194"],
    perguntas: [
      { pergunta: "Por que a pessoa vai de táxi?", certa: "Porque não tem tempo", erradas: ["Porque está chovendo", "Porque é mais barato", "Porque o carro quebrou"] },
      { pergunta: "O que a pessoa vai fazer no fim?", certa: "Dormir", erradas: ["Ir ao hospital", "Tomar o trem", "Comer alguma coisa"] },
    ],
  },
  u22: {
    titulo: "O que já fiz",
    frases: ["card_205", "card_202", "card_206", "card_211", "card_209"],
    perguntas: [
      { pergunta: "Onde a pessoa já morou?", certa: "Em Tóquio", erradas: ["Em Kyoto", "Em Osaka", "No Monte Fuji"] },
      { pergunta: "O que a pessoa já subiu?", certa: "O Monte Fuji", erradas: ["Uma torre em Tóquio", "Um templo", "Uma montanha em Osaka"] },
    ],
  },
  u23: {
    titulo: "Comparando",
    frases: ["card_216", "card_227", "card_217", "card_218", "card_220"],
    perguntas: [
      { pergunta: "Qual cidade é maior?", certa: "Tóquio", erradas: ["Osaka", "As duas são iguais", "Kyoto"] },
      { pergunta: "O que a pessoa mais gosta de comer?", certa: "Sushi", erradas: ["Carne", "Ramen", "Tempurá"] },
    ],
  },
  u24: {
    titulo: "Planos para o ano que vem",
    frases: ["card_231", "card_232", "card_233", "card_240", "card_242"],
    perguntas: [
      { pergunta: "Quando a pessoa pensa em ir ao Japão?", certa: "No ano que vem", erradas: ["Neste mês", "Na semana que vem", "Daqui a cinco anos"] },
      { pergunta: "O que ela pretende fazer com o dinheiro?", certa: "Juntar", erradas: ["Gastar em roupas", "Emprestar", "Mandar para a família"] },
    ],
  },
  u25: {
    titulo: "Minha viagem",
    frases: ["card_245", "card_258", "card_255", "card_257"],
    perguntas: [
      { pergunta: "Onde a pessoa tirou fotos?", certa: "Em Kyoto", erradas: ["Em Tóquio", "Em Osaka", "No Monte Fuji"] },
      { pergunta: "Que problema aconteceu?", certa: "A pessoa se perdeu", erradas: ["Perdeu o passaporte", "Perdeu o trem", "Ficou doente"] },
    ],
  },
  u27: {
    titulo: "O que eu consigo",
    frases: ["card_260", "card_262", "card_263", "card_265", "card_267"],
    perguntas: [
      { pergunta: "O que a pessoa consegue ler?", certa: "Hiragana", erradas: ["Kanji", "Jornal", "Nada"] },
      { pergunta: "O que ela não consegue comer?", certa: "Comida apimentada", erradas: ["Peixe cru", "Carne", "Doces"] },
    ],
  },
  u28: {
    titulo: "Se der certo",
    frases: ["card_279", "card_280", "card_282", "card_281"],
    perguntas: [
      { pergunta: "O que acontece se chover?", certa: "A pessoa não vai", erradas: ["A pessoa vai de carro", "A pessoa liga", "A pessoa vai ao Japão"] },
      { pergunta: "O que ela compra se tiver dinheiro?", certa: "Um carro", erradas: ["Uma casa", "Uma passagem", "Um computador"] },
    ],
  },
  u29: {
    titulo: "Quem fez o quê",
    frases: ["card_299", "card_302", "card_309", "card_310"],
    perguntas: [
      { pergunta: "Quem ajudou a pessoa?", certa: "O Tanaka", erradas: ["A mãe", "Um amigo", "O gerente"] },
      { pergunta: "Quem cozinhou?", certa: "A mãe", erradas: ["O Tanaka", "A própria pessoa", "Um amigo"] },
    ],
  },
  u30: {
    titulo: "Minha cidade",
    frases: ["card_324", "card_332", "card_325", "card_323", "card_331"],
    perguntas: [
      { pergunta: "Como é a cidade?", certa: "Tranquila e bonita", erradas: ["Grande e barulhenta", "Cara e cheia", "Nova e moderna"] },
      { pergunta: "Como é o café aonde a pessoa vai?", certa: "Bem barato", erradas: ["Muito caro", "Longe de casa", "Sempre fechado"] },
    ],
  },
  u31: {
    titulo: "Na prefeitura",
    frases: ["card_352", "card_351", "card_353", "card_354", "card_357"],
    perguntas: [
      { pergunta: "Por que a pessoa foi à prefeitura?", certa: "Porque se mudou", erradas: ["Para abrir uma conta", "Para enviar dinheiro", "Porque perdeu o cartão"] },
      { pergunta: "O que a pessoa não tem?", certa: "Carimbo", erradas: ["Cartão de residente", "Formulário", "Dinheiro"] },
    ],
  },
  u32: {
    titulo: "Um dia de problemas",
    frases: ["card_364", "card_359", "card_360", "card_367", "card_365"],
    perguntas: [
      { pergunta: "O que a pessoa esqueceu no trem?", certa: "O guarda-chuva", erradas: ["A carteira", "A chave", "O computador"] },
      { pergunta: "Por que ela não consegue entrar no quarto?", certa: "Está sem a chave", erradas: ["A porta quebrou", "Perdeu a hora", "O computador não liga"] },
    ],
  },
  u33: {
    titulo: "Visita ao cliente",
    frases: ["card_387", "card_386", "card_393", "card_389", "card_392"],
    perguntas: [
      { pergunta: "De onde a pessoa veio?", certa: "Do Brasil", erradas: ["De Tóquio", "De Osaka", "Da China"] },
      { pergunta: "O que ela vai enviar?", certa: "Os documentos", erradas: ["Um presente", "A bagagem", "Uma carta do gerente"] },
    ],
  },
  u34: {
    titulo: "Ao telefone",
    frases: ["card_399", "card_418", "card_406", "card_411"],
    perguntas: [
      { pergunta: "Por que o Tanaka não atende?", certa: "Está de folga hoje", erradas: ["Está em reunião", "Está ao telefone", "Saiu para almoçar"] },
      { pergunta: "O que o Silva vai fazer?", certa: "Ligar mais tarde", erradas: ["Mandar um e-mail", "Ir até lá", "Esperar na linha"] },
    ],
  },
  u35: {
    titulo: "Parece que…",
    frases: ["card_420", "card_430", "card_428", "card_432"],
    perguntas: [
      { pergunta: "Como parece que vai ficar o tempo?", certa: "Vai chover", erradas: ["Vai esquentar", "Vai nevar", "Vai abrir o sol"] },
      { pergunta: "Quem vem no mês que vem?", certa: "Um gerente novo", erradas: ["O Tanaka", "Um cliente", "Um amigo"] },
    ],
  },
  u36: {
    titulo: "Uma semana difícil",
    frases: ["card_440", "card_441", "card_439", "card_454"],
    perguntas: [
      { pergunta: "Onde pisaram no pé da pessoa?", certa: "No trem", erradas: ["Na estação", "Na rua", "Na empresa"] },
      { pergunta: "O que ela fez depois do roubo?", certa: "Avisou a polícia", erradas: ["Voltou para casa", "Telefonou ao banco", "Procurou a carteira"] },
    ],
  },
  u37: {
    titulo: "Hábitos da casa",
    frases: ["card_461", "card_478", "card_476", "card_477"],
    perguntas: [
      { pergunta: "O que o filho aprende?", certa: "Piano", erradas: ["Inglês", "Natação", "Kanji"] },
      { pergunta: "O que a pessoa procura não tomar?", certa: "Café", erradas: ["Álcool", "Chá", "Remédio"] },
    ],
  },
  u38: {
    titulo: "Conselhos",
    frases: ["card_484", "card_486", "card_488", "card_481"],
    perguntas: [
      { pergunta: "Aonde é melhor ir?", certa: "Ao hospital", erradas: ["À farmácia", "Para casa", "À empresa"] },
      { pergunta: "O que é melhor evitar?", certa: "Beber álcool", erradas: ["Beber água", "Dormir cedo", "Andar a pé"] },
    ],
  },
  u39: {
    titulo: "Notícias do dia",
    frases: ["card_500", "card_501", "card_503", "card_504"],
    perguntas: [
      { pergunta: "O que diz a previsão do tempo?", certa: "Amanhã vai nevar", erradas: ["Amanhã vai chover", "Hoje vai fazer sol", "Vem um tufão"] },
      { pergunta: "O que o noticiário informou?", certa: "O trem parou", erradas: ["O gerente saiu", "A loja fechou", "Houve um terremoto"] },
    ],
  },
  u40: {
    titulo: "O trem que não veio",
    frases: ["card_538", "card_534", "card_535", "card_536"],
    perguntas: [
      { pergunta: "O que deu errado?", certa: "O trem não veio", erradas: ["A estação fechou", "A pessoa perdeu a carteira", "Começou a chover"] },
      { pergunta: "Como a pessoa voltou?", certa: "De táxi", erradas: ["A pé", "De trem", "De ônibus"] },
    ],
  },
  u41: {
    titulo: "Não é justo",
    frases: ["card_546", "card_545", "card_543", "card_547"],
    perguntas: [
      { pergunta: "Que dia a pessoa está trabalhando?", certa: "Domingo", erradas: ["Segunda", "Sábado", "Feriado"] },
      { pergunta: "O que aconteceu, mesmo estudando muito?", certa: "Reprovou na prova", erradas: ["Passou na prova", "Perdeu a prova", "Mudou de escola"] },
    ],
  },
  u42: {
    titulo: "Quem eu sou",
    frases: ["card_561", "card_562", "card_563", "card_568", "card_569"],
    perguntas: [
      { pergunta: "Com o que a pessoa trabalhou?", certa: "Com vendas", erradas: ["Com ensino", "Com informática", "Com saúde"] },
      { pergunta: "Quando ela pode começar?", certa: "No mês que vem", erradas: ["Amanhã", "Na semana que vem", "No ano que vem"] },
    ],
  },
  u43: {
    titulo: "A semana da mudança",
    frases: ["card_587", "card_588", "card_589", "card_585"],
    perguntas: [
      { pergunta: "Por que a pessoa procurou o vizinho?", certa: "Para se apresentar", erradas: ["Para reclamar", "Para pedir ajuda", "Para pagar o aluguel"] },
      { pergunta: "Que problema há no apartamento?", certa: "Não sai água quente", erradas: ["O vizinho faz barulho", "A porta não abre", "O aluguel subiu"] },
    ],
  },
};
