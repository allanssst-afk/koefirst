"use client";

import { useState, type ReactNode } from "react";
import { Snail, Volume2 } from "lucide-react";
import { speakJa } from "@/lib/audio/tts";
import { Mascote } from "../Mascote";

/** Resultado de um exercício, mostrado no painel de baixo (verde/vermelho). */
export interface Resposta {
  ok: boolean;
  /** resposta certa em texto (aparece quando erra) */
  correta?: string;
  /** lógica literal da frase (ordem japonesa), mostrada no painel com acerto ou erro */
  literal?: string;
  /** frase japonesa (kana) para ouvir no painel de resposta */
  ouvir?: string;
}

/** Contrato dos exercícios com o player da lição. */
export interface ExProps<E> {
  ex: E;
  /** depois de verificar, o exercício fica travado */
  travado: boolean;
  /** registra como verificar a resposta atual (null = ainda não dá para verificar) */
  aoPronto: (verificar: (() => Resposta) | null) => void;
  /** para exercícios que se avaliam sozinhos (fala) */
  aoResponder: (r: Resposta) => void;
  /** pula sem contar acerto nem erro ("não posso falar agora") */
  aoPular: () => void;
}

/** Botão azul de áudio (normal) e o botão da tartaruga… aqui um caracol (devagar). */
export function BotoesSom({ texto, grande = false, aoTocar }: { texto: string; grande?: boolean; aoTocar?: (on: boolean, rate: number) => void }) {
  const [tocando, setTocando] = useState(false);
  const tocar = async (rate: number) => {
    setTocando(true);
    aoTocar?.(true, rate);
    await speakJa(texto, { rate });
    aoTocar?.(false, rate);
    setTocando(false);
  };
  const tam = grande ? "h-16 w-16" : "h-11 w-11";
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => tocar(1)}
        aria-label="Ouvir"
        className={`btn-3d flex ${tam} items-center justify-center rounded-2xl border-[#1899d6] bg-[var(--azul)] text-white ${tocando ? "opacity-80" : ""}`}
      >
        <Volume2 size={grande ? 30 : 22} />
      </button>
      <button
        onClick={() => tocar(0.65)}
        aria-label="Ouvir devagar"
        className={`btn-3d flex ${grande ? "h-12 w-12" : "h-9 w-9"} items-center justify-center rounded-xl border-[#1899d6] bg-[var(--azul)] text-white`}
      >
        <Snail size={grande ? 22 : 16} />
      </button>
    </div>
  );
}

/** Mascote com balão de fala ao lado (como o personagem dos exercícios do Duolingo). */
export function BalaoMascote({ children, humor = "falando" }: { children: ReactNode; humor?: "feliz" | "falando" }) {
  return (
    <div className="flex items-end gap-2">
      <div className="shrink-0">
        <Mascote humor={humor} tamanho={84} />
      </div>
      <div className="relative min-w-0 flex-1 rounded-2xl border-2 border-[var(--line)] p-3">
        <span className="absolute -left-[9px] bottom-6 h-4 w-4 rotate-45 border-b-2 border-l-2 border-[var(--line)] bg-[var(--bg)]" />
        {children}
      </div>
    </div>
  );
}

export function Enunciado({ children, rotulo }: { children: ReactNode; rotulo?: string }) {
  return (
    <div>
      {rotulo && (
        <p className="mb-1 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#ce82ff]">
          <span className="h-2 w-2 rounded-full bg-[#ce82ff]" /> {rotulo}
        </p>
      )}
      <h1 className="text-2xl font-extrabold leading-tight">{children}</h1>
    </div>
  );
}

/** Opção selecionável (escolha múltipla). */
export function Opcao({
  ativo,
  travado,
  onClick,
  children,
  numero,
}: {
  ativo: boolean;
  travado: boolean;
  onClick: () => void;
  children: ReactNode;
  numero?: number;
}) {
  return (
    <button
      onClick={onClick}
      disabled={travado}
      className={`btn-3d flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-base font-semibold ${
        ativo ? "border-[var(--azul)] bg-[var(--azul)]/15 text-[var(--azul)]" : "border-[var(--line)]"
      }`}
    >
      {numero !== undefined && (
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 text-xs ${
            ativo ? "border-[var(--azul)]" : "border-[var(--line)] text-[var(--muted)]"
          }`}
        >
          {numero}
        </span>
      )}
      <span className="min-w-0 flex-1">{children}</span>
    </button>
  );
}
