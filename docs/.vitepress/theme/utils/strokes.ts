import { ref } from 'vue'

/** Strichdaten aus KanjiVG: SVG-Pfade (viewBox 0 0 109 109) und Positionen der Strichnummern */
interface StrokeData {
  s: string[]
  n: [number, number][]
}

type StrokeTable = Record<string, StrokeData>
const tables: Partial<Record<'kanji' | 'kana', Promise<StrokeTable>>> = {}
const loadTable = (name: 'kanji' | 'kana') =>
  (tables[name] ??= (name === 'kana' ? import('../data/strokes-kana.json') : import('../data/strokes-kanji.json')).then(
    (m) => m.default as unknown as StrokeTable
  ))

export const CELL = 109

/** Ein oder mehrere Zeichen nebeneinander, jedes in einem eigenen 109er-Feld */
export interface Glyph {
  width: number
  strokes: { d: string; x: number }[]
  nums: [number, number][]
}

export async function loadGlyph(text: string): Promise<Glyph | null> {
  const chars = [...text]
  const needKana = chars.some((c) => /[\u3040-\u30ff]/.test(c))
  const needKanji = chars.some((c) => !/[\u3040-\u30ff]/.test(c))
  const none: StrokeTable = {}
  const [kana, kanji] = await Promise.all([needKana ? loadTable('kana') : none, needKanji ? loadTable('kanji') : none])
  const glyph: Glyph = { width: chars.length * CELL, strokes: [], nums: [] }
  for (const [i, c] of chars.entries()) {
    const data = kana[c] ?? kanji[c]
    if (!data) return null
    const x = i * CELL
    data.s.forEach((d) => glyph.strokes.push({ d, x }))
    data.n.forEach(([nx, ny]) => glyph.nums.push([nx + x, ny]))
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

export function strokeCountHint(drawn: number, expected: number) {
  if (drawn === expected) return `Du hast ${drawn} von ${expected} Strichen gezeichnet – die Anzahl stimmt.`
  return `Du hast ${drawn} Strich${drawn === 1 ? '' : 'e'} gezeichnet, richtig sind ${expected}. Vergleiche mit der Vorlage.`
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
