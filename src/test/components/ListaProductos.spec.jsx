import { render, screen } from "@testing-library/react";
import ListaProductos from "../../components/ListaProductos";

const productosPrueba = [
  { codigo: "CL001", nombre: "Cilindro 5 kg", categoria: "Cilindros", precio: 6500, imagen: "/img/CL001.jpg" },
  { codigo: "CL002", nombre: "Cilindro 11 kg", categoria: "Cilindros", precio: 12000, imagen: "/img/CL002.jpg" },
  { codigo: "RG001", nombre: "Regulador doméstico", categoria: "Reguladores", precio: 8990, imagen: "/img/RG001.jpg" },
];

describe("ListaProductos", () => {
  it("renderiza tantas tarjetas como productos recibe", () => {
    render(<ListaProductos productos={productosPrueba} onAgregar={() => {}} />);
    expect(screen.getAllByRole("article")).toHaveLength(productosPrueba.length);
  });

  it("muestra un mensaje cuando la lista está vacía", () => {
    render(<ListaProductos productos={[]} onAgregar={() => {}} />);
    expect(screen.getByText("No encontramos productos con esa búsqueda.")).toBeInTheDocument();
  });
});
