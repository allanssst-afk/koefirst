"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import { usePhase } from "@/components/PhaseProvider";
import { QuizKanji, TIPOS_QUIZ_KANJI, type TipoQuizKanji } from "@/components/escrita/QuizKanji";
import { GRUPOS_KANJI, KANJI, KANJI_DO_GRUPO, type GrupoKanji } from "@/lib/kanji";
import { progressoKana } from "@/lib/queries";

/** Kanji: os das frases do app e os do JLPT N5, N4 e N3, com significado, quiz e caligrafia. */
export default function Kanji() {
  const { fase } = usePhase();
  const [grupo, setGrupo] = useState<GrupoKanji>("app");
  const [quiz, setQuiz] = useState<TipoQuizKanji | null>(null);
  const prog = useMemo(() => progressoKana(), [quiz]); // eslint-disable-line react-hooks/exhaustive-deps

  if (quiz) return <QuizKanji grupo={grupo} tipo={quiz} aoSair={() => setQuiz(null)} />;

  const lista = KANJI_DO_GRUPO[grupo];
  const dominados = lista.filter((k) => prog.get(k)?.dominado).length;

  return (
    <div className="mx-auto max-w-md space-y-6 pb-8 animate-rise">
      <div>
        <h1 className="text-2xl font-bold">Kanji</h1>
        <p className="text-sm text-[var(--muted)]">Sentido, leituras, palavras das suas frases e a ordem dos traços.</p>
      </div>

      {fase < 3 && (
        <div className="flex gap-3 rounded-2xl border border-[var(--pitch)]/40 bg-[var(--pitch)]/10 p-3 text-sm">
          <Info size={18} className="mt-0.5 shrink-0 text-[var(--pitch)]" />
          <p>
            No método, os kanji entram na <b>Fase 3</b>, depois do som e do hiragana. Você pode adiantar aqui; nas lições
            eles só aparecem (com furigana) quando você mudar para a Fase 3 no Perfil.
          </p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-1 rounded-2xl bg-[var(--panel)] p-1">
        {GRUPOS_KANJI.map((g) => (
          <button
            key={g.id}
            onClick={() => setGrupo(g.id)}
            className={`rounded-xl px-1 py-2 text-sm font-semibold leading-tight ${
              grupo === g.id ? "bg-[var(--accent)] text-[#1c0b05]" : "text-[var(--muted)]"
            }`}
          >
            {g.nome}
            <span className="block text-[11px] font-normal opacity-80">{KANJI_DO_GRUPO[g.id].length} kanji</span>
          </button>
        ))}
      </div>

      <section className="space-y-3 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-bold">Quiz de múltipla escolha</h2>
          <span className="text-xs text-[var(--muted)]">16 perguntas · cronômetro</span>
        </div>
        <div className="space-y-2">
          {TIPOS_QUIZ_KANJI.map((t) => (
            <button
              key={t.id}
              onClick={() => setQuiz(t.id)}
              className="btn flex w-full items-center justify-between gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-left"
            >
              <span>
                <span className="block font-semibold">{t.nome}</span>
                <span className="block text-xs text-[var(--muted)]">{t.descricao}</span>
              </span>
              <span className="text-sm font-bold text-[var(--accent)]">Começar</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-2">
          <div>
            <h2 className="font-bold">{GRUPOS_KANJI.find((g) => g.id === grupo)!.nome}</h2>
            <p className="text-xs text-[var(--muted)]">{GRUPOS_KANJI.find((g) => g.id === grupo)!.descricao}. Toque para estudar e escrever.</p>
          </div>
          <span className="shrink-0 text-xs text-[var(--muted)]">
            {dominados}/{lista.length} dominados
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {lista.map((k) => {
            const p = prog.get(k);
            return (
              <Link
                key={k}
                href={`/kanji/ver/?k=${encodeURIComponent(k)}&g=${grupo}`}
                className="btn relative flex flex-col items-center rounded-xl border border-[var(--line)] bg-[var(--panel)] px-1 py-2"
              >
                <span className="font-jp text-3xl leading-tight">{k}</span>
                <span className="w-full truncate text-center text-[11px] text-[var(--muted)]">{KANJI[k].sig[0]}</span>
                {p && (
                  <span
                    className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full"
                    style={{ background: p.dominado ? "var(--ok)" : "var(--pitch)" }}
                  />
                )}
              </Link>
            );
          })}
        </div>
        <p className="text-[11px] text-[var(--muted)]">Ponto verde = dominado (3 acertos seguidos); amarelo = em treino.</p>
      </section>

      <p className="text-center text-[11px] text-[var(--muted)]">
        Significados e leituras: KANJIDIC2 (EDRDG, CC BY-SA 4.0). Ordem dos traços: KanjiVG, de Ulrich Apel (CC BY-SA 3.0). Lista do N3: Jonathan Waller.
      </p>
    </div>
  );
}
