import { defineStore } from 'pinia';

interface UserData {
  name: string;
  avatar: string | null;
  publicLists: number;
  following: number;
}

interface Artist {
  id: number;
  name: string;
  image: string;
}

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  image: string;
  duration: string;
  explicit: boolean;
  liked: boolean;
}

interface Playlist {
  id: number;
  title: string;
  image: string;
}

// URL base para todas las solicitudes API
const API_BASE_URL = "http://aa0918044ca2b4e9b94f01593a2e67bf-1447626218.us-east-1.elb.amazonaws.com/api";

export const useProfileStore = defineStore('profileStore', {
  state: () => ({
    userData: {
      userData: null,
      avatar: '',
      publicLists: 0,
      following: 0
    },
    topArtists: [] as Artist[],
    topTracks: [] as Track[],
    publicPlaylists: [] as Playlist[],
    loading: true,
    error: null as string | null
  }),

  actions: {
    async fetchUserData(token: string): Promise<void> {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('Realizando petición a la API...');
        const response = await fetch(`${API_BASE_URL}/perfil`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
    
        if (!response.ok) {
          throw new Error('No se pudo cargar el perfil');
        }
    
        const data = await response.json();
        console.log('Datos recibidos de la API:', data);

        // Si data es un array, tomar el primer elemento, si no, usar directamente data
        const user = Array.isArray(data) && data.length > 0 ? data[0] : data;

        this.userData = {
          name: user.nombre?.trim() || 'Usuario',
          avatar: user.imagen?.trim() || '',
          publicLists: user.playlists?.length || 0,
          following: user.siguiendo?.length || 0
        };

        console.log('Datos asignados en userData:', this.userData);
        
        // Obtener correctamente los artistas más escuchados
        this.topArtists = user.artistasMasEscuchados?.map((artista: any) => ({
          id: artista.cantanteId || artista.CantanteId || 0,
          name: artista.nombre || artista.Nombre || 'Desconocido',
          image: artista.image || artista.Image || 'https://via.placeholder.com/150'
        })) || [];
    
        // Obtener correctamente las canciones más escuchadas
        this.topTracks = user.cancionesMasEscuchadas?.map((cancion: any) => ({
          id: cancion.cancionId || cancion.CancionId || 0,
          title: cancion.nombre || cancion.Nombre || 'Sin título',
          artist: cancion.cantante?.nombre || cancion.Cantante?.Nombre || 'Artista desconocido',
          album: cancion.album?.nombre || cancion.Album?.Nombre || 'Álbum desconocido',
          image: cancion.image || cancion.Image || cancion.album?.image || cancion.Album?.Image || 'https://via.placeholder.com/150',
          duration: this.formatDuration(cancion.duracion),
          explicit: cancion.explicitFlag || cancion.ExplicitFlag || false,
          liked: cancion.liked || cancion.Liked || false
        })) || [];
    
        this.publicPlaylists = user.playlists?.map((playlist: any) => ({
          id: playlist.id || 0,
          title: playlist.titulo || 'Sin título',
          image: playlist.imagen || 'https://via.placeholder.com/150'
        })) || [];

        console.log('Datos finales en store:', {
          userData: this.userData,
          topArtists: this.topArtists,
          topTracks: this.topTracks,
          publicPlaylists: this.publicPlaylists
        });
    
      } catch (err: any) {
        this.error = err.message || 'Error al cargar el perfil';
        console.error('Error al cargar el perfil:', err);
      } finally {
        this.loading = false;
      }
    },

    // Corrige la duración desde el formato HH:MM:SS a MM:SS
    formatDuration(duration: string | null): string {
      if (!duration) return '0:00';
      const parts = duration.split(':');
      if (parts.length === 3) {
        const mins = parseInt(parts[1], 10);
        const secs = parseInt(parts[2], 10);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      }
      return '0:00';
    }
  }
});