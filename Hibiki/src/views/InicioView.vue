<template>
  <div class="container">
    <h1 class="title">HIBIKI</h1>
    <h2 class="subtitle">Descubre nueva<br>música cada día</h2>
    <div class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="250" height="250">
        <g class="logo-group">
          <path d="M100 70 L100 220" stroke="#ffffff" stroke-width="20" stroke-linecap="round" class="logo-line main-line" />
          <path d="M200 70 L200 220" stroke="#ffffff" stroke-width="20" stroke-linecap="round" class="logo-line main-line" />
          <path d="M100 160 L200 120" stroke="#ffffff" stroke-width="20" stroke-linecap="round" fill="none" class="logo-line main-line" />
          <circle cx="91" cy="225" r="19" fill="#ffffff" class="logo-dot" />
          <circle cx="209" cy="65" r="19" fill="#ffffff" class="logo-dot" />
        </g>
      </svg>
    </div>
    <p class="description">
      Obtén playlists y álbumes inspirados en los artistas y géneros que escuchas. 1 mes gratis y luego, 10,99 € al mes.
    </p>
    <a href="/login" class="button">Probar gratis</a>
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
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -4rem;
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
  background-color: rgb(255, 255, 255);
  color: black;
}
.logo-line {
  transition: stroke 0.1s ease;
}
.logo-dot {
  transition: fill 0.1s ease;
}
.logo-group:hover .logo-line {
  stroke: #000000;
}
.logo-group:hover .logo-dot {
  fill: #000000;
}
</style>
