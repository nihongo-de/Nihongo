<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { grammarIndex, type GrammarEntry } from '../data/grammar'
import { parseRuby } from '../utils/ruby'
import { toKana } from '../utils/kanaInput'
import RubyText from './RubyText.vue'

const order = ref<'jp' | 'de'>('jp')
const query = ref('')

const ROWS = ['あいうえお', 'かきくけこ', 'さしすせそ', 'たちつてと', 'なにぬねの', 'はひふへほ', 'まみむめも', 'やゆよ', 'らりるれろ', 'わをん']
const SMALL = 'ぁぃぅぇぉっゃゅょゎ'

const toHiragana = (s: string) => s.replace(/[\u30a1-\u30f6]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
// Dakuten weg und kleine Kana groß, damit が bei か und ゃ bei や einsortiert wird
const plainKana = (s: string) =>
  [...s.normalize('NFD').replace(/[\u3099\u309a]/g, '')].map((c) => (SMALL.includes(c) ? String.fromCharCode(c.charCodeAt(0) + 1) : c)).join('')
const rowOf = (kana: string) => ROWS.find((r) => r.includes(plainKana(kana)[0]))?.[0] ?? '…'

const germanKey = (de: string) => de.replace(/^[^\p{L}]+/u, '')
const letterOf = (de: string) => germanKey(de)[0].normalize('NFD')[0].toUpperCase()

const text = (e: GrammarEntry) => parseRuby(e.jp).map((s) => s.text).join('')

const matches = computed(() => {
  const q = query.value.trim().toLowerCase().replace(/[〜~]/g, '')
  if (!q) return grammarIndex
  const kana = /^[a-z' -]+$/.test(q) ? toKana(q, true).replace(/[^\u3041-\u3096ー]/g, '') : toHiragana(q)
  return grammarIndex.filter(
    (e) => e.de.toLowerCase().includes(q) || e.page.toLowerCase().includes(q) || text(e).includes(q) || (!!kana && e.kana.includes(kana))
  )
})

const groups = computed(() => {
  const list =
    order.value === 'jp'
      ? matches.value
          .filter((e) => e.jp)
          .sort((a, b) => plainKana(a.kana).localeCompare(plainKana(b.kana)) || a.kana.localeCompare(b.kana) || a.jp.localeCompare(b.jp))
      : [...matches.value].sort((a, b) => germanKey(a.de).localeCompare(germanKey(b.de), 'de', { sensitivity: 'base' }))
  const out: { label: string; entries: GrammarEntry[] }[] = []
  for (const e of list) {
    const label = order.value === 'jp' ? rowOf(e.kana) : letterOf(e.de)
    if (out[out.length - 1]?.label !== label) out.push({ label, entries: [] })
    out[out.length - 1].entries.push(e)
  }
  return out
})
</script>

<template>
  <div class="gi">
    <div class="gi__bar">
      <input v-model="query" class="gi__search" type="search" placeholder="Suchen: たい, temoii, müssen …" aria-label="Grammatik durchsuchen" />
      <div class="gi__switch" role="group" aria-label="Sortierung">
        <button type="button" :aria-pressed="order === 'jp'" @click="order = 'jp'">あ–ん</button>
        <button type="button" :aria-pressed="order === 'de'" @click="order = 'de'">A–Z</button>
      </div>
    </div>
    <nav v-if="groups.length > 1" class="gi__jump" aria-label="Springen zu">
      <a v-for="g in groups" :key="g.label" :href="`#gi-${g.label}`" :lang="order === 'jp' ? 'ja' : undefined">{{ g.label }}</a>
    </nav>
    <p v-if="!groups.length" class="gi__empty">Nichts gefunden – versuch es mit einem anderen Wort oder auf Rōmaji.</p>
    <section v-for="g in groups" :id="`gi-${g.label}`" :key="g.label" class="gi__group">
      <p class="gi__letter" :lang="order === 'jp' ? 'ja' : undefined">{{ g.label }}</p>
      <ul class="gi__list">
        <li v-for="e in g.entries" :key="e.jp + e.de" :class="{ 'is-de': order === 'de' }">
          <a :href="withBase(e.link)">
            <span v-if="e.jp" class="gi__jp" lang="ja"><RubyText :text="e.jp" /></span>
            <span class="gi__de">{{ e.de }}</span>
          </a>
          <span class="gi__page">{{ e.page }}<span class="gi__level">{{ e.level }}</span></span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.gi { margin: 20px 0; }

.gi__bar {
  position: sticky;
  top: calc(var(--vp-nav-height) + 8px);
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.gi__search {
  flex: 1 1 220px;
  padding: 6px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  font-size: 15px;
}

.gi__search:focus { border-color: var(--vp-c-brand-1); outline: none; }

.gi__switch { display: flex; gap: 4px; }

.gi__switch button {
  padding: 6px 14px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 999px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.gi__switch button[aria-pressed='true'] { color: var(--vp-c-white); background: var(--vp-c-brand-1); }

.gi__jump { display: flex; flex-wrap: wrap; gap: 4px 10px; margin: 12px 0 0; font-size: 15px; font-weight: 600; }
.vp-doc .gi__jump a { text-decoration: none; }

.gi__empty { color: var(--vp-c-text-2); }

.gi__group { scroll-margin-top: calc(var(--vp-nav-height) + 80px); }

.vp-doc .gi__letter {
  margin: 24px 0 4px;
  padding-bottom: 4px;
  border-bottom: 2px solid var(--vp-c-brand-1);
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.vp-doc .gi__list { margin: 0; padding: 0; list-style: none; }

.vp-doc .gi__list li {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0 12px;
  margin: 0;
  padding: 4px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.vp-doc .gi__list a {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0 12px;
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.vp-doc .gi__list a:hover .gi__jp,
.vp-doc .gi__list a:hover .gi__de { color: var(--vp-c-brand-1); }

.gi__jp { font-size: 18px; line-height: 2; font-weight: 500; }
.gi__de { font-size: 15px; color: var(--vp-c-text-2); }

/* Im deutschen Register steht das Stichwort vorne */
.is-de a { flex-direction: row-reverse; justify-content: flex-end; }
.is-de .gi__de { font-size: 16px; color: var(--vp-c-text-1); }
.is-de .gi__jp { font-size: 16px; color: var(--vp-c-text-2); }

.gi__page { font-size: 13px; color: var(--vp-c-text-3); }

.gi__level {
  margin-left: 6px;
  padding: 0 6px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  background: var(--vp-c-default-soft);
}

@media print {
  .gi__bar,
  .gi__jump { display: none; }
}
</style>
