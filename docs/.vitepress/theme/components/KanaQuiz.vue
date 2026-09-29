<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { kanaSets, kanaWords, toKatakana, type KanaSet } from '../data/kana'
import { loadGlyph, rate as saveRating, ratingLabels, strokeCountHint, type Glyph, type Rating } from '../utils/strokes'
import WritingPad from './WritingPad.vue'
import StrokeDialog from './StrokeDialog.vue'

type Script = 'hiragana' | 'katakana'
type SetId = KanaSet | 'words'
interface Card {
  kana: string
  romaji: string
  accept: string[]
  kanji?: string
  de?: string
  /** Unterscheidet gleich klingende Kana beim Schreiben */
  hint?: string
}

const SETS: { id: SetId; label: string; sample: string }[] = [
  { id: 'basic', label: 'Grundzeichen', sample: 'あ か さ' },
  { id: 'dakuten', label: 'Dakuten & Handakuten', sample: 'が ぱ' },
  { id: 'yoon', label: 'Yōon', sample: 'きゃ しゅ' },
  { id: 'extended', label: 'Erweiterte Katakana', sample: 'ファ ティ' },
  { id: 'words', label: 'Wörter mit っ, ー, ん', sample: 'きって' }
]

// Gängige alternative Umschriften (Kunrei-shiki / Tastatureingabe)
const ALT: Record<string, string[]> = {
  shi: ['si'], chi: ['ti'], tsu: ['tu'], fu: ['hu'], ji: ['zi'],
  sha: ['sya'], shu: ['syu'], sho: ['syo'],
  cha: ['tya', 'cya'], chu: ['tyu', 'cyu'], cho: ['tyo', 'cyo'],
  ja: ['zya', 'jya'], ju: ['zyu', 'jyu'], jo: ['zyo', 'jyo']
}
const KANA_ALT: Record<string, string[]> = { ぢ: ['di', 'dji'], づ: ['du', 'dzu'], を: ['wo'], ん: ['nn'] }
const LONG: Record<string, string> = { ā: 'aa', ī: 'ii', ū: 'uu', ē: 'ee', ō: 'oo' }
const HINT: Record<string, string> = {
  じ: 'sa-Reihe mit ゛', ず: 'sa-Reihe mit ゛', ぢ: 'ta-Reihe mit ゛', づ: 'ta-Reihe mit ゛',
  お: 'Vokal', を: 'Partikel wo',
  じゃ: 'sa-Reihe mit ゛', じゅ: 'sa-Reihe mit ゛', じょ: 'sa-Reihe mit ゛'
}

const normalize = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[āīūēō]/g, (c) => LONG[c])
    .replace(/([aiueo])[-ー]/g, '$1$1')
    .replace(/[\s'’-]/g, '')

// ō darf auch als ou getippt werden, ei (gesprochen ē) auch als ee
const variants = (r: string) =>
  [r, r.replace(/ō/g, 'ou')].flatMap((v) => [v, v.replace(/ei/g, 'ee')])

function makeCard(kana: string, romaji: string[], key = kana, extra: Pick<Card, 'kanji' | 'de' | 'hint'> = {}): Card {
  const accept = romaji.flatMap((r) => [...variants(r), ...(ALT[r] ?? [])]).concat(KANA_ALT[key] ?? [])
  return { kana, romaji: romaji[0], accept: [...new Set(accept.map(normalize))], ...extra }
}

const scripts = reactive<Record<Script, boolean>>({ hiragana: true, katakana: true })
const sets = reactive<Record<SetId, boolean>>({ basic: true, dakuten: true, yoon: true, extended: true, words: true })

function buildCards(): Card[] {
  const out: Card[] = []
  for (const script of ['hiragana', 'katakana'] as Script[]) {
    if (!scripts[script]) continue
    for (const id of Object.keys(kanaSets) as KanaSet[]) {
      if (!sets[id] || (id === 'extended' && script === 'hiragana')) continue
      for (const cell of kanaSets[id].rows.flat()) {
        if (cell) {
          const kana = script === 'katakana' ? toKatakana(cell[0]) : cell[0]
          out.push(makeCard(kana, [cell[1]], cell[0], { hint: HINT[cell[0]] }))
        }
      }
    }
    if (sets.words && mode.value !== 'write') {
      out.push(...kanaWords[script].map(({ kana, romaji, kanji, de }) => makeCard(kana, romaji, kana, { kanji, de })))
    }
  }
  return out
}

function shuffle<T>(list: T[]): T[] {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const deckSize = computed(() => buildCards().length)

const mode = ref<'type' | 'flash' | 'write'>('type')
const seconds = ref(3)
const delay = computed(() => Math.max(0.5, Number(seconds.value) || 3))
const revealed = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const phase = ref<'setup' | 'run' | 'done'>('setup')
const queue = ref<Card[]>([])
const pos = ref(0)
const total = ref(0)
const firstTry = ref(0)
const missed = ref<Card[]>([])
const answer = ref('')
const wrong = ref(false)
const last = ref<{ card: Card; ok: boolean } | null>(null)
const inputEl = ref<HTMLInputElement>()

const current = computed(() => queue.value[pos.value])
const progress = computed(() => (queue.value.length ? (pos.value / queue.value.length) * 100 : 0))

function start(cards: Card[]) {
  if (!cards.length) return
  queue.value = shuffle(cards)
  total.value = cards.length
  pos.value = 0
  firstTry.value = 0
  missed.value = []
  answer.value = ''
  wrong.value = false
  last.value = null
  phase.value = 'run'
  showCard()
}

function showCard() {
  clearTimeout(timer)
  revealed.value = false
  if (mode.value === 'flash') timer = setTimeout(reveal, delay.value * 1000)
  else if (mode.value === 'write') prepareWrite(current.value.kana)
  else nextTick(() => inputEl.value?.focus())
}

/* Schreiben */
const glyph = ref<Glyph | null>()
const strokes = ref<[number, number][][]>([])
const dialog = ref<Card | null>(null)
const isKatakana = (kana: string) => /[\u30a0-\u30ff]/.test(kana)

async function prepareWrite(kana: string) {
  glyph.value = undefined
  strokes.value = []
  const g = await loadGlyph(kana)
  if (current.value?.kana === kana) glyph.value = g
}

function rateWriting(r: Rating) {
  const card = current.value
  if (!card) return
  saveRating(card.kana, r)
  grade(card, r === 'good', r === 'again')
  next()
}

function reveal() {
  clearTimeout(timer)
  revealed.value = true
}

function next() {
  wrong.value = false
  answer.value = ''
  pos.value++
  if (pos.value >= queue.value.length) phase.value = 'done'
  else showCard()
}

function grade(card: Card, ok: boolean, requeue = !ok) {
  last.value = { card, ok }
  if (ok) {
    if (!missed.value.includes(card)) firstTry.value++
    return
  }
  if (!missed.value.includes(card)) missed.value.push(card)
  // Falsche Karten kommen am Ende noch einmal
  if (requeue) queue.value.push(card)
}

function submit() {
  const card = current.value
  if (!card) return
  if (wrong.value) return next()
  const ok = card.accept.includes(normalize(answer.value))
  grade(card, ok)
  if (ok) next()
  else wrong.value = true
}

function rate(ok: boolean) {
  if (!current.value || !revealed.value) return
  grade(current.value, ok)
  next()
}

function onKey(e: KeyboardEvent) {
  if (phase.value !== 'run' || mode.value !== 'flash' || dialog.value || e.ctrlKey || e.metaKey || e.altKey) return
  // Buttons lösen Enter/Leertaste selbst aus
  if ((e.target as HTMLElement | null)?.closest?.('input, textarea, select, button')) return
  const key = e.key
  if (!revealed.value) {
    if (key === ' ' || key === 'Enter') reveal()
    else return
  } else if (key === 'Enter' || key === 'ArrowRight') rate(true)
  else if (key === 'ArrowLeft' || key === 'Backspace') rate(false)
  else return
  e.preventDefault()
}

watch(phase, (p) => p !== 'run' && clearTimeout(timer))
const resultLabel = computed(
  () => ({ type: 'auf Anhieb richtig', flash: 'auf Anhieb gewusst', write: 'sicher geschrieben' })[mode.value]
)
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  clearTimeout(timer)
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div class="kquiz">
    <template v-if="phase === 'setup'">
      <fieldset class="kquiz__group">
        <legend>Schrift</legend>
        <label><input v-model="scripts.hiragana" type="checkbox" /> Hiragana <span lang="ja">あ</span></label>
        <label><input v-model="scripts.katakana" type="checkbox" /> Katakana <span lang="ja">ア</span></label>
      </fieldset>
      <fieldset class="kquiz__group">
        <legend>Zeichen</legend>
        <label v-for="s in SETS" :key="s.id" :class="{ 'is-off': s.id === 'words' && mode === 'write' }">
          <input v-model="sets[s.id]" type="checkbox" :disabled="s.id === 'words' && mode === 'write'" />
          {{ s.label }} <span class="kquiz__sample" lang="ja">{{ s.sample }}</span>
        </label>
      </fieldset>
      <fieldset class="kquiz__group">
        <legend>Modus</legend>
        <label><input v-model="mode" type="radio" value="type" /> Eintippen</label>
        <label><input v-model="mode" type="radio" value="flash" /> Flashcards (nur lesen)</label>
        <label><input v-model="mode" type="radio" value="write" /> Schreiben</label>
        <label v-if="mode === 'flash'" class="kquiz__seconds">
          <input v-model.number="seconds" type="number" min="0.5" max="60" step="0.5" /> Sekunden pro Karte
        </label>
      </fieldset>
      <div class="kquiz__actions">
        <button type="button" class="kquiz__btn is-primary" :disabled="!deckSize" @click="start(buildCards())">
          {{ { type: 'Quiz', flash: 'Flashcards', write: 'Schreibübung' }[mode] }} starten · {{ deckSize }} Karten
        </button>
      </div>
      <p v-if="mode === 'type'" class="kquiz__note">
        Tippe die Rōmaji ein und bestätige mit Enter. Langvokale gehen als <em>ō</em>, <em>oo</em>, <em>ou</em> oder <em>o-</em>.
      </p>
      <p v-else-if="mode === 'write'" class="kquiz__note">
        Du siehst die Rōmaji und schreibst das Kana mit Finger, Stift oder Maus. Danach vergleichst du mit der Vorlage und bewertest dich selbst.
        Wörter sind in diesem Modus ausgenommen.
      </p>
      <p v-else class="kquiz__note">
        Lies jede Karte im Kopf. Nach {{ delay }} Sekunden wird die Lösung aufgedeckt, dann sagst du selbst, ob du sie gewusst hast.
      </p>
    </template>

    <template v-else-if="phase === 'run' && current">
      <div class="kquiz__progress" :style="{ '--p': `${progress}%` }">
        <span>{{ pos + 1 }} / {{ queue.length }}</span>
        <span>{{ firstTry }} {{ resultLabel }}</span>
      </div>
      <template v-if="mode === 'write'">
        <div class="kquiz__card">
          <p class="kquiz__reveal">{{ current.romaji }}</p>
          <p class="kquiz__meaning">
            {{ isKatakana(current.kana) ? 'Katakana' : 'Hiragana' }}<template v-if="current.hint"> · {{ current.hint }}</template>
          </p>
          <button
            v-if="revealed"
            type="button"
            class="kquiz__kana is-link"
            lang="ja"
            title="Strichfolge ansehen"
            @click="dialog = current"
          >
            {{ current.kana }}
          </button>
        </div>
        <div class="kquiz__write">
          <p v-if="glyph === undefined" class="kquiz__note">Lade …</p>
          <WritingPad
            v-else-if="glyph"
            v-model="strokes"
            :glyph="glyph"
            :revealed="revealed"
            :label="`Schreibfeld für ${current.romaji}`"
          />
          <div v-if="!revealed" class="kquiz__form is-center">
            <button type="button" class="kquiz__btn" :disabled="!strokes.length" @click="strokes = strokes.slice(0, -1)">↶ Rückgängig</button>
            <button type="button" class="kquiz__btn" :disabled="!strokes.length" @click="strokes = []">Löschen</button>
            <button type="button" class="kquiz__btn is-primary" @click="reveal">
              {{ strokes.length ? 'Vergleichen' : 'Lösung zeigen' }}
            </button>
          </div>
          <template v-else>
            <p v-if="glyph && strokes.length" class="kquiz__note">{{ strokeCountHint(strokes.length, glyph.strokes.length) }}</p>
            <p class="kquiz__rate-q">Wie gut hat es geklappt?</p>
            <div class="kquiz__form is-center">
              <button v-for="(l, r) in ratingLabels" :key="r" type="button" class="kquiz__btn" :class="`is-${r}`" @click="rateWriting(r)">
                {{ l }}
              </button>
            </div>
          </template>
        </div>
      </template>
      <div v-else class="kquiz__card" :class="{ 'is-wrong': wrong }">
        <span class="kquiz__kana" lang="ja">{{ current.kana }}</span>
        <p v-if="wrong" class="kquiz__solution">Richtig ist <strong>{{ current.romaji }}</strong> – kommt am Ende nochmal.</p>
        <p v-else-if="revealed" class="kquiz__reveal">{{ current.romaji }}</p>
        <span v-else-if="mode === 'flash'" class="kquiz__timer" :style="{ '--t': `${delay}s` }" />
        <p v-if="(wrong || revealed) && current.de" class="kquiz__meaning">
          <span v-if="current.kanji" lang="ja">{{ current.kanji }}</span> {{ current.de }}
        </p>
      </div>
      <template v-if="mode === 'flash'">
        <div class="kquiz__form">
          <template v-if="revealed">
            <button type="button" class="kquiz__btn is-primary" @click="rate(true)">Gewusst</button>
            <button type="button" class="kquiz__btn" @click="rate(false)">Nicht gewusst</button>
          </template>
          <button v-else type="button" class="kquiz__btn" @click="reveal">Jetzt aufdecken</button>
        </div>
        <p class="kquiz__keys">Tasten: Leertaste aufdecken · Enter / → gewusst · ← / Rücktaste nicht gewusst</p>
      </template>
      <form v-else-if="mode === 'type'" class="kquiz__form" @submit.prevent="submit">
        <input
          ref="inputEl"
          v-model="answer"
          class="kquiz__input"
          type="text"
          lang="en"
          placeholder="Rōmaji …"
          aria-label="Lesung in Rōmaji"
          autocomplete="off"
          autocapitalize="off"
          autocorrect="off"
          spellcheck="false"
          :readonly="wrong"
        />
        <button type="submit" class="kquiz__btn is-primary">{{ wrong ? 'Weiter' : 'Prüfen' }}</button>
        <button v-if="!wrong" type="button" class="kquiz__btn" @click="answer = ''; submit()">Weiß nicht</button>
      </form>
      <p v-if="last" class="kquiz__last" :class="last.ok ? 'is-ok' : 'is-bad'">
        <span lang="ja">{{ last.card.kana }}</span> = {{ last.card.romaji }}
        <template v-if="last.card.de">
          · <span v-if="last.card.kanji" lang="ja">{{ last.card.kanji }}</span> {{ last.card.de }}
        </template>
        {{ last.ok ? '✓' : '✗' }}
      </p>
      <button type="button" class="kquiz__link" @click="phase = 'setup'">Abbrechen</button>
    </template>

    <template v-else-if="phase === 'done'">
      <p class="kquiz__result">
        <strong>{{ firstTry }}</strong> von {{ total }} {{ resultLabel }}
        <span>({{ Math.round((firstTry / total) * 100) }} %)</span>
      </p>
      <template v-if="missed.length">
        <p class="kquiz__note">Diese Zeichen solltest du dir noch einmal ansehen:</p>
        <ul class="kquiz__missed">
          <li v-for="c in missed" :key="c.kana">
            <span lang="ja">{{ c.kana }}</span><small>{{ c.romaji }}</small>
            <small v-if="c.de" class="kquiz__de"><span v-if="c.kanji" lang="ja">{{ c.kanji }}</span> {{ c.de }}</small>
          </li>
        </ul>
      </template>
      <p v-else class="kquiz__note">Fehlerfrei – 素晴らしい！</p>
      <div class="kquiz__actions">
        <button v-if="missed.length" type="button" class="kquiz__btn is-primary" @click="start(missed)">Nur Fehler üben</button>
        <button type="button" class="kquiz__btn" @click="start(buildCards())">Nochmal alle</button>
        <button type="button" class="kquiz__btn" @click="phase = 'setup'">Auswahl ändern</button>
      </div>
    </template>

    <StrokeDialog v-if="dialog" :text="dialog.kana" :label="dialog.romaji" @close="dialog = null" />
  </div>
</template>

<style scoped>
.kquiz {
  margin: 24px 0;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}

.kquiz p { margin: 0; }

.kquiz__group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  margin: 0 0 16px;
  padding: 0;
  border: none;
}

.kquiz__group legend {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-2);
}

.kquiz__group label { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }
.kquiz__group input { accent-color: var(--vp-c-brand-1); width: 16px; height: 16px; }
.kquiz__sample { color: var(--vp-c-text-3); }

.kquiz__actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0 10px; }

.kquiz__btn {
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: filter 0.2s ease, border-color 0.2s ease;
}

.kquiz__btn:hover { border-color: var(--vp-c-brand-1); }
.kquiz__btn.is-primary { border-color: transparent; color: #fff; background: var(--vp-c-brand-1); }
.kquiz__btn.is-primary:hover { filter: brightness(1.1); }
.kquiz__btn:disabled { opacity: 0.4; cursor: default; }

.kquiz__note { font-size: 14px; color: var(--vp-c-text-2); }

.kquiz__progress {
  display: flex;
  justify-content: space-between;
  padding-bottom: 8px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  background: linear-gradient(var(--vp-c-brand-1), var(--vp-c-brand-1)) bottom left / var(--p) 3px no-repeat,
    linear-gradient(var(--vp-c-divider), var(--vp-c-divider)) bottom left / 100% 3px no-repeat;
  transition: background-size 0.3s ease;
}

.kquiz__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 170px;
  margin: 16px 0;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  transition: border-color 0.2s ease;
}

.kquiz__card.is-wrong { border-color: var(--vp-c-red-1); background: var(--vp-c-red-soft); }

.kquiz__kana { font-size: clamp(48px, 10vw, 72px); line-height: 1.2; font-weight: 500; }

.kquiz__solution { font-size: 15px; color: var(--vp-c-text-1); }
.kquiz__solution strong { font-size: 20px; color: var(--vp-c-red-1); }
.kquiz__meaning { font-size: 15px; color: var(--vp-c-text-2); }
.kquiz__reveal { font-size: 24px; font-weight: 700; color: var(--vp-c-brand-1); }

.kquiz__timer {
  width: 60%;
  height: 4px;
  border-radius: 2px;
  background: var(--vp-c-brand-1);
  transform-origin: left;
  animation: kquiz-timer var(--t) linear forwards;
}

@keyframes kquiz-timer {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

.kquiz__seconds input[type='number'] {
  width: 64px;
  height: auto;
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.kquiz__keys { margin-top: 8px !important; font-size: 12px; color: var(--vp-c-text-3); }
.kquiz__meaning [lang='ja'] { font-size: 18px; color: var(--vp-c-text-1); }

.kquiz__form { display: flex; flex-wrap: wrap; gap: 10px; }

.kquiz__input {
  flex: 1 1 180px;
  padding: 8px 14px;
  font-size: 18px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.kquiz__input:focus { outline: none; border-color: var(--vp-c-brand-1); }

.kquiz__last { margin-top: 10px !important; font-size: 14px; }
.kquiz__last.is-ok { color: var(--vp-c-green-1); }
.kquiz__last.is-bad { color: var(--vp-c-red-1); }

.kquiz__link {
  margin-top: 10px;
  font-size: 13px;
  color: var(--vp-c-text-3);
  text-decoration: underline;
}

.kquiz__result { font-size: 18px; margin-bottom: 12px !important; }
.kquiz__result strong { font-size: 32px; color: var(--vp-c-brand-1); }
.kquiz__result span { color: var(--vp-c-text-2); }

.vp-doc .kquiz__missed {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0;
  padding: 0;
  list-style: none;
}

.vp-doc .kquiz__missed li {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  padding: 6px 12px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.kquiz__missed [lang='ja'] { font-size: 22px; }
.kquiz__missed small { font-size: 12px; color: var(--vp-c-brand-1); font-weight: 600; }
.kquiz__missed .kquiz__de { color: var(--vp-c-text-2); font-weight: 400; }
.kquiz__missed .kquiz__de [lang='ja'] { font-size: 12px; }

.kquiz__write {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.kquiz__form.is-center { justify-content: center; }
.kquiz__group label.is-off { opacity: 0.45; cursor: default; }
.kquiz__rate-q { font-weight: 600; }
.kquiz__btn.is-again { border-color: var(--vp-c-danger-2); color: var(--vp-c-danger-1); }
.kquiz__btn.is-almost { border-color: var(--vp-c-warning-2); color: var(--vp-c-warning-1); }
.kquiz__btn.is-good { border-color: var(--vp-c-success-2); color: var(--vp-c-success-1); }

.kquiz__kana.is-link {
  color: var(--vp-c-brand-1);
  text-decoration: underline dotted;
  text-decoration-thickness: 2px;
  text-underline-offset: 8px;
}

@media print {
  .kquiz { display: none; }
}
</style>
