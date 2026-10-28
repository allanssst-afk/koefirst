/**
 * TTS no navegador: arquivo nativo (audio_url) → speechSynthesis (voz japonesa do aparelho).
 * Todas as funções devolvem uma Promise que resolve quando o áudio termina.
 */

let current: HTMLAudioElement | null = null;
// Mantém referência para o Chrome não descartar a utterance antes do onend.
const liveUtterances: SpeechSynthesisUtterance[] = [];

export function stopAll() {
  if (current) {
    current.pause();
    current = null;
  }
  if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
}

export function playUrl(url: string, rate = 1): Promise<void> {
  stopAll();
  return new Promise((resolve, reject) => {
    const a = new Audio(url);
    a.playbackRate = rate;
    current = a;
    a.onended = () => resolve();
    a.onerror = () => reject(new Error("audio error"));
    a.play().catch(reject);
  });
}

let voicesReady: Promise<SpeechSynthesisVoice[]> | null = null;
function getVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof speechSynthesis === "undefined") return Promise.resolve([]);
  return (voicesReady ??= new Promise((resolve) => {
    const v = speechSynthesis.getVoices();
    if (v.length) return resolve(v);
    const done = () => resolve(speechSynthesis.getVoices());
    speechSynthesis.addEventListener("voiceschanged", done, { once: true });
    setTimeout(done, 1500);
  }));
}

const PREFERRED: Record<string, RegExp> = {
  "ja-JP": /(Google 日本語|Kyoko|O-ren|Nanami|Haruka|Ayumi|Otoya)/i,
  "pt-BR": /(Google português do Brasil|Luciana|Francisca|Felipe|Maria)/i,
};

export async function speakSynth(text: string, lang: "ja-JP" | "pt-BR", rate = 1): Promise<void> {
  if (typeof speechSynthesis === "undefined") return;
  stopAll();
  const voices = await getVoices();
  const sameLang = voices.filter((v) => v.lang.replace("_", "-").startsWith(lang.slice(0, 2)));
  const voice = sameLang.find((v) => PREFERRED[lang].test(v.name)) ?? sameLang[0];
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    if (voice) u.voice = voice;
    liveUtterances.push(u);
    const finish = () => {
      liveUtterances.splice(liveUtterances.indexOf(u), 1);
      clearTimeout(guard);
      resolve();
    };
    const guard = setTimeout(finish, 2500 + text.length * 300);
    u.onend = finish;
    u.onerror = finish;
    speechSynthesis.speak(u);
  });
}

/** Fala uma frase japonesa (kana de preferência). */
export async function speakJa(text: string, opts: { url?: string | null; rate?: number } = {}): Promise<void> {
  const rate = opts.rate ?? 1;
  if (opts.url) {
    try {
      return await playUrl(opts.url, rate);
    } catch {
      /* cai para TTS */
    }
  }
  return speakSynth(text, "ja-JP", rate);
}

export function speakPt(text: string, rate = 1.05) {
  return speakSynth(text, "pt-BR", rate);
}

export const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
