/**
 * Koe, a mascote do app: um balão de fala com olhos (声 = "voz"). Personagem original.
 * humor: "feliz" (padrão), "falando" (boca aberta, ondas de som) ou "triste".
 */
export function Mascote({ humor = "feliz", tamanho = 96 }: { humor?: "feliz" | "falando" | "triste"; tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 120 120" aria-hidden>
      {/* corpo: balão de fala */}
      <path d="M20 22 h80 a16 16 0 0 1 16 16 v40 a16 16 0 0 1 -16 16 h-44 l-18 16 v-16 h-18 a16 16 0 0 1 -16 -16 v-40 a16 16 0 0 1 16 -16z" fill="#ffc800" />
      <path d="M20 86 h80 a16 16 0 0 0 16 -8 v0 a16 16 0 0 1 -16 16 h-44 l-18 16 v-16 h-18 a16 16 0 0 1 -16 -16 a16 16 0 0 0 16 8z" fill="#e5a800" />
      {/* bochechas */}
      <circle cx="30" cy="66" r="7" fill="#ff9e7a" opacity="0.7" />
      <circle cx="90" cy="66" r="7" fill="#ff9e7a" opacity="0.7" />
      {/* olhos */}
      <ellipse cx="44" cy="52" rx="9" ry={humor === "triste" ? 8 : 11} fill="#fff" />
      <ellipse cx="76" cy="52" rx="9" ry={humor === "triste" ? 8 : 11} fill="#fff" />
      <circle cx="46" cy="54" r="5" fill="#131f24" />
      <circle cx="78" cy="54" r="5" fill="#131f24" />
      <circle cx="48" cy="51" r="1.8" fill="#fff" />
      <circle cx="80" cy="51" r="1.8" fill="#fff" />
      {humor === "triste" && (
        <>
          <path d="M34 40 l16 4" stroke="#7a5a00" strokeWidth="3" strokeLinecap="round" />
          <path d="M86 40 l-16 4" stroke="#7a5a00" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {/* boca */}
      {humor === "falando" ? (
        <ellipse cx="60" cy="74" rx="8" ry="6" fill="#7a2e1f" />
      ) : humor === "triste" ? (
        <path d="M50 78 q10 -8 20 0" stroke="#7a2e1f" strokeWidth="4" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M48 70 q12 12 24 0" stroke="#7a2e1f" strokeWidth="4" fill="none" strokeLinecap="round" />
      )}
      {/* ondas de som */}
      {humor === "falando" && (
        <g stroke="#1cb0f6" strokeWidth="4" fill="none" strokeLinecap="round">
          <path d="M108 8 q8 8 0 16" />
          <path d="M100 12 q4 4 0 8" />
        </g>
      )}
    </svg>
  );
}
