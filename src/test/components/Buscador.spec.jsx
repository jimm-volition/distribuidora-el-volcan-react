import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Buscador from "../../components/Buscador"

describe("Buscador", () => {
  it("llama a onCambiar al escribir en el buscador", async () => {
    const usuario = userEvent.setup();
    const onCambiar = vi.fn();
    render(<Buscador valor="" onCambiar={onCambiar} />);

    await usuario.type(screen.getByRole("searchbox", { name: /buscar producto/i }), "g");
    expect(onCambiar).toHaveBeenCalledTimes(1);
    expect(onCambiar).toHaveBeenCalledWith("g");
  });
});
