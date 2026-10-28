import type { NextConfig } from "next";

// No GitHub Pages o app fica em https://<usuário>.github.io/<repositório>/ → NEXT_PUBLIC_BASE_PATH=/<repositório>
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Site 100% estático: o banco roda no navegador (sql.js + IndexedDB), sem servidor.
  output: "export",
  basePath: BASE || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  // NEXT_DIST_DIR permite testar um build em outra pasta sem atrapalhar o `npm run dev`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
