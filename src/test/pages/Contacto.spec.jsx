import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Contacto from "../../pages/Contacto";

describe("Contacto", () => {
  it("muestra errores al enviar el formulario vacio", async () => {
    const usuario = userEvent.setup();
    render(<Contacto />);

    await usuario.click(
      screen.getByRole("button", { name: /enviar mensaje/i })
    );

    expect(screen.getByText("Revisa los campos marcados.")).toBeInTheDocument();
    expect(screen.getAllByText("Este campo es obligatorio.").length).toBeGreaterThan(0);
  });

  it("muestra mensaje de exito con datos validos", async () => {
    const usuario = userEvent.setup();
    // Mock de consola (ejemplo de mock): no es obligatorio para el flujo, pero sirve para explicar vi.fn
    const spyLog = vi.spyOn(console, "log").mockImplementation(() => {});

    render(<Contacto />);

    await usuario.type(screen.getByLabelText("Nombre"), "Juan Perez");
    await usuario.type(screen.getByLabelText("Correo"), "juan@mail.cl");
    await usuario.selectOptions(screen.getByLabelText("Asunto"), "pedido");
    await usuario.type(
      screen.getByLabelText("Mensaje"),
      "Necesito un cilindro de 15 kg en Chillan"
    );

    await usuario.click(
      screen.getByRole("button", { name: /enviar mensaje/i })
    );

    expect(
      screen.getByText("Mensaje enviado. La operadora te contactará pronto.")
    ).toBeInTheDocument();

    spyLog.mockRestore();
  });
});