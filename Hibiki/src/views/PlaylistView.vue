<template>
  <div class="playlist-page">
    <div class="main-container">
      <!-- Lista de Playlists -->
      <div class="playlists-list">
        <h2>Playlists</h2>
        <p v-if="loading">Cargando playlists...</p>
        <p v-if="error" class="error">{{ error }}</p>
        
        <div 
          v-for="playlist in allPlaylists" 
          :key="playlist.playlistId" 
          class="playlist-card"
          @click="selectPlaylist(playlist.playlistId)"
        >
          <!-- Reemplazamos la URL de via.placeholder.com -->
          <img :src="playlist.image || defaultImage" alt="Playlist Cover" class="playlist-image" />
          <h3>{{ playlist.nombre }}</h3>
        </div>
      </div>

      <!-- Detalles de la Playlist Seleccionada -->
      <div class="details-container">
        <!-- Verificamos que selectedPlaylist exista -->
        <div v-if="selectedPlaylist">
          <h1 class="playlist-name">{{ selectedPlaylist.nombre }}</h1>
          <p><strong>Descripción:</strong> {{ selectedPlaylist.descripcion }}</p>

          <!-- Verificamos que creador exista -->
          <p v-if="selectedPlaylist.creador">
            <strong>Creador:</strong> {{ selectedPlaylist.creador.nombre }}
          </p>

          <h2>Canciones</h2>
          <!-- Verificamos que canciones exista y sea un array con length > 0 -->
          <ul v-if="selectedPlaylist.canciones && selectedPlaylist.canciones.length > 0">
            <li
              v-for="song in selectedPlaylist.canciones"
              :key="song.cancionId"
              class="song-card"
              @click="selectSong(song)"
            >
              <div class="song-info-container">
                <img :src="song.image" alt="Song Thumbnail" class="song-image" />
                <div class="song-info">
                  <span class="song-title">{{ song.nombre }}</span>
                  <span class="song-artist">{{ song.artista }}</span>
                </div>
              </div>
              <span class="song-duration">{{ formatDuration(song.duracion) }}</span>
            </li>
          </ul>
          <p v-else>No hay canciones en esta playlist.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, onMounted } from 'vue';
import { usePlaylistStore } from '@/stores/PlaylistStore';
import { usePlayerStore } from '@/stores/player';

export default defineComponent({
  setup() {
    const playlistStore = usePlaylistStore();
    const playerStore = usePlayerStore();

    // Cambiamos la URL de la imagen por https://placehold.co/150
    const defaultImage = 'https://placehold.co/150';

    // Formatear duración de la canción (minutos y segundos)
    const formatDuration = (duration) => {
      if (!duration) return '0:00';
      const [minutes, seconds] = duration.split(':').map(Number);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Seleccionar una Playlist
    const selectPlaylist = (playlistId) => {
      playlistStore.fetchPlaylistById(playlistId);
    };

    // Reproducir una canción
    const selectSong = (song) => {
      playerStore.setSong(song);
    };

    // Cargar todas las playlists al montar el componente
    onMounted(() => {
      playlistStore.fetchAllPlaylists();
    });

    return {
      allPlaylists: computed(() => playlistStore.playlists),
      selectedPlaylist: computed(() => playlistStore.currentPlaylist),
      loading: computed(() => playlistStore.loading),
      error: computed(() => playlistStore.error),
      selectPlaylist,
      selectSong,
      formatDuration,
      defaultImage,
    };
  },
});
</script>

<style lang="scss" scoped>
// Variables
$background-primary: #121212;
$background-secondary: #181818;
$background-card: #222222;
$background-hover: #333333;
$text-primary: #ffffff;
$text-secondary: rgba(255, 255, 255, 0.7);
$border-color: #333333;
$accent-color: #1db954;
$transition-default: all 0.3s ease;
$border-radius: 10px;

// Mixins
@mixin flex($direction: row, $justify: flex-start, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}

@mixin hover-effect {
  transition: $transition-default;
  &:hover {
    background: $background-hover;
    transform: translateY(-2px);
  }
}

.playlist-page {
  @include flex(column);
  min-height: 100vh;
  background: $background-primary;
  color: $text-primary;
  font-family: 'Montserrat', 'Helvetica Neue', sans-serif;
}

.main-container {
  @include flex();
  flex: 1;
  width: 100%;
}

// Sección de lista de playlists
.playlists-list {
  width: 30%;
  padding: 20px;
  background: $background-secondary;
  overflow-y: auto;
  max-height: 100vh;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

  h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 40px;
      height: 3px;
      background: $accent-color;
      border-radius: 3px;
    }
  }

  .error {
    color: #e91e63;
    padding: 10px;
    border-radius: $border-radius;
    background: rgba(233, 30, 99, 0.1);
  }
}

.playlist-card {
  @include flex();
  cursor: pointer;
  margin-bottom: 15px;
  padding: 12px;
  background: $background-card;
  border-radius: $border-radius;
  @include hover-effect;
  border-left: 3px solid transparent;

  &:hover {
    border-left: 3px solid $accent-color;
  }

  .playlist-image {
    width: 60px;
    height: 60px;
    border-radius: $border-radius;
    margin-right: 15px;
    object-fit: cover;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  h3 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
  }
}

// Sección de detalles de la playlist
.details-container {
  width: 70%;
  padding: 30px;
  overflow-y: auto;
  max-height: 100vh;

  h1.playlist-name {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 20px;
    color: $text-primary;
  }

  p {
    margin-bottom: 15px;
    line-height: 1.5;
    color: $text-secondary;

    strong {
      color: $text-primary;
    }
  }

  h2 {
    font-size: 1.5rem;
    margin: 30px 0 20px;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 40px;
      height: 3px;
      background: $accent-color;
      border-radius: 3px;
    }
  }
}

// Estilos para las canciones
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.song-card {
  @include flex(row, space-between, center);
  padding: 12px 15px;
  border-bottom: 1px solid $border-color;
  transition: $transition-default;
  border-radius: 5px;
  margin-bottom: 5px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    padding-left: 20px;
  }

  &:active {
    background: rgba(29, 185, 84, 0.15);
  }
}

.song-info-container {
  @include flex();
  flex: 1;
}

.song-image {
  width: 50px;
  height: 50px;
  border-radius: 5px;
  margin-right: 15px;
  object-fit: cover;
}

.song-info {
  @include flex(column, center, flex-start);
}

.song-title {
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 5px;
}

.song-artist {
  font-size: 0.8rem;
  color: $text-secondary;
}

.song-duration {
  color: $text-secondary;
  font-size: 0.8rem;
  font-weight: 500;
}

// Responsive
@media (max-width: 900px) {
  .main-container {
    flex-direction: column;
  }
  
  .playlists-list, .details-container {
    width: 100%;
    max-height: none;
  }
}

// Animaciones
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.playlist-card, .song-card {
  animation: fadeIn 0.3s ease-out;
}
</style>