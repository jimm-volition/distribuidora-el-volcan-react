import { Link } from "react-router-dom";

function PiePagina() {
  return (
    <footer className="footer-volcan py-4">
      <div className="container">
        <div className="row g-4">
          <section className="col-12 col-md-5">
            <h3 className="h5">Distribuidora de Gas El Volcán</h3>
            <p>Despacho de gas licuado a domicilio en Chillán y Ñuble. Fundada en 1998.</p>
            <address className="mb-1">
              Contacto: <a href="mailto:contacto@gaselvolcan.cl">contacto@gaselvolcan.cl</a>
            </address>
            <p>Fono: <a href="tel:+56987654321">+56 9 8765 4321</a></p>
          </section>
          <section className="col-6 col-md-3">
            <h3 className="h5">Navegación</h3>
            <ul className="list-unstyled">
              <li><Link to="/catalogo">Catálogo</Link></li>
              <li><Link to="/pedido">Pedido</Link></li>
              <li><Link to="/nosotros">Nosotros</Link></li>
            </ul>
          </section>
          <section className="col-6 col-md-4">
            <h3 className="h5">Horario</h3>
            <p>Lunes a sábado, 8:00 a 20:00</p>
          </section>
        </div>
      </div>
    </footer>
  );
}

export default PiePagina;
