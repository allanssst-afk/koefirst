"use client";

import type { Grade } from "@/lib/fsrs";

const BUTTONS: { grade: Grade; label: string; hint: string; cls: string }[] = [
  { grade: 1, label: "Again", hint: "Errei / travei", cls: "border-[var(--bad)] text-[var(--bad)]" },
  { grade: 2, label: "Hard", hint: "Hesitei muito", cls: "border-[var(--warn)] text-[var(--warn)]" },
  { grade: 3, label: "Good", hint: "Respondi no tempo", cls: "border-[var(--ok)] text-[var(--ok)]" },
  { grade: 4, label: "Easy", hint: "Reflexo instantâneo", cls: "border-sky-400 text-sky-300" },
];

export function RatingButtons({
  intervals,
  suggested,
  disabled,
  onRate,
}: {
  intervals: Record<Grade, string> | null;
  suggested?: Grade | null;
  disabled?: boolean;
  onRate: (g: Grade) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {BUTTONS.map((b) => (
        <button
          key={b.grade}
          disabled={disabled}
          onClick={() => onRate(b.grade)}
          className={`relative rounded-xl border bg-[var(--panel)] px-1 py-2.5 text-center transition hover:bg-white/5 disabled:opacity-40 ${b.cls} ${
            suggested === b.grade ? "ring-2 ring-current ring-offset-2 ring-offset-[var(--bg)]" : ""
          }`}
        >
          <span className="block text-[11px] font-mono text-[var(--muted)]">{intervals?.[b.grade] ?? "…"}</span>
          <span className="block text-sm font-bold">{b.label}</span>
          <span className="block text-[10px] leading-tight text-[var(--muted)]">{b.hint}</span>
          <kbd className="absolute right-1.5 top-1 hidden text-[9px] text-[var(--muted)] sm:block">{b.grade}</kbd>
        </button>
      ))}
    </div>
  );
}
