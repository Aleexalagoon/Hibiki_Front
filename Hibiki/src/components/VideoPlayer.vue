<template>
  <div v-if="playerStore.showVideo && (playerStore.currentVideoUrl || playerStore.currentSong?.videoclip)" 
       class="video-sidebar-panel">
    <div class="video-container">
      <div class="video-header">
        <div class="video-title-section">
          <h1 class="video-song-title">{{ playerStore.currentSong?.titulo || playerStore.currentSong?.nombre }}</h1>
          <h2 class="video-artist-name">{{ playerStore.getArtistaDisplay }}</h2>
        </div>
        <div class="video-header-controls">
          <button @click="toggleFullscreen" class="fullscreen-button" :title="isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'">
            {{ isFullscreen ? '🗗' : '⛶' }}
          </button>
          <button @click="closeVideo" class="close-button">✕</button>
        </div>
      </div>
      
      <div class="video-wrapper">
        <!-- Video MP4 directo con bucle automático -->
        <video
          v-if="isValidVideo && currentVideoType === 'mp4'"
          ref="videoElement"
          :src="getCurrentVideoUrl()"
          muted
          loop
          autoplay
          preload="metadata"
          @loadedmetadata="onVideoLoadedMetadata"
          @timeupdate="onVideoTimeUpdate"
          @play="onVideoPlay"
          @pause="onVideoPause"
          @error="onVideoError"
          @seeking="onVideoSeeking"
          @seeked="onVideoSeeked"
          @canplay="onVideoCanPlay"
          @loadstart="onVideoLoadStart"
          @ended="onVideoEnded"
          class="video-element"
        >
          <source :src="getCurrentVideoUrl()" type="video/mp4">
          <source :src="getCurrentVideoUrl()" type="video/webm">
          <source :src="getCurrentVideoUrl()" type="video/ogg">
          Tu navegador no soporta la reproducción de video.
        </video>

        <!-- Video de YouTube embebido -->
        <iframe
          v-else-if="isValidVideo && currentVideoType === 'youtube'"
          ref="youtubeFrame"
          :src="getYouTubeEmbedUrl()"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          class="video-element"
        ></iframe>

        <!-- NUEVO: Overlay con información de la canción -->
        <div v-if="isValidVideo" class="video-overlay-info">
          <div class="overlay-content">
            <h1 class="overlay-song-title">{{ playerStore.currentSong?.titulo || playerStore.currentSong?.nombre }}</h1>
            <h2 class="overlay-artist-name">{{ playerStore.getArtistaDisplay }}</h2>
          </div>
        </div>

        <!-- Error de carga del video -->
        <div v-else class="video-error">
          <div class="error-content">
            <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4>Error al cargar el video</h4>
            <p>No se pudo reproducir el archivo de video</p>
            <p class="error-url">{{ getCurrentVideoUrl() }}</p>
            <button @click="retryVideo" class="retry-button">🔄 Reintentar</button>
          </div>
        </div>

        <!-- Indicador de carga -->
        <div v-if="isLoading" class="video-loading-overlay">
          <div class="loading-spinner"></div>
          <p>Cargando video...</p>
        </div>
      </div>
      
      <div class="video-controls">
        <!-- Solo botones para cambiar tipo de video -->
        <button 
          v-if="playerStore.currentVideoUrl" 
          @click="switchToMP4" 
          :class="{ 'active': currentVideoType === 'mp4' }"
          class="video-type-button"
          title="Ver video MP4">
          📹 MP4
        </button>
        
        <button 
          v-if="playerStore.currentSong?.videoclip" 
          @click="switchToYouTube" 
          :class="{ 'active': currentVideoType === 'youtube' }"
          class="video-type-button youtube-style"
          title="Ver videoclip de YouTube">
          📺 YouTube
        </button>
      </div>
    </div>
    
    <!-- Overlay de pantalla completa -->
    <div v-if="isFullscreen" 
         class="fullscreen-overlay" 
         @click="toggleFullscreen">
      <div class="fullscreen-container" @click.stop>
        <div class="fullscreen-header">
          <div class="fullscreen-title-section">
            <h1 class="fullscreen-song-title">{{ playerStore.currentSong?.titulo || playerStore.currentSong?.nombre }}</h1>
            <h2 class="fullscreen-artist-name">{{ playerStore.getArtistaDisplay }}</h2>
          </div>
          <button @click="toggleFullscreen" class="close-button">✕</button>
        </div>
        
        <div class="fullscreen-video-wrapper">
          <video
            v-if="isValidVideo && currentVideoType === 'mp4'"
            :src="getCurrentVideoUrl()"
            :muted="isVideoMuted"
            :loop="videoLoop"
            controls
            autoplay
            class="fullscreen-video-element"
          >
            <source :src="getCurrentVideoUrl()" type="video/mp4">
            <source :src="getCurrentVideoUrl()" type="video/webm">
            <source :src="getCurrentVideoUrl()" type="video/ogg">
            Tu navegador no soporta la reproducción de video.
          </video>

          <iframe
            v-else-if="isValidVideo && currentVideoType === 'youtube'"
            :src="getYouTubeEmbedUrl()"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            class="fullscreen-video-element"
          ></iframe>

          <!-- NUEVO: Overlay en pantalla completa -->
          <div v-if="isValidVideo" class="fullscreen-overlay-info">
            <div class="fullscreen-overlay-content">
              <h1 class="fullscreen-overlay-song-title">{{ playerStore.currentSong?.titulo || playerStore.currentSong?.nombre }}</h1>
              <h2 class="fullscreen-overlay-artist-name">{{ playerStore.getArtistaDisplay }}</h2>
            </div>
          </div>
        </div>
        
        <div class="fullscreen-controls">
          <!-- Solo botones para cambiar tipo en pantalla completa -->
          <button 
            v-if="playerStore.currentVideoUrl" 
            @click="switchToMP4" 
            :class="{ 'active': currentVideoType === 'mp4' }"
            class="video-type-button">
            📹 Ver MP4
          </button>
          
          <button 
            v-if="playerStore.currentSong?.videoclip" 
            @click="switchToYouTube" 
            :class="{ 'active': currentVideoType === 'youtube' }"
            class="video-type-button youtube-style">
            📺 Ver YouTube
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { usePlayerStore } from '@/stores/player';

export default {
  setup() {
    const playerStore = usePlayerStore();
    const videoElement = ref(null);
    const isVideoMuted = ref(true); // Por defecto silenciado
    const isFullscreen = ref(false);
    const isValidVideo = ref(true);
    const isLoading = ref(false);
    const syncingInProgress = ref(false);
    const showDebug = ref(false); // Toggle para mostrar debug info
    const currentVideoType = ref('mp4'); // 'mp4' o 'youtube'
    const videoLoop = ref(true); // NUEVO: Control de bucle del video

    // Obtener URL del video actual según el tipo
    const getCurrentVideoUrl = () => {
      if (currentVideoType.value === 'mp4') {
        return playerStore.currentVideoUrl;
      } else {
        return playerStore.currentSong?.videoclip;
      }
    };

    // Convertir URL de YouTube a formato embed
    const getYouTubeEmbedUrl = () => {
      const url = playerStore.currentSong?.videoclip;
      if (!url) return '';

      let videoId = null;

      // Extraer ID del video
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1]?.split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      } else if (url.includes('youtube.com/embed/')) {
        return url + '?autoplay=1&mute=1&rel=0&controls=1&loop=1';
      }

      if (videoId) {
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&rel=0&controls=1&enablejsapi=1&loop=1&playlist=${videoId}`;
      }

      return '';
    };

    // Estado de sincronización (solo para MP4)
    const isSynced = computed(() => {
      if (!videoElement.value || currentVideoType.value !== 'mp4') return false;
      const timeDiff = Math.abs(videoElement.value.currentTime - playerStore.currentTime);
      return timeDiff < 1; // Consideramos sincronizado si la diferencia es menor a 1 segundo
    });

    // Validar si la URL es un video válido
    const isValidVideoUrl = (url) => {
      if (!url) return false;
      
      // Para MP4: Aceptar diferentes tipos de URLs de video
      if (currentVideoType.value === 'mp4') {
        const videoExtensions = /\.(mp4|webm|ogg|avi|mov|mkv)(\?.*)?$/i;
        const isDirectVideo = videoExtensions.test(url);
        const isValidDomain = url.includes('sample-videos.com') || 
                             url.startsWith('/') || 
                             url.startsWith('http') ||
                             url.startsWith('blob:');
        
        return isDirectVideo || isValidDomain;
      }
      
      // Para YouTube: Verificar que sea una URL de YouTube
      return url.includes('youtube.com') || url.includes('youtu.be');
    };

    // NUEVA: Función para alternar bucle del video
    const toggleVideoLoop = () => {
      videoLoop.value = !videoLoop.value;
      if (videoElement.value && currentVideoType.value === 'mp4') {
        videoElement.value.loop = videoLoop.value;
        console.log('🔁 Bucle del video:', videoLoop.value ? 'ACTIVADO' : 'DESACTIVADO');
      }
    };

    // Cambiar entre MP4 y YouTube
    const switchToMP4 = () => {
      if (playerStore.currentVideoUrl) {
        console.log('🎬 Cambiando a video MP4');
        currentVideoType.value = 'mp4';
        isValidVideo.value = isValidVideoUrl(playerStore.currentVideoUrl);
      }
    };

    const switchToYouTube = () => {
      if (playerStore.currentSong?.videoclip) {
        console.log('📺 Cambiando a videoclip de YouTube');
        currentVideoType.value = 'youtube';
        isValidVideo.value = isValidVideoUrl(playerStore.currentSong.videoclip);
      }
    };

    // Eventos del video
    const onVideoLoadStart = () => {
      isLoading.value = true;
      console.log('🎬 Iniciando carga del video:', getCurrentVideoUrl());
    };

    const onVideoLoadedMetadata = () => {
      isLoading.value = false;
      if (videoElement.value) {
        // IMPORTANTE: Configurar bucle automáticamente
        videoElement.value.loop = videoLoop.value;
        
        console.log('📹 Video cargado, duración:', videoElement.value.duration.toFixed(2) + 's');
        console.log('🔁 Bucle configurado:', videoElement.value.loop);
        console.log('🎵 Audio actual en:', playerStore.currentTime.toFixed(2) + 's');
        
        // NO sincronizar automáticamente para permitir que el video corra libre
        // Solo sincronizar si está en modo sync específico
        if (!videoLoop.value) {
          videoElement.value.currentTime = playerStore.currentTime;
        }
        
        // Si el audio está reproduciéndose, iniciar el video
        if (playerStore.isPlaying) {
          videoElement.value.play().catch(e => console.warn('⚠️ Error al iniciar video:', e));
        }
      }
    };

    const onVideoCanPlay = () => {
      isLoading.value = false;
      if (videoElement.value) {
        // Asegurar configuración de bucle
        videoElement.value.loop = videoLoop.value;
        
        console.log('✅ Video listo para reproducir');
        console.log('🔁 Bucle final configurado:', videoElement.value.loop);
        
        // Solo sincronizar si NO está en modo bucle libre
        if (!videoLoop.value) {
          const timeDiff = Math.abs(videoElement.value.currentTime - playerStore.currentTime);
          if (timeDiff > 1) {
            videoElement.value.currentTime = playerStore.currentTime;
          }
        }
        
        // Iniciar si el audio está reproduciéndose
        if (playerStore.isPlaying && videoElement.value.paused) {
          videoElement.value.play().catch(e => console.warn('⚠️ Error al reproducir video:', e));
        }
      }
    };

    // MODIFICADA: Esta función maneja cuando el video termina (por si falla el loop)
    const onVideoEnded = () => {
      console.log('🔚 Video terminado, reiniciando bucle...');
      if (videoElement.value) {
        // Reiniciar el video al comienzo
        videoElement.value.currentTime = 0;
        
        // Continuar reproduciendo si el audio está activo
        if (playerStore.isPlaying) {
          videoElement.value.play().catch(e => console.warn('⚠️ Error al reiniciar video:', e));
        }
      }
    };

    const onVideoTimeUpdate = () => {
      // MODIFICADA: No sincronizar si está en modo bucle libre
      if (!syncingInProgress.value && videoElement.value && !videoLoop.value) {
        const videoTime = videoElement.value.currentTime;
        const audioTime = playerStore.currentTime;
        const timeDiff = Math.abs(videoTime - audioTime);
        
        // Si el video se adelanta mucho al audio, sincronizar el audio
        if (timeDiff > 2) {
          console.log(`🔄 Sincronizando: Video=${videoTime.toFixed(2)}s → Audio=${audioTime.toFixed(2)}s`);
          syncingInProgress.value = true;
          playerStore.seek(videoTime);
          setTimeout(() => {
            syncingInProgress.value = false;
          }, 1000);
        }
      }
    };

    const onVideoPlay = () => {
      if (!playerStore.isPlaying) {
        console.log('▶️ Video iniciado, activando audio');
        playerStore.togglePlay();
      }
    };

    const onVideoPause = () => {
      if (playerStore.isPlaying) {
        console.log('⏸️ Video pausado, pausando audio');
        playerStore.togglePlay();
      }
    };

    const onVideoSeeking = () => {
      syncingInProgress.value = true;
      console.log('⏩ Video buscando posición...');
    };

    const onVideoSeeked = () => {
      if (videoElement.value && !videoLoop.value) {
        const newTime = videoElement.value.currentTime;
        console.log(`⏭️ Video posicionado en: ${newTime.toFixed(2)}s`);
        playerStore.seek(newTime);
        setTimeout(() => {
          syncingInProgress.value = false;
        }, 500);
      } else {
        syncingInProgress.value = false;
      }
    };

    const onVideoError = (event) => {
      isLoading.value = false;
      isValidVideo.value = false;
      console.error('❌ Error al cargar el video:', event);
      console.error('URL problemática:', getCurrentVideoUrl());
    };

    // MODIFICADOS: Watchers para sincronización (solo cuando NO está en bucle libre)
    watch(() => playerStore.isPlaying, (isPlaying) => {
      if (videoElement.value && isValidVideo.value && currentVideoType.value === 'mp4') {
        try {
          if (isPlaying && videoElement.value.paused) {
            // Solo sincronizar si NO está en modo bucle libre
            if (!videoLoop.value) {
              const timeDiff = Math.abs(videoElement.value.currentTime - playerStore.currentTime);
              if (timeDiff > 0.5) {
                videoElement.value.currentTime = playerStore.currentTime;
              }
            }
            videoElement.value.play().catch(e => console.warn('⚠️ Error al reproducir video:', e));
          } else if (!isPlaying && !videoElement.value.paused) {
            videoElement.value.pause();
          }
        } catch (error) {
          console.warn('⚠️ Error al cambiar estado del video:', error);
        }
      }
    });

    watch(() => playerStore.currentTime, (newTime) => {
      // Solo sincronizar si NO está en modo bucle libre
      if (videoElement.value && !syncingInProgress.value && isValidVideo.value && 
          currentVideoType.value === 'mp4' && !videoLoop.value) {
        const timeDiff = Math.abs(videoElement.value.currentTime - newTime);
        if (timeDiff > 1) {
          try {
            console.log(`🔄 Sincronizando tiempo: ${videoElement.value.currentTime.toFixed(2)}s → ${newTime.toFixed(2)}s`);
            videoElement.value.currentTime = newTime;
          } catch (error) {
            console.warn('⚠️ Error al sincronizar tiempo del video:', error);
          }
        }
      }
    });

    watch(() => playerStore.currentVideoUrl, (newUrl) => {
      // Por defecto, mostrar MP4 si está disponible
      if (newUrl && isValidVideoUrl(newUrl)) {
        currentVideoType.value = 'mp4';
      }
      isValidVideo.value = isValidVideoUrl(getCurrentVideoUrl());
      isLoading.value = false;
      
      if (newUrl) {
        console.log('🎬 Nueva URL de video:', newUrl);
        console.log('✅ URL válida:', isValidVideo.value);
      }
    }, { immediate: true });

    watch(() => playerStore.showVideo, (showVideo) => {
      if (showVideo && isValidVideo.value && currentVideoType.value === 'mp4') {
        setTimeout(() => {
          if (videoElement.value) {
            console.log('🎬 Panel de video abierto...');
            // Solo sincronizar si NO está en bucle libre
            if (!videoLoop.value) {
              syncVideoManually();
            }
          }
        }, 100);
      }
    });

    // MODIFICADA: Sincronización manual
    const syncVideoManually = () => {
      if (videoElement.value && isValidVideo.value && currentVideoType.value === 'mp4') {
        console.log('🔄 Sincronización manual activada');
        console.log(`Audio: ${playerStore.currentTime.toFixed(2)}s, Video: ${videoElement.value.currentTime.toFixed(2)}s`);
        
        // Desactivar bucle temporalmente para sincronizar
        const wasLooping = videoElement.value.loop;
        videoElement.value.loop = false;
        videoLoop.value = false;
        
        videoElement.value.currentTime = playerStore.currentTime;
        
        if (playerStore.isPlaying && videoElement.value.paused) {
          videoElement.value.play().catch(e => console.warn('⚠️ Error al reproducir video:', e));
        } else if (!playerStore.isPlaying && !videoElement.value.paused) {
          videoElement.value.pause();
        }
      }
    };

    const toggleVideoMute = () => {
      if (videoElement.value && currentVideoType.value === 'mp4') {
        isVideoMuted.value = !isVideoMuted.value;
        videoElement.value.muted = isVideoMuted.value;
        console.log('🔊 Audio del video:', isVideoMuted.value ? 'silenciado' : 'activado');
      }
    };

    const retryVideo = () => {
      console.log('🔄 Reintentando cargar video...');
      isValidVideo.value = isValidVideoUrl(getCurrentVideoUrl());
      if (videoElement.value && currentVideoType.value === 'mp4') {
        videoElement.value.load(); // Recargar el video
      }
    };

    const openVideoInNewTab = () => {
      const url = getCurrentVideoUrl();
      if (url) {
        window.open(url, '_blank');
      }
    };

    const closeVideo = () => {
      playerStore.showVideo = false;
      isFullscreen.value = false;
    };

    const toggleFullscreen = () => {
      isFullscreen.value = !isFullscreen.value;
    };

    // Manejar tecla Escape
    const handleKeyPress = (event) => {
      if (event.key === 'Escape') {
        if (isFullscreen.value) {
          isFullscreen.value = false;
        } else {
          closeVideo();
        }
      }
    };

    onMounted(() => {
      document.addEventListener('keydown', handleKeyPress);
    });

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeyPress);
    });

    return {
      playerStore,
      videoElement,
      isVideoMuted,
      isFullscreen,
      isValidVideo,
      isLoading,
      isSynced,
      showDebug,
      currentVideoType,
      videoLoop, // NUEVO
      getCurrentVideoUrl,
      getYouTubeEmbedUrl,
      switchToMP4,
      switchToYouTube,
      onVideoLoadStart,
      onVideoLoadedMetadata,
      onVideoCanPlay,
      onVideoTimeUpdate,
      onVideoPlay,
      onVideoPause,
      onVideoSeeking,
      onVideoSeeked,
      onVideoError,
      onVideoEnded, // NUEVO
      syncVideoManually,
      toggleVideoMute,
      toggleVideoLoop, // NUEVO
      retryVideo,
      openVideoInNewTab,
      closeVideo,
      toggleFullscreen
    };
  }
};
</script>

<style scoped>
/* Panel lateral del video */
.video-sidebar-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: #181818;
  border-left: 2px solid #333;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
  animation: slideInFromRight 0.3s ease-out;
}

.video-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.video-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #242424, #1a1a1a);
  border-bottom: 1px solid #333;
  flex-shrink: 0;
  min-height: 80px; /* Altura mínima para acomodar dos líneas */
}

/* NUEVO: Sección del título estilo Spotify */
.video-title-section {
  flex: 1;
  margin-right: 15px;
  min-width: 0; /* Permite que el texto se contraiga */
}

.video-song-title {
  color: #ffffff;
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  font-weight: 700; /* Bold como Spotify */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: -0.02em; /* Espaciado de letra ajustado */
}

.video-artist-name {
  color: #b3b3b3; /* Gris claro como Spotify */
  margin: 0;
  font-size: 0.85rem;
  font-weight: 400; /* Normal weight */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.9;
  transition: color 0.2s ease;
}

.video-artist-name:hover {
  color: #ffffff; /* Se vuelve blanco al hover */
  cursor: pointer;
}

.video-header-controls {
  display: flex;
  gap: 5px;
}

.close-button, .fullscreen-button {
  background: none;
  border: none;
  color: #ccc;
  font-size: 16px;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: all 0.2s ease;
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background: #ff5100;
  color: white;
}

.fullscreen-button:hover {
  background: #444;
  color: white;
}

.video-wrapper {
  flex: 1;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  min-height: 300px; /* Altura mínima más grande */
}

.video-element {
  width: 100%;
  height: auto;
  max-height: 100%;
  display: block;
  background: black;
  min-height: 300px; /* Altura mínima para YouTube */
}

/* Estilos específicos para iframe de YouTube */
.video-element iframe {
  width: 100%;
  height: 100%;
  min-height: 300px; /* Altura mínima específica para YouTube */
  border: none;
  background: black;
}

/* NUEVO: Overlay con información de la canción sobre el video */
.video-overlay-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 20;
  pointer-events: none; /* No interfiere con los controles del video */
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6));
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  animation: slideInFromBottom 0.6s ease-out;
  max-width: calc(100% - 40px);
}

.overlay-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.overlay-song-title {
  color: #ffffff;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.3;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.overlay-artist-name {
  color: #e5e5e5;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 400;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.2;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  opacity: 0.95;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* NUEVO: Overlay para pantalla completa */
.fullscreen-overlay-info {
  position: absolute;
  bottom: 40px;
  left: 40px;
  z-index: 30;
  pointer-events: none;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.7));
  backdrop-filter: blur(15px);
  border-radius: 16px;
  padding: 24px 28px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5);
  animation: slideInFromBottom 0.8s ease-out;
  max-width: calc(100% - 80px);
}

.fullscreen-overlay-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.fullscreen-overlay-song-title {
  color: #ffffff;
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.2;
  letter-spacing: -0.03em;
  text-shadow: 0 3px 12px rgba(0, 0, 0, 0.7);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fullscreen-overlay-artist-name {
  color: #e5e5e5;
  margin: 0;
  font-size: 1.2rem;
  font-weight: 400;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.3;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  opacity: 0.95;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Animación para el overlay */
@keyframes slideInFromBottom {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.video-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ccc;
  z-index: 10;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 2px solid #333;
  border-top: 2px solid #ff5100;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Estilos para error */
.video-error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #1a1a1a;
  padding: 20px;
}

.error-content {
  text-align: center;
  color: #ccc;
  max-width: 280px;
}

.error-icon {
  width: 40px;
  height: 40px;
  margin: 0 auto 12px;
  color: #ff6b6b;
}

.error-content h4 {
  margin: 0 0 8px 0;
  color: #ff6b6b;
  font-size: 1rem;
}

.error-content p {
  margin: 0 0 8px 0;
  font-size: 0.85rem;
  line-height: 1.4;
}

.error-url {
  font-family: monospace;
  font-size: 0.7rem !important;
  color: #888;
  word-break: break-all;
  margin-bottom: 12px !important;
}

.retry-button {
  background: #ff5100;
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.retry-button:hover {
  background: #e04600;
}

.video-controls {
  display: flex;
  gap: 6px;
  padding: 10px 12px;
  background: #242424;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  flex-shrink: 0;
  border-top: 1px solid #333;
}

.video-controls button {
  background: #333;
  border: none;
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-controls button:hover {
  background: #444;
}

.video-controls button.active {
  background: #ff5100;
}

.sync-button {
  background: #28a745 !important;
}

.sync-button:hover {
  background: #218838 !important;
}

.open-external {
  background: #1a73e8 !important;
}

.open-external:hover {
  background: #1557b0 !important;
}

.debug-toggle {
  background: #6c757d !important;
}

.debug-toggle:hover {
  background: #5a6268 !important;
}

.sync-status {
  font-size: 10px;
  padding: 3px 6px;
  border-radius: 3px;
  font-weight: bold;
}

.sync-status.synced {
  background: #28a745;
  color: white;
}

.sync-status.out-of-sync {
  background: #dc3545;
  color: white;
}

.video-type-info {
  color: #999;
  font-size: 10px;
  padding: 2px 6px;
  background: #333;
  border-radius: 3px;
  border: 1px solid #444;
}

.debug-info {
  color: #999;
  font-size: 9px;
  padding: 2px 4px;
  background: #2a2a2a;
  border-radius: 3px;
  border: 1px solid #444;
  font-family: monospace;
}

/* Estilos para los botones de cambio de tipo de video */
.video-type-button {
  background: #444 !important;
  border: 2px solid #666 !important;
  font-weight: bold !important;
  min-width: 60px !important;
  transition: all 0.3s ease !important;
}

.video-type-button:hover {
  background: #555 !important;
  border-color: #777 !important;
}

.video-type-button.active {
  background: #ff5100 !important;
  border-color: #ff5100 !important;
  color: white !important;
}

.video-type-button.youtube-style.active {
  background: #ff0000 !important;
  border-color: #ff0000 !important;
}

.fullscreen-video-element iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* Pantalla completa */
.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
}

.fullscreen-container {
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  background: #181818;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.fullscreen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #242424;
  border-bottom: 1px solid #333;
}

.fullscreen-header h3 {
  color: white;
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.fullscreen-video-wrapper {
  position: relative;
  width: 100%;
  background: black;
}

.fullscreen-video-element {
  width: 100%;
  height: auto;
  max-height: 75vh;
  display: block;
}

.fullscreen-controls {
  display: flex;
  gap: 10px;
  padding: 15px 20px;
  background: #242424;
  justify-content: center;
}

.fullscreen-controls button {
  background: #333;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.fullscreen-controls button:hover {
  background: #444;
}

.fullscreen-controls button.active {
  background: #ff5100;
}

/* Responsive para overlay */
@media (max-width: 768px) {
  .video-overlay-info {
    bottom: 15px;
    left: 15px;
    padding: 12px 16px;
    border-radius: 10px;
    max-width: calc(100% - 30px);
  }
  
  .overlay-song-title {
    font-size: 1rem;
  }
  
  .overlay-artist-name {
    font-size: 0.85rem;
  }
  
  .fullscreen-overlay-info {
    bottom: 30px;
    left: 30px;
    padding: 18px 22px;
    border-radius: 12px;
    max-width: calc(100% - 60px);
  }
  
  .fullscreen-overlay-song-title {
    font-size: 1.3rem;
  }
  
  .fullscreen-overlay-artist-name {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .video-overlay-info {
    bottom: 10px;
    left: 10px;
    padding: 10px 14px;
    max-width: calc(100% - 20px);
  }
  
  .overlay-song-title {
    font-size: 0.9rem;
  }
  
  .overlay-artist-name {
    font-size: 0.8rem;
  }
  
  .fullscreen-overlay-info {
    bottom: 20px;
    left: 20px;
    padding: 16px 20px;
    max-width: calc(100% - 40px);
  }
  
  .fullscreen-overlay-song-title {
    font-size: 1.1rem;
  }
  
  .fullscreen-overlay-artist-name {
    font-size: 0.9rem;
  }
}

/* Overlay de carga */
@media (max-width: 1024px) {
  .video-sidebar-panel {
    width: 350px;
  }
}

@media (max-width: 768px) {
  .video-sidebar-panel {
    width: 100vw;
    height: 60vh; /* Aumentado de 50vh a 60vh para más espacio */
    top: auto;
    bottom: 0;
    border-left: none;
    border-top: 2px solid #333;
  }
  
  .video-element {
    min-height: 250px; /* Altura mínima en móvil */
  }
  
  .video-element iframe {
    min-height: 250px; /* YouTube en móvil */
  }
  
  .video-header h3 {
    font-size: 0.9rem;
  }
  
  .video-controls {
    padding: 8px 10px;
    gap: 4px;
  }
  
  .video-controls button {
    padding: 4px 8px;
    font-size: 11px;
    min-width: 28px;
    height: 28px;
  }
}

@media (max-width: 480px) {
  .video-sidebar-panel {
    height: 50vh; /* Aumentado de 40vh a 50vh */
  }
  
  .video-element {
    min-height: 200px; /* Altura mínima en móvil pequeño */
  }
  
  .video-element iframe {
    min-height: 200px; /* YouTube en móvil pequeño */
  }
  
  .video-header {
    padding: 8px 12px;
  }
  
  .video-header h3 {
    font-size: 0.85rem;
  }
  
  .video-controls {
    padding: 6px 8px;
  }
  
  .video-controls button {
    font-size: 10px;
    min-width: 24px;
    height: 24px;
  }
}

/* Animación de entrada */
@keyframes slideInFromRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}</style>