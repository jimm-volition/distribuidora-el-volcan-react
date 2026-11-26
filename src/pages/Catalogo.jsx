import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListaProductos from "../components/ListaProductos";
import SoloCompradores from "../components/SoloCompradores";
import { productos as productosLocales } from "../data/productos";
import { listarProductos } from "../services/productoService";
import { useCarrito } from "../context/useCarrito";

function Catalogo() {
  const { agregarProducto, cantidadTotal } = useCarrito();
  const [productos, setProductos] = useState(productosLocales);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!import.meta.env.VITE_API_URL) return;
    listarProductos()
      .then(setProductos)
      .catch((e) => setError(e.message));
  }, []);

  function agregar(producto) {
    agregarProducto(producto);
    setMensaje(`${producto.nombre} se agregó al carrito.`);
  }

  return (
    <main className="container py-4">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
        <div>
          <h1>Catálogo</h1>
          <p className="mb-0">Encuentra cilindros, accesorios y productos para instalaciones de gas.</p>
        </div>
        <SoloCompradores>
          <Link className="btn btn-dark" to="/pedido">
            🛒 Ver carrito ({cantidadTotal})
          </Link>
        </SoloCompradores>
      </div>
      {error && <p className="alert alert-warning">{error}. Se muestra el catálogo local.</p>}
      {mensaje && (
        <div className="alert alert-success d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2" role="status">
          <span>{mensaje}</span>
          <Link className="alert-link" to="/pedido">Continuar al pedido</Link>
        </div>
      )}
      <ListaProductos productos={productos} onAgregar={agregar} />
    </main>
  );
}

export default Catalogo;
