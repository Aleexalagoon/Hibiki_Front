<script>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

export default {
  setup() {
    const authStore = useAuthStore();
    const isPremium = computed(() => authStore.isPremium);
    
    return {
      isPremium
    };
  },
  methods: {
    startSubscription() {
      this.$router.push('/pago'); 
    },
    initCanvas() {
      const canvas = this.$refs.backgroundCanvas;
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = document.body.scrollHeight || window.innerHeight;
      const letters = [];
      for (let i = 0; i < 250; i++) {
        letters.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 20 + 10, 
          color: this.getRandomColor(),
          speedX: Math.random() * 0.8 - 0.2,
          speedY: Math.random() * 0.8 - 0.2,
          opacity: Math.random() * 0.5 + 0.1 
        });
      }
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        letters.forEach(letter => {
          ctx.save();
          ctx.font = `${letter.size}px Arial, sans-serif`;
          ctx.fillStyle = letter.color;
          ctx.globalAlpha = letter.opacity;
          ctx.fillText("H", letter.x, letter.y);
          ctx.restore();
          letter.x += letter.speedX;
          letter.y += letter.speedY;
        })
        requestAnimationFrame(animate);
      };
      
      animate();
    },
    getRandomColor() {
      const colors = ['#ff5100', '#ff6a00', '#ff7e00', '#ff9a00', '#ffb700', '#ffd300'];
      return colors[Math.floor(Math.random() * colors.length)];
    },
    updateCanvasSize() {
      const canvas = this.$refs.backgroundCanvas;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = document.body.scrollHeight || window.innerHeight;
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initCanvas();
      window.addEventListener('resize', this.updateCanvasSize);
      window.addEventListener('scroll', () => {
        const canvas = this.$refs.backgroundCanvas;
        if (canvas) {
          canvas.height = document.body.scrollHeight || window.innerHeight;
        }
      });
    });
  },
};
</script>

<template>
  <div class="premium-view">
    <canvas ref="backgroundCanvas" class="background-canvas"></canvas>
    <section class="promo-section">
      <div class="promo-text">
        <h1 v-if="!isPremium">Enjoy your favorite content without limits.</h1>
        <h1 v-else>You're already enjoying Premium!</h1>
        <h2 v-if="!isPremium">Try Premium Individual for 2 months for 0 €.</h2>
        <h2 v-else>Continue enjoying all the premium advantages.</h2>
      </div>
    </section>
    <section class="comparison-section">
      <h2 class="section-title">Why choose Premium?</h2> 
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Features</th>
            <th>Premium</th>
            <th>Non-Premium</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Listen to your favorite music without ads</td>
            <td class="tick">✓</td>
            <td></td>
          </tr>
          <tr>
            <td>Download songs to enjoy offline</td>
            <td class="tick">✓</td>
            <td></td>
          </tr>
          <tr>
            <td>Listen to songs in any order</td>
            <td class="tick">✓</td>
            <td></td>
          </tr>
          <tr>
            <td>Download content</td>
            <td class="tick">✓</td>
            <td></td>
          </tr>
          <tr>
            <td>Access offline content</td>
            <td class="tick">✓</td>
            <td></td>
          </tr>
          <tr>
            <td>Limited access to some songs</td>
            <td></td>
            <td class="tick">✓</td>
          </tr>
        </tbody>
      </table>
      <div class="plan-card">
        <div v-if="!isPremium">
          <button class="plan-button" @click="startSubscription">Select</button>
        </div>
        <div v-else class="premium-status">
          <div class="premium-badge">
            <span class="premium-icon">★</span>
            <span>ACTIVE PREMIUM</span>
          </div>
          <p class="premium-message">You're already enjoying all the premium advantages</p>
        </div>
      </div>
    </section>
  </div>
</template>

  
<style scoped>
.premium-view {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(180deg, rgb(12, 12, 12) 0%, rgb(0, 0, 0) 100%);
  color: rgb(255, 255, 255);
  padding: 2rem;
}

.background-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.promo-section, .comparison-section {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 800px;
}

.promo-section {
  text-align: center;
  margin-bottom: 2rem;
}

.promo-text h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.promo-text h2 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #ff5100;
}

.comparison-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

.comparison-table th, 
.comparison-table td {
  padding: 10px 15px;
  text-align: left;
  border-bottom: 1px solid #333;
}

.comparison-table th {
  background-color: #ff5100;
  color: white;
  font-weight: bold;
}

.comparison-table tr:nth-child(even) {
  background-color: rgba(37, 37, 37, 0.5);
}

.tick {
  color: #ff5100;
  font-weight: bold;
}

.plan-card {
  text-align: center;
  margin: 1rem 0 2rem 0;
}

.plan-button {
  background-color: #ff5100;
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: bold;
}

.plan-button:hover {
  background-color: #ca3900;
}

/* Nuevos estilos para usuario premium */
.premium-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  border: 2px solid #ff5100;
  border-radius: 10px;
  background-color: rgba(255, 81, 0, 0.1);
}

.premium-badge {
  display: flex;
  align-items: center;
  background-color: #ff5100;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  margin-bottom: 15px;
}

.premium-icon {
  margin-right: 8px;
  font-size: 1.2rem;
}

.premium-message {
  font-size: 1.1rem;
  margin: 0;
}
</style>