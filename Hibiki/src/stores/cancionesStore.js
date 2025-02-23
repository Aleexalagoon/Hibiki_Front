
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCancionesStore = defineStore('canciones', () => {
  const canciones = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchCanciones = async () => {
    loading.value = true;
    try {
      const response = await fetch('https://localhost:7295/api/Cancion');
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Datos recibidos de la API:', data);

      if (Array.isArray(data)) {
        canciones.value = data;
      } else {
        throw new Error('La respuesta no es un array de canciones');
      }
    } catch (err) {
      error.value = `Error al obtener canciones: ${err.message}`;
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
