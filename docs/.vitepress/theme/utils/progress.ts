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

interface State {
  visited: Record<string, number>
  done: Record<string, number>
  bookmarks: PageRef[]
  last: LastPosition | null
}

export const progress = reactive<State>({ visited: {}, done: {}, bookmarks: [], last: null })

// Erst nach der Hydration geladen, damit Server- und Client-HTML übereinstimmen
export const progressReady = ref(false)

const isRecord = (v: unknown): v is Record<string, number> => !!v && typeof v === 'object' && !Array.isArray(v)

function apply(s: Partial<State>) {
  progress.visited = isRecord(s.visited) ? s.visited : {}
  progress.done = isRecord(s.done) ? s.done : {}
  progress.bookmarks = Array.isArray(s.bookmarks) ? s.bookmarks.filter((b) => typeof b?.path === 'string') : []
  progress.last = s.last && typeof s.last.path === 'string' ? s.last : null
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
