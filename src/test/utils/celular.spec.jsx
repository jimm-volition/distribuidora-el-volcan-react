import { validarCelular, normalizarCelular } from "../../utils/validaciones";

describe("validarCelular", () => {
  it("acepta celular con +56 y espacios", () => {
    expect(validarCelular("+56 9 8765 4321")).toBe("");
  });

  it("acepta celular sin prefijo", () => {
    expect(validarCelular("987654321")).toBe("");
  });

  it("rechaza un fijo o numero corto", () => {
    expect(validarCelular("221234567")).toBe("Ingresa un celular válido (+56 9 XXXX XXXX).");
    expect(validarCelular("12345")).toBe("Ingresa un celular válido (+56 9 XXXX XXXX).");
  });

  it("rechaza vacio", () => {
    expect(validarCelular("")).toBe("Este campo es obligatorio.");
  });
});

describe("normalizarCelular", () => {
  it("deja el formato +569XXXXXXXX que espera Auth", () => {
    expect(normalizarCelular("9 8765 4321")).toBe("+56987654321");
    expect(normalizarCelular("+56 9 8765-4321")).toBe("+56987654321");
  });
});
