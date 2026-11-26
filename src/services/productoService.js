import { api, leerSesion } from "./http";

const BASE = import.meta.env.VITE_API_URL;

export function listarProductos() {
  return api(BASE, "/api/v1/productos");
}

export function buscarProducto(codigo) {
  return api(BASE, `/api/v1/productos/${codigo}`);
}

export function crearProducto(producto) {
  const sesion = leerSesion();
  return api(BASE, "/api/v1/productos", { method: "POST", body: producto, token: sesion?.token });
}

export function actualizarProducto(codigo, producto) {
  const sesion = leerSesion();
  return api(BASE, `/api/v1/productos/${codigo}`, { method: "PUT", body: producto, token: sesion?.token });
}

export function eliminarProducto(codigo) {
  const sesion = leerSesion();
  return api(BASE, `/api/v1/productos/${codigo}`, { method: "DELETE", token: sesion?.token });
}
