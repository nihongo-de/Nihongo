import { n5Groups } from './n5'
import { n4Groups } from './n4'

export type Level = 'n5' | 'n4' | 'n3' | 'n2' | 'n1'

export interface Kanji {
  k: string
  on: string
  kun: string
  de: string
  /** Beispielwort in Ruby-Syntax (nur N5/N4) */
  ex?: string
  exDe?: string
  strokes?: number
}

export interface KanjiGroup {
  id: string
  title: string
  kanji: Kanji[]
}

export const levelLabels: Record<Level, string> = { n5: 'N5', n4: 'N4', n3: 'N3', n2: 'N2', n1: 'N1' }

// N3–N1 (fast 2000 Kanji) werden erst bei Bedarf geladen, damit sie nicht in jedem Seitenaufruf stecken
const lazy: Record<'n3' | 'n2' | 'n1', () => Promise<{ groups: KanjiGroup[] }>> = {
  n3: () => import('./n3.json').then((m) => m.default),
  n2: () => import('./n2.json').then((m) => m.default),
  n1: () => import('./n1.json').then((m) => m.default)
}

export async function loadLevel(level: Level): Promise<KanjiGroup[]> {
  if (level === 'n5') return n5Groups
  if (level === 'n4') return n4Groups
  return (await lazy[level]()).groups
}
