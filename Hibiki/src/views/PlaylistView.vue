<template>
  <div class="playlist-page">
    <!-- Global connection error -->
    <div v-if="connectionError" class="connection-error">
      <div class="error-content">
        <h3>⚠️ Connection Error</h3>
        <p>{{ connectionError }}</p>
        <div class="error-actions">
          <button @click="retryConnection" class="retry-btn" :disabled="loading">
            {{ loading ? 'Connecting...' : 'Retry connection' }}
          </button>
          <button @click="checkBackendStatus" class="check-btn">
            Check server status
          </button>
        </div>
      </div>
    </div>

    <div v-else class="main-container">
      <div class="playlists-list">
        <h2>My Playlists</h2>
        
        <!-- Loading state -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading playlists...</p>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="error-state">
          <p class="error">{{ error }}</p>
          <button @click="fetchPlaylists" class="retry-btn">Retry</button>
        </div>
        
        <!-- Empty state -->
        <div v-else-if="allPlaylists.length === 0" class="empty-state">
          <p>You don't have any playlists yet</p>
          <button @click="createNewPlaylist" class="create-btn">Create my first playlist</button>
        </div>
        
        <!-- Playlists list -->
        <div v-else class="playlists-container">
          <div 
            v-for="playlist in allPlaylists" 
            :key="playlist.playlistId" 
            class="playlist-card"
            :class="{ 'active': selectedPlaylist?.playlistId === playlist.playlistId }"
            @click="selectPlaylist(playlist.playlistId)"
          >
            <img 
              :src="playlist.image || defaultImage" 
              alt="Playlist Cover" 
              class="playlist-image"
              @error="handleImageError"
            />
            <div class="playlist-info">
              <h3>{{ playlist.nombre }}</h3>
              <p class="song-count">{{ playlist.canciones?.length || 0 }} songs</p>
            </div>
          </div>
        </div>
        
        <!-- Create new playlist button -->
        <button @click="createNewPlaylist" class="create-playlist-btn">
          + New Playlist
        </button>
      </div>

      <div class="details-container">
        <div v-if="selectedPlaylist" class="playlist-details">
          <div class="playlist-header">
            <img 
              :src="selectedPlaylist.image || defaultImage" 
              alt="Playlist Cover" 
              class="playlist-cover"
              @error="handleImageError"
            />
            <div class="playlist-meta">
              <span class="playlist-type">Playlist</span>
              <h1 class="playlist-name">{{ selectedPlaylist.nombre }}</h1>
              <p class="playlist-description" v-if="selectedPlaylist.descripcion">
                {{ selectedPlaylist.descripcion }}
              </p>
              <div class="playlist-stats">
                <span v-if="selectedPlaylist.creador">
                  By {{ selectedPlaylist.creador.name || 'Unknown user' }}
                </span>
                <span>{{ selectedPlaylist.canciones?.length || 0 }} songs</span>
              </div>
            </div>
          </div>

          <!-- Playlist controls -->
          <div class="playlist-controls">
            <button 
              @click="playPlaylist" 
              class="play-btn"
              :disabled="!selectedPlaylist.canciones || selectedPlaylist.canciones.length === 0"
            >
              ▶ Play
            </button>
            
            <!-- 🆕 ADD BUTTON ALWAYS VISIBLE -->
            <button @click="addSongsToPlaylist" class="add-songs-control-btn">
              ✚ Add songs
            </button>
            
            <button @click="editPlaylist" class="edit-btn">
              ✎ Edit
            </button>
            <button @click="deletePlaylist" class="delete-btn">
              ✘ Delete
            </button>
          </div>

          <!-- Songs list -->
          <div class="songs-section">
            <div class="songs-header">
              <h2>Songs</h2>
              <!-- 🆕 ADDITIONAL BUTTON IN HEADER -->
            </div>
            
            <div v-if="selectedPlaylist.canciones && selectedPlaylist.canciones.length > 0" class="songs-list">
              <div 
                v-for="(song, index) in selectedPlaylist.canciones"
                :key="song.cancionId"
                class="song-card"
                @click="selectSong(song)"
              >
                <div class="song-index">{{ index + 1 }}</div>
                <div class="song-info-container">
                  <img 
                    :src="song.image || defaultImage" 
                    alt="Song Thumbnail" 
                    class="song-image"
                    @error="handleImageError"
                  />
                  <div class="song-info">
                    <span class="song-title">{{ song.nombre }}</span>
                    <span class="song-artist">{{ getArtistName(song) }}</span>
                  </div>
                </div>
                <span class="song-duration">{{ formatDuration(song.duracion) }}</span>
                <button 
                  @click.stop="removeSongFromPlaylist(song.cancionId)"
                  class="remove-song-btn"
                  title="Remove from playlist"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <!-- 🔄 IMPROVED EMPTY STATE -->
            <div v-else class="empty-playlist">
              <div class="empty-playlist-icon">♬</div>
              <h3>This playlist is empty</h3>
              <p>Start by adding some songs to listen to</p>
              <button @click="addSongsToPlaylist" class="add-songs-btn-large">
                ✚ Add songs
              </button>
            </div>
          </div>
        </div>
        
        <!-- Default state when no playlist is selected -->
        <div v-else class="no-selection">
          <h2>Select a playlist</h2>
          <p>Choose a playlist from the list to view its details and songs.</p>
        </div>
      </div>
    </div>

    <!-- Modal for create/edit playlist -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h3>{{ isEditing ? 'Edit Playlist' : 'New Playlist' }}</h3>
        <form @submit.prevent="savePlaylist">
          <div class="form-group">
            <label for="nombre">Name:</label>
            <input 
              type="text" 
              id="nombre"
              v-model="modalData.nombre" 
              required 
              maxlength="100"
            />
          </div>
          <div class="form-group">
            <label for="descripcion">Description:</label>
            <textarea 
              id="descripcion"
              v-model="modalData.descripcion" 
              rows="3"
              maxlength="500"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="image">Image URL:</label>
            <input 
              type="url" 
              id="image"
              v-model="modalData.image" 
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="cancel-btn">
              Cancel
            </button>
            <button type="submit" class="save-btn" :disabled="!modalData.nombre.trim()">
              {{ isEditing ? 'Save changes' : 'Create playlist' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal for adding songs -->
    <div v-if="showAddSongsModal" class="modal-overlay" @click="closeAddSongsModal">
      <div class="modal add-songs-modal" @click.stop>
        <h3>Add songs to "{{ selectedPlaylist?.nombre }}"</h3>
        
        <!-- Song search -->
        <div class="search-section">
          <div class="search-bar">
            <input 
              type="text" 
              v-model="songSearchQuery" 
              placeholder="Search songs by name or artist..."
              @input="searchSongs"
              class="search-input"
            />
            <button @click="searchSongs" class="search-btn">⌕</button>
          </div>
        </div>

        <!-- Search loading -->
        <div v-if="searchLoading" class="search-loading">
          <div class="loading-spinner"></div>
          <p>Searching songs...</p>
        </div>

        <!-- Search results -->
        <div v-else-if="availableSongs.length > 0" class="songs-results">
          <h4>Available songs ({{ availableSongs.length }})</h4>
          <div class="songs-grid">
            <div 
              v-for="song in availableSongs" 
              :key="song.cancionId"
              class="song-result-card"
              :class="{ 'already-added': isSongInPlaylist(song.cancionId) }"
            >
              <img 
                :src="song.image || defaultImage" 
                alt="Song cover" 
                class="song-result-image"
                @error="handleImageError"
              />
              <div class="song-result-info">
                <div class="song-result-title">{{ song.nombre }}</div>
                <div class="song-result-artist">{{ getArtistName(song) }}</div>
                <div class="song-result-duration">{{ formatDuration(song.duracion) }}</div>
              </div>
              <button 
                @click="addSongToCurrentPlaylist(song.cancionId)"
                :disabled="isSongInPlaylist(song.cancionId) || addingSong === song.cancionId"
                class="add-song-btn"
              >
                <span v-if="addingSong === song.cancionId">⟲</span>
                <span v-else-if="isSongInPlaylist(song.cancionId)">✔</span>
                <span v-else>✚</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="songSearchQuery && !searchLoading" class="empty-search">
          <p>No songs found for "{{ songSearchQuery }}"</p>
          <button @click="loadAllSongs" class="load-all-btn">
            Show all songs
          </button>
        </div>

        <!-- Initial state -->
        <div v-else class="initial-state">
          <p>Search for songs by name or artist, or</p>
          <button @click="loadAllSongs" class="load-all-btn">
            Show all available songs
          </button>
        </div>

        <!-- Modal actions -->
        <div class="modal-actions">
          <button @click="closeAddSongsModal" class="cancel-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, onMounted, ref } from 'vue';
import { usePlaylistStore } from '@/stores/PlaylistStore';
import { usePlayerStore } from '@/stores/player';
import { useAuthStore } from '@/stores/auth';
import Swal from 'sweetalert2';

export default defineComponent({
  setup() {
    const playlistStore = usePlaylistStore();
    const playerStore = usePlayerStore();
    const authStore = useAuthStore();

    const showModal = ref(false);
    const isEditing = ref(false);
    const connectionError = ref('');
    const modalData = ref({
      nombre: '',
      descripcion: '',
      image: ''
    });

    // Variables para agregar canciones
    const showAddSongsModal = ref(false);
    const songSearchQuery = ref('');
    const availableSongs = ref([]);
    const searchLoading = ref(false);
    const addingSong = ref(null);

    const defaultImage = 'https://placehold.co/150x150/444/fff?text=Playlist';

    const allPlaylists = computed(() => playlistStore.playlists);
    const selectedPlaylist = computed(() => playlistStore.currentPlaylist);
    const loading = computed(() => playlistStore.loading);
    const error = computed(() => playlistStore.error);

   const formatDuration = (duration) => {
      if (!duration) return '0m 0s';
      const [hours, minutes, seconds] = duration.split(':').map(Number);
      if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
      } else {
        return `${minutes}m ${seconds}s`;
      }
    };

    const getTotalDuration = () => {
      if (!selectedPlaylist.value?.canciones) return '0:00';
      
      let totalSeconds = 0;
      selectedPlaylist.value.canciones.forEach(cancion => {
        if (cancion.duracion) {
          const parts = cancion.duracion.split(':');
          if (parts.length >= 2) {
            const minutes = parseInt(parts[0]) || 0;
            const seconds = parseInt(parts[1]) || 0;
            totalSeconds += minutes * 60 + seconds;
          }
        }
      });

      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
    };

    const getArtistName = (song) => {
      return song.artista || 'Artista desconocido';
    };

    const selectPlaylist = async (playlistId) => {
      try {
        await playlistStore.fetchPlaylistById(playlistId);
      } catch (error) {
        console.error('Error al seleccionar playlist:', error);
      }
    };

    const selectSong = (song) => {
      if (song && !song.artista) {
        song.artista = 'Artista desconocido';
      }
      
      playerStore.setSong(song);
    };

    const playPlaylist = () => {
      if (selectedPlaylist.value?.canciones && selectedPlaylist.value.canciones.length > 0) {
        selectSong(selectedPlaylist.value.canciones[0]);
      }
    };

    const createNewPlaylist = () => {
      modalData.value = {
        nombre: '',
        descripcion: '',
        image: ''
      };
      isEditing.value = false;
      showModal.value = true;
    };

    const editPlaylist = () => {
      if (!selectedPlaylist.value) return;
      
      modalData.value = {
        nombre: selectedPlaylist.value.nombre,
        descripcion: selectedPlaylist.value.descripcion || '',
        image: selectedPlaylist.value.image || ''
      };
      isEditing.value = true;
      showModal.value = true;
    };

    // ✅ FUNCIÓN ACTUALIZADA CON SWEETALERT2
    const savePlaylist = async () => {
      try {
        // Validar que el nombre no esté vacío
        if (!modalData.value.nombre.trim()) {
          Swal.fire({
            icon: 'warning',
            title: 'Name required',
            text: 'The playlist name is mandatory',
            confirmButtonColor: '#ff5100'
          });
          return;
        }

        if (isEditing.value && selectedPlaylist.value) {
          const updatedPlaylist = {
            ...selectedPlaylist.value,
            nombre: modalData.value.nombre.trim(),
            descripcion: modalData.value.descripcion.trim(),
            image: modalData.value.image.trim() || defaultImage
          };
          
          await playlistStore.updatePlaylist(updatedPlaylist);
          
          // ✅ SUCCESS MESSAGE CON SWEETALERT
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Playlist updated successfully',
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
        } else {
          const newPlaylist = {
            userId: authStore.user?.userId || 1,
            creadorId: authStore.user?.userId || 1,
            nombre: modalData.value.nombre.trim(),
            descripcion: modalData.value.descripcion.trim(),
            image: modalData.value.image.trim() || defaultImage
          };
          
          const createdPlaylist = await playlistStore.createPlaylist(newPlaylist);
          
          // ✅ SUCCESS MESSAGE CON SWEETALERT
          Swal.fire({
            icon: 'success',
            title: 'Created!',
            text: `Playlist "${newPlaylist.nombre}" created successfully`,
            confirmButtonColor: '#ff5100',
            draggable: true
          });
          
          // Seleccionar automáticamente la nueva playlist
          if (createdPlaylist) {
            await playlistStore.fetchPlaylistById(createdPlaylist.playlistId);
          }
        }
        
        closeModal();
        
      } catch (error) {
        console.error('Error al guardar playlist:', error);
        
        // ✅ ERROR MESSAGE CON SWEETALERT
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Error saving playlist: ${error.message}`,
          footer: '<a href="#">Why do I have this issue?</a>',
          confirmButtonColor: '#ff5100'
        });
      }
    };

    // ✅ FUNCIÓN ACTUALIZADA CON SWEETALERT2
    const deletePlaylist = async () => {
      if (!selectedPlaylist.value) return;
      
      // ✅ CONFIRMATION DIALOG CON SWEETALERT
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `You are about to delete "${selectedPlaylist.value.nombre}". You won't be able to revert this!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        try {
          await playlistStore.deletePlaylist(selectedPlaylist.value.playlistId);
          
          // ✅ SUCCESS MESSAGE TRAS ELIMINAR
          Swal.fire({
            title: 'Deleted!',
            text: 'Your playlist has been deleted.',
            icon: 'success',
            confirmButtonColor: '#ff5100'
          });
        } catch (error) {
          console.error('Error al eliminar playlist:', error);
          
          // ✅ ERROR MESSAGE
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: `Could not delete playlist: ${error.message}`,
            confirmButtonColor: '#ff5100'
          });
        }
      }
    };

    // ✅ FUNCIÓN ACTUALIZADA CON SWEETALERT2
    const removeSongFromPlaylist = async (cancionId) => {
      if (!selectedPlaylist.value) return;
      
      // ✅ CONFIRMATION DIALOG CON SWEETALERT
      const result = await Swal.fire({
        title: 'Remove song?',
        text: 'Do you want to remove this song from the playlist?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#ff5100',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, remove it',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        try {
          await playlistStore.removeSongFromPlaylist(selectedPlaylist.value.playlistId, cancionId);
          
          // ✅ SUCCESS TOAST
          Swal.fire({
            icon: 'success',
            title: 'Song removed',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
          });
        } catch (error) {
          console.error('Error al eliminar canción:', error);
          
          // ✅ ERROR MESSAGE
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Could not remove song: ${error.message}`,
            confirmButtonColor: '#ff5100'
          });
        }
      }
    };

    // Función para abrir el modal de agregar canciones
    const addSongsToPlaylist = () => {
      if (!selectedPlaylist.value) return;
      showAddSongsModal.value = true;
      loadAllSongs(); // Cargar todas las canciones al abrir
    };

    // Función para cerrar el modal
    const closeAddSongsModal = () => {
      showAddSongsModal.value = false;
      songSearchQuery.value = '';
      availableSongs.value = [];
      addingSong.value = null;
    };

    // Función para cargar todas las canciones disponibles
    const loadAllSongs = async () => {
      searchLoading.value = true;
      try {
        const songs = await playlistStore.loadAllSongs();
        availableSongs.value = songs || [];
        console.log('Canciones cargadas:', availableSongs.value.length);
      } catch (error) {
        console.error('Error al cargar canciones:', error);
        
        // ✅ ERROR CON SWEETALERT
        Swal.fire({
          icon: 'error',
          title: 'Loading error',
          text: 'Could not load available songs',
          confirmButtonColor: '#ff5100'
        });
        availableSongs.value = [];
      } finally {
        searchLoading.value = false;
      }
    };

    // Función para buscar canciones
    const searchSongs = async () => {
      if (!songSearchQuery.value.trim()) {
        loadAllSongs();
        return;
      }

      searchLoading.value = true;
      try {
        const results = await playlistStore.searchSongs(songSearchQuery.value);
        availableSongs.value = results || [];
        console.log('Resultados de búsqueda:', availableSongs.value.length);
      } catch (error) {
        console.error('Error al buscar canciones:', error);
        availableSongs.value = [];
      } finally {
        searchLoading.value = false;
      }
    };

    // Función para verificar si una canción ya está en la playlist
    const isSongInPlaylist = (cancionId) => {
      return selectedPlaylist.value?.canciones?.some(cancion => cancion.cancionId === cancionId) || false;
    };

    // ✅ FUNCIÓN ACTUALIZADA CON SWEETALERT2
    const addSongToCurrentPlaylist = async (cancionId) => {
      if (!selectedPlaylist.value) {
        Swal.fire({
          icon: 'warning',
          title: 'No playlist selected',
          text: 'Please select a playlist first',
          confirmButtonColor: '#ff5100'
        });
        return;
      }
      
      // Verificar si la canción ya está en la playlist
      if (isSongInPlaylist(cancionId)) {
        Swal.fire({
          icon: 'info',
          title: 'Already added',
          text: 'This song is already in the playlist',
          confirmButtonColor: '#ff5100'
        });
        return;
      }
      
      addingSong.value = cancionId;
      
      try {
        await playlistStore.addSongToPlaylist(selectedPlaylist.value.playlistId, cancionId);
        
        // Recargar la playlist para mostrar la nueva canción
        await playlistStore.fetchPlaylistById(selectedPlaylist.value.playlistId);
        
        // También recargar la lista de playlists para actualizar el contador
        await playlistStore.fetchAllPlaylists();
        
        // ✅ SUCCESS TOAST
        Swal.fire({
          icon: 'success',
          title: 'Song added!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000
        });
        
      } catch (error) {
        console.error('Error al agregar canción:', error);
        
        // ✅ ERROR MESSAGE
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Could not add song: ${error.message}`,
          confirmButtonColor: '#ff5100'
        });
      } finally {
        addingSong.value = null;
      }
    };

    const closeModal = () => {
      showModal.value = false;
      isEditing.value = false;
      modalData.value = { nombre: '', descripcion: '', image: '' };
    };

    // ✅ FUNCIÓN ACTUALIZADA CON SWEETALERT2
    const fetchPlaylists = async () => {
      connectionError.value = '';
      try {
        await playlistStore.fetchAllPlaylists();
        
        // Si hay error en el store, mostrarlo
        if (playlistStore.error) {
          if (playlistStore.error.includes('fetch')) {
            connectionError.value = 'No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.';
          } else {
            connectionError.value = playlistStore.error;
          }
        }
      } catch (error) {
        console.error('Error al cargar playlists:', error);
        if (error.message.includes('fetch') || error.message.includes('network')) {
          connectionError.value = 'Error de conexión: No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.';
        } else {
          connectionError.value = `Error: ${error.message}`;
        }
      }
    };

    const retryConnection = async () => {
      await fetchPlaylists();
    };

    // ✅ FUNCIÓN ACTUALIZADA CON SWEETALERT2
    const checkBackendStatus = async () => {
      try {
        const isConnected = await playlistStore.checkConnection();
        
        if (isConnected) {
          Swal.fire({
            icon: 'success',
            title: 'Server OK!',
            text: 'The server is responding correctly. Try loading playlists again.',
            confirmButtonColor: '#ff5100'
          });
          connectionError.value = '';
          await fetchPlaylists();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Server not responding',
            text: 'Please verify that the backend is running on: http://hibikimusicapi.retocsv.es/api',
            confirmButtonColor: '#ff5100'
          });
        }
      } catch (error) {
        console.error('Error al verificar conexión:', error);
        
        Swal.fire({
          icon: 'error',
          title: 'Connection error',
          text: 'Error checking server connection',
          confirmButtonColor: '#ff5100'
        });
      }
    };

    const handleImageError = (event) => {
      event.target.src = defaultImage;
    };

    onMounted(async () => {
      console.log('Componente PlaylistView montado');
      await fetchPlaylists();
    });

    // Al final de tu sección <script>, después de la línea donde tienes:

    return {
      allPlaylists,
      selectedPlaylist,
      loading,
      error,
      connectionError,
      showModal,
      isEditing,
      modalData,
      defaultImage,
      showAddSongsModal,
      songSearchQuery,
      availableSongs,
      searchLoading,
      addingSong,
      selectPlaylist,
      selectSong,
      playPlaylist,
      createNewPlaylist,
      editPlaylist,
      savePlaylist,
      deletePlaylist,
      removeSongFromPlaylist,
      addSongsToPlaylist,
      closeModal,
      closeAddSongsModal,
      loadAllSongs,
      searchSongs,
      isSongInPlaylist,
      addSongToCurrentPlaylist,
      fetchPlaylists,
      retryConnection,
      checkBackendStatus,
      handleImageError,
      formatDuration,
      getTotalDuration,
      getArtistName
    };
  },
});

</script>

<style scoped>
.playlist-page {
  display: flex;
  min-height: 100vh;
  background: #121212;
  color: white;
}

/* Error de conexión */
.connection-error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  background: #121212;
  padding: 20px;
}

.error-content {
  text-align: center;
  background: #1a1a1a;
  padding: 40px;
  border-radius: 12px;
  border: 2px solid #e91e63;
  max-width: 500px;
}

.error-content h3 {
  color: #e91e63;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.error-content p {
  color: #aaa;
  margin-bottom: 25px;
  line-height: 1.5;
}

.error-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.check-btn {
  background: #2196f3;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.check-btn:hover {
  background: #1976d2;
}

/* Loading spinner */
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: #ff5100;
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.main-container {
  display: flex;
  flex: 1;
  width: 100%;
}

.playlists-list {
  width: 30%;
  padding: 20px;
  background: #181818;
  overflow-y: auto;
  max-height: 100vh;
  border-right: 1px solid #333;
}

.playlists-list h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #ff5100;
}

.playlists-list::-webkit-scrollbar {
  width: 8px;
}

.playlists-list::-webkit-scrollbar-track {
  background: #222;
}

.playlists-list::-webkit-scrollbar-thumb {
  background: #ff5100;
  border-radius: 10px;
}

/* States */
.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 40px 20px;
}

.error {
  color: #e91e63;
  margin-bottom: 15px;
}

.retry-btn, .create-btn {
  background: #ff5100;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.retry-btn:hover, .create-btn:hover {
  background: #ca3900;
}

.retry-btn:disabled {
  background: #666;
  cursor: not-allowed;
}

/* Playlist cards */
.playlists-container {
  margin-bottom: 20px;
}

.playlist-card {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 10px;
  padding: 12px;
  background: #222;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.playlist-card:hover {
  background: #333;
  transform: translateY(-2px);
}

.playlist-card.active {
  border-color: #ff5100;
  background: #2a2a2a;
}

.playlist-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-right: 15px;
  object-fit: cover;
}

.playlist-info h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 5px 0;
  color: white;
}

.song-count {
  font-size: 0.85rem;
  color: #aaa;
  margin: 0;
}

.create-playlist-btn {
  width: 100%;
  background: #ff5100;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.create-playlist-btn:hover {
  background: #ca3900;
}

/* Details container */
.details-container {
  width: 70%;
  padding: 30px;
  overflow-y: auto;
}

.no-selection {
  text-align: center;
  padding-top: 100px;
  color: #aaa;
}

.playlist-details {
  max-width: 100%;
}

.playlist-header {
  display: flex;
  align-items: flex-end;
  margin-bottom: 30px;
  gap: 25px;
}

.playlist-cover {
  width: 200px;
  height: 200px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
}

.playlist-meta {
  flex: 1;
}

.playlist-type {
  font-size: 0.85rem;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.playlist-name {
  font-size: 3rem;
  font-weight: 700;
  margin: 10px 0;
  line-height: 1.1;
}

.playlist-description {
  color: #aaa;
  margin: 15px 0;
  line-height: 1.5;
}

.playlist-stats {
  display: flex;
  gap: 15px;
  font-size: 0.9rem;
  color: #aaa;
}

.playlist-stats span {
  position: relative;
}

.playlist-stats span:not(:last-child)::after {
  content: '•';
  margin-left: 15px;
  color: #666;
}

/* Playlist controls */
.playlist-controls {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.play-btn, .edit-btn, .delete-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.play-btn {
  background: #ff5100;
  color: white;
  font-size: 1rem;
}

.play-btn:hover:not(:disabled) {
  background: #ca3900;
  transform: scale(1.05);
}

.play-btn:disabled {
  background: #666;
  cursor: not-allowed;
}

.edit-btn {
  background: transparent;
  color: #aaa;
  border: 1px solid #aaa;
}

.edit-btn:hover {
  color: white;
  border-color: white;
}

.delete-btn {
  background: transparent;
  color: #e91e63;
  border: 1px solid #e91e63;
}

.delete-btn:hover {
  background: #e91e63;
  color: white;
}

/* Botón de agregar en los controles principales */
.add-songs-control-btn {
  background: transparent;
  color: #ff5100;
  border: 1px solid #ff5100;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.add-songs-control-btn:hover {
  background: #ca3900;
  color: white;
}

/* Songs section */
.songs-section {
  margin-bottom: 30px;
}

/* Header de la sección de canciones */
.songs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.songs-header h2 {
  font-size: 1.5rem;
  margin: 0;
  color: white;
}

.songs-list {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.song-card {
  display: grid;
  grid-template-columns: 40px 1fr auto auto;
  align-items: center;
  padding: 12px 16px;
  transition: background-color 0.2s;
  gap: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.song-card:hover {
  background: rgba(255, 255, 255, 0.1);
}

.song-card:last-child {
  border-bottom: none;
}

.song-index {
  color: #aaa;
  font-size: 0.9rem;
  text-align: center;
}

.song-info-container {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.song-image {
  width: 45px;
  height: 45px;
  border-radius: 4px;
  object-fit: cover;
}

.song-info {
  min-width: 0;
  flex: 1;
}

.song-title {
  display: block;
  font-weight: 500;
  color: white;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  display: block;
  color: #aaa;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.song-duration {
  color: #aaa;
  font-size: 0.85rem;
  text-align: right;
  min-width: 50px;
}

.remove-song-btn {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.2s;
  opacity: 0;
  font-size: 1rem;
}

.song-card:hover .remove-song-btn {
  opacity: 1;
}

.remove-song-btn:hover {
  color: #e91e63;
  background: rgba(233, 30, 99, 0.1);
}

/* Estado vacío mejorado */
.empty-playlist {
  text-align: center;
  padding: 80px 20px;
  color: #aaa;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 2px dashed #444;
}

.empty-playlist-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-playlist h3 {
  font-size: 1.5rem;
  color: white;
  margin-bottom: 10px;
}

.empty-playlist p {
  font-size: 1rem;
  margin-bottom: 30px;
  color: #aaa;
}

/* Botón grande para playlist vacía */
.add-songs-btn-large {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.add-songs-btn-large:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
}

/* Botón original (mantener como respaldo) */
.add-songs-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.3s;
  font-weight: 500;
}

.add-songs-btn:hover {
  background: #218838;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #282828;
  border-radius: 12px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  color: white;
}

.modal h3 {
  margin: 0 0 25px 0;
  font-size: 1.5rem;
  color: #ff5100;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #ddd;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #444;
  border-radius: 6px;
  background: #1a1a1a;
  color: white;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ff5100;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
}

.cancel-btn,
.save-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn {
  background: transparent;
  color: #aaa;
  border: 1px solid #444;
}

.cancel-btn:hover {
  color: white;
  border-color: #666;
}

.save-btn {
  background: #ff5100;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #ca3900;
}

.save-btn:disabled {
  background: #666;
  cursor: not-allowed;
}

/* Modal de agregar canciones */
.add-songs-modal {
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
}

.search-section {
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  gap: 10px;
}

.search-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #444;
  border-radius: 6px;
  background: #1a1a1a;
  color: white;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #ff5100;
}

.search-btn {
  padding: 12px 16px;
  background: #ff5100;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-btn:hover {
  background: #ca3900;
}

.search-loading {
  text-align: center;
  padding: 40px;
}

.songs-results h4 {
  color: #ff5100;
  margin-bottom: 15px;
}

.songs-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px;
}

.songs-grid::-webkit-scrollbar {
  width: 6px;
}

.songs-grid::-webkit-scrollbar-track {
  background: #333;
}

.songs-grid::-webkit-scrollbar-thumb {
  background: #ff5100;
  border-radius: 3px;
}

.song-result-card {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #333;
  border-radius: 8px;
  transition: all 0.3s;
  gap: 12px;
}

.song-result-card:hover {
  background: #444;
}

.song-result-card.already-added {
  background: #2a4a2a;
  border: 1px solid #4a7c59;
}

.song-result-image {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.song-result-info {
  flex: 1;
  min-width: 0;
}

.song-result-title {
  font-weight: 600;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.song-result-artist {
  color: #aaa;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.song-result-duration {
  color: #666;
  font-size: 0.8rem;
}

.add-song-btn {
  background: #ff5100;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 40px;
  font-size: 1rem;
}

.add-song-btn:hover:not(:disabled) {
  background: #ca3900;
  transform: scale(1.1);
}

.add-song-btn:disabled {
  background: #666;
  cursor: not-allowed;
  transform: none;
}

.empty-search, .initial-state {
  text-align: center;
  padding: 40px;
  color: #aaa;
}

.load-all-btn {
  background: #444;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.3s;
}

.load-all-btn:hover {
  background: #555;
}

/* Responsive design */
@media (max-width: 900px) {
  .main-container {
    flex-direction: column;
  }
  
  .playlists-list {
    width: 100%;
    max-height: 300px;
    border-right: none;
    border-bottom: 1px solid #333;
  }
  
  .details-container {
    width: 100%;
  }
  
  .playlist-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .playlist-name {
    font-size: 2rem;
  }
  
  .playlist-cover {
    width: 150px;
    height: 150px;
  }
}

@media (max-width: 768px) {
  .songs-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .songs-header h2 {
    margin-bottom: 0;
  }
  
  .add-songs-header-btn {
    align-self: stretch;
    text-align: center;
  }
  
  .playlist-controls {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .add-songs-control-btn {
    flex: 1;
    min-width: 140px;
  }
}

@media (max-width: 600px) {
  .playlists-list,
  .details-container {
    padding: 15px;
  }
  
  .playlist-controls {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .play-btn,
  .edit-btn,
  .delete-btn,
  .add-songs-control-btn {
    flex: 1;
    min-width: 120px;
  }
  
  .song-card {
    grid-template-columns: 30px 1fr auto;
    gap: 10px;
  }
  
  .remove-song-btn {
    opacity: 1;
  }
  
  .modal {
    padding: 20px;
    width: 95%;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .cancel-btn,
  .save-btn {
    width: 100%;
  }
  
  .add-songs-modal {
    width: 95%;
    max-height: 85vh;
  }
  
  .search-bar {
    flex-direction: column;
  }
  
  .song-result-card {
    padding: 8px;
  }
  
  .song-result-image {
    width: 40px;
    height: 40px;
  }
}
</style>