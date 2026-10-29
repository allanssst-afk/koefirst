"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Check,
  ChevronRight,
  Flame,
  Lock,
  MessagesSquare,
  NotebookText,
  Repeat2,
  Sparkles,
  Star,
  Trophy,
  X,
  Zap,
} from "lucide-react";
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
    <div className="mx-auto max-w-md space-y-7 pb-8">
      {/* status do dia */}
      <div className="grid grid-cols-3 gap-2">
        <Indicador icone={Flame} cor="var(--warn)" valor={sequencia} rotulo={sequencia === 1 ? "dia seguido" : "dias seguidos"} />
        <Indicador icone={Zap} cor="var(--pitch)" valor={xpTotal} rotulo="XP total" />
        <Indicador icone={Sparkles} cor="var(--azul)" valor={`+${xpHoje}`} rotulo="XP hoje" />
      </div>

      {/* meta de frases novas do dia */}
      <div className="space-y-1.5 px-1">
        <div className="flex items-center justify-between text-sm font-semibold text-[var(--muted)]">
          <span>Frases novas hoje</span>
          <span className={novos.feitos >= novos.meta ? "text-[var(--ok)]" : "text-[var(--fg)]"}>
            {Math.min(novos.feitos, novos.meta)} de {novos.meta}
          </span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: novos.meta }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i < novos.feitos ? "bg-[var(--accent)]" : "bg-[var(--line)]"}`}
            />
          ))}
        </div>
        {atualBloqueadaPelaMeta && (
          <p className="text-xs text-[var(--muted)]">
            Meta de hoje cumprida. Agora o que fixa é revisar (aba Revisar) e praticar (Praticar, Conversar).
          </p>
        )}
      </div>

      {revisoes > 0 && (
        <Link
          href="/study"
          className="btn flex items-center gap-3 rounded-2xl border border-[var(--line)] border-l-4 border-l-[var(--azul)] bg-[var(--panel)] p-3"
        >
          <Mascote humor="feliz" tamanho={48} />
          <span className="flex-1">
            <span className="block font-bold">Hora de revisar</span>
            <span className="block text-sm text-[var(--muted)]">
              {revisoes} {revisoes === 1 ? "frase quer" : "frases querem"} voltar à memória
            </span>
          </span>
          <ChevronRight className="text-[var(--azul)]" />
        </Link>
      )}

      {unidades.map(({ u, licoes }) => {
        const nFeitas = licoes.filter((l) => feitas.has(l.id)).length;
        return (
          <section key={u.id} className="space-y-3">
            {/* placa da linha (unidade) */}
            <div className="flex items-center gap-3">
              <SimboloLinha cor={u.cor} numero={u.numero} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[var(--muted)]">
                  {u.numero === 0 ? "Introdução" : `Linha ${u.numero}`} · {nFeitas} de {licoes.length} estações
                </p>
                <h2 className="text-lg font-bold leading-tight">{u.titulo}</h2>
                <p className="text-sm text-[var(--muted)]">{u.descricao}</p>
              </div>
              {u.cards.length > 0 && (
                <button
                  onClick={() => setGuia(u)}
                  aria-label="Guia da unidade"
                  className="btn flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--line)] text-[var(--muted)]"
                >
                  <NotebookText size={22} />
                </button>
              )}
            </div>

            {/* estações */}
            <ol>
              {licoes.map((l, i) => {
                const Icone = ICONE[l.tipo];
                const feita = feitas.has(l.id);
                const ehAtual = l.id === atual;
                const livre = feita || ehAtual;
                const ultima = i === licoes.length - 1;
                return (
                  <li key={l.id} className="relative py-1 pl-11">
                    {/* trilho: metade de cima chega à estação, metade de baixo sai dela */}
                    {i > 0 && (
                      <span
                        className="absolute left-[15px] top-0 h-1/2 w-1.5"
                        style={{ background: livre ? u.cor : "var(--line)" }}
                      />
                    )}
                    {!ultima && (
                      <span
                        className="absolute bottom-0 left-[15px] top-1/2 w-1.5"
                        style={{ background: feita ? u.cor : "var(--line)" }}
                      />
                    )}
                    {/* estação */}
                    <span
                      className={`absolute left-[18px] top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 ${
                        ehAtual ? "h-7 w-7" : "h-5 w-5"
                      }`}
                      style={{
                        borderColor: livre ? u.cor : "var(--line)",
                        background: feita ? u.cor : "var(--bg)",
                        boxShadow: ehAtual ? `0 0 0 6px ${u.cor}33` : undefined,
                      }}
                    >
                      {feita && <Check size={10} strokeWidth={5} className="text-[var(--bg)]" />}
                    </span>
                    <button
                      onClick={() => abrir(l)}
                      aria-label={`${l.titulo}${feita ? " (concluída)" : livre ? "" : " (bloqueada)"}`}
                      className={`btn flex w-full items-center gap-3 rounded-xl px-3 text-left ${
                        ehAtual ? "border py-3" : "py-2"
                      } ${livre ? "" : "opacity-50"}`}
                      style={ehAtual ? { borderColor: u.cor, background: `${u.cor}14` } : undefined}
                    >
                      <span className="w-9 shrink-0 font-mono text-[11px] text-[var(--muted)]">
                        {u.numero}-{String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block leading-tight ${ehAtual ? "font-bold" : "font-medium"}`}>{l.titulo}</span>
                        {ehAtual && (
                          <span className="block text-xs font-semibold" style={{ color: u.cor }}>
                            {atualBloqueadaPelaMeta ? "Amanhã — meta de hoje cumprida" : "Próxima estação"}
                          </span>
                        )}
                      </span>
                      {livre ? (
                        <Icone size={18} style={{ color: ehAtual ? u.cor : "var(--muted)" }} />
                      ) : (
                        <Lock size={16} className="text-[var(--muted)]" />
                      )}
                      {ehAtual && !atualBloqueadaPelaMeta && (
                        <span
                          className="rounded-full px-3 py-1 text-sm font-bold text-[#11131c]"
                          style={{ background: u.cor }}
                        >
                          Começar
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}

      {aviso && (
        <div className="fixed inset-x-4 bottom-24 z-40 mx-auto max-w-md rounded-2xl bg-[var(--panel-2)] p-4 text-center text-sm font-bold shadow-xl animate-subir">
          {aviso}
        </div>
      )}

      {guia && <GuiaDaUnidade unidade={guia} onClose={() => setGuia(null)} />}
    </div>
  );
}

function Indicador({ icone: Icone, cor, valor, rotulo }: { icone: typeof Star; cor: string; valor: number | string; rotulo: string }) {
  return (
    <div className="rounded-2xl bg-[var(--panel)] px-3 py-2.5">
      <p className="flex items-center gap-1.5 text-xl font-bold">
        <Icone size={18} style={{ color: cor }} /> {valor}
      </p>
      <p className="text-[11px] text-[var(--muted)]">{rotulo}</p>
    </div>
  );
}

/** Símbolo da linha, como nas placas de metrô de Tóquio: anel grosso na cor da linha com o número dentro. */
function SimboloLinha({ cor, numero }: { cor: string; numero: number }) {
  return (
    <span
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[5px] bg-white text-lg font-black text-[#11131c]"
      style={{ borderColor: cor }}
    >
      {numero}
    </span>
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
            <p className="text-xs font-semibold" style={{ color: unidade.cor }}>
              Guia · Linha {unidade.numero}
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
            <div key={id} className="space-y-2 rounded-2xl bg-[var(--panel)] p-3">
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
