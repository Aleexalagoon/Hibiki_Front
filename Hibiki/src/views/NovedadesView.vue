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

const iniciarSesion = () => {
  window.location.href = '/login'; // Ajusta la ruta según tu aplicación
};
</script>

<template>
  <div class="novedades">
    <div class="top-bar">
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
  </div>
</template>

<style scoped>
.novedades {
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
  background-color: #000000;
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
  background-color: #4b4b4b;
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
</style>