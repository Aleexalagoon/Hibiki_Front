// src/stores/listeningHistoryStore.ts
import { defineStore } from 'pinia';

interface PlayRecord {
  id: string;
  cancionId: number;
  cantanteId: number;
  albumId?: number;
  timestamp: number;
  duration: number; // duración que se escuchó en segundos
  totalDuration: number; // duración total de la canción
  completed: boolean; // si se escuchó más del 80%
  sessionId: string;
}

interface SongStats {
  cancionId: number;
  nombre: string;
  artista: string;
  cantanteId: number;
  image: string;
  duracion: string;
  playCount: number;
  totalListenTime: number; // tiempo total escuchado en segundos
  lastPlayed: number;
  completionRate: number; // porcentaje promedio de completación
}

interface ArtistStats {
  cantanteId: number;
  nombre: string;
  image: string;
  oyentesMensuales: number;
  playCount: number;
  totalListenTime: number;
  uniqueSongs: number;
  lastPlayed: number;
}

const API_BASE_URL = "http://aa0918044ca2b4e9b94f01593a2e67bf-1447626218.us-east-1.elb.amazonaws.com/api";

export const useListeningHistoryStore = defineStore('listeningHistory', {
  state: () => ({
    playHistory: [] as PlayRecord[],
    topSongs: [] as SongStats[],
    topArtists: [] as ArtistStats[],
    currentSession: '',
    currentPlay: null as PlayRecord | null,
    startTime: 0,
    isTracking: false,
  }),

  getters: {
    // Top 10 canciones más escuchadas del último mes
    monthlyTopSongs: (state) => {
      const oneMonthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      return state.topSongs
        .filter(song => song.lastPlayed > oneMonthAgo)
        .sort((a, b) => {
          // Priorizar por play count, luego por tiempo total escuchado
          if (b.playCount === a.playCount) {
            return b.totalListenTime - a.totalListenTime;
          }
          return b.playCount - a.playCount;
        })
        .slice(0, 10);
    },

    // Top 6 artistas más escuchados del último mes
    monthlyTopArtists: (state) => {
      const oneMonthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      return state.topArtists
        .filter(artist => artist.lastPlayed > oneMonthAgo)
        .sort((a, b) => {
          // Priorizar por tiempo total, luego por variedad de canciones
          if (Math.abs(b.totalListenTime - a.totalListenTime) < 600) { // si la diferencia es menor a 10 min
            return b.uniqueSongs - a.uniqueSongs;
          }
          return b.totalListenTime - a.totalListenTime;
        })
        .slice(0, 6);
    },

    // Estadísticas generales
    listeningStats: (state) => {
      const oneMonthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      const monthlyPlays = state.playHistory.filter(play => play.timestamp > oneMonthAgo);
      
      const totalTime = monthlyPlays.reduce((sum, play) => sum + play.duration, 0);
      const uniqueSongs = new Set(monthlyPlays.map(play => play.cancionId)).size;
      const uniqueArtists = new Set(monthlyPlays.map(play => play.cantanteId)).size;
      
      return {
        totalPlayTime: Math.floor(totalTime / 3600), // en horas
        songsPlayed: monthlyPlays.length,
        uniqueSongs,
        uniqueArtists,
        averageSessionTime: monthlyPlays.length > 0 ? Math.floor(totalTime / monthlyPlays.length / 60) : 0 // en minutos
      };
    }
  },

  actions: {
    // Inicializar nueva sesión de escucha
    startListeningSession() {
      this.currentSession = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    // Comenzar tracking de una canción
    async startTrackingSong(song: any) {
      if (!song) return;

      this.isTracking = true;
      this.startTime = Date.now();
      
      this.currentPlay = {
        id: `play_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        cancionId: song.cancionId || song.id,
        cantanteId: song.cantanteId || song.artistId,
        albumId: song.albumId,
        timestamp: Date.now(),
        duration: 0,
        totalDuration: this.parseDurationToSeconds(song.duracion || '0:00'),
        completed: false,
        sessionId: this.currentSession
      };

      console.log('🎵 Iniciando tracking de:', song.nombre);
    },

    // Actualizar progreso de la canción actual
    updatePlayProgress(currentTime: number, totalDuration: number) {
      if (!this.currentPlay || !this.isTracking) return;

      const listenedTime = Math.floor((Date.now() - this.startTime) / 1000);
      this.currentPlay.duration = Math.min(listenedTime, totalDuration);
      this.currentPlay.totalDuration = totalDuration;
      
      // Marcar como completada si se escuchó más del 80%
      if (currentTime > 0 && totalDuration > 0) {
        const completionPercentage = currentTime / totalDuration;
        this.currentPlay.completed = completionPercentage > 0.8;
      }
    },

    // Finalizar tracking de la canción actual
    async finishTrackingSong() {
      if (!this.currentPlay || !this.isTracking) return;

      const finalDuration = Math.floor((Date.now() - this.startTime) / 1000);
      this.currentPlay.duration = finalDuration;

      // Solo registrar si se escuchó al menos 30 segundos o 25% de la canción
      const minTime = Math.min(30, this.currentPlay.totalDuration * 0.25);
      
      if (this.currentPlay.duration >= minTime) {
        this.playHistory.push({ ...this.currentPlay });
        await this.updateSongStats(this.currentPlay);
        await this.updateArtistStats(this.currentPlay);
        this.saveToLocalStorage();
        
        console.log('✅ Reproducción registrada:', {
          duration: this.currentPlay.duration,
          completed: this.currentPlay.completed
        });
      }

      this.currentPlay = null;
      this.isTracking = false;
      this.startTime = 0;
    },

    // Actualizar estadísticas de la canción
    async updateSongStats(playRecord: PlayRecord) {
      try {
        // Buscar o crear estadísticas de la canción
        let songStats = this.topSongs.find(s => s.cancionId === playRecord.cancionId);
        
        if (!songStats) {
          // Obtener información de la canción desde la API
          const songResponse = await fetch(`${API_BASE_URL}/Cancion/${playRecord.cancionId}`);
          if (!songResponse.ok) return;
          
          const songData = await songResponse.json();
          
          // Obtener información del artista
          const artistResponse = await fetch(`${API_BASE_URL}/Artista/${playRecord.cantanteId}`);
          const artistData = artistResponse.ok ? await artistResponse.json() : { nombre: 'Artista desconocido' };
          
          songStats = {
            cancionId: playRecord.cancionId,
            nombre: songData.nombre || 'Canción desconocida',
            artista: artistData.nombre || 'Artista desconocido',
            cantanteId: playRecord.cantanteId,
            image: songData.image || '',
            duracion: songData.duracion || '0:00',
            playCount: 0,
            totalListenTime: 0,
            lastPlayed: 0,
            completionRate: 0
          };
          
          this.topSongs.push(songStats);
        }

        // Actualizar estadísticas
        songStats.playCount++;
        songStats.totalListenTime += playRecord.duration;
        songStats.lastPlayed = playRecord.timestamp;
        
        // Calcular tasa de completación promedio
        const songPlays = this.playHistory.filter(p => p.cancionId === playRecord.cancionId);
        const completedPlays = songPlays.filter(p => p.completed).length;
        songStats.completionRate = songPlays.length > 0 ? (completedPlays / songPlays.length) * 100 : 0;

      } catch (error) {
        console.error('Error actualizando estadísticas de canción:', error);
      }
    },

    // Actualizar estadísticas del artista
    async updateArtistStats(playRecord: PlayRecord) {
      try {
        let artistStats = this.topArtists.find(a => a.cantanteId === playRecord.cantanteId);
        
        if (!artistStats) {
          // Obtener información del artista desde la API
          const artistResponse = await fetch(`${API_BASE_URL}/Artista/${playRecord.cantanteId}`);
          if (!artistResponse.ok) return;
          
          const artistData = await artistResponse.json();
          
          artistStats = {
            cantanteId: playRecord.cantanteId,
            nombre: artistData.nombre || 'Artista desconocido',
            image: artistData.image || '',
            oyentesMensuales: artistData.oyentesMensuales || 0,
            playCount: 0,
            totalListenTime: 0,
            uniqueSongs: 0,
            lastPlayed: 0
          };
          
          this.topArtists.push(artistStats);
        }

        // Actualizar estadísticas
        artistStats.playCount++;
        artistStats.totalListenTime += playRecord.duration;
        artistStats.lastPlayed = playRecord.timestamp;
        
        // Calcular canciones únicas del artista
        const artistSongs = new Set(
          this.playHistory
            .filter(p => p.cantanteId === playRecord.cantanteId)
            .map(p => p.cancionId)
        );
        artistStats.uniqueSongs = artistSongs.size;

      } catch (error) {
        console.error('Error actualizando estadísticas de artista:', error);
      }
    },

    // Utilidades
    parseDurationToSeconds(duration: string): number {
      if (!duration) return 0;
      const parts = duration.split(':').map(Number);
      if (parts.length === 2) {
        return parts[0] * 60 + parts[1]; // mm:ss
      } else if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2]; // hh:mm:ss
      }
      return 0;
    },

    formatSeconds(seconds: number): string {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    },

    // Persistencia local
    saveToLocalStorage() {
      try {
        localStorage.setItem('hibiki_listening_history', JSON.stringify({
          playHistory: this.playHistory.slice(-1000), // mantener solo las últimas 1000 reproducciones
          topSongs: this.topSongs,
          topArtists: this.topArtists
        }));
      } catch (error) {
        console.error('Error guardando historial:', error);
      }
    },

    loadFromLocalStorage() {
      try {
        const saved = localStorage.getItem('hibiki_listening_history');
        if (saved) {
          const data = JSON.parse(saved);
          this.playHistory = data.playHistory || [];
          this.topSongs = data.topSongs || [];
          this.topArtists = data.topArtists || [];
        }
      } catch (error) {
        console.error('Error cargando historial:', error);
      }
    },

    // Limpiar datos antiguos (más de 3 meses)
    cleanOldData() {
      const threeMonthsAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
      
      this.playHistory = this.playHistory.filter(play => play.timestamp > threeMonthsAgo);
      
      // Recalcular estadísticas después de limpiar
      this.recalculateStats();
      this.saveToLocalStorage();
    },

    // Recalcular todas las estadísticas
    recalculateStats() {
      // Limpiar estadísticas actuales
      this.topSongs = [];
      this.topArtists = [];
      
      // Recalcular desde el historial
      this.playHistory.forEach(play => {
        this.updateSongStats(play);
        this.updateArtistStats(play);
      });
    },

    // Inicializar el store
    async initialize() {
      this.loadFromLocalStorage();
      this.startListeningSession();
      
      // Limpiar datos antiguos una vez al día
      const lastCleanup = localStorage.getItem('hibiki_last_cleanup');
      const now = Date.now();
      const oneDayAgo = now - (24 * 60 * 60 * 1000);
      
      if (!lastCleanup || parseInt(lastCleanup) < oneDayAgo) {
        this.cleanOldData();
        localStorage.setItem('hibiki_last_cleanup', now.toString());
      }
    }
  }
});