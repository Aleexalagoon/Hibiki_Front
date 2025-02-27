// store/playerStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// Definir el tipo para una canción
export interface Song {
  nombre: string;
  artista: string;
  ruta: string;
  image: string;
  [key: string]: any; // Para permitir propiedades adicionales
}

export const usePlayerStore = defineStore('player', () => {
  // Estado
  const isPlaying = ref<boolean>(false);
  const currentSong = ref<Song | null>(null);
  const currentTime = ref<number>(0);
  const duration = ref<number>(0);
  const audioPlayer = ref<HTMLAudioElement>(new Audio());
  const currentPlaylist = ref<Song[]>([]);
  const isUserInteracted = ref<boolean>(false);

  // Inicializar eventos del reproductor
  const initializeAudioEvents = () => {
    // Evento para actualizar el tiempo actual
    audioPlayer.value.addEventListener('timeupdate', () => {
      currentTime.value = audioPlayer.value.currentTime;
    });
    
    // Evento para cargar la duración cuando los metadatos están disponibles
    audioPlayer.value.addEventListener('loadedmetadata', () => {
      duration.value = audioPlayer.value.duration;
    });
    
    // Evento para manejar el final de la canción
    audioPlayer.value.addEventListener('ended', () => {
      isPlaying.value = false;
      // Auto-play next song when current song ends
      if (currentPlaylist.value && currentPlaylist.value.length > 0) {
        nextSong(currentPlaylist.value);
      }
    });

    // Registrar interacción del usuario
    document.addEventListener('click', () => {
      isUserInteracted.value = true;
    });
  };
  
  // Inicializar eventos al crear el store
  initializeAudioEvents();
  
  // Computed properties
  const getArtistaDisplay = computed(() => {
    // Check for artista in different possible formats
    return currentSong.value?.artista || 
           currentSong.value?.artist || 
           (currentSong.value?.cantante?.nombre) || 
           "Artista desconocido";
  });
  
  // Función para normalizar una canción y asegurar que tenga todos los campos necesarios
  const normalizeSong = (song: any): Song => {
    return {
      ...song,
      nombre: song.nombre || song.title || 'Unknown',
      artista: song.artista || song.artist || (song.cantante?.nombre) || 'Artista desconocido',
      ruta: song.ruta || song.path || `/music/${song.cancionId}.mp3`,
      image: song.image || song.coverImage || '/images/default-cover.jpg'
    };
  };
  
  // Funciones
  const setSong = (song: Song | null, autoplay = true) => {
    if (!song) return;
    
    // Normalizar la canción para asegurar que tenga todos los campos necesarios
    const normalizedSong = normalizeSong(song);
    
    // Guardar estado de reproducción actual
    const wasPlaying = isPlaying.value;
    
    // Pausar reproducción actual si está reproduciéndose
    if (isPlaying.value) {
      audioPlayer.value.pause();
      isPlaying.value = false;
    }
    
    // Actualizar canción actual
    currentSong.value = normalizedSong;
    audioPlayer.value.src = normalizedSong.ruta;
    
    // Solo intentar reproducir si autoplay es true y el usuario ha interactuado o estaba reproduciendo
    if (autoplay && (isUserInteracted.value || wasPlaying)) {
      playSong();
    } else {
      // Precargar audio sin reproducirlo
      audioPlayer.value.load();
    }
  };
  
  const playSong = async () => {
    if (!currentSong.value) return;
    
    try {
      // Solo intentar reproducir si el usuario ha interactuado
      if (isUserInteracted.value) {
        await audioPlayer.value.play();
        isPlaying.value = true;
      } else {
        console.log('No se puede reproducir automáticamente: se requiere interacción del usuario');
        // Preparar audio, pero no reproducir
        audioPlayer.value.load();
      }
    } catch (error) {
      console.error('Error al reproducir:', error);
      isPlaying.value = false;
    }
  };
  
  const togglePlay = () => {
    // Marcar que el usuario ha interactuado
    isUserInteracted.value = true;
    
    if (isPlaying.value) {
      audioPlayer.value.pause();
      isPlaying.value = false;
    } else {
      playSong();
    }
  };
  
  const changeSong = (indexChange: number, songs: Song[]) => {
    if (!songs?.length || !currentSong.value) return;
    
    // Normalizar todas las canciones en la playlist
    const normalizedSongs = songs.map(song => normalizeSong(song));
    
    // Update current playlist
    currentPlaylist.value = normalizedSongs;
    
    const currentIndex = normalizedSongs.findIndex(song => 
      // Compare by ID or name depending on your data structure
      (song.cancionId && currentSong.value?.cancionId && song.cancionId === currentSong.value?.cancionId) || 
      song.nombre === currentSong.value?.nombre
    );
    
    if (currentIndex === -1) return;
    
    const newIndex = (currentIndex + indexChange + normalizedSongs.length) % normalizedSongs.length;
    // Pasar el estado actual de reproducción
    setSong(normalizedSongs[newIndex], isPlaying.value);
  };
  
  const previousSong = (songs: Song[]) => {
    // Marcar que el usuario ha interactuado
    isUserInteracted.value = true;
    changeSong(-1, songs);
  };
  
  const nextSong = (songs: Song[]) => {
    // Marcar que el usuario ha interactuado
    isUserInteracted.value = true;
    changeSong(1, songs);
  };
  
  const randomSong = (songs: Song[]) => {
    // Marcar que el usuario ha interactuado
    isUserInteracted.value = true;
    
    if (!songs || songs.length <= 1 || !currentSong.value) return;
    
    // Normalizar todas las canciones en la playlist
    const normalizedSongs = songs.map(song => normalizeSong(song));
    
    // Update current playlist
    currentPlaylist.value = normalizedSongs;
    
    let randomIndex: number;
    do {
      randomIndex = Math.floor(Math.random() * normalizedSongs.length);
    } while (
      normalizedSongs.length > 1 && 
      ((normalizedSongs[randomIndex].cancionId && currentSong.value?.cancionId && 
        normalizedSongs[randomIndex].cancionId === currentSong.value?.cancionId) || 
       normalizedSongs[randomIndex].nombre === currentSong.value?.nombre)
    );
    
    // Pasar el estado actual de reproducción
    setSong(normalizedSongs[randomIndex], isPlaying.value);
  };
  
  const seek = (time: number) => {
    // Marcar que el usuario ha interactuado
    isUserInteracted.value = true;
    
    if (audioPlayer.value) {
      audioPlayer.value.currentTime = time;
      currentTime.value = time;
    }
  };
  
  const formatDuration = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return {
    // Estado
    isPlaying,
    currentSong,
    currentTime,
    duration,
    currentPlaylist,
    isUserInteracted,
    
    // Getters
    getArtistaDisplay,
    
    // Acciones
    setSong,
    togglePlay,
    previousSong,
    nextSong,
    randomSong,
    seek,
    formatDuration,
    normalizeSong
  };
});