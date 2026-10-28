import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text, index } from "drizzle-orm/sqlite-core";

export const cards = sqliteTable("cards", {
  id: text("id").primaryKey(),
  fase: integer("fase").notNull().default(1),
  tipo: text("tipo", { enum: ["listening", "speaking", "drill_conjugacao"] }).notNull(),
  situacao_pt: text("situacao_pt").notNull(),
  significado_cognitivo: text("significado_cognitivo").notNull(),
  moras_json: text("moras_json").notNull(),
  kana_oculto: text("kana_oculto").notNull(),
  kanji_oculto: text("kanji_oculto").notNull(),
  audio_url: text("audio_url"),
  notas_gramaticais: text("notas_gramaticais").notNull().default(""),
  tags: text("tags").notNull().default(""),
  ordem: integer("ordem").notNull().default(0),
  created_at: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

export const fsrsStates = sqliteTable(
  "fsrs_states",
  {
    card_id: text("card_id")
      .primaryKey()
      .references(() => cards.id, { onDelete: "cascade" }),
    due: integer("due", { mode: "timestamp_ms" }).notNull(),
    stability: real("stability").notNull().default(0),
    stability_fast: real("stability_fast").notNull().default(0),
    difficulty: real("difficulty").notNull().default(0),
    elapsed_days: real("elapsed_days").notNull().default(0),
    scheduled_days: real("scheduled_days").notNull().default(0),
    learning_steps: integer("learning_steps").notNull().default(0),
    reps: integer("reps").notNull().default(0),
    lapses: integer("lapses").notNull().default(0),
    /** 0 New · 1 Learning · 2 Review · 3 Relearning */
    state: integer("state").notNull().default(0),
    schedule_status: text("schedule_status").notNull().default("new"),
    last_review: integer("last_review", { mode: "timestamp_ms" }),
  },
  (t) => [index("fsrs_due_idx").on(t.due)],
);

export const reviewLogs = sqliteTable(
  "review_logs",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    card_id: text("card_id")
      .notNull()
      .references(() => cards.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    state_antes: integer("state_antes").notNull(),
    due_antes: integer("due_antes", { mode: "timestamp_ms" }).notNull(),
    stability: real("stability").notNull(),
    difficulty: real("difficulty").notNull(),
    elapsed_days: real("elapsed_days").notNull(),
    scheduled_days: real("scheduled_days").notNull(),
    /** Latência até o usuário começar a falar (reflexo oral). */
    tempo_resposta_ms: integer("tempo_resposta_ms"),
    duracao_fala_ms: integer("duracao_fala_ms"),
    transcricao: text("transcricao"),
    similaridade: real("similaridade"),
    reviewed_at: integer("reviewed_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [index("review_logs_card_idx").on(t.card_id), index("review_logs_at_idx").on(t.reviewed_at)],
);

export const scenariosRoleplay = sqliteTable("scenarios_roleplay", {
  id: text("id").primaryKey(),
  titulo: text("titulo").notNull(),
  missao_pt: text("missao_pt").notNull(),
  nivel: integer("nivel").notNull().default(1),
  categoria: text("categoria").notNull().default("social"),
  emoji: text("emoji").notNull().default("💬"),
  parceiro_nome: text("parceiro_nome").notNull().default("Parceiro"),
  parceiro_emoji: text("parceiro_emoji").notNull().default("🙂"),
  /** JSON array de card ids */
  vocabulario_requerido_ids: text("vocabulario_requerido_ids").notNull().default("[]"),
  system_prompt_cenario: text("system_prompt_cenario").notNull(),
  /** JSON: roteiro usado quando nenhuma chave de IA está configurada */
  roteiro_offline_json: text("roteiro_offline_json").notNull().default("[]"),
});

export const userSettings = sqliteTable("user_settings", {
  id: integer("id").primaryKey(),
  fase_atual: integer("fase_atual").notNull().default(1),
  meta_novos_dia: integer("meta_novos_dia").notNull().default(8),
  meta_revisoes_dia: integer("meta_revisoes_dia").notNull().default(80),
  meta_minutos_fala: integer("meta_minutos_fala").notNull().default(15),
  data_inicio: integer("data_inicio", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

/** Tempo de fala fora do SRS (drills, roleplay, coach). */
export const speechActivity = sqliteTable("speech_activity", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  modulo: text("modulo", { enum: ["study", "drills", "roleplay", "coach"] }).notNull(),
  duracao_ms: integer("duracao_ms").notNull(),
  acertou: integer("acertou", { mode: "boolean" }),
  created_at: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});
