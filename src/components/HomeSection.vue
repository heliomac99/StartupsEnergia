<!-- HomeSection.vue -->
<template>
  <section class="bg-surface text-normal">
    <!-- ===== Features ===== -->
    <div class="container-fluid px-4 py-5 py-md-6">
      <div class="row row-cols-1 row-cols-md-3 g-5 text-center">
        <div class="col">
          <div class="feature-icon mb-3"><i class="bi bi-currency-dollar"></i></div>
          <h3 class="h2 fw-bold mb-3 text-strong">Energia que cabe no bolso</h3>
          <p class="lead text-muted mb-0">
            Baterias e power banks com excelente custo-benefício para sua rotina.
          </p>
        </div>
        <div class="col">
          <div class="feature-icon mb-3"><i class="bi bi-battery-charging"></i></div>
          <h3 class="h2 fw-bold mb-3 text-strong">Autonomia em qualquer lugar</h3>
          <p class="lead text-muted mb-0">
            Portáteis, leves e potentes: energia confiável onde você estiver.
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
    <footer class="py-5" style="background-color: black;">
      <div class="container-fluid px-4">
        <div class="row gy-4">
          <div class="col-12 col-md-4">
            <h5 class="fw-bold mb-3 text-strong">Energia+</h5>
            <address class="mb-2 text-normal">
              123 Rua Exemplo<br>
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
              <li><a href="#" class="footer-link">Power Banks</a></li>
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
  { id: 1, name: 'Geladeira',            category: 'Cozinha',    powerW: 150, critical: true,  icon: '🧊' },
  { id: 5, name: 'Portão Automático',    category: 'Acesso',     powerW: 400, critical: true,  icon: '🚪' },
  { id: 6, name: 'Câmeras de Segurança', category: 'Segurança',  powerW: 30,  critical: true,  icon: '📹' },
  { id: 2, name: 'Computador',           category: 'Escritório', powerW: 300, critical: false, icon: '💻' },
  { id: 3, name: 'Lâmpada',              category: 'Iluminação', powerW: 10,  critical: false, icon: '💡' },
  { id: 4, name: 'Televisão',            category: 'Sala',       powerW: 100, critical: false, icon: '📺' }
]
</script>

<style scoped>
.bg-surface { background: var(--surface); }

/* separadores sutis dentro do mesmo fundo */
.divider {
  border: 0;
  border-top: 1px solid rgba(255,255,255,.08);
  margin: 0;
}

/* ícones grandes com a cor de destaque */
.feature-icon {
  font-size: 56px;
  line-height: 1;
  color: var(--accent);
}

/* links do footer */
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
