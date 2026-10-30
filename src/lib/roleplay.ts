import { containsAny } from "./text";
import type { FalaLonga } from "./types";

export type Categoria = "trabalho" | "social" | "restaurante" | "compras" | "cidade";

export interface Pessoa {
  nome: string;
  emoji: string;
}

/** Ordem e aparência das categorias de missão na Arena. */
export const CATEGORIAS: { id: Categoria; label: string; emoji: string; desc: string }[] = [
  { id: "trabalho", label: "Trabalho", emoji: "💼", desc: "Escritório, reuniões e colegas" },
  { id: "social", label: "Vida social", emoji: "🎉", desc: "Amigos, vizinhos e conversa fiada" },
  { id: "restaurante", label: "Restaurantes e cafés", emoji: "🍜", desc: "Mesa, pedido e agradecimentos" },
  { id: "compras", label: "Compras", emoji: "🛍️", desc: "Lojas, preços e pagamento" },
  { id: "cidade", label: "Cidade e transporte", emoji: "🚉", desc: "Direções, estação e lugares" },
];

/**
 * Nota de um turno de fala longa: vale cumprir quase toda a meta de tempo (a medida começa na primeira palavra, e o
 * cronômetro da tela, ao tocar no botão) e cobrir 2/3 dos pontos. É uma estimativa por palavras-chave.
 */
export function avaliarFalaLonga(texto: string, ms: number, aberto: FalaLonga) {
  const pontos = aberto.pontos.map((p) => ({ rotulo: p.rotulo, ok: containsAny([texto], p.chaves) }));
  const cobertos = pontos.filter((p) => p.ok).length;
  const segundos = Math.round(ms / 1000);
  return { segundos, pontos, cobertos, ok: segundos >= aberto.segundos * 0.9 && cobertos >= Math.ceil((pontos.length * 2) / 3) };
}

export type AvaliacaoFalaLonga = ReturnType<typeof avaliarFalaLonga>;
