import { Link } from "react-router-dom";
import { useState } from "react";
import Hero from "../components/Hero";
import TarjetaInfo from "../components/TarjetaInfo";
import ListaProductos from "../components/ListaProductos";
import { productos } from "../data/productos";
import { useCarrito } from "../context/useCarrito";

function Inicio() {
  const destacados = productos.filter((producto) => producto.destacado);
  const { agregarProducto } = useCarrito();
  const [mensaje, setMensaje] = useState("");

  function agregar(producto) {
    agregarProducto(producto);
    setMensaje(`${producto.nombre} se agregó al carrito.`);
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
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h2 className="mb-0">Cilindros más pedidos</h2>
            <Link to="/catalogo">Ver todos los productos</Link>
          </div>
          {mensaje && <p className="alert alert-success" role="status">{mensaje} <Link className="alert-link" to="/pedido">Ver carrito</Link></p>}
          <ListaProductos productos={destacados} onAgregar={agregar} />
        </section>
      </main>
    </>
  );
}

export default Inicio;
