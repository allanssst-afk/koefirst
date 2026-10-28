// Servidor estático mínimo para testar o build (pasta out/) no Mac: `npm start`.
import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const RAIZ = path.resolve(process.argv[2] ?? "out");
const PORTA = Number(process.env.PORT ?? 3000);
const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".wasm": "application/wasm",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
};

http
  .createServer((req, res) => {
    let arquivo = path.join(RAIZ, decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname));
    if (!arquivo.startsWith(RAIZ)) return res.writeHead(403).end();
    if (fs.existsSync(arquivo) && fs.statSync(arquivo).isDirectory()) arquivo = path.join(arquivo, "index.html");
    if (!fs.existsSync(arquivo)) {
      const pagina404 = path.join(RAIZ, "404.html");
      res.writeHead(404, { "content-type": TIPOS[".html"] });
      return fs.existsSync(pagina404) ? fs.createReadStream(pagina404).pipe(res) : res.end("404");
    }
    res.writeHead(200, { "content-type": TIPOS[path.extname(arquivo)] ?? "application/octet-stream" });
    fs.createReadStream(arquivo).pipe(res);
  })
  .listen(PORTA, () => console.log(`KoeFirst em http://localhost:${PORTA}`));
