import { seedCards } from "./cards";
import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 34 (Telefone e e-mail): ligar para um cliente, atender a ligação de alguém de fora e conferir um
 * e-mail com um colega. Usam as frases de `cards-telefone.ts` como resposta-modelo. ★ nova = palavra nova.
 */

/** Uma frase do baralho como fala do parceiro. */
function fala(id: string, pt?: string) {
  const c = seedCards.find((x) => x.id === id)!;
  return line(`${c.kana}。`, `${c.kanji}。`, pt ?? c.traducao, c.blocos);
}

const KA = b("ka", "L", "[?]", "particula");
const HAI_DOUZO = line("はい、どうぞ。", "はい、どうぞ。", "Sim, pode falar.", [b("ha.i", "HL", "sim", "expressao"), b("do.o.zo", "HLL", "por favor", "expressao")]);

export const cenariosTelefone: SeedScenario[] = [
  // ───────────── Ligar
  {
    id: "rp_tel_ligar",
    titulo: "Ligando para um cliente",
    categoria: "trabalho",
    emoji: "📞",
    parceiro: { nome: "Secretária da empresa", emoji: "🧑‍💼" },
    missao_pt: "Ligue para uma empresa, diga quem é e peça para falar com a senhora Yamada. Ela não está: deixe recado de que enviou o e-mail.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_399", "card_400", "card_404", "card_412"],
    system_prompt_cenario: "Secretária atende, diz que a senhora Yamada não está à mesa e anota o recado.",
    roteiro: [
      {
        ia: line("エービーシーしょうじでございます。", "エービーシー商事[しょうじ]でございます。", "Aqui é a ABC Comercial. (nova: de gozaimasu = é, muito formal)", [
          b("e.e.bi.i.shi.i", "LHHHHH", "ABC", "substantivo"),
          b("sho.o.ji", "HLL", "empresa comercial", "substantivo"),
          b("de", "L", "[é]", "copula"),
          b("go.za.i.ma._su", "LHHHL", "é (formal) ★ nova", "copula"),
        ]),
        dica_pt: "Diga quem é e peça a senhora Yamada.",
        chaves: ["もうします", "申します", "やまださま", "山田様"],
        exemplo: line("シルバともうしますが、やまださまはいらっしゃいますか。", "シルバと申[もう]しますが、山田様[やまださま]はいらっしゃいますか。", "Sou o Silva. A senhora Yamada está?", [
          b("shi.ru.ba", "HLL", "Silva", "substantivo"),
          b("to", "L", "[citação: que…]", "particula"),
          b("mo.o._shi.ma._su", "LHHHL", "digo (humilde)", "verbo"),
          b("ga", "L", "[mas…]", "particula"),
          b("ya.ma.da", "LHH", "Yamada", "topico"),
          b("sa.ma", "LL", "sr., sra. (respeito)", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("i.ra.s.sha.i.ma._su", "LHHHHHL", "está (respeito)", "verbo"),
          KA,
        ]),
      },
      { ia: fala("card_401"), dica_pt: "Peça para deixar recado.", chaves: ["でんごん", "伝言"], exemplo_card: "card_404" },
      { ia: HAI_DOUZO, dica_pt: "Diga que enviou o e-mail.", chaves: ["メール", "おおくり", "お送り"], exemplo_card: "card_412" },
      {
        ia: line("かしこまりました。", "かしこまりました。", "Entendido, senhor. (nova: kashikomarimashita = entendi, muito formal) (fim)", [
          b("ka._shi.ko.ma.ri.ma._shi.ta", "LHHHHHLL", "entendi (formal) ★ nova", "expressao"),
        ]),
      },
    ],
  },

  // ───────────── Atender
  {
    id: "rp_tel_atender",
    titulo: "Atendendo o telefone",
    categoria: "trabalho",
    emoji: "📲",
    parceiro: { nome: "Yamada-san · cliente", emoji: "🧑‍💼" },
    missao_pt: "Um cliente liga procurando o seu gerente, que não está. Lembre-se: com gente de fora, o seu gerente é tratado com humildade.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_401"],
    system_prompt_cenario: "Cliente procura o gerente, deixa o recado de que a reunião é às dez e se despede.",
    roteiro: [
      { ia: fala("card_398", "Sou o Yamada. O gerente está?"), dica_pt: "Diga que no momento não está na mesa.", chaves: ["せき", "席", "はずして", "外して"], exemplo_card: "card_401" },
      { ia: fala("card_404"), dica_pt: "Diga que pode falar.", chaves: ["どうぞ"], exemplo: HAI_DOUZO },
      {
        ia: line("あしたのかいぎはじゅうじからです。", "明日[あした]の会議[かいぎ]は十時[じゅうじ]からです。", "A reunião de amanhã é às dez.", [
          b("a._shi.ta", "LHH", "amanhã", "tempo"),
          b("no", "L", "[de]", "particula"),
          b("ka.i.gi", "HLL", "reunião", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("ju.u.ji", "HLL", "dez horas", "tempo"),
          b("ka.ra", "LL", "a partir de", "particula"),
          b("de._su", "LL", "é", "copula"),
        ]),
        dica_pt: "Diga que vai passar o recado ao gerente.",
        chaves: ["つたえ", "伝え"],
        exemplo: line("ぶちょうにおつたえします。", "部長[ぶちょう]にお伝[つた]えします。", "Vou passar ao gerente.", [
          b("bu.cho.o", "LHH", "gerente", "substantivo"),
          b("ni", "H", "[alvo]", "particula"),
          b("o._tsu.ta.e", "LHHH", "transmitir (humilde)", "verbo"),
          b("_shi.ma._su", "HHL", "faço", "verbo"),
        ]),
      },
      { ia: fala("card_411", "Até logo. (fim)") },
    ],
  },

  // ───────────── E-mail
  {
    id: "rp_tel_email",
    titulo: "O e-mail do cliente",
    categoria: "trabalho",
    emoji: "📧",
    parceiro: { nome: "Kobayashi-kachō · chefe", emoji: "👔" },
    missao_pt: "O chefe quer saber se o e-mail para o cliente saiu. Confirme que você enviou e que os documentos foram anexados.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_414"],
    system_prompt_cenario: "Chefe confere se o e-mail foi enviado e se os documentos foram anexados.",
    roteiro: [
      {
        ia: line("もうメールをおくりましたか。", "もうメールを送[おく]りましたか。", "Você já enviou o e-mail?", [
          b("mo.o", "HL", "já", "adverbio"),
          b("me.e.ru", "HLL", "e-mail", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("o.ku.ri.ma._shi.ta", "LHHHLL", "enviou", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que enviou, com humildade.",
        chaves: ["おおくり", "お送り"],
        exemplo: line("はい、おおくりしました。", "はい、お送[おく]りしました。", "Sim, enviei.", [
          b("ha.i", "HL", "sim", "expressao"),
          b("o.o.ku.ri", "LHHH", "enviar (humilde)", "verbo"),
          b("shi.ma._shi.ta", "HHLL", "fiz", "verbo"),
        ]),
      },
      {
        ia: line("しりょうもてんぷしましたか。", "資料[しりょう]も添付[てんぷ]しましたか。", "Anexou os documentos também?", [
          b("shi.ryo.o", "HLL", "documentos", "objeto"),
          b("mo", "L", "[também]", "particula"),
          b("te.n.pu", "LHH", "anexo", "substantivo"),
          b("_shi.ma._shi.ta", "HHLL", "fez", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que anexou.",
        chaves: ["てんぷ", "添付"],
        exemplo_card: "card_414",
      },
      {
        ia: line("ありがとうございました。", "ありがとうございました。", "Obrigado! (fim)", [
          b("a.ri.ga.to.o", "LHLLL", "obrigado", "expressao"),
          b("go.za.i.ma._shi.ta", "LHHHLL", "[forma educada]", "expressao"),
        ]),
      },
    ],
  },
];
