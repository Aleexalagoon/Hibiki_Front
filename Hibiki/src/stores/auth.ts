import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

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

        const response = await fetch('https://localhost:7295/api/Usuario', {
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
      } catch (error) {
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
        const url = `https://localhost:7295/api/Usuario/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
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
      } catch (error) {
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

    // 🔥 NUEVO: Método para actualizar datos del usuario sin perder la contraseña
    async updateUserData(userData: { name?: string; email?: string }) {
      if (!this.user) {
        throw new Error('No hay usuario autenticado');
      }

      try {
        console.log('Actualizando datos del usuario:', this.user.userId);

        // 🔥 PASO 1: Obtener datos actuales para preservar la contraseña
        const currentResponse = await fetch(`https://localhost:7295/api/Usuario/${this.user.userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        if (!currentResponse.ok) {
          throw new Error('Error al obtener datos actuales del usuario');
        }
        
        const currentData = await currentResponse.json();
        console.log('Datos actuales obtenidos (sin mostrar contraseña)');

        // 🔥 PASO 2: Crear objeto completo con datos actuales + nuevos datos
        const completeUserData = {
          userId: this.user.userId,
          name: userData.name || this.user.name,
          email: userData.email || this.user.email,
          password: currentData.password || this.user.password, // 👈 MANTENER contraseña original
          isPremium: this.user.isPremium,
          fecha_Registro: this.user.fecha_Registro || currentData.fecha_Registro
        };

        console.log('Enviando datos completos (sin mostrar contraseña):', {
          ...completeUserData,
          password: '[PROTEGIDO]'
        });

        // 🔥 PASO 3: Enviar actualización completa
        const response = await fetch(`https://localhost:7295/api/Usuario/${this.user.userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(completeUserData),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al actualizar datos del usuario: ${response.status} - ${errorText}`);
        }

        // 🔥 PASO 4: Actualizar solo los campos que cambiaron, manteniendo la contraseña
        this.user = {
          ...this.user,
          name: userData.name || this.user.name,
          email: userData.email || this.user.email,
          password: currentData.password || this.user.password // Mantener contraseña
        };

        // Persistir en localStorage
        localStorage.setItem('user', JSON.stringify(this.user));

        console.log('Usuario actualizado exitosamente');
        return this.user;
      } catch (error: any) {
        console.error('Error al actualizar datos del usuario:', error);
        throw error;
      }
    },

    // 🔥 NUEVO: Método para cambiar contraseña por separado
    async changePassword(currentPassword: string, newPassword: string) {
      if (!this.user) {
        throw new Error('No hay usuario autenticado');
      }

      try {
        // Verificar contraseña actual
        const loginResponse = await fetch(`https://localhost:7295/api/Usuario/login?email=${encodeURIComponent(this.user.email)}&password=${encodeURIComponent(currentPassword)}`, {
          method: 'GET'
        });

        if (!loginResponse.ok) {
          throw new Error('Contraseña actual incorrecta');
        }

        // Actualizar con nueva contraseña
        const response = await fetch(`https://localhost:7295/api/Usuario/${this.user.userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...this.user,
            password: newPassword // Nueva contraseña
          }),
        });

        if (!response.ok) {
          throw new Error('Error al cambiar la contraseña');
        }

        // Actualizar contraseña en memoria
        this.user.password = newPassword;
        localStorage.setItem('user', JSON.stringify(this.user));

        Swal.fire({
          title: "¡Contraseña cambiada!",
          text: "Tu contraseña se ha actualizado correctamente.",
          icon: "success",
          confirmButtonColor: "#4a90e2",
        });

        return true;
      } catch (error: any) {
        console.error('Error al cambiar contraseña:', error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "No se pudo cambiar la contraseña.",
          confirmButtonColor: "#ff4b4b",
        });
        throw error;
      }
    },

    async actualizarDatosUsuario() {
      try {
        // 🔥 CORREGIDO: Usar userId en lugar de id
        const response = await fetch(`https://localhost:7295/api/Usuario/${this.user.userId}`);
        if (!response.ok) throw new Error('Error al obtener datos del usuario');

        const userData = await response.json();
        this.setUser(userData);
      } catch (error) {
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