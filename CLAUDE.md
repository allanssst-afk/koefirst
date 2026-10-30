# KoeFirst (声ファースト) — guia do projeto

PWA de uso pessoal para aprender japonês do zero ao B1 em 12 meses, com **oralidade primeiro**,
**compreensão cognitiva** (lógica literal da frase japonesa) e **repetição espaçada FSRS**.
**Sem servidor:** site estático no GitHub Pages; o banco SQLite roda no navegador e fica salvo no aparelho.
Backup e troca de aparelho pelo cartão "Seu progresso" do Dashboard (baixar/carregar arquivo `.db`).

## Plano de conteúdo

`docs/plano-12-meses.md`: metas do B1, unidades e gramática mês a mês, peças que o app ainda precisa (novas
formas no Ping-Pong, leitura, simulado completo, kanji N3, fala longa) e o roteiro para produzir cada unidade.
Unidades novas seguem a ordem do plano; ao terminar uma, marcar no plano.

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
- **Revisão de fim de fase** (`revisaoGeral` na unidade, ex.: u14 "Revisão da Fase 1"): sem frases novas
  (`cards: []`); `licoesDa` gera uma revisão por tema com as frases das unidades listadas, o Ping-Pong (contexto
  `"todos"`, todas as formas já ensinadas), as missões longas (a "Conversa de 2 minutos", marco do mês 3) e, no
  fim, um simulado OBRIGATÓRIO com todas as frases (6 questões por parte quando há mais de 30 frases).
- **Simulado N5 completo** (u26, `simuladoCompleto`): o simulado da revisão soma, antes da escuta e na ordem do JLPT,
  Vocabulário, Gramática e Leitura em kana (`ExProvaKana`; banco em `src/lib/simulado-n5.ts`, com 2 perguntas por
  texto). Sem áudio e fora do FSRS (não há frase do baralho). Na gramática, as opções erradas nunca formam outra frase
  válida. Só entra da Fase 2 em diante (`montarLicao(l, fase)`); na Fase 1 a prova fica só com a escuta e avisa disso.
- **Simulado N4 completo** (u35, `simuladoCompleto: "n4"` + `simuladoDe`): mesma prova, com as frases das unidades 27–35 e o
  banco de `src/lib/simulado-n4.ts`. No lugar do simulado opcional da unidade, e obrigatório. Vocabulário cobra a leitura
  do kanji, sem furigana; gramática e leitura usam `漢字[よみ]` (furigana na Fase 3, sem na Fase 4). Parte escrita só da
  Fase 3 em diante (`faseMinimaDaProva`).
- **Técnicas do método** (`src/components/TecnicasCard.tsx`, no Perfil): cada técnica, a base de pesquisa e onde
  está no app. Atualizar ao criar exercícios novos.
- **Dicionário** (`/dicionario`, `src/lib/dicionario.ts`): cada bloco das frases do baralho vira um verbete
  (função em português, papel, som, melodia como aparece na frase, frases onde aparece) + aba de frases; busca em
  português ou pelo som. Na Fase 1 o som aparece só em moras separadas (`ka·i·gi`); kana a partir da Fase 2.
- **Escrita japonesa** (`/escrita`, `/escrita/tracar/?k=あ`, `src/components/escrita/`, `src/lib/kana.ts`):
  tabela de hiragana/katakana (básicos + ten-ten/maru) com som e progresso, caligrafia (`Caligrafia.tsx`: traça
  com o dedo; cada traço é comparado ao de referência por `tracoConfere` — ordem, sentido e tamanho; guia com
  números, grade, animação da ordem dos traços, modo de memória sem guia) e quiz de 16 perguntas com cronômetro
  (`QuizKana.tsx`: kana→som, som→kana, hiragana↔katakana; kana não dominado sai 3× mais). Respostas e traçados
  vão para `kana_log` (`registrarKana`/`progressoKana`; dominado = 3 acertos seguidos). Ordem dos traços:
  `src/lib/kana-tracos.generated.ts`, gerado por `scripts/gerar-kana.mjs` a partir do KanjiVG (CC BY-SA 3.0,
  crédito na página). **Exceção à Fase 1:** é um módulo à parte, aberto por atalhos no Perfil e no Praticar
  (`AtalhosEstudo`); na Fase 1 mostra o aviso de que a escrita entra na Fase 2, e o resto do app segue só com som.
- **Kanji** (`/kanji`, `/kanji/ver/?k=会&g=app`, `src/lib/kanji.ts`, `QuizKanji.tsx`): 335 kanji — os das frases,
  missões e Ping-Pong do app (`noApp`) + JLPT N5 (103) e N4 (181) — com significados em português, leituras on/kun,
  nível, ordem dos traços e as palavras das frases que usam cada um (`PALAVRAS`: tiradas de `漢字[よみ]` nos cards;
  o okurigana e o prefixo お/ご vêm do bloco de moras que contém a leitura). Caligrafia igual à dos kana
  (`Caligrafia` com `dados`), quiz kanji→sentido, sentido→kanji e palavra→leitura (o quiz genérico fica em
  `escrita/Quiz.tsx`). Progresso no mesmo `kana_log`. Dados em `src/lib/kanji-dados.generated.ts`, gerado por
  `scripts/gerar-kanji.ts` a partir do KANJIDIC2 (EDRDG, CC BY-SA 4.0) e do KanjiVG; `SIG_EXTRA` corrige à mão os
  significados que faltam ou enganam. Os traços já gerados são reaproveitados: `--lista <kanjidic2.xml.gz>` mostra
  só os kanji novos, e basta baixar o .svg deles do KanjiVG. Só as páginas de kanji importam esses dados (o dicionário não). Na Fase < 3
  mostra o aviso de que os kanji entram na Fase 3; no Dicionário, os atalhos para os kanji da frase só aparecem
  na Fase 3+.
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
- **Pedido (-te kudasai)** no Ping-Pong: o parceiro oferece 手伝いましょうか ("Quer que eu ajude?") e o usuário pede
  はい、[complemento][forma -te]ください. Cada verbo de `VERBOS` tem `te` (sons, acento — 0 plano, n = cai depois
  da n-ª mora —, kana, kanji) e `ptPedido` (imperativo). Depois de verbo com queda "kudasai" fica todo baixo; depois
  de verbo plano sobe até "sa". Só cenas da lista `PEDIDOS_OK` aceitam pedido (tarefas que alguém faz por você);
  `combina(cena, forma)` diz se a dupla vale e a tela sorteia só entre duplas válidas. Nas lições, cada unidade
  declara `formasNovas`: a forma entra no Ping-Pong dela (metade dos diálogos) e no sorteio das seguintes.
- **Agora (-te imasu)** no Ping-Pong: 今、何をしていますか → [complemento][forma -te]います ("(Eu) estou …", com
  `ptGerundio` do verbo). Mesmo padrão de pitch do pedido: depois de verbo com queda "imasu" fica todo baixo; depois
  de verbo plano fica alto até "ma". Verbos de movimento/estado pontual (ir, vir, voltar, acordar, começar,
  pegar condução, dormir) têm `sem: ["te_imasu"]`. O STT aceita também a forma falada "-temasu".
- **Hobby (forma de dicionário + koto desu)** no Ping-Pong: 趣味は何ですか → [complemento][forma de dicionário]ことです
  ("Meu hobby é …"). Cada verbo tem `dicio` (sons, acento, kana, kanji). Pitch do "koto": plano depois de verbo
  plano (HH), baixo depois de queda na 1ª mora (LL), sobe de novo depois de queda mais adiante (LH). Só cenas de
  lazer da lista `HOBBIES_OK` aceitam hobby.
- **Obrigação (-nakereba narimasen)** no Ping-Pong: 明日、何をしなければなりませんか → [complemento][base -nai]なければ
  なりません. Cada verbo tem `nai` (base antes de "nai": kaka, tabe, shi, ko). Pitch: verbo com queda cai na última
  mora da base; verbo plano cai depois do "na"; "narimasen" = LHHHL. Só tarefas da lista `OBRIGACOES_OK`. O STT
  aceita também "-nakya" e "-nai to".
- **Casual (-ta / -nakatta)** no Ping-Pong: o amigo pergunta 昨日、[complemento][verbo -ta]？ (sem "ka") e o usuário
  responde うん、…た ou ううん、…なかった. A forma -ta sai da forma -te (mesma melodia: tábete → tábeta); -nakatta sai
  da base -nai com a regra de pitch do -nakereba.
- **Experiência (-ta koto ga arimasu)** no Ping-Pong: [complemento][verbo -ta]ことがありますか → はい、…ことがあります
  ("Sim, (eu) já …"). O -ta mantém a melodia do verbo; "koto" = HH depois de verbo plano e LH depois de queda; "ga"
  baixo; "arimasu" = LHHL. Só cenas da lista `EXPERIENCIAS_OK` (coisas de poucas vezes na vida, não a rotina). O STT
  aceita também o casual "-ta koto aru".
- **Plano (volitiva + to omoimasu)** no Ping-Pong: 明日、何をしようと思いますか → [complemento][volitiva]と思います
  ("Estou pensando em …"). `volitiva()` sai da base -nai: grupo de taberu e irregulares (`VOLITIVA_YOU`) = base + "you";
  os outros trocam o último som por "-ou". Pitch: cai antes do último "o" em qualquer verbo (ikóo, tabeyóo); "to"
  baixo; "omoimasu" = LHHHL. Só cenas de lazer e tarefa (`HOBBIES_OK` + `OBRIGACOES_OK`).
- **Potencial (-eru / -rareru)** no Ping-Pong: [complemento + が][potencial]か → はい、…ます / いいえ、…ません (formas
  `reru` e `remasen`). `potencial()` sai da base -nai: som em "e", grupo de taberu + "rare", kuru = korare, suru = deki.
  `comGa` troca "o" por "ga" no complemento. Pitch: família -masu, sobe na 2ª mora e cai no fim em qualquer verbo. Só
  cenas de capacidade ou disponibilidade (`POTENCIAL_OK`).
- **Conselho (-tara ii desu yo)** no Ping-Pong: どうしたらいいですか → [complemento][verbo -tara]いいですよ ("É bom …").
  -tara = forma -ta (mesma melodia) + "ra" baixo; "ii" = HL. Só tarefas (`OBRIGACOES_OK`).
- **Favor (-te kuremashita)** no Ping-Pong: 田中さんは[complemento][forma -te]くれましたか → はい、…くれました ("Sim, … para
  mim"). Melodia da forma -te; "kuremashita" = LHHLL depois de queda, HHHLL depois de verbo plano. Só tarefas que outra
  pessoa pode fazer no seu lugar (`FAVORES_OK`).
- **Pedir com jeito (-tai n desu ga)** no Ping-Pong: 何かご用ですか → [complemento][verbo -tai]んですが. O "-tai" cai depois
  de "ta" em qualquer verbo, inclusive na forma `tai`; o resto fica baixo. Só o que se pede em um balcão (`BALCAO_OK`).
- **Sem querer (-te shimaimashita)** no Ping-Pong: どうしたんですか → [complemento][forma -te]しまいました ("Acabei …", com
  `ptGerundio`). "shimaimashita" = HHHHLL depois de verbo plano; baixo depois de queda (o OJAD varia nesse caso). Só o que
  se faz e depois se lamenta (`SEM_QUERER_OK`).
- **Humilde (o-… shimasu)** no Ping-Pong: [complemento]お願いできますか → はい、[complemento]お[raiz -masu]します ("Sim, (eu)
  …"). Pitch: "o" baixo, alto até "ma", cai em "su". O STT aceita também "-itashimasu". Só tarefas de escritório com objeto em "o"
  (`HUMILDE_OK`).
- **Passiva (-reru / -rareru)** no Ping-Pong: どうしたんですか → 友達に[complemento][passiva]ました (forma `rareta`, passiva de
  incômodo). `passiva()` sai da base -nai: + "re"; grupo de taberu e kuru + "rare"; suru = sare. Pitch: família -mashita. Só
  o que alguém pode fazer com algo seu (`PASSIVA_OK`).
- **Deixe-me (causativa + kudasai)** no Ping-Pong: どうしましたか → [complemento][causativa -te]ください (forma `sasete`).
  `causativa()` sai da base -nai: + "se"; grupo de taberu e kuru + "sase"; suru = sase. Pitch: verbo plano alto + kudasai
  HHHL; verbo com queda cai antes de "se" + kudasai baixo. Só tarefas, saídas e pagamentos (`DEIXE_ME_OK`; taberu fica fora).
- **Não precisa (-nakute mo ii)** no Ping-Pong: [complemento][-nakereba]なりませんか → いいえ、[complemento][base -nai]なくても
  いいです (forma `nakute`). Mesmo pitch do -nakereba; "ii" = HL. Só tarefas (`OBRIGACOES_OK`, sem okiru).
- **Ouvi dizer (-ta sou desu)** no Ping-Pong: 田中さんはどうしましたか → 田中さんは[complemento][verbo -ta]そうです (forma
  `ta_sou`). "sou" = HL depois de verbo plano, LL depois de queda. Só fatos que alguém passaria adiante (`OUVI_DIZER_OK`).
- **Depois de (-te kara)** no Ping-Pong: いつ帰りますか → [complemento][forma -te]から帰ります (forma `te_kara`). "kara" baixo e
  "kaerimasu" = LHHHL. Só tarefas que se terminam antes de ir embora (`OBRIGACOES_OK` + `ANTES_DE_VOLTAR`).
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
  Coach busca a frase mais parecida no baralho (`fraseMaisProxima` em `src/lib/queries.ts`). O Coach abre pelo
  `BotaoCoach` na linha de resposta da Arena — nada de botão flutuante (cobria os botões no celular).
  `Capabilities` em `PhaseProvider` fica toda `null`.

## Estrutura de diretórios

```
CLAUDE.md
drizzle.config.ts · next.config.ts · postcss.config.mjs · tsconfig.json
scripts/publicar.sh              # npm run publicar → build + envio para a branch gh-pages
scripts/gerar-migracoes.mjs      # embute migrações + copia o wasm do SQLite
scripts/servir.mjs               # servidor estático mínimo para testar o build (npm start)
scripts/validar-pitch.ts         # confere a entonação dos cards e missões com o OJAD
docs/plano-12-meses.md           # plano de conteúdo até o B1
drizzle/                         # migrações SQL geradas
public/sw.js · public/icon.svg · public/audio/
src/
  app/
    layout.tsx · globals.css · manifest.ts
    page.tsx                     # Aprender — trilha de unidades e lições
    dicionario/page.tsx          # dicionário de palavras e frases
    escrita/page.tsx · escrita/tracar/page.tsx   # kana: tabela, quiz e caligrafia
    kanji/page.tsx · kanji/ver/page.tsx          # kanji: listas, quiz, detalhe e caligrafia
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
    PhaseCard.tsx · BackupCard.tsx · ContextPicker.tsx · TecnicasCard.tsx · AtalhosEstudo.tsx
    escrita/ Caligrafia.tsx · Quiz.tsx · QuizKana.tsx · QuizKanji.tsx
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
    seed-data/cards.ts (+ cards-trabalho.ts, cards-lugares.ts, cards-numeros.ts, cards-pedidos.ts,
      cards-agora.ts, cards-adjetivos.ts, cards-fimdesemana.ts, cards-familia.ts, cards-saude.ts, cards-hobbies.ts,
      cards-regras.ts, cards-casual.ts, cards-opiniao.ts, cards-motivos.ts, cards-experiencias.ts, cards-comparar.ts, cards-planos.ts, cards-viagem.ts, cards-consegue.ts, cards-condicional.ts, cards-dar-receber.ts, cards-descrever.ts, cards-servicos.ts, cards-problemas.ts, cards-keigo.ts, cards-telefone.ts, cards-aparencias.ts, cards-passiva.ts, cards-causativa.ts, cards-conselhos.ts, cards-noticias.ts, cards-historia.ts, cards-negociar.ts, cards-entrevista.ts) ·
      seed-data/scenarios.ts
      (+ scenarios-cotidiano.ts,
      scenarios-extra.ts, scenarios-trabalho.ts, scenarios-lugares.ts, scenarios-numeros.ts, scenarios-pedidos.ts,
      scenarios-agora.ts, scenarios-adjetivos.ts, scenarios-fimdesemana.ts, scenarios-revisao.ts,
      scenarios-familia.ts, scenarios-saude.ts, scenarios-hobbies.ts, scenarios-regras.ts, scenarios-casual.ts,
      scenarios-opiniao.ts, scenarios-motivos.ts, scenarios-experiencias.ts, scenarios-comparar.ts, scenarios-planos.ts, scenarios-viagem.ts,
      scenarios-revisao-fase2.ts, scenarios-consegue.ts, scenarios-condicional.ts,
      scenarios-dar-receber.ts, scenarios-descrever.ts, scenarios-servicos.ts, scenarios-problemas.ts, scenarios-keigo.ts,
      scenarios-telefone.ts, scenarios-aparencias.ts,
      scenarios-passiva.ts, scenarios-causativa.ts, scenarios-conselhos.ts,
      scenarios-noticias.ts, scenarios-historia.ts, scenarios-negociar.ts, scenarios-entrevista.ts) ·
      seed-data/helpers.ts
  lib/
    types.ts · fsrs.ts · roles.ts · text.ts (normalização/similaridade/furigana) · idb.ts
    queries.ts                   # consultas e gravações (fila, revisão, dashboard, atividade, coach offline)
    drills.ts                    # verbos, cenas com complemento em japonês, montarDialogo
    roleplay.ts                  # categorias de contexto
    trilha.ts                    # unidades, lições e geração dos exercícios
    dicionario.ts · kana.ts · kana-tracos.generated.ts (scripts/gerar-kana.mjs)
    kanji.ts · kanji-dados.generated.ts (scripts/gerar-kanji.ts)
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
- `kana_log` — `kana, modo ('quiz'|'escrita'), acertou`: treino de escrita (progresso dos kana e dos kanji;
  a coluna guarda o caractere).
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
Ao adicionar cards, escreva com o helper `b()` de `src/db/seed-data/helpers.ts`
(`b("ko.re", "LH", "isto", "topico")`) e valide com `npx tsx scripts/validar-pitch.ts card_043 rp_lug_konbini`
(compara cards e falas das missões com o Suzuki-kun do OJAD, frase inteira; `--frase=駅の前にあります。` mostra só a
previsão, para escrever cards novos; respostas em cache em `.ojad-cache/`). Divergência é alerta, não verdade: o
OJAD às vezes lê errado (明日 como "asu", 何 como "nan") ou junta palavras numa frase só; na dúvida, conferir o
acento da palavra no dicionário (NHK/Wiktionary). Ex.: うえ é plano sozinho e odaka depois de modificador
(机の上), ふたり é odaka.

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
