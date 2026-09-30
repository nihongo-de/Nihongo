export type VerbGroup = 'u' | 'ru' | 'irr'

export interface Verb {
  /** Wörterbuchform in Ruby-Syntax: 飲[の]む */
  jp: string
  de: string
  group: VerbGroup
}

const v = (jp: string, group: VerbGroup, de: string): Verb => ({ jp, group, de })

export const verbsN5: Verb[] = [
  v('行[い]く', 'u', 'gehen'),
  v('飲[の]む', 'u', 'trinken'),
  v('読[よ]む', 'u', 'lesen'),
  v('休[やす]む', 'u', 'sich ausruhen'),
  v('住[す]む', 'u', 'wohnen'),
  v('書[か]く', 'u', 'schreiben'),
  v('聞[き]く', 'u', 'hören'),
  v('働[はたら]く', 'u', 'arbeiten'),
  v('歩[ある]く', 'u', 'zu Fuß gehen'),
  v('泳[およ]ぐ', 'u', 'schwimmen'),
  v('脱[ぬ]ぐ', 'u', 'ausziehen'),
  v('話[はな]す', 'u', 'sprechen'),
  v('貸[か]す', 'u', 'verleihen'),
  v('出[だ]す', 'u', 'herausnehmen'),
  v('待[ま]つ', 'u', 'warten'),
  v('持[も]つ', 'u', 'halten'),
  v('立[た]つ', 'u', 'aufstehen'),
  v('会[あ]う', 'u', 'treffen'),
  v('買[か]う', 'u', 'kaufen'),
  v('言[い]う', 'u', 'sagen'),
  v('使[つか]う', 'u', 'benutzen'),
  v('洗[あら]う', 'u', 'waschen'),
  v('歌[うた]う', 'u', 'singen'),
  v('遊[あそ]ぶ', 'u', 'spielen'),
  v('呼[よ]ぶ', 'u', 'rufen'),
  v('死[し]ぬ', 'u', 'sterben'),
  v('作[つく]る', 'u', 'machen'),
  v('座[すわ]る', 'u', 'sich setzen'),
  v('終[お]わる', 'u', 'enden'),
  v('分[わ]かる', 'u', 'verstehen'),
  v('帰[かえ]る', 'u', 'nach Hause gehen'),
  v('入[はい]る', 'u', 'hineingehen'),
  v('走[はし]る', 'u', 'rennen'),
  v('知[し]る', 'u', 'erfahren'),
  v('ある', 'u', 'es gibt (Dinge)'),
  v('食[た]べる', 'ru', 'essen'),
  v('見[み]る', 'ru', 'sehen'),
  v('寝[ね]る', 'ru', 'schlafen'),
  v('起[お]きる', 'ru', 'aufstehen'),
  v('出[で]る', 'ru', 'hinausgehen'),
  v('着[き]る', 'ru', 'anziehen'),
  v('借[か]りる', 'ru', 'ausleihen'),
  v('教[おし]える', 'ru', 'unterrichten'),
  v('覚[おぼ]える', 'ru', 'sich merken'),
  v('忘[わす]れる', 'ru', 'vergessen'),
  v('開[あ]ける', 'ru', 'öffnen'),
  v('閉[し]める', 'ru', 'schließen'),
  v('降[お]りる', 'ru', 'aussteigen'),
  v('いる', 'ru', 'es gibt (Lebewesen)'),
  v('する', 'irr', 'machen'),
  v('来[く]る', 'irr', 'kommen'),
  v('勉強[べんきょう]する', 'irr', 'lernen'),
  v('散歩[さんぽ]する', 'irr', 'spazieren gehen')
]
