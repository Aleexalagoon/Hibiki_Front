<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { usePlayerStore } from '@/stores/player';
import { useCancionesStore } from '@/stores/cancionesStore';
import { useArtistaStore } from '@/stores/artistaStore';
import MusicPlayer from '@/components/MusicPlayer.vue';
import VideoPlayer from '@/components/VideoPlayer.vue';
import Swal from 'sweetalert2';
import Perfil from '@/components/Perfil.vue';

const sidebarVisible = ref(false);
const searchQuery = ref('');
const searchResults = ref([]);
const showSearchResults = ref(false);

const authStore = useAuthStore();
const playerStore = usePlayerStore();
const cancionesStore = useCancionesStore();
const artistaStore = useArtistaStore();
const router = useRouter();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isPremium = computed(() => authStore.isPremium);

const allSongs = computed(() => cancionesStore.canciones || []);

// NUEVO: Computed para saber si el video está visible
const isVideoVisible = computed(() => playerStore.showVideo);

let adInterval: any = null;

const toggleSidebar = () => sidebarVisible.value = !sidebarVisible.value;

const search = () => {
  if (!searchQuery.value.trim()) {
    showSearchResults.value = false;
    return;
  }

  const query = searchQuery.value.toLowerCase();
  let songResults = [];
  let artistResults = [];
  
  if (cancionesStore.canciones && Array.isArray(cancionesStore.canciones)) {
    songResults = cancionesStore.canciones.filter(cancion => {
      const nombre = cancion?.nombre ? cancion.nombre.toLowerCase() : '';
      const artista = cancion?.artista ? cancion.artista.toLowerCase() : '';
      return nombre.includes(query) || artista.includes(query);
    });
  }
  
  if (artistaStore.allArtists && Array.isArray(artistaStore.allArtists)) {
    artistResults = artistaStore.allArtists.filter(artista => {
      const nombre = artista?.nombre ? artista.nombre.toLowerCase() : '';
      return nombre.includes(query);
    });
  }
  
  searchResults.value = [
    ...songResults.map(song => ({
      type: 'song',
      id: song.cancionId || song.id,
      title: song.nombre || 'Sin título',
      artist: song.artista || 'Artista',
      cover: song.image || '/default-cover.jpg'
    })),
    ...artistResults.map(artist => ({
      type: 'artist',
      id: artist.cantanteId || artist.id,
      title: artist.nombre || 'Artista',
      cover: artist.image || '/default-artist.jpg'
    }))
  ];
  
  showSearchResults.value = true;
  if (window.innerWidth <= 768) {
    sidebarVisible.value = false;
  }
};

const navigateToResult = (result) => {
  if (result.type === 'song') {
    const song = cancionesStore.canciones.find(c => 
      (c.cancionId === result.id) || (c.id === result.id)
    );
    
    if (song) {
      if (typeof playerStore.setSong === 'function') {
        playerStore.setSong(song);
      } else if (typeof playerStore.setCurrentSong === 'function') {
        playerStore.setCurrentSong(song);
      }
    }
  } else if (result.type === 'artist') {
    if (typeof artistaStore.fetchArtistData === 'function') {
      artistaStore.fetchArtistData(result.id);
    }
    router.push('/artista');
  }
  
  searchQuery.value = '';
  showSearchResults.value = false;
};

const closeSearchResults = () => showSearchResults.value = false;

const handleSearch = (query: string) => {
  searchQuery.value = query;
  search();
};

const logout = () => {
  if (adInterval) {
    clearInterval(adInterval);
    adInterval = null;
  }
  
  authStore.logout();
  router.push('/login');
};

const handleLogout = () => {
  logout();
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
  
  await Promise.all([
    cancionesStore.fetchCanciones(),
    artistaStore.fetchAllArtists()
  ]);
  
  sidebarVisible.value = window.innerWidth > 768;
  
  if (!isPremium.value && isAuthenticated.value) {
    startAdInterval();
  }
  
  // Event listener para cerrar resultados de búsqueda al hacer click fuera
  document.addEventListener('click', (event) => {
    const searchContainer = document.querySelector('.menu-search-container');
    if (searchContainer && !searchContainer.contains(event.target)) {
      closeSearchResults();
    }
  });
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
    <div class="app" :class="{ 'video-visible': isVideoVisible }">
      <!-- Botón de menú móvil -->
      <div class="menu-toggle" @click="toggleSidebar">
        <div class="menu-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      <!-- Sidebar integrado directamente -->
      <aside class="sidebar" :class="{ 'visible': sidebarVisible }">
        <div class="logo">HIBIKI MUSIC</div>
        <nav class="menu">
          <!-- Contenedor de búsqueda con estilos mejorados -->
          <div class="menu-search-container">
            <div class="menu-search">
              <input 
                type="text" 
                placeholder="Buscar" 
                v-model="searchQuery"
                @keyup.enter="search"
              />
              <button @click="search">Buscar</button>
            </div>
            
            <!-- Resultados de búsqueda -->
            <div class="search-results" v-if="showSearchResults && searchResults.length > 0">
              <div class="search-results-header">
                <h3>Resultados de búsqueda</h3>
                <button class="close-button" @click="showSearchResults = false">×</button>
              </div>
              
              <div class="search-results-list">
                <div 
                  v-for="result in searchResults" 
                  :key="`${result.type}-${result.id}`" 
                  class="search-result-item"
                  @click="navigateToResult(result)"
                >
                  <div class="result-image">
                    <img :src="result.cover" :alt="result.title">
                  </div>
                  <div class="result-info">
                    <div class="result-title">{{ result.title }}</div>
                    <div class="result-subtitle">
                      <span class="result-type">{{ result.type === 'song' ? 'Canción' : 'Artista' }}</span>
                      <span v-if="result.type === 'song' && result.artist"> • {{ result.artist }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Sin resultados -->
            <div class="search-results no-results" v-if="showSearchResults && searchResults.length === 0">
              <p>No se encontraron resultados</p>
            </div>
          </div>
          
          <!-- Mostrar Inicio solo si no es premium o no está autenticado -->
          <router-link v-if="!isPremium || !isAuthenticated" to="/inicio" class="menu-item" active-class="active" @click="sidebarVisible = false">Home</router-link>
          <router-link to="/novedades" class="menu-item" active-class="active" @click="sidebarVisible = false">News</router-link>
          
          <div v-if="isAuthenticated">
            <router-link to="/artista" class="menu-item" active-class="active" @click="sidebarVisible = false">Artists</router-link>
            <router-link to="/playlist" class="menu-item" active-class="active" @click="sidebarVisible = false">Playlists</router-link>
            <router-link to="/premium" class="menu-item" active-class="active" @click="sidebarVisible = false">Premium</router-link>
            <router-link to="/conciertos" class="menu-item" active-class="active" @click="sidebarVisible = false">Concerts</router-link>
          </div>
        </nav>
        
        <div v-if="isAuthenticated" class="auth-buttons">
          <button class="logout-button" @click="logout">Cerrar Sesión</button>
        </div>
      </aside>
      
      <!-- Componente de perfil de usuario -->
      <div class="profile-container-p">
        <Perfil />
      </div>
      
      <!-- NUEVO: Contenedor principal con margen dinámico -->
      <main class="content" :class="{ 'with-video': isVideoVisible }">
        <RouterView />
      </main>
    </div>
    
    <!-- Reproductor de música (siempre visible en la parte inferior) -->
    <div class="music-player-container" :class="{ 'with-video': isVideoVisible }">
      <MusicPlayer :songs="allSongs" />
    </div>
    
    <!-- Reproductor de video (panel lateral) -->
    <VideoPlayer />
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
  transition: all 0.3s ease; /* NUEVO: Transición suave */
}

/* NUEVO: Clase para cuando el video está visible */
.app.video-visible {
  margin-right: 400px; /* Espacio para el panel de video */
}

/* Nuevo contenedor para el perfil */
.profile-container-p {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 1100;
  transition: all 0.3s ease; /* NUEVO: Transición suave */
}

/* NUEVO: Ajustar posición del perfil cuando el video está visible */
.app.video-visible .profile-container-p {
  right: 415px; /* 400px del video + 15px de margen */
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
  transition: all 0.3s ease; /* NUEVO: Transición suave */
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

/* NUEVO: Contenido principal con margen dinámico */
.content {
  flex: 1;
  background-color: #ffffff;
  position: relative;
  transition: all 0.3s ease; /* Transición suave */
}

.content.with-video {
  margin-right: 0; /* Sin margen extra aquí, ya se maneja en .app */
}

/* NUEVO: Contenedor del reproductor de música con margen dinámico */
.music-player-container {
  transition: all 0.3s ease;
}

.music-player-container.with-video {
  margin-right: 400px; /* Espacio para el panel de video */
}

/* ESTILOS MEJORADOS DEL BUSCADOR */
.menu-search-container {
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
}

.menu-search {
  display: flex;
  align-items: center;
}

.menu-search input {
  flex: 1;
  padding: 10px;
  border: 1px solid #333;
  border-radius: 4px 0 0 4px;
  background-color: #222;
  color: #fff;
}

.menu-search input::placeholder {
  color: #888;
}

.menu-search button {
  padding: 10px 15px;
  background-color: #ff5100;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.menu-search button:hover {
  background-color: #ca3900;
}

/* ESTILOS PARA LOS RESULTADOS DE BÚSQUEDA */
.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  background-color: #222;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1010;
  margin-top: 8px;
}

.search-results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #333;
}

.search-results-header h3 {
  margin: 0;
  font-size: 14px;
  color: #ccc;
}

.close-button {
  background: none;
  border: none;
  color: #777;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #fff;
}

.search-results-list {
  padding: 10px 0;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-result-item:hover {
  background-color: #333;
}

.result-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 12px;
  flex-shrink: 0;
}

.result-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-subtitle {
  font-size: 12px;
  color: #999;
}

.result-type {
  background-color: #333;
  color: #ccc;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  text-transform: uppercase;
}

.no-results {
  padding: 15px;
  text-align: center;
  color: #999;
}

.no-results p {
  margin: 0;
}

/* FIN DE ESTILOS DEL BUSCADOR */

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

/* NUEVO: Responsive design mejorado */
@media screen and (max-width: 1200px) {
  .app.video-visible {
    margin-right: 350px; /* Menos espacio en pantallas medianas */
  }
  
  .app.video-visible .profile-container-p {
    right: 365px;
  }
  
  .music-player-container.with-video {
    margin-right: 350px;
  }
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
  
  /* NUEVO: En móvil, el video no desplaza contenido */
  .app.video-visible {
    margin-right: 0;
  }
  
  .app.video-visible .profile-container-p {
    right: 15px; /* Mantener posición original en móvil */
  }
  
  .music-player-container.with-video {
    margin-right: 0; /* Sin desplazamiento en móvil */
  }
  
  .app:after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }
  
  .sidebar.visible ~ .app:after {
    opacity: 1;
    visibility: visible;
  }
}
</style>