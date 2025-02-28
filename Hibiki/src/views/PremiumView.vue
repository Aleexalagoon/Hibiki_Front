<script>
export default {
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
        <h1>Disfruta de tu contenido favorito sin límites.</h1>
        <h2>Prueba Premium Individual durante 2 meses por 0 €.</h2>
      </div>
    </section>
    <section class="comparison-section">
      <h2 class="section-title">¿Por qué elegir Premium?</h2> 
      <table class="comparison-table">
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
            <td class="tick">✓</td>
            <td></td>
          </tr>
          <tr>
            <td>Descarga de canciones para disfrutarlas sin conexión</td>
            <td class="tick">✓</td>
            <td></td>
          </tr>
          <tr>
            <td>Escucha canciones en cualquier orden</td>
            <td class="tick">✓</td>
            <td></td>
          </tr>
          <tr>
            <td>Descargar contenido</td>
            <td class="tick">✓</td>
            <td></td>
          </tr>
          <tr>
            <td>Acceso a contenido offline</td>
            <td class="tick">✓</td>
            <td></td>
          </tr>
          <tr>
            <td>Acceso limitado a algunas canciones</td>
            <td></td>
            <td class="tick">✓</td>
          </tr>
        </tbody>
      </table>
      <div class="plan-card">
        <button class="plan-button" @click="startSubscription">Seleccionar</button>
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
</style>