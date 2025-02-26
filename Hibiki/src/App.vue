<script setup lang="ts">
import { ref, onMounted, computed, watchEffect } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { usePlayerStore, type Song } from '@/stores/player';
import MusicPlayer from '@/components/MusicPlayer.vue'; 

const searchQuery = ref('');
const authStore = useAuthStore();
const playerStore = usePlayerStore();
const router = useRouter();
const allSongs = ref<Song[]>([]);

//  Comprobar si el usuario está autenticado
const isAuthenticated = computed(() => authStore.isAuthenticated);

const search = () => {
  console.log('Buscando:', searchQuery.value);
};

//  Función para cerrar sesión
const logout = () => {
  authStore.logout();
  router.push('/login');
};

// Cargar canciones desde la API o una fuente de datos
const loadSongs = async () => {
  try {

    allSongs.value = [
      {
        nombre: 'Canción de ejemplo 1',
        artista: 'Artista 1',
        ruta: '/music/cancion1.mp3',
        image: '/images/cover1.jpg'
      },
      {
        nombre: 'Canción de ejemplo 2',
        artista: 'Artista 2',
        ruta: '/music/cancion2.mp3',
        image: '/images/cover2.jpg'
      },
      {
        nombre: 'Canción de ejemplo 3',
        artista: 'Artista 3',
        ruta: '/music/cancion3.mp3',
        image: '/images/cover3.jpg'
      }
    ];
  } catch (error) {
    console.error('Error al cargar canciones:', error);
  }
};

onMounted(() => {
  authStore.loadUserFromStorage(); // Cargar usuario de localStorage
  loadSongs(); // Cargar las canciones
});

// Adaptación para evitar que el reproductor cubra el contenido
watchEffect(() => {
  if (playerStore.currentSong) {
  } else {
    document.body.style.paddingBottom = '0';
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
          <router-link to="/premium" class="menu-item" active-class="active">Premium</router-link>
          
          <!--  MOSTRAR ARTISTAS Y PLAYLIST SOLO SI EL USUARIO ESTÁ AUTENTICADO -->
          <div v-if="isAuthenticated">
            <router-link to="/artista" class="menu-item" active-class="active">Artistas</router-link>
            <router-link to="/playlist" class="menu-item" active-class="active">Playlists</router-link>
          </div>
        </nav>
        
        <!--  MOSTRAR BOTÓN DE CERRAR SESIÓN SI EL USUARIO ESTÁ LOGUEADO -->
        <div v-if="isAuthenticated" class="auth-buttons">
          <button class="logout-button" @click="logout">Cerrar Sesión</button>
        </div>
      </aside>
      
      <main class="content">
        <RouterView />
      </main>
    </div>
    
    <!-- Reproductor de música fuera del contenido principal para que persista entre rutas -->
    <MusicPlayer :songs="allSongs" />
  </div>
</template>

<style scoped>
.app-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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
  color: #ffffff;
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
  height: 100%; 
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

.logout-button:hover {
  background-color: #ca3900;
}
</style>