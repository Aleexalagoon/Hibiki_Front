import { defineStore } from 'pinia';
import { useAlbumStore } from './albumStore';
import { useRouter } from 'vue-router';

// Interfaz para definir la estructura de un Artista
interface Artista {
  id?: number;
  nombre: string;
  oyentesMensuales?: number;
  descripcion?: string;
}

// Interfaz para el estado del store
interface ArtistaState {
  allArtists: Artista[];
  selectedArtist: SelectedArtistData | null;
  loading: boolean;
  error: string | null;
}

// Interfaz para los datos del artista seleccionado
interface SelectedArtistData {
  name: string;
  verified: boolean;
  monthlyListeners: number;
  description: string;
}

// URL base para todas las solicitudes API
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const useArtistaStore = defineStore('artistaStore', {
  state: (): ArtistaState => ({
    allArtists: [],
    selectedArtist: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchAllArtists() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_BASE_URL}/Artista`);
        if (!response.ok) {
          throw new Error('Error al obtener los artistas');
        }
        const data: Artista[] = await response.json();
        this.allArtists = data;
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        this.error = errorMessage;
        console.error('Error de red o servidor:', err);
      } finally {
        this.loading = false;
      }
    },

    async fetchArtistData(artistId: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_BASE_URL}/Artista/${artistId}`);
        if (!response.ok) {
          throw new Error('Error al obtener los datos del artista');
        }
        const data: Artista = await response.json();

        this.selectedArtist = {
          name: data.nombre,
          verified: true,
          monthlyListeners: data.oyentesMensuales || 0,
          description: data.descripcion || '',
        };

        const albumStore = useAlbumStore();
        albumStore.fetchAlbumsByArtist(artistId);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        this.error = errorMessage;
        console.error('Error de red o servidor:', err);
      } finally {
        this.loading = false;
      }
    },

    navigateToArtist(artistId: number) {
      const router = useRouter();
      router.push(`/artista/${artistId}`);
    }
  },
});