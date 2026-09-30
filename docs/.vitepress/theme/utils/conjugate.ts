import type { Verb } from '../data/verbs'
import { parseRuby } from './ruby'

export type VerbForm = 'masu' | 'masen' | 'mashita' | 'masendeshita' | 'dict' | 'nai' | 'ta' | 'te'

export const formLabels: Record<VerbForm, string> = {
  masu: 'ます-Form',
  masen: 'ません',
  mashita: 'ました',
  masendeshita: 'ませんでした',
  dict: 'Wörterbuchform',
  nai: 'ない-Form',
  ta: 'た-Form',
  te: 'て-Form'
}

export const formHints: Record<VerbForm, string> = {
  masu: 'höflich, Gegenwart',
  masen: 'höflich, verneint',
  mashita: 'höflich, Vergangenheit',
  masendeshita: 'höflich, Vergangenheit verneint',
  dict: 'einfache Form',
  nai: 'einfach, verneint',
  ta: 'einfach, Vergangenheit',
  te: 'verbindet, bittet …'
}

const I: Record<string, string> = { う: 'い', く: 'き', ぐ: 'ぎ', す: 'し', つ: 'ち', ぬ: 'に', ぶ: 'び', む: 'み', る: 'り' }
const A: Record<string, string> = { う: 'わ', く: 'か', ぐ: 'が', す: 'さ', つ: 'た', ぬ: 'な', ぶ: 'ば', む: 'ま', る: 'ら' }
const TE: Record<string, string> = { う: 'って', つ: 'って', る: 'って', む: 'んで', ぶ: 'んで', ぬ: 'んで', く: 'いて', ぐ: 'いで', す: 'して' }
const MASU: Partial<Record<VerbForm, string>> = { masu: 'ます', masen: 'ません', mashita: 'ました', masendeshita: 'ませんでした' }

export interface Conjugated {
  /** Ruby-Syntax für die Anzeige */
  ruby: string
  kana: string
  plain: string
  rule: string
  /** Weitere richtige Antworten in Ruby-Syntax */
  alts?: string[]
}

export const done = (ruby: string, rule: string, alts?: string[]): Conjugated => {
  const segs = parseRuby(ruby)
  return { ruby, kana: segs.map((s) => s.rt ?? s.text).join(''), plain: segs.map((s) => s.text).join(''), rule, alts }
}

/** Alle akzeptierten Schreibungen (Kana und Kanji) */
export function accepted(c: Conjugated): string[] {
  return [c.ruby, ...(c.alts ?? [])].flatMap((r) => {
    const segs = parseRuby(r)
    return [segs.map((s) => s.rt ?? s.text).join(''), segs.map((s) => s.text).join('')]
  })
}

export function conjugate(verb: Verb, form: VerbForm): Conjugated {
  const jp = verb.jp
  if (form === 'dict') return done(jp, dictRule(verb))

  const suru = jp.endsWith('する')
  const kuru = jp.startsWith('来')
  const base = suru ? jp.slice(0, -2) : jp.slice(0, -1)
  const last = jp.slice(-1)
  const masu = MASU[form]

  if (masu) {
    if (suru) return done(`${base}し${masu}`, 'Unregelmäßig: する → し + ' + masu)
    if (kuru) return done(`来[き]${masu}`, 'Unregelmäßig: 来る → 来（き）+ ' + masu)
    if (verb.group === 'ru') return done(`${base}${masu}`, `る-Verb: る weg + ${masu}`)
    return done(`${base}${I[last]}${masu}`, `う-Verb: 〜${last} → 〜${I[last]} + ${masu}`)
  }

  if (form === 'nai') {
    if (suru) return done(`${base}しない`, 'Unregelmäßig: する → しない')
    if (kuru) return done('来[こ]ない', 'Unregelmäßig: 来る → 来ない（こない）')
    if (jp === 'ある') return done('ない', 'Ausnahme: ある → ない')
    if (verb.group === 'ru') return done(`${base}ない`, 'る-Verb: る weg + ない')
    return done(`${base}${A[last]}ない`, `う-Verb: 〜${last} → 〜${A[last]}ない${last === 'う' ? ' (う wird zu わ, nicht あ)' : ''}`)
  }

  // て- und た-Form werden gleich gebildet
  const ta = form === 'ta'
  const swap = (s: string) => (ta ? s.replace(/て$/, 'た').replace(/で$/, 'だ') : s)
  const name = ta ? 'た' : 'て'
  if (suru) return done(`${base}${swap('して')}`, `Unregelmäßig: する → ${swap('して')}`)
  if (kuru) return done(`来[き]${swap('て')}`, `Unregelmäßig: 来る → 来${swap('て')}（き${swap('て')}）`)
  if (verb.group === 'ru') return done(`${base}${swap('て')}`, `る-Verb: る weg + ${name}`)
  if (jp === '行[い]く') return done(`${base}${swap('って')}`, `Ausnahme: 行く → 行${swap('って')}（nicht 行${swap('いて')}）`)
  const end = swap(TE[last])
  return done(`${base}${end}`, `う-Verb: 〜${last} → 〜${end}`)
}

function dictRule(verb: Verb) {
  if (verb.group === 'irr') return 'Unregelmäßig: します → する, 来ます → 来る（くる）'
  if (verb.group === 'ru') return 'る-Verb: ます weg + る'
  const last = verb.jp.slice(-1)
  return `う-Verb: 〜${I[last]}ます → 〜${last}`
}
