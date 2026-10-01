// Vorlesen vorerst abgeschaltet, bis es eine bessere Sprachausgabe gibt (Knöpfe, Menü, PWA-Cache)
export const AUDIO_ENABLED = false

// Vorab erzeugte Aufnahmen (scripts/audio.mjs) liegen unter public/audio/<audioId(text)>.mp3.
// Der Schlüssel ist der Text, den die Komponenten an speak() übergeben – das Skript muss dieselben Texte bilden.

/** FNV-1a (32 Bit) über die UTF-16-Codeeinheiten, als 8 Hex-Zeichen */
export function audioId(text: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16).padStart(8, '0')
}

export const sampleSentence = 'こんにちは。日本語を勉強しています。'
