<template>
  <div class="container">
    <table class="albums-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>NOMBRE</th>
          <th>ARTISTA ID</th>
          <th>FECHA DE LANZAMIENTO</th>
          <th>ACTUALIZAR</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="album in albums" :key="album.albumId">
          <td>{{ album.albumId }}</td>
          <td>{{ album.name }}</td>
          <td>{{ album.artistId }}</td>
          <td>{{ formatReleaseDate(album.releaseDate) }}</td>
          <td>
            <button @click="openUpdateModal(album)" class="action-button">ACTUALIZAR</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="buttons">
      <button @click="openAddModal" class="add-button">AÑADIR</button>
      <button @click="openDeleteModal" class="delete-button">BORRAR</button>
      <router-link to="/zonaprivada" class="back-button">VOLVER</router-link>
    </div>

    <!-- Modal para Añadir Álbum -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Añadir Nuevo Álbum</h2>
          <button class="close-btn" @click="closeModals">&times;</button>
        </div>
        <form @submit.prevent="addAlbum" class="modal-form">
          <div class="form-group">
            <label for="add-name">Nombre del Álbum:</label>
            <input 
              type="text" 
              id="add-name" 
              v-model="addForm.name" 
              required 
              placeholder="Ingresa el nombre del álbum"
            >
          </div>
          <div class="form-group">
            <label for="add-artistId">ID del Artista:</label>
            <input 
              type="number" 
              id="add-artistId" 
              v-model="addForm.artistId" 
              required 
              min="1"
              placeholder="Ingresa el ID del artista"
            >
            <small class="form-hint">Debe ser un ID válido de artista existente</small>
          </div>
          <div class="form-group">
            <label for="add-releaseDate">Fecha de Lanzamiento:</label>
            <input 
              type="date" 
              id="add-releaseDate" 
              v-model="addForm.releaseDate" 
              required
              :max="currentDate"
            >
            <small class="form-hint">La fecha no puede ser futura</small>
          </div>
          <div class="form-group">
            <label for="add-image">URL de la Imagen:</label>
            <input 
              type="url" 
              id="add-image" 
              v-model="addForm.image" 
              placeholder="https://ejemplo.com/portada.jpg"
            >
            <div v-if="addForm.image" class="image-preview">
              <img :src="addForm.image" alt="Vista previa del álbum" class="preview-img" @error="imageError">
            </div>
          </div>
          <div class="modal-buttons">
            <button type="submit" class="submit-btn">Añadir Álbum</button>
            <button type="button" @click="closeModals" class="cancel-btn">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para Actualizar Álbum -->
    <div v-if="showUpdateModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Actualizar Álbum</h2>
          <button class="close-btn" @click="closeModals">&times;</button>
        </div>
        <form @submit.prevent="updateAlbum" class="modal-form">
          <div class="form-group">
            <label for="update-id">ID del Álbum:</label>
            <input 
              type="number" 
              id="update-id" 
              v-model="updateForm.albumId" 
              readonly 
              class="readonly-input"
            >
          </div>
          <div class="form-group">
            <label for="update-name">Nombre del Álbum:</label>
            <input 
              type="text" 
              id="update-name" 
              v-model="updateForm.name" 
              required 
              placeholder="Ingresa el nombre del álbum"
            >
          </div>
          <div class="form-group">
            <label for="update-artistId">ID del Artista:</label>
            <input 
              type="number" 
              id="update-artistId" 
              v-model="updateForm.artistId" 
              required 
              min="1"
              placeholder="Ingresa el ID del artista"
            >
            <small class="form-hint">Debe ser un ID válido de artista existente</small>
          </div>
          <div class="form-group">
            <label for="update-releaseDate">Fecha de Lanzamiento:</label>
            <input 
              type="date" 
              id="update-releaseDate" 
              v-model="updateForm.releaseDate" 
              required
              :max="currentDate"
            >
            <small class="form-hint">La fecha no puede ser futura</small>
          </div>
          <div class="form-group">
            <label for="update-image">URL de la Imagen:</label>
            <input 
              type="url" 
              id="update-image" 
              v-model="updateForm.image" 
              placeholder="https://ejemplo.com/portada.jpg"
            >
            <div v-if="updateForm.image" class="image-preview">
              <img :src="updateForm.image" alt="Vista previa del álbum" class="preview-img" @error="imageError">
            </div>
          </div>
          <div class="modal-buttons">
            <button type="submit" class="submit-btn">Actualizar Álbum</button>
            <button type="button" @click="closeModals" class="cancel-btn">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para Eliminar Álbum -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeModals">
      <div class="modal delete-modal" @click.stop>
        <div class="modal-header">
          <h2>Eliminar Álbum</h2>
          <button class="close-btn" @click="closeModals">&times;</button>
        </div>
        <form @submit.prevent="deleteAlbum" class="modal-form">
          <div class="form-group">
            <label for="delete-id">ID del Álbum a Eliminar:</label>
            <input 
              type="number" 
              id="delete-id" 
              v-model="deleteForm.albumId" 
              required 
              min="1"
              placeholder="Ingresa el ID del álbum"
            >
          </div>
          <div class="album-info" v-if="albumToDelete">
            <div class="info-card">
              <h3>Información del Álbum:</h3>
              <div class="album-details">
                <div v-if="albumToDelete.image" class="album-cover">
                  <img :src="albumToDelete.image" alt="Portada del álbum" class="cover-img">
                </div>
                <div class="album-text">
                  <p><strong>Nombre:</strong> {{ albumToDelete.name }}</p>
                  <p><strong>Artista ID:</strong> {{ albumToDelete.artistId }}</p>
                  <p><strong>Fecha de Lanzamiento:</strong> {{ formatReleaseDate(albumToDelete.releaseDate) }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="warning-message">
            <p>⚠️ Esta acción eliminará el álbum y podría afectar las canciones asociadas. ¿Estás seguro?</p>
          </div>
          <div class="modal-buttons">
            <button type="button" @click="searchAlbum" class="search-btn">Buscar Álbum</button>
            <button type="submit" class="delete-confirm-btn" :disabled="!albumToDelete">Eliminar Álbum</button>
            <button type="button" @click="closeModals" class="cancel-btn">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const albums = ref([])

// Estados de los modales
const showAddModal = ref(false)
const showUpdateModal = ref(false)
const showDeleteModal = ref(false)

// Álbum a eliminar (para mostrar información)
const albumToDelete = ref(null)

// Fecha actual para validaciones
const currentDate = computed(() => new Date().toISOString().split('T')[0])

// Formularios reactivos
const addForm = ref({
  name: '',
  artistId: null,
  releaseDate: '',
  image: ''
})

const updateForm = ref({
  albumId: null,
  name: '',
  artistId: null,
  releaseDate: '',
  image: ''
})

const deleteForm = ref({
  albumId: null
})

// Funciones para manejar los modales
const openAddModal = () => {
  resetAddForm()
  showAddModal.value = true
}

const openUpdateModal = (album) => {
  updateForm.value = {
    albumId: album.albumId,
    name: album.name,
    artistId: album.artistId,
    releaseDate: formatDateForInput(album.releaseDate),
    image: album.image || ''
  }
  showUpdateModal.value = true
}

const openDeleteModal = () => {
  deleteForm.value.albumId = null
  albumToDelete.value = null
  showDeleteModal.value = true
}

const closeModals = () => {
  showAddModal.value = false
  showUpdateModal.value = false
  showDeleteModal.value = false
  albumToDelete.value = null
}

const resetAddForm = () => {
  addForm.value = {
    name: '',
    artistId: null,
    releaseDate: '',
    image: ''
  }
}

// Función para buscar álbum antes de eliminar
const searchAlbum = () => {
  if (deleteForm.value.albumId) {
    const album = albums.value.find(a => a.albumId == deleteForm.value.albumId)
    albumToDelete.value = album || null
    if (!album) {
      alert('Álbum no encontrado')
    }
  }
}

// Funciones de formateo
const formatReleaseDate = (releaseDate) => {
  if (!releaseDate) return 'N/A'
  return new Date(releaseDate).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  return dateString.split('T')[0]
}

// Función para manejar errores de imagen
const imageError = (event) => {
  event.target.style.display = 'none'
}

// Funciones API
const fetchAlbums = async () => {
  try {
    const response = await fetch(`http://hibikimusicapi.retocsv.es/api/Album`)
    const data = await response.json()
    albums.value = data
  } catch (error) {
    console.error('Error fetching albums:', error)
    alert('Failed to fetch albums')
  }
}

const addAlbum = async () => {
  try {
    const response = await fetch(`http://hibikimusicapi.retocsv.es/api/Album`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: addForm.value.name,
        artistId: parseInt(addForm.value.artistId),
        releaseDate: addForm.value.releaseDate,
        image: addForm.value.image
      })
    })
    
    if (response.ok) {
      await fetchAlbums()
      closeModals()
      alert('¡Álbum añadido exitosamente!')
    } else {
      alert(`Error al añadir álbum: ${await response.text()}`)
    }
  } catch (error) {
    console.error('Error adding album:', error)
    alert('Error al añadir álbum')
  }
}

const updateAlbum = async () => {
  try {
    const response = await fetch(`http://hibikimusicapi.retocsv.es/api/Album/${updateForm.value.albumId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        albumId: updateForm.value.albumId,
        name: updateForm.value.name,
        artistId: parseInt(updateForm.value.artistId),
        releaseDate: updateForm.value.releaseDate,
        image: updateForm.value.image
      })
    })
    
    if (response.ok) {
      await fetchAlbums()
      closeModals()
      alert('¡Álbum actualizado exitosamente!')
    } else {
      alert(`Error al actualizar álbum: ${await response.text()}`)
    }
  } catch (error) {
    console.error('Error updating album:', error)
    alert('Error al actualizar álbum')
  }
}

const deleteAlbum = async () => {
  try {
    const response = await fetch(`http://hibikimusicapi.retocsv.es/api/Album/${deleteForm.value.albumId}`, {
      method: 'DELETE'
    })
    
    if (response.ok) {
      await fetchAlbums()
      closeModals()
      alert('¡Álbum eliminado exitosamente!')
    } else {
      alert(`Error al eliminar álbum: ${await response.text()}`)
    }
  } catch (error) {
    console.error('Error deleting album:', error)
    alert('Error al eliminar álbum')
  }
}

onMounted(fetchAlbums)
</script>

<style scoped>
body {
  font-family: "Jura", sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #121212;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

table {
  width: 80%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

thead th {
  background-color: #ff5100;
  padding: 10px;
  border: 1px solid #ffffff;
  color: white;
}

tbody td {
  background-color: #1e1e1e;
  padding: 10px;
  border: 1px solid #444;
  text-align: center;
  color: white;
}

.album-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
}

.buttons {
  display: flex;
  gap: 10px;
}

button {
  font-family: "Jura", sans-serif;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #ff5100;
  color: white;
  border: none;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #ff6b35;
}

button:disabled {
  background-color: #666;
  cursor: not-allowed;
}

.back-button {
  text-decoration: none;
  display: inline-block;
  padding: 10px 20px;
  background-color: #ff5100;
  color: white;
  font-family: "Jura", sans-serif;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #ff6b35;
}

/* Estilos para los modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: #1e1e1e;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  border: 2px solid #ff5100;
}

.modal-header {
  background-color: #ff5100;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px 8px 0 0;
}

.modal-header h2 {
  margin: 0;
  font-family: "Jura", sans-serif;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.modal-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: white;
  font-family: "Jura", sans-serif;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #444;
  border-radius: 5px;
  background-color: #2a2a2a;
  color: white;
  font-family: "Jura", sans-serif;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #ff5100;
  box-shadow: 0 0 5px rgba(255, 81, 0, 0.3);
}

.readonly-input {
  background-color: #3a3a3a !important;
  cursor: not-allowed;
}

.form-hint {
  display: block;
  color: #aaa;
  font-size: 12px;
  margin-top: 5px;
  font-style: italic;
}

.image-preview {
  margin-top: 10px;
  text-align: center;
}

.preview-img {
  max-width: 200px;
  max-height: 200px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid #ff5100;
}

.modal-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
  flex-wrap: wrap;
}

.submit-btn {
  background-color: #ff5100;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Jura", sans-serif;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #ff6b35;
}

.cancel-btn {
  background-color: #666;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Jura", sans-serif;
  transition: background-color 0.3s ease;
}

.cancel-btn:hover {
  background-color: #777;
}

.search-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Jura", sans-serif;
  transition: background-color 0.3s ease;
}

.search-btn:hover {
  background-color: #0056b3;
}

.delete-confirm-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Jura", sans-serif;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.delete-confirm-btn:hover:not(:disabled) {
  background-color: #c82333;
}

.warning-message {
  background-color: #2a1f1f;
  border: 1px solid #dc3545;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;
}

.warning-message p {
  color: #ffcccc;
  margin: 0;
  font-family: "Jura", sans-serif;
}

.album-info {
  margin-bottom: 20px;
}

.info-card {
  background-color: #2a2a2a;
  border: 1px solid #555;
  border-radius: 5px;
  padding: 15px;
}

.info-card h3 {
  color: #ff5100;
  margin-top: 0;
  margin-bottom: 15px;
  font-family: "Jura", sans-serif;
}

.album-details {
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.album-cover {
  flex-shrink: 0;
}

.cover-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #ff5100;
}

.album-text {
  flex: 1;
}

.album-text p {
  color: white;
  margin: 8px 0;
  font-family: "Jura", sans-serif;
}

.delete-modal {
  border-color: #dc3545;
}

.delete-modal .modal-header {
  background-color: #dc3545;
}

@media (max-width: 600px) {
  .album-details {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .modal-buttons {
    justify-content: center;
  }
}
</style>