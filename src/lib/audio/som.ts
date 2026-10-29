/** Sons curtos de acerto/erro/conclusão, sintetizados na hora (Web Audio, sem arquivos). */

let ctx: AudioContext | null = null;

function tocarNotas(notas: [freq: number, inicio: number, dur: number][], tipo: OscillatorType = "sine", volume = 0.12) {
  try {
    ctx ??= new AudioContext();
    const t0 = ctx.currentTime;
    for (const [freq, inicio, dur] of notas) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = tipo;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t0 + inicio);
      gain.gain.linearRampToValueAtTime(volume, t0 + inicio + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + inicio + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t0 + inicio);
      osc.stop(t0 + inicio + dur + 0.02);
    }
  } catch {
    /* sem áudio disponível: segue em silêncio */
  }
}

export const somAcerto = () =>
  tocarNotas([
    [659, 0, 0.12],
    [988, 0.09, 0.22],
  ]);

export const somErro = () =>
  tocarNotas(
    [
      [220, 0, 0.18],
      [185, 0.12, 0.25],
    ],
    "triangle",
  );

export const somConclusao = () =>
  tocarNotas([
    [523, 0, 0.14],
    [659, 0.12, 0.14],
    [784, 0.24, 0.14],
    [1047, 0.36, 0.35],
  ]);
