import { ref } from 'vue'

/** Strichdaten aus KanjiVG: SVG-Pfade (viewBox 0 0 109 109) und Positionen der Strichnummern */
interface StrokeData {
  s: string[]
  n: [number, number][]
}

type StrokeTable = Record<string, StrokeData>
// Kanji sind nach Codepunkt auf mehrere Dateien verteilt (siehe scripts/kanjivg.mjs)
const SHARDS = 16
const files = import.meta.glob<StrokeTable>('../data/strokes-*.json', { import: 'default' })
const tables: Record<string, Promise<StrokeTable>> = {}
const tableOf = (c: string) => (/[\u3040-\u30ff]/.test(c) ? 'kana' : `kanji-${(c.codePointAt(0)! % SHARDS).toString(16)}`)
const loadTable = (name: string) =>
  (tables[name] ??= files[`../data/strokes-${name}.json`]?.() ?? Promise.resolve({}))

export const CELL = 109

/** Ein oder mehrere Zeichen nebeneinander, jedes in einem eigenen 109er-Feld */
export interface Glyph {
  width: number
  strokes: { d: string; x: number }[]
  nums: [number, number][]
}

export async function loadGlyph(text: string): Promise<Glyph | null> {
  const chars = [...text]
  const data = await Promise.all(chars.map((c) => loadTable(tableOf(c)).then((t) => t[c])))
  const glyph: Glyph = { width: chars.length * CELL, strokes: [], nums: [] }
  for (const [i, d] of data.entries()) {
    if (!d) return null
    const x = i * CELL
    d.s.forEach((s) => glyph.strokes.push({ d: s, x }))
    d.n.forEach(([nx, ny]) => glyph.nums.push([nx + x, ny]))
  }
  return glyph
}

/** Rahmen und gestrichelte Mittellinien für jedes Zeichenfeld */
export function gridPaths(width: number) {
  let frame = `M0.5 0.5H${width - 0.5}V${CELL - 0.5}H0.5Z`
  let guides = `M0 ${CELL / 2}H${width}`
  for (let x = 0; x < width; x += CELL) {
    if (x) frame += `M${x} 0V${CELL}`
    guides += `M${x + CELL / 2} 0V${CELL}`
  }
  return { frame, guides }
}

export type Rating = 'again' | 'almost' | 'good'

export const ratingLabels: Record<Rating, string> = {
  again: 'Nochmal üben',
  almost: 'Fast richtig',
  good: 'Sitzt'
}

const KEY = 'nihongo:kanji-writing'
export const ratings = ref<Record<string, Rating>>({})
let loaded = false

export function loadRatings() {
  if (loaded) return
  loaded = true
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? '{}')
    if (saved && typeof saved === 'object') ratings.value = saved
  } catch {}
}

export function rate(k: string, r: Rating) {
  ratings.value = { ...ratings.value, [k]: r }
  try {
    localStorage.setItem(KEY, JSON.stringify(ratings.value))
  } catch {}
}
