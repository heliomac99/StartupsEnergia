<template>
  <header class="hero d-flex align-items-center text-center text-white">
    <div class="container">
      <h1 class="display-4 fw-bold mb-3">Energia Sempre com Você ⚡</h1>
      <p class="lead mb-4">
        Tenha autonomia total com nossas baterias e power banks de alta performance.
      </p>
    </div>
  </header>
</template>

<style scoped>
.hero {
  min-height: 100vh;
  background: url('../assets/wallpaper.jpg') center center/cover no-repeat;
  position: relative;
}
.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5); /* overlay escuro p/ contraste */
}
.hero .container {
  position: relative;
  z-index: 1;
}
</style>
