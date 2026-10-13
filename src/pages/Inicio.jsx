import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import TarjetaInfo from "../components/TarjetaInfo";
import ListaProductos from "../components/ListaProductos";
import { productos } from "../data/productos";

function Inicio() {
  const destacados = productos.filter((producto) => producto.destacado);

  function agregar(producto) {
    console.log("Producto seleccionado:", producto.nombre);
  }

  return (
    <>
      <Hero
        titulo="Gas a domicilio rápido y eficiente"
        subtitulo="Pedidos en línea y entrega en Chillán y comunas aledañas."
      >
        <Link className="btn btn-light" to="/catalogo">Ver catálogo</Link>
        <Link className="btn btn-outline-light" to="/nosotros">Sobre nosotros</Link>
      </Hero>

      <main className="container py-4">
        <section className="mb-5">
          <h2>Por qué pedir con nosotros</h2>
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <TarjetaInfo titulo="Eficiencia" texto="El cliente pide de forma sencilla y su pedido llegará pronto." />
            </div>
            <div className="col-12 col-md-6">
              <TarjetaInfo titulo="Información en tiempo real" texto="Todos los clientes tendrán la información de sus pedidos a mano." />
            </div>
          </div>
        </section>

        <section>
          <h2>Cilindros más pedidos</h2>
          <ListaProductos productos={destacados} onAgregar={agregar} />
        </section>
      </main>
    </>
  );
}

export default Inicio;
