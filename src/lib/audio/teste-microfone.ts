/**
 * Teste do microfone (Perfil): gravação, reconhecimento e os dois juntos, cada um à parte, para descobrir no aparelho da
 * pessoa o que funciona. Devolve linhas de texto, sem a transcrição (a Fase 1 não mostra escrita). Chamar dentro do toque: o
 * navegador exige gesto para abrir o áudio.
 */
import { eAndroid, eIphone, getSR, instalado, micSupported } from "./capture";
import { eApp, vozJaponesaInstalada } from "./nativo";

const DURACAO_MS = 4000;
const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));

function ouvirReconhecedor(): Promise<string> {
  const Ctor = getSR();
  if (!Ctor) return Promise.resolve("Reconhecimento: não existe neste navegador.");
  return new Promise((resolve) => {
    const rec = new Ctor();
    let texto = "";
    let erro = "";
    let acabou = false;
    let abriu = false;
    const fim = () => {
      if (acabou) return;
      acabou = true;
      resolve(
        erro
          ? `Reconhecimento: falhou (${erro}${abriu ? "" : ", sem abrir o microfone"}).`
          : texto
            ? `Reconhecimento: ok, entendeu ${[...texto].length} caracteres.`
            : abriu
              ? "Reconhecimento: abriu o microfone, mas não entendeu nada."
              : "Reconhecimento: não chegou a abrir o microfone.",
      );
    };
    rec.lang = "ja-JP";
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.continuous = false;
    rec.onspeechstart = null;
    rec.onaudiostart = () => {
      abriu = true;
    };
    rec.onresult = (e) => {
      texto = Array.from({ length: e.results.length }, (_, i) => e.results[i][0]?.transcript ?? "").join("");
    };
    rec.onerror = (e) => {
      if (e.error !== "no-speech") erro = e.error;
    };
    rec.onend = fim;
    try {
      rec.start();
    } catch (e) {
      erro = (e as Error).name;
      fim();
    }
    setTimeout(() => {
      try {
        rec.stop();
      } catch {}
      setTimeout(fim, 1000);
    }, DURACAO_MS);
  });
}

async function ouvirGravacao(ctx: AudioContext | null): Promise<string> {
  if (!micSupported()) return "Gravação: este navegador não dá acesso ao microfone.";
  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
  } catch (e) {
    return `Gravação: falhou (${(e as Error).name}).`;
  }
  const chunks: Blob[] = [];
  let pico = 0;
  let recorder: MediaRecorder | null = null;
  try {
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (ev) => ev.data.size && chunks.push(ev.data);
    recorder.start();
  } catch {
    recorder = null;
  }
  let id = 0;
  if (ctx) {
    void ctx.resume().catch(() => {});
    const an = ctx.createAnalyser();
    an.fftSize = 1024;
    ctx.createMediaStreamSource(stream).connect(an);
    const buf = new Float32Array(an.fftSize);
    id = window.setInterval(() => {
      an.getFloatTimeDomainData(buf);
      pico = Math.max(pico, Math.sqrt(buf.reduce((s, v) => s + v * v, 0) / buf.length));
    }, 50);
  }
  await espera(DURACAO_MS);
  clearInterval(id);
  if (recorder) {
    const r = recorder;
    await new Promise<void>((ok) => {
      r.onstop = () => ok();
      r.stop();
    });
  }
  stream.getTracks().forEach((t) => t.stop());
  const kb = Math.round(chunks.reduce((s, c) => s + c.size, 0) / 1024);
  const nivel = Math.round(pico * 1000) / 10;
  return `Gravação: ${kb} KB, volume ${nivel}%${pico < 0.01 ? " (praticamente mudo)" : ""}, áudio ${ctx?.state ?? "indisponível"}.`;
}

export type TesteMicrofone = "gravacao" | "reconhecimento" | "juntos";

export async function testarMicrofone(qual: TesteMicrofone): Promise<string[]> {
  let ctx: AudioContext | null = null;
  try {
    if (qual !== "reconhecimento") ctx = new AudioContext();
  } catch {
    ctx = null;
  }
  const linhas =
    qual === "gravacao" ? [await ouvirGravacao(ctx)] : qual === "reconhecimento" ? [await ouvirReconhecedor()] : await Promise.all([ouvirReconhecedor(), ouvirGravacao(ctx)]);
  void ctx?.close().catch(() => {});
  return linhas;
}

const PERMISSAO: Record<string, string> = { granted: "permitida", denied: "bloqueada", prompt: "ainda não respondida" };

/** Onde o app está rodando: versão, modo (instalado ou aba), aparelho e o que o navegador oferece. */
export async function diagnosticoAmbiente(): Promise<string[]> {
  let permissao = "o navegador não informa";
  try {
    const st = await navigator.permissions.query({ name: "microphone" as PermissionName });
    permissao = PERMISSAO[st.state] ?? st.state;
  } catch {}
  const chrome = navigator.userAgent.match(/Chrome\/(\d+)/)?.[1];
  const aparelho = eAndroid() ? "Android" : eIphone() ? "iPhone" : "computador";
  const modo = eApp() ? "app Android (APK)" : instalado() ? "app instalado" : "aba do navegador";
  return [
    `Versão do app: ${process.env.NEXT_PUBLIC_VERSAO ?? "dev"}`,
    `Aberto como: ${modo} · ${aparelho}${chrome ? ` · Chrome ${chrome}` : ""}`,
    `Permissão do microfone: ${permissao}`,
    ...(eApp() ? [`Voz japonesa do Android: ${(await vozJaponesaInstalada()) ? "instalada" : "não instalada (Configurações > Sistema > Idiomas > Saída de conversão de texto em voz)"}`] : []),
    `Reconhecimento de voz: ${getSR() ? "existe" : "não existe"} · gravação: ${micSupported() && typeof MediaRecorder !== "undefined" ? "existe" : "não existe"}${isSecureContext ? "" : " · conexão sem HTTPS"}`,
  ];
}
