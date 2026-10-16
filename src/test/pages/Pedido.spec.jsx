import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CarritoProvider from "../../context/CarritoProvider";
import Pedido from "../../pages/Pedido";

const itemInicial = {
  codigo: "CL001",
  nombre: "Cilindro GLP 5 kg",
  categoria: "Cilindros de gas",
  precio: 6500,
  imagen: "/img/CL001.jpg",
  cantidad: 1,
};

function renderPedido() {
  return render(
    <MemoryRouter>
      <CarritoProvider>
        <Pedido />
      </CarritoProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
  window.localStorage.setItem("gas-el-volcan-carrito", JSON.stringify([itemInicial]));
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("validaciones del formulario de pedido", () => {
  it("muestra errores en los campos obligatorios si se envía vacío", async () => {
    const usuario = userEvent.setup();
    renderPedido();

    await usuario.type(screen.getByLabelText("Nombre completo"), "D");
    await usuario.type(screen.getByLabelText("Teléfono de contacto"), "123");
    await usuario.click(screen.getByRole("button", { name: /confirmar pedido/i }));

    expect(screen.getByText("Revisa los campos marcados antes de confirmar el pedido.")).toBeInTheDocument();
    expect(screen.getAllByText("Este campo es obligatorio.").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Ingresa al menos 2 caracteres.")).toBeInTheDocument();
    expect(screen.getByText("Ingresa un teléfono válido.")).toBeInTheDocument();
  });

  it("rechaza un correo inválido y conserva el mensaje junto al campo", async () => {
    const usuario = userEvent.setup();
    renderPedido();

    await usuario.type(screen.getByLabelText("Nombre completo"), "Diego Pérez");
    await usuario.type(screen.getByLabelText("Teléfono de contacto"), "+56 9 1234 5678");
    await usuario.type(screen.getByLabelText("Correo electrónico"), "correo-invalido");
    await usuario.type(screen.getByLabelText("Dirección de despacho"), "Av. Libertad 123");
    await usuario.type(screen.getByLabelText("Comuna"), "Chillán");
    await usuario.click(screen.getByRole("button", { name: /confirmar pedido/i }));

    expect(screen.getByText("Ingresa un correo válido.")).toBeInTheDocument();
    expect(screen.getByLabelText("Correo electrónico")).toHaveAttribute("aria-invalid", "true");
  });

  it("confirma el pedido cuando los datos son válidos", async () => {
    const usuario = userEvent.setup();
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    renderPedido();

    await usuario.type(screen.getByLabelText("Nombre completo"), "Diego Pérez");
    await usuario.type(screen.getByLabelText("Teléfono de contacto"), "+56 9 1234 5678");
    await usuario.type(screen.getByLabelText("Correo electrónico"), "diego@mail.cl");
    await usuario.type(screen.getByLabelText("Dirección de despacho"), "Av. Libertad 123");
    await usuario.type(screen.getByLabelText("Comuna"), "Chillán");
    await usuario.click(screen.getByRole("button", { name: /confirmar pedido/i }));

    expect(screen.getByRole("heading", { name: /¡gracias por tu pedido, diego pérez!/i })).toBeInTheDocument();
    expect(screen.getByText((texto) => texto.includes("6.500"))).toBeInTheDocument();
  });
});
