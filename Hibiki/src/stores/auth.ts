import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

// URL base para todas las solicitudes API
const API_BASE_URL = "http://aa0918044ca2b4e9b94f01593a2e67bf-1447626218.us-east-1.elb.amazonaws.com/api";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    isAuthenticated: !!localStorage.getItem('user'),
    isPremium: JSON.parse(localStorage.getItem('user') || '{}')?.isPremium || false,
    error: null as unknown,
  }),

  actions: {
    async registerUser(username: string, password: string, email?: string) {
      try {
        const userEmail = email || `${username}@example.com`;

        const response = await fetch(`${API_BASE_URL}/Usuario`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: username,
            email: userEmail,
            password: password,
            isPremium: false,
            fecha_Registro: new Date().toISOString(),
          }),
        });

        if (!response.ok) throw new Error('Error al registrar el usuario');

        const data = await response.json();
        this.setUser(data);

        Swal.fire({
          title: "¡Registro exitoso!",
          text: `Bienvenido, ${data.name}!`,
          icon: "success",
          confirmButtonColor: "#4a90e2",
        });

        return data;
      } catch (error: any) {
        this.error = error;
        Swal.fire({
          icon: "error",
          title: "Error en el registro",
          text: "No se pudo registrar el usuario. Inténtalo de nuevo.",
          confirmButtonColor: "#ff4b4b",
        });
        throw error;
      }
    },

    async loginUser(email: string, password: string) {
      try {
        const url = `${API_BASE_URL}/Usuario/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) throw new Error('Credenciales inválidas');

        const data = await response.json();
        this.setUser(data);

        Swal.fire({
          title: "¡Inicio de sesión exitoso!",
          text: `Hola, ${data.name}!`,
          icon: "success",
          confirmButtonColor: "#4a90e2",
        });

        return data;
      } catch (error: any) {
        this.error = error;
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Usuario o contraseña incorrectos.",
          confirmButtonColor: "#ff4b4b",
        });
        throw error;
      }
    },

    setUser(user) {
      this.user = user;
      this.isAuthenticated = true;
      this.isPremium = user.isPremium || false;
      localStorage.setItem('user', JSON.stringify(this.user));
    },

    async actualizarDatosUsuario() {
      try {
        const response = await fetch(`${API_BASE_URL}/Usuario/${this.user.id}`);
        if (!response.ok) throw new Error('Error al obtener datos del usuario');

        const userData = await response.json();
        this.setUser(userData);
      } catch (error: any) {
        console.error("Error actualizando usuario:", error);
      }
    },

    logout() {
      this.user = null;
      this.isAuthenticated = false;
      this.isPremium = false;
      localStorage.removeItem('user');

      Swal.fire({
        title: "¡Sesión cerrada!",
        text: "Has cerrado sesión correctamente.",
        icon: "info",
        confirmButtonColor: "#4a90e2",
      });
    },

    loadUserFromStorage() {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        this.user = user;
        this.isAuthenticated = true;
        this.isPremium = user.isPremium;
      }
    },
  },
});