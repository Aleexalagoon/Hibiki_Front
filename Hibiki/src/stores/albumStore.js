import { defineStore } from 'pinia';

export const useAlbumStore = defineStore('albumStore', {
  state: () => ({
    albums: [], // Lista de álbumes del artista seleccionado
    selectedAlbum: null, // Álbum seleccionado
    songs: [], // Canciones del álbum seleccionado
    error: null,
    loading: false
  }),

  actions: {
    // Obtener álbumes de un artista específico
    async fetchAlbumsByArtist(artistId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`https://localhost:7295/api/Album/ByArtist/${artistId}`);
        if (!response.ok) {
          throw new Error(`Error en la API: ${response.statusText}`);
        }
        this.albums = await response.json();
      } catch (error) {
        console.error('Error en la API:', error);
        this.error = 'No se pudieron cargar los álbumes del artista';
      } finally {
        this.loading = false;
      }
    },

    // Obtener canciones de un álbum seleccionado
    async fetchAlbumSongs(albumId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`https://localhost:7295/api/Cancion/ByAlbum/${albumId}`);
        if (!response.ok) {
          throw new Error(`Error en la API: ${response.statusText}`);
        }
        const data = await response.json();

        // Aquí solo actualizamos las canciones, no necesitamos buscar el álbum si ya está cargado
        this.songs = data;
        // Si deseas, puedes actualizar el álbum seleccionado también:
        this.selectedAlbum = this.albums.find(album => album.albumId === albumId) || null;
      } catch (error) {
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

      setSelectedSong(song) {
        this.selectedSong = song;
      }
    
    
  }
});