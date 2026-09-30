<script setup lang="ts">
import { computed } from 'vue'
import { findN5Group } from '../data/n5'
import { findN4Group } from '../data/n4'
import type { Kanji } from '../data/levels'
import KanjiCard from './KanjiCard.vue'

// Entweder eine Gruppe aus N5/N4 per Name oder direkt eine Liste (N3–N1, auf der Seite importiert)
const props = withDefaults(defineProps<{ group?: string; level?: 'n5' | 'n4'; kanji?: Kanji[] }>(), { level: 'n5' })
const list = computed<Kanji[]>(
  () => props.kanji ?? (props.group ? (props.level === 'n4' ? findN4Group(props.group) : findN5Group(props.group))?.kanji : undefined) ?? []
)
</script>

<template>
  <div class="kanji-grid">
    <KanjiCard v-for="c in list" :key="c.k" :k="c.k" :de="c.de" :on="c.on" :kun="c.kun" :ex="c.ex" :ex-de="c.exDe" />
  </div>
</template>
