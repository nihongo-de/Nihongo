export interface PuzzleItem {
  /** Bausteine in Ruby-Syntax in der richtigen Reihenfolge */
  blocks: string[]
  /** Weitere richtige Reihenfolgen als Indizes in blocks, z. B. '1023' */
  alt: string[]
  de: string
  why: string
}

// Bausteine mit | getrennt; alt mit Leerzeichen getrennt
const q = (jp: string, de: string, why: string, alt = ''): PuzzleItem => ({
  blocks: jp.split('|').map((b) => b.trim()),
  alt: alt.split(' ').filter(Boolean),
  de,
  why
})

export const puzzleSetTitles: Record<string, string> = {
  grundlagen: 'Verb am Ende',
  fragen: 'Fragen',
  beschreiben: 'Beschreibendes vorne',
  verbinden: 'Sätze verbinden'
}

export const puzzleSets: Record<string, PuzzleItem[]> = {
  grundlagen: [
    q('私[わたし]は | りんごを | 食[た]べます。', 'Ich esse einen Apfel.', 'Thema mit は vorne, das Verb steht immer am Ende.'),
    q('田中[たなか]さんは | 先生[せんせい] | です。', 'Herr Tanaka ist Lehrer.', 'A は B です: です schließt den Satz ab.'),
    q(
      '私[わたし]は | 毎朝[まいあさ] | コーヒーを | 飲[の]みます。',
      'Ich trinke jeden Morgen Kaffee.',
      'Zeitangaben stehen nach dem Thema (oder ganz vorne), das Objekt mit を direkt vor dem Verb.',
      '1023'
    ),
    q(
      '私[わたし]は | 図書館[としょかん]で | 日本語[にほんご]を | 勉強[べんきょう]します。',
      'Ich lerne in der Bibliothek Japanisch.',
      'Satzschablone: Thema → Ort mit で → Objekt mit を → Verb. Ort und Objekt dürfen auch tauschen.',
      '0213'
    ),
    q(
      '友達[ともだち]と | 公園[こうえん]で | 遊[あそ]びます。',
      'Ich spiele mit Freunden im Park.',
      'Partikel markieren die Rollen, deshalb sind beide Reihenfolgen richtig – nur das Verb bleibt hinten.',
      '102'
    ),
    q(
      '私[わたし]は | 明日[あした] | 友達[ともだち]と | 映画[えいが]を | 見[み]ます。',
      'Ich sehe mir morgen mit einem Freund einen Film an.',
      'Thema → Zeit → mit wem → Objekt → Verb. 明日 steht ohne Partikel.',
      '10234'
    ),
    q('兄[あに]は | 銀行[ぎんこう]で | 働[はたら]いています。', 'Mein älterer Bruder arbeitet bei einer Bank.', 'Ort der Handlung mit で vor dem Verb.'),
    q(
      '私[わたし]は | 来年[らいねん] | 日本[にほん]へ | 行[い]きます。',
      'Ich fahre nächstes Jahr nach Japan.',
      'Das Ziel mit へ steht direkt vor dem Bewegungsverb.',
      '1023'
    ),
    q(
      '私[わたし]は | 昨日[きのう] | 駅[えき]で | 友達[ともだち]に | 会[あ]いました。',
      'Ich habe gestern am Bahnhof einen Freund getroffen.',
      'Thema → Zeit → Ort → Person → Verb. 会う verlangt に.',
      '10234'
    )
  ],
  fragen: [
    q('これは | 何[なん] | ですか。', 'Was ist das?', 'Das Fragewort steht dort, wo die Antwort stünde (これは本です). か macht die Frage.'),
    q('トイレは | どこ | ですか。', 'Wo ist die Toilette?', 'Keine Umstellung wie im Deutschen: Thema, Fragewort, ですか.'),
    q('田中[たなか]さんは | 何時[なんじ]に | 来[き]ますか。', 'Um wie viel Uhr kommt Herr Tanaka?', '何時 + に wie bei einer konkreten Uhrzeit, das Verb mit か am Ende.'),
    q('週末[しゅうまつ]は | 何[なに]を | しましたか。', 'Was hast du am Wochenende gemacht?', '何を steht als Objekt vor dem Verb.'),
    q(
      '昨日[きのう] | 誰[だれ]が | 来[き]ましたか。',
      'Wer ist gestern gekommen?',
      'Ein Fragewort als Subjekt steht mit が, nie mit は.',
      '102'
    ),
    q(
      '駅[えき]まで | どうやって | 行[い]きますか。',
      'Wie komme ich zum Bahnhof?',
      'どうやって („auf welche Weise“) steht vor dem Verb, das Ziel まで davor oder danach.',
      '102'
    ),
    q('この | かばんは | いくら | ですか。', 'Wie viel kostet diese Tasche?', 'この steht direkt vor seinem Nomen.'),
    q('誕生日[たんじょうび]は | いつ | ですか。', 'Wann hast du Geburtstag?', 'Thema mit は, dann das Fragewort いつ und ですか.'),
    q(
      'コーヒーと | 紅茶[こうちゃ]と | どちらが | 好[す]きですか。',
      'Was magst du lieber, Kaffee oder Tee?',
      'Erst die Auswahl mit A と B と, dann どちらが.',
      '1023'
    )
  ],
  beschreiben: [
    q('大[おお]きい | 家[いえ]に | 住[す]んでいます。', 'Ich wohne in einem großen Haus.', 'Das Adjektiv steht direkt vor dem Nomen.'),
    q('これは | 私[わたし]の | 本[ほん] | です。', 'Das ist mein Buch.', 'A の B: Der Besitzer steht vor dem Besitz.'),
    q('静[しず]かな | 公園[こうえん]を | 散歩[さんぽ]しました。', 'Ich bin durch einen ruhigen Park spaziert.', 'な-Adjektive bekommen vor dem Nomen ein な.'),
    q(
      '昨日[きのう] | 買[か]った | 本[ほん]を | 読[よ]みます。',
      'Ich lese das Buch, das ich gestern gekauft habe.',
      'Der Relativsatz 昨日買った steht vor 本 – ganz ohne „das“ oder „welches“.'
    ),
    q('赤[あか]い | 傘[かさ]は | 母[はは]の | です。', 'Der rote Schirm gehört meiner Mutter.', 'Adjektiv vor dem Nomen; 母の = „der Mutter gehörend“.'),
    q(
      '机[つくえ]の | 上[うえ]に | 猫[ねこ]が | います。',
      'Auf dem Tisch ist eine Katze.',
      '机の上 = „die Oberseite des Tisches“. Natürlich: erst der Ort mit に, dann das Neue mit が.',
      '2301'
    ),
    q(
      'あそこで | 本[ほん]を | 読[よ]んでいる | 人[ひと]は | 田中[たなか]さん | です。',
      'Die Person, die dort drüben ein Buch liest, ist Herr Tanaka.',
      'Der ganze Relativsatz あそこで本を読んでいる beschreibt 人 und steht davor.'
    ),
    q(
      '日本[にほん]で | 一番[いちばん] | 高[たか]い | 山[やま]は | 富士山[ふじさん] | です。',
      'Der höchste Berg Japans ist der Fuji.',
      '日本で一番高い beschreibt 山 und steht vor ihm.'
    ),
    q('私[わたし]の | 兄[あに]は | 背[せ]が | 高[たか]いです。', 'Mein älterer Bruder ist groß.', 'Thema und Kommentar: Was meinen Bruder betrifft – der Rücken ist hoch.')
  ],
  verbinden: [
    q(
      '雨[あめ]が | 降[ふ]っているから、 | 家[いえ]に | います。',
      'Weil es regnet, bleibe ich zu Hause.',
      'Der Grund mit から steht vor der Folge – umgekehrt zum deutschen „…, weil …“.'
    ),
    q(
      '朝[あさ]ご飯[はん]を | 食[た]べてから、 | 学校[がっこう]へ | 行[い]きます。',
      'Nachdem ich gefrühstückt habe, gehe ich zur Schule.',
      '〜てから: Was zuerst passiert, steht vorne.'
    ),
    q('寝[ね]る | 前[まえ]に | 歯[は]を | 磨[みが]きます。', 'Vor dem Schlafengehen putze ich mir die Zähne.', 'Wörterbuchform + 前に („bevor“) steht vor dem Hauptsatz.'),
    q(
      '日本[にほん]へ | 行[い]った | とき、 | 写真[しゃしん]を | たくさん | 撮[と]りました。',
      'Als ich in Japan war, habe ich viele Fotos gemacht.',
      'Der とき-Satz steht vorne; たくさん darf vor oder nach 写真を stehen.',
      '012435'
    ),
    q('この | 店[みせ]は | 安[やす]いけど、 | おいしくないです。', 'Dieser Laden ist billig, aber nicht lecker.', 'けど („aber“) hängt am ersten Satz.'),
    q('部屋[へや]が | 広[ひろ]くて | 明[あか]るいです。', 'Das Zimmer ist groß und hell.', 'くて verbindet い-Adjektive; nur das letzte trägt です.'),
    q(
      '朝[あさ] | 起[お]きて、 | シャワーを | 浴[あ]びて、 | 出[で]かけます。',
      'Morgens stehe ich auf, dusche und gehe los.',
      'Die て-Kette folgt der zeitlichen Reihenfolge; nur das letzte Verb trägt Zeit und Höflichkeit.'
    ),
    q(
      '疲[つか]れたから、 | 今日[きょう]は | 早[はや]く | 寝[ね]ます。',
      'Weil ich müde bin, gehe ich heute früh schlafen.',
      'Grund mit から vor der Folge. 今日は darf auch ganz vorne stehen.',
      '1023'
    ),
    q(
      '休[やす]みの日[ひ]は | 本[ほん]を | 読[よ]んだり | 映画[えいが]を | 見[み]たり | します。',
      'An freien Tagen lese ich zum Beispiel oder sehe Filme.',
      '〜たり〜たりする zählt Beispiele auf; die Reihenfolge der Beispiele ist frei.',
      '034125'
    )
  ]
}
