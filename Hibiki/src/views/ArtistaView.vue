<template>
  <div class="artist-page">
    <!-- Cabecera de la página -->
    <div class="header">
      <img class="background-image" src="https://i0.wp.com/urbanroosters.news/wp-content/uploads/2023/08/mora.png?fit=1250%2C550&ssl=1" alt="Artist Background" />
      <div class="artist-info">
        <p class="verified" v-if="artistInfo.verified">✔ Artista verificado</p>
        <h1 class="artist-name">{{ artistInfo.name }}</h1>
        <p class="monthly-listeners">{{ artistInfo.monthlyListeners }} oyentes mensuales</p>
      </div>
    </div>

    <!-- Sección de Artistas -->
    <div class="artists-list">
      <h2>Artistas</h2>
      <div v-for="(artist, index) in allArtists" :key="index" class="artist-card" @click="fetchArtistData(artist.cantanteId)">
        <h3>{{ artist.nombre }}</h3>
        <p>{{ artist.descripcion }}</p>
        <p>{{ artist.oyentesMensuales }} oyentes mensuales</p>
      </div>
    </div>

    <!-- Sección de Canciones Populares -->
    <div class="popular-tracks">
      <h2>Populares</h2>
      <div class="track" v-for="(track, index) in tracks" :key="index">
        <span class="track-number">{{ index + 1 }}</span>
        <img class="track-image" :src="track.image" alt="Track Cover" />
        <span class="track-title">{{ track.title }}</span>
        <span class="track-plays">{{ track.plays }}</span>
        <span class="track-duration">{{ track.duration }}</span>
      </div>
    </div>

    <!-- Sección de Discografía -->
    <div class="discography">
      <h2>Discografía</h2>
      <div class="albums">
        <div class="album" v-for="(album, index) in albums" :key="index">
          <img class="album-cover" :src="album.cover" alt="Album Cover" />
          <p class="album-title">{{ album.title }}</p>
          <p class="album-year">{{ album.year }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tracks: [],  // Array de las canciones populares
      albums: [],  // Array de los álbumes
      allArtists: [],  // Array de todos los artistas
      artistInfo: {
        name: '',  // Nombre del artista seleccionado
        verified: false,  // Estado de verificación
        monthlyListeners: ''  // Oyentes mensuales del artista seleccionado
      }
    };
  },
  mounted() {
    this.fetchAllArtists();  // Al montar el componente, obtener todos los artistas
  },
  methods: {
    // Función para obtener todos los artistas desde la API
    async fetchAllArtists() {
      try {
        const response = await fetch('https://localhost:7295/api/Artista');  // URL de la API
        if (response.ok) {
          const data = await response.json();  // Convertir la respuesta a JSON
          this.allArtists = data;  // Asignar la lista de artistas al array
        } else {
          console.error("Error al obtener los artistas");
        }
      } catch (error) {
        console.error("Error de red o servidor:", error);
      }
    },

    // Función para obtener los detalles de un artista seleccionado
    async fetchArtistData(artistId) {
      try {
        const response = await fetch(`https://localhost:7295/api/Artista/${artistId}`);  // URL para obtener los detalles de un artista específico
        if (response.ok) {
          const data = await response.json();  // Convertir la respuesta a JSON
          
          // Asignar la información del artista
          this.artistInfo = {
            name: data.nombre,
            verified: true,  // Marcar al artista como verificado
            monthlyListeners: data.oyentesMensuales
          };

          // Asignar las canciones populares del artista
          if (data.tracks) {
            this.tracks = data.tracks;
          }
          
          // Asignar los álbumes del artista
          if (data.albums) {
            this.albums = data.albums;
          }
          
        } else {
          console.error("Error al obtener el artista");
        }
      } catch (error) {
        console.error("Error de red o servidor:", error);
      }
    }
  }
};
</script>

<style scoped>
.artist-page {
  color: white;
  font-family: Arial, sans-serif;
  background: linear-gradient(30deg, black 80%, rgba(255, 81, 0, 0.8) 90%, #ff5100 100%);
  padding: 20px;
}

.header {
  position: relative;
}

.background-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.artist-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
}

.verified {
  font-size: 14px;
  margin-bottom: 2px;
}

.artist-name {
  font-size: 48px;
  margin: 0;
}

.monthly-listeners {
  font-size: 16px;
  margin-top: 2px;
}

/* Sección de Artistas */
.artists-list {
  margin-top: 20px;
}

.artist-card {
  background: #333;
  padding: 10px;
  border-radius: 8px;
  margin: 10px 0;
  cursor: pointer;
}

.artist-card:hover {
  background: #444;
}

.artist-card h3 {
  color: #ff5100;
}

.artist-card p {
  color: white;
  margin: 5px 0;
}

/* Sección de Canciones Populares */
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

.track-plays {
  margin-right: 20px;
}

.track-duration {
  text-align: right;
  opacity: 0.8;
}

/* Sección de Discografía */
.discography {
  margin-top: 20px;
}

.albums {
  display: flex;
  overflow-x: auto;
  gap: 20px;
  justify-content: center;
  padding: 20px;
}

.album {
  position: relative;
  text-align: center;
}

.album-cover {
  width: 240px; 
  height: 250px;
  border-radius: 10px;
  object-fit: cover;
  background: rgba(0, 0, 0, 0.6);
}

.album-title {
  font-size: 12px; 
  color: white;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
}

.album-year {
  font-size: 10px;
  color: white;
  opacity: 0.8;
  margin: 0;
}
</style>
