import { defineStore } from 'pinia';

export const useArtistaStore = defineStore('artista', {
  state: () => ({
    artista: {
      name: '',
      verified: false,
      monthlyListeners: '',
    },
    loading: false,
    error: null,
  }),

  actions: {
    async fetchArtistData(artistId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`https://localhost:7295/api/Artista`);
        if (!response.ok) {
          throw new Error('Error al obtener los datos del artista');
        }

        const data = await response.json();
        this.artista = {
          name: data.nombre,
          verified: true,
          monthlyListeners: data.oyentesMensuales,
        };
      } catch (err) {
        this.error = err.message;
        console.error('Error de red o servidor:', err);
      } finally {
        this.loading = false;
      }
    },
  },
});
