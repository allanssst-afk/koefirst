// KoeFirst service worker — app estático (GitHub Pages) que funciona offline.
// Regras: páginas = rede primeiro (cópia em cache só sem internet); arquivos com hash (/_next/static) e o
// SQLite em WebAssembly = cache primeiro. Nunca devolver HTML no lugar de JS/WASM (isso quebrava o app).
const CACHE = "koefirst-v3";
const BASE = new URL(self.registration.scope).pathname.replace(/\/$/, "");
const PAGINAS = ["/", "/study/", "/drills/", "/roleplay/"].map((p) => BASE + p);

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll([...PAGINAS, `${BASE}/sql-wasm-browser.wasm`]))
      .catch(() => {})
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const guardar = (req, res) => {
  if (res.ok) {
    const copia = res.clone();
    caches.open(CACHE).then((c) => c.put(req, copia));
  }
  return res;
};

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;

  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => guardar(req, res))
        .catch(() => caches.match(req).then((r) => r || caches.match(`${BASE}/`))),
    );
    return;
  }

  const imutavel = url.pathname.startsWith(`${BASE}/_next/static/`) || url.pathname.endsWith(".wasm");
  if (imutavel) {
    e.respondWith(caches.match(req).then((r) => r || fetch(req).then((res) => guardar(req, res))));
  }
  // demais arquivos: rede normal (sem fallback)
});
