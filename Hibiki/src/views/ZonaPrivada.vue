<template>
  <div class="staff-container">
    <img :src="logoSrc" alt="Company Logo" class="logo">
    <div class="button-container">
      <router-link to="/cancionzonaprivada" class="menu-button">CANCIONES</router-link>
      <router-link to="/albumzonaprivada" class="menu-button">ALBUMS</router-link>
      <router-link to="/cantantezonaprivada" class="menu-button">ARTISTAS</router-link>
      <router-link to="/novedades" class="menu-button">VOLVER</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const logoSrc = ref('/imagenes/Logo_Inicio.png')
</script>

<style scoped>
.staff-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #121212;
}

.logo {
  max-width: 250px;
  margin-bottom: 50px;
  filter: brightness(1.2);
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 300px;
}

.menu-button {
  text-decoration: none;
  text-align: center;
  padding: 15px;
  background-color: #ff5100;
  color: white;
  border-radius: 10px;
  font-weight: 600;
}
</style>