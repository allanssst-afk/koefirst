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
export function BotoesSom({
  texto,
  grande = false,
  aoTocar,
  voz,
}: {
  texto: string;
  grande?: boolean;
  aoTocar?: (on: boolean, rate: number) => void;
  /** índice de voz japonesa (treino de ouvido); sem ele, a voz preferida */
  voz?: number;
}) {
  const [tocando, setTocando] = useState(false);
  const tocar = async (rate: number) => {
    setTocando(true);
    aoTocar?.(true, rate);
    await speakJa(texto, { rate, voz });
    aoTocar?.(false, rate);
    setTocando(false);
  };
  const tam = grande ? "h-16 w-16" : "h-11 w-11";
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => tocar(1)}
        aria-label="Ouvir"
        className={`btn flex ${tam} items-center justify-center rounded-2xl bg-[var(--azul)] text-white ${tocando ? "opacity-80" : ""}`}
      >
        <Volume2 size={grande ? 30 : 22} />
      </button>
      <button
        onClick={() => tocar(0.65)}
        aria-label="Ouvir devagar"
        className={`btn flex ${grande ? "h-12 w-12" : "h-9 w-9"} items-center justify-center rounded-xl bg-[var(--azul)] text-white`}
      >
        <Snail size={grande ? 22 : 16} />
      </button>
    </div>
  );
}

/** Mascote com balão de fala ao lado. */
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
        <p className="mb-1 text-sm font-semibold text-[var(--accent)]">{rotulo}</p>
      )}
      <h1 className="text-2xl font-bold leading-tight">{children}</h1>
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
      className={`btn flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-base font-medium ${
        ativo ? "border-[var(--accent)] bg-[var(--accent)]/12" : "border-[var(--line)] bg-[var(--panel)]"
      }`}
    >
      {numero !== undefined && (
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
            ativo ? "bg-[var(--accent)] text-[#1c0b05]" : "bg-[var(--panel-2)] text-[var(--muted)]"
          }`}
        >
          {numero}
        </span>
      )}
      <span className="min-w-0 flex-1">{children}</span>
    </button>
  );
}
