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
    
    <!-- Add the music player component with songs passed as prop -->
    
  </div>
</template>

<script>
import { defineComponent, computed, onMounted } from 'vue';
import { useArtistaStore } from '@/stores/artistaStore';
import { useAlbumStore } from '@/stores/albumStore';
import { usePlayerStore } from '@/stores/player';
import MusicPlayer from '@/components/MusicPlayer.vue'; // Import the component

export default defineComponent({
  components: {
    MusicPlayer // Register the component
  },
  setup() {
    const artistaStore = useArtistaStore();
    const albumStore = useAlbumStore();
    const playerStore = usePlayerStore();

    // Función para formatear la duración
    const formatDuration = (duration) => {
      if (!duration) return '0m 0s';
      
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

    const selectSong = (song) => {
      // Ensure the song has the artist name
      if (song && artistaStore.selectedArtist) {
        // If the song doesn't have an artista property, add it
        if (!song.artista) {
          song.artista = artistaStore.selectedArtist.name;
        }
      }
      
      playerStore.setSong(song);
      albumStore.setSelectedSong(song);
    };

    const selectAlbum = (albumId) => {
      albumStore.fetchAlbumSongs(albumId); 
    };

    onMounted(() => {
      artistaStore.fetchAllArtists(); 
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
  overflow-x: hidden;
  max-width: 100vw;
  box-sizing: border-box;
}

.main-container {
  display: flex;
  flex: 1;
  width: 100%;
  max-width: 100%; 
  box-sizing: border-box; 
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
  background: #ff5100;
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


.artists-list::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}

.artists-list::-webkit-scrollbar-thumb {
  background: #ff5100;
  border-radius: 10px;
}

.artists-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}


@media screen and (max-width: 992px) {
  .main-container {
    flex-direction: column;
  }
  
  .artists-list {
    width: 100%;
    max-height: 250px;
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    flex-direction: row;
    padding: 15px;
    gap: 12px;
  }
  
  .artist-card {
    flex-direction: column;
    min-width: 120px;
    margin-right: 0;
    text-align: center;
    transition: transform 0.2s;
  }
  
  .artist-card:hover {
    transform: scale(1.05);
  }
  
  .artist-image {
    margin-right: 0;
    margin-bottom: 8px;
    width: 70px;
    height: 70px;
  }
  
  .artist-card h3 {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
  }
  
  .details-container {
    width: 100%;
    padding: 20px 15px 20px 15px; 
    box-sizing: border-box;
  }
  

  .albums {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: 20px;
    margin-top: 15px;
  }
  
  .album-card {
    transition: transform 0.2s;
    margin-bottom: 10px;
  }
  
  .album-card:hover {
    transform: scale(1.05);
  }
  
  .album-cover {
    width: 100%;
    aspect-ratio: 1/1;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  .album-card p {
    margin-top: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}


@media screen and (max-width: 576px) {
 
  
  .artists-list {
    max-height: 200px;
    padding: 10px;
  }
  
  .artist-card {
    min-width: 100px;
    padding: 10px;
  }
  
  .artist-image {
    width: 60px;
    height: 60px;
  }
  
  .details-container {
    padding: 20px 15px; 
    overflow-x: hidden; 
  }
  
 
  ul {
    padding: 0 5px 0 0; 
    list-style-type: none;
 
  }
  
  .song-card {
    margin-bottom: 8px;
    padding: 12px 10px;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.05);
    transition: background-color 0.2s;
    width: calc(100% - 10px); 
    box-sizing: border-box;
  }
  
  .song-card:hover {
    background-color: rgba(255, 81, 0, 0.2);
  }
  
  .song-info-container {
    max-width: 75%;
  }
  
  .song-image {
    width: 45px;
    height: 45px;
    margin-left: 0;
    margin-right: 12px;
  }
  
  .song-info {
    max-width: calc(100% - 55px);
  }
  
  .song-title {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .song-artist {
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .song-duration {
    font-size: 12px;
  }
  
 
  .albums {
    gap: 15px;
    width: 100%;
    box-sizing: border-box;
  }
  
  
  .details-container h1 {
    font-size: 24px;
    margin-bottom: 5px;
  }
  
  .details-container h2 {
    font-size: 20px;
    margin: 25px 0 15px 0;
    position: relative;
  }
  
  .details-container h2::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 50px;
    height: 3px;
    background-color: #ff5100;
    border-radius: 3px;
  }
}


@media screen and (max-width: 400px) {
  .details-container {
    padding: 20px 15px 20px 20px; 
  }
  
  .albums {
    grid-template-columns: repeat(2, 1fr);
    
  }
  
  .song-image {
    width: 40px;
    height: 40px;
  }
  
  .artist-card {
    min-width: 85px;
  }
}
</style>