// Die 167 Kanji der gängigen (inoffiziellen) JLPT-N4-Listen, thematisch gruppiert – ohne die 80 N5-Kanji
import { parseKanji as k, type N5Kanji } from './n5'

export interface N4Group {
  id: string
  title: string
  kanji: N5Kanji[]
}

export const n4Groups: N4Group[] = [
  {
    id: 'familie',
    title: 'Familie & Menschen',
    kanji: k(`
      私 | シ | わたし・わたくし | ich, privat | 私[わたし] | ich
      自 | ジ・シ | みずか(ら) | selbst | 自分[じぶん] | selbst, man selbst
      家 | カ・ケ | いえ・うち | Haus, Familie | 家族[かぞく] | Familie
      族 | ゾク | – | Sippe, Stamm | 水族館[すいぞくかん] | Aquarium
      親 | シン | おや・した(しい) | Eltern, vertraut | 両親[りょうしん] | Eltern
      兄 | キョウ・ケイ | あに | älterer Bruder | お兄[にい]さん | (dein) älterer Bruder
      弟 | ダイ・テイ | おとうと | jüngerer Bruder | 兄弟[きょうだい] | Geschwister
      姉 | シ | あね | ältere Schwester | お姉[ねえ]さん | (deine) ältere Schwester
      妹 | マイ | いもうと | jüngere Schwester | 姉妹[しまい] | Schwestern
      主 | シュ | ぬし・おも | Herr, Haupt- | 主人[しゅじん] | (mein) Ehemann
      者 | シャ | もの | Person | 学者[がくしゃ] | Wissenschaftler(in)
      員 | イン | – | Mitglied | 会社員[かいしゃいん] | Angestellte(r)
    `)
  },
  {
    id: 'koerper',
    title: 'Körper & Gesundheit',
    kanji: k(`
      体 | タイ | からだ | Körper | 体育[たいいく] | Sportunterricht
      心 | シン | こころ | Herz, Geist | 心配[しんぱい] | Sorge
      手 | シュ | て | Hand | 上手[じょうず] | geschickt, gut in
      足 | ソク | あし・た(りる) | Fuß, Bein; genügen | 足[た]りる | genügen
      口 | コウ | くち | Mund, Öffnung | 人口[じんこう] | Bevölkerung
      目 | モク | め | Auge | 目次[もくじ] | Inhaltsverzeichnis
      力 | リョク・リキ | ちから | Kraft | 体力[たいりょく] | Kondition
      病 | ビョウ | やまい | Krankheit | 病気[びょうき] | Krankheit, krank
      医 | イ | – | Medizin | 医者[いしゃ] | Arzt, Ärztin
      院 | イン | – | Institut | 病院[びょういん] | Krankenhaus
      死 | シ | し(ぬ) | Tod, sterben | 死[し]ぬ | sterben
    `)
  },
  {
    id: 'zeit',
    title: 'Zeit & Jahreszeiten',
    kanji: k(`
      春 | シュン | はる | Frühling | 春休[はるやす]み | Frühlingsferien
      夏 | カ・ゲ | なつ | Sommer | 夏休[なつやす]み | Sommerferien
      秋 | シュウ | あき | Herbst | 春夏秋冬[しゅんかしゅうとう] | die vier Jahreszeiten
      冬 | トウ | ふゆ | Winter | 冬休[ふゆやす]み | Winterferien
      朝 | チョウ | あさ | Morgen | 毎朝[まいあさ] | jeden Morgen
      昼 | チュウ | ひる | Mittag, Tag | 昼休[ひるやす]み | Mittagspause
      夕 | セキ | ゆう | Abend | 夕方[ゆうがた] | früher Abend
      夜 | ヤ | よる・よ | Nacht | 今夜[こんや] | heute Nacht
      週 | シュウ | – | Woche | 今週[こんしゅう] | diese Woche
      曜 | ヨウ | – | Wochentag | 日曜日[にちようび] | Sonntag
      代 | ダイ・タイ | か(わる)・よ | Zeitalter, Ersatz | 時代[じだい] | Epoche
      去 | キョ・コ | さ(る) | vergehen | 去年[きょねん] | letztes Jahr
      早 | ソウ | はや(い) | früh, schnell | 早[はや]く | früh, schnell
    `)
  },
  {
    id: 'eigenschaften',
    title: 'Farben & Eigenschaften',
    kanji: k(`
      赤 | セキ | あか・あか(い) | rot | 赤[あか]ちゃん | Baby
      青 | セイ | あお・あお(い) | blau, grün | 青年[せいねん] | junger Mann
      黒 | コク | くろ・くろ(い) | schwarz | 黒板[こくばん] | Tafel
      色 | ショク・シキ | いろ | Farbe | 景色[けしき] | Landschaft
      明 | メイ | あか(るい)・あ(ける) | hell | 説明[せつめい] | Erklärung
      真 | シン | ま | wahr, echt | 真[ま]っ白[しろ] | schneeweiß
      多 | タ | おお(い) | viel | 多分[たぶん] | wahrscheinlich
      少 | ショウ | すこ(し)・すく(ない) | wenig | 少[すこ]し | ein wenig
      新 | シン | あたら(しい) | neu | 新年[しんねん] | Neujahr
      古 | コ | ふる(い) | alt | 中古[ちゅうこ] | gebraucht
      広 | コウ | ひろ(い) | weit, breit | 広場[ひろば] | Platz
      強 | キョウ | つよ(い) | stark | 強風[きょうふう] | starker Wind
      安 | アン | やす(い) | billig, ruhig | 安心[あんしん] | beruhigt
      悪 | アク | わる(い) | schlecht | 悪口[わるぐち] | Lästerei
      近 | キン | ちか(い) | nah | 近所[きんじょ] | Nachbarschaft
      重 | ジュウ・チョウ | おも(い) | schwer | 体重[たいじゅう] | Körpergewicht
      楽 | ガク・ラク | たの(しい) | Freude, Musik | 楽[たの]しい | Spaß machend
    `)
  },
  {
    id: 'orte',
    title: 'Orte & Gebäude',
    kanji: k(`
      店 | テン | みせ | Laden | 店員[てんいん] | Verkäufer(in)
      屋 | オク | や | Dach, Laden | 本屋[ほんや] | Buchhandlung
      館 | カン | – | großes Gebäude | 図書館[としょかん] | Bibliothek
      堂 | ドウ | – | Halle | 食堂[しょくどう] | Kantine
      室 | シツ | – | Raum | 教室[きょうしつ] | Klassenzimmer
      駅 | エキ | – | Bahnhof | 駅員[えきいん] | Bahnhofsangestellte(r)
      町 | チョウ | まち | Stadt(viertel) | 下町[したまち] | Altstadt
      京 | キョウ・ケイ | – | Hauptstadt | 京都[きょうと] | Kyōto
      道 | ドウ | みち | Weg | 水道[すいどう] | Wasserleitung
      地 | チ・ジ | – | Erde, Boden | 地震[じしん] | Erdbeben
      場 | ジョウ | ば | Ort, Platz | 場所[ばしょ] | Ort
      界 | カイ | – | Welt, Grenze | 世界[せかい] | Welt
      世 | セ・セイ | よ | Welt, Generation | お世話[せわ] | Fürsorge
      台 | ダイ・タイ | – | Sockel; Zählwort für Geräte | 台所[だいどころ] | Küche
      図 | ズ・ト | はか(る) | Plan, Zeichnung | 地図[ちず] | Landkarte
    `)
  },
  {
    id: 'natur',
    title: 'Natur & Tiere',
    kanji: k(`
      花 | カ | はな | Blume | 花見[はなみ] | Kirschblütenschau
      風 | フウ | かぜ | Wind | 台風[たいふう] | Taifun
      空 | クウ | そら・あ(く)・から | Himmel, leer | 空港[くうこう] | Flughafen
      海 | カイ | うみ | Meer | 海外[かいがい] | Ausland (Übersee)
      野 | ヤ | の | Feld | 野菜[やさい] | Gemüse
      田 | デン | た | Reisfeld | 田中[たなか] | Tanaka (Name)
      犬 | ケン | いぬ | Hund | 子犬[こいぬ] | Welpe
      鳥 | チョウ | とり | Vogel | 小鳥[ことり] | Vögelchen
      牛 | ギュウ | うし | Rind | 牛乳[ぎゅうにゅう] | Milch
      魚 | ギョ | さかな・うお | Fisch | 金魚[きんぎょ] | Goldfisch
    `)
  },
  {
    id: 'essen',
    title: 'Essen & Trinken',
    kanji: k(`
      肉 | ニク | – | Fleisch | 牛肉[ぎゅうにく] | Rindfleisch
      飯 | ハン | めし | Reis, Mahlzeit | ご飯[はん] | Reis, Mahlzeit
      茶 | チャ・サ | – | Tee | 喫茶店[きっさてん] | Café
      飲 | イン | の(む) | trinken | 飲[の]み物[もの] | Getränk
      味 | ミ | あじ | Geschmack | 意味[いみ] | Bedeutung
      料 | リョウ | – | Gebühr, Material | 料理[りょうり] | Kochen, Gericht
      洋 | ヨウ | – | Ozean, westlich | 西洋[せいよう] | der Westen
    `)
  },
  {
    id: 'lernen',
    title: 'Lernen & Prüfungen',
    kanji: k(`
      教 | キョウ | おし(える) | lehren | 教会[きょうかい] | Kirche
      習 | シュウ | なら(う) | lernen, üben | 練習[れんしゅう] | Übung
      勉 | ベン | – | sich bemühen | 勉強[べんきょう] | Lernen
      研 | ケン | と(ぐ) | schleifen, forschen | 研修[けんしゅう] | Fortbildung
      究 | キュウ | きわ(める) | erforschen | 研究[けんきゅう] | Forschung
      試 | シ | ため(す) | versuchen | 試合[しあい] | Wettkampf, Spiel
      験 | ケン | – | Prüfung | 試験[しけん] | Prüfung
      質 | シツ | – | Qualität | 質問[しつもん] | Frage
      問 | モン | と(う) | fragen | 問題[もんだい] | Problem, Aufgabe
      題 | ダイ | – | Thema | 宿題[しゅくだい] | Hausaufgabe
      答 | トウ | こた(える) | antworten | 答[こた]え | Antwort
    `)
  },
  {
    id: 'sprache',
    title: 'Sprache & Denken',
    kanji: k(`
      英 | エイ | – | England, hervorragend | 英語[えいご] | Englisch
      漢 | カン | – | China (Han) | 漢字[かんじ] | Kanji
      字 | ジ | – | Schriftzeichen | 文字[もじ] | Schriftzeichen
      文 | ブン・モン | ふみ | Satz, Text | 文化[ぶんか] | Kultur
      写 | シャ | うつ(す) | abbilden | 写真[しゃしん] | Foto
      言 | ゲン・ゴン | い(う)・こと | sagen | 言葉[ことば] | Wort, Sprache
      考 | コウ | かんが(える) | überlegen | 考[かんが]え | Gedanke, Idee
      知 | チ | し(る) | wissen | 知[し]り合[あ]い | Bekannte(r)
      思 | シ | おも(う) | denken, meinen | 思[おも]い出[で] | Erinnerung
      意 | イ | – | Sinn, Absicht | 意見[いけん] | Meinung
      理 | リ | – | Vernunft, Logik | 無理[むり] | unmöglich, zu viel
    `)
  },
  {
    id: 'arbeit',
    title: 'Arbeit & Gesellschaft',
    kanji: k(`
      仕 | シ | つか(える) | dienen | 仕事[しごと] | Arbeit
      事 | ジ | こと | Sache | 火事[かじ] | Brand
      社 | シャ | やしろ | Firma, Schrein | 会社[かいしゃ] | Firma
      会 | カイ | あ(う) | treffen | 会議[かいぎ] | Besprechung
      業 | ギョウ | – | Geschäft, Beruf | 授業[じゅぎょう] | Unterricht
      工 | コウ・ク | – | Handwerk | 工場[こうじょう] | Fabrik
      作 | サク・サ | つく(る) | machen | 作文[さくぶん] | Aufsatz
      用 | ヨウ | もち(いる) | benutzen | 用事[ようじ] | Erledigung
      使 | シ | つか(う) | benutzen | 大使館[たいしかん] | Botschaft
      発 | ハツ | – | aufbrechen, äußern | 出発[しゅっぱつ] | Abfahrt
      公 | コウ | おおやけ | öffentlich | 公園[こうえん] | Park
      品 | ヒン | しな | Ware | 品物[しなもの] | Ware, Artikel
      計 | ケイ | はか(る) | messen | 時計[とけい] | Uhr
      画 | ガ・カク | – | Bild | 画家[がか] | Maler(in)
      物 | ブツ・モツ | もの | Ding | 動物[どうぶつ] | Tier
      銀 | ギン | – | Silber | 銀行[ぎんこう] | Bank
      建 | ケン | た(てる) | bauen | 建物[たてもの] | Gebäude
    `)
  },
  {
    id: 'bewegung',
    title: 'Bewegung & Verkehr',
    kanji: k(`
      走 | ソウ | はし(る) | rennen | 走[はし]る | rennen
      歩 | ホ | ある(く) | zu Fuß gehen | 散歩[さんぽ] | Spaziergang
      通 | ツウ | とお(る)・かよ(う) | durchgehen, pendeln | 交通[こうつう] | Verkehr
      運 | ウン | はこ(ぶ) | tragen; Glück | 運動[うんどう] | Bewegung, Sport
      転 | テン | ころ(ぶ) | rollen, drehen | 運転[うんてん] | Fahren (Auto)
      送 | ソウ | おく(る) | schicken | 放送[ほうそう] | Sendung
      帰 | キ | かえ(る) | zurückkehren | 帰国[きこく] | Heimkehr
      起 | キ | お(きる) | aufstehen | 起[お]きる | aufstehen
      着 | チャク | き(る)・つ(く) | anziehen, ankommen | 着物[きもの] | Kimono
      止 | シ | と(まる)・と(める) | anhalten | 中止[ちゅうし] | Absage
      動 | ドウ | うご(く) | sich bewegen | 自動車[じどうしゃ] | Auto
      旅 | リョ | たび | Reise | 旅館[りょかん] | japanisches Gasthaus
      急 | キュウ | いそ(ぐ) | eilig | 急行[きゅうこう] | Eilzug
      立 | リツ | た(つ) | stehen | 国立[こくりつ] | staatlich
    `)
  },
  {
    id: 'alltag',
    title: 'Alltag & Handeln',
    kanji: k(`
      買 | バイ | か(う) | kaufen | 買[か]い物[もの] | Einkauf
      売 | バイ | う(る) | verkaufen | 売[う]り場[ば] | Verkaufsabteilung
      貸 | タイ | か(す) | verleihen | 貸[か]す | (ver)leihen
      借 | シャク | か(りる) | sich leihen | 借金[しゃっきん] | Schulden
      持 | ジ | も(つ) | halten, haben | 気持[きも]ち | Gefühl
      待 | タイ | ま(つ) | warten | 招待[しょうたい] | Einladung
      住 | ジュウ | す(む) | wohnen | 住所[じゅうしょ] | Adresse
      始 | シ | はじ(める)・はじ(まる) | beginnen | 開始[かいし] | Beginn
      終 | シュウ | お(わる) | enden | 終電[しゅうでん] | letzter Zug
      開 | カイ | あ(ける)・ひら(く) | öffnen | 開[あ]ける | öffnen
      集 | シュウ | あつ(める) | sammeln | 集合[しゅうごう] | Treffen, Sammeln
      歌 | カ | うた・うた(う) | Lied, singen | 歌手[かしゅ] | Sänger(in)
      服 | フク | – | Kleidung | 洋服[ようふく] | (westliche) Kleidung
      紙 | シ | かみ | Papier | 手紙[てがみ] | Brief
      映 | エイ | うつ(る) | spiegeln | 映画[えいが] | Film
      音 | オン | おと・ね | Ton, Klang | 音楽[おんがく] | Musik
      切 | セツ | き(る) | schneiden | 大切[たいせつ] | wichtig
      注 | チュウ | そそ(ぐ) | gießen; beachten | 注意[ちゅうい] | Vorsicht
    `)
  },
  {
    id: 'begriffe',
    title: 'Grundbegriffe',
    kanji: k(`
      不 | フ・ブ | – | un-, nicht | 不便[ふべん] | unpraktisch
      無 | ム・ブ | な(い) | nichts, ohne | 無料[むりょう] | kostenlos
      有 | ユウ・ウ | あ(る) | haben, existieren | 有名[ゆうめい] | berühmt
      同 | ドウ | おな(じ) | gleich | 同[おな]じ | gleich
      別 | ベツ | わか(れる) | trennen, anders | 別々[べつべつ] | getrennt
      特 | トク | – | besonders | 特[とく]に | besonders
      正 | セイ・ショウ | ただ(しい) | richtig | 正月[しょうがつ] | Neujahr (Fest)
      以 | イ | – | mittels, ab | 以上[いじょう] | mehr als, obig
      元 | ゲン・ガン | もと | Ursprung | 元気[げんき] | munter, gesund
      方 | ホウ | かた | Richtung, Person | 方法[ほうほう] | Methode
      度 | ド | たび | Mal, Grad | 今度[こんど] | nächstes Mal
    `)
  }
]

export const findN4Group = (id: string) => n4Groups.find((g) => g.id === id)
