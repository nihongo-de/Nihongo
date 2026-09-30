<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, withBase } from 'vitepress'
import { progress, removeBookmark } from '../utils/progress'

const open = ref(false)
const root = ref<HTMLElement>()
const route = useRoute()

const lastHref = computed(() => {
  const last = progress.last
  return last ? withBase(last.path) + (last.hash ? `#${last.hash}` : '') : ''
})

watch(() => route.path, () => (open.value = false))

function onPointer(e: PointerEvent) {
  if (open.value && !root.value?.contains(e.target as Node)) open.value = false
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}
function onPanelClick(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('a')) open.value = false
}

onMounted(() => {
  document.addEventListener('pointerdown', onPointer)
  document.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  document.removeEventListener('pointerdown', onPointer)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div ref="root" class="bm-menu">
    <button
      type="button"
      class="bm-menu__toggle"
      title="Weiterlernen & Lesezeichen"
      aria-label="Weiterlernen & Lesezeichen"
      aria-haspopup="true"
      :aria-expanded="open"
      @click="open = !open"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true">
        <path d="M6 3h12v18l-6-4-6 4z" />
      </svg>
    </button>

    <div v-if="open" class="bm-menu__panel" @click="onPanelClick">
      <p class="bm-menu__label">Weiter, wo du aufgehört hast</p>
      <a v-if="progress.last" class="bm-menu__continue" :href="lastHref">
        <strong>{{ progress.last.title }}</strong>
        <span v-if="progress.last.heading">{{ progress.last.heading }}</span>
      </a>
      <p v-else class="bm-menu__empty">Du hast noch keine Seite gelesen.</p>

      <p class="bm-menu__label">Lesezeichen</p>
      <ul v-if="progress.bookmarks.length" class="bm-menu__list">
        <li v-for="b in progress.bookmarks" :key="b.path">
          <a :href="withBase(b.path)">{{ b.title }}</a>
          <button type="button" :aria-label="`Lesezeichen „${b.title}“ entfernen`" title="Entfernen" @click="removeBookmark(b.path)">×</button>
        </li>
      </ul>
      <p v-else class="bm-menu__empty">Noch keine Lesezeichen – tippe auf einer Seite auf „Merken“.</p>

      <a class="bm-menu__all" :href="withBase('/#fortschritt')">Dein Fortschritt →</a>
    </div>
  </div>
</template>

<style scoped>
.bm-menu { position: relative; }

.bm-menu__toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-left: 8px;
  color: var(--vp-c-text-2);
  transition: color 0.25s;
}

.bm-menu__toggle:hover,
.bm-menu__toggle[aria-expanded='true'] { color: var(--vp-c-text-1); }

.bm-menu__panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 50;
  width: 320px;
  max-height: calc(100vh - var(--vp-nav-height) - 24px);
  overflow-y: auto;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-3);
}

@media (max-width: 639px) {
  .bm-menu__panel {
    position: fixed;
    top: var(--vp-nav-height);
    right: 12px;
    left: 12px;
    width: auto;
  }
}

.bm-menu__label {
  margin: 8px 4px 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-3);
}

.bm-menu__label:first-child { margin-top: 0; }

.bm-menu__continue {
  display: block;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-text-1);
}

.bm-menu__continue strong { display: block; font-size: 14px; }
.bm-menu__continue span { display: block; font-size: 13px; color: var(--vp-c-text-2); }
.bm-menu__continue:hover strong { color: var(--vp-c-brand-1); }

.bm-menu__empty { margin: 0 4px 4px; font-size: 13px; color: var(--vp-c-text-2); }

.bm-menu__list { margin: 0; padding: 0; list-style: none; }

.bm-menu__list li { display: flex; align-items: center; border-radius: 8px; }
.bm-menu__list li:hover { background: var(--vp-c-default-soft); }

.bm-menu__list a {
  flex: 1;
  padding: 6px 8px;
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.bm-menu__list a:hover { color: var(--vp-c-brand-1); }

.bm-menu__list button {
  width: 28px;
  height: 28px;
  font-size: 18px;
  line-height: 1;
  color: var(--vp-c-text-3);
}

.bm-menu__list button:hover { color: var(--vp-c-brand-1); }

.bm-menu__all {
  display: block;
  margin-top: 8px;
  padding: 6px 8px;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}
</style>
