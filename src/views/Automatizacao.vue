<template>
  <section class="bg-surface min-vh-100">
    <div class="container-fluid px-4 py-4">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 text-strong mb-0">Automação — {{ deviceName }}</h1>
        <button class="btn btn-outline-secondary" @click="goBack">← Voltar</button>
      </div>

      <div class="row g-3">
        <!-- Formulário -->
        <div class="col-12 col-lg-5">
          <div class="card">
            <div class="card-body">
              <h2 class="h5 mb-3">Nova regra</h2>

              <div class="mb-3">
                <label class="form-label">Nome da regra</label>
                <input v-model.trim="form.nome" type="text" class="form-control" placeholder="Ex.: Computadores 06:30 → 20:00">
              </div>

              <div class="row">
                <div class="col-6 mb-3">
                  <label class="form-label">Hora de ligar</label>
                  <input v-model="form.horaOn" type="time" class="form-control">
                </div>
                <div class="col-6 mb-3">
                  <label class="form-label">Hora de desligar</label>
                  <input v-model="form.horaOff" type="time" class="form-control">
                </div>
              </div>

              <div class="mb-2">
                <label class="form-label d-block">Dias da semana</label>
                <div class="d-flex flex-wrap gap-2">
                  <label v-for="d in diasSemana" :key="d.value" class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" :value="d.value" v-model="form.dias">
                    <span class="form-check-label">{{ d.label }}</span>
                  </label>
                </div>
                <div class="form-text">Deixe vazio para rodar todos os dias.</div>
              </div>

              <div class="form-check form-switch my-3">
                <input id="switchEnabled" class="form-check-input" type="checkbox" v-model="form.habilitado">
                <label class="form-check-label" for="switchEnabled">Regra habilitada</label>
              </div>

              <div class="d-flex gap-2">
                <button class="btn btn-primary" @click="adicionarRegra">Adicionar</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista -->
        <div class="col-12 col-lg-7">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <h2 class="h5 mb-0">Regras deste dispositivo</h2>
                <div class="d-flex gap-2">
                  <button class="btn btn-danger" :disabled="regras.length===0" @click="limparRegras">Limpar</button>
                </div>
              </div>

              <div v-if="regras.length===0" class="text-muted">Nenhuma regra cadastrada ainda.</div>

              <ul v-else class="list-group">
                <li
                  v-for="r in regras"
                  :key="r.id"
                  :class="['list-group-item','d-flex','align-items-start','justify-content-between',listItemClass]"
                >
                  <div>
                    <div class="fw-bold">
                      <span v-if="!r.habilitado" class="badge text-bg-secondary me-2">desativada</span>
                      {{ r.nome || 'Sem nome' }}
                    </div>
                    <div class="small text-muted">
                      {{ r.horaOn }} → {{ r.horaOff }}
                      <span v-if="(r.dias?.length||0)===0"> • todos os dias</span>
                      <span v-else> • {{ renderDias(r.dias) }}</span>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-sm btn-outline-secondary" @click="toggleRegra(r)">{{ r.habilitado ? 'Desativar' : 'Ativar' }}</button>
                    <button class="btn btn-sm btn-outline-secondary" @click="editarRegra(r)">Editar</button>
                    <button class="btn btn-sm btn-outline-secondary" @click="duplicarRegra(r)">Duplicar</button>
                    <button class="btn btn-sm btn-outline-secondary" @click="removerRegra(r.id)">Excluir</button>
                  </div>
                </li>
              </ul>

              <div v-if="editando" class="mt-4">
                <hr class="my-3">
                <h3 class="h6 mb-3">Editando: {{ form.nome || 'Sem nome' }}</h3>
                <div class="d-flex gap-2">
                  <button class="btn btn-primary" @click="salvarEdicao">Salvar</button>
                  <button class="btn btn-outline-secondary" @click="cancelarEdicao">Cancelar</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

/* navegação */
const router = useRouter()
function goBack() {
  if (window.history.length <= 1) {
    router.push({ name: 'home' })
  } else {
    router.back()
  }
}

/* catálogo simples (troque por API/store quando quiser) */
const catalog = [
  { id: '1', name: 'Geladeira', category: 'Cozinha', powerW: 150, critical: true },
  { id: '2', name: 'Computador', category: 'Escritório', powerW: 300, critical: false },
  { id: '3', name: 'Lâmpada', category: 'Iluminação', powerW: 10, critical: false },
  { id: '4', name: 'Televisão', category: 'Sala', powerW: 100, critical: false },
  { id: '5', name: 'Portão Automático', category: 'Acesso', powerW: 400, critical: true },
  { id: '6', name: 'Câmeras de Segurança', category: 'Segurança', powerW: 30, critical: true }
]

/* id e nome do dispositivo (suporta :id e :idDispositivo) */
const route = useRoute()
const id = computed(() => String(route.params.id ?? route.params.idDispositivo ?? ''))
const device = computed(() => catalog.find(d => d.id === id.value) || null)
const deviceName = computed(() => device.value?.name || `Dispositivo #${id.value}`)

/* storage */
const STORAGE_KEY = 'automations'
const loadStore = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} } }
const saveStore = (s) => localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
const getDeviceRules = (devId) => {
  const s = loadStore()
  return Array.isArray(s[devId]) ? s[devId] : []
}
const setDeviceRules = (devId, rules) => { const s = loadStore(); s[devId] = rules; saveStore(s) }

/* estado */
const regras = ref([])
watch(id, () => { regras.value = getDeviceRules(id.value) }, { immediate: true })

const diasSemana = [
  { value: 1, label: 'Seg' }, { value: 2, label: 'Ter' }, { value: 3, label: 'Qua' },
  { value: 4, label: 'Qui' }, { value: 5, label: 'Sex' }, { value: 6, label: 'Sáb' }, { value: 0, label: 'Dom' },
]

const form = reactive({ id: null, nome: '', horaOn: '06:30', horaOff: '20:00', dias: [], habilitado: true })
const editando = ref(false)

const resetForm = () => {
  Object.assign(form, { id: null, nome: '', horaOn: '06:30', horaOff: '20:00', dias: [], habilitado: true })
  editando.value = false
}
const gerarId = () => 'r_' + Math.random().toString(36).slice(2, 9)

/* ações (sem validação de horário) */
function adicionarRegra() {
  const nova = {
    id: gerarId(),
    nome: form.nome || `Regra ${regras.value.length + 1}`,
    horaOn: form.horaOn,
    horaOff: form.horaOff,
    dias: [...form.dias],
    habilitado: form.habilitado
  }
  regras.value = [...regras.value, nova]
  setDeviceRules(id.value, regras.value)
  resetForm()
}
const removerRegra = (ruleId) => {
  regras.value = regras.value.filter(r => r.id !== ruleId)
  setDeviceRules(id.value, regras.value)
}
const toggleRegra = (r) => {
  r.habilitado = !r.habilitado
  setDeviceRules(id.value, regras.value)
}
const editarRegra = (r) => {
  Object.assign(form, JSON.parse(JSON.stringify(r)))
  editando.value = true
}
const salvarEdicao = () => {
  const i = regras.value.findIndex(r => r.id === form.id)
  if (i >= 0) {
    regras.value[i] = JSON.parse(JSON.stringify(form))
    setDeviceRules(id.value, regras.value)
  }
  resetForm()
}
const cancelarEdicao = () => resetForm()
const duplicarRegra = (r) => {
  const c = JSON.parse(JSON.stringify(r))
  c.id = gerarId()
  c.nome = r.nome + ' (cópia)'
  regras.value = [...regras.value, c]
  setDeviceRules(id.value, regras.value)
}
const limparRegras = () => {
  if (!confirm('Remover todas as regras deste dispositivo?')) return
  regras.value = []
  setDeviceRules(id.value, regras.value)
}

const renderDias = (arr) => {
  const map = { 0:'Dom', 1:'Seg', 2:'Ter', 3:'Qua', 4:'Qui', 5:'Sex', 6:'Sáb' }
  return arr.slice().sort((a,b)=>a-b).map(d => map[d]).join(', ')
}
const listItemClass = 'bg-transparent border-0 border-top border-secondary-subtle'
</script>

<style scoped>
.list-group-item + .list-group-item { margin-top: .25rem; }
</style>
