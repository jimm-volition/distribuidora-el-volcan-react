import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import AccesoDenegado from "../pages/AccesoDenegado";

/**
 * Sin sesion -> /login, recordando a que pagina queria entrar.
 * Con sesion pero sin el rol -> pantalla "Acceso denegado".
 * Esto solo esconde pantallas: la regla real la aplica el backend con 401 y 403.
 */
export default function RutaProtegida({ roles, children }) {
  const { usuario } = useAuth();
  const location = useLocation();
  if (!usuario) return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  if (roles && !roles.includes(usuario.rol)) return <AccesoDenegado />;
  return children;
}
