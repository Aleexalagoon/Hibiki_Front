<template>
  <div class="artist-page">
    <div class="main-container">
      <div class="artists-list">
      <ThemeToggle />
        <h2>Artists</h2>
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
          <div class="artist-header">
            <div class="artist-image-container">
              <img :src="selectedArtist.image" alt="Artist Image" class="artist-header-image" />
              <div class="gradient-overlay"></div>
            </div>
            <div class="artist-info">
              <h1 class="artist-name">{{ selectedArtist.name }}</h1>
              <p>{{ selectedArtist.monthlyListeners }} monthly listeners</p>
            </div>
          </div>

          <h2>Popular</h2>
          <p v-if="temaLoading">Loading songs...</p>
          <p v-if="temaError">{{ temaError }}</p>
          
          <div v-if="temas.length > 0" class="songs-list">
            <div
              v-for="tema in temas"
              :key="tema.temaId"
              class="song-card"
              @click="selectTema(tema)"
            >
              <div class="song-info-container">
                <img :src="tema.image || '/default-song.jpg'" alt="Song Image" class="song-image" />
                <div class="song-info">
                  <span class="song-title">{{ tema.nombre }}</span>
                  <span class="song-artist">{{ selectedArtist.name }}</span>
                </div>
              </div>
              <span class="song-duration">{{ formatDuration(tema.duracion) }}</span>
            </div>
          </div>
          <div v-else-if="!temaLoading">
            <p>No songs available for this artist.</p>
          </div>

          <h2>Discography</h2>
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
            <p>No albums available for this artist.</p>
          </div>
        </div>

        <div v-if="selectedAlbum">
          <h2>Songs from {{ selectedAlbum.name }}</h2>
          <p v-if="albumLoading">Loading songs...</p>
          <p v-if="albumError">{{ albumError }}</p>
          <ul v-if="songs.length > 0" class="songs-list">
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
          <p v-else-if="!albumLoading">No songs available in this album.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, onMounted } from 'vue';
import { useArtistaStore } from '@/stores/artistaStore';
import { useAlbumStore } from '@/stores/albumStore';
import { usePlayerStore } from '@/stores/player';
import { useTemaStore } from '@/stores/temaStore';
import MusicPlayer from '@/components/MusicPlayer.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';

export default defineComponent({
  components: {
    MusicPlayer,
    ThemeToggle
  },
  setup() {
    const artistaStore = useArtistaStore();
    const albumStore = useAlbumStore();
    const playerStore = usePlayerStore();
    const temaStore = useTemaStore();
    
    const formatDuration = (duration) => {
      if (!duration) return '0m 0s';
      const [hours, minutes, seconds] = duration.split(':').map(Number);
      if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
      } else {
        return `${minutes}m ${seconds}s`;
      }
    };
    
    const selectArtist = async (artistId) => {
      albumStore.clearSongs();
      temaStore.clearTemas();
      await artistaStore.fetchArtistData(artistId);
      await albumStore.fetchAlbumsByArtist(artistId);
      await temaStore.fetchTemasByCantante(artistId);
    };
    
    const selectTema = (tema) => {
      if (tema && artistaStore.selectedArtist) {
        const temaWithArtist = {
          ...tema,
          artista: artistaStore.selectedArtist.name
        };
        playerStore.setSong(temaWithArtist);
        temaStore.setSelectedTema(tema);
      }
    };
    
    const selectSong = (song) => {
      if (song && artistaStore.selectedArtist) {
        const songWithArtist = {
          ...song,
          artista: artistaStore.selectedArtist.name
        };
        playerStore.setSong(songWithArtist);
        albumStore.setSelectedSong(song);
      }
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
      artistaLoading: computed(() => artistaStore.loading),
      artistaError: computed(() => artistaStore.error),
      albums: computed(() => albumStore.albums),
      selectedAlbum: computed(() => albumStore.selectedAlbum),
      songs: computed(() => albumStore.songs),
      albumLoading: computed(() => albumStore.loading),
      albumError: computed(() => albumStore.error),
      temas: computed(() => temaStore.temas),
      temaLoading: computed(() => temaStore.loading),
      temaError: computed(() => temaStore.error),
      selectArtist,
      selectAlbum,
      selectSong,
      selectTema,
      formatDuration,
    };
  },
});
</script>
<style scoped>
body {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.artist-page {
  display: flex;
  min-height: 100vh;
  background: var(--background-primary);
  color: var(--text-primary);
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
  background: var(--background-tertiary);
  overflow-y: auto;
  max-height: 110vh;
}

.artist-card {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 10px;
  padding: 10px;
  background: var(--background-secondary);
  border-radius: 10px;
  transition: background-color 0.2s;
}

.artist-card:hover {
  background-color: var(--hover-overlay);
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
  overflow-y: auto;
}

.artists-list::-webkit-scrollbar {
  width: 8px;
}

.artists-list::-webkit-scrollbar-track {
  background: var(--background-tertiary);
}

.artists-list::-webkit-scrollbar-thumb {
  background: var(--accent-color);
  border-radius: 10px;
}

/* Cabecera con imagen y degradado */
.artist-header {
  position: relative;
  width: 100%;
  height: 300px;
  margin-bottom: 30px;
  border-radius: 15px;
  overflow: hidden;
}

.artist-image-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.artist-header-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(18, 18, 18, 0.1) 0%,
    rgba(18, 18, 18, 0.4) 50%,
    rgba(18, 18, 18, 0.8) 100%
  );
  z-index: 1;
}

.artist-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 2;
  color: white;
}

.artist-name {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 5px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
  color:white;
}

.albums {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
  margin-bottom: 40px;
}

.album-card {
  cursor: pointer;
  text-align: center;
  transition: transform 0.2s;
  width: 200px;
}

.album-card:hover {
  transform: scale(1.05);
}

.album-cover {
  width: 100%;
  height: 200px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.album-card p {
  margin-top: 10px;
  font-weight: bold;
}

/* Estilos para las listas de canciones/temas */
.songs-list {
  list-style-type: none;
  padding: 0;
  margin: 0 0 40px 0;
}

.song-card {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 8px;
  background-color: var(--background-secondary);
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 0.2s;
}

.song-card:hover {
  background-color: rgba(255, 81, 0, 0.2);
}

.song-info-container {
  display: flex;
  align-items: center;
  max-width: 80%;
}

.song-image {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  margin-right: 16px;
  object-fit: cover;
}

.song-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.song-title {
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-primary);
}

.song-artist {
  font-size: 13px;
  opacity: 0.6;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-secondary);
}

.song-duration {
  opacity: 0.7;
  font-size: 14px;
  color: var(--text-secondary);
}

.details-container h2 {
  font-size: 24px;
  margin: 30px 0 20px 0;
  position: relative;
  padding-bottom: 10px;
  color: var(--text-primary);
}

.details-container h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background-color: var(--accent-color);
  border-radius: 3px;
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
    padding: 15px;
    gap: 12px;
  }
  
  .artist-card {
    flex-direction: column;
    min-width: 120px;
    margin-right: 0;
    text-align: center;
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
  }
  
  .artist-header {
    height: 250px;
  }

  .albums {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: 20px;
  }
  
  .album-card {
    width: 100%;
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
  
  .artist-header {
    height: 200px;
  }
  
  .artist-name {
    font-size: 24px;
    color:white;
  }
  
  .song-image {
    width: 45px;
    height: 45px;
  }
  
  .song-title {
    font-size: 14px;
  }
  
  .song-artist {
    font-size: 12px;
  }
  
  .albums {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 15px;
  }
}

@media screen and (max-width: 400px) {
  .albums {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .artist-header {
    height: 180px;
  }
}
</style>