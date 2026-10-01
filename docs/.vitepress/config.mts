import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'
import { rm } from 'node:fs/promises'
import { join } from 'node:path'
import { AUDIO_ENABLED } from './theme/utils/audio'

// Set by the deploy workflow from GitHub Pages ("/" for nihongo-de.github.io, "/<repo>/" otherwise)
const base = process.env.BASE_PATH || '/'

// Alle Seiten einmal definiert; Navigationsleiste (nach Rubrik) und Lernpfad (nach JLPT) greifen darauf zu
const p = {
  ueberblick: { text: 'Japanisch auf einen Blick', link: '/start/' },
  lerntipps: { text: 'Die 12 wichtigsten Lerntipps', link: '/start/lerntipps' },
  jlpt: { text: 'JLPT & GER-Niveaus', link: '/start/jlpt' },
  hiragana: { text: 'Hiragana ひらがな', link: '/schrift/hiragana' },
  katakana: { text: 'Katakana カタカナ', link: '/schrift/katakana' },
  kombinationen: { text: 'Kana-Kombinationen', link: '/schrift/kombinationen' },
  satzzeichen: { text: 'Satzzeichen & Schreibregeln', link: '/schrift/satzzeichen' },
  tippen: { text: 'Japanisch tippen', link: '/schrift/tippen' },
  kanji: { text: 'Kanji 漢字', link: '/schrift/kanji' },
  kanjiN5: { text: 'N5 Kanji', link: '/schrift/kanji-n5' },
  kanjiN4: { text: 'N4 Kanji', link: '/schrift/kanji-n4' },
  kanjiN3: { text: 'N3 Kanji', link: '/schrift/kanji-n3' },
  kanjiN2: { text: 'N2 Kanji', link: '/schrift/kanji-n2' },
  kanjiN1: { text: 'N1 Kanji', link: '/schrift/kanji-n1' },
  laute: { text: 'Laute & Mora', link: '/aussprache/grundlagen' },
  betonung: { text: 'Betonung (Tonhöhenakzent)', link: '/aussprache/betonung' },
  satzbau: { text: 'Satzbau', link: '/grammatik/satzbau' },
  partikel: { text: 'Partikel', link: '/grammatik/partikel' },
  partikelVergleiche: { text: 'Partikel im Vergleich', link: '/grammatik/partikel-vergleiche' },
  fragewoerter: { text: 'Fragewörter & こそあど', link: '/grammatik/fragewoerter' },
  existenz: { text: 'Existenz – ある & いる', link: '/grammatik/existenz' },
  verben: { text: 'Verben', link: '/grammatik/verben' },
  adjektive: { text: 'Adjektive', link: '/grammatik/adjektive' },
  verneinung: { text: 'Verneinung', link: '/grammatik/verneinung' },
  zeitformen: { text: 'Zeitformen & Aspekt', link: '/grammatik/zeitformen' },
  konjunktionen: { text: 'Sätze verbinden', link: '/grammatik/konjunktionen' },
  bitten: { text: 'Bitten, Wünsche & Vorschläge', link: '/grammatik/bitten' },
  erlaubnis: { text: 'Dürfen, müssen, nicht dürfen', link: '/grammatik/erlaubnis' },
  vergleiche: { text: 'Vergleiche', link: '/grammatik/vergleiche' },
  adverbien: { text: 'Adverbien & Häufigkeit', link: '/grammatik/adverbien' },
  vermutung: { text: 'Vermutung – でしょう', link: '/grammatik/vermutung' },
  hoeflichkeit: { text: 'Höflichkeit & Keigo', link: '/grammatik/hoeflichkeit' },
  zahlen: { text: 'Zahlen & Zählwörter', link: '/wortschatz/zahlen' },
  zeit: { text: 'Zeitangaben', link: '/wortschatz/zeit' },
  themen: { text: 'Wortschatz nach Themen', link: '/wortschatz/themen' },
  namen: { text: 'Deutsche Namen in Katakana', link: '/wortschatz/namen' },
  redewendungen: { text: 'Alltagsausdrücke', link: '/wortschatz/redewendungen' },
  kanaQuiz: { text: 'Kana-Quiz', link: '/uebungen/kana' },
  kanjiN5Lesen: { text: 'N5-Kanji lesen', link: '/uebungen/kanji-n5' },
  kanjiQuiz: { text: 'Kanji-Quiz', link: '/uebungen/kanji-quiz' },
  partikelUebungen: { text: 'Partikel-Übungen', link: '/uebungen/partikel' },
  konjugation: { text: 'Konjugationstrainer', link: '/uebungen/konjugation' },
  adjektivTrainer: { text: 'Adjektiv-Trainer', link: '/uebungen/adjektive' },
  druckvorlagen: { text: 'Druckvorlagen', link: '/uebungen/druckvorlagen' }
}

export default withPwa(defineConfig({
  base,
  lang: 'de-DE',
  title: 'Nihongo',
  description: 'Japanisch lernen – Schrift, Aussprache, Partikel und Grammatik kompakt erklärt.',
  cleanUrls: true,
  // Aufnahmen aus public/audio nicht ausliefern, solange das Vorlesen aus ist (läuft vor der Service-Worker-Erzeugung)
  async buildEnd({ outDir }) {
    if (!AUDIO_ENABLED) await rm(join(outDir, 'audio'), { recursive: true, force: true })
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}logo.svg` }],
    ['link', { rel: 'apple-touch-icon', href: `${base}apple-touch-icon-180x180.png` }],
    ['meta', { name: 'theme-color', content: '#c8372d' }],
    // Anzeige-Einstellungen vor dem ersten Rendern anwenden (siehe utils/settings.ts)
    [
      'script',
      {},
      "try{var s=JSON.parse(localStorage.getItem('nihongo:settings')||'{}'),c=document.documentElement.classList;if(s.furigana===false)c.add('no-furigana');if(s.romaji===false)c.add('no-romaji')}catch(e){}"
    ]
  ],

  pwa: {
    // Registrierung, Update-Hinweis und periodische Prüfung in theme/components/ReloadPrompt.vue
    registerType: 'prompt',
    injectRegister: false,
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
      globPatterns: ['**/*.{js,css,html,svg,png,ico,txt}', ...(AUDIO_ENABLED ? ['audio/index.json'] : [])],
      // Kanji-Strichdaten (~2,3 MB) erst bei Bedarf laden und dann cachen
      globIgnores: ['**/strokes-kanji-*.js'],
      runtimeCaching: [
        {
          // Aufnahmen (~9 MB) erst beim Abspielen; <audio> fragt mit Range-Header an
          urlPattern: /\/audio\/.+\.mp3$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'audio',
            rangeRequests: true,
            expiration: { maxEntries: 2000 },
            cacheableResponse: { statuses: [0, 200] }
          }
        },
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
      { text: 'Start', activeMatch: '^/start/', items: [p.ueberblick, p.lerntipps, p.jlpt] },
      {
        text: 'Schrift',
        activeMatch: '^/schrift/',
        items: [
          { text: 'Kana', items: [p.hiragana, p.katakana, p.kombinationen] },
          { text: 'Praxis', items: [p.satzzeichen, p.tippen] },
          { text: 'Kanji', items: [p.kanji, p.kanjiN5, p.kanjiN4, p.kanjiN3, p.kanjiN2, p.kanjiN1] }
        ]
      },
      { text: 'Aussprache', activeMatch: '^/aussprache/', items: [p.laute, p.betonung] },
      {
        text: 'Grammatik',
        activeMatch: '^/grammatik/',
        items: [p.satzbau, p.partikel, p.partikelVergleiche, p.fragewoerter, p.existenz, p.verben, p.adjektive, p.verneinung, p.zeitformen, p.konjunktionen, p.bitten, p.erlaubnis, p.vergleiche, p.adverbien, p.vermutung, p.hoeflichkeit]
      },
      { text: 'Wortschatz', activeMatch: '^/wortschatz/', items: [p.zahlen, p.zeit, p.themen, p.namen, p.redewendungen] },
      {
        text: 'Übungen',
        activeMatch: '^/uebungen/',
        items: [
          { text: 'Quiz', items: [p.kanaQuiz, p.kanjiN5Lesen, p.kanjiQuiz, p.partikelUebungen] },
          { text: 'Trainer', items: [p.konjugation, p.adjektivTrainer] },
          { text: 'Zum Ausdrucken', items: [p.druckvorlagen] }
        ]
      }
    ],

    // Lernpfad: alles, was man für eine JLPT-Stufe kennen sollte, mit anschließenden Übungen
    sidebar: [
      { text: 'Erste Schritte', collapsed: false, items: [p.ueberblick, p.lerntipps, p.jlpt] },
      {
        text: 'N5 – Einstieg',
        collapsed: false,
        items: [
          { text: 'Schrift & Laute', items: [p.hiragana, p.laute, p.katakana, p.kombinationen, p.betonung, p.satzzeichen, p.tippen] },
          { text: 'Kanji', items: [p.kanji, p.kanjiN5] },
          { text: 'Grammatik', items: [p.satzbau, p.partikel, p.partikelVergleiche, p.fragewoerter, p.existenz, p.verben, p.adjektive, p.verneinung, p.zeitformen, p.konjunktionen, p.bitten, p.erlaubnis, p.vergleiche, p.adverbien, p.vermutung] },
          { text: 'Wortschatz', items: [p.zahlen, p.zeit, p.themen, p.namen, p.redewendungen] },
          { text: 'Übungen', items: [p.kanaQuiz, p.kanjiN5Lesen, p.kanjiQuiz, p.partikelUebungen, p.konjugation, p.adjektivTrainer] }
        ]
      },
      {
        text: 'N4 – Grundstufe',
        collapsed: true,
        items: [
          { text: 'Kanji', items: [p.kanjiN4] },
          { text: 'Grammatik', items: [p.hoeflichkeit] }
        ]
      },
      { text: 'N3 – Mittelstufe', collapsed: true, items: [{ text: 'Kanji', items: [p.kanjiN3] }] },
      { text: 'N2 – Fortgeschritten', collapsed: true, items: [{ text: 'Kanji', items: [p.kanjiN2] }] },
      { text: 'N1 – Experte', collapsed: true, items: [{ text: 'Kanji', items: [p.kanjiN1] }] },
      { text: 'Werkzeuge', collapsed: true, items: [p.druckvorlagen] }
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
