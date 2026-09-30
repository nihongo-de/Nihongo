<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import type { DefaultTheme } from 'vitepress/theme'
import { progress, progressReady, removeBookmark, resetProgress } from '../utils/progress'

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
  if (confirm('Gelernt-Markierungen, Lesezeichen und die letzte Position löschen?')) resetProgress()
}
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

      <p class="dash__note">
        Dein Fortschritt wird nur in diesem Browser gespeichert.
        <button type="button" class="dash__reset" @click="reset">Zurücksetzen</button>
      </p>
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

.dash__note { font-size: 13px; color: var(--vp-c-text-3); }
.dash__reset { margin-left: 4px; font-size: 13px; color: var(--vp-c-text-2); text-decoration: underline; }
.dash__reset:hover { color: var(--vp-c-brand-1); }
</style>
