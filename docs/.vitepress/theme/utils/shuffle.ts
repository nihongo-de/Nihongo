// Deterministisch mischen, damit Server- und Client-Rendering übereinstimmen
const fmix = (h: number) => {
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b)
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35)
  return (h ^ (h >>> 16)) >>> 0
}
const hash = (s: string) => fmix([...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7))

export const stableShuffle = (options: string[], seed: string) =>
  [...options].sort((a, b) => hash(a + seed) - hash(b + seed))
