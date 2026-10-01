<script setup lang="ts">
import { canSpeak, speak, speaking } from '../utils/settings'

defineProps<{ text: string }>()
</script>

<template>
  <button
    v-if="canSpeak(text)"
    type="button"
    class="speak"
    :class="{ 'is-active': speaking === text }"
    title="Vorlesen"
    :aria-label="`Vorlesen: ${text}`"
    @click.stop="speak(text)"
  >
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4 9h4l5-4v14l-5-4H4z" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7" />
      <path d="M19 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  </button>
</template>

<style scoped>
.speak {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: var(--vp-c-text-3);
  transition: color 0.2s, background-color 0.2s;
}

.speak:hover,
.speak:focus-visible { color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.speak.is-active { color: var(--vp-c-brand-1); }

@media print {
  .speak { display: none; }
}
</style>
