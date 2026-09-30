<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { isBookmarked, pathOf, progress, toggleBookmark, toggleDone } from '../utils/progress'

defineProps<{ footer?: boolean }>()

const { page } = useData()
const path = computed(() => pathOf(page.value.relativePath))
const bookmarked = computed(() => isBookmarked(path.value))
const done = computed(() => !!progress.done[path.value])
</script>

<template>
  <div class="page-actions" :class="{ 'is-footer': footer }">
    <button
      v-if="!footer"
      type="button"
      class="page-actions__btn"
      :class="{ 'is-on': bookmarked }"
      :aria-pressed="bookmarked"
      :title="bookmarked ? 'Lesezeichen entfernen' : 'Seite als Lesezeichen merken'"
      @click="toggleBookmark({ path, title: page.title })"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" :fill="bookmarked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true">
        <path d="M6 3h12v18l-6-4-6 4z" />
      </svg>
      {{ bookmarked ? 'Gemerkt' : 'Merken' }}
    </button>
    <button
      type="button"
      class="page-actions__btn"
      :class="{ 'is-done': done }"
      :aria-pressed="done"
      :title="done ? 'Markierung entfernen' : 'Seite als gelernt markieren'"
      @click="toggleDone(path)"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M5 12l5 5L20 7" />
      </svg>
      {{ done ? 'Gelernt' : 'Als gelernt markieren' }}
    </button>
  </div>
</template>

<style scoped>
.page-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 16px;
}

.page-actions.is-footer {
  justify-content: center;
  margin: 32px 0 24px;
}

.page-actions__btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: color 0.2s, border-color 0.2s, background-color 0.2s;
}

.page-actions__btn:hover { color: var(--vp-c-text-1); border-color: var(--vp-c-brand-1); }
.page-actions__btn.is-on { color: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.page-actions__btn.is-done { color: var(--vp-c-green-1); border-color: var(--vp-c-green-1); background: var(--vp-c-green-soft); }

.is-footer .page-actions__btn { padding: 8px 20px; font-size: 15px; }

@media print {
  .page-actions { display: none; }
}
</style>
