<script setup lang="ts">
import { computed } from 'vue'
import { splitMora } from '../utils/mora'

const props = withDefaults(
  defineProps<{
    kana: string
    /** Mora, nach der die Tonhöhe fällt (0 = keine Absenkung) */
    accent: number
    word?: string
    meaning?: string
    particle?: string
  }>(),
  { particle: 'が' }
)

const STEP = 38
const HIGH = 16
const LOW = 42

const morae = computed(() => splitMora(props.kana))

const points = computed(() => {
  const a = props.accent
  const isHigh = (i: number) => (a === 1 ? i === 0 : i > 0 && (a === 0 || i < a))
  const list = morae.value.map((label, i) => ({ label, high: isHigh(i), particle: false }))
  list.push({ label: props.particle, high: a === 0, particle: true })
  return list.map((p, i) => ({ ...p, x: i * STEP + STEP / 2, y: p.high ? HIGH : LOW }))
})

const width = computed(() => points.value.length * STEP)
const line = computed(() => points.value.map((p) => `${p.x},${p.y}`).join(' '))

const pattern = computed(() => {
  const a = props.accent
  if (a === 0) return { jp: '平板', de: 'Heiban' }
  if (a === 1) return { jp: '頭高', de: 'Atamadaka' }
  if (a === morae.value.length) return { jp: '尾高', de: 'Odaka' }
  return { jp: '中高', de: 'Nakadaka' }
})
</script>

<template>
  <figure class="pitch">
    <svg
      :viewBox="`0 0 ${width} 78`"
      :width="width"
      height="78"
      role="img"
      :aria-label="`Tonhöhenverlauf von ${kana}: ${pattern.de}`"
    >
      <polyline :points="line" class="pitch__line" />
      <circle
        v-for="(p, i) in points"
        :key="`c${i}`"
        :cx="p.x"
        :cy="p.y"
        r="5.5"
        class="pitch__dot"
        :class="{ 'is-particle': p.particle }"
      />
      <text
        v-for="(p, i) in points"
        :key="`t${i}`"
        :x="p.x"
        y="70"
        text-anchor="middle"
        class="pitch__mora"
        :class="{ 'is-particle': p.particle }"
        lang="ja"
      >{{ p.label }}</text>
    </svg>
    <figcaption>
      <div class="pitch__head">
        <span class="pitch__word" lang="ja">{{ word ?? kana }}</span>
        <span v-if="word" class="pitch__kana" lang="ja">{{ kana }}</span>
        <span class="pitch__badge" :title="pattern.jp">{{ pattern.de }} [{{ accent }}]</span>
      </div>
      <div v-if="meaning" class="pitch__meaning">{{ meaning }}</div>
    </figcaption>
  </figure>
</template>

<style scoped>
.pitch {
  display: inline-flex;
  flex-direction: column;
  gap: 6px;
  margin: 6px 10px 6px 0;
  padding: 12px 14px 10px;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  vertical-align: top;
}

svg { overflow: visible; }

.pitch__line {
  fill: none;
  stroke: var(--vp-c-brand-1);
  stroke-width: 2.5;
  stroke-linejoin: round;
  stroke-linecap: round;
}

.pitch__dot {
  fill: var(--vp-c-brand-1);
}

.pitch__dot.is-particle {
  fill: var(--vp-c-bg-soft);
  stroke: var(--vp-c-brand-1);
  stroke-width: 2;
}

.pitch__mora {
  font-size: 17px;
  fill: var(--vp-c-text-1);
}

.pitch__mora.is-particle { fill: var(--vp-c-text-3); }

figcaption { font-size: 14px; }

.pitch__head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  white-space: nowrap;
}

.pitch__word {
  font-size: 18px;
  font-weight: 700;
}

.pitch__kana { color: var(--vp-c-text-2); }

.pitch__badge {
  padding: 1px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.pitch__meaning {
  width: 0;
  min-width: 100%;
  margin-top: 2px;
  color: var(--vp-c-text-2);
}
</style>
