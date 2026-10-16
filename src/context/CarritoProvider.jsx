import { useEffect, useState } from "react";
import { CarritoContext } from "./carritoContext";

const CLAVE_CARRITO = "gas-el-volcan-carrito";

function cargarCarritoInicial() {
  try {
    const guardado = window.localStorage.getItem(CLAVE_CARRITO);
    const carrito = guardado ? JSON.parse(guardado) : [];
    return Array.isArray(carrito)
      ? carrito.filter(
          (item) =>
            item &&
            typeof item.codigo === "string" &&
            typeof item.nombre === "string" &&
            Number.isFinite(item.precio) &&
            Number.isFinite(item.cantidad) &&
            item.cantidad > 0,
        )
      : [];
  } catch {
    return [];
  }
}

function CarritoProvider({ children }) {
  const [items, setItems] = useState(cargarCarritoInicial);

  useEffect(() => {
    try {
      window.localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
    } catch {
      // El carrito sigue funcionando aunque el navegador bloquee localStorage.
    }
  }, [items]);

  function agregarProducto(producto) {
    setItems((actuales) => {
      const existente = actuales.find((item) => item.codigo === producto.codigo);
      if (existente) {
        return actuales.map((item) =>
          item.codigo === producto.codigo
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }
      return [...actuales, { ...producto, cantidad: 1 }];
    });
  }

  function quitarProducto(codigo) {
    setItems((actuales) => actuales.filter((item) => item.codigo !== codigo));
  }

  function cambiarCantidad(codigo, cantidad) {
    const cantidadValida = Math.floor(Number(cantidad));
    if (!Number.isFinite(cantidadValida) || cantidadValida <= 0) {
      quitarProducto(codigo);
      return;
    }
    setItems((actuales) =>
      actuales.map((item) =>
        item.codigo === codigo ? { ...item, cantidad: cantidadValida } : item,
      ),
    );
  }

  function vaciarCarrito() {
    setItems([]);
  }

  const cantidadTotal = items.reduce((total, item) => total + item.cantidad, 0);
  const total = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

  const valor = {
    items,
    cantidadTotal,
    total,
    agregarProducto,
    quitarProducto,
    cambiarCantidad,
    vaciarCarrito,
  };

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}


export default CarritoProvider;
