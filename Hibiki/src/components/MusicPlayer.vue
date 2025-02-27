<template>
  <div v-if="playerStore.currentSong" class="music-player" :class="{ 'minimized': isMinimized }">
    <div class="player-content">
      <div class="player-info">
        <img :src="playerStore.currentSong?.image || 'default-cover.jpg'" alt="Cover" class="song-cover" />
        <div class="song-details">
          <h3 class="song-title">{{ playerStore.currentSong?.nombre || 'Selecciona una canción' }}</h3>
          <p class="song-artist">{{ playerStore.getArtistaDisplay }}</p>
          <p class="song-time">{{ playerStore.formatDuration(playerStore.currentTime) }} / {{ playerStore.formatDuration(playerStore.duration) }}</p>
        </div>
      </div>

      <div class="controls">
        <button @click="previousSong" aria-label="Canción anterior">⥢</button>
        <button @click="togglePlay" :aria-label="playerStore.isPlaying ? 'Pausar' : 'Reproducir'" 
                class="play-button">{{ playerStore.isPlaying ? '⥮' : '▶' }}</button>
        <button @click="nextSong" aria-label="Siguiente canción">⥤</button>
        <button @click="randomSong" aria-label="Reproducir aleatoriamente">⤨</button>
      </div>

      <div class="progress-container">
        <input
          type="range"
          :value="playerStore.currentTime"
          @input="seek"
          min="0"
          :max="playerStore.duration"
          class="progress-bar"
        />
      </div>
    </div>

    <button @click="isMinimized = !isMinimized" class="minimize-button">
      {{ isMinimized ? '▲' : '▼' }}
    </button>
  </div>
</template>

<script>
import { usePlayerStore } from '@/stores/player';
import { ref, watch, onMounted } from "vue";

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
    const isMinimized = ref(false);

    // Watch for song prop change
    watch(
      () => props.song,
      (newSong) => {
        if (newSong) playerStore.setSong(newSong);
      },
      { deep: true }
    );

    // Watch for songs list change and set the first song if not set
    watch(
      () => props.songs,
      (newSongs) => {
        if (!playerStore.currentSong && newSongs?.length) {
          playerStore.setSong(newSongs[0]);
        }
      },
      { deep: true }
    );

    // If a song is provided as a prop, set it
    onMounted(() => {
      if (props.song) {
        playerStore.setSong(props.song);
      } else if (props.songs?.length && !playerStore.currentSong) {
        playerStore.setSong(props.songs[0]);
      }
    });

    // Toggle play/pause
    const togglePlay = () => {
      playerStore.togglePlay();
    };

    // Change the song (next/previous)
    const previousSong = () => {
      playerStore.previousSong(props.songs);
    };

    const nextSong = () => {
      playerStore.nextSong(props.songs);
    };

    // Play a random song
    const randomSong = () => {
      playerStore.randomSong(props.songs);
    };

    // Seek to a specific time in the song
    const seek = (event) => {
      const time = parseFloat(event.target.value);
      playerStore.seek(time);
    };

    return {
      playerStore,
      togglePlay,
      previousSong,
      nextSong,
      randomSong,
      seek,
      isMinimized
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
}

.song-artist {
  margin: 3px 0;
  font-size: 0.8rem;
  opacity: 0.8;
}

.song-time {
  margin: 0;
  font-size: 0.7rem;
  opacity: 0.7;
}

.controls {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex: 1;
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
</style>