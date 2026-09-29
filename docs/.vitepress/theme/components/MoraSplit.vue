<script setup lang="ts">
import { computed } from 'vue'
import { splitMora } from '../utils/mora'

const props = defineProps<{
  kana: string
  ro?: string
  de?: string
}>()

const morae = computed(() => splitMora(props.kana))
const SPECIAL = new Set(['っ', 'ッ', 'ん', 'ン', 'ー'])
</script>

<template>
  <div class="mora">
    <div class="mora__boxes" lang="ja">
      <span
        v-for="(m, i) in morae"
        :key="i"
        class="mora__box"
        :class="{ 'is-special': SPECIAL.has(m) }"
      >{{ m }}</span>
    </div>
    <div class="mora__info">
      <span class="mora__count">{{ morae.length }} Moren</span>
      <span v-if="ro" class="mora__ro">{{ ro }}</span>
      <span v-if="de" class="mora__de">{{ de }}</span>
    </div>
  </div>
</template>

<style scoped>
.mora {
  display: inline-flex;
  flex-direction: column;
  gap: 8px;
  margin: 8px 12px 8px 0;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  vertical-align: top;
}

.mora__boxes { display: flex; gap: 4px; }

.mora__box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 9px;
  font-size: 20px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
}

.mora__box.is-special {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.mora__info {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 10px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.mora__count { font-weight: 700; color: var(--vp-c-brand-1); }
.mora__ro { font-style: italic; }
</style>
