// Rōmaji → Hiragana wie bei einer japanischen Tastatureingabe (IME)

const ROWS: Record<string, string> = {
  a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お',
  ka: 'か', ki: 'き', ku: 'く', ke: 'け', ko: 'こ',
  ga: 'が', gi: 'ぎ', gu: 'ぐ', ge: 'げ', go: 'ご',
  sa: 'さ', si: 'し', shi: 'し', su: 'す', se: 'せ', so: 'そ',
  za: 'ざ', zi: 'じ', ji: 'じ', zu: 'ず', ze: 'ぜ', zo: 'ぞ',
  ta: 'た', ti: 'ち', chi: 'ち', tu: 'つ', tsu: 'つ', te: 'て', to: 'と',
  da: 'だ', di: 'ぢ', du: 'づ', de: 'で', do: 'ど',
  na: 'な', ni: 'に', nu: 'ぬ', ne: 'ね', no: 'の',
  ha: 'は', hi: 'ひ', hu: 'ふ', fu: 'ふ', he: 'へ', ho: 'ほ',
  ba: 'ば', bi: 'び', bu: 'ぶ', be: 'べ', bo: 'ぼ',
  pa: 'ぱ', pi: 'ぴ', pu: 'ぷ', pe: 'ぺ', po: 'ぽ',
  ma: 'ま', mi: 'み', mu: 'む', me: 'め', mo: 'も',
  ya: 'や', yu: 'ゆ', yo: 'よ',
  ra: 'ら', ri: 'り', ru: 'る', re: 'れ', ro: 'ろ',
  wa: 'わ', wo: 'を',
  sha: 'しゃ', shu: 'しゅ', sho: 'しょ', sya: 'しゃ', syu: 'しゅ', syo: 'しょ',
  cha: 'ちゃ', chu: 'ちゅ', cho: 'ちょ', tya: 'ちゃ', tyu: 'ちゅ', tyo: 'ちょ',
  ja: 'じゃ', ju: 'じゅ', jo: 'じょ', zya: 'じゃ', zyu: 'じゅ', zyo: 'じょ', jya: 'じゃ', jyu: 'じゅ', jyo: 'じょ',
  fa: 'ふぁ', fi: 'ふぃ', fe: 'ふぇ', fo: 'ふぉ',
  xa: 'ぁ', xi: 'ぃ', xu: 'ぅ', xe: 'ぇ', xo: 'ぉ', la: 'ぁ', li: 'ぃ', lu: 'ぅ', le: 'ぇ', lo: 'ぉ',
  xya: 'ゃ', xyu: 'ゅ', xyo: 'ょ', lya: 'ゃ', lyu: 'ゅ', lyo: 'ょ',
  xtu: 'っ', ltu: 'っ', xtsu: 'っ', ltsu: 'っ'
}
for (const [c, kana] of Object.entries({ k: 'き', g: 'ぎ', n: 'に', h: 'ひ', b: 'び', p: 'ぴ', m: 'み', r: 'り' })) {
  ROWS[`${c}ya`] = `${kana}ゃ`
  ROWS[`${c}yu`] = `${kana}ゅ`
  ROWS[`${c}yo`] = `${kana}ょ`
}

const VOWEL = /[aiueo]/

/**
 * Wandelt Rōmaji in Hiragana um; bereits getippte Kana/Kanji bleiben erhalten.
 * `final` wandelt auch ein n am Ende in ん um (beim Abschicken).
 */
export function toKana(input: string, final = false): string {
  const s = input.toLowerCase()
  let out = ''
  let i = 0
  while (i < s.length) {
    const c = s[i]
    const next = s[i + 1] ?? ''
    if (c === '-') {
      out += 'ー'
      i++
      continue
    }
    if (!/[a-z]/.test(c)) {
      out += c
      i++
      continue
    }
    if (c === 'n') {
      if (next === "'") {
        out += 'ん'
        i += 2
        continue
      }
      if (next === 'n') {
        const after = s[i + 2] ?? ''
        // Wie Hepburn: nn + Vokal = ん + な-Reihe (nannin → なんにん)
        if (VOWEL.test(after)) {
          out += 'ん'
          i++
          continue
        }
        // Erst der nächste Buchstabe entscheidet
        if (!after && !final) {
          out += 'nn'
          i += 2
          continue
        }
        out += 'ん'
        i += 2
        continue
      }
      if (next && !VOWEL.test(next) && next !== 'y') {
        out += 'ん'
        i++
        continue
      }
      if (!next) {
        out += final ? 'ん' : 'n'
        i++
        continue
      }
    }
    if (c === next && !VOWEL.test(c)) {
      out += 'っ'
      i++
      continue
    }
    const hit = [4, 3, 2, 1].map((len) => s.slice(i, i + len)).find((part) => ROWS[part])
    if (hit) {
      out += ROWS[hit]
      i += hit.length
    } else {
      out += c
      i++
    }
  }
  return out
}
