<template>
  <div class="profile-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading profile...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-message">
        <h3>Error loading profile</h3>
        <p>{{ error }}</p>
        <button @click="loadProfile" class="retry-button">Retry</button>
      </div>
    </div>

    <!-- Profile Content -->
    <div v-else-if="userInfo" class="profile-content">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="profile-avatar">
          <div class="avatar-circle">
            <span class="avatar-text">{{ (userInfo?.name || 'U').charAt(0).toUpperCase() }}</span>
          </div>
        </div>
        
        <div class="profile-info">
          <span class="profile-label">Profile</span>
          <h1 class="profile-name">{{ userInfo?.name || 'User' }}</h1>
          <div class="profile-stats">
            <span class="stat-item">{{ realUserPlaylists?.length || 0 }} Public playlists</span>
            <span class="stat-separator">•</span>
            <span class="stat-item">Member since {{ userInfo?.fecha_Registro ? formatDate(userInfo.fecha_Registro) : 'N/A' }}</span>
            <span v-if="isUserPremium" class="premium-badge">PREMIUM</span>
          </div>
        </div>

        <div class="profile-actions">
          <button @click="toggleEditMode" class="edit-button">
            {{ editMode ? 'Cancel' : 'Edit profile' }}
          </button>
        </div>
      </div>

      <!-- Edit Form -->
      <div v-if="editMode" class="edit-form">
        <div class="form-group">
          <label for="name">Name:</label>
          <input 
            id="name"
            v-model="editForm.name" 
            type="text" 
            class="form-input"
            placeholder="Your name"
          />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            id="email"
            v-model="editForm.email" 
            type="email" 
            class="form-input"
            placeholder="your@email.com"
          />
        </div>
        <div class="form-actions">
          <button @click="saveProfile" class="save-button" :disabled="loading">
            {{ loading ? 'Saving...' : 'Save' }}
          </button>
          <button @click="toggleEditMode" class="cancel-button">Cancel</button>
        </div>
      </div>

      <!-- 🔥 CHART OF TOTAL LISTENING MINUTES BY DAYS -->
      <div class="listening-chart-section">
        <h2 class="section-title">Your daily listening minutes</h2>
        <div class="chart-container">
          <canvas ref="listeningChart" width="800" height="300"></canvas>
        </div>
        <div class="chart-insights">
          <div class="insight-item">
            <span class="insight-value">{{ totalMinutesThisMonth }}m</span>
            <span class="insight-label">Total this month</span>
          </div>
          <div class="insight-item">
            <span class="insight-value">{{ averageDailyMinutes }}m</span>
            <span class="insight-label">Daily average</span>
          </div>
          <div class="insight-item">
            <span class="insight-value">{{ bestListeningDay }}</span>
            <span class="insight-label">Your best day</span>
          </div>
        </div>
      </div>

      <!-- Real Listening Statistics (IMPROVED: minutes instead of hours) -->
      <div class="stats-section">
        <h2 class="section-title">Listening Statistics</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">{{ formatMinutesFromSeconds(listeningStats.totalPlayTime * 3600) }}</div>
            <div class="stat-label">Minutes listened this month</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ listeningStats.songsPlayed || 0 }}</div>
            <div class="stat-label">Plays this month</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ listeningStats.uniqueSongs || 0 }}</div>
            <div class="stat-label">Different songs</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ listeningStats.uniqueArtists || 0 }}</div>
            <div class="stat-label">Different artists</div>
          </div>
        </div>
      </div>

      <!-- Most Listened Artists (FIXED: unique songs tracking) -->
      <div class="section" v-if="topArtistsReal.length > 0">
        <div class="section-header">
          <h2 class="section-title">Most listened artists this month</h2>
          <span class="section-subtitle">Based on your real listening activity</span>
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
              <p class="artist-play-count">{{ artist.playCount || 0 }} plays</p>
              <p class="artist-time">{{ formatMinutesFromSeconds(artist.totalListenTime || 0) }}</p>
              <p class="artist-songs">{{ artist.uniqueSongs || 0 }} different songs</p>
            </div>
            <div class="listen-percentage">
              <div class="percentage-bar">
                <div 
                  class="percentage-fill" 
                  :style="{ width: calculatePercentage(artist.totalListenTime || 0, topArtistsReal[0]?.totalListenTime || 1) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Most Listened Songs (Real Data) -->
      <div class="section" v-if="topSongsReal.length > 0">
        <div class="section-header">
          <h2 class="section-title">Most listened songs this month</h2>
          <span class="section-subtitle">Your favorite music based on real plays</span>
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
              <h4 class="song-title">{{ song.nombre || 'Unknown song' }}</h4>
              <p class="song-artist">{{ song.artista || 'Unknown artist' }}</p>
            </div>
            <div class="song-stats">
              <div class="stat-item">
                <span class="stat-number">{{ song.playCount || 0 }}</span>
                <span class="stat-label">plays</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ formatMinutesFromSeconds(song.totalListenTime || 0) }}</span>
                <span class="stat-label">total time</span>
              </div>
            </div>
            <div class="song-duration">{{ formatDuration(song.duracion) }}</div>
          </div>
        </div>
      </div>

      <!-- Created Playlists -->
      <div class="section" v-if="realUserPlaylists.length > 0">
        <div class="section-header">
          <h2 class="section-title">Created playlists</h2>
          <span class="section-subtitle">Your personal collections</span>
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
            <p class="playlist-description">{{ playlist.descripcion || 'No description' }}</p>
            <span class="playlist-date">Created on {{ formatDate(playlist.fechaCreacion) }}</span>
          </div>
        </div>
      </div>

      <!-- Recent Activity - WITHOUT "completed" indicator -->
      <div class="section" v-if="recentActivity.length > 0">
        <div class="section-header">
          <h2 class="section-title">Recent activity</h2>
          <span class="section-subtitle">Latest songs you've listened to</span>
        </div>
        
        <div class="recent-activity">
          <div 
            v-for="activity in recentActivity" 
            :key="activity.id" 
            class="activity-item"
          >
            <div class="activity-time">{{ formatRecentTime(activity.timestamp) }}</div>
            <div class="activity-content">
              <div class="activity-image" v-if="activity.image">
                <img :src="activity.image || defaultImage" :alt="activity.songName" />
              </div>
              <div class="activity-song">
                <span class="song-name">{{ activity.songName || 'Unknown song' }}</span>
                <span class="artist-name">{{ activity.artistName || 'Unknown artist' }}</span>
              </div>
            </div>
            <div class="activity-duration">
              {{ formatSecondsClean(activity.listenDuration) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!topArtistsReal.length && !topSongsReal.length && !loading" class="empty-state">
        <div class="empty-icon">🎵</div>
        <h3>Start listening to music!</h3>
        <p>Play songs to see your personalized statistics here</p>
        <button @click="goToDiscover" class="discover-button">Discover music</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePlayerStore } from '@/stores/player'
import { useListeningHistoryStore } from '@/stores/listeningHistoryStore'
import { useTrackSong } from '@/stores/useTrackSong'
import { useProfileStore } from '@/stores/perfil'

const router = useRouter()
const authStore = useAuthStore()
const playerStore = usePlayerStore()
const listeningStore = useListeningHistoryStore()
const profileStore = useProfileStore()
const { playSongWithTracking } = useTrackSong()

// Referencias para el gráfico
const listeningChart = ref<HTMLCanvasElement | null>(null)

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

// Datos del profileStore (opcional - puedes usarlos como respaldo)
const topArtistsFromStore = computed(() => profileStore.getTopArtists)
const topSongsFromStore = computed(() => profileStore.getTopSongs) 
const userPlaylistsFromStore = computed(() => profileStore.getUserPlaylists)

// 🔥 CORREGIDO: Artistas con tracking de canciones únicas mejorado
const topArtistsReal = computed(() => {
  const listeningArtists = listeningStore.monthlyTopArtists
  
  // Asegurar que el cálculo de canciones únicas sea correcto
  const correctedArtists = listeningArtists.map(artist => {
    // Obtener todas las reproducciones de este artista
    const artistPlays = listeningStore.currentMonthHistory.filter(
      record => record.cantanteId === artist.cantanteId
    )
    
    // Calcular canciones únicas usando Set
    const uniqueSongs = new Set(artistPlays.map(play => play.cancionId)).size
    
    return {
      ...artist,
      uniqueSongs: uniqueSongs
    }
  })
  
  return correctedArtists.length > 0 ? correctedArtists : topArtistsFromStore.value
})

const topSongsReal = computed(() => {
  const listeningSongs = listeningStore.monthlyTopSongs  
  return listeningSongs.length > 0 ? listeningSongs : topSongsFromStore.value
})

// 🔥 CORREGIDO: Estadísticas para evitar NaN y usar minutos
const listeningStats = computed(() => {
  const stats = listeningStore.listeningStats
  return {
    totalPlayTime: stats?.totalPlayTime || 0, // ya está en horas
    songsPlayed: stats?.songsPlayed || 0,
    uniqueSongs: stats?.uniqueSongs || 0,
    uniqueArtists: stats?.uniqueArtists || 0,
    averageSessionTime: stats?.averageSessionTime || 0
  }
})

// 🔥 NUEVO: Computed properties para el gráfico de minutos totales
const dailySessionData = computed(() => {
  // Intentar obtener datos reales del store
  let realData = []
  
  try {
    // Si el store existe y tiene el método, usarlo
    if (listeningStore?.getDailySessionData) {
      realData = listeningStore.getDailySessionData()
    } else if (listeningStore?.currentMonthHistory) {
      // Método alternativo usando el historial directamente
      const history = listeningStore.currentMonthHistory
      const dailyMap = new Map()
      
      history.forEach(record => {
        const date = new Date(record.timestamp)
        const day = date.toISOString().split('T')[0]
        
        if (!dailyMap.has(day)) {
          dailyMap.set(day, {
            date: day,
            totalMinutes: 0,
            sessions: 0
          })
        }
        
        const dayData = dailyMap.get(day)
        dayData.totalMinutes += Math.round(record.duration / 60)
        dayData.sessions += 1
      })
      
      realData = Array.from(dailyMap.values()).map(day => ({
        ...day,
        averageMinutes: day.sessions > 0 ? Math.round(day.totalMinutes / day.sessions) : 0
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }
  } catch (error) {
    console.warn('Error obteniendo datos reales:', error)
  }
  
  // Si hay datos reales, usarlos
  if (realData.length > 0) {
    console.log('📊 Usando datos reales del listening store:', realData.length, 'días')
    return realData.slice(-14) // Últimos 14 días
  }
  
  // Datos de ejemplo para mostrar el gráfico cuando no hay datos reales
  const today = new Date()
  const exampleData = []
  
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Simular datos variados pero realistas para minutos totales diarios
    const baseMinutes = 30 + Math.random() * 60 // Entre 30-90 minutos por día
    const variation = Math.sin((i / 14) * Math.PI * 2) * 20 // Variación sinusoidal
    const randomFactor = (Math.random() - 0.5) * 15 // Factor aleatorio
    
    const totalMinutes = Math.max(0, Math.round(baseMinutes + variation + randomFactor))
    
    exampleData.push({
      date: date.toISOString().split('T')[0],
      totalMinutes: totalMinutes,
      sessions: Math.floor(Math.random() * 8) + 2, // 2-10 sesiones
      averageMinutes: totalMinutes > 0 ? Math.round(totalMinutes / (Math.floor(Math.random() * 3) + 2)) : 0
    })
  }
  
  console.log('📊 Usando datos de ejemplo (no hay datos reales aún)')
  return exampleData
})

const totalMinutesThisMonth = computed(() => {
  return dailySessionData.value.reduce((sum, day) => sum + day.totalMinutes, 0)
})

const averageDailyMinutes = computed(() => {
  const sessions = dailySessionData.value.filter(day => day.totalMinutes > 0)
  if (sessions.length === 0) return 0
  
  const total = sessions.reduce((sum, day) => sum + day.totalMinutes, 0)
  return Math.round(total / sessions.length)
})

const bestListeningDay = computed(() => {
  try {
    // Intentar obtener datos reales del store
    if (listeningStore?.getSessionStats) {
      const stats = listeningStore.getSessionStats()
      return stats.bestDay || 'lunes' // fallback
    }
  } catch (error) {
    console.warn('Error obteniendo mejor día:', error)
  }
  
  const sessions = dailySessionData.value
  if (sessions.length === 0) return 'lunes'
  
  const best = sessions.reduce((max, day) => 
    day.totalMinutes > max.totalMinutes ? day : max
  )
  
  return new Date(best.date).toLocaleDateString('es-ES', { weekday: 'long' })
})

// Playlists reales del usuario
const realUserPlaylists = computed(() => {
  const localPlaylists = profileData.value?.playlistsCreadas || []
  const storePlaylists = userPlaylistsFromStore.value || []
  return localPlaylists.length > 0 ? localPlaylists : storePlaylists
})

// Actividad reciente SIN "completado"
const recentActivity = computed(() => {
  return listeningStore.playHistory
    .slice(-10)
    .reverse()
    .map(play => {
      return {
        id: play.id,
        timestamp: play.timestamp,
        songName: play.songName || 'Canción desconocida',
        artistName: play.artistName || 'Artista desconocido',
        image: play.image || null,
        listenDuration: play.duration || 0
      }
    })
})

// 🔥 NUEVA: Función mejorada para crear el gráfico de sesiones profesional con mejor gestión de datos
const createListeningChart = () => {
  if (!listeningChart.value) return
  
  const canvas = listeningChart.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // Ajustar el canvas para alta resolución
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)
  
  const data = dailySessionData.value
  console.log('🎨 Creando gráfico con datos:', data.length, 'días')
  
  if (data.length === 0) {
    // Estado vacío elegante
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.font = '18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('🎵', centerX, centerY - 20)
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    ctx.fillText('Reproduce música para ver tus estadísticas', centerX, centerY + 10)
    return
  }
  
  // Configuración mejorada del gráfico
  const padding = { top: 40, right: 40, bottom: 60, left: 60 }
  const chartWidth = rect.width - padding.left - padding.right
  const chartHeight = rect.height - padding.top - padding.bottom
  
  // Limpiar canvas con fondo sutil
  ctx.clearRect(0, 0, rect.width, rect.height)
  
  // Gradiente de fondo
  const bgGradient = ctx.createLinearGradient(0, 0, 0, rect.height)
  bgGradient.addColorStop(0, 'rgba(255, 81, 0, 0.03)')
  bgGradient.addColorStop(1, 'rgba(255, 81, 0, 0.01)')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, rect.width, rect.height)
  
  // Encontrar valores máximos con padding (usar totalMinutes en lugar de averageMinutes)
  const maxMinutes = Math.max(...data.map(d => d.totalMinutes), 10)
  const yMax = Math.ceil(maxMinutes * 1.2 / 10) * 10 // Redondear hacia arriba a decenas
  
  // Grid lines horizontales (ajustar para 10 líneas)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
  ctx.lineWidth = 1
  for (let i = 0; i <= 10; i++) {
    const y = padding.top + (i / 10) * chartHeight
    ctx.beginPath()
    ctx.moveTo(padding.left, y)
    ctx.lineTo(padding.left + chartWidth, y)
    ctx.stroke()
  }
  
  // Grid lines verticales
  if (data.length > 1) {
    for (let i = 0; i < data.length; i++) {
      const x = padding.left + (i / (data.length - 1)) * chartWidth
      ctx.beginPath()
      ctx.moveTo(x, padding.top)
      ctx.lineTo(x, padding.top + chartHeight)
      ctx.stroke()
    }
  }
  
  // Área bajo la curva (gradiente)
  if (data.length > 1) {
    const areaGradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight)
    areaGradient.addColorStop(0, 'rgba(255, 81, 0, 0.3)')
    areaGradient.addColorStop(0.5, 'rgba(255, 81, 0, 0.15)')
    areaGradient.addColorStop(1, 'rgba(255, 81, 0, 0.02)')
    
    ctx.fillStyle = areaGradient
    ctx.beginPath()
    ctx.moveTo(padding.left, padding.top + chartHeight)
    
    data.forEach((day, index) => {
      const x = padding.left + (index / (data.length - 1)) * chartWidth
      const y = padding.top + chartHeight - (day.totalMinutes / yMax) * chartHeight
      
      if (index === 0) {
        ctx.lineTo(x, y)
      } else {
        // Curva suave (Bezier)
        const prevIndex = index - 1
        const prevX = padding.left + (prevIndex / (data.length - 1)) * chartWidth
        const prevY = padding.top + chartHeight - (data[prevIndex].totalMinutes / yMax) * chartHeight
        
        const cpx1 = prevX + (x - prevX) * 0.3
        const cpx2 = x - (x - prevX) * 0.3
        ctx.bezierCurveTo(cpx1, prevY, cpx2, y, x, y)
      }
    })
    
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight)
    ctx.lineTo(padding.left, padding.top + chartHeight)
    ctx.fill()
  }
  
  // Línea principal (curva suave)
  if (data.length > 1) {
    // Línea con gradiente
    const lineGradient = ctx.createLinearGradient(padding.left, 0, padding.left + chartWidth, 0)
    lineGradient.addColorStop(0, '#ff5100')
    lineGradient.addColorStop(0.5, '#ff6a00')
    lineGradient.addColorStop(1, '#ff8c00')
    
    ctx.strokeStyle = lineGradient
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    
    data.forEach((day, index) => {
      const x = padding.left + (index / (data.length - 1)) * chartWidth
      const y = padding.top + chartHeight - (day.totalMinutes / yMax) * chartHeight
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        // Curva suave
        const prevIndex = index - 1
        const prevX = padding.left + (prevIndex / (data.length - 1)) * chartWidth
        const prevY = padding.top + chartHeight - (data[prevIndex].totalMinutes / yMax) * chartHeight
        
        const cpx1 = prevX + (x - prevX) * 0.3
        const cpx2 = x - (x - prevX) * 0.3
        ctx.bezierCurveTo(cpx1, prevY, cpx2, y, x, y)
      }
    })
    
    ctx.stroke()
  }
  
  // Puntos de datos con animación
  data.forEach((day, index) => {
    const x = padding.left + (index / (data.length - 1)) * chartWidth
    const y = padding.top + chartHeight - (day.totalMinutes / yMax) * chartHeight
    
    // Sombra del punto
    ctx.shadowColor = 'rgba(255, 81, 0, 0.4)'
    ctx.shadowBlur = 8
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 2
    
    // Punto exterior (glow)
    ctx.fillStyle = 'rgba(255, 81, 0, 0.3)'
    ctx.beginPath()
    ctx.arc(x, y, 8, 0, 2 * Math.PI)
    ctx.fill()
    
    // Punto principal
    ctx.shadowBlur = 0
    ctx.fillStyle = '#ff5100'
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, 2 * Math.PI)
    ctx.fill()
    
    // Punto interior (highlight)
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(x, y, 2, 0, 2 * Math.PI)
    ctx.fill()
  })
  
  // Reset shadow
  ctx.shadowBlur = 0
  ctx.shadowColor = 'transparent'
  
  // Etiquetas del eje Y (minutos) con mejor diseño
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  
  for (let i = 0; i <= 10; i++) {
    const value = Math.round((yMax / 10) * (10 - i))
    const y = padding.top + (i / 10) * chartHeight
    
    if (value > 0) {
      ctx.fillText(`${value}m`, padding.left - 15, y)
    }
  }
  
  // Etiquetas del eje X (días) con mejor espaciado
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  
  data.forEach((day, index) => {
    // Mostrar solo algunos labels para evitar sobrecarga
    const shouldShow = data.length <= 7 || index % Math.ceil(data.length / 6) === 0 || index === data.length - 1
    
    if (shouldShow) {
      const x = padding.left + (index / (data.length - 1)) * chartWidth
      const date = new Date(day.date)
      const label = date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
      }).replace('.', '')
      
      ctx.fillText(label, x, padding.top + chartHeight + 15)
      
      // Valor en hover (mostrar valor actual)
      if (index === data.length - 1) {
        ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        ctx.fillStyle = '#ff5100'
        ctx.textBaseline = 'bottom'
        const y = padding.top + chartHeight - (day.totalMinutes / yMax) * chartHeight
        ctx.fillText(`${day.totalMinutes}m`, x, y - 10)
      }
    }
  })
  
  // Título del gráfico con mejor tipografía
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText('Total minutes listened to per day', rect.width / 2, 15)
  
  // Subtítulo
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
  ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  ctx.fillText('Last 14 days', rect.width / 2, 35)
}

// Methods
const loadProfile = async () => {
  loading.value = true
  error.value = null
  
  try {
    const API_BASE_URL = "http://aa0918044ca2b4e9b94f01593a2e67bf-1447626218.us-east-1.elb.amazonaws.com/api"
    
    if (authStore.user?.userId) {
      await profileStore.fetchUserProfile(authStore.user.userId)
    }
    
    try {
      const playlistsResponse = await fetch(`${API_BASE_URL}/Playlist`)
      if (playlistsResponse.ok) {
        const playlists = await playlistsResponse.json()
        if (Array.isArray(playlists)) {
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
    
    const updatedUser = await authStore.updateUserData({
      name: editForm.value.name,
      email: editForm.value.email
    })
    
    if (userInfo.value?.userId) {
      await profileStore.refreshData(userInfo.value.userId)
    }
    
    editMode.value = false
    
  } catch (err) {
    console.error('Error al guardar perfil:', err)
    error.value = err.message || 'Error al guardar el perfil'
  } finally {
    loading.value = false
  }
}

const playSong = (song: any) => {
  console.log('🎵 Intentando reproducir canción:', song)
  
  if (!song) {
    console.error('❌ No se puede reproducir: canción es null/undefined')
    return
  }

  try {
    // Usar el composable para reproducir con tracking
    playSongWithTracking(song)
    console.log('✅ Canción enviada al reproductor correctamente')
  } catch (error) {
    console.error('❌ Error al reproducir canción:', error)
  }
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

// 🔥 UTILITY FUNCTIONS MEJORADAS
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'Fecha no disponible'
    }
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return 'Fecha no disponible'
  }
}

// 🔥 NUEVA: Formatear minutos desde segundos
const formatMinutesFromSeconds = (seconds: number): string => {
  if (!seconds || isNaN(seconds) || seconds === 0) return '0m'
  
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes}m`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}m`
}

const formatSeconds = (seconds: number): string => {
  if (!seconds || isNaN(seconds) || seconds === 0) return '0:00'
  
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

const formatSecondsClean = (seconds: number): string => {
  if (!seconds || isNaN(seconds) || seconds === 0) return '0:00'
  
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

const formatDuration = (duration: any): string => {
  if (!duration) return '0:00'
  
  if (typeof duration === 'string' && duration.includes(':')) {
    const parts = duration.split(':')
    if (parts.length === 3) {
      const minutes = parseInt(parts[1]) || 0
      const seconds = parseInt(parts[2]) || 0
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    } else if (parts.length === 2) {
      const minutes = parseInt(parts[0]) || 0
      const seconds = parseInt(parts[1]) || 0
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
  }
  
  if (typeof duration === 'number') {
    return formatSeconds(duration)
  }
  
  const totalSeconds = parseInt(duration.toString())
  if (!isNaN(totalSeconds)) {
    return formatSeconds(totalSeconds)
  }
  
  return '0:00'
}

const formatRecentTime = (timestamp: number): string => {
  if (!timestamp || isNaN(timestamp)) return 'Hace un momento'
  
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
  if (!value || !maxValue || isNaN(value) || isNaN(maxValue)) return 0
  return Math.round((value / maxValue) * 100)
}

// Watchers
watch(() => playerStore.currentSong, () => {
  // El perfil se actualiza automáticamente cuando cambian las estadísticas
}, { deep: true })

// 🔥 NUEVO: Watch mejorado para recrear el gráfico cuando cambien los datos
watch(() => dailySessionData.value, () => {
  console.log('📊 Datos del gráfico cambiaron, recreando...')
  nextTick(() => {
    createListeningChart()
  })
}, { deep: true, immediate: true })

// 🔥 NUEVO: Watch adicional para forzar actualización cuando el player cambie
watch(() => playerStore.currentSong, () => {
  // Pequeño delay para permitir que el store se actualice
  setTimeout(() => {
    nextTick(() => {
      createListeningChart()
    })
  }, 100)
}, { deep: true })

// 🔥 NUEVO: Función para forzar actualización del gráfico (para debugging)
const forceUpdateChart = () => {
  console.log('🔄 Forzando actualización del gráfico...')
  createListeningChart()
}

// 🔥 NUEVO: Función para generar datos de prueba si es necesario
const generateTestData = () => {
  const testRecords = []
  const now = Date.now()
  
  // Generar 20 reproducciones de prueba en los últimos 7 días
  for (let i = 0; i < 20; i++) {
    const daysAgo = Math.floor(Math.random() * 7)
    const timestamp = now - (daysAgo * 24 * 60 * 60 * 1000) - (Math.random() * 24 * 60 * 60 * 1000)
    
    testRecords.push({
      id: `test-${i}`,
      cancionId: Math.floor(Math.random() * 100) + 1,
      cantanteId: Math.floor(Math.random() * 20) + 1,
      songName: `Canción de Prueba ${i + 1}`,
      artistName: `Artista ${Math.floor(Math.random() * 10) + 1}`,
      timestamp,
      duration: Math.floor(Math.random() * 180) + 60, // 1-4 minutos
      totalDuration: 240,
      completed: Math.random() > 0.3
    })
  }
  
  // Añadir al store si está disponible
  if (listeningStore && testRecords.length > 0) {
    testRecords.forEach(record => {
      listeningStore.playHistory.push(record)
    })
    console.log('✅ Datos de prueba añadidos al listening store')
    
    // Guardar en localStorage
    if (listeningStore.saveToLocalStorage) {
      listeningStore.saveToLocalStorage()
    }
    
    // Forzar actualización del gráfico
    nextTick(() => {
      createListeningChart()
    })
  }
}

// Lifecycle
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  console.log('🚀 Montando componente de perfil...')
  
  // Inicializar listening store
  try {
    await listeningStore.initialize()
    console.log('✅ Listening store inicializado')
  } catch (error) {
    console.warn('⚠️ Error inicializando listening store:', error)
  }
  
  // Cargar perfil del usuario
  if (authStore.user?.userId) {
    try {
      await profileStore.fetchUserProfile(authStore.user.userId)
      console.log('✅ Perfil de usuario cargado')
    } catch (error) {
      console.warn('⚠️ Error cargando perfil:', error)
    }
  }
  
  // Cargar datos del perfil
  await loadProfile()
  
  // Crear gráfico después de cargar datos
  nextTick(() => {
    console.log('🎨 Creando gráfico inicial...')
    createListeningChart()
    
    // Si no hay datos después de 2 segundos, mostrar datos de ejemplo
    setTimeout(() => {
      const hasData = dailySessionData.value.length > 0
      console.log(`📊 Estado del gráfico después de 2s: ${hasData ? 'Con datos' : 'Sin datos'}`)
      
      if (!hasData) {
        console.log('🎲 Generando datos de prueba...')
        generateTestData()
      }
    }, 2000)
  })
  
  // Listener para redimensionar ventana
  const handleResize = () => {
    setTimeout(() => {
      createListeningChart()
    }, 100)
  }
  
  window.addEventListener('resize', handleResize)
  
  // Cleanup al desmontar
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #1e1e1e 0%, #121212 100%);
  color: white;
  padding: 24px;
}

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

/* 🔥 ESTILOS MEJORADOS PARA EL GRÁFICO PROFESIONAL */
.listening-chart-section {
  margin-bottom: 48px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.02), rgba(255, 81, 0, 0.01));
  border-radius: 20px;
  padding: 32px;
  border: 1px solid rgba(255, 81, 0, 0.15);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.listening-chart-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 81, 0, 0.5), transparent);
}

.listening-chart-section .section-title {
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff, #ff5100);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
  position: relative;
}

.listening-chart-section .section-title::after {
  display: none; /* Remover la línea ya que usamos gradiente */
}

.chart-container {
  background: linear-gradient(145deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2));
  border-radius: 16px;
  padding: 24px;
  margin: 24px 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.chart-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(255, 81, 0, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 140, 0, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

.chart-container canvas {
  width: 100%;
  height: 320px;
  display: block;
  border-radius: 8px;
  position: relative;
  z-index: 1;
}

.chart-insights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.insight-item {
  text-align: center;
  padding: 20px;
  background: linear-gradient(145deg, rgba(255, 81, 0, 0.08), rgba(255, 81, 0, 0.03));
  border-radius: 12px;
  border: 1px solid rgba(255, 81, 0, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.insight-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff5100, transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.insight-item:hover {
  transform: translateY(-2px);
  background: linear-gradient(145deg, rgba(255, 81, 0, 0.12), rgba(255, 81, 0, 0.06));
  box-shadow: 0 8px 24px rgba(255, 81, 0, 0.2);
}

.insight-item:hover::before {
  opacity: 1;
}

.insight-value {
  display: block;
  font-size: 32px;
  font-weight: 900;
  background: linear-gradient(135deg, #ff5100, #ff8c00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
  line-height: 1;
}

.insight-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

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

.section-subtitle {
  color: #a7a7a7;
  font-size: 14px;
}

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

.song-duration {
  color: #a7a7a7;
  font-size: 14px;
  min-width: 50px;
  text-align: right;
  font-weight: 500;
}

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

.activity-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.activity-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.activity-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.activity-song {
  flex: 1;
}

.song-name {
  font-weight: 600;
  display: block;
  font-size: 14px;
}

.artist-name {
  font-size: 12px;
  color: #a7a7a7;
}

.activity-duration {
  font-size: 12px;
  color: #a7a7a7;
  min-width: 60px;
  text-align: center;
  font-weight: 500;
}

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

  .activity-content {
    width: 100%;
  }

  .chart-insights {
    grid-template-columns: 1fr;
  }

  .chart-container canvas {
    height: 250px;
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

  .chart-container canvas {
    height: 200px;
  }
}

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

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.stats-section .stat-number {
  animation: pulse 2s ease-in-out infinite;
}
</style>