import { useEffect, useState } from "react";
import { cambiarEstado, listarBoletas } from "../services/boletaService";
import { useAuth } from "../context/useAuth";
import { formatearPrecio } from "../utils/precio";

const ESTADOS = ["RECIBIDA", "EN_PREPARACION", "ENTREGADA", "CANCELADA"];

export default function Ordenes() {
  const { usuario } = useAuth();
  const [boletas, setBoletas] = useState([]);
  const [error, setError] = useState("");
  const admin = usuario?.rol === "ADMIN";

  async function cargar() {
    setBoletas(await listarBoletas());
  }

  useEffect(() => {
    cargar().catch((e) => setError(e.message));
  }, []);

  async function actualizar(id, estado) {
    setError("");
    try {
      await cambiarEstado(id, estado);
      await cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main className="container py-4">
      <h1>{usuario?.rol === "CLIENTE" ? "Mis pedidos" : "Órdenes"}</h1>
      {usuario?.rol === "VENDEDOR" && <p>Puedes ver el detalle. El cambio de estado lo hace la administradora.</p>}
      {error && <p className="alert alert-danger">{error}</p>}
      {boletas.length === 0 && <p>No hay boletas.</p>}
      {boletas.map((boleta) => (
        <article className="card p-3 mb-3" key={boleta.id}>
          <div className="d-flex justify-content-between gap-2 flex-wrap">
            <strong>Boleta #{boleta.id}</strong>
            <span>{boleta.estado} · {formatearPrecio(boleta.total)}</span>
          </div>
          <p className="mb-1">{boleta.nombreCliente} · {boleta.correoCliente} · {boleta.telefono}</p>
          <p className="mb-1">{boleta.direccion}, {boleta.comuna}</p>
          <ul className="mb-2">
            {boleta.detalles?.map((d) => (
              <li key={d.id}>{d.cantidad} × {d.nombreProducto} ({formatearPrecio(d.precioUnitario)})</li>
            ))}
          </ul>
          {admin && (
            <select className="form-select w-auto" value={boleta.estado} onChange={(e) => actualizar(boleta.id, e.target.value)}>
              {ESTADOS.map((estado) => <option key={estado}>{estado}</option>)}
            </select>
          )}
        </article>
      ))}
    </main>
  );
}
