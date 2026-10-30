import type { Categoria, Pessoa } from "../../lib/roleplay";
import type { JaLine } from "../../lib/types";
import { b, line } from "./helpers";
import { cenariosCotidiano } from "./scenarios-cotidiano";
import { cenariosExtra } from "./scenarios-extra";
import { cenariosTrabalho } from "./scenarios-trabalho";
import { cenariosLugares } from "./scenarios-lugares";
import { cenariosNumeros } from "./scenarios-numeros";
import { cenariosPedidos } from "./scenarios-pedidos";
import { cenariosAgora } from "./scenarios-agora";
import { cenariosAdjetivos } from "./scenarios-adjetivos";
import { cenariosFimDeSemana } from "./scenarios-fimdesemana";
import { cenariosRevisao } from "./scenarios-revisao";
import { cenariosFamilia } from "./scenarios-familia";
import { cenariosSaude } from "./scenarios-saude";
import { cenariosHobbies } from "./scenarios-hobbies";
import { cenariosRegras } from "./scenarios-regras";

/** Um turno do roteiro offline (usado quando não há chave de IA). */
export interface RoteiroPasso {
  ia: JaLine;
  /** Quem fala neste passo, quando muda no meio do diálogo. */
  quem?: Pessoa;
  /** O que o usuário deve conseguir dizer (instrução em português). */
  dica_pt?: string;
  /** Fragmentos aceitos na transcrição (kana/kanji). Vazio = fim do diálogo. */
  chaves?: string[];
  /** Resposta-modelo: id de card existente ou uma fala completa. */
  exemplo_card?: string;
  exemplo?: JaLine;
}

export interface SeedScenario {
  id: string;
  titulo: string;
  missao_pt: string;
  nivel: number;
  categoria: Categoria;
  emoji: string;
  parceiro: Pessoa;
  vocabulario_requerido_ids: string[];
  system_prompt_cenario: string;
  roteiro: RoteiroPasso[];
}

const cenariosBase: SeedScenario[] = [
  {
    id: "rp_01_apresentacao",
    titulo: "Apresentação pessoal e trabalho",
    categoria: "trabalho",
    emoji: "🤝",
    parceiro: { nome: "Tanaka-san · colega", emoji: "👨‍💼" },
    missao_pt:
      "Você foi apresentado ao Tanaka-san num evento da empresa. Cumprimente, diga o que você faz e conte que trabalha de casa.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_006", "card_007", "card_008", "card_019", "card_020", "card_004", "card_012"],
    system_prompt_cenario:
      "Você é Tanaka (田中), um colega japonês simpático de ~35 anos, num evento de networking da empresa. Conduza: cumprimento → pergunta sobre o trabalho do usuário → elogio ao japonês dele → pergunta se trabalha de casa → despedida com よろしくお願いします.",
    roteiro: [
      {
        ia: line("はじめまして。たなかです。", "初[はじ]めまして。田中[たなか]です。", "Prazer. Sou o Tanaka.", [
          b("ha.ji.me.ma._shi.te", "LHHHLL", "muito prazer", "expressao"),
          b("ta.na.ka", "LHH", "Tanaka (sobrenome)", "substantivo"),
          b("de._su", "HL", "é", "copula"),
        ]),
        dica_pt: "Cumprimente de volta (primeiro encontro).",
        chaves: ["はじめまして", "初めまして"],
        exemplo_card: "card_006",
      },
      {
        ia: line("しごとはなんですか。", "仕事[しごと]は何[なん]ですか。", "Qual é o seu trabalho?", [
          b("shi.go.to", "LHH", "trabalho", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("na.n", "HL", "o quê", "pergunta"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que é funcionário de empresa.",
        chaves: ["かいしゃいん", "会社員", "です"],
        exemplo_card: "card_008",
      },
      {
        ia: line("にほんごがじょうずですね。", "日本語[にほんご]が上手[じょうず]ですね。", "Seu japonês é bom, hein! (palavra nova: jouzu = habilidoso)", [
          b("ni.ho.n.go", "LHHH", "japonês", "sujeito"),
          b("ga", "H", "[Foco]", "particula"),
          b("jo.o.zu", "LHH", "habilidoso ★ nova", "adjetivo"),
          b("de.su", "LL", "é", "copula"),
          b("ne", "L", "[né]", "particula"),
        ]),
        dica_pt: "Agradeça (ou diga que entende só um pouco).",
        chaves: ["ありがとう", "すこし", "少し"],
        exemplo_card: "card_004",
      },
      {
        ia: line("うちでしごとをしますか。", "家[うち]で仕事[しごと]をしますか。", "Você trabalha de casa?", [
          b("u.chi", "LH", "casa", "lugar"),
          b("de", "H", "[Local da ação]", "particula"),
          b("shi.go.to", "LHH", "trabalho", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("shi.ma._su", "LHL", "faz", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Confirme que você trabalha de casa.",
        chaves: ["します", "うちで", "家で"],
        exemplo_card: "card_020",
      },
      {
        ia: line("そうですか。よろしくおねがいします。", "そうですか。よろしくお願[ねが]いします。", "Entendi. Conto com você! (fim)", [
          b("so.o", "HL", "assim", "adverbio"),
          b("de.su", "LL", "é", "copula"),
          b("ka", "L", "[?] (aqui: 'ah, é?')", "particula"),
          b("yo.ro._shi.ku", "LHHH", "conto com você", "expressao"),
          b("o.ne.ga.i.shi.ma._su", "LHHHHHL", "[por favor, educado]", "expressao"),
        ]),
      },
    ],
  },
  {
    id: "rp_02_pedido_horario",
    titulo: "Café com um colega: pedido e horário",
    categoria: "restaurante",
    emoji: "☕",
    parceiro: { nome: "Atendente do café", emoji: "🧑‍🍳" },
    missao_pt:
      "Você está num café com um colega. Peça algo ao atendente, agradeça e depois combine com o colega o horário da reunião de amanhã.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_011", "card_004", "card_021", "card_022", "card_023", "card_005"],
    system_prompt_cenario:
      "Primeiro você é o atendente de um café (いらっしゃいませ → entrega o pedido com はい、どうぞ). Depois assume o papel de Sato, colega do usuário, e combina o horário da reunião de amanhã (pergunte a hora de início e proponha um horário para se encontrarem antes).",
    roteiro: [
      {
        ia: line("いらっしゃいませ！", "いらっしゃいませ！", "Bem-vindo! (palavra nova: irasshaimase)", [
          b("i.ra.s.sha.i.ma.se", "LHHHHHL", "bem-vindo ★ nova", "expressao"),
        ]),
        dica_pt: "Peça uma água (ou outra coisa) educadamente.",
        chaves: ["ください", "下さい"],
        exemplo_card: "card_011",
      },
      {
        ia: line("はい、どうぞ。", "はい、どうぞ。", "Aqui está.", [
          b("ha.i", "HL", "sim", "expressao"),
          b("do.o.zo", "HLL", "por favor (pegue)", "expressao"),
        ]),
        dica_pt: "Agradeça.",
        chaves: ["ありがとう"],
        exemplo_card: "card_004",
      },
      {
        quem: { nome: "Sato-san · colega", emoji: "👩‍💼" },
        ia: line("あしたのかいぎはなんじからですか。", "明日[あした]の会議[かいぎ]は何時[なんじ]からですか。", "(Colega) A reunião de amanhã começa a que horas?", [
          b("a._shi.ta", "LHH", "amanhã", "tempo"),
          b("no", "L", "[de]", "particula"),
          b("ka.i.gi", "HLL", "reunião", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("na.n.ji", "HLL", "que horas", "pergunta"),
          b("ka.ra", "LL", "a partir de", "particula"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Responda que começa às 3 horas.",
        chaves: ["さんじ", "三時", "3時", "からです"],
        exemplo_card: "card_021",
      },
      {
        quem: { nome: "Sato-san · colega", emoji: "👩‍💼" },
        ia: line("さんじにあいましょうか。", "三時[さんじ]に会[あ]いましょうか。", "Que tal nos encontrarmos às 3?", [
          b("sa.n.ji", "HLL", "3 horas", "tempo"),
          b("ni", "L", "[Ponto no tempo]", "particula"),
          b("a.i.ma.sho.o", "LHHHL", "encontrar + vamos", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Concorde com entusiasmo.",
        chaves: ["いいです", "いい", "はい"],
        exemplo_card: "card_023",
      },
      {
        quem: { nome: "Sato-san · colega", emoji: "👩‍💼" },
        ia: line("じゃ、またあした。", "じゃ、また明日[あした]。", "Então, até amanhã! (fim)", [
          b("ja", "H", "então", "expressao"),
          b("ma.ta", "LH", "de novo", "adverbio"),
          b("a._shi.ta", "LHH", "amanhã", "tempo"),
        ]),
      },
    ],
  },
  {
    id: "rp_03_rotina",
    titulo: "Explicando a rotina de ontem e de hoje",
    categoria: "social",
    emoji: "🗓️",
    parceiro: { nome: "Suzuki-san · colega", emoji: "🧑‍💻" },
    missao_pt:
      "Segunda-feira de manhã. Um colega quer saber o que você fez ontem, se tomou café da manhã e como está o seu dia hoje.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_028", "card_017", "card_024", "card_020", "card_016", "card_030"],
    system_prompt_cenario:
      "Você é Suzuki (鈴木), colega curioso. Pergunte o que o usuário fez ontem (passado -mashita), se tomou café da manhã, se está ocupado hoje e se vai trabalhar de casa. Feche com がんばってください.",
    roteiro: [
      {
        ia: line("きのうはなにをしましたか。", "昨日[きのう]は何[なに]をしましたか。", "O que você fez ontem?", [
          b("ki.no.o", "LHL", "ontem", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("na.ni", "HL", "o quê", "pergunta"),
          b("o", "L", "[Objeto]", "particula"),
          b("shi.ma._shi.ta", "LHLL", "fez", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga algo que você fez ontem (use -mashita).",
        chaves: ["ました"],
        exemplo: line("うちでしごとをしました。", "家[うち]で仕事[しごと]をしました。", "Trabalhei em casa.", [
          b("u.chi", "LH", "casa", "lugar"),
          b("de", "H", "[Local da ação]", "particula"),
          b("shi.go.to", "LHH", "trabalho", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("shi.ma._shi.ta", "LHLL", "fiz", "verbo"),
        ]),
      },
      {
        ia: line("あさごはんをたべましたか。", "朝[あさ]ご飯[はん]を食[た]べましたか。", "Você tomou café da manhã?", [
          b("a.sa.go.ha.n", "LHHLL", "café da manhã", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("ta.be.ma._shi.ta", "LHHLL", "comeu", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Responda se comeu ou não comeu.",
        chaves: ["たべ", "食べ"],
        exemplo_card: "card_017",
      },
      {
        ia: line("きょうはいそがしいですか。", "今日[きょう]は忙[いそが]しいですか。", "Você está ocupado hoje?", [
          b("kyo.o", "HL", "hoje", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("i.so.ga.shi.i", "LHHHL", "ocupado", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que hoje está ocupado.",
        chaves: ["いそがし", "忙し", "いいえ"],
        exemplo_card: "card_024",
      },
      {
        ia: line("きょうもうちでしごとをしますか。", "今日[きょう]も家[うち]で仕事[しごと]をしますか。", "Hoje também vai trabalhar de casa? (nova: mo = também)", [
          b("kyo.o", "HL", "hoje", "tempo"),
          b("mo", "L", "[também] ★ nova", "particula"),
          b("u.chi", "LH", "casa", "lugar"),
          b("de", "H", "[Local da ação]", "particula"),
          b("shi.go.to", "LHH", "trabalho", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("shi.ma._su", "LHL", "faz", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Responda que sim, vai trabalhar de casa.",
        chaves: ["します", "しません"],
        exemplo_card: "card_020",
      },
      {
        ia: line("いいですね。がんばってください！", "いいですね。頑張[がんば]ってください！", "Que bom. Boa sorte / força! (fim)", [
          b("i.i", "HL", "bom", "adjetivo"),
          b("de.su", "LL", "é", "copula"),
          b("ne", "L", "[né]", "particula"),
          b("ga.n.ba.t.te", "LHHLL", "esforçando-se ★ nova", "verbo"),
          b("ku.da.sa.i", "LHHL", "dê-me (por favor)", "verbo"),
        ]),
      },
    ],
  },
];

export const seedScenarios: SeedScenario[] = [...cenariosBase, ...cenariosCotidiano, ...cenariosExtra, ...cenariosTrabalho, ...cenariosLugares, ...cenariosNumeros, ...cenariosPedidos, ...cenariosAgora, ...cenariosAdjetivos, ...cenariosFimDeSemana, ...cenariosRevisao, ...cenariosFamilia, ...cenariosSaude, ...cenariosHobbies, ...cenariosRegras];
