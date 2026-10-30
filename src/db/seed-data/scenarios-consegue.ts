import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 27 (Consegue?): o que você sabe de japonês, as restrições no restaurante e o pedido de ajuda
 * à Yuki. Usam as frases de `cards-consegue.ts` como resposta-modelo. ★ nova = palavra nova.
 */

const DESU = b("de._su", "LL", "é", "copula");
const KA = b("ka", "L", "[?]", "particula");

export const cenariosConsegue: SeedScenario[] = [
  // ───────────── O que você sabe
  {
    id: "rp_pot_japones",
    titulo: "Você fala japonês?",
    categoria: "social",
    emoji: "🈶",
    parceiro: { nome: "Sato-san · conhecido", emoji: "🧑" },
    missao_pt: "Um conhecido quer saber até onde vai o seu japonês. Diga o que você consegue e o que ainda não consegue fazer.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_259", "card_260", "card_262", "card_263"],
    system_prompt_cenario: "Conhecido curioso pergunta se você fala japonês e se lê kanji e hiragana.",
    roteiro: [
      {
        ia: line("にほんごがはなせますか。", "日本語[にほんご]が話[はな]せますか。", "Você consegue falar japonês?", [
          b("ni.ho.n.go", "LHHH", "japonês", "sujeito"),
          b("ga", "H", "[Foco / sujeito]", "particula"),
          b("ha.na.se.ma._su", "LHHHL", "consegue falar", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que consegue falar um pouco.",
        chaves: ["すこし", "少し", "はなせます", "話せます"],
        exemplo_card: "card_260",
      },
      {
        ia: line("かんじがよめますか。", "漢字[かんじ]が読[よ]めますか。", "Você consegue ler kanji?", [
          b("ka.n.ji", "LHH", "kanji", "sujeito"),
          b("ga", "H", "[Foco / sujeito]", "particula"),
          b("yo.me.ma._su", "LHHL", "consegue ler", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que ainda não consegue.",
        chaves: ["まだ", "よめません", "読めません"],
        exemplo_card: "card_262",
      },
      {
        ia: line("ひらがなはよめますか。", "ひらがなは読[よ]めますか。", "E hiragana, você consegue ler?", [
          b("hi.ra.ga.na", "LHHL", "hiragana", "topico"),
          b("wa", "L", "[contraste]", "particula"),
          b("yo.me.ma._su", "LHHL", "consegue ler", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que hiragana você consegue ler.",
        chaves: ["よめます", "読めます"],
        exemplo_card: "card_263",
      },
      {
        ia: line("すごいですね。", "すごいですね。", "Que incrível! (fim)", [
          b("su.go.i", "LHL", "incrível", "adjetivo"),
          b("de.su", "LL", "é", "copula"),
          b("ne", "L", "[né]", "particula"),
        ]),
      },
    ],
  },

  // ───────────── Restaurante
  {
    id: "rp_pot_restaurante",
    titulo: "O que você não pode comer?",
    categoria: "restaurante",
    emoji: "🌶️",
    parceiro: { nome: "Garçonete", emoji: "🧑‍🍳" },
    missao_pt: "A garçonete quer saber o que você come. Diga que peixe sim, avise da alergia, recuse a comida apimentada e pergunte se aceitam cartão.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_265", "card_275", "card_138"],
    system_prompt_cenario: "Garçonete atenciosa pergunta sobre restrições alimentares e responde sobre o pagamento.",
    roteiro: [
      {
        ia: line("さかながたべられますか。", "魚[さかな]が食[た]べられますか。", "Você consegue comer peixe?", [
          b("sa.ka.na", "LHH", "peixe", "sujeito"),
          b("ga", "H", "[Foco / sujeito]", "particula"),
          b("ta.be.ra.re.ma._su", "LHHHHL", "consegue comer", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que sim.",
        chaves: ["たべられます", "食べられます"],
        exemplo: line("はい、たべられます。", "はい、食[た]べられます。", "Sim, consigo.", [
          b("ha.i", "HL", "sim", "expressao"),
          b("ta.be.ra.re.ma._su", "LHHHHL", "consigo comer", "verbo"),
        ]),
      },
      {
        ia: line("にくはたべられますか。", "肉[にく]は食[た]べられますか。", "E carne, você consegue comer?", [
          b("ni.ku", "LH", "carne", "topico"),
          b("wa", "L", "[contraste]", "particula"),
          b("ta.be.ra.re.ma._su", "LHHHHL", "consegue comer", "verbo"),
          KA,
        ]),
        dica_pt: "Avise que tem alergia.",
        chaves: ["アレルギー"],
        exemplo_card: "card_138",
      },
      {
        ia: line("からいものはだいじょうぶですか。", "辛[から]いものは大丈夫[だいじょうぶ]ですか。", "Comida apimentada tudo bem?", [
          b("ka.ra.i", "LHL", "apimentado", "adjetivo"),
          b("mo.no", "LH", "coisa", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("da.i.jo.o.bu", "LHHLL", "tudo bem", "adjetivo"),
          DESU,
          KA,
        ]),
        dica_pt: "Diga que não consegue comer.",
        chaves: ["たべられません", "食べられません"],
        exemplo_card: "card_265",
      },
      {
        ia: line("ほかになにかありますか。", "ほかに何[なに]かありますか。", "Mais alguma coisa? (nova: hoka ni = além disso)", [
          b("ho.ka", "LH", "além disso ★ nova", "adverbio"),
          b("ni", "H", "[em]", "particula"),
          b("na.ni.ka", "HLL", "algo", "pergunta"),
          b("a.ri.ma._su", "LHHL", "existe", "verbo"),
          KA,
        ]),
        dica_pt: "Pergunte se dá para pagar com cartão.",
        chaves: ["カード", "はらえます", "払えます"],
        exemplo_card: "card_275",
      },
      {
        ia: line("はい、はらえます。", "はい、払[はら]えます。", "Sim, dá. (fim)", [
          b("ha.i", "HL", "sim", "expressao"),
          b("ha.ra.e.ma._su", "LHHHL", "é possível pagar", "verbo"),
        ]),
      },
    ],
  },

  // ───────────── Ajuda
  {
    id: "rp_pot_ajuda",
    titulo: "Você pode me ajudar?",
    categoria: "social",
    emoji: "📦",
    parceiro: { nome: "Yuki · amiga", emoji: "👩" },
    missao_pt: "A Yuki vai se mudar e precisa de ajuda. Diga que amanhã você não consegue, aceite outro dia e conte que sabe dirigir.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_270", "card_267"],
    system_prompt_cenario: "Amiga pede ajuda para a mudança, propõe sexta-feira e pergunta se você dirige.",
    roteiro: [
      {
        ia: line("あしたこられますか。", "明日[あした]来[こ]られますか。", "Você consegue vir amanhã?", [
          b("a._shi.ta", "LHH", "amanhã", "tempo"),
          b("ko.ra.re.ma._su", "HHHHL", "consegue vir", "verbo"),
          KA,
        ]),
        dica_pt: "Desculpe-se: amanhã não dá.",
        chaves: ["こられません", "来られません"],
        exemplo_card: "card_270",
      },
      {
        ia: line("きんようびはどうですか。", "金曜日[きんようび]はどうですか。", "Que tal sexta-feira?", [
          b("ki.n.yo.o.bi", "LHHLL", "sexta-feira", "tempo"),
          b("wa", "L", "[Tópico]", "particula"),
          b("do.o", "HL", "como", "pergunta"),
          DESU,
          KA,
        ]),
        dica_pt: "Diga que na sexta está tudo bem.",
        chaves: ["だいじょうぶ", "大丈夫"],
        exemplo: line("きんようびはだいじょうぶです。", "金曜日[きんようび]は大丈夫[だいじょうぶ]です。", "Sexta está bom.", [
          b("ki.n.yo.o.bi", "LHHLL", "sexta-feira", "tempo"),
          b("wa", "L", "[contraste]", "particula"),
          b("da.i.jo.o.bu", "LHHLL", "tudo bem", "adjetivo"),
          DESU,
        ]),
      },
      {
        ia: line("くるまのうんてんができますか。", "車[くるま]の運転[うんてん]ができますか。", "Você sabe dirigir?", [
          b("ku.ru.ma", "LHH", "carro", "substantivo"),
          b("no", "H", "[de]", "particula"),
          b("u.n.te.n", "LHHH", "direção", "sujeito"),
          b("ga", "H", "[Foco / sujeito]", "particula"),
          b("de.ki.ma._su", "LHHL", "é possível", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que sabe dirigir.",
        chaves: ["できます", "うんてん", "運転"],
        exemplo_card: "card_267",
      },
      {
        ia: line("じゃあ、きんようびにおねがいします。", "じゃあ、金曜日[きんようび]にお願[ねが]いします。", "Então, sexta-feira, por favor. (fim)", [
          b("ja.a", "HL", "então", "expressao"),
          b("ki.n.yo.o.bi", "LHHLL", "sexta-feira", "tempo"),
          b("ni", "L", "[Momento]", "particula"),
          b("o.ne.ga.i.shi.ma._su", "LHHHHHL", "por favor", "expressao"),
        ]),
      },
    ],
  },
];
