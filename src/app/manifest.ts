import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KoeFirst 声ファースト",
    short_name: "KoeFirst",
    description: "Japonês oral primeiro: reflexo de fala, pitch accent e FSRS.",
    start_url: `${BASE}/`,
    scope: `${BASE}/`,
    display: "standalone",
    background_color: "#131f24",
    theme_color: "#131f24",
    lang: "pt-BR",
    icons: [{ src: `${BASE}/icon.svg`, sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
