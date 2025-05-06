<template>
  <div class="music-app">
  <ThemeToggle />
    <h2 class="section-title">What's New</h2>
    <!-- Carousel for Featured Cards -->
    <div class="carousel-container">
      <button class="carousel-nav carousel-prev" @click="prevSlide">&lt;</button>
      
      <div class="featured-cards-carousel">
        <div 
          class="carousel-slide" 
          :style="{ transform: `translateX(-${currentSlide * slideWidth}%)` }"
        >
          <div 
            v-for="(card, index) in featuredCards" 
            :key="`featured-${index}`" 
            class="featured-card"
          >
            <div class="card-label">{{ card.label }}</div>
            <div class="card-title">{{ card.title }}</div>
            <div class="card-subtitle">{{ card.subtitle }}</div>
            <div class="card-image-container">
              <img :src="card.image" :alt="card.title" class="card-image">
              <div class="card-description">{{ card.description }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <button class="carousel-nav carousel-next" @click="nextSlide">&gt;</button>
    </div>
    
    <!-- Carousel indicators -->
    <div class="carousel-indicators">
      <span 
        v-for="(_, index) in Math.ceil(featuredCards.length / cardsPerSlide)" 
        :key="`indicator-${index}`"
        :class="['carousel-dot', { active: currentSlide === index }]"
        @click="goToSlide(index)"
      ></span>
    </div>

    <div class="section-header">
      <h2 class="section-title">Most Played Songs in Spain</h2>
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
      <h2 class="section-title">New Releases</h2>
    </div>
    <div class="albums-grid">
      <div v-for="(album, index) in newAlbums.slice(0, 12)" :key="`album-${index}`" class="album-item">
        <img :src="album.image" :alt="album.nombre" class="album-image">
      </div>
    </div>
  </div>
  <footer class="footer">
    <div class="footer-content">
      <p class="footer-text">© 2025 Hibiki. All rights reserved.</p>
      <div class="footer-links">
        <a href="/politica" class="footer-link">Privacy Policy</a>
        <a href="/terminos" class="footer-link">Terms and Conditions</a>
        <a href="/cookies" class="footer-link">Cookie Policy</a>
        <a href="/infoanuncios" class="footer-link">Ad Information</a>
      </div>
    </div>
  </footer>
</template>


<script>
import ThemeToggle from '@/components/ThemeToggle.vue';

export default {
  name: 'MusicApp',
  components: {
    ThemeToggle
  },
  data() {
    return {
      currentSlide: 0,
      cardsPerSlide: 3,
      featuredCards: [
        {
          label: 'NEW ALBUM BY ELADIO CARRION',
          title: 'DON KBRN',
          subtitle: 'Hibiki Music',
          image: 'https://s1.ppllstatics.com/canarias7/www/multimedia/2024/01/26/Eladio%20Carrin-kpu--1200x840@Canarias7.jpg',
          description: 'Discover the latest songs by Eladio Carrion.'
        },
        {
          label: 'DESTINO 2014 TOUR',
          title: 'Tour of the new album by Raul Clyde',
          subtitle: 'Hibiki Music',
          image: 'https://www.laguiago.com/wp-content/uploads/2025/01/raul-clyde.jpg',
          description: 'The Valencian artist will tour all over Spain in 2025.'
        },
        {
          label: 'DISCOVER NEW ARTISTS',
          title: 'Gabs',
          subtitle: 'Hibiki Music',
          image: 'https://i.scdn.co/image/ab6761670000ecd4f3386d596841d955168ba350',
          description: 'This Spanish artist is one of the top up-and-coming talents for 2025.'
        },
        {
          label: 'PURO LATINO',
          title: 'Discover the Puro Latino playlist on Hibiki',
          subtitle: 'Hibiki Music',
          image: 'https://cd1.taquilla.com/data/images/t/4c/puro-latino-fest-2024.webp',
          description: 'The playlist featuring today’s hottest Latin artists.'
        },
        {
          label: 'UPDATED PLAYLIST',
          title: 'Daily highlights',
          subtitle: 'Hibiki Music',
          image: 'https://www.clarin.com/img/2023/04/27/ebOFOAW8i_2000x1500__1.jpg',
          description: 'The freshest hits just released.'
        },
        {
          label: 'TURN UP THE REGGAETON',
          title: 'Hibiki Urban Latin Music',
          subtitle: 'Hibiki Music',
          image: 'https://imgs.elpais.com.uy/dims4/default/9eb21d4/2147483647/strip/true/crop/982x675+179+0/resize/1440x990!/quality/90/?url=https%3A%2F%2Fel-pais-uruguay-production-web.s3.us-east-1.amazonaws.com%2Fbrightspot%2F6d%2Fc7%2F4f39909f4a759354589abb8c2818%2Fanuel.jpg',
          description: 'The best reggaeton playlist right now.'
        },
        {
          label: 'ARTISTA DEL MES',
          title: 'C. Tangana',
          subtitle: 'Hibiki Music',
          image: '/api/placeholder/400/320',
          description: 'Descubre toda la discografía del madrileño con acceso premium.'
        },
        {
          label: 'EN CONCIERTO',
          title: 'Festival Hibiki',
          subtitle: 'Hibiki Music',
          image: '/api/placeholder/400/320',
          description: 'Un fin de semana de música en directo con los mejores artistas.'
        },
        {
          label: 'NUEVO SINGLE',
          title: 'Amanecer',
          subtitle: 'Hibiki Music',
          image: '/api/placeholder/400/320',
          description: 'Karol G sorprende con su nuevo single de verano.'
        },
        {
          label: 'PODCAST EXCLUSIVO',
          title: 'Detrás del Ritmo',
          subtitle: 'Hibiki Music',
          image: '/api/placeholder/400/320',
          description: 'Entrevistas y charlas con tus artistas favoritos.'
        }
      ],
      recentSongs: [],
      newAlbums: []
    }
  },
  computed: {
    slideWidth() {
      // Calculate width as percentage
      return 100 / this.cardsPerSlide;
    },
    totalSlides() {
      return Math.ceil(this.featuredCards.length / this.cardsPerSlide);
    }
  },
  mounted() {
    this.fetchRecentSongs();
    this.fetchNewAlbums();
    this.setupCarousel();
    window.addEventListener('resize', this.setupCarousel);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setupCarousel);
  },
  methods: {
    setupCarousel() {
      // Adjust cards per slide based on screen width
      if (window.innerWidth < 768) {
        this.cardsPerSlide = 1;
      } else if (window.innerWidth < 992) {
        this.cardsPerSlide = 2;
      } else {
        this.cardsPerSlide = 3;
      }
      
      // Reset to first slide when layout changes
      this.currentSlide = 0;
    },
    nextSlide() {
      if (this.currentSlide < this.totalSlides - 1) {
        this.currentSlide++;
      } else {
        this.currentSlide = 0; // Loop back to first slide
      }
    },
    prevSlide() {
      if (this.currentSlide > 0) {
        this.currentSlide--;
      } else {
        this.currentSlide = this.totalSlides - 1; // Loop to last slide
      }
    },
    goToSlide(index) {
      this.currentSlide = index;
    },
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
  background-color: var(--background-primary);
  color: var(--text-primary);
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 10px;
  color: var(--text-primary);
}

/* Carousel Container */
.carousel-container {
  position: relative;
  margin-bottom: 10px;
}

/* Carousel Controls */
.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: var(--text-primary);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background-color 0.3s;
}

.carousel-nav:hover {
  background-color: rgba(255, 81, 0, 0.8);
}

.carousel-prev {
  left: -20px;
}

.carousel-next {
  right: -20px;
}

/* Carousel Indicators */
.carousel-indicators {
  display: flex;
  justify-content: center;
  margin: 20px 0 40px;
}

.carousel-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--border-color);
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.carousel-dot.active {
  background-color: var(--accent-color);
}

/* Carousel Slides */
.featured-cards-carousel {
  overflow: hidden;
  margin: 0 20px;
}

.carousel-slide {
  display: flex;
  transition: transform 0.5s ease;
}

/* Tarjetas destacadas */
.featured-card {
  flex: 0 0 calc(100% / 3); /* Default for desktop */
  display: flex;
  flex-direction: column;
  background-color: var(--background-secondary);
  border-radius: 8px;
  padding: 15px;
  margin: 0 10px;
  transition: background-color 0.3s;
  box-sizing: border-box;
}

.featured-card:hover {
  background-color: var(--hover-overlay);
}

.card-label {
  font-size: 12px;
  color: var(--accent-color);
  margin-bottom: 4px;
  text-transform: uppercase;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
  color: var(--text-primary);
}

.card-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
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
  color:white;
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
  color: var(--accent-color);
  font-size: 14px;
  cursor: pointer;
}

.orange-button {
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.orange-button:hover {
  background-color: var(--accent-color);
  opacity: 0.9;
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
  background-color: var(--background-tertiary);
}

.song-item:hover {
  background-color: var(--hover-overlay);
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
  color: var(--text-primary);
}

.song-artist {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-options-btn {
  background: none;
  border: none;
  color: var(--accent-color);
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
  background-color: var(--background-secondary);
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
  background-color: var(--background-tertiary);
  padding: 20px 0;
  border-top: 1px solid var(--accent-color);
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
  color: var(--text-primary);
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
  color: var(--accent-color);
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: var(--text-primary);
  text-decoration: underline;
}
/* Responsive */
@media (max-width: 1200px) {
  .albums-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 992px) {
  .songs-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .featured-card {
    flex: 0 0 calc(100% / 2); /* 2 cards per slide on medium screens */
  }
}

@media (max-width: 768px) {
  .songs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .albums-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .featured-card {
    flex: 0 0 100%; /* 1 card per slide on small screens */
  }
}

@media (max-width: 576px) {
  .songs-grid,
  .albums-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 10px;
  }
  
  .carousel-prev {
    left: -10px;
  }
  
  .carousel-next {
    right: -10px;
  }
}
</style>