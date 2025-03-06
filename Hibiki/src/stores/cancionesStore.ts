import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Ref } from 'vue';

interface Cancion {
  id?: number;
  titulo?: string;
  artista?: string;
}

// URL base para todas las solicitudes API
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const useCancionesStore = defineStore('canciones', () => {
  const canciones: Ref<Cancion[]> = ref([]);
  const loading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);

  const fetchCanciones = async (): Promise<void> => {
    loading.value = true;
    try {
      const response = await fetch(`${API_BASE_URL}/Cancion`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data: unknown = await response.json();
      console.log('Datos recibidos de la API:', data);

      if (Array.isArray(data)) {
        canciones.value = data as Cancion[];
      } else {
        throw new Error('La respuesta no es un array de canciones');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      error.value = `Error al obtener canciones: ${errorMessage}`;
      console.log(error.value);
    } finally {
      loading.value = false;
    }
  };

  return {
    canciones,
    loading,
    error,
    fetchCanciones,
  };
});