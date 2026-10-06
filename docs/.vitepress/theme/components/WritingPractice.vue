<script setup lang="ts">
import { computed } from 'vue'
import WritingPad from './WritingPad.vue'
import { ratingLabels, type Glyph, type Rating } from '../utils/strokes'

// Feste Abmessungen für Kopfzeile, Schreibfeld und Knopfleiste: Nichts verschiebt sich beim Aufdecken oder Weiterblättern.
const props = defineProps<{
  glyph: Glyph | null | undefined
  label: string
  guide?: boolean
  /** Hervorgehobene Bewertung */
  rated?: Rating | null
}>()
const strokes = defineModel<[number, number][][]>('strokes', { required: true })
const revealed = defineModel<boolean>('revealed', { required: true })
const emit = defineEmits<{ rate: [Rating] }>()

const RATINGS: { r: Rating; turn: number }[] = [
  { r: 'again', turn: 180 },
  { r: 'almost', turn: -90 },
  { r: 'good', turn: 0 }
]

const expected = computed(() => props.glyph?.strokes.length ?? 0)
const countOk = computed(() => strokes.value.length === expected.value)
const countTitle = computed(() =>
  countOk.value
    ? 'Die Anzahl der Striche stimmt.'
    : `Du hast ${strokes.value.length} Strich${strokes.value.length === 1 ? '' : 'e'} gezeichnet, richtig sind ${expected.value}.`
)
</script>

<template>
  <div class="wp">
    <div class="wp__meta">
      <div class="wp__meta-main"><slot name="meta" /></div>
      <span
        v-if="revealed && glyph && strokes.length"
        class="wp__count"
        :class="countOk ? 'is-ok' : 'is-off'"
        :title="countTitle"
      >
        {{ strokes.length }}/{{ expected }} Striche
      </span>
    </div>

    <div class="wp__row">
      <div class="wp__stage">
        <WritingPad v-if="glyph" v-model="strokes" :glyph="glyph" :guide="guide" :revealed="revealed" :label="label" />
        <p v-else class="wp__status">{{ glyph === undefined ? 'Lade …' : 'Für dieses Zeichen gibt es noch keine Strichdaten.' }}</p>
      </div>
      <slot name="side" />
    </div>

    <div class="wp__bar">
      <template v-if="!revealed">
        <button type="button" title="Letzten Strich zurücknehmen" :disabled="!strokes.length" @click="strokes = strokes.slice(0, -1)">
          ↶ Zurück
        </button>
        <button type="button" :disabled="!strokes.length" @click="strokes = []">Löschen</button>
        <button type="button" class="is-primary" :disabled="!glyph" @click="revealed = true">
          {{ strokes.length ? 'Prüfen' : 'Lösung' }}
        </button>
      </template>
      <template v-else>
        <button
          v-for="{ r, turn } in RATINGS"
          :key="r"
          type="button"
          class="wp__thumb"
          :class="`is-${r}`"
          :title="ratingLabels[r]"
          :aria-label="`Selbstbewertung: ${ratingLabels[r]}`"
          :aria-pressed="rated === r"
          @click="emit('rate', r)"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" :style="{ transform: `rotate(${turn}deg)` }">
            <rect x="2" y="10" width="4" height="11" rx="1" />
            <path d="M6 10.5l3.5-7.3a1.8 1.8 0 0 1 3.4 1L12.3 9h6.2a2.2 2.2 0 0 1 2.1 2.8l-2 7.2a2.2 2.2 0 0 1-2.1 1.6H6" />
            <path d="M12.8 13h7M12.8 16.8h6" />
          </svg>
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.wp {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.wp__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  max-width: 300px;
  height: 32px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.wp__meta-main {
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.wp__count {
  flex-shrink: 0;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.wp__count.is-ok { color: var(--vp-c-success-1); background: var(--vp-c-success-soft); }
.wp__count.is-off { color: var(--vp-c-warning-1); background: var(--vp-c-warning-soft); }

/* Platz für optionale Knöpfe links und rechts (Slot „side“) */
.wp__row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
}

/* Quadratische Bühne: auch zweiteilige Kana (きゃ) ändern die Höhe nicht */
.wp__stage {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
  max-width: 300px;
  aspect-ratio: 1;
}

.wp__status { margin: 0; font-size: 14px; color: var(--vp-c-text-2); }

.wp__bar {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  width: 100%;
  max-width: 300px;
}

.wp__bar button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  transition: border-color 0.2s ease, background-color 0.2s ease, filter 0.2s ease;
}

.wp__bar button:hover:not(:disabled) { border-color: var(--vp-c-brand-1); }
.wp__bar button:disabled { opacity: 0.45; cursor: not-allowed; }
.wp__bar button.is-primary { border-color: transparent; color: #fff; background: var(--vp-c-brand-1); }
.wp__bar button.is-primary:hover:not(:disabled) { filter: brightness(1.1); }

.wp__thumb svg {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.wp__bar .wp__thumb.is-again { border-color: var(--vp-c-danger-2); color: var(--vp-c-danger-1); background: var(--vp-c-danger-soft); }
.wp__bar .wp__thumb.is-almost { border-color: var(--vp-c-warning-2); color: var(--vp-c-warning-1); background: var(--vp-c-warning-soft); }
.wp__bar .wp__thumb.is-good { border-color: var(--vp-c-success-2); color: var(--vp-c-success-1); background: var(--vp-c-success-soft); }
.wp__bar .wp__thumb:hover { filter: brightness(1.08); }
.wp__bar .wp__thumb.is-again:hover { border-color: var(--vp-c-danger-1); }
.wp__bar .wp__thumb.is-almost:hover { border-color: var(--vp-c-warning-1); }
.wp__bar .wp__thumb.is-good:hover { border-color: var(--vp-c-success-1); }
.wp__thumb[aria-pressed='true'] { box-shadow: inset 0 0 0 2px currentColor; }
</style>
