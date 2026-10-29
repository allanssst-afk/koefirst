CREATE TABLE `licao_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`licao_id` text NOT NULL,
	`xp` integer DEFAULT 0 NOT NULL,
	`acertos` integer DEFAULT 0 NOT NULL,
	`total` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
