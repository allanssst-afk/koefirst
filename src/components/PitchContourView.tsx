"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { analyzePitch, type PitchContour } from "@/lib/audio/pitch";
import type { Mora } from "@/lib/types";

/**
 * Compara a curva de F0 da gravação do usuário com o degrau H/L esperado.
 * O contorno é normalizado em semitons para independer do tom de voz.
 */
export function PitchContourView({ blob, moras }: { blob: Blob | null; moras: Mora[] }) {
  const [contour, setContour] = useState<PitchContour | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setContour(null);
    setFailed(false);
    if (!blob) return;
    let alive = true;
    analyzePitch(blob)
      .then((c) => alive && setContour(c))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [blob]);

  if (!blob || failed) return null;

  const W = 600;
  const H = 120;
  const pad = 10;

  let userPath = "";
  if (contour) {
    const idx = contour.hz.map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
    if (idx.length > 3) {
      const first = idx[0];
      const last = idx[idx.length - 1];
      const st = contour.hz.map((v) => (v ? 12 * Math.log2(v) : null));
      const vals = st.filter((v): v is number => v !== null).sort((a, b) => a - b);
      const lo = vals[Math.floor(vals.length * 0.05)];
      const hi = Math.max(lo + 3, vals[Math.floor(vals.length * 0.95)]);
      let pen = false;
      st.forEach((v, i) => {
        if (i < first || i > last) return;
        if (v === null) {
          pen = false;
          return;
        }
        const x = pad + ((i - first) / Math.max(1, last - first)) * (W - 2 * pad);
        const y = H - pad - ((Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo)) * (H - 2 * pad);
        userPath += `${pen ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)} `;
        pen = true;
      });
    }
  }

  const step = (W - 2 * pad) / moras.length;
  const yOf = (p: "H" | "L") => (p === "H" ? H * 0.28 : H * 0.72);
  const expected = moras
    .map((m, i) => `${i === 0 ? "M" : "L"}${pad + i * step},${yOf(m.pitch)} L${pad + (i + 1) * step},${yOf(m.pitch)}`)
    .join(" ");

  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4">
      <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        <Activity size={14} /> Sua entonação vs. padrão esperado
      </h3>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-28 w-full">
        <path d={expected} fill="none" stroke="var(--pitch)" strokeOpacity={0.35} strokeWidth={10} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {userPath ? (
          <path d={userPath} fill="none" stroke="var(--user)" strokeWidth={2.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        ) : (
          <text x={W / 2} y={H / 2} textAnchor="middle" fill="var(--muted)" fontSize={14}>
            {contour ? "Voz insuficiente para medir o pitch" : "Analisando…"}
          </text>
        )}
      </svg>
      <div className="mt-1 flex gap-4 text-[11px] text-[var(--muted)]">
        <span className="flex items-center gap-1.5">
          <i className="inline-block h-1.5 w-4 rounded bg-[var(--pitch)] opacity-40" /> padrão H/L
        </span>
        <span className="flex items-center gap-1.5">
          <i className="inline-block h-0.5 w-4 rounded bg-[var(--user)]" /> sua voz (F0)
        </span>
      </div>
    </section>
  );
}
