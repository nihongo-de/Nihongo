<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import {
  closePrintDialog,
  dialogOpen,
  groups,
  loading,
  printing,
  printSelection,
  type PrintPage
} from '../utils/printAll'

const panel = ref<HTMLElement>()
const expanded = ref(new Set<string>())

const pages = computed(() => groups.value.flatMap((g) => g.pages))
const selectedIn = (p: PrintPage) => p.sections.filter((s) => s.selected).length
const selectedCount = computed(() => pages.value.reduce((n, p) => n + selectedIn(p), 0))
const totalCount = computed(() => pages.value.reduce((n, p) => n + p.sections.length, 0))

const setPage = (p: PrintPage, on: boolean) => p.sections.forEach((s) => (s.selected = on))
const setAll = (on: boolean) => pages.value.forEach((p) => setPage(p, on))

function toggleExpanded(link: string) {
  const next = new Set(expanded.value)
  if (!next.delete(link)) next.add(link)
  expanded.value = next
}

const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closePrintDialog()

watch(dialogOpen, async (open) => {
  if (open) {
    window.addEventListener('keydown', onKey)
    await nextTick()
    panel.value?.focus()
  } else {
    window.removeEventListener('keydown', onKey)
  }
})
</script>

<template>
  <div v-if="pages.length" class="print-all-pages vp-doc">
    <section
      v-for="p in pages"
      :key="p.link"
      class="print-all-page"
      :data-link="p.link"
      :data-print-skip="!loading && selectedIn(p) === 0 ? '' : undefined"
    >
      <component :is="p.page" />
    </section>
  </div>

  <div v-if="dialogOpen" class="print-dialog" @click.self="closePrintDialog">
    <div
      ref="panel"
      class="print-dialog__panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="print-dialog-title"
      tabindex="-1"
    >
      <header class="print-dialog__head">
        <h2 id="print-dialog-title">Druckvorlage zusammenstellen</h2>
        <button type="button" class="print-dialog__close" aria-label="Schließen" @click="closePrintDialog">×</button>
      </header>

      <p v-if="loading" class="print-dialog__status">Seiten werden geladen …</p>
      <template v-else>
        <div class="print-dialog__bulk">
          <button type="button" @click="setAll(true)">Alle auswählen</button>
          <button type="button" @click="setAll(false)">Keine auswählen</button>
        </div>

        <div class="print-dialog__body">
          <section v-for="g in groups" :key="g.title" class="print-dialog__group">
            <h3>{{ g.title }}</h3>
            <div v-for="p in g.pages" :key="p.link" class="print-dialog__page">
              <div class="print-dialog__row">
                <label>
                  <input
                    type="checkbox"
                    :checked="selectedIn(p) === p.sections.length"
                    :indeterminate="selectedIn(p) > 0 && selectedIn(p) < p.sections.length"
                    @change="setPage(p, ($event.target as HTMLInputElement).checked)"
                  />
                  {{ p.title }}
                </label>
                <button
                  type="button"
                  class="print-dialog__expand"
                  :aria-expanded="expanded.has(p.link)"
                  :aria-label="`Abschnitte von ${p.title}`"
                  @click="toggleExpanded(p.link)"
                >
                  {{ selectedIn(p) }}/{{ p.sections.length }}
                  <span class="print-dialog__chevron" aria-hidden="true">▾</span>
                </button>
              </div>
              <ul v-if="expanded.has(p.link)" class="print-dialog__sections">
                <li v-for="s in p.sections" :key="s.key">
                  <label><input v-model="s.selected" type="checkbox" /> {{ s.title }}</label>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </template>

      <footer class="print-dialog__foot">
        <span class="print-dialog__count">{{ selectedCount }} von {{ totalCount }} Abschnitten</span>
        <button type="button" class="print-dialog__btn" @click="closePrintDialog">Schließen</button>
        <button
          type="button"
          class="print-dialog__btn is-primary"
          :disabled="loading || printing || !selectedCount"
          @click="printSelection"
        >
          {{ printing ? 'Wird vorbereitet …' : 'Drucken' }}
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.print-dialog {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.45);
}

.print-dialog__panel {
  display: flex;
  flex-direction: column;
  width: min(640px, 100%);
  max-height: min(760px, 100%);
  border-radius: var(--nh-radius);
  background: var(--vp-c-bg);
  box-shadow: var(--nh-shadow);
  outline: none;
}

.print-dialog__head,
.print-dialog__bulk,
.print-dialog__foot {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
}

.print-dialog__head { justify-content: space-between; border-bottom: 1px solid var(--vp-c-divider); }
.print-dialog__head h2 { margin: 0; font-size: 18px; font-weight: 600; }

.print-dialog__close {
  font-size: 24px;
  line-height: 1;
  color: var(--vp-c-text-2);
}

.print-dialog__close:hover { color: var(--vp-c-text-1); }

.print-dialog__status { padding: 24px 20px; color: var(--vp-c-text-2); }

.print-dialog__bulk { padding-bottom: 0; }
.print-dialog__bulk button {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.print-dialog__bulk button + button::before {
  content: '·';
  margin-right: 8px;
  color: var(--vp-c-text-3);
}

.print-dialog__body {
  overflow-y: auto;
  padding: 4px 20px 12px;
}

.print-dialog__group h3 {
  margin: 14px 0 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}

.print-dialog__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0;
}

.print-dialog label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.print-dialog input { accent-color: var(--vp-c-brand-1); }

.print-dialog__expand {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  white-space: nowrap;
}

.print-dialog__expand:hover { color: var(--vp-c-text-1); }
.print-dialog__chevron { transition: transform 0.2s; }
.print-dialog__expand[aria-expanded='true'] .print-dialog__chevron { transform: rotate(180deg); }

.print-dialog__sections {
  margin: 2px 0 8px 26px;
  padding: 0;
  list-style: none;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.print-dialog__sections li { padding: 2px 0; }

.print-dialog__foot {
  border-top: 1px solid var(--vp-c-divider);
}

.print-dialog__count {
  margin-right: auto;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.print-dialog__btn {
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid var(--vp-c-divider);
}

.print-dialog__btn.is-primary {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
}

.print-dialog__btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
