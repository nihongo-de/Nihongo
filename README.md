# Nihongo 日本語

Eine kleine, kostenlose Lernhilfe für Japanisch – auf Deutsch, ohne Werbung, ohne Anmeldung.

**➜ [dominiquemartin94.github.io/Nihongo](https://dominiquemartin94.github.io/Nihongo/)**

## Inhalte

- **Schrift** – Hiragana, Katakana, Kombinationen, Kanji-Grundlagen und die 80 N5-Kanji
- **Aussprache** – Laute, Moren und Tonhöhenakzent
- **Grammatik** – Satzbau, Partikel (inkl. Direktvergleiche), Verben, Adjektive, Höflichkeit
- **Wortschatz** – Zahlen, Zählwörter und Alltagsausdrücke
- **Übungen** – Kana-Quiz, N5-Kanji lesen, Partikel-Übungen
- **Drucken** – alle Seiten als Lernskript ausdrucken

## Als App installieren

Die Seite ist eine Progressive Web App und funktioniert nach dem ersten Besuch auch offline.

- **Android (Chrome):** Menü ⋮ → „App installieren"
- **iPhone/iPad (Safari):** Teilen → „Zum Home-Bildschirm"
- **Desktop (Chrome/Edge):** Installations-Symbol in der Adressleiste

Updates werden automatisch geladen.

## Entwicklung

Voraussetzung: Node.js 22

```bash
npm install
npm run dev       # Entwicklungsserver: http://localhost:5173/Nihongo/
npm run build     # Produktions-Build nach docs/.vitepress/dist
npm run preview   # Build lokal testen (inkl. Service Worker/Offline)
```

Der Service Worker ist nur im Build aktiv, nicht im Entwicklungsserver.

## Projektstruktur

```
docs/
├─ index.md                 Startseite
├─ start/ schrift/ aussprache/ grammatik/ wortschatz/ uebungen/
├─ public/                  Logo und App-Icons
└─ .vitepress/
   ├─ config.mts            Navigation, Sidebar, PWA-Einstellungen
   └─ theme/
      ├─ components/        Vue-Komponenten (Quiz, Kana-Tabelle, Tonhöhe …)
      ├─ data/              Lerndaten (Kana, N5-Kanji, Partikel)
      ├─ utils/             Hilfsfunktionen (Ruby-Syntax, Druck)
      └─ custom.css
```

Ruby-Text (Furigana) wird in Daten und Komponenten als `漢字[かんじ]` geschrieben.

## Deployment

Jeder Push auf `main` baut die Seite per GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) und veröffentlicht sie auf GitHub Pages.

Einmalig in den Repository-Einstellungen: **Settings → Pages → Source: GitHub Actions**.

Der Basis-Pfad `/Nihongo/` ist in [docs/.vitepress/config.mts](docs/.vitepress/config.mts) festgelegt und muss angepasst werden, falls das Repository umbenannt wird.

## Technik

[VitePress](https://vitepress.dev/) · [Vue 3](https://vuejs.org/) · [@vite-pwa/vitepress](https://vite-pwa-org.netlify.app/frameworks/vitepress) · [Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP) (via Fontsource)
