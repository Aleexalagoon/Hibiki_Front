<template>
  <div class="artist-page">
    <div class="main-container">
      <div class="artists-list">
        <h2>Artistas</h2>
        <div
          v-for="artist in allArtists"
          :key="artist.cantanteId"
          class="artist-card"
          @click="selectArtist(artist.cantanteId)"
        >
          <img :src="artist.image" alt="Artist Image" class="artist-image" />
          <h3>{{ artist.nombre }}</h3>
        </div>
      </div>

      <div class="details-container">
        <div v-if="selectedArtist">
          <h1 class="artist-name">{{ selectedArtist.name }}</h1>
          <p>{{ selectedArtist.monthlyListeners }} oyentes mensuales</p>

          <h2>Álbumes</h2>
          <div v-if="albums.length > 0" class="albums">
            <div
              v-for="album in albums"
              :key="album.albumId"
              class="album-card"
              @click="selectAlbum(album.albumId)"
            >
              <img :src="album.image" alt="Album Cover" class="album-cover" />
              <p>{{ album.name }}</p>
            </div>
          </div>
          <div v-else>
            <p>No hay álbumes disponibles para este artista.</p>
          </div>
        </div>

        <div v-if="selectedAlbum">
          <h2>Canciones de {{ selectedAlbum.name }}</h2>
          <p v-if="loading">Cargando canciones...</p>
          <p v-if="error">{{ error }}</p>
          <ul v-if="songs.length > 0">
            <li
              v-for="song in songs"
              :key="song.cancionId"
              class="song-card"
              @click="selectSong(song)"
            >
              <div class="song-info-container">
                <img :src="song.image" alt="Song Image" class="song-image" />
                <div class="song-info">
                  <span class="song-title">{{ song.nombre }}</span>
                  <span class="song-artist">{{ selectedArtist.name }}</span>
                </div>
              </div>
              <span class="song-duration">{{ formatDuration(song.duracion) }}</span>
            </li>
          </ul>

          <!-- Mensaje si no hay canciones -->
          <p v-else>No hay canciones disponibles en este álbum.</p>
        </div>

       
        
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, onMounted } from 'vue';
import { useArtistaStore } from '@/stores/artistaStore';
import { useAlbumStore } from '@/stores/albumStore';
import MusicPlayer from '@/components/MusicPlayer.vue';

export default defineComponent({
  components: {
    MusicPlayer,
  },
  setup() {
    const artistaStore = useArtistaStore();
    const albumStore = useAlbumStore();

    // Función para formatear la duración
    const formatDuration = (duration) => {
      const [hours, minutes, seconds] = duration.split(':').map(Number);

      if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
      } else {
        return `${minutes}m ${seconds}s`;
      }
    };

    // Limpiar las canciones al cambiar de artista
    const selectArtist = (artistId) => {
      artistaStore.fetchArtistData(artistId);
      albumStore.clearSongs(); // Limpiar canciones anteriores
    };

    // Seleccionar una canción
    const selectSong = (song) => {
      albumStore.setSelectedSong(song);
    };

    // Seleccionar un álbum
    const selectAlbum = (albumId) => {
      albumStore.fetchAlbumSongs(albumId); // Cargar canciones del álbum
    };

    onMounted(() => {
      artistaStore.fetchAllArtists(); // Cargar todos los artistas cuando se monta
    });

    return {
      allArtists: computed(() => artistaStore.allArtists),
      selectedArtist: computed(() => artistaStore.selectedArtist),
      albums: computed(() => albumStore.albums),
      selectedAlbum: computed(() => albumStore.selectedAlbum),
      songs: computed(() => albumStore.songs),
      selectedSong: computed(() => albumStore.selectedSong),
      error: computed(() => albumStore.error),
      loading: computed(() => albumStore.loading),
      selectArtist,
      selectAlbum,
      selectSong,
      formatDuration,
    };
  },
});
</script>


<style scoped>
.artist-page {
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

.artists-list {
  width: 30%;
  padding: 20px;
  background: #181818;
  overflow-y: auto;
  max-height: 110vh;
}

.artist-card {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 10px;
  padding: 10px;
  background: #222;
  border-radius: 10px;
}

.artist-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.details-container {
  width: 70%;
  padding: 20px;
}

.artists-list::-webkit-scrollbar {
  width: 8px;
}

.artists-list::-webkit-scrollbar-track {
  background: #222;
}

.artists-list::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 10px;
}

.artist-card {
  padding: 20px;
}

.artist-name {
  font-size: 24px;
  font-weight: bold;
}

.artist-description {
  margin-top: 20px;
  font-size: 14px;
  color: gray;
}

.albums {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.album-card {
  cursor: pointer;
  text-align: center;
}

.album-cover {
  width: 200px;
  height: 200px;
  border-radius: 10px;
}

.song-card {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #333;
  justify-content: space-between;
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
  margin-left: -50px;
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
</style>