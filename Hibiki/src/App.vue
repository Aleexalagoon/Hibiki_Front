<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { usePlayerStore } from '@/stores/player';
import { useCancionesStore } from '@/stores/cancionesStore';
import { useArtistaStore } from '@/stores/artistaStore';
import MusicPlayer from '@/components/MusicPlayer.vue';
import Swal from 'sweetalert2';
import Perfil from '@/components/Perfil.vue';

const sidebarVisible = ref(false);
const searchQuery = ref('');
const searchResults = ref([]);
const showSearchResults = ref(false);
const showFilters = ref(false);
const showGenres = ref(true); // Estado para mostrar/ocultar géneros
const loading = ref(false);

// Filtros
const selectedGenero = ref('');
const ordenarPor = ref('');
const tipoResultado = ref('todos'); // todos, canciones, artistas

// 🎨 Géneros rediseñados con paleta naranja/negro que combina con tu web
const generos = ref([
  { 
    generoId: 1, 
    nombre: 'Reggaeton', 
    icono: '🔥', 
    color: '#FF5100', 
    descripcion: 'Música latina urbana con ritmo ardiente' 
  },
  { 
    generoId: 2, 
    nombre: 'Pop', 
    icono: '✨', 
    color: '#FF8C00', 
    descripcion: 'Música popular y pegajosa' 
  },
  { 
    generoId: 3, 
    nombre: 'Trap', 
    icono: '💎', 
    color: '#FF6B35', 
    descripcion: 'Hip hop urbano con actitud' 
  },
  { 
    generoId: 4, 
    nombre: 'Hip Hop', 
    icono: '🎯', 
    color: '#FF4500', 
    descripcion: 'Rap y cultura urbana auténtica' 
  },
  { 
    generoId: 5, 
    nombre: 'R&B', 
    icono: '🌙', 
    color: '#CC4400', 
    descripcion: 'Rhythm and Blues con soul' 
  },
  { 
    generoId: 6, 
    nombre: 'Electrónica', 
    icono: '⚡', 
    color: '#FF7F00', 
    descripcion: 'Beats electrónicos y EDM' 
  },
  { 
    generoId: 7, 
    nombre: 'Rock', 
    icono: '🤘', 
    color: '#B8460E', 
    descripcion: 'Rock potente y energético' 
  },
  { 
    generoId: 8, 
    nombre: 'Indie', 
    icono: '🌆', 
    color: '#D2691E', 
    descripcion: 'Sonidos independientes y únicos' 
  },
  { 
    generoId: 9, 
    nombre: 'Jazz', 
    icono: '🎺', 
    color: '#A0522D', 
    descripcion: 'Jazz clásico y contemporáneo' 
  },
  { 
    generoId: 10, 
    nombre: 'Folk', 
    icono: '🍂', 
    color: '#8B4513', 
    descripcion: 'Música folk y acústica' 
  },
]);

const authStore = useAuthStore();
const playerStore = usePlayerStore();
const cancionesStore = useCancionesStore();
const artistaStore = useArtistaStore();
const router = useRouter();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isPremium = computed(() => authStore.isPremium);
const allSongs = computed(() => cancionesStore.canciones || []);

// Computed para filtros activos
const hasActiveFilters = computed(() => 
  selectedGenero.value || ordenarPor.value || tipoResultado.value !== 'todos'
);

// Computed para resultados filtrados CORREGIDO
const filteredResults = computed(() => {
  let results = [...searchResults.value];
  
  // Filtrar por tipo
  if (tipoResultado.value !== 'todos') {
    if (tipoResultado.value === 'canciones') {
      results = results.filter(result => result.type === 'song');
    } else if (tipoResultado.value === 'artistas') {
      results = results.filter(result => result.type === 'artist');
    }
  }
  
  // Ordenar
  if (ordenarPor.value === 'nombre') {
    results.sort((a, b) => a.title.localeCompare(b.title));
  } else if (ordenarPor.value === 'artista') {
    results.sort((a, b) => (a.artist || '').localeCompare(b.artist || ''));
  } else if (ordenarPor.value === 'popularidad') {
    results.sort((a, b) => (b.listeners || 0) - (a.listeners || 0));
  }
  
  return results;
});

// Computed para estadísticas
const resultStats = computed(() => {
  const canciones = filteredResults.value.filter(r => r.type === 'song').length;
  const artistas = filteredResults.value.filter(r => r.type === 'artist').length;
  
  return { canciones, artistas, total: canciones + artistas };
});

let adInterval: any = null;
let searchTimeout: any = null;

const toggleSidebar = () => sidebarVisible.value = !sidebarVisible.value;

// FUNCIÓN DE BÚSQUEDA CORREGIDA
const performSearch = () => {
  if (!searchQuery.value.trim()) {
    showSearchResults.value = false;
    searchResults.value = [];
    return;
  }

  loading.value = true;
  const query = searchQuery.value.toLowerCase().trim();
  let songResults = [];
  let artistResults = [];
  
  console.log(`🔍 Buscando: "${query}" | Género seleccionado: ${selectedGenero.value}`);
  
  // Buscar en canciones - LÓGICA CORREGIDA
  if (cancionesStore.canciones && Array.isArray(cancionesStore.canciones)) {
    songResults = cancionesStore.canciones.filter(cancion => {
      const nombre = cancion?.nombre ? cancion.nombre.toLowerCase() : '';
      const artista = cancion?.artista ? cancion.artista.toLowerCase() : '';
      const album = cancion?.album ? cancion.album.toLowerCase() : '';
      
      // Búsqueda por texto
      const matchesQuery = nombre.includes(query) || 
                          artista.includes(query) || 
                          album.includes(query) ||
                          nombre.replace(/\s+/g, '').includes(query.replace(/\s+/g, '')) ||
                          artista.replace(/\s+/g, '').includes(query.replace(/\s+/g, ''));
      
      // ✅ CORRECCIÓN: Solo aplicar filtro de género si está seleccionado
      if (selectedGenero.value) {
        const generoSeleccionado = parseInt(selectedGenero.value);
        const cancionGeneroId = cancion.generoId || cancion.GeneroId || cancion.generoid;
        
        console.log(`🎵 ${cancion.nombre} - GeneroId: ${cancionGeneroId}, Buscando: ${generoSeleccionado}, Match texto: ${matchesQuery}`);
        
        // Debe coincidir TANTO en texto COMO en género
        const matchesGenero = cancionGeneroId === generoSeleccionado || 
                             cancionGeneroId === generoSeleccionado.toString();
        
        return matchesQuery && matchesGenero;
      }
      
      // Si no hay género seleccionado, solo buscar por texto
      return matchesQuery;
    });
  }
  
  // Buscar en artistas (solo si no hay género seleccionado, ya que los artistas no tienen género)
  if (!selectedGenero.value && artistaStore.allArtists && Array.isArray(artistaStore.allArtists)) {
    artistResults = artistaStore.allArtists.filter(artista => {
      const nombre = artista?.nombre ? artista.nombre.toLowerCase() : '';
      
      return nombre.includes(query) || 
             nombre.replace(/\s+/g, '').includes(query.replace(/\s+/g, ''));
    });
  }
  
  // Combinar resultados
  searchResults.value = [
    ...songResults.map(song => ({
      type: 'song',
      id: song.cancionId || song.id,
      title: song.nombre || 'Sin título',
      artist: song.artista || 'Artista desconocido',
      cover: song.image || '/default-cover.jpg',
      duration: song.duracion || '0:00',
      generoId: song.generoId || song.GeneroId || song.generoid || null,
      data: song
    })),
    ...artistResults.map(artist => ({
      type: 'artist',
      id: artist.cantanteId || artist.id,
      title: artist.nombre || 'Artista',
      cover: artist.image || '/default-artist.jpg',
      listeners: artist.oyentesMensuales || 0,
      data: artist
    }))
  ];
  
  console.log(`📊 Resultados: ${songResults.length} canciones, ${artistResults.length} artistas`);
  
  loading.value = false;
  showSearchResults.value = true;
  
  if (window.innerWidth <= 768) {
    sidebarVisible.value = false;
  }
};

const handleSearch = () => {
  // Debounce mejorado
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(performSearch, 400);
};

const searchWithButton = () => {
  // Búsqueda inmediata al hacer clic en la lupa
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  performSearch();
};

const navigateToResult = (result) => {
  if (result.type === 'song') {
    if (typeof playerStore.setSong === 'function') {
      playerStore.setSong(result.data);
    }
  } else if (result.type === 'artist') {
    if (typeof artistaStore.fetchArtistData === 'function') {
      artistaStore.fetchArtistData(result.id);
    }
    router.push('/artista');
  }
  
  closeSearchResults();
};

const closeSearchResults = () => {
  showSearchResults.value = false;
  showFilters.value = false;
  // ✅ OPCIONAL: Descomentar la línea de abajo si quieres que se limpie el género al cerrar
  // selectedGenero.value = '';
};

const clearSearch = () => {
  searchQuery.value = '';
  searchResults.value = [];
  selectedGenero.value = ''; // ✅ Limpiar género al limpiar búsqueda
  closeSearchResults();
};

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const toggleGenres = () => {
  showGenres.value = !showGenres.value;
};

const clearAllFilters = () => {
  selectedGenero.value = '';
  ordenarPor.value = '';
  tipoResultado.value = 'todos';
  if (searchQuery.value.trim()) {
    performSearch();
  }
};

// FUNCIÓN SELECTGENERO MEJORADA - Ahora abre el buscador automáticamente
const selectGenero = (generoId) => {
  selectedGenero.value = generoId.toString();
  loading.value = true;
  
  // ✅ NUEVA FUNCIONALIDAD: Limpiar búsqueda de texto y abrir buscador automáticamente
  searchQuery.value = '';
  showSearchResults.value = true; // 🔥 Abrir el buscador automáticamente
  
  if (cancionesStore.canciones && Array.isArray(cancionesStore.canciones)) {
    const genero = generos.value.find(g => g.generoId === generoId);
    
    // Buscar canciones del género seleccionado
    const cancionesFiltradas = cancionesStore.canciones.filter(cancion => {
      const generoCancion = cancion.generoId || cancion.GeneroId || cancion.generoid;
      
      console.log(`🎵 Filtrando por género: ${genero?.nombre} (ID: ${generoId})`);
      console.log(`Canción: ${cancion.nombre}, GeneroId: ${generoCancion}`);
      
      return generoCancion === generoId || 
             generoCancion === parseInt(generoId) ||
             generoCancion === generoId.toString();
    });
    
    console.log(`🎵 Total canciones: ${cancionesStore.canciones.length}`);
    console.log(`🎵 Género seleccionado: ${genero?.nombre} (ID: ${generoId})`);
    console.log(`🎵 Canciones encontradas: ${cancionesFiltradas.length}`);
    
    // Si no encontramos por generoId, mostrar las primeras canciones para debug
    if (cancionesFiltradas.length === 0) {
      console.log('🔍 No se encontraron canciones. Estructura de las primeras 3 canciones:');
      cancionesStore.canciones.slice(0, 3).forEach((cancion, index) => {
        console.log(`Canción ${index + 1}:`, {
          nombre: cancion.nombre,
          generoId: cancion.generoId,
          GeneroId: cancion.GeneroId,
          generoid: cancion.generoid,
          todasLasPropiedades: Object.keys(cancion)
        });
      });
    }
    
    searchResults.value = cancionesFiltradas.map(song => ({
      type: 'song',
      id: song.cancionId || song.id,
      title: song.nombre || 'Sin título',
      artist: song.artista || 'Artista desconocido',
      cover: song.image || '/default-cover.jpg',
      duration: song.duracion || '0:00',
      generoId: generoId,
      data: song
    }));
    
    // ✅ MOSTRAR MENSAJE PERSONALIZADO en el header
    if (cancionesFiltradas.length > 0) {
      console.log(`✅ Mostrando ${cancionesFiltradas.length} canciones de ${genero?.nombre}`);
    } else {
      console.log(`❌ No se encontraron canciones de ${genero?.nombre}`);
    }
  }
  
  loading.value = false;
  
  // ✅ CERRAR SIDEBAR EN MÓVIL para mejor UX
  if (window.innerWidth <= 768) {
    sidebarVisible.value = false;
  }
};

const logout = () => {
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
  }, 60000);
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
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
});
</script>

<template>
  <div class="app-container">
    <div class="app">
      <!-- Sidebar -->
      <aside class="sidebar" :class="{ 'visible': sidebarVisible }">
        <div class="logo">HIBIKI</div>
        <nav class="menu">
          <!-- Buscador mejorado -->
          <div class="menu-search-container">
            <div class="search-header">
              <div class="menu-search">
                <input 
                  type="text" 
                  placeholder="Buscar canciones, artistas..." 
                  v-model="searchQuery" 
                  @input="handleSearch"
                  @keyup.enter="searchWithButton"
                  @focus="handleSearch"
                />
                <button v-if="searchQuery" @click="clearSearch" class="clear-search-btn">✕</button>
              </div>
              <div class="search-buttons">
                <button @click="searchWithButton" class="search-btn" title="Buscar">
                  🔍
                </button>
                <button @click="toggleFilters" class="filters-toggle" :class="{ active: showFilters }" title="Filtros">
                  🎵
                  <span v-if="hasActiveFilters" class="filter-indicator">●</span>
                </button>
              </div>
            </div>
            
            <!-- Panel de filtros mejorado -->
            <div v-if="showFilters" class="filters-panel">
              <div class="filter-section">
                <div class="filter-header">
                  <h4>🎛️ Filtros</h4>
                  <button @click="clearAllFilters" class="clear-filters-btn">Limpiar</button>
                </div>
                
                <div class="filter-group">
                  <label>📂 Tipo:</label>
                  <select v-model="tipoResultado" @change="performSearch">
                    <option value="todos">Todos los resultados</option>
                    <option value="canciones">Solo canciones</option>
                    <option value="artistas">Solo artistas</option>
                  </select>
                </div>
                
                <div class="filter-group">
                  <label>🔢 Ordenar:</label>
                  <select v-model="ordenarPor" @change="performSearch">
                    <option value="">Relevancia</option>
                    <option value="nombre">Nombre (A-Z)</option>
                    <option value="artista">Artista (A-Z)</option>
                    <option value="popularidad">Popularidad</option>
                  </select>
                </div>
                
                <div class="filter-group">
                  <label>🎨 Género:</label>
                  <select v-model="selectedGenero" @change="performSearch">
                    <option value="">Todos los géneros</option>
                    <option v-for="genero in generos" :key="genero.generoId" :value="genero.generoId">
                      {{ genero.icono }} {{ genero.nombre }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            
            <!-- Resultados de búsqueda mejorados -->
            <div v-if="showSearchResults" class="search-results">
              <!-- Loading -->
              <div v-if="loading" class="search-loading">
                <div class="spinner"></div>
                <p>Buscando...</p>
              </div>
              
              <!-- Estadísticas de resultados MEJORADAS -->
              <div v-if="!loading && resultStats.total > 0" class="search-stats">
                <div class="stats-header">
                  <!-- ✅ MOSTRAR GÉNERO SELECCIONADO de forma prominente -->
                  <h3 v-if="selectedGenero && !searchQuery" class="genre-title">
                    {{ generos.find(g => g.generoId == selectedGenero)?.icono }} 
                    {{ generos.find(g => g.generoId == selectedGenero)?.nombre }}
                    <span class="song-count">({{ resultStats.total }})</span>
                  </h3>
                  <h3 v-else>📊 Resultados ({{ resultStats.total }})</h3>
                  <button @click="closeSearchResults" class="close-button">✕</button>
                </div>
                <div class="stats-breakdown">
                  <span v-if="resultStats.canciones > 0">🎵 {{ resultStats.canciones }} canciones</span>
                  <span v-if="resultStats.artistas > 0">👤 {{ resultStats.artistas }} artistas</span>
                </div>
                <!-- MEJORADO: Mostrar filtros activos con estilo especial para géneros -->
                <div v-if="hasActiveFilters" class="active-filters">
                  <small>
                    <!-- Mostrar género con estilo especial -->
                    <span v-if="selectedGenero" class="genre-filter-badge" 
                          :style="{ 
                            backgroundColor: generos.find(g => g.generoId == selectedGenero)?.color + '20',
                            borderColor: generos.find(g => g.generoId == selectedGenero)?.color,
                            color: generos.find(g => g.generoId == selectedGenero)?.color
                          }">
                      {{ generos.find(g => g.generoId == selectedGenero)?.icono }} 
                      {{ generos.find(g => g.generoId == selectedGenero)?.nombre }}
                    </span>
                    <span v-if="tipoResultado !== 'todos'">📂 {{ tipoResultado }}</span>
                    <span v-if="ordenarPor">🔢 {{ ordenarPor }}</span>
                  </small>
                </div>
              </div>
              
              <!-- Lista de resultados sin límite -->
              <div class="search-results-list">
                <div v-if="!loading && filteredResults.length === 0" class="no-results">
                  <div class="no-results-icon">🔍</div>
                  <p>No se encontraron resultados</p>
                  <small v-if="hasActiveFilters">
                    Intenta con otros términos o <button @click="clearAllFilters" class="link-button">quita los filtros</button>
                  </small>
                  <small v-else>Intenta con otros términos de búsqueda</small>
                </div>
                
                <!-- Mostrar TODOS los resultados sin límite -->
                <div 
                  v-for="result in filteredResults" 
                  :key="`${result.type}-${result.id}`"
                  class="search-result-item"
                  @click="navigateToResult(result)"
                >
                  <div class="result-image">
                    <img :src="result.cover" :alt="result.title" />
                    <div class="result-overlay">
                      <span class="play-icon">▶</span>
                    </div>
                  </div>
                  <div class="result-info">
                    <div class="result-title">{{ result.title }}</div>
                    <div class="result-subtitle">
                      {{ result.type === 'song' ? result.artist : `${result.listeners || 0} oyentes` }}
                    </div>
                    <div v-if="result.type === 'song' && result.duration" class="result-duration">
                      {{ result.duration }}
                    </div>
                  </div>
                  <div class="result-type">
                    {{ result.type === 'song' ? '🎵' : '👤' }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Géneros con toggle mejorado y alineado -->
            <div v-if="!searchQuery && !showSearchResults" class="genre-section">
              <div class="genre-header">
                <h4>🎨 Explorar géneros</h4>
                <button @click="toggleGenres" class="toggle-genres-btn" :class="{ active: showGenres }">
                  {{ showGenres ? '▼' : '▶' }}
                </button>
              </div>
              
              <div v-if="showGenres" class="genre-chips">
                <button
                  v-for="genero in generos"
                  :key="genero.generoId"
                  @click="selectGenero(genero.generoId)"
                  class="genre-chip"
                  :style="{ 
                    backgroundColor: genero.color + '20', 
                    borderColor: genero.color,
                    color: genero.color 
                  }"
                  :title="genero.descripcion"
                >
                  <span class="genre-icon">{{ genero.icono }}</span>
                  <span class="genre-name">{{ genero.nombre }}</span>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Enlaces de navegación alineados -->
          <div class="navigation-menu">
            <!-- Mostrar Inicio solo si no es premium o no está autenticado -->
            <router-link v-if="!isPremium || !isAuthenticated" to="/inicio" class="menu-item" active-class="active" @click="sidebarVisible = false"> Inicio</router-link>
            <router-link to="/novedades" class="menu-item" active-class="active" @click="sidebarVisible = false"> Novedades</router-link>
            
            <div v-if="isAuthenticated">
              <router-link to="/artista" class="menu-item" active-class="active" @click="sidebarVisible = false"> Artistas</router-link>
              <router-link to="/playlist" class="menu-item" active-class="active" @click="sidebarVisible = false"> Playlists</router-link>
              <router-link to="/premium" class="menu-item" active-class="active" @click="sidebarVisible = false"> Premium</router-link>
              <router-link to="/conciertos" class="menu-item" active-class="active" @click="sidebarVisible = false">Concerts</router-link>
<router-link to="/descarga" class="menu-item" active-class="active" @click="sidebarVisible = false">Download</router-link>
            </div>
          </div>
        </nav>
        
        <div v-if="isAuthenticated" class="auth-buttons">
          <button class="logout-button" @click="logout">Cerrar Sesión</button>
        </div>
      </aside>
      
      <!-- Mobile Menu Toggle Button -->
      <div class="menu-toggle" @click="toggleSidebar">
        <div class="menu-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      <!-- Componente de perfil de usuario -->
      <div class="profile-container-p">
        <Perfil />
      </div>
      
      <main class="content">
        <RouterView />
      </main>
    </div>
    
    <!-- Reproductor de música -->
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

.profile-container-p {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 1100;
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
  text-align: center;
  background: linear-gradient(45deg, #ff5100, #ff8c00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
  transition: all 0.3s ease;
  border-radius: 8px;
}

.menu-item:hover, .menu-item.active {
  background-color: #444;
  transform: translateX(5px);
}

.content {
  flex: 1;
  background-color: #ffffff;
  position: relative;
}

/* ESTILOS DEL BUSCADOR SÚPER MEJORADO */
.menu-search-container {
  position: relative;
  width: 100%;
  margin-bottom: 1.5rem;
}

.search-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.menu-search {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.menu-search input {
  width: 100%;
  padding: 12px 16px;
  padding-right: 40px;
  border: 2px solid #444;
  border-radius: 25px;
  background: #2a2a2a;
  color: white;
  outline: none;
  transition: all 0.3s ease;
  font-size: 14px;
}

.menu-search input:focus {
  border-color: #ff5100;
  background: #333;
  box-shadow: 0 0 0 3px rgba(255, 81, 0, 0.1);
}

.menu-search input::placeholder {
  color: #999;
}

.clear-search-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 16px;
  transition: color 0.3s ease;
}

.clear-search-btn:hover {
  color: #fff;
}

.search-buttons {
  display: flex;
  gap: 4px;
}

.search-btn,
.filters-toggle {
  width: 40px;
  height: 40px;
  background: #444;
  border: 2px solid #444;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  font-size: 14px;
}

.search-btn:hover,
.filters-toggle:hover,
.filters-toggle.active {
  background: #ff5100;
  border-color: #ff5100;
  transform: scale(1.1);
}

/* SOLO mostrar el punto verde cuando hay filtros activos - SIN punto gris */
.filter-indicator {
  position: absolute;
  top: -3px;
  right: -3px;
  width: 12px;
  height: 12px;
  background: #00ff00;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
  border: 2px solid #000;
  box-shadow: 0 0 4px rgba(0, 255, 0, 0.5);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* PANEL DE FILTROS MEJORADO */
.filters-panel {
  background: linear-gradient(135deg, #333, #2a2a2a);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid #555;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.filter-section h4 {
  margin: 0;
  font-size: 14px;
  color: #ff5100;
  font-weight: 600;
}

.filter-group {
  margin-bottom: 12px;
}

.filter-group label {
  display: block;
  font-size: 12px;
  color: #ccc;
  margin-bottom: 4px;
  font-weight: 500;
}

.filter-group select {
  width: 100%;
  padding: 8px 12px;
  background: #2a2a2a;
  border: 1px solid #555;
  border-radius: 8px;
  color: white;
  font-size: 12px;
  outline: none;
  transition: border-color 0.3s ease;
}

.filter-group select:focus {
  border-color: #ff5100;
}

.clear-filters-btn {
  padding: 6px 12px;
  background: transparent;
  border: 1px solid #666;
  border-radius: 8px;
  color: #ccc;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.3s ease;
}

.clear-filters-btn:hover {
  border-color: #ff5100;
  color: #ff5100;
}

/* RESULTADOS DE BÚSQUEDA MEJORADOS */
.search-results {
  background: linear-gradient(135deg, #222, #1a1a1a);
  border-radius: 12px;
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #444;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.search-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #444;
  border-top: 2px solid #ff5100;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* NUEVOS ESTILOS para la visualización de géneros seleccionados */
.genre-title {
  display: flex;
  align-items: center;
  font-size: 18px !important;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #ff5100, #ff8c00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(255, 81, 0, 0.3);
}

.song-count {
  margin-left: 8px;
  font-size: 14px;
  color: #ccc !important;
  background: rgba(255, 81, 0, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.genre-filter-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 15px;
  border: 1.5px solid;
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.genre-filter-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* ESTILOS EXISTENTES MEJORADOS */
.search-stats {
  padding: 12px 16px;
  border-bottom: 1px solid #333;
  background: rgba(255, 81, 0, 0.1);
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.stats-header h3 {
  margin: 0;
  font-size: 14px;
  color: #fff;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  color: #777;
  font-size: 16px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #fff;
}

.stats-breakdown {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: #ccc;
}

/* NUEVO: Estilos para filtros activos */
.active-filters {
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px solid #444;
}

.active-filters small {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 10px;
  color: #ff5100;
}

.active-filters span {
  background: rgba(255, 81, 0, 0.2);
  padding: 2px 6px;
  border-radius: 8px;
  border: 1px solid rgba(255, 81, 0, 0.3);
}

.search-results-list {
  padding: 8px 0;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 4px 8px;
}

.search-result-item:hover {
  background: linear-gradient(90deg, rgba(255, 81, 0, 0.1), rgba(255, 81, 0, 0.05));
  transform: translateX(5px);
}

.result-image {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 12px;
  flex-shrink: 0;
  position: relative;
}

.result-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.result-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.search-result-item:hover .result-overlay {
  opacity: 1;
}

.search-result-item:hover .result-image img {
  transform: scale(1.1);
}

.play-icon {
  color: #ff5100;
  font-size: 18px;
}

.result-info {
  flex: 1;
  min-width: 0;
  margin-right: 8px;
}

.result-title {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-subtitle {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.result-duration {
  font-size: 10px;
  color: #666;
}

.result-type {
  font-size: 16px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.search-result-item:hover .result-type {
  opacity: 1;
}

.no-results {
  padding: 30px 20px;
  text-align: center;
  color: #999;
}

.no-results-icon {
  font-size: 48px;
  opacity: 0.5;
  margin-bottom: 12px;
}

.no-results p {
  margin: 8px 0 4px 0;
  font-size: 16px;
  font-weight: 500;
}

.no-results small {
  font-size: 12px;
  opacity: 0.7;
}

.link-button {
  background: none;
  border: none;
  color: #ff5100;
  cursor: pointer;
  text-decoration: underline;
  font-size: inherit;
}

.link-button:hover {
  color: #ff8c00;
}

/* GÉNEROS MEJORADOS Y ALINEADOS */
.genre-section {
  margin-bottom: 16px;
  padding: 0;
}

.genre-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0;
}

.genre-header h4 {
  margin: 0;
  font-size: 14px;
  color: #ccc;
  font-weight: 600;
}

.toggle-genres-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
  padding: 4px 8px;
  border-radius: 4px;
}

.toggle-genres-btn:hover,
.toggle-genres-btn.active {
  color: #ff5100;
  background: rgba(255, 81, 0, 0.1);
}

/* CONTENEDOR DE NAVEGACIÓN ALINEADO */
.navigation-menu {
  margin-top: 0;
  padding-top: 0;
}

.genre-chips {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.genre-chip {
  display: flex;
  align-items: center;
  padding: 12px 14px;
  background: transparent;
  border: 2px solid;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-size: 11px;
  font-weight: 600;
  position: relative;
  overflow: hidden;
}

.genre-chip::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

.genre-chip:hover {
  transform: scale(1.08) translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  background: linear-gradient(135deg, rgba(255, 81, 0, 0.1), rgba(255, 81, 0, 0.05));
}

.genre-chip:hover::before {
  left: 100%;
}

.genre-chip:active {
  transform: scale(1.02);
}

.genre-icon {
  margin-right: 8px;
  font-size: 16px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
}

.genre-chip:hover .genre-icon {
  transform: rotate(15deg) scale(1.2);
}

.genre-name {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5px;
}

.auth-buttons {
  text-align: center;
  padding: 1rem 0;
}

.logout-button {
  background: linear-gradient(45deg, #ff5100, #ff8c00);
  color: white;
  font-size: 16px;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  font-weight: 600;
}

.logout-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 81, 0, 0.3);
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
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

/* Scrollbar personalizado */
.search-results::-webkit-scrollbar,
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.search-results::-webkit-scrollbar-track,
.sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.search-results::-webkit-scrollbar-thumb,
.sidebar::-webkit-scrollbar-thumb {
  background: #ff5100;
  border-radius: 10px;
}

.search-results::-webkit-scrollbar-thumb:hover,
.sidebar::-webkit-scrollbar-thumb:hover {
  background: #ff8c00;
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
    width: 85%;
    max-width: 320px;
    transition: left 0.3s ease;
  }
  
  .sidebar.visible {
    left: 0;
  }
  
  .content {
    width: 100%;
    padding-top: 60px;
  }
  
  .search-results {
    max-height: 300px;
  }
  
  .genre-chips {
    grid-template-columns: 1fr;
  }
  
  .search-buttons {
    flex-direction: column;
    gap: 4px;
  }
  
  .search-header {
    flex-direction: column;
    gap: 8px;
  }
  
  .menu-search {
    width: 100%;
  }
}
</style>