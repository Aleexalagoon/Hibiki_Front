<template>
  <div class="download-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hibiki-logo">
          <span class="logo-text">HIBIKI MUSIC</span>
          <div class="logo-subtitle">Music Experience</div>
        </div>
        
        <h1 class="hero-title">Download Hibiki Music</h1>
        <p class="hero-description">
          Get access to thousands of curated tracks and playlists on your device.
          Your complete music companion for the ultimate listening experience.
        </p>
        
        <button @click="downloadPDF" class="download-btn" :disabled="isDownloading">
          <div class="btn-content">
            <svg v-if="!isDownloading" class="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <div v-if="isDownloading" class="loading-spinner"></div>
            <span>{{ isDownloading ? 'Downloading...' : 'Download' }}</span>
          </div>
        </button>
        
        <div class="download-info">
          <p>Download directly from Hibiki servers</p>
        </div>
      </div>
      
      <!-- Floating Music Elements -->
      <div class="floating-elements">
        <div class="music-note note-1">♪</div>
        <div class="music-note note-2">♫</div>
        <div class="music-note note-3">♪</div>
        <div class="music-note note-4">♬</div>
        <div class="music-note note-5">♪</div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">You can also access content on mobile devices and tablets</h2>
        <p class="section-subtitle">Use Hibiki on mobile devices for easy access to your music library anywhere</p>
        
        <div class="app-downloads">
          <a href="#" class="app-btn ios-btn">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 40'%3E%3Cpath fill='white' d='M110 40H10C4.5 40 0 35.5 0 30V10C0 4.5 4.5 0 10 0h100c5.5 0 10 4.5 10 10v20c0 5.5-4.5 10-10 10z'/%3E%3Ctext x='60' y='25' font-family='Arial' font-size='12' text-anchor='middle' fill='black'%3EApp Store%3C/text%3E%3C/svg%3E" alt="Download on App Store">
          </a>
          <a href="#" class="app-btn android-btn">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 40'%3E%3Cpath fill='white' d='M110 40H10C4.5 40 0 35.5 0 30V10C0 4.5 4.5 0 10 0h100c5.5 0 10 4.5 10 10v20c0 5.5-4.5 10-10 10z'/%3E%3Ctext x='60' y='25' font-family='Arial' font-size='12' text-anchor='middle' fill='black'%3EGoogle Play%3C/text%3E%3C/svg%3E" alt="Get it on Google Play">
          </a>
          <a href="#" class="app-btn desktop-btn">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 40'%3E%3Cpath fill='white' d='M110 40H10C4.5 40 0 35.5 0 30V10C0 4.5 4.5 0 10 0h100c5.5 0 10 4.5 10 10v20c0 5.5-4.5 10-10 10z'/%3E%3Ctext x='60' y='25' font-family='Arial' font-size='12' text-anchor='middle' fill='black'%3EDesktop%3C/text%3E%3C/svg%3E" alt="Download for Desktop">
          </a>
        </div>
      </div>
    </section>

    <!-- Bottom Section -->
    <section class="bottom-section">
      <div class="container">
        <div class="content-grid">
          <div class="content-left">
            <h2 class="bottom-title">A complete platform to listen to music everywhere</h2>
            <p class="bottom-description">
              Experience music like never before with Hibiki's comprehensive platform. 
              Stream, discover, and enjoy your favorite tracks across all your devices.
            </p>
            <div class="features-list">
              <div class="feature-item">
                <div class="feature-icon">♫</div>
                <span>High Quality Audio</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">⌨</div>
                <span>Cross-Platform Sync</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">☊</div>
                <span>Personalized Playlists</span>
              </div>
            </div>
          </div>
          <div class="content-right">
            <div class="geometric-shapes">
              <div class="shape shape-1"></div>
              <div class="shape shape-2"></div>
              <div class="shape shape-3"></div>
              <div class="shape shape-4"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Download Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="success-icon">✓</div>
        <h3>Download Successful!</h3>
        <p>Your Hibiki Music Guide PDF has been downloaded successfully.</p>
        <button @click="closeModal" class="modal-close-btn">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'HibikiDownloadPage',
  setup() {
    const isDownloading = ref(false)
    const showSuccessModal = ref(false)

    const downloadPDF = async () => {
      isDownloading.value = true
      
      try {
        // Simulate PDF generation and download
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Create a blob with PDF content (mock data)
        const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 58
>>
stream
BT
/F1 12 Tf
50 750 Td
(Hibiki Music Guide - Your Complete Music Experience) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000198 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
304
%%EOF`

        const blob = new Blob([pdfContent], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        
        // Create download link
        const a = document.createElement('a')
        a.href = url
        a.download = 'hibiki-music-guide.pdf'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        
        // Clean up
        window.URL.revokeObjectURL(url)
        
        showSuccessModal.value = true
      } catch (error) {
        console.error('Download failed:', error)
      } finally {
        isDownloading.value = false
      }
    }

    const closeModal = () => {
      showSuccessModal.value = false
    }

    return {
      isDownloading,
      showSuccessModal,
      downloadPDF,
      closeModal
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.download-page {
  font-family: 'Arial', sans-serif;
  background: #000000;
  color: white;
  overflow-x: hidden;
}

/* Hero Section */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle at 20% 50%, #ff5100 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, #ff5100 0%, transparent 50%),
                    radial-gradient(circle at 40% 80%, #ff5100 0%, transparent 50%);
  opacity: 0.1;
}

.hero-content {
  text-align: center;
  z-index: 2;
  max-width: 800px;
  padding: 0 20px;
}

.hibiki-logo {
  margin-bottom: 3rem;
}

.logo-text {
  font-size: 4rem;
  font-weight: 900;
  background: white;
  background-clip: text;
  display: block;
  margin-bottom: 0.5rem;
}

.logo-subtitle {
  font-size: 1.2rem;
  color: #ff5100;
  font-weight: 300;
  letter-spacing: 0.1em;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.hero-description {
  font-size: 1.2rem;
  margin-bottom: 3rem;
  opacity: 0.8;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.download-btn {
  background: linear-gradient(45deg, #ff5100, #ff7b3d);
  border: none;
  padding: 1.2rem 3rem;
  border-radius: 50px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(255, 81, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.download-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(255, 81, 0, 0.4);
}

.download-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.download-icon {
  width: 24px;
  height: 24px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.download-info {
  margin-top: 1.5rem;
  opacity: 0.6;
  font-size: 0.9rem;
}

/* Floating Elements */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.music-note {
  position: absolute;
  font-size: 2rem;
  color: #ff5100;
  opacity: 0.3;
  animation: float 6s ease-in-out infinite;
}

.note-1 { top: 20%; left: 10%; animation-delay: 0s; }
.note-2 { top: 60%; right: 15%; animation-delay: 1s; }
.note-3 { top: 30%; left: 80%; animation-delay: 2s; }
.note-4 { bottom: 30%; left: 20%; animation-delay: 3s; }
.note-5 { bottom: 40%; right: 25%; animation-delay: 4s; }

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Features Section */
.features {
  padding: 5rem 0;
  background: #111111;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 700;
}

.section-subtitle {
  text-align: center;
  font-size: 1.1rem;
  opacity: 0.8;
  margin-bottom: 3rem;
}

.app-downloads {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.app-btn {
  display: block;
  transition: transform 0.3s ease;
}

.app-btn:hover {
  transform: scale(1.05);
}

.app-btn img {
  height: 50px;
  width: auto;
}

/* Bottom Section */
.bottom-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #ff5100 0%, #ff7b3d 100%);
  position: relative;
  overflow: hidden;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.bottom-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: white;
}

.bottom-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  font-weight: 500;
}

.feature-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Geometric Shapes */
.geometric-shapes {
  position: relative;
  height: 400px;
  width: 100%;
}

.shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  animation: float 8s ease-in-out infinite;
}

.shape-1 {
  width: 120px;
  height: 120px;
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.shape-2 {
  width: 80px;
  height: 80px;
  top: 60%;
  right: 30%;
  animation-delay: 1s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 10%;
  animation-delay: 2s;
}

.shape-4 {
  width: 60px;
  height: 60px;
  top: 10%;
  right: 10%;
  animation-delay: 3s;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #1a1a1a;
  padding: 3rem;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  border: 2px solid #ff5100;
}

.success-icon {
  font-size: 4rem;
  color: #ff5100;
  margin-bottom: 1rem;
}

.modal-content h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.modal-content p {
  margin-bottom: 2rem;
  opacity: 0.8;
}

.modal-close-btn {
  background: #ff5100;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 25px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-close-btn:hover {
  background: #ff7b3d;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .logo-text {
    font-size: 2.5rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .bottom-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .app-downloads {
    flex-direction: column;
    align-items: center;
  }
}
</style>