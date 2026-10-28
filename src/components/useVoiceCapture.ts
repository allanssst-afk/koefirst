"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { startCapture, type CaptureHandle, type CaptureOptions, type CaptureResult } from "@/lib/audio/capture";

export type CaptureStatus = "idle" | "recording" | "processing";

/** Hook React em volta de startCapture: estado, nível do microfone e latência ao vivo. */
export function useVoiceCapture() {
  const [status, setStatus] = useState<CaptureStatus>("idle");
  const [level, setLevel] = useState(0);
  const [latency, setLatency] = useState<number | null>(null);
  const [interim, setInterim] = useState("");
  const handle = useRef<CaptureHandle | null>(null);
  const urls = useRef<string[]>([]);

  useEffect(
    () => () => {
      handle.current?.stop();
      urls.current.forEach((u) => URL.revokeObjectURL(u));
    },
    [],
  );

  const start = useCallback(
    async (opts: Omit<CaptureOptions, "onLevel" | "onSpeechStart" | "onInterim"> = {}): Promise<CaptureResult> => {
      handle.current?.stop();
      setLatency(null);
      setInterim("");
      setStatus("recording");
      const h = startCapture({
        ...opts,
        onLevel: (v) => setLevel(v),
        onSpeechStart: (ms) => setLatency(ms),
        onInterim: (t) => setInterim(t),
      });
      handle.current = h;
      const result = await h.done;
      if (result.url) urls.current.push(result.url);
      handle.current = null;
      setLevel(0);
      setStatus("idle");
      return result;
    },
    [],
  );

  const stop = useCallback(() => {
    if (handle.current) {
      setStatus("processing");
      handle.current.stop();
    }
  }, []);

  return { status, level, latency, interim, start, stop };
}
