// Erzeugt die Kanji-Listen für JLPT N3, N2 und N1 (docs/.vitepress/theme/data/n{3,2,1}.json).
// Quellen: kanji-data (KANJIDIC, CC BY-SA 4.0; JLPT-Stufen nach Jonathan Waller/tanos.co.uk, CC BY)
// und die deutschen Bedeutungen aus scripts/data/kanji-de.tsv. Aufruf: npm run kanji
// Mit --todo werden Kanji ohne deutsche Bedeutung als TSV (Kanji, Englisch) ausgegeben.
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const root = new URL('../', import.meta.url).pathname
const dataDir = join(root, 'docs/.vitepress/theme/data')
const SOURCE = 'https://raw.githubusercontent.com/davidluzgouveia/kanji-data/master/kanji.json'
const GROUP_SIZE = 50

const res = await fetch(SOURCE)
if (!res.ok) throw new Error(`kanji-data: HTTP ${res.status}`)
const all = await res.json()

// N5 und N4 werden von Hand gepflegt und kommen in den höheren Stufen nicht noch einmal vor
const known = new Set()
for (const file of ['n5.ts', 'n4.ts']) {
  const src = await readFile(join(dataDir, file), 'utf8')
  for (const m of src.matchAll(/^\s*(\p{Script=Han})\s*\|/gmu)) known.add(m[1])
}

const de = new Map()
const tsv = await readFile(join(root, 'scripts/data/kanji-de.tsv'), 'utf8')
for (const line of tsv.split('\n')) {
  const [k, meaning] = line.split('\t')
  if (k && meaning?.trim() && !k.startsWith('#')) de.set(k.trim(), meaning.trim())
}

const toKatakana = (s) => s.replace(/[\u3041-\u3096]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60))
const uniq = (list) => [...new Set(list)]

const onReadings = (list) =>
  uniq(list.filter((r) => !r.startsWith('-') && !r.endsWith('-')).map((r) => toKatakana(r))).slice(0, 3)

// か.つ → か(つ); Vor- und Nachsilben (-が.ち, また-) sind für Lernende nicht hilfreich
const kunReadings = (list) =>
  uniq(
    list
      .filter((r) => !r.startsWith('-') && !r.endsWith('-'))
      .map((r) => (r.includes('.') ? r.replace('.', '(') + ')' : r))
  ).slice(0, 3)

const todo = []
const english = (meanings) => meanings.slice(0, 3).join(', ').toLowerCase()

for (const level of [3, 2, 1]) {
  const list = Object.entries(all)
    .filter(([k, v]) => v.jlpt_new === level && !known.has(k))
    .sort(([, a], [, b]) => (a.freq ?? 1e5) - (b.freq ?? 1e5) || a.strokes - b.strokes)
    .map(([k, v]) => {
      if (!de.has(k)) todo.push(`${k}\t${english(v.meanings)}`)
      return {
        k,
        on: onReadings(v.readings_on).join('・') || '–',
        kun: kunReadings(v.readings_kun).join('・') || '–',
        de: de.get(k) ?? english(v.meanings),
        strokes: v.strokes
      }
    })

  const groups = []
  for (let i = 0; i < list.length; i += GROUP_SIZE) {
    const kanji = list.slice(i, i + GROUP_SIZE)
    groups.push({ id: `teil-${groups.length + 1}`, title: `Kanji ${i + 1}–${i + kanji.length}`, kanji })
  }
  const file = join(dataDir, `n${level}.json`)
  await writeFile(file, JSON.stringify({ groups }) + '\n')
  console.error(`N${level}: ${list.length} Kanji in ${groups.length} Gruppen → ${file}`)
}

if (todo.length) {
  console.error(`${todo.length} Kanji ohne deutsche Bedeutung (Englisch als Ersatz)`)
  if (process.argv.includes('--todo')) console.log(todo.join('\n'))
}
