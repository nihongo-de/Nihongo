export type KanaSet = 'basic' | 'dakuten' | 'yoon' | 'extended'

// [Kana in Hiragana, Rōmaji]; null = leeres Feld im Raster
type Cell = [string, string] | null

interface KanaTable {
  label: string
  columns: number
  rows: Cell[][]
}

const r = (s: string): Cell[] =>
  s.split(' ').map((pair) => {
    if (pair === '-') return null
    const [kana, romaji] = pair.split(':')
    return [kana, romaji]
  })

export const kanaSets: Record<KanaSet, KanaTable> = {
  basic: {
    label: 'Grundzeichen (Gojūon)',
    columns: 5,
    rows: [
      r('あ:a い:i う:u え:e お:o'),
      r('か:ka き:ki く:ku け:ke こ:ko'),
      r('さ:sa し:shi す:su せ:se そ:so'),
      r('た:ta ち:chi つ:tsu て:te と:to'),
      r('な:na に:ni ぬ:nu ね:ne の:no'),
      r('は:ha ひ:hi ふ:fu へ:he ほ:ho'),
      r('ま:ma み:mi む:mu め:me も:mo'),
      r('や:ya - ゆ:yu - よ:yo'),
      r('ら:ra り:ri る:ru れ:re ろ:ro'),
      r('わ:wa - - - を:o'),
      r('ん:n - - - -')
    ]
  },
  dakuten: {
    label: 'Mit Dakuten ゛ und Handakuten ゜',
    columns: 5,
    rows: [
      r('が:ga ぎ:gi ぐ:gu げ:ge ご:go'),
      r('ざ:za じ:ji ず:zu ぜ:ze ぞ:zo'),
      r('だ:da ぢ:ji づ:zu で:de ど:do'),
      r('ば:ba び:bi ぶ:bu べ:be ぼ:bo'),
      r('ぱ:pa ぴ:pi ぷ:pu ぺ:pe ぽ:po')
    ]
  },
  yoon: {
    label: 'Yōon – Kombinationen mit kleinem ゃ ゅ ょ',
    columns: 3,
    rows: [
      r('きゃ:kya きゅ:kyu きょ:kyo'),
      r('しゃ:sha しゅ:shu しょ:sho'),
      r('ちゃ:cha ちゅ:chu ちょ:cho'),
      r('にゃ:nya にゅ:nyu にょ:nyo'),
      r('ひゃ:hya ひゅ:hyu ひょ:hyo'),
      r('みゃ:mya みゅ:myu みょ:myo'),
      r('りゃ:rya りゅ:ryu りょ:ryo'),
      r('ぎゃ:gya ぎゅ:gyu ぎょ:gyo'),
      r('じゃ:ja じゅ:ju じょ:jo'),
      r('びゃ:bya びゅ:byu びょ:byo'),
      r('ぴゃ:pya ぴゅ:pyu ぴょ:pyo')
    ]
  },
  extended: {
    label: 'Erweiterte Katakana für Fremdlaute',
    columns: 5,
    rows: [
      r('ファ:fa フィ:fi - フェ:fe フォ:fo'),
      r('ヴァ:va ヴィ:vi ヴ:vu ヴェ:ve ヴォ:vo'),
      r('- ウィ:wi - ウェ:we ウォ:wo'),
      r('- ティ:ti トゥ:tu - -'),
      r('- ディ:di ドゥ:du - -'),
      r('ツァ:tsa - - ツェ:tse ツォ:tso'),
      r('- - - シェ:she -'),
      r('- - - ジェ:je -'),
      r('- - - チェ:che -')
    ]
  }
}

// Hiragana und Katakana liegen in Unicode genau 0x60 auseinander.
export function toKatakana(text: string): string {
  return text.replace(/[\u3041-\u3096]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0x60))
}

export interface KanaWord {
  kana: string
  romaji: string[]
  kanji?: string
  de: string
}

// Wörter mit っ, Langvokalen, ん und Sonderkombinationen; je Zeile: kana | romaji/alternative | Kanji oder - | Bedeutung
const w = (s: string): KanaWord[] =>
  s
    .trim()
    .split('\n')
    .map((line) => {
      const [kana, romaji, kanji, de] = line.split('|').map((x) => x.trim())
      return { kana, romaji: romaji.split('/'), kanji: kanji === '-' ? undefined : kanji, de }
    })

export const kanaWords: Record<'hiragana' | 'katakana', KanaWord[]> = {
  hiragana: w(`
    きって | kitte | 切手 | Briefmarke
    がっこう | gakkō | 学校 | Schule
    ざっし | zasshi | 雑誌 | Zeitschrift
    きっぷ | kippu | 切符 | Fahrkarte
    いっしょ | issho | 一緒 | zusammen
    ちょっと | chotto | - | ein bisschen
    おかあさん | okāsan | お母さん | Mutter
    おにいさん | onīsan | お兄さん | älterer Bruder
    おおきい | ōkii | 大きい | groß
    とうきょう | tōkyō | 東京 | Tokio
    ぎゅうにゅう | gyūnyū | 牛乳 | Milch
    りょこう | ryokō | 旅行 | Reise
    びょういん | byōin | 病院 | Krankenhaus
    びよういん | biyōin | 美容院 | Friseursalon
    せんせい | sensei | 先生 | Lehrer(in)
    しんぶん | shinbun/shimbun | 新聞 | Zeitung
    さんぽ | sanpo/sampo | 散歩 | Spaziergang
    きんようび | kin’yōbi | 金曜日 | Freitag
    にっぽん | nippon | 日本 | Japan
    はなぢ | hanaji/hanadi/hanadji | 鼻血 | Nasenbluten
    つづく | tsuzuku/tsuduku/tsudzuku | 続く | weitergehen, andauern
  `),
  katakana: w(`
    コーヒー | kōhī | - | Kaffee
    ケーキ | kēki | - | Kuchen
    ビール | bīru | - | Bier
    ベッド | beddo | - | Bett
    サッカー | sakkā | - | Fußball
    ジュース | jūsu | - | Saft
    チョコレート | chokorēto | - | Schokolade
    コンピューター | konpyūtā/kompyūtā | - | Computer
    パーティー | pātī | - | Party
    フォーク | fōku | - | Gabel
    ウェブ | webu | - | Web
    メール | mēru | - | E-Mail
    ティッシュ | tisshu | - | Taschentuch
    シェフ | shefu | - | Küchenchef(in)
    ドイツ | doitsu | - | Deutschland
    ミュンヘン | myunhen | - | München
    チェック | chekku | - | Kontrolle, Check
    ディズニー | dizunī | - | Disney
    ヴァイオリン | vaiorin/baiorin | - | Geige
  `)
}
