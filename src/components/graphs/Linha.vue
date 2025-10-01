<template>
  <div class="chart-card card h-100">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h5 text-strong mb-0">{{ title }}</h2>
        <small class="text-muted">Watts por hora</small>
      </div>
      <div class="chart-wrap">
        <Line :data="dataObj" :options="opts" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { Line } from 'vue-chartjs'

// ✅ Registro LOCAL: evita depender do plugin global
import {
  Chart as ChartJS,
  Title, Tooltip, Legend,
  PointElement, LineElement,
  LinearScale, CategoryScale,
  LineController,
} from 'chart.js'
ChartJS.register(
  Title, Tooltip, Legend,
  PointElement, LineElement,
  LinearScale, CategoryScale,
  LineController
)

// Props
const props = defineProps({
  label: { type: String, default: 'Dispositivo' },
  series: { type: Array, required: true }, // 24 valores (Watts)
})

// título
const title = computed(() => `Consumo (24h) — ${props.label}`)

// labels 0..23
const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`)

// tema dark (tenta puxar var CSS do seu theme)
function getCssVar(name, fallback) {
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    return v || fallback
  } catch { return fallback }
}
const lineColor = getCssVar('--accent', 'hsla(160, 90%, 60%, 0.95)')
const lineFill  = 'hsla(160, 90%, 60%, 0.20)'

// dataset
const dataObj = computed(() => ({
  labels,
  datasets: [{
    label: props.label,
    data: props.series,
    tension: 0.25,
    borderWidth: 2,
    pointRadius: 0,
    pointHoverRadius: 4,
    borderColor: lineColor,
    backgroundColor: lineFill,
    fill: false
  }]
}))

const opts = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        title: items => items?.[0]?.label || '',
        label: ctx => `${ctx.formattedValue} W`
      }
    }
  },
  scales: {
    x: { type: 'category', grid: { display: true } },
    y: { type: 'linear', beginAtZero: true, title: { display: true, text: 'Watts' } }
  }
}

onMounted(() => {
  // força reflow em casos raros de container escondido ao montar
  // (ex.: abas/nav-pills). Sem problemas se não precisar.
})
</script>

<style scoped>
.chart-wrap { height: 320px; } /* altura explícita pro canvas */
</style>
