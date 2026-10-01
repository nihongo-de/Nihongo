import type { ParticleItem } from './particles'

// Lückentexte zu Formen; gleiches Format wie die Partikel-Übungen (Optionen ohne Leerzeichen, Ruby-Syntax erlaubt)
const q = (jp: string, answer: string, options: string, de: string, why: string): ParticleItem => ({
  jp,
  answer,
  options,
  de,
  why
})

export const gapSetTitles: Record<string, string> = {
  fragewoerter: 'Fragewörter',
  verneinung: 'Verneinung',
  existenz: 'Existenz',
  bitten: 'Bitten & Wünsche'
}

export const gapSets: Record<string, ParticleItem[]> = {
  fragewoerter: [
    q('＿は何[なん]ですか。', 'それ', 'それ これ あれ どれ', 'Was ist das (da bei dir)?', 'Das Ding ist beim Gesprächspartner → それ.'),
    q('＿人[ひと]は誰[だれ]ですか。', 'あの', 'あの あれ あそこ どの', 'Wer ist die Person dort drüben?', 'Vor einem Nomen stehen この・その・あの・どの; あれ steht allein.'),
    q('すみません、駅[えき]は＿ですか。', 'どこ', 'どこ どれ どの いつ', 'Entschuldigung, wo ist der Bahnhof?', 'Nach dem Ort fragt どこ.'),
    q('「このかばんは＿ですか。」「五千円[ごせんえん]です。」', 'いくら', 'いくら いくつ 何時[なんじ] どれ', '„Wie viel kostet diese Tasche?“ – „5000 Yen.“', 'Nach dem Preis fragt いくら; いくつ fragt nach Anzahl oder Alter.'),
    q('「＿日本語[にほんご]を勉強[べんきょう]していますか。」「アニメが好[す]きですから。」', 'どうして/なぜ', 'どうして どう いつ どんな', '„Warum lernst du Japanisch?“ – „Weil ich Anime mag.“', 'Nach dem Grund fragt どうして (oder なぜ); die Antwort endet mit から.'),
    q('「京都[きょうと]は＿でしたか。」「とてもきれいでした。」', 'どう', 'どう どうして どんな どの', '„Wie war Kyōto?“ – „Sehr schön.“', 'Nach dem Eindruck fragt どう – direkt vor です.'),
    q('「＿音楽[おんがく]が好[す]きですか。」「ジャズが好[す]きです。」', 'どんな', 'どんな どう どれ いくつ', '„Was für Musik magst du?“ – „Jazz.“', 'どんな + Nomen = „was für ein …“; どう steht nicht vor einem Nomen.'),
    q('「＿行[い]きますか。」「友達[ともだち]と行[い]きます。」', '誰[だれ]と', '誰[だれ]と 誰[だれ]が 誰[だれ]に 誰[だれ]の', '„Mit wem gehst du hin?“ – „Mit einem Freund.“', 'Die Partikel bleibt beim Fragewort: Antwort 友達と → Frage 誰と.'),
    q('のどが渇[かわ]きました。＿飲[の]みたいです。', '何[なに]か', '何[なに]か 何[なに]も 何[なん]でも 何[なに]が', 'Ich habe Durst. Ich möchte etwas trinken.', 'Fragewort + か = „irgend-“: 何か = etwas.'),
    q('昨日[きのう]は＿行[い]きませんでした。', 'どこにも', 'どこにも どこか どこでも どこへ', 'Gestern bin ich nirgendwohin gegangen.', 'Fragewort + も + Verneinung = „nirgendwo“; に steht vor も.'),
    q('教室[きょうしつ]には＿いません。', '誰[だれ]も', '誰[だれ]も 誰[だれ]か 誰[だれ]でも 誰[だれ]が', 'Im Klassenzimmer ist niemand.', '誰も + Verneinung = niemand.'),
    q('「何[なに]を飲[の]みますか。」「＿いいです。」', '何[なん]でも', '何[なん]でも 何[なに]も 何[なに]か いつも', '„Was möchtest du trinken?“ – „Mir ist alles recht.“', 'Fragewort + でも = „egal welch-“: 何でもいい.'),
    q('「家族[かぞく]は＿ですか。」「四人[よにん]です。」', '何人[なんにん]', '何人[なんにん] 何時[なんじ] 何歳[なんさい] いくら', '„Wie viele seid ihr in der Familie?“ – „Vier.“', 'Nach der Anzahl von Personen fragt 何人 (なんにん).')
  ],
  verneinung: [
    q('この本[ほん]は＿。', '高[たか]くないです', '高[たか]くないです 高[たか]いじゃないです 高[たか]いません 高[たか]くじゃないです', 'Dieses Buch ist nicht teuer.', 'い-Adjektiv: い → くない, höflich mit です.'),
    q('今日[きょう]は天気[てんき]が＿。', 'よくないです', 'よくないです いくないです いいじゃないです いいくないです', 'Heute ist das Wetter nicht gut.', 'いい konjugiert über よい: よくない.'),
    q('この部屋[へや]は＿。', 'きれいじゃありません', 'きれいじゃありません きれくないです きれいくないです きれいません', 'Dieses Zimmer ist nicht sauber.', 'きれい ist ein (getarntes) な-Adjektiv: きれいじゃありません.'),
    q('昨日[きのう]は休[やす]み＿。', 'じゃありませんでした', 'じゃありませんでした くなかったです ませんでした じゃないでした', 'Gestern war kein freier Tag.', 'Nomen: じゃありません + でした für die Vergangenheit.'),
    q('明日[あした]は友達[ともだち]に＿。', '会[あ]わない', '会[あ]わない 会[あ]あない 会[あ]かない 会[あ]いない', 'Morgen treffe ich meinen Freund nicht.', 'Verben auf 〜う: う → わない.'),
    q('今日[きょう]は会社[かいしゃ]に＿。', 'こない', 'こない きない くない くらない', 'Heute kommt er nicht in die Firma.', 'Unregelmäßig: 来る（くる）→ 来ない（こない）.'),
    q('昨日[きのう]は何[なに]も＿。', '食[た]べませんでした', '食[た]べませんでした 食[た]べました 食[た]べないでした 食[た]べなかったでした', 'Gestern habe ich nichts gegessen.', '何も verlangt die Verneinung; höfliche Vergangenheit: 〜ませんでした.'),
    q('子[こ]どものとき、野菜[やさい]が好[す]きじゃ＿。', 'なかった', 'なかった ないでした なくた なかったでした', 'Als Kind mochte ich kein Gemüse.', 'ない konjugiert wie ein い-Adjektiv: ない → なかった.'),
    q('お酒[さけ]は＿飲[の]みません。', 'あまり', 'あまり よく いつも とても', 'Alkohol trinke ich kaum.', 'あまり + Verneinung = „nicht besonders, kaum“.'),
    q('フランス語[ご]は＿分[わ]かりません。', '全然[ぜんぜん]', '全然[ぜんぜん] 少[すこ]し よく とても', 'Französisch verstehe ich überhaupt nicht.', '全然 + Verneinung = „überhaupt nicht“.'),
    q('「もう昼[ひる]ご飯[はん]を食[た]べましたか。」「いいえ、まだ＿。」', '食[た]べていません', '食[た]べていません 食[た]べませんでした 食[た]べません 食[た]べました', '„Hast du schon zu Mittag gegessen?“ – „Nein, noch nicht.“', '„Noch nicht“ = まだ〜ていない; 食べませんでした hieße: Die Gelegenheit ist vorbei.'),
    q('財布[さいふ]に千円[せんえん]＿ありません。', 'しか', 'しか だけ も から', 'Im Geldbeutel habe ich nur 1000 Yen.', 'しか + Verneinung = „nur, nichts außer“; だけ stünde mit bejahtem Verb.'),
    q('「コーヒー、飲[の]まないんですか。」「＿、飲[の]みません。」', 'はい', 'はい いいえ', '„Trinkst du keinen Kaffee?“ – „Nein, ich trinke keinen.“', 'はい bestätigt die Aussage der Frage: „Stimmt, ich trinke keinen.“'),
    q('ここでたばこを＿ください。', '吸[す]わないで', '吸[す]わないで 吸[す]わなくて 吸[す]いないで 吸[す]って', 'Bitte hier nicht rauchen.', 'Verneinte Bitte: ない-Form + で + ください.')
  ],
  existenz: [
    q('かばんの中[なか]に辞書[じしょ]が＿。', 'あります', 'あります います', 'In der Tasche ist ein Wörterbuch.', 'Gegenstände → ある.'),
    q('受付[うけつけ]に女[おんな]の人[ひと]が＿。', 'います', 'あります います', 'Am Empfang ist eine Frau.', 'Menschen → いる.'),
    q('庭[にわ]にきれいな花[はな]が＿。', 'あります', 'あります います', 'Im Garten sind schöne Blumen.', 'Pflanzen gelten als Dinge → ある.'),
    q('池[いけ]に魚[さかな]がたくさん＿。', 'います', 'あります います', 'Im Teich sind viele Fische.', 'Lebende Tiere → いる (im Laden als Ware dagegen ある).'),
    q('明日[あした]、日本語[にほんご]のテストが＿。', 'あります', 'あります います', 'Morgen ist eine Japanischprüfung.', 'Ereignisse „gibt es“ mit ある.'),
    q('私[わたし]は妹[いもうと]が一人[ひとり]＿。', 'います', 'あります います', 'Ich habe eine jüngere Schwester.', '„Haben“ bei Personen → いる.'),
    q('今[いま]、お金[かね]が＿。', 'ない', 'ない あらない ありない いない', 'Gerade habe ich kein Geld.', 'Die einfache Verneinung von ある ist ない.'),
    q('「田中[たなか]さんはいますか。」「いいえ、今[いま]＿。」', 'いません', 'いません ありません ないです', '„Ist Herr Tanaka da?“ – „Nein, er ist gerade nicht da.“', 'Personen → いる, verneint いません.'),
    q('冷蔵庫[れいぞうこ]に何[なに]＿ありますか。', 'が', 'が は を で', 'Was ist im Kühlschrank?', 'Muster „Ort に · Ding が · ある“ – und ein Fragewort als Subjekt nimmt ohnehin が.'),
    q('トイレ＿どこにありますか。', 'は', 'は が を に', 'Wo ist die Toilette?', 'Das Ding ist bekannt, gefragt ist der Ort → Muster „Ding は · Ort に · ある“.'),
    q('駅[えき]の前[まえ]＿銀行[ぎんこう]があります。', 'に', 'に で を へ', 'Vor dem Bahnhof ist eine Bank.', 'Ort des Seins → に, nicht で.'),
    q('公園[こうえん]＿お祭[まつ]りがあります。', 'で', 'で に を へ', 'Im Park findet ein Fest statt.', 'Ereignisse: Der Ort nimmt で, weil dort etwas passiert.'),
    q('猫[ねこ]は机[つくえ]の＿にいます。', '下[した]', '下[した] 上[うえ] 中[なか] 前[まえ]', 'Die Katze ist unter dem Tisch.', 'unter = 下; erst der Bezugspunkt, dann die Position: 机の下.'),
    q('郵便局[ゆうびんきょく]は銀行[ぎんこう]と本屋[ほんや]の＿にあります。', '間[あいだ]', '間[あいだ] 隣[となり] 向[む]かい 近[ちか]く', 'Die Post liegt zwischen der Bank und der Buchhandlung.', '„zwischen A und B“ = AとBの間.')
  ],
  bitten: [
    q('ちょっと＿ください。', '待[ま]って', '待[ま]って 待[ま]ち 待[ま]た 待[ま]つ', 'Warte bitte kurz.', 'Um eine Handlung bitten: て-Form + ください; 待つ → 待って.'),
    q('ここに名前[なまえ]を＿ください。', '書[か]いて', '書[か]いて 書[か]って 書[か]きて 書[か]けて', 'Bitte schreiben Sie hier Ihren Namen hin.', 'Verben auf く: く → いて.'),
    q('すみません、もう一度[いちど]＿ください。', '言[い]って', '言[い]って 言[い]いて 言[い]んで 言[い]して', 'Entschuldigung, sagen Sie das bitte noch einmal.', 'Verben auf う・つ・る: → って.'),
    q('授業中[じゅぎょうちゅう]は携帯[けいたい]を＿ください。', '使[つか]わないで', '使[つか]わないで 使[つか]わなくて 使[つか]いないで 使[つか]って', 'Bitte benutzt im Unterricht keine Handys.', 'Etwas nicht tun: ない-Form + でください; 使う → 使わない.'),
    q('すみません、コーヒーを二[ふた]つ＿。', 'お願[ねが]いします/ください', 'お願[ねが]いします してください ほしいです たいです', 'Zwei Kaffee, bitte.', 'Dinge bestellen: 〜をください oder 〜をお願いします.'),
    q('夏休[なつやす]みに北海道[ほっかいどう]へ＿です。', '行[い]きたい', '行[い]きたい 行[い]くたい 行[い]ったい 行[い]きほしい', 'In den Sommerferien möchte ich nach Hokkaidō fahren.', 'Etwas tun wollen: ます-Stamm + たい (行きます → 行きたい).'),
    q('新[あたら]しい自転車[じてんしゃ]＿ほしいです。', 'が', 'が を に で', 'Ich hätte gern ein neues Fahrrad.', 'ほしい steht immer mit が.'),
    q('今日[きょう]は疲[つか]れました。何[なに]も＿です。', 'したくない', 'したくない したいじゃない しないたい したかった', 'Ich bin müde. Heute will ich gar nichts machen.', 'たい konjugiert wie ein い-Adjektiv: したい → したくない.'),
    q('子[こ]どものとき、犬[いぬ]がほし＿です。', 'かった', 'かった いでした くない かったでした', 'Als Kind wollte ich einen Hund.', 'ほしい ist ein い-Adjektiv: ほしかった – nicht ほしいでした.'),
    q('週末[しゅうまつ]、一緒[いっしょ]に映画[えいが]を＿。', '見[み]ませんか', '見[み]ませんか 見[み]ましょう 見[み]たいですか 見[み]てください', 'Hast du Lust, am Wochenende mit mir einen Film zu sehen? (Einladung)', 'Einladung: 〜ませんか lässt Raum für ein Nein; 〜ましょう setzt die Zustimmung schon voraus.'),
    q('「荷物[にもつ]、重[おも]いですね。＿か。」「ありがとうございます。」', '持[も]ちましょう', '持[も]ちましょう 持[も]ちません 持[も]ちたい 持[も]って', '„Dein Gepäck ist schwer, oder? Soll ich es tragen?“ – „Vielen Dank.“', 'Hilfe anbieten: 〜ましょうか („Soll ich …?“).'),
    q('「もう十時[じゅうじ]ですね。」「そうですね。そろそろ＿。」', '帰[かえ]りましょう', '帰[かえ]りましょう 帰[かえ]ってください 帰[かえ]るたい 帰[かえ]りません', '„Schon zehn Uhr.“ – „Stimmt. Lass uns langsam nach Hause gehen.“', 'Gemeinsamer Vorschlag, dem der andere zustimmt → 〜ましょう.'),
    q('「土曜日[どようび]、テニスをしませんか。」「すみません、土曜日[どようび]は＿…。」', 'ちょっと', 'ちょっと とても いつも もっと', '„Wollen wir am Samstag Tennis spielen?“ – „Tut mir leid, Samstag ist etwas …“', 'Höfliche Absage: ちょっと… mit offenem Ende.')
  ]
}
