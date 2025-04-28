<template>
  <div class="register-container">
    <div class="register-card">
      <div class="logo-container">
      </div>
      <form @submit.prevent="register">
        <h1 class="register-title">CREAR CUENTA</h1>
        
        <div class="input-group">
          <label>Nombre de usuario</label>
          <input v-model="username" type="text" placeholder="Ingresa tu nombre de usuario" required />
        </div>
        
        <div class="input-group">
          <label>Correo electrónico</label>
          <input v-model="email" type="email" placeholder="Ingresa tu correo" required />
        </div>
        
        <div class="input-group">
          <label>Contraseña</label>
          <input v-model="password" type="password" placeholder="Ingresa tu contraseña" required />
        </div>
        
        <div class="input-group">
          <label>Confirmar contraseña</label>
          <input v-model="confirmPassword" type="password" placeholder="Confirma tu contraseña" required />
        </div>
        
        <div class="terms-container">
          <input type="checkbox" id="terms" v-model="acceptTerms" required />
          <label for="terms">Acepto los <a href="/terms" class="terms-link">términos y condiciones</a></label>
        </div>
        
        <button type="submit" class="register-button">Crear cuenta</button>
        
        <div class="divider">
          <span>o</span>
        </div>
        
        <button type="button" class="google-button" @click="registerWithGoogle">
          <svg class="google-icon" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Registrarse con Google
        </button>
        
        <div class="links">
          <a href="/login" class="login">¿Ya tienes cuenta? <span>Inicia sesión en Hibiki</span></a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterView',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    };
  },
  methods: {
    async register() {
      if (this.password !== this.confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }
      
      if (!this.acceptTerms) {
        alert('Debes aceptar los términos y condiciones');
        return;
      }
      
      try {
        const response = await fetch('https://localhost:7295/api/Usuario', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.username,
            email: this.email,
            password: this.password,
            isPremium: false,
            fecha_Registro: new Date().toISOString()
          })
        });
        
        if (!response.ok) {
          throw new Error('Error al registrar el usuario');
        }
        
        const data = await response.json();
        alert('Registro exitoso. Por favor, inicia sesión.');
        
        // Redirect to login page after successful registration
        this.$router.push('/login');
      } catch (error) {
        alert('Error en el registro');
        console.error(error);
      }
    },
    
    async registerWithGoogle() {
      try {
        // Implementar registro con Google aquí
        alert('Funcionalidad de registro con Google en desarrollo');
      } catch (error) {
        alert('Error al registrarse con Google');
        console.error(error);
      }
    }
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #121212;
  font-family: 'Helvetica', 'Arial', sans-serif;
}

.register-card {
  width: 100%;
  max-width: 700px;
  padding: 3rem;
  background: #1e1e1e;
  border-radius: 16px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);
  border-top: 4px solid #ff5100;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.logo {
  font-size: 38px;
  font-weight: 800;
  color: #ff5100;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.register-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 30px;
  text-align: center;
  color: #ffffff;
  letter-spacing: 1px;
}

.input-group {
  position: relative;
  width: 100%;
}

.input-group label {
  display: block;
  margin-bottom: 10px;
  color: #aaaaaa;
  font-size: 16px;
  font-weight: 500;
}

input {
  width: 94%;
  padding: 18px;
  background-color: #2c2c2c;
  border: 2px solid #333333;
  border-radius: 10px;
  font-size: 18px;
  color: #ffffff;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #ff5100;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 81, 0, 0.2);
}

input::placeholder {
  color: #777777;
}

input[type="checkbox"] {
  width: auto;
  height: auto;
  padding: 0;
  margin-right: 10px;
  transform: scale(1.2);
  cursor: pointer;
}

.terms-container {
  display: flex;
  align-items: center;
  color: #aaaaaa;
  font-size: 15px;
}

.terms-link {
  color: #ff5100;
  text-decoration: none;
  transition: color 0.3s;
}

.terms-link:hover {
  text-decoration: underline;
}

.register-button {
  padding: 18px;
  background-color: #ff5100;
  color: white;
  font-size: 20px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

.register-button:hover {
  background-color: #e84900;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 81, 0, 0.3);
}

.register-button:active {
  transform: translateY(0);
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #333333;
}

.divider span {
  padding: 0 20px;
  color: #777777;
  font-size: 16px;
}

.google-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 18px;
  background-color: #2c2c2c;
  color: #ffffff;
  border: 2px solid #333333;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.google-button:hover {
  background-color: #333333;
  border-color: #444444;
}

.google-icon {
  width: 28px;
  height: 28px;
}

.links {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 30px;
  text-align: center;
}

.login {
  color: #aaaaaa;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s;
}

.login span {
  color: #ff5100;
  font-weight: 500;
}

.login:hover {
  color: #ffffff;
}

.login:hover span {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .register-card {
    max-width: 90%;
    padding: 2rem;
  }
  
  .register-title {
    font-size: 28px;
  }
  
  input, .register-button, .google-button {
    padding: 16px;
    font-size: 16px;
  }
}
</style>