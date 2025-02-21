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
          <div class="albums">
            <div v-for="album in albums" :key="album.albumId" class="album-card" @click="selectAlbum(album.albumId)">
              <img :src="album.cover" alt="Album Cover" class="album-cover" />
              <p>{{ album.title }}</p>
            </div>
          </div>
        </div>

        <!-- Sección de Canciones -->
        <div v-if="selectedAlbum">
          <h2>Canciones de {{ selectedAlbum.title }}</h2>
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

export default defineComponent({
  setup() {
    const artistaStore = useArtistaStore();
    
    onMounted(() => {
      artistaStore.fetchAllArtists();
    });

    return {
      allArtists: computed(() => artistaStore.allArtists),
      selectedArtist: computed(() => artistaStore.selectedArtist),
      albums: computed(() => artistaStore.albums),
      selectedAlbum: computed(() => artistaStore.selectedAlbum),
      songs: computed(() => artistaStore.songs),
      selectArtist: artistaStore.fetchArtistData,
      selectAlbum: artistaStore.fetchAlbumSongs
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
}

.album-card {
  cursor: pointer;
}

.album-cover {
  width: 100px;
  height: 100px;
  border-radius: 10px;
}
</style>
