// Die 80 Kanji der gängigen (inoffiziellen) JLPT-N5-Listen, thematisch gruppiert
export interface N5Kanji {
  k: string
  on: string
  kun: string
  de: string
  /** Beispielwort in Ruby-Syntax, z. B. 学校[がっこう] */
  ex: string
  exDe: string
}

export interface N5Sentence {
  jp: string
  ro: string
  de: string
}

export interface N5Group {
  id: string
  title: string
  kanji: N5Kanji[]
  sentences: N5Sentence[]
}

// Zeilenformat: Kanji | On | Kun | Bedeutung | Beispielwort | Übersetzung
export const parseKanji = (lines: string): N5Kanji[] =>
  lines
    .trim()
    .split('\n')
    .map((line) => {
      const [char, on, kun, de, ex, exDe] = line.split('|').map((s) => s.trim())
      return { k: char, on, kun, de, ex, exDe }
    })

const k = parseKanji

const s = (jp: string, ro: string, de: string): N5Sentence => ({ jp, ro, de })

export const n5Groups: N5Group[] = [
  {
    id: 'zahlen',
    title: 'Zahlen & Geld',
    kanji: k(`
      一 | イチ・イツ | ひと(つ) | eins | 一月[いちがつ] | Januar
      二 | ニ | ふた(つ) | zwei | 二人[ふたり] | zwei Personen
      三 | サン | みっ(つ) | drei | 三月[さんがつ] | März
      四 | シ | よん・よ(っつ) | vier | 四月[しがつ] | April
      五 | ゴ | いつ(つ) | fünf | 五分[ごふん] | fünf Minuten
      六 | ロク | むっ(つ) | sechs | 六時[ろくじ] | sechs Uhr
      七 | シチ | なな(つ) | sieben | 七月[しちがつ] | Juli
      八 | ハチ | やっ(つ) | acht | 八百[はっぴゃく] | achthundert
      九 | キュウ・ク | ここの(つ) | neun | 九時[くじ] | neun Uhr
      十 | ジュウ | とお | zehn | 十日[とおか] | der 10. (Tag)
      百 | ヒャク | – | hundert | 三百[さんびゃく] | dreihundert
      千 | セン | ち | tausend | 三千[さんぜん] | dreitausend
      万 | マン・バン | – | zehntausend | 一万円[いちまんえん] | 10.000 Yen
      円 | エン | まる(い) | Yen, Kreis | 百円[ひゃくえん] | 100 Yen
    `),
    sentences: [
      s('りんごを三[みっ]つください。', 'ringo o mittsu kudasai.', 'Drei Äpfel, bitte.'),
      s('この本[ほん]は千五百円[せんごひゃくえん]です。', 'kono hon wa sengohyaku en desu.', 'Dieses Buch kostet 1.500 Yen.'),
      s('カメラは八万円[はちまんえん]でした。', 'kamera wa hachiman en deshita.', 'Die Kamera hat 80.000 Yen gekostet.'),
      s('子[こ]どもが二人[ふたり]います。', 'kodomo ga futari imasu.', 'Ich habe zwei Kinder.'),
      s('四月[しがつ]から日本[にほん]に行[い]きます。', 'shigatsu kara nihon ni ikimasu.', 'Ab April gehe ich nach Japan.'),
      s('六時[ろくじ]におきます。', 'rokuji ni okimasu.', 'Ich stehe um sechs Uhr auf.'),
      s('九時[くじ]から五時[ごじ]まではたらきます。', 'kuji kara goji made hatarakimasu.', 'Ich arbeite von 9 bis 17 Uhr.'),
      s('一月[いちがつ]はとてもさむいです。', 'ichigatsu wa totemo samui desu.', 'Im Januar ist es sehr kalt.'),
      s('七月[しちがつ]十日[とおか]はわたしのたんじょう日[び]です。', 'shichigatsu tōka wa watashi no tanjōbi desu.', 'Der 10. Juli ist mein Geburtstag.')
    ]
  },
  {
    id: 'zeit',
    title: 'Zeit & Wochentage',
    kanji: k(`
      日 | ニチ・ジツ | ひ・か | Sonne, Tag | 毎日[まいにち] | jeden Tag
      月 | ゲツ・ガツ | つき | Mond, Monat | 月曜日[げつようび] | Montag
      火 | カ | ひ | Feuer | 火曜日[かようび] | Dienstag
      水 | スイ | みず | Wasser | 水曜日[すいようび] | Mittwoch
      木 | モク・ボク | き | Baum | 木曜日[もくようび] | Donnerstag
      金 | キン | かね | Gold, Geld | お金[かね] | Geld
      土 | ド | つち | Erde | 土曜日[どようび] | Samstag
      年 | ネン | とし | Jahr | 今年[ことし] | dieses Jahr
      時 | ジ | とき | Stunde, Zeit | 何時[なんじ] | wie spät?
      分 | ブン・フン | わ(かる) | Minute, Teil | 何分[なんぷん] | wie viele Minuten?
      半 | ハン | なか(ば) | Hälfte | 三時半[さんじはん] | halb vier
      今 | コン | いま | jetzt | 今日[きょう] | heute
      午 | ゴ | – | Mittag | 午後[ごご] | nachmittags
      毎 | マイ | – | jeder | 毎年[まいとし] | jedes Jahr
      間 | カン | あいだ・ま | Zwischenraum | 時間[じかん] | Zeit, Stunde
    `),
    sentences: [
      s('今日[きょう]は月曜日[げつようび]です。', 'kyō wa getsuyōbi desu.', 'Heute ist Montag.'),
      s('火曜日[かようび]と木曜日[もくようび]に日本語[にほんご]をならいます。', 'kayōbi to mokuyōbi ni nihongo o naraimasu.', 'Dienstags und donnerstags lerne ich Japanisch.'),
      s('水[みず]を一[いっ]ぱいください。', 'mizu o ippai kudasai.', 'Ein Glas Wasser, bitte.'),
      s('金曜日[きんようび]の午後[ごご]、ひまですか。', 'kin’yōbi no gogo, hima desu ka.', 'Hast du Freitagnachmittag Zeit?'),
      s('土曜日[どようび]はうちで休[やす]みます。', 'doyōbi wa uchi de yasumimasu.', 'Samstags ruhe ich mich zu Hause aus.'),
      s('今[いま]、何時[なんじ]ですか。— 三時半[さんじはん]です。', 'ima, nanji desu ka. — sanji han desu.', 'Wie spät ist es jetzt? – Halb vier.'),
      s('毎日[まいにち]三十分[さんじゅっぷん]、日本語[にほんご]をべんきょうします。', 'mainichi sanjuppun, nihongo o benkyō shimasu.', 'Ich lerne jeden Tag 30 Minuten Japanisch.'),
      s('二年間[にねんかん]、日本[にほん]にすんでいました。', 'ninenkan, nihon ni sunde imashita.', 'Ich habe zwei Jahre lang in Japan gewohnt.')
    ]
  },
  {
    id: 'menschen',
    title: 'Menschen & Familie',
    kanji: k(`
      人 | ジン・ニン | ひと | Mensch | 日本人[にほんじん] | Japaner(in)
      男 | ダン・ナン | おとこ | Mann | 男[おとこ]の子[こ] | Junge
      女 | ジョ | おんな | Frau | 女[おんな]の人[ひと] | Frau
      子 | シ・ス | こ | Kind | 子[こ]ども | Kind
      父 | フ | ちち | Vater | お父[とう]さん | (dein) Vater
      母 | ボ | はは | Mutter | お母[かあ]さん | (deine) Mutter
      友 | ユウ | とも | Freund | 友[とも]だち | Freund(in)
      先 | セン | さき | vorher, voraus | 先生[せんせい] | Lehrer(in)
      生 | セイ・ショウ | い(きる)・う(まれる) | Leben, geboren | 学生[がくせい] | Student(in)
      名 | メイ・ミョウ | な | Name | 名前[なまえ] | Name
    `),
    sentences: [
      s('あの男[おとこ]の人[ひと]はだれですか。', 'ano otoko no hito wa dare desu ka.', 'Wer ist der Mann dort?'),
      s('女[おんな]の子[こ]が二人[ふたり]います。', 'onna no ko ga futari imasu.', 'Da sind zwei Mädchen.'),
      s('父[ちち]は先生[せんせい]です。', 'chichi wa sensei desu.', 'Mein Vater ist Lehrer.'),
      s('母[はは]はりょうりがじょうずです。', 'haha wa ryōri ga jōzu desu.', 'Meine Mutter kocht gut.'),
      s('友[とも]だちとえいがを見[み]ます。', 'tomodachi to eiga o mimasu.', 'Ich sehe mit Freunden einen Film.'),
      s('お名前[なまえ]は何[なん]ですか。', 'o-namae wa nan desu ka.', 'Wie heißen Sie?'),
      s('わたしはドイツ人[じん]の学生[がくせい]です。', 'watashi wa doitsujin no gakusei desu.', 'Ich bin deutscher Student.'),
      s('お父[とう]さんとお母[かあ]さんはどこにすんでいますか。', 'otōsan to okāsan wa doko ni sunde imasu ka.', 'Wo wohnen deine Eltern?')
    ]
  },
  {
    id: 'richtung',
    title: 'Richtung & Ort',
    kanji: k(`
      上 | ジョウ | うえ・あ(がる) | oben | 上[うえ] | oben, auf
      下 | カ・ゲ | した・さ(がる) | unten | 地下鉄[ちかてつ] | U-Bahn
      左 | サ | ひだり | links | 左手[ひだりて] | linke Hand
      右 | ウ・ユウ | みぎ | rechts | 右手[みぎて] | rechte Hand
      中 | チュウ | なか | Mitte, innen | 中国[ちゅうごく] | China
      外 | ガイ | そと | außen | 外国人[がいこくじん] | Ausländer(in)
      前 | ゼン | まえ | vor | 午前[ごぜん] | vormittags
      後 | ゴ・コウ | うし(ろ)・あと | hinter, nach | 午後[ごご] | nachmittags
      東 | トウ | ひがし | Osten | 東京[とうきょう] | Tokio
      西 | セイ・サイ | にし | Westen | 西口[にしぐち] | Westausgang
      南 | ナン | みなみ | Süden | 南口[みなみぐち] | Südausgang
      北 | ホク | きた | Norden | 北海道[ほっかいどう] | Hokkaidō
    `),
    sentences: [
      s('本[ほん]はつくえの上[うえ]にあります。', 'hon wa tsukue no ue ni arimasu.', 'Das Buch liegt auf dem Tisch.'),
      s('ねこはいすの下[した]にいます。', 'neko wa isu no shita ni imasu.', 'Die Katze ist unter dem Stuhl.'),
      s('つぎのかどを右[みぎ]にまがってください。', 'tsugi no kado o migi ni magatte kudasai.', 'Biegen Sie an der nächsten Ecke rechts ab.'),
      s('トイレは左[ひだり]です。', 'toire wa hidari desu.', 'Die Toilette ist links.'),
      s('かばんの中[なか]に何[なに]がありますか。', 'kaban no naka ni nani ga arimasu ka.', 'Was ist in der Tasche?'),
      s('外[そと]は雨[あめ]です。', 'soto wa ame desu.', 'Draußen regnet es.'),
      s('えきの前[まえ]で三時[さんじ]にあいましょう。', 'eki no mae de sanji ni aimashō.', 'Treffen wir uns um drei vor dem Bahnhof.'),
      s('ごはんの後[あと]でテレビを見[み]ます。', 'gohan no ato de terebi o mimasu.', 'Nach dem Essen sehe ich fern.'),
      s('日本[にほん]の北[きた]はさむくて、南[みなみ]はあたたかいです。', 'nihon no kita wa samukute, minami wa atatakai desu.', 'Im Norden Japans ist es kalt, im Süden warm.'),
      s('えきの東[ひがし]に大[おお]きいこうえんがあります。', 'eki no higashi ni ōkii kōen ga arimasu.', 'Östlich vom Bahnhof gibt es einen großen Park.'),
      s('ドイツは日本[にほん]の西[にし]にあります。', 'doitsu wa nihon no nishi ni arimasu.', 'Deutschland liegt westlich von Japan.')
    ]
  },
  {
    id: 'natur',
    title: 'Natur, Wetter & Verkehr',
    kanji: k(`
      山 | サン | やま | Berg | 富士山[ふじさん] | der Fuji
      川 | セン | かわ | Fluss | 小川[おがわ] | Bach
      天 | テン | あめ・あま | Himmel | 天気[てんき] | Wetter
      気 | キ・ケ | – | Geist, Energie | 元気[げんき] | munter, gesund
      雨 | ウ | あめ | Regen | 大雨[おおあめ] | Starkregen
      電 | デン | – | Elektrizität | 電話[でんわ] | Telefon
      車 | シャ | くるま | Wagen, Auto | 電車[でんしゃ] | Zug
    `),
    sentences: [
      s('今日[きょう]はいい天気[てんき]ですね。', 'kyō wa ii tenki desu ne.', 'Heute ist schönes Wetter, nicht wahr?'),
      s('あしたは雨[あめ]がふるでしょう。', 'ashita wa ame ga furu deshō.', 'Morgen wird es wohl regnen.'),
      s('山[やま]にのぼりたいです。', 'yama ni noboritai desu.', 'Ich möchte auf einen Berg steigen.'),
      s('川[かわ]でおよぎました。', 'kawa de oyogimashita.', 'Ich bin im Fluss geschwommen.'),
      s('電車[でんしゃ]で学校[がっこう]に行[い]きます。', 'densha de gakkō ni ikimasu.', 'Ich fahre mit dem Zug zur Schule.'),
      s('車[くるま]がほしいです。', 'kuruma ga hoshii desu.', 'Ich möchte ein Auto haben.'),
      s('あとで電話[でんわ]してください。', 'ato de denwa shite kudasai.', 'Ruf mich bitte später an.'),
      s('気[き]をつけてください。', 'ki o tsukete kudasai.', 'Pass bitte auf dich auf!')
    ]
  },
  {
    id: 'lernen',
    title: 'Lernen & Sprache',
    kanji: k(`
      学 | ガク | まな(ぶ) | lernen | 大学[だいがく] | Universität
      校 | コウ | – | Schule | 学校[がっこう] | Schule
      語 | ゴ | かた(る) | Sprache, Wort | 日本語[にほんご] | Japanisch
      国 | コク | くに | Land | 外国[がいこく] | Ausland
      本 | ホン | もと | Buch, Ursprung | 日本[にほん] | Japan
      書 | ショ | か(く) | schreiben | 辞書[じしょ] | Wörterbuch
      読 | ドク | よ(む) | lesen | 読書[どくしょ] | Lesen (als Hobby)
      話 | ワ | はな(す)・はなし | sprechen | 会話[かいわ] | Gespräch
      聞 | ブン | き(く) | hören, fragen | 新聞[しんぶん] | Zeitung
    `),
    sentences: [
      s('日本語[にほんご]を話[はな]しますか。', 'nihongo o hanashimasu ka.', 'Sprechen Sie Japanisch?'),
      s('ねる前[まえ]に本[ほん]を読[よ]みます。', 'neru mae ni hon o yomimasu.', 'Vor dem Schlafen lese ich ein Buch.'),
      s('ここに名前[なまえ]を書[か]いてください。', 'koko ni namae o kaite kudasai.', 'Bitte schreiben Sie hier Ihren Namen.'),
      s('毎日[まいにち]ラジオを聞[き]きます。', 'mainichi rajio o kikimasu.', 'Ich höre jeden Tag Radio.'),
      s('先生[せんせい]に聞[き]いてください。', 'sensei ni kiite kudasai.', 'Frag bitte die Lehrerin.'),
      s('大学[だいがく]で何[なに]をべんきょうしていますか。', 'daigaku de nani o benkyō shite imasu ka.', 'Was studierst du an der Uni?'),
      s('学校[がっこう]は八時半[はちじはん]からです。', 'gakkō wa hachiji han kara desu.', 'Die Schule beginnt um halb neun.'),
      s('外国[がいこく]に行[い]ったことがありますか。', 'gaikoku ni itta koto ga arimasu ka.', 'Warst du schon einmal im Ausland?')
    ]
  },
  {
    id: 'handeln',
    title: 'Bewegen & Handeln',
    kanji: k(`
      行 | コウ・ギョウ | い(く)・おこな(う) | gehen | 旅行[りょこう] | Reise
      来 | ライ | く(る)・き(ます) | kommen | 来年[らいねん] | nächstes Jahr
      見 | ケン | み(る) | sehen | 見物[けんぶつ] | Besichtigung
      食 | ショク | た(べる) | essen | 食事[しょくじ] | Mahlzeit
      休 | キュウ | やす(む) | ruhen | 休[やす]み | Pause, Urlaub
      出 | シュツ | で(る)・だ(す) | hinausgehen | 出口[でぐち] | Ausgang
      入 | ニュウ | はい(る)・い(れる) | hineingehen | 入口[いりぐち] | Eingang
    `),
    sentences: [
      s('あした、どこに行[い]きますか。', 'ashita, doko ni ikimasu ka.', 'Wohin gehst du morgen?'),
      s('友[とも]だちがうちに来[き]ます。', 'tomodachi ga uchi ni kimasu.', 'Ein Freund kommt zu mir nach Hause.'),
      s('来年[らいねん]、日本[にほん]へ行[い]きたいです。', 'rainen, nihon e ikitai desu.', 'Nächstes Jahr möchte ich nach Japan.'),
      s('いっしょにえいがを見[み]ませんか。', 'issho ni eiga o mimasen ka.', 'Wollen wir zusammen einen Film sehen?'),
      s('何[なに]を食[た]べたいですか。', 'nani o tabetai desu ka.', 'Was möchtest du essen?'),
      s('ちょっと休[やす]みましょう。', 'chotto yasumimashō.', 'Machen wir kurz Pause.'),
      s('七時[しちじ]にうちを出[で]ます。', 'shichiji ni uchi o demasu.', 'Ich verlasse um sieben das Haus.'),
      s('おふろに入[はい]ります。', 'o-furo ni hairimasu.', 'Ich nehme ein Bad.')
    ]
  },
  {
    id: 'eigenschaften',
    title: 'Eigenschaften & Fragen',
    kanji: k(`
      大 | ダイ・タイ | おお(きい) | groß | 大人[おとな] | Erwachsener
      小 | ショウ | ちい(さい)・こ | klein | 小学校[しょうがっこう] | Grundschule
      高 | コウ | たか(い) | hoch, teuer | 高校[こうこう] | Oberschule
      長 | チョウ | なが(い) | lang; Leiter | 社長[しゃちょう] | Firmenchef(in)
      白 | ハク | しろ・しろ(い) | weiß | 白[しろ]い | weiß
      何 | カ | なに・なん | was | 何人[なんにん] | wie viele Personen?
    `),
    sentences: [
      s('この車[くるま]は大[おお]きいですね。', 'kono kuruma wa ōkii desu ne.', 'Dieses Auto ist groß, nicht wahr?'),
      s('小[ちい]さいねこがいます。', 'chiisai neko ga imasu.', 'Da ist eine kleine Katze.'),
      s('このとけいは高[たか]いです。', 'kono tokei wa takai desu.', 'Diese Uhr ist teuer.'),
      s('あの人[ひと]はかみが長[なが]いです。', 'ano hito wa kami ga nagai desu.', 'Die Person dort hat lange Haare.'),
      s('白[しろ]いシャツをかいました。', 'shiroi shatsu o kaimashita.', 'Ich habe ein weißes Hemd gekauft.'),
      s('これは何[なん]ですか。', 'kore wa nan desu ka.', 'Was ist das?'),
      s('何人[なんにん]来[き]ますか。— 十人[じゅうにん]です。', 'nannin kimasu ka. — jūnin desu.', 'Wie viele Leute kommen? – Zehn.')
    ]
  }
]

export const findN5Group = (id: string) => n5Groups.find((g) => g.id === id)
