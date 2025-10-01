import {
  Chart as ChartJS,
  Title, Tooltip, Legend,
  PointElement, LineElement,
  LinearScale,
  LineController, ScatterController, // ✅ controllers
} from 'chart.js'

ChartJS.register(
  Title, Tooltip, Legend,
  PointElement, LineElement,
  LinearScale,
  LineController, ScatterController   // ✅ agora o scatter sabe se renderizar
)

// Tema dark opcional
try {
  const cs = getComputedStyle(document.documentElement)
  ChartJS.defaults.color = cs.getPropertyValue('--text-normal')?.trim() || '#f4f4f5'
  ChartJS.defaults.borderColor = 'rgba(255,255,255,.12)'
} catch (_) {}

export { ChartJS }
