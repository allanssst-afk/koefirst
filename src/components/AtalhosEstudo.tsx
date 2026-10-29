import Link from "next/link";
import { BookA, PenLine } from "lucide-react";

const ATALHOS = [
  { href: "/dicionario", nome: "Dicionário", sub: "Palavras e frases", icone: <BookA className="text-[var(--azul)]" /> },
  { href: "/escrita", nome: "Kana", sub: "Tabela, caligrafia, quiz", icone: <PenLine className="text-[var(--accent)]" /> },
  { href: "/kanji", nome: "Kanji", sub: "Sentido, leitura, traços", icone: <span className="font-jp text-xl leading-none text-[var(--pitch)]">字</span> },
];

/** Atalhos para o Dicionário, a Escrita de kana e os Kanji (Perfil e Praticar). */
export function AtalhosEstudo() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {ATALHOS.map((a) => (
        <Link key={a.href} href={a.href} className="btn btn-secundario flex flex-col gap-1.5 rounded-2xl p-3">
          <span className="flex h-6 items-center">{a.icone}</span>
          <span className="block font-bold leading-tight">{a.nome}</span>
          <span className="block text-[11px] leading-tight text-[var(--muted)]">{a.sub}</span>
        </Link>
      ))}
    </div>
  );
}
