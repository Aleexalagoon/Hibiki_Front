import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface Song {
  nombre: string;
  artista: string;
  ruta: string;
  image: string;
  [key: string]: any; 
}

export const usePlayerStore = defineStore('player', () => {
  const isPlaying = ref<boolean>(false);
  const currentSong = ref<Song | null>(null);
  const currentTime = ref<number>(0);
  const duration = ref<number>(0);
  const audioPlayer = ref<HTMLAudioElement>(new Audio());
  const currentPlaylist = ref<Song[]>([]);
  const isUserInteracted = ref<boolean>(false);
  const volume = ref<number>(1); 


  const initializeAudioEvents = () => {
    audioPlayer.value.addEventListener('timeupdate', () => {
      currentTime.value = audioPlayer.value.currentTime;
    });
    
    audioPlayer.value.addEventListener('loadedmetadata', () => {
      duration.value = audioPlayer.value.duration;
    });
    
    audioPlayer.value.addEventListener('ended', () => {
      isPlaying.value = false;
      if (currentPlaylist.value && currentPlaylist.value.length > 0) {
        nextSong(currentPlaylist.value);
      }
    });

    document.addEventListener('click', () => {
      isUserInteracted.value = true;
    });
    
    audioPlayer.value.volume = volume.value;
  };
  
  initializeAudioEvents();
  
  const getArtistaDisplay = computed(() => {
    return currentSong.value?.artista || 
           currentSong.value?.artist || 
           (currentSong.value?.cantante?.nombre) || 
           "Artista desconocido";
  });
  

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
    
    const normalizedSong = normalizeSong(song);
    
    const wasPlaying = isPlaying.value;
    
    if (isPlaying.value) {
      audioPlayer.value.pause();
      isPlaying.value = false;
    }
    
    currentSong.value = normalizedSong;
    audioPlayer.value.src = normalizedSong.ruta;
    
    if (autoplay && (isUserInteracted.value || wasPlaying)) {
      playSong();
    } else {
      audioPlayer.value.load();
    }
  };
  
  const playSong = async () => {
    if (!currentSong.value) return;
    
    try {
      if (isUserInteracted.value) {
        await audioPlayer.value.play();
        isPlaying.value = true;
      } else {
        console.log('No se puede reproducir automáticamente: se requiere interacción del usuario');
        audioPlayer.value.load();
      }
    } catch (error) {
      console.error('Error al reproducir:', error);
      isPlaying.value = false;
    }
  };
  
  const togglePlay = () => {
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

    const normalizedSongs = songs.map(song => normalizeSong(song));

    currentPlaylist.value = normalizedSongs;
    
    const currentIndex = normalizedSongs.findIndex(song => 
      (song.cancionId && currentSong.value?.cancionId && song.cancionId === currentSong.value?.cancionId) || 
      song.nombre === currentSong.value?.nombre
    );
    
    if (currentIndex === -1) return;
    
    const newIndex = (currentIndex + indexChange + normalizedSongs.length) % normalizedSongs.length;
    setSong(normalizedSongs[newIndex], isPlaying.value);
  };
  
  const previousSong = (songs: Song[]) => {
    isUserInteracted.value = true;
    changeSong(-1, songs);
  };
  
  const nextSong = (songs: Song[]) => {
    isUserInteracted.value = true;
    changeSong(1, songs);
  };
  
  const randomSong = (songs: Song[]) => {
    isUserInteracted.value = true;
    
    if (!songs || songs.length <= 1 || !currentSong.value) return;
    
    const normalizedSongs = songs.map(song => normalizeSong(song));
    
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
    
    setSong(normalizedSongs[randomIndex], isPlaying.value);
  };
  
  const seek = (time: number) => {
    isUserInteracted.value = true;
    
    if (audioPlayer.value) {
      audioPlayer.value.currentTime = time;
      currentTime.value = time;
    }
  };
  
  const changeVolume = (newVolume: number) => {
    isUserInteracted.value = true;
    const volumeValue = Math.max(0, Math.min(1, newVolume));
    
    if (audioPlayer.value) {
      audioPlayer.value.volume = volumeValue;
    }
    
    volume.value = volumeValue;
  };
  
  const formatDuration = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return {
    isPlaying,
    currentSong,
    currentTime,
    duration,
    currentPlaylist,
    isUserInteracted,
    volume,
    audioPlayer,
    

    getArtistaDisplay,
    
    setSong,
    togglePlay,
    previousSong,
    nextSong,
    randomSong,
    seek,
    changeVolume,
    formatDuration,
    normalizeSong
  };
});