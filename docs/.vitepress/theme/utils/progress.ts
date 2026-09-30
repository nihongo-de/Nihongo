import { reactive, ref, watch } from 'vue'

const KEY = 'nihongo:progress'

export interface PageRef {
  path: string
  title: string
}

export interface LastPosition extends PageRef {
  hash: string
  heading: string
  time: number
}

export interface QuizResult extends PageRef {
  runs: number
  /** Letzter Durchgang: auf Anhieb richtig / gesamt */
  score: number
  total: number
  /** Bestes Ergebnis in Prozent */
  best: number
  time: number
}

interface State {
  visited: Record<string, number>
  done: Record<string, number>
  bookmarks: PageRef[]
  last: LastPosition | null
  results: Record<string, QuizResult>
}

export const progress = reactive<State>({ visited: {}, done: {}, bookmarks: [], last: null, results: {} })

// Erst nach der Hydration geladen, damit Server- und Client-HTML übereinstimmen
export const progressReady = ref(false)

const isRecord = (v: unknown): v is Record<string, number> => !!v && typeof v === 'object' && !Array.isArray(v)

function apply(s: Partial<State>) {
  progress.visited = isRecord(s.visited) ? s.visited : {}
  progress.done = isRecord(s.done) ? s.done : {}
  progress.bookmarks = Array.isArray(s.bookmarks) ? s.bookmarks.filter((b) => typeof b?.path === 'string') : []
  progress.last = s.last && typeof s.last.path === 'string' ? s.last : null
  progress.results = s.results && typeof s.results === 'object' && !Array.isArray(s.results) ? s.results : {}
}

function read(): Partial<State> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') ?? {}
  } catch {
    return {}
  }
}

export function initProgress() {
  if (progressReady.value) return
  apply(read())
  progressReady.value = true
  watch(progress, () => localStorage.setItem(KEY, JSON.stringify(progress)), { deep: true })
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) apply(read())
  })
}

/** 'grammatik/verben.md' → '/grammatik/verben', 'start/index.md' → '/start/' (wie die Links in der Sidebar) */
export function pathOf(relativePath: string) {
  return '/' + relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
}

/** Pfadname einer URL ohne Base und .html – vergleichbar mit pathOf() */
export function pathOfHref(pathname: string, base: string) {
  const p = pathname.startsWith(base) ? pathname.slice(base.length - 1) : pathname
  return p.replace(/\.html$/, '').replace(/\/index$/, '/')
}

export const isBookmarked = (path: string) => progress.bookmarks.some((b) => b.path === path)

export function toggleBookmark(page: PageRef) {
  if (isBookmarked(page.path)) removeBookmark(page.path)
  else progress.bookmarks.push({ path: page.path, title: page.title })
}

export function removeBookmark(path: string) {
  progress.bookmarks = progress.bookmarks.filter((b) => b.path !== path)
}

export function toggleDone(path: string) {
  if (progress.done[path]) delete progress.done[path]
  else progress.done[path] = Date.now()
}

export function resetProgress() {
  apply({})
}

/** Speichert das Ergebnis eines Übungsdurchgangs (id z. B. 'kana:type', 'partikel:ort') */
export function recordResult(id: string, page: PageRef, score: number, total: number) {
  if (!total) return
  const prev = progress.results[id]
  const pct = Math.round((score / total) * 100)
  progress.results[id] = {
    path: page.path,
    title: page.title,
    runs: (prev?.runs ?? 0) + 1,
    score,
    total,
    best: Math.max(prev?.best ?? 0, pct),
    time: Date.now()
  }
}

/* Sichern & Wiederherstellen aller lokal gespeicherten Daten (Fortschritt, Auswahl, Schreibbewertungen …) */
const PREFIX = 'nihongo:'
const VALID_KEY = /^nihongo:[a-z0-9-]+$/
const MAX_IMPORT = 5 * 1024 * 1024

export function exportData() {
  const data: Record<string, string> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && VALID_KEY.test(key)) data[key] = localStorage.getItem(key) ?? ''
  }
  return { app: 'nihongo', version: 1, exported: new Date().toISOString(), data }
}

export function downloadBackup() {
  const blob = new Blob([JSON.stringify(exportData(), null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `nihongo-fortschritt-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

/** Liest eine Sicherung ein und ersetzt alle bisherigen Daten. Wirft bei ungültigen Dateien. */
export async function importBackup(file: File) {
  if (file.size > MAX_IMPORT) throw new Error('Die Datei ist zu groß.')
  let parsed: unknown
  try {
    parsed = JSON.parse(await file.text())
  } catch {
    throw new Error('Die Datei ist keine gültige Sicherung.')
  }
  const data = (parsed as { app?: unknown; data?: unknown })?.data
  if ((parsed as { app?: unknown })?.app !== 'nihongo' || !data || typeof data !== 'object' || Array.isArray(data))
    throw new Error('Die Datei ist keine Nihongo-Sicherung.')
  const entries = Object.entries(data).filter(([k, v]) => VALID_KEY.test(k) && typeof v === 'string')
  if (!entries.length) throw new Error('Die Sicherung enthält keine Daten.')

  const old = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i)).filter((k): k is string => !!k?.startsWith(PREFIX))
  old.forEach((k) => localStorage.removeItem(k))
  entries.forEach(([k, v]) => localStorage.setItem(k, v as string))
  apply(read())
}
