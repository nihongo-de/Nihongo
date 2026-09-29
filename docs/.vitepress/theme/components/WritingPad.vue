<script setup lang="ts">
import { computed, ref } from 'vue'
import { CELL, gridPaths, type Glyph } from '../utils/strokes'

type Pt = [number, number]

const props = defineProps<{
  glyph: Glyph
  /** Blasse Vorlage unter dem Schreibfeld */
  guide?: boolean
  /** Vorlage mit Strichnummern einblenden und Zeichnen sperren */
  revealed?: boolean
  label: string
}>()
const strokes = defineModel<Pt[][]>({ required: true })

const pad = ref<SVGSVGElement>()
const drawing = ref<Pt[] | null>(null)
const grid = computed(() => gridPaths(props.glyph.width))
let pointerId: number | null = null

function toPt(e: PointerEvent): Pt {
  const r = pad.value!.getBoundingClientRect()
  const f = (v: number) => Math.round(v * 10) / 10
  return [f(((e.clientX - r.left) / r.width) * props.glyph.width), f(((e.clientY - r.top) / r.height) * CELL)]
}

function onDown(e: PointerEvent) {
  if (props.revealed || pointerId !== null || (e.pointerType === 'mouse' && e.button !== 0)) return
  e.preventDefault()
  pointerId = e.pointerId
  try {
    pad.value!.setPointerCapture(e.pointerId)
  } catch {}
  drawing.value = [toPt(e)]
}

function onMove(e: PointerEvent) {
  if (e.pointerId !== pointerId || !drawing.value) return
  const events = e.getCoalescedEvents?.() ?? []
  for (const ev of events.length ? events : [e]) {
    const p = toPt(ev)
    const q = drawing.value[drawing.value.length - 1]
    if (Math.hypot(p[0] - q[0], p[1] - q[1]) >= 0.6) drawing.value.push(p)
  }
}

function onUp(e: PointerEvent) {
  if (e.pointerId !== pointerId) return
  pointerId = null
  if (drawing.value) strokes.value = [...strokes.value, drawing.value]
  drawing.value = null
}

function toPath(pts: Pt[]) {
  const [x, y] = pts[0]
  if (pts.length === 1) return `M${x} ${y}l0.01 0`
  let d = `M${x} ${y}`
  for (let i = 1; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i]
    const [bx, by] = pts[i + 1]
    d += `Q${ax} ${ay} ${(ax + bx) / 2} ${(ay + by) / 2}`
  }
  const [lx, ly] = pts[pts.length - 1]
  return `${d}L${lx} ${ly}`
}

const shift = (x: number) => (x ? `translate(${x} 0)` : undefined)
</script>

<template>
  <svg
    ref="pad"
    class="wpad"
    :class="{ 'is-revealed': revealed }"
    :viewBox="`0 0 ${glyph.width} ${CELL}`"
    :style="{ aspectRatio: `${glyph.width} / ${CELL}`, maxWidth: `${(glyph.width / CELL) * (glyph.width > CELL ? 210 : 300)}px` }"
    role="img"
    :aria-label="label"
    @pointerdown="onDown"
    @pointermove="onMove"
    @pointerup="onUp"
    @pointercancel="onUp"
  >
    <path class="wpad__frame" :d="grid.frame" />
    <path class="wpad__guides" :d="grid.guides" />
    <g v-if="guide && !revealed" class="wpad__guide">
      <path v-for="(s, i) in glyph.strokes" :key="i" :d="s.d" :transform="shift(s.x)" />
    </g>
    <g v-if="revealed" class="wpad__ref">
      <path v-for="(s, i) in glyph.strokes" :key="i" :d="s.d" :transform="shift(s.x)" />
      <text v-for="([x, y], i) in glyph.nums" :key="`n${i}`" :x="x" :y="y">{{ i + 1 }}</text>
    </g>
    <g class="wpad__user">
      <path v-for="(pts, i) in strokes" :key="i" :d="toPath(pts)" />
      <path v-if="drawing" :d="toPath(drawing)" />
    </g>
    <g v-if="revealed" class="wpad__nums">
      <template v-for="(pts, i) in strokes" :key="i">
        <circle :cx="pts[0][0]" :cy="pts[0][1]" r="4.2" />
        <text :x="pts[0][0]" :y="pts[0][1]">{{ i + 1 }}</text>
      </template>
    </g>
  </svg>
</template>

<style scoped>
.wpad {
  display: block;
  width: 100%;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  cursor: crosshair;
}

.wpad.is-revealed { cursor: default; }

.wpad__frame,
.wpad__guides {
  stroke: var(--vp-c-divider);
  stroke-width: 1px;
  vector-effect: non-scaling-stroke;
}

.wpad__guides { stroke-dasharray: 4 4; }

.wpad__guide path { stroke: var(--vp-c-text-3); stroke-width: 3; opacity: 0.3; }
.wpad__user path { stroke: var(--vp-c-text-1); stroke-width: 4; }
.wpad__ref path { stroke: var(--vp-c-brand-1); stroke-width: 3; opacity: 0.45; }

.wpad__ref text {
  font-size: 8px;
  font-weight: 700;
  font-family: var(--vp-font-family-base);
  fill: var(--vp-c-brand-1);
  stroke: none;
}

.wpad__nums circle { fill: var(--nh-ai); stroke: none; }
.wpad__nums text {
  font-size: 6px;
  font-weight: 700;
  font-family: var(--vp-font-family-base);
  fill: #fff;
  stroke: none;
  text-anchor: middle;
  dominant-baseline: central;
}

.dark .wpad__nums text { fill: #1b1b1f; }
</style>
