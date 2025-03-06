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
          <td>{{ artist.oyentesMensuales }}</td>
          <td>{{ artist.descripcion }}</td>
          <td>
            <button @click="updateArtist(artist)" class="action-button">ACTUALIZAR</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="buttons">
      <button @click="showAddArtistModal" class="add-button">AÑADIR</button>
      <button @click="showDeleteArtistModal" class="delete-button">BORRAR</button>
      <router-link to="/zonaprivada" class="back-button">VOLVER</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// URL base para todas las solicitudes API
const API_BASE_URL = import.meta.env.VITE_API_URL;

const artists = ref([])
const fetchArtists = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Artista`)
    const data = await response.json()
    artists.value = data
  } catch (error) {
    console.error('Error fetching artists:', error)
    alert('Failed to fetch artists')
  }
}

const updateArtist = async (artist) => {
  try {
    const updatedNombre = prompt('Enter new artist name:', artist.nombre)
    const updatedOyentes = prompt('Enter new monthly listeners:', artist.oyentesMensuales)
    const updatedDescripcion = prompt('Enter description:', artist.descripcion)
    const updatedImage = prompt('Enter image:', artist.image)
    
    if (updatedNombre && updatedOyentes && updatedDescripcion && updatedImage) {
      const response = await fetch(`${API_BASE_URL}/Artista/${artist.cantanteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cantanteId: artist.cantanteId,
          nombre: updatedNombre,
          oyentesMensuales: parseInt(updatedOyentes),
          descripcion: updatedDescripcion,
          image: updatedImage
        })
      })
      
      if (response.ok) fetchArtists()
      else alert(`Failed to update artist: ${await response.text()}`)
    }
  } catch (error) {
    console.error('Error updating artist:', error)
    alert('Failed to update artist')
  }
}

const showAddArtistModal = async () => {
  try {
    const nombre = prompt('Enter artist name:')
    const oyentesMensuales = prompt('Enter monthly listeners:')
    const descripcion = prompt('Enter description:')
    const image = prompt('Enter image URL:')
    
    if (nombre && oyentesMensuales && descripcion && image) {
      const response = await fetch(`${API_BASE_URL}/Artista`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, oyentesMensuales: parseInt(oyentesMensuales), descripcion, image })
      })
      
      if (response.ok) {
        fetchArtists()
        alert('Artist added successfully!')
      } else alert(`Failed to add artist: ${await response.text()}`)
    }
  } catch (error) {
    console.error('Error adding artist:', error)
    alert('Failed to add artist')
  }
}

const showDeleteArtistModal = async () => {
  try {
    const cantanteId = prompt('Enter artist ID to delete:')
    
    if (cantanteId) {
      const response = await fetch(`${API_BASE_URL}/Artista/${cantanteId}`, { method: 'DELETE' })
      
      if (response.ok) {
        fetchArtists()
        alert('Artist deleted successfully!')
      } else alert(`Failed to delete artist: ${await response.text()}`)
    }
  } catch (error) {
    console.error('Error deleting artist:', error)
    alert('Failed to delete artist')
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
  padding: 10px 20px;
  background-color: #ff5100;
  color: white;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #ff6b35;
}
</style>