import './principal.css';
import CategoriaItem from '../../components/Cprincipal/CategoriaItem';

import thrillerImg from '../../assets/principal/thriller.jpg';
import historicaImg from '../../assets/principal/historica.jpg';

function Principal({ usuarioLogueado }) {
  const estaLogueado = !!usuarioLogueado;

  return (
    <>
      <section className="banner d-flex align-items-center justify-content-center text-center">
        <div className="banner-overlay"></div>
        <div className="container banner-content position-relative">
          <h1 className="display-5 display-sm-4 fw-bold mb-3">
            {estaLogueado 
              ? `Bienvenid@ de nuevo, ${usuarioLogueado.nombre}` 
              : "Bienvenido a Biblio+"}
          </h1>
          <p className="banner-text mb-0">"El conocimiento está al alcance de tus manos"</p>
        </div>
      </section>

      <section className="categories-section py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10">
              <div className="intro-text text-center">
                <p className="mb-0">
                  <strong>"En Biblio+, nuestra misión es derribar las barreras..."</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="text-center section-title-wrap">
            <h2 className="section-title mb-0">CATEGORÍAS</h2>
          </div>

          <div className="row g-4">
            <CategoriaItem titulo="Novela negra, thriller o suspense." img={thrillerImg} />
            <CategoriaItem titulo="Novela histórica." img={historicaImg} />
          </div>
        </div>
      </section>
    </>
  );
}

export default Principal;