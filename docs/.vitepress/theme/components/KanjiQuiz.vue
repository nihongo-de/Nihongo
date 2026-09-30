<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { levelLabels, loadLevel, type Kanji, type Level } from '../data/levels'
import { n5Groups } from '../data/n5'
import { n4Groups } from '../data/n4'
import RubyText from './RubyText.vue'
import WritingPractice from './WritingPractice.vue'
import StrokeDialog from './StrokeDialog.vue'
import KanjiPicker from './KanjiPicker.vue'
import { loadGlyph, loadRatings, rate, ratings, type Glyph, type Rating } from '../utils/strokes'
import { recordResult } from '../utils/progress'

type Mode = 'choice' | 'write' | 'flash'
interface Item extends Kanji {
  level: Level
}
interface LevelEntry {
  id: Level
  label: string
  groups: { id: string; title: string; kanji: Item[] }[]
}

const toLevel = (id: Level, groups: { id: string; title: string; kanji: Kanji[] }[]): LevelEntry => ({
  id,
  label: levelLabels[id],
  groups: groups.map((g) => ({ id: g.id, title: g.title, kanji: g.kanji.map((k): Item => ({ ...k, level: id })) }))
})
// N3–N1 kommen nach dem Laden dazu
const LEVELS = shallowRef<LevelEntry[]>([toLevel('n5', n5Groups), toLevel('n4', n4Groups)])
const levelItems = (id: Level) => LEVELS.value.find((l) => l.id === id)?.groups.flatMap((g) => g.kanji) ?? []
const ALL_ITEMS = computed(() => LEVELS.value.flatMap((l) => l.groups.flatMap((g) => g.kanji)))

const SELECTION_KEY = 'nihongo:kanji-quiz'
const selected = ref(new Set(levelItems('n5').map((i) => i.k)))
const selectedItems = computed(() => ALL_ITEMS.value.filter((i) => selected.value.has(i.k)))
const weak = computed(() => ALL_ITEMS.value.filter((i) => ratings.value[i.k] === 'again' || ratings.value[i.k] === 'almost'))

const mode = ref<Mode>('choice')
const ask = ref<'meaning' | 'reading'>('meaning')
const seconds = ref(4)
const delay = computed(() => Math.max(0.5, Number(seconds.value) || 4))

function shuffle<T>(list: T[]): T[] {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const readings = (i: Item) => [...i.on.split('・'), ...i.kun.split('・')].filter((t) => t && t !== '–')

const phase = ref<'setup' | 'run' | 'done'>('setup')
const queue = ref<Item[]>([])
const pos = ref(0)
const total = ref(0)
const firstTry = ref(0)
const missed = ref<Item[]>([])
const current = computed(() => queue.value[pos.value])
const progress = computed(() => (queue.value.length ? (pos.value / queue.value.length) * 100 : 0))
const dialog = ref<Item | null>(null)

/* Multiple Choice */
const options = ref<Item[]>([])
const picked = ref<Item | null>(null)
let advance: ReturnType<typeof setTimeout> | undefined

function makeOptions(item: Item) {
  const own = new Set(readings(item))
  // Keine Alternativen, die ebenfalls zur Frage passen würden
  const fits = (o: Item) =>
    o.k !== item.k && (ask.value === 'meaning' ? o.de !== item.de : !readings(o).some((r) => own.has(r)))
  // Zuerst aus der eigenen Auswahl, dann aus derselben Stufe, dann aus allen
  const tiers = [selectedItems.value, levelItems(item.level), ALL_ITEMS.value].map((list) => shuffle(list.filter(fits)))
  const others = [...new Set(tiers.flat())].slice(0, 7)
  options.value = shuffle([item, ...others])
}

function pick(o: Item) {
  const item = current.value
  if (!item || picked.value) return
  picked.value = o
  const ok = o.k === item.k
  grade(item, ok)
  if (ok) advance = setTimeout(next, 700)
}

/* Schreiben & Flashcards */
const glyph = ref<Glyph | null>()
const strokes = ref<[number, number][][]>([])
const revealed = ref(false)
const showReadings = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function prepareWrite(k: string) {
  glyph.value = undefined
  const g = await loadGlyph(k)
  if (current.value?.k === k) glyph.value = g
}

function rateWriting(r: Rating) {
  const item = current.value
  if (!item) return
  rate(item.k, r)
  grade(item, r === 'good', r === 'again')
  next()
}

function reveal() {
  clearTimeout(timer)
  revealed.value = true
}

function rateFlash(ok: boolean) {
  if (!current.value || !revealed.value) return
  grade(current.value, ok)
  next()
}

/* Ablauf */
function start(items: Item[]) {
  if (!items.length) return
  queue.value = shuffle(items)
  total.value = queue.value.length
  pos.value = 0
  firstTry.value = 0
  missed.value = []
  phase.value = 'run'
  showCard()
}

function showCard() {
  clearTimeout(timer)
  clearTimeout(advance)
  picked.value = null
  revealed.value = false
  showReadings.value = false
  strokes.value = []
  const item = current.value
  if (mode.value === 'choice') makeOptions(item)
  else if (mode.value === 'write') prepareWrite(item.k)
  else timer = setTimeout(reveal, delay.value * 1000)
}

function next() {
  pos.value++
  if (pos.value >= queue.value.length) phase.value = 'done'
  else showCard()
}

function grade(item: Item, ok: boolean, requeue = !ok) {
  if (ok) {
    if (!missed.value.includes(item)) firstTry.value++
    return
  }
  if (!missed.value.includes(item)) missed.value.push(item)
  if (requeue) queue.value.push(item)
}

function onKey(e: KeyboardEvent) {
  if (phase.value !== 'run' || dialog.value || e.ctrlKey || e.metaKey || e.altKey) return
  const onControl = !!(e.target as HTMLElement | null)?.closest?.('input, textarea, select, button')
  const key = e.key
  if (mode.value === 'choice') {
    const n = Number(key)
    if (n >= 1 && n <= options.value.length && !picked.value) pick(options.value[n - 1])
    else if (key === 'Enter' && picked.value && !onControl) next()
    else return
  } else if (mode.value === 'flash') {
    if (onControl) return
    if (!revealed.value) {
      if (key === ' ' || key === 'Enter') reveal()
      else return
    } else if (key === 'Enter' || key === 'ArrowRight') rateFlash(true)
    else if (key === 'ArrowLeft' || key === 'Backspace') rateFlash(false)
    else return
  } else return
  e.preventDefault()
}

const resultLabel = computed(
  () => ({ choice: 'auf Anhieb richtig', write: 'sicher geschrieben', flash: 'auf Anhieb gewusst' })[mode.value]
)

watch(phase, (p) => {
  if (p !== 'run') {
    clearTimeout(timer)
    clearTimeout(advance)
  }
  if (p === 'done') {
    const id = mode.value === 'choice' ? `choice-${ask.value}` : mode.value
    const label = mode.value === 'choice' ? `Multiple Choice (${ask.value === 'meaning' ? 'Bedeutung' : 'Lesung'})` : mode.value === 'write' ? 'Schreiben' : 'Flashcards'
    recordResult(`kanji:${id}`, { path: '/uebungen/kanji-quiz', title: `Kanji-Quiz · ${label}` }, firstTry.value, total.value)
  }
})
watch(selected, (s) => {
  try {
    localStorage.setItem(SELECTION_KEY, JSON.stringify([...s]))
  } catch {}
})
onMounted(async () => {
  loadRatings()
  window.addEventListener('keydown', onKey)
  const extra = await Promise.all((['n3', 'n2', 'n1'] as const).map(async (id) => toLevel(id, await loadLevel(id))))
  LEVELS.value = [...LEVELS.value, ...extra]
  try {
    const saved = JSON.parse(localStorage.getItem(SELECTION_KEY) ?? 'null')
    const known = new Set(ALL_ITEMS.value.map((i) => i.k))
    if (Array.isArray(saved)) selected.value = new Set(saved.filter((k) => known.has(k)))
  } catch {}
})
onBeforeUnmount(() => {
  clearTimeout(timer)
  clearTimeout(advance)
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div class="kq">
    <template v-if="phase === 'setup'">
      <fieldset class="kq__group">
        <legend>Modus</legend>
        <label><input v-model="mode" type="radio" value="choice" /> Multiple Choice</label>
        <label><input v-model="mode" type="radio" value="write" /> Schreiben</label>
        <label><input v-model="mode" type="radio" value="flash" /> Flashcards</label>
      </fieldset>
      <fieldset v-if="mode === 'choice'" class="kq__group">
        <legend>Gefragt wird nach</legend>
        <label><input v-model="ask" type="radio" value="meaning" /> Bedeutung</label>
        <label><input v-model="ask" type="radio" value="reading" /> Lesung</label>
      </fieldset>
      <fieldset v-if="mode === 'flash'" class="kq__group">
        <legend>Lesezeit</legend>
        <label class="kq__number">
          <input v-model.number="seconds" type="number" min="0.5" max="60" step="0.5" /> Sekunden pro Karte
        </label>
      </fieldset>
      <fieldset class="kq__group is-block">
        <legend>Kanji auswählen <span class="kq__muted">· {{ selected.size }} ausgewählt</span></legend>
        <KanjiPicker v-model="selected" :levels="LEVELS" :weak="weak" />
      </fieldset>
      <div class="kq__actions">
        <button type="button" class="kq__btn is-primary" :disabled="!selected.size" @click="start(selectedItems)">
          Starten · {{ selected.size }} Kanji
        </button>
      </div>
      <p class="kq__note">
        <template v-if="mode === 'choice'">
          Du siehst {{ ask === 'meaning' ? 'die Bedeutung' : 'die Lesungen' }} und wählst aus acht Kanji das richtige – per Klick oder mit den Tasten 1–8.
        </template>
        <template v-else-if="mode === 'write'">
          Du siehst die Bedeutung und schreibst das Kanji mit Finger, Stift oder Maus. Danach vergleichst du mit der Vorlage und bewertest dich selbst.
        </template>
        <template v-else>
          Lies jedes Kanji im Kopf. Nach {{ delay }} Sekunden werden Bedeutung und Lesungen aufgedeckt, dann sagst du selbst, ob du es gewusst hast.
        </template>
      </p>
    </template>

    <template v-else-if="phase === 'run' && current">
      <div class="kq__progress" :style="{ '--p': `${progress}%` }">
        <span>{{ pos + 1 }} / {{ queue.length }}</span>
        <span>{{ firstTry }} {{ resultLabel }}</span>
      </div>

      <!-- Multiple Choice -->
      <template v-if="mode === 'choice'">
        <div class="kq__card">
          <p v-if="ask === 'meaning'" class="kq__prompt">{{ current.de }}</p>
          <dl v-else class="kq__readings" lang="ja">
            <template v-if="current.on !== '–'"><dt>音</dt><dd>{{ current.on }}</dd></template>
            <template v-if="current.kun !== '–'"><dt>訓</dt><dd>{{ current.kun }}</dd></template>
          </dl>
        </div>
        <div class="kq__options">
          <button
            v-for="(o, i) in options"
            :key="o.k"
            type="button"
            lang="ja"
            :class="{
              'is-right': picked && o.k === current.k,
              'is-wrong': picked === o && o.k !== current.k,
              'is-dim': picked && picked !== o && o.k !== current.k
            }"
            :aria-label="`${i + 1}: ${o.k}`"
            @click="pick(o)"
          >
            <small>{{ i + 1 }}</small>{{ o.k }}
          </button>
        </div>
        <div v-if="picked" class="kq__solution" :class="picked.k === current.k ? 'is-ok' : 'is-bad'">
          <p>
            <button type="button" class="kq__kanji-link" lang="ja" title="Strichfolge ansehen" @click="dialog = current">{{ current.k }}</button>
            {{ current.de }} · <span lang="ja">{{ readings(current).join('、') }}</span>
          </p>
          <p v-if="picked.k !== current.k">
            Du hast <span lang="ja">{{ picked.k }}</span> ({{ picked.de }}) gewählt – kommt am Ende nochmal.
          </p>
          <button v-if="picked.k !== current.k" type="button" class="kq__btn is-primary" @click="next">Weiter</button>
        </div>
      </template>

      <!-- Schreiben -->
      <template v-else-if="mode === 'write'">
        <div class="kq__card is-write">
          <p class="kq__prompt">{{ current.de }}</p>
          <div class="kq__hint-slot">
            <dl v-if="showReadings || revealed" class="kq__readings is-small" lang="ja">
              <template v-if="current.on !== '–'"><dt>音</dt><dd>{{ current.on }}</dd></template>
              <template v-if="current.kun !== '–'"><dt>訓</dt><dd>{{ current.kun }}</dd></template>
            </dl>
            <button v-else type="button" class="kq__link" @click="showReadings = true">Lesungen als Hinweis zeigen</button>
          </div>
        </div>
        <WritingPractice
          v-model:strokes="strokes"
          v-model:revealed="revealed"
          :glyph="glyph"
          :label="`Schreibfeld für ${current.de}`"
          @rate="rateWriting"
        >
          <template #meta>
            <button v-if="revealed" type="button" class="kq__solution-link" title="Strichfolge ansehen" @click="dialog = current">
              <span lang="ja">{{ current.k }}</span> Strichfolge
            </button>
            <template v-else>Schreibe das Kanji.</template>
          </template>
        </WritingPractice>
      </template>

      <!-- Flashcards -->
      <template v-else>
        <div class="kq__card">
          <button
            type="button"
            class="kq__big"
            :class="{ 'is-link': revealed }"
            lang="ja"
            title="Strichfolge ansehen"
            @click="revealed && (dialog = current)"
          >
            {{ current.k }}
          </button>
          <template v-if="revealed">
            <p class="kq__meaning">{{ current.de }}</p>
            <dl class="kq__readings is-small" lang="ja">
              <template v-if="current.on !== '–'"><dt>音</dt><dd>{{ current.on }}</dd></template>
              <template v-if="current.kun !== '–'"><dt>訓</dt><dd>{{ current.kun }}</dd></template>
            </dl>
            <p v-if="current.ex" class="kq__example"><span lang="ja"><RubyText :text="current.ex" /></span> {{ current.exDe }}</p>
          </template>
          <span v-else :key="pos" class="kq__timer" :style="{ '--t': `${delay}s` }" />
        </div>
        <div class="kq__actions">
          <template v-if="revealed">
            <button type="button" class="kq__btn is-primary" @click="rateFlash(true)">Gewusst</button>
            <button type="button" class="kq__btn" @click="rateFlash(false)">Nicht gewusst</button>
          </template>
          <button v-else type="button" class="kq__btn" @click="reveal">Jetzt aufdecken</button>
        </div>
        <p class="kq__keys">Tasten: Leertaste aufdecken · Enter / → gewusst · ← / Rücktaste nicht gewusst</p>
      </template>

      <button type="button" class="kq__link" @click="phase = 'setup'">Abbrechen</button>
    </template>

    <template v-else-if="phase === 'done'">
      <p class="kq__result">
        <strong>{{ firstTry }}</strong> von {{ total }} {{ resultLabel }}
        <span>({{ Math.round((firstTry / total) * 100) }} %)</span>
      </p>
      <template v-if="missed.length">
        <p class="kq__note">Diese Kanji solltest du dir noch einmal ansehen (antippen für die Strichfolge):</p>
        <ul class="kq__missed">
          <li v-for="c in missed" :key="c.k">
            <button type="button" @click="dialog = c">
              <span lang="ja">{{ c.k }}</span><small>{{ c.de }}</small>
            </button>
          </li>
        </ul>
      </template>
      <p v-else class="kq__note">Fehlerfrei – 素晴らしい！</p>
      <div class="kq__actions">
        <button v-if="missed.length" type="button" class="kq__btn is-primary" @click="start(missed)">Nur Fehler üben</button>
        <button type="button" class="kq__btn" @click="start(selectedItems)">Neue Runde</button>
        <button type="button" class="kq__btn" @click="phase = 'setup'">Auswahl ändern</button>
      </div>
    </template>

    <StrokeDialog v-if="dialog" :text="dialog.k" :label="dialog.de" @close="dialog = null" />
  </div>
</template>

<style scoped>
.kq {
  margin: 24px 0;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}

.kq p { margin: 0; }

.kq__group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  margin: 0 0 16px;
  padding: 0;
  border: none;
}

.kq__group legend {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-2);
}

.kq__group label { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }
.kq__group input { accent-color: var(--vp-c-brand-1); width: 16px; height: 16px; }
.kq__muted { color: var(--vp-c-text-3); font-weight: 400; text-transform: none; letter-spacing: 0; }

.kq__group.is-block { display: block; }

.kq__number input[type='number'] {
  width: 64px;
  height: auto;
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.kq__actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0 10px; }
.kq__actions.is-center { justify-content: center; margin: 12px 0 0; }

.kq__btn {
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: filter 0.2s ease, border-color 0.2s ease;
}

.kq__btn:hover:not(:disabled) { border-color: var(--vp-c-brand-1); }
.kq__btn.is-primary { border-color: transparent; color: #fff; background: var(--vp-c-brand-1); }
.kq__btn.is-primary:hover { filter: brightness(1.1); }
.kq__btn:disabled { opacity: 0.4; cursor: default; }

.kq__note { font-size: 14px; color: var(--vp-c-text-2); }
.kq__note.is-center { text-align: center; }

.kq__progress {
  display: flex;
  justify-content: space-between;
  padding-bottom: 8px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  background: linear-gradient(var(--vp-c-brand-1), var(--vp-c-brand-1)) bottom left / var(--p) 3px no-repeat,
    linear-gradient(var(--vp-c-divider), var(--vp-c-divider)) bottom left / 100% 3px no-repeat;
  transition: background-size 0.3s ease;
}

.kq__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 120px;
  margin: 16px 0;
  padding: 16px;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  text-align: center;
}

.kq__prompt { font-size: 24px; font-weight: 700; }

.kq__readings {
  display: grid;
  grid-template-columns: auto auto;
  gap: 4px 10px;
  margin: 0;
  font-size: 22px;
  text-align: left;
}

.kq__readings.is-small { font-size: 16px; }

.kq__readings dt {
  align-self: center;
  padding: 0 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.kq__readings dd { margin: 0; }

.kq__options {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.kq__options button {
  position: relative;
  padding: 10px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  font-size: 34px;
  line-height: 1.3;
  background: var(--vp-c-bg);
  transition: border-color 0.2s ease, opacity 0.2s ease, background-color 0.2s ease;
}

.kq__options button:hover { border-color: var(--vp-c-brand-1); }
.kq__options small {
  position: absolute;
  top: 4px;
  left: 8px;
  font-size: 11px;
  color: var(--vp-c-text-3);
}

.kq__options .is-right { border-color: var(--vp-c-success-1); background: var(--vp-c-success-soft); }
.kq__options .is-wrong { border-color: var(--vp-c-danger-1); background: var(--vp-c-danger-soft); }
.kq__options .is-dim { opacity: 0.4; }

.kq__solution {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-top: 12px;
  font-size: 15px;
}

.kq__solution.is-ok { color: var(--vp-c-success-1); }
.kq__solution.is-bad { color: var(--vp-c-danger-1); }

.kq__kanji-link {
  margin-right: 4px;
  font-size: 22px;
  font-weight: 700;
  color: inherit;
  text-decoration: underline dotted;
  text-underline-offset: 4px;
}

.kq__card.is-write { min-height: 156px; }

/* Platz für zwei Lesungszeilen, damit das Einblenden nichts verschiebt */
.kq__hint-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
}

.kq__solution-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.kq__solution-link [lang='ja'] { font-size: 22px; text-decoration: underline dotted; text-underline-offset: 4px; }

.kq__big {
  font-size: clamp(56px, 12vw, 84px);
  line-height: 1.2;
  font-weight: 500;
  cursor: default;
}

.kq__big.is-link { cursor: pointer; }

.kq__meaning { font-size: 22px; font-weight: 700; color: var(--vp-c-brand-1); }
.kq__example { font-size: 14px; color: var(--vp-c-text-2); }
.kq__example [lang='ja'] { font-size: 18px; color: var(--vp-c-text-1); }

.kq__timer {
  width: 60%;
  height: 4px;
  border-radius: 2px;
  background: var(--vp-c-brand-1);
  transform-origin: left;
  animation: kq-timer var(--t) linear forwards;
}

@keyframes kq-timer {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

.kq__keys { margin-top: 8px !important; font-size: 12px; color: var(--vp-c-text-3); }

.kq__link {
  margin-top: 10px;
  font-size: 13px;
  color: var(--vp-c-text-3);
  text-decoration: underline;
}

.kq__card .kq__link { margin-top: 0; }

.kq__result { font-size: 18px; margin-bottom: 12px !important; }
.kq__result strong { font-size: 32px; color: var(--vp-c-brand-1); }
.kq__result span { color: var(--vp-c-text-2); }

.vp-doc .kq__missed {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0;
  padding: 0;
  list-style: none;
}

.vp-doc .kq__missed li { margin: 0; }

.kq__missed button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 12px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.kq__missed button:hover { border-color: var(--vp-c-brand-1); }
.kq__missed [lang='ja'] { font-size: 24px; }
.kq__missed small { font-size: 12px; color: var(--vp-c-text-2); }

@media (max-width: 480px) {
  .kq { padding: 14px; }
  .kq__options button { font-size: 28px; }
}

@media print {
  .kq { display: none; }
}
</style>
