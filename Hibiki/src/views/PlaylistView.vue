<template>
  <div class="playlist-page">
    <div class="main-container">
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
          <img :src="playlist.image || defaultImage" alt="Playlist Cover" class="playlist-image" />
          <h3>{{ playlist.nombre }}</h3>
        </div>
      </div>

      <div class="details-container">
        <div v-if="selectedPlaylist">
          <h1 class="playlist-name">{{ selectedPlaylist.nombre }}</h1>
          <p><strong>Descripción:</strong> {{ selectedPlaylist.descripcion }}</p>

          <p v-if="selectedPlaylist.creador">
            <strong>Creador:</strong> {{ selectedPlaylist.creador.nombre }}
          </p>

          <h2>Canciones</h2>
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

    const defaultImage = 'https://placehold.co/150';

    const formatDuration = (duration) => {
      if (!duration) return '0:00';
      const [minutes, seconds] = duration.split(':').map(Number);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const selectPlaylist = (playlistId) => {
      playlistStore.fetchPlaylistById(playlistId);
    };

    const selectSong = (song) => {
      playerStore.setSong(song);
    };

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

<style scoped>
.playlist-page {
  display: flex;
  min-height: 100vh;
  background: #121212;
  color: white;
}

.main-container {
  display: flex;
  flex: 1;
  width: 100%;
}

.playlists-list {
  width: 30%;
  padding: 20px;
  background: #181818;
  overflow-y: auto;
  max-height: 110vh;
}

.playlists-list h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  position: relative;
}

.playlists-list::-webkit-scrollbar {
  width: 8px;
}

.playlists-list::-webkit-scrollbar-track {
  background: #222;
}

.playlists-list::-webkit-scrollbar-thumb {
  background: #ff5100;
  border-radius: 10px;
}

.error {
  color: #e91e63;
  padding: 10px;
  border-radius: 10px;
  background: rgba(233, 30, 99, 0.1);
}

.playlist-card {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 10px;
  padding: 10px;
  background: #222;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.playlist-card:hover {
  background: #333;
  transform: translateY(-2px);
}

.playlist-image {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  margin-right: 10px;
  object-fit: cover;
}

.playlist-card h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.details-container {
  width: 70%;
  padding: 20px;
}

h1.playlist-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.details-container p {
  margin-bottom: 15px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.7);
}

.details-container p strong {
  color: white;
}

.details-container h2 {
  font-size: 1.5rem;
  margin: 30px 0 20px;
  position: relative;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.song-card {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #333;
  justify-content: space-between;
  transition: all 0.3s ease;
  border-radius: 5px;
  margin-bottom: 5px;
}

.song-card:hover {
  background: rgba(255, 255, 255, 0.1);
}

.song-info-container {
  display: flex;
  align-items: center;
}

.song-image {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  margin-right: 10px;
}

.song-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.song-title {
  font-weight: bold;
}

.song-artist {
  font-size: 13px;
  opacity: 0.5;
  margin-top: 8px;
}

.song-duration {
  opacity: 0.8;
}

@media (max-width: 900px) {
  .main-container {
    flex-direction: column;
  }
  
  .playlists-list, .details-container {
    width: 100%;
    max-height: none;
  }
}
</style>