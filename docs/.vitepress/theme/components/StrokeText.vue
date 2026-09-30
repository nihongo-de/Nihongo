<script setup lang="ts">
import { computed, ref } from 'vue'
import StrokeDialog from './StrokeDialog.vue'

// Macht jede Kanji-Folge im Text antippbar und öffnet dazu die Strichfolge
const props = defineProps<{ text: string; label?: string }>()
const parts = computed(() =>
  props.text
    .split(/(\p{Script=Han}+)/u)
    .filter(Boolean)
    .map((t) => ({ t, han: /\p{Script=Han}/u.test(t) }))
)
const open = ref<string | null>(null)
</script>

<template>
  <span class="stroke-text"><template v-for="(p, i) in parts" :key="i"><button v-if="p.han" type="button" class="stroke-text__btn" lang="ja" :title="`Strichfolge von ${p.t}`" :aria-label="`${p.t}: Strichfolge und Schreibübung`" @click="open = p.t">{{ p.t }}</button><template v-else>{{ p.t }}</template></template><StrokeDialog v-if="open" :text="open" :label="label ?? open" @close="open = null" /></span>
</template>

<style scoped>
.stroke-text__btn {
  font: inherit;
  color: inherit;
  border-radius: 6px;
  text-decoration: underline dotted var(--vp-c-text-3);
  text-decoration-thickness: 1px;
  text-underline-offset: 0.18em;
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.stroke-text__btn:hover,
.stroke-text__btn:focus-visible {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

@media print {
  .stroke-text__btn { text-decoration: none; }
}
</style>
