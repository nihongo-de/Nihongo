// Vereinfachtes SM-2: Intervall in Tagen wächst mit dem Leichtigkeitsfaktor, „Nochmal“ setzt zurück
export interface SrsCard {
  /** Fällig ab Tag (lokale Tageszahl seit 1970) */
  due: number
  /** Intervall in Tagen, 0 = noch in der Lernphase */
  ivl: number
  ease: number
  reps: number
  lapses: number
  /** Tag, an dem die Karte zum ersten Mal gelernt wurde */
  seen: number
}

/** 0 = Nochmal, 1 = Schwer, 2 = Gut, 3 = Leicht */
export type Rating = 0 | 1 | 2 | 3

export const MATURE = 21

export function today(now = new Date()) {
  return Math.floor((now.getTime() - now.getTimezoneOffset() * 60000) / 86400000)
}

export function schedule(card: SrsCard | undefined, rating: Rating, day: number): SrsCard {
  const c = card ?? { due: day, ivl: 0, ease: 2.5, reps: 0, lapses: 0, seen: day }
  let { ivl, ease, lapses } = c
  if (rating === 0) {
    if (ivl > 0) lapses++
    ease = Math.max(1.3, ease - 0.2)
    ivl = 0
  } else if (ivl === 0) {
    ivl = rating === 3 ? 4 : 1
  } else {
    const good = Math.max(ivl + 1, Math.round(ivl * ease))
    if (rating === 1) {
      ivl = Math.min(good, Math.max(ivl + 1, Math.round(ivl * 1.2)))
      ease = Math.max(1.3, ease - 0.15)
    } else if (rating === 2) {
      ivl = good
    } else {
      ivl = Math.max(good + 1, Math.round(ivl * ease * 1.3))
      ease += 0.15
    }
  }
  ivl = Math.min(ivl, 365)
  return { due: day + ivl, ivl, ease: Math.round(ease * 100) / 100, reps: c.reps + 1, lapses, seen: c.seen }
}

export function intervalLabel(days: number) {
  if (days === 0) return 'gleich'
  if (days === 1) return '1 Tag'
  if (days < 30) return `${days} Tage`
  const months = Math.round(days / 30)
  return months < 12 ? `${months} Mon.` : '1 Jahr'
}
