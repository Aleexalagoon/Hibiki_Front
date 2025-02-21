<template>
  <div class="artist-page">
    <div class="main-container">
      <!-- Sección de Artistas (Izquierda) -->
      <div class="artists-list">
        <h2>Artistas</h2>
        <div v-for="artist in allArtists" :key="artist.cantanteId" class="artist-card" @click="selectArtist(artist.cantanteId)">
          <img :src="artist.image" alt="Artist Image" class="artist-image" />
          <h3>{{ artist.nombre }}</h3>
        </div>
      </div>

      <!-- Sección de Detalles (Derecha) -->
      <div class="details-container">
        <div v-if="selectedArtist">
          <h1>{{ selectedArtist.name }}</h1>
          <p>{{ selectedArtist.monthlyListeners }} oyentes mensuales</p>
          <h2>Álbumes</h2>
          <!-- Comprobamos si 'albums' tiene elementos antes de mostrar -->
          <div v-if="albums.length > 0" class="albums">
            <div v-for="album in albums" :key="album.albumId" class="album-card" @click="selectAlbum(album.albumId)">
              <img :src="album.image" alt="Album Cover" class="album-cover" />
              <p>{{ album.name }}</p>
              <p>{{ new Date(album.releaseDate).toLocaleDateString() }}</p> <!-- Fecha de lanzamiento -->
            </div>
          </div>
          <!-- Si no hay álbumes, mostramos un mensaje -->
          <div v-else>
            <p>No hay álbumes disponibles para este artista.</p>
          </div>
        </div>

        <!-- Sección de Canciones -->
        <div v-if="selectedAlbum">
          <h2>Canciones de {{ selectedAlbum.name }}</h2>
          <ul>
            <li v-for="song in songs" :key="song.songId">{{ song.title }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, onMounted } from 'vue';
import { useArtistaStore } from '@/stores/artistaStore';
import { useAlbumStore } from '@/stores/albumStore';

export default defineComponent({
  setup() {
    const artistaStore = useArtistaStore();
    const albumStore = useAlbumStore(); // Usamos albumStore para los álbumes

    onMounted(() => {
      artistaStore.fetchAllArtists();
    });

    return {
      allArtists: computed(() => artistaStore.allArtists),
      selectedArtist: computed(() => artistaStore.selectedArtist),
      albums: computed(() => albumStore.albums), // Accedemos a los álbumes desde el store
      selectedAlbum: computed(() => albumStore.selectedAlbum),
      songs: computed(() => albumStore.songs),
      selectArtist: artistaStore.fetchArtistData,
      selectAlbum: albumStore.fetchAlbumSongs
    };
  }
});
</script>

<style scoped>
.artist-page {
  display: flex;
  height: 100vh;
  background: #121212;
  color: white;
}

.main-container {
  display: flex;
  width: 100%;
}

.artists-list {
  width: 30%;
  padding: 20px;
  background: #181818;
  overflow-y: auto;
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
  width: 100px;
  height: 100px;
  border-radius: 10px;
}
</style>
