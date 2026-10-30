import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 30 (Descrever coisas e pessoas): a bolsa perdida na estação, as pessoas em uma festa e a
 * cidade onde você mora. Usam as frases de `cards-descrever.ts` como resposta-modelo. ★ nova = palavra nova.
 */

const DESU = b("de._su", "LL", "é", "copula");
const KA = b("ka", "L", "[?]", "particula");
const NANI = b("na.ni", "HL", "o quê", "pergunta");
const GA = b("ga", "L", "[Foco / sujeito]", "particula");
const O = b("o", "L", "[Objeto]", "particula");

export const cenariosDescrever: SeedScenario[] = [
  // ───────────── Achados e perdidos
  {
    id: "rp_des_achados",
    titulo: "Perdi minha bolsa",
    categoria: "cidade",
    emoji: "👜",
    parceiro: { nome: "Funcionário da estação", emoji: "🧑‍✈️" },
    missao_pt: "Você perdeu uma bolsa na estação. Diga o que perdeu, descreva como ela é e conte o que tem dentro.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_334"],
    system_prompt_cenario: "Funcionário dos achados e perdidos pergunta o que foi perdido, como é e o que tem dentro.",
    roteiro: [
      {
        ia: line("なにをなくしましたか。", "何[なに]をなくしましたか。", "O que você perdeu?", [
          NANI,
          O,
          b("na.ku.shi.ma._shi.ta", "LHHHLL", "perdeu", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que perdeu a bolsa.",
        chaves: ["かばん", "なくしました"],
        exemplo: line("かばんをなくしました。", "かばんをなくしました。", "Perdi minha bolsa.", [
          b("ka.ba.n", "LHH", "bolsa", "objeto"),
          b("o", "H", "[Objeto]", "particula"),
          b("na.ku.shi.ma._shi.ta", "LHHHLL", "perdi", "verbo"),
        ]),
      },
      {
        ia: line("どんなかばんですか。", "どんなかばんですか。", "Que tipo de bolsa é?", [
          b("do.n.na", "HLL", "que tipo de", "pergunta"),
          b("ka.ba.n", "LHH", "bolsa", "substantivo"),
          b("de._su", "HL", "é", "copula"),
          KA,
        ]),
        dica_pt: "Diga que é preta e grande.",
        chaves: ["くろくて", "黒くて", "おおきい", "大きい"],
        exemplo_card: "card_334",
      },
      {
        ia: line("なかになにがありますか。", "中[なか]に何[なに]がありますか。", "O que tem dentro?", [
          b("na.ka", "HL", "dentro", "lugar"),
          b("ni", "L", "[Lugar]", "particula"),
          NANI,
          GA,
          b("a.ri.ma._su", "LHHL", "existe", "verbo"),
          KA,
        ]),
        dica_pt: "Diga: o livro que comprei ontem.",
        chaves: ["きのう", "昨日", "ほん", "本"],
        exemplo: line("きのうかったほんがあります。", "昨日[きのう]買[か]った本[ほん]があります。", "Tem o livro que comprei ontem.", [
          b("ki.no.o", "LHL", "ontem", "tempo"),
          b("ka.t.ta", "LLL", "comprei (forma -ta)", "verbo"),
          b("ho.n", "HL", "livro", "sujeito"),
          GA,
          b("a.ri.ma._su", "LHHL", "existe", "verbo"),
        ]),
      },
      {
        ia: line("ちょっとまってください。", "ちょっと待[ま]ってください。", "Espere um pouco, por favor. (fim)", [
          b("cho.t.to", "HLL", "um pouco", "adverbio"),
          b("ma.t.te", "HLL", "esperar (forma -te)", "verbo"),
          b("ku.da.sa.i", "LLLL", "por favor", "verbo"),
        ]),
      },
    ],
  },

  // ───────────── Pessoas na festa
  {
    id: "rp_des_festa",
    titulo: "Quem é quem?",
    categoria: "trabalho",
    emoji: "🥂",
    parceiro: { nome: "Yuki · amiga", emoji: "👩" },
    missao_pt: "Na festa da empresa, a Yuki quer conhecer as pessoas. Mostre quem é o gerente, diga como ele é e conte que tem um amigo que fala japonês.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_322", "card_331", "card_323"],
    system_prompt_cenario: "Amiga em uma festa pergunta quem é o gerente, como é a pessoa e se alguém ali fala japonês.",
    roteiro: [
      {
        ia: line("ぶちょうはどのひとですか。", "部長[ぶちょう]はどの人[ひと]ですか。", "Qual dessas pessoas é o gerente?", [
          b("bu.cho.o", "LHH", "gerente", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          b("do.no", "HL", "qual", "pergunta"),
          b("hi.to", "LL", "pessoa", "substantivo"),
          DESU,
          KA,
        ]),
        dica_pt: "Diga: quem está de óculos.",
        chaves: ["めがね", "眼鏡", "ひと", "人"],
        exemplo_card: "card_322",
      },
      {
        ia: line("どんなひとですか。", "どんな人[ひと]ですか。", "Que tipo de pessoa é?", [
          b("do.n.na", "HLL", "que tipo de", "pergunta"),
          b("hi.to", "LH", "pessoa", "substantivo"),
          b("de._su", "HL", "é", "copula"),
          KA,
        ]),
        dica_pt: "Diga que é gentil e divertido.",
        chaves: ["やさしくて", "おもしろい"],
        exemplo_card: "card_331",
      },
      {
        ia: line("にほんごがはなせるひとはいますか。", "日本語[にほんご]が話[はな]せる人[ひと]はいますか。", "Tem alguém que fale japonês?", [
          b("ni.ho.n.go", "LHHH", "japonês", "sujeito"),
          b("ga", "H", "[Foco / sujeito]", "particula"),
          b("ha.na.se.ru", "LHHL", "consegue falar", "verbo"),
          b("hi.to", "LH", "pessoa", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("i.ma._su", "LHL", "existe (pessoa)", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que tem um amigo que fala.",
        chaves: ["ともだち", "友達", "はなせる", "話せる"],
        exemplo_card: "card_323",
      },
      {
        ia: line("いいですね。", "いいですね。", "Que bom! (fim)", [b("i.i", "HL", "bom", "adjetivo"), DESU, b("ne", "L", "[né]", "particula")]),
      },
    ],
  },

  // ───────────── Minha cidade
  {
    id: "rp_des_cidade",
    titulo: "Como é a sua cidade?",
    categoria: "social",
    emoji: "🏘️",
    parceiro: { nome: "Sato-san · conhecido", emoji: "🧑" },
    missao_pt: "Um conhecido quer saber da sua cidade. Descreva como ela é, indique um lugar barato e gostoso e diga o que você come lá.",
    nivel: 3,
    vocabulario_requerido_ids: ["card_332", "card_335"],
    system_prompt_cenario: "Conhecido simpático pergunta como é a cidade, se há um lugar para indicar e o que se come lá.",
    roteiro: [
      {
        ia: line("どんなまちですか。", "どんな町[まち]ですか。", "Que tipo de cidade é?", [
          b("do.n.na", "HLL", "que tipo de", "pergunta"),
          b("ma.chi", "LH", "cidade", "substantivo"),
          DESU,
          KA,
        ]),
        dica_pt: "Diga que é tranquila e bonita.",
        chaves: ["しずかで", "静かで", "きれい"],
        exemplo_card: "card_332",
      },
      {
        ia: line("おすすめのみせはありますか。", "おすすめの店[みせ]はありますか。", "Tem algum lugar que você recomenda?", [
          b("o.su.su.me", "LHHH", "recomendação", "substantivo"),
          b("no", "H", "[de]", "particula"),
          b("mi.se", "LH", "lugar, loja", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("a.ri.ma._su", "LHHL", "existe", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que tem um lugar barato e gostoso.",
        chaves: ["やすくて", "安くて", "おいしい"],
        exemplo: line("やすくておいしいみせがあります。", "安[やす]くておいしい店[みせ]があります。", "Tem um lugar barato e gostoso.", [
          b("ya.su._ku.te", "HLLL", "barato, e", "adjetivo"),
          b("o.i.shi.i", "LHHH", "gostoso", "adjetivo"),
          b("mi.se", "LH", "lugar, loja", "sujeito"),
          GA,
          b("a.ri.ma._su", "LHHL", "existe", "verbo"),
        ]),
      },
      {
        ia: line("そこでなにをたべますか。", "そこで何[なに]を食[た]べますか。", "O que você come lá?", [
          b("so.ko", "LH", "lá", "lugar"),
          b("de", "H", "[Local da ação]", "particula"),
          NANI,
          O,
          b("ta.be.ma._su", "LHHL", "come", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que come ramen.",
        chaves: ["ラーメン", "たべます", "食べます"],
        exemplo: line("ラーメンをたべます。", "ラーメンを食[た]べます。", "Como ramen.", [
          b("ra.a.me.n", "HLLL", "ramen", "objeto"),
          O,
          b("ta.be.ma._su", "LHHL", "como", "verbo"),
        ]),
      },
      {
        ia: line("いいですね。いきましょう。", "いいですね。行[い]きましょう。", "Que bom! Vamos lá. (fim)", [
          b("i.i", "HL", "bom", "adjetivo"),
          DESU,
          b("ne", "L", "[né]", "particula"),
          b("i.ki.ma.sho.o", "LHHHL", "vamos", "verbo"),
        ]),
      },
    ],
  },
];
