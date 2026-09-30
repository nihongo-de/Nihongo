<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { decks, type TrainerItem } from '../utils/trainers'
import { accepted, type Conjugated } from '../utils/conjugate'
import { toKana } from '../utils/kanaInput'
import { recordResult } from '../utils/progress'
import RubyText from './RubyText.vue'
import SpeakButton from './SpeakButton.vue'

const props = defineProps<{ deck: string }>()
const deck = decks[props.deck]

interface Card {
  item: TrainerItem
  form: string
  answer: Conjugated
}

const STORAGE = `nihongo:trainer-${deck.id}`
const opts = reactive({
  forms: [...deck.defaultForms],
  groups: deck.groups.map((g) => g.id),
  count: 20
})
const stats = ref<Record<string, [number, number]>>({})

const pool = computed(() => deck.items.filter((i) => opts.groups.includes(i.group)))
const available = computed(() => pool.value.length * opts.forms.length)
const formLabel = (id: string) => deck.forms.find((f) => f.id === id)?.label ?? id
const formHint = (id: string) => deck.forms.find((f) => f.id === id)?.hint ?? ''
const rate = (id: string) => {
  const [right, wrong] = stats.value[id] ?? [0, 0]
  return right + wrong ? Math.round((right / (right + wrong)) * 100) : null
}

function shuffle<T>(list: T[]): T[] {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

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
const progressPct = computed(() => (queue.value.length ? (pos.value / queue.value.length) * 100 : 0))

function buildCards(): Card[] {
  const all = pool.value.flatMap((item) => opts.forms.map((form) => ({ item, form })))
  return shuffle(all)
    .slice(0, opts.count || all.length)
    .map((c) => ({ ...c, answer: deck.answer(c.item, c.form) }))
}

function start(cards: Card[]) {
  if (!cards.length) return
  queue.value = shuffle(cards)
  total.value = cards.length
  pos.value = 0
  firstTry.value = 0
  missed.value = []
  last.value = null
  phase.value = 'run'
  showCard()
}

function showCard() {
  answer.value = ''
  wrong.value = false
  nextTick(() => inputEl.value?.focus())
}

function onInput(e: Event) {
  const el = e.target as HTMLInputElement
  answer.value = (e as InputEvent).isComposing ? el.value : toKana(el.value)
}

function count(form: string, ok: boolean) {
  const [right, wrongs] = stats.value[form] ?? [0, 0]
  stats.value = { ...stats.value, [form]: ok ? [right + 1, wrongs] : [right, wrongs + 1] }
  try {
    localStorage.setItem(STORAGE, JSON.stringify(stats.value))
  } catch {}
}

function submit() {
  const card = current.value
  if (!card) return
  if (wrong.value) return next()
  const given = toKana(answer.value, true).replace(/[\s。、]/g, '')
  const ok = accepted(card.answer).includes(given)
  const first = !missed.value.includes(card)
  if (first) count(card.form, ok)
  last.value = { card, ok }
  if (ok) {
    if (first) firstTry.value++
    return next()
  }
  if (first) missed.value.push(card)
  queue.value.push(card)
  wrong.value = true
}

function next() {
  pos.value++
  if (pos.value < queue.value.length) return showCard()
  phase.value = 'done'
  recordResult(`trainer:${deck.id}`, { path: deck.path, title: deck.title }, firstTry.value, total.value)
}

function resetStats() {
  if (!confirm('Statistik für diesen Trainer zurücksetzen?')) return
  stats.value = {}
  localStorage.removeItem(STORAGE)
}

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE) ?? '{}')
    if (saved && typeof saved === 'object') stats.value = saved
  } catch {}
})
</script>

<template>
  <div class="ft">
    <template v-if="phase === 'setup'">
      <fieldset class="ft__group">
        <legend>Formen</legend>
        <label v-for="f in deck.forms" :key="f.id" class="ft__opt">
          <input v-model="opts.forms" type="checkbox" :value="f.id" />
          <span>
            <strong lang="ja">{{ f.label }}</strong> <span class="ft__muted" lang="ja">{{ f.hint }}</span>
            <span v-if="rate(f.id) !== null" class="ft__rate" :class="{ 'is-good': rate(f.id)! >= 80, 'is-bad': rate(f.id)! < 50 }">
              {{ rate(f.id) }} % richtig
            </span>
          </span>
        </label>
      </fieldset>
      <fieldset class="ft__group is-row">
        <legend>{{ deck.itemLabel }}</legend>
        <label v-for="g in deck.groups" :key="g.id">
          <input v-model="opts.groups" type="checkbox" :value="g.id" /> <span lang="ja">{{ g.label }}</span>
          <span class="ft__muted">{{ deck.items.filter((i) => i.group === g.id).length }}</span>
        </label>
      </fieldset>
      <fieldset class="ft__group is-row">
        <legend>Anzahl</legend>
        <label v-for="n in [10, 20, 40]" :key="n"><input v-model.number="opts.count" type="radio" :value="n" /> {{ n }}</label>
        <label><input v-model.number="opts.count" type="radio" :value="0" /> alle ({{ available }})</label>
      </fieldset>
      <div class="ft__actions">
        <button type="button" class="ft__btn is-primary" :disabled="!available" @click="start(buildCards())">
          Starten · {{ Math.min(opts.count || available, available) }} Aufgaben
        </button>
        <button v-if="Object.keys(stats).length" type="button" class="ft__link" @click="resetStats">Statistik zurücksetzen</button>
      </div>
      <p class="ft__note">
        Tippe die Lösung in Rōmaji – sie wird beim Tippen in Hiragana umgewandelt (<em>nn</em> = <span lang="ja">ん</span>, Doppelkonsonant = <span lang="ja">っ</span>).
        Kanji aus deiner japanischen Tastatur werden ebenfalls akzeptiert.
      </p>
    </template>

    <template v-else-if="phase === 'run' && current">
      <div class="ft__progress" :style="{ '--p': `${progressPct}%` }">
        <span>{{ pos + 1 }} / {{ queue.length }}</span>
        <span>{{ firstTry }} auf Anhieb richtig</span>
      </div>
      <div class="ft__card" :class="{ 'is-wrong': wrong }">
        <span class="ft__word" lang="ja"><RubyText :text="deck.prompt(current.item, current.form)" /></span>
        <span class="ft__de">{{ current.item.de }}</span>
        <span class="ft__task">→ <strong lang="ja">{{ formLabel(current.form) }}</strong> <span class="ft__muted" lang="ja">{{ formHint(current.form) }}</span></span>
        <template v-if="wrong">
          <p class="ft__solution">
            Richtig: <strong lang="ja"><RubyText :text="current.answer.ruby" /></strong>
            <SpeakButton :text="current.answer.plain" />
          </p>
          <p class="ft__rule" lang="ja">{{ current.answer.rule }}</p>
        </template>
      </div>
      <form class="ft__form" @submit.prevent="submit">
        <input
          ref="inputEl"
          :value="answer"
          class="ft__input"
          type="text"
          lang="ja"
          placeholder="Rōmaji oder Kana …"
          aria-label="Antwort"
          autocomplete="off"
          autocapitalize="off"
          autocorrect="off"
          spellcheck="false"
          :readonly="wrong"
          @input="onInput"
        />
        <button type="submit" class="ft__btn is-primary">{{ wrong ? 'Weiter' : 'Prüfen' }}</button>
        <button v-if="!wrong" type="button" class="ft__btn" @click="answer = ''; submit()">Weiß nicht</button>
      </form>
      <p v-if="last && !wrong" class="ft__last" :class="last.ok ? 'is-ok' : 'is-bad'">
        <span lang="ja"><RubyText :text="last.card.answer.ruby" /></span> {{ last.ok ? '✓' : '✗' }}
        <small lang="ja">{{ last.card.answer.rule }}</small>
      </p>
      <button type="button" class="ft__link" @click="phase = 'setup'">Abbrechen</button>
    </template>

    <template v-else-if="phase === 'done'">
      <p class="ft__result">
        <strong>{{ firstTry }}</strong> von {{ total }} auf Anhieb richtig
        <span>({{ Math.round((firstTry / total) * 100) }} %)</span>
      </p>
      <template v-if="missed.length">
        <p class="ft__note">Diese Formen solltest du dir noch einmal ansehen:</p>
        <ul class="ft__missed">
          <li v-for="(c, i) in missed" :key="i">
            <span lang="ja"><RubyText :text="c.item.jp" /></span>
            <span class="ft__muted">{{ formLabel(c.form) }}</span>
            <strong lang="ja"><RubyText :text="c.answer.ruby" /></strong>
          </li>
        </ul>
      </template>
      <p v-else class="ft__note">Fehlerfrei – 素晴らしい！</p>
      <div class="ft__actions">
        <button v-if="missed.length" type="button" class="ft__btn is-primary" @click="start(missed)">Nur Fehler üben</button>
        <button type="button" class="ft__btn" @click="start(buildCards())">Neue Runde</button>
        <button type="button" class="ft__btn" @click="phase = 'setup'">Auswahl ändern</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.ft {
  margin: 24px 0;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}

.ft p { margin: 0; }

.ft__group { margin: 0 0 16px; padding: 0; border: none; }
.ft__group.is-row { display: flex; flex-wrap: wrap; gap: 8px 18px; }

.ft__group legend {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-2);
}

.ft__group label { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }
.ft__group input { accent-color: var(--vp-c-brand-1); width: 16px; height: 16px; flex: none; }
.ft__opt { display: flex !important; align-items: flex-start !important; padding: 3px 0; }
.ft__opt input { margin-top: 4px; }
.ft__opt strong { font-weight: 600; }
.ft__muted { color: var(--vp-c-text-3); font-size: 13px; }

.ft__rate { margin-left: 6px; font-size: 12px; font-weight: 600; color: var(--vp-c-warning-1); }
.ft__rate.is-good { color: var(--vp-c-green-1); }
.ft__rate.is-bad { color: var(--vp-c-red-1); }

.ft__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin: 16px 0 10px; }

.ft__btn {
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: filter 0.2s ease, border-color 0.2s ease;
}

.ft__btn:hover { border-color: var(--vp-c-brand-1); }
.ft__btn.is-primary { border-color: transparent; color: #fff; background: var(--vp-c-brand-1); }
.ft__btn.is-primary:hover { filter: brightness(1.1); }
.ft__btn:disabled { opacity: 0.4; cursor: default; }

.ft__link { font-size: 13px; color: var(--vp-c-text-3); text-decoration: underline; }
.ft__note { font-size: 14px; color: var(--vp-c-text-2); }

.ft__progress {
  display: flex;
  justify-content: space-between;
  padding-bottom: 8px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  background: linear-gradient(var(--vp-c-brand-1), var(--vp-c-brand-1)) bottom left / var(--p) 3px no-repeat,
    linear-gradient(var(--vp-c-divider), var(--vp-c-divider)) bottom left / 100% 3px no-repeat;
  transition: background-size 0.3s ease;
}

.ft__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin: 16px 0;
  padding: 20px 16px;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  text-align: center;
}

.ft__card.is-wrong { border-color: var(--vp-c-red-1); background: var(--vp-c-red-soft); }
.ft__word { font-size: clamp(34px, 7vw, 48px); line-height: 1.6; font-weight: 500; }
.ft__de { font-size: 15px; color: var(--vp-c-text-2); }
.ft__task { margin-top: 6px; font-size: 16px; }
.ft__task strong { color: var(--vp-c-brand-1); }

.ft__solution { display: flex; align-items: center; gap: 6px; margin-top: 8px !important; font-size: 15px; }
.ft__solution strong { font-size: 24px; line-height: 1.8; color: var(--vp-c-red-1); }
.ft__rule { font-size: 14px; color: var(--vp-c-text-1); }

.ft__form { display: flex; flex-wrap: wrap; gap: 10px; }

.ft__input {
  flex: 1 1 200px;
  padding: 8px 14px;
  font-size: 20px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.ft__input:focus { outline: none; border-color: var(--vp-c-brand-1); }

.ft__last { margin-top: 10px !important; font-size: 15px; }
.ft__last small { display: block; font-size: 12px; color: var(--vp-c-text-2); }
.ft__last.is-ok { color: var(--vp-c-green-1); }
.ft__last.is-bad { color: var(--vp-c-red-1); }

.ft__result { font-size: 18px; margin-bottom: 12px !important; }
.ft__result strong { font-size: 32px; color: var(--vp-c-brand-1); }
.ft__result span { color: var(--vp-c-text-2); }

.vp-doc .ft__missed { display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0; padding: 0; list-style: none; }

.vp-doc .ft__missed li {
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

.ft__missed strong { color: var(--vp-c-brand-1); }
</style>
