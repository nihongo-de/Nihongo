<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { puzzleSets, puzzleSetTitles } from '../data/puzzles'
import { recordResult } from '../utils/progress'
import RubyText from './RubyText.vue'

const props = defineProps<{ set: string }>()

// Deterministisch mischen, damit Server- und Client-Rendering übereinstimmen
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

const items = computed(() =>
  (puzzleSets[props.set] ?? []).map((item, n) => {
    const solutions = [item.blocks.map((_, b) => b).join(','), ...item.alt.map((a) => [...a].join(','))]
    let order = item.blocks.map((_, b) => b).sort((a, b) => hash(item.blocks[a] + n) - hash(item.blocks[b] + n))
    for (let k = 0; k < order.length && solutions.includes(order.join(',')); k++) order = [...order.slice(1), order[0]]
    return { ...item, order, solutions }
  })
)

const placed = reactive<Record<number, number[]>>({})
const checked = reactive<Record<number, boolean>>({})
const answered = computed(() => Object.keys(checked).length)
const right = computed(() => Object.values(checked).filter(Boolean).length)

const line = (i: number) => placed[i] ?? []
const pool = (i: number) => items.value[i].order.filter((b) => !line(i).includes(b))
const sentence = (i: number, order: string) =>
  order.split(',').map((b) => items.value[i].blocks[Number(b)]).join('')
const others = (i: number) => {
  const given = line(i).join(',')
  return items.value[i].solutions.filter((s) => s !== given)
}

function toggle(i: number, b: number) {
  if (justDragged || checked[i] !== undefined) return
  const list = line(i)
  placed[i] = list.includes(b) ? list.filter((x) => x !== b) : [...list, b]
}

function shift(i: number, b: number, by: number) {
  const list = [...line(i)]
  const from = list.indexOf(b)
  const to = from + by
  if (checked[i] !== undefined || from < 0 || to < 0 || to >= list.length) return
  list.splice(from, 1)
  list.splice(to, 0, b)
  placed[i] = list
  nextTick(() => root.value?.querySelector<HTMLElement>(`[data-line="${i}"] [data-b="${b}"]`)?.focus())
}

function check(i: number) {
  checked[i] = items.value[i].solutions.includes(line(i).join(','))
}

function reset() {
  for (const key of Object.keys(placed)) delete placed[Number(key)]
  for (const key of Object.keys(checked)) delete checked[Number(key)]
}

watch(answered, (n) => {
  if (n && n === items.value.length)
    recordResult(
      `satzbau:${props.set}`,
      { path: `/uebungen/satzbau#${props.set}`, title: `Satzbau · ${puzzleSetTitles[props.set] ?? props.set}` },
      right.value,
      n
    )
})

// Ziehen mit Pointer-Events (Maus, Touch, Stift); ein Tippen ohne Bewegung zählt als Klick
interface Drag {
  i: number
  b: number
  sx: number
  sy: number
  x: number
  y: number
  dx: number
  dy: number
  active: boolean
}
const root = ref<HTMLElement>()
const drag = ref<Drag | null>(null)
let justDragged = false

function onDown(e: PointerEvent, i: number, b: number) {
  if (e.button !== 0 || checked[i] !== undefined) return
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  drag.value = { i, b, sx: e.clientX, sy: e.clientY, x: e.clientX, y: e.clientY, dx: e.clientX - r.left, dy: e.clientY - r.top, active: false }
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
  window.addEventListener('pointercancel', onUp)
}

function onMove(e: PointerEvent) {
  const d = drag.value
  if (!d || (!d.active && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 6)) return
  d.active = true
  d.x = e.clientX
  d.y = e.clientY
  dropAt(d)
}

function dropAt(d: Drag) {
  const lineEl = root.value?.querySelector<HTMLElement>(`[data-line="${d.i}"]`)
  const list = line(d.i).filter((b) => b !== d.b)
  const r = lineEl?.getBoundingClientRect()
  if (lineEl && r && d.x >= r.left - 16 && d.x <= r.right + 16 && d.y >= r.top - 24 && d.y <= r.bottom + 24) {
    const chips = [...lineEl.querySelectorAll<HTMLElement>('[data-b]')].filter((c) => Number(c.dataset.b) !== d.b)
    let at = chips.findIndex((c) => {
      const cr = c.getBoundingClientRect()
      return d.y < cr.top || (d.y <= cr.bottom && d.x < cr.left + cr.width / 2)
    })
    if (at < 0) at = list.length
    list.splice(at, 0, d.b)
  }
  if (list.join(',') !== line(d.i).join(',')) placed[d.i] = list
}

function onUp() {
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
  window.removeEventListener('pointercancel', onUp)
  if (drag.value?.active) {
    justDragged = true
    setTimeout(() => (justDragged = false))
  }
  drag.value = null
}

onBeforeUnmount(onUp)

const isDragged = (i: number, b: number) => drag.value?.active && drag.value.i === i && drag.value.b === b
</script>

<template>
  <div ref="root" class="spuz">
    <div class="spuz__bar">
      <span class="spuz__score">
        <strong>{{ right }}</strong> von {{ answered }} richtig · {{ items.length - answered }} offen
      </span>
      <button type="button" class="spuz__reset" :disabled="!answered && !Object.keys(placed).length" @click="reset">Neu starten</button>
    </div>
    <ol class="spuz__list">
      <li
        v-for="(item, i) in items"
        :key="i"
        :class="{ 'is-right': checked[i] === true, 'is-wrong': checked[i] === false }"
      >
        <p class="spuz__de">{{ item.de }}</p>
        <div class="spuz__line" :data-line="i" lang="ja" :aria-label="`Dein Satz ${i + 1}`">
          <button
            v-for="b in line(i)"
            :key="b"
            type="button"
            class="spuz__chip"
            :class="{ 'is-dragging': isDragged(i, b) }"
            :data-b="b"
            :disabled="checked[i] !== undefined"
            title="Zurücklegen (Pfeiltasten: verschieben)"
            @pointerdown="onDown($event, i, b)"
            @click="toggle(i, b)"
            @keydown.left.prevent="shift(i, b, -1)"
            @keydown.right.prevent="shift(i, b, 1)"
          >
            <RubyText :text="item.blocks[b]" />
          </button>
          <span v-if="!line(i).length" class="spuz__hint">Bausteine antippen oder hierher ziehen</span>
        </div>
        <div v-if="checked[i] === undefined" class="spuz__pool" lang="ja" role="group" :aria-label="`Bausteine für Satz ${i + 1}`">
          <button
            v-for="b in pool(i)"
            :key="b"
            type="button"
            class="spuz__chip"
            :class="{ 'is-dragging': isDragged(i, b) }"
            @pointerdown="onDown($event, i, b)"
            @click="toggle(i, b)"
          >
            <RubyText :text="item.blocks[b]" />
          </button>
          <button
            type="button"
            class="spuz__check"
            :disabled="line(i).length < item.blocks.length"
            @click="check(i)"
          >
            Prüfen
          </button>
        </div>
        <div v-else class="spuz__why">
          <p>
            <strong>{{ checked[i] ? 'Richtig!' : 'Nicht ganz.' }}</strong> {{ item.why }}
          </p>
          <p v-if="!checked[i]" class="spuz__solution" lang="ja">
            <span lang="de">Richtig:</span> <RubyText :text="sentence(i, item.solutions[0])" />
          </p>
          <p v-for="s in checked[i] ? others(i) : item.solutions.slice(1)" :key="s" class="spuz__solution" lang="ja">
            <span lang="de">Auch richtig:</span> <RubyText :text="sentence(i, s)" />
          </p>
        </div>
      </li>
    </ol>
    <div
      v-if="drag?.active"
      class="spuz__chip spuz__ghost"
      lang="ja"
      :style="{ left: `${drag.x - drag.dx}px`, top: `${drag.y - drag.dy}px` }"
    >
      <RubyText :text="items[drag.i].blocks[drag.b]" />
    </div>
  </div>
</template>

<style scoped>
.spuz {
  margin: 20px 0;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}

.spuz__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.spuz__score strong { font-size: 18px; color: var(--vp-c-brand-1); }

.spuz__reset,
.spuz__check {
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 999px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.spuz__check { margin-left: auto; }
.spuz__reset:disabled,
.spuz__check:disabled { opacity: 0.4; cursor: default; }

.vp-doc .spuz__list { margin: 0; padding-left: 1.6em; }

.vp-doc .spuz__list li {
  margin: 0;
  padding: 12px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.vp-doc .spuz__list li:last-child { border-bottom: none; }
.spuz__list li::marker { color: var(--vp-c-text-3); font-size: 14px; }

.spuz p { margin: 0; }

.spuz__de { font-size: 15px; color: var(--vp-c-text-1); }

.spuz__line,
.spuz__pool {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.spuz__line {
  min-height: 56px;
  padding: 8px;
  border: 2px dashed var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
}

.is-right .spuz__line { border-style: solid; border-color: var(--vp-c-green-1); }
.is-wrong .spuz__line { border-style: solid; border-color: var(--vp-c-red-1); }

.spuz__hint { font-size: 14px; color: var(--vp-c-text-3); }

.spuz__chip {
  padding: 2px 12px;
  font-size: 19px;
  line-height: 2;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: grab;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.spuz__line .spuz__chip { background: var(--vp-c-bg-soft); }
.spuz__chip:not(:disabled):hover { border-color: var(--vp-c-brand-1); transform: translateY(-1px); }
.spuz__chip:disabled { cursor: default; }
.spuz__chip.is-dragging { opacity: 0.35; }
.is-right .spuz__chip { border-color: var(--vp-c-green-1); }
.is-wrong .spuz__chip { border-color: var(--vp-c-red-1); }

.spuz__ghost {
  position: fixed;
  z-index: 100;
  pointer-events: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--vp-shadow-3);
  cursor: grabbing;
}

.spuz__why { margin-top: 8px; font-size: 14px; color: var(--vp-c-text-2); }
.is-right .spuz__why strong { color: var(--vp-c-green-1); }
.is-wrong .spuz__why strong { color: var(--vp-c-red-1); }
.spuz__solution { margin-top: 4px !important; font-size: 17px; line-height: 2; color: var(--vp-c-text-1); }
.spuz__solution span { font-size: 13px; color: var(--vp-c-text-2); }

@media print {
  .spuz__bar,
  .spuz__check,
  .spuz__hint { display: none; }
  .vp-doc .spuz__list li { break-inside: avoid; }
}
</style>
