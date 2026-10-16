import {
  validarObligatorio,
  validarEmail,
  validarPassword,
  validarPassword2,
  validarNombre,
  validarTelefono,
  validarMinimo
} from "./validaciones";

describe("validaciones", () => {
  it("validarObligatorio rechaza vacio", () => {
    expect(validarObligatorio("")).toBe("Este campo es obligatorio.");
  });

  it("validarObligatorio acepta texto", () => {
    expect(validarObligatorio("ok")).toBe("");
  });

  it("rechaza un correo invalido", () => {
    expect(validarEmail("malo")).toBe("Ingresa un correo válido.");
  });

  it("acepta un correo valido", () => {
    expect(validarEmail("juan@mail.cl")).toBe("");
  });

  it("validarEmail rechaza vacio", () => {
    expect(validarEmail("")).toBe("Este campo es obligatorio.");
  });

  it("rechaza una contraseña corta", () => {
    expect(validarPassword("abc")).toBe(
      "La contraseña debe tener al menos 8 caracteres."
    );
  });

  it("acepta una contraseña de 8 o mas caracteres", () => {
    expect(validarPassword("abcdefgh")).toBe("");
  });

  it("validarPassword rechaza vacio", () => {
    expect(validarPassword("")).toBe("Este campo es obligatorio.");
  });

  it("detecta contraseñas distintas", () => {
    expect(validarPassword2("abcdefghi", "otraClave")).toBe(
      "Las contraseñas no coinciden."
    );
  });

  it("acepta contraseñas iguales", () => {
    expect(validarPassword2("abcdefgh", "abcdefgh")).toBe("");
  });

  it("validarPassword2 rechaza vacio", () => {
    expect(validarPassword2("", "abcdefgh")).toBe("Este campo es obligatorio.");
  });

  it("validarNombre rechaza vacio", () => {
    expect(validarNombre("")).toBe("Este campo es obligatorio.");
  });

  it("validarNombre rechaza nombre corto", () => {
    expect(validarNombre("A")).toBe("Ingresa al menos 2 caracteres.");
  });

  it("validarNombre acepta nombre valido", () => {
    expect(validarNombre("Juan")).toBe("");
  });

  it("rechaza un telefono demasiado corto", () => {
    expect(validarTelefono("123")).toBe("Ingresa un teléfono válido.");
  });

  it("acepta un telefono valido", () => {
    expect(validarTelefono("+56 9 8765 4321")).toBe("");
  });

  it("validarTelefono rechaza vacio", () => {
    expect(validarTelefono("")).toBe("Este campo es obligatorio.");
  });

  it("validarMinimo rechaza vacio", () => {
    expect(validarMinimo("")).toBe("Este campo es obligatorio.");
  });

  it("validarMinimo rechaza texto corto", () => {
    expect(validarMinimo("hola")).toBe("Escribe al menos 10 caracteres.");
  });

  it("validarMinimo acepta texto largo", () => {
    expect(validarMinimo("mensaje de prueba largo")).toBe("");
  });
});