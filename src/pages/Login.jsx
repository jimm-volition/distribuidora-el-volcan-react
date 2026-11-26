import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CampoFormulario from "../components/CampoFormulario";
import { useAuth } from "../context/useAuth";
import {
  validarEmail,
  validarPassword,
  validarNombre,
  validarCelular,
  normalizarCelular,
  validarPassword2
} from "../utils/validaciones";
import { destinoDespuesDeIngresar } from "../utils/permisos";

function Login() {
  const { usuario, avisoSesion, ingresar, registrar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const desde = location.state?.desde;
  const [enviando, setEnviando] = useState(false);

  function irDespuesDeIngresar(usuarioIngresado) {
    navigate(destinoDespuesDeIngresar(desde, usuarioIngresado.rol), { replace: true });
  }
  const [login, setLogin] = useState({
    email: "",
    password: ""
  });
  
  const [erroresLogin, setErroresLogin] = useState({
    email: "",
    password: ""
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
  
  async function manejarEnvioRegistro(evento) {
    evento.preventDefault();
  
    const nuevosErrores = {
      nombre: validarNombre(registro.nombre),
      email: validarEmail(registro.email),
      telefono: validarCelular(registro.telefono),
      password: validarPassword(registro.password),
      password2: validarPassword2(registro.password2, registro.password)
    };
  
    setErroresRegistro(nuevosErrores);
  
    const hayErrores = Object.values(nuevosErrores).some((error) => error !== "");
  
    if (hayErrores) {
      setMensajeRegistro("Revisa los campos marcados.");
      return;
    }

    setEnviando(true);
    setMensajeRegistro("");
    try {
      const nuevo = await registrar({
        nombre: registro.nombre.trim(),
        correo: registro.email.trim(),
        telefono: normalizarCelular(registro.telefono),
        password: registro.password
      });
      irDespuesDeIngresar(nuevo);
    } catch (error) {
      setMensajeRegistro(error.message);
    } finally {
      setEnviando(false);
    }
  }
  function manejarCambioLogin(campo, valor) {
    setLogin({
      ...login,
      [campo]: valor
    });
  }
  async function manejarEnvioLogin(evento) {
    evento.preventDefault();
  
    const nuevosErrores = {
      email: validarEmail(login.email),
      password: validarPassword(login.password)
    };
  
    setErroresLogin(nuevosErrores);
  
    const hayErrores = Object.values(nuevosErrores).some((error) => error !== "");
  
    if (hayErrores) {
      setMensajeLogin("Revisa los campos marcados.");
      return;
    }

    setEnviando(true);
    setMensajeLogin("");
    try {
      const ingresado = await ingresar(login.email.trim(), login.password);
      irDespuesDeIngresar(ingresado);
    } catch (error) {
      setMensajeLogin(error.message);
    } finally {
      setEnviando(false);
    }
  }

  if (usuario) {
    return (
      <main className="container py-4">
        <h1>Ya iniciaste sesión</h1>
        <p>Ingresaste como <strong>{usuario.nombre}</strong> ({usuario.correo}), rol {usuario.rol}.</p>
        <Link to="/">Ir al inicio</Link>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <h1>Ingreso al sistema</h1>
      {avisoSesion && <div className="alert alert-warning" role="alert">{avisoSesion}</div>}
      {desde && !avisoSesion && (
        <div className="alert alert-info" role="alert">Debes iniciar sesión para ver esa página.</div>
      )}

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
              <button className="btn btn-dark" type="submit" disabled={enviando}>
                {enviando ? "Ingresando..." : "Ingresar"}
              </button>
              <p className="form-text mt-3 mb-0">
                Cuentas de prueba: admin@volcan.cl / Admin1234 · vendedor@volcan.cl / Vendedor1 · cliente@volcan.cl / Cliente123.
                El rol lo asigna el servidor, no se elige en este formulario.
              </p>
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
              <button className="btn btn-dark" type="submit" disabled={enviando}>
                {enviando ? "Creando cuenta..." : "Crear cuenta"}
              </button>
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