import { Link } from "react-router-dom";

const formaTrabajo = [
  {
    titulo: "Atención a clientes",
    descripcion: "Recibimos y gestionamos solicitudes de entrega de gas.",
  },
  {
    titulo: "Despacho a domicilio",
    descripcion:
      "Los repartidores realizan las entregas en Chillán y comunas aledañas.",
  },
  {
    titulo: "Control de stock",
    descripcion:
      "La administradora supervisa la disponibilidad de los cilindros.",
  },
];

function Nosotros() {
  return (
    <main id="contenido">
      <section className="hero-volcan">
        <div className="container">
          <span className="d-inline-block text-uppercase fw-semibold small mb-3 text-warning">
            Conoce nuestra empresa
          </span>
          <h1 className="display-4 fw-bold mb-3">Distribuidora de Gas El Volcán</h1>
          <p className="lead mb-0 col-lg-9">
            Somos una empresa familiar ubicada en Chillán, Región de Ñuble,
            fundada en 1998. Nos dedicamos a la distribución de gas licuado a
            domicilio para clientes residenciales y comerciales de Chillán y
            comunas aledañas.
          </p>
        </div>
      </section>

      <section className="container py-5" aria-label="Nuestra empresa y servicios">
        <div className="row g-4">
          <div className="col-12 col-lg-6">
            <article className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4 p-lg-5">
                <span className="badge rounded-pill text-bg-light border mb-3">
                  Nuestra historia
                </span>
                <h2 className="h3 mb-3">¿Quiénes somos?</h2>
                <p className="mb-0">
                  Distribuidora Gas El Volcán cuenta con 2 camiones de reparto,
                  3 repartidores, 1 operadora de llamadas y 1 administradora. La
                  empresa atiende entre 80 y 120 pedidos por día.
                </p>
              </div>
            </article>
          </div>

          <div className="col-12 col-lg-6">
            <article className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4 p-lg-5 d-flex flex-column align-items-start">
                <span className="badge rounded-pill text-bg-light border mb-3">
                  Nuestros productos
                </span>
                <h2 className="h3 mb-3">¿Qué ofrecemos?</h2>
                <p>
                  Distribuimos cilindros de gas licuado de 5, 11 y 15 kg para
                  clientes residenciales y comerciales.
                </p>
                <Link className="btn btn-outline-dark mt-auto" to="/catalogo">
                  Conocer el catálogo <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-body-tertiary py-5">
        <div className="container">
          <div className="mb-4 mb-lg-5">
            <span className="d-inline-block text-uppercase fw-semibold small text-secondary mb-2">
              Así trabajamos
            </span>
            <h2 className="display-6 fw-bold mb-2">Nuestra forma de trabajo</h2>
            <p className="text-body-secondary mb-0">
              Conoce cómo gestionamos las solicitudes, las entregas y el stock.
            </p>
          </div>

          <div className="row g-4">
            {formaTrabajo.map((paso, indice) => (
              <div className="col-12 col-md-6 col-lg-4" key={paso.titulo}>
                <article className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <span className="badge rounded-pill text-bg-dark mb-3">
                      Paso {indice + 1}
                    </span>
                    <h3 className="h5">{paso.titulo}</h3>
                    <p className="text-body-secondary mb-0">{paso.descripcion}</p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row align-items-center g-4 g-lg-5">
          <div className="col-12 col-lg-8">
            <span className="d-inline-block text-uppercase fw-semibold small text-secondary mb-2">
              Seguimos avanzando
            </span>
            <h2 className="display-6 fw-bold mb-3">
              ¿Por qué estamos modernizando el servicio?
            </h2>
            <p className="mb-4">
              Actualmente los pedidos y el control de stock se gestionan de
              forma manual. Nuestro proyecto busca facilitar los pedidos sin
              llamadas, permitir que los clientes conozcan el estado de su
              entrega y mejorar la gestión de pedidos y stock.
            </p>
            <Link className="btn btn-dark" to="/catalogo">
              Ver catálogo <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm text-center h-100">
              <div className="card-body p-4 p-lg-5 d-flex flex-column justify-content-center">
                <span className="text-uppercase small fw-semibold text-body-secondary">
                  Fundada en
                </span>
                <p className="display-2 fw-bold mb-1">1998</p>
                <p className="mb-0">Empresa familiar de Chillán, Región de Ñuble.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Nosotros;
