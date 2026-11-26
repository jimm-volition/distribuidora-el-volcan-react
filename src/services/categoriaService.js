import { api, leerSesion } from "./http";

const BASE = import.meta.env.VITE_API_URL;
const token = () => leerSesion()?.token;

export function listarCategorias() {
  return api(BASE, "/api/v1/categorias");
}

export function crearCategoria(nombre) {
  return api(BASE, "/api/v1/categorias", { method: "POST", body: { nombre }, token: token() });
}

export function actualizarCategoria(id, nombre) {
  return api(BASE, `/api/v1/categorias/${id}`, { method: "PUT", body: { nombre }, token: token() });
}

export function eliminarCategoria(id) {
  return api(BASE, `/api/v1/categorias/${id}`, { method: "DELETE", token: token() });
}
