<template>
  <div class="concerts-container">
    <div class="header">
      <h1>Concerts</h1>
      <button @click="fetchConcerts" class="refresh-btn" :disabled="loading">
        <span v-if="loading">↻</span>
        <span v-else>⟲</span>
        {{ loading ? '...' : 'Update' }}
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando conciertos...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error">
      <h3>❌ Error al cargar los conciertos</h3>
      <p>{{ error }}</p>
      <button @click="fetchConcerts" class="retry-btn">Reintentar</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="concerts.length === 0" class="empty">
      <h3>🎭 No hay conciertos disponibles</h3>
      <p>No se encontraron conciertos en este momento.</p>
    </div>

    <!-- Concerts grid -->
    <div v-else class="concerts-grid">
      <div 
        v-for="concert in concerts" 
        :key="concert.concertId || concert.ConcertId"
        class="concert-card"
      >
        <div class="concert-image">
          <img 
            v-if="concert.image || concert.Image" 
            :src="concert.image || concert.Image" 
            :alt="`Concierto ${concert.concertId || concert.ConcertId}`"
            @error="handleImageError"
          />
          <div v-else class="no-image">
            🎤
          </div>
        </div>
        
        <div class="concert-info">
          <div class="concert-header">
            <h3 class="concert-id">
            </h3>
            <span class="artist-badge">
            </span>
          </div>
          
          <div class="concert-details">
            <div class="detail-item" v-if="concert.venue || concert.Venue">
              <span class="label">♮ Place:</span>
              <span class="value">{{ concert.venue || concert.Venue }}</span>
            </div>
            
            <div class="detail-item" v-if="concert.date || concert.Date">
              <span class="label">⌨ Date:</span>
              <span class="value">{{ formatDate(concert.date || concert.Date) }}</span>
            </div>
            
            <div class="detail-item" v-if="concert.description || concert.Description">
              <span class="label">𝄚 Description</span>
              <span class="value">{{ concert.description || concert.Description }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats footer -->
    <div v-if="concerts.length > 0" class="stats">
      <p>Total concerts: <strong>{{ concerts.length }}</strong></p>
      <p>Last update: <strong>{{ lastUpdate }}</strong></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConcertsView',
  data() {
    return {
      concerts: [],
      loading: false,
      error: null,
      lastUpdate: null,
      apiUrl: 'https://localhost:7295/api/Concert' // Ajusta esta URL según tu API
    }
  },
  
  mounted() {
    this.fetchConcerts()
  },
  
  methods: {
    async fetchConcerts() {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(this.apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`)
        }
        
        const data = await response.json()
        
        // Si la respuesta es un array, úsala directamente
        // Si es un objeto con una propiedad que contiene el array, ajusta según sea necesario
        this.concerts = Array.isArray(data) ? data : (data.concerts || data.data || [])
        
        this.lastUpdate = new Date().toLocaleString('es-ES')
        
      } catch (err) {
        console.error('Error fetching concerts:', err)
        this.error = err.message || 'Error desconocido al cargar los conciertos'
      } finally {
        this.loading = false
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return 'Fecha no disponible'
      
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch (err) {
        return dateString
      }
    },
    
    handleImageError(event) {
      event.target.style.display = 'none'
      event.target.parentElement.classList.add('image-error')
    }
  }
}
</script>

<style scoped>
/* Variables para temas */
:root {
  /* Tema oscuro (por defecto) */
  --background-primary: #121212;
  --background-secondary: #181818;
  --background-tertiary: #282828;
  --text-primary: white;
  --text-secondary: #b3b3b3;
  --accent-color: #ff5100;
  --border-color: #333;
  --hover-overlay: rgba(255, 255, 255, 0.1);
}

/* Tema claro */
.light-theme {
  --background-primary: #f5f5f5;
  --background-secondary: #ffffff;
  --background-tertiary: #e8e8e8;
  --text-primary: #121212;
  --text-secondary: #555555;
  --accent-color: #ff5100;
  --border-color: #dadada;
  --hover-overlay: rgba(0, 0, 0, 0.05);
}

/* Tema oscuro (explícito) */
.dark-theme {
  --background-primary: #121212;
  --background-secondary: #181818;
  --background-tertiary: #282828;
  --text-primary: white;
  --text-secondary: #b3b3b3;
  --accent-color: #ff5100;
  --border-color: #333;
  --hover-overlay: rgba(255, 255, 255, 0.1);
}

.concerts-container {
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--background-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 3px solid var(--accent-color);
}

.header h1 {
  color: var(--text-primary);
  margin: 0;
  font-size: 2.5rem;
}

.refresh-btn {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 81, 0, 0.4);
  filter: brightness(1.1);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading, .error, .empty {
  text-align: center;
  padding: 60px 20px;
  border-radius: 12px;
  margin: 20px 0;
  background-color: var(--background-secondary);
  border: 1px solid var(--border-color);
}

.loading {
  color: var(--text-primary);
}

.error {
  color: var(--accent-color);
}

.empty {
  color: var(--text-secondary);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-btn {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 15px;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  filter: brightness(1.1);
}

.concerts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.concert-card {
  background-color: var(--background-secondary);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px solid var(--border-color);
}

.concert-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(255, 81, 0, 0.3);
  border-color: var(--accent-color);
  background-color: var(--background-tertiary);
}

.concert-image {
  height: 200px;
  background: var(--background-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--border-color);
}

.concert-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image, .image-error {
  font-size: 4rem;
  color: var(--accent-color);
  opacity: 0.8;
}

.concert-info {
  padding: 20px;
}

.concert-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.concert-id {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.4rem;
  font-weight: 600;
}

.concert-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.value {
  color: var(--text-primary);
  font-size: 1rem;
  line-height: 1.4;
}

.stats {
  background-color: var(--background-secondary);
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 15px;
  border: 2px solid var(--accent-color);
}

.stats p {
  margin: 0;
  color: var(--text-primary);
}

.stats strong {
  color: var(--accent-color);
}

/* Responsive design */
@media (max-width: 768px) {
  .concerts-container {
    padding: 15px;
  }
  
  .header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .concerts-grid {
    grid-template-columns: 1fr;
  }
  
  .concert-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .stats {
    flex-direction: column;
    gap: 10px;
  }
}
</style>