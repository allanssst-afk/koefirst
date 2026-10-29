"use client";

import { useState, type ReactNode } from "react";
import { Volume2 } from "lucide-react";
import { PitchAccentVisualizer, RoleLegend } from "../PitchAccentVisualizer";
import { BalaoMascote, Enunciado } from "./comuns";
import { b } from "@/db/seed-data/helpers";
import { speakJa } from "@/lib/audio/tts";
import type { SlideTutorial } from "@/lib/trilha";
import type { Mora } from "@/lib/types";

/** Exemplo com áudio: `falar` pode ser kanji para a voz do aparelho acertar a entonação (雨 × 飴). */
function Exemplo({ moras, falar, legenda, funcao = true }: { moras: Mora[]; falar: string; legenda: string; funcao?: boolean }) {
  const [tocando, setTocando] = useState(false);
  const tocar = async () => {
    setTocando(true);
    await speakJa(falar, { rate: 0.8 });
    setTocando(false);
  };
  return (
    <div className="space-y-1 rounded-2xl border-2 border-[var(--line)] p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-bold">{legenda}</p>
        <button onClick={tocar} aria-label="Ouvir" className="btn-3d rounded-xl border-[#1899d6] bg-[var(--azul)] p-2 text-white">
          <Volume2 size={18} />
        </button>
      </div>
      <PitchAccentVisualizer moras={moras} size="sm" playing={tocando} moraMs={260} showFuncao={funcao} />
    </div>
  );
}

const exp = (moras: string, pitch: string, funcao: string) => b(moras, pitch, funcao, "expressao");

const SLIDES: Record<SlideTutorial, { titulo: string; fala: string; corpo: ReactNode }> = {
  mora: {
    titulo: "O que é uma mora?",
    fala: "No japonês, cada sílaba curta é uma batida de tempo igual — a mora. O app desenha cada mora num quadradinho.",
    corpo: (
      <>
        <Exemplo moras={exp("ko.n.ni.chi.wa", "LHHHH", "olá")} falar="こんにちは" legenda="konnichiwa = 5 moras" />
        <p className="text-sm text-[var(--muted)]">
          Em português dizemos «con-ni-tchi-uá» (4 sílabas). Em japonês são <b className="text-[var(--fg)]">5 batidas
          iguais</b>: ko · n · ni · chi · wa — como um metrônomo. Falar no ritmo das moras é o que faz você soar natural.
        </p>
      </>
    ),
  },
  especiais: {
    titulo: "Três batidas que o português não tem",
    fala: "Algumas moras parecem pequenas, mas ocupam uma batida inteira.",
    corpo: (
      <>
        <Exemplo moras={exp("to.o.kyo.o", "LHHH", "Tóquio")} falar="とうきょう" legenda="Vogal longa: to · o · kyo · o" />
        <Exemplo moras={exp("cho.t.to", "HLL", "um pouco")} falar="ちょっと" legenda="Pausa (っ): cho · t · to" />
        <Exemplo moras={exp("ho.n", "HL", "livro")} falar="本" legenda="O «n» sozinho: ho · n" />
        <p className="text-sm text-[var(--muted)]">
          Vogal esticada, a pausa antes de uma consoante dobrada (mostrada como «t», «k» ou «p») e o «n» final:
          cada uma vale <b className="text-[var(--fg)]">uma batida inteira</b>.
        </p>
      </>
    ),
  },
  altura: {
    titulo: "Alto e baixo, não forte e fraco",
    fala: "O japonês não tem sílaba tônica. Ele usa a altura da voz: bolinha cheia é alto, bolinha vazia é baixo.",
    corpo: (
      <>
        <Exemplo moras={exp("a.me", "HL", "chuva")} falar="雨" legenda="ame (alto → baixo) = chuva" />
        <Exemplo moras={exp("a.me", "LH", "bala, doce")} falar="飴" legenda="ame (baixo → alto) = bala" />
        <p className="text-sm text-[var(--muted)]">
          Os mesmos sons mudam de sentido pela melodia. A linha dourada mostra o desenho que sua voz deve fazer.
        </p>
      </>
    ),
  },
  queda: {
    titulo: "A queda de acento",
    fala: "O tracinho vermelho marca onde a voz cai. É a parte mais importante da melodia.",
    corpo: (
      <>
        <Exemplo moras={exp("a.ri.ga.to.o", "LHLLL", "obrigado")} falar="ありがとう" legenda="a·RI | ga·to·o" />
        <p className="text-sm text-[var(--muted)]">
          Sobe em «ri» e cai logo depois. Algumas palavras nunca caem (ficam altas até o fim, como konnichiwa).
        </p>
      </>
    ),
  },
  devozeada: {
    titulo: "Moras sussurradas",
    fala: "Quadradinho tracejado é uma mora quase sem voz.",
    corpo: (
      <>
        <Exemplo moras={b("de._su", "HL", "é", "copula")} falar="です" legenda="desu soa como «dess»" />
        <Exemplo moras={b("_su.ki", "LH", "gostar", "adjetivo")} falar="すき" legenda="suki soa como «ski»" />
        <p className="text-sm text-[var(--muted)]">
          O «u» e o «i» entre sons surdos (s, k, t, sh…) quase somem. Falar «de-su» com o «u» cheio soa estrangeiro.
        </p>
      </>
    ),
  },
  blocos: {
    titulo: "As cores mostram a função",
    fala: "Embaixo das moras, cada cor é um pedaço da frase: tópico, objeto, verbo, partícula…",
    corpo: (
      <>
        <Exemplo
          moras={[
            ...b("ko.re", "LH", "isto", "topico"),
            ...b("wa", "H", "[Tópico]", "particula"),
            ...b("na.n", "HL", "o quê", "pergunta"),
            ...b("de._su", "LL", "é", "copula"),
            ...b("ka", "L", "[?]", "particula"),
          ]}
          falar="これはなんですか"
          legenda="O que é isto?"
        />
        <RoleLegend
          moras={[
            ...b("ko", "L", "", "topico"),
            ...b("wa", "H", "", "particula"),
            ...b("na", "H", "", "pergunta"),
            ...b("de", "L", "", "copula"),
          ]}
        />
        <p className="text-sm text-[var(--muted)]">
          A ordem japonesa é Tópico → Tempo → Objeto → Verbo. O verbo sempre fecha a frase, e o «ka» no fim vira
          pergunta. Pronto: você já sabe ler o mapa de som!
        </p>
      </>
    ),
  },
};

export function ExExplica({ slide }: { slide: SlideTutorial }) {
  const s = SLIDES[slide];
  return (
    <div className="space-y-5">
      <Enunciado rotulo="Como funciona">{s.titulo}</Enunciado>
      <BalaoMascote>
        <p className="text-base">{s.fala}</p>
      </BalaoMascote>
      <div className="space-y-3">{s.corpo}</div>
    </div>
  );
}
