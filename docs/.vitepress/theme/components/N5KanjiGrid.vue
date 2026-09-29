<script setup lang="ts">
import { computed } from 'vue'
import { findN5Group } from '../data/n5'
import KanjiCard from './KanjiCard.vue'

const props = defineProps<{ group: string }>()
const kanji = computed(() => findN5Group(props.group)?.kanji ?? [])
</script>

<template>
  <div class="kanji-grid">
    <KanjiCard v-for="c in kanji" :key="c.k" v-bind="c" />
  </div>
</template>
