<template>
  <div
    class="card h-100 border-0 device-card-click"
    role="button"
    tabindex="0"
    @click="go()"
    @keyup.enter="go()"
  >
    <div class="card-body text-center d-flex flex-column justify-content-between">
      <div>
        <div class="lead-icon mb-3 text-strong">{{ icon }}</div>
        <h2 class="h4 fw-bold mb-1 text-strong">{{ name }}</h2>
        <p class="text-muted mb-2">{{ category }}</p>
        <p class="h6 fw-semibold mb-0">{{ powerW }} W</p>
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
  icon: String
})

const router = useRouter()
function go() {
  router.push({ name: 'dashboard', params: { id: String(props.id) } })
}
</script>

<style scoped>
.device-card-click { cursor: pointer; }
.device-card-click:hover { transform: translateY(-4px); }
</style>
