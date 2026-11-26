import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import SoloCompradores from "../../components/SoloCompradores";
import TarjetaProducto from "../../components/TarjetaProducto";
import PiePagina from "../../components/PiePagina";

const producto = { codigo: "CL001", nombre: "Cilindro GLP 5 kg", categoria: "Cilindros de gas", precio: 6500, imagen: "" };

function conRol(rol, ui) {
  const usuario = rol ? { correo: "x@volcan.cl", rol, nombre: "X" } : null;
  return render(
    <AuthContext.Provider value={{ usuario }}>
      <MemoryRouter>{ui}</MemoryRouter>
    </AuthContext.Provider>
  );
}

describe("SoloCompradores (la operadora no ve opciones de compra)", () => {
  it("al VENDEDOR le esconde el boton de agregar al pedido", () => {
    conRol("VENDEDOR", <TarjetaProducto producto={producto} onAgregar={() => {}} />);
    expect(screen.getByRole("heading", { name: "Cilindro GLP 5 kg" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /agregar al pedido/i })).not.toBeInTheDocument();
  });

  it.each(["CLIENTE", "ADMIN", null])("con rol %s si muestra el boton", (rol) => {
    conRol(rol, <TarjetaProducto producto={producto} onAgregar={() => {}} />);
    expect(screen.getByRole("button", { name: /agregar al pedido/i })).toBeInTheDocument();
  });

  it("al VENDEDOR le esconde Pedido y Nosotros del pie de pagina", () => {
    conRol("VENDEDOR", <PiePagina />);
    expect(screen.getByRole("link", { name: "Catálogo" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Pedido" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Nosotros" })).not.toBeInTheDocument();
  });

  it("muestra la pantalla de reemplazo cuando se le pasa una", () => {
    conRol("VENDEDOR", <SoloCompradores denegado={<p>Acceso denegado</p>}><p>Carrito</p></SoloCompradores>);
    expect(screen.getByText("Acceso denegado")).toBeInTheDocument();
    expect(screen.queryByText("Carrito")).not.toBeInTheDocument();
  });
});
