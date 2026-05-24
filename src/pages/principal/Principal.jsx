import './principal.css'; // Tu archivo CSS original

function Principal({ usuarioLogueado }) {
  const estaLogueado = !!usuarioLogueado;

  return (
    <>
      {/* BANNER */}
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

      {/* SECCIÓN CATEGORÍAS */}
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
            {/* Aquí puedes mapear un array de categorías para no repetir tanto HTML */}
            <CategoriaItem titulo="Novela negra, thriller o suspense." img="../../assets/principal/thriller.jpg" />
            <CategoriaItem titulo="Novela histórica." img="historica.jpg" />
            {/* ... resto de categorías */}
          </div>
        </div>
      </section>
    </>
  );
}

// Sub-componente para limpiar el código de las tarjetas
function CategoriaItem({ titulo, img }) {
  return (
    <div className="col-12 col-sm-6">
      <article className="category-card h-100">
        <img src={`img/index/${img}`} alt={titulo} className="img-fluid category-image" />
        <h3 className="category-title">{titulo}</h3>
      </article>
    </div>
  );
}

export default Principal;