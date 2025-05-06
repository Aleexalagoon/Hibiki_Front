<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-container">
      </div>
      <form @submit.prevent="loginUser">
        <h1 class="login-title">LOG IN</h1>
        <ThemeToggle />
        
        <div class="input-group">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="Enter your email" required />
        </div>
        
        <div class="input-group">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="Enter your password" required />
        </div>
        
        <div class="forgot-password">
          <a href="/reset-password">Forgot your password?</a>
        </div>
        
        <button type="submit" class="login-button">Log In</button>
        
        <div class="divider">
          <span>or</span>
        </div>
        
        <button type="button" class="google-button" @click="loginWithGoogle">
          <svg class="google-icon" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>
        
        <div class="links">
          <a href="/register" class="signup">Don't have an account? <span>Sign up at Hibiki</span></a>
          <a href="/loginzonaprivada" class="staff-login">Are you a staff member? <span>Click here</span></a>
        </div>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import ThemeToggle from '@/components/ThemeToggle.vue';  // Importar el componente

const email = ref('');
const password = ref('');
const router = useRouter();
const authStore = useAuthStore();

const loginUser = async () => {
  try {
    await authStore.loginUser(email.value, password.value);
    alert('Inicio de sesión exitoso');
    router.push('/inicio');
  } catch (error) {
    alert('Credenciales inválidas');
    console.error(error);
  }
};

const loginWithGoogle = async () => {
  try {
    await authStore.loginWithGoogle();
    router.push('/inicio');
  } catch (error) {
    alert('Error al iniciar sesión con Google');
    console.error(error);
  }
};
</script>

<style scoped>
/* Transición suave entre temas */
body {
    transition: background-color 0.3s ease, color 0.3s ease;
}

/* Estilos para el login */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--background-primary);
  font-family: 'Helvetica', 'Arial', sans-serif;
}

.login-card {
  width: 100%;
  max-width: 700px;
  padding: 3rem;
  background: var(--background-secondary);
  border-radius: 16px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);
  border-top: 4px solid var(--accent-color);
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.logo {
  font-size: 38px;
  font-weight: 800;
  color: var(--accent-color);
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.login-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 30px;
  text-align: center;
  color: var(--text-primary);
  letter-spacing: 1px;
}

.input-group {
  position: relative;
  width: 100%;
}

.input-group label {
  display: block;
  margin-bottom: 10px;
  color: var(--text-secondary);
  font-size: 16px;
  font-weight: 500;
}

input {
  width: 94%;
  padding: 18px;
  background-color: var(--background-tertiary);
  border: 2px solid var(--border-color);
  border-radius: 10px;
  font-size: 18px;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

input:focus {
  border-color: var(--accent-color);
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 81, 0, 0.2);
}

input::placeholder {
  color: var(--text-secondary);
}

.forgot-password {
  text-align: right;
  margin-top: -10px;
}

.forgot-password a {
  color: var(--text-secondary);
  font-size: 15px;
  text-decoration: none;
  transition: color 0.3s;
}

.forgot-password a:hover {
  color: var(--accent-color);
}

.login-button {
  padding: 18px;
  background-color: var(--accent-color);
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

.login-button:hover {
  background-color: #e84900;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 81, 0, 0.3);
}

.login-button:active {
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
  border-bottom: 1px solid var(--border-color);
}

.divider span {
  padding: 0 20px;
  color: var(--text-secondary);
  font-size: 16px;
}

.google-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 18px;
  background-color: var(--background-tertiary);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
  border-radius: 10px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.google-button:hover {
  background-color: var(--background-tertiary);
  border-color: var(--border-color);
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

.signup, .staff-login {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s;
}

.signup span, .staff-login span {
  color: var(--accent-color);
  font-weight: 500;
}

.signup:hover, .staff-login:hover {
  color: var(--text-primary);
}

.signup:hover span, .staff-login:hover span {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-card {
    max-width: 90%;
    padding: 2rem;
  }

  .login-title {
    font-size: 28px;
  }

  input, .login-button, .google-button {
    padding: 16px;
    font-size: 16px;
  }
}
</style>