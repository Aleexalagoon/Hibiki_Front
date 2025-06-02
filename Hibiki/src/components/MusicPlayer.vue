<template>
  <div v-if="playerStore.currentSong" class="music-player" :class="{ 'minimized': isMinimized, 'with-video': playerStore.showVideo }">
    <div class="player-content">
      <div class="player-info">
        <img 
          :src="playerStore.currentSong?.image || 'default-cover.jpg'" 
          alt="Cover" 
          class="song-cover" 
          @click="openImageModal"
          style="cursor: pointer;"
        />
        <div class="song-details">
          <h3 class="song-title">{{ playerStore.currentSong?.nombre || playerStore.currentSong?.titulo || 'Selecciona una canción' }}</h3>
          <p class="song-time">{{ playerStore.formatDuration(playerStore.currentTime) }} / {{ playerStore.formatDuration(playerStore.duration) }}</p>
        </div>
      </div>

      <div class="controls">
        <button @click="previousSong" aria-label="Canción anterior">⥢</button>
        <button @click="togglePlay" :aria-label="playerStore.isPlaying ? 'Pausar' : 'Reproducir'" 
                class="play-button">{{ playerStore.isPlaying ? '⥮' : '▶' }}</button>
        <button @click="nextSong" aria-label="Siguiente canción">⥤</button>
        <button @click="randomSong" aria-label="Reproducir aleatoriamente">⤨</button>

        <!-- Botón de video (solo si la canción tiene video MP4 o YouTube) -->
        <button 
          v-if="playerStore.currentSong?.videoUrl || playerStore.currentSong?.videoclip" 
          @click="toggleVideo" 
          :class="{ 'active': playerStore.showVideo }"
          class="video-button"
          :aria-label="playerStore.showVideo ? 'Cerrar video' : 'Ver video'">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="6" width="14" height="10" rx="2" ry="2"/>
                  <polygon points="16,10 22,6 22,16"/>
                  <circle cx="9" cy="11" r="3"/>
                  <circle cx="9" cy="11" r="1"/>
              </svg>
        </button>
        <!-- NUEVO: Botón de letra -->
        <button 
          v-if="playerStore.currentSong?.letra" 
          @click="toggleLyrics" 
          :class="{ 'active': showLyrics }"
          class="lyrics-button"
          :aria-label="showLyrics ? 'Ocultar letra' : 'Ver letra'">
          ✎
        </button>

        <!-- Control de volumen con iconos -->
        <div class="volume-container">
          <button @click="toggleMute" class="volume-icon" aria-label="Silenciar">
            {{ volumeIcon }}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="playerStore.volume"
            @input="changeVolume"
            class="volume-control"
            aria-label="Volumen"
          />
        </div>
      </div>

      <div class="progress-container">
        <input
          type="range"
          :value="playerStore.currentTime"
          @input="seek"
          min="0"
          :max="playerStore.duration || 1"
          class="progress-bar"
        />
      </div>
    </div>

    <button @click="isMinimized = !isMinimized" class="minimize-button">
      {{ isMinimized ? '▲' : '▼' }}
    </button>

    <!-- NUEVO: Modal de letra -->
    <div v-if="showLyrics" class="lyrics-modal" @click="closeLyrics">
      <div class="lyrics-content" @click.stop>
        <div class="lyrics-header">
          <div class="lyrics-song-info">
            <img 
              :src="playerStore.currentSong?.image || 'default-cover.jpg'" 
              alt="Cover" 
              class="lyrics-cover"
            />
            <div class="lyrics-details">
              <h2 class="lyrics-song-title">{{ playerStore.currentSong?.nombre || playerStore.currentSong?.titulo }}</h2>
              <p class="lyrics-artist">{{ playerStore.getArtistaDisplay }}</p>
            </div>
          </div>
          <button class="close-lyrics-button" @click="closeLyrics">×</button>
        </div>
        
        <div class="lyrics-body">
          <div class="lyrics-text">
            <pre>{{ playerStore.currentSong?.letra || 'Letra no disponible' }}</pre>
          </div>
        </div>

        <div class="lyrics-controls">
          <button @click="previousSong" aria-label="Canción anterior" class="lyrics-control-btn">⥢</button>
          <button @click="togglePlay" :aria-label="playerStore.isPlaying ? 'Pausar' : 'Reproducir'" 
                  class="lyrics-play-button">{{ playerStore.isPlaying ? '⥮' : '▶' }}</button>
          <button @click="nextSong" aria-label="Siguiente canción" class="lyrics-control-btn">⥤</button>
          
          <!-- Botón de video en las letras -->
          <button 
            v-if="playerStore.currentSong?.videoUrl || playerStore.currentSong?.videoclip" 
            @click="toggleVideo" 
            :class="{ 'active': playerStore.showVideo }"
            class="lyrics-video-btn"
            :aria-label="playerStore.showVideo ? 'Cerrar video' : 'Ver video'">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="6" width="14" height="10" rx="2" ry="2"/>
                  <polygon points="16,10 22,6 22,16"/>
                  <circle cx="9" cy="11" r="3"/>
                  <circle cx="9" cy="11" r="1"/>
              </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de imagen -->
    <div v-if="showImageModal" class="image-modal" @click="closeImageModal">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="closeImageModal">×</button>
        <div class="modal-image-container">
          <img 
            :src="playerStore.currentSong?.image || 'default-cover.jpg'" 
            alt="Cover" 
            class="modal-image"
          />
        </div>
        <div class="modal-info">
          <h2 class="modal-song-title">{{ playerStore.currentSong?.nombre || playerStore.currentSong?.titulo || 'Selecciona una canción' }}</h2>
          <div class="modal-controls">
            <button @click="previousSong" aria-label="Canción anterior" class="modal-control-btn">⥢</button>
            <button @click="togglePlay" :aria-label="playerStore.isPlaying ? 'Pausar' : 'Reproducir'" 
                    class="modal-play-button">{{ playerStore.isPlaying ? '⥮' : '▶' }}</button>
            <button @click="nextSong" aria-label="Siguiente canción" class="modal-control-btn">⥤</button>
            
            <!-- Botón de video en el modal -->
            <button 
              v-if="playerStore.currentSong?.videoUrl || playerStore.currentSong?.videoclip" 
              @click="toggleVideo" 
              :class="{ 'active': playerStore.showVideo }"
              class="modal-video-btn"
              :aria-label="playerStore.showVideo ? 'Cerrar video' : 'Ver video'">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="6" width="14" height="10" rx="2" ry="2"/>
                  <polygon points="16,10 22,6 22,16"/>
                  <circle cx="9" cy="11" r="3"/>
                  <circle cx="9" cy="11" r="1"/>
              </svg>
            </button>

            <!-- NUEVO: Botón de letra en el modal de imagen -->
            <button 
              v-if="playerStore.currentSong?.letra" 
              @click="toggleLyrics" 
              :class="{ 'active': showLyrics }"
              class="modal-lyrics-btn"
              :aria-label="showLyrics ? 'Ocultar letra' : 'Ver letra'">
              📝
            </button>
          </div>
          <div class="modal-progress">
            <span class="time-display">{{ playerStore.formatDuration(playerStore.currentTime) }}</span>
            <input
              type="range"
              :value="playerStore.currentTime"
              @input="seek"
              min="0"
              :max="playerStore.duration || 1"
              class="modal-progress-bar"
            />
            <span class="time-display">{{ playerStore.formatDuration(playerStore.duration) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="!playerStore.isUserInteracted" class="music-player-placeholder" :class="{ 'with-video': playerStore.showVideo }" @click="handleFirstInteraction">
    <p>Haz clic aquí para activar el reproductor de música</p>
  </div>
</template>

<script>
import { usePlayerStore } from '@/stores/player';
import { useAlbumStore } from '@/stores/albumStore';
import { ref, watch, onMounted, computed } from "vue";

export default {
  props: {
    song: {
      type: Object,
      default: () => null,
    },
    songs: {
      type: Array,
      default: () => [],
    },
    cantantes: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const playerStore = usePlayerStore();
    const albumStore = useAlbumStore();
    const isMinimized = ref(false);
    const prevVolume = ref(1); // Para recordar el volumen antes de silenciar
    const showImageModal = ref(false); // Estado del modal
    const showLyrics = ref(false); // NUEVO: Estado del modal de letra

    // Computed property para el icono de volumen
    const volumeIcon = computed(() => {
      if (playerStore.volume === 0) return "🔇"; // Silenciado
      if (playerStore.volume < 0.3) return "🔈"; // Volumen bajo
      if (playerStore.volume < 0.7) return "🔉"; // Volumen medio
      return "🔊"; // Volumen alto
    });

    // Computed property to get songs from both props and albumStore
    const availableSongs = computed(() => {
      if (props.songs && props.songs.length > 0) {
        return props.songs;
      }
      if (albumStore.songs && albumStore.songs.length > 0) {
        return albumStore.songs;
      }
      return [];
    });

    // Funciones para el modal de imagen
    const openImageModal = () => {
      showImageModal.value = true;
      document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    };

    const closeImageModal = () => {
      showImageModal.value = false;
      document.body.style.overflow = 'unset';
    };

    // NUEVAS: Funciones para el modal de letra
    const toggleLyrics = () => {
      showLyrics.value = !showLyrics.value;
      if (showLyrics.value) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    };

    const closeLyrics = () => {
      showLyrics.value = false;
      document.body.style.overflow = 'unset';
    };

    // Función para manejar la primera interacción del usuario
    const handleFirstInteraction = () => {
      if (availableSongs.value.length > 0 && !playerStore.currentSong) {
        playerStore.setSong(availableSongs.value[0], false);
      }
    };

    // Watch for song prop change
    watch(
      () => props.song,
      (newSong) => {
        if (newSong) playerStore.setSong(newSong, playerStore.isUserInteracted);
      },
      { deep: true }
    );

    // Watch for songs list change and set the first song if not set
    watch(
      () => props.songs,
      (newSongs) => {
        if (!playerStore.currentSong && newSongs?.length && playerStore.isUserInteracted) {
          playerStore.setSong(newSongs[0], false);
        }
      },
      { deep: true }
    );

    // Watch for album songs change
    watch(
      () => albumStore.songs,
      (newSongs) => {
        if (!playerStore.currentSong && newSongs?.length && playerStore.isUserInteracted) {
          playerStore.setSong(newSongs[0], false);
        }
      },
      { deep: true }
    );

    // NUEVO: Watch para cerrar la letra cuando cambie la canción
    watch(
      () => playerStore.currentSong,
      () => {
        showLyrics.value = false;
        document.body.style.overflow = 'unset';
      }
    );

    // If a song is provided as a prop, set it
    onMounted(() => {
      if (props.song && playerStore.isUserInteracted) {
        playerStore.setSong(props.song, false);
      } else if (props.songs?.length && !playerStore.currentSong && playerStore.isUserInteracted) {
        playerStore.setSong(props.songs[0], false);
      } else if (albumStore.songs?.length && !playerStore.currentSong && playerStore.isUserInteracted) {
        playerStore.setSong(albumStore.songs[0], false);
      }
    });

    // Función para actualizar el volumen del reproductor
    const changeVolume = (event) => {
      const newVolume = parseFloat(event.target.value);
      playerStore.changeVolume(newVolume);
    };

    // Función para silenciar/desilenciar
    const toggleMute = () => {
      if (playerStore.volume > 0) {
        // Guardar el volumen actual antes de silenciar
        prevVolume.value = playerStore.volume;
        playerStore.changeVolume(0);
      } else {
        // Restaurar el volumen anterior
        playerStore.changeVolume(prevVolume.value);
      }
    };

    // Toggle play/pause
    const togglePlay = () => {
      playerStore.togglePlay();
    };

    // Toggle video mode
    const toggleVideo = () => {
      if (playerStore.currentSong?.videoUrl || playerStore.currentSong?.videoclip) {
        playerStore.showVideo = !playerStore.showVideo;
      }
    };

    // Change the song (next/previous)
    const previousSong = () => {
      playerStore.previousSong(availableSongs.value);
    };

    const nextSong = () => {
      playerStore.nextSong(availableSongs.value);
    };

    // Play a random song
    const randomSong = () => {
      playerStore.randomSong(availableSongs.value);
    };

    // Seek to a specific time in the song
    const seek = (event) => {
      const time = parseFloat(event.target.value);
      playerStore.seek(time);
    };

    return {
      playerStore,
      albumStore,
      togglePlay,
      toggleVideo,
      previousSong,
      nextSong,
      randomSong,
      seek,
      isMinimized,
      availableSongs,
      handleFirstInteraction,
      changeVolume,
      toggleMute,
      volumeIcon,
      showImageModal,
      openImageModal,
      closeImageModal,
      // NUEVAS funciones de letra
      showLyrics,
      toggleLyrics,
      closeLyrics
    };
  },
};
</script>

<style scoped>
.music-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #181818;
  color: white;
  padding: 8px 15px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  transition: all 0.3s ease;
  max-height: 70px; 
}

/* NUEVO: Clase para cuando el video está visible */
.music-player.with-video {
  right: 400px; /* Deja espacio para el panel de video */
}

/* NUEVO: Responsive para el reproductor con video */
@media screen and (max-width: 1200px) {
  .music-player.with-video {
    right: 350px; /* Menos espacio en pantallas medianas */
  }
}

@media screen and (max-width: 768px) {
  .music-player.with-video {
    right: 0; /* En móvil, mantener ancho completo */
  }
}

.music-player-placeholder {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #181818;
  color: white;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
}

/* NUEVO: Placeholder también se estrecha con video */
.music-player-placeholder.with-video {
  right: 400px;
}

@media screen and (max-width: 1200px) {
  .music-player-placeholder.with-video {
    right: 350px;
  }
}

@media screen and (max-width: 768px) {
  .music-player-placeholder.with-video {
    right: 0;
  }
}

.music-player-placeholder:hover {
  background: #2a2a2a;
}

.music-player.minimized {
  max-height: 30px;
  padding: 5px 15px;
}

.player-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.minimized .player-content {
  justify-content: center;
}

.player-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.minimized .player-info {
  display: none;
}

.song-cover {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  margin-right: 15px;
  transition: transform 0.2s ease;
}

.song-cover:hover {
  transform: scale(1.05);
}

.song-details {
  text-align: left;
  max-width: 200px;
  overflow: hidden;
}

.song-title {
  margin: 0;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color:white;
}

.song-time {
  margin: 3px 0;
  font-size: 0.7rem;
  opacity: 0.7;
}

.controls {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex: 1;
  align-items: center;
}

.volume-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.volume-icon {
  font-size: 16px;
  line-height: 1;
}

.volume-control {
  width: 80px;
  height: 4px;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  background: #4d4d4d;
  border-radius: 3px;
  outline: none;
}

.volume-control::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 10px;
  background: #ff5100;
  border-radius: 50%;
}

.volume-control::-moz-range-thumb {
  width: 10px;
  height: 10px;
  background: #ff5100;
  border-radius: 50%;
  border: none;
}

.progress-container {
  flex: 1;
  margin-left: 15px;
  display: flex;
  align-items: center;
}

.minimized .progress-container {
  display: none;
}

button {
  background: none;
  border: none;
  color: white;
  font-size: 18px;  /* Reduced from 24px */
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 0;
  margin: 0;
  line-height: 1;
}

.play-button {
  font-size: 22px;
}

.video-button, .lyrics-button {
  background: none;
  border: none;
  color: white;
  font-size: 18px;  /* Reduced from 24px */
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 0;
  margin: 0;
  line-height: 1;
}


button:hover {
  transform: scale(1.2);
  color: #ff5100;
}

.progress-bar {
  width: 100%;
  height: 4px;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  background: #4d4d4d;
  border-radius: 3px;
  outline: none;
}

.progress-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 10px;
  background: #ff5100;
  border-radius: 50%;
}

.progress-bar::-moz-range-thumb {
  width: 10px;
  height: 10px;
  background: #ff5100;
  border-radius: 50%;
  border: none;
}

.minimize-button {
  position: absolute;
  top: -15px;
  right: 20px;
  background: #181818;
  border-radius: 4px 4px 0 0;
  padding: 2px 10px;
  font-size: 12px;
  transform: none !important;
}

.minimize-button:hover {
  color: #ff5100;
  transform: none !important;
}

.minimized .volume-container {
  display: flex;
}

/* NUEVOS: Estilos para el modal de letra */
.lyrics-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10001; /* Mayor que el modal de imagen */
  backdrop-filter: blur(10px);
}

.lyrics-content {
  position: relative;
  background: linear-gradient(135deg, #1a1a1a, #0a0a0a);
  border-radius: 20px;
  padding: 0;
  max-width: 90vw;
  max-height: 90vh;
  width: 600px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.lyrics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.lyrics-song-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.lyrics-cover {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  margin-right: 15px;
  object-fit: cover;
}

.lyrics-details {
  color: white;
}

.lyrics-song-title {
  margin: 0 0 5px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
}

.lyrics-artist {
  margin: 0;
  font-size: 0.9rem;
  color: #ccc;
}

.close-lyrics-button {
  font-size: 30px;
  color: #fff;
  background: none;
  border: none;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-lyrics-button:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
  color: #ff5100;
}

.lyrics-body {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
  max-height: 400px;
}

.lyrics-text {
  text-align: center;
}

.lyrics-text pre {
  color: white;
  font-family: "Roboto", sans-serif;
  font-size: 1.1rem;
  line-height: 1.8;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.lyrics-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px 30px;
  background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.lyrics-control-btn, .lyrics-video-btn {
  font-size: 24px;
  padding: 10px;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.lyrics-play-button {
  font-size: 28px;
  padding: 15px;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ff5100;
  transition: all 0.3s ease;
}

.lyrics-control-btn:hover,
.lyrics-play-button:hover,
.lyrics-video-btn:hover {
  transform: scale(1.1);
  background: #ff5100;
}

.lyrics-video-btn.active {
  background: #ff5100;
  color: white;
}

/* Estilos del modal de imagen (mantener los existentes) */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  backdrop-filter: blur(10px);
}

.modal-content {
  position: relative;
  background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
  border-radius: 20px;
  padding: 30px;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.close-button {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 30px;
  color: #fff;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
  color: #ff5100;
}

.modal-image-container {
  margin-bottom: 20px;
}

.modal-image {
  width: 300px;
  height: 300px;
  border-radius: 15px;
  object-fit: cover;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.modal-info {
  text-align: center;
  color: white;
  width: 100%;
  max-width: 400px;
}

.modal-song-title {
  font-size: 1.5rem;
  margin: 0 0 20px 0;
  color: white;
  font-weight: 600;
}

.modal-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.modal-control-btn, .modal-video-btn, .modal-lyrics-btn {
  font-size: 24px;
  padding: 10px;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.modal-play-button {
  font-size: 28px;
  padding: 15px;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ff5100;
  transition: all 0.3s ease;
}

.modal-control-btn:hover,
.modal-play-button:hover,
.modal-video-btn:hover,
.modal-lyrics-btn:hover {
  transform: scale(1.1);
  background: #ff5100;
}

.modal-video-btn.active,
.modal-lyrics-btn.active {
  background: #ff5100;
  color: white;
}

.modal-progress {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
}

.time-display {
  font-size: 0.9rem;
  color: #ccc;
  min-width: 45px;
}

.modal-progress-bar {
  flex: 1;
  height: 6px;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  background: #4d4d4d;
  border-radius: 3px;
  outline: none;
}

.modal-progress-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #ff5100;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.modal-progress-bar::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #ff5100;
  border-radius: 50%;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-image {
    width: 250px;
    height: 250px;
  }
  
  .modal-song-title {
    font-size: 1.2rem;
  }
  
  .modal-content {
    padding: 20px;
    margin: 20px;
  }
  
  .modal-controls {
    gap: 15px;
  }
  
  .modal-control-btn, .modal-video-btn, .modal-lyrics-btn {
    width: 45px;
    height: 45px;
    font-size: 20px;
  }
  
  .modal-play-button {
    width: 55px;
    height: 55px;
    font-size: 24px;
  }

  /* Responsive para letras */
  .lyrics-content {
    width: 95vw;
    max-height: 95vh;
  }
  
  .lyrics-header {
    padding: 15px 20px;
  }
  
  .lyrics-cover {
    width: 50px;
    height: 50px;
  }
  
  .lyrics-song-title {
    font-size: 1rem;
  }
  
  .lyrics-artist {
    font-size: 0.8rem;
  }
  
  .lyrics-body {
    padding: 20px;
  }
  
  .lyrics-text pre {
    font-size: 1rem;
    line-height: 1.6;
  }
  
  .lyrics-controls {
    padding: 15px 20px;
    gap: 15px;
  }
  
  .lyrics-control-btn, .lyrics-video-btn {
    width: 45px;
    height: 45px;
    font-size: 20px;
  }
  
  .lyrics-play-button {
    width: 55px;
    height: 55px;
    font-size: 24px;
  }
}

/* Scrollbar personalizado para el área de letras */
.lyrics-body::-webkit-scrollbar {
  width: 8px;
}

.lyrics-body::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.lyrics-body::-webkit-scrollbar-thumb {
  background: #ff5100;
  border-radius: 4px;
}

.lyrics-body::-webkit-scrollbar-thumb:hover {
  background: #ca3900;
}
</style>