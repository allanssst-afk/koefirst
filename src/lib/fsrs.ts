import { DefaultScheduler, Rating } from "ts-fsrs";
import type { FsrsStateDTO } from "./types";

export { Rating };
export type Grade = 1 | 2 | 3 | 4;

/** Configuração única do FSRS (retenção alvo 90%). Usada no servidor e no cliente. */
function createScheduler() {
  return DefaultScheduler({
    desiredRetention: 0.9,
    enableShortTerm: true,
    learningSteps: ["1m", "10m"],
    relearningSteps: ["10m"],
    // Frases novas de fala precisam voltar em minutos: não deixa o FSRS-7 pular os passos.
    allowModelOverride: false,
    enableFuzz: true,
    maximumInterval: 36_500,
  });
}

type Scheduler = Awaited<ReturnType<typeof createScheduler>>;
type SchedulerCard = ReturnType<Scheduler["newCard"]>;

let schedulerPromise: Promise<Scheduler> | null = null;
export function getScheduler(): Promise<Scheduler> {
  return (schedulerPromise ??= createScheduler());
}

const DAY = 86_400_000;

export function toSchedulerCard(cardId: string, s: FsrsStateDTO): SchedulerCard {
  return {
    cardId,
    stability: s.stability,
    stabilityFast: s.stability_fast,
    difficulty: s.difficulty,
    state: s.state,
    scheduleStatus: s.schedule_status,
    dueAt: new Date(s.due),
    lastReviewAt: s.last_review ? new Date(s.last_review) : null,
    reps: s.reps,
    lapses: s.lapses,
    scheduledDays: s.scheduled_days,
    learningStep: s.learning_steps,
  } as SchedulerCard;
}

export function fromSchedulerCard(c: SchedulerCard, now: Date): FsrsStateDTO {
  const last = c.lastReviewAt ? new Date(c.lastReviewAt) : null;
  return {
    due: new Date(c.dueAt).toISOString(),
    stability: c.stability,
    stability_fast: (c as { stabilityFast?: number }).stabilityFast ?? 0,
    difficulty: c.difficulty,
    elapsed_days: last ? Math.max(0, (now.getTime() - last.getTime()) / DAY) : 0,
    scheduled_days: c.scheduledDays,
    learning_steps: c.learningStep,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state,
    schedule_status: String(c.scheduleStatus),
    last_review: last ? last.toISOString() : null,
  };
}

export async function reviewCard(cardId: string, s: FsrsStateDTO, grade: Grade, now = new Date()) {
  const scheduler = await getScheduler();
  const result = scheduler.review({ card: toSchedulerCard(cardId, s), grade, now });
  return fromSchedulerCard(result.card, now);
}

/** Próximo intervalo de cada botão (Again/Hard/Good/Easy) formatado. */
export async function previewIntervals(cardId: string, s: FsrsStateDTO, now = new Date()) {
  const scheduler = await getScheduler();
  const out: Record<Grade, string> = { 1: "", 2: "", 3: "", 4: "" };
  for (const p of scheduler.preview({ card: toSchedulerCard(cardId, s), now })) {
    out[p.grade as Grade] = formatInterval(new Date(p.card.dueAt).getTime() - now.getTime());
  }
  return out;
}

export function formatInterval(ms: number): string {
  const min = Math.max(1, Math.round(ms / 60_000));
  if (min < 60) return `${min}min`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(ms / DAY);
  if (d < 31) return `${d}d`;
  if (d < 365) return `${Math.round(d / 30)}mês`;
  return `${(d / 365).toFixed(1)}a`;
}
