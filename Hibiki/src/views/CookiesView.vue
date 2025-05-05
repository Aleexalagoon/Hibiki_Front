<template>
  <div class="cookies-policy">
    <header class="cookies-header">
      <div class="logo-container">
        <div class="logo">
          <span class="logo-text">H</span>
        </div>
      </div>
      <h1>Cookies Policy - Hibiki</h1>
      <div class="header-line"></div>
    </header>

    <section class="content">
      <p class="intro">
        This policy explains how <span class="highlight">Hibiki</span> uses cookies and similar technologies to enhance your experience when using our music streaming application. By using Hibiki, you agree to the use of cookies in accordance with this policy.
      </p>

      <div class="policy-card">
        <h2><span class="number">01</span> What are cookies?</h2>
        <div class="card-content">
          <p>
            Cookies are small text files that are stored on your device when you visit a website or use an application. Cookies allow the application to recognize your device and remember your preferences or actions over a period of time.
          </p>
        </div>
      </div>

      <div class="policy-card">
        <h2><span class="number">02</span> Types of cookies we use</h2>
        <div class="card-content">
          <p>
            At Hibiki, we use the following types of cookies:
          </p>
          <ul>
            <li><strong class="highlight-text">Essential cookies:</strong> These are necessary for the basic operation of the app, such as user authentication and session management.</li>
            <li><strong class="highlight-text">Performance cookies:</strong> These help us analyze app usage and improve performance, such as tracking load times and user behavior.</li>
            <li><strong class="highlight-text">Functionality cookies:</strong> These allow the app to remember your preferences and choices, like language and display settings.</li>
            <li><strong class="highlight-text">Advertising and marketing cookies:</strong> We use these to show you more relevant ads and measure the effectiveness of advertising campaigns.</li>
          </ul>
        </div>
      </div>

      <div class="policy-card">
        <h2><span class="number">03</span> How can you control cookies?</h2>
        <div class="card-content">
          <p>
            You have the right to decide whether to accept cookies. You can manage your cookie preferences through your device or browser settings. Most browsers allow you to control cookies via their settings, where you can block or delete them.
          </p>
          <p>
            Keep in mind that disabling cookies may cause some features of the app to be unavailable or not function properly.
          </p>
        </div>
      </div>

      <div class="policy-card">
        <h2><span class="number">04</span> Third-party cookies</h2>
        <div class="card-content">
          <p>
            In some cases, we allow third parties (such as analytics providers, social media, or advertising platforms) to use cookies in our app. These cookies are managed by third parties and are subject to their own privacy and cookie policies.
          </p>
        </div>
      </div>

      <div class="policy-card">
        <h2><span class="number">05</span> Changes to the cookies policy</h2>
        <div class="card-content">
          <p>
            We may update this cookies policy from time to time to reflect changes in our cookie practices. We will notify you of any significant changes through the app or via email.
          </p>
        </div>
      </div>

      <div class="policy-card">
        <h2><span class="number">06</span> Contact</h2>
        <div class="card-content">
          <p>
            If you have any questions about our cookies policy, feel free to contact us at soporte@hibiki.com.
          </p>
        </div>
      </div>
    </section>

    <footer class="cookies-footer">
      <div class="footer-line"></div>
      <div class="contact-info">
        <p>Thank you for using Hibiki.</p>
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

.cookies-policy {
  background-color: #121212;
  color: #e0e0e0;
  padding: 40px 20px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.cookies-header {
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

.cookies-header h1 {
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

.cookies-footer {
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
  .cookies-policy {
    padding: 20px 15px;
  }

  .cookies-header h1 {
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