<script>
export default {
  methods: {
    startSubscription() {
      this.$router.push('/pago'); 
    },
  },
};
</script>

<template>
    <div class="premium-view">
      <section class="promo-section">
        <div class="promo-text">
          <h1>Disfruta de tu contenido favorito sin límites.</h1>
          <h2>Prueba Premium Individual durante 2 meses por 0 €.</h2>
        </div>
      </section>
      <section class="comparison-table">
      <h2>¿Por qué elegir Premium?</h2>
      <table>
        <thead>
          <tr>
            <th>Características</th>
            <th>Premium</th>
            <th>No Premium</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Escucha tu música favorita sin anuncios</td>
            <td class="tick">✔</td>
            <td></td>
          </tr>
          <tr>
            <td>Descarga de canciones para disfrutarlas sin conexión</td>
            <td class="tick">✔</td>
            <td></td>
          </tr>
          <tr>
            <td>Escucha canciones en cualquier orden</td>
            <td class="tick">✔</td>
            <td></td>
          </tr>
          <tr>
            <td>Descargar contenido</td>
            <td class="tick">✔</td>
            <td></td>
          </tr>
          <tr>
            <td>Acceso a contenido offline</td>
            <td class="tick">✔</td>
            <td></td>
          </tr>
          <tr>
            <td>Acceso limitado a algunas canciones</td>
            <td></td>
            <td class="tick">✔</td>
          </tr>
        </tbody>
      </table>
      
<div class="plan-cards-container">
  <section class="plan-card">
      <div class="plan-card-title">Individual</div>
      <p class="plan-price">10,99€<span>/mes</span></p>
      <p class="plan-description">Ideal para disfrutar de la mejor música de forma individual, sin distracciones.</p>
      <button class="plan-button" @click="startSubscription">Seleccionar</button>
    </section>

</div>
    </section>
      <section class="content-cards">
        <div class="card" v-for="(item, index) in contentCards" :key="index">
          <div class="card-title">{{ item.title }}</div>
          <p class="card-text">{{ item.textLine1 }}</p>
          <p class="card-text">{{ item.textLine2 }}</p>
        </div>
      </section>
    </div>
  </template>
  
  <style scoped>
  * {
    box-sizing: border-box;
  }
  
  html, body {
    height: 100%;
    width: 100%;
    font-family: 'Arial', sans-serif;
  }
  
  .premium-view {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(180deg, rgb(63, 62, 62) 0%, rgb(0, 0, 0) 100%);
    color: rgb(255, 255, 255);
    padding: 2rem;
  }
  
  .promo-section {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .promo-text h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .promo-text h2 {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }
  
  .promo-text p {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
  
  .buttons {
    display: flex;
    justify-content: center;
    gap: 2rem;
  }
  
  .start-button {
    padding: 1rem 2rem;
    font-size: 1rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: background 0.3s ease;
    background-color: #ff5100;
    color: white;
  }
  
  .start-button:hover {
    background-color: #ca3900;
  }
  
  table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

th, td {
  padding: 8px 12px;
  text-align: left;
  border: 0px solid #ddd;
}

th {
  background-color:#ff5100;
  font-weight: bold;
}

.tick {
  text-align: center;
  color: #ff5100;
}

.plan-cards-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 20px;
}

.plan-card {
  background-color: #black;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 250px;
  text-align: center;
}

.plan-card-title {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 10px;
}

.plan-price {
  font-size: 1.2em;
  color: white;
  margin-bottom: 10px;
}

.plan-price span {
  font-size: 0.9em;
  color: white;
}

.plan-description {
  font-size: 1em;
  color: white;
  margin-bottom: 20px;
}

.plan-button {
  background-color: #ff5100;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 1em;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.plan-button:hover {
  background-color: #ca3900;
}
  </style>
  