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
            <button @click="updateSong(song)" class="action-button">ACTUALIZAR</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="buttons">
      <button @click="showAddSongModal" class="add-button">AÑADIR</button>
      <button @click="showDeleteSongModal" class="delete-button">BORRAR</button>
      <router-link to="/zonaprivada" class="back-button">VOLVER</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// URL base para todas las solicitudes API
const API_BASE_URL = "http://aa0918044ca2b4e9b94f01593a2e67bf-1447626218.us-east-1.elb.amazonaws.com/api";

const songs = ref([])
const fetchSongs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Cancion`)
    const data = await response.json()
    songs.value = data
  } catch (error) {
    console.error('Error fetching songs:', error)
    alert('Failed to fetch songs')
  }
}
const formatDuration = (duration) => duration || 'N/A'

const updateSong = async (song) => {
  try {
    const updatedNombre = prompt('Enter new song name:', song.nombre)
    const updatedAlbum = prompt('Enter new album ID:', song.albumId)
    const updatedDuracion = prompt('Enter duration (HH:MM:SS):', song.duracion || '00:03:00')
    const updatedCantanteId = prompt('Enter singer ID:', song.cantanteId)
    const updatedImage = prompt('Enter image:', song.image)
    
    if (updatedNombre && updatedAlbum && updatedDuracion && updatedCantanteId) {
      const response = await fetch(`${API_BASE_URL}/Cancion/${song.cancionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cancionId: song.cancionId,
          nombre: updatedNombre,
          albumId: parseInt(updatedAlbum),
          duracion: updatedDuracion,
          cantanteId: parseInt(updatedCantanteId),
          image: updatedImage
        })
      })
      
      if (response.ok) fetchSongs()
      else alert(`Failed to update song: ${await response.text()}`)
    }
  } catch (error) {
    console.error('Error updating song:', error)
    alert('Failed to update song')
  }
}

const showAddSongModal = async () => {
  try {
    const nombre = prompt('Enter song name:')
    const albumId = prompt('Enter album ID:')
    const duracion = prompt('Enter duration (HH:MM:SS, e.g., 00:03:45):')
    const cantanteId = prompt('Enter singer ID:')
    
    if (nombre && albumId && duracion && cantanteId) {
      const response = await fetch(`${API_BASE_URL}/Cancion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, albumId: parseInt(albumId), duracion, cantanteId: parseInt(cantanteId) })
      })
      
      if (response.ok) {
        fetchSongs()
        alert('Song added successfully!')
      } else alert(`Failed to add song: ${await response.text()}`)
    }
  } catch (error) {
    console.error('Error adding song:', error)
    alert('Failed to add song')
  }
}

const showDeleteSongModal = async () => {
  try {
    const cancionId = prompt('Enter song ID to delete:')
    
    if (cancionId) {
      const response = await fetch(`${API_BASE_URL}/Cancion/${cancionId}`, { method: 'DELETE' })
      
      if (response.ok) {
        fetchSongs()
        alert('Song deleted successfully!')
      } else alert(`Failed to delete song: ${await response.text()}`)
    }
  } catch (error) {
    console.error('Error deleting song:', error)
    alert('Failed to delete song')
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
</style>