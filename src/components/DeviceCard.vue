<template>
  <div
    class="card h-100 border-0 device-card-click shadow-sm"
    role="button"
    tabindex="0"
    @click="go()"
    @keyup.enter="go()"
  >
    <div class="card-body text-center d-flex flex-column justify-content-between">
      <div>
        <div class="lead-icon mb-3 text-strong" style="font-size: 2.5rem;">{{ icon }}</div>
        <h2 class="h4 fw-bold mb-1 text-strong">{{ name }}</h2>
        <p class="text-muted mb-2">{{ category }}</p>

        <div class="mt-3">
          <p class="h6 fw-semibold mb-1">{{ powerW }} Wh</p>
          <p class="small text-muted mb-1">
            Média: {{ consumptionAvg }} Wh/h
          </p>
          <p class="small text-muted mb-1">
            Faixa: {{ consumptionMin }}–{{ consumptionMax }} Wh/h
          </p>
          <p class="small text-muted">
            Autonomia estimada: {{ estimatedDuration }} h
          </p>
        </div>
      </div>

      <div v-if="critical" class="mt-4">
        <span class="badge-essential d-inline-flex align-items-center gap-2">
          ⚡ Essencial
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  id: { type: [String, Number], required: true },
  name: String,
  category: String,
  powerW: Number,
  critical: Boolean,
  icon: String,
  consumptionAvg: Number, // consumo médio Wh/h
  consumptionMin: Number, // consumo mínimo Wh/h
  consumptionMax: Number, // consumo máximo Wh/h
  estimatedDuration: Number // duração estimada em horas
})

const router = useRouter()
function go() {
  router.push({ name: 'dashboard', params: { id: String(props.id) } })
}
</script>

<style scoped>
.device-card-click {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.device-card-click:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}
.badge-essential {
  background-color: var(--bs-warning-bg-subtle);
  color: var(--bs-warning-text-emphasis);
  font-weight: 600;
  padding: 0.4rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.9rem;
}
</style>
