<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { kanaSets, toKatakana, type KanaSet } from '../data/kana'
import { loadRatings, ratingLabels, ratings } from '../utils/strokes'
import StrokeDialog from './StrokeDialog.vue'

const props = withDefaults(
  defineProps<{
    script?: 'hiragana' | 'katakana'
    set?: KanaSet
  }>(),
  { script: 'hiragana', set: 'basic' }
)

const quiz = ref(false)
const table = computed(() => kanaSets[props.set])
const show = (kana: string) => (props.script === 'katakana' ? toKatakana(kana) : kana)

const open = ref<{ text: string; label: string } | null>(null)
const shown = ref(new Set<string>())

// Im Quiz-Modus deckt das erste Antippen (Touch) die Lösung auf, erst das zweite öffnet die Strichfolge
function onCell(kana: string, romaji: string) {
  if (quiz.value && !shown.value.has(kana) && !matchMedia('(hover: hover)').matches) {
    shown.value = new Set(shown.value).add(kana)
    return
  }
  open.value = { text: kana, label: romaji }
}

function toggleQuiz() {
  quiz.value = !quiz.value
  shown.value = new Set()
}

onMounted(loadRatings)
</script>

<template>
  <div class="kana-chart" :class="{ 'is-quiz': quiz }">
    <div class="kana-chart__bar">
      <span class="kana-chart__label">{{ table.label }}</span>
      <button type="button" class="kana-chart__toggle" :aria-pressed="quiz" @click="toggleQuiz">
        {{ quiz ? 'Rōmaji zeigen' : 'Quiz-Modus' }}
      </button>
    </div>
    <div class="kana-chart__grid" :style="{ '--cols': table.columns }">
      <template v-for="(row, ri) in table.rows" :key="ri">
        <template v-for="(cell, ci) in row" :key="`${ri}-${ci}`">
          <button
            v-if="cell"
            type="button"
            class="kana-cell"
            :class="{ 'is-shown': shown.has(show(cell[0])) }"
            :aria-label="quiz ? show(cell[0]) : `${show(cell[0])} (${cell[1]})`"
            title="Strichfolge ansehen und schreiben üben"
            @click="onCell(show(cell[0]), cell[1])"
          >
            <span class="kana-cell__kana" lang="ja">{{ show(cell[0]) }}</span>
            <span class="kana-cell__romaji">{{ cell[1] }}</span>
            <span
              v-if="ratings[show(cell[0])]"
              :class="`kana-cell__rating is-${ratings[show(cell[0])]}`"
              :title="`Selbstbewertung: ${ratingLabels[ratings[show(cell[0])]]}`"
            />
          </button>
          <div v-else class="kana-cell is-empty" />
        </template>
      </template>
    </div>
    <p v-if="quiz" class="kana-chart__hint">
      Fahre über ein Zeichen oder tippe es an, um die Lösung zu sehen. Ein Klick (bzw. zweites Antippen) öffnet die Strichfolge.
    </p>
    <p v-else class="kana-chart__hint">Tippe ein Zeichen an, um die Strichfolge zu sehen und es selbst zu schreiben.</p>
    <StrokeDialog v-if="open" :text="open.text" :label="open.label" @close="open = null" />
  </div>
</template>

<style scoped>
.kana-chart {
  margin: 24px 0;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}

.kana-chart__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.kana-chart__label {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.kana-chart__toggle {
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 999px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  transition: filter 0.2s ease;
}

.kana-chart__toggle:hover { filter: brightness(1.1); }

.kana-chart__grid {
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  gap: 8px;
  max-width: calc(var(--cols) * 90px);
}

.kana-cell {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
  cursor: pointer;
  outline: none;
}

.kana-cell:not(.is-empty):hover,
.kana-cell:not(.is-empty):focus-visible {
  transform: translateY(-2px) scale(1.04);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.kana-cell.is-empty {
  background: transparent;
  border-style: dashed;
  opacity: 0.35;
  cursor: default;
}

.kana-cell__kana {
  font-size: clamp(20px, 4vw, 30px);
  line-height: 1.2;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.kana-cell__romaji {
  margin-top: 2px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--vp-c-brand-1);
  transition: opacity 0.2s ease;
}

.is-quiz .kana-cell__romaji { opacity: 0; }
.is-quiz .kana-cell:hover .kana-cell__romaji,
.is-quiz .kana-cell:focus-visible .kana-cell__romaji,
.is-quiz .kana-cell.is-shown .kana-cell__romaji { opacity: 1; }

.kana-cell__rating {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.kana-cell__rating.is-again { background: var(--vp-c-danger-1); }
.kana-cell__rating.is-almost { background: var(--vp-c-warning-1); }
.kana-cell__rating.is-good { background: var(--vp-c-success-1); }

@media print {
  .kana-cell__rating { display: none; }
}

.kana-chart__hint {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--vp-c-text-3);
}
</style>
