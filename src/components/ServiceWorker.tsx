"use client";

import { useEffect } from "react";
import { eApp } from "@/lib/audio/nativo";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Registra o service worker só no build de produção (no `npm run dev` ele atrapalharia o hot reload). */
export function ServiceWorker() {
  useEffect(() => {
    // no APK os arquivos já estão no aparelho: o service worker só atrapalharia as atualizações
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator && !eApp()) {
      // updateViaCache: "none" → o navegador sempre busca o sw.js novo, então atualizações chegam logo.
      navigator.serviceWorker
        .register(`${BASE}/sw.js`, { scope: `${BASE}/`, updateViaCache: "none" })
        .then((reg) => reg.update())
        .catch(() => {});
    }
  }, []);
  return null;
}
