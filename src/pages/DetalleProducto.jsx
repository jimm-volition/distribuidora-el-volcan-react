import { Link, useParams } from "react-router-dom";
import { productos } from "../data/productos";
import { formatearPrecio } from "../utils/precio";

function DetalleProducto() {
  const { codigo } = useParams();
  const producto = productos.find((item) => item.codigo === codigo);

  if (!producto) {
    return (
      <main className="container py-4">
        <p>El producto solicitado no existe.</p>
        <Link to="/catalogo">Volver al catálogo</Link>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <h1>{producto.nombre}</h1>
      <p>{producto.categoria}</p>
      <p className="fw-bold">{formatearPrecio(producto.precio)}</p>
      <Link to="/catalogo">Volver al catálogo</Link>
    </main>
  );
}

export default DetalleProducto;
