<template>
  <div class="profile-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando perfil...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-message">
        <h3>Error al cargar el perfil</h3>
        <p>{{ error }}</p>
        <button @click="loadProfile" class="retry-button">Reintentar</button>
      </div>
    </div>

    <!-- Profile Content -->
    <div v-else-if="userInfo" class="profile-content">
      <!-- Header del Perfil -->
      <div class="profile-header">
        <div class="profile-avatar">
          <div class="avatar-circle">
            <span class="avatar-text">{{ (userInfo?.name || 'U').charAt(0).toUpperCase() }}</span>
          </div>
        </div>
        
        <div class="profile-info">
          <span class="profile-label">Perfil</span>
          <h1 class="profile-name">{{ userInfo?.name || 'Usuario' }}</h1>
          <div class="profile-stats">
            <span class="stat-item">{{ realUserPlaylists?.length || 0 }} playlists públicas</span>
            <span class="stat-separator">•</span>
            <span class="stat-item">Miembro desde {{ userInfo?.fecha_Registro ? formatDate(userInfo.fecha_Registro) : 'N/A' }}</span>
            <span v-if="isUserPremium" class="premium-badge">PREMIUM</span>
          </div>
        </div>

        <div class="profile-actions">
          <button @click="toggleEditMode" class="edit-button">
            {{ editMode ? 'Cancelar' : 'Editar perfil' }}
          </button>
        </div>
      </div>

      <!-- Formulario de Edición -->
      <div v-if="editMode" class="edit-form">
        <div class="form-group">
          <label for="name">Nombre:</label>
          <input 
            id="name"
            v-model="editForm.name" 
            type="text" 
            class="form-input"
            placeholder="Tu nombre"
          />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            id="email"
            v-model="editForm.email" 
            type="email" 
            class="form-input"
            placeholder="tu@email.com"
          />
        </div>
        <div class="form-actions">
          <button @click="saveProfile" class="save-button" :disabled="loading">
            {{ loading ? 'Guardando...' : 'Guardar' }}
          </button>
          <button @click="toggleEditMode" class="cancel-button">Cancelar</button>
        </div>
      </div>

      <!-- Estadísticas de Escucha Real -->
      <div class="stats-section">
        <h2 class="section-title">Estadísticas de Escucha</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">{{ listeningStats.totalPlayTime }}</div>
            <div class="stat-label">Horas escuchadas este mes</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ listeningStats.songsPlayed }}</div>
            <div class="stat-label">Reproducciones este mes</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ listeningStats.uniqueSongs }}</div>
            <div class="stat-label">Canciones diferentes</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ listeningStats.uniqueArtists }}</div>
            <div class="stat-label">Artistas diferentes</div>
          </div>
        </div>
        
        <!-- Estadística adicional -->
        <div class="listening-insight">
          <p v-if="listeningStats.averageSessionTime > 0">
            📊 Tu sesión promedio de escucha es de {{ listeningStats.averageSessionTime }} minutos
          </p>
        </div>
      </div>

      <!-- Artistas Más Escuchados (Datos Reales) -->
      <div class="section" v-if="topArtistsReal.length > 0">
        <div class="section-header">
          <h2 class="section-title">Artistas más escuchados este mes</h2>
          <span class="section-subtitle">Basado en tu actividad real de escucha</span>
        </div>
        
        <div class="artists-grid">
          <div 
            v-for="(artist, index) in topArtistsReal" 
            :key="artist.cantanteId" 
            class="artist-card real-data"
            @click="goToArtist(artist.cantanteId)"
          >
            <div class="artist-rank">#{{ index + 1 }}</div>
            <div class="artist-image">
              <img :src="artist.image || defaultImage" :alt="artist.nombre" />
            </div>
            <h3 class="artist-name">{{ artist.nombre }}</h3>
            <div class="artist-stats">
              <p class="artist-play-count">{{ artist.playCount }} reproducciones</p>
              <p class="artist-time">{{ formatMinutes(artist.totalListenTime) }}</p>
              <p class="artist-songs">{{ artist.uniqueSongs }} canciones diferentes</p>
            </div>
            <div class="listen-percentage">
              <div class="percentage-bar">
                <div 
                  class="percentage-fill" 
                  :style="{ width: calculatePercentage(artist.totalListenTime, topArtistsReal[0]?.totalListenTime) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Canciones Más Escuchadas (Datos Reales) -->
      <div class="section" v-if="topSongsReal.length > 0">
        <div class="section-header">
          <h2 class="section-title">Canciones más escuchadas este mes</h2>
          <span class="section-subtitle">Tu música favorita basada en reproducciones reales</span>
        </div>
        
        <div class="songs-list">
          <div 
            v-for="(song, index) in topSongsReal" 
            :key="song.cancionId" 
            class="song-item real-data"
            @click="playSong(song)"
          >
            <div class="song-index">#{{ index + 1 }}</div>
            <div class="song-image">
              <img :src="song.image || defaultImage" :alt="song.nombre" />
              <div class="play-overlay">
                <span class="play-icon">▶</span>
              </div>
            </div>
            <div class="song-info">
              <h4 class="song-title">{{ song.nombre }}</h4>
              <p class="song-artist">{{ song.artista }}</p>
            </div>
            <div class="song-stats">
              <div class="stat-item">
                <span class="stat-number">{{ song.playCount }}</span>
                <span class="stat-label">reproducciones</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ formatMinutes(song.totalListenTime) }}</span>
                <span class="stat-label">tiempo total</span>
              </div>
              <div class="completion-rate">
                <span class="completion-percentage">{{ Math.round(song.completionRate) }}%</span>
                <span class="completion-label">completada</span>
              </div>
            </div>
            <div class="song-duration">{{ song.duracion }}</div>
          </div>
        </div>
      </div>

      <!-- Playlists Creadas -->
      <div class="section" v-if="realUserPlaylists.length > 0">
        <div class="section-header">
          <h2 class="section-title">Playlists creadas</h2>
          <span class="section-subtitle">Tus colecciones personales</span>
        </div>
        
        <div class="playlists-grid">
          <div 
            v-for="playlist in realUserPlaylists" 
            :key="playlist.playlistId" 
            class="playlist-card"
            @click="goToPlaylist(playlist.playlistId)"
          >
            <div class="playlist-image">
              <img :src="playlist.image || defaultPlaylistImage" :alt="playlist.nombre" />
            </div>
            <h3 class="playlist-name">{{ playlist.nombre }}</h3>
            <p class="playlist-description">{{ playlist.descripcion || 'Sin descripción' }}</p>
            <span class="playlist-date">Creada el {{ formatDate(playlist.fechaCreacion) }}</span>
          </div>
        </div>
      </div>

      <!-- Actividad Reciente -->
      <div class="section" v-if="recentActivity.length > 0">
        <div class="section-header">
          <h2 class="section-title">Actividad reciente</h2>
          <span class="section-subtitle">Últimas canciones que has escuchado</span>
        </div>
        
        <div class="recent-activity">
          <div 
            v-for="activity in recentActivity" 
            :key="activity.id" 
            class="activity-item"
          >
            <div class="activity-time">{{ formatRecentTime(activity.timestamp) }}</div>
            <div class="activity-song">
              <span class="song-name">{{ activity.songName }}</span>
              <span class="artist-name">{{ activity.artistName }}</span>
            </div>
            <div class="activity-duration">
              {{ formatSeconds(activity.listenDuration) }} / {{ activity.totalDuration }}
            </div>
            <div class="activity-completion" :class="{ completed: activity.completed }">
              {{ activity.completed ? '✓ Completada' : '◐ Parcial' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!topArtistsReal.length && !topSongsReal.length" class="empty-state">
        <div class="empty-icon">🎵</div>
        <h3>¡Empieza a escuchar música!</h3>
        <p>Reproduce canciones para ver tus estadísticas personalizadas aquí</p>
        <button @click="goToDiscover" class="discover-button">Descubrir música</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePlayerStore } from '@/stores/player'
import { useListeningHistoryStore } from '@/stores/listeningHistoryStore'

const router = useRouter()
const authStore = useAuthStore()
const playerStore = usePlayerStore()
const listeningStore = useListeningHistoryStore()

// Estado local
const profileData = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const editMode = ref(false)
const editForm = ref({
  name: '',
  email: ''
})

const defaultImage = 'https://via.placeholder.com/150x150/ff5100/white?text=🎵'
const defaultPlaylistImage = 'https://via.placeholder.com/200x200/333/white?text=Playlist'

// Computed properties para datos reales
const userInfo = computed(() => authStore.user)
const isUserPremium = computed(() => authStore.isPremium)

// Datos reales del tracking
const topArtistsReal = computed(() => listeningStore.monthlyTopArtists)
const topSongsReal = computed(() => listeningStore.monthlyTopSongs)
const listeningStats = computed(() => listeningStore.listeningStats)

// Playlists reales del usuario
const realUserPlaylists = computed(() => profileData.value?.playlistsCreadas || [])

// Actividad reciente (últimas 10 reproducciones)
const recentActivity = computed(() => {
  return listeningStore.playHistory
    .slice(-10)
    .reverse()
    .map(play => ({
      id: play.id,
      timestamp: play.timestamp,
      songName: getSongName(play.cancionId),
      artistName: getArtistName(play.cantanteId),
      listenDuration: play.duration,
      totalDuration: formatSeconds(play.totalDuration),
      completed: play.completed
    }))
})

// Methods
const loadProfile = async () => {
  loading.value = true
  error.value = null
  
  try {
    const API_BASE_URL = "http://aa0918044ca2b4e9b94f01593a2e67bf-1447626218.us-east-1.elb.amazonaws.com/api"
    
    // Solo cargar playlists ya que artistas y canciones vienen del tracking
    try {
      const playlistsResponse = await fetch(`${API_BASE_URL}/Playlist`)
      if (playlistsResponse.ok) {
        const playlists = await playlistsResponse.json()
        if (Array.isArray(playlists)) {
          // Filtrar playlists del usuario actual si es posible
          const userPlaylists = playlists.filter(playlist => 
            playlist.creadorId === userInfo.value?.userId || 
            playlist.creador?.userId === userInfo.value?.userId
          )
          
          profileData.value = {
            playlistsCreadas: userPlaylists.length > 0 ? userPlaylists : playlists.slice(0, 3)
          }
        }
      }
    } catch (playlistError) {
      console.warn('Error cargando playlists:', playlistError)
      profileData.value = { playlistsCreadas: [] }
    }
    
  } catch (err) {
    console.error('Error general en loadProfile:', err)
    error.value = 'Error al cargar el perfil. Por favor, intenta de nuevo.'
  } finally {
    loading.value = false
  }
}

const toggleEditMode = () => {
  if (editMode.value) {
    editMode.value = false
    editForm.value = {
      name: userInfo.value?.name || '',
      email: userInfo.value?.email || ''
    }
  } else {
    editMode.value = true
    editForm.value = {
      name: userInfo.value?.name || '',
      email: userInfo.value?.email || ''
    }
  }
}

const saveProfile = async () => {
  try {
    loading.value = true
    // Implementar guardado real aquí cuando tengas el endpoint
    console.log('Guardando perfil:', editForm.value)
    
    // Simular actualización exitosa
    if (authStore.user) {
      authStore.user.name = editForm.value.name
      authStore.user.email = editForm.value.email
    }
    
    editMode.value = false
  } catch (err) {
    console.error('Error al guardar:', err)
  } finally {
    loading.value = false
  }
}

const playSong = (song: any) => {
  // Convertir el formato de song para el reproductor
  const playerSong = {
    ...song,
    nombre: song.nombre,
    artista: song.artista,
    ruta: `/music/${song.cancionId}.mp3`, // Ajustar según tu estructura
    image: song.image,
    cancionId: song.cancionId,
    cantanteId: song.cantanteId
  }
  playerStore.setSong(playerSong)
}

const goToArtist = (artistId: number) => {
  router.push(`/artista/${artistId}`)
}

const goToPlaylist = (playlistId: number) => {
  router.push(`/playlist`)
}

const goToDiscover = () => {
  router.push('/novedades')
}

// Utility functions
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return 'Fecha no disponible'
  }
}

const formatMinutes = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }
  return `${minutes}m`
}

const formatSeconds = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

const formatRecentTime = (timestamp: number): string => {
  const now = Date.now()
  const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Hace un momento'
  if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `Hace ${diffInHours}h`
  
  const diffInDays = Math.floor(diffInHours / 24)
  return `Hace ${diffInDays}d`
}

const calculatePercentage = (value: number, maxValue: number): number => {
  if (!maxValue) return 0
  return Math.round((value / maxValue) * 100)
}

const getSongName = (cancionId: number): string => {
  const song = topSongsReal.value.find(s => s.cancionId === cancionId)
  return song?.nombre || 'Canción desconocida'
}

const getArtistName = (cantanteId: number): string => {
  const artist = topArtistsReal.value.find(a => a.cantanteId === cantanteId)
  return artist?.nombre || 'Artista desconocido'
}

// Watchers para actualizar en tiempo real
watch(() => playerStore.currentSong, () => {
  // El perfil se actualiza automáticamente cuando cambian las estadísticas
}, { deep: true })

// Lifecycle
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  // Inicializar el store de listening history
  await listeningStore.initialize()
  
  await loadProfile()
})

onUnmounted(() => {
  // Cleanup si es necesario
})
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #1e1e1e 0%, #121212 100%);
  color: white;
  padding: 24px;
}

/* Loading & Error States */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: #ff5100;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.error-message {
  text-align: center;
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 8px;
  padding: 24px;
}

.retry-button {
  background-color: #ff5100;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 16px;
}

/* Profile Header */
.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 48px;
  gap: 24px;
}

.profile-avatar {
  flex-shrink: 0;
}

.avatar-circle {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #ff5100, #ff7700);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(255, 81, 0, 0.3);
}

.avatar-text {
  font-size: 48px;
  font-weight: bold;
  color: white;
}

.profile-info {
  flex: 1;
}

.profile-label {
  font-size: 14px;
  color: #a7a7a7;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.profile-name {
  font-size: 48px;
  font-weight: 900;
  margin: 8px 0 16px;
  background: linear-gradient(90deg, #ffffff, #ff5100);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.profile-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #a7a7a7;
  font-size: 14px;
}

.stat-separator {
  color: #666;
}

.premium-badge {
  background: linear-gradient(90deg, #ffd700, #ffed4e);
  color: #000;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.profile-actions {
  flex-shrink: 0;
}

.edit-button {
  background: transparent;
  border: 1px solid #fff;
  color: white;
  padding: 8px 24px;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-button:hover {
  background-color: #fff;
  color: #000;
}

/* Edit Form */
.edit-form {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #333;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
}

.form-input:focus {
  outline: none;
  border-color: #ff5100;
}

.form-actions {
  display: flex;
  gap: 12px;
}

.save-button, .cancel-button {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.save-button {
  background-color: #ff5100;
  color: white;
}

.cancel-button {
  background: transparent;
  border: 1px solid #666;
  color: #a7a7a7;
}

/* Stats Section */
.stats-section {
  margin-bottom: 48px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #ff5100;
  margin-bottom: 8px;
}

.stat-label {
  color: #a7a7a7;
  font-size: 14px;
}

.listening-insight {
  margin-top: 16px;
  padding: 16px;
  background: rgba(255, 81, 0, 0.1);
  border-radius: 8px;
  text-align: center;
}

/* Sections */
.section {
  margin-bottom: 48px;
}

.section-header {
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.section-subtitle {
  color: #a7a7a7;
  font-size: 14px;
}

/* Artists Grid - Enhanced for real data */
.artists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

.artist-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.artist-card.real-data {
  border: 1px solid rgba(255, 81, 0, 0.3);
}

.artist-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-4px);
}

.artist-rank {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #ff5100;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.artist-image {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 16px;
}

.artist-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.artist-name {
  font-weight: 600;
  margin-bottom: 12px;
  text-align: center;
}

.artist-stats {
  text-align: center;
  margin-bottom: 12px;
}

.artist-stats p {
  margin: 4px 0;
  font-size: 12px;
  color: #a7a7a7;
}

.artist-play-count {
  color: #ff5100 !important;
  font-weight: 600 !important;
}

.listen-percentage {
  margin-top: 12px;
}

.percentage-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.percentage-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff5100, #ff7700);
  transition: width 0.3s ease;
}

/* Songs List - Enhanced for real data */
.songs-list {
  gap: 8px;
  display: flex;
  flex-direction: column;
}

.song-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.song-item.real-data {
  border: 1px solid rgba(255, 81, 0, 0.2);
  background: rgba(255, 81, 0, 0.05);
}

.song-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.song-index {
  width: 40px;
  text-align: center;
  color: #ff5100;
  font-weight: 600;
  font-size: 18px;
}

.song-image {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 16px;
  position: relative;
}

.song-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.song-item:hover .play-overlay {
  opacity: 1;
}

.play-icon {
  color: white;
  font-size: 16px;
}

.song-info {
  flex: 1;
  margin-right: 16px;
}

.song-title {
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 16px;
}

.song-artist {
  color: #a7a7a7;
  font-size: 14px;
  margin: 0;
}

.song-stats {
  display: flex;
  gap: 24px;
  align-items: center;
  margin-right: 16px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-weight: bold;
  color: #ff5100;
  display: block;
  font-size: 14px;
}

.stat-label {
  font-size: 11px;
  color: #a7a7a7;
}

.completion-rate {
  text-align: center;
}

.completion-percentage {
  font-weight: bold;
  color: #4ade80;
  display: block;
  font-size: 14px;
}

.completion-label {
  font-size: 11px;
  color: #a7a7a7;
}

.song-duration {
  color: #a7a7a7;
  font-size: 14px;
  min-width: 50px;
  text-align: right;
}

/* Recent Activity */
.recent-activity {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  gap: 16px;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-time {
  font-size: 12px;
  color: #a7a7a7;
  min-width: 80px;
}

.activity-song {
  flex: 1;
}

.song-name {
  font-weight: 600;
  display: block;
}

.artist-name {
  font-size: 12px;
  color: #a7a7a7;
}

.activity-duration {
  font-size: 12px;
  color: #a7a7a7;
  min-width: 80px;
  text-align: center;
}

.activity-completion {
  font-size: 12px;
  color: #666;
  min-width: 100px;
  text-align: center;
}

.activity-completion.completed {
  color: #4ade80;
}

/* Playlists Grid */
.playlists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

.playlist-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.playlist-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-4px);
}

.playlist-image {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
}

.playlist-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.playlist-name {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 16px;
}

.playlist-description {
  color: #a7a7a7;
  font-size: 14px;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.playlist-date {
  color: #666;
  font-size: 12px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 48px 24px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 2px dashed #333;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 24px;
  margin-bottom: 16px;
  color: #ff5100;
}

.empty-state p {
  color: #a7a7a7;
  margin-bottom: 24px;
  font-size: 16px;
}

.discover-button {
  background: linear-gradient(90deg, #ff5100, #ff7700);
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.discover-button:hover {
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-container {
    padding: 16px;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .profile-name {
    font-size: 32px;
  }

  .profile-stats {
    flex-direction: column;
    gap: 8px;
  }

  .artists-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 16px;
  }

  .playlists-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .song-item {
    padding: 12px;
    flex-wrap: wrap;
  }

  .song-stats {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .song-index {
    width: 30px;
  }

  .song-image {
    width: 40px;
    height: 40px;
    margin-right: 12px;
  }

  .activity-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .profile-name {
    font-size: 24px;
  }

  .avatar-circle {
    width: 80px;
    height: 80px;
  }

  .avatar-text {
    font-size: 32px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .artists-grid,
  .playlists-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-actions {
    flex-direction: column;
  }

  .save-button,
  .cancel-button {
    width: 100%;
  }

  .song-stats {
    width: 100%;
    margin-top: 8px;
    flex-direction: row;
    justify-content: space-between;
  }

  .recent-activity {
    padding: 12px;
  }

  .activity-item {
    padding: 8px 0;
  }
}

/* Nuevos estilos para destacar datos reales */
.real-data {
  position: relative;
}

.real-data::before {
  content: '🔥';
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 16px;
}

/* Animaciones para datos en tiempo real */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.stats-section .stat-number {
  animation: pulse 2s ease-in-out infinite;
}

/* Estilos para indicadores de actividad */
.section-title {
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #ff5100, #ff7700);
  border-radius: 2px;
}
</style>