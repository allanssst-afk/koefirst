CREATE TABLE `cards` (
	`id` text PRIMARY KEY NOT NULL,
	`fase` integer DEFAULT 1 NOT NULL,
	`tipo` text NOT NULL,
	`situacao_pt` text NOT NULL,
	`significado_cognitivo` text NOT NULL,
	`moras_json` text NOT NULL,
	`kana_oculto` text NOT NULL,
	`kanji_oculto` text NOT NULL,
	`audio_url` text,
	`notas_gramaticais` text DEFAULT '' NOT NULL,
	`tags` text DEFAULT '' NOT NULL,
	`ordem` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `fsrs_states` (
	`card_id` text PRIMARY KEY NOT NULL,
	`due` integer NOT NULL,
	`stability` real DEFAULT 0 NOT NULL,
	`stability_fast` real DEFAULT 0 NOT NULL,
	`difficulty` real DEFAULT 0 NOT NULL,
	`elapsed_days` real DEFAULT 0 NOT NULL,
	`scheduled_days` real DEFAULT 0 NOT NULL,
	`learning_steps` integer DEFAULT 0 NOT NULL,
	`reps` integer DEFAULT 0 NOT NULL,
	`lapses` integer DEFAULT 0 NOT NULL,
	`state` integer DEFAULT 0 NOT NULL,
	`schedule_status` text DEFAULT 'new' NOT NULL,
	`last_review` integer,
	FOREIGN KEY (`card_id`) REFERENCES `cards`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `fsrs_due_idx` ON `fsrs_states` (`due`);--> statement-breakpoint
CREATE TABLE `review_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`card_id` text NOT NULL,
	`rating` integer NOT NULL,
	`state_antes` integer NOT NULL,
	`due_antes` integer NOT NULL,
	`stability` real NOT NULL,
	`difficulty` real NOT NULL,
	`elapsed_days` real NOT NULL,
	`scheduled_days` real NOT NULL,
	`tempo_resposta_ms` integer,
	`duracao_fala_ms` integer,
	`transcricao` text,
	`similaridade` real,
	`reviewed_at` integer NOT NULL,
	FOREIGN KEY (`card_id`) REFERENCES `cards`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `review_logs_card_idx` ON `review_logs` (`card_id`);--> statement-breakpoint
CREATE INDEX `review_logs_at_idx` ON `review_logs` (`reviewed_at`);--> statement-breakpoint
CREATE TABLE `scenarios_roleplay` (
	`id` text PRIMARY KEY NOT NULL,
	`titulo` text NOT NULL,
	`missao_pt` text NOT NULL,
	`nivel` integer DEFAULT 1 NOT NULL,
	`vocabulario_requerido_ids` text DEFAULT '[]' NOT NULL,
	`system_prompt_cenario` text NOT NULL,
	`roteiro_offline_json` text DEFAULT '[]' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `speech_activity` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`modulo` text NOT NULL,
	`duracao_ms` integer NOT NULL,
	`acertou` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`fase_atual` integer DEFAULT 1 NOT NULL,
	`meta_novos_dia` integer DEFAULT 8 NOT NULL,
	`meta_revisoes_dia` integer DEFAULT 80 NOT NULL,
	`meta_minutos_fala` integer DEFAULT 15 NOT NULL,
	`data_inicio` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
