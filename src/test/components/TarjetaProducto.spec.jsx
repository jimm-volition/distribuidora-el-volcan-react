import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import TarjetaProducto from "../../components/TarjetaProducto";

const producto = {
  codigo: "CL001",
  nombre: "Cilindro GLP 5 kg",
  categoria: "Cilindros de gas",
  precio: 6500,
  imagen: "/img/CL001.jpg",
};

describe("TarjetaProducto", () => {
  it("muestra el nombre recibido por props", () => {
    render(<TarjetaProducto producto={producto} onAgregar={() => {}} />);
    expect(screen.getByRole("heading", { name: "Cilindro GLP 5 kg" })).toBeInTheDocument();
  });

  it("muestra el precio formateado en pesos chilenos", () => {
    render(<TarjetaProducto producto={producto} onAgregar={() => {}} />);
    expect(screen.getByText((texto) => texto.includes("6.500"))).toBeInTheDocument();
  });

  it("llama a onAgregar con el producto al pulsar el botón", async () => {
    const usuario = userEvent.setup();
    const onAgregar = vi.fn();
    render(<TarjetaProducto producto={producto} onAgregar={onAgregar} />);

    await usuario.click(screen.getByRole("button", { name: /agregar al pedido/i }));
    expect(onAgregar).toHaveBeenCalledTimes(1);
    expect(onAgregar).toHaveBeenCalledWith(producto);
  });
});
