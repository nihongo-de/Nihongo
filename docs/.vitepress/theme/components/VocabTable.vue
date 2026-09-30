<script setup lang="ts">
export interface VocabRow {
  word: string
  /** Wortmodus: Hiragana; Kanjimodus: On-Lesung */
  reading: string
  romaji: string
  kun?: string
  romajiKun?: string
  de: string
}

export type VocabColumn = 'word' | 'reading' | 'romaji' | 'de'

defineProps<{ rows: VocabRow[]; words: boolean; blank: VocabColumn[]; size: 's' | 'm' | 'l'; title: string }>()
</script>

<template>
  <div class="vt" :class="`is-${size}`">
    <p class="vt__title">{{ title }}</p>
    <table>
      <thead>
        <tr>
          <th>{{ words ? 'Wort' : 'Kanji' }}</th>
          <th>{{ words ? 'Kana' : 'Lesungen' }}</th>
          <th>Rōmaji</th>
          <th>Deutsch</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :key="r.word">
          <td class="vt__word" lang="ja">{{ blank.includes('word') ? '' : r.word }}</td>
          <td lang="ja">
            <template v-if="!blank.includes('reading')">
              <template v-if="words">{{ r.reading }}</template>
              <template v-else>
                <div v-if="r.reading"><small>音</small>{{ r.reading }}</div>
                <div v-if="r.kun"><small>訓</small>{{ r.kun }}</div>
              </template>
            </template>
          </td>
          <td>
            <template v-if="!blank.includes('romaji')">
              <template v-if="words">{{ r.romaji }}</template>
              <template v-else>
                <div v-if="r.romaji">{{ r.romaji }}</div>
                <div v-if="r.romajiKun">{{ r.romajiKun }}</div>
              </template>
            </template>
          </td>
          <td>{{ blank.includes('de') ? '' : r.de }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.vt { color: #1b1b1f; background: #fff; font-size: 11pt; line-height: 1.35; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
.vt.is-s { font-size: 9pt; }
.vt.is-l { font-size: 13pt; }

.vt__title { margin: 0 0 3mm; font-size: 1.3em; font-weight: 700; }

/* separate statt collapse: Firefox verliert sonst beim Drucken die senkrechten Linien */
.vt table {
  display: table;
  width: 100%;
  margin: 0;
  border: none;
  border-radius: 0;
  border-collapse: separate;
  border-spacing: 0;
  overflow: visible;
}

.vt th,
.vt td {
  padding: 0.35em 0.6em;
  border: none;
  border-right: 0.25mm solid #8f8f8f;
  border-bottom: 0.25mm solid #8f8f8f;
  font-size: 1em;
  text-align: left;
  vertical-align: middle;
  color: #1b1b1f;
  background: none;
}

.vt th { font-size: 0.85em; font-weight: 700; background: #f0f0f0; border-top: 0.25mm solid #8f8f8f; }
.vt th:first-child,
.vt td:first-child { border-left: 0.25mm solid #8f8f8f; }
.vt tbody tr { background: none; break-inside: avoid; page-break-inside: avoid; }

.vt td { height: 2.4em; }
.vt td:first-child { width: 1%; min-width: 2.4em; white-space: nowrap; text-align: center; }
.vt td.vt__word { font-size: 1.8em; line-height: 1.2; }
.vt td:nth-child(2) { width: 24%; }
.vt td:nth-child(3) { width: 22%; }

.vt small {
  margin-right: 0.4em;
  padding: 0 0.25em;
  border-radius: 2px;
  font-size: 0.7em;
  font-weight: 700;
  color: #c8372d;
  background: #fbe7e5;
}
</style>
