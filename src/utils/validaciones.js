/**
 * Utilidades de validación para formularios.
 * Cada función recibe un valor (string) y devuelve:
 * - "" si está OK
 * - un mensaje de error si falla
 */

export function validarObligatorio(valor) {
  if (!valor || !valor.trim()) {
    return "Este campo es obligatorio.";
  }
  return "";
}

export function validarEmail(valor) {
  const texto = (valor || "").trim();
  if (!texto) return "Este campo es obligatorio.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto)) {
    return "Ingresa un correo válido.";
  }
  return "";
}

export function validarPassword(valor) {
  const texto = valor || "";
  if (!texto) return "Este campo es obligatorio.";
  if (texto.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }
  return "";
}

export function validarPassword2(valor, passwordOriginal) {
  const texto = valor || "";
  if (!texto) return "Este campo es obligatorio.";
  if (texto !== passwordOriginal) {
    return "Las contraseñas no coinciden.";
  }
  return "";
}

export function validarNombre(valor) {
  const texto = (valor || "").trim();
  if (!texto) return "Este campo es obligatorio.";
  if (texto.length < 2) {
    return "Ingresa al menos 2 caracteres.";
  }
  return "";
}

export function validarTelefono(valor) {
  const texto = (valor || "").trim();
  if (!texto) return "Este campo es obligatorio.";
  const digitos = texto.replace(/\D/g, "");
  if (digitos.length < 8) {
    return "Ingresa un teléfono válido.";
  }
  return "";
}

export function validarMinimo(valor, minimo = 10) {
  const texto = (valor || "").trim();
  if (!texto) return "Este campo es obligatorio.";
  if (texto.length < minimo) {
    return `Escribe al menos ${minimo} caracteres.`;
  }
  return "";
}
