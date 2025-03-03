<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { usePlayerStore } from '@/stores/player';
import { useCancionesStore } from '@/stores/cancionesStore';
import MusicPlayer from '@/components/MusicPlayer.vue';
import Swal from 'sweetalert2';

const searchQuery = ref('');
const sidebarVisible = ref(false); // Track sidebar visibility
const authStore = useAuthStore();
const playerStore = usePlayerStore();
const cancionesStore = useCancionesStore();
const router = useRouter();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isPremium = computed(() => authStore.isPremium); 

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};

const search = () => {
  console.log('Buscando:', searchQuery.value);
  // Close sidebar after search on mobile
  if (window.innerWidth <= 768) {
    sidebarVisible.value = false;
  }
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
  
  // Set sidebar visible by default on desktop
  sidebarVisible.value = window.innerWidth > 768;

  if (!isPremium.value) {
    adInterval = setInterval(() => {
      Swal.fire({
        title: "Hazte Premium!",
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
      <!-- Mobile menu toggle button -->
      <div class="menu-toggle" @click="toggleSidebar">
        <div class="menu-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      <aside class="sidebar" :class="{ 'visible': sidebarVisible }">
        <div class="logo">HIBIKI</div>
        <nav class="menu">
          <div class="menu-search">
            <input type="text" placeholder="Buscar..." v-model="searchQuery" />
            <button @click="search">Buscar</button>
          </div>
          
          <router-link to="/inicio" class="menu-item" active-class="active" @click="sidebarVisible = false">Inicio</router-link>
          <router-link to="/novedades" class="menu-item" active-class="active" @click="sidebarVisible = false">Novedades</router-link>
          
          <div v-if="isAuthenticated">
            <router-link to="/artista" class="menu-item" active-class="active" @click="sidebarVisible = false">Artistas</router-link>
            <router-link to="/playlist" class="menu-item" active-class="active" @click="sidebarVisible = false">Playlists</router-link>
            <router-link to="/premium" class="menu-item" active-class="active" @click="sidebarVisible = false">Premium</router-link>
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
  position: relative;
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
  z-index: 1000;
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

/* Hamburger menu button */
.menu-toggle {
  display: none;
  position: fixed;
  top: 15px;
  left: 15px;
  width: 40px;
  height: 40px;
  background-color: #ff5100;
  border-radius: 5px;
  cursor: pointer;
  z-index: 1001;
  align-items: center;
  justify-content: center;
}

.menu-icon {
  width: 25px;
  height: 20px;
  position: relative;
}

.menu-icon span {
  display: block;
  position: absolute;
  height: 3px;
  width: 100%;
  background: white;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.menu-icon span:nth-child(1) {
  top: 0;
}

.menu-icon span:nth-child(2) {
  top: 8px;
}

.menu-icon span:nth-child(3) {
  top: 16px;
}

/* Mobile styles */
@media screen and (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }
  
  .sidebar {
    position: fixed;
    top: 0;
    left: -100%;
    height: 100vh;
    width: 80%;
    max-width: 300px;
    transition: left 0.3s ease;
  }
  
  .sidebar.visible {
    left: 0;
  }
  
  .content {
    width: 100%;
    padding-top: 60px; /* Add space for the menu button */
  }
  
  /* Add overlay when sidebar is open */
  .app:after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s;
    pointer-events: none;
  }
  
  .sidebar.visible + .content:before {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }
}

/* For very small devices */
@media screen and (max-width: 480px) {
  .menu-item {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
  
  .sidebar {
    width: 85%;
  }
}
</style>