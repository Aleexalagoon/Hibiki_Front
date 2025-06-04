
<template>
  <div class="login-wrapper">
    <div class="background-pattern"></div>
    <div class="login-container">
      <div class="login-panel">
        <div class="brand-section">
          <div class="logo-circle">
            <div class="logo-text">H</div>
          </div>
          <h1 class="brand-name">HIBIKI MUSIC</h1>
          <p class="welcome-text">Welcome back</p>
        </div>
        
        <form @submit.prevent="loginUser" class="login-form">
          <ThemeToggle class="theme-toggle" />
          
          <div class="form-group">
            <div class="floating-label">
              <input 
                v-model="email" 
                type="email" 
                id="email"
                class="form-input"
                placeholder=" "
                required 
              />
              <label for="email" class="form-label">Email</label>
              <div class="input-decoration"></div>
            </div>
          </div>
          
          <div class="form-group">
            <div class="floating-label">
              <input 
                v-model="password" 
                type="password" 
                id="password"
                class="form-input"
                placeholder=" "
                required 
              />
              <label for="password" class="form-label">Password</label>
              <div class="input-decoration"></div>
            </div>
          </div>
          
          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" class="checkbox">
              <span class="checkmark"></span>
              Remember me
            </label>
            <a href="" class="forgot-link">Forgot your password?</a>
          </div>
          
          <button type="submit" class="login-btn">
            <span class="btn-text">Login</span>
            <div class="btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </button>
          
          <div class="register-section">
            <p class="register-text">Don't have an account?</p>
            <router-link to="/register" class="register-link">Sign up for Hibiki</router-link>
          </div>
          
          <div class="staff-section">
            <div class="divider-line"></div>
            <a href="/loginzonaprivada" class="staff-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Staff access
            </a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import ThemeToggle from '@/components/ThemeToggle.vue';

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
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.login-wrapper {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--background-primary) 0%, var(--background-secondary) 100%);
  padding: 20px;
  font-family: 'Helvetica', 'Arial', sans-serif;
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255, 81, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 81, 0, 0.05) 0%, transparent 50%);
  background-size: 600px 600px;
  pointer-events: none;
}

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 480px;
}

.login-panel {
  background: var(--background-secondary);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.login-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--accent-color), #ff7340, var(--accent-color));
}

.brand-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--accent-color), #ff7340);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 8px 32px rgba(255, 81, 0, 0.3);
  position: relative;
}

.logo-circle::after {
  content: '';
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  background: var(--background-secondary);
  opacity: 0.1;
}

.logo-text {
  font-size: 36px;
  font-weight: 800;
  color: white;
  position: relative;
  z-index: 1;
}

.brand-name {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  letter-spacing: 1px;
}

.welcome-text {
  color: var(--text-secondary);
  font-size: 16px;
  margin: 0;
  font-weight: 400;
}

.login-form {
  position: relative;
}

.theme-toggle {
  position: absolute;
  top: -10px;
  right: 0;
}

.form-group {
  margin-bottom: 24px;
}

.floating-label {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 20px 16px 8px 16px;
  background: var(--background-tertiary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 16px;
  color: var(--text-primary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 4px rgba(255, 81, 0, 0.1);
}

.form-input:focus + .form-label,
.form-input:not(:placeholder-shown) + .form-label {
  transform: translateY(-12px) scale(0.8);
  color: var(--accent-color);
}

.form-label {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 16px;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--background-tertiary);
  padding: 0 4px;
  transform-origin: left center;
}

.input-decoration {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--accent-color);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.form-input:focus ~ .input-decoration {
  width: 100%;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}

.checkbox {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox:checked + .checkmark {
  background: var(--accent-color);
  border-color: var(--accent-color);
}

.checkbox:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.forgot-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: var(--accent-color);
}

.login-btn {
  width: 100%;
  padding: 18px 24px;
  background: linear-gradient(135deg, var(--accent-color), #ff7340);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
  overflow: hidden;
  margin-bottom: 32px;
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.login-btn:hover::before {
  left: 100%;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(255, 81, 0, 0.4);
}

.login-btn:active {
  transform: translateY(0);
}

.btn-text {
  position: relative;
  z-index: 1;
}

.btn-icon {
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
}

.login-btn:hover .btn-icon {
  transform: translateX(4px);
}

.register-section {
  text-align: center;
  margin-bottom: 24px;
}

.register-text {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0 0 8px 0;
}

.register-link {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.register-link:hover {
  text-decoration: underline;
  color: #ff7340;
}

.staff-section {
  text-align: center;
  position: relative;
}

.divider-line {
  height: 1px;
  background: var(--border-color);
  margin-bottom: 16px;
}

.staff-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.staff-link:hover {
  color: var(--accent-color);
  background: rgba(255, 81, 0, 0.1);
}

@media (max-width: 768px) {
  .login-wrapper {
    padding: 16px;
  }
  
  .login-panel {
    padding: 32px 24px;
  }
  
  .brand-name {
    font-size: 28px;
  }
  
  .logo-circle {
    width: 64px;
    height: 64px;
  }
  
  .logo-text {
    font-size: 28px;
  }
  
  .form-options {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .login-panel {
    padding: 24px 20px;
  }
}
</style>