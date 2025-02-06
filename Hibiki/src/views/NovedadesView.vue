<script setup>
const sliderContent = [
  {
    titulo: "Hurry Up Tomorrow",
    subtitulo: "The Weeknd",
    imagen: "https://www.sentireascoltare.com/wp-content/uploads/2025/02/weeknd-hurry-up-tomorrow.jpg",
  },
  {
    titulo: "Benidorm Fest 2025",
    subtitulo: "Apple Music",
    imagen: "https://is1-ssl.mzstatic.com/image/thumb/Features126/v4/17/85/9a/17859af8-c050-20d0-ea94-d05c7dd3551d/d4530ed8-ac03-44e9-b37c-f32e4d89fe7e.png/530x304sr.webp",
  },
  {
    titulo: "MORA AMA AL CHIQUI",
    subtitulo: "Mora",
    imagen: "https://frasesencanciones.com/wp-content/uploads/2023/11/mora-cantante-768x513.jpg",
  },
];

const cancionesRecientes = [
  { titulo: "Cry For Me", artista: "The Weeknd", imagen: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/3d/0d/06/3d0d06e6-cfd4-8f69-4a42-52b7cf33fb24/25UMGIM09490.rgb.jpg/88x88bb.jpg" },
  { titulo: "M.A.P.S.", artista: "Amaia", imagen: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c5/d3/82/c5d38265-9bd7-88aa-3bb3-9500eceed9d6/24UM1IM01951.rgb.jpg/88x88bb.jpg" },
  { titulo: "KAIMAN", artista: "Rigoberta Bandini", imagen: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/79/10/e8/7910e8d8-caa9-9d20-9e30-f8e363af03e7/199066494011.jpg/88x88bb.jpg" },
  { titulo: "FABERGÉ", artista: "Recycled J · HOKE · Ébano", imagen: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ab/54/6a/ab546a81-a18c-2d3d-087f-b2e8d7630554/5021732620965.jpg/88x88bb.jpg" },
  { titulo: "Cry For Me", artista: "The Weeknd", imagen: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/3d/0d/06/3d0d06e6-cfd4-8f69-4a42-52b7cf33fb24/25UMGIM09490.rgb.jpg/88x88bb.jpg" },
  { titulo: "M.A.P.S.", artista: "Amaia", imagen: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c5/d3/82/c5d38265-9bd7-88aa-3bb3-9500eceed9d6/24UM1IM01951.rgb.jpg/88x88bb.jpg" },
  { titulo: "KAIMAN", artista: "Rigoberta Bandini", imagen: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/79/10/e8/7910e8d8-caa9-9d20-9e30-f8e363af03e7/199066494011.jpg/88x88bb.jpg" },
  { titulo: "FABERGÉ", artista: "Recycled J · HOKE · Ébano", imagen: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ab/54/6a/ab546a81-a18c-2d3d-087f-b2e8d7630554/5021732620965.jpg/88x88bb.jpg" },
];

const nuevosLanzamientos = [
  { titulo: "Hurry Up Tomorrow", artista: "The Weeknd", imagen: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/3d/0d/06/3d0d06e6-cfd4-8f69-4a42-52b7cf33fb24/25UMGIM09490.rgb.jpg/316x316bb.webp" },
  { titulo: "Si Abro Los Ojos", artista: "Amaia", imagen: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c5/d3/82/c5d38265-9bd7-88aa-3bb3-9500eceed9d6/24UM1IM01951.rgb.jpg/316x316bb.webp" },
  { titulo: "Al romper la burbuja", artista: "Joaquina", imagen: "https://is1-ssl.mzstatic.com/image/thumb/Video221/v4/3b/19/cf/3b19cf3e-b9a5-1c55-47ec-74f6bbfe92b2/Jobaddabaee-3bcc-4d7d-a531-e6ff80ec4b06-184757849-PreviewImage_Preview_Image_Intermediate_nonvideo_sdr_361394388_2036964865-Time1738151215966.png/316x316bb.webp" },
  { titulo: "Al romper la burbuja", artista: "Joaquina", imagen: "https://is1-ssl.mzstatic.com/image/thumb/Video221/v4/3b/19/cf/3b19cf3e-b9a5-1c55-47ec-74f6bbfe92b2/Jobaddabaee-3bcc-4d7d-a531-e6ff80ec4b06-184757849-PreviewImage_Preview_Image_Intermediate_nonvideo_sdr_361394388_2036964865-Time1738151215966.png/316x316bb.webp" },
  { titulo: "Hurry Up Tomorrow", artista: "The Weeknd", imagen: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/3d/0d/06/3d0d06e6-cfd4-8f69-4a42-52b7cf33fb24/25UMGIM09490.rgb.jpg/316x316bb.webp" },
];

const iniciarSesion = () => {
  window.location.href = '/login'; 
};
const registrar= () => {
  window.location.href = '/register'; 
};
</script>

<template>
  <div class="novedades">
    <div class="top-bar">
      <button class="register-button" @click="registrar">Registrarse</button>
      <button class="login-button" @click="iniciarSesion">Iniciar Sesión</button>
    </div>
    <section class="slider">
      <div v-for="(slide, index) in sliderContent" :key="index" class="slide">
        <img :src="slide.imagen" :alt="slide.titulo" />
        <div class="slide-content">
          <h2>{{ slide.titulo }}</h2>
          <p>{{ slide.subtitulo }}</p>
        </div>
      </div>
    </section>

    <section class="canciones-recientes">
      <h2>Canciones recién llegadas</h2>
      <div class="canciones-grid">
        <div v-for="(cancion, index) in cancionesRecientes" :key="index" class="cancion-item">
          <img :src="cancion.imagen" :alt="cancion.titulo" />
          <div>
            <h3>{{ cancion.titulo }}</h3>
            <p>{{ cancion.artista }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="nuevos-lanzamientos">
      <h2>Nuevos lanzamientos</h2>
      <div class="album-grid">
        <div v-for="(album, index) in nuevosLanzamientos" :key="index" class="album-item">
          <img :src="album.imagen" :alt="album.titulo" />
          <h3>{{ album.titulo }}</h3>
          <p>{{ album.artista }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.novedades {
  background-color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
}

.top-bar {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 1rem;
  position: absolute;
  top: 0;
  right: 0;
}

.login-button {
  background-color: #ff5100;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  margin-right: 1rem;
  margin-top: -37px;
}

.login-button:hover {
  background-color: #ca3900;
}
.register-button {
  background-color: white;
  color: #ff5100;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  margin-right: 1rem;
  margin-top: -37px;
}

.login-button:hover {
  background-color: #ca3900;
}

.slider {
  display: flex;
  gap: 17rem;
  overflow-x: auto;
  padding: 1rem;
  background: #000;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.slide {
  flex: 0 0 auto;
  position: relative;
  width: 300px;
}

.slide img {
  width: 100%;
  border-radius: 8px;
}

.slide-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  padding: 1rem;
  color: white;
  border-radius: 0 0 8px 8px;
}

.album-grid {
  display: flex;
  gap: 5rem;
}

.album-item img {
  width: 235px;
  border-radius: 8px;
}

/* Estilos para las canciones en dos columnas */
.canciones-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.cancion-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
}
</style>
