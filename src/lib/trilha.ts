/**
 * Trilha de aprendizagem: unidades por situação de vida, cada uma com lições curtas.
 * As lições reaproveitam o conteúdo existente: frases do baralho (seed), cenas do Ping-Pong e missões da Arena.
 */
import type { SeedCard } from "@/db/seed-data/helpers";
import { seedCards } from "@/db/seed-data/cards";
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
    l.push({ tipo: "simulado", titulo: "Simulado N5 de escuta", cards: todas });
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
  | { tipo: "imediata"; dialogo: DialogoDrill; opcoes: FalaDrill[]; correta: number };

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

/** Partes do simulado de escuta (formato da prova de escuta do JLPT N5/N4, adaptado à fase só de som). */
export const PARTES_SIMULADO: { tipo: Exercicio["tipo"]; nome: string; descricao: string }[] = [
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

/** Gera a sequência de exercícios de uma lição (sorteada a cada vez). */
export function montarLicao(l: Licao): Exercicio[] {
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
      return [...parte1, ...parte2, ...parte3];
    }
    case "dialogo":
      return [];
  }
}
