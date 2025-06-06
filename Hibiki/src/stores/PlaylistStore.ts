import { defineStore } from 'pinia';

interface Cancion {
  cancionId: number;
  nombre: string;
  artista?: string;
  ruta: string;
  image: string;
  duracion: string;
  cantanteId?: number;
  albumId?: number;
}

interface Usuario {
  userId: number;
  name: string;
  email?: string;
}

export interface Playlist {
  playlistId: number;
  userId: number;
  creadorId: number;
  nombre: string;
  descripcion: string;
  image: string;
  fechaCreacion: string;
  canciones: Cancion[];
  creador: Usuario;
}

const API_BASE_URL = "http://hibikimusicapi.retocsv.es/api";

export const usePlaylistStore = defineStore('playlist', {
  state: () => ({
    playlists: [] as Playlist[],
    currentPlaylist: null as Playlist | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    getPlaylistById: (state) => (id: number) => {
      return state.playlists.find(playlist => playlist.playlistId === id) || null;
    },
    getTotalPlaylists: (state) => state.playlists.length,
    getPlaylistTotalSongs: (state) => (id: number) => {
      const playlist = state.playlists.find(p => p.playlistId === id);
      return playlist ? playlist.canciones.length : 0;
    },
    getPlaylistTotalDuration: (state) => (id: number) => {
      const playlist = state.playlists.find(p => p.playlistId === id);
      if (!playlist) return '0:00';

      let totalSeconds = 0;
      playlist.canciones.forEach(cancion => {
        if (cancion.duracion) {
          const parts = cancion.duracion.split(':');
          if (parts.length >= 2) {
            const minutes = parseInt(parts[0]) || 0;
            const seconds = parseInt(parts[1]) || 0;
            totalSeconds += minutes * 60 + seconds;
          }
        }
      });

      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  },

  actions: {
    async fetchAllPlaylists() {
      this.loading = true;
      this.error = null;

      try {
        console.log('Intentando conectar con:', `${API_BASE_URL}/Playlist`);
        
        const response = await fetch(`${API_BASE_URL}/Playlist`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        });
        
        console.log('Respuesta del servidor:', response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Datos recibidos:', data);
        
        // Normalizar los datos y después obtener el número de canciones para cada playlist
        this.playlists = Array.isArray(data) ? data.map((playlist: any) => this.normalizePlaylist(playlist)) : [];
        
        // Para cada playlist, obtener el número de canciones
        for (let playlist of this.playlists) {
          try {
            const playlistWithSongs = await this.getPlaylistSongsCount(playlist.playlistId);
            playlist.canciones = playlistWithSongs.canciones || [];
          } catch (error) {
            console.warn(`No se pudieron obtener canciones para playlist ${playlist.playlistId}:`, error);
            playlist.canciones = [];
          }
        }
        
        console.log('Playlists procesadas con conteo de canciones:', this.playlists.length);
        
      } catch (err: any) {
        console.error('Error detallado:', err);
        
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          this.error = 'No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.';
        } else if (err.message.includes('NetworkError')) {
          this.error = 'Error de red. Verifica tu conexión a internet.';
        } else {
          this.error = err.message || 'Error desconocido al cargar las playlists';
        }
      } finally {
        this.loading = false;
      }
    },

    // Nuevo método para obtener solo el conteo de canciones sin cargar toda la playlist
    async getPlaylistSongsCount(playlistId: number): Promise<Playlist> {
      try {
        const response = await fetch(`${API_BASE_URL}/Playlist/${playlistId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        });
        
        if (!response.ok) {
          throw new Error(`Error al obtener playlist ${playlistId}: ${response.statusText}`);
        }

        const data = await response.json();
        return this.normalizePlaylist(data);
      } catch (error) {
        console.error(`Error al obtener canciones para playlist ${playlistId}:`, error);
        return { playlistId, canciones: [] } as Playlist;
      }
    },

    async fetchPlaylistById(id: number) {
      this.loading = true;
      this.error = null;
    
      try {
        console.log('Obteniendo playlist con ID:', id);
        
        const response = await fetch(`${API_BASE_URL}/Playlist/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        });
        
        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }
    
        const data = await response.json();
        console.log("Playlist individual obtenida:", data);
    
        // Normalizar los datos de la playlist
        this.currentPlaylist = this.normalizePlaylist(data);
        
      } catch (err: any) {
        console.error('Error al obtener playlist:', err);
        
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          this.error = 'No se puede conectar con el servidor para obtener la playlist.';
        } else {
          this.error = err.message || `Error al obtener la playlist ${id}`;
        }
      } finally {
        this.loading = false;
      }
    },

    async createPlaylist(playlistData: Partial<Playlist>) {
      this.loading = true;
      this.error = null;

      try {
        console.log('Creando playlist:', playlistData);
        
        const response = await fetch(`${API_BASE_URL}/Playlist`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(playlistData)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Respuesta del servidor:', result);
        
        // El servidor ahora devuelve { message, playlistId, playlist }
        const newPlaylist = result.playlist || result;
        const normalizedPlaylist = this.normalizePlaylist(newPlaylist);
        
        // Agregar la nueva playlist al estado local inmediatamente
        this.playlists.push(normalizedPlaylist);
        
        // También actualizar la playlist actual si es necesario
        this.currentPlaylist = normalizedPlaylist;
        
        console.log('Nueva playlist agregada al estado:', normalizedPlaylist);
        
        return normalizedPlaylist;
        
      } catch (err: any) {
        console.error('Error al crear playlist:', err);
        this.error = err.message || 'Error al crear la playlist';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updatePlaylist(playlistData: Playlist) {
      this.loading = true;
      this.error = null;

      try {
        console.log('Actualizando playlist:', playlistData);
        
        const response = await fetch(`${API_BASE_URL}/Playlist/${playlistData.playlistId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(playlistData)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
        }
        
        // Actualizar la playlist en el estado local
        const index = this.playlists.findIndex(p => p.playlistId === playlistData.playlistId);
        if (index !== -1) {
          this.playlists[index] = this.normalizePlaylist(playlistData);
        }
        
        // Si es la playlist actual, también actualizarla
        if (this.currentPlaylist?.playlistId === playlistData.playlistId) {
          this.currentPlaylist = this.normalizePlaylist(playlistData);
        }
        
        return playlistData;
        
      } catch (err: any) {
        console.error('Error al actualizar playlist:', err);
        this.error = err.message || 'Error al actualizar la playlist';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deletePlaylist(id: number) {
      this.loading = true;
      this.error = null;

      try {
        console.log('Eliminando playlist:', id);
        
        const response = await fetch(`${API_BASE_URL}/Playlist/${id}`, { 
          method: 'DELETE',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
        }

        this.playlists = this.playlists.filter(p => p.playlistId !== id);

        if (this.currentPlaylist?.playlistId === id) {
          this.currentPlaylist = null;
        }
        
      } catch (err: any) {
        console.error('Error al eliminar playlist:', err);
        this.error = err.message || `Error al eliminar la playlist ${id}`;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async addSongToPlaylist(playlistId: number, cancionId: number) {
      this.loading = true;
      this.error = null;

      try {
        console.log('Agregando canción a playlist:', { playlistId, cancionId });
        
        const response = await fetch(`${API_BASE_URL}/Playlist/${playlistId}/canciones/${cancionId}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('Canción agregada exitosamente:', result);

        // Actualizar el estado local inmediatamente
        const playlist = this.playlists.find(p => p.playlistId === playlistId);
        if (playlist) {
          // Obtener los datos de la canción (simplificado)
          try {
            const cancionResponse = await fetch(`${API_BASE_URL}/Cancion/${cancionId}`);
            if (cancionResponse.ok) {
              const cancionData = await cancionResponse.json();
              const normalizedCancion = this.normalizeCancion(cancionData);
              playlist.canciones.push(normalizedCancion);
            }
          } catch (error) {
            console.warn('No se pudo obtener datos de la canción:', error);
          }
        }

        // También actualizar la playlist actual si coincide
        if (this.currentPlaylist?.playlistId === playlistId) {
          await this.fetchPlaylistById(playlistId);
        }
        
      } catch (err: any) {
        console.error('Error al agregar canción:', err);
        this.error = err.message || `Error al añadir canción a la playlist ${playlistId}`;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async removeSongFromPlaylist(playlistId: number, cancionId: number) {
      this.loading = true;
      this.error = null;

      try {
        console.log('Eliminando canción de playlist:', { playlistId, cancionId });
        
        const response = await fetch(`${API_BASE_URL}/Playlist/${playlistId}/canciones/${cancionId}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
        }

        // Actualizar el estado local inmediatamente
        const playlist = this.playlists.find(p => p.playlistId === playlistId);
        if (playlist) {
          playlist.canciones = playlist.canciones.filter(c => c.cancionId !== cancionId);
        }

        if (this.currentPlaylist?.playlistId === playlistId) {
          this.currentPlaylist.canciones = this.currentPlaylist.canciones.filter(
            c => c.cancionId !== cancionId
          );
        }
        
      } catch (err: any) {
        console.error('Error al eliminar canción:', err);
        this.error = err.message || `Error al eliminar canción de la playlist ${playlistId}`;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // 🆕 FUNCIONES FALTANTES QUE NECESITA EL PLAYLISTVIEW

    // Función para cargar todas las canciones disponibles
    async loadAllSongs() {
      try {
        console.log('Cargando todas las canciones disponibles...');
        
        const response = await fetch(`${API_BASE_URL}/Cancion`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error al cargar canciones: ${response.status} ${response.statusText}`);
        }
        
        const songs = await response.json();
        console.log('Canciones cargadas:', Array.isArray(songs) ? songs.length : 0);
        
        // Normalizar las canciones
        return Array.isArray(songs) ? songs.map(song => this.normalizeCancion(song)) : [];
        
      } catch (error) {
        console.error('Error al cargar canciones:', error);
        throw error;
      }
    },

    // Función para buscar canciones
    async searchSongs(query: string) {
      try {
        console.log('Buscando canciones con query:', query);
        
        // Cargar todas las canciones y filtrar localmente
        const allSongs = await this.loadAllSongs();
        const lowerQuery = query.toLowerCase();
        
        const filteredSongs = allSongs.filter((song: Cancion) => 
          song.nombre.toLowerCase().includes(lowerQuery) ||
          (song.artista && song.artista.toLowerCase().includes(lowerQuery))
        );
        
        console.log('Resultados de búsqueda:', filteredSongs.length);
        return filteredSongs;
        
      } catch (error) {
        console.error('Error al buscar canciones:', error);
        throw error;
      }
    },

    // Función para verificar conectividad
    async checkConnection() {
      try {
        console.log('Verificando conexión con el servidor...');
        
        const response = await fetch(`${API_BASE_URL}/Playlist`, {
          method: 'HEAD', // Solo verifica conectividad sin descargar datos
          headers: {
            'Accept': 'application/json'
          }
        });
        
        const isConnected = response.ok;
        console.log('Estado de conexión:', isConnected ? 'CONECTADO' : 'DESCONECTADO');
        
        return isConnected;
      } catch (error) {
        console.error('Error de conexión:', error);
        return false;
      }
    },

    // Método para normalizar datos de playlist
    normalizePlaylist(playlist: any): Playlist {
      // Manejar nombres vacíos o undefined
      const nombre = playlist.nombre || playlist.Nombre || playlist.name || 'Playlist sin nombre';
      
      return {
        playlistId: playlist.playlistId || playlist.PlaylistId || playlist.id || 0,
        userId: playlist.userId || playlist.UserId || playlist.creadorId || playlist.CreadorId || 0,
        creadorId: playlist.creadorId || playlist.CreadorId || playlist.userId || playlist.UserId || 0,
        nombre: nombre.trim() || 'Playlist sin nombre',
        descripcion: (playlist.descripcion || playlist.Descripcion || playlist.description || '').trim(),
        image: playlist.image || playlist.Image || 'https://placehold.co/150x150/444/fff?text=Playlist',
        fechaCreacion: playlist.fechaCreacion || playlist.FechaCreacion || playlist.createdAt || new Date().toISOString(),
        canciones: Array.isArray(playlist.canciones) ? playlist.canciones.map(this.normalizeCancion) : 
                   Array.isArray(playlist.Canciones) ? playlist.Canciones.map(this.normalizeCancion) : [],
        creador: this.normalizeCreador(playlist.creador || playlist.Creador)
      };
    },

    // Método para normalizar datos de canción
    normalizeCancion(cancion: any): Cancion {
      return {
        cancionId: cancion.cancionId || cancion.CancionId || 0,
        nombre: cancion.nombre || cancion.Nombre || 'Sin título',
        artista: cancion.artista || cancion.Artista || 'Artista desconocido',
        ruta: cancion.ruta || cancion.Ruta || '',
        image: cancion.image || cancion.Image || 'https://placehold.co/150x150/444/fff?text=Song',
        duracion: cancion.duracion || cancion.Duracion || '0:00',
        cantanteId: cancion.cantanteId || cancion.CantanteId || 0,
        albumId: cancion.albumId || cancion.AlbumId || 0
      };
    },

    // Método para normalizar datos del creador
    normalizeCreador(creador: any): Usuario {
      if (!creador) {
        return {
          userId: 0,
          name: 'Usuario desconocido',
          email: ''
        };
      }
      
      return {
        userId: creador.userId || creador.UserId || 0,
        name: creador.name || creador.Name || 'Usuario desconocido',
        email: creador.email || creador.Email || ''
      };
    },

    // Método de utilidad para limpiar errores
    clearError() {
      this.error = null;
    },

    // Método para resetear el estado
    reset() {
      this.playlists = [];
      this.currentPlaylist = null;
      this.loading = false;
      this.error = null;
    }
  }
});