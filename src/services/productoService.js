import { api, leerSesion } from "./http";

const BASE = import.meta.env.VITE_API_URL;

// La API usa precioResidencial e imagenUrl; las tarjetas/carrito usan precio e imagen.
// Conservamos los campos originales para editar productos en Administración.
export function adaptarProducto(producto) {
  return {
    ...producto,
    precio: Number(producto.precioResidencial),
    imagen: producto.imagenUrl || `/img/${producto.codigo}.jpg`,
  };
}

export async function listarProductos() {
  const lista = await api(BASE, "/api/v1/productos");
  return lista.map(adaptarProducto);
}

export async function buscarProducto(codigo) {
  const producto = await api(BASE, `/api/v1/productos/${encodeURIComponent(codigo)}`);
  return adaptarProducto(producto);
}

export function crearProducto(producto) {
  const sesion = leerSesion();
  return api(BASE, "/api/v1/productos", { method: "POST", body: producto, token: sesion?.token });
}

export function actualizarProducto(codigo, producto) {
  const sesion = leerSesion();
  return api(BASE, `/api/v1/productos/${encodeURIComponent(codigo)}`, { method: "PUT", body: producto, token: sesion?.token });
}

export function eliminarProducto(codigo) {
  const sesion = leerSesion();
  return api(BASE, `/api/v1/productos/${encodeURIComponent(codigo)}`, { method: "DELETE", token: sesion?.token });
}
