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
