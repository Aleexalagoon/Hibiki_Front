<template>
  <div class="music-app">
    <h2 class="section-title">Novedades</h2>
    <div class="featured-cards">
      <div v-for="(card, index) in featuredCards" :key="`featured-${index}`" class="featured-card">
        <div class="card-label">{{ card.label }}</div>
        <div class="card-title">{{ card.title }}</div>
        <div class="card-subtitle">{{ card.subtitle }}</div>
        <div class="card-image-container">
          <img :src="card.image" :alt="card.title" class="card-image">
          <div class="card-description">{{ card.description }}</div>
        </div>
      </div>
    </div>

    <div class="section-header">
      <h2 class="section-title">Canciones mas escuchadas en España</h2>
      <span class="section-more"></span>
    </div>
    <div class="songs-grid">
      <div v-for="(song, index) in recentSongs.slice(0, 12)" :key="`song-${index}`" class="song-item">
        <div class="song-image-container">
          <img :src="song.image" :alt="song.nombre" class="song-image">
        </div>
        <div class="song-info">
          <div class="song-title">{{ song.nombre }}</div>
          <div class="song-artist">{{ song.artista }}</div>
        </div>
        <button class="more-options-btn">•••</button>
      </div>
    </div>
    <div class="section-header">
      <h2 class="section-title">Nuevos lanzamientos</h2>
    </div>
    <div class="albums-grid">
      <div v-for="(album, index) in newAlbums.slice(0, 12)" :key="`album-${index}`" class="album-item">
        <img :src="album.image" :alt="album.nombre" class="album-image">
      </div>
    </div>
  </div>
  <footer class="footer">
    <div class="footer-content">
      <p class="footer-text">© 2025 Hibiki. Todos los derechos reservados.</p>
      <div class="footer-links">
        <a href="/politica" class="footer-link">Política de Privacidad</a>
        <a href="/terminos" class="footer-link">Términos y Condiciones</a>
        <a href="/cookies" class="footer-link">Política de Cookies</a>
        <a href="/infoanuncios" class="footer-link">Información de anuncios</a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'MusicApp',
  data() {
    return {
      featuredCards: [
        {
          label: 'NUEVO ALBUM DE BAD BUNNY',
          title: 'DeBÍ TiRAR MáS FOToS',
          subtitle: 'Hibiki Music',
          image: 'https://binary.media/wp-content/uploads/2025/01/debi_tirar_mas_fotos_bad_bunny_binary-1048x630.jpg',
          description: 'Descubre las nuevas canciones de Bad Bunny .'
        },
        {
          label: 'DESTINO 2014 TOUR',
          title: 'Gira del nuevo album de Raul Clyde',
          subtitle: 'Hibiki Music',
          image: 'https://entradas.lavanguardia.com/wp-content/uploads/2025/01/raul-clyde-sala-razzmatazz.jpg',
          description: 'El valenciano hará este 2025 un tour por toda España.'
        },
        {
          label: 'DESCUBRE NUEVOS ARTISTAS',
          title: 'Gabs',
          subtitle: 'Hibiki Music',
          image: 'https://i.scdn.co/image/ab6761670000ecd4f3386d596841d955168ba350',
          description: 'El español es una de las promesas para este 2025'
        }
      ],
      recentSongs: [],
      newAlbums: []
    }
  },
  mounted() {
    this.fetchRecentSongs();
    this.fetchNewAlbums();
  },
  methods: {
    async fetchRecentSongs() {
      try {
        const response = await fetch('https://localhost:7295/api/Cancion');
        const data = await response.json();
        this.recentSongs = data;
      } catch (error) {
        console.error('Error fetching recent songs:', error);
      }
    },
    async fetchNewAlbums() {
      try {
        const response = await fetch('https://localhost:7295/api/Album');
        const data = await response.json();
        this.newAlbums = data;
      } catch (error) {
        console.error('Error fetching new albums:', error);
      }
    }
  }
}
</script>

<style scoped>
.music-app {
  margin: 0 auto;
  padding: 20px;
  background-color: #121212;
  color: white;
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
  color: white;
}

/* Tarjetas destacadas */
.featured-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.featured-card {
  display: flex;
  flex-direction: column;
  background-color: #181818;
  border-radius: 8px;
  padding: 15px;
  transition: background-color 0.3s;
}

.featured-card:hover {
  background-color: #282828;
}

.card-label {
  font-size: 12px;
  color: #ff5100;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
  color: white;
}

.card-subtitle {
  font-size: 14px;
  color: #b3b3b3;
  margin-bottom: 10px;
}

.card-image-container {
  position: relative;
  height: 0;
  padding-bottom: 75%;
  overflow: hidden;
  border-radius: 6px;
}

.card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-description {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  font-size: 14px;
}

/* Sección de header con "Ver todo" */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-more {
  color: #ff5100; 
  font-size: 14px;
  cursor: pointer;
}

.orange-button {
  background-color: #ff5100; 
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.orange-button:hover {
  background-color: #ff5100; 
}

/* Canciones recién llegadas */
.songs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.song-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
  background-color: #181818;
}

.song-item:hover {
  background-color: #282828;
}

.song-image-container {
  width: 60px;
  height: 60px;
  margin-right: 12px;
  border-radius: 4px;
  overflow: hidden;
}

.song-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.song-info {
  flex: 1;
}

.song-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
}

.song-artist {
  font-size: 12px;
  color: #b3b3b3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-options-btn {
  background: none;
  border: none;
  color: #ff5100; 
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
}

/* Nuevos lanzamientos */
.albums-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}

.album-item {
  position: relative;
  height: 0;
  padding-bottom: 100%;
  overflow: hidden;
  border-radius: 8px;
  background-color: #181818;
}

.album-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.album-item:hover .album-image {
  transform: scale(1.05);
}

.footer {
  background-color: #181818;
  padding: 20px 0;
  border-top: 1px solid #ff5100;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.footer-text {
  color: white;
  font-size: 14px;
  margin-bottom: 15px;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.footer-link {
  color: #ff5100; 
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: white;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 576px) {
  .footer-links {
    flex-direction: column;
    gap: 10px;
  }
}

/* Responsive */
@media (max-width: 1200px) {
  .albums-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 992px) {
  .featured-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .songs-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .featured-cards,
  .songs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .albums-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 576px) {
  .featured-cards,
  .songs-grid,
  .albums-grid {
    grid-template-columns: 1fr;
  }
}
</style>