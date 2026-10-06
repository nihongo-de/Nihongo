---
title: Japanisch tippen
description: Japanische Tastatur am PC und Smartphone einrichten, Rōmaji-Eingabe (ん, っ, ー, kleine Kana), Umwandlung in Kanji und Katakana und Flick-Eingabe.
---

# Japanisch tippen

Um Japanisch zu tippen, brauchst du keine japanische Tastatur. Ein **IME** (*Input Method Editor*) wandelt deine Eingabe in Rōmaji automatisch in Kana um und schlägt dann passende Kanji vor. Der IME ist auf jedem Betriebssystem schon eingebaut.

::: tip Tippen hilft beim Lernen
Beim Tippen musst du die **Lesung** eines Wortes kennen. Aus der Liste wählst du dann das richtige Kanji aus. Das trainiert Lesen und Erkennen zugleich. Das Schreiben mit der Hand ersetzt es aber nicht.
:::

## Einrichten {#einrichten}

| Gerät | So geht's |
| --- | --- |
| **Windows** | Einstellungen → Zeit und Sprache → Sprache und Region → Sprache hinzufügen → **Japanisch**. Mit <kbd>Win</kbd> + <kbd>Leertaste</kbd> wechselst du die Eingabesprache. |
| **macOS** | Systemeinstellungen → Tastatur → Eingabequellen → **Japanisch – Romaji**. Umschalten mit <kbd>Ctrl</kbd> + <kbd>Leertaste</kbd> oder der Globus-Taste. |
| **Linux** | Ein Eingabe-Framework wie **Fcitx 5** oder **IBus** mit **Mozc** installieren, zum Beispiel das Paket `fcitx5-mozc` oder `ibus-mozc`. |
| **iPhone / iPad** | Einstellungen → Allgemein → Tastatur → Tastaturen → Tastatur hinzufügen → **Japanisch** („Romaji“ oder „Kana“). Über die Globus-Taste wechseln. |
| **Android** | In **Gboard**: Einstellungen → Sprachen → Tastatur hinzufügen → **Japanisch**. Wähle „QWERTZ“ oder „12 Tasten“ (Flick-Eingabe). |

Nach dem Umschalten zeigt der PC den Modus meist als **A** (lateinische Buchstaben) oder **あ** (Hiragana) an. Ein Klick auf das Symbol schaltet um.

## Rōmaji-Eingabe {#romaji}

Die meisten Zeichen tippst du so, wie du sie in Rōmaji schreibst: <kbd>k</kbd><kbd>a</kbd> → <span lang="ja">か</span>, <kbd>s</kbd><kbd>h</kbd><kbd>i</kbd> → <span lang="ja">し</span>. Die folgenden Fälle solltest du kennen:

| Zeichen | Eingabe | Beispiel |
| --- | --- | --- |
| <span lang="ja">ん</span> | <kbd>nn</kbd> (vor Konsonanten reicht <kbd>n</kbd>) | <kbd>konnnichiha</kbd> → <span lang="ja">こんにちは</span> |
| <span lang="ja">っ</span> | Konsonant doppelt tippen | <kbd>kitte</kbd> → <span lang="ja">きって</span> |
| <span lang="ja">っ</span> allein | <kbd>xtu</kbd> oder <kbd>ltu</kbd> | <kbd>ltu</kbd> → <span lang="ja">っ</span> |
| kleine Kana | <kbd>x</kbd> oder <kbd>l</kbd> davor | <kbd>xya</kbd> → <span lang="ja">ゃ</span>, <kbd>la</kbd> → <span lang="ja">ぁ</span> |
| <span lang="ja">ー</span> | Minustaste <kbd>-</kbd> | <kbd>ko-hi-</kbd> → <span lang="ja">こーひー</span> → <span lang="ja">コーヒー</span> |
| <span lang="ja">は・を・へ</span> als Partikel | so, wie sie **geschrieben** werden | <kbd>watashiha</kbd> → <span lang="ja">わたしは</span>, <kbd>wo</kbd> → <span lang="ja">を</span> |
| <span lang="ja">ぢ・づ</span> | <kbd>di</kbd>, <kbd>du</kbd> (gesprochen *ji*, *zu* – aber <kbd>ji</kbd>/<kbd>zu</kbd> ergibt <span lang="ja">じ・ず</span>) | <kbd>tudukeru</kbd> → <span lang="ja">つづける</span> |
| <span lang="ja">ティ・ディ</span> | <kbd>thi</kbd>, <kbd>dhi</kbd> | <kbd>pa-thi-</kbd> → <span lang="ja">パーティー</span> |
| <span lang="ja">ファ・フィ・フェ・フォ</span> | <kbd>fa</kbd>, <kbd>fi</kbd>, <kbd>fe</kbd>, <kbd>fo</kbd> | <kbd>fairu</kbd> → <span lang="ja">ファイル</span> |
| <span lang="ja">ヴ</span> | <kbd>vu</kbd> | <kbd>vaiorin</kbd> → <span lang="ja">ヴァイオリン</span> |
| <span lang="ja">、。</span> | <kbd>,</kbd> <kbd>.</kbd> | |
| <span lang="ja">「」</span> | <kbd>[</kbd> <kbd>]</kbd> | |
| <span lang="ja">・</span> | <kbd>/</kbd> | |

::: warning Die ん-Falle
<kbd>konichiha</kbd> ergibt <span lang="ja">こにちは</span>, denn ein einzelnes <kbd>n</kbd> vor einem Vokal verbindet sich mit ihm zur <span lang="ja">な</span>-Reihe. Tippe <kbd>nn</kbd> für <span lang="ja">ん</span>, vor allem vor Vokalen und <kbd>y</kbd>: <kbd>kinnyoubi</kbd> → <span lang="ja">きんようび</span> (*kin'yōbi*).
:::

::: tip Langvokale tippt man, wie man sie schreibt
Der IME kennt keine Makrons. *Tōkyō* tippst du so, wie es in Hiragana geschrieben wird: <kbd>toukyou</kbd> → <span lang="ja">とうきょう</span>. Wie Langvokale in Kana geschrieben werden, steht unter [Kana-Kombinationen](./kombinationen#langvokale).
:::

## Umwandeln in Kanji und Katakana {#umwandeln}

1. Tippe das Wort oder den ganzen Satz in Rōmaji. Er erscheint **unterstrichen** in Hiragana.
2. Drücke <kbd>Leertaste</kbd>: Der IME schlägt eine Umwandlung vor.
3. Drücke <kbd>Leertaste</kbd> noch einmal: Eine **Liste** mit weiteren Kandidaten erscheint. Wähle mit den Pfeiltasten oder der Nummer.
4. Mit <kbd>Enter</kbd> bestätigst du.

<div class="info-grid narrow">
  <div class="info-card"><span class="info-card__big" lang="ja">かみ</span><span class="info-card__label">kami</span><span class="info-card__text">→ <span lang="ja">紙</span> Papier · <span lang="ja">髪</span> Haar · <span lang="ja">神</span> Gott</span></div>
  <div class="info-card"><span class="info-card__big" lang="ja">はし</span><span class="info-card__label">hashi</span><span class="info-card__text">→ <span lang="ja">橋</span> Brücke · <span lang="ja">箸</span> Stäbchen · <span lang="ja">端</span> Rand</span></div>
  <div class="info-card"><span class="info-card__big" lang="ja">あめ</span><span class="info-card__label">ame</span><span class="info-card__text">→ <span lang="ja">雨</span> Regen · <span lang="ja">飴</span> Bonbon</span></div>
  <div class="info-card"><span class="info-card__big" lang="ja">きる</span><span class="info-card__label">kiru</span><span class="info-card__text">→ <span lang="ja">着る</span> anziehen · <span lang="ja">切る</span> schneiden</span></div>
</div>

| Taste (Windows) | Wirkung |
| --- | --- |
| <kbd>F6</kbd> | in Hiragana umwandeln |
| <kbd>F7</kbd> | in Katakana umwandeln |
| <kbd>F8</kbd> | in halbbreite Katakana umwandeln |
| <kbd>F9</kbd> / <kbd>F10</kbd> | in voll- / halbbreite lateinische Buchstaben umwandeln |
| <kbd>←</kbd> <kbd>→</kbd> | zwischen den Satzteilen wechseln |
| <kbd>Umschalt</kbd> + <kbd>←</kbd> <kbd>→</kbd> | Satzteil kürzer oder länger machen |
| <kbd>Esc</kbd> | Umwandlung abbrechen |

Auf dem Mac wandeln <kbd>Ctrl</kbd> + <kbd>K</kbd> in Katakana und <kbd>Ctrl</kbd> + <kbd>J</kbd> in Hiragana um.

::: tip Ganze Sätze tippen
Der IME wählt Kanji nach dem **Zusammenhang**. Tippst du <kbd>kamiwokiru</kbd>, schlägt er eher <span lang="ja">紙を切る</span> vor, bei <kbd>kamiwoarau</kbd> eher <span lang="ja">髪を洗う</span>. Bei ganzen Sätzen liegt er deshalb öfter richtig als bei einzelnen Wörtern.
:::

## Auf dem Smartphone: Flick-Eingabe {#flick}

Japaner tippen auf dem Handy meist mit der **12-Tasten-Tastatur** (<span lang="ja">フリック入力</span>). Jede Taste steht für eine Reihe der Kana-Tabelle:

- **Tippen** ergibt den a-Laut: <span lang="ja">か</span>
- **Wischen** nach links, oben, rechts, unten ergibt i, u, e, o: <span lang="ja">き・く・け・こ</span>
- Die Taste <span lang="ja">゛゜小</span> macht aus dem letzten Zeichen <span lang="ja">が</span>, <span lang="ja">ぱ</span> oder ein kleines <span lang="ja">っ・ゃ</span>.

Das ist schneller als Rōmaji, sobald du die Kana-Tabelle auswendig kannst. Zum Einstieg ist die QWERTZ-Tastatur mit Rōmaji aber völlig in Ordnung.

::: tip Unbekannte Kanji eingeben
Wenn du die Lesung eines Kanji nicht kennst, hilft die **Handschrifterkennung**. Gboard und die iOS-Tastatur haben eine Handschrift-Tastatur, der Windows-IME das „IME-Pad“. Male das Zeichen einfach mit dem Finger oder der Maus.
:::

## Schnelltest

::: details Was tippst du? (Lösungen aufklappen)
1. <span lang="ja">こんにちは</span> → **<kbd>konnnichiha</kbd>** (nn für ん, ha für die Partikel は)
2. <span lang="ja">がっこう</span> → **<kbd>gakkou</kbd>**
3. <span lang="ja">コーヒー</span> → **<kbd>ko-hi-</kbd>** + <kbd>F7</kbd> oder <kbd>Leertaste</kbd>
4. <span lang="ja">ほんを読みます</span> → **<kbd>honwoyomimasu</kbd>**
5. <span lang="ja">きんようび</span> → **<kbd>kinnyoubi</kbd>** – mit nur einem n entstünde きにょうび
6. <span lang="ja">パーティー</span> → **<kbd>pa-thi-</kbd>**
7. Du willst <span lang="ja">箸</span>, der IME zeigt <span lang="ja">橋</span>. Was tun? → **Noch einmal <kbd>Leertaste</kbd> und in der Liste <span lang="ja">箸</span> wählen**
:::
