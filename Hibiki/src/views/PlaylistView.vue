<template>
    <div class="album-view">
      <div class="album-header">
        <img src="https://fotografias.lasexta.com/clipping/cmsimages01/2024/12/08/A6C326BB-77A0-4454-BAC3-E7100CEF2AB9/fernando-alonso_104.jpg?crop=5167,5167,x2585,y0&width=1200&height=1200&optimize=low&format=webply" alt="Playlist Cover" class="album-cover" />
        <div class="album-info">
          <h1>Mi Playlist</h1>
          <h2>Usuario</h2>
          <p>Una colección personalizada de mis canciones favoritas...</p>
          <button class="preview-btn">▶ Reproducir</button>
        </div>
      </div>
      <div class="tracklist">
        <div class="track" v-for="(song, index) in playlist" :key="index">
          <img :src="song.image" alt="Song Thumbnail" class="track-thumbnail" />
          <span class="track-title">{{ song.title }}</span>
          <span class="track-duration">{{ song.duration }}</span>
        </div>
      </div>
      <div class="album-details">
        <p><strong>Número de canciones:</strong> {{ playlist.length }}</p>
        <p><strong>Duración total:</strong> {{ totalDuration }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        playlist: [
          { title: "Canción 1", duration: "3:15", image: "https://i.scdn.co/image/ab67616d0000b273dcec31b44548687b2a81d0c2" },
          { title: "Canción 2", duration: "2:45", image: "https://cdn-images.dzcdn.net/images/cover/2194275a797bd8d5ed038b61b053813a/0x1900-000000-80-0-0.jpg" },
          { title: "Canción 3", duration: "4:10", image: "https://i.scdn.co/image/ab67616d0000b273851222dc5c5681bd4c3119d3" },
          { title: "Canción 4", duration: "3:55", image: "https://i.scdn.co/image/ab67616d0000b273076ef0fed51ff7a4911459e9" },
          { title: "Canción 5", duration: "3:55", image: "https://i.scdn.co/image/ab67616d0000b273dcec31b44548687b2a81d0c2" },
          { title: "Canción 6", duration: "3:55", image: "https://cdn-images.dzcdn.net/images/cover/2194275a797bd8d5ed038b61b053813a/0x1900-000000-80-0-0.jpg" },
          { title: "Canción 7", duration: "3:55", image: "https://i.scdn.co/image/ab67616d0000b273851222dc5c5681bd4c3119d3" },
          { title: "Canción 8", duration: "3:55", image: "https://cdn-images.dzcdn.net/images/cover/2194275a797bd8d5ed038b61b053813a/0x1900-000000-80-0-0.jpg" },
          { title: "Canción 9", duration: "3:55", image: "https://i.scdn.co/image/ab67616d0000b273dcec31b44548687b2a81d0c2" },
          { title: "Canción 10", duration: "3:55", image: "https://i.scdn.co/image/ab67616d0000b273076ef0fed51ff7a4911459e9" }
        ]
      };
    },
  };
  </script>
  
  <style scoped>
  .album-view {
    margin: auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    background: linear-gradient(33deg, black, #ff5100);
    color: white;
  }
  .album-header {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  .album-cover {
    width: 160px;
    height: 160px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  }
  .album-info h1, h2 {
    margin: 0;
  }
  .preview-btn {
    background: #ff5100;
    color: white;
    border: none;
    padding: 12px 18px;
    cursor: pointer;
    font-weight: bold;
    border-radius: 5px;
    transition: 0.3s;
  }
  .preview-btn:hover {
    background: #ca3900;
  }
  .tracklist {
    margin-top: 20px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  .track {
    display: flex;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    transition: 0.3s;
  }
  .track:hover {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 5px;
  }
  .track-number {
    font-weight: bold;
    color: #ff5100;
  }
  .track-thumbnail {
    width: 40px;
    height: 40px;
    border-radius: 5px;
    margin-left: 10px;
  }
  .track-title {
    flex-grow: 1;
    padding-left: 10px;
    font-weight: bold;
  }
  .track-duration {
    text-align: right;
    font-style: italic;
  }
  .album-details {
    margin-top: 20px;
    padding-top: 10px;
    text-align: left;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }
  </style>
  