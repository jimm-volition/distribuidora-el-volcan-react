import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function AccesoDenegado() {
  const { usuario } = useAuth();
  return (
    <main className="container py-4">
      <h1>Acceso denegado</h1>
      <p>
        Tu cuenta ({usuario?.correo}) tiene el rol <strong>{usuario?.rol}</strong>, que no tiene permiso
        para ver esta sección.
      </p>
      <Link to="/">Volver al inicio</Link>
    </main>
  );
}

export default AccesoDenegado;
