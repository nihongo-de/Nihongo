import { parseRuby } from '../utils/ruby'
import { toRomaji } from '../utils/romaji'

export interface VocabWord {
  /** Ruby-Syntax: お母[かあ]さん */
  jp: string
  word: string
  kana: string
  romaji: string
  de: string
}

export interface VocabTopic {
  id: string
  title: string
  words: VocabWord[]
}

/** Zeilen `Wort in Ruby-Syntax | Deutsch [| Rōmaji, falls die automatische Umschrift nicht passt]` */
function words(block: string): VocabWord[] {
  return block
    .trim()
    .split('\n')
    .map((line) => {
      const [jp, de, romaji] = line.split('|').map((s) => s.trim())
      const segs = parseRuby(jp)
      const kana = segs.map((s) => s.rt ?? s.text)
      return { jp, word: segs.map((s) => s.text).join(''), kana: kana.join(''), romaji: romaji ?? toRomaji(kana).replace(/〜/g, '~'), de }
    })
}

const topic = (id: string, title: string, block: string): VocabTopic => ({ id, title, words: words(block) })

// N5-Grundwortschatz nach Themen – Datenbasis für die Themenseite, Druckvorlagen und Karteikarten
export const vocabN5: VocabTopic[] = [
  topic('familie', 'Familie', `
    家族[かぞく] | Familie
    両親[りょうしん] | Eltern
    父[ちち] | (mein) Vater
    お父[とう]さん | Vater (fremder / Anrede)
    母[はは] | (meine) Mutter
    お母[かあ]さん | Mutter (fremde / Anrede)
    兄[あに] | (mein) älterer Bruder
    お兄[にい]さん | älterer Bruder (fremder / Anrede)
    姉[あね] | (meine) ältere Schwester
    お姉[ねえ]さん | ältere Schwester (fremde / Anrede)
    弟[おとうと] | (mein) jüngerer Bruder
    弟[おとうと]さん | jüngerer Bruder (fremder)
    妹[いもうと] | (meine) jüngere Schwester
    妹[いもうと]さん | jüngere Schwester (fremde)
    兄弟[きょうだい] | Geschwister
    祖父[そふ] | (mein) Großvater
    おじいさん | Großvater (fremder); älterer Herr
    祖母[そぼ] | (meine) Großmutter
    おばあさん | Großmutter (fremde); ältere Dame
    夫[おっと] | (mein) Ehemann
    ご主人[しゅじん] | Ehemann (fremder)
    妻[つま] | (meine) Ehefrau
    奥[おく]さん | Ehefrau (fremde)
    子[こ]ども | Kind
    息子[むすこ] | (mein) Sohn
    娘[むすめ] | (meine) Tochter
    おじさん | Onkel; Mann mittleren Alters
    おばさん | Tante; Frau mittleren Alters
  `),
  topic('menschen', 'Menschen & Berufe', `
    人[ひと] | Mensch, Person
    男[おとこ]の人[ひと] | Mann | otoko no hito
    女[おんな]の人[ひと] | Frau | onna no hito
    男[おとこ]の子[こ] | Junge | otoko no ko
    女[おんな]の子[こ] | Mädchen | onna no ko
    大人[おとな] | Erwachsener
    友達[ともだち] | Freund, Freundin
    私[わたし] | ich
    あなた | du, Sie (meist vermieden)
    皆[みな]さん | alle (Anrede)
    先生[せんせい] | Lehrer/in
    学生[がくせい] | Student/in
    生徒[せいと] | Schüler/in
    留学生[りゅうがくせい] | Austauschstudent/in
    医者[いしゃ] | Arzt, Ärztin
    会社員[かいしゃいん] | Angestellte/r
    お巡[まわ]りさん | Polizist/in
    外国人[がいこくじん] | Ausländer/in
    ドイツ人[じん] | Deutsche/r
    日本人[にほんじん] | Japaner/in
    名前[なまえ] | Name
  `),
  topic('koerper', 'Körper & Gesundheit', `
    体[からだ] | Körper
    頭[あたま] | Kopf
    顔[かお] | Gesicht
    目[め] | Auge
    耳[みみ] | Ohr
    鼻[はな] | Nase
    口[くち] | Mund
    歯[は] | Zahn
    首[くび] | Hals, Nacken
    手[て] | Hand
    指[ゆび] | Finger
    お腹[なか] | Bauch
    足[あし] | Fuß, Bein
    声[こえ] | Stimme
    病気[びょうき] | Krankheit; krank
    風邪[かぜ] | Erkältung
    薬[くすり] | Medikament
    病院[びょういん] | Krankenhaus, Arztpraxis
    元気[げんき] | gesund, munter
    痛[いた]い | schmerzhaft, tut weh
  `),
  topic('farben', 'Farben', `
    色[いろ] | Farbe
    何色[なにいろ] | welche Farbe?
    赤[あか]い | rot
    青[あお]い | blau (auch: grün bei Ampel, Gemüse)
    白[しろ]い | weiß
    黒[くろ]い | schwarz
    黄色[きいろ]い | gelb
    茶色[ちゃいろ]い | braun
    緑[みどり] | grün
    紫[むらさき] | lila, violett
    灰色[はいいろ] | grau
    ピンク | rosa, pink
    オレンジ | orange
    金色[きんいろ] | golden
    銀色[ぎんいろ] | silbern
  `),
  topic('essen', 'Essen & Trinken', `
    ご飯[はん] | (gekochter) Reis; Mahlzeit
    朝[あさ]ご飯[はん] | Frühstück
    昼[ひる]ご飯[はん] | Mittagessen
    晩[ばん]ご飯[はん] | Abendessen
    料理[りょうり] | Gericht; Kochen
    パン | Brot
    肉[にく] | Fleisch
    魚[さかな] | Fisch
    卵[たまご] | Ei
    野菜[やさい] | Gemüse
    果物[くだもの] | Obst
    りんご | Apfel
    お菓子[かし] | Süßigkeiten, Snacks
    水[みず] | (kaltes) Wasser
    お湯[ゆ] | heißes Wasser
    お茶[ちゃ] | (grüner) Tee
    紅茶[こうちゃ] | schwarzer Tee
    コーヒー | Kaffee
    牛乳[ぎゅうにゅう] | Milch
    ジュース | Saft
    お酒[さけ] | Alkohol; Sake
    ビール | Bier
    砂糖[さとう] | Zucker
    塩[しお] | Salz
    醤油[しょうゆ] | Sojasoße
    箸[はし] | Essstäbchen
    お皿[さら] | Teller
    コップ | Glas, Becher
    お弁当[べんとう] | Lunchbox, Bentō
    レストラン | Restaurant
    食堂[しょくどう] | Kantine, einfaches Lokal
    おいしい | lecker
    まずい | schmeckt nicht
    甘[あま]い | süß
    辛[から]い | scharf
    食[た]べる | essen
    飲[の]む | trinken
    お腹[なか]が空[す]く | Hunger bekommen | onaka ga suku
  `),
  topic('verkehr', 'Verkehr & Wege', `
    電車[でんしゃ] | Zug, Bahn
    地下鉄[ちかてつ] | U-Bahn
    新幹線[しんかんせん] | Shinkansen
    バス | Bus
    タクシー | Taxi
    車[くるま] | Auto
    自転車[じてんしゃ] | Fahrrad
    飛行機[ひこうき] | Flugzeug
    船[ふね] | Schiff
    駅[えき] | Bahnhof
    空港[くうこう] | Flughafen
    切符[きっぷ] | Fahrkarte
    道[みち] | Weg, Straße
    交差点[こうさてん] | Kreuzung
    信号[しんごう] | Ampel
    橋[はし] | Brücke
    右[みぎ] | rechts
    左[ひだり] | links
    まっすぐ | geradeaus
    乗[の]る | einsteigen, fahren (mit に)
    降[お]りる | aussteigen (mit を)
    曲[ま]がる | abbiegen
    渡[わた]る | überqueren
    歩[ある]く | zu Fuß gehen
    近[ちか]い | nah
    遠[とお]い | weit weg
  `),
  topic('orte', 'Orte in der Stadt', `
    町[まち] | Stadt, Viertel
    店[みせ] | Laden, Geschäft
    銀行[ぎんこう] | Bank
    郵便局[ゆうびんきょく] | Post
    図書館[としょかん] | Bibliothek
    公園[こうえん] | Park
    大使館[たいしかん] | Botschaft
    交番[こうばん] | Polizeiposten
    喫茶店[きっさてん] | Café
    映画館[えいがかん] | Kino
    本屋[ほんや] | Buchhandlung
    八百屋[やおや] | Gemüseladen
    ホテル | Hotel
    デパート | Kaufhaus
    スーパー | Supermarkt
    コンビニ | Kombini (24-h-Laden)
    建物[たてもの] | Gebäude
    所[ところ] | Ort, Stelle
    入口[いりぐち] | Eingang
    出口[でぐち] | Ausgang
    トイレ | Toilette
  `),
  topic('wetter', 'Wetter & Natur', `
    天気[てんき] | Wetter
    天気予報[てんきよほう] | Wettervorhersage
    晴[は]れ | sonnig, heiter
    曇[くも]り | bewölkt
    雨[あめ] | Regen
    雪[ゆき] | Schnee
    風[かぜ] | Wind
    台風[たいふう] | Taifun
    空[そら] | Himmel
    雲[くも] | Wolke
    傘[かさ] | Regenschirm
    暑[あつ]い | heiß (Wetter)
    寒[さむ]い | kalt (Wetter)
    暖[あたた]かい | warm
    涼[すず]しい | kühl, angenehm frisch
    降[ふ]る | fallen (Regen, Schnee)
    吹[ふ]く | wehen
    山[やま] | Berg
    川[かわ] | Fluss
    海[うみ] | Meer
    池[いけ] | Teich
    木[き] | Baum
    花[はな] | Blume, Blüte
    動物[どうぶつ] | Tier
    犬[いぬ] | Hund
    猫[ねこ] | Katze
    鳥[とり] | Vogel
  `),
  topic('einkaufen', 'Einkaufen & Geld', `
    買[か]い物[もの] | Einkauf, Einkaufen
    お金[かね] | Geld
    〜円[えん] | … Yen
    財布[さいふ] | Portemonnaie
    いくら | wie viel (kostet)?
    高[たか]い | teuer; hoch
    安[やす]い | billig
    買[か]う | kaufen
    売[う]る | verkaufen
    払[はら]う | bezahlen
    売[う]り場[ば] | Abteilung, Verkaufsstand
    おつり | Wechselgeld
    袋[ふくろ] | Tüte
    レジ | Kasse
    カード | Karte (Kredit-, Punkte-)
    品物[しなもの] | Ware
    〜をください | … bitte (geben Sie mir) | ~ o kudasai
    いらっしゃいませ | Willkommen! (im Laden)
  `),
  topic('kleidung', 'Kleidung', `
    服[ふく] | Kleidung
    洋服[ようふく] | (westliche) Kleidung
    着物[きもの] | Kimono
    シャツ | Hemd, Shirt
    セーター | Pullover
    コート | Mantel
    ズボン | Hose
    スカート | Rock
    靴[くつ] | Schuhe
    靴下[くつした] | Socken
    帽子[ぼうし] | Mütze, Hut
    眼鏡[めがね] | Brille
    ネクタイ | Krawatte
    かばん | Tasche
    ポケット | Hosentasche
    着[き]る | anziehen (Oberkörper)
    履[は]く | anziehen (Hose, Schuhe)
    かぶる | aufsetzen (Hut)
    かける | aufsetzen (Brille)
    締[し]める | umbinden (Krawatte)
    脱[ぬ]ぐ | ausziehen
  `),
  topic('wohnen', 'Haus & Wohnen', `
    家[いえ] | Haus, Zuhause
    うち | Zuhause, bei uns
    アパート | Wohnung, Mietshaus
    部屋[へや] | Zimmer
    台所[だいどころ] | Küche
    お風呂[ふろ] | Bad(ewanne)
    窓[まど] | Fenster
    ドア | Tür
    階段[かいだん] | Treppe
    〜階[かい] | …-ter Stock
    庭[にわ] | Garten
    机[つくえ] | Schreibtisch
    椅子[いす] | Stuhl
    テーブル | Tisch
    ベッド | Bett
    本棚[ほんだな] | Bücherregal
    冷蔵庫[れいぞうこ] | Kühlschrank
    テレビ | Fernseher
    電気[でんき] | Strom; Licht
    電話[でんわ] | Telefon
    鍵[かぎ] | Schlüssel
    住[す]む | wohnen (mit に)
    掃除[そうじ]する | putzen | sōji suru
    洗濯[せんたく]する | Wäsche waschen | sentaku suru
  `),
  topic('schule', 'Schule & Arbeit', `
    学校[がっこう] | Schule
    大学[だいがく] | Universität
    教室[きょうしつ] | Klassenzimmer
    授業[じゅぎょう] | Unterricht
    宿題[しゅくだい] | Hausaufgabe
    試験[しけん] | Prüfung
    質問[しつもん] | Frage
    問題[もんだい] | Aufgabe, Problem
    答[こた]え | Antwort
    言葉[ことば] | Wort, Sprache
    漢字[かんじ] | Kanji
    辞書[じしょ] | Wörterbuch
    本[ほん] | Buch
    ノート | Heft
    鉛筆[えんぴつ] | Bleistift
    紙[かみ] | Papier
    勉強[べんきょう]する | lernen | benkyō suru
    教[おし]える | unterrichten; erklären
    習[なら]う | lernen (bei jemandem)
    覚[おぼ]える | sich merken
    分[わ]かる | verstehen
    会社[かいしゃ] | Firma
    仕事[しごと] | Arbeit
    働[はたら]く | arbeiten
    休[やす]み | Pause, freier Tag, Ferien
  `),
  topic('freizeit', 'Freizeit & Hobbys', `
    趣味[しゅみ] | Hobby
    映画[えいが] | Film
    音楽[おんがく] | Musik
    歌[うた] | Lied
    写真[しゃしん] | Foto
    絵[え] | Bild, Gemälde
    旅行[りょこう] | Reise
    散歩[さんぽ] | Spaziergang
    スポーツ | Sport
    サッカー | Fußball
    野球[やきゅう] | Baseball
    ゲーム | (Computer-)Spiel
    パーティー | Party
    ギター | Gitarre
    ピアノ | Klavier
    遊[あそ]ぶ | spielen, Spaß haben
    泳[およ]ぐ | schwimmen
    歌[うた]う | singen
    弾[ひ]く | spielen (Instrument)
    撮[と]る | (Foto) machen
  `),
  topic('verben', 'Wichtige Verben', `
    行[い]く | gehen, fahren
    来[く]る | kommen
    帰[かえ]る | nach Hause gehen, zurückkehren
    する | machen, tun
    ある | es gibt, sein (Dinge)
    いる | es gibt, sein (Lebewesen)
    見[み]る | sehen, schauen
    聞[き]く | hören; fragen
    読[よ]む | lesen
    書[か]く | schreiben
    話[はな]す | sprechen
    言[い]う | sagen
    会[あ]う | treffen (mit に)
    待[ま]つ | warten
    持[も]つ | halten, tragen
    使[つか]う | benutzen
    作[つく]る | machen, herstellen
    起[お]きる | aufstehen, aufwachen
    寝[ね]る | schlafen gehen
    始[はじ]まる | anfangen
    終[お]わる | enden
    開[あ]ける | öffnen
    閉[し]める | schließen
    入[はい]る | hineingehen
    出[で]る | hinausgehen
    出[だ]す | herausnehmen; abschicken
    立[た]つ | aufstehen, stehen
    座[すわ]る | sich setzen
    知[し]る | erfahren (知っている = wissen)
    思[おも]う | denken, meinen
    走[はし]る | rennen
    休[やす]む | sich ausruhen; fehlen
    洗[あら]う | waschen
    貸[か]す | (ver)leihen
    借[か]りる | (aus)leihen
    忘[わす]れる | vergessen
    呼[よ]ぶ | rufen
  `),
  topic('adjektive', 'Wichtige Adjektive', `
    大[おお]きい | groß
    小[ちい]さい | klein
    新[あたら]しい | neu
    古[ふる]い | alt (Dinge)
    低[ひく]い | niedrig
    長[なが]い | lang
    短[みじか]い | kurz
    多[おお]い | viele
    少[すく]ない | wenige
    早[はや]い | früh
    速[はや]い | schnell
    遅[おそ]い | spät; langsam
    広[ひろ]い | weit, geräumig
    狭[せま]い | eng
    明[あか]るい | hell
    暗[くら]い | dunkel
    重[おも]い | schwer
    軽[かる]い | leicht (Gewicht)
    難[むずか]しい | schwierig
    易[やさ]しい | leicht, einfach
    優[やさ]しい | nett, gütig
    楽[たの]しい | macht Spaß
    面白[おもしろ]い | interessant, lustig
    つまらない | langweilig
    忙[いそが]しい | beschäftigt
    若[わか]い | jung
    いい | gut
    悪[わる]い | schlecht
    好[す]き | mögen (な)
    嫌[きら]い | nicht mögen (な)
    上手[じょうず] | gut in etwas (な)
    下手[へた] | schlecht in etwas (な)
    静[しず]か | ruhig, leise (な)
    にぎやか | belebt, lebhaft (な)
    きれい | schön; sauber (な)
    有名[ゆうめい] | berühmt (な)
    便利[べんり] | praktisch (な)
    大切[たいせつ] | wichtig, wertvoll (な)
    大丈夫[だいじょうぶ] | in Ordnung (な)
    暇[ひま] | frei, Zeit haben (な)
    親切[しんせつ] | freundlich, hilfsbereit (な)
  `)
]

export const vocabTopic = (id: string) => vocabN5.find((t) => t.id === id)
