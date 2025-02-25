<template>
    <div class="premium-view">
      <div class="tarjeta-premium">
        <h2>Premium Individual</h2>
        <p class="precio">0,00 €</p>
        <p class="subtitulo">Durante 2 meses</p>
        <p class="detalle">Inicio de los meses gratis: <strong>Hoy</strong></p>
        <p class="detalle">Inicio de la facturación: <strong>25 abr 2025</strong></p>
        <p class="detalle">Solo 10,99 € al mes al terminar la prueba de 2 meses</p>
        <p class="detalle">Tu cuenta es gratis hasta el <strong>25 abr 2025</strong></p>
        <p class="detalle">Puedes cancelar cuando quieras. Rigen las condiciones de la oferta.</p>
        <p class="detalle">Te enviaremos un recordatorio 7 días antes del cobro.</p>
      </div>
      
      <div class="metodo-pago">
        <h3>Método de pago</h3>
        <form>
          <input type="text" placeholder="Número de tarjeta" class="input-field" />
          <div class="input-row">
            <input type="text" placeholder="Fecha de expiración (MM/AA)" class="input-field" />
            <input type="text" placeholder="CVC" class="input-field" />
          </div>
          <button type="submit" class="boton-pago">Pagar</button>
        </form>
      </div>
    </div>
  </template>

  <style scoped>
  * {
    box-sizing: border-box;
  }
  
  html, body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  
  .premium-view {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(180deg, rgba(63, 62, 62, 0.9) 0%, rgba(0, 0, 0, 1) 100%);
    color: rgb(255, 255, 255);
    padding: 2rem;
  }
  
  .tarjeta-premium {
    background-color: #1c1c1c;
    padding: 30px;
    border-radius: 15px;
    margin-bottom: 40px;
    width: 100%;
    max-width: 700px;
    transition: transform 0.3s ease;
  }
  
  .tarjeta-premium h2 {
    color: #ff5100;
    font-size: 28px;
    font-weight: bold;
    text-align: center;
    letter-spacing: 1px;
  }
  
  .precio {
    font-size: 36px;
    font-weight: bold;
    color: #ff5100;
    text-align: center;
    margin: 10px 0;
  }
  
  .subtitulo {
    font-size: 20px;
    text-align: center;
    font-weight: normal;
    color: #ddd;
  }
  
  .detalle {
    font-size: 16px;
    text-align: center;
    color: #ffffff;
    margin-bottom: 10px;
  }
  
  .metodo-pago {
    background-color: #2c2c2c;
    padding: 30px;
    border-radius: 10px;
    width: 100%;
    max-width: 700px;
  }
  
  .metodo-pago h3 {
    font-size: 22px;
    margin-bottom: 25px;
    text-align: center;
    color: #ffffff;
  }
  
  .input-field {
    width: 100%;
    padding: 15px;
    margin: 12px 0;
    border: 2px solid #444;
    border-radius: 10px;
    font-size: 16px;
    background-color: #333;
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    transition: border-color 0.3s ease;
  }
  
  .input-field::placeholder {
    color: #bbb;
  }
  
  .input-field:focus {
    border-color: #ff5100;
    outline: none;
  }
  
  .input-row {
    display: flex;
    gap: 20px;
  }
  
  .boton-pago {
    width: 100%;
    padding: 15px;
    background-color: #ff5100;
    color: white;
    font-size: 20px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }
  
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  form input::placeholder {
    color: #bbb;
  }
  </style>
  
  