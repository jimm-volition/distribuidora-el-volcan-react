import { api } from "./http";

const BASE = import.meta.env.VITE_AUTH_URL;

/** POST /api/v1/auth/login -> { token, correo, rol, nombre } */
export function login(correo, password) {
  return api(BASE, "/api/v1/auth/login", { method: "POST", body: { correo, password } });
}

/** POST /api/v1/auth/registro -> crea un CLIENTE y responde igual que login */
export function registro(datos) {
  return api(BASE, "/api/v1/auth/registro", { method: "POST", body: datos });
}

/** GET /api/v1/auth/me -> confirma con el servidor que el token guardado sigue siendo valido */
export function me(token) {
  return api(BASE, "/api/v1/auth/me", { token });
}
