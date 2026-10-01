// Erzeugt Aufnahmen für alle Texte mit Vorlese-Knopf (Beispielsätze, Vokabeln, Kanji-Beispielwörter,
// Trainer-Lösungen) und für jedes Kana nach docs/public/audio. Sprachsynthese: Open JTalk mit der Stimme
// „Mei“ (CC BY 3.0, Nagoya Institute of Technology) über scripts/audio.py.
// Aufruf: npm run audio  (Python mit pyopenjtalk-plus, Standard: .venv/bin/python; --force erzeugt alles neu)
import { build } from 'esbuild'
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const root = new URL('../docs/', import.meta.url).pathname
const theme = join(root, '.vitepress/theme')
const out = join(root, 'public/audio')

const entry = `
export { kanaSets, toKatakana } from './data/kana'
export { vocabN5 } from './data/vocab'
export { n5Groups } from './data/n5'
export { n4Groups } from './data/n4'
export { decks } from './utils/trainers'
export { parseRuby } from './utils/ruby'
export { audioId, sampleSentence } from './utils/audio'
`
const bundle = await build({
  stdin: { contents: entry, resolveDir: theme, loader: 'ts' },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
  logLevel: 'warning'
})
const m = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`)

async function mdFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const nested = await Promise.all(
    entries
      .filter((e) => !e.name.startsWith('.') && e.name !== 'public')
      .map((e) => (e.isDirectory() ? mdFiles(join(dir, e.name)) : e.name.endsWith('.md') ? [join(dir, e.name)] : []))
  )
  return nested.flat()
}

// Text = genau das, was die Komponente an speak() übergibt; segments = Ruby-Lesungen zur Kontrolle der Aussprache
const jobs = new Map()
const byId = new Map()
function add(text, ruby = text) {
  text = text.trim()
  if (!text || jobs.has(text)) return
  const id = m.audioId(text)
  if (byId.has(id)) throw new Error(`Hash-Kollision: ${text} / ${byId.get(id)}`)
  byId.set(id, text)
  jobs.set(text, { id, file: `${id}.mp3`, text, segments: m.parseRuby(ruby).map((s) => [s.text, s.rt ?? null]) })
}
const unmark = (s) => s.replace(/[{}]/g, '')
const plain = (ruby) => m.parseRuby(ruby).map((s) => s.text).join('')

add(m.sampleSentence)
// Ex.vue
for (const file of await mdFiles(root)) {
  const md = await readFile(file, 'utf8')
  for (const [, jp] of md.matchAll(/<Ex\b[^>]*?\sjp="([^"]*)"/g)) add(plain(unmark(jp)), unmark(jp))
  for (const [, ex] of md.matchAll(/<KanjiCard\b[^>]*?\sex="([^"]*)"/g)) add(plain(ex), ex)
}
// KanjiCard.vue (über KanjiGrid)
for (const g of [...m.n5Groups, ...m.n4Groups]) for (const k of g.kanji) if (k.ex) add(plain(k.ex), k.ex)
// VocabList.vue
for (const t of m.vocabN5) for (const w of t.words) add(w.word.replace('〜', ''), w.jp.replace('〜', ''))
// FormTrainer.vue
for (const deck of Object.values(m.decks))
  for (const item of deck.items)
    for (const form of deck.forms) {
      const a = deck.answer(item, form.id)
      add(a.plain, a.ruby)
    }

// Kana (KanaChart.vue): eine Datei je Rōmaji, als Katakana gesprochen, damit z. B. は nicht als Partikel „wa“ gelesen wird;
// etwas langsamer, und ん gedehnt, weil es allein sonst kaum hörbar ist
const kana = new Map()
for (const set of Object.values(m.kanaSets))
  for (const row of set.rows)
    for (const cell of row)
      if (cell && !kana.has(cell[1]))
        kana.set(cell[1], { file: `kana/${cell[1]}.mp3`, text: cell[0] === 'ん' ? 'ンー' : m.toKatakana(cell[0]), speed: 0.8 })

const all = [...jobs.values(), ...kana.values()]
await mkdir(join(out, 'kana'), { recursive: true })
const jobFile = join(tmpdir(), 'nihongo-audio-jobs.json')
await writeFile(jobFile, JSON.stringify(all))

const venv = new URL('../.venv/bin/python', import.meta.url).pathname
const python = process.env.PYTHON || (existsSync(venv) ? venv : 'python3')
const args = [new URL('./audio.py', import.meta.url).pathname, jobFile, out, ...process.argv.slice(2)]
const res = spawnSync(python, args, { stdio: 'inherit' })
if (res.status !== 0) process.exit(res.status ?? 1)

// Verwaiste Dateien entfernen und Index schreiben (SpeakButton zeigt den Knopf auch ohne System-Stimme)
const keep = new Set(all.map((j) => j.file))
for (const dir of ['', 'kana/'])
  for (const f of await readdir(join(out, dir)))
    if (f.endsWith('.mp3') && !keep.has(dir + f)) await rm(join(out, dir, f))
const ids = [...jobs.values()].map((j) => j.id).sort()
await writeFile(join(out, 'index.json'), JSON.stringify(ids))
console.log(`${ids.length} Texte, ${kana.size} Kana → docs/public/audio`)
