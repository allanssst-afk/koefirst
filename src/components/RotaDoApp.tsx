"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { eApp } from "@/lib/audio/nativo";

/**
 * APK: o servidor interno do Capacitor responde qualquer caminho sem extensão com o index.html da raiz. Se a tela
 * inicial abrir com outro endereço (página recarregada), leva o app para a página certa pela navegação do Next.
 * Fica só na tela inicial.
 */
export function RotaDoApp() {
  const router = useRouter();
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const caminho = location.pathname.slice(base.length) || "/";
    if (eApp() && caminho !== "/") router.replace(caminho + location.search);
  }, [router]);
  return null;
}
