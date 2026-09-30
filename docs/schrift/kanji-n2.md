---
title: N2 Kanji
description: Die 367 Kanji der JLPT-Stufe N2 mit On- und Kun-Lesung und Bedeutung – nach Häufigkeit sortiert, mit Strichfolge und Schreibübung.
---

<script setup>
import data from '../.vitepress/theme/data/n2.json'
</script>

# N2 Kanji

N2 ergänzt weitere **367 Kanji** – mit den Stufen N5 bis N3 kennst du dann knapp 1.000 Zeichen.
Das reicht für Zeitungsartikel zu allgemeinen Themen und entspricht etwa **B1–B2** im europäischen Referenzrahmen
(mehr dazu unter [JLPT & GER](../start/jlpt)). Viele japanische Firmen verlangen N2 als Mindestniveau.

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
Im [Kanji-Quiz](../uebungen/kanji-quiz) kannst du die N2-Kanji per Multiple Choice, Schreibübung oder Flashcards abfragen. Weiter geht es mit den [N1 Kanji](./kanji-n1).

Stufenzuordnung nach den Listen von Jonathan Waller ([tanos.co.uk](https://www.tanos.co.uk/jlpt/), CC BY), Lesungen und Häufigkeit aus
[KANJIDIC](https://www.edrdg.org/wiki/index.php/KANJIDIC_Project) (EDRDG, CC BY-SA 4.0). Die deutschen Bedeutungen sind knappe Übersetzungen der KANJIDIC-Einträge.
:::
