import initSqlJs, { type Database } from "sql.js";
import { drizzle, type SQLJsDatabase } from "drizzle-orm/sql-js";
import { gravarBanco, lerBancoSalvo } from "@/lib/idb";
import { MIGRACOES } from "./migrations.generated";
import * as schema from "./schema";
import { runSeed } from "./seed-run";

/**
 * O banco roda NO NAVEGADOR: SQLite em WebAssembly (sql.js) + Drizzle, salvo no IndexedDB do aparelho.
 * Não há servidor — o app é estático (GitHub Pages) e cada aparelho guarda o próprio progresso.
 */
export type DB = SQLJsDatabase<typeof schema>;

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

let sqlite: Database | null = null;
let db: DB | null = null;
let abrindo: Promise<DB> | null = null;
let timerSalvar: ReturnType<typeof setTimeout> | null = null;

/** Banco já aberto (o PhaseProvider só renderiza as telas depois de `abrirBanco`). */
export function getDb(): DB {
  if (!db) throw new Error("Banco ainda não carregado");
  return db;
}

/** Carrega o SQLite, aplica migrações e atualiza o conteúdo (seed) preservando o progresso. */
export function abrirBanco(): Promise<DB> {
  return (abrindo ??= (async () => {
    const SQL = await initSqlJs({ locateFile: (arquivo) => `${BASE_PATH}/${arquivo}` });
    const salvo = await lerBancoSalvo();
    sqlite = salvo ? new SQL.Database(salvo) : new SQL.Database();
    sqlite.run("PRAGMA foreign_keys = ON");
    db = drizzle(sqlite, { schema });
    // Mesmo formato do migrator do drizzle: um banco vindo do Mac é reconhecido como já migrado.
    const interno = db as unknown as { dialect: { migrate: (m: unknown, s: unknown, c: object) => void }; session: unknown };
    interno.dialect.migrate(MIGRACOES, interno.session, {});
    runSeed(db);
    await gravarBanco(sqlite.export());
    navigator.storage?.persist?.().catch(() => {});
    return db;
  })());
}

/** Grava o banco no IndexedDB logo depois de uma alteração (agrupa gravações seguidas). */
export function salvar() {
  if (timerSalvar) clearTimeout(timerSalvar);
  timerSalvar = setTimeout(() => {
    if (sqlite) gravarBanco(sqlite.export()).catch(() => {});
  }, 200);
}

/** Cópia do banco para backup ou para levar a outro aparelho. */
export function exportarBanco(): Uint8Array {
  if (!sqlite) throw new Error("Banco ainda não carregado");
  return sqlite.export();
}

/** Substitui o banco deste aparelho por um backup (.db). Recarregue a página em seguida. */
export async function importarBanco(bytes: Uint8Array) {
  const cabecalho = new TextDecoder().decode(bytes.slice(0, 15));
  if (cabecalho !== "SQLite format 3") throw new Error("Arquivo não é um banco do KoeFirst (.db)");
  if (timerSalvar) clearTimeout(timerSalvar);
  await gravarBanco(bytes);
}

export { schema };
