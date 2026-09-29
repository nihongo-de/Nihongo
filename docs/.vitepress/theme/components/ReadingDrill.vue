<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { findN5Group } from '../data/n5'
import RubyText from './RubyText.vue'

const props = defineProps<{ group: string }>()
const group = computed(() => findN5Group(props.group))

const furigana = ref(true)
const translation = ref(false)
const revealed = reactive(new Set<number>())

const toggle = (i: number) => (revealed.has(i) ? revealed.delete(i) : revealed.add(i))
</script>

<template>
  <div v-if="group" class="drill" :class="{ 'no-furigana': !furigana }">
    <div class="drill__bar">
      <span class="drill__kanji" lang="ja">{{ group.kanji.map((c) => c.k).join(' ') }}</span>
      <div class="drill__toggles">
        <button type="button" :aria-pressed="!furigana" @click="furigana = !furigana">
          {{ furigana ? 'Furigana ausblenden' : 'Furigana zeigen' }}
        </button>
        <button type="button" :aria-pressed="translation" @click="translation = !translation">
          {{ translation ? 'Übersetzung ausblenden' : 'Übersetzung zeigen' }}
        </button>
      </div>
    </div>
    <ol class="drill__list">
      <li v-for="(s, i) in group.sentences" :key="i" :class="{ 'is-open': revealed.has(i) }">
        <button type="button" class="drill__jp" lang="ja" title="Antippen für die Lösung" @click="toggle(i)">
          <RubyText :text="s.jp" />
        </button>
        <div v-show="translation || revealed.has(i)" class="drill__solution">
          <p class="drill__ro">{{ s.ro }}</p>
          <p class="drill__de">{{ s.de }}</p>
        </div>
      </li>
    </ol>
    <p class="drill__hint">Tippe einen Satz an, um Lesung und Übersetzung einzeln aufzudecken.</p>
  </div>
</template>

<style scoped>
.drill {
  margin: 20px 0;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}

.drill__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
}

.drill__kanji {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--vp-c-brand-1);
}

.drill__toggles { display: flex; flex-wrap: wrap; gap: 8px; }

.drill__toggles button {
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 999px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  transition: filter 0.2s ease;
}

.drill__toggles button:hover { filter: brightness(1.1); }

.vp-doc .drill__list {
  margin: 0;
  padding-left: 1.6em;
}

.vp-doc .drill__list li {
  margin: 0;
  padding: 10px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.vp-doc .drill__list li:last-child { border-bottom: none; }
.drill__list li::marker { color: var(--vp-c-text-3); font-size: 14px; }

.drill__jp {
  display: block;
  width: 100%;
  padding: 0;
  text-align: left;
  font-size: 20px;
  line-height: 2.2;
  color: var(--vp-c-text-1);
  cursor: pointer;
}

.drill__jp:hover { color: var(--vp-c-brand-1); }

.no-furigana li:not(.is-open) .drill__jp :deep(rt) { visibility: hidden; }

.drill__solution p { margin: 0; }
.drill__ro { font-size: 13px; font-style: italic; color: var(--vp-c-text-3); }
.drill__de { font-size: 15px; color: var(--vp-c-text-2); }

.drill__hint {
  margin: 10px 0 0 !important;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

@media print {
  .drill__toggles,
  .drill__hint { display: none; }
  .vp-doc .drill__list li { break-inside: avoid; }
}
</style>
