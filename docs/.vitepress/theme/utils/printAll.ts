import { markRaw, nextTick, ref, type Component } from 'vue'

export interface PrintSection { key: string; title: string; selected: boolean }
export interface PrintPage { link: string; title: string; page: Component; sections: PrintSection[] }
export interface PrintGroup { title: string; pages: PrintPage[] }
export interface SidebarGroup { text: string; links: { text: string; link: string }[] }

const modules = import.meta.glob<{ default: Component }>('../../../**/*.md')
const STORAGE_KEY = 'nihongo:print-skip'

export const dialogOpen = ref(false)
export const loading = ref(false)
export const printing = ref(false)
export const groups = ref<PrintGroup[]>([])

const toFile = (link: string) =>
  `../../../${link.replace(/^\//, '')}${link.endsWith('/') ? 'index' : ''}.md`

const allPages = () => groups.value.flatMap((g) => g.pages)

function loadSkipped(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'))
  } catch {
    return new Set()
  }
}

function saveSkipped() {
  const skipped = allPages().flatMap((p) => p.sections.filter((s) => !s.selected).map((s) => s.key))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(skipped))
}

function headingText(el: Element) {
  const clone = el.cloneNode(true) as Element
  clone.querySelectorAll('.header-anchor').forEach((a) => a.remove())
  return clone.textContent?.trim() ?? ''
}

const pageRoot = (link: string) =>
  document.querySelector(`.print-all-page[data-link="${link}"]`)?.firstElementChild

// Teilt eine gerenderte Seite an ihren h2-Überschriften in Abschnitte auf; h1 gehört zu keinem Abschnitt.
function readBlocks(link: string) {
  const root = pageRoot(link)
  const blocks: { key: string; title: string; els: Element[] }[] = []
  let current = { key: `${link}#intro`, title: 'Einleitung', els: [] as Element[] }
  for (const el of Array.from(root?.children ?? [])) {
    if (el.tagName === 'H1') continue
    if (el.tagName === 'H2') {
      if (current.els.length) blocks.push(current)
      current = { key: `${link}#${el.id}`, title: headingText(el), els: [] }
    }
    current.els.push(el)
  }
  if (current.els.length) blocks.push(current)
  return blocks
}

// Firefox kennt kein break-after: avoid – daher Überschrift samt folgendem Inhalt (bis zum ersten Nicht-Absatz) umschließen
function wrapHeadings(root: Element) {
  for (const heading of Array.from(root.querySelectorAll(':scope > :is(h2, h3)'))) {
    if (heading.parentElement !== root) continue
    const group = [heading]
    let next = heading.nextElementSibling
    while (next && group.length < 5) {
      group.push(next)
      if (!/^(P|H2|H3)$/.test(next.tagName)) break
      next = next.nextElementSibling
    }
    const wrapper = document.createElement('div')
    wrapper.className = 'print-keep'
    heading.before(wrapper)
    wrapper.append(...group)
  }
}

function unwrapHeadings(root: Element) {
  root.querySelectorAll(':scope > .print-keep').forEach((w) => w.replaceWith(...Array.from(w.childNodes)))
}

export async function openPrintDialog(sidebar: SidebarGroup[]) {
  if (dialogOpen.value) return
  dialogOpen.value = true
  loading.value = true
  groups.value = await Promise.all(
    sidebar.map(async (g) => ({
      title: g.text,
      pages: await Promise.all(
        g.links
          .filter((l) => modules[toFile(l.link)])
          .map(async (l) => ({
            link: l.link,
            title: l.text,
            page: markRaw((await modules[toFile(l.link)]()).default),
            sections: []
          }))
      )
    }))
  )
  await nextTick()
  const skipped = loadSkipped()
  for (const page of allPages()) {
    page.sections = readBlocks(page.link).map((b) => ({ key: b.key, title: b.title, selected: !skipped.has(b.key) }))
  }
  loading.value = false
}

export function closePrintDialog() {
  if (!loading.value) saveSkipped()
  dialogOpen.value = false
  groups.value = []
}

export async function printSelection() {
  if (printing.value) return
  printing.value = true
  saveSkipped()
  for (const page of allPages()) {
    const selected = new Set(page.sections.filter((s) => s.selected).map((s) => s.key))
    for (const block of readBlocks(page.link)) {
      block.els.forEach((el) => el.toggleAttribute('data-print-skip', !selected.has(block.key)))
    }
  }
  const roots = allPages().map((p) => pageRoot(p.link)).filter((r): r is Element => !!r)
  roots.forEach(wrapHeadings)
  document.documentElement.classList.add('print-all')
  await nextTick()
  await document.fonts.ready

  window.addEventListener(
    'afterprint',
    () => {
      document.documentElement.classList.remove('print-all')
      roots.forEach(unwrapHeadings)
      printing.value = false
    },
    { once: true }
  )
  window.print()
}
