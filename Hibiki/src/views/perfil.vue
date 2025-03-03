<template>
  <div class="profile-container">
    <!-- Sección de perfil de usuario -->
    <div class="profile-header">
      <div class="profile-avatar">
        <div v-if="profileStore.userData.avatar" class="avatar-image">
          <img :src="profileStore.userData.avatar" alt="Foto de perfil" />
        </div>
        <div v-else class="avatar-placeholder">
          <svg class="avatar-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A4 4 0 018.98 15h6.04a4 4 0 013.858 2.804M12 11a4 4 0 100-8 4 4 0 000 8z"></path>
          </svg>
        </div>
      </div>
      
      <div class="profile-info">
        <span class="profile-label">Perfil</span>
        <h1 class="profile-name">{{ profileStore.userData.name }}</h1>
        <p class="profile-stats">
          {{ profileStore.userData.publicLists }} listas públicas • 
          <span class="follow-text">Sigue a {{ profileStore.userData.following }} usuarios</span>
        </p>
      </div>
      
      <div class="profile-options">
        <button class="options-button" @click="toggleOptions">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </button>
        <div v-if="showOptions" class="options-dropdown">
          <ul>
            <li @click="editProfile">Editar perfil</li>
            <li @click="shareProfile">Compartir perfil</li>
            <li @click="copyLink">Copiar enlace</li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="profileStore.loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando datos...</p>
    </div>
    
    <!-- Error message -->
    <div v-if="profileStore.error" class="error-message">
      <p>{{ profileStore.error }}</p>
      <button @click="loadUserData" class="retry-button">Reintentar</button>
    </div>
    
    <div v-if="!profileStore.loading && !profileStore.error">
      <!-- Sección de artistas más escuchados -->
      <div class="top-artists-section" v-if="profileStore.topArtists.length > 0">
        <div class="section-header">
          <h2 class="section-title">Artistas más escuchados este mes</h2>
          <span class="section-visibility">Solo visibles para ti</span>
          <button class="show-all-button" @click="showAllArtists">Mostrar todos</button>
        </div>
        
        <div class="artists-grid">
          <div v-for="artist in profileStore.topArtists" :key="artist.id" class="artist-card" @click="navigateToArtist(String(artist.id))">
            <div class="artist-image">
              <img :src="artist.image" :alt="artist.name" />
            </div>
            <div class="artist-name">{{ artist.name }}</div>
            <div class="artist-label">Artista</div>
          </div>
        </div>
      </div>
      
      <!-- Sección de canciones más escuchadas -->
      <section class="top-tracks-section" v-if="profileStore.topTracks.length > 0">
        <div class="section-header">
          <h2 class="section-title">Canciones más escuchadas este mes</h2>
          <span class="section-visibility">Solo visibles para ti</span>
          <button class="show-all-button" @click="showAllTracks">Mostrar todos</button>
        </div>
        
        <div class="tracks-list">
          <div v-for="(track, index) in profileStore.topTracks" :key="track.id" class="track-item">
            <div class="track-index">
              <button v-if="index === 0 || (playingTrack === String(track.id))" class="play-button" @click="playTrack(String(track.id))">
                <svg v-if="playingTrack !== String(track.id)" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M8 5v14l11-7z"></path>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
                </svg>
              </button>
              <span v-else>{{ index + 1 }}</span>
            </div>

            <div class="track-image">
              <img :src="track.image" :alt="track.title" />
            </div>

            <div class="track-info">
              <div class="track-title" :class="{ 'explicit': track.explicit }">
                {{ track.title }}
                <span v-if="track.explicit" class="explicit-badge">E</span>
              </div>
              <div class="track-artist">{{ track.artist }}</div>
            </div>

            <div class="track-album">{{ track.album }}</div>

            <div class="track-liked">
              <button @click.stop="toggleLike(track)">
                <svg v-if="track.liked" viewBox="0 0 24 24" fill="red" width="20" height="20">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="20" height="20">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                </svg>
              </button>
            </div>

            <div class="track-duration">{{ track.duration }}</div>

            <div class="track-options">
              <button class="options-button" @click.stop="toggleTrackOptions(track.id)">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                </svg>
              </button>
              <div v-if="activeTrackOptions === track.id" class="track-options-dropdown">
                <ul>
                  <li @click="addToPlaylist(track.id)">Añadir a una lista</li>
                  <li @click="goToArtist(track.id)">Ir al artista</li>
                  <li @click="goToAlbum(track.id)">Ir al álbum</li>
                  <li @click="shareTrack(track.id)">Compartir</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Sección de listas públicas -->
      <section class="public-playlists-section" v-if="profileStore.publicPlaylists.length > 0">
        <div class="section-header">
          <h2 class="section-title">Listas públicas</h2>
          <button v-if="profileStore.publicPlaylists.length > 6" class="show-all-button" @click="showAllPlaylists">Mostrar todas</button>
        </div>
        
        <div class="playlists-grid">
          <div v-for="playlist in profileStore.publicPlaylists" :key="playlist.id" class="playlist-card" @click="navigateToPlaylist(playlist.id)">
            <div class="playlist-image">
              <img :src="playlist.image" :alt="playlist.title" />
            </div>
            <div class="playlist-title">{{ playlist.title }}</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/perfil';

const router = useRouter();
const authStore = useAuthStore();
const profileStore = useProfileStore();

// Estados para la UI
const showOptions = ref(false);
const activeTrackOptions = ref<number | null>(null);
const playingTrack = ref<string | null>(null);

// Función para cargar los datos del usuario utilizando Pinia
const loadUserData = async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }
  
  // Utilizar el store para cargar todos los datos
  await profileStore.fetchUserData(authStore.user.token);
};

// Funciones de interacción con la UI
const toggleOptions = () => {
  showOptions.value = !showOptions.value;
  // Cerrar menú de opciones de pista cuando se abre el menú principal
  activeTrackOptions.value = null;
};

const toggleTrackOptions = (trackId: number) => {
  if (activeTrackOptions.value === trackId) {
    activeTrackOptions.value = null;
  } else {
    activeTrackOptions.value = trackId;
  }
  // Cerrar menú de opciones principal
  showOptions.value = false;
};

const toggleLike = async (track: { id: number; liked: boolean }) => {
  try {
    const token = authStore.user.token;
    const endpoint = track.liked ? 'unlike' : 'like';
    
    const response = await fetch(`https://localhost:7295/api/canciones/${track.id}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`No se pudo ${track.liked ? 'quitar' : 'dar'} me gusta`);
    }
    
    // Actualizar el estado localmente
    track.liked = !track.liked;
  } catch (err) {
    console.error('Error al interactuar con me gusta:', err);
    // Para demo, actualizamos localmente aunque falle la API
    track.liked = !track.liked;
  }
};

const playTrack = (trackId: string) => {
  if (playingTrack.value === trackId) {
    playingTrack.value = null; // Pausar
  } else {
    playingTrack.value = trackId; // Reproducir
  }
};

// Funciones de navegación
const navigateToArtist = (artistId: string) => {
  router.push(`/artista/${artistId}`);
};

const navigateToPlaylist = (playlistId: number) => {
  router.push(`/playlist/${playlistId}`);
};

const showAllArtists = () => {
  router.push('/artistas');
};

const showAllTracks = () => {
  router.push('/canciones');
};

const showAllPlaylists = () => {
  router.push('/playlists');
};

// Funciones para el menú de opciones
const editProfile = () => {
  router.push('/perfil/editar');
};

const shareProfile = () => {
  if (navigator.share) {
    navigator.share({
      title: `Perfil de ${profileStore.userData.name}`,
      url: window.location.href
    }).catch(err => console.error('Error al compartir:', err));
  } else {
    alert('Compartir no está disponible en este navegador');
  }
};

const copyLink = () => {
  navigator.clipboard.writeText(window.location.href)
    .then(() => {
      alert('Enlace copiado al portapapeles');
    })
    .catch(err => {
      console.error('Error al copiar enlace:', err);
    });
};

// Funciones para opciones de pista
const addToPlaylist = (trackId: number) => {
  // Aquí implementarías la lógica para mostrar un modal de selección de playlist
  console.log('Añadir pista a una lista:', trackId);
};

const goToArtist = (trackId: number) => {
  const track = profileStore.topTracks.find(t => t.id === trackId);
  if (track) {
    // Idealmente, necesitarías obtener el ID del artista
    router.push(`/buscar?q=${encodeURIComponent(track.artist)}`);
  }
};

const goToAlbum = (trackId: number) => {
  const track = profileStore.topTracks.find(t => t.id === trackId);
  if (track) {
    // Idealmente, necesitarías obtener el ID del álbum
    router.push(`/buscar?q=${encodeURIComponent(track.album)}`);
  }
};

const shareTrack = (trackId: number) => {
  const track = profileStore.topTracks.find(t => t.id === trackId);
  if (track) {
    if (navigator.share) {
      navigator.share({
        title: track.title,
        text: `Escucha ${track.title} de ${track.artist}`,
        url: window.location.href
      }).catch(err => console.error('Error al compartir:', err));
    } else {
      alert('Compartir no está disponible en este navegador');
    }
  }
};

// Inicializar el componente
onMounted(() => {
  // Comprobar si el usuario está autenticado
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }
  
  // Cargar los datos del usuario
  loadUserData();
  
  // Cerrar los menús cuando se hace clic fuera de ellos
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    if (showOptions.value && target && !target.closest('.profile-options')) {
      showOptions.value = false;
    }
    if (activeTrackOptions.value !== null && target && !target.closest('.track-options')) {
      activeTrackOptions.value = null;
    }
  });
});
</script>

<style lang="scss" scoped>
.profile-container {
  width: 100%;
  min-height: 100%;
  background: linear-gradient(180deg, #1e1e1e 0%, #121212 100%);
  color: white;
  padding: 24px;
}

// Loading spinner
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 40px;
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    border-top-color: #ffffff;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 16px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  p {
    color: #a7a7a7;
    font-size: 14px;
  }
}

// Error message
.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: rgba(255, 0, 0, 0.1);
  border-radius: 8px;
  margin: 20px 0;
  
  p {
    color: #ff6b6b;
    font-size: 16px;
    margin-bottom: 16px;
  }
  
  .retry-button {
    background-color: #ff5100;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #ca3900;
    }
  }
}

// Sección del encabezado del perfil
.profile-header {
  display: flex;
  align-items: center;
  padding-bottom: 48px;
  position: relative;
  
  .profile-avatar {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background-color: #2a2a2a;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    border: 3px solid rgba(255, 255, 255, 0.05);
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.02);
      border-color: rgba(255, 255, 255, 0.1);
    }
    
    .avatar-image {
      width: 100%;
      height: 100%;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .avatar-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .avatar-icon {
        width: 60px;
        height: 60px;
        color: #6a6a6a;
      }
    }
  }
  
  .profile-info {
    margin-left: 24px;
    flex: 1;
    
    .profile-label {
      display: block;
      font-size: 14px;
      color: #a7a7a7;
      margin-bottom: 8px;
    }
    
    .profile-name {
      font-size: 72px;
      font-weight: 700;
      line-height: 1.1;
      margin: 0;
      background: linear-gradient(90deg, #ffffff, #a7a7a7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    .profile-stats {
      margin-top: 8px;
      color: #a7a7a7;
      font-size: 14px;
      
      .follow-text {
        font-weight: 600;
        color: #d9d9d9;
      }
    }
  }
  
  .profile-options {
    position: relative;
    
    .options-button {
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      padding: 8px;
      
      .dot {
        width: 5px;
        height: 5px;
        background-color: #a7a7a7;
        border-radius: 50%;
        margin: 0 2px;
        transition: background-color 0.2s;
      }
      
      &:hover .dot {
        background-color: white;
      }
    }
    
    .options-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background-color: #282828;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      z-index: 100;
      min-width: 160px;
      
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        
        li {
          padding: 10px 16px;
          cursor: pointer;
          transition: background-color 0.2s;
          
          &:hover {
            background-color: #333;
          }
          
          &:first-child {
            border-radius: 4px 4px 0 0;
          }
          
          &:last-child {
            border-radius: 0 0 4px 4px;
          }
        }
      }
    }
  }
}

// Estilo para las secciones principales
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  
  .section-title {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    flex: 1;
  }
  
  .section-visibility {
    font-size: 14px;
    color: #a7a7a7;
    margin: 0 16px;
  }
  
  .show-all-button {
    background: none;
    border: none;
    color: #a7a7a7;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s;
    
    &:hover {
      color: white;
    }
  }
}

// Rejilla de artistas
.artists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
  
  .artist-card {
    background-color: #181818;
    border-radius: 8px;
    padding: 16px;
    transition: background-color 0.3s;
    cursor: pointer;
    
    &:hover {
      background-color: #282828;
    }
    
    .artist-image {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 16px;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .artist-name {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 4px;
    }
    
    .artist-label {
      color: #a7a7a7;
      font-size: 14px;
    }
  }
}

// Lista de canciones
.tracks-list {
  margin-bottom: 48px;
  
  .track-item {
    display: grid;
    grid-template-columns: auto 56px 1fr auto auto auto auto;
    align-items: center;
    padding: 8px 16px;
    border-radius: 4px;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      
      .track-index span {
        display: none;
      }
      
      .track-index .play-button {
        display: flex;
      }
    }
    
    .track-index {
      width: 24px;
      text-align: center;
      color: #a7a7a7;
      margin-right: 16px;
      
      .play-button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        display: none;
        align-items: center;
        justify-content: center;
        
        &:hover {
          transform: scale(1.1);
        }
      }
    }
    
    .track-image {
      width: 40px;
      height: 40px;
      overflow: hidden;
      margin-right: 16px;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .track-info {
      overflow: hidden;
      margin-right: 16px;
      
      .track-title {
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        
        &.explicit {
          .explicit-badge {
            display: inline-block;
            background-color: rgba(255, 255, 255, 0.2);
            color: #a7a7a7;
            font-size: 10px;
            padding: 1px 4px;
            border-radius: 2px;
            margin-left: 4px;
            vertical-align: middle;
          }
        }
      }
      
      .track-artist {
        color: #a7a7a7;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    
    .track-album {
      color: #a7a7a7;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
      margin-right: 16px;
    }
    
    .track-liked {
      margin-right: 16px;
      
      button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    
    .track-duration {
      color: #a7a7a7;
      font-size: 14px;
      margin-right: 16px;
    }
    
    .track-options {
      position: relative;
      
      .options-button {
        background: none;
        border: none;
        cursor: pointer;
        color: #a7a7a7;
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:hover {
          color: white;
        }
      }
      
      .track-options-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        background-color: #282828;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        z-index: 100;
        min-width: 160px;
        
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          
          li {
            padding: 12px 16px;
            cursor: pointer;
            transition: background-color 0.2s;
            
            &:hover {
              background-color: #333;
            }
            
            &:first-child {
              border-radius: 4px 4px 0 0;
            }
            
            &:last-child {
              border-radius: 0 0 4px 4px;
            }
          }
        }
      }
    }
  }
}

// Rejilla de playlists
.playlists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
  
  .playlist-card {
    background-color: #181818;
    border-radius: 8px;
    padding: 16px;
    transition: background-color 0.3s;
    cursor: pointer;
    
    &:hover {
      background-color: #282828;
    }
    
    .playlist-image {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .playlist-title {
      font-weight: 600;
      font-size: 16px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>