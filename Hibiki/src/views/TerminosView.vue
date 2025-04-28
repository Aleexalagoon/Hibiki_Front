<template>
  <div class="terms-conditions">
    <header class="terms-header">
      <div class="logo-container">
        <div class="logo">
          <span class="logo-text">H</span>
        </div>
      </div>
      <h1>Términos y Condiciones - Hibiki</h1>
      <div class="header-line"></div>
    </header>

    <section class="content">
      <p class="intro">
        Bienvenido a <span class="highlight">Hibiki</span>. Al acceder o utilizar nuestra aplicación, aceptas los siguientes términos y condiciones. Si no estás de acuerdo con estos términos, no debes usar la aplicación.
      </p>

      <div class="term-card">
        <h2><span class="number">01</span> Uso de la Aplicación</h2>
        <div class="card-content">
          <p>
            Hibiki es una plataforma de música en streaming que te permite escuchar música en línea. Al usar nuestros servicios, te comprometes a no:
          </p>
          <ul>
            <li>Violar cualquier ley o regulación aplicable.</li>
            <li>Distribuir, reproducir o modificar el contenido de la aplicación sin el permiso adecuado.</li>
            <li>Realizar actividades que puedan interferir con el funcionamiento de la aplicación o sus servidores.</li>
          </ul>
        </div>
      </div>

      <div class="term-card">
        <h2><span class="number">02</span> Cuenta de Usuario</h2>
        <div class="card-content">
          <p>
            Para utilizar Hibiki, necesitas crear una cuenta. Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. Además, eres responsable de todas las actividades que ocurran bajo tu cuenta. Asegúrate de proporcionar información precisa y actualizada.
          </p>
        </div>
      </div>

      <div class="term-card">
        <h2><span class="number">03</span> Suscripción y Pagos</h2>
        <div class="card-content">
          <p>
            Hibiki ofrece planes de suscripción mensuales y anuales. Al suscribirte a nuestros servicios de pago, aceptas los cargos recurrentes según el plan que selecciones. Puedes cancelar tu suscripción en cualquier momento a través de la configuración de la cuenta.
          </p>
        </div>
      </div>

      <div class="term-card">
        <h2><span class="number">04</span> Propiedad Intelectual</h2>
        <div class="card-content">
          <p>
            Todo el contenido disponible en Hibiki, incluyendo música, imágenes, logotipos y software, es propiedad de Hibiki o de sus licenciantes y está protegido por derechos de autor y otras leyes de propiedad intelectual. No debes copiar, distribuir ni reproducir ningún contenido sin autorización.
          </p>
        </div>
      </div>

      <div class="term-card">
        <h2><span class="number">05</span> Privacidad</h2>
        <div class="card-content">
          <p>
            Tu privacidad es importante para nosotros. La recopilación, uso y protección de tu información personal está regida por nuestra <a href="/politica" class="privacy-link">Política de Privacidad</a>.
          </p>
        </div>
      </div>

      <div class="term-card">
        <h2><span class="number">06</span> Terminación de la Cuenta</h2>
        <div class="card-content">
          <p>
            Podemos suspender o terminar tu cuenta en cualquier momento si consideramos que has violado estos términos o si se determina que tu uso de la aplicación es inapropiado. En caso de terminación, tu acceso a la aplicación será revocado y no podrás recuperar ningún contenido o suscripción asociada con tu cuenta.
          </p>
        </div>
      </div>

      <div class="term-card">
        <h2><span class="number">07</span> Responsabilidad</h2>
        <div class="card-content">
          <p>
            Hibiki no se hace responsable por cualquier daño directo, indirecto, incidental, especial o consecuente que pueda resultar del uso de la aplicación, incluyendo, pero no limitado a, la pérdida de datos, interrupción del servicio o cualquier otro daño relacionado con el acceso o uso de la aplicación.
          </p>
        </div>
      </div>

      <div class="term-card">
        <h2><span class="number">08</span> Cambios en los Términos</h2>
        <div class="card-content">
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán efectivos cuando se publiquen en la aplicación o se te notifique de alguna manera. Al continuar usando la aplicación después de esos cambios, aceptas los nuevos términos.
          </p>
        </div>
      </div>

      <div class="term-card">
        <h2><span class="number">09</span> Ley Aplicable</h2>
        <div class="card-content">
          <p>
            Estos términos estarán regidos por las leyes del país en el que Hibiki opera. Cualquier disputa que surja de estos términos será resuelta ante los tribunales competentes de esa jurisdicción.
          </p>
        </div>
      </div>
    </section>

    <footer class="terms-footer">
      <div class="footer-line"></div>
      <div class="contact-info">
        <p>Si tienes alguna pregunta o inquietud acerca de nuestros Términos y Condiciones, puedes contactarnos en:</p>
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