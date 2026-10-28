/**
 * Extração do contorno de F0 (frequência fundamental) de uma gravação via autocorrelação.
 * Serve para o usuário comparar a própria entonação com o padrão H/L esperado.
 */

export interface PitchContour {
  /** Hz por quadro (null = sem voz) */
  hz: (number | null)[];
  frameMs: number;
}

export async function analyzePitch(blob: Blob): Promise<PitchContour> {
  const ctx = new AudioContext();
  try {
    const audio = await ctx.decodeAudioData(await blob.arrayBuffer());
    // Reamostra para ~11 kHz (média de 4 amostras): voz humana cabe com folga e o cálculo fica 16× mais leve.
    const raw = audio.getChannelData(0);
    const factor = Math.max(1, Math.round(audio.sampleRate / 11025));
    const data = new Float32Array(Math.floor(raw.length / factor));
    for (let i = 0; i < data.length; i++) {
      let acc = 0;
      for (let k = 0; k < factor; k++) acc += raw[i * factor + k];
      data[i] = acc / factor;
    }
    const sr = audio.sampleRate / factor;
    const frame = 512;
    const hop = Math.round(sr * 0.01);
    const minLag = Math.floor(sr / 450);
    const maxLag = Math.floor(sr / 70);
    const hz: (number | null)[] = [];

    let peak = 0;
    for (let i = 0; i < data.length; i += 64) peak = Math.max(peak, Math.abs(data[i]));
    const gate = peak * 0.08;

    for (let start = 0; start + frame < data.length; start += hop) {
      let energy = 0;
      for (let i = 0; i < frame; i++) energy += data[start + i] ** 2;
      const rms = Math.sqrt(energy / frame);
      if (rms < gate) {
        hz.push(null);
        continue;
      }
      let bestLag = -1;
      let best = 0;
      for (let lag = minLag; lag <= maxLag; lag++) {
        let c = 0;
        for (let i = 0; i < frame - lag; i++) c += data[start + i] * data[start + i + lag];
        c /= energy;
        if (c > best) {
          best = c;
          bestLag = lag;
        }
      }
      hz.push(best > 0.45 && bestLag > 0 ? sr / bestLag : null);
    }
    return { hz: smooth(hz), frameMs: (hop / sr) * 1000 };
  } finally {
    ctx.close().catch(() => {});
  }
}

/** Mediana móvel de 5 quadros + remoção de saltos de oitava isolados. */
function smooth(hz: (number | null)[]): (number | null)[] {
  return hz.map((v, i) => {
    if (v === null) return null;
    const win = hz.slice(Math.max(0, i - 2), i + 3).filter((x): x is number => x !== null);
    if (win.length < 3) return null;
    win.sort((a, b) => a - b);
    return win[Math.floor(win.length / 2)];
  });
}
