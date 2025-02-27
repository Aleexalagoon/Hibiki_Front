<template>
    <div class="playlist-detail">
      <!-- Mensaje de carga -->
      <div v-if="playlistStore.loading" class="loading">
        Cargando playlist...
      </div>
      
      <!-- Mensaje de error -->
      <div v-if="playlistStore.error" class="error">
        {{ playlistStore.error }}
      </div>
      
      <!-- Vista de playlist cargada -->
      <template v-if="playlist && !playlistStore.loading">
        <div class="album-view">
          <div class="album-header">
            <img 
              :src="coverImage" 
              alt="Playlist Cover" 
              class="album-cover" 
            />
            <div class="album-info">
              <h1>{{ playlist.nombre }}</h1>
              <h2>{{ playlist.creador?.nombre || 'Usuario' }}</h2>
              <p>{{ playlist.descripcion }}</p>
              <button class="preview-btn" @click="playAllSongs">▶ Reproducir</button>
              
              <!-- Botones de edición y eliminación -->
              <div class="action-buttons">
                <button class="edit-btn" @click="showEditModal = true">Editar</button>
                <button class="delete-btn" @click="confirmDelete">Eliminar</button>
              </div>
            </div>
          </div>
          
          <!-- Lista de canciones -->
          <div class="tracklist">
            <div 
              v-for="(song, index) in playlist.canciones" 
              :key="index" 
              class="track"
              @click="playSong(song)"
            >
              <img :src="song.image || '/images/default-song.jpg'" alt="Song Thumbnail" class="track-thumbnail" />
              <span class="track-title">{{ song.nombre }}</span>
              <span class="track-artist">{{ song.artista }}</span>
              <span class="track-duration">{{ song.duracion || '0:00' }}</span>
              <button class="remove-track-btn" @click.stop="removeSong(song.cancionId)">×</button>
            </div>
            
            <!-- Botón para añadir canciones -->
            <div class="track add-track" @click="showAddSongModal = true">
              <div class="add-song-placeholder">
                <span>+</span>
              </div>
              <span class="track-title">Añadir canciones</span>
            </div>
          </div>
          
          <div class="album-details">
            <p><strong>Número de canciones:</strong> {{ playlist.canciones.length }}</p>
            <p><strong>Duración total:</strong> {{ totalDuration }}</p>
            <p><strong>Fecha de creación:</strong> {{ formatDate(playlist.fechaCreacion) }}</p>
          </div>
        </div>
      </template>
      
      <!-- Modal para editar la playlist -->
      <div v-if="showEditModal && playlist" class="modal-overlay">
        <div class="modal">
          <h2>Editar Playlist</h2>
          <form @submit.prevent="updatePlaylist">
            <div class="form-group">
              <label for="editName">Nombre:</label>
              <input id="editName" v-model="editForm.nombre" required />
            </div>
            <div class="form-group">
              <label for="editDescription">Descripción:</label>
              <textarea id="editDescription" v-model="editForm.descripcion"></textarea>
            </div>
            <div class="modal-actions">
              <button type="button" class="cancel-btn" @click="showEditModal = false">
                Cancelar
              </button>
              <button type="submit" class="submit-btn">
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Modal para añadir canciones -->
      <div v-if="showAddSongModal" class="modal-overlay">
        <div class="modal">
          <h2>Añadir Canciones</h2>
          <div class="search-bar">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Buscar canciones..." 
              @input="searchSongs" 
            />
          </div>
          
          <div class="song-results">
            <div 
              v-for="song in availableSongs" 
              :key="song.cancionId" 
              class="song-result-item"
              @click="addSong(song)"
            >
              <img :src="song.image || '/images/default-song.jpg'" alt="Song Thumbnail" class="song-thumbnail" />
              <div class="song-info">
                <div class="song-name">{{ song.nombre }}</div>
                <div class="song-artist">{{ song.artista }}</div>
              </div>
              <button class="add-song-btn">+</button>
            </div>
            
            <div v-if="availableSongs.length === 0" class="no-songs-found">
              No se encontraron canciones
            </div>
          </div>
          
          <div class="modal-actions">
            <button class="cancel-btn" @click="showAddSongModal = false">
              Cerrar
            </button>
          </div>
        </div>
      </div>
      
      <!-- Modal de confirmación para eliminar playlist -->
      <div v-if="showDeleteConfirm" class="modal-overlay">
        <div class="modal confirm-modal">
          <h2>Eliminar Playlist</h2>
          <p>¿Estás seguro de que quieres eliminar la playlist "{{ playlist?.nombre }}"? Esta acción no se puede deshacer.</p>
          <div class="modal-actions">
            <button class="cancel-btn" @click="showDeleteConfirm = false">
              Cancelar
            </button>
            <button class="delete-btn" @click="deletePlaylist">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { usePlaylistStore, type Playlist } from '@/stores/playlist';
  import { usePlayerStore, type Song } from '@/stores/player';
  import { useAuthStore } from '@/stores/auth';
  
  const route = useRoute();
  const router = useRouter();
  const playlistStore = usePlaylistStore();
  const playerStore = usePlayerStore();
  const authStore = useAuthStore();
  
  // Estado para los modales
  const showEditModal = ref(false);
  const showAddSongModal = ref(false);
  const showDeleteConfirm = ref(false);
  
  // Estado para la búsqueda de canciones
  const searchQuery = ref('');
  const availableSongs = ref<Song[]>([]);
  
  // ID de la playlist
  const playlistId = computed(() => parseInt(route.params.id as string));
  
  // Formulario de edición
  const editForm = ref({
    nombre: '',
    descripcion: ''
  });
  
  // Obtener la playlist actual
  const playlist = computed(() => {
    return playlistStore.currentPlaylist || 
           playlistStore.getPlaylistById(playlistId.value);
  });
  
  // Imagen de portada
  const coverImage = computed(() => {
    if (playlist.value?.canciones && playlist.value.canciones.length > 0) {
      return playlist.value.canciones[0].image || '/images/default-playlist.jpg';
    }
    return '/images/default-playlist.jpg';
  });
  
  // Duración total formateada
  const totalDuration = computed(() => {
    if (!playlist.value) return '0:00';
    
    let totalSeconds = 0;
    playlist.value.canciones.forEach(cancion => {
      if (cancion.duracion) {
        const [minutes, seconds] = cancion.duracion.split(':').map(Number);
        totalSeconds += minutes * 60 + (seconds || 0);
      }
    });
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  });
  
  // Cargar la playlist al montar el componente
  onMounted(async () => {
    if (!authStore.isAuthenticated) {
      router.push('/login');
      return;
    }
    
    try {
      await playlistStore.fetchPlaylistById(playlistId.value);
      // También obtener todas las canciones disponibles para añadir
      await loadAvailableSongs();
    } catch (error) {
      console.error('Error al cargar la playlist:', error);
    }
  });
  
  // Actualizar el formulario de edición cuando cambie la playlist
  watch(playlist, (newPlaylist) => {
    if (newPlaylist) {
      editForm.value = {
        nombre: newPlaylist.nombre,
        descripcion: newPlaylist.descripcion
      };
    }
  }, { immediate: true });
  
  // Formatear fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Cargar canciones disponibles (simularemos esto)
  const loadAvailableSongs = async () => {
    // En una aplicación real, esta función obtendría canciones del backend
    // Por ahora, usaremos datos de ejemplo
    availableSongs.value = [
      { cancionId: 101, nombre: 'Bohemian Rhapsody', artista: 'Queen', duracion: '5:55', image: 'https://i.scdn.co/image/ab67616d0000b273851222dc5c5681bd4c3119d3', ruta: '/music/bohemian.mp3' },
      { cancionId: 102, nombre: 'Hotel California', artista: 'Eagles', duracion: '6:30', image: 'https://i.scdn.co/image/ab67616d0000b273076ef0fed51ff7a4911459e9', ruta: '/music/hotel.mp3' },
      { cancionId: 103, nombre: 'Sweet Child O\' Mine', artista: 'Guns N\' Roses', duracion: '5:56', image: 'https://i.scdn.co/image/ab67616d0000b273dcec31b44548687b2a81d0c2', ruta: '/music/sweet.mp3' },
      { cancionId: 104, nombre: 'Imagine', artista: 'John Lennon', duracion: '3:04', image: 'https://cdn-images.dzcdn.net/images/cover/2194275a797bd8d5ed038b61b053813a/0x1900-000000-80-0-0.jpg', ruta: '/music/imagine.mp3' },
      { cancionId: 105, nombre: 'Thriller', artista: 'Michael Jackson', duracion: '5:57', image: 'https://i.s