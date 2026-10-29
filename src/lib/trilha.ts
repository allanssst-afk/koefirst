/**
 * Trilha de aprendizagem (estilo Duolingo): unidades por situação de vida, cada uma com lições curtas.
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
  contexto: Categoria | null;
  cards: string[];
  missoes: string[];
}

export type TipoLicao = "tutorial" | "frases" | "pingpong" | "dialogo" | "revisao";

export interface Licao {
  /** "u2:l3" — também é a chave do progresso salvo */
  id: string;
  unidade: Unidade;
  tipo: TipoLicao;
  titulo: string;
  cards: string[];
  missao?: string;
}

export const UNIDADES: Unidade[] = [
  {
    id: "u0",
    numero: 0,
    titulo: "Comece aqui",
    descricao: "Como ler o mapa de som",
    cor: "#1cb0f6",
    contexto: null,
    cards: [],
    missoes: [],
  },
  {
    id: "u1",
    numero: 1,
    titulo: "Cumprimente e se apresente",
    descricao: "Olá, prazer, obrigado e quem você é",
    cor: "#58cc02",
    contexto: "social",
    cards: ["card_002", "card_003", "card_006", "card_007", "card_008", "card_004", "card_005", "card_030"],
    missoes: ["rp_01_apresentacao", "rp_soc_vizinho", "rp_soc_festa"],
  },
  {
    id: "u2",
    numero: 2,
    titulo: "Peça comida e bebida",
    descricao: "Restaurante, café e o que você gosta",
    cor: "#ce82ff",
    contexto: "restaurante",
    cards: ["card_011", "card_027", "card_018", "card_023", "card_025"],
    missoes: ["rp_rest_sushi", "rp_02_pedido_horario"],
  },
  {
    id: "u3",
    numero: 3,
    titulo: "Compras e perguntas",
    descricao: "O que é isto, quanto custa, onde fica",
    cor: "#ff9600",
    contexto: "compras",
    cards: ["card_001", "card_009", "card_010", "card_013", "card_012"],
    missoes: ["rp_comp_loja", "rp_comp_konbini", "rp_comp_farmacia"],
  },
  {
    id: "u4",
    numero: 4,
    titulo: "Pela cidade",
    descricao: "Estação, planos e encontros",
    cor: "#ff4b4b",
    contexto: "cidade",
    cards: ["card_014", "card_015", "card_022", "card_026"],
    missoes: ["rp_cid_estacao", "rp_cid_passagem", "rp_cid_hotel", "rp_soc_programa"],
  },
  {
    id: "u5",
    numero: 5,
    titulo: "No trabalho",
    descricao: "Profissão, reuniões e tarefas",
    cor: "#2b70c9",
    contexto: "trabalho",
    cards: ["card_019", "card_020", "card_029", "card_021", "card_024"],
    missoes: ["rp_trab_reuniao", "rp_trab_almoco"],
  },
  {
    id: "u6",
    numero: 6,
    titulo: "Sua rotina",
    descricao: "Ontem, hoje e todo dia",
    cor: "#ff86d0",
    contexto: "social",
    cards: ["card_028", "card_017", "card_016"],
    missoes: ["rp_03_rotina"],
  },
  {
    id: "u7",
    numero: 7,
    titulo: "Dia a dia no escritório",
    descricao: "Prazos, atrasos, clientes e fim do expediente",
    cor: "#00cd9c",
    contexto: "trabalho",
    cards: [
      "card_031", "card_041", "card_033",
      "card_032", "card_039", "card_037",
      "card_042", "card_034", "card_035",
      "card_038", "card_036", "card_040",
    ],
    missoes: ["rp_trab_atraso", "rp_trab_prazo", "rp_trab_cliente", "rp_trab_saida"],
  },
];

const TITULO: Record<TipoLicao, string> = {
  tutorial: "Como funciona o mapa de som",
  frases: "Frases novas",
  pingpong: "Ping-Pong",
  dialogo: "Diálogo",
  revisao: "Revisão da unidade",
};

export function licoesDa(u: Unidade): Licao[] {
  const l: Omit<Licao, "id" | "unidade">[] = [];
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
  | { tipo: "dialogo"; dialogo: DialogoDrill; forma: Forma; opcoes: FalaDrill[]; correta: number };

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

function dialogo(ctx: Categoria): Exercicio {
  const cenas = cenasDoContexto(ctx);
  for (;;) {
    const cena = cenas[Math.floor(Math.random() * cenas.length)];
    const forma = TREINO[Math.floor(Math.random() * TREINO.length)];
    if (verboPorDict(cena.verbo).sem?.includes(forma) || cena.sem?.includes(forma)) continue;
    const d = montarDialogo(cena, forma);
    // alternativas erradas: mesma situação com outra transformação; mesma transformação em outra situação
    const outraForma = TREINO.find((f) => f !== forma && FORMAS[f].abertura !== FORMAS[forma].abertura) ?? "masen";
    const outraCena = cenas.find((c) => c.verbo !== cena.verbo) ?? cena;
    const erradas = [montarDialogo(cena, outraForma).resposta, montarDialogo(outraCena, forma).resposta];
    const opcoes = embaralhar([d.resposta, ...erradas]);
    return { tipo: "dialogo", dialogo: d, forma, opcoes, correta: opcoes.indexOf(d.resposta) };
  }
}

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
      for (const c of cards) ex.push({ tipo: "nova", card: c }, escuta(c));
      for (const c of cards.filter(montavel)) ex.push(montar(c));
      for (const c of cards.filter((c) => c.tipo === "speaking").slice(0, 2)) ex.push({ tipo: "falar", card: c });
      return ex;
    }
    case "pingpong":
      return Array.from({ length: 6 }, () => dialogo(l.unidade.contexto ?? "social"));
    case "revisao":
      return embaralhar(cards)
        .slice(0, 10)
        .map((c, i) => [escuta, (x: CardTrilha) => (montavel(x) ? montar(x) : escuta(x)), (x: CardTrilha): Exercicio => ({ tipo: "falar", card: x })][i % 3](c));
    case "dialogo":
      return [];
  }
}
