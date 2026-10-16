import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import CampoFormulario from "./CampoFormulario";

describe("CampoFormulario", () => {
  it("muestra el mensaje de error cuando se pasa la prop error", () => {
    render(
      <CampoFormulario
        id="email"
        etiqueta="Correo"
        valor=""
        onCambiar={() => {}}
        error="Ingresa un correo válido."
      />
    );

    expect(screen.getByText("Ingresa un correo válido.")).toBeInTheDocument();
  });

  it("muestra el texto de ayuda cuando se pasa la prop ayuda", () => {
    render(
      <CampoFormulario
        id="password"
        etiqueta="Contraseña"
        valor=""
        onCambiar={() => {}}
        ayuda="Mínimo 8 caracteres."
      />
    );

    expect(screen.getByText("Mínimo 8 caracteres.")).toBeInTheDocument();
  });

  it("llama onCambiar al escribir", async () => {
    const usuario = userEvent.setup();
    const onCambiar = vi.fn();

    render(
      <CampoFormulario
        id="email"
        etiqueta="Correo"
        valor=""
        onCambiar={onCambiar}
      />
    );

    await usuario.type(screen.getByLabelText("Correo"), "a");

    expect(onCambiar).toHaveBeenCalled();
    expect(onCambiar).toHaveBeenCalledWith("email", "a");
  });
});