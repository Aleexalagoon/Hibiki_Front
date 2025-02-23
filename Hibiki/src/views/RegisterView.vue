<template>
  <div class="register-container">
    <form @submit.prevent="register">
      <h1 class="register-title">REGISTRARSE EN HIBIKI</h1>
      <input v-model="username" type="text" placeholder="Usuario" required />
      <input v-model="email" type="email" placeholder="Correo electrónico" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <input v-model="confirmPassword" type="password" placeholder="Confirmar contraseña" required />
      <button type="submit" class="register-button">Registrarse</button>
      <div class="link">
        <a href="/login" class="login">¿Ya tienes cuenta? Inicia sesión en Hibiki</a>
      </div>
    </form>
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
      confirmPassword: ''
    };
  },
  methods: {
    async register() {
      if (this.password !== this.confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }

      try {
        const response = await fetch('http://localhost:5149/api/Usuario', {
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
        alert('Registro exitoso');
        localStorage.setItem('isAuthenticated', 'true');
        this.$router.push('/novedades');
      } catch (error) {
        alert('Error en el registro');
        console.error(error);
      }
    }
  }
};
</script>


<style scoped>
.register-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #000000;
}
.register-container {
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
.register-button {
  background-color: #ff5100;
  color: white;
  font-size: 16px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.register-button:hover {
  background-color: #ca3900;
}
.link {
  margin-top: 20px;
  text-align: center;
}
.login {
  color: #000000;
  text-decoration: none;
  font-size: 14px;
}
</style>
