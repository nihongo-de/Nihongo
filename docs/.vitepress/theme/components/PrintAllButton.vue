<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import type { DefaultTheme } from 'vitepress/theme'
import { dialogOpen, openPrintDialog, type SidebarGroup } from '../utils/printAll'

const { theme } = useData<DefaultTheme.Config>()

const sidebar = computed<SidebarGroup[]>(() => {
  const s = theme.value.sidebar
  const groups: DefaultTheme.SidebarItem[] = Array.isArray(s) ? s : []
  const collect = (items: DefaultTheme.SidebarItem[]): SidebarGroup['links'] =>
    items.flatMap((item) => [
      ...(item.link ? [{ text: item.text ?? item.link, link: item.link }] : []),
      ...collect(item.items ?? [])
    ])
  return groups.map((g) => ({ text: g.text ?? '', links: collect(g.items ?? []) }))
})
</script>

<template>
  <button
    type="button"
    class="print-all-button"
    title="Seiten drucken"
    aria-label="Seiten drucken"
    aria-haspopup="dialog"
    :aria-expanded="dialogOpen"
    @click="openPrintDialog(sidebar)"
  >
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M6 9V2h12v7" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  </button>
</template>

<style scoped>
.print-all-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-left: 8px;
  color: var(--vp-c-text-2);
  transition: color 0.25s;
}

.print-all-button:hover { color: var(--vp-c-text-1); }
</style>
