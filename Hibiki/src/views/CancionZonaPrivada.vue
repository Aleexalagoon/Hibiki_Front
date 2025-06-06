<template>
  <div class="container">
    <table class="songs-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>TITULO</th>
          <th>ALBUM</th>
          <th>DURACION</th>
          <th>ACTUALIZAR</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="song in songs" :key="song.cancionId">
          <td>{{ song.cancionId }}</td>
          <td>{{ song.nombre }}</td>
          <td>{{ song.albumId }}</td>
          <td>{{ formatDuration(song.duracion) }}</td>
          <td>
            <button @click="openUpdateModal(song)" class="action-button">ACTUALIZAR</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="buttons">
      <button @click="openAddModal" class="add-button">AÑADIR</button>
      <button @click="openDeleteModal" class="delete-button">BORRAR</button>
      <router-link to="/zonaprivada" class="back-button">VOLVER</router-link>
    </div>

    <!-- Modal para Añadir Canción -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Añadir Nueva Canción</h2>
          <button class="close-btn" @click="closeModals">&times;</button>
        </div>
        <form @submit.prevent="addSong" class="modal-form">
          <div class="form-group">
            <label for="add-nombre">Nombre de la Canción:</label>
            <input 
              type="text" 
              id="add-nombre" 
              v-model="addForm.nombre" 
              required 
              placeholder="Ingresa el título de la canción"
            >
          </div>
          <div class="form-group">
            <label for="add-albumId">ID del Álbum:</label>
            <input 
              type="number" 
              id="add-albumId" 
              v-model="addForm.albumId" 
              required 
              placeholder="Ingresa el ID del álbum"
            >
          </div>
          <div class="form-group">
            <label for="add-duracion">Duración (HH:MM:SS):</label>
            <input 
              type="text" 
              id="add-duracion" 
              v-model="addForm.duracion" 
              placeholder="00:03:45" 
              pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$"
            >
          </div>
          <div class="form-group">
            <label for="add-cantanteId">ID del Cantante:</label>
            <input 
              type="number" 
              id="add-cantanteId" 
              v-model="addForm.cantanteId" 
              required 
              placeholder="Ingresa el ID del cantante"
            >
          </div>
          <div class="form-group">
            <label for="add-image">URL de la Imagen:</label>
            <input 
              type="url" 
              id="add-image" 
              v-model="addForm.image" 
              placeholder="https://ejemplo.com/imagen.jpg"
            >
          </div>
          <div class="modal-buttons">
            <button type="submit" class="submit-btn">Añadir Canción</button>
            <button type="button" @click="closeModals" class="cancel-btn">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para Actualizar Canción -->
    <div v-if="showUpdateModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Actualizar Canción</h2>
          <button class="close-btn" @click="closeModals">&times;</button>
        </div>
        <form @submit.prevent="updateSong" class="modal-form">
          <div class="form-group">
            <label for="update-id">ID de la Canción:</label>
            <input 
              type="number" 
              id="update-id" 
              v-model="updateForm.cancionId" 
              readonly 
              class="readonly-input"
            >
          </div>
          <div class="form-group">
            <label for="update-nombre">Nombre de la Canción:</label>
            <input 
              type="text" 
              id="update-nombre" 
              v-model="updateForm.nombre" 
              required 
              placeholder="Ingresa el título de la canción"
            >
          </div>
          <div class="form-group">
            <label for="update-albumId">ID del Álbum:</label>
            <input 
              type="number" 
              id="update-albumId" 
              v-model="updateForm.albumId" 
              required 
              placeholder="Ingresa el ID del álbum"
            >
          </div>
          <div class="form-group">
            <label for="update-duracion">Duración (HH:MM:SS):</label>
            <input 
              type="text" 
              id="update-duracion" 
              v-model="updateForm.duracion" 
              placeholder="00:03:45" 
              pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$"
            >
          </div>
          <div class="form-group">
            <label for="update-cantanteId">ID del Cantante:</label>
            <input 
              type="number" 
              id="update-cantanteId" 
              v-model="updateForm.cantanteId" 
              required 
              placeholder="Ingresa el ID del cantante"
            >
          </div>
          <div class="form-group">
            <label for="update-image">URL de la Imagen:</label>
            <input 
              type="url" 
              id="update-image" 
              v-model="updateForm.image" 
              placeholder="https://ejemplo.com/imagen.jpg"
            >
          </div>
          <div class="modal-buttons">
            <button type="submit" class="submit-btn">Actualizar Canción</button>
            <button type="button" @click="closeModals" class="cancel-btn">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para Eliminar Canción -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeModals">
      <div class="modal delete-modal" @click.stop>
        <div class="modal-header">
          <h2>Eliminar Canción</h2>
          <button class="close-btn" @click="closeModals">&times;</button>
        </div>
        <form @submit.prevent="deleteSong" class="modal-form">
          <div class="form-group">
            <label for="delete-id">ID de la Canción a Eliminar:</label>
            <input 
              type="number" 
              id="delete-id" 
              v-model="deleteForm.cancionId" 
              required 
              placeholder="Ingresa el ID de la canción"
            >
          </div>
          <div class="warning-message">
            <p>⚠️ Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar esta canción?</p>
          </div>
          <div class="modal-buttons">
            <button type="submit" class="delete-confirm-btn">Eliminar Canción</button>
            <button type="button" @click="closeModals" class="cancel-btn">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const songs = ref([])

// Estados de los modales
const showAddModal = ref(false)
const showUpdateModal = ref(false)
const showDeleteModal = ref(false)

// Formularios reactivos
const addForm = ref({
  nombre: '',
  albumId: null,
  duracion: '',
  cantanteId: null,
  image: ''
})

const updateForm = ref({
  cancionId: null,
  nombre: '',
  albumId: null,
  duracion: '',
  cantanteId: null,
  image: ''
})

const deleteForm = ref({
  cancionId: null
})

// Funciones para manejar los modales
const openAddModal = () => {
  resetAddForm()
  showAddModal.value = true
}

const openUpdateModal = (song) => {
  updateForm.value = {
    cancionId: song.cancionId,
    nombre: song.nombre,
    albumId: song.albumId,
    duracion: song.duracion || '',
    cantanteId: song.cantanteId,
    image: song.image || ''
  }
  showUpdateModal.value = true
}

const openDeleteModal = () => {
  deleteForm.value.cancionId = null
  showDeleteModal.value = true
}

const closeModals = () => {
  showAddModal.value = false
  showUpdateModal.value = false
  showDeleteModal.value = false
}

const resetAddForm = () => {
  addForm.value = {
    nombre: '',
    albumId: null,
    duracion: '',
    cantanteId: null,
    image: ''
  }
}

// Funciones API
const fetchSongs = async () => {
  try {
    const response = await fetch(`http://hibikimusicapi.retocsv.es/api/Cancion`)
    const data = await response.json()
    songs.value = data
  } catch (error) {
    console.error('Error fetching songs:', error)
    alert('Failed to fetch songs')
  }
}

const formatDuration = (duration) => duration || 'N/A'

const addSong = async () => {
  try {
    const response = await fetch(`http://hibikimusicapi.retocsv.es/api/Cancion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: addForm.value.nombre,
        albumId: parseInt(addForm.value.albumId),
        duracion: addForm.value.duracion,
        cantanteId: parseInt(addForm.value.cantanteId),
        image: addForm.value.image
      })
    })
    
    if (response.ok) {
      await fetchSongs()
      closeModals()
      alert('¡Canción añadida exitosamente!')
    } else {
      alert(`Error al añadir canción: ${await response.text()}`)
    }
  } catch (error) {
    console.error('Error adding song:', error)
    alert('Error al añadir canción')
  }
}

const updateSong = async () => {
  try {
    const response = await fetch(`http://hibikimusicapi.retocsv.es/api/Cancion/${updateForm.value.cancionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cancionId: updateForm.value.cancionId,
        nombre: updateForm.value.nombre,
        albumId: parseInt(updateForm.value.albumId),
        duracion: updateForm.value.duracion,
        cantanteId: parseInt(updateForm.value.cantanteId),
        image: updateForm.value.image
      })
    })
    
    if (response.ok) {
      await fetchSongs()
      closeModals()
      alert('¡Canción actualizada exitosamente!')
    } else {
      alert(`Error al actualizar canción: ${await response.text()}`)
    }
  } catch (error) {
    console.error('Error updating song:', error)
    alert('Error al actualizar canción')
  }
}

const deleteSong = async () => {
  try {
    const response = await fetch(`http://hibikimusicapi.retocsv.es/api/Cancion/${deleteForm.value.cancionId}`, {
      method: 'DELETE'
    })
    
    if (response.ok) {
      await fetchSongs()
      closeModals()
      alert('¡Canción eliminada exitosamente!')
    } else {
      alert(`Error al eliminar canción: ${await response.text()}`)
    }
  } catch (error) {
    console.error('Error deleting song:', error)
    alert('Error al eliminar canción')
  }
}

onMounted(fetchSongs)
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

.modal-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
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

.delete-confirm-btn:hover {
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

.delete-modal {
  border-color: #dc3545;
}

.delete-modal .modal-header {
  background-color: #dc3545;
}
</style>