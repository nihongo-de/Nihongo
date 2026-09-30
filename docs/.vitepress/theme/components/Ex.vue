<script setup lang="ts">
import { computed } from 'vue'
import RubyText from './RubyText.vue'
import SpeakButton from './SpeakButton.vue'
import { parseRuby } from '../utils/ruby'

const props = defineProps<{
  /** Japanisch. Syntax: 漢字[かんじ] = Furigana, {は} = Hervorhebung */
  jp: string
  ro?: string
  de: string
}>()

const parts = computed(() =>
  props.jp
    .split(/(\{[^}]+\})/)
    .filter(Boolean)
    .map((chunk) => {
      const mark = chunk.startsWith('{') && chunk.endsWith('}')
      return { mark, text: mark ? chunk.slice(1, -1) : chunk }
    })
)

const plain = computed(() => parseRuby(props.jp.replace(/[{}]/g, '')).map((s) => s.text).join(''))
</script>

<template>
  <div class="ex">
    <SpeakButton class="ex__speak" :text="plain" />
    <p class="ex__jp" lang="ja">
      <component :is="part.mark ? 'mark' : 'span'" v-for="(part, pi) in parts" :key="pi">
        <RubyText :text="part.text" />
      </component>
    </p>
    <p v-if="ro" class="ex__ro">{{ ro }}</p>
    <p class="ex__de">{{ de }}</p>
  </div>
</template>

<style scoped>
.ex {
  position: relative;
  margin: 12px 0;
  padding: 14px 44px 14px 18px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border-left: 4px solid var(--vp-c-brand-1);
}

.ex p { margin: 0; }

.ex__speak { position: absolute; top: 10px; right: 8px; }

.ex__jp {
  font-size: 19px;
  line-height: 2.1;
  color: var(--vp-c-text-1);
}

.ex__jp mark {
  padding: 1px 4px;
  border-radius: 5px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.ex__ro {
  font-size: 13px;
  font-style: italic;
  color: var(--vp-c-text-3);
}

.ex__de {
  margin-top: 2px !important;
  font-size: 15px;
  color: var(--vp-c-text-2);
}
</style>
