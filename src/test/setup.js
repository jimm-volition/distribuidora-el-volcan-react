import "@testing-library/jest-dom/vitest";

// Simula localStorage para que las pruebas funcionen de forma consistente
// en jsdom, sin depender del almacenamiento real del navegador.
function crearLocalStorageMock() {
  let datos = {};

  return {
    getItem(clave) {
      return Object.prototype.hasOwnProperty.call(datos, clave)
        ? datos[clave]
        : null;
    },
    setItem(clave, valor) {
      datos[clave] = String(valor);
    },
    removeItem(clave) {
      delete datos[clave];
    },
    clear() {
      datos = {};
    },
    key(indice) {
      return Object.keys(datos)[indice] ?? null;
    },
    get length() {
      return Object.keys(datos).length;
    },
  };
}

Object.defineProperty(window, "localStorage", {
  configurable: true,
  value: crearLocalStorageMock(),
});
