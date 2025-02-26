// store/playerStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// Definir el tipo para una canción
export interface Song {
  nombre: string;
  artista: string;
  ruta: string;
  image: string;
}

export const usePlayerStore = defineStore('player', () => {
  // Estado
  const isPlaying = ref<boolean>(false);
  const currentSong = ref<Song | null>(null);
  const currentTime = ref<number>(0);
  const duration = ref<number>(0);
  const audioPlayer = ref<HTMLAudioElement>(new Audio());
  
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
    });
  };
  
  // Inicializar eventos al crear el store
  initializeAudioEvents();
  
  // Computed properties
  const getArtistaDisplay = computed(() => {
    return currentSong.value?.artista || "Artista desconocido";
  });
  
  // Funciones
  const setSong = (song: Song | null) => {
    if (!song) return;
    currentSong.value = song;
    audioPlayer.value.src = song.ruta;
    playSong();
  };
  
  const playSong = async () => {
    try {
      await audioPlayer.value.play();
      isPlaying.value = true;
    } catch (error) {
      console.error('Error al reproducir:', error);
      isPlaying.value = false;
    }
  };
  
  const togglePlay = () => {
    if (isPlaying.value) {
      audioPlayer.value.pause();
    } else {
      playSong();
    }
    isPlaying.value = !isPlaying.value;
  };
  
  const changeSong = (indexChange: number, songs: Song[]) => {
    if (!songs?.length || !currentSong.value) return;
    
    const currentIndex = songs.findIndex(({ nombre }) => nombre === currentSong.value?.nombre);
    if (currentIndex === -1) return;
    
    const newIndex = (currentIndex + indexChange + songs.length) % songs.length;
    setSong(songs[newIndex]);
  };
  
  const previousSong = (songs: Song[]) => {
    changeSong(-1, songs);
  };
  
  const nextSong = (songs: Song[]) => {
    changeSong(1, songs);
  };
  
  const randomSong = (songs: Song[]) => {
    if (!songs || songs.length <= 1 || !currentSong.value) return;
    
    let randomIndex: number;
    do {
      randomIndex = Math.floor(Math.random() * songs.length);
    } while (songs[randomIndex].nombre === currentSong.value?.nombre);
    
    setSong(songs[randomIndex]);
  };
  
  const seek = (time: number) => {
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
    
    // Getters
    getArtistaDisplay,
    
    // Acciones
    setSong,
    togglePlay,
    previousSong,
    nextSong,
    randomSong,
    seek,
    formatDuration
  };
});