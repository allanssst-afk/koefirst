import { and, asc, eq, gte, inArray, lte, ne, sql } from "drizzle-orm";
import { getDb, salvar, schema } from "@/db";
import { reviewCard, type Grade } from "./fsrs";
import { CATEGORIAS, type Categoria } from "./roleplay";
import type { CardDTO, Fase, FsrsStateDTO, QueueItem, SettingsDTO } from "./types";
import type { Mora, Papel } from "./types";

const { cards, fsrsStates, reviewLogs, userSettings, speechActivity, scenariosRoleplay } = schema;

type CardRow = typeof cards.$inferSelect;
type StateRow = typeof fsrsStates.$inferSelect;

export function toCardDTO(r: CardRow): CardDTO {
  return {
    id: r.id,
    fase: r.fase,
    tipo: r.tipo,
    situacao_pt: r.situacao_pt,
    significado_cognitivo: r.significado_cognitivo,
    moras: JSON.parse(r.moras_json) as Mora[],
    kana_oculto: r.kana_oculto,
    kanji_oculto: r.kanji_oculto,
    audio_url: r.audio_url,
    notas_gramaticais: r.notas_gramaticais,
    tags: r.tags ? r.tags.split(",") : [],
  };
}

export function toStateDTO(s: StateRow): FsrsStateDTO {
  return {
    due: s.due.toISOString(),
    stability: s.stability,
    stability_fast: s.stability_fast,
    difficulty: s.difficulty,
    elapsed_days: s.elapsed_days,
    scheduled_days: s.scheduled_days,
    learning_steps: s.learning_steps,
    reps: s.reps,
    lapses: s.lapses,
    state: s.state,
    schedule_status: s.schedule_status,
    last_review: s.last_review ? s.last_review.toISOString() : null,
  };
}

export function getSettings(): SettingsDTO {
  const db = getDb();
  let row = db.select().from(userSettings).where(eq(userSettings.id, 1)).get();
  if (!row) {
    db.insert(userSettings).values({ id: 1 }).onConflictDoNothing().run();
    row = db.select().from(userSettings).where(eq(userSettings.id, 1)).get()!;
  }
  return {
    fase_atual: row.fase_atual as Fase,
    meta_novos_dia: row.meta_novos_dia,
    meta_revisoes_dia: row.meta_revisoes_dia,
    meta_minutos_fala: row.meta_minutos_fala,
    data_inicio: row.data_inicio.toISOString(),
  };
}

export function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Cards marcados com o contexto (tag `ctx:<categoria>`). */
const temContexto = (ctx: Categoria) => sql`(',' || ${cards.tags} || ',') LIKE ${`%,ctx:${ctx},%`}`;

export function isCategoria(v: unknown): v is Categoria {
  return CATEGORIAS.some((c) => c.id === v);
}

/**
 * Fila do dia: revisões vencidas (+ passos de aprendizagem dos próximos 15 min) e novos até a meta.
 * O contexto escolhido filtra só as frases NOVAS; revisões vencidas sempre entram para não atrasar a memória.
 */
export function getQueue(contexto: Categoria | null = null): { items: QueueItem[]; dueCount: number; newCount: number } {
  const db = getDb();
  const settings = getSettings();
  const now = new Date();
  const ahead = new Date(now.getTime() + 15 * 60_000);

  const due = db
    .select()
    .from(fsrsStates)
    .innerJoin(cards, eq(cards.id, fsrsStates.card_id))
    .where(
      and(
        ne(fsrsStates.state, 0),
        sql`(${fsrsStates.due} <= ${now.getTime()} OR (${fsrsStates.state} IN (1,3) AND ${fsrsStates.due} <= ${ahead.getTime()}))`,
      ),
    )
    .orderBy(asc(fsrsStates.due))
    .limit(settings.meta_revisoes_dia)
    .all();

  const newToday =
    db
      .select({ n: sql<number>`count(*)` })
      .from(reviewLogs)
      .where(and(eq(reviewLogs.state_antes, 0), gte(reviewLogs.reviewed_at, startOfToday())))
      .get()?.n ?? 0;
  const newLimit = Math.max(0, settings.meta_novos_dia - newToday);

  const fresh = newLimit
    ? db
        .select()
        .from(fsrsStates)
        .innerJoin(cards, eq(cards.id, fsrsStates.card_id))
        .where(contexto ? and(eq(fsrsStates.state, 0), temContexto(contexto)) : eq(fsrsStates.state, 0))
        .orderBy(asc(cards.ordem))
        .limit(newLimit)
        .all()
    : [];

  // Intercala: 1 novo a cada 3 revisões, para manter o reflexo variado.
  const reviews = due.map((r) => ({ card: toCardDTO(r.cards), fsrs: toStateDTO(r.fsrs_states) }));
  const news = fresh.map((r) => ({ card: toCardDTO(r.cards), fsrs: toStateDTO(r.fsrs_states) }));
  const items: QueueItem[] = [];
  while (reviews.length || news.length) {
    items.push(...reviews.splice(0, 3));
    if (news.length) items.push(news.shift()!);
  }
  return { items, dueCount: due.length, newCount: fresh.length };
}

/** Resumo para a tela de escolha de contexto: revisões vencidas e frases novas por contexto. */
export function getContextSummary() {
  const db = getDb();
  const now = new Date();
  const vencidos =
    db
      .select({ n: sql<number>`count(*)` })
      .from(fsrsStates)
      .where(and(ne(fsrsStates.state, 0), lte(fsrsStates.due, now)))
      .get()?.n ?? 0;
  const novos = (ctx: Categoria | null) =>
    db
      .select({ n: sql<number>`count(*)` })
      .from(fsrsStates)
      .innerJoin(cards, eq(cards.id, fsrsStates.card_id))
      .where(ctx ? and(eq(fsrsStates.state, 0), temContexto(ctx)) : eq(fsrsStates.state, 0))
      .get()?.n ?? 0;
  const { meta_novos_dia } = getSettings();
  const novosHoje =
    db
      .select({ n: sql<number>`count(*)` })
      .from(reviewLogs)
      .where(and(eq(reviewLogs.state_antes, 0), gte(reviewLogs.reviewed_at, startOfToday())))
      .get()?.n ?? 0;
  return {
    vencidos,
    novosRestantesHoje: Math.max(0, meta_novos_dia - novosHoje),
    novosPorContexto: Object.fromEntries([
      ["todos", novos(null)],
      ...CATEGORIAS.map((c) => [c.id, novos(c.id)]),
    ]) as Record<Categoria | "todos", number>,
  };
}

const NAO_CONTA: Papel[] = ["particula", "copula"];

function wordsOf(rows: { moras_json: string }[]) {
  const set = new Set<string>();
  for (const r of rows) {
    for (const m of JSON.parse(r.moras_json) as Mora[]) {
      if (!m.papel || !NAO_CONTA.includes(m.papel)) set.add(m.bloco);
    }
  }
  return set;
}

/** Vocabulário que o usuário já praticou (base do Roleplay). */
export function getLearnedVocab() {
  const db = getDb();
  return db
    .select({ id: cards.id, kana: cards.kana_oculto, pt: cards.significado_cognitivo, situacao: cards.situacao_pt })
    .from(cards)
    .innerJoin(fsrsStates, eq(fsrsStates.card_id, cards.id))
    .where(gte(fsrsStates.reps, 1))
    .orderBy(asc(cards.ordem))
    .all();
}

export function getScenarios() {
  const db = getDb();
  return db.select().from(scenariosRoleplay).orderBy(asc(scenariosRoleplay.nivel), asc(scenariosRoleplay.id)).all();
}

export function getCardsByIds(ids: string[]) {
  if (!ids.length) return [];
  return getDb().select().from(cards).where(inArray(cards.id, ids)).all().map(toCardDTO);
}

export function getAllCards() {
  return getDb().select().from(cards).orderBy(asc(cards.ordem)).all().map(toCardDTO);
}

export function getDashboardStats() {
  const db = getDb();
  const settings = getSettings();
  const now = new Date();
  const DAY = 86_400_000;

  const dia = Math.min(365, Math.floor((now.getTime() - new Date(settings.data_inicio).getTime()) / DAY) + 1);
  const faseRecomendada = (dia <= 90 ? 1 : dia <= 180 ? 2 : dia <= 270 ? 3 : 4) as Fase;

  const dominados = db
    .select({ moras_json: cards.moras_json })
    .from(cards)
    .innerJoin(fsrsStates, eq(fsrsStates.card_id, cards.id))
    .where(and(eq(fsrsStates.state, 2), gte(fsrsStates.stability, 21)))
    .all();
  const ativos = db
    .select({ moras_json: cards.moras_json })
    .from(cards)
    .innerJoin(fsrsStates, eq(fsrsStates.card_id, cards.id))
    .where(gte(fsrsStates.reps, 1))
    .all();

  const estados = db
    .select({ state: fsrsStates.state, n: sql<number>`count(*)` })
    .from(fsrsStates)
    .groupBy(fsrsStates.state)
    .all();
  const porEstado = [0, 1, 2, 3].map((s) => estados.find((e) => e.state === s)?.n ?? 0);

  const falaSrs =
    db.select({ ms: sql<number>`coalesce(sum(${reviewLogs.duracao_fala_ms}),0)` }).from(reviewLogs).get()?.ms ?? 0;
  const falaOutros =
    db.select({ ms: sql<number>`coalesce(sum(${speechActivity.duracao_ms}),0)` }).from(speechActivity).get()?.ms ?? 0;
  const hoje = startOfToday();
  const falaHoje =
    (db
      .select({ ms: sql<number>`coalesce(sum(${reviewLogs.duracao_fala_ms}),0)` })
      .from(reviewLogs)
      .where(gte(reviewLogs.reviewed_at, hoje))
      .get()?.ms ?? 0) +
    (db
      .select({ ms: sql<number>`coalesce(sum(${speechActivity.duracao_ms}),0)` })
      .from(speechActivity)
      .where(gte(speechActivity.created_at, hoje))
      .get()?.ms ?? 0);

  const desde30 = new Date(now.getTime() - 30 * DAY);
  const ret = db
    .select({
      total: sql<number>`count(*)`,
      ok: sql<number>`sum(case when ${reviewLogs.rating} > 1 then 1 else 0 end)`,
    })
    .from(reviewLogs)
    .where(and(eq(reviewLogs.state_antes, 2), gte(reviewLogs.reviewed_at, desde30)))
    .get();
  const retencao = ret && ret.total > 0 ? ret.ok / ret.total : null;

  const latencia = db
    .select({ avg: sql<number | null>`avg(${reviewLogs.tempo_resposta_ms})` })
    .from(reviewLogs)
    .where(and(gte(reviewLogs.reviewed_at, desde30), sql`${reviewLogs.tempo_resposta_ms} is not null`))
    .get()?.avg;

  const revisoesHoje =
    db.select({ n: sql<number>`count(*)` }).from(reviewLogs).where(gte(reviewLogs.reviewed_at, hoje)).get()?.n ?? 0;

  // Atividade dos últimos 14 dias (revisões + exercícios de fala)
  const desde14 = new Date(hoje.getTime() - 13 * DAY);
  const diasLog = db
    .select({ d: sql<string>`date(${reviewLogs.reviewed_at} / 1000, 'unixepoch', 'localtime')`, n: sql<number>`count(*)` })
    .from(reviewLogs)
    .where(gte(reviewLogs.reviewed_at, desde14))
    .groupBy(sql`1`)
    .all();
  const diasFala = db
    .select({ d: sql<string>`date(${speechActivity.created_at} / 1000, 'unixepoch', 'localtime')`, n: sql<number>`count(*)` })
    .from(speechActivity)
    .where(gte(speechActivity.created_at, desde14))
    .groupBy(sql`1`)
    .all();
  const atividade = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(desde14.getTime() + i * DAY);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const n = (diasLog.find((x) => x.d === key)?.n ?? 0) + (diasFala.find((x) => x.d === key)?.n ?? 0);
    return { dia: key, n };
  });
  let sequencia = 0;
  for (let i = atividade.length - 1; i >= 0; i--) {
    if (atividade[i].n > 0) sequencia++;
    else if (i === atividade.length - 1) continue; // hoje ainda sem atividade não quebra a sequência
    else break;
  }

  const vencidos =
    db
      .select({ n: sql<number>`count(*)` })
      .from(fsrsStates)
      .where(and(ne(fsrsStates.state, 0), lte(fsrsStates.due, now)))
      .get()?.n ?? 0;

  return {
    settings,
    dia,
    faseRecomendada,
    palavrasDominadas: wordsOf(dominados).size,
    palavrasAtivas: wordsOf(ativos).size,
    porEstado,
    falaTotalMs: falaSrs + falaOutros,
    falaHojeMs: falaHoje,
    retencao,
    latenciaMedia: latencia ?? null,
    revisoesHoje,
    vencidos,
    atividade,
    sequencia,
  };
}

// ───────────────────────── Gravações (substituem a antiga API do servidor)

export interface RevisaoInput {
  card_id: string;
  rating: Grade;
  tempo_resposta_ms?: number | null;
  duracao_fala_ms?: number | null;
  transcricao?: string | null;
  similaridade?: number | null;
}

/** Aplica a nota FSRS ao card e registra o histórico da revisão. */
export async function salvarRevisao(r: RevisaoInput) {
  const db = getDb();
  const row = db.select().from(fsrsStates).where(eq(fsrsStates.card_id, r.card_id)).get();
  if (!row) throw new Error("card não encontrado");
  const before = toStateDTO(row);
  const now = new Date();
  const next = await reviewCard(r.card_id, before, r.rating, now);

  db.transaction((tx) => {
    tx.update(fsrsStates)
      .set({
        due: new Date(next.due),
        stability: next.stability,
        stability_fast: next.stability_fast,
        difficulty: next.difficulty,
        elapsed_days: next.elapsed_days,
        scheduled_days: next.scheduled_days,
        learning_steps: next.learning_steps,
        reps: next.reps,
        lapses: next.lapses,
        state: next.state,
        schedule_status: next.schedule_status,
        last_review: next.last_review ? new Date(next.last_review) : null,
      })
      .where(eq(fsrsStates.card_id, r.card_id))
      .run();
    tx.insert(reviewLogs)
      .values({
        card_id: r.card_id,
        rating: r.rating,
        state_antes: before.state,
        due_antes: new Date(before.due),
        stability: next.stability,
        difficulty: next.difficulty,
        elapsed_days: next.elapsed_days,
        scheduled_days: next.scheduled_days,
        tempo_resposta_ms: r.tempo_resposta_ms ?? null,
        duracao_fala_ms: r.duracao_fala_ms ?? null,
        transcricao: r.transcricao ?? null,
        similaridade: r.similaridade ?? null,
        reviewed_at: now,
      })
      .run();
  });
  salvar();
  return next;
}

/** Tempo de fala fora do SRS (drills, roleplay, coach, repetições da etapa Aprender). */
export function registrarAtividade(modulo: "study" | "drills" | "roleplay" | "coach", duracao_ms: number, acertou: boolean | null = null) {
  const ms = Math.round(duracao_ms);
  if (!Number.isFinite(ms) || ms < 0 || ms > 120_000) return;
  getDb().insert(speechActivity).values({ modulo, duracao_ms: ms, acertou }).run();
  salvar();
}

const clampInt = (v: unknown, min: number, max: number) =>
  typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : undefined;

export function atualizarConfig(patch: Partial<Omit<SettingsDTO, "data_inicio">>): SettingsDTO {
  getSettings(); // garante a linha
  const set = Object.fromEntries(
    Object.entries({
      fase_atual: clampInt(patch.fase_atual, 1, 4),
      meta_novos_dia: clampInt(patch.meta_novos_dia, 0, 100),
      meta_revisoes_dia: clampInt(patch.meta_revisoes_dia, 0, 1000),
      meta_minutos_fala: clampInt(patch.meta_minutos_fala, 0, 240),
    }).filter(([, v]) => v !== undefined),
  );
  if (Object.keys(set).length) {
    getDb().update(userSettings).set(set).where(eq(userSettings.id, 1)).run();
    salvar();
  }
  return getSettings();
}

// ───────────────────────── Coach offline: "como eu digo…?" → frase mais parecida do baralho

const STOP = new Set(
  "como eu digo dizer de da do das dos a o as os um uma e que para pra em no na com por se quero falar japones japonês é ser".split(" "),
);
const normPt = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ");

export function fraseMaisProxima(pergunta: string): CardDTO | null {
  const palavras = normPt(pergunta)
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
  if (!palavras.length) return null;
  let melhor: { pontos: number; card: CardDTO } | null = null;
  for (const card of getAllCards()) {
    const texto = normPt(`${card.situacao_pt} ${card.significado_cognitivo} ${card.moras.map((m) => m.funcao).join(" ")}`);
    const pontos = palavras.reduce((n, w) => n + (texto.includes(w.slice(0, Math.max(4, w.length - 2))) ? 1 : 0), 0);
    if (pontos > (melhor?.pontos ?? 0)) melhor = { pontos, card };
  }
  return melhor?.card ?? null;
}


// ───────────────────────── Trilha (lições, XP, sequência)

/** Registra a lição feita e agenda no FSRS as frases que ela apresentou pela primeira vez. */
export async function concluirLicao(licaoId: string, xp: number, acertos: number, total: number, cardsApresentados: string[] = []) {
  const db = getDb();
  db.insert(schema.licaoLog).values({ licao_id: licaoId, xp, acertos, total }).run();
  for (const id of cardsApresentados) {
    const st = db.select({ state: fsrsStates.state }).from(fsrsStates).where(eq(fsrsStates.card_id, id)).get();
    if (st?.state === 0) await salvarRevisao({ card_id: id, rating: 3 });
  }
  salvar();
}

export function getProgressoTrilha() {
  const db = getDb();
  const { licaoLog } = schema;
  const feitas = new Set(db.selectDistinct({ id: licaoLog.licao_id }).from(licaoLog).all().map((r) => r.id));
  const xpTotal = db.select({ n: sql<number>`coalesce(sum(${licaoLog.xp}),0)` }).from(licaoLog).get()?.n ?? 0;
  const xpHoje =
    db
      .select({ n: sql<number>`coalesce(sum(${licaoLog.xp}),0)` })
      .from(licaoLog)
      .where(gte(licaoLog.created_at, startOfToday()))
      .get()?.n ?? 0;
  return { feitas, xpTotal, xpHoje, sequencia: diasSeguidos() };
}

/** Dias seguidos com qualquer estudo (lição, revisão ou fala), contando até hoje (ou ontem, se hoje ainda não). */
export function diasSeguidos(): number {
  const db = getDb();
  const dia = (col: unknown) => sql<string>`date(${col} / 1000, 'unixepoch', 'localtime')`;
  const dias = new Set<string>([
    ...db.selectDistinct({ d: dia(schema.licaoLog.created_at) }).from(schema.licaoLog).all().map((r) => r.d),
    ...db.selectDistinct({ d: dia(reviewLogs.reviewed_at) }).from(reviewLogs).all().map((r) => r.d),
    ...db.selectDistinct({ d: dia(speechActivity.created_at) }).from(speechActivity).all().map((r) => r.d),
  ]);
  const chave = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const d = new Date();
  if (!dias.has(chave(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (dias.has(chave(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
