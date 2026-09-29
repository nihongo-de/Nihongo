export interface RubySegment {
  text: string
  rt?: string
}

// 漢字[かんじ] → Kanji mit Furigana
const RUBY = /([\u3400-\u9fff々〆ヶ]+)\[([^\]]+)\]/g

export function parseRuby(text: string): RubySegment[] {
  const out: RubySegment[] = []
  let last = 0
  for (const m of text.matchAll(RUBY)) {
    const index = m.index ?? 0
    if (index > last) out.push({ text: text.slice(last, index) })
    out.push({ text: m[1], rt: m[2] })
    last = index + m[0].length
  }
  if (last < text.length) out.push({ text: text.slice(last) })
  return out
}
