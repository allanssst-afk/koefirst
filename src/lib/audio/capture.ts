/**
 * Captura de fala: MediaRecorder (gravação para comparação) + Web Speech API (STT)
 * + detector de voz por energia (latência do reflexo oral).
 */

export interface CaptureResult {
  /** melhor transcrição (pode ser vazia) */
  transcript: string;
  /** todas as alternativas do reconhecedor */
  alternatives: string[];
  /** ms desde o início até a voz começar (null = silêncio) */
  latencyMs: number | null;
  /** duração aproximada da fala */
  speechMs: number;
  blob: Blob | null;
  url: string | null;
  sttSource: "browser" | "server" | "none";
}

export interface CaptureOptions {
  lang?: "ja-JP" | "pt-BR";
  /** tempo máximo total de gravação */
  maxMs?: number;
  /** encerra se ninguém falar em X ms */
  silenceStartMs?: number;
  /** encerra após X ms de silêncio depois da fala */
  silenceEndMs?: number;
  onLevel?: (rms: number) => void;
  onSpeechStart?: (latencyMs: number) => void;
  onInterim?: (text: string) => void;
}

// Tipos mínimos da Web Speech API (não estão no lib.dom padrão).
interface SRAlternative {
  transcript: string;
  confidence: number;
}
interface SREvent {
  resultIndex: number;
  results: ArrayLike<ArrayLike<SRAlternative> & { isFinal: boolean }>;
}
interface SR {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((e: SREvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onspeechstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

function getSR(): (new () => SR) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function browserSttSupported() {
  return getSR() !== null;
}

export function micSupported() {
  return typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia;
}

export interface CaptureHandle {
  done: Promise<CaptureResult>;
  stop: () => void;
}

export function startCapture(opts: CaptureOptions = {}): CaptureHandle {
  const lang = opts.lang ?? "ja-JP";
  const maxMs = opts.maxMs ?? 9000;
  const silenceStartMs = opts.silenceStartMs ?? 6000;
  const silenceEndMs = opts.silenceEndMs ?? 1300;

  let stopFn: () => void = () => {};
  const done = new Promise<CaptureResult>((resolve) => {
    const t0 = performance.now();
    let latency: number | null = null;
    let lastVoice = 0;
    let finished = false;
    let sttEnded = false;
    const alternatives: string[] = [];
    let interim = "";
    let stream: MediaStream | null = null;
    let recorder: MediaRecorder | null = null;
    const chunks: Blob[] = [];
    let ctx: AudioContext | null = null;
    let raf = 0;
    let rec: SR | null = null;
    let maxTimer = 0;

    const markSpeech = () => {
      if (latency === null) {
        latency = Math.round(performance.now() - t0);
        opts.onSpeechStart?.(latency);
      }
      lastVoice = performance.now();
    };

    const finish = async () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      clearTimeout(maxTimer);
      try {
        rec?.stop();
      } catch {}
      const blob = await new Promise<Blob | null>((r) => {
        if (!recorder || recorder.state === "inactive") return r(chunks.length ? new Blob(chunks) : null);
        recorder.onstop = () => r(chunks.length ? new Blob(chunks, { type: recorder!.mimeType }) : null);
        recorder.stop();
      });
      stream?.getTracks().forEach((t) => t.stop());
      ctx?.close().catch(() => {});

      // Aguarda o resultado final do reconhecedor (chega logo após o stop).
      if (rec && !sttEnded) await new Promise((r) => setTimeout(r, 700));

      const sttSource: CaptureResult["sttSource"] = rec ? "browser" : "none";
      if (!alternatives.length && interim) alternatives.push(interim);
      const speechMs = latency === null ? 0 : Math.max(0, Math.round((lastVoice || performance.now()) - t0 - latency));
      resolve({
        transcript: alternatives[0] ?? "",
        alternatives,
        latencyMs: latency,
        speechMs,
        blob,
        url: blob ? URL.createObjectURL(blob) : null,
        sttSource,
      });
    };
    stopFn = () => void finish();

    (async () => {
      // STT do navegador
      const SRCtor = getSR();
      if (SRCtor) {
        rec = new SRCtor();
        rec.lang = lang;
        rec.interimResults = true;
        rec.maxAlternatives = 5;
        rec.continuous = false;
        rec.onspeechstart = markSpeech;
        rec.onresult = (e) => {
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const r = e.results[i];
            if (r.isFinal) {
              for (let k = 0; k < r.length; k++) if (r[k].transcript.trim()) alternatives.push(r[k].transcript.trim());
            } else {
              interim = r[0]?.transcript ?? interim;
              opts.onInterim?.(interim);
              markSpeech();
            }
          }
        };
        rec.onerror = () => {};
        rec.onend = () => {
          sttEnded = true;
          // dá um respiro para o gravador pegar o fim da fala
          setTimeout(() => void finish(), 250);
        };
        try {
          rec.start();
        } catch {
          rec = null;
        }
      }

      // Gravação + medidor de energia
      if (micSupported()) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: true, noiseSuppression: true },
          });
          recorder = new MediaRecorder(stream);
          recorder.ondataavailable = (ev) => ev.data.size && chunks.push(ev.data);
          recorder.start();
          ctx = new AudioContext();
          const src = ctx.createMediaStreamSource(stream);
          const an = ctx.createAnalyser();
          an.fftSize = 1024;
          src.connect(an);
          const buf = new Float32Array(an.fftSize);
          let noise = 0.01;
          const tick = () => {
            an.getFloatTimeDomainData(buf);
            let sum = 0;
            for (const v of buf) sum += v * v;
            const rms = Math.sqrt(sum / buf.length);
            opts.onLevel?.(rms);
            const elapsed = performance.now() - t0;
            if (elapsed < 300) noise = Math.max(noise, rms);
            if (rms > Math.max(0.025, noise * 2.5)) markSpeech();
            const now = performance.now();
            if (latency === null && elapsed > silenceStartMs) return void finish();
            if (latency !== null && now - lastVoice > silenceEndMs && (!rec || sttEnded)) return void finish();
            raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        } catch {
          stream = null;
        }
      }
      if (!rec && !stream) return void finish();
      maxTimer = window.setTimeout(() => void finish(), maxMs);
    })();
  });

  return { done, stop: () => stopFn() };
}
