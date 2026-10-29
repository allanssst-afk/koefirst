import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { NavBar } from "@/components/NavBar";
import { PhaseProvider } from "@/components/PhaseProvider";
import { ServiceWorker } from "@/components/ServiceWorker";
import "./globals.css";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// fonte arredondada e amigável, empacotada no build (funciona offline)
const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "700", "800", "900"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "KoeFirst 声ファースト",
  description: "Japonês do zero ao B1 com oralidade primeiro, compreensão cognitiva e FSRS.",
  appleWebApp: { capable: true, title: "KoeFirst", statusBarStyle: "black-translucent" },
  icons: { icon: `${BASE}/icon.svg`, apple: `${BASE}/icon.svg` },
};

export const viewport: Viewport = {
  themeColor: "#131f24",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={nunito.variable}>
      <body className="min-h-dvh">
        <PhaseProvider>
          <NavBar />
          <main className="mx-auto max-w-5xl px-4 pb-28 pt-5 md:pb-12">{children}</main>
        </PhaseProvider>
        <ServiceWorker />
      </body>
    </html>
  );
}
