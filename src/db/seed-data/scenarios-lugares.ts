import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 8 (Onde fica, o que tem): pedir direções, procurar alguém numa empresa e achar a chave.
 * Usam as frases de `cards-lugares.ts` como resposta-modelo. ★ nova = palavra nova.
 */

const obrigado = line("ありがとうございます。", "ありがとうございます。", "Obrigado.", [
  b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
  b("go.za.i.ma._su", "LHHHL", "[forma educada]", "expressao"),
]);

const entendi = line("わかりました。", "わかりました。", "Entendi.", [b("wa.ka.ri.ma._shi.ta", "LHHHLL", "entendi", "verbo")]);

export const cenariosLugares: SeedScenario[] = [
  // ───────────── Direções na rua
  {
    id: "rp_lug_konbini",
    titulo: "Onde tem uma loja de conveniência?",
    categoria: "cidade",
    emoji: "🏪",
    parceiro: { nome: "Senhora na rua", emoji: "👵" },
    missao_pt:
      "Você está num bairro novo. Pergunte a uma senhora onde tem uma loja de conveniência, aproveite para perguntar se há um banco perto, entenda o caminho e agradeça.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_043", "card_045", "card_053", "card_054"],
    system_prompt_cenario:
      "Senhora simpática na rua: responde que a loja fica em frente à estação, que o banco fica perto, explica o caminho (reto e à direita) e diz que são 5 minutos a pé.",
    roteiro: [
      {
        ia: line("はい、なんですか。", "はい、何[なん]ですか。", "Sim, pois não?", [
          b("ha.i", "HL", "sim", "expressao"),
          b("na.n", "HL", "o quê", "pergunta"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Pergunte onde tem uma loja de conveniência.",
        chaves: ["コンビニ", "こんびに", "どこ"],
        exemplo_card: "card_043",
      },
      {
        ia: line("えきのまえにありますよ。", "駅[えき]の前[まえ]にありますよ。", "Fica em frente à estação. (yo = te informo)", [
          b("e.ki", "HL", "estação", "lugar"),
          b("no", "L", "[de]", "particula"),
          b("ma.e", "LL", "frente", "lugar"),
          b("ni", "L", "[Lugar onde está]", "particula"),
          b("a.ri.ma.su", "LHHL", "fica", "verbo"),
          b("yo", "L", "[te informo]", "particula"),
        ]),
        dica_pt: "Pergunte se também tem um banco aqui perto.",
        chaves: ["ぎんこう", "銀行"],
        exemplo_card: "card_045",
      },
      {
        ia: line("はい、あります。", "はい、あります。", "Sim, tem.", [
          b("ha.i", "HL", "sim", "expressao"),
          b("a.ri.ma._su", "LHHL", "existe, tem", "verbo"),
        ]),
        dica_pt: "Ela vai explicar o caminho. Ouça e diga que entendeu.",
        chaves: ["わかり", "分かり"],
        exemplo: entendi,
      },
      {
        ia: line("まっすぐいって、みぎにまがってください。", "まっすぐ行[い]って、右[みぎ]に曲[ま]がってください。", "Siga reto e vire à direita.", [
          b("ma.s.su.gu", "LHHL", "reto", "adverbio"),
          b("i.t.te", "LLL", "vá e…", "verbo"),
          b("mi.gi", "LH", "direita", "lugar"),
          b("ni", "H", "[Direção →]", "particula"),
          b("ma.ga.t.te", "LHHH", "vire", "verbo"),
          b("ku.da.sa.i", "HHHL", "por favor", "verbo"),
        ]),
        dica_pt: "Agradeça.",
        chaves: ["ありがと"],
        exemplo: obrigado,
      },
      {
        ia: line("えきからあるいてごふんです。", "駅[えき]から歩[ある]いて五分[ごふん]です。", "São 5 minutos a pé da estação. (fim)", [
          b("e._ki", "HL", "estação", "lugar"),
          b("ka.ra", "LL", "a partir de", "particula"),
          b("a.ru.i.te", "LHLL", "a pé", "verbo"),
          b("go.fu.n", "HLL", "5 minutos", "tempo"),
          b("de._su", "LL", "é", "copula"),
        ]),
      },
    ],
  },

  // ───────────── Recepção de empresa
  {
    id: "rp_lug_recepcao",
    titulo: "Procurando o Tanaka-san",
    categoria: "trabalho",
    emoji: "🏢",
    parceiro: { nome: "Recepcionista", emoji: "💁" },
    missao_pt:
      "Você foi a outra empresa para falar com o Tanaka-san. Pergunte se ele está, descubra a que horas a reunião dele termina, diga que vai esperar e agradeça.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_047", "card_048", "card_037", "card_004"],
    system_prompt_cenario:
      "Recepcionista educada: diz que o Tanaka-san está na sala de reunião, que a reunião termina às 4, e pede para aguardar.",
    roteiro: [
      {
        ia: line("こんにちは。", "こんにちは。", "Boa tarde.", [b("ko.n.ni.chi.wa", "LHHHH", "boa tarde", "expressao")]),
        dica_pt: "Pergunte se o Tanaka-san está.",
        chaves: ["たなか", "田中", "います"],
        exemplo_card: "card_047",
      },
      {
        ia: line("いま、かいぎしつにいます。", "今[いま]、会議室[かいぎしつ]にいます。", "Agora ele está na sala de reunião.", [
          b("i.ma", "HL", "agora", "tempo"),
          b("ka.i.gi._shi.tsu", "LHHLL", "sala de reunião", "lugar"),
          b("ni", "L", "[Lugar onde está]", "particula"),
          b("i.ma._su", "LHL", "está", "verbo"),
        ]),
        dica_pt: "Pergunte a que horas a reunião termina.",
        chaves: ["おわり", "終わり", "なんじ", "何時"],
        exemplo_card: "card_037",
      },
      {
        ia: line("よじにおわります。", "四時[よじ]に終[お]わります。", "Termina às 4. (nova: yoji = 4 horas)", [
          b("yo.ji", "HL", "4 horas ★ nova", "tempo"),
          b("ni", "L", "[Ponto no tempo]", "particula"),
          b("o.wa.ri.ma._su", "LHHHL", "termina", "verbo"),
        ]),
        dica_pt: "Diga: então, vou esperar.",
        chaves: ["まち", "待ち"],
        exemplo: line("じゃあ、まちます。", "じゃあ、待[ま]ちます。", "Então eu espero.", [
          b("ja.a", "HL", "então", "expressao"),
          b("ma.chi.ma._su", "LHHL", "espero", "verbo"),
        ]),
      },
      {
        ia: line("しょうしょうおまちください。", "少々[しょうしょう]お待[ま]ちください。", "Um momento, por favor.", [
          b("sho.o.sho.o", "HLLL", "um pouquinho (formal)", "adverbio"),
          b("o.ma.chi", "LHH", "espera (o- = respeito)", "verbo"),
          b("ku.da.sa.i", "HHHL", "faça-me o favor", "verbo"),
        ]),
        dica_pt: "Agradeça.",
        chaves: ["ありがと"],
        exemplo: obrigado,
      },
      {
        ia: line("どうぞ、こちらへ。", "どうぞ、こちらへ。", "Por favor, por aqui. (fim)", [
          b("do.o.zo", "HLL", "por favor (oferecendo)", "expressao"),
          b("ko.chi.ra", "LHH", "por aqui ★ nova", "lugar"),
          b("e", "H", "[Direção →]", "particula"),
        ]),
      },
    ],
  },

  // ───────────── Em casa
  {
    id: "rp_lug_chave",
    titulo: "Cadê a chave?",
    categoria: "social",
    emoji: "🔑",
    parceiro: { nome: "Kenji · colega de apartamento", emoji: "🧑" },
    missao_pt:
      "Você está atrasado para sair. Diga ao colega de apartamento que não tem tempo, pergunte onde está a chave e agradeça.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_051", "card_049", "card_004"],
    system_prompt_cenario: "Colega de apartamento tranquilo: pergunta o que houve e diz que a chave está em cima da mesa.",
    roteiro: [
      {
        ia: line("どうしましたか。", "どうしましたか。", "O que houve?", [
          b("do.o", "HL", "como, o quê", "pergunta"),
          b("shi.ma._shi.ta", "LLLL", "fez, aconteceu", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que não tem tempo.",
        chaves: ["じかん", "時間"],
        exemplo_card: "card_051",
      },
      {
        ia: line("そうですか。", "そうですか。", "É mesmo?", [
          b("so.o", "HL", "assim", "expressao"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Pergunte onde está a chave.",
        chaves: ["かぎ", "鍵"],
        exemplo: line("かぎはどこにありますか。", "鍵[かぎ]はどこにありますか。", "Onde está a chave?", [
          b("ka.gi", "LH", "chave", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("do.ko", "HL", "onde", "pergunta"),
          b("ni", "L", "[Lugar onde está]", "particula"),
          b("a.ri.ma._su", "LHHL", "está (coisa)", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
      },
      {
        ia: line("つくえのうえにありますよ。", "机[つくえ]の上[うえ]にありますよ。", "Está em cima da mesa.", [
          b("_tsu.ku.e", "LHH", "mesa", "lugar"),
          b("no", "H", "[de]", "particula"),
          b("u.e", "HH", "em cima", "lugar"),
          b("ni", "L", "[Lugar onde está]", "particula"),
          b("a.ri.ma.su", "LHHL", "está", "verbo"),
          b("yo", "L", "[te informo]", "particula"),
        ]),
        dica_pt: "Agradeça.",
        chaves: ["ありがと"],
        exemplo: obrigado,
      },
      {
        ia: line("いってらっしゃい。", "いってらっしゃい。", "Vá e volte bem! (fim)", [
          b("i.t.te.ra.s.sha.i", "LHHHHHL", "vá e volte bem (quem fica diz)", "expressao"),
        ]),
      },
    ],
  },
];
