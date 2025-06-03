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
    lastSaveTime: Date.now()
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

    // Top artistas del mes
    monthlyTopArtists(): ArtistStats[] {
      const artistMap = new Map<number, ArtistStats>()
      
      this.currentMonthHistory.forEach(record => {
        if (!record.cantanteId) return
        
        const existing = artistMap.get(record.cantanteId)
        if (existing) {
          existing.playCount++
          existing.totalListenTime += record.duration
          existing.lastPlayed = Math.max(existing.lastPlayed, record.timestamp)
          // Track unique songs
          const songs = new Set([...Array(existing.uniqueSongs)])
          songs.add(record.cancionId)
          existing.uniqueSongs = songs.size
        } else {
          artistMap.set(record.cantanteId, {
            cantanteId: record.cantanteId,
            nombre: record.artistName || 'Artista desconocido',
            image: record.image,
            playCount: 1,
            totalListenTime: record.duration,
            uniqueSongs: 1,
            lastPlayed: record.timestamp
          })
        }
      })
      
      return Array.from(artistMap.values())
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

    // Estadísticas de escucha
    listeningStats(): ListeningStats {
      const history = this.currentMonthHistory
      
      const totalPlayTime = Math.round(
        history.reduce((sum, record) => sum + record.duration, 0) / 3600
      )
      
      const uniqueSongs = new Set(history.map(r => r.cancionId)).size
      const uniqueArtists = new Set(history.map(r => r.cantanteId)).size
      
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
      // No inicializar setupPlayerTracking aquí para evitar referencias circulares
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
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    },

    groupBySessions(records: PlayRecord[]) {
      const sessions: any[] = []
      let currentSession: any = null
      
      records.sort((a, b) => a.timestamp - b.timestamp).forEach(record => {
        if (!currentSession || 
            record.timestamp - currentSession.endTime > 30 * 60 * 1000) { // 30 min gap
          currentSession = {
            startTime: record.timestamp,
            endTime: record.timestamp + record.duration * 1000,
            duration: record.duration
          }
          sessions.push(currentSession)
        } else {
          currentSession.endTime = record.timestamp + record.duration * 1000
          currentSession.duration += record.duration
        }
      })
      
      return sessions
    },

    // Local Storage
    saveToLocalStorage() {
      try {
        // Mantener solo los últimos 1000 registros
        const recentHistory = this.playHistory.slice(-1000)
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
        }
      } catch (e) {
        console.error('Error loading listening history:', e)
        this.playHistory = []
      }
    },

    // Limpiar historial antiguo (más de 3 meses)
    cleanOldHistory() {
      const threeMonthsAgo = Date.now() - (90 * 24 * 60 * 60 * 1000)
      this.playHistory = this.playHistory.filter(record => 
        record.timestamp > threeMonthsAgo
      )
      this.saveToLocalStorage()
    }
  },

  // Datos temporales para la canción actual
  currentSongInfo: null as any
})