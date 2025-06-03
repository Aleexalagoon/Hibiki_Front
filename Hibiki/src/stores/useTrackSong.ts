// src/composables/useTrackSong.ts
import { usePlayerStore } from '@/stores/player'
import { useListeningHistoryStore } from '@/stores/listeningHistoryStore'

export function useTrackSong() {
  const playerStore = usePlayerStore()
  const listeningStore = useListeningHistoryStore()

  const playSongWithTracking = (song: any) => {
    // Validar que la canción tenga la información necesaria
    if (!song || !song.cancionId) {
      console.error('Canción inválida para tracking:', song)
      return
    }

    // Asegurarse de que la canción tenga toda la información necesaria
    const songData = {
      cancionId: song.cancionId,
      cantanteId: song.cantanteId || 0,
      albumId: song.albumId || 0,
      nombre: song.nombre || 'Canción desconocida',
      artista: song.artista || 'Artista desconocido',
      image: song.image || 'https://via.placeholder.com/150x150/ff5100/white?text=🎵',
      duracion: song.duracion || '0:00',
      ruta: song.ruta || `/music/${song.cancionId}.mp3`
    }

    // Trackear inmediatamente cuando se hace clic
    listeningStore.trackSongClick(songData)

    // Reproducir la canción
    playerStore.setSong(songData)
  }

  return {
    playSongWithTracking
  }
}