# Nihongo – Konzept

Eine kleine, moderne Lern-Website für Japanisch auf Basis von Markdown-Dateien.
Ziel: die **wichtigsten Regeln, Muster und Stolperfallen** kompakt, visuell und gut
navigierbar aufbereiten, nicht als endlose Tabellen, sondern als Karten, Diagramme und Beispielsätze.

---

## 1. Zielgruppe

- Deutschsprachige Anfänger bis frühe Mittelstufe (ca. JLPT N5–N4)
- Selbstlerner, die ein **Nachschlagewerk** neben Anki, Apps oder Kursen suchen
- Lernende, die das *Warum* hinter Regeln verstehen wollen (Mora, Tonhöhe, Partikel)

## 2. Inhaltliche Leitlinien

| Prinzip | Umsetzung |
| --- | --- |
| **Regel → Beispiel → Falle** | Jede Regel hat mindestens ein Beispiel und, wo sinnvoll, einen Hinweis auf typische Fehler. |
| **Kontext statt Liste** | Vokabeln erscheinen in Sätzen, Partikel werden farbig markiert. |
| **Deutsch als Brücke** | Vergleiche mit deutschen Lauten (z. B. つ = „z“ in *Zeit*). |
| **Kana first** | Rōmaji nur als Lesehilfe, abschaltbar im Quiz-Modus der Kana-Tabellen. |
| **Furigana** | Kanji in Beispielsätzen erhalten immer Lesehilfen. |
| **Kurz & scannbar** | Merksätze in Tipp-Boxen, Warnungen für Stolperfallen, Details einklappbar. |

## 3. Seitenstruktur

```
docs/
├── index.md                     Startseite (Hero, Bereiche, Lernpfad)
├── start/
│   ├── index.md                 Japanisch auf einen Blick
│   └── lerntipps.md             Die 12 wichtigsten Lerntipps
├── schrift/
│   ├── hiragana.md              Interaktive Tabelle, Verwechslungsgefahr
│   ├── katakana.md              Tabelle, Lehnwort-Regeln, deutsche Lehnwörter
│   ├── kombinationen.md         Dakuten, Yōon, kleines っ, Langvokale, ん, Erweiterungen
│   └── kanji.md                 On/Kun, Radikale, Strichfolge, erste Kanji
├── aussprache/
│   ├── grundlagen.md            Vokale, Konsonanten, Mora, Devokalisierung, Rendaku
│   └── betonung.md              Tonhöhenakzent mit Diagrammen, Minimalpaare
├── grammatik/
│   ├── satzbau.md               SOV, Thema-Kommentar, Satzschablone
│   ├── partikel.md              Alle Kernpartikel mit Merksätzen
│   ├── partikel-vergleiche.md   は/が, に/で, に/へ, と/や im Direktvergleich
│   ├── verben.md                Gruppen, ます-, て-, ない-Form
│   ├── adjektive.md             い- vs. な-Adjektive
│   └── hoeflichkeit.md          Sprachebenen, Keigo, Anreden, Uchi/Soto
└── wortschatz/
    ├── zahlen.md                Zahlen, Zählwörter, Uhrzeit, Datum
    └── redewendungen.md         Alltagsausdrücke nach Situation
```

## 4. Technik

- **VitePress** (statischer Site-Generator auf Vue-Basis): Markdown rein, schnelle Website raus.
- Integrierte **lokale Volltextsuche**, Dark Mode, Sidebar, Inhaltsverzeichnis pro Seite.
- **Noto Sans JP** wird selbst gehostet (`@fontsource`) und nicht über Google Fonts geladen (DSGVO).
- Deployment: jeder statische Host (GitHub Pages, Netlify, eigener Webspace).

```bash
npm install
npm run dev      # Entwicklungsserver
npm run build    # statische Seite nach docs/.vitepress/dist
npm run preview  # Build lokal ansehen
```

## 5. Design

- Farbwelt: **Shu-iro** (Zinnoberrot, 朱色) als Akzent, **Ai-iro** (Indigo, 藍色) als Zweitfarbe.
- Großzügige Karten mit weichen Schatten statt Tabellengitter.
- Japanischer Text etwas größer gesetzt, Furigana über `<ruby>`.

### Eigene Komponenten

| Komponente | Zweck | Beispiel |
| --- | --- | --- |
| `<KanaChart>` | Kana-Raster mit Quiz-Modus (Rōmaji ausblenden) | `<KanaChart script="katakana" set="yoon" />` |
| `<Ex>` | Beispielsatz mit Furigana, Hervorhebung, Rōmaji, Übersetzung | `<Ex jp="私[わたし]{は}学生[がくせい]です。" de="Ich bin Student." />` |
| `<PitchAccent>` | Tonhöhen-Diagramm eines Wortes inkl. Partikel | `<PitchAccent word="箸" kana="はし" :accent="1" />` |
| `<MoraSplit>` | Zerlegt ein Wort sichtbar in Moren | `<MoraSplit kana="とうきょう" />` |
| `<KanjiCard>` | Kanji mit On-/Kun-Lesung und Bedeutung | `<KanjiCard k="山" on="サン" kun="やま" de="Berg" />` |

**Syntax in `<Ex>`:** `漢字[かんじ]` erzeugt Furigana, `{は}` hebt einen Teil farbig hervor.

Zusätzlich gibt es CSS-Klassen für Karten-Raster (`.info-grid` / `.info-card`) und
Gegenüberstellungen (`.compare`), die direkt im Markdown als HTML genutzt werden.

## 6. Erweiterungsideen

- Audio-Schnipsel zu Beispielsätzen
- Kana-Quiz mit Zufallsreihenfolge und Punktestand
- JLPT-Vokabellisten nach Themen
- Grammatikseiten für N4/N3 (Konditional, Passiv, Kausativ)
- Übungsblöcke mit aufklappbaren Lösungen (`::: details`)
