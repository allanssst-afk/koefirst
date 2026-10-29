"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Check, Lock, MessagesSquare, NotebookText, Repeat2, Star, Trophy, X } from "lucide-react";
import { BotoesSom } from "@/components/licao/comuns";
import { Mascote } from "@/components/Mascote";
import { PitchAccentVisualizer } from "@/components/PitchAccentVisualizer";
import { contarNovas, getProgressoTrilha, getQueue, novosDeHoje } from "@/lib/queries";
import { cardPorId, hrefDaLicao, licoesDa, UNIDADES, type Licao, type TipoLicao, type Unidade } from "@/lib/trilha";

const ICONE: Record<TipoLicao, typeof Star> = {
  tutorial: BookOpen,
  frases: Star,
  pingpong: Repeat2,
  dialogo: MessagesSquare,
  revisao: Trophy,
};

/** Deslocamento horizontal dos nós (o caminho em zigue-zague). */
const ZIGUE = [0, 44, 70, 44, 0, -44, -70, -44];

function escurecer(hex: string, f = 0.78) {
  const n = parseInt(hex.slice(1), 16);
  const c = (s: number) => Math.round(((n >> s) & 255) * f);
  return `rgb(${c(16)}, ${c(8)}, ${c(0)})`;
}

export default function Trilha() {
  const router = useRouter();
  const { feitas, xpTotal, xpHoje, sequencia } = useMemo(() => getProgressoTrilha(), []);
  const revisoes = useMemo(() => getQueue().dueCount, []);
  const novos = useMemo(() => novosDeHoje(), []);
  const [aviso, setAviso] = useState("");
  const [guia, setGuia] = useState<Unidade | null>(null);

  const unidades = UNIDADES.map((u) => ({ u, licoes: licoesDa(u) }));
  const todas = unidades.flatMap((x) => x.licoes);
  const atual = todas.find((l) => !feitas.has(l.id))?.id;
  const desbloqueada = (l: Licao) => feitas.has(l.id) || l.id === atual;

  // Espaçamento: frases novas por dia têm limite (meta do Perfil, somando trilha e aba Revisar).
  // Uma lição de frases novas só abre se couber na meta de hoje — o resto do dia é para revisar e praticar.
  const novasDaLicao = (l: Licao) => (l.tipo === "frases" ? contarNovas(l.cards) : 0);
  const passaDaMeta = (l: Licao) => {
    const n = novasDaLicao(l);
    return n > 0 && novos.feitos > 0 && novos.feitos + n > novos.meta;
  };
  const atualLicao = todas.find((l) => l.id === atual);
  const atualBloqueadaPelaMeta = atualLicao ? passaDaMeta(atualLicao) : false;

  const avisar = (texto: string) => {
    setAviso(texto);
    setTimeout(() => setAviso(""), 4000);
  };

  const abrir = (l: Licao) => {
    if (!desbloqueada(l)) return avisar("🔒 Complete as lições anteriores para desbloquear esta.");
    if (passaDaMeta(l))
      return avisar(
        `🌙 Você já aprendeu ${novos.feitos} frases novas hoje (meta: ${novos.meta}). A memória precisa de intervalo: revise e pratique agora; amanhã a trilha continua.`,
      );
    router.push(hrefDaLicao(l));
  };

  return (
    <div className="mx-auto max-w-md space-y-8 pb-8">
      {/* status do dia */}
      <div className="flex items-center justify-between rounded-2xl border-2 border-[var(--line)] px-4 py-3 text-lg font-extrabold">
        <span className="text-[var(--warn)]" title="Dias seguidos">🔥 {sequencia}</span>
        <span className="text-[var(--pitch)]" title="XP total">⚡ {xpTotal}</span>
        <span className="text-[var(--azul)]" title="XP de hoje">+{xpHoje} hoje</span>
      </div>

      {/* meta de frases novas do dia */}
      <div className="space-y-1.5 px-1">
        <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-[var(--muted)]">
          <span>Frases novas hoje</span>
          <span className={novos.feitos >= novos.meta ? "text-[var(--accent)]" : ""}>
            {Math.min(novos.feitos, novos.meta)} / {novos.meta}
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-[var(--line)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all"
            style={{ width: `${Math.min(100, (novos.feitos / Math.max(1, novos.meta)) * 100)}%` }}
          />
        </div>
        {atualBloqueadaPelaMeta && (
          <p className="text-xs text-[var(--muted)]">
            Meta de hoje cumprida. Agora o que fixa é revisar (aba Revisar) e praticar (Praticar, Conversar).
          </p>
        )}
      </div>

      {revisoes > 0 && (
        <Link href="/study" className="btn-3d btn-secundario flex items-center gap-3 rounded-2xl p-4">
          <Mascote humor="feliz" tamanho={52} />
          <span className="flex-1">
            <span className="block font-extrabold">Hora de revisar!</span>
            <span className="block text-sm text-[var(--muted)]">
              {revisoes} {revisoes === 1 ? "frase quer" : "frases querem"} voltar à memória
            </span>
          </span>
          <span className="rounded-xl bg-[var(--azul)] px-3 py-2 text-sm font-extrabold uppercase text-white">Revisar</span>
        </Link>
      )}

      {unidades.map(({ u, licoes }) => (
        <section key={u.id} className="space-y-8">
          {/* banner da unidade */}
          <div
            className="flex items-stretch overflow-hidden rounded-2xl text-white"
            style={{ background: u.cor, boxShadow: `0 4px 0 ${escurecer(u.cor)}` }}
          >
            <div className="flex-1 p-4">
              <p className="text-xs font-extrabold uppercase tracking-wider opacity-80">
                {u.numero === 0 ? "Introdução" : `Seção 1, Unidade ${u.numero}`}
              </p>
              <h2 className="text-xl font-black leading-tight">{u.titulo}</h2>
              <p className="text-sm opacity-90">{u.descricao}</p>
            </div>
            {u.cards.length > 0 && (
              <button
                onClick={() => setGuia(u)}
                aria-label="Guia da unidade"
                className="flex w-16 items-center justify-center border-l-2"
                style={{ borderColor: escurecer(u.cor) }}
              >
                <NotebookText size={28} />
              </button>
            )}
          </div>

          {/* caminho */}
          <div className="flex flex-col items-center gap-6 pt-12">
            {licoes.map((l, i) => {
              const Icone = ICONE[l.tipo];
              const feita = feitas.has(l.id);
              const ehAtual = l.id === atual;
              const livre = feita || ehAtual;
              const cor = livre ? u.cor : "#37464f";
              return (
                <div key={l.id} className="relative" style={{ transform: `translateX(${ZIGUE[i % ZIGUE.length]}px)` }}>
                  {ehAtual && (
                    <div className="absolute -top-14 left-1/2 z-10 -translate-x-1/2 animate-pulo">
                      <div className="whitespace-nowrap rounded-xl border-2 border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm font-extrabold uppercase tracking-wider" style={{ color: u.cor }}>
                        {atualBloqueadaPelaMeta ? "Amanhã" : "Começar"}
                      </div>
                      <div className="mx-auto -mt-[7px] h-3 w-3 rotate-45 border-b-2 border-r-2 border-[var(--line)] bg-[var(--bg)]" />
                    </div>
                  )}
                  <button
                    onClick={() => abrir(l)}
                    aria-label={`${l.titulo}${feita ? " (concluída)" : livre ? "" : " (bloqueada)"}`}
                    title={l.titulo}
                    className={`relative flex h-[68px] w-[76px] items-center justify-center rounded-[50%] transition active:translate-y-1 ${
                      ehAtual ? "ring-8 ring-offset-4 ring-offset-[var(--bg)]" : ""
                    }`}
                    style={{
                      background: cor,
                      boxShadow: `0 7px 0 ${livre ? escurecer(u.cor) : "#2a373e"}`,
                      ["--tw-ring-color" as string]: `${u.cor}55`,
                    }}
                  >
                    {feita ? (
                      <Check size={34} strokeWidth={4} className="text-white" />
                    ) : livre ? (
                      <Icone size={32} className="fill-white text-white" />
                    ) : (
                      <Lock size={26} className="text-[#52656d]" />
                    )}
                  </button>
                  <p className={`mt-3 text-center text-xs font-bold ${livre ? "" : "text-[var(--muted)]"}`}>
                    {l.titulo}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {aviso && (
        <div className="fixed inset-x-4 bottom-24 z-40 mx-auto max-w-md rounded-2xl bg-[var(--panel-2)] p-4 text-center text-sm font-bold shadow-xl animate-subir">
          {aviso}
        </div>
      )}

      {guia && <GuiaDaUnidade unidade={guia} onClose={() => setGuia(null)} />}
    </div>
  );
}

/** Guia da unidade: todas as frases com som, para estudar antes ou consultar a qualquer momento. */
function GuiaDaUnidade({ unidade, onClose }: { unidade: Unidade; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88dvh] w-full max-w-md space-y-4 overflow-y-auto rounded-t-3xl bg-[var(--bg)] p-5 animate-subir sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider" style={{ color: unidade.cor }}>
              Guia · Unidade {unidade.numero}
            </p>
            <h2 className="text-xl font-black">{unidade.titulo}</h2>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="text-[var(--muted)]">
            <X size={26} />
          </button>
        </div>
        {unidade.cards.map((id) => {
          const c = cardPorId(id);
          return (
            <div key={id} className="space-y-2 rounded-2xl border-2 border-[var(--line)] p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-extrabold">{c.traducao}</p>
                <BotoesSom texto={c.kana} />
              </div>
              <PitchAccentVisualizer moras={c.moras} size="sm" />
              <p className="text-xs text-[var(--muted)]">{c.notas}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
