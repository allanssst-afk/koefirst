"use client";

import { useEffect, useState } from "react";
import { roleOf } from "@/lib/roles";
import { groupBlocks } from "@/lib/text";
import type { Mora } from "@/lib/types";

interface Props {
  moras: Mora[];
  /** anima um cursor mora a mora enquanto o áudio toca */
  playing?: boolean;
  /** ms por mora na animação (≈ ritmo da fala) */
  moraMs?: number;
  size?: "md" | "sm";
  showFuncao?: boolean;
  className?: string;
}

/**
 * Guia Prosódico: blocos de moras com a curva de pitch (Alto/Baixo) desenhada por cima,
 * a queda de acento marcada em vermelho e os blocos gramaticais coloridos por função.
 */
export function PitchAccentVisualizer({
  moras,
  playing = false,
  moraMs = 165,
  size = "md",
  showFuncao = true,
  className = "",
}: Props) {
  const cell = size === "md" ? 48 : 36;
  const yH = size === "md" ? 16 : 12;
  const yL = size === "md" ? 50 : 36;
  const svgH = yL + (size === "md" ? 14 : 10);
  const width = moras.length * cell;
  const active = usePlayhead(playing, moras.length, moraMs);

  const cx = (i: number) => i * cell + cell / 2;
  const cy = (m: Mora) => (m.pitch === "H" ? yH : yL);
  const path = moras.map((m, i) => `${i === 0 ? "M" : "L"}${cx(i)},${cy(m)}`).join(" ");
  const groups = groupBlocks(moras);

  return (
    <div className={`overflow-x-auto pb-1 ${className}`}>
      <div className="mx-auto" style={{ width }}>
        <svg width={width} height={svgH} role="img" aria-label="Curva de entonação (pitch accent)" className="block">
          <line x1={0} x2={width} y1={yH} y2={yH} stroke="var(--grid)" strokeDasharray="2 5" />
          <line x1={0} x2={width} y1={yL} y2={yL} stroke="var(--grid)" strokeDasharray="2 5" />
          <path d={path} fill="none" stroke="var(--pitch)" strokeWidth={size === "md" ? 3 : 2.25} strokeLinejoin="round" />
          {moras.map((m, i) => {
            const next = moras[i + 1];
            const drop = m.pitch === "H" && next?.pitch === "L";
            return (
              <g key={i}>
                {drop && (
                  <path
                    d={`M${cx(i) + cell * 0.32},${yH - 7} L${cx(i) + cell * 0.32},${yH + 9}`}
                    stroke="var(--drop)"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  >
                    <title>Queda de acento</title>
                  </path>
                )}
                <circle
                  cx={cx(i)}
                  cy={cy(m)}
                  r={active === i ? 8 : size === "md" ? 5.5 : 4.5}
                  fill={m.pitch === "H" ? "var(--pitch)" : "var(--bg)"}
                  stroke="var(--pitch)"
                  strokeWidth={2}
                  className="transition-all duration-100"
                  opacity={m.devozeada ? 0.45 : 1}
                />
              </g>
            );
          })}
        </svg>

        {/* Moras */}
        <div className="grid" style={{ gridTemplateColumns: `repeat(${moras.length}, ${cell}px)` }}>
          {moras.map((m, i) => {
            const role = roleOf(m.papel);
            return (
              <div key={i} className="px-[2px]">
                <div
                  title={m.devozeada ? "Mora devozeada (quase sussurrada)" : `${m.pitch === "H" ? "Alto" : "Baixo"}`}
                  className={`flex items-center justify-center rounded-md border font-mono font-semibold tracking-tight transition-colors ${
                    size === "md" ? "h-10 text-[15px]" : "h-8 text-[13px]"
                  } ${m.devozeada ? "border-dashed opacity-55" : ""} ${active === i ? "ring-2 ring-[var(--pitch)]" : ""}`}
                  style={{
                    borderColor: role.hex + (m.devozeada ? "80" : "aa"),
                    background: role.hex + (active === i ? "40" : "1a"),
                    color: "var(--fg)",
                  }}
                >
                  {m.som}
                </div>
              </div>
            );
          })}
        </div>

        {/* Blocos gramaticais */}
        {showFuncao && (
          <div className="mt-1.5 grid" style={{ gridTemplateColumns: `repeat(${moras.length}, ${cell}px)` }}>
            {groups.map((g) => {
              const role = roleOf(g.moras[0].papel);
              return (
                <div
                  key={g.start}
                  className="px-[2px]"
                  style={{ gridColumn: `${g.start + 1} / span ${g.moras.length}` }}
                  title={`${role.label}: ${g.moras[0].bloco}`}
                >
                  <div className="h-1 rounded-full" style={{ background: role.hex }} />
                  <p
                    className={`mt-1 text-center leading-tight ${size === "md" ? "text-[11px]" : "text-[10px]"}`}
                    style={{ color: role.hex }}
                  >
                    {g.moras[0].funcao}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function usePlayhead(playing: boolean, n: number, moraMs: number) {
  const [i, setI] = useState(-1);
  useEffect(() => {
    if (!playing) {
      setI(-1);
      return;
    }
    let k = 0;
    setI(0);
    const t = setInterval(() => {
      k++;
      if (k >= n) {
        clearInterval(t);
        setI(-1);
      } else setI(k);
    }, moraMs);
    return () => clearInterval(t);
  }, [playing, n, moraMs]);
  return i;
}

export function RoleLegend({ moras }: { moras: Mora[] }) {
  const seen = [...new Set(moras.map((m) => m.papel ?? "expressao"))];
  return (
    <div className="flex flex-wrap gap-1.5">
      {seen.map((p) => {
        const r = roleOf(p);
        return (
          <span key={p} className={`rounded-full border px-2 py-0.5 text-[10px] ${r.chip}`}>
            {r.label}
          </span>
        );
      })}
      <span className="rounded-full border border-[var(--drop)]/60 px-2 py-0.5 text-[10px] text-[var(--drop)]">
        ┃ queda de acento
      </span>
    </div>
  );
}
