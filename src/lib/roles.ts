import type { Papel } from "./types";

interface RoleStyle {
  label: string;
  /** cor sólida (SVG / bordas) */
  hex: string;
  /** classes Tailwind do chip */
  chip: string;
}

export const ROLES: Record<Papel, RoleStyle> = {
  topico: { label: "Tópico", hex: "#a78bfa", chip: "bg-violet-500/15 text-violet-200 border-violet-400/50" },
  sujeito: { label: "Sujeito/Foco", hex: "#38bdf8", chip: "bg-sky-500/15 text-sky-200 border-sky-400/50" },
  objeto: { label: "Objeto", hex: "#fbbf24", chip: "bg-amber-500/15 text-amber-200 border-amber-400/50" },
  verbo: { label: "Verbo", hex: "#34d399", chip: "bg-emerald-500/15 text-emerald-200 border-emerald-400/50" },
  particula: { label: "Partícula", hex: "#94a3b8", chip: "bg-slate-500/20 text-slate-200 border-slate-400/50" },
  pergunta: { label: "Pergunta", hex: "#fb7185", chip: "bg-rose-500/15 text-rose-200 border-rose-400/50" },
  tempo: { label: "Tempo", hex: "#22d3ee", chip: "bg-cyan-500/15 text-cyan-200 border-cyan-400/50" },
  lugar: { label: "Lugar", hex: "#fb923c", chip: "bg-orange-500/15 text-orange-200 border-orange-400/50" },
  copula: { label: "Cópula", hex: "#2dd4bf", chip: "bg-teal-500/15 text-teal-200 border-teal-400/50" },
  adjetivo: { label: "Adjetivo", hex: "#f472b6", chip: "bg-pink-500/15 text-pink-200 border-pink-400/50" },
  substantivo: { label: "Substantivo", hex: "#60a5fa", chip: "bg-blue-500/15 text-blue-200 border-blue-400/50" },
  adverbio: { label: "Advérbio", hex: "#a3e635", chip: "bg-lime-500/15 text-lime-200 border-lime-400/50" },
  expressao: { label: "Expressão", hex: "#818cf8", chip: "bg-indigo-500/15 text-indigo-200 border-indigo-400/50" },
};

export function roleOf(p?: Papel): RoleStyle {
  return ROLES[p ?? "expressao"] ?? ROLES.expressao;
}
