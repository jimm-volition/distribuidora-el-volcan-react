// Que roles pueden ver cada ruta restringida. Debe coincidir con las reglas de App.jsx
// (RutaProtegida y SoloCompradores). Las rutas que no aparecen aqui son publicas.
const RUTAS_RESTRINGIDAS = [
  { prefijo: "/admin", roles: ["ADMIN"] },
  { prefijo: "/ordenes", roles: ["ADMIN", "VENDEDOR", "CLIENTE"] },
  { prefijo: "/pedido", roles: ["ADMIN", "CLIENTE"] },
  { prefijo: "/nosotros", roles: ["ADMIN", "CLIENTE"] },
  { prefijo: "/contacto", roles: ["ADMIN", "CLIENTE"] },
];

/** true si un usuario con ese rol puede entrar a la ruta. */
export function puedeVer(ruta, rol) {
  const regla = RUTAS_RESTRINGIDAS.find(({ prefijo }) => ruta === prefijo || ruta.startsWith(`${prefijo}/`));
  return !regla || regla.roles.includes(rol);
}

// Pagina de inicio de cada rol despues de ingresar.
export const INICIO_POR_ROL = { ADMIN: "/admin/productos", VENDEDOR: "/ordenes", CLIENTE: "/catalogo" };

/**
 * A donde ir despues del login o el registro: vuelve a la pagina que se pidio
 * solo si el rol puede verla; si no, a la pagina de inicio de su rol.
 * (Ej.: un visitante abre /admin/productos, lo mandan al login y se registra como
 * CLIENTE: no tiene sentido devolverlo a una pantalla de administracion.)
 */
export function destinoDespuesDeIngresar(desde, rol) {
  if (desde && desde !== "/login" && puedeVer(desde, rol)) return desde;
  return INICIO_POR_ROL[rol] || "/";
}
