<template>
  <div class="profile-container">
    <!-- Header del perfil -->
    <div class="profile-header">
      <div class="profile-avatar">
        <div v-if="profileStore.userData?.avatar" class="avatar-image">
          <img :src="profileStore.userData.avatar" alt="Foto de perfil" />
        </div>
        <div v-else class="avatar-placeholder">
          <svg class="avatar-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
      </div>
      
      <div class="profile-info">
        <span class="profile-label">Perfil</span>
        <h1 class="profile-name">{{ profileStore.userName }}</h1>
        <p class="profile-stats">
          {{ profileStore.userData?.publicLists || 0 }} listas públicas • 1 seguidor • Sigue a {{ profileStore.userData?.following || 0 }} usuarios
        </p>
      </div>
      
      <div class="profile-options">
        <button class="options-button" @click="toggleOptions">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="2"></circle>
            <circle cx="4" cy="12" r="2"></circle>
            <circle cx="20" cy="12" r="2"></circle>
          </svg>
        </button>
        <div v-if="showOptions" class="options-dropdown">
          <ul>
            <li @click="editProfile">Editar perfil</li>
            <li @click="shareProfile">Compartir perfil</li>
            <li @click="copyLink">Copiar enlace del perfil</li>
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
      <section class="top-artists-section" v-if="profileStore.hasTopArtists">
        <div class="section-header">
          <h2 class="section-title">Artistas más escuchados este mes</h2>
          <span class="section-visibility">Solo visibles para ti</span>
          <button class="show-all-button" @click="showAllArtists">Mostrar todos</button>
        </div>
        
        <div class="artists-scroll-container">
          <div class="artists-grid">
            <div 
              v-for="artist in profileStore.topArtists.slice(0, 8)" 
              :key="artist.id" 
              class="artist-card" 
              @click="navigateToArtist(String(artist.id))"
            >
              <div class="artist-image">
                <img :src="artist.image" :alt="artist.name" />
                <div class="play-button-overlay">
                  <button class="play-button" @click.stop="playArtist(artist.id)">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="artist-name">{{ artist.name }}</div>
              <div class="artist-label">Artista</div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Sección de canciones más escuchadas -->
      <section class="top-tracks-section" v-if="profileStore.hasTopTracks">
        <div class="section-header">
          <h2 class="section-title">Canciones más escuchadas este mes</h2>
          <span class="section-visibility">Solo visibles para ti</span>
          <button class="show-all-button" @click="showAllTracks">Mostrar todos</button>
        </div>
        
        <div class="tracks-list">
          <div 
            v-for="(track, index) in profileStore.topTracks.slice(0, 5)" 
            :key="track.id" 
            class="track-item" 
            @click="playTrack(String(track.id))"
          >
            <div class="track-index">
              <span class="index-number">{{ index + 1 }}</span>
              <button class="play-button" @click.stop="playTrack(String(track.id))">
                <svg v-if="playingTrack !== String(track.id)" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"></path>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
                </svg>
              </button>
            </div>

            <div class="track-image">
              <img :src="track.image" :alt="track.title" />
            </div>

            <div class="track-info">
              <div class="track-title">
                {{ track.title }}
                <span v-if="track.explicit" class="explicit-badge">E</span>
              </div>
              <div class="track-artist">{{ track.artist }}</div>
            </div>

            <div class="track-album">{{ track.album }}</div>

            <div class="track-liked">
              <button @click.stop="toggleLike(track)" :class="{ 'liked': track.liked }">
                <svg 
                  viewBox="0 0 24 24" 
                  :fill="track.liked ? '#1db954' : 'none'" 
                  :stroke="track.liked ? 'none' : 'currentColor'" 
                  stroke-width="2"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                </svg>
              </button>
            </div>

            <div class="track-duration">{{ track.duration }}</div>

            <div class="track-options">
              <button class="options-button" @click.stop="toggleTrackOptions(track.id)">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="2"></circle>
                  <circle cx="4" cy="12" r="2"></circle>
                  <circle cx="20" cy="12" r="2"></circle>
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
      <section class="public-playlists-section" v-if="profileStore.hasPublicPlaylists">
        <div class="section-header">
          <h2 class="section-title">Listas públicas</h2>
          <button v-if="profileStore.publicPlaylists.length > 6" class="show-all-button" @click="showAllPlaylists">
            Mostrar todas
          </button>
        </div>
        
        <div class="playlists-grid">
          <div 
            v-for="playlist in profileStore.publicPlaylists.slice(0, 6)" 
            :key="playlist.id" 
            class="playlist-card" 
            @click="navigateToPlaylist(playlist.id)"
          >
            <div class="playlist-image">
              <img :src="playlist.image" :alt="playlist.title" />
              <div class="play-button-overlay">
                <button class="play-button" @click.stop="playPlaylist(playlist.id)">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div class="playlist-title">{{ playlist.title }}</div>
            <div class="playlist-owner">De {{ profileStore.userName }}</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useProfileStore } from '../stores/perfil'

// Inicializar el store
const profileStore = useProfileStore()

// Variables reactivas para el componente
const showOptions = ref(false)
const playingTrack = ref<string | null>(null)
const activeTrackOptions = ref<number | null>(null)

// Computed para acceso seguro a userData
const userData = computed(() => profileStore.userData)

// Funciones del componente
const toggleOptions = () => {
  showOptions.value = !showOptions.value
}

const toggleTrackOptions = (trackId: number) => {
  activeTrackOptions.value = activeTrackOptions.value === trackId ? null : trackId
}

const toggleLike = async (track: any) => {
  try {
    // Aquí harías la llamada a la API para actualizar el like
    profileStore.updateTrackLike(track.id, !track.liked)
  } catch (error) {
    console.error('Error al actualizar like:', error)
  }
}

const loadUserData = async () => {
  // Esta función debería obtener el token del usuario logueado
  const token = localStorage.getItem('authToken') || ''
  if (token) {
    await profileStore.fetchUserData(token)
  }
}

// Funciones de navegación y acciones
const navigateToArtist = (artistId: string) => {
  console.log('Navigate to artist:', artistId)
  // Implementar navegación
}

const navigateToPlaylist = (playlistId: number) => {
  console.log('Navigate to playlist:', playlistId)
  // Implementar navegación
}

const playArtist = (artistId: number) => {
  console.log('Play artist:', artistId)
  // Implementar reproducción
}

const playTrack = (trackId: string) => {
  playingTrack.value = playingTrack.value === trackId ? null : trackId
  console.log('Play track:', trackId)
  // Implementar reproducción
}

const playPlaylist = (playlistId: number) => {
  console.log('Play playlist:', playlistId)
  // Implementar reproducción
}

const showAllArtists = () => {
  console.log('Show all artists')
  // Implementar navegación a vista completa
}

const showAllTracks = () => {
  console.log('Show all tracks')
  // Implementar navegación a vista completa
}

const showAllPlaylists = () => {
  console.log('Show all playlists')
  // Implementar navegación a vista completa
}

const editProfile = () => {
  console.log('Edit profile')
  showOptions.value = false
}

const shareProfile = () => {
  console.log('Share profile')
  showOptions.value = false
}

const copyLink = () => {
  console.log('Copy profile link')
  showOptions.value = false
}

const addToPlaylist = (trackId: number) => {
  console.log('Add to playlist:', trackId)
  activeTrackOptions.value = null
}

const goToArtist = (trackId: number) => {
  console.log('Go to artist from track:', trackId)
  activeTrackOptions.value = null
}

const goToAlbum = (trackId: number) => {
  console.log('Go to album from track:', trackId)
  activeTrackOptions.value = null
}

const shareTrack = (trackId: number) => {
  console.log('Share track:', trackId)
  activeTrackOptions.value = null
}

// Cargar datos al montar el componente
onMounted(() => {
  loadUserData()
})
</script>

<style lang="scss" scoped>
.profile-container {
  min-height: 100vh;
  background: #121212;
  color: white;
  padding: 0;
  width: 100%;
}

// Loading y error styles
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
    border-top-color: #1db954;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 16px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  p {
    color: #b3b3b3;
    font-size: 14px;
  }
}

.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  margin: 20px;
  
  p {
    color: #f44336;
    font-size: 16px;
    margin-bottom: 16px;
  }
  
  .retry-button {
    background-color: #1db954;
    color: white;
    border: none;
    padding: 8px 24px;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #1ed760;
    }
  }
}

// Header del perfil
.profile-header {
  display: flex;
  align-items: flex-end;
  padding: 60px 32px 24px;
  background: linear-gradient(transparent 0, rgba(0,0,0,.5) 100%), #535353;
  min-height: 340px;
  position: relative;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 40px 24px 24px;
    min-height: auto;
    
    .profile-avatar {
      margin-bottom: 16px;
    }
  }
  
  .profile-avatar {
    width: 232px;
    height: 232px;
    min-width: 232px;
    border-radius: 50%;
    background-color: #333;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 60px rgba(0,0,0,.5);
    margin-right: 24px;
    
    @media (max-width: 768px) {
      width: 144px;
      height: 144px;
      min-width: 144px;
      margin-right: 0;
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
      background-color: #282828;
      
      .avatar-icon {
        width: 64px;
        height: 64px;
        color: #7f7f7f;
      }
    }
  }
  
  .profile-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    
    .profile-label {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 8px;
    }
    
    .profile-name {
      font-size: 96px;
      font-weight: 900;
      line-height: 1;
      margin: 0 0 16px;
      letter-spacing: -0.04em;
      
      @media (max-width: 1200px) {
        font-size: 72px;
      }
      
      @media (max-width: 768px) {
        font-size: 48px;
      }
      
      @media (max-width: 480px) {
        font-size: 32px;
      }
    }
    
    .profile-stats {
      color: #b3b3b3;
      font-size: 14px;
      margin: 0;
    }
  }
  
  .profile-options {
    position: absolute;
    top: 24px;
    right: 32px;
    
    @media (max-width: 768px) {
      right: 24px;
    }
    
    .options-button {
      background: rgba(0,0,0,.3);
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #b3b3b3;
      transition: all 0.2s;
      
      &:hover {
        background: rgba(0,0,0,.5);
        color: white;
      }
    }
    
    .options-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background-color: #282828;
      border-radius: 4px;
      box-shadow: 0 16px 24px rgba(0,0,0,.3);
      z-index: 100;
      min-width: 196px;
      margin-top: 4px;
      
      ul {
        list-style: none;
        padding: 4px;
        margin: 0;
        
        li {
          padding: 12px 16px;
          cursor: pointer;
          border-radius: 2px;
          font-size: 14px;
          
          &:hover {
            background-color: rgba(255,255,255,.1);
          }
        }
      }
    }
  }
}

// Secciones
section {
  padding: 24px 32px;
  
  @media (max-width: 768px) {
    padding: 16px 24px;
  }
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  
  .section-title {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    flex: 1;
  }
  
  .section-visibility {
    font-size: 14px;
    color: #b3b3b3;
    margin: 0 16px;
  }
  
  .show-all-button {
    background: none;
    border: none;
    color: #b3b3b3;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    
    &:hover {
      color: white;
    }
  }
}

// Artistas
.artists-scroll-container {
  overflow-x: auto;
  margin: 0 -32px;
  padding: 0 32px;
  
  @media (max-width: 768px) {
    margin: 0 -24px;
    padding: 0 24px;
  }
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.artists-grid {
  display: flex;
  gap: 24px;
  padding-bottom: 8px;
  
  .artist-card {
    background-color: #181818;
    border-radius: 8px;
    padding: 16px;
    transition: background-color 0.3s;
    cursor: pointer;
    min-width: 180px;
    flex-shrink: 0;
    
    &:hover {
      background-color: #282828;
      
      .play-button-overlay {
        opacity: 1;
      }
    }
    
    .artist-image {
      position: relative;
      width: 148px;
      height: 148px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 16px;
      box-shadow: 0 8px 24px rgba(0,0,0,.5);
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .play-button-overlay {
        position: absolute;
        bottom: 8px;
        right: 8px;
        opacity: 0;
        transition: opacity 0.3s;
        
        .play-button {
          width: 48px;
          height: 48px;
          background-color: #1db954;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: black;
          transition: all 0.1s;
          box-shadow: 0 8px 8px rgba(0,0,0,.3);
          
          &:hover {
            transform: scale(1.06);
            background-color: #1ed760;
          }
          
          svg {
            width: 24px;
            height: 24px;
            margin-left: 2px;
          }
        }
      }
    }
    
    .artist-name {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .artist-label {
      color: #b3b3b3;
      font-size: 14px;
    }
  }
}

// Canciones
.tracks-list {
  .track-item {
    display: grid;
    grid-template-columns: 16px 56px 1fr minmax(120px, 1fr) 40px 40px 40px;
    gap: 16px;
    align-items: center;
    padding: 8px 0;
    border-radius: 4px;
    cursor: pointer;
    
    @media (max-width: 1024px) {
      grid-template-columns: 16px 56px 1fr 40px 40px 40px;
      
      .track-album {
        display: none;
      }
    }
    
    @media (max-width: 768px) {
      grid-template-columns: 16px 56px 1fr 40px 40px;
      
      .track-duration {
        display: none;
      }
    }
    
    &:hover {
      background-color: rgba(255,255,255,.1);
      
      .track-index {
        .index-number {
          display: none;
        }
        
        .play-button {
          display: flex;
        }
      }
      
      .track-options .options-button {
        color: white;
      }
    }
    
    .track-index {
      text-align: center;
      position: relative;
      
      .index-number {
        color: #b3b3b3;
        font-size: 16px;
      }
      
      .play-button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        display: none;
        
        svg {
          width: 16px;
          height: 16px;
        }
      }
    }
    
    .track-image {
      width: 40px;
      height: 40px;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .track-info {
      overflow: hidden;
      
      .track-title {
        font-size: 16px;
        font-weight: 400;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: flex;
        align-items: center;
        gap: 8px;
        
        .explicit-badge {
          background-color: rgba(255,255,255,.1);
          color: #b3b3b3;
          font-size: 9px;
          padding: 2px 4px;
          border-radius: 2px;
          flex-shrink: 0;
          font-weight: 600;
        }
      }
      
      .track-artist {
        color: #b3b3b3;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    
    .track-album {
      color: #b3b3b3;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .track-liked {
      button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        color: #b3b3b3;
        
        &.liked {
          color: #1db954;
        }
        
        &:hover {
          color: white;
          
          &.liked {
            color: #1ed760;
          }
        }
        
        svg {
          width: 16px;
          height: 16px;
        }
      }
    }
    
    .track-duration {
      color: #b3b3b3;
      font-size: 14px;
      text-align: right;
    }
    
    .track-options {
      position: relative;
      
      .options-button {
        background: none;
        border: none;
        cursor: pointer;
        color: transparent;
        padding: 0;
        
        svg {
          width: 16px;
          height: 16px;
        }
      }
      
      .track-options-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        background-color: #282828;
        border-radius: 4px;
        box-shadow: 0 16px 24px rgba(0,0,0,.3);
        z-index: 100;
        min-width: 196px;
        margin-top: 4px;
        
        ul {
          list-style: none;
          padding: 4px;
          margin: 0;
          
          li {
            padding: 12px 16px;
            cursor: pointer;
            border-radius: 2px;
            font-size: 14px;
            
            &:hover {
              background-color: rgba(255,255,255,.1);
            }
          }
        }
      }
    }
  }
}

// Playlists
.playlists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
  
  .playlist-card {
    background-color: #181818;
    border-radius: 8px;
    padding: 16px;
    transition: background-color 0.3s;
    cursor: pointer;
    
    &:hover {
      background-color: #282828;
      
      .play-button-overlay {
        opacity: 1;
      }
    }
    
    .playlist-image {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 16px;
      box-shadow: 0 8px 24px rgba(0,0,0,.5);
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .play-button-overlay {
        position: absolute;
        bottom: 8px;
        right: 8px;
        opacity: 0;
        transition: opacity 0.3s;
        
        .play-button {
          width: 48px;
          height: 48px;
          background-color: #1db954;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: black;
          transition: all 0.1s;
          box-shadow: 0 8px 8px rgba(0,0,0,.3);
          
          &:hover {
            transform: scale(1.06);
            background-color: #1ed760;
          }
          
          svg {
            width: 24px;
            height: 24px;
            margin-left: 2px;
          }
        }
      }
    }
    
    .playlist-title {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .playlist-owner {
      color: #b3b3b3;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>