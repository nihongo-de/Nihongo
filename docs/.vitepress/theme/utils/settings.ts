import { computed, reactive, ref, shallowRef, watch } from 'vue'
import { withBase } from 'vitepress'
import { AUDIO_ENABLED, audioId } from './audio'

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

/*
 * Vorlesen: vorab erzeugte Aufnahmen (public/audio, scripts/audio.mjs) oder Web Speech API.
 * settings.voice: '' = automatisch, REC = immer Aufnahmen, sonst voiceURI einer Systemstimme.
 * Automatisch nimmt die beste Systemstimme; klingt die robotisch (eSpeak unter Linux), die Aufnahmen.
 */
export const REC = 'rec'
export const voices = ref<SpeechSynthesisVoice[]>([])
export const clips = shallowRef(new Set<string>())
export const speaking = ref('')

const GOOD = /google|microsoft|apple|siri|natural|neural|online|premium|enhanced|kyoko|o-?ren|hattori|otoya|nanami|keita|haruka|ayumi|ichiro|sayaka|samsung/i
const BEST = /natural|neural|online|premium|enhanced/i

// Unter Desktop-Linux kommen lokale Stimmen über speech-dispatcher von eSpeak – auch wenn der Name das nicht verrät
export function isRobotic(v: SpeechSynthesisVoice) {
  const id = `${v.name} ${v.voiceURI}`
  if (/espeak|mbrola|speechd/i.test(id)) return true
  const ua = navigator.userAgent
  return v.localService && !GOOD.test(id) && /Linux/.test(ua) && !/Android/.test(ua)
}

function score(v: SpeechSynthesisVoice) {
  const id = `${v.name} ${v.voiceURI}`
  return (isRobotic(v) ? 0 : 4) + (BEST.test(id) ? 2 : 0) + (GOOD.test(id) ? 1 : 0)
}

function initSpeech() {
  if (!AUDIO_ENABLED) return
  fetch(withBase('/audio/index.json'))
    .then((r) => (r.ok ? r.json() : []))
    .then((ids: string[]) => (clips.value = new Set(ids)))
    .catch(() => {})
  if (!('speechSynthesis' in window)) return
  const load = () => {
    voices.value = speechSynthesis
      .getVoices()
      .filter((v) => /^ja\b/i.test(v.lang.replace('_', '-')))
      .sort((a, b) => score(b) - score(a))
  }
  load()
  speechSynthesis.addEventListener('voiceschanged', load)
}

const chosenVoice = () => voices.value.find((v) => v.voiceURI === settings.voice)

/** Systemstimme, die gerade verwendet würde – undefined heißt: Aufnahmen */
export const activeVoice = computed(() => {
  if (settings.voice === REC) return undefined
  const v = chosenVoice() ?? voices.value[0]
  return v && (chosenVoice() || !isRobotic(v) || !clips.value.size) ? v : undefined
})

export const canSpeak = (text: string) => AUDIO_ENABLED && (voices.value.length > 0 || clips.value.has(audioId(text)))

let audio: HTMLAudioElement | undefined

function stop() {
  if ('speechSynthesis' in window) speechSynthesis.cancel()
  audio?.pause()
}

function finish(key: string) {
  if (speaking.value === key) speaking.value = ''
}

function speakWith(voice: SpeechSynthesisVoice, text: string, key = text) {
  stop()
  const u = new SpeechSynthesisUtterance(text)
  u.voice = voice
  u.lang = voice.lang
  u.rate = settings.rate
  u.onend = u.onerror = () => finish(key)
  speaking.value = key
  speechSynthesis.speak(u)
}

// Bei Fehlern (z. B. offline und nicht im Cache) springt die Systemstimme ein
function play(url: string, key: string, fallback?: SpeechSynthesisVoice) {
  stop()
  audio ??= new Audio()
  audio.src = url
  // Das Laden setzt playbackRate zurück; die Tonhöhe bleibt beim Verlangsamen erhalten (preservesPitch)
  audio.defaultPlaybackRate = audio.playbackRate = settings.rate
  audio.onended = () => finish(key)
  audio.onerror = () => {
    finish(key)
    if (fallback) speakWith(fallback, key)
  }
  speaking.value = key
  audio.play().catch(() => {})
}

export function speak(text: string) {
  const voice = activeVoice.value
  const id = audioId(text)
  if (clips.value.has(id) && !voice) return play(withBase(`/audio/${id}.mp3`), text, chosenVoice() ?? voices.value[0])
  const v = voice ?? voices.value[0]
  if (v) speakWith(v, text)
}

/** Einzelne Kana immer als Aufnahme: Sprachausgaben lesen sie allein oft falsch (は als „wa“, な als „la“ …) */
export function speakKana(kana: string, romaji: string) {
  play(withBase(`/audio/kana/${romaji}.mp3`), kana, activeVoice.value ?? voices.value[0])
}
