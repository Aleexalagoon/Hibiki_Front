<template>
  <div class="container">
    <table class="artists-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>NOMBRE</th>
          <th>OYENTES MENSUALES</th>
          <th>DESCRIPCIÓN</th>
          <th>ACTUALIZAR</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="artist in artists" :key="artist.cantanteId">
          <td>{{ artist.cantanteId }}</td>
          <td>{{ artist.nombre }}</td>
          <td>{{ formatListeners(artist.oyentesMensuales) }}</td>
          <td>{{ artist.descripcion }}</td>
          <td>
            <button @click="openUpdateModal(artist)" class="action-button">ACTUALIZAR</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="buttons">
      <button @click="openAddModal" class="add-button">AÑADIR</button>
      <button @click="openDeleteModal" class="delete-button">BORRAR</button>
      <router-link to="/zonaprivada" class="back-button">VOLVER</router-link>
    </div>

    <!-- Modal para Añadir Artista -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Añadir Nuevo Artista</h2>
          <button class="close-btn" @click="closeModals">&times;</button>
        </div>
        <form @submit.prevent="addArtist" class="modal-form">
          <div class="form-group">
            <label for="add-nombre">Nombre del Artista:</label>
            <input 
              type="text" 
              id="add-nombre" 
              v-model="addForm.nombre" 
              required 
              placeholder="Ingresa el nombre del artista"
            >
          </div>
          <div class="form-group">
            <label for="add-oyentes">Oyentes Mensuales:</label>
            <input 
              type="number" 
              id="add-oyentes" 
              v-model="addForm.oyentesMensuales" 
              required 
              min="0"
              placeholder="Número de oyentes mensuales"
            >
          </div>
          <div class="form-group">
            <label for="add-descripcion">Descripción:</label>
            <textarea 
              id="add-descripcion" 
              v-model="addForm.descripcion" 
              required 
              placeholder="Ingresa una descripción del artista"
              rows="4"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="add-image">URL de la Imagen:</label>
            <input 
              type="url" 
              id="add-image" 
              v-model="addForm.image" 
              required
              placeholder="https://ejemplo.com/imagen.jpg"
            >
            <div v-if="addForm.image" class="image-preview">
              <img :src="addForm.image" alt="Vista previa" class="preview-img" @error="imageError">
            </div>
          </div>
          <div class="modal-buttons">
            <button type="submit" class="submit-btn">Añadir Artista</button>
            <button type="button" @click="closeModals" class="cancel-btn">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para Actualizar Artista -->
    <div v-if="showUpdateModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Actualizar Artista</h2>
          <button class="close-btn" @click="closeModals">&times;</button>
        </div>
        <form @submit.prevent="updateArtist" class="modal-form">
          <div class="form-group">
            <label for="update-id">ID del Artista:</label>
            <input 
              type="number" 
              id="update-id" 
              v-model="updateForm.cantanteId" 
              readonly 
              class="readonly-input"
            >
          </div>
          <div class="form-group">
            <label for="update-nombre">Nombre del Artista:</label>
            <input 
              type="text" 
              id="update-nombre" 
              v-model="updateForm.nombre" 
              required 
              placeholder="Ingresa el nombre del artista"
            >
          </div>
          <div class="form-group">
            <label for="update-oyentes">Oyentes Mensuales:</label>
            <input 
              type="number" 
              id="update-oyentes" 
              v-model="updateForm.oyentesMensuales" 
              required 
              min="0"
              placeholder="Número de oyentes mensuales"
            >
          </div>
          <div class="form-group">
            <label for="update-descripcion">Descripción:</label>
            <textarea 
              id="update-descripcion" 
              v-model="updateForm.descripcion" 
              required 
              placeholder="Ingresa una descripción del artista"
              rows="4"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="update-image">URL de la Imagen:</label>
            <input 
              type="url" 
              id="update-image" 
              v-model="updateForm.image" 
              required
              placeholder="https://ejemplo.com/imagen.jpg"
            >
            <div v-if="updateForm.image" class="image-preview">
              <img :src="updateForm.image" alt="Vista previa" class="preview-img" @error="imageError">
            </div>
          </div>
          <div class="modal-buttons">
            <button type="submit" class="submit-btn">Actualizar Artista</button>
            <button type="button" @click="closeModals" class="cancel-btn">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para Eliminar Artista -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeModals">
      <div class="modal delete-modal" @click.stop>
        <div class="modal-header">
          <h2>Eliminar Artista</h2>
          <button class="close-btn" @click="closeModals">&times;</button>
        </div>
        <form @submit.prevent="deleteArtist" class="modal-form">
          <div class="form-group">
            <label for="delete-id">ID del Artista a Eliminar:</label>
            <input 
              type="number" 
              id="delete-id" 
              v-model="deleteForm.cantanteId" 
              required 
              placeholder="Ingresa el ID del artista"
            >
          </div>
          <div class="artist-info" v-if="artistToDelete">
            <div class="info-card">
              <h3>Información del Artista:</h3>
              <p><strong>Nombre:</strong> {{ artistToDelete.nombre }}</p>
              <p><strong>Oyentes:</strong> {{ formatListeners(artistToDelete.oyentesMensuales) }}</p>
              <p><strong>Descripción:</strong> {{ artistToDelete.descripcion }}</p>
            </div>
          </div>
          <div class="warning-message">
            <p>⚠️ Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este artista?</p>
          </div>
          <div class="modal-buttons">
            <button type="button" @click="searchArtist" class="search-btn">Buscar Artista</button>
            <button type="submit" class="delete-confirm-btn" :disabled="!artistToDelete">Eliminar Artista</button>
            <button type="button" @click="closeModals" class="cancel-btn">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const artists = ref([])

// Estados de los modales
const showAddModal = ref(false)
const showUpdateModal = ref(false)
const showDeleteModal = ref(false)

// Artista a eliminar (para mostrar información)
const artistToDelete = ref(null)

// Formularios reactivos
const addForm = ref({
  nombre: '',
  oyentesMensuales: null,
  descripcion: '',
  image: ''
})

const updateForm = ref({
  cantanteId: null,
  nombre: '',
  oyentesMensuales: null,
  descripcion: '',
  image: ''
})

const deleteForm = ref({
  cantanteId: null
})

// Funciones para manejar los modales
const openAddModal = () => {
  resetAddForm()
  showAddModal.value = true
}

const openUpdateModal = (artist) => {
  updateForm.value = {
    cantanteId: artist.cantanteId,
    nombre: artist.nombre,
    oyentesMensuales: artist.oyentesMensuales,
    descripcion: artist.descripcion,
    image: artist.image || ''
  }
  showUpdateModal.value = true
}

const openDeleteModal = () => {
  deleteForm.value.cantanteId = null
  artistToDelete.value = null
  showDeleteModal.value = true
}

const closeModals = () => {
  showAddModal.value = false
  showUpdateModal.value = false
  showDeleteModal.value = false
  artistToDelete.value = null
}

const resetAddForm = () => {
  addForm.value = {
    nombre: '',
    oyentesMensuales: null,
    descripcion: '',
    image: ''
  }
}

// Función para buscar artista antes de eliminar
const searchArtist = () => {
  if (deleteForm.value.cantanteId) {
    const artist = artists.value.find(a => a.cantanteId == deleteForm.value.cantanteId)
    artistToDelete.value = artist || null
    if (!artist) {
      alert('Artista no encontrado')
    }
  }
}

// Función para formatear oyentes
const formatListeners = (listeners) => {
  if (!listeners) return '0'
  return listeners.toLocaleString()
}

// Función para manejar errores de imagen
const imageError = (event) => {
  event.target.style.display = 'none'
}

// Funciones API
const fetchArtists = async () => {
  try {
    const response = await fetch(`http://hibikimusicapi.retocsv.es/api/Artista`)
    const data = await response.json()
    artists.value = data
  } catch (error) {
    console.error('Error fetching artists:', error)
    alert('Failed to fetch artists')
  }
}

const addArtist = async () => {
  try {
    const response = await fetch(`http://hibikimusicapi.retocsv.es/api/Artista`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: addForm.value.nombre,
        oyentesMensuales: parseInt(addForm.value.oyentesMensuales),
        descripcion: addForm.value.descripcion,
        image: addForm.value.image
      })
    })
    
    if (response.ok) {
      await fetchArtists()
      closeModals()
      alert('¡Artista añadido exitosamente!')
    } else {
      alert(`Error al añadir artista: ${await response.text()}`)
    }
  } catch (error) {
    console.error('Error adding artist:', error)
    alert('Error al añadir artista')
  }
}

const updateArtist = async () => {
  try {
    const response = await fetch(`http://hibikimusicapi.retocsv.es/api/Artista/${updateForm.value.cantanteId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cantanteId: updateForm.value.cantanteId,
        nombre: updateForm.value.nombre,
        oyentesMensuales: parseInt(updateForm.value.oyentesMensuales),
        descripcion: updateForm.value.descripcion,
        image: updateForm.value.image
      })
    })
    
    if (response.ok) {
      await fetchArtists()
      closeModals()
      alert('¡Artista actualizado exitosamente!')
    } else {
      alert(`Error al actualizar artista: ${await response.text()}`)
    }
  } catch (error) {
    console.error('Error updating artist:', error)
    alert('Error al actualizar artista')
  }
}

const deleteArtist = async () => {
  try {
    const response = await fetch(`http://hibikimusicapi.retocsv.es/api/Artista/${deleteForm.value.cantanteId}`, {
      method: 'DELETE'
    })
    
    if (response.ok) {
      await fetchArtists()
      closeModals()
      alert('¡Artista eliminado exitosamente!')
    } else {
      alert(`Error al eliminar artista: ${await response.text()}`)
    }
  } catch (error) {
    console.error('Error deleting artist:', error)
    alert('Error al eliminar artista')
  }
}

onMounted(fetchArtists)
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.artist-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
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

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #444;
  border-radius: 5px;
  background-color: #2a2a2a;
  color: white;
  font-family: "Jura", sans-serif;
  font-size: 14px;
  box-sizing: border-box;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ff5100;
  box-shadow: 0 0 5px rgba(255, 81, 0, 0.3);
}

.readonly-input {
  background-color: #3a3a3a !important;
  cursor: not-allowed;
}

.image-preview {
  margin-top: 10px;
  text-align: center;
}

.preview-img {
  max-width: 150px;
  max-height: 150px;
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

.artist-info {
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
  margin-bottom: 10px;
  font-family: "Jura", sans-serif;
}

.info-card p {
  color: white;
  margin: 5px 0;
  font-family: "Jura", sans-serif;
}

.delete-modal {
  border-color: #dc3545;
}

.delete-modal .modal-header {
  background-color: #dc3545;
}
</style>