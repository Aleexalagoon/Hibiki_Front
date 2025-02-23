<template>
  <div v-if="song" class="music-player">
    <h3>{{ song.nombre }}</h3>

    <!-- Reproductor de MP3 -->
    <audio
      ref="audioPlayer"
      :src="song.ruta"
      @loadedmetadata="onMetadataLoaded"
      @ended="onAudioEnded"
      controls
    >
      Tu navegador no soporta el reproductor de audio.
    </audio>

    <div class="controls">
      <button @click="togglePlay">
        {{ isPlaying ? '⏸️ Pausar' : '▶️ Reproducir' }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";

export default {
  props: {
    song: Object,
  },
  setup(props) {
    const audioPlayer = ref(null); // Referencia al reproductor de audio
    const isPlaying = ref(false);

    // Función para pausar/reproducir
    const togglePlay = () => {
      if (!audioPlayer.value) return;

      if (isPlaying.value) {
        audioPlayer.value.pause();
      } else {
        audioPlayer.value.play();
      }
      isPlaying.value = !isPlaying.value;
    };

    // Se ejecuta cuando los metadatos del audio (como la duración) se cargan
    const onMetadataLoaded = () => {
      // Se puede realizar alguna acción con los metadatos si es necesario
    };

    // Cuando el audio termina, se puede manejar el fin de la canción
    const onAudioEnded = () => {
      isPlaying.value = false; // Actualiza el estado cuando la canción termina
    };

    // Cuando cambia la canción, cargar el nuevo archivo MP3
    watch(() => props.song, (newSong) => {
      if (newSong && audioPlayer.value) {
        audioPlayer.value.src = newSong.ruta;
        audioPlayer.value.play();
        isPlaying.value = true;
      }
    });

    // Control inicial del reproductor cuando el componente se monta
    onMounted(() => {
      if (props.song && audioPlayer.value) {
        audioPlayer.value.src = props.song.ruta;
      }
    });

    return {
      audioPlayer,
      isPlaying,
      togglePlay,
      onMetadataLoaded,
      onAudioEnded,
    };
  },
};
</script>

<style scoped>
.music-player {
  text-align: center;
  margin-top: 20px;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>