import { defineStore } from 'pinia';

interface Album {
  albumId: number;
  nombre: string;
  artista?: string;
  fechaLanzamiento?: string;
}

interface Cancion {
  id?: number;
  titulo: string;
  duracion?: string;
  albumId?: number;
}

interface AlbumState {
  albums: Album[];
  selectedAlbum: Album | null;
  songs: Cancion[];
  selectedSong: Cancion | null;
  error: string | null;
  loading: boolean;
}

const API_BASE_URL = "http://aa0918044ca2b4e9b94f01593a2e67bf-1447626218.us-east-1.elb.amazonaws.com/api";

export const useAlbumStore = defineStore('albumStore', {
  state: (): AlbumState => ({
    albums: [], 
    selectedAlbum: null, 
    songs: [], 
    selectedSong: null, 
    error: null,
    loading: false
  }),

  actions: {
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

    async fetchAlbumSongs(albumId: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_BASE_URL}/Cancion/ByAlbum/${albumId}`);
        if (!response.ok) {
          throw new Error(`Error en la API: ${response.statusText}`);
        }
        const data: Cancion[] = await response.json();

        this.songs = data;
        this.selectedAlbum = this.albums.find(album => album.albumId === albumId) || null;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Error en la API:', error);
        this.error = 'No se pudieron cargar las canciones del álbum';
      } finally {
        this.loading = false;
      }
    },


    clearSongs() {
      this.songs = [];
      this.selectedAlbum = null;
    },

    setSelectedSong(song: Cancion | null) {
      this.selectedSong = song;
    }
  }
});