// store/playerStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// Definir el tipo para una canción (actualizado con letra)
export interface Song {
  nombre: string;
  artista: string;
  ruta: string;
  image: string;
  videoUrl?: string; // Campo para videoclips MP4
  videoclip?: string; // Campo para videoclips de YouTube
  letra?: string; // NUEVO: Campo para la letra de la canción
  [key: string]: any; // Para permitir propiedades adicionales
}

export const usePlayerStore = defineStore('player', () => {
  // Estado existente
  const isPlaying = ref<boolean>(false);
  const currentSong = ref<Song | null>(null);
  const currentTime = ref<number>(0);
  const duration = ref<number>(0);
  const audioPlayer = ref<HTMLAudioElement>(new Audio());
  const currentPlaylist = ref<Song[]>([]);
  const isUserInteracted = ref<boolean>(false);
  const volume = ref<number>(1);

  // Estado para video
  const showVideo = ref<boolean>(false);
  const currentVideoUrl = ref<string | null>(null);
  const isVideoMode = ref<boolean>(false);

  // Inicializar eventos del reproductor (mantienes tu lógica existente)
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
    
    // Establecer el volumen inicial
    audioPlayer.value.volume = volume.value;
  };
  
  // Inicializar eventos al crear el store
  initializeAudioEvents();
  
  // Computed properties existentes
  const getArtistaDisplay = computed(() => {
    // Check for artista in different possible formats
    return currentSong.value?.artista || 
           currentSong.value?.artist || 
           (currentSong.value?.cantante?.nombre) || 
           "Artista desconocido";
  });

  // Computed properties para video
  const hasVideo = computed(() => !!currentSong.value?.videoUrl || !!currentSong.value?.videoclip);
  
  const canShowVideo = computed(() => 
    hasVideo.value && isVideoMode.value
  );

  // NUEVO: Computed property para letra
  const hasLyrics = computed(() => 
    !!currentSong.value?.letra && currentSong.value.letra.trim() !== ''
  );
  
  // Función para normalizar una canción (actualizada con letra)
  const normalizeSong = (song: any): Song => {
    return {
      ...song,
      nombre: song.nombre || song.title || 'Unknown',
      artista: song.artista || song.artist || (song.cantante?.nombre) || 'Artista desconocido',
      ruta: song.ruta || song.path || `/music/${song.cancionId}.mp3`,
      image: song.image || song.coverImage || '/images/default-cover.jpg',
      videoUrl: song.videoUrl || song.video_url || null, // Video MP4
      videoclip: song.videoclip || song.youtube_url || null, // Video YouTube
      letra: song.letra || song.lyrics || null // NUEVO: Normalizar letra
    };
  };
  
  // Función setSong actualizada para manejar letra
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
    
    // Configurar video
    currentVideoUrl.value = normalizedSong.videoUrl || normalizedSong.videoclip || null;
    showVideo.value = isVideoMode.value && !!(normalizedSong.videoUrl || normalizedSong.videoclip);
    
    // Solo intentar reproducir si autoplay es true y el usuario ha interactuado o estaba reproduciendo
    if (autoplay && (isUserInteracted.value || wasPlaying)) {
      playSong();
    } else {
      // Precargar audio sin reproducirlo
      audioPlayer.value.load();
    }
  };
  
  // Mantener todas tus funciones existentes sin cambios
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
  
  // Función para cambiar el volumen (mantienes tu lógica)
  const changeVolume = (newVolume: number) => {
    // Marcar que el usuario ha interactuado
    isUserInteracted.value = true;
    
    // Asegurar que el volumen esté entre 0 y 1
    const volumeValue = Math.max(0, Math.min(1, newVolume));
    
    // Actualizar el volumen del reproductor
    if (audioPlayer.value) {
      audioPlayer.value.volume = volumeValue;
    }
    
    // Actualizar el estado
    volume.value = volumeValue;
  };

  // Funciones para manejar video
  const toggleVideoMode = () => {
    isUserInteracted.value = true;
    isVideoMode.value = !isVideoMode.value;
    showVideo.value = isVideoMode.value && !!(currentSong.value?.videoUrl || currentSong.value?.videoclip);
  };

  const setShowVideo = (show: boolean) => {
    if (hasVideo.value) {
      showVideo.value = show;
    }
  };

  const toggleVideo = () => {
    if (hasVideo.value) {
      showVideo.value = !showVideo.value;
    }
  };
  
  // Mantener tu función existente
  const formatDuration = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return {
    // Estado existente
    isPlaying,
    currentSong,
    currentTime,
    duration,
    currentPlaylist,
    isUserInteracted,
    volume,
    audioPlayer,
    
    // Estado de video
    showVideo,
    currentVideoUrl,
    isVideoMode,
    
    // Getters existentes
    getArtistaDisplay,
    
    // Getters de video y letra
    hasVideo,
    canShowVideo,
    hasLyrics, // NUEVO: Getter para saber si tiene letra
    
    // Acciones existentes
    setSong,
    togglePlay,
    previousSong,
    nextSong,
    randomSong,
    seek,
    changeVolume,
    formatDuration,
    normalizeSong,
    
    // Acciones de video
    toggleVideoMode,
    setShowVideo,
    toggleVideo
  };
});