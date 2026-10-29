import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões de trabalho mais longas (6 turnos, várias pessoas): atraso, prazo, cliente e fim do expediente.
 * Usam as frases de `cards-trabalho.ts` como resposta-modelo. ★ nova = palavra nova.
 */

const CHEFE = { nome: "Kobayashi-kachō · chefe", emoji: "👔" };
const YAMADA = { nome: "Yamada-san · colega", emoji: "👩‍💼" };
const SUZUKI = { nome: "Suzuki-san · colega", emoji: "🧑‍💻" };
const CLIENTE = { nome: "Kimura-san · cliente", emoji: "🧑‍💼" };
const DIRETOR = { nome: "Mori-buchō · diretor", emoji: "👨‍💼" };
const ITO = { nome: "Ito-san · colega", emoji: "🙋" };

const obrigado = line("ありがとうございます。", "ありがとうございます。", "Obrigado.", [
  b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
  b("go.za.i.ma._su", "LHHHL", "[forma educada]", "expressao"),
]);

const contoComVoce = line("よろしくおねがいします。", "よろしくお願[ねが]いします。", "Conto com você. (fim)", [
  b("yo.ro._shi.ku", "LHHH", "conto com você", "expressao"),
  b("o.ne.ga.i.shi.ma._su", "LHHHHHL", "[por favor, educado]", "expressao"),
]);

const simPorFavor = line("はい、おねがいします。", "はい、お願[ねが]いします。", "Sim, por favor.", [
  b("ha.i", "HL", "sim", "expressao"),
  b("o.ne.ga.i.shi.ma._su", "LHHHHHL", "peço (por favor)", "verbo"),
]);

export const cenariosTrabalho: SeedScenario[] = [
  // ───────────── Atraso
  {
    id: "rp_trab_atraso",
    titulo: "Cheguei atrasado na reunião",
    categoria: "trabalho",
    emoji: "⏰",
    parceiro: CHEFE,
    missao_pt:
      "O trem atrasou e você chega com a reunião já começada. Peça desculpas explicando o motivo, descubra a que horas a reunião termina, agradeça o material da colega e confirme o pedido do chefe com respeito.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_036", "card_037", "card_030", "card_004", "card_041"],
    system_prompt_cenario:
      "Chefe numa reunião já começada: pergunta se está tudo bem, diz que a reunião já começou, informa o horário de término; a colega entrega o material; o chefe pede um e-mail depois.",
    roteiro: [
      {
        ia: line("おはようございます。だいじょうぶですか。", "おはようございます。大丈夫[だいじょうぶ]ですか。", "Bom dia. Está tudo bem? (nova: daijoubu = tudo bem)", [
          b("o.ha.yo.o", "LHHH", "bom dia", "expressao"),
          b("go.za.i.ma._su", "HHHHL", "[forma educada]", "expressao"),
          b("da.i.jo.o.bu", "LHHLL", "tudo bem, sem problema ★ nova", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Peça desculpas e diga que o trem atrasou.",
        chaves: ["おくれ", "遅れ"],
        exemplo: line("すみません、でんしゃがおくれました。", "すみません、電車[でんしゃ]が遅[おく]れました。", "Desculpe, o trem atrasou.", [
          b("su.mi.ma.se.n", "LHHHL", "desculpe", "expressao"),
          b("de.n.sha", "LHH", "trem", "sujeito"),
          b("ga", "H", "[Foco / sujeito]", "particula"),
          b("o.ku.re.ma._shi.ta", "LHHHLL", "atrasou", "verbo"),
        ]),
      },
      {
        ia: line("だいじょうぶです。かいぎはもうはじめました。", "大丈夫[だいじょうぶ]です。会議[かいぎ]はもう始[はじ]めました。", "Tudo bem. Já começamos a reunião. (nova: mou = já)", [
          b("da.i.jo.o.bu", "LHHLL", "tudo bem", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
          b("ka.i.gi", "HLL", "reunião", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("mo.o", "HL", "já ★ nova", "adverbio"),
          b("ha.ji.me.ma._shi.ta", "LHHHLL", "começamos", "verbo"),
        ]),
        dica_pt: "Pergunte a que horas a reunião termina.",
        chaves: ["おわり", "終わり", "なんじ", "何時"],
        exemplo_card: "card_037",
      },
      {
        ia: line("さんじにおわります。", "三時[さんじ]に終[お]わります。", "Termina às 3.", [
          b("sa.n.ji", "HLL", "3 horas", "tempo"),
          b("ni", "L", "[Ponto no tempo]", "particula"),
          b("o.wa.ri.ma._su", "LHHHL", "termina", "verbo"),
        ]),
        dica_pt: "Diga que entendeu.",
        chaves: ["わかりました", "分かりました", "かしこまり"],
        exemplo_card: "card_030",
      },
      {
        quem: YAMADA,
        ia: line("これがきょうのしりょうです。", "これが今日[きょう]の資料[しりょう]です。", "Este é o material de hoje.", [
          b("ko.re", "LH", "isto", "sujeito"),
          b("ga", "H", "[Foco / sujeito]", "particula"),
          b("kyo.o", "HL", "hoje", "tempo"),
          b("no", "L", "[de]", "particula"),
          b("shi.ryo.o", "HLL", "material", "substantivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
        dica_pt: "Agradeça à colega.",
        chaves: ["ありがとう"],
        exemplo_card: "card_004",
      },
      {
        quem: CHEFE,
        ia: line("あとでメールをおくってください。", "後[あと]でメールを送[おく]ってください。", "Depois me mande um e-mail, por favor.", [
          b("a.to", "HL", "depois", "tempo"),
          b("de", "L", "[em (momento)]", "particula"),
          b("me.e.ru", "LHH", "e-mail", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("o._ku.t.te", "LHHH", "envie (forma -te)", "verbo"),
          b("ku.da.sa.i", "HHHL", "[por favor]", "verbo"),
        ]),
        dica_pt: "Confirme com respeito (é o chefe).",
        chaves: ["かしこまり", "わかりました", "分かりました"],
        exemplo_card: "card_041",
      },
      { ia: contoComVoce },
    ],
  },

  // ───────────── Prazo
  {
    id: "rp_trab_prazo",
    titulo: "Um pedido com prazo",
    categoria: "trabalho",
    emoji: "📅",
    parceiro: CHEFE,
    missao_pt:
      "O chefe te pede o material da reunião da semana que vem. Pergunte qual é o prazo, prometa enviar até lá e aceite a ajuda de um colega.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_035", "card_038", "card_040", "card_004"],
    system_prompt_cenario:
      "Chefe pede para preparar o material da reunião da semana seguinte e dá o prazo (sexta); um colega oferece ajuda e vai verificar os dados.",
    roteiro: [
      {
        ia: line("ちょっといいですか。", "ちょっといいですか。", "Tem um minutinho? (literal: um pouco, está bom?)", [
          b("cho.t.to", "HLL", "um pouco", "adverbio"),
          b("i.i", "HL", "bom", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que sim, tudo bem.",
        chaves: ["はい", "だいじょうぶ", "大丈夫"],
        exemplo: line("はい、だいじょうぶです。", "はい、大丈夫[だいじょうぶ]です。", "Sim, tudo bem.", [
          b("ha.i", "HL", "sim", "expressao"),
          b("da.i.jo.o.bu", "LHHLL", "tudo bem", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
      },
      {
        ia: line(
          "らいしゅうのかいぎのしりょうをじゅんびしてください。",
          "来週[らいしゅう]の会議[かいぎ]の資料[しりょう]を準備[じゅんび]してください。",
          "Prepare o material da reunião da semana que vem, por favor.",
          [
            b("ra.i.shu.u", "LHHH", "semana que vem", "tempo"),
            b("no", "H", "[de]", "particula"),
            b("ka.i.gi", "HLL", "reunião", "substantivo"),
            b("no", "L", "[de]", "particula"),
            b("shi.ryo.o", "HLL", "material", "objeto"),
            b("o", "L", "[Objeto]", "particula"),
            b("ju.n.bi", "HLL", "preparação", "substantivo"),
            b("_shi.te", "LL", "faça (forma -te)", "verbo"),
            b("ku.da.sa.i", "LLLL", "[por favor]", "verbo"),
          ],
        ),
        dica_pt: "Pergunte qual é o prazo (quando é a data-limite).",
        chaves: ["いつ", "しめきり", "締め切り"],
        exemplo: line("しめきりはいつですか。", "締[し]め切[き]りはいつですか。", "Qual é o prazo? (literal: quanto ao prazo, quando é?)", [
          b("shi.me.ki.ri", "LHHH", "prazo ★ nova", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("i.tsu", "HL", "quando", "pergunta"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
      },
      {
        ia: line("きんようびです。", "金曜日[きんようび]です。", "É sexta-feira. (nova: kin'youbi)", [
          b("ki.n.yo.o.bi", "LHHLL", "sexta-feira ★ nova", "tempo"),
          b("de._su", "LL", "é", "copula"),
        ]),
        dica_pt: "Diga que entendeu e que vai enviar até sexta.",
        chaves: ["おくります", "送ります", "おくり", "送り"],
        exemplo: line("わかりました。きんようびまでにおくります。", "分[わ]かりました。金曜日[きんようび]までに送[おく]ります。", "Entendi. Envio até sexta.", [
          b("wa.ka.ri.ma._shi.ta", "LHHHLL", "entendi", "verbo"),
          b("ki.n.yo.o.bi", "LHHLL", "sexta-feira", "tempo"),
          b("ma.de.ni", "LLL", "[até — prazo]", "particula"),
          b("o.ku.ri.ma._su", "LHHHL", "envio", "verbo"),
        ]),
      },
      {
        quem: SUZUKI,
        ia: line("いそがしいですか。てつだいましょうか。", "忙[いそが]しいですか。手伝[てつだ]いましょうか。", "Está ocupado? Quer que eu ajude?", [
          b("i.so.ga.shi.i", "LHHHL", "ocupado", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
          b("te.tsu.da.i.ma.sho.o", "LHHHHHL", "ajudo? (oferta)", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Aceite a ajuda: sim, por favor.",
        chaves: ["おねがい", "お願い"],
        exemplo: simPorFavor,
      },
      {
        quem: SUZUKI,
        ia: line("じゃあ、データをかくにんします。", "じゃあ、データを確認[かくにん]します。", "Então eu verifico os dados.", [
          b("ja.a", "HL", "então", "expressao"),
          b("de.e.ta", "HLL", "dados", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("ka.ku.ni.n", "LHHH", "verificação", "substantivo"),
          b("shi.ma._su", "HHL", "faço", "verbo"),
        ]),
        dica_pt: "Diga que isso ajuda muito.",
        chaves: ["たすかり", "助かり", "ありがとう"],
        exemplo: line("たすかります。", "助[たす]かります。", "Ajuda muito! (literal: fico salvo)", [
          b("ta._su.ka.ri.ma._su", "LHHHHL", "fico salvo (ajuda muito) ★ nova", "verbo"),
        ]),
      },
      { quem: CHEFE, ia: contoComVoce },
    ],
  },

  // ───────────── Cliente
  {
    id: "rp_trab_cliente",
    titulo: "Recebendo um cliente",
    categoria: "trabalho",
    emoji: "🏢",
    parceiro: CLIENTE,
    missao_pt:
      "Um cliente chega para falar com o diretor. Peça um momento, atenda o pedido do diretor, puxe conversa com o cliente e agradeça o elogio.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_033", "card_041", "card_004"],
    system_prompt_cenario:
      "Cliente chega procurando o diretor; o diretor pede café; o cliente puxa conversa sobre o calor, o tempo no Japão e elogia o japonês; o diretor abre a reunião.",
    roteiro: [
      {
        ia: line("すみません。ぶちょうさんはいらっしゃいますか。", "すみません。部長[ぶちょう]さんはいらっしゃいますか。", "Com licença. O diretor está? (irasshaimasu = está, forma de respeito)", [
          b("su.mi.ma.se.n", "LHHHL", "com licença", "expressao"),
          b("bu.cho.o.sa.n", "LHHHH", "o senhor diretor", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("i.ra.s.sha.i.ma._su", "LHHHHHL", "está (respeito) ★ nova", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Peça para ele aguardar um momento.",
        chaves: ["おまち", "お待ち", "しょうしょう", "少々"],
        exemplo_card: "card_033",
      },
      {
        quem: DIRETOR,
        ia: line("ありがとう。コーヒーをおねがいします。", "ありがとう。コーヒーをお願[ねが]いします。", "Obrigado. Um café, por favor.", [
          b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
          b("ko.o.hi.i", "LHHL", "café", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("o.ne.ga.i.shi.ma._su", "LHHHHHL", "peço (por favor)", "verbo"),
        ]),
        dica_pt: "Confirme com respeito.",
        chaves: ["かしこまり", "わかりました", "分かりました"],
        exemplo_card: "card_041",
      },
      {
        quem: CLIENTE,
        ia: line("きょうはあついですね。", "今日[きょう]は暑[あつ]いですね。", "Está quente hoje, né?", [
          b("kyo.o", "HL", "hoje", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("a.tsu.i", "LHL", "quente ★ nova", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
          b("ne", "L", "[né?]", "particula"),
        ]),
        dica_pt: "Concorde: é mesmo, né.",
        chaves: ["そう"],
        exemplo: line("そうですね。", "そうですね。", "É mesmo, né.", [
          b("so.o", "HL", "assim", "adverbio"),
          b("de._su", "LL", "é", "copula"),
          b("ne", "L", "[né]", "particula"),
        ]),
      },
      {
        ia: line("にほんはながいですか。", "日本[にほん]は長[なが]いですか。", "Faz tempo que você está no Japão? (literal: quanto ao Japão, é longo?)", [
          b("ni.ho.n", "LHL", "Japão", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("na.ga.i", "LHL", "longo ★ nova", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que não, que é só um ano ainda.",
        chaves: ["いちねん", "一年", "1年"],
        exemplo: line("いいえ、まだいちねんです。", "いいえ、まだ一年[いちねん]です。", "Não, ainda é só um ano.", [
          b("i.i.e", "LHH", "não", "expressao"),
          b("ma.da", "HL", "ainda", "adverbio"),
          b("i.chi.ne.n", "LHLL", "um ano ★ nova", "tempo"),
          b("de._su", "LL", "é", "copula"),
        ]),
      },
      {
        ia: line("にほんごがじょうずですね。", "日本語[にほんご]が上手[じょうず]ですね。", "Seu japonês é muito bom!", [
          b("ni.ho.n.go", "LHHH", "japonês (língua)", "sujeito"),
          b("ga", "H", "[Foco / sujeito]", "particula"),
          b("jo.o.zu", "LHH", "habilidoso", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
          b("ne", "L", "[né]", "particula"),
        ]),
        dica_pt: "Agradeça o elogio.",
        chaves: ["ありがとう"],
        exemplo: obrigado,
      },
      {
        quem: DIRETOR,
        ia: line("じゃあ、かいぎをはじめましょう。", "じゃあ、会議[かいぎ]を始[はじ]めましょう。", "Então, vamos começar a reunião. (fim)", [
          b("ja.a", "HL", "então", "expressao"),
          b("ka.i.gi", "HLL", "reunião", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("ha.ji.me.ma.sho.o", "LHHHHL", "vamos começar", "verbo"),
        ]),
      },
    ],
  },

  // ───────────── Fim do expediente
  {
    id: "rp_trab_saida",
    titulo: "Fim do expediente",
    categoria: "trabalho",
    emoji: "🌆",
    parceiro: ITO,
    missao_pt:
      "No fim do dia, uma colega pergunta se você ainda está trabalhando e te convida para jantar. Explique o que falta, combine o horário e se despeça do chefe do jeito certo.",
    nivel: 2,
    vocabulario_requerido_ids: ["card_031", "card_032", "card_037"],
    system_prompt_cenario:
      "Colega no fim do expediente: cumprimenta, pergunta se ainda está trabalhando, convida para jantar, pergunta a que horas termina e combina; o chefe pergunta se já vai embora.",
    roteiro: [
      {
        ia: line("おつかれさまです。まだしごとですか。", "お疲[つか]れ様[さま]です。まだ仕事[しごと]ですか。", "Bom trabalho! Ainda trabalhando? (nova: mada = ainda)", [
          b("o._tsu.ka.re.sa.ma", "LHHHHH", "bom trabalho", "expressao"),
          b("de._su", "HL", "[educado]", "expressao"),
          b("ma.da", "HL", "ainda ★ nova", "adverbio"),
          b("shi.go.to", "LHH", "trabalho", "substantivo"),
          b("de._su", "HL", "é", "copula"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que sim: depois de enviar este e-mail, vai embora.",
        chaves: ["かえり", "帰り", "おくって", "送って"],
        exemplo: line("はい。このメールをおくってから、かえります。", "はい。このメールを送[おく]ってから、帰[かえ]ります。", "Sim. Depois de enviar este e-mail, vou embora.", [
          b("ha.i", "HL", "sim", "expressao"),
          b("ko.no", "LH", "este", "adjetivo"),
          b("me.e.ru", "HHH", "e-mail", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("o._ku.t.te", "LHHH", "envio (forma -te)", "verbo"),
          b("ka.ra", "HH", "[depois de]", "particula"),
          b("ka.e.ri.ma._su", "LHHHL", "volto para casa", "verbo"),
        ]),
      },
      {
        ia: line("いっしょにばんごはんをたべませんか。", "一緒[いっしょ]に晩[ばん]ご飯[はん]を食[た]べませんか。", "Não quer jantar comigo? (nova: bangohan = jantar)", [
          b("i.s.sho.ni", "LHHH", "juntos", "adverbio"),
          b("ba.n.go.ha.n", "LHHLL", "jantar ★ nova", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("ta.be.ma.se.n", "LHHHL", "não come", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Aceite: boa ideia, vamos!",
        chaves: ["いきましょう", "行きましょう", "いいですね"],
        exemplo: line("いいですね。いきましょう。", "いいですね。行[い]きましょう。", "Boa! Vamos.", [
          b("i.i", "HL", "bom", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
          b("ne", "L", "[né]", "particula"),
          b("i.ki.ma.sho.o", "LHHHL", "vamos", "verbo"),
        ]),
      },
      {
        ia: line("なんじにおわりますか。", "何時[なんじ]に終[お]わりますか。", "A que horas você termina?", [
          b("na.n.ji", "HLL", "que horas", "pergunta"),
          b("ni", "L", "[Ponto no tempo]", "particula"),
          b("o.wa.ri.ma._su", "LHHHL", "termina", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Diga que termina às 6.",
        chaves: ["ろくじ", "六時", "6時"],
        exemplo: line("ろくじにおわります。", "六時[ろくじ]に終[お]わります。", "Termino às 6.", [
          b("ro.ku.ji", "LHL", "6 horas ★ nova", "tempo"),
          b("ni", "L", "[Ponto no tempo]", "particula"),
          b("o.wa.ri.ma._su", "LHHHL", "termino", "verbo"),
        ]),
      },
      {
        ia: line("じゃあ、ろくじにまちます。", "じゃあ、六時[ろくじ]に待[ま]ちます。", "Então te espero às 6.", [
          b("ja.a", "HL", "então", "expressao"),
          b("ro.ku.ji", "LHL", "6 horas", "tempo"),
          b("ni", "L", "[Ponto no tempo]", "particula"),
          b("ma.chi.ma._su", "LHHL", "espero", "verbo"),
        ]),
        dica_pt: "Responda: sim, por favor.",
        chaves: ["おねがい", "お願い", "はい"],
        exemplo: simPorFavor,
      },
      {
        quem: CHEFE,
        ia: line("もうかえりますか。", "もう帰[かえ]りますか。", "Já vai embora?", [
          b("mo.o", "HL", "já", "adverbio"),
          b("ka.e.ri.ma._su", "LHHHL", "volta (para casa)", "verbo"),
          b("ka", "L", "[?]", "particula"),
        ]),
        dica_pt: "Despeça-se do chefe do jeito certo (vou indo antes).",
        chaves: ["しつれい", "失礼"],
        exemplo_card: "card_032",
      },
      {
        quem: CHEFE,
        ia: line("おつかれさまでした。", "お疲[つか]れ様[さま]でした。", "Bom trabalho hoje! (fim)", [
          b("o._tsu.ka.re.sa.ma", "LHHHHH", "bom trabalho", "expressao"),
          b("de._shi.ta", "HLL", "[educado, pelo dia que passou]", "expressao"),
        ]),
      },
    ],
  },
];
