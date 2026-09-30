<script setup lang="ts">
import { computed } from 'vue'
import { CELL, type Glyph } from '../utils/strokes'
import { INNER_W, PAGE, blockStep, columns, rowsPerItem } from '../utils/sheets'

export interface SheetItem {
  text: string
  label: string
  sub?: string
  glyph: Glyph | null
}

const props = defineProps<{
  items: SheetItem[]
  size: number
  perPage: number
  trace: number
  title: string
  page: number
  pages: number
  idPrefix: string
}>()

const scale = computed(() => props.size / CELL)
// Strichnummern gedruckt etwa 2,3 mm hoch, in kleinen Feldern etwas kleiner, damit sie nicht alles verdecken
const numSize = computed(() => Math.min(18, Math.max(9, (2.3 * CELL) / props.size)))

const blocks = computed(() => {
  const S = props.size
  const rows = rowsPerItem(S, props.perPage)
  const cols = columns(S)
  const x = PAGE.margin + (INNER_W - cols * S) / 2
  const step = blockStep(props.perPage)
  return props.items.map((item, i) => {
    const span = [...item.text].length
    const cells = Math.max(1, Math.floor(cols / span))
    const cw = span * S
    const w = cells * cw
    const h = rows * S
    const y = PAGE.margin + PAGE.head + i * step + PAGE.label
    let frame = `M${x} ${y}h${w}v${h}h${-w}Z`
    for (let c = 1; c < cells; c++) frame += `M${x + c * cw} ${y}v${h}`
    for (let r = 1; r < rows; r++) frame += `M${x} ${y + r * S}h${w}`
    let guides = ''
    for (let k = 0; k < cells * span; k++) {
      guides += `M${x + (k + 0.5) * S} ${y}v${h}`
      if (k % span) guides += `M${x + k * S} ${y}v${h}`
    }
    for (let r = 0; r < rows; r++) guides += `M${x} ${y + (r + 0.5) * S}h${w}`
    const cellsX = Array.from({ length: Math.min(props.trace, cells - 1) + 1 }, (_, t) => x + t * cw)
    return { item, id: `${props.idPrefix}-${props.page}-${i}`, x, y, cw, frame, guides, cellsX }
  })
})
</script>

<template>
  <svg
    class="sheet-page"
    viewBox="0 0 210 297"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    :aria-label="`${title}, Seite ${page} von ${pages}`"
  >
    <rect width="210" height="297" fill="#fff" />
    <text :x="PAGE.margin" :y="PAGE.margin + 5" class="sp__title">{{ title }}</text>
    <text :x="PAGE.w - PAGE.margin" :y="PAGE.margin + 5" text-anchor="end" class="sp__page">{{ page }} / {{ pages }}</text>
    <defs>
      <template v-for="b in blocks" :key="b.id">
        <g v-if="b.item.glyph" :id="b.id">
          <path v-for="(s, n) in b.item.glyph.strokes" :key="n" :d="s.d" :transform="s.x ? `translate(${s.x} 0)` : undefined" />
        </g>
      </template>
    </defs>
    <g v-for="b in blocks" :key="b.id">
      <text :x="b.x" :y="b.y - 1.4" class="sp__label">
        <tspan class="sp__main">{{ b.item.label }}</tspan>
        <tspan v-if="b.item.sub" class="sp__sub" dx="2.5">{{ b.item.sub }}</tspan>
      </text>
      <path :d="b.guides" class="sp__guides" />
      <path :d="b.frame" class="sp__frame" />
      <template v-if="b.item.glyph">
        <g :transform="`translate(${b.x} ${b.y}) scale(${scale})`">
          <use :href="`#${b.id}`" class="sp__model" />
          <text v-for="([nx, ny], n) in b.item.glyph.nums" :key="n" :x="nx" :y="ny" :font-size="numSize" class="sp__num">{{ n + 1 }}</text>
        </g>
        <use
          v-for="tx in b.cellsX.slice(1)"
          :key="tx"
          :href="`#${b.id}`"
          :transform="`translate(${tx} ${b.y}) scale(${scale})`"
          class="sp__trace"
        />
      </template>
      <template v-else>
        <text
          v-for="(tx, t) in b.cellsX"
          :key="tx"
          :x="tx + b.cw / 2"
          :y="b.y + size / 2"
          :font-size="size * 0.75"
          text-anchor="middle"
          dominant-baseline="central"
          lang="ja"
          :class="t ? 'sp__trace-text' : 'sp__model-text'"
        >
          {{ b.item.text }}
        </text>
      </template>
    </g>
  </svg>
</template>

<style scoped>
.sheet-page { display: block; width: 100%; height: auto; }

.sheet-page text { font-family: 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', Meiryo, sans-serif; fill: #1b1b1f; }

.sp__title { font-size: 4.2px; font-weight: 700; }
.sheet-page .sp__page { font-size: 3.2px; fill: #6b6b6b; }
.sp__main { font-size: 3.3px; font-weight: 700; }
.sp__sub { font-size: 2.7px; fill: #6b6b6b; }

.sp__frame { fill: none; stroke: #8f8f8f; stroke-width: 0.25; }
.sp__guides { fill: none; stroke: #cfcfcf; stroke-width: 0.18; stroke-dasharray: 1 0.8; }

.sp__model,
.sp__trace { fill: none; stroke-linecap: round; stroke-linejoin: round; }
.sp__model { stroke: #1b1b1f; stroke-width: 3.2; }
.sp__trace { stroke: #c4c4c4; stroke-width: 3; }

.sheet-page .sp__num { fill: #c8372d; font-weight: 700; }
.sheet-page .sp__model-text { fill: #1b1b1f; }
.sheet-page .sp__trace-text { fill: #c4c4c4; }
</style>
