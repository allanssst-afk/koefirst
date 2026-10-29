"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LessonPlayer } from "@/components/licao/LessonPlayer";
import { licaoPorId } from "@/lib/trilha";

function Licao() {
  const id = useSearchParams().get("id") ?? "";
  const licao = licaoPorId(id);
  if (!licao || licao.tipo === "dialogo") {
    return (
      <div className="py-16 text-center">
        <p className="text-[var(--muted)]">Lição não encontrada.</p>
        <Link href="/" className="mt-4 inline-block font-bold text-[var(--accent)]">
          Voltar para a trilha
        </Link>
      </div>
    );
  }
  return <LessonPlayer key={licao.id} licao={licao} />;
}

/** /licao?id=u1:l2 — a página é estática; a lição vem da URL. */
export default function LicaoPage() {
  return (
    <Suspense>
      <Licao />
    </Suspense>
  );
}
