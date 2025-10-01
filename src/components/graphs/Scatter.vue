<template>
  <div class="card h-100">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h5 text-strong mb-0">{{ title }}</h2>
        <span class="badge-essential">{{ totalOutages }} quedas/24h</span>
      </div>

      <!-- Altura explícita para o canvas renderizar -->
      <div class="chart-wrap">
        <Scatter :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Scatter } from 'vue-chartjs'

const props = defineProps({
  deviceName: { type: String, required: true },
  outages: { type: Array, default: () => [] } // [0..23]
})

const totalOutages = computed(() => props.outages.length)

const chartData = computed(() => ({
  // não precisa labels aqui
  datasets: [{
    label: 'Queda',
    data: props.outages.map(h => ({ x: Number(h), y: 1 })),
    showLine: false,
    pointRadius: 5,
    pointHoverRadius: 7,
    // ✅ cores explícitas p/ evitar transparent
    pointBackgroundColor: 'rgba(124, 244, 194, 1)',   // --accent aproximado
    pointBorderColor: 'rgba(124, 244, 194, 1)'
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  parsing: { xAxisKey: 'x', yAxisKey: 'y' }, // ✅ diga ao Chart.js onde estão os valores
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        title: items => `Hora ${items[0].parsed.x}:00`,
        label: () => 'Queda de energia'
      }
    }
  },
  elements: { point: { borderWidth: 0 } },
  scales: {
    x: { type: 'linear', min: 0, max: 23, ticks: { stepSize: 1 } },
    y: { display: false, min: 0, max: 2 }
  }
}
</script>

<style scoped>
.card { min-height: 360px; }
.chart-wrap { height: 280px; } /* garante altura do canvas */
</style>


<style scoped>
.card { min-height: 360px; }
/* garante altura para o canvas */
.chart-wrap { height: 280px; }
</style>
