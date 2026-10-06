---
title: N3 Kanji
description: Die 367 Kanji der JLPT-Stufe N3 mit On- und Kun-Lesung und Bedeutung – nach Häufigkeit sortiert, mit Strichfolge und Schreibübung.
---

<script setup>
import data from '../.vitepress/theme/data/n3.json'
</script>

# N3 Kanji

Mit N3 kommen **367 Kanji** zu den [N5](./kanji-n5)- und [N4 Kanji](./kanji-n4) hinzu – zusammen rund 610 Zeichen.
N3 ist die Brücke zwischen Lehrbuch und echtem Alltagsjapanisch und entspricht etwa **A2–B1** im europäischen Referenzrahmen
(mehr dazu unter [JLPT & GER](../start/jlpt)).

Die Kanji sind **nach Häufigkeit** in japanischen Zeitungstexten sortiert – die ersten Gruppen bringen dir am meisten.

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
Im [Kanji-Quiz](../uebungen/kanji-quiz#n3) kannst du die N3-Kanji per Multiple Choice, Schreibübung oder Flashcards abfragen. Weiter geht es mit den [N2 Kanji](./kanji-n2).

Stufenzuordnung nach den Listen von Jonathan Waller ([tanos.co.uk](https://www.tanos.co.uk/jlpt/), CC BY), Lesungen und Häufigkeit aus
[KANJIDIC](https://www.edrdg.org/wiki/index.php/KANJIDIC_Project) (EDRDG, CC BY-SA 4.0). Die deutschen Bedeutungen sind knappe Übersetzungen der KANJIDIC-Einträge.
:::
