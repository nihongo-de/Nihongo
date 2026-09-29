<script setup lang="ts">
import { computed } from 'vue'
import { parseRuby } from '../utils/ruby'

const props = defineProps<{ text: string }>()
const segments = computed(() => parseRuby(props.text))
</script>

<template>
  <template v-for="(s, i) in segments" :key="i">
    <ruby v-if="s.rt">{{ s.text }}<rt>{{ s.rt }}</rt></ruby>
    <template v-else>{{ s.text }}</template>
  </template>
</template>
