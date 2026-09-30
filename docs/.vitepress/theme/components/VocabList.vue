<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { vocabTopic } from '../data/vocab'
import RubyText from './RubyText.vue'
import SpeakButton from './SpeakButton.vue'

const props = defineProps<{ topic: string }>()
const words = computed(() => vocabTopic(props.topic)?.words ?? [])

type Side = 'jp' | 'de'
const cover = ref<Side | null>(null)
const shown = reactive(new Set<number>())

function setCover(side: Side) {
  cover.value = cover.value === side ? null : side
  shown.clear()
}

const hidden = (side: Side, i: number) => cover.value === side && !shown.has(i)
</script>

<template>
  <div class="vl">
    <div class="vl__bar">
      <span>{{ words.length }} Wörter</span>
      <span class="vl__cover" role="group" aria-label="Spalte zum Abfragen abdecken">
        Abdecken:
        <button type="button" :aria-pressed="cover === 'jp'" @click="setCover('jp')">Japanisch</button>
        <button type="button" :aria-pressed="cover === 'de'" @click="setCover('de')">Deutsch</button>
      </span>
    </div>
    <table>
      <thead>
        <tr>
          <th>Japanisch</th>
          <th>Rōmaji</th>
          <th>Deutsch</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(w, i) in words" :key="w.jp">
          <td class="vl__jp" lang="ja">
            <button v-if="hidden('jp', i)" type="button" class="vl__hidden" :aria-label="`Aufdecken: ${w.de}`" @click="shown.add(i)">?</button>
            <RubyText v-else :text="w.jp" />
            <SpeakButton class="vl__speak" :text="w.word.replace('〜', '')" />
          </td>
          <td class="vl__ro">
            <button v-if="hidden('jp', i)" type="button" class="vl__hidden" aria-label="Aufdecken" @click="shown.add(i)">?</button>
            <template v-else>{{ w.romaji }}</template>
          </td>
          <td>
            <button v-if="hidden('de', i)" type="button" class="vl__hidden" :aria-label="`Aufdecken: ${w.word}`" @click="shown.add(i)">?</button>
            <template v-else>{{ w.de }}</template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.vl { margin: 16px 0 24px; }

.vl__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.vl__cover { display: flex; align-items: center; gap: 6px; }
.vl__cover button {
  padding: 2px 12px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}
.vl__cover button[aria-pressed='true'] { color: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }

.vp-doc .vl table { display: table; width: 100%; margin: 8px 0 0; }
.vp-doc .vl td { padding: 6px 12px; }
.vl__jp { font-size: 18px; line-height: 1.9; white-space: nowrap; }
.vl__jp :deep(rt) { font-size: 0.55em; }
.vl__speak { margin-left: 4px; vertical-align: middle; }
.vl__ro { font-size: 14px; color: var(--vp-c-text-2); }

.vl__hidden {
  min-width: 3em;
  padding: 0 10px;
  border-radius: 6px;
  font-size: 14px;
  color: var(--vp-c-text-3);
  background: var(--vp-c-default-soft);
}
.vl__hidden:hover { color: var(--vp-c-brand-1); }

@media print {
  .vl__bar { display: none; }
  .vp-doc .vl tr { break-inside: avoid; }
}
</style>
