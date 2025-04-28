<template>
  <div class="cookies-policy">
    <header class="cookies-header">
      <div class="logo-container">
        <div class="logo">
          <span class="logo-text">H</span>
        </div>
      </div>
      <h1>Política de Cookies - Hibiki</h1>
      <div class="header-line"></div>
    </header>

    <section class="content">
      <p class="intro">
        Esta política explica cómo <span class="highlight">Hibiki</span> utiliza cookies y tecnologías similares para mejorar tu experiencia al utilizar nuestra aplicación de música en streaming. Al usar Hibiki, aceptas el uso de cookies de acuerdo con esta política.
      </p>

      <div class="policy-card">
        <h2><span class="number">01</span> ¿Qué son las cookies?</h2>
        <div class="card-content">
          <p>
            Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas una página web o usas una aplicación. Las cookies permiten a la aplicación reconocer tu dispositivo y recordar tus preferencias o acciones durante un periodo de tiempo.
          </p>
        </div>
      </div>

      <div class="policy-card">
        <h2><span class="number">02</span> Tipos de cookies que usamos</h2>
        <div class="card-content">
          <p>
            En Hibiki, usamos los siguientes tipos de cookies:
          </p>
          <ul>
            <li><strong class="highlight-text">Cookies esenciales:</strong> Son necesarias para el funcionamiento básico de la aplicación, como la autenticación de usuario y la gestión de sesiones.</li>
            <li><strong class="highlight-text">Cookies de rendimiento:</strong> Nos ayudan a analizar el uso de la aplicación y mejorar su rendimiento, como el seguimiento de la velocidad de carga y el comportamiento de los usuarios.</li>
            <li><strong class="highlight-text">Cookies de funcionalidad:</strong> Estas cookies permiten que la aplicación recuerde tus preferencias y opciones, como el idioma y las configuraciones de visualización.</li>
            <li><strong class="highlight-text">Cookies de publicidad y marketing:</strong> Utilizamos estas cookies para mostrarte anuncios más relevantes y medir la efectividad de las campañas publicitarias.</li>
          </ul>
        </div>
      </div>

      <div class="policy-card">
        <h2><span class="number">03</span> ¿Cómo puedes controlar las cookies?</h2>
        <div class="card-content">
          <p>
            Tienes el derecho de decidir si aceptas o no las cookies. Puedes gestionar tus preferencias de cookies a través de las opciones de configuración de tu dispositivo o navegador. La mayoría de los navegadores permiten controlar las cookies a través de sus opciones de configuración, donde puedes bloquear o eliminar las cookies.
          </p>
          <p>
            Ten en cuenta que si decides deshabilitar las cookies, algunas funcionalidades de la aplicación pueden no estar disponibles o no funcionar correctamente.
          </p>
        </div>
      </div>

      <div class="policy-card">
        <h2><span class="number">04</span> Cookies de terceros</h2>
        <div class="card-content">
          <p>
            En algunos casos, permitimos que terceros (como proveedores de servicios de análisis, redes sociales o plataformas publicitarias) utilicen cookies en nuestra aplicación. Estas cookies son gestionadas por terceros y están sujetas a sus propias políticas de privacidad y cookies.
          </p>
        </div>
      </div>

      <div class="policy-card">
        <h2><span class="number">05</span> Cambios en la política de cookies</h2>
        <div class="card-content">
          <p>
            Podemos actualizar esta política de cookies de vez en cuando para reflejar cambios en nuestras prácticas de cookies. Te notificaremos de los cambios importantes a través de la aplicación o por correo electrónico.
          </p>
        </div>
      </div>

      <div class="policy-card">
        <h2><span class="number">06</span> Contacto</h2>
        <div class="card-content">
          <p>
            Si tienes alguna pregunta sobre nuestra política de cookies, no dudes en contactarnos en soporte@hibiki.com.
          </p>
        </div>
      </div>
    </section>

    <footer class="cookies-footer">
      <div class="footer-line"></div>
      <div class="contact-info">
        <p>Gracias por utilizar Hibiki.</p>
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