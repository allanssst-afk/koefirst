/**
 * Captura de fala: MediaRecorder (gravação para comparação) + Web Speech API (STT)
 * + detector de voz por energia (latência do reflexo oral).
 */
import { eApp, ReconhecedorNativo } from "./nativo";

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
  /** o que deu errado no microfone ou no reconhecimento, em texto para a pessoa */
  falha: string | null;
}

export interface CaptureOptions {
  lang?: "ja-JP" | "pt-BR";
  /** tempo máximo total de gravação */
  maxMs?: number;
  /** encerra se ninguém falar em X ms */
  silenceStartMs?: number;
  /** encerra após X ms de silêncio depois da fala */
  silenceEndMs?: number;
  /** fala longa: o reconhecedor segue depois das pausas, e a gravação só para no botão ou em `maxMs` */
  longa?: boolean;
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
  onaudiostart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

export function getSR(): (new () => SR) | null {
  if (typeof window === "undefined") return null;
  // APK: o WebView não tem o reconhecedor do Chrome; usa o do Android
  if (eApp()) return ReconhecedorNativo;
  const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function browserSttSupported() {
  return getSR() !== null;
}

export function micSupported() {
  return typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia;
}

/** Erros que matam o reconhecedor; "no-speech" e "aborted" não são falha: ele só não ouviu nada. */
const STT_MORTO = new Set(["not-allowed", "service-not-allowed", "audio-capture", "network", "language-not-supported"]);

export const eIphone = () => typeof navigator !== "undefined" && /iPhone|iPad|iPod/.test(navigator.userAgent);
export const eAndroid = () => typeof navigator !== "undefined" && /Android/.test(navigator.userAgent);
export const instalado = () =>
  typeof window !== "undefined" && (window.matchMedia?.("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true);

const COMO_LIBERAR = () =>
  eApp()
    ? "No app: Configurações do Android > Apps > KoeFirst > Permissões > Microfone > Permitir."
    : eIphone()
    ? "No iPhone: Ajustes > Safari > Microfone > Permitir."
    : "No Android: Chrome > ⋮ > Configurações > Configurações do site > Microfone, e permita este site. Confira também em Configurações do Android > Apps > Chrome > Permissões > Microfone.";

/** Explica a falha: microfone fechado (nada foi gravado) ou só sem reconhecimento (gravou, mas sem entender as palavras). */
function mensagemFalha(gravou: boolean, sttVivo: boolean, erroMic: string | null, erroStt: string | null): string | null {
  if (!gravou && !sttVivo) {
    if (erroMic === "NotAllowedError" || erroMic === "SecurityError") return `O microfone está bloqueado para este site. ${COMO_LIBERAR()}`;
    if (erroMic === "NotFoundError") return "Não encontrei um microfone neste aparelho.";
    if (erroMic === "NotReadableError") return "Outro app está usando o microfone. Feche esse app e tente de novo.";
    if (!micSupported()) return "Este navegador não dá acesso ao microfone. Abra o link direto no Chrome (Android) ou no Safari (iPhone), fora de apps como WhatsApp ou Instagram.";
    return `Não consegui abrir o microfone (${erroMic ?? erroStt ?? "erro desconhecido"}). ${COMO_LIBERAR()}`;
  }
  if (erroStt && gravou) {
    if (eIphone() && instalado()) return "Sua voz foi gravada, mas o iPhone não reconhece as palavras no app instalado. Para ter a correção, abra o link no Safari.";
    if (erroStt === "not-allowed") return "Sua voz foi gravada, mas o reconhecimento das palavras ainda não foi permitido. Toque de novo e permita.";
    if (erroStt === "network") return "Sua voz foi gravada, mas o reconhecimento das palavras precisa de internet.";
    if (erroStt === "sem-audio") return "Sua voz foi gravada, mas o reconhecimento de voz do aparelho não respondeu. Compare com o modelo.";
    return `Sua voz foi gravada, mas o aparelho não reconheceu as palavras (${erroStt}). Compare com o modelo.`;
  }
  return null;
}

/** Avisa a tela: `AvisoMicrofone` mostra o texto, e null limpa o aviso anterior. */
function avisar(texto: string | null) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("koe-microfone", { detail: texto }));
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
  const longa = !!opts.longa;

  let stopFn: () => void = () => {};
  const done = new Promise<CaptureResult>((resolve) => {
    const t0 = performance.now();
    let latency: number | null = null;
    let lastVoice = 0;
    let finished = false;
    let sttEnded = false;
    let erroStt: string | null = null;
    let erroMic: string | null = null;
    let micAbrindo = false;
    let paradoNoBotao = false;
    /** o reconhecedor chegou a abrir o microfone (evento audiostart) */
    let srOuviu = false;
    const alternatives: string[] = [];
    /** trechos finais da fala longa, na ordem */
    const trechos: string[] = [];
    let interim = "";
    let wake: WakeLockSentinel | null = null;
    let stream: MediaStream | null = null;
    let recorder: MediaRecorder | null = null;
    const chunks: Blob[] = [];
    let ctx: AudioContext | null = null;
    let raf = 0;
    let rec: SR | null = null;
    let maxTimer = 0;

    avisar(null);
    // criado aqui, ainda dentro do toque: depois de um await, no iPhone ele nasce suspenso e o detector de voz não ouve nada
    try {
      ctx = new AudioContext();
      void ctx.resume().catch(() => {});
    } catch {
      ctx = null;
    }

    const temResultado = () => alternatives.length > 0 || trechos.length > 0 || !!interim;

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
      wake?.release().catch(() => {});
      try {
        rec?.stop();
      } catch {}
      const blob = await new Promise<Blob | null>((r) => {
        if (!recorder || recorder.state === "inactive") return r(chunks.length ? new Blob(chunks) : null);
        recorder.onstop = () => r(chunks.length ? new Blob(chunks, { type: recorder!.mimeType }) : null);
        recorder.stop();
      });
      stream?.getTracks().forEach((t) => t.stop());
      // detector mudo (áudio suspenso) ou sem reconhecedor para confirmar: se gravou e a pessoa parou no botão, a fala conta
      if (latency === null && blob && (ctx?.state === "suspended" || (paradoNoBotao && (!rec || !!erroStt)))) {
        latency = 0;
        lastVoice = performance.now();
      }
      ctx?.close().catch(() => {});

      // Aguarda o resultado final do reconhecedor (chega logo após o stop).
      if (rec && !sttEnded) await new Promise((r) => setTimeout(r, 700));

      const sttVivo = !!rec && !erroStt;
      const sttSource: CaptureResult["sttSource"] = sttVivo ? "browser" : "none";
      // silêncio com microfone aberto não é falha do aparelho: quem avisa é a tela ("Não ouvi nada")
      const falha = stream && latency === null ? null : mensagemFalha(!!stream, sttVivo, erroMic, erroStt);
      avisar(falha);
      if (longa) {
        const tudo = (trechos.join("") + interim).trim();
        if (tudo) alternatives.push(tudo);
      } else if (!alternatives.length && interim) alternatives.push(interim);
      const speechMs = latency === null ? 0 : Math.max(0, Math.round((lastVoice || performance.now()) - t0 - latency));
      resolve({
        transcript: alternatives[0] ?? "",
        alternatives,
        latencyMs: latency,
        speechMs,
        blob,
        url: blob ? URL.createObjectURL(blob) : null,
        sttSource,
        falha,
      });
    };
    stopFn = () => {
      paradoNoBotao = true;
      void finish();
    };

    /** Android: o reconhecedor não abriu o microfone (erro, fim sem ouvir ou demora) → sai dele e grava no lugar */
    const reservaAndroid = (motivo: string) => {
      if (!eAndroid() || stream || micAbrindo || finished) return false;
      erroStt = erroStt ?? motivo;
      sttEnded = true;
      try {
        rec?.abort();
      } catch {}
      void abrirMic();
      return true;
    };

    const abrirMic = async () => {
      // Gravação + medidor de energia
      if (micSupported()) {
        micAbrindo = true;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: true, noiseSuppression: true },
          });
        } catch (e) {
          erroMic = (e as Error).name;
          stream = null;
        }
        micAbrindo = false;
        // parou antes de o microfone abrir: não deixa ele ligado à toa
        if (finished) {
          stream?.getTracks().forEach((t) => t.stop());
          return;
        }
        if (stream) {
          try {
            recorder = new MediaRecorder(stream);
            recorder.ondataavailable = (ev) => ev.data.size && chunks.push(ev.data);
            recorder.start();
          } catch {
            recorder = null;
          }
        }
        if (stream && ctx) {
          void ctx.resume().catch(() => {});
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
            if (!longa && latency !== null && now - lastVoice > silenceEndMs && (!rec || sttEnded)) return void finish();
            raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }
      }
      // sem microfone e sem reconhecedor vivo não há o que esperar
      if (!stream && (!rec || sttEnded || erroStt)) void finish();
    };

    (async () => {
      // STT do navegador
      const SRCtor = getSR();
      if (SRCtor) {
        rec = new SRCtor();
        rec.lang = lang;
        rec.interimResults = true;
        rec.maxAlternatives = 5;
        rec.continuous = longa;
        rec.onspeechstart = markSpeech;
        rec.onaudiostart = () => {
          srOuviu = true;
        };
        rec.onresult = (e) => {
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const r = e.results[i];
            if (r.isFinal && longa) {
              const t = r[0]?.transcript.trim() ?? "";
              // o Chrome do Android repete o trecho anterior no começo de cada resultado final
              const ultimo = trechos[trechos.length - 1];
              if (ultimo && t.startsWith(ultimo)) trechos[trechos.length - 1] = t;
              else if (t) trechos.push(t);
              interim = "";
              opts.onInterim?.(trechos.join(""));
              markSpeech();
            } else if (r.isFinal) {
              for (let k = 0; k < r.length; k++) if (r[k].transcript.trim()) alternatives.push(r[k].transcript.trim());
            } else {
              interim = r[0]?.transcript ?? interim;
              opts.onInterim?.(longa ? trechos.join("") + interim : interim);
              markSpeech();
            }
          }
        };
        rec.onerror = (e) => {
          if (STT_MORTO.has(e.error)) erroStt = e.error;
          // sem reconhecedor, a gravação de reserva entra no lugar dele
          if (STT_MORTO.has(e.error) || !srOuviu) reservaAndroid(e.error);
        };
        rec.onend = () => {
          // acabou sem nem abrir o microfone (acontece no app instalado): grava no lugar dele
          if (!srOuviu && !temResultado() && reservaAndroid("sem-audio")) return;
          // o reconhecedor encerra sozinho depois de uma pausa: na fala longa, volta a ouvir
          if (longa && !finished && !erroStt) {
            setTimeout(() => {
              if (finished) return;
              try {
                rec?.start();
              } catch {}
            }, 150);
            return;
          }
          sttEnded = true;
          // sem resultado, a captura não acaba aqui: com o microfone aberto, quem encerra é o detector de voz
          if (!temResultado() && (stream || micAbrindo)) return;
          // dá um respiro para o gravador pegar o fim da fala
          setTimeout(() => void finish(), 250);
        };
        try {
          rec.start();
          // o reconhecedor do Android avisa audiostart logo que abre o microfone; sem isso em 4 s, ele travou
          if (eAndroid()) window.setTimeout(() => !srOuviu && !temResultado() && reservaAndroid("sem-audio"), 4000);
        } catch {
          rec = null;
        }
      }

      // no Android, gravar junto pode tirar o microfone do reconhecedor: ele vai sozinho, e a gravação fica de reserva
      if (!rec || !eAndroid()) await abrirMic();
      // a tela não pode apagar no meio de uma fala de minutos
      if (longa && "wakeLock" in navigator) navigator.wakeLock.request("screen").then((w) => (wake = w)).catch(() => {});
      maxTimer = window.setTimeout(() => void finish(), maxMs);
    })();
  });

  return { done, stop: () => stopFn() };
}
