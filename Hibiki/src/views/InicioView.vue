<template>
  <div class="container">
    <h1 class="title">HIBIKI</h1>
    <h2 class="subtitle">Descubre nueva<br>música cada día</h2>
    <div class="icon">
      <img src="/imagenes/Logo_Inicio.png" alt="Logo de Inicio" />
    </div>
    <p class="description">
      Obtén playlists y álbumes inspirados en los artistas y géneros que escuchas. 1 mes gratis y luego, 10,99 € al mes.
    </p>
    <a href="/premium" class="button">Probar gratis</a>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #ca3900, #ff5100);
  color: white;
  text-align: center;
}
.title {
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
}
.subtitle {
  font-size: 5rem;
  font-weight: bold;
  margin-top: 2rem;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
}
.icon {
  height: 40vh;
  align-items: center;
  margin-top: -12rem;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
}
.image {
  width: 8rem;
  height: 8rem;
}
.description {
  margin-top: 1rem;
  font-size: 1.125rem;
  max-width: 40rem;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); 
}
.button {
  padding: 1rem 2rem;
    font-size: 1rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: background 0.3s ease;
    background-color:rgb(255, 255, 255);
    color: black;
}

.link {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  text-decoration: underline;
  color: #ffeded;
}
.link:hover {
  color: white;
}
</style>
