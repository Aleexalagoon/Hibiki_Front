import { defineStore } from 'pinia';

// Interfaz para definir la estructura de un Álbum
interface Album {
  albumId: number;
  nombre: string;
  artista?: string;
  fechaLanzamiento?: string;
  // Añade otras propiedades según tu modelo de datos
}

// Interfaz para definir la estructura de una Canción
interface Cancion {
  id?: number;
  titulo: string;
  duracion?: string;
  albumId?: number;
  // Añade otras propiedades según tu modelo de datos
}

// Interfaz para el estado del store
interface AlbumState {
  albums: Album[];
  selectedAlbum: Album | null;
  songs: Cancion[];
  selectedSong: Cancion | null;
  error: string | null;
  loading: boolean;
}

// URL base para todas las solicitudes API
const API_BASE_URL = "http://aa0918044ca2b4e9b94f01593a2e67bf-1447626218.us-east-1.elb.amazonaws.com/api";

export const useAlbumStore = defineStore('albumStore', {
  state: (): AlbumState => ({
    albums: [], // Lista de álbumes del artista seleccionado
    selectedAlbum: null, // Álbum seleccionado
    songs: [], // Canciones del álbum seleccionado
    selectedSong: null, // Canción seleccionada
    error: null,
    loading: false
  }),

  actions: {
    // Obtener álbumes de un artista específico
    async fetchAlbumsByArtist(artistId: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_BASE_URL}/Album/ByArtist/${artistId}`);
        if (!response.ok) {
          throw new Error(`Error en la API: ${response.statusText}`);
        }
        const data: Album[] = await response.json();
        this.albums = data;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Error en la API:', error);
        this.error = 'No se pudieron cargar los álbumes del artista';
      } finally {
        this.loading = false;
      }
    },

    // Obtener canciones de un álbum seleccionado
    async fetchAlbumSongs(albumId: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_BASE_URL}/Cancion/ByAlbum/${albumId}`);
        if (!response.ok) {
          throw new Error(`Error en la API: ${response.statusText}`);
        }
        const data: Cancion[] = await response.json();

        // Aquí solo actualizamos las canciones, no necesitamos buscar el álbum si ya está cargado
        this.songs = data;
        // Si deseas, puedes actualizar el álbum seleccionado también:
        this.selectedAlbum = this.albums.find(album => album.albumId === albumId) || null;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Error en la API:', error);
        this.error = 'No se pudieron cargar las canciones del álbum';
      } finally {
        this.loading = false;
      }
    },

    // Limpiar las canciones cuando se cambie de artista
    clearSongs() {
      this.songs = [];
      this.selectedAlbum = null;
    },

    // Establecer la canción seleccionada
    setSelectedSong(song: Cancion | null) {
      this.selectedSong = song;
    }
  }
});