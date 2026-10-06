<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { readingsN5 } from '../data/readings'
import { settings } from '../utils/settings'
import { recordResult } from '../utils/progress'
import { stableShuffle } from '../utils/shuffle'
import RubyText from './RubyText.vue'

const props = defineProps<{ id: string }>()
const reading = computed(() => readingsN5.find((r) => r.id === props.id))

// null = globale Einstellung (Menü „あ“), sonst nur für diesen Text überschrieben
const localFuri = ref<boolean | null>(null)
const furigana = computed(() => localFuri.value ?? settings.furigana)
const translation = ref(false)
const showWords = ref(false)

const revealed = reactive(new Set<string>())
const toggle = (key: string) => (revealed.has(key) ? revealed.delete(key) : revealed.add(key))
const shown = (key: string) => translation.value || revealed.has(key)

const questions = computed(() =>
  (reading.value?.questions ?? []).map((q) => ({ ...q, answer: q.options[0], options: stableShuffle(q.options, q.jp) }))
)
const chosen = reactive<Record<number, string>>({})
const answered = computed(() => Object.keys(chosen).length)
const right = computed(() => questions.value.filter((q, i) => chosen[i] === q.answer).length)

function reset() {
  for (const key of Object.keys(chosen)) delete chosen[Number(key)]
}

watch(answered, (n) => {
  if (n && n === questions.value.length && reading.value)
    recordResult(`lesen:${props.id}`, { path: `/uebungen/lesen#${props.id}`, title: `Lesen · ${reading.value.de}` }, right.value, n)
})
</script>

<template>
  <div v-if="reading" class="read" :class="{ 'furi-on': localFuri === true, 'furi-off': localFuri === false }">
    <div class="read__bar">
      <p class="read__title" lang="ja"><RubyText :text="reading.title" /></p>
      <div class="read__toggles">
        <button type="button" :aria-pressed="!furigana" @click="localFuri = !furigana">
          {{ furigana ? 'Furigana aus' : 'Furigana an' }}
        </button>
        <button type="button" :aria-pressed="translation" @click="translation = !translation">
          {{ translation ? 'Übersetzung aus' : 'Übersetzung' }}
        </button>
        <button type="button" :aria-pressed="showWords" @click="showWords = !showWords">Wörter</button>
      </div>
    </div>

    <dl v-show="showWords" class="read__words">
      <template v-for="w in reading.words" :key="w.jp">
        <dt lang="ja"><RubyText :text="w.jp" /></dt>
        <dd>{{ w.de }}</dd>
      </template>
    </dl>

    <div class="read__text">
      <template v-for="(para, pi) in reading.paragraphs" :key="pi">
        <div v-if="para.some((l) => l.speaker)" class="read__dialog">
          <div v-for="(l, li) in para" :key="li" class="read__line">
            <span class="read__speaker" lang="ja"><RubyText :text="l.speaker ?? ''" /></span>
            <div>
              <span
                class="read__sent"
                :class="{ 'is-open': revealed.has(`${pi}-${li}`) }"
                lang="ja"
                role="button"
                tabindex="0"
                @click="toggle(`${pi}-${li}`)"
                @keydown.enter.space.prevent="toggle(`${pi}-${li}`)"
                ><RubyText :text="l.jp"
              /></span>
              <p v-if="shown(`${pi}-${li}`)" class="read__de">{{ l.de }}</p>
            </div>
          </div>
        </div>
        <div v-else class="read__para">
          <p class="read__jp" lang="ja">
            <span
              v-for="(l, li) in para"
              :key="li"
              class="read__sent"
              :class="{ 'is-open': revealed.has(`${pi}-${li}`) }"
              role="button"
              tabindex="0"
              @click="toggle(`${pi}-${li}`)"
              @keydown.enter.space.prevent="toggle(`${pi}-${li}`)"
              ><RubyText :text="l.jp"
            /></span>
          </p>
          <p v-if="para.some((_, li) => shown(`${pi}-${li}`))" class="read__de">
            {{ para.filter((_, li) => shown(`${pi}-${li}`)).map((l) => l.de).join(' ') }}
          </p>
        </div>
      </template>
    </div>
    <p class="read__hint">Tippe einen Satz an, um seine Übersetzung (und die Furigana) einzeln aufzudecken.</p>

    <div class="read__quiz">
      <div class="read__qbar">
        <strong class="read__qtitle">Fragen zum Text</strong>
        <span class="read__score"><strong>{{ right }}</strong> von {{ answered }} richtig · {{ questions.length - answered }} offen</span>
        <button type="button" class="read__reset" :disabled="!answered" @click="reset">Neu starten</button>
      </div>
      <ol class="read__questions">
        <li
          v-for="(q, i) in questions"
          :key="i"
          :class="{ 'is-right': chosen[i] !== undefined && chosen[i] === q.answer, 'is-wrong': chosen[i] !== undefined && chosen[i] !== q.answer }"
        >
          <p class="read__q" lang="ja"><RubyText :text="q.jp" /></p>
          <p class="read__qde">{{ q.de }}</p>
          <div class="read__options" role="group" :aria-label="`Antwort für Frage ${i + 1}`">
            <button
              v-for="o in q.options"
              :key="o"
              type="button"
              lang="ja"
              :disabled="chosen[i] !== undefined"
              :class="{ 'is-correct': chosen[i] !== undefined && o === q.answer, 'is-picked': chosen[i] === o }"
              @click="chosen[i] = o"
            >
              <RubyText :text="o" />
            </button>
          </div>
          <p v-if="chosen[i] !== undefined" class="read__why">
            <strong>{{ chosen[i] === q.answer ? 'Richtig!' : 'Nicht ganz.' }}</strong> {{ q.why }}
          </p>
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.read {
  margin: 20px 0;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}

.read p { margin: 0; }

.read__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.read__title { font-size: 22px; font-weight: 700; line-height: 2; color: var(--vp-c-brand-1); }

.read__toggles { display: flex; flex-wrap: wrap; gap: 8px; }

.read__toggles button,
.read__reset {
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 999px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  transition: filter 0.2s ease;
}

.read__toggles button:hover { filter: brightness(1.1); }
.read__toggles button[aria-pressed='true'] { color: var(--vp-c-white); background: var(--vp-c-brand-1); }
.read__reset:disabled { opacity: 0.4; cursor: default; }

.read__words {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 2px 16px;
  margin: 0 0 14px;
  padding: 12px 16px;
  border-radius: 12px;
  background: var(--vp-c-bg);
  font-size: 15px;
}

.read__words dt { font-size: 17px; line-height: 2; }
.read__words dd { margin: 0; align-self: center; color: var(--vp-c-text-2); }

.read__text {
  padding: 14px 18px;
  border-radius: 12px;
  background: var(--vp-c-bg);
}

.read__para + .read__para,
.read__para + .read__dialog,
.read__dialog + .read__para,
.read__dialog + .read__dialog { margin-top: 14px; }

.read__jp { font-size: 20px; line-height: 2.3; color: var(--vp-c-text-1); }

.read__dialog { display: grid; gap: 6px; }
.read__line { display: grid; grid-template-columns: 4.5em 1fr; gap: 8px; font-size: 20px; line-height: 2.3; }
.read__speaker { font-size: 16px; font-weight: 700; color: var(--vp-c-text-2); }

.read__sent {
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.read__sent:hover,
.read__sent:focus-visible { background: var(--vp-c-brand-soft); outline: none; }
.read__sent.is-open { background: var(--vp-c-yellow-soft); }

.read__de { margin: 2px 0 4px !important; font-size: 15px; line-height: 1.6; color: var(--vp-c-text-2); }

.read__hint { margin-top: 8px !important; font-size: 13px; color: var(--vp-c-text-3); }

.read__quiz { margin-top: 18px; }

.read__qbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 14px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.read__qtitle { font-size: 16px; color: var(--vp-c-text-1); }
.read__score { margin-right: auto; }
.read__score strong { font-size: 18px; color: var(--vp-c-brand-1); }

.vp-doc .read__questions { margin: 6px 0 0; padding-left: 1.6em; }

.vp-doc .read__questions li {
  margin: 0;
  padding: 12px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.vp-doc .read__questions li:last-child { border-bottom: none; }
.read__questions li::marker { color: var(--vp-c-text-3); font-size: 14px; }

.read__q { font-size: 18px; line-height: 2.1; color: var(--vp-c-text-1); }
.read__qde { font-size: 14px; color: var(--vp-c-text-2); }

.read__options { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }

.read__options button {
  padding: 4px 12px;
  font-size: 16px;
  line-height: 2;
  text-align: left;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.read__options button:not(:disabled):hover { border-color: var(--vp-c-brand-1); transform: translateY(-1px); }
.read__options button:disabled { cursor: default; opacity: 0.5; }
.read__options button.is-picked { opacity: 1; border-color: var(--vp-c-red-1); background: var(--vp-c-red-soft); }
.read__options button.is-correct { opacity: 1; border-color: var(--vp-c-green-1); background: var(--vp-c-green-soft); }

.read__why { margin-top: 8px !important; font-size: 14px; color: var(--vp-c-text-2); }
.is-right .read__why strong { color: var(--vp-c-green-1); }
.is-wrong .read__why strong { color: var(--vp-c-red-1); }

/* Eigener Furigana-Schalter schlägt die globale Einstellung; aufgedeckte Sätze und die Wortliste zeigen sie immer */
.read.furi-on :deep(rt) { visibility: visible; }
.read.furi-off :deep(rt) { visibility: hidden; }
.read .read__sent.is-open :deep(rt),
.read .read__words :deep(rt) { visibility: visible; }

@media (max-width: 480px) {
  .read { padding: 14px 12px; }
  .read__text { padding: 12px; }
  .read__line { grid-template-columns: 1fr; gap: 0; }
}

@media print {
  .read__toggles,
  .read__hint,
  .read__reset,
  .read__score { display: none; }
  .vp-doc .read__questions li { break-inside: avoid; }
}
</style>
