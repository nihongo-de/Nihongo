<script setup lang="ts">
import { computed } from 'vue'
import { findN5Group } from '../data/n5'
import { findN4Group } from '../data/n4'
import KanjiCard from './KanjiCard.vue'

const props = withDefaults(defineProps<{ group: string; level?: 'n5' | 'n4' }>(), { level: 'n5' })
const kanji = computed(() => (props.level === 'n4' ? findN4Group(props.group) : findN5Group(props.group))?.kanji ?? [])
</script>

<template>
  <div class="kanji-grid">
    <KanjiCard v-for="c in kanji" :key="c.k" v-bind="c" />
  </div>
</template>
