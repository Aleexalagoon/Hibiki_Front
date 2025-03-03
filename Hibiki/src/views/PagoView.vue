<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const authStore = useAuthStore();
const router = useRouter();
const formIsValid = ref(true);
const errorMessage = ref('');

const handlePayment = async (event) => {
  event.preventDefault();
  
  // Validación sencilla del formulario
  const cardNumber = document.getElementById('cardNumber').value;
  const expiryDate = document.getElementById('expiryDate').value;
  const securityCode = document.getElementById('securityCode').value;
  
  if (!cardNumber || !expiryDate || !securityCode) {
    formIsValid.value = false;
    errorMessage.value = 'Por favor, completa todos los campos requeridos.';
    return;
  }
  
  try {
    const updateResponse = await fetch(`https://localhost:7295/api/Usuario/${authStore.user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...authStore.user,
        isPremium: true
      })
    });
    // Actualizamos el estado de usuario a premium
    authStore.setUser({
      ...authStore.user,
      isPremium: true,
    });
    // Navegamos a la página premium
    router.push('/pagocompletado');
    
    // Alerta de éxito
    Swal.fire({
      title: "¡Pago exitoso!",
      text: "Ahora eres un usuario Premium.",
      icon: "success",
      confirmButtonColor: "#4a90e2",
    });
  } catch (error) {
    // Si el pago falla
    Swal.fire({
      title: "Error",
      text: "Hubo un error al procesar tu pago. Intenta nuevamente.",
      icon: "error",
      confirmButtonColor: "#ff4b4b",
    });
  }
};
</script>

<template>
  <div class="payment-form">
    <div class="header">
    </div>
    <div class="plan-info">
      <div class="plan-header">
        <div class="plan-icon-title">
          <div class="plan-icon">
            <div class="icon-inner"></div>
          </div>
          <div>
            <h2>Premium Individual</h2>
            <p class="subtitle">1 cuenta Premium</p>
          </div>
        </div>
        <div class="plan-price">
          <p class="price">0,00 €</p>
          <p class="subtitle">Por 1 mes</p>
        </div>
      </div>
      <div class="plan-details">
        <p>• Hoy: 1 mes por 0,00 €</p>
        <p>• A partir del 10 abr 2025: 10,99 €/mes</p>
        <p>• Te enviaremos un recordatorio 7 días antes del cobro.</p>
        <p>• Cancela cuando quieras online. <a href="/politica" class="orange-link">Consulta las condiciones</a></p>
      </div>
    </div>  
    <div class="section">
      <h2>Forma de pago</h2>
      <div class="payment-options">
        <div class="payment-option selected">
          <div class="option-header">
            <label class="radio-container">
              <input type="radio" name="payment" checked>
              <span class="radio-checkmark"></span>
              <span class="payment-label">Tarjeta de crédito o débito</span>
            </label>
          </div>
          <div class="card-icons">
            <img src="https://1000logos.net/wp-content/uploads/2021/11/VISA-logo.png" alt="Visa" class="card-icon">
            <img src="https://cdn.cdnlogo.com/logos/m/33/mastercard.svg" alt="Mastercard" class="card-icon">
            <img src="https://support.apple.com/content/dam/edam/applecare/images/en_US/psp/psp_heroes/mini-hero-applepay.png" alt="Amex" class="card-icon">
          </div>
          <form @submit="handlePayment" class="card-form">
            <div v-if="!formIsValid" class="error-message">
              {{ errorMessage }}
            </div>
            <div class="form-group">
              <label for="cardNumber">Número de tarjeta *</label>
              <input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" class="form-control" required>
            </div>
            <div class="form-row">
              <div class="form-group half">
                <label for="expiryDate">Fecha de caducidad *</label>
                <input type="text" id="expiryDate" placeholder="MM/AA" class="form-control" required>
              </div>
              <div class="form-group half">
                <label for="securityCode">Código de seguridad *</label>
                <div class="security-code-wrapper">
                  <input type="text" id="securityCode" class="form-control" required>
                  <div class="help-icon">?</div>
                </div>
              </div>
            </div>
            <div class="section summary-section">
              <h2>Resumen</h2>
              <div class="summary-content">
                <div class="summary-header">Artículos</div>
                <div class="summary-item">
                  <div class="item-info">
                    <div class="item-icon"></div>
                    <span class="item-name">Premium Individual</span>
                  </div>
                  <span class="item-price">0,00 €</span>
                </div>
                
                <div class="summary-details">
                  <p>• Hoy: 1 mes por 0,00 €</p>
                  <p>• A partir del 10 abr 2025: 10,99 €/mes</p>
                </div>
                
                <div class="summary-total">
                  <span>Total ahora</span>
                  <span class="total-price">0,00 €</span>
                </div>
              </div>
            </div>
            <button type="submit" class="payment-button">Pagar ahora</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment-form {
  margin: 0 auto;
  padding: 1rem;
  color: #ffffff;
  background-color: #000000;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

h1 {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

h2 {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0 0 1rem 0;
}

.change-plan:hover {
  color: #ff5500;
}

.plan-info {
  margin-bottom: 2rem;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.plan-icon-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.plan-icon {
  width: 2rem;
  height: 2rem;
  background-color: #000000;
  border: 1px solid #333;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-inner {
  width: 1rem;
  height: 1rem;
  background-color: #ccc;
  border-radius: 50%;
}

.subtitle {
  color: #a0a0a0;
  font-size: 0.875rem;
  margin: 0.25rem 0;
}

.price {
  font-weight: bold;
  margin: 0;
  text-align: right;
}

.plan-details {
  margin-left: 2.75rem;
  font-size: 0.875rem;
  color: #d0d0d0;
}

.plan-details p {
  margin: 0.5rem 0;
}

.orange-link {
  color: #ff5500;
  text-decoration: none;
}

.section {
  padding-top: 1.5rem;
  margin-bottom: 1.5rem;
  border-top: 1px solid #333;
}

.payment-options {
  background-color: #111;
  border-radius: 0.5rem;
  overflow: hidden;
}

.payment-option {
  padding: 1rem;
  border-bottom: 1px solid #222;
}

.payment-option.selected {
  border-left: 2px solid #ff5500;
}

.radio-container {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  font-size: 1rem;
  user-select: none;
}

.radio-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.radio-checkmark {
  height: 1.25rem;
  width: 1.25rem;
  background-color: transparent;
  border: 2px solid #666;
  border-radius: 50%;
  display: inline-block;
  margin-right: 0.75rem;
}

.radio-container input:checked ~ .radio-checkmark {
  border-color: #ff5500;
}

.payment-label {
  font-weight: 500;
}

.card-icons {
  display: flex;
  align-items: center;
  margin: 1rem 0;
  padding-left: 2rem;
}

.card-icon {
  height: 1.5rem;
  margin-right: 0.5rem;
}

.lock-icon {
  margin-left: auto;
  color: #666;
  width: 1.25rem;
  height: 1.25rem;
}

.card-form {
  padding-left: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.half {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #a0a0a0;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  box-sizing: border-box;
  border: 1px solid #444;
  border-radius: 0.25rem;
  background-color: transparent;
  color: white;
  font-size: 1rem;
}

.form-control::placeholder {
  color: #666;
}

.form-control:invalid {
  border-color: #ff5500;
}

.security-code-wrapper {
  position: relative;
}

.help-icon {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background-color: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: white;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  position: relative;
  cursor: pointer;
  font-size: 0.875rem;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkbox-checkmark {
  height: 1rem;
  width: 1rem;
  background-color: transparent;
  border: 1px solid #666;
  border-radius: 0.25rem;
  display: inline-block;
  margin-right: 0.5rem;
  margin-top: 0.125rem;
}

.summary-section {
  margin-top: 2rem;
}

.summary-content {
  background-color: #222;
  border-radius: 0.5rem;
  padding: 1rem;
}

.summary-header {
  font-weight: bold;
  margin-bottom: 1rem;
  color: #a0a0a0;
  font-size: 0.875rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.item-info {
  display: flex;
  align-items: center;
}

.item-icon {
  width: 1.5rem;
  height: 1.5rem;
  background-color: #333;
  border-radius: 0.25rem;
  margin-right: 0.5rem;
}

.item-name {
  font-weight: 500;
}

.summary-details {
  margin-left: 2rem;
  font-size: 0.875rem;
  color: #a0a0a0;
  margin-bottom: 1rem;
}

.summary-details p {
  margin: 0.25rem 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid #333;
  font-weight: bold;
}

.total-price {
  font-size: 1.125rem;
}

.payment-button {
  display: block;
  width: 100%;
  padding: 1rem;
  background-color: #ff5500;
  color: white;
  text-align: center;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  margin-top: 1.5rem;
}

.error-message {
  color: #ff5500;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: rgba(255, 85, 0, 0.1);
  border-radius: 0.25rem;
  border-left: 3px solid #ff5500;
}
</style>