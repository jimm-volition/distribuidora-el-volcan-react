import { useEffect, useState } from "react";
import { cambiarEstado, listarBoletas } from "../services/boletaService";
import { useAuth } from "../context/useAuth";
import { formatearPrecio } from "../utils/precio";

// El backend solo acepta estas transiciones; estados finales no se pueden modificar.
const TRANSICIONES = {
  RECIBIDA: ["EN_PREPARACION", "CANCELADA"],
  EN_PREPARACION: ["ENTREGADA", "CANCELADA"],
  ENTREGADA: [],
  CANCELADA: [],
};

export default function Ordenes() {
  const { usuario, token } = useAuth();
  const [boletas, setBoletas] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [actualizandoId, setActualizandoId] = useState(null);
  const admin = usuario?.rol === "ADMIN";

  async function cargar() { setBoletas(await listarBoletas()); }

  useEffect(() => {
    if (!token) return;
    let activo = true;
    listarBoletas()
      .then((datos) => { if (activo) { setBoletas(datos); setCargando(false); } })
      .catch((e) => { if (activo) { setError(e.message); setCargando(false); } });
    return () => { activo = false; };
  }, [token]);

  async function actualizar(id, estado) {
    setActualizandoId(id);
    setError("");
    try {
      await cambiarEstado(id, estado);
      await cargar();
    } catch (e) {
      setError(e.message);
    } finally {
      setActualizandoId(null);
    }
  }

  return (
    <main className="container py-4">
      <h1>{usuario?.rol === "CLIENTE" ? "Mis pedidos" : "Órdenes"}</h1>
      {usuario?.rol === "VENDEDOR" && <p>Solo lectura. La administradora gestiona los estados.</p>}
      {error && <p className="alert alert-danger" role="alert">{error}</p>}
      {cargando && <p>Consultando boletas...</p>}
      {!cargando && !error && boletas.length === 0 && <p>No hay boletas.</p>}
      {boletas.map((boleta) => {
        const permitidos = TRANSICIONES[boleta.estado] || [];
        return (
          <article className="card p-3 mb-3" key={boleta.id}>
            <div className="d-flex justify-content-between gap-2 flex-wrap">
              <strong>Boleta #{boleta.id}</strong>
              <span>{boleta.estado} · {formatearPrecio(boleta.total)}</span>
            </div>
            <p className="mb-1">{boleta.nombreCliente} · {boleta.clienteCorreo}</p>
            {boleta.telefono && <p className="mb-1">Teléfono: {boleta.telefono}</p>}
            <p className="mb-1">{boleta.direccion}, {boleta.comuna}</p>
            <ul className="mb-2">
              {boleta.detalles?.map((detalle) => (
                <li key={detalle.codigoProducto}>
                  {detalle.cantidad} × {detalle.nombreProducto} ({formatearPrecio(detalle.precioUnitario)} c/u) — {formatearPrecio(detalle.subtotal)}
                </li>
              ))}
            </ul>
            {admin && (
              <div className="d-flex gap-2 align-items-center flex-wrap">
                <label htmlFor={`estado-${boleta.id}`}>Cambiar estado:</label>
                <select id={`estado-${boleta.id}`} className="form-select w-auto" value={boleta.estado}
                  disabled={permitidos.length === 0 || actualizandoId === boleta.id}
                  onChange={(e) => actualizar(boleta.id, e.target.value)}>
                  <option value={boleta.estado}>{boleta.estado}</option>
                  {permitidos.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
                </select>
              </div>
            )}
          </article>
        );
      })}
    </main>
  );
}
