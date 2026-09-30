# Nihongo – Arbeitsplan

Themen und Features nach JLPT-Niveau geordnet. Wir arbeiten von oben nach unten.
Jede neue Seite wird im Lernpfad (Sidebar) und im Dropdown ihrer Rubrik (Navigationsleiste) eingetragen.

Legende: `[ ]` offen · `[~]` teilweise vorhanden · `[x]` erledigt

---

## Phase 0 – Grundgerüst

- [x] Navigationsleiste: Rubriken (Start, Schrift, Aussprache, Grammatik, Wortschatz, Übungen) als ausklappbare Dropdowns mit allen Unterseiten
- [x] Sidebar als **Lernpfad nach JLPT-Stufe** (Einstieg → N5 → N4 → N3 → N2 → N1), jede Stufe mit Themen und anschließenden Übungen, plus Werkzeuge
- [x] Lokaler Fortschritt (localStorage `nihongo:progress`): besuchte Seiten, „gelernt“-Markierung, letzte Position (Seite + Abschnitt)
- [x] „Weiter, wo du aufgehört hast“ im Lesezeichen-Menü und auf der Startseite
- [x] Lesezeichen/Favoriten: Stern auf jeder Seite, Liste im Menü der Navigationsleiste und auf der Startseite
- [x] Haken im Lernpfad für gelernte Seiten, Fortschrittsbalken pro Stufe auf der Startseite
- [ ] Fortschritt lokal sichern
- [ ] Übungsergebnisse (Kana-, Kanji- und Partikel-Quiz) in die Fortschrittsübersicht einbeziehen

---

## N5 – Einstieg

### Grammatik

- [x] **Fragewörter & こそあど** (`grammatik/fragewoerter.md`):
  - これ/それ/あれ/どれ, この/その/あの/どの, ここ/そこ/あそこ/どこ, こちら…/こっち…
  - 何/誰/どこ/いつ/どう/どうして/なぜ/いくら/いくつ/どれ/どの/どんな/どのくらい/何時/何人
  - 何か/誰か/どこか · 何も/誰も/どこも + Verneinung · 何でも/誰でも
  - Fragewort + が (nicht は), Fragewort-Partikel-Kombinationen (どこへ, 誰と …)
- [x] **Verneinung im Überblick** (`grammatik/verneinung.md`):
  - Verneinung aller Wortarten in einer Tabelle (höflich/einfach × Gegenwart/Vergangenheit), inkl. いい → よくない, ある → ない
  - Verneinende Adverbien: あまり〜ない, 全然〜ない, まだ〜ない/ていない, 何も〜ない, 一度も〜ない
  - Falle: Ja/Nein auf verneinte Fragen (「行かないの？」「はい、行きません」)
  - 〜ないでください als Überleitung zu den Bitten
  - zusätzlich: しか〜ない, 〜ないで (ohne zu), 〜ませんか als Einladung
- [x] **Existenz** (`grammatik/existenz.md`): ある vs. いる, 〜に〜がある / 〜は〜にある, „haben“, Ereignisse mit で, Positionswörter (上・下・中・外・前・後ろ・隣・横・近く・間・向かい)
- [x] **Zeitformen & Aspekt (Teil 1)** (`grammatik/zeitformen.md`): Nichtvergangenheit als Gegenwart und Zukunft, Vergangenheit, 〜ている als Verlauf, Zustand (結婚している) und Gewohnheit; もう/まだ; Tabelle Deutsch → Japanisch
- [x] **Konjunktionen & Satzverbindung (Teil 1)** (`grammatik/konjunktionen.md`): て-Kette (auch くて/で), 〜てから, から (weil), が/けど, 〜たり〜たり, 前に/後で, とき (行くとき vs. 行ったとき); Satzanfänge そして, それから, でも
- [x] **Bitten, Wünsche, Vorschläge** (`grammatik/bitten.md`): 〜をください, 〜てください (+ Höflichkeitsstufen), 〜ないでください, 〜たい, ほしい, 〜ましょう, 〜ませんか, 〜ましょうか, Zu- und Absagen
- [x] **Dürfen, müssen, nicht dürfen** (`grammatik/erlaubnis.md`): 〜てもいい (auch でもいい/くてもいい), 〜てはいけない, 〜なければならない/なければいけない, 〜なくてもいい (vorgezogen aus N4), Falle „muss nicht“ ≠ „darf nicht“
- [x] **Vergleiche** (`grammatik/vergleiche.md`): より, どちら/〜のほうが, 一番 + 〜の中で, 同じ/同じくらい/違う, 〜ほど〜ない, ずっと/もっと
- [x] **Adverbien & Häufigkeit** (`grammatik/adverbien.md`): Häufigkeitsskala いつも → 全然, 毎〜/〜回, Grad (とても, すごく, 少し, ちょっと, もっと), すぐ/後で/先に/また/ずっと/一緒に …, Adverbien aus Adjektiven, Stellung
- [x] **Vermutung (einfach)** (`grammatik/vermutung.md`): でしょう/だろう, たぶん/きっと, でしょう？ als Nachfrage, でしょうか als höfliche Frage

### Wortschatz

- [ ] Zeitangaben: 今日/明日/昨日, 今週/来週/先週, 毎〜, Wochentage (Querverweis zu *Zahlen → Datum*)
- [ ] Themenlisten: Familie (eigene vs. fremde), Körper, Farben, Essen & Trinken, Verkehr, Wetter, Einkaufen
- [ ] N5-Vokabelliste nach Themen (als Datenbasis für Karteikarten und Druckvorlagen)
- [ ] Deutsche Namen in Katakana schreiben

### Schrift & Praxis

- [ ] Satzzeichen & Schreibkonventionen: 。、「」『』・ー〜, Leerzeichen, Zahlen im Text
- [ ] Japanisch tippen: IME am PC/Smartphone, Eingabe von ん (nn), っ (doppelter Konsonant, xtu/ltu), ー, Umwandlung in Kanji

### Übungen & Features

- [ ] **Audio** per Web Speech API (`speechSynthesis`, ja-JP) für `<Ex>`, Kana-Tabellen und KanjiCards
- [ ] **Globaler Schalter für Furigana und Rōmaji** in allen `<Ex>`-Sätzen
- [ ] **Konjugationstrainer (Stufe N5)**: ます/ません/ました/ませんでした, Wörterbuch-, ない-, た-, て-Form; Eingabe in Rōmaji mit Umwandlung in Kana; Formen wählbar; Fehlerstatistik in localStorage
- [ ] **Adjektiv-Trainer**: い/な × Gegenwart/Vergangenheit × bejaht/verneint, Falle いい → よくない
- [ ] **Zählwort-Quiz**: Lautänderungen (いっぽん/さんぼん/ろっぴき …)
- [ ] **Uhrzeit- und Datum-Quiz**: 4時 = よじ, 9時 = くじ, ついたち/はつか/ようか
- [ ] **Satzbau-Puzzle**: Wortblöcke per Drag & Drop in die richtige Reihenfolge bringen
- [ ] **Lückentexte zu Formen (N5)** nach dem Muster der Partikel-Übungen: Fragewörter, Verneinung, Existenz, Bitten/Wünsche
- [ ] **Tonhöhen-Quiz**: Minimalpaare (箸/橋/端, 雨/飴) Diagramm oder Hörbeispiel zuordnen
- [ ] **Vokabel-Karteikarten mit SRS** (Spaced Repetition, localStorage) auf Basis der N5-Vokabelliste
- [ ] **Leseübungen N5**: kurze Texte mit Furigana-Schalter, aufklappbarer Übersetzung und Verständnisfragen
- [ ] Kanji-Quiz direkt mit Stufe verlinkbar (z. B. `?stufe=n5`), damit jede Stufe im Lernpfad ihr eigenes Quiz hat
- [ ] **Grammatik-Index A–Z** (〜たい, 〜てもいい …) mit Link auf die jeweilige Stelle, wächst mit jeder Stufe

---

## N4 – Grundstufe

### Grammatik

- [ ] **Zeitformen & Aspekt (Teil 2)**: 〜たことがある, 〜たばかり, 〜ところ (る/ている/た), 〜ていく/〜てくる
- [ ] **Konjunktionen (Teil 2)**: ので vs. から, のに, し, ながら, 〜ても; Satzanfänge だから, それに, しかし, それで
- [ ] **Konditional**: と, ば, たら, なら im Direktvergleich (Aufbau wie *Partikel im Vergleich*)
- [ ] **Imperativ & Verbot**: Befehlsform 命令形 (飲め, 食べろ, しろ, 来い), 〜なさい, Verbot mit 〜な; wann das (un)höflich klingt
- [ ] **Pflicht & Erlaubnis (Teil 2)**: Umgangsformen なきゃ/なくちゃ, 〜ちゃだめ, 〜なくちゃいけない (〜なくてもいい ist bereits in N5 enthalten)
- [ ] **Potentialform**: 〜られる / 〜える, ことができる, ら抜き言葉, Partikel が beim Potential
- [ ] **Volitional & Absicht**: 〜よう/〜おう, 〜ようと思う, つもり, 予定
- [ ] **Passiv** inkl. „Leidens-Passiv“ (雨に降られた)
- [ ] **Kausativ** (lassen/zwingen): 〜させる, 〜させてください
- [ ] **Geben & Nehmen**: あげる/くれる/もらう, 〜てあげる/〜てくれる/〜てもらう, mit Richtungsdiagramm (Uchi/Soto)
- [ ] **Vermutung & Hörensagen (Teil 1)**: かもしれない, 〜そうだ (Anschein: おいしそう) vs. 〜そうだ (Hörensagen), はず
- [ ] **Zitat & Gedanken**: 〜と言う, 〜と思う, 〜と聞く
- [ ] **Nominalisierung**: の vs. こと, 〜のが好き, 〜ことがある, 〜んです (erklärendes の)
- [ ] **Transitiv/Intransitiv**: Verbpaare (開ける/開く, 始める/始まる …), 〜てある vs. 〜ている
- [ ] **Relativsätze** (Ausbau von *Satzbau → Prinzip 5*)
- [ ] **Hilfsverben**: 〜すぎる, 〜やすい/〜にくい, 〜始める/〜終わる/〜続ける, 〜てしまう, 〜ておく, 〜てみる
- [~] **Keigo**: Seite vorhanden; ergänzen um die Muster お〜になる / お〜する / ご〜する

### Wortschatz & Schrift

- [ ] N4-Vokabelliste nach Themen
- [ ] Kanji-Komposita und Lesungsregeln (wann On, wann Kun, 熟字訓 wie 今日・大人)
- [ ] Radikale ausführlich + Suche nach Radikal
- [ ] Vertikal schreiben & Genkō-yōshi

### Übungen & Features

- [ ] Konjugationstrainer um N4-Formen erweitern: Potential, Volitional, Passiv, Kausativ, Imperativ, Konditional
- [ ] Lückentexte: Konditional, Konjunktionen, Geben & Nehmen, transitiv/intransitiv
- [ ] Karteikarten: N4-Vokabeln
- [ ] Leseübungen N4

---

## N3 – Mittelstufe

- [ ] **Kausativ-Passiv** (飲ませられる / 飲まされる)
- [ ] **Vermutung (Teil 2)**: ようだ, みたい, らしい im Vergleich
- [ ] **Zitat umgangssprachlich**: って, 〜んだって
- [ ] **Umgangssprache**: Kontraktionen (〜てる, 〜ちゃう/じゃう, じゃ, 〜とく, ん), Männer- und Frauensprache
- [ ] **Onomatopoesie** (擬音語・擬態語): ドキドキ, ペラペラ, ゴロゴロ …
- [ ] **Keigo vertieft**: 尊敬語/謙譲語 systematisch, Geschäftssituationen (Telefon, E-Mail)
- [ ] N3-Vokabelliste, Karteikarten, Leseübungen N3
- [x] N3-Kanji (Seite vorhanden)

---

## N2 / N1 – Fortgeschritten

- [x] N2- und N1-Kanji (Seiten vorhanden)
- [ ] Grammatikmuster sammeln und planen (Schriftsprache である-Stil, わけ, もの, 〜ものの …)
- [ ] Vokabellisten und Leseübungen N2/N1
