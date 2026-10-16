import { useState } from "react";
import CampoFormulario from "../components/CampoFormulario";
import {
  validarEmail,
  validarPassword,
  validarNombre,
  validarTelefono,
  validarPassword2,
  validarObligatorio
} from "../utils/validaciones";

function Login() {
  const [login, setLogin] = useState({
    email: "",
    password: "",
    rol: ""
  });
  
  const [erroresLogin, setErroresLogin] = useState({
    email: "",
    password: "",
    rol: ""
  });
  
  const [mensajeLogin, setMensajeLogin] = useState("");

  const [registro, setRegistro] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    password2: ""
  });
  
  const [erroresRegistro, setErroresRegistro] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    password2: ""
  });
  
  const [mensajeRegistro, setMensajeRegistro] = useState("");
  
  function manejarCambioRegistro(campo, valor) {
    setRegistro({
      ...registro,
      [campo]: valor
    });
  }
  
  function manejarEnvioRegistro(evento) {
    evento.preventDefault();
  
    const nuevosErrores = {
      nombre: validarNombre(registro.nombre),
      email: validarEmail(registro.email),
      telefono: validarTelefono(registro.telefono),
      password: validarPassword(registro.password),
      password2: validarPassword2(registro.password2, registro.password)
    };
  
    setErroresRegistro(nuevosErrores);
  
    const hayErrores = Object.values(nuevosErrores).some((error) => error !== "");
  
    if (hayErrores) {
      setMensajeRegistro("Revisa los campos marcados.");
      return;
    }
  
    setMensajeRegistro("Cuenta creada. Ya puedes ingresar con tu correo.");
    setRegistro({
      nombre: "",
      email: "",
      telefono: "",
      password: "",
      password2: ""
    });
  }
  function manejarCambioLogin(campo, valor) {
    setLogin({
      ...login,
      [campo]: valor
    });
  }
  function manejarEnvioLogin(evento) {
    evento.preventDefault();
  
    const nuevosErrores = {
      email: validarEmail(login.email),
      password: validarPassword(login.password),
      rol: validarObligatorio(login.rol)
    };
  
    setErroresLogin(nuevosErrores);
  
    const hayErrores = Object.values(nuevosErrores).some((error) => error !== "");
  
    if (hayErrores) {
      setMensajeLogin("Revisa los campos marcados.");
      return;
    }
  
    setMensajeLogin(`Ingreso correcto como ${login.rol}. Bienvenida/o, ${login.email}.`);
  }

  return (
    <main className="container py-4">
      <h1>Ingreso al sistema</h1>
  
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <div className="card p-3 h-100">
            <h2 className="h5">Ingresar</h2>
            <form onSubmit={manejarEnvioLogin}>
              <CampoFormulario
                id="email"
                etiqueta="Correo"
                tipo="email"
                valor={login.email}
                onCambiar={manejarCambioLogin}
                error={erroresLogin.email}
              />
              <CampoFormulario
                id="password"
                etiqueta="Contraseña"
                tipo="password"
                valor={login.password}
                onCambiar={manejarCambioLogin}
                error={erroresLogin.password}
                ayuda="Mínimo 8 caracteres."
              />
              <div className="mb-3">
                <label htmlFor="rol" className="form-label fw-bold">Rol</label>
                <select
                  id="rol"
                  className={`form-control ${erroresLogin.rol ? "is-invalid" : ""}`}
                  value={login.rol}
                  onChange={(evento) => manejarCambioLogin("rol", evento.target.value)}
                >
                  <option value="">Selecciona tu rol</option>
                  <option value="administrador">Administradora</option>
                  <option value="operadora">Operadora / Despachadora</option>
                  <option value="repartidor">Repartidor</option>
                  <option value="cliente">Cliente</option>
                </select>
                {erroresLogin.rol && (
                  <div className="invalid-feedback">{erroresLogin.rol}</div>
                )}
              </div>
              <button className="btn btn-dark" type="submit">Ingresar</button>
              {mensajeLogin && (
                <p className="mt-3 fw-semibold">{mensajeLogin}</p>
              )}
            </form>
          </div>
        </div>
  
        <div className="col-12 col-md-6">
          <div className="card p-3 h-100">
            <h2 className="h5">Registro de cliente</h2>
            <form onSubmit={manejarEnvioRegistro}>
              <CampoFormulario
                id="nombre"
                etiqueta="Nombre"
                valor={registro.nombre}
                onCambiar={manejarCambioRegistro}
                error={erroresRegistro.nombre}
              />
              <CampoFormulario
                id="email"
                etiqueta="Correo"
                tipo="email"
                valor={registro.email}
                onCambiar={manejarCambioRegistro}
                error={erroresRegistro.email}
              />
              <CampoFormulario
                id="telefono"
                etiqueta="Celular"
                tipo="tel"
                valor={registro.telefono}
                onCambiar={manejarCambioRegistro}
                error={erroresRegistro.telefono}
              />
              <CampoFormulario
                id="password"
                etiqueta="Contraseña"
                tipo="password"
                valor={registro.password}
                onCambiar={manejarCambioRegistro}
                error={erroresRegistro.password}
              />
              <CampoFormulario
                id="password2"
                etiqueta="Repite la contraseña"
                tipo="password"
                valor={registro.password2}
                onCambiar={manejarCambioRegistro}
                error={erroresRegistro.password2}
              />
              <button className="btn btn-dark" type="submit">Crear cuenta</button>
              {mensajeRegistro && (
                <p className="mt-3 fw-semibold">{mensajeRegistro}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
  
}

export default Login;