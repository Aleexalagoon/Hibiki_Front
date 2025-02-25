<template>
  <div v-if="currentSong" class="music-player">
    <div class="player-info">
      <img :src="currentSong?.image || 'default-cover.jpg'" alt="Cover" class="song-cover" />
      <div class="song-details">
        <h3>{{ formatDuration(currentTime) }} / {{ formatDuration(duration) }} - {{ currentSong?.nombre || 'Selecciona una canción' }}</h3>
        <p>{{ getArtistaDisplay() }}</p>
      </div>
    </div>

    <audio
      ref="audioPlayer"
      :src="currentSong?.ruta"
      @loadedmetadata="onMetadataLoaded"
      @timeupdate="updateTime"
      @ended="onAudioEnded"
    ></audio>

    <div class="controls">
      <button @click="previousSong">⏪</button>
      <button @click="togglePlay">{{ isPlaying ? '⏸️' : '▶️' }}</button>
      <button @click="nextSong">⏩</button>
      <button @click="randomSong">🔀</button>
    </div>

    <div class="progress-bar-container">
      <input
        type="range"
        v-model="currentTime"
        @input="seek"
        min="0"
        :max="duration"
        class="progress-bar"
      />
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, nextTick } from "vue";

export default {
  props: {
    song: Object,
    songs: Array,
    cantantes: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const audioPlayer = ref(null);
    const isPlaying = ref(false);
    const currentSong = ref(null);
    const currentTime = ref(0);
    const duration = ref(0);

    // Función simplificada para obtener el nombre del artista
    const getArtistaDisplay = () => {
      if (!currentSong.value) return "Seleccione una canción";
      
      // Si existe la propiedad 'artista', usar esa
      if (currentSong.value.artista) {
        return currentSong.value.artista;
      }

      // Si no hay artista, mostrar un mensaje genérico
      return "Artista desconocido";
    };

    // Inicializar currentSong con props.song o el primer elemento de props.songs
    onMounted(() => {
      if (props.song) {
        currentSong.value = { ...props.song };
      } else if (props.songs && props.songs.length > 0) {
        currentSong.value = { ...props.songs[0] };
      }
    });

    // Observar cambios en song y songs props
    watch(() => props.song, (newSong) => {
      if (newSong) {
        currentSong.value = { ...newSong };
        nextTick(() => playSong());
      }
    }, { deep: true });

    watch(() => props.songs, (newSongs) => {
      if (!currentSong.value && newSongs && newSongs.length > 0) {
        currentSong.value = { ...newSongs[0] };
      }
    }, { deep: true });

    const playSong = async () => {
      if (!audioPlayer.value || !currentSong.value?.ruta) return;
      
      audioPlayer.value.pause();
      audioPlayer.value.src = currentSong.value.ruta;
      await nextTick();
      
      audioPlayer.value.load();
      audioPlayer.value.play().then(() => {
        isPlaying.value = true;
      }).catch(err => console.error("Error al reproducir audio:", err));
    };

    const togglePlay = () => {
      if (!audioPlayer.value) return;
      if (isPlaying.value) {
        audioPlayer.value.pause();
      } else {
        audioPlayer.value.play().catch(err => console.error("Error al reproducir:", err));
      }
      isPlaying.value = !isPlaying.value;
    };

    const previousSong = () => {
      if (!props.songs || props.songs.length === 0) return;
      const currentIndex = props.songs.findIndex(song => song.nombre === currentSong.value?.nombre);
      const newIndex = currentIndex <= 0 ? props.songs.length - 1 : currentIndex - 1;
      // Hacer una copia completa del objeto canción
      currentSong.value = { ...props.songs[newIndex] };
      nextTick(() => playSong());
    };

    const nextSong = () => {
      if (!props.songs || props.songs.length === 0) return;
      const currentIndex = props.songs.findIndex(song => song.nombre === currentSong.value?.nombre);
      const newIndex = currentIndex >= props.songs.length - 1 ? 0 : currentIndex + 1;
      // Hacer una copia completa del objeto canción
      currentSong.value = { ...props.songs[newIndex] };
      nextTick(() => playSong());
    };

    const randomSong = () => {
      if (!props.songs || props.songs.length <= 1) return;
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * props.songs.length);
      } while (props.songs[randomIndex].nombre === currentSong.value?.nombre && props.songs.length > 1);
      
      // Hacer una copia completa del objeto canción
      currentSong.value = { ...props.songs[randomIndex] };
      nextTick(() => playSong());
    };

    const seek = () => {
      if (audioPlayer.value) {
        audioPlayer.value.currentTime = currentTime.value;
      }
    };

    const updateTime = () => {
      if (audioPlayer.value) {
        currentTime.value = audioPlayer.value.currentTime;
      }
    };

    const onMetadataLoaded = () => {
      if (audioPlayer.value) {
        duration.value = audioPlayer.value.duration;
      }
    };

    const onAudioEnded = () => {
      isPlaying.value = false;
      nextSong();
    };

    const formatDuration = (seconds) => {
      if (!seconds || isNaN(seconds)) return "0:00";
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return {
      audioPlayer,
      isPlaying,
      currentSong,
      currentTime,
      duration,
      togglePlay,
      previousSong,
      nextSong,
      randomSong,
      seek,
      updateTime,
      onMetadataLoaded,
      onAudioEnded,
      formatDuration,
      getArtistaDisplay,
    };
  },
};
</script>

<style scoped>
.music-player {
  background: #181818;
  color: white;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.player-info {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.song-cover {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  margin-right: 15px;
}

.song-details {
  text-align: left;
}

.controls {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin: 10px 0;
}

button {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

button:hover {
  transform: scale(1.2);
  color: #1db954;
}

.progress-bar-container {
  width: 100%;
  margin: 10px 0;
}

.progress-bar {
  width: 100%;
  height: 6px;
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
  width: 12px;
  height: 12px;
  background: #1db954;
  border-radius: 50%;
}

.progress-bar::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: #1db954;
  border-radius: 50%;
  border: none;
}
</style>
