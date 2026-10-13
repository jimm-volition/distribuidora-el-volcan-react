import TarjetaProducto from "./TarjetaProducto";

function ListaProductos({ productos, onAgregar }) {
  if (productos.length === 0) {
    return <p className="alert alert-secondary">No encontramos productos con esa búsqueda.</p>;
  }

  return (
    <div className="row g-4">
      {productos.map((producto) => (
        <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={producto.codigo}>
          <TarjetaProducto producto={producto} onAgregar={onAgregar} />
        </div>
      ))}
    </div>
  );
}

export default ListaProductos;
