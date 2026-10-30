import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 18 (Regras e obrigações): as regras do apartamento, o primeiro dia no trabalho e o aviso no
 * trem. Usam as frases de `cards-regras.ts` como resposta-modelo. ★ nova = palavra nova.
 */

const obrigado = line("ありがとうございます。", "ありがとうございます。", "Obrigado.", [
  b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
  b("go.za.i.ma._su", "LHHHL", "[forma educada]", "expressao"),
]);

const sorekara = b("so.re.ka.ra", "LHHH", "e também, depois", "expressao");

export const cenariosRegras: SeedScenario[] = [
  // ───────────── Apartamento
  {
    id: "rp_reg_apartamento",
    titulo: "As regras do apartamento",
    categoria: "social",
    emoji: "🏢",
    parceiro: { nome: "Sr. Ota · senhorio", emoji: "👴" },
    missao_pt:
      "Você acabou de se mudar. O senhorio explica as regras: entenda a do lixo e a da bicicleta, pergunte se precisa tirar os sapatos no hall e agradeça.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_158", "card_159", "card_162", "card_156"],
    system_prompt_cenario: "Senhorio cuidadoso: explica o dia do lixo, onde não deixar a bicicleta e responde dúvidas.",
    roteiro: [
      {
        ia: line("ごみはげつようびにださなければなりません。", "ごみは月曜日[げつようび]に出[だ]さなければなりません。", "O lixo tem que ser colocado na segunda.", [
          b("go.mi", "LH", "lixo", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("ge.tsu.yo.o.bi", "LHHLL", "segunda-feira", "tempo"),
          b("ni", "L", "[Ponto no tempo]", "particula"),
          b("da.sa.na.ke.re.ba", "LHLLLL", "se não puser para fora", "verbo"),
          b("na.ri.ma.se.n", "LHHHL", "não dá", "verbo"),
        ]),
        dica_pt: "Diga que entendeu e vai tomar cuidado.",
        chaves: ["わかり", "分かり", "きをつけ", "気をつけ"],
        exemplo_card: "card_162",
      },
      {
        ia: line("それから、ここにじてんしゃをとめないでください。", "それから、ここに自転車[じてんしゃ]を止[と]めないでください。", "E também, não deixe a bicicleta aqui.", [
          sorekara,
          b("ko.ko", "LH", "aqui", "lugar"),
          b("ni", "H", "[Lugar onde fica]", "particula"),
          b("ji.te.n.sha", "LHHH", "bicicleta", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("to.me.na.i", "LHHH", "não parar", "verbo"),
          b("de", "H", "[sem]", "particula"),
          b("ku.da.sa.i", "HHHL", "por favor", "verbo"),
        ]),
        dica_pt: "Diga que entendeu.",
        chaves: ["わかり", "分かり"],
        exemplo_card: "card_030",
      },
      {
        ia: line("なにかしつもんはありますか。", "何[なに]か質問[しつもん]はありますか。", "Alguma pergunta? (nova: shitsumon = pergunta)", [
          b("na.ni.ka", "HLL", "algum, alguma", "pergunta"),
          b("_shi.tsu.mo.n", "LHHH", "pergunta ★ nova", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("a.ri.ma._su", "LHHL", "existe", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Pergunte se tem que tirar os sapatos.",
        chaves: ["くつ", "靴", "ぬがなければ", "脱がなければ"],
        exemplo: line("くつをぬがなければなりませんか。", "靴[くつ]を脱[ぬ]がなければなりませんか。", "Tenho que tirar os sapatos?", [
          b("_ku.tsu", "LH", "sapatos", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("nu.ga.na.ke.re.ba", "LHLLLL", "se não tirar", "verbo"),
          b("na.ri.ma.se.n", "LHHHL", "não dá", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
      },
      {
        ia: line("いいえ、ぬがなくてもいいです。", "いいえ、脱[ぬ]がなくてもいいです。", "Não, não precisa tirar.", [
          b("i.i.e", "LHH", "não", "expressao"),
          b("nu.ga.na._ku.te", "LHLLL", "mesmo sem tirar", "verbo"),
          b("mo", "L", "mesmo que", "particula"),
          b("i.i", "HL", "está bom", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
        dica_pt: "Agradeça.",
        chaves: ["ありがと"],
        exemplo: obrigado,
      },
      {
        ia: line("では、よろしく。", "では、よろしく。", "Então, conto com você. (fim)", [
          b("de.wa", "HL", "então", "expressao"),
          b("yo.ro._shi.ku", "LHHH", "conto com você", "expressao"),
        ]),
      },
    ],
  },

  // ───────────── Primeiro dia
  {
    id: "rp_reg_primeirodia",
    titulo: "O que eu tenho que fazer?",
    categoria: "trabalho",
    emoji: "🗂️",
    parceiro: { nome: "Kobayashi-kachō · chefe", emoji: "👔" },
    missao_pt:
      "Primeiro dia no emprego novo. Pergunte ao chefe o que você tem que fazer, entenda as tarefas e a regra da pontualidade, e agradeça a folga de amanhã.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_153", "card_157", "card_162"],
    system_prompt_cenario: "Chefe organizado: pede para ler o material, avisa da reunião à tarde e diz que amanhã é folga.",
    roteiro: [
      {
        ia: line("きょうからよろしくおねがいします。", "今日[きょう]からよろしくお願[ねが]いします。", "A partir de hoje, conto com você.", [
          b("kyo.o", "HL", "hoje", "tempo"),
          b("ka.ra", "LL", "a partir de", "particula"),
          b("yo.ro._shi.ku", "LHHH", "conto com você", "expressao"),
          b("o.ne.ga.i.shi.ma._su", "LHHHHHL", "[por favor, educado]", "expressao"),
        ]),
        dica_pt: "Pergunte o que você tem que fazer.",
        chaves: ["しなければ", "なに", "何"],
        exemplo_card: "card_153",
      },
      {
        ia: line("まず、このしりょうをよまなければなりません。", "まず、この資料[しりょう]を読[よ]まなければなりません。", "Primeiro, você tem que ler este material. (nova: mazu = primeiro)", [
          b("ma.zu", "HL", "primeiro ★ nova", "adverbio"),
          b("ko.no", "LH", "este", "objeto"),
          b("shi.ryo.o", "HLL", "material", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("yo.ma.na.ke.re.ba", "LHLLLL", "se não ler", "verbo"),
          b("na.ri.ma.se.n", "LHHHL", "não dá", "verbo"),
        ]),
        dica_pt: "Diga que entendeu.",
        chaves: ["わかり", "分かり"],
        exemplo_card: "card_030",
      },
      {
        ia: line("それから、ごごはかいぎです。じかんをまもってくださいね。", "それから、午後[ごご]は会議[かいぎ]です。時間[じかん]を守[まも]ってくださいね。", "E à tarde tem reunião. Seja pontual, tá? (nova: gogo = tarde)", [
          sorekara,
          b("go.go", "HL", "à tarde ★ nova", "tempo"),
          b("wa", "L", "[Tópico]", "particula"),
          b("ka.i.gi", "HLL", "reunião", "substantivo"),
          b("de._su", "LL", "é", "copula"),
          b("ji.ka.n", "LHH", "horário", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("ma.mo.t.te", "LHLL", "cumpra", "verbo"),
          b("ku.da.sa.i", "LLLL", "por favor", "verbo"),
          b("ne", "L", "[tá?]", "particula"),
        ]),
        dica_pt: "Diga que entendeu e vai tomar cuidado.",
        chaves: ["きをつけ", "気をつけ", "わかり"],
        exemplo_card: "card_162",
      },
      {
        ia: line("あと、あしたはやすみです。こなくてもいいですよ。", "あと、明日[あした]は休[やす]みです。来[こ]なくてもいいですよ。", "Ah, e amanhã é folga. Não precisa vir.", [
          b("a.to", "HL", "e mais", "expressao"),
          b("a._shi.ta", "LHH", "amanhã", "tempo"),
          b("wa", "L", "[Tópico]", "particula"),
          b("ya.su.mi", "LHH", "folga", "substantivo"),
          b("de._su", "LL", "é", "copula"),
          b("ko.na._ku.te", "HLLL", "mesmo sem vir", "verbo"),
          b("mo", "L", "mesmo que", "particula"),
          b("i.i", "HL", "está bom", "adjetivo"),
          b("de.su", "LL", "é", "copula"),
          b("yo", "L", "[te aviso]", "particula"),
        ]),
        dica_pt: "Agradeça.",
        chaves: ["ありがと"],
        exemplo: obrigado,
      },
      {
        ia: line("じゃあ、がんばってください。", "じゃあ、頑張[がんば]ってください。", "Então, força! (fim)", [
          b("ja.a", "HL", "então", "expressao"),
          b("ga.n.ba.t.te", "LHHLL", "esforce-se", "verbo"),
          b("ku.da.sa.i", "LLLL", "por favor", "verbo"),
        ]),
      },
    ],
  },

  // ───────────── No trem
  {
    id: "rp_reg_trem",
    titulo: "Um aviso no trem",
    categoria: "cidade",
    emoji: "🚃",
    parceiro: { nome: "Senhor no trem", emoji: "👴" },
    missao_pt: "Você atende o celular no trem e um senhor chama sua atenção. Peça desculpas e entenda a outra regra que ele explica.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_161", "card_005", "card_030"],
    system_prompt_cenario: "Senhor educado mas firme: pede para não falar ao telefone e avisa que é assento preferencial.",
    roteiro: [
      {
        ia: line("すみません、でんしゃのなかででんわしないでください。", "すみません、電車[でんしゃ]の中[なか]で電話[でんわ]しないでください。", "Com licença, não fale ao telefone dentro do trem.", [
          b("su.mi.ma.se.n", "LHHHL", "com licença", "expressao"),
          b("de.n.sha", "LHH", "trem", "lugar"),
          b("no", "H", "[de]", "particula"),
          b("na.ka", "HL", "dentro", "lugar"),
          b("de", "L", "[Local da ação]", "particula"),
          b("de.n.wa", "LHH", "telefone", "substantivo"),
          b("shi.na.i", "HHL", "não fazer", "verbo"),
          b("de", "L", "[sem]", "particula"),
          b("ku.da.sa.i", "LLLL", "por favor", "verbo"),
        ]),
        dica_pt: "Peça desculpas.",
        chaves: ["すみません"],
        exemplo_card: "card_005",
      },
      {
        ia: line("それから、ここはゆうせんせきです。", "それから、ここは優先席[ゆうせんせき]です。", "E aqui é assento preferencial. (nova: yuusenseki)", [
          sorekara,
          b("ko.ko", "LH", "aqui", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("yu.u.se.n.se.ki", "LHHLLL", "assento preferencial ★ nova", "substantivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
        dica_pt: "Peça desculpas de novo e diga que entendeu.",
        chaves: ["すみません", "わかり", "分かり"],
        exemplo: line("あ、すみません。わかりました。", "あ、すみません。わかりました。", "Ah, desculpe. Entendi.", [
          b("a", "L", "ah", "expressao"),
          b("su.mi.ma.se.n", "LHHHL", "desculpe", "expressao"),
          b("wa.ka.ri.ma._shi.ta", "LHHHLL", "entendi", "verbo"),
        ]),
      },
      { ia: { ...obrigado, pt: "Obrigado. (fim)" } },
    ],
  },
];
