/**
 * Trilha de aprendizagem: unidades por situação de vida, cada uma com lições curtas.
 * As lições reaproveitam o conteúdo existente: frases do baralho (seed), cenas do Ping-Pong e missões da Arena.
 */
import type { SeedCard } from "@/db/seed-data/helpers";
import { seedCards } from "@/db/seed-data/cards";
import { GRAMATICA_N5, LEITURA_N5, VOCABULARIO_N5 } from "./simulado-n5";
import { cenasDoContexto, FORMAS, montarDialogo, verboPorDict, type DialogoDrill, type FalaDrill, type Forma } from "./drills";
import type { Categoria } from "./roleplay";
import type { Mora } from "./types";

export interface Unidade {
  id: string;
  numero: number;
  titulo: string;
  descricao: string;
  /** cor do banner e dos nós da unidade */
  cor: string;
  /** contexto do Ping-Pong; "todos" mistura as situações de todos os contextos (revisão geral) */
  contexto: Categoria | "todos" | null;
  cards: string[];
  missoes: string[];
  /** transformações do Ping-Pong que esta unidade ensina; dela em diante entram no sorteio */
  formasNovas?: Forma[];
  /**
   * Unidade de revisão geral (fim de fase): sem frases novas; uma lição de revisão por tema, com as frases das
   * unidades listadas, e no fim um simulado obrigatório com todas elas.
   */
  revisaoGeral?: { titulo: string; unidades: string[] }[];
  /** o simulado da revisão ganha as partes em kana (vocabulário, gramática e leitura) */
  simuladoCompleto?: boolean;
}

export type TipoLicao = "tutorial" | "frases" | "pingpong" | "dialogo" | "revisao" | "simulado";

export interface Licao {
  /** "u2:l3" — também é a chave do progresso salvo */
  id: string;
  unidade: Unidade;
  tipo: TipoLicao;
  titulo: string;
  cards: string[];
  missao?: string;
  /** simulado com as partes em kana (ver `simuladoCompleto`) */
  completo?: boolean;
  /** não trava a trilha: abre quando o resto da unidade termina (simulado) */
  opcional?: boolean;
}

export const UNIDADES: Unidade[] = [
  {
    id: "u0",
    numero: 0,
    titulo: "Comece aqui",
    descricao: "Como ler o mapa de som",
    cor: "#00a7db",
    contexto: null,
    cards: [],
    missoes: [],
  },
  {
    id: "u1",
    numero: 1,
    titulo: "Cumprimente e se apresente",
    descricao: "Olá, prazer, obrigado e quem você é",
    cor: "#f39700",
    contexto: "social",
    cards: ["card_002", "card_003", "card_006", "card_007", "card_008", "card_004", "card_005", "card_030"],
    missoes: ["rp_01_apresentacao", "rp_soc_vizinho", "rp_soc_festa"],
  },
  {
    id: "u2",
    numero: 2,
    titulo: "Peça comida e bebida",
    descricao: "Restaurante, café e o que você gosta",
    cor: "#e85298",
    contexto: "restaurante",
    cards: ["card_011", "card_027", "card_018", "card_023", "card_025"],
    missoes: ["rp_rest_sushi", "rp_02_pedido_horario"],
  },
  {
    id: "u3",
    numero: 3,
    titulo: "Compras e perguntas",
    descricao: "O que é isto, quanto custa, onde fica",
    cor: "#00ada9",
    contexto: "compras",
    cards: ["card_001", "card_009", "card_010", "card_013", "card_012"],
    missoes: ["rp_comp_loja", "rp_comp_konbini", "rp_comp_farmacia"],
  },
  {
    id: "u4",
    numero: 4,
    titulo: "Pela cidade",
    descricao: "Estação, planos e encontros",
    cor: "#9b7cb6",
    contexto: "cidade",
    cards: ["card_014", "card_015", "card_022", "card_026"],
    missoes: ["rp_cid_estacao", "rp_cid_passagem", "rp_cid_hotel", "rp_soc_programa"],
  },
  {
    id: "u5",
    numero: 5,
    titulo: "No trabalho",
    descricao: "Profissão, reuniões e tarefas",
    cor: "#2f7fd6",
    contexto: "trabalho",
    cards: ["card_019", "card_020", "card_029", "card_021", "card_024"],
    missoes: ["rp_trab_reuniao", "rp_trab_almoco"],
  },
  {
    id: "u6",
    numero: 6,
    titulo: "Sua rotina",
    descricao: "Ontem, hoje e todo dia",
    cor: "#6cbb5a",
    contexto: "social",
    cards: ["card_028", "card_017", "card_016"],
    missoes: ["rp_03_rotina"],
  },
  {
    id: "u7",
    numero: 7,
    titulo: "Dia a dia no escritório",
    descricao: "Prazos, atrasos, clientes e fim do expediente",
    cor: "#b5a46a",
    contexto: "trabalho",
    cards: [
      "card_031", "card_041", "card_033",
      "card_032", "card_039", "card_037",
      "card_042", "card_034", "card_035",
      "card_038", "card_036", "card_040",
    ],
    missoes: ["rp_trab_atraso", "rp_trab_prazo", "rp_trab_cliente", "rp_trab_saida"],
  },
  {
    id: "u8",
    numero: 8,
    titulo: "Onde fica, o que tem",
    descricao: "Lugares, posição, direções e quem está onde",
    cor: "#b8754a",
    contexto: "cidade",
    cards: [
      "card_043", "card_044", "card_045",
      "card_046", "card_047", "card_048",
      "card_049", "card_050", "card_051",
      "card_052", "card_053", "card_054",
    ],
    missoes: ["rp_lug_konbini", "rp_lug_recepcao", "rp_lug_chave"],
  },
  {
    id: "u9",
    numero: 9,
    titulo: "Números, horas e preços",
    descricao: "Que horas são, quanto custa, quantos e quando",
    cor: "#5b8fd9",
    contexto: "compras",
    cards: [
      "card_055", "card_056", "card_057",
      "card_058", "card_059", "card_060",
      "card_061", "card_062", "card_063",
      "card_064", "card_065", "card_066",
    ],
    missoes: ["rp_num_cafe", "rp_num_correio", "rp_num_horario"],
  },
  {
    id: "u10",
    numero: 10,
    titulo: "Peça e oriente",
    descricao: "Pedir, pedir licença, proibir e explicar o caminho",
    cor: "#d4a017",
    contexto: "trabalho",
    cards: [
      "card_067", "card_068", "card_069",
      "card_070", "card_071", "card_072",
      "card_073", "card_074", "card_075",
      "card_076", "card_077", "card_078",
    ],
    missoes: ["rp_ped_templo", "rp_ped_cadastro", "rp_ped_escritorio"],
    formasNovas: ["te_kudasai"],
  },
  {
    id: "u11",
    numero: 11,
    titulo: "Agora e sempre",
    descricao: "O que está fazendo, onde mora, o que sabe",
    cor: "#7a9e7e",
    contexto: "social",
    cards: [
      "card_079", "card_080", "card_081",
      "card_082", "card_083", "card_084",
      "card_085", "card_086", "card_087",
      "card_088", "card_089", "card_090",
    ],
    missoes: ["rp_agora_ligacao", "rp_agora_colega", "rp_agora_vizinho"],
    formasNovas: ["te_imasu"],
  },
  {
    id: "u12",
    numero: 12,
    titulo: "Como é?",
    descricao: "Descrever e opinar: gostoso, caro, tranquilo, foi bom",
    cor: "#c96f8f",
    contexto: "compras",
    cards: [
      "card_091", "card_092", "card_093",
      "card_094", "card_095", "card_096",
      "card_097", "card_098", "card_099",
      "card_100", "card_101", "card_102",
    ],
    missoes: ["rp_adj_viagem", "rp_adj_ramen", "rp_adj_chefe"],
  },
  {
    id: "u13",
    numero: 13,
    titulo: "Fim de semana",
    descricao: "Contar o que fez, em ordem, com quem e convidar",
    cor: "#e07b39",
    contexto: "social",
    cards: [
      "card_103", "card_104", "card_105",
      "card_106", "card_107", "card_108",
      "card_109", "card_110", "card_111",
      "card_112", "card_113", "card_114",
    ],
    missoes: ["rp_fds_segunda", "rp_fds_convite", "rp_fds_manha"],
  },
  {
    id: "u14",
    numero: 14,
    titulo: "Revisão da Fase 1",
    descricao: "Tudo junto: conversa de 2 minutos e simulado N5",
    cor: "#8a8f9e",
    contexto: "todos",
    cards: [],
    missoes: ["rp_rev_conversa", "rp_rev_cidade"],
    revisaoGeral: [
      { titulo: "Revisão: quem é você", unidades: ["u1", "u6", "u11", "u13"] },
      { titulo: "Revisão: cidade e compras", unidades: ["u3", "u4", "u8", "u9", "u10"] },
      { titulo: "Revisão: trabalho", unidades: ["u5", "u7"] },
      { titulo: "Revisão: comida e opiniões", unidades: ["u2", "u12"] },
    ],
  },
  {
    id: "u15",
    numero: 15,
    titulo: "Família e pessoas",
    descricao: "Minha família e a dos outros, idade e como as pessoas são",
    cor: "#5fa8a0",
    contexto: "social",
    cards: [
      "card_115", "card_116", "card_117",
      "card_118", "card_119", "card_120",
      "card_121", "card_122", "card_123",
      "card_124", "card_125", "card_126",
    ],
    missoes: ["rp_fam_fotos", "rp_fam_vizinha", "rp_fam_festa"],
  },
  {
    id: "u16",
    numero: 16,
    titulo: "Saúde e farmácia",
    descricao: "Dor, febre, remédio, conselhos e melhoras",
    cor: "#d9534f",
    contexto: "cidade",
    cards: [
      "card_127", "card_128", "card_129",
      "card_130", "card_131", "card_132",
      "card_133", "card_134", "card_135",
      "card_136", "card_137", "card_138",
    ],
    missoes: ["rp_sau_medico", "rp_sau_farmacia", "rp_sau_colega"],
  },
  {
    id: "u17",
    numero: 17,
    titulo: "Hobbies",
    descricao: "Forma de dicionário: do que gosta, o que sabe fazer",
    cor: "#9c6ade",
    contexto: "social",
    cards: [
      "card_139", "card_140", "card_141",
      "card_142", "card_143", "card_144",
      "card_145", "card_146", "card_147",
      "card_148", "card_149", "card_150",
    ],
    missoes: ["rp_hob_conversa", "rp_hob_entrevista", "rp_hob_convite"],
    formasNovas: ["koto"],
  },
  {
    id: "u18",
    numero: 18,
    titulo: "Regras e obrigações",
    descricao: "Forma -nai: não faça, tenho que, não precisa",
    cor: "#4a6fa5",
    contexto: "trabalho",
    cards: [
      "card_151", "card_152", "card_153",
      "card_154", "card_155", "card_156",
      "card_157", "card_158", "card_159",
      "card_160", "card_161", "card_162",
    ],
    missoes: ["rp_reg_apartamento", "rp_reg_primeirodia", "rp_reg_trem"],
    formasNovas: ["nakereba"],
  },
  {
    id: "u19",
    numero: 19,
    titulo: "Conversa com amigos",
    descricao: "Forma plana: falar casual com quem é próximo",
    cor: "#e8a33d",
    contexto: "social",
    cards: [
      "card_163", "card_164", "card_165",
      "card_166", "card_167", "card_168",
      "card_169", "card_170", "card_171",
      "card_172", "card_173", "card_174",
    ],
    missoes: ["rp_cas_kenji", "rp_cas_yuki", "rp_cas_novidade"],
    formasNovas: ["ta", "nakatta"],
  },
  {
    id: "u20",
    numero: 20,
    titulo: "Dar opinião",
    descricao: "Acho que, ele disse que, deve ser e por quê",
    cor: "#6d8fb3",
    contexto: "trabalho",
    cards: [
      "card_175", "card_176", "card_177",
      "card_178", "card_179", "card_180",
      "card_181", "card_182", "card_183",
      "card_184", "card_185", "card_186",
    ],
    missoes: ["rp_opi_reuniao", "rp_opi_tempo", "rp_opi_aula"],
  },
  {
    id: "u21",
    numero: 21,
    titulo: "Explicar motivos",
    descricao: "É que…, porque, como… e por quê?",
    cor: "#a47e5b",
    contexto: "trabalho",
    cards: [
      "card_187", "card_188", "card_189",
      "card_190", "card_191", "card_192",
      "card_193", "card_194", "card_195",
      "card_196", "card_197", "card_198",
    ],
    missoes: ["rp_mot_atraso", "rp_mot_convite", "rp_mot_japones"],
  },
  {
    id: "u22",
    numero: 22,
    titulo: "Experiências",
    descricao: "Já fiz, nunca fiz e como foi",
    cor: "#5b9e7a",
    contexto: "social",
    formasNovas: ["ta_koto"],
    cards: [
      "card_199", "card_200", "card_201",
      "card_202", "card_203", "card_204",
      "card_205", "card_206", "card_207",
      "card_208", "card_209", "card_210",
      "card_211", "card_212", "card_213",
    ],
    missoes: ["rp_exp_viagem", "rp_exp_natto", "rp_exp_entrevista"],
  },
  {
    id: "u23",
    numero: 23,
    titulo: "Comparar e escolher",
    descricao: "Qual dos dois, mais que, o mais de todos",
    cor: "#c0708a",
    contexto: "compras",
    cards: [
      "card_214", "card_215", "card_216",
      "card_217", "card_218", "card_219",
      "card_220", "card_221", "card_222",
      "card_223", "card_224", "card_225",
      "card_226", "card_227", "card_228",
    ],
    missoes: ["rp_cmp_loja", "rp_cmp_almoco", "rp_cmp_paises"],
  },
  {
    id: "u24",
    numero: 24,
    titulo: "Planos",
    descricao: "Penso em, pretendo e está marcado",
    cor: "#7a9e3f",
    contexto: "social",
    formasNovas: ["ou_to"],
    cards: [
      "card_229", "card_230", "card_231",
      "card_232", "card_233", "card_234",
      "card_235", "card_236", "card_237",
      "card_238", "card_239", "card_240",
      "card_241", "card_242", "card_243",
    ],
    missoes: ["rp_pla_ferias", "rp_pla_futuro", "rp_pla_reuniao"],
  },
  {
    id: "u25",
    numero: 25,
    titulo: "Viagem",
    descricao: "Hotel, estação, imprevistos e como foi",
    cor: "#4f9fb8",
    contexto: "cidade",
    cards: [
      "card_244", "card_245", "card_246",
      "card_247", "card_248", "card_249",
      "card_250", "card_251", "card_252",
      "card_253", "card_254", "card_255",
      "card_256", "card_257", "card_258",
    ],
    missoes: ["rp_via_hotel", "rp_via_estacao", "rp_via_passaporte", "rp_via_volta"],
  },
  {
    id: "u26",
    numero: 26,
    titulo: "Revisão da Fase 2",
    descricao: "Conversa de 3 minutos e simulado N5 completo",
    cor: "#8a8f9e",
    contexto: "todos",
    cards: [],
    missoes: ["rp_rev2_amigos", "rp_rev2_professora"],
    simuladoCompleto: true,
    revisaoGeral: [
      { titulo: "Revisão: pessoas e saúde", unidades: ["u15", "u16"] },
      { titulo: "Revisão: hobbies e regras", unidades: ["u17", "u18"] },
      { titulo: "Revisão: amigos, opiniões e motivos", unidades: ["u19", "u20", "u21"] },
      { titulo: "Revisão: experiências e escolhas", unidades: ["u22", "u23"] },
      { titulo: "Revisão: planos e viagem", unidades: ["u24", "u25"] },
    ],
  },
  {
    id: "u27",
    numero: 27,
    titulo: "Consegue?",
    descricao: "O que você consegue e não consegue fazer",
    cor: "#b5763f",
    contexto: "social",
    formasNovas: ["reru", "remasen"],
    cards: [
      "card_259", "card_260", "card_261", "card_262",
      "card_263", "card_264", "card_265", "card_266",
      "card_267", "card_268", "card_269", "card_270",
      "card_271", "card_272", "card_273", "card_274",
      "card_275", "card_276", "card_277", "card_278",
    ],
    missoes: ["rp_pot_japones", "rp_pot_restaurante", "rp_pot_ajuda"],
  },
  {
    id: "u28",
    numero: 28,
    titulo: "Se…",
    descricao: "Se chover, quando chegar e o que fazer",
    cor: "#5f7fc4",
    contexto: "trabalho",
    formasNovas: ["tara"],
    cards: [
      "card_279", "card_280", "card_281", "card_282",
      "card_283", "card_284", "card_285", "card_286",
      "card_287", "card_288", "card_289", "card_290",
      "card_291", "card_292", "card_293", "card_294",
      "card_295", "card_296", "card_297", "card_298",
    ],
    missoes: ["rp_con_passeio", "rp_con_caminho", "rp_con_computador"],
  },
];

const TITULO: Record<TipoLicao, string> = {
  tutorial: "Como funciona o mapa de som",
  frases: "Frases novas",
  pingpong: "Ping-Pong",
  dialogo: "Diálogo",
  revisao: "Revisão da unidade",
  simulado: "Simulado de escuta",
};

export function licoesDa(u: Unidade): Licao[] {
  const l: Omit<Licao, "id" | "unidade">[] = [];
  if (u.revisaoGeral) {
    const cardsDe = (ids: string[]) => UNIDADES.filter((x) => ids.includes(x.id)).flatMap((x) => x.cards);
    for (const r of u.revisaoGeral) l.push({ tipo: "revisao", titulo: r.titulo, cards: cardsDe(r.unidades) });
    if (u.contexto) l.push({ tipo: "pingpong", titulo: TITULO.pingpong, cards: [] });
    for (const m of u.missoes) l.push({ tipo: "dialogo", titulo: TITULO.dialogo, cards: [], missao: m });
    // o simulado é o marco da fase: obrigatório e com todas as frases revisadas
    const todas = cardsDe(u.revisaoGeral.flatMap((r) => r.unidades));
    l.push({ tipo: "simulado", titulo: u.simuladoCompleto ? "Simulado N5 completo" : "Simulado N5 de escuta", cards: todas, completo: u.simuladoCompleto });
    return l.map((x, i) => ({ ...x, id: `${u.id}:l${i + 1}`, unidade: u }));
  }
  if (u.numero === 0) l.push({ tipo: "tutorial", titulo: TITULO.tutorial, cards: [] });
  for (let i = 0; i < u.cards.length; i += 3) {
    const grupo = u.cards.slice(i, i + 3);
    // evita lição de uma frase só: junta a sobra com a anterior
    if (grupo.length === 1 && l.length && l[l.length - 1].tipo === "frases") l[l.length - 1].cards.push(...grupo);
    else l.push({ tipo: "frases", titulo: TITULO.frases, cards: grupo });
  }
  if (u.contexto) l.push({ tipo: "pingpong", titulo: TITULO.pingpong, cards: [] });
  for (const m of u.missoes) l.push({ tipo: "dialogo", titulo: TITULO.dialogo, cards: [], missao: m });
  if (u.cards.length) l.push({ tipo: "revisao", titulo: TITULO.revisao, cards: u.cards });
  // sempre por último: ids das lições anteriores não mudam (são a chave do progresso salvo)
  if (u.cards.length >= 3) l.push({ tipo: "simulado", titulo: TITULO.simulado, cards: u.cards, opcional: true });
  return l.map((x, i) => ({ ...x, id: `${u.id}:l${i + 1}`, unidade: u }));
}

/** Onde abrir a lição: diálogos usam a Arena; o resto, o player de lições. */
export function hrefDaLicao(l: Licao) {
  return l.tipo === "dialogo" ? `/roleplay/?missao=${l.missao}&licao=${l.id}` : `/licao/?id=${l.id}`;
}

export function todasAsLicoes(): Licao[] {
  return UNIDADES.flatMap(licoesDa);
}

export function licaoPorId(id: string): Licao | undefined {
  return todasAsLicoes().find((l) => l.id === id);
}

// ───────────────────────── Exercícios

export type SlideTutorial = "mora" | "especiais" | "altura" | "queda" | "devozeada" | "blocos";

export type Exercicio =
  | { tipo: "explica"; slide: SlideTutorial }
  | { tipo: "quiz"; pergunta: string; opcoes: { texto: string; falar?: string }[]; correta: number; explicacao: string }
  | { tipo: "nova"; card: CardTrilha }
  | { tipo: "escuta"; card: CardTrilha; opcoes: string[] }
  /** monte a frase em japonês com os blocos (na ordem japonesa); `banco` = blocos embaralhados + 2 intrusos */
  | { tipo: "montar"; card: CardTrilha; banco: Mora[][]; resposta: string[] }
  | { tipo: "falar"; card: CardTrilha }
  | { tipo: "dialogo"; dialogo: DialogoDrill; forma: Forma; opcoes: FalaDrill[]; correta: number }
  /** treino de ouvido (pares mínimos de entonação): a mesma frase com a melodia certa e uma alterada */
  | { tipo: "melodia"; card: CardTrilha; opcoes: Mora[][]; correta: number; voz: number }
  /** shadowing: falar junto com o áudio, 2 rodadas devagar + 2 na velocidade normal */
  | { tipo: "sombra"; card: CardTrilha }
  /** simulado, expressão na situação: lê a situação e escolhe, só pelo som, o que dizer */
  | { tipo: "situacao"; card: CardTrilha; opcoes: CardTrilha[]; correta: number }
  /** simulado, resposta rápida: ouve uma pergunta e escolhe, só pelo som, a resposta que combina */
  | { tipo: "imediata"; dialogo: DialogoDrill; opcoes: FalaDrill[]; correta: number }
  | ProvaKana;

/** Simulado completo: questões em kana, sem áudio. */
export interface ProvaKana {
  tipo: "vocabulario" | "gramatica" | "leitura";
  enunciado: string;
  /** palavra, frase com lacuna ou texto em kana */
  texto: string;
  opcoes: string[];
  correta: number;
  /** as opções são em kana (gramática) ou em português (vocabulário e leitura) */
  opcoesKana?: boolean;
  /** o que aparece na correção do fim da prova */
  gabarito: string;
  explicacao?: string;
  ouvir?: string;
}

/** Frase do baralho pronta para os exercícios (com as moras já achatadas). */
export type CardTrilha = SeedCard & { moras: Mora[] };

const CARDS = new Map<string, CardTrilha>(seedCards.map((c) => [c.id, { ...(c as SeedCard), moras: c.blocos.flat() }]));
export const cardPorId = (id: string) => CARDS.get(id)!;

/** Primeira forma da tradução ("Olá! / Boa tarde!" → "Olá!"). */
export const traducaoPrincipal = (c: Pick<SeedCard, "traducao">) => c.traducao.split(" / ")[0];

function embaralhar<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Identidade de um bloco (o mesmo som pode ter funções diferentes). */
export const chaveBloco = (bloco: Mora[]) => `${bloco[0].bloco}|${bloco[0].funcao}`;

/** Blocos de todas as frases, para sortear os intrusos do exercício de montar. */
const TODOS_BLOCOS = seedCards.flatMap((c) => c.blocos);

function escuta(card: CardTrilha): Exercicio {
  const outras = embaralhar(seedCards.filter((c) => c.id !== card.id)).slice(0, 3).map((c) => traducaoPrincipal(c as SeedCard));
  return { tipo: "escuta", card, opcoes: embaralhar([traducaoPrincipal(card), ...outras]) };
}

/** Dá para montar: a frase tem pelo menos 2 blocos (expressões de um bloco só não têm ordem a treinar). */
const montavel = (c: CardTrilha) => c.blocos.length >= 2;

/**
 * Montar a frase em japonês: o aluno vê o sentido em português e põe os blocos na ordem em que o japonês
 * pensa (tópico → tempo → objeto → verbo, partículas depois da palavra). Treina a lógica, não a tradução.
 * Intrusos: uma partícula que não está na frase (quando a frase usa partícula) e mais um bloco qualquer.
 */
function montar(card: CardTrilha): Exercicio {
  const resposta = card.blocos.map(chaveBloco);
  const usadas = new Set(resposta);
  const candidatos = embaralhar(TODOS_BLOCOS).filter((b) => {
    const k = chaveBloco(b);
    return !usadas.has(k) && (usadas.add(k), true);
  });
  const temParticula = card.blocos.some((b) => b[0].papel === "particula");
  const intrusos = [
    ...(temParticula ? candidatos.filter((b) => b[0].papel === "particula").slice(0, 1) : []),
    ...candidatos.filter((b) => b[0].papel !== "particula"),
  ].slice(0, 2);
  return { tipo: "montar", card, resposta, banco: embaralhar([...card.blocos, ...intrusos]) };
}

const TREINO: Forma[] = ["mashita", "masen", "masen_deshita", "tai", "mashou"];

/** Transformações já ensinadas até a unidade: as básicas + as novas das unidades anteriores e desta. */
const formasAte = (u: Unidade): Forma[] => [...TREINO, ...UNIDADES.filter((x) => x.numero <= u.numero).flatMap((x) => x.formasNovas ?? [])];

/** `sorteio`: de onde sai a transformação da pergunta; `todas`: de onde sai a alternativa errada. */
function dialogo(ctx: Categoria | "todos", sorteio: Forma[] = TREINO, todas: Forma[] = TREINO): Exercicio {
  const cenas = cenasDoContexto(ctx);
  for (;;) {
    const cena = cenas[Math.floor(Math.random() * cenas.length)];
    const forma = sorteio[Math.floor(Math.random() * sorteio.length)];
    if (verboPorDict(cena.verbo).sem?.includes(forma) || cena.sem?.includes(forma)) continue;
    const d = montarDialogo(cena, forma);
    // alternativas erradas: mesma situação com outra transformação; mesma transformação em outra situação
    const outraForma = todas.find((f) => f !== forma && FORMAS[f].abertura !== FORMAS[forma].abertura) ?? "masen";
    const outraCena = cenas.find((c) => c.verbo !== cena.verbo) ?? cena;
    const erradas = [montarDialogo(cena, outraForma).resposta, montarDialogo(outraCena, forma).resposta];
    const opcoes = embaralhar([d.resposta, ...erradas]);
    return { tipo: "dialogo", dialogo: d, forma, opcoes, correta: opcoes.indexOf(d.resposta) };
  }
}

/**
 * Treino de percepção da entonação (pares mínimos, como no treino fonético de alta variabilidade):
 * a frase certa contra a mesma frase com um bloco de melodia trocada (plano ↔ queda no início).
 * A voz é sorteada para o ouvido aprender a melodia, não a voz de um falante só.
 */
function melodia(card: CardTrilha): Exercicio | null {
  const i = embaralhar(card.blocos.map((_, k) => k)).find((k) => card.blocos[k].length >= 2 && card.blocos[k][0].papel !== "particula");
  if (i === undefined) return null;
  const alto = card.blocos[i][0].pitch === "H";
  const trocado = card.blocos[i].map((m, j): Mora => ({ ...m, pitch: (j === 0) === alto ? "L" : "H" }));
  const errada = card.blocos.map((b, k) => (k === i ? trocado : b)).flat();
  const opcoes = embaralhar([card.moras, errada]);
  return { tipo: "melodia", card, opcoes, correta: opcoes.indexOf(card.moras), voz: Math.floor(Math.random() * 8) };
}

/** Simulado: a situação em português e três frases só em áudio (a certa + duas da mesma unidade). */
function situacao(card: CardTrilha, daUnidade: CardTrilha[]): Exercicio {
  const pool = daUnidade.length >= 3 ? daUnidade : (seedCards as CardTrilha[]);
  const outras = embaralhar(pool.filter((c) => c.id !== card.id)).slice(0, 2).map((c) => cardPorId(c.id));
  const opcoes = embaralhar([card, ...outras]);
  return { tipo: "situacao", card, opcoes, correta: opcoes.indexOf(card) };
}

/**
 * Simulado: resposta rápida. Só formas cuja pergunta traz a situação (ontem / todo dia + complemento),
 * para haver uma única resposta certa; as erradas respondem com outra situação.
 */
function imediata(ctx: Categoria | "todos"): Exercicio {
  const cenas = cenasDoContexto(ctx);
  const formas: Forma[] = ["mashita", "masen", "masen_deshita"];
  const pode = (c: (typeof cenas)[number], f: Forma) => !verboPorDict(c.verbo).sem?.includes(f) && !c.sem?.includes(f);
  for (;;) {
    const cena = cenas[Math.floor(Math.random() * cenas.length)];
    const forma = formas[Math.floor(Math.random() * formas.length)];
    if (!pode(cena, forma)) continue;
    const outras = embaralhar(cenas.filter((c) => c.ja.kana !== cena.ja.kana && c.verbo !== cena.verbo && pode(c, forma))).slice(0, 2);
    if (outras.length < 2) continue;
    const d = montarDialogo(cena, forma);
    const opcoes = embaralhar([d.resposta, ...outras.map((c) => montarDialogo(c, forma).resposta)]);
    return { tipo: "imediata", dialogo: d, opcoes, correta: opcoes.indexOf(d.resposta) };
  }
}

function parteVocabulario(n: number): ProvaKana[] {
  return embaralhar(VOCABULARIO_N5)
    .slice(0, n)
    .map((p) => {
      const opcoes = embaralhar([p.pt, ...embaralhar(VOCABULARIO_N5.filter((x) => x !== p)).slice(0, 3).map((x) => x.pt)]);
      return { tipo: "vocabulario", enunciado: "O que significa esta palavra?", texto: p.kana, opcoes, correta: opcoes.indexOf(p.pt), gabarito: `${p.kana} = ${p.pt}`, ouvir: p.kana };
    });
}

function parteGramatica(n: number): ProvaKana[] {
  return embaralhar(GRAMATICA_N5)
    .slice(0, n)
    .map((q) => {
      const opcoes = embaralhar([q.certa, ...q.erradas]);
      const inteira = q.frase.replace("（　）", q.certa);
      return { tipo: "gramatica", enunciado: "O que completa a frase?", texto: q.frase, opcoes, correta: opcoes.indexOf(q.certa), opcoesKana: true, gabarito: `${inteira} (${q.pt})`, explicacao: q.por, ouvir: inteira };
    });
}

/** Cada texto rende duas perguntas, em sequência, como na prova. */
function parteLeitura(n: number): ProvaKana[] {
  return embaralhar(LEITURA_N5)
    .slice(0, Math.ceil(n / 2))
    .flatMap((t) =>
      t.perguntas.map((p): ProvaKana => {
        const opcoes = embaralhar([p.certa, ...p.erradas]);
        return { tipo: "leitura", enunciado: p.pergunta, texto: t.texto, opcoes, correta: opcoes.indexOf(p.certa), gabarito: `${p.pergunta} ${p.certa}`, ouvir: t.texto };
      }),
    );
}

/**
 * Partes do simulado, na ordem do JLPT N5/N4: vocabulário, gramática, leitura e as três de escuta. O simulado de
 * cada unidade usa só as de escuta (adaptadas à fase só de som); as em kana entram no simulado completo.
 */
export const PARTES_SIMULADO: { tipo: Exercicio["tipo"]; nome: string; descricao: string }[] = [
  { tipo: "vocabulario", nome: "Vocabulário", descricao: "leia a palavra e escolha o sentido" },
  { tipo: "gramatica", nome: "Gramática", descricao: "escolha o que completa a frase" },
  { tipo: "leitura", nome: "Leitura", descricao: "leia o texto e responda" },
  { tipo: "escuta", nome: "Compreensão", descricao: "ouça a frase e escolha o sentido" },
  { tipo: "situacao", nome: "Expressão na situação", descricao: "leia a situação e escolha o que dizer" },
  { tipo: "imediata", nome: "Resposta rápida", descricao: "ouça a pergunta e escolha a resposta" },
];

const TUTORIAL: Exercicio[] = [
  { tipo: "explica", slide: "mora" },
  {
    tipo: "quiz",
    pergunta: "Quantas moras (batidas) tem «Tōkyō»?",
    opcoes: [{ texto: "2" }, { texto: "3" }, { texto: "4" }],
    correta: 2,
    explicacao: "to · o · kyo · o — cada vogal longa conta uma batida a mais.",
  },
  { tipo: "explica", slide: "especiais" },
  { tipo: "explica", slide: "altura" },
  {
    tipo: "quiz",
    pergunta: "Ouça as duas. Qual é «ame» = chuva (voz cai depois da 1ª mora)?",
    opcoes: [
      { texto: "Opção A", falar: "雨" },
      { texto: "Opção B", falar: "飴" },
    ],
    correta: 0,
    explicacao: "Chuva é a-me alto→baixo; bala (doce) é baixo→alto. Mesmos sons, sentidos diferentes.",
  },
  { tipo: "explica", slide: "queda" },
  { tipo: "explica", slide: "devozeada" },
  { tipo: "explica", slide: "blocos" },
];

/** Gera a sequência de exercícios de uma lição (sorteada a cada vez). As partes em kana só entram da Fase 2 em diante. */
export function montarLicao(l: Licao, fase = 1): Exercicio[] {
  const cards = l.cards.map(cardPorId);
  switch (l.tipo) {
    case "tutorial":
      return TUTORIAL;
    case "frases": {
      const ex: Exercicio[] = [];
      // shadowing logo depois de conhecer a primeira frase de fala (ouvir → imitar)
      const sombra = cards.find((c) => c.tipo === "speaking");
      for (const c of cards) {
        ex.push({ tipo: "nova", card: c });
        if (c === sombra) ex.push({ tipo: "sombra", card: c });
        ex.push(escuta(c));
      }
      const m = melodia(embaralhar(cards)[0]);
      if (m) ex.push(m);
      for (const c of cards.filter(montavel)) ex.push(montar(c));
      for (const c of cards.filter((c) => c.tipo === "speaking").slice(0, 2)) ex.push({ tipo: "falar", card: c });
      return ex;
    }
    case "pingpong": {
      // a unidade que ensina uma forma nova treina essa forma em metade dos diálogos
      const todas = formasAte(l.unidade);
      const novas = l.unidade.formasNovas ?? [];
      return Array.from({ length: 6 }, (_, i) => dialogo(l.unidade.contexto ?? "social", i % 2 === 0 && novas.length ? novas : todas, todas));
    }
    case "revisao": {
      const ex = embaralhar(cards)
        .slice(0, 10)
        .map((c, i) => [escuta, (x: CardTrilha) => (montavel(x) ? montar(x) : escuta(x)), (x: CardTrilha): Exercicio => ({ tipo: "falar", card: x })][i % 3](c));
      // dois treinos de ouvido no meio da revisão
      const ouvido = embaralhar(cards).map(melodia).filter((x): x is Exercicio => x !== null).slice(0, 2);
      ouvido.forEach((o, i) => ex.splice(3 + i * 4, 0, o));
      return ex;
    }
    case "simulado": {
      // simulado de fim de fase (muitas frases) tem 6 questões por parte; o de unidade, 4
      const n = cards.length > 30 ? 6 : 4;
      const parte1 = embaralhar(cards).slice(0, n).map(escuta);
      const parte2 = embaralhar(cards).slice(0, n).map((c) => situacao(c, cards));
      const ctx = l.unidade.contexto;
      const parte3 = ctx ? Array.from({ length: n }, () => imediata(ctx)) : [];
      const kana = l.completo && fase >= 2 ? [...parteVocabulario(n), ...parteGramatica(n), ...parteLeitura(n)] : [];
      return [...kana, ...parte1, ...parte2, ...parte3];
    }
    case "dialogo":
      return [];
  }
}
