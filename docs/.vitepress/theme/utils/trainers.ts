import { verbsN5, type Verb } from '../data/verbs'
import { adjectivesN5, type Adjective } from '../data/adjectives'
import { conjugate, done, formHints, formLabels, type Conjugated, type VerbForm } from './conjugate'

export interface TrainerItem {
  jp: string
  de: string
  group: string
}

export interface Deck {
  id: string
  title: string
  path: string
  itemLabel: string
  groups: { id: string; label: string }[]
  forms: { id: string; label: string; hint: string }[]
  defaultForms: string[]
  items: TrainerItem[]
  /** Was auf der Karte steht (Ruby-Syntax) */
  prompt(item: TrainerItem, form: string): string
  answer(item: TrainerItem, form: string): Conjugated
}

const VERB_FORMS: VerbForm[] = ['masu', 'masen', 'mashita', 'masendeshita', 'dict', 'nai', 'ta', 'te']

export const verbDeck: Deck = {
  id: 'verben',
  title: 'Konjugationstrainer',
  path: '/uebungen/konjugation',
  itemLabel: 'Verben',
  groups: [
    { id: 'u', label: 'う-Verben' },
    { id: 'ru', label: 'る-Verben' },
    { id: 'irr', label: 'unregelmäßig' }
  ],
  forms: VERB_FORMS.map((id) => ({
    id,
    label: formLabels[id],
    hint: id === 'dict' ? 'aus der ます-Form zurück' : formHints[id]
  })),
  defaultForms: ['masu', 'masen', 'mashita', 'masendeshita', 'nai', 'ta', 'te'],
  items: verbsN5,
  prompt: (item, form) => (form === 'dict' ? conjugate(item as Verb, 'masu').ruby : item.jp),
  answer: (item, form) => conjugate(item as Verb, form as VerbForm)
}

/* Adjektive */
type AdjForm = 'neg' | 'past' | 'pastneg' | 'negPol' | 'pastPol' | 'pastnegPol'

const ADJ_FORMS: { id: AdjForm; label: string; hint: string }[] = [
  { id: 'neg', label: 'verneint', hint: 'einfach: 高くない' },
  { id: 'past', label: 'Vergangenheit', hint: 'einfach: 高かった' },
  { id: 'pastneg', label: 'Vergangenheit verneint', hint: 'einfach: 高くなかった' },
  { id: 'negPol', label: 'verneint + です', hint: 'höflich: 高くないです' },
  { id: 'pastPol', label: 'Vergangenheit + です', hint: 'höflich: 高かったです' },
  { id: 'pastnegPol', label: 'Vergangenheit verneint + です', hint: 'höflich: 高くなかったです' }
]

const LOOKS_I = (adj: Adjective) => adj.group === 'na' && adj.jp.endsWith('い')

function conjugateAdj(adj: Adjective, form: AdjForm): Conjugated {
  if (adj.group === 'na') {
    const b = adj.jp
    const note = LOOKS_I(adj) ? ` – ${b.replace(/\[[^\]]*\]/g, '')} endet auf い, ist aber ein な-Adjektiv` : ''
    const r = (ruby: string, rule: string, alts?: string[]) => done(ruby, rule + note, alts)
    switch (form) {
      case 'neg': return r(`${b}じゃない`, 'な-Adjektiv: + じゃない (förmlicher: ではない)', [`${b}ではない`])
      case 'past': return r(`${b}だった`, 'な-Adjektiv: + だった')
      case 'pastneg': return r(`${b}じゃなかった`, 'な-Adjektiv: + じゃなかった', [`${b}ではなかった`])
      case 'negPol': return r(`${b}じゃないです`, 'な-Adjektiv: + じゃないです (auch じゃありません)', [`${b}じゃありません`, `${b}ではありません`, `${b}ではないです`])
      case 'pastPol': return r(`${b}でした`, 'な-Adjektiv: + でした')
      case 'pastnegPol': return r(`${b}じゃなかったです`, 'な-Adjektiv: + じゃなかったです (auch じゃありませんでした)', [`${b}じゃありませんでした`, `${b}ではありませんでした`, `${b}ではなかったです`])
    }
  }
  const ii = adj.jp === 'いい'
  const b = ii ? 'よ' : adj.jp.slice(0, -1)
  const ex = ii ? 'Ausnahme: いい wird zu よ〜 – ' : 'い-Adjektiv: '
  switch (form) {
    case 'neg': return done(`${b}くない`, `${ex}〜い → 〜くない`)
    case 'past': return done(`${b}かった`, `${ex}〜い → 〜かった`)
    case 'pastneg': return done(`${b}くなかった`, `${ex}〜い → 〜くなかった`)
    case 'negPol': return done(`${b}くないです`, `${ex}〜い → 〜くないです (auch 〜くありません)`, [`${b}くありません`])
    case 'pastPol': return done(`${b}かったです`, `${ex}〜い → 〜かったです – nicht 〜いでした!`)
    case 'pastnegPol': return done(`${b}くなかったです`, `${ex}〜い → 〜くなかったです (auch 〜くありませんでした)`, [`${b}くありませんでした`])
  }
}

export const adjDeck: Deck = {
  id: 'adjektive',
  title: 'Adjektiv-Trainer',
  path: '/uebungen/adjektive',
  itemLabel: 'Adjektive',
  groups: [
    { id: 'i', label: 'い-Adjektive' },
    { id: 'na', label: 'な-Adjektive' }
  ],
  forms: ADJ_FORMS,
  defaultForms: ADJ_FORMS.map((f) => f.id),
  items: adjectivesN5,
  prompt: (item) => item.jp,
  answer: (item, form) => conjugateAdj(item as Adjective, form as AdjForm)
}

export const decks: Record<string, Deck> = { verben: verbDeck, adjektive: adjDeck }
