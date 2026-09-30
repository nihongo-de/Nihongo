---
title: N1 Kanji
description: Die 1.232 Kanji der JLPT-Stufe N1 mit On- und Kun-Lesung und Bedeutung – nach Häufigkeit sortiert, mit Strichfolge und Schreibübung.
---

<script setup>
import data from '../.vitepress/theme/data/n1.json'
</script>

# N1 Kanji

N1 ist die höchste Stufe: **1.232 weitere Kanji**, zusammen mit N5 bis N2 rund 2.200 Zeichen – das deckt die
[Jōyō-Kanji](./kanji) für den Alltag ab und geht mit vielen Namens-Kanji noch darüber hinaus.
Das Niveau entspricht etwa **B2–C1** im europäischen Referenzrahmen (mehr dazu unter [JLPT & GER](../start/jlpt)).

Die Kanji sind **nach Häufigkeit** in japanischen Zeitungstexten sortiert. Die letzten Gruppen enthalten vor allem
seltene Zeichen und Kanji, die fast nur in **Personennamen** vorkommen – die kannst du dir für später aufheben.

::: tip So liest du die Karten
<span lang="ja">音</span> = **On-Lesung** (Katakana), <span lang="ja">訓</span> = **Kun-Lesung** (Hiragana, Endungen in Klammern).
Gezeigt werden höchstens drei Lesungen je Art; ein „–“ heißt, dass es keine gebräuchliche gibt.

Tippe auf ein Kanji, um die **Strichfolge** als Animation zu sehen und das Zeichen selbst nachzuzeichnen.
:::

<template v-for="g in data.groups" :key="g.id">
<h2 :id="g.id" tabindex="-1">{{ g.title }} <a class="header-anchor" :href="`#${g.id}`" :aria-label="`Permalink zu ${g.title}`">&#8203;</a></h2>
<KanjiGrid :kanji="g.kanji" />
</template>

::: info Weiter üben und Quellen
Im [Kanji-Quiz](../uebungen/kanji-quiz) kannst du die N1-Kanji per Multiple Choice, Schreibübung oder Flashcards abfragen – am besten gruppenweise.

Stufenzuordnung nach den Listen von Jonathan Waller ([tanos.co.uk](https://www.tanos.co.uk/jlpt/), CC BY), Lesungen und Häufigkeit aus
[KANJIDIC](https://www.edrdg.org/wiki/index.php/KANJIDIC_Project) (EDRDG, CC BY-SA 4.0). Die deutschen Bedeutungen sind knappe Übersetzungen der KANJIDIC-Einträge.
:::
