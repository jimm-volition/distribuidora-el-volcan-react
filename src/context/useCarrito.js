import { useContext } from "react";
import { CarritoContext } from "./carritoContext";

export function useCarrito() {
  const contexto = useContext(CarritoContext);
  if (!contexto) {
    throw new Error("useCarrito debe utilizarse dentro de CarritoProvider.");
  }
  return contexto;
}
