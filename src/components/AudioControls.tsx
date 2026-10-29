"use client";

import { useState } from "react";
import { Headphones, Snail, Volume2 } from "lucide-react";
import { playUrl, speakJa, stopAll, wait } from "@/lib/audio/tts";

export interface Speakable {
  kana: string;
  audio_url?: string | null;
}

/** Botões "ouvir" e "ouvir devagar"; avisa o pai para animar o mapa de moras. */
export function PlayButtons({
  line,
  onPlaying,
  size = "md",
}: {
  line: Speakable;
  onPlaying?: (playing: boolean, rate: number) => void;
  size?: "md" | "sm";
}) {
  const [busy, setBusy] = useState(false);
  const play = async (rate: number) => {
    setBusy(true);
    onPlaying?.(true, rate);
    try {
      await speakJa(line.kana, { url: line.audio_url, rate });
    } finally {
      setBusy(false);
      onPlaying?.(false, rate);
    }
  };
  const base =
    size === "md"
      ? "h-11 px-4 text-sm"
      : "h-8 px-2.5 text-xs";
  return (
    <div className="flex gap-2">
      <button
        onClick={() => play(1)}
        disabled={busy}
        className={`${base} flex items-center gap-2 rounded-xl bg-[var(--accent)] font-semibold text-black disabled:opacity-60`}
      >
        <Volume2 size={size === "md" ? 18 : 14} /> Ouvir
      </button>
      <button
        onClick={() => play(0.7)}
        disabled={busy}
        title="Ouvir devagar"
        className={`${base} flex items-center gap-2 rounded-xl border border-[var(--line)] text-[var(--fg)] disabled:opacity-60`}
      >
        <Snail size={size === "md" ? 18 : 14} />
        {size === "md" && "Devagar"}
      </button>
    </div>
  );
}

/** Toca o nativo e, 0,5 s depois, a gravação do usuário. */
export function CompareButton({
  line,
  userUrl,
  onPlaying,
}: {
  line: Speakable;
  userUrl: string | null;
  onPlaying?: (playing: boolean, rate: number) => void;
}) {
  const [stage, setStage] = useState<"idle" | "nativo" | "eu">("idle");
  const run = async () => {
    if (!userUrl) return;
    stopAll();
    setStage("nativo");
    onPlaying?.(true, 1);
    const inteiro = await speakJa(line.kana, { url: line.audio_url });
    onPlaying?.(false, 1);
    if (!inteiro) return setStage("idle"); // interrompido: não emenda a sua gravação
    await wait(500);
    setStage("eu");
    try {
      await playUrl(userUrl);
    } catch {}
    setStage("idle");
  };
  return (
    <button
      onClick={run}
      disabled={!userUrl || stage !== "idle"}
      className="flex h-11 items-center gap-2 rounded-xl border border-[var(--accent)]/60 px-4 text-sm font-semibold text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-40"
      title={userUrl ? "Nativo → 0,5 s → sua gravação" : "Grave sua fala primeiro"}
    >
      <Headphones size={18} />
      {stage === "nativo" ? "Nativo…" : stage === "eu" ? "Você…" : "Ouvir Comparação (Nativo vs Eu)"}
    </button>
  );
}
