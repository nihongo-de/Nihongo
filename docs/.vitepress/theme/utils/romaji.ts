import { kanaSets, toKatakana } from '../data/kana'

const MAP = new Map<string, string>(
  Object.entries({ ぁ: 'a', ぃ: 'i', ぅ: 'u', ぇ: 'e', ぉ: 'o', ゎ: 'wa', ゐ: 'i', ゑ: 'e', ヵ: 'ka', ヶ: 'ke' })
)
for (const set of Object.values(kanaSets)) {
  for (const cell of set.rows.flat()) if (cell) MAP.set(cell[0], cell[1])
}
for (const [kana, romaji] of [...MAP]) MAP.set(toKatakana(kana), romaji)

const MACRON: Record<string, string> = { a: 'ā', i: 'ī', u: 'ū', e: 'ē', o: 'ō' }
const LONG = new Set(['aa', 'uu', 'ee', 'oo', 'ou'])

/**
 * Kana → Hepburn mit Makrons (がっこう → gakkō). Mehrere Teile (z. B. Ruby-Segmente) werden
 * nur innerhalb eines Teils zu Langvokalen verschmolzen, damit 思[おも]う „omou" bleibt.
 */
export function toRomaji(input: string | string[]): string {
  const tokens: { kana: string; r?: string; seg: number }[] = []
  ;(typeof input === 'string' ? [input] : input).forEach((text, seg) => {
    const chars = [...text]
    for (let i = 0; i < chars.length; i++) {
      const two = chars[i] + (chars[i + 1] ?? '')
      if (MAP.has(two)) {
        tokens.push({ kana: two, r: MAP.get(two), seg })
        i++
      } else tokens.push({ kana: chars[i], r: MAP.get(chars[i]), seg })
    }
  })

  const out: string[] = []
  tokens.forEach((t, i) => {
    const next = tokens.slice(i + 1).find((n) => n.r)?.r ?? ''
    const prev = tokens[i - 1]
    const last = out[i - 1]?.slice(-1) ?? ''
    if (t.kana === 'っ' || t.kana === 'ッ') out.push(next.startsWith('ch') ? 't' : /^[aeiou]/.test(next) ? '' : next[0] ?? '')
    else if (t.kana === 'ん' || t.kana === 'ン') out.push(/^[aeiouy]/.test(next) ? 'n’' : 'n')
    else if (t.kana === 'ー' && MACRON[last]) {
      out[i - 1] = out[i - 1].slice(0, -1) + MACRON[last]
      out.push('')
    } else if (t.r && prev?.r && prev.seg === t.seg && LONG.has(last + t.r)) {
      out[i - 1] = out[i - 1].slice(0, -1) + MACRON[last]
      out.push('')
    } else out.push(t.r ?? t.kana)
  })
  return out.join('')
}
