/**
 * App Android (APK do Capacitor): o WebView não tem a voz (`speechSynthesis`) nem o reconhecimento (`webkitSpeechRecognition`)
 * do Chrome. Aqui ficam as peças nativas do Android no lugar deles. No site (navegador) nada disto roda.
 */
import type { PluginListenerHandle } from "@capacitor/core";

// Os plugins só carregam dentro do APK (import dinâmico): alguns mexem em `window` ao carregar e quebrariam o build estático.
const stt = () => import("@capacitor-community/speech-recognition").then((m) => m.SpeechRecognition);
const tts = () => import("@capacitor-community/text-to-speech").then((m) => m.TextToSpeech);

/** Dentro do APK a ponte do Capacitor injeta `window.Capacitor` antes do app carregar. */
export const eApp = () =>
  typeof window !== "undefined" && !!(window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.();

/** Mensagens do reconhecedor do Android → códigos da Web Speech API, que a captura já sabe tratar. */
const CODIGOS: Record<string, string> = {
  "No match": "no-speech",
  "No speech input": "no-speech",
  "Insufficient permissions": "not-allowed",
  "Missing permission": "not-allowed",
  "Network error": "network",
  "Network timeout": "network",
  "error from server": "network",
  "Audio recording error": "audio-capture",
  "Client side error": "aborted",
  "RecognitionService busy": "aborted",
};

type Alternativa = { transcript: string; confidence: number };
type ResultadoSR = { resultIndex: number; results: ArrayLike<ArrayLike<Alternativa> & { isFinal: boolean }> };

/** Imita `webkitSpeechRecognition` com o reconhecedor do Android: um `start()` devolve as alternativas finais. */
export class ReconhecedorNativo {
  lang = "ja-JP";
  interimResults = false;
  maxAlternatives = 5;
  continuous = false;
  onresult: ((e: ResultadoSR) => void) | null = null;
  onend: (() => void) | null = null;
  onerror: ((e: { error: string }) => void) | null = null;
  onspeechstart: (() => void) | null = null;
  onaudiostart: (() => void) | null = null;
  private ativo = false;

  start() {
    if (this.ativo) throw new Error("InvalidStateError");
    this.ativo = true;
    void this.ouvir();
  }

  private async ouvir() {
    let ouvinte: PluginListenerHandle | null = null;
    try {
      const SpeechRecognition = await stt();
      let perm = (await SpeechRecognition.checkPermissions()).speechRecognition;
      if (perm !== "granted") perm = (await SpeechRecognition.requestPermissions()).speechRecognition;
      if (perm !== "granted") throw new Error("Missing permission");
      ouvinte = await SpeechRecognition.addListener("listeningState", (s) => {
        if (s.status === "started") this.onspeechstart?.();
      });
      // o reconhecedor do Android abre o microfone sozinho, logo depois de começar
      this.onaudiostart?.();
      const r = await SpeechRecognition.start({ language: this.lang, maxResults: this.maxAlternatives, partialResults: false, popup: false });
      const frases = (r.matches ?? []).filter((t) => t.trim());
      if (frases.length) {
        const alternativas = Object.assign(
          frases.map((t) => ({ transcript: t, confidence: 0 })),
          { isFinal: true },
        );
        this.onresult?.({ resultIndex: 0, results: [alternativas] });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      this.onerror?.({ error: CODIGOS[msg] ?? msg });
    } finally {
      this.ativo = false;
      void ouvinte?.remove();
      this.onend?.();
    }
  }

  stop() {
    void stt()
      .then((s) => s.stop())
      .catch(() => {});
  }

  abort() {
    this.stop();
  }
}

// ── Voz (TTS) do Android

let vozesJa: Promise<number[]> | null = null;
/** Índices (na lista do aparelho) das vozes japonesas. */
function indicesJa(): Promise<number[]> {
  return (vozesJa ??= tts()
    .then((t) => t.getSupportedVoices())
    .then(({ voices }) => voices.flatMap((v, i) => (v.lang.replace("_", "-").startsWith("ja") ? [i] : [])))
    .catch(() => []));
}

/** Fala com a voz do Android. `voz` sorteia entre as vozes japonesas (treino de ouvido). */
export async function falarNativo(texto: string, lang: "ja-JP" | "pt-BR", rate: number, voz?: number) {
  const ja = lang === "ja-JP" && voz !== undefined ? await indicesJa() : [];
  await (await tts()).speak({ text: texto, lang, rate, voice: ja.length ? ja[voz! % ja.length] : undefined });
}

export function pararNativo() {
  void tts()
    .then((t) => t.stop())
    .catch(() => {});
}

export async function vozJaponesaInstalada() {
  return tts()
    .then((t) => t.isLanguageSupported({ lang: "ja-JP" }))
    .then((r) => r.supported)
    .catch(() => false);
}

// ── Backup no APK

/** Grava o banco no cache do app e abre o menu de compartilhar do Android, para a pessoa guardar onde quiser. */
export async function salvarBackupNoApp(nome: string, bytes: Uint8Array) {
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  const { Directory, Filesystem } = await import("@capacitor/filesystem");
  const { Share } = await import("@capacitor/share");
  const { uri } = await Filesystem.writeFile({ path: nome, data: btoa(bin), directory: Directory.Cache });
  await Share.share({ title: "Backup do KoeFirst", files: [uri] });
}
