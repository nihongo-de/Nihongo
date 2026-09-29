// Lädt die Strichdaten aller verwendeten Kanji und Kana von KanjiVG (CC BY-SA 3.0) und schreibt sie nach
// docs/.vitepress/theme/data/strokes-{kanji,kana}.json. Aufruf: npm run strokes
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const root = new URL('../docs/', import.meta.url).pathname
const out = join(root, '.vitepress/theme/data')
const src = 'https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/'

async function mdFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const nested = await Promise.all(
    entries
      .filter((e) => !e.name.startsWith('.'))
      .map((e) => (e.isDirectory() ? mdFiles(join(dir, e.name)) : e.name.endsWith('.md') ? [join(dir, e.name)] : []))
  )
  return nested.flat()
}

const chars = new Set()
for (const file of ['n5.ts', 'n4.ts']) {
  const src = await readFile(join(root, '.vitepress/theme/data', file), 'utf8')
  for (const m of src.matchAll(/^\s*(\p{Script=Han})\s*\|/gmu)) chars.add(m[1])
}
for (const file of await mdFiles(root)) {
  const md = await readFile(file, 'utf8')
  for (const m of md.matchAll(/<KanjiCard\b[^>]*\bk="(\p{Script=Han})"/gu)) chars.add(m[1])
}
// Alle Kana aus den Tabellen, jeweils als Hiragana und Katakana
const kana = await readFile(join(root, '.vitepress/theme/data/kana.ts'), 'utf8')
for (const [c] of kana.matchAll(/[\u3041-\u3096\u30a1-\u30f6]/g)) {
  const code = c.codePointAt(0)
  chars.add(c)
  const other = code < 0x30a0 ? code + 0x60 : code - 0x60
  if ((other >= 0x3041 && other <= 0x3096) || (other >= 0x30a1 && other <= 0x30f6)) chars.add(String.fromCodePoint(other))
}

const data = { kanji: {}, kana: {} }
const missing = []

async function fetchChar(k) {
  const hex = k.codePointAt(0).toString(16).padStart(5, '0')
  const res = await fetch(`${src}${hex}.svg`)
  if (res.status === 404) return missing.push(k)
  if (!res.ok) throw new Error(`${k} (${hex}): HTTP ${res.status}`)
  const svg = await res.text()

  const strokes = [...svg.matchAll(/<path\b[^>]*\bid="kvg:[0-9a-f]+-s(\d+)"[^>]*\bd="([^"]+)"/g)]
    .map((m) => [Number(m[1]), m[2]])
    .sort((a, b) => a[0] - b[0])
    .map(([, d]) => d)
  const numbers = [...svg.matchAll(/<text transform="matrix\(1 0 0 1 ([\d.]+) ([\d.]+)\)">\d+<\/text>/g)].map((m) => [
    Number(m[1]),
    Number(m[2])
  ])
  if (!strokes.length || strokes.length !== numbers.length) throw new Error(`${k}: unerwartetes SVG-Format`)
  data[/\p{Script=Han}/u.test(k) ? 'kanji' : 'kana'][k] = { s: strokes, n: numbers }
}

const queue = [...chars].sort()
await Promise.all(Array.from({ length: 8 }, async () => {
  while (queue.length) await fetchChar(queue.shift())
}))

for (const [name, entries] of Object.entries(data)) {
  const sorted = Object.fromEntries(Object.entries(entries).sort(([a], [b]) => (a < b ? -1 : 1)))
  const file = join(out, `strokes-${name}.json`)
  await writeFile(file, JSON.stringify(sorted) + '\n')
  console.log(`${Object.keys(sorted).length} Zeichen → ${file}`)
}
if (missing.length) console.log(`Nicht in KanjiVG: ${missing.join(' ')}`)
