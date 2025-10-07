<!-- src/components/barra.vue -->
<template>
  <div class="card h-100">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h5 text-strong mb-0">{{ title }}</h2>
        <div class="d-flex gap-2 align-items-center">
          <span class="badge-essential">{{ count }} quedas/24h</span>
          <small class="text-muted">Total: {{ totalMinutes }} min</small>
        </div>
      </div>

      <div v-if="count" class="chart-wrap">
        <Bar :data="chartData" :options="chartOptions" />
      </div>

      <div v-else class="text-muted small">
        Sem quedas registradas nas últimas 24h.
      </div>

      <div v-if="hasMismatch" class="alert alert-warning mt-3 small">
        Aviso: <code>outages</code> e <code>durations</code> possuem tamanhos diferentes.
        Renderizando apenas os primeiros {{ safeLength }} itens.
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps({
  title: { type: String, default: 'Duração das quedas (minutos)' },
  /** Mesmo array do scatter: horas das quedas, ex.: [1, 7, 7, 18] */
  outages: { type: Array, default: () => [] },
  /** Duração (min) para cada item de outages, mantendo a MESMA ordem. Ex.: [12, 4, 9, 33] */
  durations: { type: Array, default: () => [] },
})

const safeLength = computed(() => Math.min(props.outages.length, props.durations.length))
const hasMismatch = computed(() => props.outages.length !== props.durations.length)
const count = computed(() => safeLength.value)

const labels = computed(() => {
  // Labels identificáveis mesmo quando há repetição de hora.
  // Ex.: "07:00 #1", "07:00 #2"
  const counters = {}
  return props.outages.slice(0, safeLength.value).map(h => {
    const hour = Number(h)
    counters[hour] = (counters[hour] || 0) + 1
    const tag = counters[hour]
    return `${String(hour).padStart(2, '0')}:00 #${tag}`
  })
})

const minutesData = computed(() =>
  props.durations.slice(0, safeLength.value).map(m => Number(m) || 0)
)

const totalMinutes = computed(() =>
  minutesData.value.reduce((acc, n) => acc + n, 0)
)

const chartData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: 'Duração (min)',
      data: minutesData.value,
      backgroundColor: 'rgba(124, 244, 194, 0.35)',
      borderColor: 'rgba(124, 244, 194, 1)',
      borderWidth: 1,
      borderRadius: 6,
      barPercentage: 0.7,
      categoryPercentage: 0.7,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        title: items => {
          // Extrai "HH:00 #n" e mostra também a hora limpa
          const label = items[0]?.label || ''
          const hour = label.slice(0, 2)
          return `Hora ${hour}:00`
        },
        label: ctx => `Duração: ${ctx.parsed.y ?? 0} min`,
      },
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { autoSkip: false, maxRotation: 0 } },
    y: {
      beginAtZero: true,
      title: { display: true, text: 'Minutos' },
      ticks: { stepSize: 5 },
    },
  },
}
</script>

<style scoped>
.card { min-height: 360px; }
.chart-wrap { height: 280px; } /* garante altura do canvas */
.badge-essential {
  background: rgba(124, 244, 194, 0.2);
  color: #0c5132;
  border: 1px solid rgba(124, 244, 194, 0.6);
  padding: 4px 8px;
  border-radius: 999px;
  font-weight: 600;
}
</style>
