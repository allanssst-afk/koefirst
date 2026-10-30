"use client";

import { useState } from "react";
import { ChevronDown, FlaskConical } from "lucide-react";

/**
 * As técnicas do método, com a base de pesquisa e onde cada uma aparece no app.
 * Texto em português sem escrita japonesa (vale para a Fase 1).
 */
const TECNICAS: { nome: string; porque: string; onde: string }[] = [
  {
    nome: "Repetição espaçada (FSRS)",
    porque: "Revisar no momento em que a memória começa a falhar fixa mais com menos tempo do que repetir tudo de uma vez.",
    onde: "Aba Revisar e a nota de cada frase ao fim das lições.",
  },
  {
    nome: "Prática de lembrar (antes de ouvir)",
    porque: "Tentar lembrar antes de ver a resposta fortalece a memória mais do que reler ou reouvir.",
    onde: "Revisões testam antes do áudio; a dica limita a nota a Difícil.",
  },
  {
    nome: "Shadowing (sombra)",
    porque:
      "Estudos com aprendizes de japonês mostram ganho de ritmo e entonação falando junto com o áudio; os ganhos aparecem depois de 4 ou 5 repetições.",
    onde: "Exercício «Fale junto com a voz» nas lições de frases novas: 4 rodadas, 2 devagar e 2 normais.",
  },
  {
    nome: "Treino de ouvido com pares mínimos",
    porque:
      "Ouvir a mesma frase com melodias diferentes e escolher a certa, com várias vozes, é o treino de percepção da entonação japonesa com melhores resultados nas pesquisas.",
    onde: "Exercício «Qual melodia você ouviu?» nas lições de frases e na revisão da unidade.",
  },
  {
    nome: "Lógica da frase (ordem japonesa)",
    porque: "Entender a função de cada bloco evita traduzir palavra por palavra e acelera a fala espontânea.",
    onde: "Decomposição cognitiva, exercício de montar a frase e «Lógica japonesa» na correção.",
  },
  {
    nome: "Fala com propósito",
    porque: "Precisar produzir a frase numa troca real mostra o que falta e fixa a forma gramatical.",
    onde: "Ping-Pong (praticar) e missões da Arena (conversar).",
  },
  {
    nome: "Escrita à mão, traço a traço",
    porque:
      "Escrever à mão, na ordem e no sentido certos, fixa o reconhecimento dos caracteres melhor do que só olhar ou digitar.",
    onde: "Kana e Kanji (Perfil ou Praticar): caligrafia com correção de cada traço, tabelas com som e quiz com cronômetro.",
  },
  {
    nome: "Simulado de escuta (formato JLPT)",
    porque:
      "A prova de escuta do JLPT N5/N4 tem compreensão, expressão na situação e resposta rápida, e exige nota total mais um mínimo em cada seção.",
    onde: "Estação opcional «Simulado de escuta» no fim de cada linha da trilha. Nos fins de fase, o Simulado N5 completo (Fase 2), o N4 completo (Fase 3) e o N3 completo (Revisão final) somam vocabulário, gramática e leitura.",
  },
];

export function TecnicasCard() {
  const [aberto, setAberto] = useState(false);
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)]">
      <button onClick={() => setAberto((a) => !a)} className="flex w-full items-center gap-3 p-4 text-left">
        <FlaskConical className="shrink-0 text-[var(--pitch)]" />
        <span className="min-w-0 flex-1">
          <span className="block font-bold">Técnicas do método</span>
          <span className="block text-xs text-[var(--muted)]">O que a pesquisa recomenda e onde está no app</span>
        </span>
        <ChevronDown className={`shrink-0 text-[var(--muted)] transition-transform ${aberto ? "rotate-180" : ""}`} />
      </button>
      {aberto && (
        <ol className="space-y-3 px-4 pb-4">
          {TECNICAS.map((t, i) => (
            <li key={t.nome} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--panel-2)] text-xs font-bold text-[var(--muted)]">
                {i + 1}
              </span>
              <div className="min-w-0 space-y-0.5 text-sm">
                <p className="font-bold">{t.nome}</p>
                <p className="text-[var(--muted)]">{t.porque}</p>
                <p>
                  <span className="text-[var(--accent)]">No app:</span> {t.onde}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
