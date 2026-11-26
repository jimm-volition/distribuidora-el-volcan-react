import { useContext } from "react";
import { AuthContext } from "../context/authContext";

/**
 * Esconde las acciones de compra (carrito, pedido) a quien no puede comprar.
 * El VENDEDOR (operadora) solo consulta productos y boletas: el Anexo 1 pide que
 * los demas accesos "no aparezcan" en su vista. Clientes, ADMIN y visitantes si las ven.
 * `denegado` es lo que se muestra en su lugar (por defecto, nada).
 * Igual que RutaProtegida, solo esconde: el backend responde 403 si el VENDEDOR intenta crear una boleta.
 */
export default function SoloCompradores({ children, denegado = null }) {
  // useContext directo (no useAuth) para que funcione tambien en pruebas sin AuthProvider.
  const rol = useContext(AuthContext)?.usuario?.rol;
  return rol === "VENDEDOR" ? denegado : children;
}
