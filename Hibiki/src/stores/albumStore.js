import { defineStore } from 'pinia';

export const useAlbumStore = defineStore('albumStore', {
  state: () => ({
    albums: [], // Lista de álbumes del artista seleccionado
    error: null,
    loading: false
  }),

  actions: {
    // Obtener todos los álbumes
    async fetchAlbums() {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch('https://localhost:7295/api/Album');
        if (!response.ok) {
          throw new Error(`Error en la API: ${response.statusText}`);
        }
        this.albums = await response.json();
      } catch (error) {
        console.error('Error en la API:', error);
        this.error = 'No se pudieron cargar los álbumes';
      } finally {
        this.loading = false;
      }
    },

    // Obtener álbumes de un artista en específico
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
    }
  }
});
