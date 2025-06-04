// src/stores/listeningHistoryStore.ts
import { defineStore } from 'pinia'

interface PlayRecord {
  id: string
  cancionId: number
  cantanteId: number
  albumId?: number
  songName: string
  artistName: string
  image?: string
  timestamp: number
  duration: number
  totalDuration: number
  completed: boolean
}

interface ArtistStats {
  cantanteId: number
  nombre: string
  image?: string
  playCount: number
  totalListenTime: number
  uniqueSongs: number
  lastPlayed: number
}

interface SongStats {
  cancionId: number
  nombre: string
  artista: string
  image?: string
  duracion: string
  cantanteId: number
  albumId?: number
  playCount: number
  totalListenTime: number
  completionRate: number
  lastPlayed: number
}

interface ListeningStats {
  totalPlayTime: number
  songsPlayed: number
  uniqueSongs: number
  uniqueArtists: number
  averageSessionTime: number
}

export const useListeningHistoryStore = defineStore('listeningHistory', {
  state: () => ({
    playHistory: [] as PlayRecord[],
    monthlyData: {
      startDate: new Date().setDate(1),
      endDate: new Date()
    },
    isTracking: false,
    currentTrackStart: null as number | null,
    lastSaveTime: Date.now(),
    currentSongInfo: null as any
  }),

  getters: {
    // Obtener historial del mes actual
    currentMonthHistory: (state): PlayRecord[] => {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
      
      return state.playHistory.filter(record => 
        record.timestamp >= startOfMonth
      )
    },

    // 🔥 CORREGIDO: Top artistas del mes con tracking mejorado de canciones únicas
    monthlyTopArtists(): ArtistStats[] {
      const artistMap = new Map<number, { 
        stats: ArtistStats, 
        uniqueSongIds: Set<number> 
      }>()
      
      this.currentMonthHistory.forEach(record => {
        if (!record.cantanteId) return
        
        const existing = artistMap.get(record.cantanteId)
        if (existing) {
          existing.stats.playCount++
          existing.stats.totalListenTime += record.duration
          existing.stats.lastPlayed = Math.max(existing.stats.lastPlayed, record.timestamp)
          // 🔥 CORREGIDO: Usar Set para trackear canciones únicas correctamente
          existing.uniqueSongIds.add(record.cancionId)
          existing.stats.uniqueSongs = existing.uniqueSongIds.size
        } else {
          const uniqueSongIds = new Set<number>()
          uniqueSongIds.add(record.cancionId)
          
          artistMap.set(record.cantanteId, {
            stats: {
              cantanteId: record.cantanteId,
              nombre: record.artistName || 'Artista desconocido',
              image: record.image,
              playCount: 1,
              totalListenTime: record.duration,
              uniqueSongs: 1,
              lastPlayed: record.timestamp
            },
            uniqueSongIds
          })
        }
      })
      
      return Array.from(artistMap.values())
        .map(({ stats }) => stats)
        .sort((a, b) => b.totalListenTime - a.totalListenTime)
        .slice(0, 10)
    },

    // Top canciones del mes
    monthlyTopSongs(): SongStats[] {
      const songMap = new Map<number, SongStats>()
      
      this.currentMonthHistory.forEach(record => {
        if (!record.cancionId) return
        
        const existing = songMap.get(record.cancionId)
        if (existing) {
          existing.playCount++
          existing.totalListenTime += record.duration
          existing.lastPlayed = Math.max(existing.lastPlayed, record.timestamp)
          
          // Actualizar completion rate
          const completions = this.currentMonthHistory.filter(r => 
            r.cancionId === record.cancionId && r.completed
          ).length
          existing.completionRate = (completions / existing.playCount) * 100
        } else {
          songMap.set(record.cancionId, {
            cancionId: record.cancionId,
            nombre: record.songName || 'Canción desconocida',
            artista: record.artistName || 'Artista desconocido',
            image: record.image,
            duracion: this.formatDuration(record.totalDuration),
            cantanteId: record.cantanteId,
            albumId: record.albumId,
            playCount: 1,
            totalListenTime: record.duration,
            completionRate: record.completed ? 100 : 0,
            lastPlayed: record.timestamp
          })
        }
      })
      
      return Array.from(songMap.values())
        .sort((a, b) => b.playCount - a.playCount)
        .slice(0, 20)
    },

    // 🔥 CORREGIDO: Estadísticas de escucha con cálculos precisos
    listeningStats(): ListeningStats {
      const history = this.currentMonthHistory
      
      // Total de tiempo en horas (convertido desde segundos)
      const totalPlayTime = Math.round(
        history.reduce((sum, record) => sum + record.duration, 0) / 3600
      ) || 0
      
      // Canciones y artistas únicos usando Set
      const uniqueSongs = new Set(history.map(r => r.cancionId)).size
      const uniqueArtists = new Set(history.map(r => r.cantanteId).filter(id => id > 0)).size
      
      // Calcular tiempo promedio de sesión
      const sessions = this.groupBySessions(history)
      const avgSessionTime = sessions.length > 0
        ? Math.round(
            sessions.reduce((sum, session) => sum + session.duration, 0) / 
            sessions.length / 60
          )
        : 0
      
      return {
        totalPlayTime,
        songsPlayed: history.length,
        uniqueSongs,
        uniqueArtists,
        averageSessionTime: avgSessionTime
      }
    }
  },

  actions: {
    // Inicializar el store
    async initialize() {
      this.loadFromLocalStorage()
      this.cleanOldHistory()
    },

    // Empezar a trackear una canción (llamado desde el player)
    startTrackingSong(song: any) {
      if (!song || !song.cancionId) return
      
      // Si ya estamos trackeando, finalizar la anterior
      if (this.isTracking) {
        this.finishTrackingSong()
      }
      
      this.isTracking = true
      this.currentTrackStart = Date.now()
      
      // Guardar información de la canción actual para usarla después
      this.currentSongInfo = {
        cancionId: song.cancionId,
        cantanteId: song.cantanteId || 0,
        albumId: song.albumId,
        songName: song.nombre || 'Canción desconocida',
        artistName: song.artista || 'Artista desconocido',
        image: song.image,
        totalDuration: this.parseDuration(song.duracion),
        currentTime: 0
      }
    },

    // Actualizar progreso de reproducción
    updatePlayProgress(currentTime: number, totalDuration: number) {
      if (this.currentSongInfo) {
        this.currentSongInfo.currentTime = currentTime
        if (totalDuration && !this.currentSongInfo.totalDuration) {
          this.currentSongInfo.totalDuration = Math.floor(totalDuration)
        }
      }
    },

    // Finalizar tracking de la canción actual
    finishTrackingSong() {
      if (!this.isTracking || !this.currentTrackStart || !this.currentSongInfo) return
      
      const duration = this.currentSongInfo.currentTime || 
                      Math.floor((Date.now() - this.currentTrackStart) / 1000)
      const completed = duration >= (this.currentSongInfo.totalDuration * 0.8) // 80% = completada
      
      const record: PlayRecord = {
        id: `${Date.now()}-${Math.random()}`,
        cancionId: this.currentSongInfo.cancionId,
        cantanteId: this.currentSongInfo.cantanteId,
        albumId: this.currentSongInfo.albumId,
        songName: this.currentSongInfo.songName,
        artistName: this.currentSongInfo.artistName,
        image: this.currentSongInfo.image,
        timestamp: this.currentTrackStart,
        duration: Math.floor(duration),
        totalDuration: this.currentSongInfo.totalDuration,
        completed
      }
      
      this.playHistory.push(record)
      this.saveToLocalStorage()
      
      this.isTracking = false
      this.currentTrackStart = null
      this.currentSongInfo = null
    },

    // Guardar manualmente cuando se hace clic en una canción
    trackSongClick(song: any) {
      if (!song || !song.cancionId) return
      
      const record: PlayRecord = {
        id: `${Date.now()}-${Math.random()}`,
        cancionId: song.cancionId,
        cantanteId: song.cantanteId || 0,
        albumId: song.albumId,
        songName: song.nombre || 'Canción desconocida',
        artistName: song.artista || 'Artista desconocido',
        image: song.image,
        timestamp: Date.now(),
        duration: 0, // Se actualizará cuando termine
        totalDuration: this.parseDuration(song.duracion),
        completed: false
      }
      
      // Agregar inmediatamente para que aparezca en actividad reciente
      this.playHistory.push(record)
      this.saveToLocalStorage()
    },

    // 🔥 NUEVO: Método para obtener datos de sesiones por días (para el gráfico)
    getDailySessionData() {
      const history = this.currentMonthHistory
      const dailyData = new Map()
      
      // Agrupar por días
      history.forEach(record => {
        const date = new Date(record.timestamp)
        const day = date.toISOString().split('T')[0]
        
        if (!dailyData.has(day)) {
          dailyData.set(day, {
            date: day,
            totalMinutes: 0,
            sessions: 0,
            plays: []
          })
        }
        
        const dayData = dailyData.get(day)
        dayData.totalMinutes += Math.round(record.duration / 60) // convertir a minutos
        dayData.sessions += 1
        dayData.plays.push(record)
      })
      
      // Convertir a array y calcular promedio por día
      return Array.from(dailyData.values()).map(day => ({
        date: day.date,
        totalMinutes: day.totalMinutes,
        sessions: day.sessions,
        averageMinutes: day.sessions > 0 ? Math.round(day.totalMinutes / day.sessions) : 0,
        plays: day.plays
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    },

    // 🔥 NUEVO: Obtener estadísticas de sesiones mejoradas
    getSessionStats() {
      const dailyData = this.getDailySessionData()
      
      const totalSessions = dailyData.reduce((sum, day) => sum + day.sessions, 0)
      const averageSessionMinutes = dailyData.length > 0 
        ? Math.round(dailyData.reduce((sum, day) => sum + day.averageMinutes, 0) / dailyData.length)
        : 0
      
      const bestDay = dailyData.length > 0 
        ? dailyData.reduce((max, day) => day.totalMinutes > max.totalMinutes ? day : max)
        : null
      
      return {
        totalSessions,
        averageSessionMinutes,
        bestDay: bestDay ? new Date(bestDay.date).toLocaleDateString('es-ES', { weekday: 'long' }) : 'N/A',
        dailyData
      }
    },

    // Utilidades
    parseDuration(duration: string): number {
      if (!duration) return 0
      const parts = duration.split(':')
      if (parts.length >= 2) {
        return (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0)
      }
      return 0
    },

    formatDuration(seconds: number): string {
      if (!seconds || isNaN(seconds)) return '0:00'
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    },

    // 🔥 MEJORADO: Agrupamiento de sesiones más inteligente
    groupBySessions(records: PlayRecord[]) {
      if (!records.length) return []
      
      const sessions: any[] = []
      let currentSession: any = null
      const SESSION_GAP = 30 * 60 * 1000 // 30 minutos en milisegundos
      
      records
        .sort((a, b) => a.timestamp - b.timestamp)
        .forEach(record => {
          if (!currentSession || 
              record.timestamp - currentSession.endTime > SESSION_GAP) {
            // Nueva sesión
            currentSession = {
              startTime: record.timestamp,
              endTime: record.timestamp + (record.duration * 1000),
              duration: record.duration,
              songs: [record],
              totalPlays: 1
            }
            sessions.push(currentSession)
          } else {
            // Continuar sesión actual
            currentSession.endTime = record.timestamp + (record.duration * 1000)
            currentSession.duration += record.duration
            currentSession.songs.push(record)
            currentSession.totalPlays++
          }
        })
      
      return sessions
    },

    // 🔥 NUEVO: Limpiar duplicados y entradas inválidas
    cleanInvalidRecords() {
      const validRecords = this.playHistory.filter(record => 
        record.cancionId && 
        record.cantanteId && 
        record.songName && 
        record.artistName &&
        record.timestamp > 0
      )
      
      // Remover duplicados basados en timestamp y cancionId muy cercanos
      const cleanRecords: PlayRecord[] = []
      validRecords.forEach(record => {
        const isDuplicate = cleanRecords.some(existing => 
          existing.cancionId === record.cancionId &&
          Math.abs(existing.timestamp - record.timestamp) < 5000 // 5 segundos
        )
        
        if (!isDuplicate) {
          cleanRecords.push(record)
        }
      })
      
      this.playHistory = cleanRecords
      this.saveToLocalStorage()
    },

    // Local Storage
    saveToLocalStorage() {
      try {
        // Mantener solo los últimos 2000 registros para mejor rendimiento
        const recentHistory = this.playHistory.slice(-2000)
        localStorage.setItem('listeningHistory', JSON.stringify(recentHistory))
        this.lastSaveTime = Date.now()
      } catch (e) {
        console.error('Error saving listening history:', e)
      }
    },

    loadFromLocalStorage() {
      try {
        const saved = localStorage.getItem('listeningHistory')
        if (saved) {
          this.playHistory = JSON.parse(saved)
          // Limpiar registros inválidos al cargar
          this.cleanInvalidRecords()
        }
      } catch (e) {
        console.error('Error loading listening history:', e)
        this.playHistory = []
      }
    },

    // Limpiar historial antiguo (más de 3 meses)
    cleanOldHistory() {
      const threeMonthsAgo = Date.now() - (90 * 24 * 60 * 60 * 1000)
      const initialLength = this.playHistory.length
      
      this.playHistory = this.playHistory.filter(record => 
        record.timestamp > threeMonthsAgo
      )
      
      if (this.playHistory.length !== initialLength) {
        this.saveToLocalStorage()
        console.log(`Limpiados ${initialLength - this.playHistory.length} registros antiguos`)
      }
    },

    // 🔥 NUEVO: Método para debugging y estadísticas
    getDebugInfo() {
      const history = this.currentMonthHistory
      const artistStats = this.monthlyTopArtists
      const songStats = this.monthlyTopSongs
      
      return {
        totalRecords: this.playHistory.length,
        monthlyRecords: history.length,
        uniqueArtistsInHistory: new Set(history.map(r => r.cantanteId)).size,
        uniqueSongsInHistory: new Set(history.map(r => r.cancionId)).size,
        topArtistsCount: artistStats.length,
        topSongsCount: songStats.length,
        isCurrentlyTracking: this.isTracking,
        lastSaveTime: new Date(this.lastSaveTime).toLocaleString(),
        oldestRecord: this.playHistory.length > 0 
          ? new Date(Math.min(...this.playHistory.map(r => r.timestamp))).toLocaleString()
          : 'N/A',
        newestRecord: this.playHistory.length > 0 
          ? new Date(Math.max(...this.playHistory.map(r => r.timestamp))).toLocaleString()
          : 'N/A'
      }
    },

    // 🔥 NUEVO: Resetear datos (para testing)
    resetAllData() {
      this.playHistory = []
      this.isTracking = false
      this.currentTrackStart = null
      this.currentSongInfo = null
      localStorage.removeItem('listeningHistory')
      console.log('Todos los datos de listening history han sido reseteados')
    }
  }
})