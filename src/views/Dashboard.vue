<!-- src/views/DashboardView.vue -->
<template>
  <section class="bg-surface min-vh-100">
    <div class="container-fluid px-4 py-4">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 text-strong mb-0">Dashboard — {{ device?.name || 'Dispositivo' }}</h1>
        <div>
          <router-link
            style="margin-right: 10px;"
            class="btn btn-primary"
            :to="{ name: 'automatizacao', params: { id } }"
            title="Configurar automação deste dispositivo"
          >
            ⚙️ Automatizar
          </router-link>
          <router-link class="btn btn-outline-secondary" :to="{ name: 'home' }">← Voltar</router-link>
        </div>
      </div>

      <div v-if="device" class="row g-4">
        <!-- Scatter: horas das quedas (24h) -->
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

        <!-- Resumo de duração das quedas -->
        <div class="col-12 col-lg-4">
          <div class="card h-100">
            <div class="card-body">
              <h2 class="h5 text-strong mb-3">Resumo de duração das quedas</h2>
              <ul class="list-unstyled mb-3">
                <li><strong>Total de quedas (24h):</strong> {{ outageDurations.length }}</li>
                <li><strong>Soma das durações:</strong> {{ totalMinutes }} min</li>
                <li><strong>Média por queda:</strong> {{ avgMinutes }} min</li>
                <li>
                  <strong>Maior duração:</strong>
                  <template v-if="outageDurations.length">
                    {{ maxDuration.value }} min
                    <small class="text-muted">({{ formatHour(maxDuration.hour) }})</small>
                  </template>
                  <template v-else>—</template>
                </li>
                <li>
                  <strong>Menor duração:</strong>
                  <template v-if="outageDurations.length">
                    {{ minDuration.value }} min
                    <small class="text-muted">({{ formatHour(minDuration.hour) }})</small>
                  </template>
                  <template v-else>—</template>
                </li>
              </ul>

              <h3 class="h6 text-strong mb-2">Horas com duração</h3>
              <p class="mb-0 text-muted">
                <template v-if="outageDurations.length">
                  {{ outageHours.map((h,i) => `${String(h).padStart(2,'0')}:00 — ${outageDurations[i]} min`).join(', ') }}
                </template>
                <template v-else>
                  Nenhuma queda registrada
                </template>
              </p>
            </div>
          </div>
        </div>

        <!-- Barra: duração das quedas (minutos) -->
        <div class="col-12 col-lg-8">
          <Barra
            title="Duração das quedas (minutos)"
            :outages="outageHours"
            :durations="outageDurations"
          />
        </div>

        <!-- Linha: consumo (24h) -->
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
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Scatter from '@/components/graphs/Scatter.vue'
import Linha from '@/components/graphs/Linha.vue'
import Barra from '@/components/graphs/Barra.vue'

/* ========== Router / Catálogo ========== */
const route = useRoute()

// ✅ CORREÇÃO: usar Number para comparar com ids numéricos do catálogo
const id = Number(route.params.id)

const catalog = [
  {
    id: 1,
    name: 'Geladeira Doméstica',
    category: 'Cozinha',
    powerW: 76,
    consumptionMin: 48,
    consumptionMax: 76,
    consumptionAvg: 62,
    estimatedDuration: 7,
    critical: true,
    icon: '🧊'
  },
  {
    id: 2,
    name: 'Freezer Horizontal',
    category: 'Cozinha',
    powerW: 69,
    consumptionMin: 42,
    consumptionMax: 69,
    consumptionAvg: 55,
    estimatedDuration: 7,
    critical: true,
    icon: '❄️'
  },
  {
    id: 3,
    name: 'Computador + Monitor',
    category: 'Escritório',
    powerW: 90,
    consumptionMin: 90,
    consumptionMax: 90,
    consumptionAvg: 90,
    estimatedDuration: 7,
    critical: false,
    icon: '💻'
  },
  {
    id: 4,
    name: 'Notebook',
    category: 'Escritório',
    powerW: 20,
    consumptionMin: 20,
    consumptionMax: 20,
    consumptionAvg: 20,
    estimatedDuration: 7,
    critical: false,
    icon: '🖥️'
  },
  {
    id: 5,
    name: 'Lâmpada de LED',
    category: 'Iluminação',
    powerW: 9,
    consumptionMin: 9,
    consumptionMax: 9,
    consumptionAvg: 9,
    estimatedDuration: 7,
    critical: false,
    icon: '💡'
  },
  {
    id: 6,
    name: 'Roteador Wi-Fi',
    category: 'Comunicação',
    powerW: 7,
    consumptionMin: 7,
    consumptionMax: 7,
    consumptionAvg: 7,
    estimatedDuration: 7,
    critical: true,
    icon: '📶'
  }
]

// ✅ comparação numérica
const device = computed(() => catalog.find(d => Number(d.id) === id))

/* ===== Helpers de classificação por nome (para perfis/limites) ===== */
function baseType(name = '') {
  const n = name.toLowerCase()
  if (n.includes('geladeira')) return 'Geladeira'
  if (n.includes('freezer')) return 'Freezer'
  if (n.includes('portão')) return 'Portão Automático'
  if (n.includes('câmera')) return 'Câmeras de Segurança'
  if (n.includes('televis')) return 'Televisão'
  if (n.includes('lâmpada')) return 'Lâmpada'
  if (n.includes('roteador') || n.includes('wi-fi') || n.includes('wifi')) return 'Roteador'
  if (n.includes('notebook') || n.includes('laptop')) return 'Computador'
  if (n.includes('computador') || n.includes('monitor')) return 'Computador'
  return 'Outro'
}

/* ================================================================
   QUEDAS (24h) — Persistentes no LocalStorage
   ================================================================ */
const LS_OUTAGES_KEY_PREFIX = 'outageHours:v1:'

function loadOutagesFromLS(devId) {
  try {
    const raw = localStorage.getItem(LS_OUTAGES_KEY_PREFIX + devId)
    const arr = raw ? JSON.parse(raw) : null
    return Array.isArray(arr) ? arr : null
  } catch { return null }
}
function saveOutagesToLS(devId, arr) {
  try { localStorage.setItem(LS_OUTAGES_KEY_PREFIX + devId, JSON.stringify(arr)) } catch {}
}

function genOutagesFor(name) {
  const typ = baseType(name)
  const baseLambda = {
    'Geladeira': 4, 'Computador': 3, 'Lâmpada': 2,
    'Televisão': 2, 'Portão Automático': 3, 'Câmeras de Segurança': 5
  }[typ] ?? 3

  const k = Math.max(0, Math.min(12, Math.round(randPoisson(baseLambda))))
  const hours = Array.from({ length: 24 }, (_, i) => i)
  shuffle(hours)
  return hours.slice(0, k).sort((a,b) => a - b)
}
function randPoisson(lambda) {
  const L = Math.exp(-lambda); let p = 1.0, k = 0
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

const outageHours = ref([])

function ensureOutagesForDevice(dev) {
  if (!dev) { outageHours.value = []; return }
  const cached = loadOutagesFromLS(dev.id)
  if (cached) {
    outageHours.value = cached
    return
  }
  const generated = genOutagesFor(dev.name) // primeira vez
  outageHours.value = generated
  saveOutagesToLS(dev.id, generated)
}

onMounted(() => { ensureOutagesForDevice(device.value) })
watch(device, (d) => { ensureOutagesForDevice(d) })

/* ================================================================
   DURAÇÕES (min) — Determinísticas + Persistentes (SEM rand)
   ================================================================ */
const LS_DUR_KEY_PREFIX = 'outageDurations:v1:'

function loadDurationsMap(devId) {
  try {
    const raw = localStorage.getItem(LS_DUR_KEY_PREFIX + devId)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}
function saveDurationsMap(devId, obj) {
  try { localStorage.setItem(LS_DUR_KEY_PREFIX + devId, JSON.stringify(obj)) } catch {}
} // ✅ FECHAMENTO CORRETO DA FUNÇÃO

// Hash determinístico 32-bit (FNV-1a)
function hash32(str) {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h >>> 0
}
function hashToRange(hash, min, max) {
  if (max <= min) return min
  const span = (max - min + 1)
  return min + (hash % span)
}
function durationBoundsFor(name) {
  const typ = baseType(name)
  if (typ === 'Portão Automático')    return { min: 1,  max: 8  }
  if (typ === 'Câmeras de Segurança') return { min: 1,  max: 12 }
  if (typ === 'Televisão')            return { min: 2,  max: 20 }
  if (typ === 'Lâmpada')              return { min: 1,  max: 10 }
  if (typ === 'Computador')           return { min: 2,  max: 25 }
  if (typ === 'Geladeira')            return { min: 2,  max: 30 }
  return { min: 2, max: 20 }
}

const durationsMap = ref({}) // { [hora]: minutos }

function ensureDurationForHour(dev, hour) {
  const key = String(hour)
  if (durationsMap.value[key] != null) return durationsMap.value[key]
  const { min, max } = durationBoundsFor(dev?.name || '')
  const h = hash32(`${dev?.id ?? '0'}|${hour}|dur`)
  const minutes = hashToRange(h, min, max)
  durationsMap.value[key] = minutes
  saveDurationsMap(dev.id, durationsMap.value)
  return minutes
}

const outageDurations = computed(() => {
  if (!device.value) return []
  return outageHours.value.map(h => Number(durationsMap.value[String(h)] ?? 0))
})

onMounted(() => {
  if (!device.value) return
  durationsMap.value = loadDurationsMap(device.value.id) || {}
  outageHours.value.forEach(h => ensureDurationForHour(device.value, h))
})
watch(outageHours, (hours) => {
  if (!device.value) return
  hours.forEach(h => ensureDurationForHour(device.value, h))
})

/* ======= Métricas de duração ======= */
const totalMinutes = computed(() =>
  outageDurations.value.reduce((acc, n) => acc + (Number.isFinite(n) ? n : 0), 0)
)
const avgMinutes = computed(() => outageDurations.value.length
  ? Math.round(totalMinutes.value / outageDurations.value.length)
  : 0
)
const extremes = computed(() => {
  if (!outageDurations.value.length) return { max: { value: 0, hour: '-' }, min: { value: 0, hour: '-' } }
  let max = { value: -Infinity, hour: 0 }
  let min = { value: Infinity, hour: 0 }
  for (let i = 0; i < outageDurations.value.length; i++) {
    const val = outageDurations.value[i]
    const hour = Number(outageHours.value[i])
    if (val > max.value) max = { value: val, hour }
    if (val < min.value) min = { value: val, hour }
  }
  return { max, min }
})
const maxDuration = computed(() => extremes.value.max)
const minDuration = computed(() => extremes.value.min)
function formatHour(h) {
  if (h === '-' || h == null || Number.isNaN(Number(h))) return '-'
  return `${String(h).padStart(2, '0')}:00`
}

/* ================================================================
   CONSUMO (24h) — Persistente (LocalStorage)
   ================================================================ */
const LS_USAGE_KEY_PREFIX = 'usageSeries:v1:'

function loadSeriesFromLS(devId) {
  try {
    const raw = localStorage.getItem(LS_USAGE_KEY_PREFIX + devId)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}
function saveSeriesToLS(devId, arr) {
  try {
    localStorage.setItem(LS_USAGE_KEY_PREFIX + devId, JSON.stringify(arr))
  } catch {}
}

function hourArray() { return Array.from({ length: 24 }, (_, i) => i) }
function seedRandUsage(seed) {
  let s = seed || 1
  return () => (s = (s * 9301 + 49297) % 233280) / 233280
}
function buildProfile(name, r) {
  const typ = baseType(name)
  const profiles = {
    'Geladeira': (h) => 0.75 + 0.25 * Math.sin((h / 24) * 2 * Math.PI) + (r() - 0.5) * 0.05,
    'Computador': (h) => (h >= 9 && h <= 22 ? 0.6 + r() * 0.5 : 0.05 + r() * 0.05),
    'Câmeras de Segurança': (h) => 0.5 + r() * 0.2,
    'Lâmpada': (h) => (h >= 18 || h <= 6 ? 0.5 + r() * 0.5 : 0.02 + r() * 0.02),
    'Televisão': (h) => (h >= 18 && h <= 23 ? 0.5 + r() * 0.6 : 0.05 + r() * 0.05),
    'Portão Automático': (h) => (r() < 0.08 ? 1.0 + r() * 0.5 : 0.02 + r() * 0.01),
    'Freezer': (h) => 0.7 + 0.2 * Math.sin((h / 24) * 2 * Math.PI + 0.5) + (r() - 0.5) * 0.05,
    'Roteador': () => 0.35 + r() * 0.1
  }
  return profiles[typ] || (() => 0.3 + Math.random() * 0.4)
}

function genUsageSeriesFor(dev) {
  if (!dev) return Array(24).fill(0)
  const rnd = seedRandUsage(Number(dev.id || 1) * 123 + 7)
  const profile = buildProfile(dev.name, rnd)
  const base = Math.max(1, dev.powerW || 100)
  return hourArray().map(h => {
    const p = profile(h)
    const noise = (rnd() - 0.5) * 0.06
    const watts = Math.max(0, Math.round(base * Math.max(0, p + noise)))
    return watts
  })
}

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
