import { formatearPrecio } from "../utils/precio";

function ItemCarrito({ item, onQuitar }) {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center gap-2">
      <span className="flex-grow-1">{item.nombre}</span>
      <span className="fw-semibold">x {item.cantidad}</span>
      <strong>{formatearPrecio(item.precio * item.cantidad)}</strong>
      <button
        className="btn btn-sm btn-outline-danger"
        onClick={() => onQuitar(item.codigo)}
        aria-label={`Quitar ${item.nombre}`}
      >
        ×
      </button>
    </li>
  );
}

export default ItemCarrito;
