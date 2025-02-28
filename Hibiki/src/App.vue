<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { usePlayerStore } from '@/stores/player';
import { useCancionesStore } from '@/stores/cancionesStore';
import MusicPlayer from '@/components/MusicPlayer.vue';
import Swal from 'sweetalert2';

const searchQuery = ref('');
const authStore = useAuthStore();
const playerStore = usePlayerStore();
const cancionesStore = useCancionesStore();
const router = useRouter();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isPremium = computed(() => authStore.isPremium); 

const search = () => {
  console.log('Buscando:', searchQuery.value);
};

const logout = () => {
  authStore.logout();
  router.push('/login');
};

const allSongs = computed(() => cancionesStore.canciones || []);

let adInterval: any = null;

onMounted(async () => {
  authStore.loadUserFromStorage();
  await cancionesStore.fetchCanciones();

  if (!isPremium.value) {
    adInterval = setInterval(() => {
      Swal.fire({
        title: "🎵 ¡Hazte Premium!",
        text: "Disfruta de música sin anuncios y accede a contenido exclusivo.",
        icon: "info",
        confirmButtonText: "Ver planes",
        confirmButtonColor: "#ff5100",
        showCancelButton: true,
        cancelButtonText: "Cerrar",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/premium');
        }
      });
    }, 60000);
  }
});

// 🔥 Verifica si el usuario se volvió premium para detener anuncios
watchEffect(() => {
  if (authStore.isPremium && adInterval) {
    clearInterval(adInterval);
    console.log("🚀 Usuario es premium. Anuncios desactivados.");
  }
});

onUnmounted(() => {
  if (adInterval) {
    clearInterval(adInterval);
  }
});
</script>

<template>
  <div class="app-container">
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
          
          <div v-if="isAuthenticated">
            <router-link to="/artista" class="menu-item" active-class="active">Artistas</router-link>
            <router-link to="/playlist" class="menu-item" active-class="active">Playlists</router-link>
            <router-link to="/premium" class="menu-item" active-class="active">Premium</router-link>
          </div>
        </nav>
        
        <div v-if="isAuthenticated" class="auth-buttons">
          <button class="logout-button" @click="logout">Cerrar Sesión</button>
        </div>
      </aside>
      
      <main class="content">
        <RouterView />
      </main>
    </div>
    
    <MusicPlayer :songs="allSongs" />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden;
}

.app {
  display: flex;
  flex: 1;
  height: 100%;
  overflow: hidden;
}

.sidebar {
  width: 250px;
  background: linear-gradient(180deg, rgb(22, 22, 22) 0%, rgb(0, 0, 0) 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  overflow-y: auto;
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
  transition: background-color 0.3s ease;
}

.menu-item:hover, .menu-item.active {
  background-color: #444;
  border-radius: 8px;
}

.content {
  flex: 1;
  background-color: #ffffff;
  overflow-y: auto;
  position: relative;
}

.menu-search {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.menu-search input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.menu-search button {
  padding: 8px 12px;
  background-color: #ff5100;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.menu-search button:hover {
  background-color: #ca3900;
}

.auth-buttons {
  text-align: center;
  padding: 1rem 0;
}

.logout-button {
  background-color: #ff5100;
  color: white;
  font-size: 16px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #ca3900;
}
</style>
