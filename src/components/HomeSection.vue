<!-- HomeSection.vue -->
<template>
  <section class="bg-surface text-normal">
    <!-- ===== Features ===== -->
    <div class="container-fluid px-4 py-5 py-md-6" >
      <div class="row row-cols-1 row-cols-md-3 g-5 text-center">
        <div class="col">
          <div class="feature-icon mb-3"><i class="bi bi-currency-dollar"></i></div>
          <h3 class="h2 fw-bold mb-3 text-strong">Energia que cabe no bolso</h3>
          <p class="lead text-muted mb-0">
            Baterias com excelente custo-benefício para sua rotina.
          </p>
        </div>
        <div class="col">
          <div class="feature-icon mb-3"><i class="bi bi-activity"></i></div>
          <h3 class="h2 fw-bold mb-3 text-strong">Gerenciamento em tempo real</h3>
          <p class="lead text-muted mb-0">
            Acompanhe cada dispositivo ao vivo e ative alertas e automações instantaneamente.
          </p>
        </div>
        <div class="col">
          <div class="feature-icon mb-3"><i class="bi bi-shield-check"></i></div>
          <h3 class="h2 fw-bold mb-3 text-strong">Eficiência e segurança</h3>
          <p class="lead text-muted mb-0">
            Proteções contra sobrecarga e alta eficiência para evitar desperdícios.
          </p>
        </div>
      </div>

      <div class="text-center mt-5">
        <button class="btn btn-primary btn-lg px-5">Saiba mais</button>
      </div>
    </div>

    <hr class="divider"/>

    <!-- ===== Grid de Dispositivos (máx 3 por linha) ===== -->
    <div class="container-fluid px-4 py-5">
      <div class="d-flex align-items-end justify-content-between mb-3 mb-md-4">
        <h1 class="display-5 mb-0 text-strong">Dispositivos</h1>
      </div>

    <div class="row g-4 row-cols-1 row-cols-sm-2 row-cols-lg-3 m-0">
        <div class="col" v-for="d in devices" :key="d.id">
            <DeviceCard
            :id="d.id"
            :name="d.name"
            :category="d.category"
            :powerW="d.powerW"
            :critical="d.critical"
            :icon="d.icon"
            />
        </div>
    </div>

    </div>

    <hr class="divider" />

    <!-- ===== Footer ===== -->
    <footer class="py-5 footer">
      <div class="container-fluid px-4">
        <div class="row gy-4">
          <div class="col-12 col-md-4">
            <h5 class="fw-bold mb-3 text-strong">Energia+</h5>
            <address class="mb-2 text-normal">
              Rua das Andorinha<br>
              São Paulo, SP 12345-000
            </address>
            <small class="text-subtle">© {{ year }} Energia+</small>
          </div>

          <div class="col-6 col-md-4">
            <h5 class="fw-bold mb-3 text-strong">Informações</h5>
            <ul class="list-unstyled">
              <li><a href="#" class="footer-link">Contato</a></li>
              <li><a href="#" class="footer-link">Sobre</a></li>
              <li><a href="#" class="footer-link">Instagram</a></li>
            </ul>
          </div>

          <div class="col-6 col-md-4">
            <h5 class="fw-bold mb-3 text-strong">Produtos</h5>
            <ul class="list-unstyled">
              <li><a href="#" class="footer-link">Baterias</a></li>
              <li><em class="text-muted small">Energia confiável em qualquer lugar ⚡</em></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </section>
</template>

<script setup>
import DeviceCard from './DeviceCard.vue'

const year = new Date().getFullYear()

const devices = [
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
</script>

<style scoped>
/* fundo da seção/rodapé nessa cor */
.bg-surface { background: #121316; }

/* separador sutil ajustado para esse fundo */
.divider {
  border: 0;
  /* um tom ~8% mais claro que #0e0f11 */
  border-top: 1px solid #5c5e62;
  /* se o navegador suportar, use um mix ainda mais suave */
  border-top-color: color-mix(in srgb, #0e0f11 80%, #ffffff);
  margin: 0;
}

/* ícones grandes – mantém o acento do tema */
.feature-icon {
  font-size: 56px;
  line-height: 1;
  color: var(--accent);
}

/* links do footer continuam legíveis nesse fundo */
.footer-link {
  color: var(--text-normal);
  text-decoration: none;
  transition: color .2s ease;
}
.footer-link:hover {
  color: var(--accent);
  text-decoration: underline;
}

</style>
