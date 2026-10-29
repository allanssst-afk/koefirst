"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, EyeOff, Grid2x2, Play, RotateCcw, Undo2, Volume2 } from "lucide-react";
import { speakJa } from "@/lib/audio/tts";
import { tracoConfere, tracosDe, type Ponto } from "@/lib/kana";
import { registrarKana } from "@/lib/queries";

/** Pontos de um traço de referência (caminho SVG do KanjiVG), medidos pelo próprio navegador. */
function amostrarCaminho(d: string, n = 40): Ponto[] {
  const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
  p.setAttribute("d", d);
  const total = p.getTotalLength();
  return Array.from({ length: n }, (_, i) => {
    const q = p.getPointAtLength((total * i) / (n - 1));
    return [q.x, q.y];
  });
}

const linha = (pts: Ponto[]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("");

/**
 * Caligrafia de um kana: o aluno traça com o dedo, um traço por vez, na ordem e no sentido certos.
 * Traço certo encaixa no desenho de referência; traço errado pisca e o app mostra como se faz.
 * Guia (olho) mostra o caractere apagado com os números dos traços; sem guia, o treino é de memória.
 */
export function Caligrafia({ caractere, aoConcluir }: { caractere: string; aoConcluir?: (semErro: boolean) => void }) {
  const dados = tracosDe(caractere);
  const [guia, setGuia] = useState(true);
  const [grade, setGrade] = useState(true);
  const [feitos, setFeitos] = useState(0);
  const [erros, setErros] = useState(0);
  const [desenho, setDesenho] = useState<Ponto[] | null>(null);
  const [errou, setErrou] = useState(false);
  /** animação da ordem dos traços: todos (-1 = parada) ou só o traço que o aluno errou */
  const [demo, setDemo] = useState<{ de: number; ate: number; chave: number } | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [refs, setRefs] = useState<Ponto[][]>([]);

  useEffect(() => setRefs(dados.tracos.map((d) => amostrarCaminho(d))), [dados]);
  useEffect(() => {
    setFeitos(0);
    setErros(0);
    setDesenho(null);
    setDemo(null);
  }, [caractere]);

  const total = dados.tracos.length;
  const pronto = feitos === total;

  const paraCaixa = (e: React.PointerEvent): Ponto => {
    const r = svg.current!.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * 109, ((e.clientY - r.top) / r.height) * 109];
  };

  const inicio = (e: React.PointerEvent) => {
    if (pronto || !refs.length) return;
    try {
      // continua recebendo o traço mesmo se o dedo sair do quadro
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {
      /* sem captura: o traço termina ao sair do quadro */
    }
    setDemo(null);
    setDesenho([paraCaixa(e)]);
  };
  const mover = (e: React.PointerEvent) => {
    if (!desenho) return;
    const p = paraCaixa(e);
    setDesenho((d) => (d ? [...d, p] : d));
  };
  const fim = () => {
    if (!desenho) return;
    const pts = desenho;
    setDesenho(null);
    if (pts.length < 3) return; // um toque solto não conta
    if (tracoConfere(pts, refs[feitos])) {
      const n = feitos + 1;
      setFeitos(n);
      if (n === total) {
        registrarKana(caractere, "escrita", erros === 0);
        aoConcluir?.(erros === 0);
      }
    } else {
      setErros((x) => x + 1);
      setErrou(true);
      setTimeout(() => setErrou(false), 450);
      setDemo({ de: feitos, ate: feitos, chave: Date.now() }); // mostra só o traço que faltou
    }
  };

  const recomecar = () => {
    setFeitos(0);
    setErros(0);
    setDemo(null);
  };

  const proximo = !pronto ? refs[feitos] : undefined;
  const corTraco = "var(--fg)";

  return (
    <div className="space-y-3">
      <div className="relative mx-auto aspect-square w-full max-w-[340px] overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--panel)]">
        <svg
          ref={svg}
          viewBox="0 0 109 109"
          className={`h-full w-full touch-none select-none ${errou ? "animate-[tremer_0.4s]" : ""}`}
          onPointerDown={inicio}
          onPointerMove={mover}
          onPointerUp={fim}
          onPointerCancel={fim}
          onPointerLeave={fim}
        >
          {grade && (
            <g stroke="var(--line)" strokeWidth="0.6" strokeDasharray="2 2">
              <line x1="54.5" y1="0" x2="54.5" y2="109" />
              <line x1="0" y1="54.5" x2="109" y2="54.5" />
            </g>
          )}

          {/* guia: o caractere inteiro bem apagado, com os números dos traços */}
          {guia && (
            <g>
              {dados.tracos.map((d, i) => (
                <path key={i} d={d} fill="none" stroke="var(--line)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              ))}
              {dados.numeros.map(([x, y], i) => (
                <text key={i} x={x} y={y} fontSize="7" fill={i === feitos ? "var(--accent)" : "var(--muted)"} className="font-sans">
                  {i + 1}
                </text>
              ))}
            </g>
          )}

          {/* traços já feitos, encaixados no desenho certo */}
          {dados.tracos.slice(0, feitos).map((d, i) => (
            <path key={i} d={d} fill="none" stroke={pronto ? "var(--ok)" : corTraco} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          ))}

          {/* onde começa o próximo traço */}
          {guia && proximo && !desenho && (
            <circle cx={proximo[0][0]} cy={proximo[0][1]} r="3.2" fill="var(--accent)" className="animate-pulse" />
          )}

          {/* animação da ordem dos traços */}
          {demo &&
            dados.tracos.slice(demo.de, demo.ate + 1).map((d, i) => (
              <path
                key={`${demo.chave}-${i}`}
                d={d}
                pathLength={1}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1"
                strokeDashoffset="1"
                style={{ animation: `desenhar-traco 0.7s ease-in-out ${i * 0.8}s forwards` }}
              />
            ))}

          {/* o que o aluno está desenhando agora */}
          {desenho && (
            <path d={linha(desenho)} fill="none" stroke="var(--azul)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
      </div>

      <p className="text-center text-sm text-[var(--muted)]">
        {pronto
          ? erros === 0
            ? "Perfeito: ordem e sentido certos em todos os traços."
            : `Concluído com ${erros} ${erros === 1 ? "correção" : "correções"}. Faça de novo para fixar.`
          : `Traço ${feitos + 1} de ${total}${guia ? " — comece no ponto laranja" : " — de memória"}`}
      </p>

      <div className="grid grid-cols-6 gap-2">
        <Botao rotulo="Desfazer traço" onClick={() => setFeitos((f) => Math.max(0, f - 1))} disabled={!feitos || pronto}>
          <Undo2 size={20} />
        </Botao>
        <Botao rotulo="Recomeçar" onClick={recomecar}>
          <RotateCcw size={20} />
        </Botao>
        <Botao rotulo="Ver a ordem dos traços" onClick={() => setDemo({ de: 0, ate: total - 1, chave: Date.now() })}>
          <Play size={20} />
        </Botao>
        <Botao rotulo="Ouvir" onClick={() => speakJa(caractere)}>
          <Volume2 size={20} />
        </Botao>
        <Botao rotulo="Grade" ativo={grade} onClick={() => setGrade((g) => !g)}>
          <Grid2x2 size={20} />
        </Botao>
        <Botao rotulo={guia ? "Esconder o guia (de memória)" : "Mostrar o guia"} ativo={guia} onClick={() => setGuia((g) => !g)}>
          {guia ? <Eye size={20} /> : <EyeOff size={20} />}
        </Botao>
      </div>
    </div>
  );
}

function Botao({
  rotulo,
  onClick,
  children,
  ativo,
  disabled,
}: {
  rotulo: string;
  onClick: () => void;
  children: React.ReactNode;
  ativo?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={rotulo}
      title={rotulo}
      className={`btn flex h-12 items-center justify-center rounded-xl border disabled:opacity-40 ${
        ativo ? "border-[var(--accent)]/60 bg-[var(--accent)]/15 text-[var(--accent)]" : "border-[var(--line)] bg-[var(--panel)] text-[var(--fg)]"
      }`}
    >
      {children}
    </button>
  );
}
