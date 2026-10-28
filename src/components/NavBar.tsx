"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gauge, Mic, MessagesSquare, Repeat2 } from "lucide-react";
import { PhaseSelector } from "./PhaseProvider";

const LINKS = [
  { href: "/", label: "Comando", icon: Gauge },
  { href: "/study", label: "Estúdio", icon: Mic },
  { href: "/drills", label: "Drills", icon: Repeat2 },
  { href: "/roleplay", label: "Arena", icon: MessagesSquare },
];

export function NavBar() {
  const path = usePathname();
  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--bg)]/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="text-lg font-black tracking-tight">KoeFirst</span>
            <span className="font-jp text-xs text-[var(--muted)]">声ファースト</span>
          </Link>
          <nav className="ml-4 hidden gap-1 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                  isActive(l.href) ? "bg-white/10 text-[var(--fg)]" : "text-[var(--muted)] hover:text-[var(--fg)]"
                }`}
              >
                <l.icon size={16} /> {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto w-44 sm:w-64">
            <PhaseSelector compact />
          </div>
        </div>
      </header>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-[var(--line)] bg-[var(--bg)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex flex-col items-center gap-0.5 py-2 text-[11px] ${
              isActive(l.href) ? "text-[var(--accent)]" : "text-[var(--muted)]"
            }`}
          >
            <l.icon size={20} />
            {l.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
