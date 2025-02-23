<template>
  <div class="music-player">
    <h3>{{ currentSong?.nombre || 'Selecciona una canción' }}</h3>

    <audio
      ref="audioPlayer"
      :src="currentSong?.ruta"
      @loadedmetadata="onMetadataLoaded"
      @ended="onAudioEnded"
      controls
    >
      Tu navegador no soporta el reproductor de audio.
    </audio>

    <div class="controls">
      <button @click="previousSong">⏪ Anterior</button>
      <button @click="togglePlay">
        {{ isPlaying ? '⏸️ Pausar' : '▶️ Reproducir' }}
      </button>
      <button @click="nextSong">⏩ Siguiente</button>
      <button @click="randomSong">🔀 Aleatorio</button>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";

export default {
  props: {
    song: Object, // Recibimos la canción seleccionada
    songs: Array, // Recibimos todas las canciones
  },
  setup(props) {
    const audioPlayer = ref(null);
    const isPlaying = ref(false);
    const currentSong = ref(props.song); // Inicializamos con la canción seleccionada
    const isRandom = ref(false);

    // Observamos los cambios en la canción seleccionada
    watch(() => props.song, (newSong) => {
      if (newSong) {
        currentSong.value = newSong;
        audioPlayer.value.src = newSong.ruta;
        audioPlayer.value.load();
        audioPlayer.value.play();
        isPlaying.value = true;
      }
    });

    const togglePlay = () => {
      if (!audioPlayer.value || !currentSong.value) return;

      if (isPlaying.value) {
        audioPlayer.value.pause();
      } else {
        audioPlayer.value.play();
      }
      isPlaying.value = !isPlaying.value;
    };

    const previousSong = () => {
      // Lógica para canción anterior
      const currentIndex = props.songs.indexOf(currentSong.value);
      if (currentIndex === 0) {
        // Si estamos en la primera canción, ir a la última
        currentSong.value = props.songs[props.songs.length - 1];
      } else {
        // Si no, ir a la anterior
        currentSong.value = props.songs[currentIndex - 1];
      }
      audioPlayer.value.src = currentSong.value.ruta;
      audioPlayer.value.load();
      audioPlayer.value.play();
    };

    const nextSong = () => {
      // Lógica para canción siguiente
      const currentIndex = props.songs.indexOf(currentSong.value);
      if (currentIndex === props.songs.length - 1) {
        // Si estamos en la última canción, ir a la primera
        currentSong.value = props.songs[0];
      } else {
        // Si no, ir a la siguiente
        currentSong.value = props.songs[currentIndex + 1];
      }
      audioPlayer.value.src = currentSong.value.ruta;
      audioPlayer.value.load();
      audioPlayer.value.play();
    };

    const randomSong = () => {
      // Seleccionar canción aleatoria
      const randomIndex = Math.floor(Math.random() * props.songs.length);
      currentSong.value = props.songs[randomIndex];
      audioPlayer.value.src = currentSong.value.ruta;
      audioPlayer.value.load();
      audioPlayer.value.play();
    };

    const onMetadataLoaded = () => {};

    const onAudioEnded = () => {
      isPlaying.value = false;
      nextSong();
    };

    onMounted(() => {
      // Establecer canción inicial si no hay canción seleccionada
      if (!currentSong.value && props.songs.length > 0) {
        currentSong.value = props.songs[0]; // Primer canción por defecto
      }
    });

    return {
      audioPlayer,
      isPlaying,
      currentSong,
      isRandom,
      togglePlay,
      previousSong,
      nextSong,
      randomSong,
      onMetadataLoaded,
      onAudioEnded,
    };
  },
};
</script>
