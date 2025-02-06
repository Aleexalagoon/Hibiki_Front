<template>
    <div class="premium-view">
      <section class="promo-section">
        <div class="promo-text">
          <h1>Disfruta de tu contenido favorito sin límites.</h1>
          <h2>Prueba Premium Individual durante 2 meses por 0 €.</h2>
          <p>Después, solo 10,99 €/mes. Cancela cuando quieras.</p>
          <div class="buttons">
            <button class="start-button" @click="startSubscription">Empezar</button>
          </div>
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
  
  <script setup>
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const contentCards = [
    {
      title: "Individual",
      textLine1: "Este es un espacio dedicado a la experiencia individual.",
      textLine2: "10,99€/mes.",
    },
    {
      title: "Duo",
      textLine1: "Comparte la música con un amigo o ser querido.",
      textLine2: "14,99€/mes.",
    },
    {
      title: "Familiar",
      textLine1: "Una experiencia perfecta para toda la familia.",
      textLine2: "19,99€/mes.",
    },
  ];
  
  const startSubscription = () => {
    router.push('/register'); 
  };
  </script>
  
  <style scoped>
  * {
    margin: 0;
    padding: 0;
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
    background: linear-gradient(180deg, rgb(255, 255, 255) 0%, rgb(0, 0, 0) 100%);
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
  
  .content-cards {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 3rem;
  }
  
  .card {
    background: black;
    padding: 1rem;
    border-radius: 12px;
    width: 250px; 
    text-align: center;
    transition: transform 0.3s ease;
  }
  
  .card-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .card-text {
    font-size: 1rem;
    color: #ffffff;
  }
  
  .card:hover {
    transform: translateY(-10px);
  }
  </style>
  