import { seedCards } from "./cards";
import { b, line } from "./helpers";
import type { SeedScenario } from "./scenarios";

/**
 * Missões da unidade 43 (Vida no Japão): alugar um apartamento, resolver o endereço na prefeitura e ir à clínica.
 * Usam as frases de `cards-vida-japao.ts` como resposta-modelo. ★ nova = palavra nova.
 */

/** Uma frase do baralho como fala do parceiro. */
function fala(id: string, pt?: string) {
  const c = seedCards.find((x) => x.id === id)!;
  return line(`${c.kana}。`, `${c.kanji}。`, pt ?? c.traducao, c.blocos);
}

const KA = b("ka", "L", "[?]", "particula");
const ARIMASUKA = [b("a.ri.ma._su", "LHHL", "existe", "verbo"), KA];

export const cenariosVidaJapao: SeedScenario[] = [
  // ───────────── Apartamento
  {
    id: "rp_vid_apartamento",
    titulo: "Procurar apartamento",
    categoria: "cidade",
    emoji: "🏠",
    parceiro: { nome: "Fujita-san · imobiliária", emoji: "🧑‍💼" },
    missao_pt: "Você precisa alugar um apartamento. Diga o que procura, pergunte sobre as taxas e combine a visita.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_579", "card_582"],
    system_prompt_cenario: "Corretor recebe o cliente, pergunta o tipo de apartamento, diz o aluguel e oferece a visita.",
    roteiro: [
      {
        ia: line("いらっしゃいませ。", "いらっしゃいませ。", "Seja bem-vindo.", [b("i.ra.s.sha.i.ma.se", "LHHHHHL", "bem-vindo", "expressao")]),
        dica_pt: "Diga que está procurando um apartamento.",
        chaves: ["へや", "部屋", "さがして", "探して"],
        exemplo_card: "card_579",
      },
      {
        ia: line("どんなへやがいいですか。", "どんな部屋[へや]がいいですか。", "Que tipo de apartamento você prefere?", [
          b("do.n.na", "HLL", "que tipo de", "pergunta"),
          b("he.ya", "LL", "apartamento", "sujeito"),
          b("ga", "L", "[Foco / sujeito]", "particula"),
          b("i.i", "HL", "bom", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
          KA,
        ]),
        dica_pt: "Diga que prefere um perto da estação.",
        chaves: ["えき", "駅", "ちかい", "近い"],
        exemplo: line("えきからちかいへやがいいです。", "駅[えき]から近[ちか]い部屋[へや]がいいです。", "Prefiro um apartamento perto da estação.", [
          b("e.ki", "HL", "estação", "lugar"),
          b("ka.ra", "LL", "a partir de", "particula"),
          b("chi.ka.i", "LHL", "perto", "adjetivo"),
          b("he.ya", "LH", "apartamento", "sujeito"),
          b("ga", "L", "[Foco / sujeito]", "particula"),
          b("i.i", "HL", "bom", "adjetivo"),
          b("de._su", "LL", "é", "copula"),
        ]),
      },
      {
        ia: line("やちんははちまんえんです。", "家賃[やちん]は八万円[はちまんえん]です。", "O aluguel é de 80 mil ienes.", [
          b("ya.chi.n", "HLL", "aluguel", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          b("ha.chi.ma.n.e.n", "LHHHHH", "80 mil ienes", "substantivo"),
          b("de._su", "HL", "é", "copula"),
        ]),
        dica_pt: "Pergunte se tem caução e luvas.",
        chaves: ["しききん", "敷金", "れいきん", "礼金"],
        exemplo_card: "card_582",
      },
      {
        ia: line("みにいきますか。", "見[み]に行[い]きますか。", "Quer ir ver?", [
          b("mi", "H", "ver", "verbo"),
          b("ni", "L", "[finalidade]", "particula"),
          b("i.ki.ma._su", "LHHL", "vai", "verbo"),
          KA,
        ]),
        dica_pt: "Aceite com educação.",
        chaves: ["はい", "おねがい", "お願い"],
        exemplo: line("はい、おねがいします。", "はい、お願[ねが]いします。", "Sim, por favor.", [
          b("ha.i", "HL", "sim", "expressao"),
          b("o.ne.ga.i", "LHHH", "pedido", "expressao"),
          b("_shi.ma._su", "HHL", "faço", "verbo"),
        ]),
      },
      {
        ia: line("わかりました。", "わかりました。", "Certo. (fim)", [b("wa.ka.ri.ma._shi.ta", "LHHHLL", "entendi", "verbo")]),
      },
    ],
  },

  // ───────────── Prefeitura
  {
    id: "rp_vid_prefeitura",
    titulo: "Na prefeitura",
    categoria: "cidade",
    emoji: "🏛️",
    parceiro: { nome: "Yoshida-san · prefeitura", emoji: "🧑‍💼" },
    missao_pt: "Você se mudou e precisa atualizar o endereço. Explique o caso, entregue o documento e tire a sua dúvida.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_588", "card_592"],
    system_prompt_cenario: "Funcionário chama o próximo, pede o cartão de residência, entrega o formulário e responde sobre o carimbo.",
    roteiro: [
      {
        ia: line("つぎのかた、どうぞ。", "次[つぎ]の方[かた]、どうぞ。", "Próximo, por favor.", [
          b("tsu.gi", "LH", "próximo", "substantivo"),
          b("no", "L", "[de]", "particula"),
          b("ka.ta", "HL", "pessoa (educado)", "substantivo"),
          b("do.o.zo", "HLL", "por favor", "expressao"),
        ]),
        dica_pt: "Diga que o seu endereço mudou.",
        chaves: ["じゅうしょ", "住所"],
        exemplo_card: "card_588",
      },
      {
        ia: line("ざいりゅうカードをみせてください。", "在留[ざいりゅう]カードを見[み]せてください。", "Mostre o cartão de residência, por favor. (nova: zairyuu kaado = cartão de residência)", [
          b("za.i.ryu.u.ka.a.do", "LHHHHLL", "cartão de residência ★ nova", "objeto"),
          b("o", "L", "[Objeto]", "particula"),
          b("mi.se.te", "HLL", "mostrar (forma -te)", "verbo"),
          b("ku.da.sa.i", "LLLL", "por favor", "verbo"),
        ]),
        dica_pt: "Entregue o cartão.",
        chaves: ["はい", "どうぞ"],
        exemplo_card: "card_072",
      },
      { ia: fala("card_590"), dica_pt: "Pergunte se precisa de carimbo.", chaves: ["はんこ", "ひつよう", "必要"], exemplo_card: "card_592" },
      {
        ia: line("いいえ、いりません。", "いいえ、いりません。", "Não, não precisa. (fim)", [
          b("i.i.e", "LHH", "não", "expressao"),
          b("i.ri.ma.se.n", "LHHHL", "não precisa", "verbo"),
        ]),
      },
    ],
  },

  // ───────────── Clínica
  {
    id: "rp_vid_clinica",
    titulo: "Na clínica",
    categoria: "cidade",
    emoji: "🏥",
    parceiro: { nome: "Dra. Ogawa", emoji: "👩‍⚕️" },
    missao_pt: "Você está doente. Diga desde quando tem febre, avise do cartão do seguro e da sua alergia.",
    nivel: 4,
    vocabulario_requerido_ids: ["card_595", "card_593", "card_596"],
    system_prompt_cenario: "Médica pergunta o que houve, pede o cartão do seguro, pergunta sobre alergias e deseja melhoras.",
    roteiro: [
      {
        ia: line("きょうはどうしましたか。", "今日[きょう]はどうしましたか。", "O que houve hoje?", [
          b("kyo.o", "HL", "hoje", "tempo"),
          b("wa", "L", "[Tópico]", "particula"),
          b("do.o", "HL", "como", "pergunta"),
          b("_shi.ma._shi.ta", "LLLL", "fez", "verbo"),
          KA,
        ]),
        dica_pt: "Diga que está com febre há três dias.",
        chaves: ["ねつ", "熱", "みっか", "三日"],
        exemplo_card: "card_595",
      },
      {
        ia: line("ほけんしょうはありますか。", "保険証[ほけんしょう]はありますか。", "Você tem o cartão do seguro?", [
          b("ho.ke.n.sho.o", "LHHHH", "cartão do seguro", "topico"),
          b("wa", "H", "[Tópico]", "particula"),
          ...ARIMASUKA,
        ]),
        dica_pt: "Diga que esqueceu.",
        chaves: ["わすれました", "忘れました"],
        exemplo_card: "card_593",
      },
      {
        ia: line("アレルギーはありますか。", "アレルギーはありますか。", "Você tem alguma alergia?", [
          b("a.re.ru.gi.i", "LHLLL", "alergia", "topico"),
          b("wa", "L", "[Tópico]", "particula"),
          ...ARIMASUKA,
        ]),
        dica_pt: "Diga que tem alergia a remédio.",
        chaves: ["くすり", "薬", "アレルギー"],
        exemplo_card: "card_596",
      },
      { ia: line("おだいじに。", "お大事[だいじ]に。", "Melhoras! (fim)", [b("o.da.i.ji.ni", "LHHHH", "melhoras", "expressao")]) },
    ],
  },
];
