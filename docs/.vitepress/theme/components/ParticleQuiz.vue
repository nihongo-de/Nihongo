<script setup lang="ts">
import { computed, reactive } from 'vue'
import { particleSets } from '../data/particles'
import RubyText from './RubyText.vue'

const props = defineProps<{ set: string }>()

// Deterministisch mischen, damit Server- und Client-Rendering übereinstimmen
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)
const mix = (options: string[], seed: string) =>
  [...options].sort((a, b) => hash(a + seed) - hash(b + seed))

const items = computed(() =>
  (particleSets[props.set] ?? []).map((item) => {
    const [before, after = ''] = item.jp.split('＿')
    return { ...item, before, after, options: mix(item.options.split(' '), item.jp), answers: item.answer.split('/') }
  })
)

const chosen = reactive<Record<number, string>>({})
const answered = computed(() => Object.keys(chosen).length)
const right = computed(() => items.value.filter((it, i) => it.answers.includes(chosen[i])).length)

const label = (p: string) => (p === '-' ? '∅' : p)
const blank = (item: { answers: string[] }, i: number) =>
  chosen[i] === undefined ? '？' : label(item.answers.includes(chosen[i]) ? chosen[i] : item.answers[0])

function reset() {
  for (const key of Object.keys(chosen)) delete chosen[Number(key)]
}
</script>

<template>
  <div class="pquiz">
    <div class="pquiz__bar">
      <span class="pquiz__score">
        <strong>{{ right }}</strong> von {{ answered }} richtig · {{ items.length - answered }} offen
      </span>
      <button type="button" class="pquiz__reset" :disabled="!answered" @click="reset">Neu starten</button>
    </div>
    <ol class="pquiz__list">
      <li
        v-for="(item, i) in items"
        :key="i"
        :class="{ 'is-right': chosen[i] !== undefined && item.answers.includes(chosen[i]), 'is-wrong': chosen[i] !== undefined && !item.answers.includes(chosen[i]) }"
      >
        <p class="pquiz__jp" lang="ja">
          <RubyText :text="item.before" /><span class="pquiz__blank">{{ blank(item, i) }}</span><RubyText :text="item.after" />
        </p>
        <p class="pquiz__de">{{ item.de }}</p>
        <div class="pquiz__options" role="group" :aria-label="`Antwort für Satz ${i + 1}`">
          <button
            v-for="o in item.options"
            :key="o"
            type="button"
            lang="ja"
            :title="o === '-' ? 'keine Partikel' : undefined"
            :disabled="chosen[i] !== undefined"
            :class="{
              'is-correct': chosen[i] !== undefined && item.answers.includes(o),
              'is-picked': chosen[i] === o
            }"
            @click="chosen[i] = o"
          >
            {{ label(o) }}
          </button>
        </div>
        <p v-if="chosen[i] !== undefined" class="pquiz__why">
          <strong>{{ item.answers.includes(chosen[i]) ? 'Richtig!' : 'Nicht ganz.' }}</strong> {{ item.why }}
        </p>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.pquiz {
  margin: 20px 0;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}

.pquiz__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.pquiz__score strong { font-size: 18px; color: var(--vp-c-brand-1); }

.pquiz__reset {
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 999px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.pquiz__reset:disabled { opacity: 0.4; cursor: default; }

.vp-doc .pquiz__list { margin: 0; padding-left: 1.6em; }

.vp-doc .pquiz__list li {
  margin: 0;
  padding: 12px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.vp-doc .pquiz__list li:last-child { border-bottom: none; }
.pquiz__list li::marker { color: var(--vp-c-text-3); font-size: 14px; }

.pquiz p { margin: 0; }

.pquiz__jp { font-size: 20px; line-height: 2.2; color: var(--vp-c-text-1); }

.pquiz__blank {
  display: inline-block;
  min-width: 2.2em;
  margin: 0 3px;
  padding: 0 6px;
  border-bottom: 2px solid var(--vp-c-text-3);
  line-height: 1.5;
  text-align: center;
  font-weight: 700;
  color: var(--vp-c-text-3);
}

.is-right .pquiz__blank { color: var(--vp-c-green-1); border-color: var(--vp-c-green-1); }
.is-wrong .pquiz__blank { color: var(--vp-c-red-1); border-color: var(--vp-c-red-1); }

.pquiz__de { font-size: 14px; color: var(--vp-c-text-2); }

.pquiz__options { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }

.pquiz__options button {
  min-width: 48px;
  padding: 4px 12px;
  font-size: 17px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.pquiz__options button:not(:disabled):hover { border-color: var(--vp-c-brand-1); transform: translateY(-1px); }
.pquiz__options button:disabled { cursor: default; opacity: 0.5; }
.pquiz__options button.is-picked { opacity: 1; border-color: var(--vp-c-red-1); background: var(--vp-c-red-soft); }
.pquiz__options button.is-correct { opacity: 1; border-color: var(--vp-c-green-1); background: var(--vp-c-green-soft); }

.pquiz__why { margin-top: 8px !important; font-size: 14px; color: var(--vp-c-text-2); }
.is-right .pquiz__why strong { color: var(--vp-c-green-1); }
.is-wrong .pquiz__why strong { color: var(--vp-c-red-1); }

@media print {
  .pquiz__bar { display: none; }
  .vp-doc .pquiz__list li { break-inside: avoid; }
}
</style>
