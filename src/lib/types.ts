export type Pitch = "H" | "L";

export type Papel =
  | "topico"
  | "sujeito"
  | "objeto"
  | "verbo"
  | "particula"
  | "pergunta"
  | "tempo"
  | "lugar"
  | "copula"
  | "adjetivo"
  | "substantivo"
  | "adverbio"
  | "expressao";

export interface Mora {
  som: string;
  pitch: Pitch;
  bloco: string;
  funcao: string;
  papel?: Papel;
  devozeada?: boolean;
}

export type CardTipo = "listening" | "speaking" | "drill_conjugacao";

/** Fase ortográfica: 1 som puro · 2 + hiragana · 3 kanji com furigana · 4 imersão B1. */
export type Fase = 1 | 2 | 3 | 4;

export interface CardDTO {
  id: string;
  fase: number;
  tipo: CardTipo;
  situacao_pt: string;
  significado_cognitivo: string;
  moras: Mora[];
  kana_oculto: string;
  kanji_oculto: string;
  audio_url: string | null;
  notas_gramaticais: string;
  tags: string[];
}

/** Estado FSRS serializado (datas em ISO). */
export interface FsrsStateDTO {
  due: string;
  stability: number;
  stability_fast: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  learning_steps: number;
  reps: number;
  lapses: number;
  state: number;
  schedule_status: string;
  last_review: string | null;
}

export interface QueueItem {
  card: CardDTO;
  fsrs: FsrsStateDTO;
}

export interface SettingsDTO {
  fase_atual: Fase;
  meta_novos_dia: number;
  meta_revisoes_dia: number;
  meta_minutos_fala: number;
  data_inicio: string;
}

export interface Capabilities {
  ai: "anthropic" | "gemini" | null;
  tts: "google" | "elevenlabs" | "voicevox" | null;
  stt: "whisper" | "gemini" | null;
}

/** Uma fala em japonês pronta para a UI (usada por IA, roteiros e Coach). */
export interface JaLine {
  kana: string;
  kanji: string;
  pt: string;
  literal?: string;
  moras: Mora[];
  pitch_estimado?: boolean;
}
