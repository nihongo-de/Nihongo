<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { vocabN5, type VocabWord } from '../data/vocab'
import { intervalLabel, MATURE, schedule, today, type Rating, type SrsCard } from '../utils/srs'
import { recordResult } from '../utils/progress'
import RubyText from './RubyText.vue'

type Dir = 'jp' | 'de'
const STORAGE = 'nihongo:karteikarten'
const DIRS: Record<Dir, string> = { jp: 'Japanisch → Deutsch', de: 'Deutsch → Japanisch' }
const RATINGS: { r: Rating; label: string; key: string }[] = [
  { r: 0, label: 'Nochmal', key: '1' },
  { r: 1, label: 'Schwer', key: '2' },
  { r: 2, label: 'Gut', key: '3' },
  { r: 3, label: 'Leicht', key: '4' }
]

const topicOf = new Map(vocabN5.flatMap((t) => t.words.map((w) => [w.jp, t.title] as const)))

const opts = reactive({ dir: 'jp' as Dir, topics: vocabN5.map((t) => t.id), newPerDay: 10 })
const cards = ref<Record<string, SrsCard>>({})
const day = ref(today())

const key = (w: VocabWord) => `${opts.dir}:${w.jp}`
const state = (w: VocabWord): SrsCard | undefined => cards.value[key(w)]

const topics = computed(() =>
  vocabN5.map((t) => {
    let fresh = 0
    let due = 0
    let mature = 0
    for (const w of t.words) {
      const c = state(w)
      if (!c) fresh++
      else if (c.due <= day.value) due++
      if (c && c.ivl >= MATURE) mature++
    }
    return { id: t.id, title: t.title, size: t.words.length, fresh, due, mature }
  })
)

const selected = computed(() => vocabN5.filter((t) => opts.topics.includes(t.id)).flatMap((t) => t.words))
const dueWords = computed(() => selected.value.filter((w) => (state(w)?.due ?? Infinity) <= day.value))
const newWords = computed(() => selected.value.filter((w) => !state(w)))
const newToday = computed(
  () => Object.entries(cards.value).filter(([k, c]) => k.startsWith(`${opts.dir}:`) && c.seen === day.value).length
)
const newLeft = computed(() => Math.min(Math.max(0, opts.newPerDay - newToday.value), newWords.value.length))
const tomorrow = computed(() => selected.value.filter((w) => state(w)?.due === day.value + 1).length)
const total = computed(() => vocabN5.reduce((n, t) => n + t.words.length, 0))
const started = computed(() => Object.keys(cards.value).filter((k) => k.startsWith(`${opts.dir}:`)).length)

function shuffle<T>(list: T[]): T[] {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const phase = ref<'setup' | 'run' | 'done'>('setup')
const queue = ref<VocabWord[]>([])
const pos = ref(0)
const flipped = ref(false)
const size = ref(0)
const firstOk = ref(0)
const rated = new Set<string>()
const missed = ref<VocabWord[]>([])
const current = computed(() => queue.value[pos.value])
const progressPct = computed(() => (queue.value.length ? (pos.value / queue.value.length) * 100 : 0))

function start(extraNew = 0) {
  day.value = today()
  const fresh = newWords.value.slice(0, extraNew || newLeft.value)
  const list = shuffle([...dueWords.value, ...fresh])
  if (!list.length) return
  queue.value = list
  size.value = list.length
  pos.value = 0
  firstOk.value = 0
  rated.clear()
  missed.value = []
  flipped.value = false
  phase.value = 'run'
}

function save() {
  try {
    localStorage.setItem(STORAGE, JSON.stringify({ opts, cards: cards.value }))
  } catch {}
}

const preview = (r: Rating) => (current.value ? intervalLabel(schedule(state(current.value), r, day.value).ivl) : '')

function rate(r: Rating) {
  const w = current.value
  if (!w || !flipped.value) return
  const k = key(w)
  cards.value = { ...cards.value, [k]: schedule(cards.value[k], r, day.value) }
  save()
  if (!rated.has(k)) {
    rated.add(k)
    if (r > 0) firstOk.value++
    else missed.value.push(w)
  }
  // „Nochmal“: ein paar Karten später erneut zeigen
  if (r === 0) queue.value.splice(Math.min(pos.value + 4, queue.value.length), 0, w)
  flipped.value = false
  pos.value++
  if (pos.value < queue.value.length) return
  phase.value = 'done'
  recordResult(
    `karteikarten:${opts.dir}`,
    { path: '/uebungen/karteikarten', title: `Karteikarten · ${DIRS[opts.dir]}` },
    firstOk.value,
    size.value
  )
}

function onKey(e: KeyboardEvent) {
  if (phase.value !== 'run' || e.ctrlKey || e.metaKey || e.altKey) return
  if ((e.target as HTMLElement)?.closest?.('input, textarea, select')) return
  if (!flipped.value && (e.key === ' ' || e.key === 'Enter')) {
    e.preventDefault()
    flipped.value = true
  } else if (flipped.value) {
    const rating = e.key === ' ' || e.key === 'Enter' ? RATINGS[2] : RATINGS.find((x) => x.key === e.key)
    if (!rating) return
    e.preventDefault()
    rate(rating.r)
  }
}

function setTopics(all: boolean) {
  opts.topics = all ? vocabN5.map((t) => t.id) : []
}

function resetDir() {
  if (!confirm(`Lernstand für „${DIRS[opts.dir]}“ zurücksetzen?`)) return
  cards.value = Object.fromEntries(Object.entries(cards.value).filter(([k]) => !k.startsWith(`${opts.dir}:`)))
  save()
}

onMounted(() => {
  day.value = today()
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE) ?? '{}')
    if (saved?.cards && typeof saved.cards === 'object') cards.value = saved.cards
    const o = saved?.opts
    if (o?.dir === 'jp' || o?.dir === 'de') opts.dir = o.dir
    if (Array.isArray(o?.topics)) opts.topics = o.topics.filter((id: unknown) => vocabN5.some((t) => t.id === id))
    if ([5, 10, 20, 30].includes(o?.newPerDay)) opts.newPerDay = o.newPerDay
  } catch {}
  watch(opts, save, { deep: true })
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="fc">
    <template v-if="phase === 'setup'">
      <fieldset class="fc__group is-row">
        <legend>Richtung</legend>
        <label v-for="(label, d) in DIRS" :key="d"><input v-model="opts.dir" type="radio" :value="d" /> {{ label }}</label>
      </fieldset>
      <fieldset class="fc__group is-row">
        <legend>Neue Karten pro Tag</legend>
        <label v-for="n in [5, 10, 20, 30]" :key="n"><input v-model.number="opts.newPerDay" type="radio" :value="n" /> {{ n }}</label>
      </fieldset>
      <fieldset class="fc__group">
        <legend>
          Themen
          <button type="button" class="fc__link" @click="setTopics(true)">alle</button>
          <button type="button" class="fc__link" @click="setTopics(false)">keine</button>
        </legend>
        <div class="fc__topics">
          <label v-for="t in topics" :key="t.id" class="fc__topic">
            <input v-model="opts.topics" type="checkbox" :value="t.id" />
            <span class="fc__topic-name">{{ t.title }}</span>
            <span class="fc__topic-bar" :style="{ '--m': `${(t.mature / t.size) * 100}%`, '--s': `${((t.size - t.fresh) / t.size) * 100}%` }" />
            <span class="fc__muted">
              <template v-if="t.due"><strong class="fc__due">{{ t.due }} fällig</strong> · </template>{{ t.fresh }} neu · {{ t.size }}
            </span>
          </label>
        </div>
      </fieldset>

      <p class="fc__summary">
        <span><strong>{{ dueWords.length }}</strong> fällig</span>
        <span><strong>{{ newLeft }}</strong> neu für heute</span>
        <span><strong>{{ tomorrow }}</strong> morgen fällig</span>
        <span><strong>{{ started }}</strong> / {{ total }} begonnen</span>
      </p>
      <div class="fc__actions">
        <button v-if="dueWords.length + newLeft" type="button" class="fc__btn is-primary" @click="start()">
          Lernen · {{ dueWords.length + newLeft }} Karten
        </button>
        <template v-else>
          <span class="fc__note">Für heute ist alles erledigt – お疲れさまでした！</span>
          <button v-if="newWords.length" type="button" class="fc__btn" @click="start(Math.min(10, newWords.length))">
            {{ Math.min(10, newWords.length) }} weitere neue Karten
          </button>
        </template>
        <button v-if="started" type="button" class="fc__link" @click="resetDir">Lernstand zurücksetzen</button>
      </div>
    </template>

    <template v-else-if="phase === 'run' && current">
      <div class="fc__progress" :style="{ '--p': `${progressPct}%` }">
        <span>{{ pos + 1 }} / {{ queue.length }}</span>
        <span>{{ state(current) ? 'Wiederholung' : 'Neu' }} · {{ topicOf.get(current.jp) }}</span>
      </div>
      <button type="button" class="fc__card" :class="{ 'is-flipped': flipped }" :disabled="flipped" @click="flipped = true">
        <span v-if="opts.dir === 'jp'" class="fc__jp" lang="ja"><RubyText :text="current.jp" /></span>
        <span v-else class="fc__de-front">{{ current.de }}</span>
        <template v-if="flipped">
          <span class="fc__sep" />
          <span v-if="opts.dir === 'de'" class="fc__jp" lang="ja"><RubyText :text="current.jp" /></span>
          <span class="fc__ro ex__ro">{{ current.romaji }}</span>
          <span v-if="opts.dir === 'jp'" class="fc__de">{{ current.de }}</span>
        </template>
        <span v-else class="fc__hint">Antwort überlegen – dann tippen oder Leertaste</span>
      </button>
      <div v-if="flipped" class="fc__rate" role="group" aria-label="Wie gut wusstest du es?">
        <button v-for="x in RATINGS" :key="x.r" type="button" :class="`is-r${x.r}`" @click="rate(x.r)">
          <strong>{{ x.label }}</strong>
          <small>{{ preview(x.r) }}</small>
        </button>
      </div>
      <p v-else class="fc__keys fc__muted">Tasten: Leertaste = umdrehen · 1–4 = bewerten</p>
      <button type="button" class="fc__link" @click="phase = 'setup'">Beenden</button>
    </template>

    <template v-else-if="phase === 'done'">
      <p class="fc__result">
        <strong>{{ firstOk }}</strong> von {{ size }} gewusst
        <span>({{ Math.round((firstOk / size) * 100) }} %)</span>
      </p>
      <template v-if="missed.length">
        <p class="fc__note">Diese Wörter kommen bald wieder:</p>
        <ul class="fc__missed">
          <li v-for="w in missed" :key="w.jp">
            <span lang="ja"><RubyText :text="w.jp" /></span>
            <small>{{ w.de }}</small>
          </li>
        </ul>
      </template>
      <p v-else class="fc__note">Alles gewusst – 素晴らしい！</p>
      <div class="fc__actions">
        <button type="button" class="fc__btn is-primary" @click="phase = 'setup'">Zur Übersicht</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.fc {
  margin: 24px 0;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}

.fc p { margin: 0; }

.fc__group { margin: 0 0 16px; padding: 0; border: none; }
.fc__group.is-row { display: flex; flex-wrap: wrap; gap: 8px 18px; }

.fc__group legend {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-2);
}

.fc__group legend .fc__link { margin-left: 8px; text-transform: none; letter-spacing: 0; font-weight: 400; }
.fc__group label { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }
.fc__group input { accent-color: var(--vp-c-brand-1); width: 16px; height: 16px; flex: none; }

.fc__topics { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 6px 18px; }

.fc__topic {
  display: grid !important;
  grid-template-columns: auto 1fr;
  gap: 2px 8px !important;
  padding: 6px 10px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.fc__topic-name { font-weight: 600; font-size: 14px; }
.fc__topic .fc__muted { grid-column: 2; }

.fc__topic-bar {
  grid-column: 2;
  height: 4px;
  border-radius: 2px;
  --started: color-mix(in srgb, var(--vp-c-brand-1) 45%, transparent);
  background: linear-gradient(var(--vp-c-green-1), var(--vp-c-green-1)) left / var(--m) 100% no-repeat,
    linear-gradient(var(--started), var(--started)) left / var(--s) 100% no-repeat,
    var(--vp-c-divider);
}

.fc__muted { color: var(--vp-c-text-3); font-size: 13px; }
.fc__due { color: var(--vp-c-brand-1); font-weight: 600; }

.fc__summary { display: flex; flex-wrap: wrap; gap: 6px 20px; font-size: 14px; color: var(--vp-c-text-2); }
.fc__summary strong { font-size: 20px; color: var(--vp-c-brand-1); }

.fc__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin: 16px 0 4px; }

.fc__btn {
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: filter 0.2s ease, border-color 0.2s ease;
}

.fc__btn:hover { border-color: var(--vp-c-brand-1); }
.fc__btn.is-primary { border-color: transparent; color: #fff; background: var(--vp-c-brand-1); }
.fc__btn.is-primary:hover { filter: brightness(1.1); }

.fc__link { font-size: 13px; color: var(--vp-c-text-3); text-decoration: underline; }
.fc__note { font-size: 14px; color: var(--vp-c-text-2); }

.fc__progress {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 8px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  background: linear-gradient(var(--vp-c-brand-1), var(--vp-c-brand-1)) bottom left / var(--p) 3px no-repeat,
    linear-gradient(var(--vp-c-divider), var(--vp-c-divider)) bottom left / 100% 3px no-repeat;
  transition: background-size 0.3s ease;
}

.fc__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  min-height: 220px;
  margin: 16px 0;
  padding: 20px 16px;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  text-align: center;
  cursor: pointer;
}

.fc__card:not(:disabled):hover { border-color: var(--vp-c-brand-1); }
.fc__card.is-flipped { cursor: default; }

.fc__jp { font-size: clamp(32px, 7vw, 46px); line-height: 1.7; font-weight: 500; }
.fc__de-front { font-size: clamp(22px, 4.5vw, 28px); font-weight: 600; }
.fc__sep { width: 60%; height: 1px; margin: 6px 0; background: var(--vp-c-divider); }
.fc__ro { font-size: 15px; color: var(--vp-c-text-2); font-style: italic; }
.fc__de { font-size: 20px; font-weight: 600; }
.fc__hint { margin-top: 10px; font-size: 13px; color: var(--vp-c-text-3); }

.fc__rate { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px; }

.fc__rate button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 4px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.fc__rate button:hover { transform: translateY(-1px); }
.fc__rate small { font-size: 12px; color: var(--vp-c-text-2); }
.fc__rate .is-r0 { border-color: var(--vp-c-red-1); }
.fc__rate .is-r0 strong { color: var(--vp-c-red-1); }
.fc__rate .is-r1 strong { color: var(--vp-c-warning-1); }
.fc__rate .is-r2 { border-color: var(--vp-c-green-1); }
.fc__rate .is-r2 strong { color: var(--vp-c-green-1); }
.fc__rate .is-r3 strong { color: var(--vp-c-brand-1); }

.fc__keys { margin-bottom: 12px !important; text-align: center; }

.fc__result { font-size: 18px; margin-bottom: 12px !important; }
.fc__result strong { font-size: 32px; color: var(--vp-c-brand-1); }
.fc__result span { color: var(--vp-c-text-2); }

.vp-doc .fc__missed { display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0; padding: 0; list-style: none; }

.vp-doc .fc__missed li {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  padding: 6px 12px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  line-height: 1.8;
}

.fc__missed small { font-size: 12px; color: var(--vp-c-text-2); line-height: 1.3; }

@media print {
  .fc { display: none; }
}
</style>
