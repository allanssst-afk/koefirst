"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, MessagesSquare, Mic, Repeat2, UserRound } from "lucide-react";
import { stopAll } from "@/lib/audio/tts";

const ABAS = [
  { href: "/", label: "Aprender", icon: House },
  { href: "/study", label: "Revisar", icon: Mic },
  { href: "/drills", label: "Praticar", icon: Repeat2 },
  { href: "/roleplay", label: "Conversar", icon: MessagesSquare },
  { href: "/perfil", label: "Perfil", icon: UserRound },
];

/** Abas no rodapé (celular) e no topo (telas largas); somem durante uma lição. */
export function NavBar() {
  const path = usePathname();
  // Trocar de tela corta qualquer frase que ainda esteja tocando.
  useEffect(() => stopAll, [path]);
  if (path.startsWith("/licao")) return null;
  const ativa = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <>
      <header className="sticky top-0 z-30 hidden border-b border-[var(--line)] bg-[var(--bg)]/95 backdrop-blur md:block">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-1 px-4">
          <Link href="/" className="mr-6 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight">
              koe<span className="text-[var(--accent)]">first</span>
            </span>
            <span className="font-jp text-xs text-[var(--muted)]">声ファースト</span>
          </Link>
          {ABAS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className={`relative flex h-16 items-center gap-2 px-3 text-sm font-semibold ${
                ativa(a.href) ? "text-[var(--fg)]" : "text-[var(--muted)] hover:text-[var(--fg)]"
              }`}
            >
              <a.icon size={18} className={ativa(a.href) ? "text-[var(--accent)]" : ""} /> {a.label}
              {ativa(a.href) && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[var(--accent)]" />}
            </Link>
          ))}
        </div>
      </header>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-[var(--line)] bg-[var(--bg)]/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {ABAS.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            aria-label={a.label}
            className={`flex flex-col items-center gap-1 py-2 text-[11px] font-semibold ${
              ativa(a.href) ? "text-[var(--fg)]" : "text-[var(--muted)]"
            }`}
          >
            <span
              className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
                ativa(a.href) ? "bg-[var(--accent)]/15 text-[var(--accent)]" : ""
              }`}
            >
              <a.icon size={22} />
            </span>
            {a.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
