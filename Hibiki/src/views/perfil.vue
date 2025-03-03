<template>
  <div class="profile-container">
    <div v-if="profileStore.loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando perfil...</p>
    </div>
    
    <div v-else-if="profileStore.error" class="error-message">
      <p>{{ profileStore.error }}</p>
      <button class="retry-button" @click="loadUserData">Reintentar</button>
    </div>
    
    <div v-else>
      <div class="profile-header">
        <div class="profile-avatar">
          <div v-if="profileStore.userData.avatar && profileStore.userData.avatar.trim() !== ''" class="avatar-image">
            <img :src="profileStore.userData.avatar" alt="Foto de perfil" />
          </div>
          <div v-else class="avatar-placeholder">
            <div class="avatar-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="profile-info">
          <span class="profile-label">Perfil</span>
          <h1 class="profile-name">{{ profileStore.userData.name || 'Usuario' }}</h1>
          <div class="profile-stats">
            <span>{{ profileStore.userData.publicLists }} listas públicas</span>
            <span v-if="profileStore.userData.following > 0"> • Sigue a <span class="follow-text">{{ profileStore.userData.following }}</span> {{ profileStore.userData.following === 1 ? 'usuario' : 'usuarios' }}</span>
          </div>
        </div>
        
        <div class="profile-options">
          <button class="options-button" @click.stop="toggleOptions">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
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
      
      <!-- Top Artists section -->
      <div v-if="profileStore.topArtists.length > 0">
        <div class="section-header">
          <h2 class="section-title">Artistas favoritos</h2>
          <button class="show-all-button" @click="showAllArtists">Ver todos</button>
        </div>
        
        <div class="artists-grid">
          <div
            v-for="artist in profileStore.topArtists"
            :key="artist.id"
            class="artist-card"
            @click="navigateToArtist(artist.id.toString())"
          >
            <div class="artist-image">
              <img :src="artist.image" :alt="artist.name" />
            </div>
            <div class="artist-name">{{ artist.name }}</div>
            <div class="artist-label">Artista</div>
          </div>
        </div>
      </div>
      
      <!-- Top Tracks section -->
      <div v-if="profileStore.topTracks.length > 0">
        <div class="section-header">
          <h2 class="section-title">Canciones favoritas</h2>
          <button class="show-all-button" @click="showAllTracks">Ver todas</button>
        </div>
        
        <div class="tracks-list">
          <div
            v-for="(track, index) in profileStore.topTracks"
            :key="track.id"
            class="track-item"
          >
            <div class="track-index">
              <span>{{ index + 1 }}</span>
              <button class="play-button" @click.stop="playTrack(track.id.toString())">
                <svg v-if="playingTrack === track.id.toString()" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3 2h3v12H3V2zm7 0h3v12h-3V2z"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4 2v12.4l8.8-6.2L4 2z"/>
                </svg>
              </button>
            </div>
            
            <div class="track-image">
              <img :src="track.image" :alt="track.title" />
            </div>
            
            <div class="track-info">
              <div :class="['track-title', track.explicit ? 'explicit' : '']">
                {{ track.title }}
                <span v-if="track.explicit" class="explicit-badge">E</span>
              </div>
              <div class="track-artist">{{ track.artist }}</div>
            </div>
            
            <div class="track-album">{{ track.album }}</div>
            
            <div class="track-liked">
              <button @click.stop="toggleLike(track)">
                <svg v-if="track.liked" width="16" height="16" viewBox="0 0 16 16" fill="#1DB954">
                  <path d="M13.797 2.727a4.057 4.057 0 00-5.488-.253.558.558 0 01-.31.112.531.531 0 01-.311-.112 4.054 4.054 0 00-5.487.253c-.77.77-1.194 1.794-1.194 2.883s.424 2.114 1.168 2.855l4.462 5.223a1.791 1.791 0 002.726 0l4.435-5.195a4.052 4.052 0 001.195-2.883 4.057 4.057 0 00-1.196-2.883z"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.798 2.727a4.057 4.057 0 00-5.488-.253.558.558 0 01-.31.112.531.531 0 01-.311-.112 4.054 4.054 0 00-5.487.253A4.05 4.05 0 001.01 5.61c0 1.089.424 2.113 1.168 2.855l4.462 5.223a1.791 1.791 0 002.726 0l4.435-5.195a4.052 4.052 0 001.196-2.883 4.057 4.057 0 00-1.199-2.883zm-.722 4.454L8.64 12.374a.594.594 0 01-.92 0L3.26 7.181a2.89 2.89 0 01-.834-2.04c0-.776.302-1.507.853-2.058a2.89 2.89 0 012.0-.853c.76 0 1.475.292 2.004.823l.806.824.805-.824a2.89 2.89 0 012.006-.823c.772 0 1.496.302 2.038.853.543.55.836 1.275.836 2.058 0 .783-.293 1.498-.798 2.039z"/>
                </svg>
              </button>
            </div>
            
            <div class="track-duration">{{ track.duration }}</div>
            
            <div class="track-options">
              <button class="options-button" @click.stop="toggleTrackOptions(track.id)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                </svg>
              </button>
              
              <div v-if="activeTrackOptions === track.id" class="track-options-dropdown">
                <ul>
                  <li @click="addToPlaylist(track.id)">Añadir a lista</li>
                  <li @click="goToArtist(track.id)">Ir al artista</li>
                  <li @click="goToAlbum(track.id)">Ir al álbum</li>
                  <li @click="shareTrack(track.id)">Compartir</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Public Playlists section -->
      <div v-if="profileStore.publicPlaylists.length > 0">
        <div class="section-header">
          <h2 class="section-title">Listas públicas</h2>
          <button class="show-all-button" @click="showAllPlaylists">Ver todas</button>
        </div>
        
        <div class="playlists-grid">
          <div
            v-for="playlist in profileStore.publicPlaylists"
            :key="playlist.id"
            class="playlist-card"
            @click="navigateToPlaylist(playlist.id)"
          >
            <div class="playlist-image">
              <img :src="playlist.image" :alt="playlist.title" />
            </div>
            <div class="playlist-title">{{ playlist.title }}</div>
          </div>
        </div>
      </div>
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

const loadUserData = async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }
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

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }
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