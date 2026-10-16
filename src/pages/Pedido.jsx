import { useState } from "react";
import { Link } from "react-router-dom";
import Carrito from "../components/Carrito";
import CampoFormulario from "../components/CampoFormulario";
import { useCarrito } from "../context/useCarrito";
import { formatearPrecio } from "../utils/precio";
import { validarEmail, validarNombre, validarObligatorio, validarTelefono } from "../utils/validaciones";

const formularioInicial = {
  nombre: "",
  telefono: "",
  email: "",
  direccion: "",
  comuna: "",
  referencia: "",
  pago: "efectivo",
};

function Pedido() {
  const { items, total, quitarProducto, cambiarCantidad, vaciarCarrito, cantidadTotal } = useCarrito();
  const [cliente, setCliente] = useState(formularioInicial);
  const [confirmacion, setConfirmacion] = useState(null);
  const [errores, setErrores] = useState({});
  const [error, setError] = useState("");

  const validadores = {
    nombre: validarNombre,
    telefono: validarTelefono,
    email: validarEmail,
    direccion: validarObligatorio,
    comuna: validarObligatorio,
  };

  function validarCampo(campo, valor) {
    if (campo === "pago") {
      return ["efectivo", "transferencia", "tarjeta"].includes(valor)
        ? ""
        : "Selecciona una forma de pago válida.";
    }
    return validadores[campo] ? validadores[campo](valor) : "";
  }

  function manejarCambio(campo, valor) {
    setCliente((actual) => ({ ...actual, [campo]: valor }));
    if (error) setError("");
    if (Object.prototype.hasOwnProperty.call(errores, campo)) {
      setErrores((actuales) => ({ ...actuales, [campo]: validarCampo(campo, valor) }));
    }
  }

  function manejarEnvio(evento) {
    evento.preventDefault();

    const nuevosErrores = Object.fromEntries(
      Object.entries(validadores).map(([campo, validar]) => [campo, validar(cliente[campo])]),
    );
    nuevosErrores.pago = validarCampo("pago", cliente.pago);
    setErrores(nuevosErrores);

    const formularioInvalido = Object.values(nuevosErrores).some(Boolean);
    if (items.length === 0) {
      setError("Agrega al menos un producto antes de confirmar el pedido.");
      return;
    }
    if (formularioInvalido) {
      setError("Revisa los campos marcados antes de confirmar el pedido.");
      return;
    }

    const numeroPedido = `EV-${Date.now().toString().slice(-8)}`;
    setConfirmacion({ numero: numeroPedido, nombre: cliente.nombre, total, cantidad: cantidadTotal });
    vaciarCarrito();
    setCliente(formularioInicial);
    setErrores({});
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (confirmacion) {
    return (
      <main className="container py-4 pedido-contenedor">
        <section className="confirmacion-pedido text-center p-4 p-md-5" role="status">
          <div className="confirmacion-icono" aria-hidden="true">✓</div>
          <h1 className="h2 mt-3">¡Gracias por tu pedido, {confirmacion.nombre}!</h1>
          <p className="lead">Tu pedido quedó preparado en esta demostración.</p>
          <div className="confirmacion-resumen mx-auto my-4">
            <p className="mb-2">Número de referencia: <strong>{confirmacion.numero}</strong></p>
            <p className="mb-2">Productos: <strong>{confirmacion.cantidad}</strong></p>
            <p className="mb-0">Total: <strong>{formatearPrecio(confirmacion.total)}</strong></p>
          </div>
          <p className="text-muted small">Este proyecto aún no está conectado a un servidor, por lo que el pedido no se envió realmente a la distribuidora.</p>
          <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
            <Link className="btn btn-dark" to="/catalogo" onClick={() => setConfirmacion(null)}>Seguir comprando</Link>
            <Link className="btn btn-outline-dark" to="/" onClick={() => setConfirmacion(null)}>Volver al inicio</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="container py-4 pedido-contenedor">
      <div className="pedido-encabezado mb-4">
        <p className="text-uppercase fw-bold small mb-1">Distribuidora Gas El Volcán</p>
        <h1>Tu carrito y pedido</h1>
        <p className="text-muted mb-0">Revisa las cantidades, confirma el total y completa los datos para el despacho.</p>
      </div>

      <div className="row g-4 align-items-start">
        <section className="col-12 col-lg-7">
          <div className="card pedido-panel p-3 p-md-4">
            <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
              <h2 className="h4 mb-0">Productos seleccionados</h2>
              <span className="badge text-bg-secondary">{cantidadTotal} {cantidadTotal === 1 ? "producto" : "productos"}</span>
            </div>
            <Carrito items={items} onQuitar={quitarProducto} onCambiarCantidad={cambiarCantidad} />
            {items.length > 0 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <Link to="/catalogo" className="btn btn-outline-dark">Seguir comprando</Link>
                <button type="button" className="btn btn-link text-danger" onClick={vaciarCarrito}>Vaciar carrito</button>
              </div>
            )}
          </div>
        </section>

        <section className="col-12 col-lg-5">
          <div className="card pedido-panel p-3 p-md-4">
            <h2 className="h4 mb-3">Datos de entrega</h2>
            <form onSubmit={manejarEnvio} noValidate>
              <CampoFormulario
                id="nombre"
                etiqueta="Nombre completo"
                valor={cliente.nombre}
                onCambiar={manejarCambio}
                error={errores.nombre}
                required
                autoComplete="name"
              />
              <CampoFormulario
                id="telefono"
                etiqueta="Teléfono de contacto"
                tipo="tel"
                valor={cliente.telefono}
                onCambiar={manejarCambio}
                error={errores.telefono}
                required
                autoComplete="tel"
                placeholder="+56 9 1234 5678"
              />
              <CampoFormulario
                id="email"
                etiqueta="Correo electrónico"
                tipo="email"
                valor={cliente.email}
                onCambiar={manejarCambio}
                error={errores.email}
                required
                autoComplete="email"
              />
              <CampoFormulario
                id="direccion"
                etiqueta="Dirección de despacho"
                valor={cliente.direccion}
                onCambiar={manejarCambio}
                error={errores.direccion}
                required
                autoComplete="street-address"
                placeholder="Calle, número y departamento"
              />
              <CampoFormulario
                id="comuna"
                etiqueta="Comuna"
                valor={cliente.comuna}
                onCambiar={manejarCambio}
                error={errores.comuna}
                required
                placeholder="Ej. Chillán"
              />
              <div className="mb-3">
                <label htmlFor="referencia" className="form-label fw-bold">Referencias para llegar (opcional)</label>
                <textarea
                  id="referencia"
                  className="form-control"
                  rows="2"
                  value={cliente.referencia}
                  onChange={(evento) => manejarCambio("referencia", evento.target.value)}
                  placeholder="Casa, color del portón, horario preferido..."
                />
              </div>
              <div className="mb-3">
                <label htmlFor="pago" className="form-label fw-bold">Forma de pago</label>
                <select id="pago" className={`form-select ${errores.pago ? "is-invalid" : ""}`} aria-invalid={Boolean(errores.pago)} value={cliente.pago} onChange={(evento) => manejarCambio("pago", evento.target.value)}>
                  <option value="efectivo">Efectivo al recibir</option>
                  <option value="transferencia">Transferencia bancaria</option>
                  <option value="tarjeta">Tarjeta al recibir</option>
                </select>
                {errores.pago && <div className="invalid-feedback d-block">{errores.pago}</div>}
              </div>

              <div className="resumen-total d-flex justify-content-between align-items-center mb-3 p-3">
                <span>Total estimado</span>
                <strong>{formatearPrecio(total)}</strong>
              </div>
              {error && <p className="alert alert-danger py-2" role="alert">{error}</p>}
              <button type="submit" className="btn btn-dark btn-lg w-100" disabled={items.length === 0}>
                Confirmar pedido
              </button>
              {items.length === 0 && <p className="form-text mt-2 mb-0">Tu carrito debe tener productos para continuar.</p>}
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Pedido;
