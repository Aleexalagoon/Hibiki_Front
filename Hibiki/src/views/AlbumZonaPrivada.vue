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
            <button @click="updateAlbum(album)" class="action-button">ACTUALIZAR</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="buttons">
      <button @click="showAddAlbumModal" class="add-button">AÑADIR</button>
      <button @click="showDeleteAlbumModal" class="delete-button">BORRAR</button>
      <router-link to="/zonaprivada" class="back-button">VOLVER</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const albums = ref([])
const fetchAlbums = async () => {
  try {
    const response = await fetch('https://localhost:7295/api/Album')
    const data = await response.json()
    albums.value = data
  } catch (error) {
    console.error('Error fetching albums:', error)
    alert('Failed to fetch albums')
  }
}
const formatReleaseDate = (releaseDate) => releaseDate ? new Date(releaseDate).toLocaleDateString() : 'N/A'

const updateAlbum = async (album) => {
  try {
    const updatedName = prompt('Enter new album name:', album.name)
    const updatedArtistId = prompt('Enter new artist ID:', album.artistId)
    const updatedReleaseDate = prompt('Enter release date (YYYY-MM-DD):', album.releaseDate.split('T')[0])
    const updatedImage = prompt('Enter new image URL:', album.image)
    
    if (updatedName && updatedArtistId && updatedReleaseDate) {
      const response = await fetch(`https://localhost:7295/api/Album/${album.albumId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          albumId: album.albumId,
          name: updatedName,
          artistId: parseInt(updatedArtistId),
          releaseDate: updatedReleaseDate,
          image: updatedImage
        })
      })
      
      if (response.ok) fetchAlbums()
      else alert(`Failed to update album: ${await response.text()}`)
    }
  } catch (error) {
    console.error('Error updating album:', error)
    alert('Failed to update album')
  }
}

const showAddAlbumModal = async () => {
  try {
    const name = prompt('Enter album name:')
    const artistId = prompt('Enter artist ID:')
    const releaseDate = prompt('Enter release date (YYYY-MM-DD):')
    const image = prompt('Enter image URL:')
    
    if (name && artistId && releaseDate) {
      const response = await fetch('https://localhost:7295/api/Album', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, artistId: parseInt(artistId), releaseDate, image })
      })
      
      if (response.ok) {
        fetchAlbums()
        alert('Album added successfully!')
      } else alert(`Failed to add album: ${await response.text()}`)
    }
  } catch (error) {
    console.error('Error adding album:', error)
    alert('Failed to add album')
  }
}

const showDeleteAlbumModal = async () => {
  try {
    const albumId = prompt('Enter album ID to delete:')
    
    if (albumId) {
      const response = await fetch(`https://localhost:7295/api/Album/${albumId}`, { method: 'DELETE' })
      
      if (response.ok) {
        fetchAlbums()
        alert('Album deleted successfully!')
      } else alert(`Failed to delete album: ${await response.text()}`)
    }
  } catch (error) {
    console.error('Error deleting album:', error)
    alert('Failed to delete album')
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
