export interface ReadingLine {
  /** Ruby-Syntax: 私[わたし]は… */
  jp: string
  de: string
  /** Sprecher im Dialog („店員[てんいん]：…“) */
  speaker?: string
}

export interface ReadingQuestion {
  jp: string
  de: string
  /** Erste Option = richtige Antwort; angezeigt wird gemischt */
  options: string[]
  why: string
}

export interface Reading {
  id: string
  /** Japanischer Titel in Ruby-Syntax */
  title: string
  de: string
  paragraphs: ReadingLine[][]
  words: { jp: string; de: string }[]
  questions: ReadingQuestion[]
}

const pairs = (block: string) =>
  block
    .trim()
    .split('\n')
    .map((line) => line.trim())

/** Zeilen `Japanisch | Deutsch`, Leerzeile = neuer Absatz, `Sprecher：Text` im Dialog */
function paragraphs(block: string): ReadingLine[][] {
  const out: ReadingLine[][] = [[]]
  for (const line of pairs(block)) {
    if (!line) {
      if (out[out.length - 1].length) out.push([])
      continue
    }
    const [jp, de] = line.split('|').map((s) => s.trim())
    const m = jp.match(/^([^：]{1,12})：(.+)$/)
    out[out.length - 1].push(m ? { speaker: m[1], jp: m[2], de } : { jp, de })
  }
  return out
}

const words = (block: string) =>
  pairs(block).map((line) => {
    const [jp, de] = line.split('|').map((s) => s.trim())
    return { jp, de }
  })

const q = (jp: string, de: string, options: string[], why: string): ReadingQuestion => ({ jp, de, options, why })

// Kurze N5-Lesetexte, nach Schwierigkeit geordnet
export const readingsN5: Reading[] = [
  {
    id: 'vorstellung',
    title: '自己紹介[じこしょうかい]',
    de: 'Sich vorstellen',
    paragraphs: paragraphs(`
      はじめまして。 | Freut mich, dich kennenzulernen.
      私[わたし]はマリア・シュミットです。 | Ich bin Maria Schmidt.
      ドイツのミュンヘンから来[き]ました。 | Ich komme aus München in Deutschland.
      二十二歳[にじゅうにさい]です。 | Ich bin 22 Jahre alt.

      今[いま]、東京[とうきょう]の大学[だいがく]で日本語[にほんご]を勉強[べんきょう]しています。 | Zurzeit lerne ich an einer Universität in Tokyo Japanisch.
      趣味[しゅみ]は料理[りょうり]と写真[しゃしん]です。 | Meine Hobbys sind Kochen und Fotografieren.
      日本[にほん]の料理[りょうり]が大好[だいす]きです。 | Ich liebe die japanische Küche.
      でも、納豆[なっとう]はあまり好[す]きじゃありません。 | Aber Nattō mag ich nicht besonders.

      どうぞよろしくお願[ねが]いします。 | Auf gute Bekanntschaft!
    `),
    words: words(`
      自己紹介[じこしょうかい] | Selbstvorstellung
      〜から来[き]ました | ich komme aus …
      大学[だいがく] | Universität
      勉強[べんきょう]する | lernen, studieren
      趣味[しゅみ] | Hobby
      料理[りょうり] | Kochen; Gericht, Küche
      写真[しゃしん] | Foto
      大好[だいす]き | sehr gern mögen
      納豆[なっとう] | Nattō (vergorene Sojabohnen)
    `),
    questions: [
      q('マリアさんはどこから来[き]ましたか。', 'Woher kommt Maria?', ['ミュンヘン', '東京[とうきょう]', 'ベルリン', '大阪[おおさか]'], '„ドイツのミュンヘンから来ました“ – in Tokyo lernt sie nur.'),
      q('マリアさんは何歳[なんさい]ですか。', 'Wie alt ist Maria?', ['二十二歳[にじゅうにさい]', '十二歳[じゅうにさい]', '二十歳[はたち]', '二十五歳[にじゅうごさい]'], '二十二歳 = 22 Jahre.'),
      q('マリアさんは今[いま]、何[なに]をしていますか。', 'Was macht Maria zurzeit?', ['日本語[にほんご]を勉強[べんきょう]しています', '料理[りょうり]を教[おし]えています', '写真[しゃしん]の会社[かいしゃ]で働[はたら]いています', 'ドイツ語[ご]を教[おし]えています'], '„今、東京の大学で日本語を勉強しています“ – 〜ている beschreibt, was gerade läuft.'),
      q('マリアさんは納豆[なっとう]が好[す]きですか。', 'Mag Maria Nattō?', ['あまり好[す]きじゃありません', '大好[だいす]きです', '毎日[まいにち]食[た]べます', 'とても好[す]きです'], 'あまり + Verneinung = „nicht besonders“. Groß ist ihre Liebe nur zur japanischen Küche allgemein.')
    ]
  },
  {
    id: 'familie',
    title: '私[わたし]の家族[かぞく]',
    de: 'Meine Familie',
    paragraphs: paragraphs(`
      私[わたし]の家族[かぞく]は五人[ごにん]です。 | Meine Familie hat fünf Personen.
      父[ちち]と母[はは]と姉[あね]と弟[おとうと]と私[わたし]です。 | Vater, Mutter, meine ältere Schwester, mein jüngerer Bruder und ich.

      父[ちち]は銀行[ぎんこう]で働[はたら]いています。 | Mein Vater arbeitet bei einer Bank.
      毎朝[まいあさ]七時[しちじ]に家[いえ]を出[で]ます。 | Er geht jeden Morgen um sieben aus dem Haus.
      母[はは]は高校[こうこう]の先生[せんせい]です。 | Meine Mutter ist Lehrerin an einer Oberschule.
      英語[えいご]を教[おし]えています。 | Sie unterrichtet Englisch.

      姉[あね]は二十五歳[にじゅうごさい]で、大阪[おおさか]に住[す]んでいます。 | Meine ältere Schwester ist 25 und wohnt in Ōsaka.
      弟[おとうと]は中学生[ちゅうがくせい]です。 | Mein jüngerer Bruder ist in der Mittelschule.
      サッカーが上手[じょうず]です。 | Er spielt gut Fußball.

      うちには犬[いぬ]も一匹[いっぴき]います。 | Wir haben auch einen Hund.
      名前[なまえ]はポチです。 | Er heißt Pochi.
      私[わたし]は毎晩[まいばん]ポチと散歩[さんぽ]します。 | Ich gehe jeden Abend mit Pochi spazieren.
    `),
    words: words(`
      銀行[ぎんこう] | Bank
      働[はたら]く | arbeiten
      家[いえ]を出[で]る | aus dem Haus gehen
      高校[こうこう] | Oberschule (10.–12. Klasse)
      教[おし]える | unterrichten, beibringen
      住[す]んでいる | wohnen
      中学生[ちゅうがくせい] | Mittelschüler (7.–9. Klasse)
      上手[じょうず] | geschickt, gut in etwas
      一匹[いっぴき] | ein (kleines Tier)
      散歩[さんぽ]する | spazieren gehen
    `),
    questions: [
      q('家族[かぞく]は何人[なんにん]ですか。', 'Wie viele Personen hat die Familie?', ['五人[ごにん]', '四人[よにん]', '六人[ろくにん]', '三人[さんにん]'], 'Vater, Mutter, Schwester, Bruder und der Schreiber selbst – der Hund zählt nicht mit: „家族は五人です“.'),
      q('お母[かあ]さんの仕事[しごと]は何[なん]ですか。', 'Was ist die Mutter von Beruf?', ['先生[せんせい]', '銀行員[ぎんこういん]', '医者[いしゃ]', '学生[がくせい]'], '„母は高校の先生です“ – bei der Bank arbeitet der Vater.'),
      q('お姉[ねえ]さんはどこに住[す]んでいますか。', 'Wo wohnt die ältere Schwester?', ['大阪[おおさか]', '東京[とうきょう]', '京都[きょうと]', 'ドイツ'], '„姉は二十五歳で、大阪に住んでいます“.'),
      q('弟[おとうと]さんは何[なに]が上手[じょうず]ですか。', 'Worin ist der jüngere Bruder gut?', ['サッカー', '英語[えいご]', '料理[りょうり]', 'テニス'], '„サッカーが上手です“ – bei 上手 steht die Sache mit が.')
    ]
  },
  {
    id: 'tag',
    title: '山田[やまだ]さんの一日[いちにち]',
    de: 'Ein Tag von Herrn Yamada',
    paragraphs: paragraphs(`
      私[わたし]は山田[やまだ]です。会社員[かいしゃいん]です。 | Ich heiße Yamada. Ich bin Angestellter.
      毎朝[まいあさ]六時半[ろくじはん]に起[お]きます。 | Jeden Morgen stehe ich um halb sieben auf.
      シャワーを浴[あ]びて、朝[あさ]ご飯[はん]を食[た]べます。 | Ich dusche und frühstücke.
      朝[あさ]ご飯[はん]はいつもパンとコーヒーです。 | Zum Frühstück gibt es immer Brot und Kaffee.
      七時半[しちじはん]に電車[でんしゃ]で会社[かいしゃ]へ行[い]きます。 | Um halb acht fahre ich mit dem Zug zur Firma.

      仕事[しごと]は九時[くじ]から六時[ろくじ]までです。 | Die Arbeit geht von neun bis sechs.
      昼[ひる]ご飯[はん]は会社[かいしゃ]の人[ひと]と近[ちか]くの店[みせ]で食[た]べます。 | Zu Mittag esse ich mit Kollegen in einem Lokal in der Nähe.

      夜[よる]は七時[しちじ]ごろうちへ帰[かえ]ります。 | Abends komme ich gegen sieben nach Hause.
      晩[ばん]ご飯[はん]を作[つく]って、食[た]べます。 | Ich koche Abendessen und esse.
      晩[ばん]ご飯[はん]の後[あと]で、三十分[さんじゅっぷん]ぐらい英語[えいご]を勉強[べんきょう]します。 | Nach dem Abendessen lerne ich etwa 30 Minuten Englisch.
      それから、少[すこ]しテレビを見[み]て、十一時[じゅういちじ]ごろ寝[ね]ます。 | Danach sehe ich ein bisschen fern und gehe gegen elf schlafen.

      土曜日[どようび]と日曜日[にちようび]は休[やす]みです。 | Samstag und Sonntag habe ich frei.
      週末[しゅうまつ]は十時[じゅうじ]まで寝[ね]ます。 | Am Wochenende schlafe ich bis zehn.
    `),
    words: words(`
      会社員[かいしゃいん] | Angestellter (in einer Firma)
      起[お]きる | aufstehen, aufwachen
      シャワーを浴[あ]びる | duschen
      電車[でんしゃ] | Zug, Bahn
      仕事[しごと] | Arbeit
      近[ちか]く | Nähe; in der Nähe
      帰[かえ]る | nach Hause gehen, zurückkehren
      作[つく]る | machen; kochen
      寝[ね]る | schlafen (gehen)
      週末[しゅうまつ] | Wochenende
    `),
    questions: [
      q('山田[やまだ]さんは何時[なんじ]に起[お]きますか。', 'Um wie viel Uhr steht Herr Yamada auf?', ['六時半[ろくじはん]', '七時半[しちじはん]', '六時[ろくじ]', '七時[しちじ]'], '„毎朝六時半に起きます“ – um halb acht fährt er los.'),
      q('山田[やまだ]さんは何[なに]で会社[かいしゃ]へ行[い]きますか。', 'Womit fährt Herr Yamada zur Firma?', ['電車[でんしゃ]', 'バス', '車[くるま]', '自転車[じてんしゃ]'], '„電車で会社へ行きます“ – で markiert das Verkehrsmittel.'),
      q('晩[ばん]ご飯[はん]の後[あと]で、まず何[なに]をしますか。', 'Was macht er nach dem Abendessen zuerst?', ['英語[えいご]を勉強[べんきょう]します', 'テレビを見[み]ます', '寝[ね]ます', '散歩[さんぽ]します'], 'Erst lernt er Englisch, danach (それから) sieht er fern.'),
      q('週末[しゅうまつ]、山田[やまだ]さんは何時[なんじ]まで寝[ね]ますか。', 'Bis wann schläft Herr Yamada am Wochenende?', ['十時[じゅうじ]', '九時[くじ]', '六時半[ろくじはん]', '十一時[じゅういちじ]'], '„週末は十時まで寝ます“ – um elf geht er unter der Woche ins Bett.')
    ]
  },
  {
    id: 'stadt',
    title: '私[わたし]の町[まち]',
    de: 'Meine Stadt',
    paragraphs: paragraphs(`
      私[わたし]の町[まち]は小[ちい]さいですが、とても便利[べんり]です。 | Meine Stadt ist klein, aber sehr praktisch.
      駅[えき]の前[まえ]にスーパーとコンビニがあります。 | Vor dem Bahnhof gibt es einen Supermarkt und einen Konbini.
      スーパーの隣[となり]は郵便局[ゆうびんきょく]です。 | Neben dem Supermarkt ist die Post.
      銀行[ぎんこう]は郵便局[ゆうびんきょく]の向[む]かいにあります。 | Die Bank liegt gegenüber der Post.

      駅[えき]の北[きた]に大[おお]きい公園[こうえん]があります。 | Nördlich vom Bahnhof gibt es einen großen Park.
      駅[えき]から歩[ある]いて十分[じゅっぷん]ぐらいです。 | Vom Bahnhof sind es etwa zehn Minuten zu Fuß.
      公園[こうえん]の中[なか]に池[いけ]があって、魚[さかな]や鳥[とり]がいます。 | Im Park gibt es einen Teich, und es gibt Fische und Vögel.
      週末[しゅうまつ]は子[こ]どもや犬[いぬ]がたくさんいて、にぎやかです。 | Am Wochenende sind viele Kinder und Hunde da, und es ist lebhaft.

      私[わたし]のアパートは公園[こうえん]の近[ちか]くにあります。 | Mein Wohnhaus liegt in der Nähe des Parks.
      アパートの一階[いっかい]にパン屋[や]があります。 | Im Erdgeschoss des Hauses ist eine Bäckerei.
      パン屋[や]のパンは安[やす]くて、おいしいです。 | Das Brot der Bäckerei ist billig und lecker.

      でも、町[まち]には映画館[えいがかん]がありません。 | Aber in der Stadt gibt es kein Kino.
      映画[えいが]を見[み]たいときは、電車[でんしゃ]で隣[となり]の町[まち]へ行[い]きます。 | Wenn ich einen Film sehen will, fahre ich mit dem Zug in die Nachbarstadt.
    `),
    words: words(`
      便利[べんり] | praktisch, bequem
      隣[となり] | neben; Nachbar-
      郵便局[ゆうびんきょく] | Post(amt)
      向[む]かい | gegenüber
      北[きた] | Norden
      歩[ある]いて | zu Fuß
      池[いけ] | Teich
      にぎやか | lebhaft, belebt
      アパート | Wohnhaus, Mietwohnung
      一階[いっかい] | Erdgeschoss (1. Etage in Japan)
      パン屋[や] | Bäckerei
      映画館[えいがかん] | Kino
    `),
    questions: [
      q('郵便局[ゆうびんきょく]はどこにありますか。', 'Wo ist die Post?', ['スーパーの隣[となり]', '銀行[ぎんこう]の隣[となり]', '公園[こうえん]の中[なか]', '駅[えき]の北[きた]'], '„スーパーの隣は郵便局です“ – die Bank liegt ihr gegenüber (向かい).'),
      q('公園[こうえん]の中[なか]に何[なに]がありますか。', 'Was gibt es im Park?', ['池[いけ]', '映画館[えいがかん]', 'パン屋[や]', 'コンビニ'], '„公園の中に池があって…“ – Dinge mit ある, Tiere (魚や鳥) mit いる.'),
      q('パン屋[や]はどこにありますか。', 'Wo ist die Bäckerei?', ['アパートの一階[いっかい]', '駅[えき]の前[まえ]', '公園[こうえん]の中[なか]', '隣[となり]の町[まち]'], '„アパートの一階にパン屋があります“.'),
      q('この町[まち]に何[なに]がありませんか。', 'Was gibt es in dieser Stadt nicht?', ['映画館[えいがかん]', 'コンビニ', '銀行[ぎんこう]', '公園[こうえん]'], '„町には映画館がありません“ – dafür fährt man in die Nachbarstadt.')
    ]
  },
  {
    id: 'restaurant',
    title: 'レストランで',
    de: 'Im Restaurant',
    paragraphs: paragraphs(`
      店員[てんいん]：いらっしゃいませ。何名様[なんめいさま]ですか。 | Willkommen! Wie viele Personen?
      リサ：二人[ふたり]です。 | Zwei.
      店員[てんいん]：こちらへどうぞ。メニューです。 | Hier entlang, bitte. Hier ist die Speisekarte.

      ケン：リサさん、何[なに]にしますか。 | Lisa, was nimmst du?
      リサ：そうですね…。私[わたし]は天[てん]ぷら定食[ていしょく]にします。ケンさんは？ | Hm … Ich nehme das Tempura-Menü. Und du, Ken?
      ケン：私[わたし]はラーメンと餃子[ぎょうざ]にします。 | Ich nehme Ramen und Gyōza.

      店員[てんいん]：ご注文[ちゅうもん]はお決[き]まりですか。 | Haben Sie gewählt?
      ケン：はい。天[てん]ぷら定食[ていしょく]を一[ひと]つと、ラーメンと餃子[ぎょうざ]をお願[ねが]いします。 | Ja. Einmal das Tempura-Menü sowie Ramen und Gyōza, bitte.
      店員[てんいん]：お飲[の]み物[もの]は？ | Und zu trinken?
      リサ：冷[つめ]たいお茶[ちゃ]を二[ふた]つください。 | Zweimal kalten Tee, bitte.

      ケン：すみません、お会計[かいけい]をお願[ねが]いします。 | Entschuldigung, die Rechnung bitte.
      店員[てんいん]：はい、全部[ぜんぶ]で二千八百円[にせんはっぴゃくえん]です。 | Gern, das macht zusammen 2800 Yen.
      リサ：ごちそうさまでした。おいしかったです。 | Danke für das Essen. Es war lecker.
    `),
    words: words(`
      店員[てんいん] | Bedienung, Verkäufer(in)
      何名様[なんめいさま] | wie viele Personen? (sehr höflich)
      〜にする | sich für … entscheiden, … nehmen
      定食[ていしょく] | Menü (Hauptgericht mit Reis, Suppe usw.)
      餃子[ぎょうざ] | Gyōza (gefüllte Teigtaschen)
      ご注文[ちゅうもん]はお決[き]まりですか | Haben Sie schon gewählt?
      飲[の]み物[もの] | Getränk
      冷[つめ]たい | kalt (zum Anfassen, Getränke)
      お会計[かいけい] | Rechnung, Bezahlen
      全部[ぜんぶ]で | zusammen, insgesamt
      ごちそうさまでした | Danke für das Essen (nach dem Essen)
    `),
    questions: [
      q('リサさんは何[なに]を食[た]べますか。', 'Was isst Lisa?', ['天[てん]ぷら定食[ていしょく]', 'ラーメン', '餃子[ぎょうざ]', 'ラーメンと餃子[ぎょうざ]'], '„私は天ぷら定食にします“ – Ramen und Gyōza bestellt Ken.'),
      q('二人[ふたり]は何[なに]を飲[の]みますか。', 'Was trinken die beiden?', ['冷[つめ]たいお茶[ちゃ]', '熱[あつ]いお茶[ちゃ]', 'ビール', 'コーヒー'], '„冷たいお茶を二つください“ – 二つ, also für beide.'),
      q('全部[ぜんぶ]でいくらでしたか。', 'Wie viel kostete alles zusammen?', ['二千八百円[にせんはっぴゃくえん]', '二千百円[にせんひゃくえん]', '八千二百円[はっせんにひゃくえん]', '二百八十円[にひゃくはちじゅうえん]'], '二千八百円 = 2000 + 800 = 2800 Yen (八百 wird はっぴゃく gelesen).'),
      q('「いらっしゃいませ」と言[い]ったのは誰[だれ]ですか。', 'Wer hat „irasshaimase“ gesagt?', ['店員[てんいん]さん', 'リサさん', 'ケンさん', 'リサさんとケンさん'], 'Mit いらっしゃいませ begrüßt das Personal die Gäste.')
    ]
  },
  {
    id: 'ausflug',
    title: '日曜日[にちようび]の鎌倉[かまくら]',
    de: 'Sonntag in Kamakura',
    paragraphs: paragraphs(`
      先週[せんしゅう]の日曜日[にちようび]、友達[ともだち]のアンナさんと鎌倉[かまくら]へ行[い]きました。 | Letzten Sonntag bin ich mit meiner Freundin Anna nach Kamakura gefahren.
      朝[あさ]九時[くじ]に駅[えき]で会[あ]って、電車[でんしゃ]に乗[の]りました。 | Wir haben uns um neun Uhr morgens am Bahnhof getroffen und sind in den Zug gestiegen.
      一時間[いちじかん]ぐらいかかりました。 | Die Fahrt dauerte etwa eine Stunde.

      鎌倉[かまくら]には古[ふる]いお寺[てら]がたくさんあります。 | In Kamakura gibt es viele alte Tempel.
      有名[ゆうめい]な大仏[だいぶつ]も見[み]ました。 | Wir haben auch den berühmten Großen Buddha gesehen.
      とても大[おお]きかったです。 | Er war sehr groß.

      昼[ひる]ご飯[はん]は海[うみ]の近[ちか]くのレストランで魚[さかな]を食[た]べました。 | Zu Mittag haben wir in einem Restaurant am Meer Fisch gegessen.
      魚[さかな]は新[あたら]しくて、おいしかったです。 | Der Fisch war frisch und lecker.
      でも、ちょっと高[たか]かったです。 | Aber er war etwas teuer.

      午後[ごご]は雨[あめ]が降[ふ]りました。 | Am Nachmittag hat es geregnet.
      傘[かさ]がありませんでしたから、喫茶店[きっさてん]に入[はい]って、コーヒーを飲[の]みました。 | Weil wir keinen Regenschirm hatten, sind wir in ein Café gegangen und haben Kaffee getrunken.
      疲[つか]れましたが、とても楽[たの]しい一日[いちにち]でした。 | Ich war müde, aber es war ein sehr schöner Tag.
    `),
    words: words(`
      鎌倉[かまくら] | Kamakura (alte Stadt südlich von Tokyo)
      電車[でんしゃ]に乗[の]る | in den Zug steigen, mit dem Zug fahren
      かかる | (Zeit) dauern, (Geld) kosten
      お寺[てら] | buddhistischer Tempel
      有名[ゆうめい] | berühmt
      大仏[だいぶつ] | große Buddha-Statue
      海[うみ] | Meer
      新[あたら]しい | neu; frisch
      雨[あめ]が降[ふ]る | es regnet
      傘[かさ] | Regenschirm
      喫茶店[きっさてん] | Café
      疲[つか]れる | müde werden
    `),
    questions: [
      q('二人[ふたり]は何[なに]で鎌倉[かまくら]へ行[い]きましたか。', 'Womit sind die beiden nach Kamakura gefahren?', ['電車[でんしゃ]', 'バス', '車[くるま]', '自転車[じてんしゃ]'], '„駅で会って、電車に乗りました“.'),
      q('鎌倉[かまくら]まで、どのくらいかかりましたか。', 'Wie lange hat die Fahrt nach Kamakura gedauert?', ['一時間[いちじかん]ぐらい', '九時間[くじかん]ぐらい', '三十分[さんじゅっぷん]ぐらい', '二時間[にじかん]ぐらい'], '„一時間ぐらいかかりました“ – 九時 ist die Uhrzeit, zu der sie sich getroffen haben.'),
      q('昼[ひる]ご飯[はん]はどうでしたか。', 'Wie war das Mittagessen?', ['おいしかったですが、少[すこ]し高[たか]かったです', '安[やす]くて、おいしかったです', '高[たか]くて、おいしくなかったです', 'あまりおいしくなかったです'], '„新しくて、おいしかったです。でも、ちょっと高かったです“.'),
      q('二人[ふたり]はどうして喫茶店[きっさてん]に入[はい]りましたか。', 'Warum sind die beiden in ein Café gegangen?', ['雨[あめ]が降[ふ]って、傘[かさ]がありませんでしたから', 'コーヒーが大好[だいす]きですから', '昼[ひる]ご飯[はん]を食[た]べませんでしたから', '大仏[だいぶつ]が見[み]たかったですから'], 'Der Grund steht vor から: „傘がありませんでしたから“.')
    ]
  },
  {
    id: 'einladung',
    title: 'バーベキューのお誘[さそ]い',
    de: 'Einladung zum Grillen',
    paragraphs: paragraphs(`
      トーマスさん | Lieber Thomas,

      こんにちは。お元気[げんき]ですか。 | hallo! Wie geht es dir?
      東京[とうきょう]はもう暑[あつ]いですね。 | In Tokyo ist es schon heiß, nicht wahr?

      来週[らいしゅう]の土曜日[どようび]に、うちでバーベキューをします。 | Nächsten Samstag grillen wir bei mir zu Hause.
      大学[だいがく]の友達[ともだち]も五人[ごにん]ぐらい来[き]ます。 | Es kommen auch etwa fünf Freunde von der Uni.
      トーマスさんも一緒[いっしょ]に来[き]ませんか。 | Möchtest du nicht auch kommen?

      午後[ごご]三時[さんじ]からです。 | Es geht um drei Uhr nachmittags los.
      肉[にく]や野菜[やさい]は私[わたし]が買[か]います。 | Fleisch und Gemüse kaufe ich.
      飲[の]み物[もの]を少[すこ]し持[も]ってきてください。 | Bring bitte ein paar Getränke mit.
      うちは駅[えき]から歩[ある]いて五分[ごふん]です。 | Meine Wohnung ist fünf Minuten zu Fuß vom Bahnhof.
      地図[ちず]を送[おく]りますね。 | Ich schicke dir eine Karte.

      返事[へんじ]を待[ま]っています。 | Ich warte auf deine Antwort.
      ゆき | Yuki
    `),
    words: words(`
      お誘[さそ]い | Einladung
      お元気[げんき]ですか | Wie geht es dir/Ihnen?
      暑[あつ]い | heiß (Wetter)
      バーベキュー | Grillen, Barbecue
      一緒[いっしょ]に | zusammen
      〜ませんか | Möchtest du nicht …? (Einladung)
      肉[にく] | Fleisch
      野菜[やさい] | Gemüse
      持[も]ってくる | mitbringen
      地図[ちず] | (Land-)Karte, Stadtplan
      送[おく]る | schicken
      返事[へんじ] | Antwort
    `),
    questions: [
      q('バーベキューはいつですか。', 'Wann ist das Grillfest?', ['来週[らいしゅう]の土曜日[どようび]', '今週[こんしゅう]の土曜日[どようび]', '来週[らいしゅう]の日曜日[にちようび]', '明日[あした]'], '„来週の土曜日に、うちでバーベキューをします“.'),
      q('バーベキューは何時[なんじ]からですか。', 'Ab wie viel Uhr ist das Grillfest?', ['午後[ごご]三時[さんじ]', '午前[ごぜん]三時[さんじ]', '午後[ごご]五時[ごじ]', '午後[ごご]一時[いちじ]'], '„午後三時からです“ – 午後 = nachmittags.'),
      q('トーマスさんは何[なに]を持[も]っていきますか。', 'Was bringt Thomas mit?', ['飲[の]み物[もの]', '肉[にく]', '野菜[やさい]', '地図[ちず]'], '„飲み物を少し持ってきてください“ – Fleisch und Gemüse kauft Yuki.'),
      q('ゆきさんのうちは駅[えき]からどのくらいですか。', 'Wie weit ist Yukis Wohnung vom Bahnhof entfernt?', ['歩[ある]いて五分[ごふん]', '歩[ある]いて十五分[じゅうごふん]', 'バスで五分[ごふん]', '電車[でんしゃ]で五分[ごふん]'], '„うちは駅から歩いて五分です“.')
    ]
  },
  {
    id: 'reise',
    title: '初[はじ]めての日本[にほん]',
    de: 'Zum ersten Mal nach Japan',
    paragraphs: paragraphs(`
      私[わたし]は来年[らいねん]の春[はる]、初[はじ]めて日本[にほん]へ行[い]きます。 | Nächstes Frühjahr fahre ich zum ersten Mal nach Japan.
      二週間[にしゅうかん]旅行[りょこう]します。 | Ich reise zwei Wochen.

      まず東京[とうきょう]に五日[いつか]いて、それから京都[きょうと]と大阪[おおさか]へ行[い]きます。 | Zuerst bleibe ich fünf Tage in Tokyo, danach fahre ich nach Kyōto und Ōsaka.
      東京[とうきょう]では、浅草[あさくさ]のお寺[てら]や渋谷[しぶや]の店[みせ]を見[み]たいです。 | In Tokyo möchte ich mir den Tempel in Asakusa und die Läden in Shibuya ansehen.
      京都[きょうと]は東京[とうきょう]より古[ふる]い町[まち]で、有名[ゆうめい]なお寺[てら]や神社[じんじゃ]がたくさんあります。 | Kyōto ist eine ältere Stadt als Tokyo und hat viele berühmte Tempel und Schreine.
      大阪[おおさか]では、おいしいものをたくさん食[た]べたいです。 | In Ōsaka möchte ich viel Leckeres essen.

      日本[にほん]の春[はる]は桜[さくら]がとてもきれいです。 | Im japanischen Frühling sind die Kirschblüten wunderschön.
      でも、春[はる]はホテルが高[たか]いです。 | Aber im Frühling sind die Hotels teuer.
      ですから、ホテルより安[やす]いゲストハウスに泊[と]まります。 | Deshalb übernachte ich in Gästehäusern, die billiger als Hotels sind.

      今[いま]、毎日[まいにち]日本語[にほんご]を勉強[べんきょう]しています。 | Zurzeit lerne ich jeden Tag Japanisch.
      日本[にほん]の人[ひと]と日本語[にほんご]で話[はな]したいです。 | Ich möchte mit Japanern auf Japanisch sprechen.
      とても楽[たの]しみです。 | Ich freue mich sehr darauf.
    `),
    words: words(`
      初[はじ]めて | zum ersten Mal
      旅行[りょこう]する | reisen
      まず | zuerst
      五日[いつか] | fünf Tage; der Fünfte
      〜より | als (beim Vergleich)
      神社[じんじゃ] | Shintō-Schrein
      桜[さくら] | Kirschblüte, Kirschbaum
      ですから | deshalb
      ゲストハウス | Gästehaus, Pension
      泊[と]まる | übernachten
      楽[たの]しみ | Vorfreude; sich freuen auf
    `),
    questions: [
      q('この人[ひと]はいつ日本[にほん]へ行[い]きますか。', 'Wann fährt die Person nach Japan?', ['来年[らいねん]の春[はる]', '今年[ことし]の春[はる]', '来年[らいねん]の秋[あき]', '来月[らいげつ]'], '„来年の春、初めて日本へ行きます“.'),
      q('東京[とうきょう]に何日[なんにち]いますか。', 'Wie viele Tage bleibt sie in Tokyo?', ['五日[いつか]', '二週間[にしゅうかん]', '四日[よっか]', '十日[とおか]'], '„まず東京に五日いて…“ – zwei Wochen dauert die ganze Reise.'),
      q('大阪[おおさか]で何[なに]をしたいですか。', 'Was möchte sie in Ōsaka machen?', ['おいしいものを食[た]べたいです', 'お寺[てら]を見[み]たいです', '買[か]い物[もの]をしたいです', '桜[さくら]を見[み]たいです'], '„大阪では、おいしいものをたくさん食べたいです“ – Tempel stehen bei Tokyo und Kyōto.'),
      q('どうしてゲストハウスに泊[と]まりますか。', 'Warum übernachtet sie in Gästehäusern?', ['春[はる]はホテルが高[たか]いですから', 'ゲストハウスのほうがきれいですから', '日本[にほん]の人[ひと]と話[はな]したいですから', 'ホテルがありませんから'], '„春はホテルが高いです。ですから…“ – ですから leitet die Folge ein.')
    ]
  }
]
