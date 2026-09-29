export interface ParticleItem {
  /** Satz in Ruby-Syntax, ＿ markiert die Lücke */
  jp: string
  /** Richtige Antwort(en), mehrere mit / getrennt; - = keine Partikel */
  answer: string
  options: string
  de: string
  why: string
}

const q = (jp: string, answer: string, options: string, de: string, why: string): ParticleItem => ({
  jp,
  answer,
  options,
  de,
  why
})

export const particleSets: Record<string, ParticleItem[]> = {
  grundlagen: [
    q('私[わたし]＿学生[がくせい]です。', 'は', 'は が を の', 'Ich bin Student.', 'は markiert das Thema: „Was mich betrifft …“'),
    q('あそこに猫[ねこ]＿います。', 'が', 'は が を も', 'Dort ist eine Katze.', 'Neue Information bei いる／ある steht mit が.'),
    q('コーヒー＿飲[の]みます。', 'を', 'を が に で', 'Ich trinke Kaffee.', 'Direktes Objekt: Was trinke ich? → を.'),
    q('これは私[わたし]＿本[ほん]です。', 'の', 'の は を と', 'Das ist mein Buch.', 'A の B: Das Buch gehört zu mir.'),
    q('田中[たなか]さんは学生[がくせい]です。私[わたし]＿学生[がくせい]です。', 'も', 'も は が の', 'Herr Tanaka ist Student. Ich bin auch Student.', 'も = „auch“ und ersetzt は.'),
    q('誰[だれ]＿来[き]ましたか。', 'が', 'は が を も', 'Wer ist gekommen?', 'Fragewörter als Subjekt stehen immer mit が.'),
    q('日本語[にほんご]＿分[わ]かります。', 'が', 'が を で に', 'Ich verstehe Japanisch.', '分かる gehört zu den festen Verbindungen mit が.'),
    q('音楽[おんがく]＿好[す]きです。', 'が', 'が を に で', 'Ich mag Musik.', '好き steht mit が, nicht mit を.'),
    q('肉[にく]は食[た]べますが、魚[さかな]＿食[た]べません。', 'は', 'は が も の', 'Fleisch esse ich, aber Fisch nicht.', 'Kontrast-は: Fleisch ja – Fisch dagegen nicht.'),
    q('何[なに]＿食[た]べませんでした。', 'も', 'も を が は', 'Ich habe nichts gegessen.', 'Fragewort + も + Verneinung = „überhaupt nichts“.'),
    q('日本語[にほんご]＿先生[せんせい]', 'の', 'の と は が', 'Japanischlehrer(in)', 'の verbindet zwei Nomen: Lehrer „von“ Japanisch.')
  ],
  ort: [
    q('学校[がっこう]＿行[い]きます。', 'に/へ', 'に で を から', 'Ich gehe zur Schule.', 'Ziel einer Bewegung: に (oder へ für die Richtung).'),
    q('図書館[としょかん]＿勉強[べんきょう]します。', 'で', 'で に を へ', 'Ich lerne in der Bibliothek.', 'Ort einer Handlung → で.'),
    q('七時[しちじ]＿起[お]きます。', 'に', 'に で を -', 'Ich stehe um 7 Uhr auf.', 'Konkrete Uhrzeit → に.'),
    q('明日[あした]＿行[い]きます。', '-', 'に で を -', 'Ich gehe morgen.', 'Relative Zeitwörter wie 明日, 今日, 毎日 stehen ohne Partikel.'),
    q('電車[でんしゃ]＿行[い]きます。', 'で', 'で に を と', 'Ich fahre mit dem Zug.', 'Mittel / Verkehrsmittel → で.'),
    q('部屋[へや]＿猫[ねこ]がいます。', 'に', 'に で を へ', 'Im Zimmer ist eine Katze.', 'Ort des Seins bei いる／ある → に, nicht で.'),
    q('家[いえ]＿出[で]ます。', 'を', 'を に で へ', 'Ich verlasse das Haus.', 'Ort, der verlassen wird → を.'),
    q('公園[こうえん]＿散歩[さんぽ]します。', 'を/で', 'を で に へ', 'Ich spaziere durch den Park.', 'Beides geht: を betont die Strecke, で den Ort der Handlung.'),
    q('九時[くじ]＿五時[ごじ]まで働[はたら]きます。', 'から', 'から まで に で', 'Ich arbeite von 9 bis 17 Uhr.', 'Startpunkt → から.'),
    q('駅[えき]から家[いえ]＿歩[ある]きます。', 'まで', 'まで から に で', 'Ich gehe vom Bahnhof bis nach Hause zu Fuß.', 'Endpunkt → まで.'),
    q('友達[ともだち]＿本[ほん]をあげます。', 'に', 'に を で と', 'Ich gebe meinem Freund ein Buch.', 'Empfänger → に.'),
    q('箸[はし]＿食[た]べます。', 'で', 'で を に と', 'Ich esse mit Stäbchen.', 'Werkzeug → で.')
  ],
  gemischt: [
    q('パン＿牛乳[ぎゅうにゅう]を買[か]いました。', 'と', 'と や も の', 'Ich habe Brot und Milch gekauft (genau diese beiden).', 'Vollständige Aufzählung → と.'),
    q('りんご＿バナナなどを買[か]いました。', 'や', 'や と も の', 'Ich habe unter anderem Äpfel und Bananen gekauft.', 'Beispielhafte Aufzählung (mit など) → や.'),
    q('友達[ともだち]＿映画[えいが]を見[み]ます。', 'と', 'と に で を', 'Ich sehe mit einem Freund einen Film.', 'Zusammen mit jemandem → と.'),
    q('元気[げんき]です＿。', 'か', 'か ね よ の', 'Geht es dir gut?', 'Frage → か.'),
    q('いい天気[てんき]です＿。', 'ね', 'ね よ か の', 'Schönes Wetter, nicht wahr?', 'Zustimmung suchen → ね.'),
    q('この店[みせ]、おいしいです＿。', 'よ', 'よ ね か の', 'Der Laden hier ist lecker, sag ich dir!', 'Neue Information mitteilen → よ.'),
    q('雨[あめ]です＿、行[い]きません。', 'から', 'から まで で と', 'Weil es regnet, gehe ich nicht.', 'Nach einem Satz bedeutet から „weil“.'),
    q('京都[きょうと]に＿行[い]きました。', 'も', 'も は が を', 'Ich war auch in Kyoto.', 'も tritt hinter に: にも = „auch nach“.'),
    q('風邪[かぜ]＿休[やす]みます。', 'で', 'で に を と', 'Wegen einer Erkältung fehle ich.', 'Grund → で.'),
    q('「おいしい」＿言[い]いました。', 'と', 'と を に で', 'Er sagte: „Lecker!“', 'Zitat → と.'),
    q('医者[いしゃ]＿なります。', 'に', 'に が を で', 'Ich werde Arzt.', 'Wandel zu etwas → に なる.'),
    q('日本[にほん]＿一番[いちばん]高[たか]い山[やま]は富士山[ふじさん]です。', 'で/の', 'で に を は', 'Der höchste Berg Japans ist der Fuji.', 'で setzt den Rahmen („in Japan“); auch の ist möglich.')
  ]
}
