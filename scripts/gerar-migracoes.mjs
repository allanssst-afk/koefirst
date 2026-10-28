// Prepara o banco que roda no navegador:
// 1. embute as migrações SQL do drizzle (pasta drizzle/) num módulo TS, no mesmo formato
//    que o migrator do drizzle usa — assim um banco vindo do Mac é reconhecido como já migrado;
// 2. copia o WebAssembly do SQLite (sql.js) para public/.
import crypto from "node:crypto";
import fs from "node:fs";

const journal = JSON.parse(fs.readFileSync("drizzle/meta/_journal.json", "utf8"));
const migracoes = journal.entries.map((e) => {
  const query = fs.readFileSync(`drizzle/${e.tag}.sql`, "utf8");
  return {
    sql: query.split("--> statement-breakpoint"),
    bps: e.breakpoints,
    folderMillis: e.when,
    hash: crypto.createHash("sha256").update(query).digest("hex"),
  };
});

fs.writeFileSync(
  "src/db/migrations.generated.ts",
  `// Gerado por scripts/gerar-migracoes.mjs — não editar à mão.\nexport const MIGRACOES = ${JSON.stringify(migracoes, null, 2)};\n`,
);
fs.copyFileSync("node_modules/sql.js/dist/sql-wasm-browser.wasm", "public/sql-wasm-browser.wasm");
console.log(`✓ ${migracoes.length} migrações embutidas · sql-wasm-browser.wasm copiado`);
