// Sesion guardada en sessionStorage: sobrevive al F5 pero se borra al cerrar la pestana.
const CLAVE_TOKEN = "token";
const CLAVE_USUARIO = "usuario";

// Evento que se dispara cuando una API responde 401 a una peticion que llevaba token
// (token vencido o alterado). AuthProvider lo escucha y cierra la sesion.
export const EVENTO_SESION_EXPIRADA = "sesion-expirada";

export function leerSesion() {
  try {
    const token = sessionStorage.getItem(CLAVE_TOKEN);
    const usuario = JSON.parse(sessionStorage.getItem(CLAVE_USUARIO) || "null");
    return token && usuario ? { token, usuario } : null;
  } catch {
    return null;
  }
}

export function guardarSesion(token, usuario) {
  sessionStorage.setItem(CLAVE_TOKEN, token);
  sessionStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
}

export function borrarSesion() {
  sessionStorage.removeItem(CLAVE_TOKEN);
  sessionStorage.removeItem(CLAVE_USUARIO);
}

/** Fecha de expiracion del JWT en milisegundos, o null si no se puede leer. No verifica la firma: eso lo hace el backend. */
export function expiracionToken(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function tokenVencido(token) {
  const exp = expiracionToken(token);
  return exp === null || exp <= Date.now();
}

export async function api(base, path, { method = "GET", body, token } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${base}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Revisa que la API esté encendida.");
  }

  if (response.status === 204) return null;
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null; // respuesta sin JSON (p. ej. 401/403 vacios de Spring Security)
  }

  if (!response.ok) {
    if (response.status === 401 && token) {
      window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
    }
    const porDefecto = {
      401: "Tu sesión no es válida o expiró. Vuelve a ingresar.",
      403: "No tienes permiso para realizar esta acción.",
    };
    const error = new Error(data?.mensaje || porDefecto[response.status] || `Error ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
}
