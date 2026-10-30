import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 25 (Viagem): a bagagem no hotel, a baldeação na estação, o passaporte perdido e a volta da
 * viagem. Usam as frases de `cards-viagem.ts` como resposta-modelo. ★ nova = palavra nova.
 */

const DESU = b("de._su", "LL", "é", "copula");
const KA = b("ka", "L", "[?]", "particula");
const WAKARIMASHITA = b("wa.ka.ri.ma._shi.ta", "LHHHLL", "entendi", "verbo");

export const cenariosViagem: SeedScenario[] = [
  // ───────────── Hotel
  {
    id: "rp_via_hotel",
    titulo: "Chegando ao hotel",
    categoria: "cidade",
    emoji: "🧳",
    parceiro: { nome: "Recepcionista", emoji: "🧑‍💼" },
    missao_pt: "Na recepção, diga que tem reserva, informe seu nome, pergunte o horário do café da manhã e peça para guardar a bagagem.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_248", "card_250", "card_249"],
    system_prompt_cenario: "Recepcionista atende o hóspede, pede o nome, informa o quarto e o horário do café da manhã.",
    roteiro: [
      {
        ia: line("いらっしゃいませ。", "いらっしゃいませ。", "Seja bem-vindo!", [b("i.ra.s.sha.i.ma.se", "LHHHHHL", "seja bem-vindo", "expressao")]),
        dica_pt: "Diga que tem reserva.",
        chaves: ["よやく", "予約"],
        exemplo_card: "card_248",
      },
      {
        ia: line("おなまえをおねがいします。", "お名前[なまえ]をお願[ねが]いします。", "Seu nome, por favor.", [
          b("o.na.ma.e", "LHHH", "nome", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("o.ne.ga.i.shi.ma._su", "LHHHHHL", "por favor", "expressao"),
        ]),
        dica_pt: "Diga o seu nome.",
        chaves: ["です"],
        exemplo: line("シルバです。", "シルバです。", "Sou Silva. (diga o seu nome)", [b("shi.ru.ba", "HLL", "Silva", "substantivo"), DESU]),
      },
      {
        ia: line("おへやはさんがいです。", "お部屋[へや]は三階[さんがい]です。", "Seu quarto é no terceiro andar. (nova: oheya = quarto)", [
          b("o.he.ya", "LHH", "quarto ★ nova", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("sa.n.ga.i", "LHHH", "terceiro andar", "lugar"),
          b("de._su", "HL", "é", "copula"),
        ]),
        dica_pt: "Pergunte a que horas começa o café da manhã.",
        chaves: ["あさごはん", "朝ごはん", "なんじ", "何時"],
        exemplo_card: "card_250",
      },
      {
        ia: line("しちじからです。", "七時[しちじ]からです。", "A partir das sete.", [
          b("_shi.chi.ji", "LHL", "sete horas", "tempo"),
          b("ka.ra", "LL", "a partir de", "particula"),
          DESU,
        ]),
        dica_pt: "Peça para guardar sua bagagem.",
        chaves: ["にもつ", "荷物", "あずかって", "預かって"],
        exemplo_card: "card_249",
      },
      {
        ia: line("はい、わかりました。", "はい、わかりました。", "Sim, claro. (fim)", [b("ha.i", "HL", "sim", "expressao"), WAKARIMASHITA]),
      },
    ],
  },

  // ───────────── Estação
  {
    id: "rp_via_estacao",
    titulo: "Trocar de trem",
    categoria: "cidade",
    emoji: "🚆",
    parceiro: { nome: "Funcionário da estação", emoji: "🧑‍✈️" },
    missao_pt: "Compre a passagem, confirme se o trem vai a Kyoto e descubra de qual plataforma sai o próximo.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_251", "card_252"],
    system_prompt_cenario: "Funcionário vende a passagem e explica a baldeação em Osaka e a plataforma.",
    roteiro: [
      {
        ia: line("どこまでですか。", "どこまでですか。", "Até onde?", [
          b("do.ko", "HL", "onde", "pergunta"),
          b("ma.de", "LL", "até", "particula"),
          DESU,
          KA,
        ]),
        dica_pt: "Peça uma passagem até Tóquio.",
        chaves: ["きっぷ", "切符", "いちまい", "一枚"],
        exemplo_card: "card_251",
      },
      {
        ia: line("はい、どうぞ。", "はい、どうぞ。", "Aqui está.", [b("ha.i", "HL", "sim", "expressao"), b("do.o.zo", "HLL", "aqui está", "expressao")]),
        dica_pt: "Pergunte se este trem vai para Kyoto.",
        chaves: ["でんしゃ", "電車", "きょうと", "京都"],
        exemplo_card: "card_252",
      },
      {
        ia: line("いいえ、いきません。おおさかでのりかえてください。", "いいえ、行[い]きません。大阪[おおさか]で乗[の]り換[か]えてください。", "Não vai. Faça a baldeação em Osaka.", [
          b("i.i.e", "LHH", "não", "expressao"),
          b("i.ki.ma.se.n", "LHHHL", "não vai", "verbo"),
          b("o.o.sa.ka", "LHHH", "Osaka", "lugar"),
          b("de", "H", "[Local da ação]", "particula"),
          b("no.ri.ka.e.te", "LHHLL", "trocar de condução", "verbo"),
          b("ku.da.sa.i", "LLLL", "por favor", "verbo"),
        ]),
        dica_pt: "Pergunte qual é a plataforma.",
        chaves: ["なんばんせん", "何番線"],
        exemplo: line("なんばんせんですか。", "何番線[なんばんせん]ですか。", "Qual é a plataforma? (nova: ~bansen = plataforma número)", [
          b("na.n.ba.n.se.n", "LHHHHL", "qual plataforma ★ nova", "pergunta"),
          DESU,
          KA,
        ]),
      },
      {
        ia: line("さんばんせんです。", "三番線[さんばんせん]です。", "É a plataforma 3.", [b("sa.n.ba.n.se.n", "LHHHHL", "plataforma 3", "lugar"), DESU]),
        dica_pt: "Agradeça.",
        chaves: ["ありがとう"],
        exemplo: line("ありがとうございます。", "ありがとうございます。", "Obrigado.", [
          b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
          b("go.za.i.ma._su", "LHHHL", "[forma educada]", "expressao"),
        ]),
      },
      {
        ia: line("きをつけて。", "気[き]をつけて。", "Boa viagem! (nova: ki o tsukete = vá com cuidado) (fim)", [
          b("ki.o._tsu.ke.te", "LHHLL", "vá com cuidado ★ nova", "expressao"),
        ]),
      },
    ],
  },

  // ───────────── Passaporte perdido
  {
    id: "rp_via_passaporte",
    titulo: "Perdi o passaporte",
    categoria: "cidade",
    emoji: "🛂",
    parceiro: { nome: "Policial do posto", emoji: "👮" },
    missao_pt: "No posto policial, conte que perdeu o passaporte e diga onde acha que isso aconteceu.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_256"],
    system_prompt_cenario: "Policial pergunta o que houve e onde o passaporte foi perdido, e pede o nome no formulário.",
    roteiro: [
      {
        ia: line("どうしましたか。", "どうしましたか。", "O que houve?", [
          b("do.o", "HL", "como", "pergunta"),
          b("_shi.ma._shi.ta", "LLLL", "fez", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que perdeu o passaporte.",
        chaves: ["パスポート", "なくしました"],
        exemplo_card: "card_256",
      },
      {
        ia: line("どこでなくしましたか。", "どこでなくしましたか。", "Onde você perdeu?", [
          b("do.ko", "HL", "onde", "pergunta"),
          b("de", "L", "[Local da ação]", "particula"),
          b("na.ku.shi.ma._shi.ta", "LHHHLL", "perdeu", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que acha que foi na estação.",
        chaves: ["えき", "駅", "おもいます", "思います"],
        exemplo: line("えきだとおもいます。", "駅[えき]だと思[おも]います。", "Acho que foi na estação.", [
          b("e.ki", "HL", "estação", "lugar"),
          b("da", "L", "é (forma plana)", "copula"),
          b("to", "L", "[citação: que…]", "particula"),
          b("o.mo.i.ma._su", "LHHHL", "penso", "verbo"),
        ]),
      },
      {
        ia: line("わかりました。ここになまえをかいてください。", "わかりました。ここに名前[なまえ]を書[か]いてください。", "Entendi. Escreva seu nome aqui, por favor. (fim)", [
          WAKARIMASHITA,
          b("ko.ko", "LH", "aqui", "lugar"),
          b("ni", "H", "[Local]", "particula"),
          b("na.ma.e", "LHH", "nome", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("ka.i.te", "HLL", "escrever (forma -te)", "verbo"),
          b("ku.da.sa.i", "LLLL", "por favor", "verbo"),
        ]),
      },
    ],
  },

  // ───────────── Depois da viagem
  {
    id: "rp_via_volta",
    titulo: "Como foi a viagem?",
    categoria: "social",
    emoji: "♨️",
    parceiro: { nome: "Yuki · amiga", emoji: "👩" },
    missao_pt: "De volta da viagem, conte à Yuki como foi, dê exemplos do que fez e diga se quer ir de novo.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_257", "card_258", "card_209"],
    system_prompt_cenario: "Amiga curiosa pergunta como foi a viagem, o que você fez e se voltaria.",
    roteiro: [
      {
        ia: line("りょこうはどうでしたか。", "旅行[りょこう]はどうでしたか。", "Como foi a viagem?", [
          b("ryo.ko.o", "LHH", "viagem", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("do.o", "HL", "como", "pergunta"),
          b("de._shi.ta", "LLL", "foi", "copula"),
          KA,
        ]),
        dica_pt: "Diga que foi uma viagem divertida.",
        chaves: ["たのしい", "楽しい"],
        exemplo_card: "card_257",
      },
      {
        ia: line("なにをしましたか。", "何[なに]をしましたか。", "O que você fez?", [
          b("na.ni", "HL", "o quê", "pergunta"),
          b("o", "L", "[Objeto]", "particula"),
          b("_shi.ma._shi.ta", "LHLL", "fez", "verbo"),
          KA,
        ]),
        dica_pt: "Dê dois exemplos com a forma -tari.",
        chaves: ["たり"],
        exemplo_card: "card_258",
      },
      {
        ia: line("またいきたいですか。", "また行[い]きたいですか。", "Quer ir de novo?", [
          b("ma.ta", "LH", "de novo", "adverbio"),
          b("i.ki.ta.i", "HHHL", "quer ir", "verbo"),
          DESU,
          KA,
        ]),
        dica_pt: "Diga que quer ir de novo.",
        chaves: ["いきたい", "行きたい"],
        exemplo_card: "card_209",
      },
      {
        ia: line("いいですね。", "いいですね。", "Que bom! (fim)", [b("i.i", "HL", "bom", "adjetivo"), DESU, b("ne", "L", "[né]", "particula")]),
      },
    ],
  },
];
