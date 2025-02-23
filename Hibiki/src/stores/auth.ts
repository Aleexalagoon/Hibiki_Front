import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('user'),
    error: null as unknown,
  }),

  actions: {
    async registerUser(username: string, password: string, email?: string) {
      try {
        const userEmail = email || `${username}@example.com`;

        const response = await fetch('http://localhost:5149/api/Usuario', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: username,
            email: userEmail,
            password: password,
            isPremium: false,
            fecha_Registro: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          throw new Error('Error al registrar el usuario');
        }

        const data = await response.json();
        this.setUser(data); // Guardar usuario en estado y localStorage

        // ✅ ALERTA DE ÉXITO AL REGISTRAR ✅
        Swal.fire({
          title: "¡Registro exitoso!",
          text: `Bienvenido, ${data.name}!`,
          icon: "success",
          confirmButtonColor: "#4a90e2",
        });

        return data;
      } catch (error) {
        this.error = error;

        // 🚨 ALERTA DE ERROR AL REGISTRAR 🚨
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
        const url = `http://localhost:5149/api/Usuario/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) {
          throw new Error('Credenciales inválidas');
        }

        const data = await response.json();
        this.setUser(data); // Guardar usuario en estado y localStorage

        // ✅ ALERTA DE ÉXITO AL INICIAR SESIÓN ✅
        Swal.fire({
          title: "¡Inicio de sesión exitoso!",
          text: `Hola, ${data.name}! Has iniciado sesión correctamente.`,
          icon: "success",
          confirmButtonColor: "#4a90e2",
        });

        return data;
      } catch (error) {
        this.error = error;

        // 🚨 ALERTA DE ERROR AL INICIAR SESIÓN 🚨
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
      localStorage.setItem('user', JSON.stringify(user)); // Guardar en localStorage
    },

    logout() {
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem('user');

      // ✅ ALERTA AL CERRAR SESIÓN ✅
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
        this.user = JSON.parse(savedUser);
        this.isAuthenticated = true;
      }
    },
  },
});
