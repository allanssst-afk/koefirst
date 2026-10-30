/**
 * Kanji: significado, leituras, nível do JLPT e ordem dos traços (kanji-dados.generated.ts), mais as palavras
 * das frases do app que usam cada kanji (tiradas da notação de furigana `会社[かいしゃ]` dos cards).
 */
import { seedCards } from "@/db/seed-data/cards";
import { KANJI, type KanjiDados } from "./kanji-dados.generated";
import { morasToKana } from "./text";

export type { KanjiDados };
export { KANJI };

export type GrupoKanji = "app" | "n5" | "n4" | "n3";

export const GRUPOS_KANJI: { id: GrupoKanji; nome: string; descricao: string }[] = [
  { id: "app", nome: "Das suas frases", descricao: "os kanji que aparecem nas frases do app" },
  { id: "n5", nome: "JLPT N5", descricao: "os kanji do primeiro nível da prova" },
  { id: "n4", nome: "JLPT N4", descricao: "os kanji do segundo nível" },
  { id: "n3", nome: "JLPT N3", descricao: "os kanji do terceiro nível, a meta do B1" },
];

const porFrequencia = (a: string, b: string) => (KANJI[a].freq ?? 9999) - (KANJI[b].freq ?? 9999);

/** Kanji de cada grupo. "Das suas frases" segue a ordem em que aparecem no baralho; os níveis, a frequência. */
export const KANJI_DO_GRUPO: Record<GrupoKanji, string[]> = (() => {
  const app: string[] = [];
  for (const c of seedCards) for (const k of c.kanji.match(/[一-龯]/g) ?? []) if (KANJI[k] && !app.includes(k)) app.push(k);
  for (const k of Object.keys(KANJI)) if (KANJI[k].noApp && !app.includes(k)) app.push(k);
  const nivel = (n: 5 | 4 | 3) => Object.keys(KANJI).filter((k) => KANJI[k].nivel === n).sort(porFrequencia);
  return { app, n5: nivel(5), n4: nivel(4), n3: nivel(3) };
})();

export interface PalavraKanji {
  /** palavra escrita com kanji (e okurigana) */
  escrita: string;
  leitura: string;
  /** frase do baralho em que aparece */
  card: string;
}

/** mesma letra, ou vogal longa escrita de outro jeito (o bloco diz しょお, o texto しょう) */
const mesmoSom = (bloco: string, texto: string) =>
  bloco === texto || (bloco === "お" && texto === "う") || (bloco === "え" && texto === "い");

/**
 * Palavras com kanji nas frases: cada trecho `漢字[よみ]` vira uma palavra. O bloco de moras da frase que contém a
 * leitura diz onde a palavra começa e termina: o okurigana (べます em 食べます) é o trecho em que o resto do bloco
 * coincide com o texto depois do kanji, e o prefixo de cortesia (お茶, ご飯) entra se vier logo antes.
 */
export const PALAVRAS: PalavraKanji[] = (() => {
  const vistas = new Set<string>();
  const lista: PalavraKanji[] = [];
  for (const c of seedCards) {
    const blocos = c.blocos.map((b) => morasToKana(b));
    const trechos = [...c.kanji.matchAll(/([\u4e00-\u9faf々]+)\[([^\]]+)\]([\u3041-\u3093]*)/g)].map((m) => {
      const [, kanji, leitura, depois] = m;
      const antesDoTexto = c.kanji.slice(0, m.index).replace(/\[[^\]]*\]/g, "");
      let melhor: { okuri: string; prefixo: string; continua: boolean } | null = null;
      for (const bk of blocos) {
        const i = bk.indexOf(leitura);
        if (i < 0) continue;
        const resto = bk.slice(i + leitura.length);
        let n = 0;
        while (n < resto.length && n < depois.length && mesmoSom(resto[n], depois[n])) n++;
        // o bloco tem de acabar junto, ou a palavra seguir no próximo kanji (朝ご飯, お疲れ様)
        if (n < resto.length && n < depois.length) continue;
        const prefixo = bk.slice(0, i);
        if (prefixo && !antesDoTexto.endsWith(prefixo)) continue;
        if (!melhor || n > melhor.okuri.length) melhor = { okuri: depois.slice(0, n), prefixo, continua: n < resto.length };
      }
      return { kanji, leitura, okuri: melhor?.okuri ?? "", prefixo: melhor?.prefixo ?? "", continua: melhor?.continua ?? false };
    });
    for (let t = 0; t < trechos.length; t++) {
      const x = trechos[t];
      let escrita = x.prefixo + x.kanji + x.okuri;
      let leitura = x.prefixo + x.leitura + x.okuri;
      // o bloco continua no trecho seguinte: é a mesma palavra
      while (trechos[t].continua && t + 1 < trechos.length) {
        const y = trechos[++t];
        escrita += y.kanji + y.okuri;
        leitura += y.leitura + y.okuri;
      }
      if (vistas.has(escrita)) continue;
      vistas.add(escrita);
      lista.push({ escrita, leitura, card: c.id });
    }
  }
  return lista;
})();

export const palavrasCom = (k: string) => PALAVRAS.filter((p) => p.escrita.includes(k));

/** kanji de um texto, na ordem e sem repetir (para os atalhos do dicionário) */
export const kanjiDoTexto = (t: string) => [...new Set(t.match(/[一-龯]/g) ?? [])].filter((k) => KANJI[k]);
