"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, MessagesSquare, Mic, Repeat2, UserRound } from "lucide-react";

const ABAS = [
  { href: "/", label: "Aprender", icon: House, cor: "#58cc02" },
  { href: "/study", label: "Revisar", icon: Mic, cor: "#1cb0f6" },
  { href: "/drills", label: "Praticar", icon: Repeat2, cor: "#ff9600" },
  { href: "/roleplay", label: "Conversar", icon: MessagesSquare, cor: "#ce82ff" },
  { href: "/perfil", label: "Perfil", icon: UserRound, cor: "#ff86d0" },
];

/** Abas no rodapé (celular) e no topo (telas largas); somem durante uma lição. */
export function NavBar() {
  const path = usePathname();
  if (path.startsWith("/licao")) return null;
  const ativa = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <>
      <header className="sticky top-0 z-30 hidden border-b-2 border-[var(--line)] bg-[var(--bg)] md:block">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-2 px-4">
          <Link href="/" className="mr-4 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-[var(--accent)]">koefirst</span>
            <span className="font-jp text-xs text-[var(--muted)]">声ファースト</span>
          </Link>
          {ABAS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-extrabold uppercase tracking-wide ${
                ativa(a.href) ? "border-[var(--azul)] bg-[var(--azul)]/10 text-[var(--azul)]" : "border-transparent text-[var(--muted)]"
              }`}
            >
              <a.icon size={20} style={{ color: a.cor }} /> {a.label}
            </Link>
          ))}
        </div>
      </header>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t-2 border-[var(--line)] bg-[var(--bg)] px-1 pb-[env(safe-area-inset-bottom)] pt-1 md:hidden">
        {ABAS.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            aria-label={a.label}
            className={`mx-1 my-1 flex flex-col items-center gap-0.5 rounded-xl border-2 py-1.5 text-[10px] font-extrabold uppercase ${
              ativa(a.href) ? "border-[var(--azul)] bg-[var(--azul)]/10 text-[var(--azul)]" : "border-transparent text-[var(--muted)]"
            }`}
          >
            <a.icon size={24} style={{ color: a.cor }} />
            {a.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
