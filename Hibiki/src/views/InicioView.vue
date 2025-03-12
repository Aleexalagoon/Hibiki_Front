<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

const handleButtonClick = () => {
  if (isAuthenticated.value) {
    router.push('/premium');
  } else {
    router.push('/login');
  }
};
</script>

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
    <button @click="handleButtonClick" class="button">
      {{ isAuthenticated ? 'Ver Premium' : 'Probar gratis' }}
    </button>
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
.logo-group {
  transition: transform 0.4s ease-out, stroke 0.2s ease, fill 0.2s ease;
  transform-origin: center;
}

.logo-group:hover {
  transform: scale(1.5) rotate(10deg);
}

.logo-group:hover .logo-line {
  stroke: #000000;
  transition: stroke 0.5s ease-in-out;
}

.logo-group:hover .logo-dot {
  fill: #000000;
  transition: fill 0.5s ease-in-out;
}

@media screen and (max-width: 768px) {
  .container {
    padding: 2rem 1rem;
  }

  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 3rem;
    margin-top: 1rem;
  }

  .icon {
    margin-top: -2rem;
  }

  .icon svg {
    width: 180px;
    height: 180px;
  }

  .description {
    font-size: 1rem;
    padding: 0 1rem;
  }
}

@media screen and (max-width: 480px) {
  .container {
    padding: 1.5rem 0.75rem;
  }

  .title {
    font-size: 1.75rem;
  }

  .subtitle {
    font-size: 2.25rem;
    line-height: 1.2;
  }

  .icon {
    margin-top: -1rem;
  }

  .icon svg {
    width: 150px;
    height: 150px;
  }

  .description {
    font-size: 0.9rem;
    padding: 0 0.75rem;
    margin-top: 0.5rem;
  }

  .button {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    margin-top: 1rem;
  }
  
  .logo-group:hover {
    transform: scale(1.2) rotate(5deg);
  }
}
</style>