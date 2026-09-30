<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import RubyText from './RubyText.vue'
import StrokeDialog from './StrokeDialog.vue'
import SpeakButton from './SpeakButton.vue'
import { parseRuby } from '../utils/ruby'
import { loadRatings, ratingLabels, ratings } from '../utils/strokes'

const props = defineProps<{
  k: string
  de: string
  on?: string
  kun?: string
  /** Beispielwort in Ruby-Syntax, z. B. 学校[がっこう] */
  ex?: string
  exDe?: string
}>()

const open = ref(false)
const rating = computed(() => ratings.value[props.k])
const exPlain = computed(() => (props.ex ? parseRuby(props.ex).map((s) => s.text).join('') : ''))
onMounted(loadRatings)
</script>

<template>
  <div class="kanji">
    <span v-if="rating" :class="`kanji__rating is-${rating}`" :title="`Selbstbewertung: ${ratingLabels[rating]}`" />
    <button
      type="button"
      class="kanji__char"
      lang="ja"
      title="Strichfolge ansehen und schreiben üben"
      :aria-label="`${k}: Strichfolge und Schreibübung`"
      @click="open = true"
    >
      {{ k }}
    </button>
    <span class="kanji__de">{{ de }}</span>
    <dl class="kanji__readings" lang="ja">
      <template v-if="on"><dt>音</dt><dd>{{ on }}</dd></template>
      <template v-if="kun"><dt>訓</dt><dd>{{ kun }}</dd></template>
    </dl>
    <p v-if="ex" class="kanji__ex">
      <span class="kanji__ex-word"><span lang="ja"><RubyText :text="ex" /></span><SpeakButton :text="exPlain" /></span>
      <small v-if="exDe">{{ exDe }}</small>
    </p>
    <StrokeDialog v-if="open" :text="k" :label="de" @close="open = false" />
  </div>
</template>

<style scoped>
.kanji {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px 12px;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  text-align: center;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.kanji:hover { transform: translateY(-2px); border-color: var(--vp-c-brand-1); }

.kanji__char {
  padding: 0 10px;
  border-radius: 10px;
  font-size: 44px;
  line-height: 1.15;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.kanji__char:hover,
.kanji__char:focus-visible { color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }

.kanji__de { font-weight: 600; font-size: 14px; }

.kanji__readings {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2px 8px;
  margin: 4px 0 0;
  font-size: 13px;
  text-align: left;
}

.kanji__readings dt {
  font-size: 11px;
  font-weight: 700;
  padding: 0 5px;
  border-radius: 4px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.kanji__readings dd { margin: 0; color: var(--vp-c-text-2); }

.kanji__ex {
  display: flex;
  flex-direction: column;
  margin: 6px 0 0 !important;
  padding-top: 6px;
  width: 100%;
  border-top: 1px dashed var(--vp-c-divider);
  line-height: 1.9;
}

.kanji__ex [lang='ja'] { font-size: 16px; }
.kanji__ex-word { display: inline-flex; align-items: center; justify-content: center; gap: 2px; }
.kanji__ex small { font-size: 12px; line-height: 1.4; color: var(--vp-c-text-2); }

.kanji__rating {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.kanji__rating.is-again { background: var(--vp-c-danger-1); }
.kanji__rating.is-almost { background: var(--vp-c-warning-1); }
.kanji__rating.is-good { background: var(--vp-c-success-1); }

@media print {
  .kanji__rating { display: none; }
}
</style>
