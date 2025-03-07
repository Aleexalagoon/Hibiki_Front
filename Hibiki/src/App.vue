<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { usePlayerStore } from '@/stores/player';
import { useCancionesStore } from '@/stores/cancionesStore';
import MusicPlayer from '@/components/MusicPlayer.vue';
import Swal from 'sweetalert2';
import Perfil from '@/components/Perfil.vue';
import Sidebar from '@/components/Sidebar.vue'; 

const sidebarVisible = ref(false);
const searchQuery = ref('');

const authStore = useAuthStore();
const playerStore = usePlayerStore();
const cancionesStore = useCancionesStore();
const router = useRouter();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isPremium = computed(() => authStore.isPremium);

const allSongs = computed(() => cancionesStore.canciones || []);

let adInterval: any = null;

const handleSearch = (query: string) => {
  searchQuery.value = query;
  console.log('Buscando:', query);
};


const handleLogout = () => {
  if (adInterval) {
    clearInterval(adInterval);
    adInterval = null;
  }
  
  authStore.logout();
  router.push('/login');
};

const startAdInterval = () => {
  if (adInterval) {
    clearInterval(adInterval);
  }
  
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
  }, 60000); // Cada 1 minuto
};

onMounted(async () => {
  authStore.loadUserFromStorage();
  await cancionesStore.fetchCanciones();
  
  sidebarVisible.value = window.innerWidth > 768;
  
  if (!isPremium.value && isAuthenticated.value) {
    startAdInterval();
  }
});

watchEffect(() => {
  if (authStore.isPremium && adInterval) {
    clearInterval(adInterval);
    adInterval = null;
    console.log("🚀 Usuario es premium. Anuncios desactivados.");
  } else if (!authStore.isPremium && isAuthenticated.value) {
    startAdInterval();
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
      <!-- Sidebar component with v-model for visibility -->
      <Sidebar 
        v-model:visible="sidebarVisible"
        @search="handleSearch"
        @logout="handleLogout"
      />
      
      <!-- Componente de perfil de usuario -->
      <div class="profile-container-p">
        <Perfil />
      </div>
      
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

/* Nuevo contenedor para el perfil */
.profile-container-p {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 1100;
}

.header-profile-container {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 1100;
}

.user-icon {
  width: 40px;
  height: 40px;
  background-color: #ff5100;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.user-icon-small {
  width: 40px;
  height: 40px;
  font-size: 0.9rem;
}

.user-dropdown {
  position: absolute;
  top: 55px;
  right: 0;
  width: 250px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #f8f9fa;
}

.user-details {
  margin-left: 15px;
}

.user-name {
  font-weight: bold;
  margin: 0;
}

.user-email {
  color: #6c757d;
  margin: 0;
  font-size: 0.9rem;
}

.dropdown-divider {
  height: 1px;
  background-color: #e0e0e0;
}

.dropdown-menu {
  padding: 10px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dropdown-item:hover {
  background-color: #f1f3f5;
}

.dropdown-item svg {
  margin-right: 10px;
  stroke: #6c757d;
}

.dropdown-item span {
  color: #333;
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
    padding-top: 60px;
  }
  
  .app:after {
    content: '';
    position: fixed;
    top: 0;
  }
}
</style>