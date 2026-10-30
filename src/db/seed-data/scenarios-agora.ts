import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 11 (Agora e sempre): a ligação de uma amiga, o colega ao telefone e o vizinho novo.
 * Usam as frases de `cards-agora.ts` como resposta-modelo. ★ nova = palavra nova.
 */

const YUKI = { nome: "Yuki · amiga", emoji: "👩" };

const sim = line("はい。", "はい。", "Sim.", [b("ha.i", "HL", "sim", "expressao")]);

export const cenariosAgora: SeedScenario[] = [
  // ───────────── Ligação
  {
    id: "rp_agora_ligacao",
    titulo: "Uma ligação à noite",
    categoria: "social",
    emoji: "📞",
    parceiro: YUKI,
    missao_pt:
      "A Yuki liga para você à noite. Conte o que está fazendo, responda se está chovendo aí e combine de conversar amanhã.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_079", "card_080", "card_081"],
    system_prompt_cenario:
      "Amiga ligando à noite: pergunta o que você está fazendo, se está chovendo aí e propõe conversar amanhã.",
    roteiro: [
      {
        ia: line("もしもし、いまなにをしていますか。", "もしもし、今[いま]何[なに]をしていますか。", "Alô, o que você está fazendo agora?", [
          b("mo._shi.mo._shi", "HLLL", "alô (ao telefone)", "expressao"),
          b("i.ma", "HL", "agora", "tempo"),
          b("na.ni", "HL", "o quê", "pergunta"),
          b("o", "L", "[Objeto]", "particula"),
          b("_shi.te", "LH", "fazendo", "verbo"),
          b("i.ma._su", "HHL", "está", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que está fazendo o jantar.",
        chaves: ["ばんごはん", "晩ご飯", "つくって", "作って"],
        exemplo_card: "card_080",
      },
      {
        ia: line("そうですか。そとはあめがふっていますか。", "そうですか。外[そと]は雨[あめ]が降[ふ]っていますか。", "Ah, é? Lá fora está chovendo?", [
          b("so.o", "HL", "assim", "expressao"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
          b("so.to", "HL", "lado de fora", "lugar"),
          b("wa", "L", "[contraste]", "particula"),
          b("a.me", "HL", "chuva", "sujeito"),
          b("ga", "L", "[Foco / sujeito]", "particula"),
          b("_fu.t.te", "HLL", "caindo", "verbo"),
          b("i.ma._su", "LLL", "está", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que sim, está chovendo.",
        chaves: ["あめ", "雨", "ふって", "降って"],
        exemplo_card: "card_081",
      },
      {
        ia: line("じゃあ、あしたはなしましょう。", "じゃあ、明日[あした]話[はな]しましょう。", "Então vamos conversar amanhã.", [
          b("ja.a", "HL", "então", "expressao"),
          b("a.shi.ta", "LHH", "amanhã", "tempo"),
          b("ha.na._shi.ma.sho.o", "LHHHHL", "vamos conversar", "verbo"),
        ]),
        dica_pt: "Concorde.",
        chaves: ["はい", "ええ"],
        exemplo: sim,
      },
      {
        ia: line("おやすみなさい。", "おやすみなさい。", "Boa noite! (fim)", [
          b("o.ya._su.mi.na.sa.i", "LHHHHHL", "boa noite (ao se despedir)", "expressao"),
        ]),
      },
    ],
  },

  // ───────────── Colega ao telefone
  {
    id: "rp_agora_colega",
    titulo: "Ele está ao telefone",
    categoria: "trabalho",
    emoji: "☎️",
    parceiro: { nome: "Ito-san · colega", emoji: "🙋" },
    missao_pt: "Você precisa falar com o Tanaka-san. Pergunte por ele, entenda que está ao telefone e diga que vai esperar.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_047", "card_082"],
    system_prompt_cenario: "Colega no escritório: diz que o Tanaka-san está ao telefone.",
    roteiro: [
      {
        ia: line("おつかれさまです。", "お疲[つか]れ様[さま]です。", "Oi! (entre colegas)", [
          b("o._tsu.ka.re.sa.ma", "LHHHHH", "bom trabalho (cumprimento)", "expressao"),
          b("de._su", "HL", "[educado]", "expressao"),
        ]),
        dica_pt: "Pergunte se o Tanaka-san está.",
        chaves: ["たなか", "田中", "います"],
        exemplo_card: "card_047",
      },
      {
        ia: line("いま、でんわをしています。", "今[いま]、電話[でんわ]をしています。", "Agora ele está ao telefone.", [
          b("i.ma", "HL", "agora", "tempo"),
          b("de.n.wa", "LHH", "telefone", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("_shi.te", "HH", "fazendo", "verbo"),
          b("i.ma._su", "HHL", "está", "verbo"),
        ]),
        dica_pt: "Diga: então, vou esperar.",
        chaves: ["まち", "待ち"],
        exemplo: line("じゃあ、まちます。", "じゃあ、待[ま]ちます。", "Então eu espero.", [
          b("ja.a", "HL", "então", "expressao"),
          b("ma.chi.ma._su", "LHHL", "espero", "verbo"),
        ]),
      },
      {
        ia: line("はい、しょうしょうおまちください。", "はい、少々[しょうしょう]お待[ま]ちください。", "Certo, um momento. (fim)", [
          b("ha.i", "HL", "sim", "expressao"),
          b("sho.o.sho.o", "HLLL", "um pouquinho (formal)", "adverbio"),
          b("o.ma.chi", "LHH", "espera (respeito)", "verbo"),
          b("ku.da.sa.i", "HHHL", "por favor", "verbo"),
        ]),
      },
    ],
  },

  // ───────────── Vizinho novo
  {
    id: "rp_agora_vizinho",
    titulo: "Conversa com o vizinho novo",
    categoria: "social",
    emoji: "🏘️",
    parceiro: { nome: "Sra. Watanabe · vizinha", emoji: "👵" },
    missao_pt:
      "A vizinha nova quer te conhecer. Diga onde mora, responda se é casado(a), conte onde trabalha e se despeça com educação.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_083", "card_084", "card_086"],
    system_prompt_cenario: "Vizinha simpática e curiosa: pergunta onde você mora, se é casado(a) e onde trabalha.",
    roteiro: [
      {
        ia: line("どこにすんでいますか。", "どこに住[す]んでいますか。", "Onde você mora?", [
          b("do.ko", "HL", "onde", "pergunta"),
          b("ni", "L", "[Lugar onde está]", "particula"),
          b("su.n.de", "HLL", "morando", "verbo"),
          b("i.ma._su", "LLL", "está", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que mora em Tóquio.",
        chaves: ["すんで", "住んで", "とうきょう", "東京"],
        exemplo_card: "card_083",
      },
      {
        ia: line("けっこんしていますか。", "結婚[けっこん]していますか。", "Você é casado(a)?", [
          b("ke.k.ko.n", "LHHH", "casamento", "substantivo"),
          b("_shi.te", "HH", "feito", "verbo"),
          b("i.ma._su", "HHL", "está", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Responda que é casado(a).",
        chaves: ["けっこん", "結婚"],
        exemplo_card: "card_084",
      },
      {
        ia: line("おしごとは。", "お仕事[しごと]は。", "E o trabalho? (o- = respeito)", [
          b("o.shi.go.to", "LHHH", "o trabalho (de você)", "topico"),
          b("wa", "H", "[e quanto a…?]", "particula"),
        ]),
        dica_pt: "Diga que trabalha num banco.",
        chaves: ["ぎんこう", "銀行", "はたらいて", "働いて"],
        exemplo: line("ぎんこうではたらいています。", "銀行[ぎんこう]で働[はたら]いています。", "Trabalho num banco.", [
          b("gi.n.ko.o", "LHHH", "banco", "lugar"),
          b("de", "H", "[Local da ação]", "particula"),
          b("ha.ta.ra.i.te", "LHHHH", "trabalhando", "verbo"),
          b("i.ma._su", "HHL", "estou", "verbo"),
        ]),
      },
      {
        ia: line("そうですか。これからよろしくおねがいします。", "そうですか。これからよろしくお願[ねが]いします。", "Ah, é? Conto com você daqui em diante. (nova: korekara = daqui em diante)", [
          b("so.o", "HL", "assim", "expressao"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
          b("ko.re.ka.ra", "LHHH", "daqui em diante ★ nova", "tempo"),
          b("yo.ro._shi.ku", "LHHH", "conto com você", "expressao"),
          b("o.ne.ga.i.shi.ma._su", "LHHHHHL", "[por favor, educado]", "expressao"),
        ]),
        dica_pt: "Responda do mesmo jeito: conto com você.",
        chaves: ["よろしく"],
        exemplo: line("よろしくおねがいします。", "よろしくお願[ねが]いします。", "Conto com você.", [
          b("yo.ro._shi.ku", "LHHH", "conto com você", "expressao"),
          b("o.ne.ga.i.shi.ma._su", "LHHHHHL", "[por favor, educado]", "expressao"),
        ]),
      },
      {
        ia: line("では、また。", "では、また。", "Então, até mais! (fim)", [
          b("de.wa", "HL", "então", "expressao"),
          b("ma.ta", "LH", "até mais", "expressao"),
        ]),
      },
    ],
  },
];
