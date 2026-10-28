"use client";

import { RoleplayArena, type ScenarioView } from "@/components/roleplay/RoleplayArena";
import type { RoteiroPasso } from "@/db/seed-data/scenarios";
import { getCardsByIds, getLearnedVocab, getScenarios } from "@/lib/queries";
import type { Categoria } from "@/lib/roleplay";
import type { JaLine } from "@/lib/types";

export default function RoleplayPage() {
  const raw = getScenarios();
  const learned = new Set(getLearnedVocab().map((v) => v.id));

  const parsed = raw.map((s) => ({
    s,
    roteiro: JSON.parse(s.roteiro_offline_json) as RoteiroPasso[],
    req: JSON.parse(s.vocabulario_requerido_ids) as string[],
  }));
  const exemploIds = parsed.flatMap((p) => p.roteiro.map((r) => r.exemplo_card).filter((x): x is string => !!x));
  const exemplos = new Map(
    getCardsByIds([...new Set(exemploIds)]).map((c) => [
      c.id,
      { kana: c.kana_oculto, kanji: c.kanji_oculto, pt: c.situacao_pt, literal: c.significado_cognitivo, moras: c.moras } satisfies JaLine,
    ]),
  );

  const scenarios: ScenarioView[] = parsed.map(({ s, roteiro, req }) => ({
    id: s.id,
    titulo: s.titulo,
    missao_pt: s.missao_pt,
    nivel: s.nivel,
    categoria: s.categoria as Categoria,
    emoji: s.emoji,
    parceiro: { nome: s.parceiro_nome, emoji: s.parceiro_emoji },
    vocabTotal: req.length,
    vocabAprendido: req.filter((id) => learned.has(id)).length,
    roteiro: roteiro.map((p) => ({
      ia: p.ia,
      quem: p.quem ?? null,
      dica_pt: p.dica_pt ?? null,
      chaves: p.chaves ?? [],
      exemplo: p.exemplo ?? (p.exemplo_card ? exemplos.get(p.exemplo_card) ?? null : null),
    })),
  }));

  return <RoleplayArena scenarios={scenarios} />;
}
