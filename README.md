# Nihongo 日本語

Eine kleine, kostenlose Lernhilfe für Japanisch – auf Deutsch, ohne Werbung, ohne Anmeldung.

**➜ [nihongo-de.github.io](https://nihongo-de.github.io/)**

## Inhalte

- **Start** – Japanisch auf einen Blick, Lerntipps, JLPT-Stufen im Vergleich zu A1–C2
- **Schrift** – Hiragana, Katakana, Kombinationen, Kanji-Grundlagen und alle Kanji von N5 bis N1 mit Strichfolge
- **Aussprache** – Laute, Moren und Tonhöhenakzent
- **Grammatik** – Satzbau, Partikel (inkl. Direktvergleiche), Verben, Adjektive, Höflichkeit
- **Wortschatz** – Zahlen, Zählwörter und Alltagsausdrücke
- **Übungen** – Kana-Quiz, N5-Kanji lesen, Kanji-Quiz (N5–N1), Partikel-Übungen, Schreibübungen, Druckvorlagen (Kana-/Kanji-Schreibblätter mit Strichfolge, Kanji-Vokabellisten)
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
npm run dev       # Entwicklungsserver: http://localhost:5173/
npm run build     # Produktions-Build nach docs/.vitepress/dist
npm run preview   # Build lokal testen (inkl. Service Worker/Offline)
npm run kanji     # N3–N1-Listen neu erzeugen (data/n{3,2,1}.json, deutsche Bedeutungen aus scripts/data/kanji-de.tsv)
npm run strokes   # Strichdaten von KanjiVG laden – nach neuen Kanji/Kana erneut ausführen
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
      ├─ data/              Lerndaten (Kana, Kanji N5–N1, Partikel, Strichdaten)
      ├─ utils/             Hilfsfunktionen (Ruby-Syntax, Druck)
      └─ custom.css
```

Ruby-Text (Furigana) wird in Daten und Komponenten als `漢字[かんじ]` geschrieben.

## Deployment

Jeder Push auf `main` baut die Seite per GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) und veröffentlicht sie auf GitHub Pages.

Einmalig in den Repository-Einstellungen: **Settings → Pages → Source: GitHub Actions**.

Der Basis-Pfad wird im Workflow automatisch von GitHub Pages übernommen (`/` für das Repository `nihongo-de.github.io`).

## Technik

[VitePress](https://vitepress.dev/) · [Vue 3](https://vuejs.org/) · [@vite-pwa/vitepress](https://vite-pwa-org.netlify.app/frameworks/vitepress) · [Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP) (via Fontsource)
