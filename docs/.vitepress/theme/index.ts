import { h } from 'vue'
import { inBrowser, type Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import '@fontsource/noto-sans-jp/400.css'
import '@fontsource/noto-sans-jp/500.css'
import '@fontsource/noto-sans-jp/700.css'
import './custom.css'

import KanaChart from './components/KanaChart.vue'
import Ex from './components/Ex.vue'
import PitchAccent from './components/PitchAccent.vue'
import MoraSplit from './components/MoraSplit.vue'
import KanjiCard from './components/KanjiCard.vue'
import KanjiGrid from './components/KanjiGrid.vue'
import StrokeText from './components/StrokeText.vue'
import ReadingDrill from './components/ReadingDrill.vue'
import ParticleQuiz from './components/ParticleQuiz.vue'
import KanaQuiz from './components/KanaQuiz.vue'
import KanjiQuiz from './components/KanjiQuiz.vue'
import PrintSheets from './components/PrintSheets.vue'
import PrintAllButton from './components/PrintAllButton.vue'
import PrintDialog from './components/PrintDialog.vue'
import ProgressTracker from './components/ProgressTracker.vue'
import PageActions from './components/PageActions.vue'
import BookmarkMenu from './components/BookmarkMenu.vue'
import LearnDashboard from './components/LearnDashboard.vue'

// Zugeklappte Details-Blöcke beim Drucken aufklappen und danach wieder schließen
if (inBrowser) {
  let closed: HTMLDetailsElement[] = []
  window.addEventListener('beforeprint', () => {
    closed = Array.from(document.querySelectorAll<HTMLDetailsElement>('.vp-doc details:not([open])'))
    closed.forEach((d) => (d.open = true))
  })
  window.addEventListener('afterprint', () => {
    closed.forEach((d) => (d.open = false))
    closed = []
  })
}

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => [h(BookmarkMenu), h(PrintAllButton)],
      'doc-before': () => h(PageActions),
      'doc-footer-before': () => h(PageActions, { footer: true }),
      'layout-bottom': () => [h(PrintDialog), h(ProgressTracker)]
    }),
  enhanceApp({ app }) {
    app.component('KanaChart', KanaChart)
    app.component('Ex', Ex)
    app.component('PitchAccent', PitchAccent)
    app.component('MoraSplit', MoraSplit)
    app.component('KanjiCard', KanjiCard)
    app.component('KanjiGrid', KanjiGrid)
    app.component('StrokeText', StrokeText)
    app.component('ReadingDrill', ReadingDrill)
    app.component('ParticleQuiz', ParticleQuiz)
    app.component('KanaQuiz', KanaQuiz)
    app.component('KanjiQuiz', KanjiQuiz)
    app.component('PrintSheets', PrintSheets)
    app.component('LearnDashboard', LearnDashboard)
  }
} satisfies Theme
