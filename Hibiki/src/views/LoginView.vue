<template>
    <div class="login-container">
      <form @submit.prevent="login">
        <h1 class="login-title">INICIAR SESIÓN EN HIBIKI</h1>
        <input v-model="username" type="text" placeholder="Usuario" required />
        <input v-model="password" type="password" placeholder="Contraseña" required />
        <button type="submit" class="login-button">Iniciar sesión</button>
        <div class="link">
        <a href="#" class="signup">¿No tienes cuenta? Suscríbete a Hibiki</a>
    </div>
      </form>
    </div>
   
  </template>
  
  <script>
  export default {
    name: 'LoginView',
    data() {
      return {
        username: '',
        password: ''
      };
    },
    methods: {
      login() {
        if (this.username === 'admin' && this.password === 'admin') {
          alert('Inicio de sesión exitoso');
          this.$router.push('/home'); 
        } else {
          alert('Usuario o contraseña incorrectos');
        }
      }
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
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
  
  input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .login-button {
    background-color: #000000;
    color: white;
    font-size: 16px;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .login-button:hover {
    background-color: #4b4b4b;
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
  