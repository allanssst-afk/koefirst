import Link from "next/link";
import { BookA, PenLine } from "lucide-react";

/** Atalhos para o Dicionário e para a Escrita japonesa (Perfil e Praticar). */
export function AtalhosEstudo() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Link href="/dicionario" className="btn btn-secundario flex items-center gap-3 rounded-2xl p-3">
        <BookA className="shrink-0 text-[var(--azul)]" />
        <span className="min-w-0">
          <span className="block font-bold">Dicionário</span>
          <span className="block text-xs text-[var(--muted)]">Palavras e frases com som</span>
        </span>
      </Link>
      <Link href="/escrita" className="btn btn-secundario flex items-center gap-3 rounded-2xl p-3">
        <PenLine className="shrink-0 text-[var(--accent)]" />
        <span className="min-w-0">
          <span className="block font-bold">Escrita</span>
          <span className="block text-xs text-[var(--muted)]">Kana, caligrafia e quiz</span>
        </span>
      </Link>
    </div>
  );
}
