"use client";

import Link from "next/link";
import { Flame, MessagesSquare, Mic, Repeat2, Target, Timer, Waves, Zap } from "lucide-react";
import { BackupCard } from "@/components/BackupCard";
import { PhaseCard } from "@/components/PhaseCard";
import { getDashboardStats, getQueue } from "@/lib/queries";

const META_B1_PALAVRAS = 2000;

function fmtDur(ms: number) {
  const min = Math.round(ms / 60_000);
  if (min < 60) return `${min} min`;
  return `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, "0")}`;
}

export default function Dashboard() {
  const s = getDashboardStats();
  const q = getQueue();
  const total = s.porEstado.reduce((a, b) => a + b, 0);
  const metaFalaMs = s.settings.meta_minutos_fala * 60_000;
  const maxAtiv = Math.max(1, ...s.atividade.map((a) => a.n));

  return (
    <div className="space-y-6 animate-rise">
      {/* Jornada */}
      <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-[var(--muted)]">Jornada rumo ao B1</p>
            <h1 className="text-3xl font-black tracking-tight">
              Dia {s.dia} <span className="text-[var(--muted)]">/ 365</span>
            </h1>
          </div>
          <p className="flex items-center gap-1.5 text-sm text-[var(--warn)]">
            <Flame size={16} /> {s.sequencia} {s.sequencia === 1 ? "dia seguido" : "dias seguidos"}
          </p>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--line)]">
          <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${(s.dia / 365) * 100}%` }} />
        </div>
        <div className="mt-2 grid grid-cols-4 text-[10px] uppercase tracking-wider text-[var(--muted)]">
          <span>F1 · Som</span>
          <span>F2 · Kana</span>
          <span>F3 · Kanji</span>
          <span>F4 · B1</span>
        </div>
      </section>

      {/* Ação rápida */}
      <section className="grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
        <Link
          href="/study"
          className="group flex items-center gap-4 rounded-2xl bg-[var(--accent)] p-5 text-black transition hover:brightness-110"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-black/15">
            <Mic size={28} />
          </span>
          <span>
            <span className="block text-xl font-black">Iniciar revisão do dia</span>
            <span className="block text-sm font-medium opacity-80">
              {q.dueCount} revisões · {q.newCount} frases novas
              {q.items.length === 0 && " — tudo em dia!"}
            </span>
          </span>
        </Link>
        <Link
          href="/drills"
          className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 hover:border-[var(--accent)]/60"
        >
          <Repeat2 className="text-[var(--accent)]" />
          <span>
            <span className="block font-bold">Ping-Pong</span>
            <span className="block text-xs text-[var(--muted)]">Conjugação no reflexo</span>
          </span>
        </Link>
        <Link
          href="/roleplay"
          className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 hover:border-[var(--accent)]/60"
        >
          <MessagesSquare className="text-[var(--accent)]" />
          <span>
            <span className="block font-bold">Arena</span>
            <span className="block text-xs text-[var(--muted)]">Diálogos guiados + Coach</span>
          </span>
        </Link>
      </section>

      {/* Indicadores */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi
          icon={<Target size={16} />}
          label="Palavras faladas dominadas"
          value={String(s.palavrasDominadas)}
          sub={`${s.palavrasAtivas} em prática · meta B1 ≈ ${META_B1_PALAVRAS.toLocaleString("pt-BR")}`}
          frac={s.palavrasDominadas / META_B1_PALAVRAS}
        />
        <Kpi
          icon={<Waves size={16} />}
          label="Tempo de fala acumulado"
          value={fmtDur(s.falaTotalMs)}
          sub={`hoje ${fmtDur(s.falaHojeMs)} de ${s.settings.meta_minutos_fala} min`}
          frac={metaFalaMs ? s.falaHojeMs / metaFalaMs : 0}
        />
        <Kpi
          icon={<Zap size={16} />}
          label="Retenção FSRS (30 dias)"
          value={s.retencao === null ? "—" : `${Math.round(s.retencao * 100)}%`}
          sub="alvo do agendador: 90%"
          frac={s.retencao ?? 0}
          tone={s.retencao === null ? undefined : s.retencao >= 0.88 ? "ok" : s.retencao >= 0.8 ? "warn" : "bad"}
        />
        <Kpi
          icon={<Timer size={16} />}
          label="Latência média de reflexo"
          value={s.latenciaMedia === null ? "—" : `${(s.latenciaMedia / 1000).toFixed(1)}s`}
          sub="tempo até começar a falar (meta < 2s)"
          frac={s.latenciaMedia === null ? 0 : Math.max(0, 1 - s.latenciaMedia / 5000)}
        />
      </section>

      <div className="grid gap-3 lg:grid-cols-2">
        {/* Estados */}
        <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
          <h2 className="text-sm font-semibold">Baralho ({total} frases)</h2>
          <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-[var(--line)]">
            {[
              { n: s.porEstado[0], c: "bg-slate-500" },
              { n: s.porEstado[1] + s.porEstado[3], c: "bg-[var(--warn)]" },
              { n: s.porEstado[2], c: "bg-[var(--ok)]" },
            ].map((seg, i) => (
              <div key={i} className={seg.c} style={{ width: `${total ? (seg.n / total) * 100 : 0}%` }} />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-4 text-xs text-[var(--muted)]">
            <span>● Novas {s.porEstado[0]}</span>
            <span className="text-[var(--warn)]">● Aprendendo {s.porEstado[1] + s.porEstado[3]}</span>
            <span className="text-[var(--ok)]">● Em revisão {s.porEstado[2]}</span>
          </div>
          <h2 className="mt-5 text-sm font-semibold">Atividade · 14 dias</h2>
          <div className="mt-3 flex h-16 items-end gap-1">
            {s.atividade.map((a) => (
              <div key={a.dia} className="flex flex-1 flex-col items-center gap-1" title={`${a.dia}: ${a.n} exercícios`}>
                <div
                  className={`w-full rounded-sm ${a.n ? "bg-[var(--accent)]" : "bg-[var(--line)]"}`}
                  style={{ height: `${a.n ? 12 + (a.n / maxAtiv) * 52 : 4}px` }}
                />
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">{s.revisoesHoje} revisões hoje</p>
        </section>

        <PhaseCard faseRecomendada={s.faseRecomendada} />
      </div>

      <BackupCard />
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  sub,
  frac,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  frac: number;
  tone?: "ok" | "warn" | "bad";
}) {
  const color = tone ? `var(--${tone})` : "var(--accent)";
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[var(--muted)]">
        {icon} {label}
      </p>
      <p className="mt-2 text-3xl font-black tabular-nums" style={{ color: tone ? color : undefined }}>
        {value}
      </p>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--line)]">
        <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, frac * 100))}%`, background: color }} />
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">{sub}</p>
    </div>
  );
}
