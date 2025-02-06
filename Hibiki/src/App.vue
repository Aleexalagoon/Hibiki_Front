<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="app">
    <aside class="sidebar">
      <div class="logo">Music</div>
      <nav class="menu">
        <router-link to="/" class="menu-item" active-class="active">Inicio</router-link>
        <router-link to="/novedades" class="menu-item" active-class="active">Novedades</router-link>
      </nav>
      <footer class="footer">
        <p>Abre en Música</p>
        <a href="#" class="beta-link">Probar la versión beta</a>
      </footer>
    </aside>
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

.menu {
  flex: 1;
}

.menu-item {
  display: block;
  padding: 0.75rem 1rem;
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.menu-item:hover,
.menu-item.active {
  background-color: #444;
  border-radius: 8px;
}

.footer {
  font-size: 0.875rem;
  color: #aaa;
  text-align: center;
}

.beta-link {
  color: #00aaff;
  text-decoration: none;
}
.beta-link:hover {
  text-decoration: underline;
}

.content {
  flex: 1;
  background-color: #f8f8f8;
  padding: 2rem;
  overflow-y: auto;
}
</style>
