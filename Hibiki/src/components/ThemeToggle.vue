<template>
  <button @click="toggleTheme" class="theme-toggle-btn" :title="themeStore.isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'">
    <div v-if="themeStore.isDarkMode" class="theme-icon">
      <!-- Sol (Modo claro) -->
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    </div>
    <div v-else class="theme-icon">
      <!-- Luna (Modo oscuro) -->
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </div>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useThemeStore } from '@/stores/themeStore';

export default defineComponent({
  name: 'ThemeToggle',
  setup() {
    const themeStore = useThemeStore();
    
    // Inicializar el tema cuando se monta el componente
    themeStore.initialize();
    
    const toggleTheme = () => {
      themeStore.toggleTheme();
    };
    
    return {
      themeStore,
      toggleTheme
    };
  }
});
</script>

<style scoped>
.theme-toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  transition: background-color 0.3s, transform 0.2s;
}

.theme-toggle-btn:hover {
  background-color: var(--hover-overlay);
  transform: scale(1.1);
}

.theme-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* En modo oscuro */
:global(.dark-theme) .theme-toggle-btn {
  color: var(--text-primary);
}

/* En modo claro */
:global(.light-theme) .theme-toggle-btn {
  color: var(--text-primary);
}
</style>