"use client";

import { useEffect, useState } from "react";

/**
 * Anel de contagem regressiva do reflexo oral. Congela no momento em que a fala começa
 * (latencyMs) e mostra o tempo de reação.
 */
export function ReflexTimer({
  durationMs,
  running,
  latencyMs,
  level = 0,
  size = 132,
}: {
  durationMs: number;
  running: boolean;
  latencyMs: number | null;
  level?: number;
  size?: number;
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!running) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = () => {
      setElapsed(performance.now() - t0);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const shown = latencyMs ?? (running ? elapsed : 0);
  const frac = Math.min(1, shown / durationMs);
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  const color = latencyMs !== null ? (latencyMs < durationMs * 0.5 ? "var(--ok)" : latencyMs < durationMs ? "var(--warn)" : "var(--bad)") : frac < 0.6 ? "var(--ok)" : frac < 0.9 ? "var(--warn)" : "var(--bad)";
  const remaining = Math.max(0, (durationMs - shown) / 1000);
  const pulse = Math.min(1, level * 12);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className="absolute inset-3 rounded-full transition-transform duration-75"
        style={{ background: "var(--accent)", opacity: 0.12 + pulse * 0.25, transform: `scale(${0.85 + pulse * 0.2})` }}
      />
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--line)" strokeWidth={7} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={7}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - frac)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {latencyMs !== null ? (
          <>
            <span className="text-2xl font-bold tabular-nums" style={{ color }}>
              {(latencyMs / 1000).toFixed(1)}s
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[var(--muted)]">reação</span>
          </>
        ) : (
          <>
            <span className="text-3xl font-bold tabular-nums">{remaining.toFixed(1)}</span>
            <span className="text-[10px] uppercase tracking-wider text-[var(--muted)]">{running ? "fale!" : "segundos"}</span>
          </>
        )}
      </div>
    </div>
  );
}
