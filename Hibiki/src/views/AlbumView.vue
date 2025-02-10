<template>
    <div class="album-view">
      <div class="album-header">
        <img src="https://i.scdn.co/image/ab67616d0000b273851222dc5c5681bd4c3119d3" alt="Album Cover" class="album-cover" />
        <div class="album-info">
          <h1>MICRODOSIS</h1>
          <h2>Mora</h2>
          <p>Hacía tiempo que esperábamos noticias de Mora...</p>
          <button class="preview-btn">▶ Previsualizar</button>
        </div>
      </div>
      <div class="tracklist">
        <div class="track" v-for="(track, index) in tracks" :key="index">
          <span class="track-number">{{ index + 1 }}</span>
          <span class="track-title">{{ track.title }}</span>
          <span class="track-duration">{{ track.duration }}</span>
        </div>
      </div>
      <div class="album-details">
        <p>Fecha de lanzamiento: 1 de Abril de 2022</p>
        <p>15 canciones, 44 Minutos</p>
        <p>Rimas Music</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        tracks: [
          { title: "badtrip :(", duration: "3:11" },
          { title: "2010", duration: "2:51" },
          { title: "MEMORIAS", duration: "3:48" },
          { title: "ROBERT DE NIRO", duration: "2:54" },
          { title: "PECADO", duration: "2:51" },
          { title: "LINDOR", duration: "2:24" },
          { title: "TUS LÁGRIMAS", duration: "2:54" },
          { title: "ESCALOFRÍOS", duration: "2:18" },
          { title: "PLAYA PRIVADA", duration: "2:37" },
          { title: "CALENTÓN", duration: "2:43" },
          { title: "MODELITO", duration: "3:02" },
          { title: "VOLANDO BAJITO", duration: "2:59" },
          { title: "DONDE SE APRENDE A QUERER?", duration: "3:25" },
          { title: "EN BAJITA", duration: "3:08" },
          { title: "COMO HAS ESTADO?", duration: "3:14" }
        ]
      };
    }
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
    justify-content: space-between;
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
  