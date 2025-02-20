<template>
  <div class="albums-container">
    <div v-if="loading" class="loading">Cargando álbumes...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div class="album-card" v-for="album in albums" :key="album.albumId">
        <img :src="album.image" alt="Album Cover" class="album-cover" />
        <div class="album-info">
          <h2>{{ album.name }}</h2>
          <h3> {{ album.artist }}</h3>
          <p>Fecha de lanzamiento: {{ formatDate(album.releaseDate) }}</p>
          <router-link :to="`/album/${album.albumId}`" class="preview-btn">
            ▶ Ver Álbum
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAlbumStore } from '@/stores/albumStore';
import { mapState, mapActions } from 'pinia';

export default {
  computed: {
    ...mapState(useAlbumStore, ['albums', 'loading', 'error']),
  },
  methods: {
    ...mapActions(useAlbumStore, ['fetchAlbums']),
    formatDate(date) {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  },
  async created() {
    await this.fetchAlbums();
  }
};
</script>

<style scoped>
.albums-container {
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(33deg, black, #ff5100);
  color: white;
  min-height: 100vh;
  justify-content: flex-start; 
  overflow-x: auto; 
}

.loading, .error {
  text-align: center;
  font-size: 1.2em;
  font-weight: bold;
  padding: 20px;
}

.album-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  transition: 0.3s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  min-width: 220px; 
  flex-shrink: 0; 
}

.album-card:hover {
  transform: scale(1.05);
  background: rgba(255, 255, 255, 0.2);
}

.album-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
}

.album-info h2, .album-info h3 {
  margin: 10px 0 5px 0;
}

.preview-btn {
  display: inline-block;
  background: #ff5100;
  color: white;
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 5px;
  font-weight: bold;
  transition: 0.3s;
}

.preview-btn:hover {
  background: #ca3900;
}
</style>

