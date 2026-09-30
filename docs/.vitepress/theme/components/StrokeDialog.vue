<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import WritingPractice from './WritingPractice.vue'
import { CELL, gridPaths, loadGlyph, rate, ratingLabels, ratings, type Glyph, type Rating } from '../utils/strokes'

const props = defineProps<{ text: string; label: string }>()
const emit = defineEmits<{ close: [] }>()

const panel = ref<HTMLElement>()
const glyph = ref<Glyph | null>()
const tab = ref<'watch' | 'write'>('watch')
const count = computed(() => glyph.value?.strokes.length ?? 0)
const grid = computed(() => gridPaths(glyph.value?.width ?? CELL))
const shift = (x: number) => (x ? `translate(${x} 0)` : undefined)

/* Animation */
const SPEED = 0.08 // viewBox-Einheiten pro ms
const PAUSE = 300
const pos = ref(0)
const playing = ref(false)
const showNumbers = ref(true)
const ghostEls: SVGPathElement[] = []
const lengths = ref<number[]>([])
let raf = 0
let last = 0
let hold = 0

const progress = (i: number) => Math.min(1, Math.max(0, pos.value - i))
const current = computed(() => (pos.value >= count.value ? -1 : Math.ceil(pos.value) - 1))

function strokeStyle(i: number) {
  const p = progress(i)
  if (p === 0) return { opacity: 0 }
  const len = lengths.value[i]
  if (!len || p === 1) return undefined
  return { strokeDasharray: `${len} ${len}`, strokeDashoffset: len * (1 - p) }
}

function tick(t: number) {
  const dt = last ? t - last : 0
  last = t
  if (hold > 0) {
    hold -= dt
  } else {
    const i = Math.floor(pos.value)
    const next = pos.value + (dt * SPEED) / (lengths.value[i] || 40)
    if (next >= i + 1) {
      pos.value = i + 1
      hold = PAUSE
    } else {
      pos.value = next
    }
  }
  if (pos.value >= count.value) return stop()
  raf = requestAnimationFrame(tick)
}

function play() {
  if (pos.value >= count.value) pos.value = 0
  playing.value = true
  last = 0
  hold = pos.value === 0 ? 0 : PAUSE
  raf = requestAnimationFrame(tick)
}

function stop() {
  cancelAnimationFrame(raf)
  playing.value = false
}

function goTo(p: number) {
  stop()
  pos.value = Math.min(count.value, Math.max(0, p))
}

/* Schreibfeld */
const userStrokes = ref<[number, number][][]>([])
const showGuide = ref(true)
const revealed = ref(false)
const rated = ref<Rating | null>(null)

// Nach der Bewertung beginnt sofort ein neuer Versuch
function selfRate(r: Rating) {
  rate(props.text, r)
  rated.value = r
  userStrokes.value = []
  revealed.value = false
}

const lastRating = computed(() => ratings.value[props.text])

/* Dialog */
let returnFocus: HTMLElement | null = null
let prevOverflow = ''
const onKey = (e: KeyboardEvent) => e.key === 'Escape' && emit('close')

onMounted(async () => {
  returnFocus = document.activeElement as HTMLElement | null
  prevOverflow = document.documentElement.style.overflow
  document.documentElement.style.overflow = 'hidden'
  window.addEventListener('keydown', onKey)
  panel.value?.focus()

  glyph.value = await loadGlyph(props.text)
  if (!glyph.value) return
  await nextTick()
  lengths.value = ghostEls.map((el) => el.getTotalLength())
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) pos.value = count.value
  else play()
})

onBeforeUnmount(() => {
  stop()
  window.removeEventListener('keydown', onKey)
  document.documentElement.style.overflow = prevOverflow
  returnFocus?.focus()
})
</script>

<template>
  <Teleport to="body">
    <div class="ks" @click.self="emit('close')">
      <div
        ref="panel"
        class="ks__panel"
        role="dialog"
        aria-modal="true"
        :aria-label="`Strichfolge von ${text}`"
        tabindex="-1"
      >
        <header class="ks__head">
          <span class="ks__char" lang="ja">{{ text }}</span>
          <span class="ks__title">
            <strong>{{ label }}</strong>
            <small v-if="count">{{ count }} Strich{{ count === 1 ? '' : 'e' }}</small>
          </span>
          <button type="button" class="ks__close" aria-label="Schließen" @click="emit('close')">×</button>
        </header>

        <div class="ks__tabs" role="tablist">
          <button type="button" role="tab" :aria-selected="tab === 'watch'" @click="tab = 'watch'">Strichfolge</button>
          <button type="button" role="tab" :aria-selected="tab === 'write'" @click="tab = 'write'; stop()">
            Schreiben üben
          </button>
        </div>

        <p v-if="glyph === undefined" class="ks__status">Strichdaten werden geladen …</p>
        <p v-else-if="glyph === null" class="ks__status">Für dieses Zeichen gibt es noch keine Strichdaten.</p>

        <div v-else class="ks__body">
          <!-- Ansehen -->
          <section v-show="tab === 'watch'" class="ks__section">
            <svg
              class="ks__board"
              :viewBox="`0 0 ${glyph.width} ${CELL}`"
              :style="{ aspectRatio: `${glyph.width} / ${CELL}`, maxWidth: `${(glyph.width / CELL) * (glyph.width > CELL ? 210 : 300)}px` }"
              aria-hidden="true"
            >
              <path class="ks__frame" :d="grid.frame" />
              <path class="ks__guides" :d="grid.guides" />
              <g class="ks__ghost">
                <path
                  v-for="(s, i) in glyph.strokes"
                  :key="i"
                  :ref="(el) => (ghostEls[i] = el as SVGPathElement)"
                  :d="s.d"
                  :transform="shift(s.x)"
                />
              </g>
              <g class="ks__ink">
                <path
                  v-for="(s, i) in glyph.strokes"
                  :key="i"
                  :d="s.d"
                  :transform="shift(s.x)"
                  :class="{ 'is-current': i === current }"
                  :style="strokeStyle(i)"
                />
              </g>
              <g v-if="showNumbers" class="ks__nums">
                <template v-for="([x, y], i) in glyph.nums" :key="i">
                  <text v-if="progress(i) > 0" :x="x" :y="y" :class="{ 'is-current': i === current }">{{ i + 1 }}</text>
                </template>
              </g>
            </svg>

            <div class="ks__controls">
              <button type="button" aria-label="Zum Anfang" title="Zum Anfang" @click="goTo(0)">
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3h2v10H3zM13 3v10L6 8z" /></svg>
              </button>
              <button type="button" aria-label="Strich zurück" title="Strich zurück" @click="goTo(Math.ceil(pos) - 1)">
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M11 3v10L4 8z" /></svg>
              </button>
              <button type="button" class="is-primary" @click="playing ? stop() : play()">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path v-if="playing" d="M4 3h3v10H4zM9 3h3v10H9z" />
                  <path v-else d="M5 3v10l8-5z" />
                </svg>
                {{ playing ? 'Pause' : pos >= count ? 'Nochmal' : 'Abspielen' }}
              </button>
              <button type="button" aria-label="Nächster Strich" title="Nächster Strich" @click="goTo(Math.floor(pos) + 1)">
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3v10l7-5z" /></svg>
              </button>
              <button type="button" aria-label="Alle Striche" title="Alle Striche" @click="goTo(count)">
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3v10l7-5zM11 3h2v10h-2z" /></svg>
              </button>
            </div>

            <label class="ks__check"><input v-model="showNumbers" type="checkbox" /> Strichnummern anzeigen</label>

            <ol class="ks__steps" aria-label="Strichfolge Schritt für Schritt">
              <li v-for="(_, i) in glyph.strokes" :key="i">
                <button
                  type="button"
                  :class="{ 'is-active': i === current || (current === -1 && i === count - 1) }"
                  :aria-label="`Strich ${i + 1}`"
                  @click="goTo(i + 1)"
                >
                  <svg :viewBox="`0 0 ${glyph.width} ${CELL}`" :style="{ width: `${(glyph.width / CELL) * 44}px` }" aria-hidden="true">
                    <path class="ks__guides" :d="grid.guides" />
                    <path
                      v-for="j in i + 1"
                      :key="j"
                      :d="glyph.strokes[j - 1].d"
                      :transform="shift(glyph.strokes[j - 1].x)"
                      :class="{ 'is-new': j === i + 1 }"
                    />
                  </svg>
                  <span>{{ i + 1 }}</span>
                </button>
              </li>
            </ol>
          </section>

          <!-- Schreiben -->
          <section v-show="tab === 'write'" class="ks__section">
            <WritingPractice
              v-model:strokes="userStrokes"
              v-model:revealed="revealed"
              :glyph="glyph"
              :guide="showGuide"
              :label="`Schreibfeld für ${text}`"
              @rate="selfRate"
            >
              <template #meta>
                <template v-if="revealed">Wie gut hat es geklappt?</template>
                <template v-else-if="rated && !userStrokes.length">
                  Gespeichert: <span :class="`ks__badge is-${rated}`">{{ ratingLabels[rated] }}</span>
                </template>
                <template v-else>Zeichne mit Finger, Stift oder Maus.</template>
              </template>
            </WritingPractice>
            <div class="ks__foot-row">
              <label class="ks__check" :class="{ 'is-off': revealed }">
                <input v-model="showGuide" type="checkbox" :disabled="revealed" /> Vorlage einblenden
              </label>
              <span v-if="lastRating && !rated" class="ks__last">
                Zuletzt: <span :class="`ks__badge is-${lastRating}`">{{ ratingLabels[lastRating] }}</span>
              </span>
            </div>
          </section>
        </div>

        <footer class="ks__foot">
          Strichdaten: <a href="https://kanjivg.tagaini.net" target="_blank" rel="noopener">KanjiVG</a> (CC BY-SA 3.0)
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.ks {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  /* Oben verankert: Wechsel zwischen den Reitern verschiebt Kopf und Reiter nicht */
  align-items: flex-start;
  justify-content: center;
  padding: max(12px, 4vh) 12px 12px;
  background: rgba(0, 0, 0, 0.45);
}

.ks__panel {
  display: flex;
  flex-direction: column;
  width: min(460px, 100%);
  max-height: 100%;
  overflow-y: auto;
  border-radius: var(--nh-radius);
  background: var(--vp-c-bg);
  box-shadow: var(--nh-shadow);
  outline: none;
}

.ks__head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px 12px 20px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.ks__char { font-size: 34px; line-height: 1.1; }
.ks__title { display: flex; flex-direction: column; flex: 1; line-height: 1.3; }
.ks__title small { font-size: 13px; color: var(--vp-c-text-2); }

.ks__close {
  align-self: flex-start;
  font-size: 26px;
  line-height: 1;
  color: var(--vp-c-text-2);
}

.ks__close:hover { color: var(--vp-c-text-1); }

.ks__tabs {
  display: flex;
  gap: 4px;
  margin: 14px 20px 0;
  padding: 4px;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.ks__tabs button {
  flex: 1;
  padding: 6px 10px;
  border-radius: 7px;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.ks__tabs button[aria-selected='true'] {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.ks__status { padding: 24px 20px; color: var(--vp-c-text-2); }

.ks__section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
}

.ks__board {
  width: 100%;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.ks__board,
.ks__steps svg {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ks__frame,
.ks__guides {
  stroke: var(--vp-c-divider);
  stroke-width: 1px;
  vector-effect: non-scaling-stroke;
}

.ks__guides { stroke-dasharray: 4 4; }

.ks__ghost path { stroke: var(--vp-c-text-3); stroke-width: 3; opacity: 0.3; }
.ks__ink path { stroke: var(--vp-c-text-1); stroke-width: 3.5; }
.ks__ink path.is-current { stroke: var(--vp-c-brand-1); }

.ks__nums text {
  font-size: 8px;
  font-family: var(--vp-font-family-base);
  fill: var(--vp-c-text-2);
  stroke: none;
}

.ks__nums text.is-current { fill: var(--vp-c-brand-1); font-weight: 700; }

.ks__controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
}

.ks__controls button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 40px;
  padding: 6px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.ks__controls svg { width: 14px; height: 14px; fill: currentColor; }
.ks__controls button:hover:not(:disabled) { border-color: var(--vp-c-brand-1); }
.ks__controls button:disabled { opacity: 0.45; cursor: not-allowed; }

.ks__controls button.is-primary {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  background: var(--vp-c-brand-1);
}

.ks__controls button.is-primary:hover:not(:disabled) { background: var(--vp-c-brand-2); }

.ks__check {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--vp-c-text-2);
  cursor: pointer;
}

.ks__check input { accent-color: var(--vp-c-brand-1); }
.ks__check.is-off { opacity: 0.45; cursor: default; }

.ks__steps {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  margin: 4px 0 0;
  padding: 0;
  list-style: none;
}

.ks__steps button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3px 3px 1px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  font-size: 11px;
  color: var(--vp-c-text-2);
}

.ks__steps button.is-active { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }

.ks__steps svg { height: 44px; }
.ks__steps svg > path:not(.ks__guides) { stroke: var(--vp-c-text-2); stroke-width: 5; }
.ks__steps svg > path.is-new { stroke: var(--vp-c-brand-1); }

.ks__foot-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  max-width: 300px;
  min-height: 24px;
}

.ks__badge {
  padding: 1px 8px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.ks__badge.is-again { color: var(--vp-c-danger-1); background: var(--vp-c-danger-soft); }
.ks__badge.is-almost { color: var(--vp-c-warning-1); background: var(--vp-c-warning-soft); }
.ks__badge.is-good { color: var(--vp-c-success-1); background: var(--vp-c-success-soft); }

.ks__last { font-size: 13px; color: var(--vp-c-text-2); white-space: nowrap; }

.ks__foot {
  margin-top: auto;
  padding: 10px 20px;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.ks__foot a { color: inherit; text-decoration: underline; }
</style>
