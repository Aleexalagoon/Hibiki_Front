<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:visible', 'logout', 'search']);

const searchQuery = ref('');
const authStore = useAuthStore();
const router = useRouter();

const isAuthenticated = computed(() => authStore.isAuthenticated);

const toggleSidebar = () => {
  emit('update:visible', !props.visible);
};

const search = () => {
  emit('search', searchQuery.value);
  
  if (window.innerWidth <= 768) {
    emit('update:visible', false);
  }
};

const logout = () => {
  emit('logout');
};
</script>

<template>
  <aside class="sidebar" :class="{ 'visible': visible }">
    <div class="logo">HIBIKI</div>
    <nav class="menu">
      <div class="menu-search">
        <input type="text" placeholder="Buscar..." v-model="searchQuery" />
        <button @click="search">Buscar</button>
      </div>
      
      <router-link to="/inicio" class="menu-item" active-class="active" @click="$emit('update:visible', false)">Inicio</router-link>
      <router-link to="/novedades" class="menu-item" active-class="active" @click="$emit('update:visible', false)">Novedades</router-link>
      
      <div v-if="isAuthenticated">
        <router-link to="/artista" class="menu-item" active-class="active" @click="$emit('update:visible', false)">Artistas</router-link>
        <router-link to="/playlist" class="menu-item" active-class="active" @click="$emit('update:visible', false)">Playlists</router-link>
        <router-link to="/premium" class="menu-item" active-class="active" @click="$emit('update:visible', false)">Premium</router-link>
      </div>
    </nav>
    
    <div v-if="isAuthenticated" class="auth-buttons">
      <button class="logout-button" @click="logout">Cerrar Sesión</button>
    </div>
  </aside>

  <!-- Mobile Menu Toggle Button -->
  <div class="menu-toggle" @click="toggleSidebar">
    <div class="menu-icon">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 250px;
  background: linear-gradient(180deg, rgb(22, 22, 22) 0%, rgb(0, 0, 0) 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  overflow-y: auto;
  z-index: 1000;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

.menu {
  flex: 1;
}

.menu-item {
  display: block;
  padding: 0.75rem 1rem;
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  transition: background-color 0.3s ease;
}

.menu-item:hover, .menu-item.active {
  background-color: #444;
  border-radius: 8px;
}

.menu-search {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.menu-search input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.menu-search button {
  padding: 8px 12px;
  background-color: #ff5100;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.menu-search button:hover {
  background-color: #ca3900;
}

.auth-buttons {
  text-align: center;
  padding: 1rem 0;
}

.logout-button {
  background-color: #ff5100;
  color: white;
  font-size: 16px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #ca3900;
}

.menu-toggle {
  display: none;
  position: fixed;
  top: 15px;
  left: 15px;
  width: 40px;
  height: 40px;
  background-color: #ff5100;
  border-radius: 5px;
  cursor: pointer;
  z-index: 1001;
  align-items: center;
  justify-content: center;
}

.menu-icon {
  width: 25px;
  height: 20px;
  position: relative;
}

.menu-icon span {
  display: block;
  position: absolute;
  height: 3px;
  width: 100%;
  background: white;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.menu-icon span:nth-child(1) {
  top: 0;
}

.menu-icon span:nth-child(2) {
  top: 8px;
}

.menu-icon span:nth-child(3) {
  top: 16px;
}

@media screen and (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }
  
  .sidebar {
    position: fixed;
    top: 0;
    left: -100%;
    height: 100vh;
    width: 80%;
    max-width: 300px;
    transition: left 0.3s ease;
  }
  
  .sidebar.visible {
    left: 0;
  }
}
</style>