<!-- src/views/DashboardView.vue -->
<template>
  <section class="bg-surface min-vh-100">
    <div class="container-fluid px-4 py-4">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 text-strong mb-0">Dashboard — {{ device?.name || 'Dispositivo' }}</h1>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'home' }">← Voltar</router-link>
      </div>

      <div v-if="device" class="row g-4">
        <!-- Gráfico scatter com quedas nas últimas 24h -->
        <div class="col-12 col-lg-8">
          <Scatter :deviceName="device.name" :outages="outageHours" />
        </div>

        <!-- Resumo de quedas -->
        <div class="col-12 col-lg-4">
          <div class="card h-100">
            <div class="card-body">
              <h2 class="h5 text-strong mb-3">Resumo de quedas</h2>
              <ul class="list-unstyled mb-3">
                <li><strong>Categoria:</strong> {{ device.category }}</li>
                <li><strong>Potência nominal:</strong> {{ device.powerW }} W</li>
                <li><strong>Essencial:</strong> {{ device.critical ? 'Sim' : 'Não' }}</li>
                <li><strong>Total de quedas (24h):</strong> {{ outageHours.length }}</li>
              </ul>

              <h3 class="h6 text-strong mb-2">Horas com queda</h3>
              <p class="mb-0 text-muted">
                {{ outageHours.length ? outageHours.map(h => `${h}:00`).join(', ') : 'Nenhuma queda registrada' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Gráfico de linha (24h) de consumo -->
        <div class="col-12">
          <Linha :label="device.name" :series="usageSeries" />
        </div>

        <!-- Métricas de consumo -->
        <div class="col-12">
          <div class="row row-cols-2 row-cols-md-4 g-3">
            <div class="col">
              <div class="p-3 rounded-3 border h-100">
                <div class="text-subtle small">Média (24h)</div>
                <div class="h4 text-strong mb-0">{{ metrics.avgW }} W</div>
              </div>
            </div>
            <div class="col">
              <div class="p-3 rounded-3 border h-100">
                <div class="text-subtle small">Pico</div>
                <div class="h4 text-strong mb-0">
                  {{ metrics.maxW }} W
                  <small class="text-muted">({{ metrics.maxHour }}:00)</small>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="p-3 rounded-3 border h-100">
                <div class="text-subtle small">Mínimo</div>
                <div class="h4 text-strong mb-0">
                  {{ metrics.minW }} W
                  <small class="text-muted">({{ metrics.minHour }}:00)</small>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="p-3 rounded-3 border h-100">
                <div class="text-subtle small">Energia (24h)</div>
                <div class="h4 text-strong mb-0">
                  {{ metrics.energyWh }} Wh
                  <small class="text-muted">({{ metrics.energyKWh }} kWh)</small>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div v-else class="alert alert-warning mt-4">Dispositivo não encontrado.</div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Scatter from '@/components/graphs/Scatter.vue'
import Linha from '@/components/graphs/Linha.vue'

const route = useRoute()
const id = String(route.params.id)

// Catálogo mock (mesmo padrão do app)
const catalog = [
  { id: '1', name: 'Geladeira',            category: 'Cozinha',    powerW: 150, critical: true  },
  { id: '2', name: 'Computador',           category: 'Escritório', powerW: 300, critical: false },
  { id: '3', name: 'Lâmpada',              category: 'Iluminação', powerW: 10,  critical: false },
  { id: '4', name: 'Televisão',            category: 'Sala',       powerW: 100, critical: false },
  { id: '5', name: 'Portão Automático',    category: 'Acesso',     powerW: 400, critical: true  },
  { id: '6', name: 'Câmeras de Segurança', category: 'Segurança',  powerW: 30,  critical: true  }
]

const device = computed(() => catalog.find(d => d.id === id))

/* ================================================================
   QUEDAS DE ENERGIA (24h) — FAKE POR TIPO
   ================================================================ */
function genOutagesFor(deviceName) {
  const baseLambda = {
    'Geladeira': 4,
    'Computador': 3,
    'Lâmpada': 2,
    'Televisão': 2,
    'Portão Automático': 3,
    'Câmeras de Segurança': 5
  }[deviceName] ?? 3

  const k = Math.max(0, Math.min(12, Math.round(randPoisson(baseLambda))))
  const hours = Array.from({ length: 24 }, (_, i) => i)
  shuffle(hours)
  return hours.slice(0, k).sort((a,b) => a - b)
}
function randPoisson(lambda) {
  const L = Math.exp(-lambda)
  let p = 1.0, k = 0
  do { k++; p *= Math.random() } while (p > L)
  return k - 1
}
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
const outageHours = computed(() => (device.value ? genOutagesFor(device.value.name) : []))

/* ================================================================
   CONSUMO (24h) — SÉRIE “FAKE” ESTÁTICA POR DISPOSITIVO (LocalStorage)
   ================================================================ */
const LS_KEY_PREFIX = 'usageSeries:v1:' // altere a versão se quiser resetar tudo

function loadSeriesFromLS(devId) {
  try {
    const raw = localStorage.getItem(LS_KEY_PREFIX + devId)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}
function saveSeriesToLS(devId, arr) {
  try { localStorage.setItem(LS_KEY_PREFIX + devId, JSON.stringify(arr)) } catch {}
}

function hourArray() { return Array.from({ length: 24 }, (_, i) => i) }
function seedRand(seed) {
  let s = seed || 1
  return () => (s = (s * 9301 + 49297) % 233280) / 233280
}
function buildProfile(name, r) {
  const profiles = {
    'Geladeira': (h) => 0.75 + 0.25 * Math.sin((h / 24) * 2 * Math.PI) + (r() - 0.5) * 0.05,
    'Computador': (h) => (h >= 9 && h <= 22 ? 0.6 + r() * 0.5 : 0.05 + r() * 0.05),
    'Câmeras de Segurança': (h) => 0.5 + r() * 0.2,
    'Lâmpada': (h) => (h >= 18 || h <= 6 ? 0.5 + r() * 0.5 : 0.02 + r() * 0.02),
    'Televisão': (h) => (h >= 18 && h <= 23 ? 0.5 + r() * 0.6 : 0.05 + r() * 0.05),
    'Portão Automático': (h) => (r() < 0.08 ? 1.0 + r() * 0.5 : 0.02 + r() * 0.01)
  }
  return profiles[name] || (() => 0.3 + Math.random() * 0.4) // fallback
}

function genUsageSeriesFor(dev) {
  if (!dev) return Array(24).fill(0)
  // gerador determinístico usando o id como semente
  const rnd = seedRand(Number(dev.id || 1) * 123 + 7)
  const profile = buildProfile(dev.name, rnd)
  const base = Math.max(1, dev.powerW || 100)
  return hourArray().map(h => {
    const p = profile(h)               // fator 0..1
    const noise = (rnd() - 0.5) * 0.06 // ±6% ruído controlado (determinístico)
    const watts = Math.max(0, Math.round(base * Math.max(0, p + noise)))
    return watts
  })
}

// Série estática: carrega do LS; se não existir, gera e salva
const usageSeries = ref(Array(24).fill(0))
onMounted(() => {
  if (!device.value) return
  const key = device.value.id
  const stored = loadSeriesFromLS(key)
  if (stored && Array.isArray(stored) && stored.length === 24) {
    usageSeries.value = stored
  } else {
    const fresh = genUsageSeriesFor(device.value)
    usageSeries.value = fresh
    saveSeriesToLS(key, fresh)
  }
})

/* ================================================================
   MÉTRICAS DERIVADAS DA SÉRIE 24h
   ================================================================ */
const metrics = computed(() => {
  const s = usageSeries.value || []
  if (s.length === 0) {
    return { avgW: 0, maxW: 0, minW: 0, maxHour: '-', minHour: '-', energyWh: 0, energyKWh: '0.000' }
  }
  const sum = s.reduce((a, b) => a + b, 0)
  const avg = Math.round(sum / s.length)
  let maxW = -Infinity, minW = Infinity, iMax = 0, iMin = 0
  s.forEach((v, i) => {
    if (v > maxW) { maxW = v; iMax = i }
    if (v < minW) { minW = v; iMin = i }
  })
  const energyWh = sum
  const energyKWh = (energyWh / 1000).toFixed(3)
  return { avgW: avg, maxW, minW, maxHour: iMax, minHour: iMin, energyWh, energyKWh }
})
</script>

<style scoped>
.bg-surface { background: var(--surface); }
</style>
