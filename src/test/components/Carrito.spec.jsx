import { render, screen } from "@testing-library/react";
import Carrito from "../../components/Carrito";

const itemsPrueba = [
  { codigo: "CL001", nombre: "Cilindro GLP 5 kg", categoria: "Cilindros", precio: 6500, imagen: "/img/CL001.jpg", cantidad: 2 },
  { codigo: "RG001", nombre: "Regulador doméstico", categoria: "Reguladores", precio: 8990, imagen: "/img/RG001.jpg", cantidad: 1 },
];

describe("Carrito", () => {
  it("muestra el mensaje cuando no hay productos", () => {
    render(<Carrito items={[]} onQuitar={() => {}} onCambiarCantidad={() => {}} />);
    expect(screen.getByRole("heading", { name: "Tu carrito está vacío" })).toBeInTheDocument();
  });

  it("calcula y muestra el total correcto de los productos", () => {
    render(<Carrito items={itemsPrueba} onQuitar={() => {}} onCambiarCantidad={() => {}} />);
    // 2 * $6.500 + 1 * $8.990 = $21.990
    expect(screen.getByText((texto) => texto.includes("21.990"))).toBeInTheDocument();
  });
});
