<script setup lang="ts">
import { ref } from 'vue';
import { RouterView } from 'vue-router';

const searchQuery = ref('');

const search = () => {
  console.log('Buscando:', searchQuery.value);
};
</script>

<template>
  <div class="app">
    <aside class="sidebar">
      <div class="logo">HIBIKI</div>
      <nav class="menu">
        <div class="menu-search">
          <input type="text" placeholder="Buscar..." v-model="searchQuery" />
          <button @click="search">Buscar</button>
        </div>
        <router-link to="/inicio" class="menu-item" active-class="active">Inicio</router-link>
        <router-link to="/novedades" class="menu-item" active-class="active">Novedades</router-link>
        <router-link to="/premium" class="menu-item" active-class="active">Premium</router-link>
      </nav>
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
  background: linear-gradient(180deg, rgb(22, 22, 22) 0%, rgb(0, 0, 0) 100%);
  color: #ffffff;
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
  color: #ff5100;
  text-decoration: none;
}
.beta-link:hover {
  text-decoration: underline;
}

.content {
  flex: 1;
  background-color: light dark;
  padding: 2rem;
  background-color: #ffffff;
  padding: 0rem;
  overflow-y: auto;
}

.menu-search {
  display: flex;
  align-items: center;
  margin-bottom: 1rem; 
}

.menu-search input {
  padding: 5px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.menu-search button {
  padding: 5px 10px;
  background-color: #ff5100;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.menu-search button:hover {
  background-color: #ca3900;
}

</style>
