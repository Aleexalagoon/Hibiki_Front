import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDarkMode: true
  }),
  
  actions: {
    initialize() {
      // Inicializar tema desde localStorage o usar el tema del sistema
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.isDarkMode = savedTheme === 'dark';
      } else {
        // Usar preferencia del sistema
        this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      
      // Aplicar tema inicial
      this.applyTheme();
    },
    
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      this.applyTheme();
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    },
    
    applyTheme() {
      // Aplicar clase al elemento raíz para controlar CSS
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark-theme');
        document.documentElement.classList.remove('light-theme');
      } else {
        document.documentElement.classList.add('light-theme');
        document.documentElement.classList.remove('dark-theme');
      }
    }
  }
});