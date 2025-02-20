import { defineStore } from 'pinia';

export const useAlbumStore = defineStore('albumStore', {
  state: () => ({
    albums: [],
    error: null,
    loading: false
  }),
  actions: {
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
    }
  }
});
