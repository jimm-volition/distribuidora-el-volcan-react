import { useState } from "react";
import CampoFormulario from "../components/CampoFormulario";
import {
  validarNombre,
  validarEmail,
  validarObligatorio,
  validarMinimo
} from "../utils/validaciones";

function Contacto() {
  const [contacto, setContacto] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: ""
  });

  const [errores, setErrores] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: ""
  });

  const [mensajeOk, setMensajeOk] = useState("");

  function manejarCambio(campo, valor) {
    setContacto({
      ...contacto,
      [campo]: valor
    });
  }

  function manejarEnvio(evento) {
    evento.preventDefault();

    const nuevosErrores = {
      nombre: validarNombre(contacto.nombre),
      email: validarEmail(contacto.email),
      asunto: validarObligatorio(contacto.asunto),
      mensaje: validarMinimo(contacto.mensaje, 10)
    };

    setErrores(nuevosErrores);

    const hayErrores = Object.values(nuevosErrores).some((error) => error !== "");

    if (hayErrores) {
      setMensajeOk("Revisa los campos marcados.");
      return;
    }

    setMensajeOk("Mensaje enviado. La operadora te contactará pronto.");
    setContacto({
      nombre: "",
      email: "",
      asunto: "",
      mensaje: ""
    });
  }

  return (
    <main className="container py-4">
      <h1>Habla con la operadora</h1>
      <p>Si necesitas un pedido especial o confirmar cobertura, déjanos un mensaje.</p>

      <div className="row g-4">
        <div className="col-12 col-md-7">
          <div className="card p-3">
            <form onSubmit={manejarEnvio}>
              <CampoFormulario
                id="nombre"
                etiqueta="Nombre"
                valor={contacto.nombre}
                onCambiar={manejarCambio}
                error={errores.nombre}
              />
              <CampoFormulario
                id="email"
                etiqueta="Correo"
                tipo="email"
                valor={contacto.email}
                onCambiar={manejarCambio}
                error={errores.email}
              />

              <div className="mb-3">
                <label htmlFor="asunto" className="form-label fw-bold">Asunto</label>
                <select
                  id="asunto"
                  className={`form-control ${errores.asunto ? "is-invalid" : ""}`}
                  value={contacto.asunto}
                  onChange={(evento) => manejarCambio("asunto", evento.target.value)}
                >
                  <option value="">Selecciona</option>
                  <option value="pedido">Consulta de pedido</option>
                  <option value="cobertura">Cobertura y horarios</option>
                  <option value="comercial">Tarifa comercial</option>
                  <option value="otro">Otro</option>
                </select>
                {errores.asunto && (
                  <div className="invalid-feedback d-block">{errores.asunto}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="mensaje" className="form-label fw-bold">Mensaje</label>
                <textarea
                  id="mensaje"
                  className={`form-control ${errores.mensaje ? "is-invalid" : ""}`}
                  rows="5"
                  value={contacto.mensaje}
                  onChange={(evento) => manejarCambio("mensaje", evento.target.value)}
                  placeholder="Cuéntanos comuna, producto y horario preferido"
                />
                <div className="form-text">Mínimo 10 caracteres.</div>
                {errores.mensaje && (
                  <div className="invalid-feedback d-block">{errores.mensaje}</div>
                )}
              </div>

              <button className="btn btn-dark" type="submit">Enviar mensaje</button>
              {mensajeOk && <p className="mt-3 fw-semibold">{mensajeOk}</p>}
            </form>
          </div>
        </div>

        <aside className="col-12 col-md-5">
          <div className="card p-3">
            <h2 className="h5">Datos de contacto</h2>
            <p>Despacho de gas licuado a domicilio en Chillán y Ñuble.</p>
            <p>
              Correo:{" "}
              <a href="mailto:contacto@gaselvolcan.cl">contacto@gaselvolcan.cl</a>
            </p>
            <p>
              Fono: <a href="tel:+56987654321">+56 9 8765 4321</a>
            </p>
            <p>Horario: lunes a sábado, 8:00 a 20:00</p>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default Contacto;