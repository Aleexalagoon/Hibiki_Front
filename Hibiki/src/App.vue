<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue';
import { RouterView, useRouter } from 'vue-router';

const searchQuery = ref('');
const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true');
const router = useRouter();

const search = () => {
  console.log('Buscando:', searchQuery.value);
};


onMounted(() => {
  isAuthenticated.value = localStorage.getItem('isAuthenticated') === 'true';
});


window.addEventListener('storage', () => {
  isAuthenticated.value = localStorage.getItem('isAuthenticated') === 'true';
});


const login = () => {
  localStorage.setItem('isAuthenticated', 'true');
  isAuthenticated.value = true;
  window.dispatchEvent(new Event("storage")); 
};


const logout = () => {
  localStorage.removeItem('isAuthenticated');
  isAuthenticated.value = false;
  window.dispatchEvent(new Event("storage")); 
  router.push('/login'); 
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

        
        <div v-if="isAuthenticated">
          <router-link to="/artista" class="menu-item" active-class="active">Artistas</router-link>
          <router-link to="/playlist" class="menu-item" active-class="active">Playlists</router-link>
          <router-link to="/album" class="menu-item" active-class="active">Álbumes</router-link>
        </div>
      </nav>

      <div class="auth-buttons">
        <button v-if="!isAuthenticated" @click="login" class="login-button">Iniciar sesión</button>
        <button v-if="isAuthenticated" @click="logout" class="logout-button">Cerrar sesión</button>
      </div>
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

.content {
  flex: 1;
  background-color: #ffffff;
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

.auth-buttons {
  text-align: center;
  padding: 1rem 0;
}

.login-button,
.logout-button {
  background-color: #ff5100;
  color: white;
  font-size: 16px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s;
}

.logout-button:hover,
.login-button:hover {
  background-color: #ca3900;
}
</style>
