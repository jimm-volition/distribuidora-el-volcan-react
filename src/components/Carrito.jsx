import ItemCarrito from "./ItemCarrito";
import { formatearPrecio } from "../utils/precio";

function Carrito({ items, onQuitar, onCambiarCantidad }) {
  const total = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

  if (items.length === 0) {
    return (
      <div className="carrito-vacio text-center p-4 p-md-5">
        <div className="carrito-vacio-icono" aria-hidden="true">🛒</div>
        <h2 className="h4">Tu carrito está vacío</h2>
        <p className="text-muted mb-0">Agrega productos desde el catálogo para armar tu pedido.</p>
      </div>
    );
  }

  return (
    <section aria-live="polite">
      <ul className="list-group mb-3">
        {items.map((item) => (
          <ItemCarrito
            key={item.codigo}
            item={item}
            onQuitar={onQuitar}
            onCambiarCantidad={onCambiarCantidad}
          />
        ))}
      </ul>
      <div className="d-flex justify-content-between align-items-center border-top pt-3 fs-5">
        <span>Total del pedido</span>
        <strong>{formatearPrecio(total)}</strong>
      </div>
      <p className="text-muted small mt-2 mb-0">El total no incluye posibles costos de despacho.</p>
    </section>
  );
}

export default Carrito;
