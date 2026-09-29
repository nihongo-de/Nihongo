const SMALL_KANA = 'ゃゅょぁぃぅぇぉゎャュョァィゥェォヮ'

// Kleine ゃ/ゅ/ょ usw. verschmelzen mit dem vorherigen Zeichen zu einer Mora; っ, ん und ー zählen einzeln.
export function splitMora(kana: string): string[] {
  const morae: string[] = []
  for (const ch of kana) {
    if (SMALL_KANA.includes(ch) && morae.length > 0) {
      morae[morae.length - 1] += ch
    } else {
      morae.push(ch)
    }
  }
  return morae
}
