import ListaProductos from "../components/ListaProductos";
import { productos } from "../data/productos";

function Catalogo() {
  function agregar(producto) {
    console.log("Producto seleccionado:", producto.nombre);
  }

  return (
    <main className="container py-4">
      <h1>Catálogo</h1>
      <p>Encuentra cilindros, accesorios y productos para instalaciones de gas.</p>
      <ListaProductos productos={productos} onAgregar={agregar} />
    </main>
  );
}

export default Catalogo;
