import { defineStore } from 'pinia';
import { useAlbumStore } from './albumStore'; // Importamos el store de álbumes

export const useArtistaStore = defineStore('artistaStore', {
  state: () => ({
    allArtists: [], // Lista de artistas
    selectedArtist: null, // Artista seleccionado
    loading: false,
    error: null,
  }),

  actions: {
    // Obtener todos los artistas
    async fetchAllArtists() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch('https://localhost:7295/api/Artista');
        if (!response.ok) {
          throw new Error('Error al obtener los artistas');
        }
        this.allArtists = await response.json();
      } catch (err) {
        this.error = err.message;
        console.error('Error de red o servidor:', err);
      } finally {
        this.loading = false;
      }
    },

    // Obtener información del artista seleccionado
    async fetchArtistData(artistId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`https://localhost:7295/api/Artista/${artistId}`);
        if (!response.ok) {
          throw new Error('Error al obtener los datos del artista');
        }
        const data = await response.json();

        this.selectedArtist = {
          name: data.nombre,
          verified: true,
          monthlyListeners: data.oyentesMensuales,
        };

        // Llamar a albumStore para cargar los álbumes del artista seleccionado
        const albumStore = useAlbumStore();
        albumStore.fetchAlbumsByArtist(artistId);
      } catch (err) {
        this.error = err.message;
        console.error('Error de red o servidor:', err);
      } finally {
        this.loading = false;
      }
    },
  },
});
