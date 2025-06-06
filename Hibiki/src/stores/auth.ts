import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

interface User {
  userId: number;
  name: string;
  email: string;
  password?: string;
  isPremium: boolean;
  fecha_Registro: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
    isAuthenticated: !!localStorage.getItem('user'),
    isPremium: JSON.parse(localStorage.getItem('user') || '{}')?.isPremium || false,
    error: null as unknown,
  }),

  actions: {
    async registerUser(username: string, password: string, email?: string) {
      try {
        const userEmail = email || `${username}@example.com`;

        const response = await fetch(`http://hibikimusicapi.retocsv.es/api/Usuario`, {
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
        const url = `http://hibikimusicapi.retocsv.es/api/Usuario/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
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

    setUser(user: User) {
      this.user = user;
      this.isAuthenticated = true;
      this.isPremium = user.isPremium || false;
      localStorage.setItem('user', JSON.stringify(this.user));
    },

    // 🔥 NUEVO: Método para actualizar datos del usuario
    async updateUserData(userData: Partial<Pick<User, 'name' | 'email' | 'isPremium'>>) {
      if (!this.user?.userId) {
        throw new Error('No hay usuario autenticado');
      }

      try {
        console.log('Iniciando actualización de usuario:', this.user.userId);

        // 🔥 PASO 1: Obtener datos actuales del usuario para preservar la contraseña
        const currentResponse = await fetch(`http://hibikimusicapi.retocsv.es/api/Usuario/${this.user.userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!currentResponse.ok) {
          throw new Error(`Error al obtener datos actuales: ${currentResponse.status}`);
        }

        const currentData = await currentResponse.json();
        console.log('Datos actuales obtenidos correctamente');

        // 🔥 PASO 2: Crear objeto completo preservando la contraseña
        const completeUserData = {
          userId: this.user.userId,
          name: userData.name || currentData.name || currentData.Name,
          email: userData.email || currentData.email || currentData.Email,
          password: currentData.password || currentData.Password, // 👈 PRESERVAR contraseña original
          isPremium: userData.isPremium !== undefined ? userData.isPremium : (currentData.isPremium || currentData.IsPremium),
          fecha_Registro: currentData.fecha_Registro || currentData.FechaRegistro || this.user.fecha_Registro
        };

        console.log('Enviando datos completos (sin mostrar contraseña):', {
          ...completeUserData,
          password: '[PROTEGIDO]'
        });

        // 🔥 PASO 3: Enviar actualización completa al backend
        const response = await fetch(`http://hibikimusicapi.retocsv.es/api/Usuario/${this.user.userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(completeUserData)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al actualizar usuario: ${response.status} - ${errorText}`);
        }

        // 🔥 PASO 4: Actualizar datos locales en el store
        const updatedUser = {
          ...this.user,
          name: completeUserData.name,
          email: completeUserData.email,
          isPremium: completeUserData.isPremium,
          password: completeUserData.password // Mantener contraseña
        };

        this.setUser(updatedUser);

        console.log('Usuario actualizado exitosamente en el store');

        Swal.fire({
          title: "¡Perfil actualizado!",
          text: "Tus datos se han guardado correctamente.",
          icon: "success",
          confirmButtonColor: "#4a90e2",
        });

        return updatedUser;

      } catch (err: any) {
        console.error('Error al actualizar usuario:', err);
        
        Swal.fire({
          icon: "error",
          title: "Error al actualizar",
          text: "No se pudieron guardar los cambios. Inténtalo de nuevo.",
          confirmButtonColor: "#ff4b4b",
        });
        
        throw err;
      }
    },

    async actualizarDatosUsuario() {
      try {
        if (!this.user?.userId) return;
        
        const response = await fetch(`http://hibikimusicapi.retocsv.es/api/Usuario/${this.user.userId}`);
        if (!response.ok) throw new Error('Error al obtener datos del usuario');

        const userData = await response.json();
        this.setUser({
          userId: userData.userId || userData.UserId,
          name: userData.name || userData.Name,
          email: userData.email || userData.Email,
          password: userData.password || userData.Password,
          isPremium: userData.isPremium || userData.IsPremium,
          fecha_Registro: userData.fecha_Registro || userData.FechaRegistro || this.user.fecha_Registro
        });
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

    // 🔥 NUEVO: Método para hacer al usuario premium
    async upgradeToPremium() {
      if (!this.user) {
        throw new Error('No hay usuario autenticado');
      }

      try {
        const updatedUser = await this.updateUserData({ isPremium: true });
        
        Swal.fire({
          title: "¡Bienvenido a Premium!",
          text: "Ahora puedes disfrutar de todas las ventajas premium.",
          icon: "success",
          confirmButtonColor: "#4a90e2",
        });

        return updatedUser;
      } catch (error) {
        console.error('Error al actualizar a premium:', error);
        throw error;
      }
    },

    // 🔥 NUEVO: Método para debug del usuario
    getUserDebugInfo() {
      return {
        isAuthenticated: this.isAuthenticated,
        isPremium: this.isPremium,
        userId: this.user?.userId,
        userName: this.user?.name,
        userEmail: this.user?.email,
        registrationDate: this.user?.fecha_Registro,
        hasPassword: !!this.user?.password,
        localStorageUser: !!localStorage.getItem('user')
      };
    }
  },
});