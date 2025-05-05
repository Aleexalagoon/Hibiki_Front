<template>
  <div class="privacy-policy">
    <header class="privacy-header">
      <div class="logo-container">
        <div class="logo">
          <span class="logo-text">H</span>
        </div>
      </div>
      <h1>Privacy Policy - Hibiki</h1>
      <div class="header-line"></div>
    </header>

    <section class="content">
      <p class="intro">
        At <span class="highlight">Hibiki</span>, we are committed to protecting your privacy. This privacy policy explains how we collect, use, share, and protect your personal data when you use our music streaming app.
      </p>

      <div class="policy-card">
        <h2><span class="number">01</span> Information We Collect</h2>
        <div class="card-content">
          <p>
            We collect different types of information when you use our app, including:
          </p>
          <ul>
            <li><strong class="highlight-text">Personal Information:</strong> When you sign up for Hibiki, we collect your name, email address, and payment details.</li>
            <li><strong class="highlight-text">Usage Data:</strong> We collect information about how you interact with the app, such as the songs you listen to, your playlists, and your preferences.</li>
            <li><strong class="highlight-text">Device Information:</strong> We collect details about the device you use to access Hibiki, such as model, operating system, IP address, and browser type.</li>
          </ul>
        </div>
      </div>

      <div class="policy-card">
        <h2><span class="number">02</span> How We Use the Information</h2>
        <div class="card-content">
          <p>
            We use the collected information for the following purposes:
          </p>
          <ul>
            <li>Personalize your experience and show you relevant content.</li>
            <li>Improve our services and app quality.</li>
            <li>Process payments and subscriptions.</li>
            <li>Communicate with you about app updates, new features, and promotions.</li>
          </ul>
        </div>
      </div>

      <div class="policy-card">
        <h2><span class="number">03</span> Sharing Your Information</h2>
        <div class="card-content">
          <p>
            We do not sell or share your personal information with third parties, except in the following cases:
          </p>
          <ul>
            <li>Service providers who help us operate the app (e.g., payment processors, cloud storage services).</li>
            <li>To comply with legal obligations, such as when required by government authorities.</li>
          </ul>
        </div>
      </div>

      <div class="policy-card">
        <h2><span class="number">04</span> Information Security</h2>
        <div class="card-content">
          <p>
            We implement security measures to protect your personal data, but we cannot guarantee absolute online security. We recommend that you take precautions when using the app and protect your account with a strong password.
          </p>
        </div>
      </div>

      <div class="policy-card">
        <h2><span class="number">05</span> Your Rights</h2>
        <div class="card-content">
          <p>
            You have the right to access, correct, or delete your personal data. To do so, you can contact us through the support channels available in the app.
          </p>
        </div>
      </div>

      <div class="policy-card">
        <h2><span class="number">06</span> Changes to This Policy</h2>
        <div class="card-content">
          <p>
            This privacy policy may be updated from time to time. We will notify you about any important changes through the app or by email.
          </p>
        </div>
      </div>
    </section>

    <footer class="privacy-footer">
      <div class="footer-line"></div>
      <div class="contact-info">
        <p>If you have any questions about our privacy policy, contact us at:</p>
        <a href="mailto:soporte@hibiki.com" class="email-link">soporte@hibiki.com</a>
      </div>
      <div class="copyright">
        <p>&copy; 2025 Hibiki. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>


<style scoped>
body {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #121212;
  color: #e0e0e0;
}

.privacy-policy {
  background-color: #121212;
  color: #e0e0e0;
  padding: 40px 20px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.privacy-header {
  text-align: center;
  margin-bottom: 50px;
  padding-bottom: 20px;
  position: relative;
}

.logo-container {
  margin-bottom: 20px;
}

.logo {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ff5100, #ff8800);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 4px 10px rgba(255, 81, 0, 0.3);
}

.logo-text {
  font-size: 32px;
  font-weight: bold;
  color: #000;
}

.privacy-header h1 {
  font-size: 36px;
  color: #ffffff;
  margin-top: 20px;
  font-weight: 300;
  letter-spacing: 1px;
}

.header-line {
  height: 3px;
  width: 100px;
  background: linear-gradient(to right, #ff5100, #ff8800);
  margin: 20px auto;
  border-radius: 2px;
}

.content {
  line-height: 1.8;
}

.intro {
  font-size: 18px;
  margin-bottom: 40px;
  padding: 0 20px;
  text-align: center;
}

.highlight {
  color: #ff5100;
  font-weight: bold;
}

.highlight-text {
  color: #ff8800;
}

.policy-card {
  background-color: #1e1e1e;
  border-radius: 10px;
  margin-bottom: 30px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  border-left: 3px solid #ff5100;
  transition: transform 0.3s, box-shadow 0.3s;
}

.policy-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
}

h2 {
  font-size: 24px;
  color: #ffffff;
  margin-top: 10px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  font-weight: 400;
}

.number {
  color: #ff5100;
  font-size: 20px;
  font-weight: bold;
  margin-right: 15px;
  background: rgba(255, 81, 0, 0.1);
  padding: 5px 10px;
  border-radius: 5px;
}

.card-content {
  padding-left: 50px;
}

ul {
  list-style-type: none;
  padding-left: 10px;
}

ul li {
  position: relative;
  padding-left: 25px;
  margin-bottom: 10px;
}

ul li:before {
  content: "•";
  position: absolute;
  left: 0;
  color: #ff5100;
  font-size: 20px;
}

.privacy-footer {
  text-align: center;
  margin-top: 60px;
  padding-top: 30px;
}

.footer-line {
  height: 1px;
  width: 100%;
  background: linear-gradient(to right, transparent, #ff5100, transparent);
  margin-bottom: 30px;
}

.contact-info {
  margin-bottom: 30px;
}

.email-link {
  display: inline-block;
  color: #ff5100;
  text-decoration: none;
  font-weight: bold;
  padding: 10px 20px;
  border: 1px solid #ff5100;
  border-radius: 30px;
  transition: all 0.3s;
}

.email-link:hover {
  background-color: rgba(255, 81, 0, 0.1);
  box-shadow: 0 0 10px rgba(255, 81, 0, 0.5);
}

.copyright {
  margin-top: 30px;
  font-size: 14px;
  color: #888;
}

@media (max-width: 768px) {
  .privacy-policy {
    padding: 20px 15px;
  }

  .privacy-header h1 {
    font-size: 28px;
  }

  h2 {
    font-size: 20px;
  }

  .card-content {
    padding-left: 30px;
  }

  .intro {
    font-size: 16px;
    padding: 0 10px;
  }
}
</style>