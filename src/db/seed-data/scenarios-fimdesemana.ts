import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 13 (Fim de semana): a conversa de segunda-feira, um convite para a amiga e a rotina da manhã.
 * Usam as frases de `cards-fimdesemana.ts` como resposta-modelo. ★ nova = palavra nova.
 */

export const cenariosFimDeSemana: SeedScenario[] = [
  // ───────────── Segunda-feira
  {
    id: "rp_fds_segunda",
    titulo: "Segunda-feira no escritório",
    categoria: "trabalho",
    emoji: "☕",
    parceiro: { nome: "Yamada-san · colega", emoji: "👩‍💼" },
    missao_pt:
      "A colega quer saber do seu fim de semana. Conte que foi à loja de departamentos e comprou sapatos, que foi sozinho(a) e que foi divertido.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_103", "card_107", "card_110", "card_111", "card_112"],
    system_prompt_cenario: "Colega simpática na segunda de manhã: pergunta o que você fez, com quem foi e se foi divertido.",
    roteiro: [
      {
        ia: line("しゅうまつはなにをしましたか。", "週末[しゅうまつ]は何[なに]をしましたか。", "O que você fez no fim de semana?", [
          b("shu.u.ma.tsu", "LHHH", "fim de semana", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("na.ni", "HL", "o quê", "pergunta"),
          b("o", "L", "[Objeto]", "particula"),
          b("shi.ma._shi.ta", "LHLL", "fez", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que foi à loja de departamentos e comprou sapatos.",
        chaves: ["デパート", "かいました", "買いました"],
        exemplo_card: "card_107",
      },
      {
        ia: line("だれといきましたか。", "誰[だれ]と行[い]きましたか。", "Com quem você foi?", [
          b("da.re", "HL", "quem", "pergunta"),
          b("to", "L", "[com]", "particula"),
          b("i.ki.ma._shi.ta", "LHHLL", "foi", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que foi sozinho(a).",
        chaves: ["ひとり", "一人"],
        exemplo_card: "card_111",
      },
      {
        ia: line("たのしかったですか。", "楽[たの]しかったですか。", "Foi divertido?", [
          b("ta.no._shi.ka.t.ta", "LHHLLL", "foi divertido", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que foi muito divertido.",
        chaves: ["たのしかった", "楽しかった"],
        exemplo_card: "card_112",
      },
      {
        ia: line("それはよかったですね。", "それはよかったですね。", "Que bom! (fim)", [
          b("so.re", "LH", "isso", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("yo.ka.t.ta", "HLLL", "foi bom", "adjetivo"),
          b("de.su", "LL", "é", "copula"),
          b("ne", "L", "[né]", "particula"),
        ]),
      },
    ],
  },

  // ───────────── Convite
  {
    id: "rp_fds_convite",
    titulo: "Da próxima vez, juntos",
    categoria: "social",
    emoji: "🎬",
    parceiro: { nome: "Yuki · amiga", emoji: "👩" },
    missao_pt:
      "A Yuki pergunta como foi seu fim de semana. Conte algumas coisas que você fez e, quando ela disser que não saiu, convide-a para ir junto da próxima vez.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_109", "card_113", "card_114"],
    system_prompt_cenario: "Amiga conta que não saiu no fim de semana e aceita o convite com alegria.",
    roteiro: [
      {
        ia: line("しゅうまつ、どうでしたか。", "週末[しゅうまつ]、どうでしたか。", "Como foi o fim de semana?", [
          b("shu.u.ma.tsu", "LHHH", "fim de semana", "topico"),
          b("do.o", "HL", "como", "pergunta"),
          b("de._shi.ta", "LLL", "foi", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Conte que viu filmes, leu livros… (sem fechar a lista).",
        chaves: ["たり"],
        exemplo_card: "card_109",
      },
      {
        ia: line("いいですね。わたしはどこへもいきませんでした。", "いいですね。私[わたし]はどこへも行[い]きませんでした。", "Que bom! Eu não fui a lugar nenhum.", [
          b("i.i", "HL", "bom", "adjetivo"),
          b("de.su", "LL", "é", "copula"),
          b("ne", "L", "[né]", "particula"),
          b("wa.ta._shi", "LHH", "eu", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("do.ko", "HL", "onde", "pergunta"),
          b("e", "L", "[Destino →]", "particula"),
          b("mo", "L", "[nem]", "particula"),
          b("i.ki.ma.se.n", "LHHHL", "não fui", "verbo"),
          b("de._shi.ta", "LLL", "[passado]", "verbo"),
        ]),
        dica_pt: "Convide-a para ir junto da próxima vez.",
        chaves: ["いっしょ", "一緒", "いきません", "行きません"],
        exemplo_card: "card_114",
      },
      {
        ia: line("いいですね。いきましょう。", "いいですね。行[い]きましょう。", "Boa! Vamos! (fim)", [
          b("i.i", "HL", "bom", "adjetivo"),
          b("de.su", "LL", "é", "copula"),
          b("ne", "L", "[né]", "particula"),
          b("i.ki.ma.sho.o", "LHHHL", "vamos", "verbo"),
        ]),
      },
    ],
  },

  // ───────────── Rotina da manhã
  {
    id: "rp_fds_manha",
    titulo: "Como é a sua manhã?",
    categoria: "social",
    emoji: "🌅",
    parceiro: { nome: "Ito-san · colega novo", emoji: "🙋" },
    missao_pt: "Um colega novo quer saber da sua rotina. Diga a que horas acorda e conte, em sequência, o que faz até chegar à empresa.",
    nivel: 1,
    vocabulario_requerido_ids: ["card_106"],
    system_prompt_cenario: "Colega curioso pergunta a que horas você acorda e o que faz depois.",
    roteiro: [
      {
        ia: line("あさはなんじにおきますか。", "朝[あさ]は何時[なんじ]に起[お]きますか。", "A que horas você acorda?", [
          b("a.sa", "HL", "manhã", "tempo"),
          b("wa", "L", "[Tópico]", "particula"),
          b("na.n.ji", "HLL", "que horas", "pergunta"),
          b("ni", "L", "[Ponto no tempo]", "particula"),
          b("o.ki.ma._su", "LHHL", "acorda", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que acorda às 6.",
        chaves: ["ろくじ", "六時", "6時"],
        exemplo: line("ろくじにおきます。", "六時[ろくじ]に起[お]きます。", "Acordo às 6.", [
          b("ro.ku.ji", "LHL", "6 horas", "tempo"),
          b("ni", "L", "[Ponto no tempo]", "particula"),
          b("o.ki.ma._su", "LHHL", "acordo", "verbo"),
        ]),
      },
      {
        ia: line("それから。", "それから。", "E depois?", [b("so.re.ka.ra", "LHHH", "e depois", "expressao")]),
        dica_pt: "Conte em sequência: acorda, toma banho e vai para a empresa.",
        chaves: ["シャワー", "あびて", "浴びて", "かいしゃ", "会社"],
        exemplo_card: "card_106",
      },
      {
        ia: line("はやいですね。", "早[はや]いですね。", "Que cedo! (fim)", [
          b("ha.ya.i", "LHL", "cedo", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
          b("ne", "L", "[né]", "particula"),
        ]),
      },
    ],
  },
];
