import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'

// Set by the deploy workflow from GitHub Pages ("/" for nihongo-de.github.io, "/<repo>/" otherwise)
const base = process.env.BASE_PATH || '/'

export default withPwa(defineConfig({
  base,
  lang: 'de-DE',
  title: 'Nihongo',
  description: 'Japanisch lernen – Schrift, Aussprache, Partikel und Grammatik kompakt erklärt.',
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}logo.svg` }],
    ['link', { rel: 'apple-touch-icon', href: `${base}apple-touch-icon-180x180.png` }],
    ['meta', { name: 'theme-color', content: '#c8372d' }]
  ],

  pwa: {
    registerType: 'autoUpdate',
    injectRegister: 'script-defer',
    manifest: {
      name: 'Nihongo – Japanisch lernen',
      short_name: 'Nihongo',
      description: 'Japanisch lernen – Schrift, Aussprache, Partikel und Grammatik kompakt erklärt.',
      lang: 'de',
      start_url: base,
      scope: base,
      display: 'standalone',
      theme_color: '#c8372d',
      background_color: '#ffffff',
      icons: [
        { src: `${base}pwa-192x192.png`, sizes: '192x192', type: 'image/png' },
        { src: `${base}pwa-512x512.png`, sizes: '512x512', type: 'image/png' },
        { src: `${base}maskable-icon-512x512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    },
    workbox: {
      // Fonts are excluded here and cached on first use instead (~10 MB of Noto Sans JP subsets)
      globPatterns: ['**/*.{js,css,html,svg,png,ico,txt}'],
      // Kanji-Strichdaten (~2,3 MB) erst bei Bedarf laden und dann cachen
      globIgnores: ['**/strokes-kanji-*.js'],
      runtimeCaching: [
        {
          urlPattern: /\/strokes-kanji-[0-9a-f]\.[\w-]+\.js$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'strokes',
            expiration: { maxEntries: 32 },
            cacheableResponse: { statuses: [0, 200] }
          }
        },
        {
          urlPattern: /\.woff2?$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'fonts',
            expiration: { maxEntries: 800 },
            cacheableResponse: { statuses: [0, 200] }
          }
        }
      ]
    }
  },

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Start', link: '/start/' },
      { text: 'Schrift', link: '/schrift/hiragana' },
      { text: 'Aussprache', link: '/aussprache/grundlagen' },
      { text: 'Grammatik', link: '/grammatik/satzbau' },
      { text: 'Wortschatz', link: '/wortschatz/zahlen' },
      { text: 'Übungen', link: '/uebungen/kana' }
    ],

    sidebar: [
      {
        text: 'Start',
        items: [
          { text: 'Japanisch auf einen Blick', link: '/start/' },
          { text: 'Die 12 wichtigsten Lerntipps', link: '/start/lerntipps' },
          { text: 'JLPT & GER-Niveaus', link: '/start/jlpt' }
        ]
      },
      {
        text: 'Schrift',
        items: [
          { text: 'Hiragana ひらがな', link: '/schrift/hiragana' },
          { text: 'Katakana カタカナ', link: '/schrift/katakana' },
          { text: 'Kana-Kombinationen', link: '/schrift/kombinationen' },
          { text: 'Kanji 漢字', link: '/schrift/kanji' },
          { text: 'N5 Kanji', link: '/schrift/kanji-n5' },
          { text: 'N4 Kanji', link: '/schrift/kanji-n4' },
          { text: 'N3 Kanji', link: '/schrift/kanji-n3' },
          { text: 'N2 Kanji', link: '/schrift/kanji-n2' },
          { text: 'N1 Kanji', link: '/schrift/kanji-n1' }
        ]
      },
      {
        text: 'Aussprache',
        items: [
          { text: 'Laute & Mora', link: '/aussprache/grundlagen' },
          { text: 'Betonung (Tonhöhenakzent)', link: '/aussprache/betonung' }
        ]
      },
      {
        text: 'Grammatik',
        items: [
          { text: 'Satzbau', link: '/grammatik/satzbau' },
          { text: 'Partikel', link: '/grammatik/partikel' },
          { text: 'Partikel im Vergleich', link: '/grammatik/partikel-vergleiche' },
          { text: 'Verben', link: '/grammatik/verben' },
          { text: 'Adjektive', link: '/grammatik/adjektive' },
          { text: 'Höflichkeit & Keigo', link: '/grammatik/hoeflichkeit' }
        ]
      },
      {
        text: 'Wortschatz',
        items: [
          { text: 'Zahlen & Zählwörter', link: '/wortschatz/zahlen' },
          { text: 'Alltagsausdrücke', link: '/wortschatz/redewendungen' }
        ]
      },
      {
        text: 'Übungen',
        items: [
          { text: 'Kana-Quiz', link: '/uebungen/kana' },
          { text: 'N5-Kanji lesen', link: '/uebungen/kanji-n5' },
          { text: 'Kanji-Quiz', link: '/uebungen/kanji-quiz' },
          { text: 'Partikel-Übungen', link: '/uebungen/partikel' },
          { text: 'Druckvorlagen', link: '/uebungen/druckvorlagen' }
        ]
      }
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: 'Suchen', buttonAriaLabel: 'Suchen' },
          modal: {
            noResultsText: 'Keine Ergebnisse für',
            resetButtonTitle: 'Suche zurücksetzen',
            displayDetails: 'Details anzeigen',
            footer: { selectText: 'auswählen', navigateText: 'navigieren', closeText: 'schließen' }
          }
        }
      }
    },

    outline: { level: [2, 3], label: 'Auf dieser Seite' },
    docFooter: { prev: 'Zurück', next: 'Weiter' },
    darkModeSwitchLabel: 'Erscheinungsbild',
    lightModeSwitchTitle: 'Helles Design',
    darkModeSwitchTitle: 'Dunkles Design',
    sidebarMenuLabel: 'Menü',
    returnToTopLabel: 'Nach oben',

    footer: {
      message: 'Eine kleine Lernhilfe für Japanisch.',
      copyright: '頑張って！ – Gib dein Bestes!'
    }
  }
}))
