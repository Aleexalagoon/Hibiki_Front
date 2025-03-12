<template>
  <div class="login-container">
    <form @submit.prevent="login" class="login-form">
      <h2 class="login-title">Inicio Sesion Zona Privada Hibiki</h2>
      <div class="form-group">
        <label for="username">EMAIL*</label>
        <input 
          type="text" 
          id="username" 
          v-model="username" 
          required 
          placeholder="Enter your email"
        >
      </div>
      <div class="form-group">
        <label for="password">PASSWORD*</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          required 
          placeholder="Enter your password"
        >
      </div>
      <button type="submit" class="login-button">LOG IN</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')

const router = useRouter()
const login = () => {
  const predefinedUsername = 'HibikiUser33'
  const predefinedPassword = 'Hibiki1234'
  if (username.value === predefinedUsername && password.value === predefinedPassword) {
    router.push('/zonaprivada')
  } else {
    alert('Contraseña incorrecta prueba otra vez.')
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #ffffff;
  font-family: 'Jura', sans-serif;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #000000;
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
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
</style>