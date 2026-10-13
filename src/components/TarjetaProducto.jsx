import { formatearPrecio } from "../utils/precio";

function TarjetaProducto({ producto, onAgregar }) {
  return (
    <article className="card h-100 tarjeta-producto">
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="card-img-top"
        loading="lazy"
      />
      <div className="card-body d-flex flex-column">
        <span className="text-muted small">{producto.categoria}</span>
        <h2 className="h5">{producto.nombre}</h2>
        <p className="small mb-1">Código: {producto.codigo}</p>
        <p className="fw-bold">{formatearPrecio(producto.precio)}</p>
        <button
          className="btn btn-dark mt-auto"
          onClick={() => onAgregar(producto)}
        >
          Agregar al pedido
        </button>
      </div>
    </article>
  );
}

export default TarjetaProducto;
