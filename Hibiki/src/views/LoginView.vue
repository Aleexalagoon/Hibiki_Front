<template>
  <div class="login-container">
    <form @submit.prevent="loginUser">
      <h1 class="login-title">INICIAR SESIÓN EN HIBIKI</h1>
      <input v-model="email" type="email" placeholder="Correo electrónico" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit" class="login-button">Iniciar sesión</button>
      <div class="link">
        <a href="/register" class="signup">¿No tienes cuenta? Regístrate en Hibiki</a>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const email = ref('');
const password = ref('');
const router = useRouter();
const authStore = useAuthStore();

const loginUser = async () => {
  try {
    await authStore.loginUser(email.value, password.value);
    alert('Inicio de sesión exitoso');
    router.push('/inicio'); // Changed to '/inicio'
  } catch (error) {
    alert('Credenciales inválidas');
    console.error(error);
  }
};
</script>

<style scoped>
.login-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #000000;
}
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #ffffff;
}
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}
input {
  padding: 10px;
  border: 1px solid #000000;
  border-radius: 5px;
}
.login-button {
  background-color: #ff5100;
  color: white;
  font-size: 16px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.login-button:hover {
  background-color: #ca3900;
}
.link {
  margin-top: 20px;
  text-align: center;
}
.signup {
  color: #000000;
  text-decoration: none;
  font-size: 14px;
}
</style>