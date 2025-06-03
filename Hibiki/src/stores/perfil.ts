// src/stores/profileStore.ts
import { defineStore } from 'pinia';

interface Usuario {
  userId: number;
  name: string;
  email: string;
  isPremium: boolean;
  fecha_Registro: string;
}

interface Artista {
  cantanteId: number;
  nombre: string;
  oyentesMensuales: number;
  descripcion: string;
  image: string;
}

interface Cancion {
  cancionId: number;
  nombre: string;
  duracion: string;
  image: string;
  cantanteId: number;
  albumId: number;
  artista?: string;
  ruta?: string;
}

interface Playlist {
  playlistId: number;
  nombre: string;
  descripcion: string;
  image: string;
  fechaCreacion: string;
  creadorId: number;
  userId?: number;
  canciones?: Cancion[];
}

interface RecentTrack {
  cancion: Cancion;
  fechaEscucha: string;
  completada: boolean;
}

interface ProfileData {
  usuario: Usuario;
  artistasFavoritos: Artista[];
  cancionesMasEscuchadas: Cancion[];
  playlistsCreadas: Playlist[];
  cancionesRecientes: RecentTrack[];
  estadisticas: {
    totalCanciones: number;
    totalPlaylists: number;
    tiempoEscuchado: string;
    generoFavorito: string;
    horasEscuchadas: number;
    reproducciones: number;
    artistasDiferentes: number;
  };
}

// Usar la misma URL base que en playlistStore para consistencia
const API_BASE_URL = "https://localhost:7295/api";

export const useProfileStore = defineStore('profileStore', {
  state: () => ({
    profileData: null as ProfileData | null,
    loading: false,
    error: null as string | null,
    lastUpdated: null as Date | null,
  }),

  getters: {
    getUserInfo: (state) => state.profileData?.usuario || null,
    getTopArtists: (state) => state.profileData?.artistasFavoritos || [],
    getTopSongs: (state) => state.profileData?.cancionesMasEscuchadas || [],
    getUserPlaylists: (state) => state.profileData?.playlistsCreadas || [],
    getRecentTracks: (state) => state.profileData?.cancionesRecientes || [],
    getStats: (state) => state.profileData?.estadisticas || null,
    isUserPremium: (state) => state.profileData?.usuario?.isPremium || false,
    isDataStale: (state) => {
      if (!state.lastUpdated) return true;
      const now = new Date();
      const diff = now.getTime() - state.lastUpdated.getTime();
      return diff > 300000; // 5 minutos
    }
  },

  actions: {
    async fetchUserProfile(userId: number, forceRefresh = false) {
      // Evitar cargas innecesarias si los datos son recientes
      if (!forceRefresh && this.profileData && !this.isDataStale) {
        console.log('Usando datos del perfil en caché');
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        console.log('Cargando perfil del usuario:', userId);

        // 1. Obtener datos del usuario
        const usuario = await this.fetchUserData(userId);
        
        // 2. Obtener artistas favoritos (primeros 6)
        const artistasFavoritos = await this.fetchTopArtists();
        
        // 3. Obtener canciones más escuchadas
        const cancionesMasEscuchadas = await this.fetchTopSongs();
        
        // 4. Obtener playlists del usuario
        const playlistsCreadas = await this.fetchUserPlaylists(userId);
        
        // 5. Generar canciones recientes simuladas
        const cancionesRecientes = await this.generateRecentTracks(cancionesMasEscuchadas);
        
        // 6. Calcular estadísticas
        const estadisticas = await this.calculateStatistics(
          cancionesMasEscuchadas, 
          playlistsCreadas, 
          artistasFavoritos
        );

        this.profileData = {
          usuario,
          artistasFavoritos,
          cancionesMasEscuchadas,
          playlistsCreadas,
          cancionesRecientes,
          estadisticas
        };

        this.lastUpdated = new Date();
        console.log('Perfil cargado exitosamente');

      } catch (err: any) {
        console.error('Error al cargar perfil:', err);
        this.error = this.handleError(err);
      } finally {
        this.loading = false;
      }
    },

    async fetchUserData(userId: number): Promise<Usuario> {
      try {
        const response = await fetch(`${API_BASE_URL}/Usuario/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error al obtener usuario: ${response.status}`);
        }

        const userData = await response.json();
        return this.normalizeUsuario(userData);
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        // Devolver usuario por defecto si hay error
        return {
          userId,
          name: 'Usuario',
          email: 'usuario@example.com',
          isPremium: false,
          fecha_Registro: new Date().toISOString()
        };
      }
    },

    async fetchTopArtists(): Promise<Artista[]> {
      try {
        const response = await fetch(`${API_BASE_URL}/Artista`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error al obtener artistas: ${response.status}`);
        }

        const artistas = await response.json();
        return Array.isArray(artistas) 
          ? artistas.slice(0, 6).map(this.normalizeArtista) 
          : [];
      } catch (error) {
        console.error('Error al obtener artistas:', error);
        return [];
      }
    },

    async fetchTopSongs(): Promise<Cancion[]> {
      try {
        const response = await fetch(`${API_BASE_URL}/Cancion`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error al obtener canciones: ${response.status}`);
        }

        const canciones = await response.json();
        if (!Array.isArray(canciones)) return [];

        // Tomar las primeras 10 canciones y agregar info del artista
        const topSongs = canciones.slice(0, 10);
        
        // Enriquecer con datos del artista de forma paralela
        const songsWithArtists = await Promise.allSettled(
          topSongs.map(async (cancion: any) => {
            const normalizedSong = this.normalizeCancion(cancion);
            
            if (normalizedSong.cantanteId) {
              try {
                const artistResponse = await fetch(`${API_BASE_URL}/Artista/${normalizedSong.cantanteId}`);
                if (artistResponse.ok) {
                  const artista = await artistResponse.json();
                  normalizedSong.artista = artista.nombre || 'Artista desconocido';
                }
              } catch {
                normalizedSong.artista = 'Artista desconocido';
              }
            }
            
            return normalizedSong;
          })
        );

        return songsWithArtists
          .filter(result => result.status === 'fulfilled')
          .map(result => (result as PromiseFulfilledResult<Cancion>).value);

      } catch (error) {
        console.error('Error al obtener canciones:', error);
        return [];
      }
    },

    async fetchUserPlaylists(userId: number): Promise<Playlist[]> {
      try {
        const response = await fetch(`${API_BASE_URL}/Playlist`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error al obtener playlists: ${response.status}`);
        }

        const allPlaylists = await response.json();
        if (!Array.isArray(allPlaylists)) return [];

        // Filtrar playlists del usuario
        const userPlaylists = allPlaylists.filter((playlist: any) => 
          playlist.creadorId === userId || 
          playlist.userId === userId ||
          playlist.CreadorId === userId ||
          playlist.UserId === userId
        );

        return userPlaylists.map(this.normalizePlaylist);

      } catch (error) {
        console.error('Error al obtener playlists del usuario:', error);
        return [];
      }
    },

    async generateRecentTracks(canciones: Cancion[]): Promise<RecentTrack[]> {
      if (!canciones.length) return [];

      const recentTracks: RecentTrack[] = [];
      const now = new Date();

      // Generar 5 canciones recientes basadas en las canciones disponibles
      for (let i = 0; i < Math.min(5, canciones.length); i++) {
        const cancion = canciones[Math.floor(Math.random() * canciones.length)];
        const horasAtras = Math.floor(Math.random() * 48) + 1; // Entre 1 y 48 horas
        
        const fechaEscucha = new Date(now.getTime() - (horasAtras * 60 * 60 * 1000));
        
        recentTracks.push({
          cancion: { ...cancion },
          fechaEscucha: fechaEscucha.toISOString(),
          completada: Math.random() > 0.3 // 70% de probabilidad de estar completada
        });
      }

      return recentTracks.sort((a, b) => 
        new Date(b.fechaEscucha).getTime() - new Date(a.fechaEscucha).getTime()
      );
    },

    async calculateStatistics(
      canciones: Cancion[], 
      playlists: Playlist[], 
      artistas: Artista[]
    ) {
      let totalMinutos = 0;
      let totalSegundos = 0;
      
      // Calcular tiempo total de escucha
      canciones.forEach(cancion => {
        if (cancion.duracion) {
          const partes = cancion.duracion.split(':');
          if (partes.length >= 2) {
            const minutos = parseInt(partes[0]) || 0;
            const segundos = parseInt(partes[1]) || 0;
            totalMinutos += minutos;
            totalSegundos += segundos;
          }
        }
      });

      // Convertir segundos extras a minutos
      totalMinutos += Math.floor(totalSegundos / 60);
      const horasEscuchadas = Math.floor(totalMinutos / 60);

      // Calcular reproducciones simuladas
      const reproducciones = canciones.length * Math.floor(Math.random() * 10) + 50;

      return {
        totalCanciones: canciones.length,
        totalPlaylists: playlists.length,
        tiempoEscuchado: `${horasEscuchadas} horas`,
        generoFavorito: this.getMostPopularGenre(artistas),
        horasEscuchadas,
        reproducciones,
        artistasDiferentes: artistas.length
      };
    },

    // Métodos de normalización
    normalizeUsuario(usuario: any): Usuario {
      return {
        userId: usuario.userId || usuario.UserId || 0,
        name: usuario.name || usuario.Name || 'Usuario',
        email: usuario.email || usuario.Email || '',
        isPremium: usuario.isPremium || usuario.IsPremium || false,
        fecha_Registro: usuario.fecha_Registro || usuario.FechaRegistro || new Date().toISOString()
      };
    },

    normalizeArtista(artista: any): Artista {
      return {
        cantanteId: artista.cantanteId || artista.CantanteId || 0,
        nombre: artista.nombre || artista.Nombre || 'Artista desconocido',
        oyentesMensuales: artista.oyentesMensuales || artista.OyentesMensuales || 0,
        descripcion: artista.descripcion || artista.Descripcion || '',
        image: artista.image || artista.Image || 'https://placehold.co/150x150/444/fff?text=Artista'
      };
    },

    normalizeCancion(cancion: any): Cancion {
      return {
        cancionId: cancion.cancionId || cancion.CancionId || 0,
        nombre: cancion.nombre || cancion.Nombre || 'Sin título',
        duracion: cancion.duracion || cancion.Duracion || '0:00',
        image: cancion.image || cancion.Image || 'https://placehold.co/150x150/444/fff?text=Song',
        cantanteId: cancion.cantanteId || cancion.CantanteId || 0,
        albumId: cancion.albumId || cancion.AlbumId || 0,
        artista: cancion.artista || cancion.Artista || 'Artista desconocido',
        ruta: cancion.ruta || cancion.Ruta || ''
      };
    },

    normalizePlaylist(playlist: any): Playlist {
      return {
        playlistId: playlist.playlistId || playlist.PlaylistId || 0,
        nombre: playlist.nombre || playlist.Nombre || 'Playlist sin nombre',
        descripcion: playlist.descripcion || playlist.Descripcion || '',
        image: playlist.image || playlist.Image || 'https://placehold.co/150x150/444/fff?text=Playlist',
        fechaCreacion: playlist.fechaCreacion || playlist.FechaCreacion || new Date().toISOString(),
        creadorId: playlist.creadorId || playlist.CreadorId || 0,
        userId: playlist.userId || playlist.UserId || 0,
        canciones: Array.isArray(playlist.canciones) ? playlist.canciones.map(this.normalizeCancion) : []
      };
    },

    // Métodos auxiliares
    getMostPopularGenre(artistas: Artista[]): string {
      const genres = ['Pop', 'Rock', 'Hip Hop', 'Electrónica', 'Jazz', 'Clásica', 'Reggaeton', 'Indie'];
      return genres[Math.floor(Math.random() * genres.length)];
    },

    formatDuration(duration: string): string {
      if (!duration) return '0:00';
      const parts = duration.split(':');
      if (parts.length >= 2) {
        const minutes = parts[0].padStart(2, '0');
        const seconds = parts[1].padStart(2, '0');
        return `${minutes}:${seconds}`;
      }
      return duration;
    },

    getTimeAgo(date: string): string {
      const now = new Date();
      const past = new Date(date);
      const diff = now.getTime() - past.getTime();
      
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      if (days > 0) return `Hace ${days}d`;
      if (hours > 0) return `Hace ${hours}h`;
      if (minutes > 0) return `Hace ${minutes}m`;
      return 'Ahora';
    },

    handleError(error: any): string {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return 'No se puede conectar con el servidor. Verifica que esté ejecutándose.';
      }
      if (error.message.includes('404')) {
        return 'Usuario no encontrado.';
      }
      if (error.message.includes('500')) {
        return 'Error interno del servidor.';
      }
      return error.message || 'Error desconocido al cargar el perfil';
    },

    // Métodos de actualización
    async updateUserProfile(userId: number, userData: Partial<Usuario>) {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch(`${API_BASE_URL}/Usuario/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(userData)
        });

        if (!response.ok) {
          throw new Error(`Error al actualizar perfil: ${response.status}`);
        }

        // Actualizar datos locales
        if (this.profileData) {
          this.profileData.usuario = { ...this.profileData.usuario, ...userData };
        }

        return true;
      } catch (err: any) {
        this.error = this.handleError(err);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async toggleFavoriteArtist(artistId: number) {
      if (!this.profileData) return;

      const index = this.profileData.artistasFavoritos.findIndex(a => a.cantanteId === artistId);
      
      if (index > -1) {
        // Remover de favoritos
        this.profileData.artistasFavoritos.splice(index, 1);
      } else {
        // Agregar a favoritos
        try {
          const response = await fetch(`${API_BASE_URL}/Artista/${artistId}`);
          if (response.ok) {
            const artista = await response.json();
            this.profileData.artistasFavoritos.push(this.normalizeArtista(artista));
          }
        } catch (err) {
          console.error('Error al agregar artista favorito:', err);
        }
      }
    },

    async refreshData(userId: number) {
      return this.fetchUserProfile(userId, true);
    },

    clearProfile() {
      this.profileData = null;
      this.error = null;
      this.lastUpdated = null;
    },

    clearError() {
      this.error = null;
    }
  }
});