/**
 * Dicionário do app: cada bloco (palavra, partícula, expressão) das frases do baralho vira um verbete,
 * com o som, a melodia como aparece na frase, a função em português e as frases onde aparece.
 */
import { seedCards } from "@/db/seed-data/cards";
import { morasToKana } from "./text";
import { cardPorId, chaveBloco, type CardTrilha } from "./trilha";
import type { Mora, Papel } from "./types";

export interface Verbete {
  chave: string;
  moras: Mora[];
  kana: string;
  funcao: string;
  papel: Papel;
  /** ids das frases em que aparece */
  frases: string[];
}

const porChave = new Map<string, Verbete>();
for (const c of seedCards) {
  for (const bloco of c.blocos) {
    const chave = chaveBloco(bloco);
    const v = porChave.get(chave);
    if (v) {
      if (!v.frases.includes(c.id)) v.frases.push(c.id);
    } else {
      porChave.set(chave, { chave, moras: bloco, kana: morasToKana(bloco), funcao: bloco[0].funcao, papel: bloco[0].papel ?? "substantivo", frases: [c.id] });
    }
  }
}

/** sem acento e minúsculo, para a busca */
export const normalizar = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

const ordem = (s: string) => normalizar(s.replace(/^[[(«]+/, ""));

export const VERBETES: Verbete[] = [...porChave.values()].sort((a, b) => ordem(a.funcao).localeCompare(ordem(b.funcao)));

export const FRASES: CardTrilha[] = seedCards.map((c) => cardPorId(c.id));

/** som do bloco sem separação ("konnichiwa"), para buscar pelo que se ouve */
const somCorrido = (moras: Mora[]) => moras.map((m) => m.som).join("");

export function buscarVerbetes(q: string, papeis: Papel[] | null): Verbete[] {
  const n = normalizar(q);
  return VERBETES.filter(
    (v) =>
      (!papeis || papeis.includes(v.papel)) &&
      (!n || normalizar(v.funcao).includes(n) || somCorrido(v.moras).includes(n.replace(/[\s·.-]/g, "")) || v.kana.includes(q.trim())),
  );
}

export function buscarFrases(q: string): CardTrilha[] {
  const n = normalizar(q);
  if (!n) return FRASES;
  const sem = n.replace(/[\s·.-]/g, "");
  return FRASES.filter(
    (c) =>
      normalizar(c.traducao).includes(n) ||
      normalizar(c.situacao_pt).includes(n) ||
      somCorrido(c.moras).includes(sem) ||
      c.kana.includes(q.trim()),
  );
}
