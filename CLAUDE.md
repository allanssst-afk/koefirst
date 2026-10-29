# KoeFirst (声ファースト) — guia do projeto

PWA de uso pessoal para aprender japonês do zero ao B1 em 12 meses, com **oralidade primeiro**,
**compreensão cognitiva** (lógica literal da frase japonesa) e **repetição espaçada FSRS**.
**Sem servidor:** site estático no GitHub Pages; o banco SQLite roda no navegador e fica salvo no aparelho.
Backup e troca de aparelho pelo cartão "Seu progresso" do Dashboard (baixar/carregar arquivo `.db`).

## Estrutura do app

- **Abas:** Aprender (`/`, trilha) · Revisar (`/study`, FSRS) · Praticar (`/drills`, Ping-Pong) ·
  Conversar (`/roleplay`, Arena) · Perfil (`/perfil`, estatísticas, camada ortográfica e backup).
- **Trilha** (`src/lib/trilha.ts`): unidades por situação de vida (`UNIDADES`, cada uma com cards, contexto do
  Ping-Pong e missões da Arena) → lições geradas por `licoesDa`: tutorial (unidade 0, "Como funciona o mapa de
  som"), Frases novas (até 3 cards), Ping-Pong, Diálogo (missão da Arena, abre `/roleplay/?missao=…&licao=…`) e
  Revisão. Progresso linear: a próxima lição desbloqueia quando a anterior é concluída. Visualmente é um mapa de
  metrô: cada unidade é uma "linha" (símbolo de anel com o número, cor em `cor`) e cada lição uma "estação"
  numerada (`1-03`) num trilho vertical — não usar o caminho em zigue-zague de círculos.
- **Lição** (`/licao/?id=u1:l2`, `src/components/licao/`): um exercício por tela, barra de progresso, botão
  VERIFICAR → painel verde/vermelho → CONTINUAR; erros voltam no fim. Exercícios (`montarLicao`): nova frase
  (com a `CognitiveBreakdown`: lógica literal + blocos na ordem japonesa), ouvir e escolher a tradução, **montar a
  frase em japonês** (blocos com função + som, na ordem japonesa, com 2 blocos intrusos; só frases de 2+ blocos),
  falar, escolher a resposta japonesa (diálogo do Ping-Pong), quiz e slides do tutorial; e, com base em pesquisa:
  **sombra** (shadowing: 4 rodadas falando junto com o áudio, 2 devagar + 2 normais, logo depois da 1ª frase de
  fala da lição; informativo) e **melodia** (treino de ouvido com pares mínimos de entonação: a frase certa contra
  a mesma frase com um bloco plano↔queda trocado, voz sorteada entre as do aparelho; 1 por lição de frases e 2
  na revisão; erro de melodia não entra na nota FSRS da frase). O painel de resposta
  mostra a "Lógica japonesa" (`significado_cognitivo`). Concluir grava em `licao_log` (XP: 10, +5 sem erros;
  missão da Arena: 15) e leva o desempenho ao FSRS (`concluirLicao`): frase nova recebe a primeira nota pelos
  erros dela na lição (`notaDaLicao`: 0 = Good, 1 = Hard, 2+ = Again); na lição de revisão, só as frases
  erradas recebem Again. Nunca dar "Good" automático.
- **Simulado de escuta** (`tipo: "simulado"`, `opcional: true`): última estação de cada unidade com 3+ frases,
  no formato da prova de escuta do JLPT N5/N4 adaptado à fase só de som (`PARTES_SIMULADO`): Compreensão (ouvir
  e escolher o sentido) · Expressão na situação (`situacao`: lê a situação e escolhe entre 3 frases só em áudio) ·
  Resposta rápida (`imediata`: ouve a pergunta e escolhe a resposta em áudio; só formas cuja pergunta traz a
  situação, para haver uma resposta única). Modo prova no `LessonPlayer`: sem correção a cada questão, sem
  repetir erros; no fim, nota por parte e aprovação no critério do JLPT (60% no total + 1/3 em cada parte) e a
  correção. Erros viram Again no FSRS; XP 20. Lição opcional não trava a trilha: abre quando o resto da unidade
  termina. Novas lições entram sempre no FIM de `licoesDa` (os ids `uN:lM` são a chave do progresso salvo).
- **Técnicas do método** (`src/components/TecnicasCard.tsx`, no Perfil): cada técnica, a base de pesquisa e onde
  está no app. Atualizar ao criar exercícios novos.
- **Limite diário de frases novas:** `meta_novos_dia` (Perfil → "Frases novas por dia") vale para trilha e aba
  Revisar juntas (`novosDeHoje`). Lição de frases que passaria da meta não abre ("Amanhã"); o resto do dia é
  revisão e prática.
- **Visual (identidade própria, não imitar o Duolingo):** tema "sumi e shu" — fundo cor de tinta, vermelhão
  (`--accent`) para ações, jade (`--ok`) para acerto, rosa (`--bad`) para erro, dourado para a entonação
  (`--pitch`); fonte Outfit; botões planos que encolhem ao tocar (`.btn`, `.btn-primario`, `.btn-secundario` em
  `globals.css`); painel de resposta escuro com faixa colorida no topo; textos sem caixa-alta nos botões; e a
  mascote Koe (`src/components/Mascote.tsx`, personagem original — um balão de fala).
- Cada card do seed tem `traducao` (tradução natural; alternativas com " / ") usada pelos exercícios.

## Regra pedagógica fundamental (não quebrar)

- **Fase 1 (meses 1–3) = zero escrita japonesa.** Nada de hiragana, katakana, kanji ou romaji corrido
  na interface principal. A frase é mostrada **só** como Guia Prosódico: blocos de moras com tom
  Alto/Baixo (Tokyo pitch), a curva de entonação e a função cognitiva de cada bloco.
- **Ouvir → imitar → lembrar.** Card de fala novo passa primeiro pela etapa *Aprender*
  (`src/components/study/LearnPanel.tsx`: áudio normal/devagar, mapa de moras, decomposição e 2 repetições
  em voz alta). Depois volta à fila 3 cards à frente como teste sem áudio. Nenhuma revisão é gravada na etapa
  Aprender: o primeiro rating FSRS é o do teste.
- Revisões testam a lembrança *antes* de ouvir. O botão "Ouvir dica" toca o primeiro bloco e, num segundo
  clique, a frase inteira. Usar dica limita a nota sugerida a Hard.
- **Contexto antes da sessão.** Estúdio e Ping-Pong começam com a escolha do contexto de vida
  (`src/components/ContextPicker.tsx`; categorias em `src/lib/roleplay.ts`). No Estúdio o contexto filtra só as
  frases NOVAS (tags `ctx:<categoria>` nos cards); revisões vencidas entram sempre. No Ping-Pong o contexto
  define as situações (`CENAS_DRILL` em `src/lib/drills.ts`, cada uma com o complemento em japonês + partícula +
  pitch). O drill é uma troca de frases completas (`montarDialogo`): o parceiro pergunta em japonês (毎日…ますか /
  昨日…ましたか / 何をしたいですか / 何をしましょうか) e o usuário responde a frase inteira e educada
  (いいえ、部長と話しません). O tempo de resposta só começa quando o usuário aperta "Estou pronto — responder"
  (etapa `ready`), depois de ouvir a pergunta e ler o contexto. As peças (complemento + verbo base) ficam na
  tela com áudio. Avaliação: completo (verbo + complemento) · parcial (só o verbo) · erro. Nada é falado em
  português; a legenda das transformações (-mashita, -masen…) fica sempre visível.
- Isso vale também para o que *o usuário* fala: na Fase 1 a transcrição do STT **não é exibida**
  (mostra-se só a % de correspondência). Na Fase 2+ ela aparece.
- Camadas ortográficas (`user_settings.fase_atual`), aplicadas pelo componente `ScriptLayer`:
  1. Som puro (mapa de moras/pitch) · 2. + hiragana (`kana_oculto`) ·
  3. + kanji com furigana (`kanji_oculto`) · 4. imersão B1 (kanji sem furigana).
- **Expressões prontas** (こんにちは, ありがとうございます, すみません, はじめまして…) aparecem como um bloco
  `papel: "expressao"` com o significado real ("olá / boa tarde"), nunca decompostas pela etimologia
  ("este dia + [Tópico]"). A origem histórica, quando ajuda, vai nas `notas` como curiosidade.
- Textos em português (notas, dicas, funções) nunca levam escrita japonesa: na Fase 1 eles aparecem para todos.
- Toda frase nova na UI deve vir com `moras` (som, pitch H/L, bloco, função, papel).

## Stack

- Next.js (App Router) com `output: "export"` (site estático) + TypeScript + Tailwind CSS v4 (tema escuro).
  PWA: `src/app/manifest.ts` + `public/sw.js` (registrado só no build de produção).
- Banco **no navegador**: SQLite em WebAssembly (`sql.js`) + Drizzle (`drizzle-orm/sql-js`), salvo no
  IndexedDB (`src/lib/idb.ts`). `src/db/index.ts`: `abrirBanco()` aplica as migrações embutidas e o seed
  (`src/db/seed-run.ts`, idempotente, preserva progresso); `salvar()` grava após cada alteração.
  `PhaseProvider` só renderiza as telas depois de `abrirBanco()`, então as telas consultam o banco direto.
- Migrações: `drizzle/` (drizzle-kit) → `scripts/gerar-migracoes.mjs` embute em
  `src/db/migrations.generated.ts` (mesmo formato/hash do migrator do drizzle, para bancos importados do antigo
  app de servidor serem reconhecidos) e copia `sql-wasm-browser.wasm` para `public/`. Roda em `predev`/`prebuild`.
- `ts-fsrs` v6 (`DefaultScheduler`, FSRS-7) com `desiredRetention = 0.90` — configuração única em
  `src/lib/fsrs.ts`. Passos 1m/10m com `allowModelOverride: false`, para frases novas voltarem em minutos.
- Áudio só com APIs do navegador: TTS `speechSynthesis` (ja-JP), STT `webkitSpeechRecognition` (ja-JP; pt-BR no
  Coach), gravação `MediaRecorder`, "Nativo vs Eu" e contorno de F0 via Web Audio API (`src/lib/audio/pitch.ts`).
- Sem IA externa (não há onde guardar chave num site estático): a Arena usa os roteiros guiados dos cenários e o
  Coach busca a frase mais parecida no baralho (`fraseMaisProxima` em `src/lib/queries.ts`).
  `Capabilities` em `PhaseProvider` fica toda `null`.

## Estrutura de diretórios

```
CLAUDE.md
drizzle.config.ts · next.config.ts · postcss.config.mjs · tsconfig.json
scripts/publicar.sh              # npm run publicar → build + envio para a branch gh-pages
scripts/gerar-migracoes.mjs      # embute migrações + copia o wasm do SQLite
scripts/servir.mjs               # servidor estático mínimo para testar o build (npm start)
drizzle/                         # migrações SQL geradas
public/sw.js · public/icon.svg · public/audio/
src/
  app/
    layout.tsx · globals.css · manifest.ts
    page.tsx                     # Aprender — trilha de unidades e lições
    licao/page.tsx               # player de lição (?id=u1:l2)
    perfil/page.tsx              # estatísticas, camada ortográfica, backup
    study/page.tsx               # Tela 2 — Estúdio SRS de Reflexo Oral
    drills/page.tsx              # Tela 3 — Ping-Pong de Ginástica Gramatical
    roleplay/page.tsx            # Tela 4 — Arena de Diálogos + Coach
  components/
    PitchAccentVisualizer.tsx    # blocos de moras + curva H/L + blocos coloridos por função
    CognitiveBreakdown.tsx       # ordem lógica japonesa (Tópico → Tempo → Objeto → Verbo)
    ScriptLayer.tsx              # aplica a camada ortográfica da fase atual
    PhaseProvider.tsx            # abre o banco do aparelho + fase global + seletor
    PhaseCard.tsx · BackupCard.tsx · ContextPicker.tsx · TecnicasCard.tsx
    AudioControls.tsx            # Ouvir / Devagar / "Nativo vs Eu"
    useVoiceCapture.ts           # hook de gravação + STT + latência
    PitchContourView.tsx         # F0 da gravação vs padrão H/L
    ReflexTimer.tsx · RatingButtons.tsx · NavBar.tsx · ServiceWorker.tsx
    study/LearnPanel.tsx
    licao/ LessonPlayer.tsx · Exercicios.tsx · Tutorial.tsx · comuns.tsx
    Mascote.tsx
    roleplay/ RoleplayArena.tsx · JaBubble.tsx · CoachWhisper.tsx
  db/
    schema.ts · index.ts (sql.js + IndexedDB) · seed-run.ts · migrations.generated.ts (gerado)
    seed-data/cards.ts (+ cards-trabalho.ts) · seed-data/scenarios.ts (+ scenarios-cotidiano.ts, scenarios-extra.ts,
      scenarios-trabalho.ts) · seed-data/helpers.ts
  lib/
    types.ts · fsrs.ts · roles.ts · text.ts (normalização/similaridade/furigana) · idb.ts
    queries.ts                   # consultas e gravações (fila, revisão, dashboard, atividade, coach offline)
    drills.ts                    # verbos, cenas com complemento em japonês, montarDialogo
    roleplay.ts                  # categorias de contexto
    trilha.ts                    # unidades, lições e geração dos exercícios
    audio/ tts.ts · capture.ts (MediaRecorder + STT + VAD) · pitch.ts (F0)
```

## Modelo de dados (Drizzle, `src/db/schema.ts`)

- `cards` — `id, fase (1–4), tipo ('listening'|'speaking'|'drill_conjugacao'), situacao_pt,
  significado_cognitivo, moras_json, kana_oculto, kanji_oculto, audio_url, notas_gramaticais, tags, created_at`.
- `fsrs_states` — `card_id, due, stability, difficulty, elapsed_days, scheduled_days, learning_steps,
  reps, lapses, state (0 New,1 Learning,2 Review,3 Relearning), last_review`.
- `review_logs` — histórico completo + `tempo_resposta_ms` (latência até começar a falar),
  `duracao_fala_ms`, `transcricao`, `similaridade`.
- `scenarios_roleplay` — `id, titulo, missao_pt, nivel, categoria, emoji, parceiro_nome, parceiro_emoji,
  vocabulario_requerido_ids, system_prompt_cenario, roteiro_offline_json`. Cada passo do roteiro pode trocar
  quem fala (`quem`) e traz uma resposta-modelo (`exemplo`/`exemplo_card`) para o botão "Como responder?".
- `user_settings` — linha única (`id = 1`): `fase_atual`, `meta_novos_dia`, `meta_revisoes_dia`,
  `meta_minutos_fala`, `data_inicio`.
- `speech_activity` — tempo de fala em drills/roleplay/coach (alimenta "tempo de fala acumulada").
- `licao_log` — uma linha por lição concluída (`licao_id`, `xp`, `acertos`, `total`): progresso da trilha,
  XP e, com revisões e fala, a sequência de dias (`diasSeguidos`).

### Formato de mora (`moras_json`)

```ts
{ som: "ko", pitch: "H" | "L", bloco: "kore", funcao: "isto", papel: "topico", devozeada?: true }
```
`papel` define a cor do bloco (`src/lib/roles.ts`): topico, sujeito, objeto, verbo, particula,
pergunta, tempo, lugar, copula, adjetivo, substantivo, adverbio, expressao.
Moras consecutivas com o mesmo `bloco` formam um bloco gramatical.

### Furigana

`kanji_oculto` usa a notação `漢字[かんじ]` (a leitura entre colchetes vale para a sequência de kanji
imediatamente anterior). `src/lib/text.ts` converte para `<ruby>` (Fase 3) ou texto limpo (Fase 4/STT).

## Pitch accent do seed

Padrão de Tóquio conforme convenções NHK/OJAD (heiban, atamadaka, nakadaka, odaka; `です` após palavra
heiban = H‑L, após queda = L‑L; formas `-ます` = queda depois de `ma`; `-ません` = queda depois de `se`).
Ao adicionar cards, valide em OJAD (Suzuki-kun) e escreva os cards com o helper `b()` de
`src/db/seed-data/helpers.ts`: `b("ko.re", "LH", "isto", "topico")`.

## Comandos

```bash
npm run dev          # http://localhost:3000 (banco no navegador)
npm run build        # gera o site estático em out/
npm start            # serve out/ em http://localhost:3000 para testar o build
npm run db:generate  # após mudar schema.ts (gera a migração e embute)
```

## Publicação (GitHub Pages)

- Repositório público `allanssst-afk/koefirst`. `npm run publicar` (`scripts/publicar.sh`) faz o build com
  `NEXT_PUBLIC_BASE_PATH=/koefirst` e envia `out/` para a branch `gh-pages` (Pages "deploy from branch"),
  publicado em https://allanssst-afk.github.io/koefirst/. Sem GitHub Actions: o token do `gh` não tem
  escopo `workflow`.
- No celular: abrir o endereço e instalar ("Adicionar à Tela de Início" / "Instalar app"). HTTPS do GitHub
  Pages libera o microfone. Cada aparelho tem o próprio banco; para levar o progresso, use backup/carregar.

## Convenções

- Nada de servidor, login ou serviço pago: tudo precisa funcionar como site estático no navegador.
- Todo caminho absoluto de arquivo (wasm, sw.js, ícones, manifest) usa `NEXT_PUBLIC_BASE_PATH`; links internos
  via `next/link` (o Next aplica o basePath sozinho).
- Gravações no banco passam por funções de `src/lib/queries.ts`, que chamam `salvar()` no fim.
- Textos de interface em português; frases-alvo em japonês só pela camada `ScriptLayer`.
- Celular primeiro: nada de rolagem horizontal. O `PitchAccentVisualizer` mede a largura disponível e quebra a
  frase em linhas entre blocos gramaticais; rótulos de função nunca quebram no meio da palavra (descem para
  outra faixa). Listas de chips usam `flex-wrap`.
- FSRS: nunca instanciar o agendador fora de `src/lib/fsrs.ts`.
- `public/sw.js`: páginas = rede primeiro (cache só offline); `/_next/static` e `.wasm` = cache primeiro.
  Nunca devolver HTML no lugar de JS/WASM (isso já quebrou o app).
- Para testar um build sem atrapalhar o `npm run dev`: `NEXT_DIST_DIR=.next-test npm run build` — com pasta
  customizada o site exportado fica dentro dela; sirva com `node scripts/servir.mjs .next-test`.
