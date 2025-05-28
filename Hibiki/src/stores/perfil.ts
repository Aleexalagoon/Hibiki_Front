import { defineStore } from 'pinia';

// Interfaces para definir la estructura de los datos
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
  liked: boolean;
  explicit?: boolean;
  artistId?: number;
  albumId?: number;
}

interface Playlist {
  id: number;
  title: string;
  image: string;
  owner?: string;
}

interface UserData {
  name: string;
  avatar: string | null;
  publicLists: number;
  following: number;
}

// Interfaz para el estado del store
interface ProfileState {
  userData: UserData | null;
  topArtists: Artist[];
  topTracks: Track[];
  publicPlaylists: Playlist[];
  error: string | null;
  loading: boolean;
}

export const useProfileStore = defineStore('profileStore', {
  state: (): ProfileState => ({
    userData: null,
    topArtists: [],
    topTracks: [],
    publicPlaylists: [],
    error: null,
    loading: false
  }),

  getters: {
    // Getter para verificar si hay datos cargados
    hasUserData: (state) => state.userData !== null,
    
    // Getter para obtener el nombre del usuario de forma segura
    userName: (state) => state.userData?.name || 'Usuario',
    
    // Getter para verificar si hay artistas
    hasTopArtists: (state) => state.topArtists.length > 0,
    
    // Getter para verificar si hay canciones
    hasTopTracks: (state) => state.topTracks.length > 0,
    
    // Getter para verificar si hay playlists
    hasPublicPlaylists: (state) => state.publicPlaylists.length > 0
  },

  actions: {
    // Obtener datos del usuario
    async fetchUserData(token: string) {
      this.loading = true;
      this.error = null;
      
      try {
        // Obtener datos básicos del usuario
        const userResponse = await fetch('https://localhost:7295/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!userResponse.ok) {
          throw new Error(`Error al obtener datos del usuario: ${userResponse.statusText}`);
        }

        const userData = await userResponse.json();
        this.userData = userData;

        // Obtener artistas más escuchados
        await this.fetchTopArtists(token);
        
        // Obtener canciones más escuchadas
        await this.fetchTopTracks(token);
        
        // Obtener playlists públicas
        await this.fetchPublicPlaylists(token);

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Error al cargar datos del perfil:', error);
        this.error = errorMessage;
      } finally {
        this.loading = false;
      }
    },

    // Obtener artistas más escuchados
    async fetchTopArtists(token: string) {
      try {
        const response = await fetch('https://localhost:7295/api/user/top-artists', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          this.topArtists = data;
        } else {
          console.warn('No se pudieron obtener los artistas más escuchados');
        }
      } catch (error) {
        console.error('Error al obtener artistas más escuchados:', error);
      }
    },

    // Obtener canciones más escuchadas
    async fetchTopTracks(token: string) {
      try {
        const response = await fetch('https://localhost:7295/api/user/top-tracks', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          this.topTracks = data;
        } else {
          console.warn('No se pudieron obtener las canciones más escuchadas');
        }
      } catch (error) {
        console.error('Error al obtener canciones más escuchadas:', error);
      }
    },

    // Obtener playlists públicas
    async fetchPublicPlaylists(token: string) {
      try {
        const response = await fetch('https://localhost:7295/api/user/public-playlists', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          this.publicPlaylists = data;
        } else {
          console.warn('No se pudieron obtener las playlists públicas');
        }
      } catch (error) {
        console.error('Error al obtener playlists públicas:', error);
      }
    },

    // Limpiar datos del perfil
    clearProfileData() {
      this.userData = null;
      this.topArtists = [];
      this.topTracks = [];
      this.publicPlaylists = [];
      this.error = null;
      this.loading = false;
    },

    // Actualizar estado de like de una canción
    updateTrackLike(trackId: number, liked: boolean) {
      const trackIndex = this.topTracks.findIndex(track => track.id === trackId);
      if (trackIndex !== -1) {
        this.topTracks[trackIndex].liked = liked;
      }
    },

    // Setter para datos de usuario (útil para testing o inicialización manual)
    setUserData(userData: UserData) {
      this.userData = userData;
    },

    // Setter para artistas (útil si los datos vienen de otra fuente)
    setTopArtists(artists: Artist[]) {
      this.topArtists = artists;
    },

    // Setter para canciones (útil si los datos vienen de otra fuente)
    setTopTracks(tracks: Track[]) {
      this.topTracks = tracks;
    },

    // Setter para playlists (útil si los datos vienen de otra fuente)
    setPublicPlaylists(playlists: Playlist[]) {
      this.publicPlaylists = playlists;
    }
  }
});