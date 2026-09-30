<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import { initProgress, pathOf, pathOfHref, progress } from '../utils/progress'

const { page, frontmatter, site } = useData()
const route = useRoute()

const isDoc = () => !page.value.isNotFound && (frontmatter.value.layout ?? 'doc') === 'doc'

function recordVisit() {
  if (!isDoc()) return
  const path = pathOf(page.value.relativePath)
  progress.visited[path] = Date.now()
  if (progress.last?.path !== path) {
    progress.last = { path, title: page.value.title, hash: '', heading: '', time: Date.now() }
  } else {
    progress.last.time = Date.now()
  }
}

let frame = 0
function onScroll() {
  if (!frame) frame = requestAnimationFrame(recordHeading)
}

// Merkt sich die zuletzt überscrollte Überschrift als Wiedereinstiegspunkt
function recordHeading() {
  frame = 0
  const last = progress.last
  if (!isDoc() || !last || last.path !== pathOf(page.value.relativePath)) return
  let current: HTMLElement | null = null
  for (const h of document.querySelectorAll<HTMLElement>('.VPDoc .vp-doc :is(h2, h3)[id]')) {
    if (h.getBoundingClientRect().top > 160) break
    current = h
  }
  const hash = current?.id ?? ''
  if (hash === last.hash) return
  last.hash = hash
  last.heading = current?.textContent?.replace(/\u200b/g, '').trim() ?? ''
}

function markSidebar() {
  for (const a of document.querySelectorAll<HTMLAnchorElement>('.VPSidebar a.link[href]')) {
    const done = !!progress.done[pathOfHref(new URL(a.href).pathname, site.value.base)]
    if (done) a.dataset.done = ''
    else delete a.dataset.done
  }
}

watch(
  () => route.path,
  () => nextTick(() => {
    recordVisit()
    markSidebar()
  })
)
watch(() => Object.keys(progress.done).length, () => nextTick(markSidebar))

onMounted(() => {
  initProgress()
  recordVisit()
  markSidebar()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <span hidden />
</template>
