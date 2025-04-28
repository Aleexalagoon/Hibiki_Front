<template>
  <div class="privacy-policy">
    <header class="privacy-header">
      <div class="logo-container">
        <div class="logo">
          <span class="logo-text">H</span>
        </div>
      </div>
      <h1>Política de Privacidad - Hibiki</h1>
      <div class="header-line"></div>
    </header>

    <section class="content">
      <p class="intro">
        En <span class="highlight">Hibiki</span>, nos comprometemos a proteger tu privacidad. Esta política de privacidad explica cómo recopilamos, usamos, compartimos y protegemos tus datos personales cuando usas nuestra aplicación de música en streaming.
      </p>

      <div class="policy-card">
        <h2><span class="number">01</span> Información que recopilamos</h2>
        <div class="card-content">
          <p>
            Recopilamos diferentes tipos de información cuando usas nuestra aplicación, incluyendo:
          </p>
          <ul>
            <li><strong class="highlight-text">Información personal:</strong> Cuando te registras en Hibiki, recopilamos tu nombre, dirección de correo electrónico y detalles de pago.</li>
            <li><strong class="highlight-text">Datos de uso:</strong> Recopilamos información sobre cómo interactúas con la aplicación, como las canciones que escuchas, tus listas de reproducción y tus preferencias.</li>
            <li><strong class="highlight-text">Información de dispositivo:</strong> Recopilamos detalles del dispositivo que usas para acceder a Hibiki, como el modelo, sistema operativo, dirección IP y tipo de navegador.</li>
          </ul>
        </div>
      </div>

      <div class="policy-card">
        <h2><span class="number">02</span> Cómo usamos la información</h2>
        <div class="card-content">
          <p>
            Usamos la información recopilada para los siguientes fines:
          </p>
          <ul>
            <li>Personalizar tu experiencia y mostrarte contenido relevante.</li>
            <li>Mejorar nuestros servicios y la calidad de la app.</li>
            <li>Procesar pagos y suscripciones.</li>
            <li>Comunicarte sobre actualizaciones de la aplicación, nuevas funciones y promociones.</li>
          </ul>
        </div>
      </div>

      <div class="policy-card">
        <h2><span class="number">03</span> Compartir tu información</h2>
        <div class="card-content">
          <p>
            No vendemos ni compartimos tu información personal con terceros, excepto en los siguientes casos:
          </p>
          <ul>
            <li>Proveedores de servicios que nos ayudan a operar la aplicación (por ejemplo, procesadores de pagos, servicios de almacenamiento en la nube).</li>
            <li>Para cumplir con obligaciones legales, como cuando lo exigen las autoridades gubernamentales.</li>
          </ul>
        </div>
      </div>

      <div class="policy-card">
        <h2><span class="number">04</span> Seguridad de la información</h2>
        <div class="card-content">
          <p>
            Implementamos medidas de seguridad para proteger tus datos personales, pero no podemos garantizar una seguridad absoluta en línea. Te recomendamos que tomes precauciones al usar la aplicación y protejas tu cuenta con una contraseña segura.
          </p>
        </div>
      </div>

      <div class="policy-card">
        <h2><span class="number">05</span> Tus derechos</h2>
        <div class="card-content">
          <p>
            Tienes derecho a acceder, corregir o eliminar tus datos personales. Para hacerlo, puedes ponerte en contacto con nosotros a través de los canales de soporte disponibles en la app.
          </p>
        </div>
      </div>

      <div class="policy-card">
        <h2><span class="number">06</span> Cambios en esta política</h2>
        <div class="card-content">
          <p>
            Esta política de privacidad puede actualizarse de vez en cuando. Te notificaremos sobre cualquier cambio importante a través de la aplicación o por correo electrónico.
          </p>
        </div>
      </div>
    </section>

    <footer class="privacy-footer">
      <div class="footer-line"></div>
      <div class="contact-info">
        <p>Si tienes alguna pregunta sobre nuestra política de privacidad, contáctanos en:</p>
        <a href="mailto:soporte@hibiki.com" class="email-link">soporte@hibiki.com</a>
      </div>
      <div class="copyright">
        <p>&copy; 2025 Hibiki. Todos los derechos reservados.</p>
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