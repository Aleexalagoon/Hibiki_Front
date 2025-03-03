<template>
  <div class="pago-completado">
    <div class="pago-contenedor">
      <div class="icono-exito">
        <svg viewBox="0 0 24 24" width="64" height="64">
          <circle cx="12" cy="12" r="11" fill="#ff5100" />
          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="white" />
        </svg>
      </div>
      <h1>¡Pago Completado!</h1>
      <p>Tu transacción se ha procesado correctamente.</p>      
      <router-link to="/novedades" class="boton-volver">
        Volver a inicio
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.pago-completado {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color:rgb(0, 0, 0);
  padding: 20px;
}

.pago-contenedor {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 40px;
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.icono-exito {
  margin-bottom: 24px;
}

h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 16px;
}

p {
  color: #666;
  margin-bottom: 12px;
}

.detalle {
  margin: 24px 0;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.detalle span {
  font-weight: bold;
  color: #333;
}

.boton-volver {
  display: inline-block;
  background-color: #ff5100;
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
}
</style>