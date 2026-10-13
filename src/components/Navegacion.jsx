import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";

function Navegacion() {
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
            <NavLink className="nav-link" to="/pedido">Pedido</NavLink>
            <NavLink className="nav-link" to="/nosotros">Nosotros</NavLink>
            <NavLink className="nav-link" to="/login">Login</NavLink>
            <NavLink className="nav-link" to="/contacto">Contacto</NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navegacion;
