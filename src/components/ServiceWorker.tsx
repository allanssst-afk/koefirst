"use client";

import { useEffect } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Registra o service worker só no build de produção (no `npm run dev` ele atrapalharia o hot reload). */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      // updateViaCache: "none" → o navegador sempre busca o sw.js novo, então atualizações chegam logo.
      navigator.serviceWorker
        .register(`${BASE}/sw.js`, { scope: `${BASE}/`, updateViaCache: "none" })
        .then((reg) => reg.update())
        .catch(() => {});
    }
  }, []);
  return null;
}
