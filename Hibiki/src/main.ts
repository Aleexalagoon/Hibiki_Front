import "./assets/main.css";
// Importar estilos de tema
import "./assets/theme.css";
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from "./router";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount("#app");

// El manejo del tema se ha movido al store de Pinia (themeStore.ts)
// La inicialización del tema se realiza cuando se monta el componente ThemeToggle