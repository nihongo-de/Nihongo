<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Kanji, Level } from '../data/levels'

export interface PickerLevel {
  id: Level
  label: string
  groups: { id: string; title: string; kanji: Kanji[] }[]
}

const props = defineProps<{ levels: PickerLevel[]; weak?: Kanji[]; openLevel?: Level }>()
const selected = defineModel<Set<string>>({ required: true })

const openLevels = ref(new Set<Level>(['n5']))
watch(
  () => props.openLevel,
  (id) => {
    if (id) openLevels.value = new Set([id])
  }
)
const levelItems = (id: Level) => props.levels.find((l) => l.id === id)?.groups.flatMap((g) => g.kanji) ?? []
const countIn = (items: Kanji[]) => items.filter((i) => selected.value.has(i.k)).length

function onToggleLevel(id: Level, e: Event) {
  const next = new Set(openLevels.value)
  if ((e.target as HTMLDetailsElement).open) next.add(id)
  else next.delete(id)
  openLevels.value = next
}

function toggle(k: string) {
  const next = new Set(selected.value)
  if (!next.delete(k)) next.add(k)
  selected.value = next
}

function setMany(items: Kanji[], on: boolean) {
  const next = new Set(selected.value)
  items.forEach((i) => (on ? next.add(i.k) : next.delete(i.k)))
  selected.value = next
}
</script>

<template>
  <div class="kp">
    <div class="kp__quick">
      <button v-for="l in levels" :key="l.id" type="button" @click="setMany(levelItems(l.id), true)">Alle {{ l.label }}</button>
      <button v-if="weak?.length" type="button" @click="selected = new Set(weak.map((i) => i.k))">
        Zum Üben markierte ({{ weak.length }})
      </button>
      <button type="button" @click="selected = new Set()">Keine</button>
    </div>
    <details v-for="l in levels" :key="l.id" class="kp__level" :open="openLevels.has(l.id)" @toggle="onToggleLevel(l.id, $event)">
      <summary>
        {{ l.label }}-Kanji <span class="kp__muted">{{ countIn(levelItems(l.id)) }} / {{ levelItems(l.id).length }}</span>
      </summary>
      <template v-if="openLevels.has(l.id)">
        <div v-for="g in l.groups" :key="g.id" class="kp__pick">
          <label class="kp__pick-head">
            <input
              type="checkbox"
              :checked="countIn(g.kanji) === g.kanji.length"
              :indeterminate="countIn(g.kanji) > 0 && countIn(g.kanji) < g.kanji.length"
              @change="setMany(g.kanji, ($event.target as HTMLInputElement).checked)"
            />
            {{ g.title }}
          </label>
          <div class="kp__chips">
            <button
              v-for="c in g.kanji"
              :key="c.k"
              type="button"
              lang="ja"
              :title="c.de"
              :aria-label="`${c.k} (${c.de})`"
              :aria-pressed="selected.has(c.k)"
              @click="toggle(c.k)"
            >
              {{ c.k }}
            </button>
          </div>
        </div>
      </template>
    </details>
  </div>
</template>

<style scoped>
.kp__muted { color: var(--vp-c-text-3); font-weight: 400; }

.kp__quick { display: flex; flex-wrap: wrap; gap: 4px 14px; margin-bottom: 8px; }
.kp__quick button { font-size: 13px; font-weight: 600; color: var(--vp-c-brand-1); }
.kp__quick button:hover { text-decoration: underline; }

.kp__level {
  margin-top: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
}

.kp__level summary {
  margin: 0;
  padding: 8px 14px;
  font-weight: 600;
  cursor: pointer;
}

.kp__pick { padding: 6px 14px 10px; border-top: 1px solid var(--vp-c-divider); }

.kp__pick-head {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.kp__pick-head input { accent-color: var(--vp-c-brand-1); width: 16px; height: 16px; }

.kp__chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }

.kp__chips button {
  width: 34px;
  height: 34px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  font-size: 18px;
  color: var(--vp-c-text-3);
  transition: border-color 0.15s ease, background-color 0.15s ease, color 0.15s ease;
}

.kp__chips button:hover { border-color: var(--vp-c-brand-1); }

.kp__chips button[aria-pressed='true'] {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
  background: var(--vp-c-brand-soft);
}
</style>
