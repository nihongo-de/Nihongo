/** Zahl + Zählwort (bzw. Zeiteinheit); n = null steht für 何 */
export interface NumberWord {
  /** Wird an die Zahl gehängt: 本, つ, 時 … */
  id: string
  label: string
  hint: string
  de(n: number | null): string
  /** Lesung in Hiragana, Alternativen mit „/“, null = gibt es nicht */
  reading(n: number | null): string | null
  rule: string
}

/** 11 Einträge: 1–10 und 何, „-“ = gibt es nicht */
const table = (list: string) => {
  const r = list.split(' ')
  return (n: number | null) => {
    const v = n === null ? r[10] : r[n - 1]
    return v && v !== '-' ? v : null
  }
}

const de = (one: string, many: string, q: string) => (n: number | null) =>
  n === null ? q : n === 1 ? one : many.replace('#', String(n))

export const countersN5: NumberWord[] = [
  {
    id: 'つ',
    label: '〜つ',
    hint: 'Allzweck, nur 1–10',
    de: de('ein Ding', '# Dinge', ''),
    reading: table('ひとつ ふたつ みっつ よっつ いつつ むっつ ななつ やっつ ここのつ とお -'),
    rule: 'Japanische Zahlwörter: ひと・ふた・みっ・よっ・いつ・むっ・なな・やっ・ここの + つ; 10 = とお (ohne つ). Gefragt wird mit いくつ'
  },
  {
    id: '人',
    label: '〜人',
    hint: 'Personen',
    de: de('eine Person', '# Personen', 'Wie viele Personen?'),
    reading: table('ひとり ふたり さんにん よにん ごにん ろくにん しちにん/ななにん はちにん きゅうにん/くにん じゅうにん なんにん'),
    rule: '1 und 2 sind Sonderformen (ひとり・ふたり), ab 3 Zahl + にん – aber 4 = よにん'
  },
  {
    id: '本',
    label: '〜本',
    hint: 'lang & dünn: Stifte, Flaschen, Bäume',
    de: de('ein Stift', '# Stifte', 'Wie viele Stifte?'),
    reading: table('いっぽん にほん さんぼん よんほん ごほん ろっぽん ななほん はっぽん/はちほん きゅうほん じゅっぽん/じっぽん なんぼん'),
    rule: '1, 6, 8, 10 → っぽん · 3 und 何 → ぼん · sonst ほん'
  },
  {
    id: '枚',
    label: '〜枚',
    hint: 'flach: Papier, Hemden, Tickets',
    de: de('ein Blatt Papier', '# Blatt Papier', 'Wie viele Blatt?'),
    reading: table('いちまい にまい さんまい よんまい ごまい ろくまい ななまい/しちまい はちまい きゅうまい じゅうまい なんまい'),
    rule: 'regelmäßig: Zahl + まい (4 = よん, 7 = なな, 9 = きゅう)'
  },
  {
    id: '匹',
    label: '〜匹',
    hint: 'kleine Tiere: Katzen, Hunde, Fische',
    de: de('eine Katze', '# Katzen', 'Wie viele Katzen?'),
    reading: table('いっぴき にひき さんびき よんひき ごひき ろっぴき ななひき はっぴき/はちひき きゅうひき じゅっぴき/じっぴき なんびき'),
    rule: '1, 6, 8, 10 → っぴき · 3 und 何 → びき · sonst ひき'
  },
  {
    id: '個',
    label: '〜個',
    hint: 'kleine, runde Dinge: Äpfel, Eier',
    de: de('ein Apfel', '# Äpfel', 'Wie viele Äpfel?'),
    reading: table('いっこ にこ さんこ よんこ ごこ ろっこ ななこ はっこ/はちこ きゅうこ じゅっこ/じっこ なんこ'),
    rule: '1, 6, 8, 10 → っこ · sonst こ (auch nach 3: さんこ)'
  },
  {
    id: '冊',
    label: '〜冊',
    hint: 'Bücher, Hefte',
    de: de('ein Buch', '# Bücher', 'Wie viele Bücher?'),
    reading: table('いっさつ にさつ さんさつ よんさつ ごさつ ろくさつ ななさつ はっさつ きゅうさつ じゅっさつ/じっさつ なんさつ'),
    rule: '1, 8, 10 → っさつ · sonst さつ (auch ろくさつ und さんさつ)'
  },
  {
    id: '杯',
    label: '〜杯',
    hint: 'Getränke: Tassen, Gläser, Schalen',
    de: de('eine Tasse', '# Tassen', 'Wie viele Tassen?'),
    reading: table('いっぱい にはい さんばい よんはい ごはい ろっぱい ななはい はっぱい/はちはい きゅうはい じゅっぱい/じっぱい なんばい'),
    rule: '1, 6, 8, 10 → っぱい · 3 und 何 → ばい · sonst はい'
  },
  {
    id: '台',
    label: '〜台',
    hint: 'Maschinen, Fahrzeuge',
    de: de('ein Auto', '# Autos', 'Wie viele Autos?'),
    reading: table('いちだい にだい さんだい よんだい ごだい ろくだい ななだい はちだい きゅうだい じゅうだい なんだい'),
    rule: 'regelmäßig: Zahl + だい (4 = よん, 7 = なな, 9 = きゅう)'
  },
  {
    id: '歳',
    label: '〜歳',
    hint: 'Alter',
    de: de('ein Jahr alt', '# Jahre alt', 'Wie alt?'),
    reading: table('いっさい にさい さんさい よんさい ごさい ろくさい ななさい はっさい きゅうさい じゅっさい/じっさい なんさい'),
    rule: '1, 8, 10 → っさい · sonst さい (Sonderform: 20 Jahre = はたち)'
  },
  {
    id: '回',
    label: '〜回',
    hint: 'Male: einmal, zweimal …',
    de: de('einmal', '#-mal', 'Wie oft?'),
    reading: table('いっかい にかい さんかい よんかい ごかい ろっかい ななかい はっかい/はちかい きゅうかい じゅっかい/じっかい なんかい'),
    rule: '1, 6, 8, 10 → っかい · sonst かい'
  },
  {
    id: '階',
    label: '〜階',
    hint: 'Stockwerke, 1階 = Erdgeschoss',
    de: (n) => (n === null ? 'Welches Stockwerk?' : n === 1 ? 'Erdgeschoss' : `${n - 1}. Stock`),
    reading: table('いっかい にかい さんがい/さんかい よんかい ごかい ろっかい ななかい はっかい/はちかい きゅうかい じゅっかい/じっかい なんがい/なんかい'),
    rule: '1, 6, 8, 10 → っかい · 3 und 何 → がい (さんがい, なんがい) · sonst かい. Gezählt wird ab dem Erdgeschoss = 1階'
  },
  {
    id: '円',
    label: '〜円',
    hint: 'Yen',
    de: de('1 Yen', '# Yen', 'Wie viel Yen?'),
    reading: table('いちえん にえん さんえん よえん ごえん ろくえん ななえん はちえん きゅうえん じゅうえん なんえん'),
    rule: 'regelmäßig: Zahl + えん – aber 4 = よえん (nicht よんえん). Tippen: ん vor え mit Apostroph, san\'en → さんえん'
  }
]

const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']

const TENS = ['', 'じゅう', 'にじゅう', 'さんじゅう']
const FUN = ['', 'いっぷん', 'にふん', 'さんぷん', 'よんぷん', 'ごふん', 'ろっぷん', 'ななふん', 'はっぷん/はちふん', 'きゅうふん']

function minutes(n: number): string {
  const t = Math.floor(n / 10)
  const u = n % 10
  if (!u) return ['じゅっぷん', 'じっぷん'].map((r) => TENS[t].slice(0, -3) + r).join('/')
  return FUN[u].split('/').map((r) => TENS[t] + r).join('/')
}

const DAYS = [
  'ついたち', 'ふつか', 'みっか', 'よっか', 'いつか', 'むいか', 'なのか', 'ようか', 'ここのか', 'とおか',
  'じゅういちにち', 'じゅうににち', 'じゅうさんにち', 'じゅうよっか', 'じゅうごにち', 'じゅうろくにち', 'じゅうしちにち', 'じゅうはちにち', 'じゅうくにち', 'はつか',
  'にじゅういちにち', 'にじゅうににち', 'にじゅうさんにち', 'にじゅうよっか', 'にじゅうごにち', 'にじゅうろくにち', 'にじゅうしちにち', 'にじゅうはちにち', 'にじゅうくにち', 'さんじゅうにち',
  'さんじゅういちにち'
]

const HOURS = ['いちじ', 'にじ', 'さんじ', 'よじ', 'ごじ', 'ろくじ', 'しちじ', 'はちじ', 'くじ', 'じゅうじ', 'じゅういちじ', 'じゅうにじ']
const MONTH_READINGS = ['いちがつ', 'にがつ', 'さんがつ', 'しがつ', 'ごがつ', 'ろくがつ', 'しちがつ', 'はちがつ', 'くがつ', 'じゅうがつ', 'じゅういちがつ', 'じゅうにがつ']

export const timeWords: NumberWord[] = [
  {
    id: '時',
    label: '〜時',
    hint: 'Uhrzeit: よじ・しちじ・くじ',
    de: (n) => (n === null ? 'Wie spät ist es?' : `${n} Uhr`),
    reading: (n) => (n === null ? 'なんじ' : HOURS[n - 1] ?? null),
    rule: 'Zahl + じ, aber 4 = よじ, 7 = しちじ, 9 = くじ'
  },
  {
    id: '分',
    label: '〜分',
    hint: 'Minuten: ふん oder ぷん',
    de: (n) => (n === null ? 'Wie viele Minuten?' : n === 1 ? '1 Minute' : `${n} Minuten`),
    reading: (n) => (n === null ? 'なんぷん' : minutes(n)),
    rule: 'Es zählt die letzte Ziffer: 1, 6, 8, 0 → っぷん · 3, 4 → ぷん (さんぷん, よんぷん) · 2, 5, 7, 9 → ふん. 何分 = なんぷん'
  },
  {
    id: '月',
    label: '〜月',
    hint: 'Monate: しがつ・しちがつ・くがつ',
    de: (n) => (n === null ? 'Welcher Monat?' : MONTHS[n - 1]),
    reading: (n) => (n === null ? 'なんがつ' : MONTH_READINGS[n - 1] ?? null),
    rule: 'Zahl + がつ, aber April = しがつ, Juli = しちがつ, September = くがつ'
  },
  {
    id: '日',
    label: '〜日',
    hint: 'Tag im Datum: ついたち … とおか, はつか',
    de: (n) => (n === null ? 'Der Wievielte?' : `der ${n}. (Datum)`),
    reading: (n) => (n === null ? 'なんにち' : DAYS[n - 1] ?? null),
    rule: '1.–10., 14., 20. und 24. haben eigene Lesungen (ついたち … とおか, じゅうよっか, はつか, にじゅうよっか); sonst Zahl + にち mit 17 = じゅうしち, 19 = じゅうく'
  }
]
