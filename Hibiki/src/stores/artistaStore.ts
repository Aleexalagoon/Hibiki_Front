import { defineStore } from 'pinia';
import { useAlbumStore } from './albumStore';
import { useRouter } from 'vue-router';

interface Artista {
  id?: number;
  nombre: string;
  oyentesMensuales?: number;
  descripcion?: string;
}

interface ArtistaState {
  allArtists: Artista[];
  selectedArtist: SelectedArtistData | null;
  loading: boolean;
  error: string | null;
}

interface SelectedArtistData {
  name: string;
  verified: boolean;
  monthlyListeners: number;
  description: string;
}

const API_BASE_URL = "http://aa0918044ca2b4e9b94f01593a2e67bf-1447626218.us-east-1.elb.amazonaws.com/api";

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