import { reactive, ref, watch } from 'vue'

const KEY = 'nihongo:settings'

export const settings = reactive({ furigana: true, romaji: true, rate: 0.9, voice: '' })

// Die Klassen setzt auch ein Inline-Skript im <head> (config.mts), damit nichts aufblitzt
function applyClasses() {
  const cl = document.documentElement.classList
  cl.toggle('no-furigana', !settings.furigana)
  cl.toggle('no-romaji', !settings.romaji)
}

let ready = false

export function initSettings() {
  if (ready) return
  ready = true
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? '{}')
    if (typeof saved.furigana === 'boolean') settings.furigana = saved.furigana
    if (typeof saved.romaji === 'boolean') settings.romaji = saved.romaji
    if (typeof saved.rate === 'number') settings.rate = Math.min(1.5, Math.max(0.5, saved.rate))
    if (typeof saved.voice === 'string') settings.voice = saved.voice
  } catch {}
  applyClasses()
  watch(settings, () => {
    applyClasses()
    try {
      localStorage.setItem(KEY, JSON.stringify(settings))
    } catch {}
  })
  initSpeech()
}

/* Vorlesen mit der Web Speech API */
export const voices = ref<SpeechSynthesisVoice[]>([])
export const speaking = ref('')

function initSpeech() {
  if (!('speechSynthesis' in window)) return
  const load = () => {
    voices.value = speechSynthesis.getVoices().filter((v) => /^ja\b/i.test(v.lang.replace('_', '-')))
  }
  load()
  speechSynthesis.addEventListener('voiceschanged', load)
}

export function speak(text: string) {
  const voice = voices.value.find((v) => v.voiceURI === settings.voice) ?? voices.value[0]
  if (!voice) return
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.voice = voice
  u.lang = voice.lang
  u.rate = settings.rate
  u.onend = u.onerror = () => {
    if (speaking.value === text) speaking.value = ''
  }
  speaking.value = text
  speechSynthesis.speak(u)
}
