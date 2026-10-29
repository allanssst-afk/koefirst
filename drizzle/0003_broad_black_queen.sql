CREATE TABLE `kana_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kana` text NOT NULL,
	`modo` text NOT NULL,
	`acertou` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
