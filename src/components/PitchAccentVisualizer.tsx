"use client";

import { useEffect, useRef, useState } from "react";
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

/** Larguras de célula (px): ideal e mínima antes de quebrar a frase em outra linha. */
const CELULA = { md: { max: 48, min: 34 }, sm: { max: 36, min: 28 } };

interface Linha {
  inicio: number;
  moras: Mora[];
}

/**
 * Quebra a frase em linhas que cabem na largura disponível, sempre entre blocos gramaticais
 * (nunca no meio de uma palavra) — no celular a frase desce em linhas em vez de rolar para o lado.
 */
function quebrarEmLinhas(moras: Mora[], porLinha: number): Linha[] {
  const linhas: Linha[] = [];
  let atual: Linha | null = null;
  for (const g of groupBlocks(moras)) {
    // bloco maior que a linha inteira (raro): corta em pedaços do tamanho da linha
    for (let k = 0; k < g.moras.length; k += porLinha) {
      const pedaco = g.moras.slice(k, k + porLinha);
      if (!atual || atual.moras.length + pedaco.length > porLinha) {
        atual = { inicio: g.start + k, moras: [] };
        linhas.push(atual);
      }
      atual.moras.push(...pedaco);
    }
  }
  return linhas;
}

/**
 * Guia Prosódico: blocos de moras com a curva de pitch (Alto/Baixo) desenhada por cima,
 * a queda de acento marcada em vermelho e os blocos gramaticais coloridos por função.
 * Ocupa a largura disponível; frases longas quebram em linhas entre blocos.
 */
export function PitchAccentVisualizer({
  moras,
  playing = false,
  moraMs = 165,
  size = "md",
  showFuncao = true,
  className = "",
}: Props) {
  const caixa = useRef<HTMLDivElement>(null);
  const [largura, setLargura] = useState(0);
  const active = usePlayhead(playing, moras.length, moraMs);

  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const medir = () => setLargura(el.clientWidth);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { max, min } = CELULA[size];
  const disponivel = largura || 320;
  const cabeEmUmaLinha = moras.length * min <= disponivel;
  const porLinha = cabeEmUmaLinha ? moras.length : Math.max(1, Math.floor(disponivel / min));
  const linhas = quebrarEmLinhas(moras, porLinha);
  const maiorLinha = Math.max(...linhas.map((l) => l.moras.length));
  const cell = Math.max(min, Math.min(max, Math.floor(disponivel / maiorLinha)));

  return (
    <div ref={caixa} className={`w-full space-y-3 ${className}`}>
      {linhas.map((l, i) => (
        <LinhaDeMoras
          key={l.inicio}
          moras={l.moras}
          inicio={l.inicio}
          proxima={linhas[i + 1]?.moras[0]}
          continua={i < linhas.length - 1}
          cell={cell}
          size={size}
          active={active}
          showFuncao={showFuncao}
        />
      ))}
    </div>
  );
}

function LinhaDeMoras({
  moras,
  inicio,
  proxima,
  continua,
  cell,
  size,
  active,
  showFuncao,
}: {
  moras: Mora[];
  inicio: number;
  /** primeira mora da linha seguinte (para marcar a queda que acontece na virada) */
  proxima?: Mora;
  continua: boolean;
  cell: number;
  size: "md" | "sm";
  active: number;
  showFuncao: boolean;
}) {
  const yH = size === "md" ? 16 : 12;
  const yL = size === "md" ? 50 : 36;
  const svgH = yL + (size === "md" ? 14 : 10);
  const width = moras.length * cell;
  const cx = (i: number) => i * cell + cell / 2;
  const cy = (m: Mora) => (m.pitch === "H" ? yH : yL);
  // a curva sai pela borda direita quando a frase continua na linha de baixo
  const path =
    moras.map((m, i) => `${i === 0 ? "M" : "L"}${cx(i)},${cy(m)}`).join(" ") +
    (continua && proxima ? ` L${width},${cy(proxima)}` : "");
  const grupos = groupBlocks(moras);
  const fonte = cell < 34 ? "text-[12px]" : size === "md" ? "text-[15px]" : "text-[13px]";

  return (
    <div className="mx-auto" style={{ width }}>
      <svg width={width} height={svgH} role="img" aria-label="Curva de entonação (pitch accent)" className="block overflow-visible">
        <line x1={0} x2={width} y1={yH} y2={yH} stroke="var(--grid)" strokeDasharray="2 5" />
        <line x1={0} x2={width} y1={yL} y2={yL} stroke="var(--grid)" strokeDasharray="2 5" />
        <path d={path} fill="none" stroke="var(--pitch)" strokeWidth={size === "md" ? 3 : 2.25} strokeLinejoin="round" />
        {moras.map((m, i) => {
          const next = moras[i + 1] ?? proxima;
          const drop = m.pitch === "H" && next?.pitch === "L";
          const global = inicio + i;
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
                r={active === global ? 8 : size === "md" ? 5.5 : 4.5}
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
          const global = inicio + i;
          return (
            <div key={i} className="px-[2px]">
              <div
                title={m.devozeada ? "Mora devozeada (quase sussurrada)" : `${m.pitch === "H" ? "Alto" : "Baixo"}`}
                className={`flex items-center justify-center rounded-md border font-mono font-semibold tracking-tight transition-colors ${
                  size === "md" ? "h-10" : "h-8"
                } ${fonte} ${m.devozeada ? "border-dashed opacity-55" : ""} ${active === global ? "ring-2 ring-[var(--pitch)]" : ""}`}
                style={{
                  borderColor: role.hex + (m.devozeada ? "80" : "aa"),
                  background: role.hex + (active === global ? "40" : "1a"),
                  color: "var(--fg)",
                }}
              >
                {m.som}
              </div>
            </div>
          );
        })}
      </div>

      {/* Blocos gramaticais: barra colorida + rótulo inteiro (rótulos largos descem para outra faixa) */}
      {showFuncao && (
        <>
          <div className="mt-1.5 grid" style={{ gridTemplateColumns: `repeat(${moras.length}, ${cell}px)` }}>
            {grupos.map((g) => (
              <div key={g.start} className="px-[2px]" style={{ gridColumn: `${g.start + 1} / span ${g.moras.length}` }}>
                <div className="h-1 rounded-full" style={{ background: roleOf(g.moras[0].papel).hex }} />
              </div>
            ))}
          </div>
          <Rotulos grupos={grupos} cell={cell} width={width} size={size} />
        </>
      )}
    </div>
  );
}

/**
 * Rótulos de função sem quebrar palavras: cada um fica centrado no seu bloco e, se não couber ao lado
 * do anterior, desce para a faixa seguinte (como legendas escalonadas).
 */
function Rotulos({
  grupos,
  cell,
  width,
  size,
}: {
  grupos: { start: number; moras: Mora[] }[];
  cell: number;
  width: number;
  size: "md" | "sm";
}) {
  const charW = size === "md" ? 6.1 : 5.5;
  const altura = size === "md" ? 15 : 13;
  const fimDaFaixa: number[] = [];
  const itens = grupos.map((g) => {
    const texto = g.moras[0].funcao;
    const w = Math.min(width, Math.ceil(texto.length * charW) + 6);
    const centro = (g.start + g.moras.length / 2) * cell;
    const x = Math.max(0, Math.min(width - w, centro - w / 2));
    let faixa = fimDaFaixa.findIndex((fim) => fim + 4 <= x);
    if (faixa === -1) faixa = fimDaFaixa.push(0) - 1;
    fimDaFaixa[faixa] = x + w;
    return { g, texto, w, x, faixa };
  });
  return (
    <div className="relative mt-1" style={{ height: fimDaFaixa.length * altura }}>
      {itens.map(({ g, texto, w, x, faixa }) => {
        const role = roleOf(g.moras[0].papel);
        return (
          <p
            key={g.start}
            title={`${role.label}: ${g.moras[0].bloco}`}
            className={`absolute truncate text-center leading-tight ${size === "md" ? "text-[11px]" : "text-[10px]"}`}
            style={{ left: x, top: faixa * altura, width: w, color: role.hex }}
          >
            {texto}
          </p>
        );
      })}
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
