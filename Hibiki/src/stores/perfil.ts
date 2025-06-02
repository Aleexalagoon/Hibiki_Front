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
}

interface Playlist {
  playlistId: number;
  nombre: string;
  descripcion: string;
  image: string;
  fechaCreacion: string;
  creadorId: number;
}

interface ProfileData {
  usuario: Usuario;
  artistasFavoritos: Artista[];
  cancionesMasEscuchadas: Cancion[];
  playlistsCreadas: Playlist[];
  estadisticas: {
    totalCanciones: number;
    totalPlaylists: number;
    tiempoEscuchado: string;
    generoFavorito: string;
  };
}

const API_BASE_URL = "http://aa0918044ca2b4e9b94f01593a2e67bf-1447626218.us-east-1.elb.amazonaws.com/api";

export const useProfileStore = defineStore('profileStore', {
  state: () => ({
    profileData: null as ProfileData | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getUserInfo: (state) => state.profileData?.usuario || null,
    getTopArtists: (state) => state.profileData?.artistasFavoritos || [],
    getTopSongs: (state) => state.profileData?.cancionesMasEscuchadas || [],
    getUserPlaylists: (state) => state.profileData?.playlistsCreadas || [],
    getStats: (state) => state.profileData?.estadisticas || null,
    isUserPremium: (state) => state.profileData?.usuario.isPremium || false,
  },

  actions: {
    async fetchUserProfile(userId: number) {
      this.loading = true;
      this.error = null;

      try {
        // Obtener datos del usuario
        const userResponse = await fetch(`${API_BASE_URL}/Usuario/${userId}`);
        if (!userResponse.ok) throw new Error('Error al obtener datos del usuario');
        const usuario = await userResponse.json();

        // Obtener todos los artistas para mostrar como favoritos (simulación)
        const artistsResponse = await fetch(`${API_BASE_URL}/Artista`);
        if (!artistsResponse.ok) throw new Error('Error al obtener artistas');
        const artistas = await artistsResponse.json();
        const artistasFavoritos = artistas.slice(0, 6); // Top 6 artistas

        // Obtener todas las canciones para mostrar como más escuchadas
        const songsResponse = await fetch(`${API_BASE_URL}/Cancion`);
        if (!songsResponse.ok) throw new Error('Error al obtener canciones');
        const canciones = await songsResponse.json();
        
        // Agregar nombre del artista a las canciones
        const cancionesConArtista = await Promise.all(
          canciones.slice(0, 10).map(async (cancion: any) => {
            try {
              const artistaResponse = await fetch(`${API_BASE_URL}/Artista/${cancion.cantanteId}`);
              if (artistaResponse.ok) {
                const artista = await artistaResponse.json();
                return {
                  ...cancion,
                  artista: artista.nombre
                };
              }
              return { ...cancion, artista: 'Artista desconocido' };
            } catch {
              return { ...cancion, artista: 'Artista desconocido' };
            }
          })
        );

        // Obtener playlists del usuario
        const playlistsResponse = await fetch(`${API_BASE_URL}/Playlist`);
        let playlistsCreadas: Playlist[] = [];
        if (playlistsResponse.ok) {
          const allPlaylists = await playlistsResponse.json();
          // Filtrar playlists creadas por el usuario actual
          playlistsCreadas = allPlaylists.filter((playlist: any) => 
            playlist.creadorId === userId || playlist.creador?.userId === userId
          );
        }

        // Generar estadísticas simuladas basadas en datos reales
        const estadisticas = {
          totalCanciones: canciones.length,
          totalPlaylists: playlistsCreadas.length,
          tiempoEscuchado: this.calculateListeningTime(canciones),
          generoFavorito: this.getMostPopularGenre(artistasFavoritos)
        };

        this.profileData = {
          usuario,
          artistasFavoritos,
          cancionesMasEscuchadas: cancionesConArtista,
          playlistsCreadas,
          estadisticas
        };

      } catch (err: any) {
        this.error = err.message || 'Error al cargar el perfil';
        console.error('Error en fetchUserProfile:', err);
      } finally {
        this.loading = false;
      }
    },

    async updateUserProfile(userId: number, userData: Partial<Usuario>) {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch(`${API_BASE_URL}/Usuario/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData)
        });

        if (!response.ok) throw new Error('Error al actualizar perfil');

        // Actualizar datos locales
        if (this.profileData) {
          this.profileData.usuario = { ...this.profileData.usuario, ...userData };
        }

        return true;
      } catch (err: any) {
        this.error = err.message || 'Error al actualizar perfil';
        console.error('Error en updateUserProfile:', err);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async toggleFavoriteArtist(artistId: number) {
      // Simulación de agregar/quitar artista favorito
      if (this.profileData) {
        const index = this.profileData.artistasFavoritos.findIndex(a => a.cantanteId === artistId);
        if (index > -1) {
          this.profileData.artistasFavoritos.splice(index, 1);
        } else {
          try {
            const response = await fetch(`${API_BASE_URL}/Artista/${artistId}`);
            if (response.ok) {
              const artista = await response.json();
              this.profileData.artistasFavoritos.push(artista);
            }
          } catch (err) {
            console.error('Error al agregar artista favorito:', err);
          }
        }
      }
    },

    // Métodos auxiliares
    calculateListeningTime(canciones: any[]): string {
      let totalMinutes = 0;
      canciones.forEach(cancion => {
        if (cancion.duracion) {
          const parts = cancion.duracion.split(':');
          if (parts.length >= 2) {
            totalMinutes += parseInt(parts[0]) * 60 + parseInt(parts[1]);
          }
        }
      });
      
      const hours = Math.floor(totalMinutes / 60);
      return `${hours} horas`;
    },

    getMostPopularGenre(artistas: Artista[]): string {
      // Simulación basada en descripción del artista
      const genres = ['Pop', 'Rock', 'Hip Hop', 'Electrónica', 'Jazz', 'Clásica'];
      return genres[Math.floor(Math.random() * genres.length)];
    },

    formatDuration(duration: string): string {
      if (!duration) return '0:00';
      const parts = duration.split(':');
      if (parts.length >= 2) {
        return `${parts[1]}:${parts[2] || '00'}`;
      }
      return duration;
    },

    clearProfile() {
      this.profileData = null;
      this.error = null;
    }
  }
});