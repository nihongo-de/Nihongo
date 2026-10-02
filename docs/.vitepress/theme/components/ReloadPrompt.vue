<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const HOUR = 60 * 60 * 1000

const needRefresh = ref(false)
const reloading = ref(false)
let updateSW: ((reload?: boolean) => Promise<void>) | undefined
let check: (() => Promise<void>) | undefined
let registration: ServiceWorkerRegistration | undefined
let timer: ReturnType<typeof setInterval> | undefined

function onVisible() {
  if (document.visibilityState === 'visible') check?.()
}

onMounted(async () => {
  if (!('serviceWorker' in navigator)) return
  const { registerSW } = await import('virtual:pwa-register')
  updateSW = registerSW({
    immediate: true,
    onNeedRefresh: () => (needRefresh.value = true),
    onRegisteredSW(swUrl, reg) {
      if (!reg) return
      registration = reg
      let last = 0
      // Kein Update-Check, wenn offline oder gerade schon einer läuft
      check = async () => {
        if (reg.installing || !navigator.onLine || Date.now() - last < 60_000) return
        last = Date.now()
        try {
          const res = await fetch(swUrl, { cache: 'no-store', headers: { 'cache-control': 'no-cache' } })
          if (res.status === 200) await reg.update()
        } catch {}
      }
      timer = setInterval(check, HOUR)
      // Die App vom Startbildschirm wird meist nur aus dem Hintergrund geholt, nicht neu geladen
      document.addEventListener('visibilitychange', onVisible)
    }
  })
})

onUnmounted(() => {
  clearInterval(timer)
  document.removeEventListener('visibilitychange', onVisible)
})

function reload() {
  reloading.value = true
  const done = () => window.location.reload()
  // updateSW lädt nur bei controllerchange neu – der kommt nicht, wenn die Seite ohne SW geladen wurde
  const waiting = registration?.waiting
  if (!waiting) return done()
  waiting.addEventListener('statechange', () => waiting.state === 'activated' && done())
  navigator.serviceWorker.addEventListener('controllerchange', done)
  setTimeout(done, 5000)
  updateSW?.(true)
}
</script>

<template>
  <div v-if="needRefresh" class="reload-prompt" role="alert">
    <span>Neue Inhalte verfügbar.</span>
    <button type="button" class="reload-prompt__main" :disabled="reloading" @click="reload">
      {{ reloading ? 'Lädt …' : 'Neu laden' }}
    </button>
    <button type="button" class="reload-prompt__later" @click="needRefresh = false">Später</button>
  </div>
</template>

<style scoped>
.reload-prompt {
  position: fixed;
  z-index: 100;
  left: 50%;
  bottom: max(16px, env(safe-area-inset-bottom));
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: calc(100vw - 32px);
  padding: 10px 12px 10px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-3);
  font-size: 14px;
}

.reload-prompt button {
  flex: none;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 500;
}

.reload-prompt__main { color: var(--vp-c-white); background: var(--vp-c-brand-1); }
.reload-prompt__main:hover { background: var(--vp-c-brand-2); }
.reload-prompt__later { color: var(--vp-c-text-2); }
.reload-prompt__later:hover { color: var(--vp-c-text-1); }

@media print {
  .reload-prompt { display: none; }
}
</style>
