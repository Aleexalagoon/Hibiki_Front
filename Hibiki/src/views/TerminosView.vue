<template>
  <div class="terms-conditions">
    <header class="terms-header">
      <div class="logo-container">
        <div class="logo">
          <span class="logo-text">H</span>
        </div>
      </div>
      <h1>Terms and Conditions - Hibiki</h1>
      <div class="header-line"></div>
    </header>

    <section class="content">
      <p class="intro">
        Welcome to <span class="highlight">Hibiki</span>. By accessing or using our application, you agree to the following terms and conditions. If you do not agree with these terms, you should not use the application.
      </p>

      <div class="term-card">
        <h2><span class="number">01</span> Use of the Application</h2>
        <div class="card-content">
          <p>
            Hibiki is a streaming music platform that allows you to listen to music online. By using our services, you agree not to:
          </p>
          <ul>
            <li>Violate any applicable laws or regulations.</li>
            <li>Distribute, reproduce, or modify the content of the application without proper authorization.</li>
            <li>Engage in activities that may interfere with the operation of the application or its servers.</li>
          </ul>
        </div>
      </div>

      <div class="term-card">
        <h2><span class="number">02</span> User Account</h2>
        <div class="card-content">
          <p>
            To use Hibiki, you need to create an account. You are responsible for maintaining the confidentiality of your account and password. Additionally, you are responsible for all activities that occur under your account. Make sure to provide accurate and up-to-date information.
          </p>
        </div>
      </div>

      <div class="term-card">
        <h2><span class="number">03</span> Subscription and Payments</h2>
        <div class="card-content">
          <p>
            Hibiki offers monthly and yearly subscription plans. By subscribing to our paid services, you agree to the recurring charges based on the plan you select. You can cancel your subscription at any time through your account settings.
          </p>
        </div>
      </div>

      <div class="term-card">
        <h2><span class="number">04</span> Intellectual Property</h2>
        <div class="card-content">
          <p>
            All content available on Hibiki, including music, images, logos, and software, is the property of Hibiki or its licensors and is protected by copyright and other intellectual property laws. You may not copy, distribute, or reproduce any content without authorization.
          </p>
        </div>
      </div>

      <div class="term-card">
        <h2><span class="number">05</span> Privacy</h2>
        <div class="card-content">
          <p>
            Your privacy is important to us. The collection, use, and protection of your personal information are governed by our <a href="/privacy" class="privacy-link">Privacy Policy</a>.
          </p>
        </div>
      </div>

      <div class="term-card">
        <h2><span class="number">06</span> Account Termination</h2>
        <div class="card-content">
          <p>
            We may suspend or terminate your account at any time if we believe you have violated these terms or if your use of the application is deemed inappropriate. In the event of termination, your access to the application will be revoked, and you will not be able to recover any content or subscriptions associated with your account.
          </p>
        </div>
      </div>

      <div class="term-card">
        <h2><span class="number">07</span> Liability</h2>
        <div class="card-content">
          <p>
            Hibiki is not responsible for any direct, indirect, incidental, special, or consequential damages that may result from the use of the application, including but not limited to data loss, service interruption, or any other damage related to accessing or using the application.
          </p>
        </div>
      </div>

      <div class="term-card">
        <h2><span class="number">08</span> Changes to the Terms</h2>
        <div class="card-content">
          <p>
            We reserve the right to modify these terms at any time. Changes will be effective when posted in the application or otherwise notified to you. By continuing to use the application after such changes, you agree to the new terms.
          </p>
        </div>
      </div>

      <div class="term-card">
        <h2><span class="number">09</span> Governing Law</h2>
        <div class="card-content">
          <p>
            These terms will be governed by the laws of the country in which Hibiki operates. Any dispute arising from these terms will be resolved in the competent courts of that jurisdiction.
          </p>
        </div>
      </div>
    </section>

    <footer class="terms-footer">
      <div class="footer-line"></div>
      <div class="contact-info">
        <p>If you have any questions or concerns about our Terms and Conditions, you can contact us at:</p>
        <a href="mailto:support@hibiki.com" class="email-link">support@hibiki.com</a>
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

.terms-conditions {
  background-color: #121212;
  color: #e0e0e0;
  padding: 40px 20px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.terms-header {
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

.terms-header h1 {
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

.term-card {
  background-color: #1e1e1e;
  border-radius: 10px;
  margin-bottom: 30px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  border-left: 3px solid #ff5100;
  transition: transform 0.3s, box-shadow 0.3s;
}

.term-card:hover {
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

a.privacy-link {
  color: #ff8800;
  text-decoration: none;
  border-bottom: 1px dotted #ff8800;
  transition: color 0.3s;
}

a.privacy-link:hover {
  color: #ff5100;
}

.terms-footer {
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
  .terms-conditions {
    padding: 20px 15px;
  }

  .terms-header h1 {
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