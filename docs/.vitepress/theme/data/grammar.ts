import { parseRuby } from '../utils/ruby'

export interface GrammarEntry {
  /** Muster in Ruby-Syntax; leer = nur im deutschen Register */
  jp: string
  /** Kana-Lesung zum Sortieren und Suchen */
  kana: string
  de: string
  link: string
  page: string
  level: 'N5' | 'N4'
}

const toHiragana = (s: string) => s.replace(/[\u30a1-\u30f6]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))

/** Zeilen `Muster | Deutsch | Anker`, Muster `-` = nur deutsch (Begriff ohne festes Muster) */
function section(page: string, title: string, level: GrammarEntry['level'], block: string): GrammarEntry[] {
  return block
    .trim()
    .split('\n')
    .map((line) => {
      const [jp, de, anchor] = line.split('|').map((s) => s.trim())
      const kana = jp === '-' ? '' : toHiragana(parseRuby(jp).map((s) => s.rt ?? s.text).join('')).replace(/[^\u3041-\u3096ー]/g, '')
      return { jp: jp === '-' ? '' : jp, kana, de, link: `/grammatik/${page}#${anchor}`, page: title, level }
    })
}

// Register aller Grammatikseiten – wächst mit jeder Stufe
export const grammarIndex: GrammarEntry[] = [
  ...section('satzbau', 'Satzbau', 'N5', `
    - | Satzbau: das Verb steht am Ende | verb-am-ende
    - | Wortstellung: frei dank Partikeln | reihenfolge
    - | Thema und Kommentar | thema
    - | Weglassen: was klar ist, fällt weg | weglassen
    - | Relativsatz: Beschreibendes steht vorne | beschreibendes
    〜です・〜でした | ist, war (Nominalsatz) | desu
    〜じゃありません | ist nicht (Nominalsatz) | desu
    〜か | Frage mit か | fragen
  `),
  ...section('partikel', 'Partikel', 'N5', `
    は | Thema – „was … betrifft“ | wa
    が | Subjekt | ga
    を | Objekt (direktes) | o
    に | Ziel, Zeitpunkt, Ort des Seins | ni
    で | Ort der Handlung, Mittel | de
    へ | Richtung – „nach, zu“ | e
    と | und, mit; Zitat | to
    も | auch | mo
    の | Besitz, Verbindung – „von“ | no
    から | von, ab (Ort, Zeit) | kara-made
    まで | bis (Ort, Zeit) | kara-made
    や・〜など | und so weiter, unter anderem | ya
    か | Fragepartikel am Satzende | satzende
    ね | nicht wahr? (Bestätigung) | satzende
    よ | weißt du (neue Information) | satzende
    よね | doch, oder? (Rückversicherung) | satzende
  `),
  ...section('partikel-vergleiche', 'Partikel im Vergleich', 'N5', `
    は・が | Thema oder Subjekt: は oder が? | wa-ga
    に・で | Ort: に oder で? | ni-de
    に・へ | Richtung: に oder へ? | ni-e
    と・や | und: と oder や? | to-ya
    を・が | Objekt: を oder が? | o-ga
  `),
  ...section('fragewoerter', 'Fragewörter & こそあど', 'N5', `
    これ・それ・あれ・どれ | dies, das, jenes, welches | kosoado
    この・その・あの・どの | dieser, jener, welcher (vor Nomen) | kosoado
    ここ・そこ・あそこ・どこ | hier, da, dort, wo | kosoado
    こちら・そちら・あちら・どちら | Richtung; höflich für hier, da, dort | kosoado
    何[なに]・何[なん] | was | fragewoerter
    誰[だれ] | wer | fragewoerter
    いつ | wann | fragewoerter
    どう | wie (Eindruck, Art und Weise) | fragewoerter
    どうして・なぜ | warum | fragewoerter
    いくら | wie viel (Preis) | fragewoerter
    いくつ | wie viele, wie alt | fragewoerter
    どんな | was für ein | fragewoerter
    どのくらい | wie lange, wie viel | fragewoerter
    何時[なんじ]・何人[なんにん] | wie viel Uhr, wie viele Personen | fragewoerter
    誰[だれ]が | Fragewort als Subjekt (が, nie は) | position
    誰[だれ]と・どこで・どこから | Fragewort + Partikel (mit wem, wo, woher …) | position
    何[なに]か・誰[だれ]か・どこか | irgendetwas, irgendwer, irgendwo | ka-mo-demo
    何[なに]も・誰[だれ]も〜ない | nichts, niemand, nirgendwo | ka-mo-demo
    何[なん]でも・誰[だれ]でも | egal was, jeder | ka-mo-demo
  `),
  ...section('existenz', 'Existenz – ある & いる', 'N5', `
    ある | es gibt, sich befinden (Dinge) | aru-iru
    いる | es gibt, sich befinden (Lebewesen) | aru-iru
    〜に〜がある | an einem Ort gibt es … | muster
    〜は〜にある | befindet sich in/an … | muster
    〜がある・〜がいる | haben (Dinge, Personen) | haben
    上[うえ]・下[した]・中[なか]・隣[となり] | Positionswörter: auf, unter, in, neben … | position
  `),
  ...section('verben', 'Verben', 'N5', `
    - | Verbgruppen: う-Verben, る-Verben, unregelmäßige | gruppen
    する・来[く]る | unregelmäßige Verben | gruppen
    〜ます | Höflichkeitsform der Verben (ます-Form) | masu
    〜ました・〜ません・〜ませんでした | Vergangenheit und Verneinung, höflich | masu
    〜て | Verbindungsform (て-Form) | te-form
    - | Wörterbuchform (Grundform) | nai-form
    〜ない | Verneinung, einfach (ない-Form) | nai-form
    〜た | Vergangenheit, einfach (た-Form) | ta-form
    - | Formenübersicht: ein Verb, alle Formen | uebersicht
  `),
  ...section('adjektive', 'Adjektive', 'N5', `
    〜い | Adjektive auf い (い-Adjektive) | i-adjektive
    〜くない・〜かった | Adjektiv verneinen, Vergangenheit (い-Adjektive) | i-adjektive
    〜な | Adjektive mit な (な-Adjektive) | na-adjektive
    きれい・嫌[きら]い | getarnte な-Adjektive | getarnte
    〜く・〜に | Adverb aus einem Adjektiv | adjektive-als-adverbien
    〜くて・〜で | Adjektive verbinden – „und“ | verbinden
  `),
  ...section('verneinung', 'Verneinung', 'N5', `
    〜ない・〜じゃない | Verneinung aller Wortarten | uebersicht
    〜くありません・〜ではありません | Verneinung, förmlich | uebersicht
    いい → よくない | gut → nicht gut (Sonderfall) | sonderfaelle
    ある → ない | es gibt nicht (Sonderfall) | sonderfaelle
    あまり〜ない | nicht besonders, kaum | adverbien
    全然[ぜんぜん]〜ない | überhaupt nicht | adverbien
    まだ〜ていない | noch nicht | adverbien
    もう〜ない | nicht mehr | adverbien
    一度[いちど]も〜ない | noch nie | adverbien
    しか〜ない | nur, nichts außer | adverbien
    だけ | nur | adverbien
    はい・いいえ | Ja und Nein auf verneinte Fragen | ja-nein
    〜ないでください | bitte nicht … | naide
    〜ないで | ohne zu … | naide
  `),
  ...section('zeitformen', 'Zeitformen & Aspekt', 'N5', `
    〜ます・〜る | Gegenwart und Zukunft (Nichtvergangenheit) | zeitstufen
    〜ました・〜た | Vergangenheit | zeitstufen
    〜ている | Verlauf, Zustand, Gewohnheit – „gerade“ | te-iru
    もう | schon | mou-mada
    まだ | noch | mou-mada
  `),
  ...section('konjunktionen', 'Sätze verbinden', 'N5', `
    〜て、〜 | und (dann) – て-Kette | te-kette
    〜てから | nachdem, erst … dann | te-kara
    〜前[まえ]に | bevor | mae-ato
    〜後[あと]で | nachdem | mae-ato
    から | weil | kara
    が・けど | aber (im Satz) | ga-kedo
    〜たり〜たりする | unter anderem … und … | tari
    とき | als, wenn | toki
    そして | und (am Satzanfang) | satzanfaenge
    それから | danach, außerdem | satzanfaenge
    でも | aber (am Satzanfang) | satzanfaenge
  `),
  ...section('bitten', 'Bitten, Wünsche & Vorschläge', 'N5', `
    〜をください | bitte (um eine Sache) | wo-kudasai
    〜をお願[ねが]いします | bitte (höflich) | wo-kudasai
    〜てください | bitte tu … | te-kudasai
    〜ていただけませんか | bitte, sehr höflich | te-kudasai
    〜たい | wollen (etwas tun) | wuensche
    ほしい | haben wollen | wuensche
    いかがですか | wie wäre es mit …? (Angebot) | wuensche
    〜ましょう | lass uns … | vorschlaege
    〜ませんか | Einladung – „wollen wir nicht …?“ | vorschlaege
    〜ましょうか | soll ich …? sollen wir …? | vorschlaege
    ちょっと… | absagen, höflich | vorschlaege
  `),
  ...section('erlaubnis', 'Dürfen, müssen, nicht dürfen', 'N5', `
    〜てもいい | dürfen | temoii
    〜でもいい・〜くてもいい | auch … ist in Ordnung | temoii
    〜てはいけない | nicht dürfen | tewaikenai
    〜なければならない・〜なければいけない | müssen | nakereba
    〜なくてもいい | nicht müssen | nakutemo
  `),
  ...section('vergleiche', 'Vergleiche', 'N5', `
    より | als (Vergleich) | yori
    どちら | welches von beiden | hou
    〜のほうが | … ist mehr (von zweien) | hou
    一番[いちばん] | am meisten (Superlativ) | ichiban
    〜の中[なか]で | unter allen … | ichiban
    同[おな]じ・同[おな]じくらい | gleich, genauso | onaji
    違[ちが]う | anders, verschieden | onaji
    〜ほど〜ない | nicht so … wie | hodo
    ずっと・もっと | viel, noch (beim Vergleich) | hodo
  `),
  ...section('adverbien', 'Adverbien & Häufigkeit', 'N5', `
    いつも・よく・時々[ときどき] | Häufigkeit: immer, oft, manchmal | haeufigkeit
    毎[まい]〜 | jeden (Tag, Woche …) | haeufigkeit
    〜回[かい] | … mal | haeufigkeit
    とても・すごく | sehr | grad
    少[すこ]し・ちょっと | ein bisschen | grad
    もっと | mehr | grad
    すぐ | sofort, gleich | weitere
    後[あと]で | später | weitere
    先[さき]に | zuerst, schon mal | weitere
    また | wieder | weitere
    ずっと | die ganze Zeit | weitere
    一緒[いっしょ]に | zusammen | weitere
    - | Stellung des Adverbs | stellung
  `),
  ...section('vermutung', 'Vermutung – でしょう', 'N5', `
    でしょう | wohl, vermutlich | bildung
    だろう | wohl (einfache Form) | darou
    たぶん | wahrscheinlich | sicherheit
    きっと | bestimmt | sicherheit
    でしょう？ | nicht wahr? (Nachfrage) | nachfrage
    でしょうか | höfliche Frage | deshouka
  `),
  ...section('hoeflichkeit', 'Höflichkeit & Keigo', 'N4', `
    - | Sprachebenen: einfach, höflich, Keigo | ebenen
    尊敬語[そんけいご] | ehrerbietende Sprache (Sonkeigo) | ebenen
    謙譲語[けんじょうご] | bescheidene Sprache (Kenjōgo) | ebenen
    いらっしゃる | sein, gehen, kommen (ehrerbietend) | keigo-verben
    おっしゃる | sagen (ehrerbietend) | keigo-verben
    召[め]し上[あ]がる | essen, trinken (ehrerbietend) | keigo-verben
    申[もう]す | sagen, heißen (bescheiden) | keigo-verben
    参[まい]る | gehen, kommen (bescheiden) | keigo-verben
    いただく | essen; bekommen (bescheiden) | keigo-verben
    〜さん・〜様[さま] | Anrede: Herr, Frau | anreden
    ウチ・ソト | innen und außen (Uchi und Soto) | uchi-soto
    お〜・ご〜 | Höflichkeitspräfix お / ご | praefixe
  `)
]
