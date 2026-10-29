"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Info, PenLine } from "lucide-react";
import { usePhase } from "@/components/PhaseProvider";
import { QuizKana, TIPOS_QUIZ, type ConfigQuiz, type TipoQuiz } from "@/components/escrita/QuizKana";
import { caractere, LINHAS, type GrupoKana, type Silabario } from "@/lib/kana";
import { progressoKana } from "@/lib/queries";

/** Escrita japonesa: tabela dos kana (dicionário de caracteres), caligrafia e quiz. */
export default function Escrita() {
  const { fase } = usePhase();
  const [silabario, setSilabario] = useState<Silabario>("hiragana");
  const [grupos, setGrupos] = useState<GrupoKana[]>(["basico"]);
  const [quiz, setQuiz] = useState<ConfigQuiz | null>(null);
  const [rodada, setRodada] = useState(0);
  const prog = useMemo(() => progressoKana(), [quiz, rodada]); // eslint-disable-line react-hooks/exhaustive-deps

  if (quiz)
    return (
      <QuizKana
        cfg={quiz}
        aoSair={() => {
          setQuiz(null);
          setRodada((r) => r + 1);
        }}
      />
    );

  const alterna = (g: GrupoKana) =>
    setGrupos((gs) => (gs.includes(g) ? (gs.length > 1 ? gs.filter((x) => x !== g) : gs) : [...gs, g]));
  const iniciar = (tipo: TipoQuiz) => setQuiz({ silabario, grupos, tipo });

  const dominados = LINHAS.flatMap((l) => l.kana).filter((k) => k && prog.get(caractere(k, silabario))?.dominado).length;
  const total = LINHAS.flatMap((l) => l.kana).filter(Boolean).length;

  return (
    <div className="mx-auto max-w-md space-y-6 pb-8 animate-rise">
      <div>
        <h1 className="text-2xl font-bold">Escrita japonesa</h1>
        <p className="text-sm text-[var(--muted)]">Os dois silabários, traço a traço, com som e quiz.</p>
      </div>

      {fase === 1 && (
        <div className="flex gap-3 rounded-2xl border border-[var(--pitch)]/40 bg-[var(--pitch)]/10 p-3 text-sm">
          <Info size={18} className="mt-0.5 shrink-0 text-[var(--pitch)]" />
          <p>
            No método, a escrita entra na <b>Fase 2</b>, depois de o ouvido conhecer os sons. Você pode adiantar o
            treino aqui: o resto do app continua só com o mapa de som até você mudar de fase no Perfil.
          </p>
        </div>
      )}

      {/* silabário */}
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-[var(--panel)] p-1">
        {(["hiragana", "katakana"] as Silabario[]).map((s) => (
          <button
            key={s}
            onClick={() => setSilabario(s)}
            className={`rounded-xl py-2.5 font-semibold capitalize ${
              silabario === s ? "bg-[var(--accent)] text-[#1c0b05]" : "text-[var(--muted)]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* quiz */}
      <section className="space-y-3 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-bold">Quiz de múltipla escolha</h2>
          <span className="text-xs text-[var(--muted)]">16 perguntas · cronômetro</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["basico", "Básicos (46)"],
              ["tenten", "Com ten-ten e maru (25)"],
            ] as [GrupoKana, string][]
          ).map(([g, nome]) => (
            <button
              key={g}
              onClick={() => alterna(g)}
              className={`rounded-full border px-3 py-1.5 text-sm ${
                grupos.includes(g) ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)]" : "border-[var(--line)] text-[var(--muted)]"
              }`}
            >
              {nome}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {TIPOS_QUIZ.map((t) => (
            <button
              key={t.id}
              onClick={() => iniciar(t.id)}
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

      {/* tabela (dicionário de caracteres) */}
      <section className="space-y-3">
        <div className="flex items-end justify-between gap-2">
          <div>
            <h2 className="font-bold">Tabela e caligrafia</h2>
            <p className="text-xs text-[var(--muted)]">Toque num caractere para ouvir, ver a ordem dos traços e escrever.</p>
          </div>
          <span className="shrink-0 text-xs text-[var(--muted)]">
            {dominados}/{total} dominados
          </span>
        </div>
        {(["basico", "tenten"] as GrupoKana[]).map((g) => (
          <div key={g} className="space-y-1.5">
            <p className="text-xs font-semibold text-[var(--muted)]">{g === "basico" ? "Básicos" : "Com ten-ten (゛) e maru (゜)"}</p>
            {LINHAS.filter((l) => l.grupo === g).map((l) => (
              <div key={l.nome} className="grid grid-cols-5 gap-1.5">
                {l.kana.map((k, i) => {
                  if (!k) return <span key={i} />;
                  const c = caractere(k, silabario);
                  const p = prog.get(c);
                  return (
                    <Link
                      key={c}
                      href={`/escrita/tracar/?k=${encodeURIComponent(c)}`}
                      className="btn relative flex flex-col items-center rounded-xl border border-[var(--line)] bg-[var(--panel)] py-2"
                    >
                      <span className="font-jp text-2xl leading-tight">{c}</span>
                      <span className="text-[11px] text-[var(--muted)]">{k.romaji}</span>
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
            ))}
          </div>
        ))}
        <p className="flex items-center gap-3 text-[11px] text-[var(--muted)]">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--ok)]" /> dominado (3 acertos seguidos)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--pitch)]" /> em treino
          </span>
        </p>
      </section>

      <Link
        href={`/escrita/tracar/?k=${encodeURIComponent(caractere(LINHAS[0].kana[0]!, silabario))}`}
        className="btn btn-primario flex items-center justify-center gap-2 rounded-2xl py-4">
        <PenLine size={20} /> Começar a caligrafia pelo começo
      </Link>

      <Link href="/kanji" className="btn btn-secundario flex items-center gap-3 rounded-2xl p-4">
        <span className="font-jp text-3xl text-[var(--pitch)]">字</span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold">Próximo passo: kanji</span>
          <span className="block text-xs text-[var(--muted)]">Os das suas frases e os do JLPT N5 e N4</span>
        </span>
      </Link>

      <p className="text-center text-[11px] text-[var(--muted)]">
        Ordem dos traços: KanjiVG, de Ulrich Apel (licença CC BY-SA 3.0).
      </p>
    </div>
  );
}
