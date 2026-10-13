import ItemCarrito from "./ItemCarrito";
import { formatearPrecio } from "../utils/precio";

function Carrito({ items, onQuitar }) {
  const total = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

  return (
    <section aria-live="polite">
      {items.length === 0 ? (
        <p className="alert alert-secondary">No has agregado productos.</p>
      ) : (
        <ul className="list-group mb-3">
          {items.map((item) => (
            <ItemCarrito key={item.codigo} item={item} onQuitar={onQuitar} />
          ))}
        </ul>
      )}
      <div className="d-flex justify-content-between border-top pt-2 fs-5">
        <span>Total:</span>
        <strong>{formatearPrecio(total)}</strong>
      </div>
    </section>
  );
}

export default Carrito;
