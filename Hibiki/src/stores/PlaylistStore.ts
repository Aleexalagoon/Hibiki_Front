import { defineStore } from 'pinia';

// Definición de interfaces
interface Cancion {
  cancionId: number;
  nombre: string;
  artista: string;
  ruta: string;
  image: string;
  duracion: string;
}

interface Usuario {
  usuarioId: number;
  nombre: string;
}

export interface Playlist {
  playlistId: number;
  nombre: string;
  descripcion: string;
  fechaCreacion: string;
  canciones: Cancion[];
  creador: Usuario;
}

// URL base para todas las solicitudes API
const API_BASE_URL = 'https://localhost:7295/api';

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
        const [minutes, seconds] = cancion.duracion.split(':').map(Number);
        totalSeconds += minutes * 60 + seconds;
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
        const response = await fetch(`https://localhost:7295/api/Playlist`); // ← QUITAMOS `id`
        if (!response.ok) throw new Error('Error al obtener playlists');
    
        this.playlists = await response.json();
      } catch (err) {
        this.error = err.message;
        console.error('Error al obtener playlists:', err);
      } finally {
        this.loading = false;
      }
    },

    async fetchPlaylistById(id: number) {
      this.loading = true;
      this.error = null;
    
      try {
        const response = await fetch(`${API_BASE_URL}/Playlist/${id}`);
        if (!response.ok) throw new Error(`Error al obtener la playlist con ID: ${id}`);
    
        const data = await response.json();
        console.log("Playlist obtenida:", data); // 👀 Verifica qué devuelve la API
    
        this.currentPlaylist = data;
      } catch (err) {
        this.error = err.message;
        console.error(`Error al obtener la playlist ${id}:`, err);
      } finally {
        this.loading = false;
      }
    },

    async createPlaylist(playlist: Omit<Playlist, 'playlistId'>) {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch('https://localhost:7295/api/Playlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(playlist)
        });
        
        if (!response.ok) throw new Error('Error al crear la playlist');
        
        const newPlaylist = await response.json();
        this.playlists.push(newPlaylist);
        return newPlaylist;
      } catch (err) {
        this.error = err.message;
        console.error('Error al crear la playlist:', err);
      } finally {
        this.loading = false;
      }
    },

    async deletePlaylist(id: number) {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch('https://localhost:7295/api/Playlist', { method: 'DELETE' });
        if (!response.ok) throw new Error(`Error al eliminar la playlist ${id}`);

        this.playlists = this.playlists.filter(p => p.playlistId !== id);

        if (this.currentPlaylist?.playlistId === id) {
          this.currentPlaylist = null;
        }
      } catch (err) {
        this.error = err.message;
        console.error(`Error al eliminar la playlist ${id}:`, err);
      } finally {
        this.loading = false;
      }
    },

    async addSongToPlaylist(playlistId: number, cancion: Cancion) {
      this.loading = true;
      this.error = null;
    
      try {
        const response = await fetch(`${API_BASE_URL}/Playlist/${playlistId}/canciones`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cancion)
        });
    
        if (!response.ok) throw new Error('Error al añadir la canción');
    
        // Luego de añadir la canción, volvemos a obtener la playlist actualizada
        await this.fetchPlaylistById(playlistId);
      } catch (err) {
        this.error = err.message;
        console.error(`Error al añadir canción a la playlist ${playlistId}:`, err);
      } finally {
        this.loading = false;
      }
    },

    async removeSongFromPlaylist(playlistId: number, cancionId: number) {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch(`${API_BASE_URL}/Playlist/${playlistId}/canciones/${cancionId}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error(`Error al eliminar la canción ${cancionId}`);

        const playlist = this.playlists.find(p => p.playlistId === playlistId);
        if (playlist) {
          playlist.canciones = playlist.canciones.filter(c => c.cancionId !== cancionId);
        }

        if (this.currentPlaylist?.playlistId === playlistId) {
          this.currentPlaylist.canciones = this.currentPlaylist.canciones.filter(
            c => c.cancionId !== cancionId
          );
        }
      } catch (err) {
        this.error = err.message;
        console.error(`Error al eliminar canción de la playlist ${playlistId}:`, err);
      } finally {
        this.loading = false;
      }
    },

    async initializeData() {
      this.loading = true;
      this.error = null;

      try {
        await fetch(`${API_BASE_URL}/Playlist/initialize`, { method: 'POST' });
        await this.fetchAllPlaylists();
      } catch (err) {
        this.error = err.message;
        console.error('Error al inicializar datos:', err);
      } finally {
        this.loading = false;
      }
    }
  }
});