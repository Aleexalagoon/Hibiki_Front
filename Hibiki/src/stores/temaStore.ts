import { defineStore } from 'pinia';

// Interfaz para definir la estructura de un Tema
interface Tema {
  temaId: number;
  nombre: string;
  cancionId?: number;
  cantanteId?: number;
  albumId?: number;
  ruta?: string;
  image?: string;
  duracion?: string;
}

// Interfaz para el estado del store
interface TemaState {
  temas: Tema[];
  selectedTema: Tema | null;
  loading: boolean;
  error: string | null;
}

export const useTemaStore = defineStore('temaStore', {
  state: (): TemaState => ({
    temas: [],
    selectedTema: null,
    loading: false,
    error: null,
  }),

  actions: {
    // Solución alternativa si no existe el endpoint para temas por cantante
    async fetchTemasByCantante(cantanteId: number) {
      this.loading = true;
      this.error = null;
      try {
        // Si no tienes endpoint directo, primero obtenemos todos los temas
        const response = await fetch(`http://hibikimusicapi.retocsv.es/api/Tema`);
        if (!response.ok) {
          throw new Error('Error al obtener los temas');
        }
        
        const allTemas: Tema[] = await response.json();
        
        // Filtramos en el cliente los que pertenecen al cantante
        this.temas = allTemas.filter(tema => tema.cantanteId === cantanteId);
        
        if (this.temas.length === 0) {
          console.log(`No se encontraron temas para el cantante ID ${cantanteId}`);
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        this.error = errorMessage;
        console.error('Error al cargar los temas del artista:', err);
      } finally {
        this.loading = false;
      }
    },

    // Buscar temas por álbum
    async fetchTemasByAlbum(albumId: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`http://hibikimusicapi.retocsv.es/api/Tema/album/${albumId}`);
        if (!response.ok) {
          throw new Error('Error al obtener los temas del álbum');
        }
        const data: Tema[] = await response.json();
        this.temas = data;
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        this.error = errorMessage;
        console.error('Error al cargar los temas del álbum:', err);
      } finally {
        this.loading = false;
      }
    },

    // Seleccionar un tema específico
    setSelectedTema(tema: Tema) {
      this.selectedTema = tema;
    },

    // Limpiar la lista de temas
    clearTemas() {
      this.temas = [];
      this.selectedTema = null;
    }
  },
});