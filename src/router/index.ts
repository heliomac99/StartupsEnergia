// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Lazy loading das views/componentes
const DashboardView  = () => import('../views/Dashboard.vue')
const AutomatizacaoView  = () => import('../views/Automatizacao.vue')
const HomeView  = () => import('../views/Home.vue')
// (Opcional) crie esta view se quiser uma página 404

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/dashboard/:id', name: 'dashboard', component: DashboardView, props: true },
    { path: '/automatizacao/:id', name: 'automatizacao', component: AutomatizacaoView, props: true },
    { path: '/home', name: 'home', component: HomeView, props: false },
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
