<template>
  <div class="register-wrapper">
    <div class="background-pattern"></div>
    <div class="register-container">
      <div class="register-panel">
        <div class="brand-section">
          <div class="logo-circle">
            <div class="logo-text">H</div>
          </div>
          <h1 class="brand-name">Hibiki</h1>
          <p class="welcome-text">Join our community</p>
        </div>
        
        <form @submit.prevent="register" class="register-form">
          <ThemeToggle class="theme-toggle" />
          
          <div class="form-group">
            <div class="floating-label">
              <input 
                v-model="username" 
                type="text" 
                id="username"
                class="form-input"
                placeholder=" "
                required 
              />
              <label for="username" class="form-label">Username</label>
              <div class="input-decoration"></div>
            </div>
          </div>
          
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
              <label for="email" class="form-label">Email Address</label>
              <div class="input-decoration"></div>
            </div>
          </div>
          
          <div class="form-row">
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
            
            <div class="form-group">
              <div class="floating-label">
                <input 
                  v-model="confirmPassword" 
                  type="password" 
                  id="confirmPassword"
                  class="form-input"
                  placeholder=" "
                  required 
                />
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <div class="input-decoration"></div>
              </div>
            </div>
          </div>
          
          <div class="terms-section">
            <label class="terms-checkbox">
              <input type="checkbox" v-model="acceptTerms" class="checkbox" required>
              <span class="checkmark"></span>
              <span class="terms-text">
                I agree to the 
                <a href="/terms" class="terms-link">Terms of Service</a> 
                and 
                <a href="/privacy" class="terms-link">Privacy Policy</a>
              </span>
            </label>
          </div>
          
          <button type="submit" class="register-btn" :disabled="!acceptTerms">
            <span class="btn-text">Create Account</span>
            <div class="btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L13.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </button>
          
          <div class="login-section">
            <p class="login-text">Already have an account?</p>
            <router-link to="/login" class="login-link">Sign in to Hibiki</router-link>
          </div>
          
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span>Free to join</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 15L17 10H7L12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span>Premium features</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span>Secure & private</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import ThemeToggle from '@/components/ThemeToggle.vue';

export default {
  name: 'RegisterView',
  components: {
    ThemeToggle
  },
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    };
  },
  methods: {
    async register() {
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      
      if (!this.acceptTerms) {
        alert('You must accept the terms and conditions');
        return;
      }
      
      try {
        const response = await fetch('https://localhost:7295/api/Usuario', {
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
          throw new Error('Error registering user');
        }
        
        const data = await response.json();
        alert('Registration successful. Please sign in.');
        
        this.$router.push('/login');
      } catch (error) {
        alert('Registration error');
        console.error(error);
      }
    }
  }
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}

.register-wrapper {
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
    radial-gradient(circle at 20% 80%, rgba(255, 81, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 81, 0, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 81, 0, 0.03) 0%, transparent 50%);
  background-size: 600px 600px;
  pointer-events: none;
}

.register-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 520px;
}

.register-panel {
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

.register-panel::before {
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

.register-form {
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.floating-label {
  position: relative;
  z-index: 0;
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

.form-label {
  position: absolute;
  left: 16px;
  top: 20px;
  color: var(--text-secondary);
  font-size: 16px;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--background-secondary);
  padding: 0 4px;
  transform-origin: left top;
  z-index: 1;
}

.form-input:focus + .form-label,
.form-input:not(:placeholder-shown) + .form-label {
  top: -2px;
  font-size: 12px;
  color: var(--accent-color);
  background: var(--background-secondary);
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

.terms-section {
  margin-bottom: 32px;
}

.terms-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  user-select: none;
  line-height: 1.5;
}

.checkbox {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-top: 2px;
}

.checkbox:checked + .checkmark {
  background: var(--accent-color);
  border-color: var(--accent-color);
}

.checkbox:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 4px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.terms-text {
  color: var(--text-secondary);
  font-size: 14px;
}

.terms-link {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.terms-link:hover {
  text-decoration: underline;
  color: #ff7340;
}

.register-btn {
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

.register-btn:disabled {
  background: var(--border-color);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.register-btn:disabled:hover {
  transform: none;
  box-shadow: none;
}

.register-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.register-btn:not(:disabled):hover::before {
  left: 100%;
}

.register-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(255, 81, 0, 0.4);
}

.register-btn:active {
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

.register-btn:not(:disabled):hover .btn-icon {
  transform: translateX(4px);
}

.login-section {
  text-align: center;
  margin-bottom: 32px;
}

.login-text {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0 0 8px 0;
}

.login-link {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.login-link:hover {
  text-decoration: underline;
  color: #ff7340;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.feature-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 81, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-color);
}

.feature-item span {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

@media (max-width: 768px) {
  .register-wrapper {
    padding: 16px;
  }
  
  .register-panel {
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
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .feature-item {
    flex-direction: row;
    justify-content: flex-start;
    text-align: left;
  }
}

@media (max-width: 480px) {
  .register-panel {
    padding: 24px 20px;
  }
}
</style>