<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useData, withBase } from 'vitepress'
import type { DefaultTheme } from 'vitepress/theme'
import { downloadBackup, importBackup, progress, progressReady, removeBookmark, resetProgress } from '../utils/progress'
import { loadRatings, ratings } from '../utils/strokes'

interface Link { text: string; link: string }

const { theme } = useData<DefaultTheme.Config>()

const collect = (items: DefaultTheme.SidebarItem[]): Link[] =>
  items.flatMap((i) => [...(i.link ? [{ text: i.text ?? i.link, link: i.link }] : []), ...collect(i.items ?? [])])

const levels = computed(() => {
  const s = theme.value.sidebar
  return (Array.isArray(s) ? s : [])
    .filter((g) => g.text !== 'Werkzeuge')
    .map((g) => {
      const links = collect(g.items ?? [])
      const done = links.filter((l) => progress.done[l.link]).length
      return { text: g.text ?? '', total: links.length, done, next: links.find((l) => !progress.done[l.link]) }
    })
})

const lastHref = computed(() => {
  const last = progress.last
  return last ? withBase(last.path) + (last.hash ? `#${last.hash}` : '') : ''
})

function reset() {
  if (confirm('Gelernt-Markierungen, Lesezeichen, Übungsergebnisse und die letzte Position löschen?')) resetProgress()
}

const results = computed(() => Object.values(progress.results).sort((a, b) => b.time - a.time))
const pct = (score: number, total: number) => Math.round((score / total) * 100)
const dateFmt = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'short' })

// Selbstbewertungen beim Schreiben (Kana- und Kanji-Quiz, Strichfolge-Dialog)
const writing = computed(() =>
  (['Kana', 'Kanji'] as const)
    .map((label) => {
      const own = Object.entries(ratings.value).filter(([k]) => /^[\u3040-\u30ff]/.test(k) === (label === 'Kana'))
      const count = (r: string) => own.filter(([, v]) => v === r).length
      return { label, good: count('good'), almost: count('almost'), again: count('again'), total: own.length }
    })
    .filter((w) => w.total)
)

const fileInput = ref<HTMLInputElement>()
const backupMsg = ref('')

async function restore(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file || !confirm('Die Sicherung ersetzt deinen bisherigen Fortschritt in diesem Browser. Fortfahren?')) return
  try {
    await importBackup(file)
    location.reload()
  } catch (err) {
    backupMsg.value = (err as Error).message
  }
}

onMounted(loadRatings)
</script>

<template>
  <section id="fortschritt" class="dash">
    <h2>Dein Fortschritt</h2>

    <template v-if="progressReady">
      <a v-if="progress.last" class="dash__continue" :href="lastHref">
        <span class="dash__eyebrow">Weiter, wo du aufgehört hast</span>
        <strong>{{ progress.last.title }}</strong>
        <span v-if="progress.last.heading">{{ progress.last.heading }}</span>
      </a>
      <a v-else class="dash__continue" :href="withBase('/start/')">
        <span class="dash__eyebrow">Noch nicht angefangen?</span>
        <strong>Japanisch auf einen Blick</strong>
        <span>Der beste Einstieg in den Lernpfad</span>
      </a>

      <div class="dash__levels">
        <div v-for="lvl in levels" :key="lvl.text" class="dash__level" :class="{ 'is-complete': !lvl.next }">
          <div class="dash__level-head">
            <strong>{{ lvl.text }}</strong>
            <span>{{ lvl.done }} / {{ lvl.total }}</span>
          </div>
          <div class="dash__bar" role="progressbar" :aria-valuenow="lvl.done" aria-valuemin="0" :aria-valuemax="lvl.total" :aria-label="lvl.text">
            <span :style="{ width: `${(lvl.done / lvl.total) * 100}%` }" />
          </div>
          <a v-if="lvl.next" class="dash__next" :href="withBase(lvl.next.link)">Als Nächstes: {{ lvl.next.text }}</a>
          <span v-else class="dash__next">Alles gelernt ✓</span>
        </div>
      </div>

      <template v-if="progress.bookmarks.length">
        <h3>Lesezeichen</h3>
        <ul class="dash__bookmarks">
          <li v-for="b in progress.bookmarks" :key="b.path">
            <a :href="withBase(b.path)">{{ b.title }}</a>
            <button type="button" :aria-label="`Lesezeichen „${b.title}“ entfernen`" title="Entfernen" @click="removeBookmark(b.path)">×</button>
          </li>
        </ul>
      </template>

      <template v-if="results.length || writing.length">
        <h3>Übungen</h3>
        <ul class="dash__results">
          <li v-for="r in results" :key="r.title">
            <a :href="withBase(r.path)">{{ r.title }}</a>
            <span class="dash__score" :class="{ 'is-good': pct(r.score, r.total) >= 80 }">{{ r.score }} / {{ r.total }} · {{ pct(r.score, r.total) }} %</span>
            <span class="dash__meta">
              Bestwert {{ r.best }} % · {{ r.runs }}× geübt · zuletzt {{ dateFmt.format(r.time) }}
            </span>
          </li>
          <li v-for="w in writing" :key="w.label">
            <a :href="withBase(w.label === 'Kana' ? '/uebungen/kana' : '/uebungen/kanji-quiz')">{{ w.label }} schreiben</a>
            <span class="dash__score">{{ w.good }} / {{ w.total }} sitzen</span>
            <span class="dash__meta">{{ w.almost }} fast richtig · {{ w.again }} zum Wiederholen</span>
          </li>
        </ul>
      </template>

      <p class="dash__note">
        Dein Fortschritt wird nur in diesem Browser gespeichert. Sichere ihn als Datei, um ihn auf ein anderes Gerät mitzunehmen.
      </p>
      <div class="dash__backup">
        <button type="button" @click="downloadBackup">Sichern</button>
        <button type="button" @click="fileInput?.click()">Wiederherstellen …</button>
        <button type="button" @click="reset">Zurücksetzen</button>
        <input ref="fileInput" type="file" accept="application/json,.json" hidden @change="restore" />
      </div>
      <p v-if="backupMsg" class="dash__error" role="alert">{{ backupMsg }}</p>
    </template>
  </section>
</template>

<style scoped>
.dash__continue {
  display: block;
  margin: 16px 0 24px;
  padding: 16px 20px;
  border-left: 4px solid var(--vp-c-brand-1);
  border-radius: 12px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: transform 0.2s;
}

.vp-doc .dash__continue { text-decoration: none; }
.dash__continue:hover { transform: translateY(-2px); }
.dash__continue strong { display: block; font-size: 18px; }
.dash__continue span { display: block; font-size: 14px; color: var(--vp-c-text-2); }
.dash__continue .dash__eyebrow { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--vp-c-brand-1); }

.dash__levels {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.dash__level {
  padding: 14px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.dash__level-head { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
.dash__level-head span { font-size: 13px; color: var(--vp-c-text-2); font-variant-numeric: tabular-nums; }

.dash__bar {
  height: 6px;
  margin: 8px 0;
  border-radius: 3px;
  background: var(--vp-c-default-soft);
  overflow: hidden;
}

.dash__bar span { display: block; height: 100%; border-radius: 3px; background: var(--vp-c-brand-1); transition: width 0.3s; }
.is-complete .dash__bar span { background: var(--vp-c-green-1); }

.dash__next { display: block; font-size: 13px; line-height: 1.5; }
.vp-doc a.dash__next { text-decoration: none; }
.is-complete .dash__next { color: var(--vp-c-green-1); }

.dash__bookmarks { padding: 0; list-style: none; }
.vp-doc .dash__bookmarks li { display: flex; align-items: center; justify-content: space-between; margin: 0; padding: 4px 0; border-bottom: 1px solid var(--vp-c-divider); }
.dash__bookmarks button { width: 28px; height: 28px; font-size: 18px; color: var(--vp-c-text-3); }
.dash__bookmarks button:hover { color: var(--vp-c-brand-1); }

.dash__results { padding: 0; list-style: none; }
.vp-doc .dash__results li {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0 12px;
  margin: 0;
  padding: 6px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}
.vp-doc .dash__results a { text-decoration: none; }
.dash__score { font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums; color: var(--vp-c-text-2); }
.dash__score.is-good { color: var(--vp-c-green-1); }
.dash__meta { grid-column: 1 / -1; font-size: 12px; color: var(--vp-c-text-3); }

.dash__note { font-size: 13px; color: var(--vp-c-text-3); }
.dash__backup { display: flex; flex-wrap: wrap; gap: 8px; }
.dash__backup button {
  padding: 4px 14px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 999px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}
.dash__backup button:last-of-type { color: var(--vp-c-text-2); background: var(--vp-c-default-soft); }
.dash__backup button:hover { filter: brightness(1.1); }
.vp-doc .dash__error { font-size: 13px; color: var(--vp-c-red-1); }
</style>
