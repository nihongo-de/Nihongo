<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, shallowRef, watch } from 'vue'
import { levelLabels, loadLevel, type Kanji, type Level } from '../data/levels'
import { n5Groups } from '../data/n5'
import { n4Groups } from '../data/n4'
import { kanaSets, toKatakana, type KanaSet } from '../data/kana'
import { loadGlyph, loadRatings, ratings, type Glyph } from '../utils/strokes'
import { parseRuby } from '../utils/ruby'
import { toRomaji } from '../utils/romaji'
import { SIZES, columns, maxPerPage } from '../utils/sheets'
import KanjiPicker, { type PickerLevel } from './KanjiPicker.vue'
import SheetPage, { type SheetItem } from './SheetPage.vue'
import VocabTable, { type VocabColumn, type VocabRow } from './VocabTable.vue'

type Kind = 'kana' | 'kanji' | 'vocab'
interface LevelKanji extends Kanji {
  level: Level
}

const kanaKeys = (s: KanaSet) => kanaSets[s].rows.flat().flatMap((c) => (c ? [c[0]] : []))

const defaults = {
  kind: 'kana' as Kind,
  script: 'hiragana' as 'hiragana' | 'katakana',
  /** Ausgewählte Kana in Hiragana-Schreibung (erweiterte Katakana als Katakana) */
  kana: kanaKeys('basic'),
  size: 16,
  perPage: 6,
  trace: 3,
  words: false,
  blank: [] as VocabColumn[],
  font: 'm' as 's' | 'm' | 'l'
}
const opts = reactive({ ...defaults, kana: [...defaults.kana], blank: [] as VocabColumn[] })

const setLabels: Record<KanaSet, string> = {
  basic: 'Grundzeichen',
  dakuten: 'Dakuten ゛/ Handakuten ゜',
  yoon: 'Yōon (きゃ, しゅ …)',
  extended: 'Erweiterte Katakana (ファ, ティ …)'
}
const columnLabels: Record<VocabColumn, string> = { word: 'Kanji', reading: 'Lesung', romaji: 'Rōmaji', de: 'Deutsch' }

/* Kana-Auswahl */
const kanaGroups = computed(() => {
  const katakana = opts.script === 'katakana'
  return (Object.keys(setLabels) as KanaSet[])
    .filter((s) => katakana || s !== 'extended')
    .map((s) => ({
      id: s,
      title: setLabels[s],
      chars: kanaSets[s].rows.flat().flatMap((c) =>
        c ? [{ key: c[0], text: katakana && s !== 'extended' ? toKatakana(c[0]) : c[0], romaji: c[1] }] : []
      )
    }))
})
type KanaChar = (typeof kanaGroups.value)[number]['chars'][number]
const kanaChars = computed(() => kanaGroups.value.flatMap((g) => g.chars))
const kanaSelected = computed(() => new Set(opts.kana))
const countKana = (chars: KanaChar[]) => chars.filter((c) => kanaSelected.value.has(c.key)).length
const weakKana = computed(() => kanaChars.value.filter((c) => ratings.value[c.text] === 'again' || ratings.value[c.text] === 'almost'))

function setKana(chars: KanaChar[], on: boolean) {
  const next = new Set(opts.kana)
  chars.forEach((c) => (on ? next.add(c.key) : next.delete(c.key)))
  opts.kana = [...next]
}

/* Kanji-Auswahl */
const toLevel = (id: Level, groups: { id: string; title: string; kanji: Kanji[] }[]): PickerLevel => ({
  id,
  label: levelLabels[id],
  groups: groups.map((g) => ({ id: g.id, title: g.title, kanji: g.kanji.map((k): LevelKanji => ({ ...k, level: id })) }))
})
const LEVELS = shallowRef<PickerLevel[]>([toLevel('n5', n5Groups), toLevel('n4', n4Groups)])
const ALL_KANJI = computed(() => LEVELS.value.flatMap((l) => l.groups.flatMap((g) => g.kanji as LevelKanji[])))
const selected = ref(new Set(ALL_KANJI.value.filter((k) => k.level === 'n5').map((k) => k.k)))
const selectedKanji = computed(() => ALL_KANJI.value.filter((k) => selected.value.has(k.k)))
const weak = computed(() => ALL_KANJI.value.filter((k) => ratings.value[k.k] === 'again' || ratings.value[k.k] === 'almost'))
const levelsText = computed(() => [...new Set(selectedKanji.value.map((k) => levelLabels[k.level]))].join(' · '))

/* Schreibblätter */
const reading = (s: string) => (s === '–' ? '' : s)

const writeItems = computed<Omit<SheetItem, 'glyph'>[]>(() => {
  if (opts.kind === 'kanji') {
    return selectedKanji.value.map((k) => ({
      text: k.k,
      label: k.de,
      sub: [reading(k.on) && `音 ${k.on}`, reading(k.kun) && `訓 ${k.kun}`].filter(Boolean).join('　')
    }))
  }
  if (opts.kind !== 'kana') return []
  return kanaChars.value.filter((c) => kanaSelected.value.has(c.key)).map((c) => ({ text: c.text, label: c.romaji }))
})

const glyphs = shallowRef<Record<string, Glyph | null>>({})
const ready = computed(() => writeItems.value.every((i) => i.text in glyphs.value))

async function loadGlyphs(texts: string[]) {
  const missing = [...new Set(texts)].filter((t) => !(t in glyphs.value))
  if (!missing.length) return
  const loaded = await Promise.all(missing.map(loadGlyph))
  glyphs.value = { ...glyphs.value, ...Object.fromEntries(missing.map((t, i) => [t, loaded[i]])) }
}

const sheetItems = computed<SheetItem[]>(() =>
  writeItems.value.map((i) => {
    const glyph = glyphs.value[i.text] ?? null
    const n = glyph?.strokes.length ?? 0
    const count = opts.kind === 'kanji' && n ? `　${n} ${n === 1 ? 'Strich' : 'Striche'}` : ''
    return { ...i, sub: (i.sub ?? '') + count, glyph }
  })
)

const maxCount = computed(() => maxPerPage(opts.size))
const perPage = computed(() => Math.min(maxCount.value, Math.max(1, Math.round(Number(opts.perPage) || 1))))
const maxTrace = computed(() => columns(opts.size) - 1)
const trace = computed(() => Math.min(opts.trace, maxTrace.value))

const pages = computed(() => {
  const out: SheetItem[][] = []
  for (let i = 0; i < sheetItems.value.length; i += perPage.value) out.push(sheetItems.value.slice(i, i + perPage.value))
  return out
})
const pageIdx = ref(0)
watch(pages, (p) => (pageIdx.value = Math.min(pageIdx.value, Math.max(0, p.length - 1))))

const sheetTitle = computed(() =>
  opts.kind === 'kana'
    ? `${opts.script === 'hiragana' ? 'Hiragana' : 'Katakana'} – Schreibübung`
    : `Kanji ${levelsText.value} – Schreibübung`
)

/* Vokabelliste */
const romajiList = (s: string) => (s ? s.split('・').map((r) => toRomaji(r)).join(', ') : '')

const vocabRows = computed<VocabRow[]>(() => {
  if (opts.words) {
    const seen = new Set<string>()
    return selectedKanji.value.flatMap((k) => {
      if (!k.ex || seen.has(k.ex)) return []
      seen.add(k.ex)
      const segs = parseRuby(k.ex)
      const kana = segs.map((s) => s.rt ?? s.text)
      return [{ word: segs.map((s) => s.text).join(''), reading: kana.join(''), romaji: toRomaji(kana), de: k.exDe ?? '' }]
    })
  }
  return selectedKanji.value.map((k) => {
    const on = reading(k.on)
    const kun = reading(k.kun)
    return { word: k.k, reading: on, kun, romaji: romajiList(on), romajiKun: romajiList(kun), de: k.de }
  })
})
const withoutExample = computed(() => selectedKanji.value.filter((k) => !k.ex).length)
const vocabTitle = computed(() => `${opts.words ? 'Beispielwörter' : 'Kanji-Vokabeln'} ${levelsText.value}`)

const canPrint = computed(() => (opts.kind === 'vocab' ? vocabRows.value.length > 0 : ready.value && pages.value.length > 0))

/* Drucken: Vorlagen außerhalb der Seite rendern und nur diese drucken */
const printing = ref(false)

async function print() {
  if (printing.value || !canPrint.value) return
  printing.value = true
  await nextTick()
  await new Promise((r) => requestAnimationFrame(r))
  await document.fonts.ready
  const style = document.createElement('style')
  style.textContent = `@page { size: A4; margin: ${opts.kind === 'vocab' ? '12mm' : '0'}; }`
  document.head.append(style)
  document.documentElement.classList.add('print-sheets')
  window.addEventListener(
    'afterprint',
    () => {
      style.remove()
      document.documentElement.classList.remove('print-sheets')
      printing.value = false
    },
    { once: true }
  )
  window.print()
}

/* Einstellungen merken */
const OPTS_KEY = 'nihongo:print-sheets'
const SELECTION_KEY = 'nihongo:print-sheets-kanji'

function restore() {
  try {
    const saved = JSON.parse(localStorage.getItem(OPTS_KEY) ?? 'null')
    if (saved && typeof saved === 'object') {
      for (const key of Object.keys(defaults) as (keyof typeof defaults)[]) {
        const value = saved[key]
        if (Array.isArray(defaults[key]) ? Array.isArray(value) : typeof value === typeof defaults[key]) {
          ;(opts as Record<string, unknown>)[key] = value
        }
      }
    }
  } catch {}
}

onMounted(async () => {
  restore()
  loadRatings()
  watch(() => writeItems.value.map((i) => i.text), loadGlyphs, { immediate: true })
  watch(opts, () => localStorage.setItem(OPTS_KEY, JSON.stringify(opts)), { deep: true })
  const extra = await Promise.all((['n3', 'n2', 'n1'] as const).map(async (id) => toLevel(id, await loadLevel(id))))
  LEVELS.value = [...LEVELS.value, ...extra]
  try {
    const saved = JSON.parse(localStorage.getItem(SELECTION_KEY) ?? 'null')
    const known = new Set(ALL_KANJI.value.map((k) => k.k))
    if (Array.isArray(saved)) selected.value = new Set(saved.filter((k) => known.has(k)))
  } catch {}
  watch(selected, (s) => localStorage.setItem(SELECTION_KEY, JSON.stringify([...s])))
})
</script>

<template>
  <div class="ps">
    <fieldset class="ps__group">
      <legend>Vorlage</legend>
      <label><input v-model="opts.kind" type="radio" value="kana" /> Kana-Schreibblatt</label>
      <label><input v-model="opts.kind" type="radio" value="kanji" /> Kanji-Schreibblatt</label>
      <label><input v-model="opts.kind" type="radio" value="vocab" /> Kanji-Vokabelliste</label>
    </fieldset>

    <template v-if="opts.kind === 'kana'">
      <fieldset class="ps__group">
        <legend>Schrift</legend>
        <label><input v-model="opts.script" type="radio" value="hiragana" /> Hiragana</label>
        <label><input v-model="opts.script" type="radio" value="katakana" /> Katakana</label>
      </fieldset>
      <fieldset class="ps__group is-block">
        <legend>Zeichen <span class="ps__muted">· {{ countKana(kanaChars) }} ausgewählt</span></legend>
        <div class="ps__quick">
          <button type="button" @click="setKana(kanaChars, true)">Alle</button>
          <button v-if="weakKana.length" type="button" @click="opts.kana = weakKana.map((c) => c.key)">
            Zum Üben markierte ({{ weakKana.length }})
          </button>
          <button type="button" @click="opts.kana = []">Keine</button>
        </div>
        <div v-for="g in kanaGroups" :key="g.id" class="ps__pick">
          <label>
            <input
              type="checkbox"
              :checked="countKana(g.chars) === g.chars.length"
              :indeterminate="countKana(g.chars) > 0 && countKana(g.chars) < g.chars.length"
              @change="setKana(g.chars, ($event.target as HTMLInputElement).checked)"
            />
            {{ g.title }}
          </label>
          <div class="ps__chips">
            <button
              v-for="c in g.chars"
              :key="c.key"
              type="button"
              lang="ja"
              :title="c.romaji"
              :aria-label="`${c.text} (${c.romaji})`"
              :aria-pressed="kanaSelected.has(c.key)"
              @click="setKana([c], !kanaSelected.has(c.key))"
            >
              {{ c.text }}
            </button>
          </div>
        </div>
      </fieldset>
    </template>

    <fieldset v-else class="ps__group is-block">
      <legend>Kanji auswählen <span class="ps__muted">· {{ selected.size }} ausgewählt</span></legend>
      <KanjiPicker v-model="selected" :levels="LEVELS" :weak="weak" />
    </fieldset>

    <template v-if="opts.kind === 'vocab'">
      <fieldset class="ps__group">
        <legend>Inhalt</legend>
        <label><input v-model="opts.words" type="radio" :value="false" /> Kanji mit Lesungen</label>
        <label><input v-model="opts.words" type="radio" :value="true" /> Beispielwörter (N5 &amp; N4)</label>
      </fieldset>
      <fieldset class="ps__group">
        <legend>Zum Abfragen leer lassen</legend>
        <label v-for="(label, col) in columnLabels" :key="col">
          <input v-model="opts.blank" type="checkbox" :value="col" /> {{ col === 'word' && opts.words ? 'Wort' : col === 'reading' && opts.words ? 'Hiragana' : label }}
        </label>
      </fieldset>
      <fieldset class="ps__group">
        <legend>Schriftgröße</legend>
        <label><input v-model="opts.font" type="radio" value="s" /> Klein</label>
        <label><input v-model="opts.font" type="radio" value="m" /> Mittel</label>
        <label><input v-model="opts.font" type="radio" value="l" /> Groß</label>
      </fieldset>
    </template>

    <fieldset v-else class="ps__group">
      <legend>Layout</legend>
      <label>
        Feldgröße
        <select v-model.number="opts.size">
          <option v-for="s in SIZES" :key="s" :value="s">{{ s }} mm</option>
        </select>
      </label>
      <label>
        Zeichen pro Seite
        <input v-model.number="opts.perPage" type="number" min="1" :max="maxCount" />
        <span class="ps__muted">max. {{ maxCount }}</span>
      </label>
      <label>
        Zum Nachspuren
        <select v-model.number="opts.trace">
          <option v-for="n in Math.min(8, maxTrace) + 1" :key="n" :value="n - 1">{{ n - 1 }} × grau</option>
        </select>
      </label>
    </fieldset>

    <div class="ps__actions">
      <button type="button" class="ps__btn is-primary" :disabled="!canPrint || printing" @click="print">
        <template v-if="opts.kind === 'vocab'">Drucken · {{ vocabRows.length }} {{ opts.words ? 'Wörter' : 'Kanji' }}</template>
        <template v-else-if="!ready">Strichfolgen werden geladen …</template>
        <template v-else>Drucken · {{ pages.length }} {{ pages.length === 1 ? 'Seite' : 'Seiten' }}</template>
      </button>
    </div>
    <p v-if="opts.kind === 'vocab' && opts.words && withoutExample" class="ps__note">
      {{ withoutExample }} der ausgewählten Kanji haben kein Beispielwort (N3–N1) und werden ausgelassen.
    </p>

    <div class="ps__preview">
      <template v-if="opts.kind === 'vocab'">
        <div v-if="vocabRows.length" class="ps__paper is-scroll">
          <VocabTable :rows="vocabRows" :words="opts.words" :blank="opts.blank" :size="opts.font" :title="vocabTitle" />
        </div>
      </template>
      <template v-else-if="pages.length && ready">
        <div class="ps__nav">
          <button type="button" :disabled="pageIdx === 0" aria-label="Vorherige Seite" @click="pageIdx--">‹</button>
          <span>Vorschau · Seite {{ pageIdx + 1 }} / {{ pages.length }}</span>
          <button type="button" :disabled="pageIdx >= pages.length - 1" aria-label="Nächste Seite" @click="pageIdx++">›</button>
        </div>
        <div class="ps__paper">
          <SheetPage
            :items="pages[pageIdx]"
            :size="opts.size"
            :per-page="perPage"
            :trace="trace"
            :title="sheetTitle"
            :page="pageIdx + 1"
            :pages="pages.length"
            id-prefix="v"
          />
        </div>
      </template>
      <p v-else-if="!writeItems.length" class="ps__note">Wähle oben aus, welche Zeichen auf die Vorlage sollen.</p>
    </div>

    <Teleport v-if="printing" to="body">
      <div class="sheet-print">
        <VocabTable
          v-if="opts.kind === 'vocab'"
          :rows="vocabRows"
          :words="opts.words"
          :blank="opts.blank"
          :size="opts.font"
          :title="vocabTitle"
        />
        <template v-else>
          <SheetPage
            v-for="(p, i) in pages"
            :key="i"
            :items="p"
            :size="opts.size"
            :per-page="perPage"
            :trace="trace"
            :title="sheetTitle"
            :page="i + 1"
            :pages="pages.length"
            id-prefix="p"
          />
        </template>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.ps {
  margin: 24px 0;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}

.ps__group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 18px;
  margin: 0 0 16px;
  padding: 0;
  border: none;
}

.ps__group.is-block { display: block; }

.ps__group legend {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-2);
}

.ps__group label { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }
.ps__group input[type='radio'],
.ps__group input[type='checkbox'] { accent-color: var(--vp-c-brand-1); width: 16px; height: 16px; }

.ps__group select,
.ps__group input[type='number'] {
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.ps__group input[type='number'] { width: 64px; }

.ps__muted { color: var(--vp-c-text-3); font-weight: 400; font-size: 13px; text-transform: none; letter-spacing: 0; }

.ps__quick { display: flex; flex-wrap: wrap; gap: 4px 14px; margin-bottom: 8px; }
.ps__quick button { font-size: 13px; font-weight: 600; color: var(--vp-c-brand-1); }
.ps__quick button:hover { text-decoration: underline; }

.ps__pick { margin-top: 10px; }
.ps__pick label { font-size: 14px; font-weight: 600; }

.ps__chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }

.ps__chips button {
  min-width: 34px;
  height: 34px;
  padding: 0 4px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  font-size: 17px;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg);
  transition: border-color 0.15s ease, background-color 0.15s ease, color 0.15s ease;
}

.ps__chips button:hover { border-color: var(--vp-c-brand-1); }

.ps__chips button[aria-pressed='true'] {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
  background: var(--vp-c-brand-soft);
}

.ps__actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 4px 0 10px; }

.ps__btn {
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 999px;
  border: 1px solid transparent;
  color: #fff;
  background: var(--vp-c-brand-1);
  transition: filter 0.2s ease;
}

.ps__btn:hover:not(:disabled) { filter: brightness(1.1); }
.ps__btn:disabled { opacity: 0.5; cursor: default; }

.ps__note { margin: 0 0 10px; font-size: 14px; color: var(--vp-c-text-2); }

.ps__preview { margin-top: 16px; }

.ps__nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.ps__nav button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  font-size: 18px;
  line-height: 1;
}

.ps__nav button:hover:not(:disabled) { border-color: var(--vp-c-brand-1); }
.ps__nav button:disabled { opacity: 0.4; cursor: default; }

.ps__paper {
  max-width: 560px;
  margin: 0 auto;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.ps__paper.is-scroll {
  max-width: none;
  max-height: 70vh;
  padding: 16px;
  overflow: auto;
  background: #fff;
}

@media (max-width: 480px) {
  .ps { padding: 14px; }
}

@media print {
  .ps { display: none; }
}
</style>

<style>
/* Außerhalb des Bildschirms rendern, damit Schriften vor dem Drucken geladen werden */
@media screen {
  .sheet-print { position: fixed; top: 0; left: -10000px; width: 186mm; }
}

@media print {
  html.print-sheets body > :not(.sheet-print) { display: none !important; }
  html.print-sheets .sheet-page { width: 210mm; height: 296mm; break-after: page; }
  html.print-sheets .sheet-page:last-child { break-after: auto; }
}
</style>
