import { formatearPrecio } from "./precio";

describe("formatearPrecio", () => {
  it("formatea un valor tipico en pesos chilenos", () => {
    const resultado = formatearPrecio(6500);
    expect(resultado).toContain("6.500");
  });

  it("formatea el valor cero", () => {
    const resultado = formatearPrecio(0);
    expect(resultado).toContain("0");
  });
});