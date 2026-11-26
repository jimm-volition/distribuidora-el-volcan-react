import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const NOMBRE_ROL = { ADMIN: "Administradora", VENDEDOR: "Operadora", CLIENTE: "Cliente" };

function Navegacion() {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const rol = usuario?.rol;

  function salir() {
    cerrarSesion();
    navigate("/");
  }

  return (
    <Navbar expand="lg" className="navbar-volcan" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <img src="/img/logo.png" alt="Logo distribuidora Gas El Volcán" />
          Distribuidora Gas El Volcán
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="ms-auto gap-1">
            <NavLink className="nav-link" to="/" end>Inicio</NavLink>
            <NavLink className="nav-link" to="/catalogo">Catálogo</NavLink>
            {rol !== "VENDEDOR" && <NavLink className="nav-link" to="/pedido">Pedido</NavLink>}
            {rol !== "VENDEDOR" && <NavLink className="nav-link" to="/nosotros">Nosotros</NavLink>}
            {rol !== "VENDEDOR" && <NavLink className="nav-link" to="/contacto">Contacto</NavLink>}
            {(rol === "ADMIN" || rol === "VENDEDOR" || rol === "CLIENTE") && (
              <NavLink className="nav-link" to="/ordenes">{rol === "CLIENTE" ? "Mis pedidos" : "Órdenes"}</NavLink>
            )}
            {rol === "ADMIN" && <NavLink className="nav-link" to="/admin/productos">Productos</NavLink>}
            {usuario ? (
              <button className="nav-link btn btn-link" type="button" onClick={salir}>
                Salir ({usuario.nombre} · {NOMBRE_ROL[rol] || rol})
              </button>
            ) : (
              <NavLink className="nav-link" to="/login">Login</NavLink>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navegacion;
