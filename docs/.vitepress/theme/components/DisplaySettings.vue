<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { initSettings, settings, speak, voices } from '../utils/settings'

const open = ref(false)
const root = ref<HTMLElement>()
const supported = ref(true)

function onPointer(e: PointerEvent) {
  if (open.value && !root.value?.contains(e.target as Node)) open.value = false
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  initSettings()
  supported.value = 'speechSynthesis' in window
  document.addEventListener('pointerdown', onPointer)
  document.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  document.removeEventListener('pointerdown', onPointer)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div ref="root" class="ds">
    <button
      type="button"
      class="ds__toggle"
      title="Anzeige & Vorlesen"
      aria-label="Anzeige & Vorlesen"
      aria-haspopup="true"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span lang="ja" aria-hidden="true">あ</span>
    </button>

    <div v-if="open" class="ds__panel">
      <p class="ds__label">Anzeigen</p>
      <label class="ds__check"><input v-model="settings.furigana" type="checkbox" /> Furigana über Kanji <span class="ds__muted" lang="ja">漢字<small>かんじ</small></span></label>
      <label class="ds__check"><input v-model="settings.romaji" type="checkbox" /> Rōmaji in Beispielsätzen</label>

      <p class="ds__label">Vorlesen</p>
      <template v-if="voices.length">
        <label class="ds__row">
          Tempo
          <input v-model.number="settings.rate" type="range" min="0.5" max="1.3" step="0.1" />
          <span class="ds__muted">{{ settings.rate.toFixed(1) }}×</span>
        </label>
        <label v-if="voices.length > 1" class="ds__row">
          Stimme
          <select v-model="settings.voice">
            <option value="">Standard</option>
            <option v-for="v in voices" :key="v.voiceURI" :value="v.voiceURI">{{ v.name }}</option>
          </select>
        </label>
        <button type="button" class="ds__test" @click="speak('こんにちは。日本語を勉強しています。')">Probe hören</button>
        <p class="ds__hint">Das Lautsprecher-Symbol neben Beispielsätzen und Wörtern liest sie vor.</p>
      </template>
      <p v-else class="ds__hint">
        {{ supported ? 'Keine japanische Stimme gefunden. Installiere eine japanische Sprachausgabe in deinem System oder nutze einen anderen Browser, dann erscheinen die Vorlese-Knöpfe.' : 'Dein Browser unterstützt keine Sprachausgabe.' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.ds { position: relative; }

.ds__toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-left: 8px;
  font-size: 17px;
  font-weight: 700;
  color: var(--vp-c-text-2);
  transition: color 0.25s;
}

.ds__toggle:hover,
.ds__toggle[aria-expanded='true'] { color: var(--vp-c-text-1); }

.ds__panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 50;
  width: 300px;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-3);
  font-size: 14px;
}

@media (max-width: 639px) {
  .ds__panel { position: fixed; top: var(--vp-nav-height); right: 12px; left: 12px; width: auto; }
}

.ds__label {
  margin: 12px 4px 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-3);
}

.ds__label:first-child { margin-top: 0; }

.ds__check,
.ds__row { display: flex; align-items: center; gap: 8px; padding: 4px; cursor: pointer; }
.ds__check input { width: 16px; height: 16px; accent-color: var(--vp-c-brand-1); }
.ds__row input[type='range'] { flex: 1; accent-color: var(--vp-c-brand-1); }
.ds__row select {
  flex: 1;
  min-width: 0;
  padding: 2px 6px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
}

.ds__muted { color: var(--vp-c-text-3); font-size: 13px; }
.ds__muted small { font-size: 0.7em; }

.ds__test {
  margin: 6px 4px 0;
  padding: 4px 14px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 999px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.ds__hint { margin: 8px 4px 0; font-size: 12px; line-height: 1.5; color: var(--vp-c-text-2); }
</style>
