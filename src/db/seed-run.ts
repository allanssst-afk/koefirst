import type { DB } from "./index";
import * as schema from "./schema";
import { seedCards } from "./seed-data/cards";
import { seedScenarios } from "./seed-data/scenarios";

/**
 * Idempotente: atualiza o conteúdo de cards/cenários e cria estados FSRS só para cards novos,
 * preservando todo o progresso existente. Roda a cada início do servidor, então um deploy novo
 * já chega com o conteúdo atualizado (e um banco vazio na nuvem nasce pronto para uso).
 */
export function runSeed(db: DB) {
  const now = new Date();

  db.transaction((tx) => {
    seedCards.forEach((c, i) => {
      const row = {
        id: c.id,
        fase: c.fase ?? 1,
        tipo: c.tipo,
        situacao_pt: c.situacao_pt,
        significado_cognitivo: c.significado_cognitivo,
        moras_json: JSON.stringify(c.blocos.flat()),
        kana_oculto: c.kana,
        kanji_oculto: c.kanji,
        audio_url: null,
        notas_gramaticais: c.notas,
        tags: c.tags.join(","),
        ordem: i + 1,
      };
      tx.insert(schema.cards)
        .values(row)
        .onConflictDoUpdate({ target: schema.cards.id, set: { ...row, id: undefined } })
        .run();
      tx.insert(schema.fsrsStates).values({ card_id: c.id, due: now }).onConflictDoNothing().run();
    });

    for (const s of seedScenarios) {
      const row = {
        id: s.id,
        titulo: s.titulo,
        missao_pt: s.missao_pt,
        nivel: s.nivel,
        categoria: s.categoria,
        emoji: s.emoji,
        parceiro_nome: s.parceiro.nome,
        parceiro_emoji: s.parceiro.emoji,
        vocabulario_requerido_ids: JSON.stringify(s.vocabulario_requerido_ids),
        system_prompt_cenario: s.system_prompt_cenario,
        roteiro_offline_json: JSON.stringify(s.roteiro),
      };
      tx.insert(schema.scenariosRoleplay)
        .values(row)
        .onConflictDoUpdate({ target: schema.scenariosRoleplay.id, set: { ...row, id: undefined } })
        .run();
    }

    tx.insert(schema.userSettings).values({ id: 1 }).onConflictDoNothing().run();
  });
}
