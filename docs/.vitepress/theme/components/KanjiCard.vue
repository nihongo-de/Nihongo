<script setup lang="ts">
import RubyText from './RubyText.vue'

defineProps<{
  k: string
  de: string
  on?: string
  kun?: string
  /** Beispielwort in Ruby-Syntax, z. B. 学校[がっこう] */
  ex?: string
  exDe?: string
}>()
</script>

<template>
  <div class="kanji">
    <span class="kanji__char" lang="ja">{{ k }}</span>
    <span class="kanji__de">{{ de }}</span>
    <dl class="kanji__readings" lang="ja">
      <template v-if="on"><dt>音</dt><dd>{{ on }}</dd></template>
      <template v-if="kun"><dt>訓</dt><dd>{{ kun }}</dd></template>
    </dl>
    <p v-if="ex" class="kanji__ex">
      <span lang="ja"><RubyText :text="ex" /></span>
      <small v-if="exDe">{{ exDe }}</small>
    </p>
  </div>
</template>

<style scoped>
.kanji {
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
  font-size: 44px;
  line-height: 1.15;
  font-weight: 500;
}

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
.kanji__ex small { font-size: 12px; line-height: 1.4; color: var(--vp-c-text-2); }
</style>
