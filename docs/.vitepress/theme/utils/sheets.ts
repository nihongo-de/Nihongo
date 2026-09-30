// Seitenmaße der Schreibblätter in mm (A4 hochkant)
export const PAGE = { w: 210, h: 297, margin: 12, head: 10, label: 5, gap: 3 }
export const INNER_W = PAGE.w - 2 * PAGE.margin
const CONTENT_H = PAGE.h - 2 * PAGE.margin - PAGE.head

export const SIZES = [10, 12, 14, 16, 18, 20, 25, 30]

export const columns = (size: number) => Math.floor(INNER_W / size)

export const maxPerPage = (size: number) =>
  Math.max(1, Math.floor((CONTENT_H + PAGE.gap) / (PAGE.label + size + PAGE.gap)))

/** Abstand der Zeichenblöcke, damit sie die Seite gleichmäßig füllen */
export const blockStep = (perPage: number) => (CONTENT_H + PAGE.gap) / perPage

/** Übrigen Platz bekommt jedes Zeichen als zusätzliche leere Übungszeilen */
export const rowsPerItem = (size: number, perPage: number) =>
  Math.max(1, Math.floor((blockStep(perPage) - PAGE.gap - PAGE.label) / size))
