# Nihongo – Arbeitsplan

Themen und Features nach JLPT-Niveau geordnet. Wir arbeiten von oben nach unten.
Jede neue Seite wird im Lernpfad (Sidebar) und im Dropdown ihrer Rubrik (Navigationsleiste) eingetragen.

Legende: `[ ]` offen · `[~]` teilweise vorhanden · `[x]` erledigt · `[-]` zurückgestellt (nicht bearbeiten)

---

## Bugs (bearbeitet am 01.10.2026)

> **Audio ist bis auf Weiteres zurückgestellt.** Nicht daran arbeiten, nichts wieder einschalten und keine neuen Aufnahmen erzeugen (`npm run audio` nicht ausführen), bis ausdrücklich eine neue Lösung beauftragt wird. Neue Features ohne Audio umsetzen (kein `<SpeakButton>`, Hörbeispiele weglassen) und einfach mit dem nächsten offenen Punkt weitermachen.

- [-] **Audio-Qualität**: auch mit den Aufnahmen noch nicht gut genug → **Vorlesen vorerst abgeschaltet** (`AUDIO_ENABLED = false` in `utils/audio.ts`: keine Lautsprecher-Knöpfe, kein „Anhören“ in den Kana-Tabellen, kein Vorlesen-Bereich im Menü „あ“; `public/audio` ist nicht im Git und wird beim Build aus `dist` entfernt). Gesucht: bessere Alternative (z. B. natürlichere neuronale Stimme oder echte Sprachaufnahmen). Vorhanden und wiederverwendbar: Stimmen-Rangfolge, Wiedergabe vorab erzeugter Dateien, `npm run audio` mit Lesungs-Prüfung gegen die Furigana. Bisheriger Stand: Systemstimmen werden nach Qualität sortiert (Google/Apple/Microsoft/„Natural“ vor eSpeak), „Automatisch“ nimmt die beste. Klingt sie robotisch (eSpeak/speech-dispatcher unter Linux) oder fehlt sie, spielen vorab erzeugte Aufnahmen (`npm run audio`: Open JTalk, Stimme „Mei“, CC BY 3.0, ~1440 Texte, ~9 MB MP3 in `public/audio`, Tempo per `playbackRate` mit erhaltener Tonhöhe). Lesungen werden gegen die Furigana geprüft und bei Abweichung aus den Furigana synthetisiert
- [x] **Falsche Kana-Aussprache**: Kana-Tabellen spielen immer eigene Aufnahmen (`audio/kana/<rōmaji>.mp3`, als Katakana synthetisiert, damit は/へ/を nicht als Partikel gelesen werden), unabhängig von der Systemstimme
- [x] **Alle Kana-Audios überprüft**: alle 123 Laute (Grundzeichen, Dakuten, Yōon, erweiterte Katakana, ん) automatisch geprüft – synthetisierte Phoneme = Rōmaji der Tabelle, Dauer plausibel; Katakana nutzen dieselben Dateien. (っ und ー haben allein keinen eigenen Laut und keinen Vorlese-Knopf)
- [x] **PWA-Updates sichtbar machen**: `registerType: 'prompt'`, Banner „Neue Inhalte verfügbar – Neu laden / Später“ (`ReloadPrompt.vue`, `virtual:pwa-register`), Update-Prüfung stündlich und bei `visibilitychange`

---

## Phase 0 – Grundgerüst

- [x] Navigationsleiste: Rubriken (Start, Schrift, Aussprache, Grammatik, Wortschatz, Übungen) als ausklappbare Dropdowns mit allen Unterseiten
- [x] Sidebar als **Lernpfad nach JLPT-Stufe** (Einstieg → N5 → N4 → N3 → N2 → N1), jede Stufe mit Themen und anschließenden Übungen, plus Werkzeuge
- [x] Lokaler Fortschritt (localStorage `nihongo:progress`): besuchte Seiten, „gelernt“-Markierung, letzte Position (Seite + Abschnitt)
- [x] „Weiter, wo du aufgehört hast“ im Lesezeichen-Menü und auf der Startseite
- [x] Lesezeichen/Favoriten: Stern auf jeder Seite, Liste im Menü der Navigationsleiste und auf der Startseite
- [x] Haken im Lernpfad für gelernte Seiten, Fortschrittsbalken pro Stufe auf der Startseite
- [x] Fortschritt lokal sichern: „Sichern“ lädt alle `nihongo:*`-Daten als JSON-Datei herunter, „Wiederherstellen …“ spielt sie wieder ein (Startseite → Dein Fortschritt)
- [x] Übungsergebnisse (Kana-, Kanji- und Partikel-Quiz) in die Fortschrittsübersicht einbeziehen: letzter Durchgang, Bestwert, Anzahl; dazu Schreib-Selbstbewertungen für Kana und Kanji

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

- [x] **Zeitangaben** (`wortschatz/zeit.md`): 今日/明日/昨日, 先週/今週/来週 … als Tabelle mit Sonderlesungen (今年, 去年), Tageszeiten (今朝, ゆうべ), Wochentage mit Elementen, Jahreszeiten, Regel „に oder nicht“, Zeitspannen (〜時間, 〜か月), ごろ/ぐらい, から〜まで; Querverweis zu *Zahlen → Datum*
- [x] **Themenlisten** (`wortschatz/themen.md`): Familie (eigene vs. fremde als Tabelle), Menschen & Berufe, Körper, Farben (い-Adjektiv vs. Nomen + の), Essen & Trinken, Verkehr, Orte, Wetter & Natur, Einkaufen, Kleidung (着る/履く/かぶる/かける), Wohnen, Schule & Arbeit, Freizeit, Verben, Adjektive – je mit Erklärung, Beispielen und `<VocabList>` (Abdecken-Modus)
- [x] **N5-Vokabelliste nach Themen** (`data/vocab.ts`, ~380 Wörter in Ruby-Syntax, Rōmaji automatisch) – auch als Druckvorlage „Wortschatz nach Themen“; Grundlage für die Karteikarten
- [x] **Deutsche Namen in Katakana** (`wortschatz/namen.md`): Regeln für Vokale (-er, ä/ö/ü, ei/eu) und Konsonanten (sch, ch, z, w, st-), häufige Vor- und Nachnamen, Länder & Städte, Anleitung, Schnelltest

### Schrift & Praxis

- [x] **Satzzeichen & Schreibkonventionen** (`schrift/satzzeichen.md`): 。、「」『』・ー〜……, ？！, wörtliche Rede, keine Leerzeichen (分かち書き), voll-/halbbreit, Zahlen im Text (1,000 = tausend), waagerecht/senkrecht
- [x] **Japanisch tippen** (`schrift/tippen.md`): IME einrichten (Windows, macOS, Linux, iOS, Android), Rōmaji-Eingabe (nn, っ, xtu/ltu, ー, thi, …), Umwandlung (Leertaste, F6–F10, Satzteile), Flick-Eingabe, Handschrift

### Übungen & Features

- [x] **Audio** per Web Speech API (`utils/settings.ts` → `speak()`, `<SpeakButton>`): Lautsprecher an jedem `<Ex>`, am Beispielwort der KanjiCards, in den Vokabellisten und in den Trainern; Kana-Tabellen mit Schalter „Anhören“. Vorab erzeugte Aufnahmen oder Systemstimme (siehe Bugs); Tempo und Stimme im Menü „あ“ – **derzeit abgeschaltet**, siehe Bugs
- [x] **Globaler Schalter für Furigana und Rōmaji** (Menü „あ“ in der Navigationsleiste, localStorage `nihongo:settings`, per Inline-Skript vor dem ersten Rendern angewendet): Furigana auf allen Seiten, Rōmaji in `<Ex>`-Sätzen
- [x] **Konjugationstrainer (Stufe N5)** (`uebungen/konjugation.md`, `<FormTrainer deck="verben">`): ます/ません/ました/ませんでした, Wörterbuch-, ない-, た-, て-Form für 53 Verben; Rōmaji werden beim Tippen in Kana umgewandelt (`utils/kanaInput.ts`); Formen und Verbgruppen wählbar; Regel-Erklärung bei Fehlern; Trefferquote je Form in localStorage; Ergebnis in der Fortschrittsübersicht
- [x] **Adjektiv-Trainer** (`uebungen/adjektive.md`, gleiche Komponente): い/な × verneint/Vergangenheit/verneinte Vergangenheit × einfach/höflich, Varianten (くありません, ではありません …) akzeptiert, Fallen いい → よくない, 〜かったです, きれい/嫌い
- [x] **Zählwort-Quiz** (`uebungen/zaehlwoerter.md`, `<FormTrainer deck="zaehlwoerter">`, Daten in `data/counters.ts`): Zahl + Zählwort lesen (つ, 人, 本, 枚, 匹, 個, 冊, 杯, 台, 歳, 回, 階, 円 × 1–10 und 何), Lautänderungen いっぽん/さんぼん/ろっぴき …, Varianten (はっぽん/はちほん, じゅっ/じっ) akzeptiert, Regel je Zählwort, Zahlen einzeln wählbar
- [x] **Uhrzeit- und Datum-Quiz** (`uebungen/uhrzeit-datum.md`, `deck="uhrzeit-datum"`): 時 (よじ, しちじ, くじ), 分 (ふん/ぷん nach letzter Ziffer, 1–31), 月 (しがつ …), 日 (ついたち … とおか, じゅうよっか, はつか), jeweils mit 何
- [x] **Satzbau-Puzzle** (`uebungen/satzbau.md`, `<SentencePuzzle set="…">`, Daten in `data/puzzles.ts`): Bausteine antippen oder per Drag & Drop (Pointer-Events, auch Touch) in die richtige Reihenfolge bringen, Pfeiltasten verschieben im Satz; vier Sätze à 9 Aufgaben (Verb am Ende, Fragen, Beschreibendes vorne, Sätze verbinden); mehrere richtige Reihenfolgen werden akzeptiert und als „Auch richtig“ gezeigt; Ergebnis in der Fortschrittsübersicht; Link von *Satzbau*
- [x] **Lückentexte zu Formen (N5)** (`uebungen/lueckentexte.md`, `<ParticleQuiz page="lueckentexte" set="…">`, Daten in `data/gaps.ts`): Fragewörter & こそあど, Verneinung, Existenz (ある/いる, Muster, Positionen), Bitten/Wünsche/Vorschläge – je 13–14 Sätze mit Erklärung; Optionen mit Furigana; Ergebnis in der Fortschrittsübersicht; Links aus den Schnelltests der vier Grammatikseiten
- [-] **Tonhöhen-Quiz**: Minimalpaare (箸/橋/端, 雨/飴) dem Diagramm zuordnen (Hörbeispiele erst, wenn Audio wieder aktiv ist)
- [x] **Vokabel-Karteikarten mit SRS** (`uebungen/karteikarten.md`, `<Flashcards>`, Planung in `utils/srs.ts`): alle ~380 N5-Vokabeln, vereinfachtes SM-2 (Nochmal/Schwer/Gut/Leicht mit Vorschau des nächsten Abstands, „Nochmal“ kommt in derselben Runde wieder), Richtung Japanisch→Deutsch oder Deutsch→Japanisch mit getrenntem Lernstand, neue Karten pro Tag (5/10/20/30) + „weitere neue Karten“, Themenauswahl mit Fortschrittsbalken (begonnen/sicher ab 21 Tagen), Tastatur (Leertaste, 1–4); localStorage `nihongo:karteikarten` (in der Sicherung enthalten), Ergebnis in der Fortschrittsübersicht
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
