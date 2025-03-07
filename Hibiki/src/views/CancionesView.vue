<template>
  <div class="song-page">
    <!-- Sección de Canciones Populares -->
    <div class="popular-tracks">
      <h2>Canciones Populares</h2>
      <!-- Mostrar lista de canciones -->
      <div class="track" v-for="(track, index) in tracks" :key="track.cancionId">
        <span class="track-number">{{ index + 1 }}</span>
        <!-- Imagen de la canción -->
        <img class="track-image" :src="track.image" alt="Track Cover" />
        <span class="track-title">{{ track.nombre }}</span>
        <span class="track-duration">{{ track.duracion }} minutos</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tracks: [],
      songInfo: {},
    };
  },
  mounted() {
    this.fetchSongData();
  },
  methods: {
    async fetchSongData() {
      const response = await fetch('${API_BASE_URL}/Cancion');
      if (response.ok) {
        this.tracks = await response.json();
      }
    },
    async fetchSongDetails(songId) {
      const response = await fetch(`${API_BASE_URL}/Cancion/${songId}`);
      if (response.ok) {
        this.songInfo = await response.json();
      }
    }
  }
};
</script>

<style scoped>
.song-page {
  color: white;
  font-family: Arial, sans-serif;
  background: linear-gradient(30deg, black 80%, rgba(255, 81, 0, 0.8) 90%, #ff5100 100%);
  padding: 20px;
}

.popular-tracks {
  margin-top: 20px;
}

.track {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #333;
}

.track-number {
  width: 20px;
  font-weight: bold;
  color: #ff5100;
}

.track-image {
  width: 50px;
  border-radius: 10px;
  height: 50px;
  margin-right: 10px;
}

.track-title {
  flex-grow: 1;
}

.track-duration {
  text-align: right;
  opacity: 0.8;
}
</style>
