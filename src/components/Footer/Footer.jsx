import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footerTop">
        <div className="footerContainer">
          <div className="footerGrid">
            <div className="footerCol">
              <h4>CONTENIDO EXTRA</h4>
              <ul>
                <li><a href="#">Selecciones Editoriales</a></li>
                <li><a href="#">Reviews</a></li>
                <li><a href="#">Más solicitados</a></li>
              </ul>
            </div>

            <div className="footerCol">
              <h4>SOBRE NOSOTROS</h4>
              <ul>
                <li><a href="#">Conócenos</a></li>
                <li><a href="#">Preguntas frecuentes</a></li>
              </ul>
            </div>

            <div className="footerCol">
              <h4>CONTÁCTANOS</h4>
              <ul>
                <li><a href="#">Correo: BiblioPlus@gmail.com</a></li>
                <li><a href="#">Tel: 445 123 3465</a></li>
              </ul>
            </div>

            <div className="footerBrand">
              <div className="footerLogoName">Biblio+</div>
              <div className="footerLogoSub">MÉXICO</div>
            </div>
          </div>
        </div>
      </div>

      <div className="footerBottom">
        <div className="footerContainer footerBottomRow">
          <div className="footerGroup">
            <div className="footerGroupName">Biblio+</div>
            <div className="footerCopyright">Copyright © 2026 Biblio+. Todos los derechos reservados.</div>
          </div>

          <nav className="footerLegal" aria-label="Enlaces legales">
            <a href="#">Mapa del sitio</a>
            <span className="footerSep">|</span>
            <a href="#">Condiciones de uso</a>
            <span className="footerSep">|</span>
            <a href="#">Política de cookies</a>
            <span className="footerSep">|</span>
            <a href="#">Política de privacidad</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;