import { useEffect, useState } from "react";
import { actualizarProducto, crearProducto, eliminarProducto, listarProductos } from "../services/productoService";

const vacio = { codigo: "", nombre: "", categoria: "", precio: "", stock: "", imagen: "", destacado: false };

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState(vacio);
  const [editando, setEditando] = useState(false);
  const [error, setError] = useState("");

  async function cargar() {
    setProductos(await listarProductos());
  }

  useEffect(() => {
    let activo = true;
    listarProductos()
      .then((datos) => {
        if (activo) setProductos(datos);
      })
      .catch((e) => {
        if (activo) setError(e.message);
      });

    return () => { activo = false; };
  }, []);

  function cambiar(campo, valor) {
    setForm((actual) => ({ ...actual, [campo]: valor }));
  }

  async function guardar(evento) {
    evento.preventDefault();
    setError("");
    const cuerpo = {
      ...form,
      precio: Number(form.precio),
      stock: Number(form.stock),
      destacado: Boolean(form.destacado),
    };
    try {
      if (editando) await actualizarProducto(form.codigo, cuerpo);
      else await crearProducto(cuerpo);
      setForm(vacio);
      setEditando(false);
      await cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  async function borrar(codigo) {
    setError("");
    try {
      await eliminarProducto(codigo);
      await cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main className="container py-4">
      <h1>Productos</h1>
      <p>Solo la administradora crea, edita y elimina productos.</p>
      {error && <p className="alert alert-danger">{error}</p>}
      <form className="row g-2 mb-4" onSubmit={guardar}>
        <div className="col-6 col-md-2"><input className="form-control" placeholder="Código" value={form.codigo} disabled={editando} onChange={(e) => cambiar("codigo", e.target.value)} required /></div>
        <div className="col-6 col-md-3"><input className="form-control" placeholder="Nombre" value={form.nombre} onChange={(e) => cambiar("nombre", e.target.value)} required /></div>
        <div className="col-6 col-md-2"><input className="form-control" placeholder="Categoría" value={form.categoria} onChange={(e) => cambiar("categoria", e.target.value)} required /></div>
        <div className="col-3 col-md-1"><input className="form-control" type="number" placeholder="Precio" value={form.precio} onChange={(e) => cambiar("precio", e.target.value)} required /></div>
        <div className="col-3 col-md-1"><input className="form-control" type="number" placeholder="Stock" value={form.stock} onChange={(e) => cambiar("stock", e.target.value)} required /></div>
        <div className="col-12 col-md-2"><input className="form-control" placeholder="Imagen" value={form.imagen} onChange={(e) => cambiar("imagen", e.target.value)} /></div>
        <div className="col-12 col-md-1 d-flex align-items-center"><label className="form-check-label"><input className="form-check-input me-1" type="checkbox" checked={form.destacado} onChange={(e) => cambiar("destacado", e.target.checked)} />Destacado</label></div>
        <div className="col-12"><button className="btn btn-dark" type="submit">{editando ? "Guardar cambios" : "Crear producto"}</button></div>
      </form>
      <div className="table-responsive">
        <table className="table">
          <thead><tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th></th></tr></thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.codigo}>
                <td>{p.codigo}</td>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>{p.precio}</td>
                <td>{p.stock}</td>
                <td className="text-nowrap">
                  <button className="btn btn-sm btn-outline-dark me-2" type="button" onClick={() => { setForm(p); setEditando(true); }}>Editar</button>
                  <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => borrar(p.codigo)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
