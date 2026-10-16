import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ItemCarrito from "../../components/ItemCarrito";

describe("ItemCarrito", () => {
  it("llama a onQuitar al pulsar el botón para quitar el producto", async () => {
    const usuario = userEvent.setup();
    const onQuitar = vi.fn();
    const item = {
      codigo: "CL001",
      nombre: "Cilindro GLP 5 kg",
      precio: 6500,
      cantidad: 1,
    };
    render(<ItemCarrito item={item} onQuitar={onQuitar} />);

    await usuario.click(screen.getByRole("button", { name: "Quitar Cilindro GLP 5 kg" }));
    expect(onQuitar).toHaveBeenCalledTimes(1);
    expect(onQuitar).toHaveBeenCalledWith("CL001");
  });
});
