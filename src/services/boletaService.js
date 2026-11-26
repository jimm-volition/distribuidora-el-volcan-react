import { api, leerSesion } from "./http";

const BASE = import.meta.env.VITE_API_URL;

function token() {
  return leerSesion()?.token;
}

export function crearBoleta(boleta) {
  return api(BASE, "/api/v1/boletas", { method: "POST", body: boleta, token: token() });
}

export function listarBoletas() {
  return api(BASE, "/api/v1/boletas", { token: token() });
}

export function cambiarEstado(id, estado) {
  return api(BASE, `/api/v1/boletas/${id}/estado`, { method: "PUT", body: { estado }, token: token() });
}
