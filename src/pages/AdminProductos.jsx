import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { actualizarProducto, crearProducto, eliminarProducto, listarProductos } from "../services/productoService";
import { listarCategorias } from "../services/categoriaService";
import { formatearPrecio } from "../utils/precio";

const formularioVacio = {
  codigo: "", nombre: "", descripcion: "", unidad: "",
  precioResidencial: "", precioComercial: "", stock: "", imagenUrl: "", categoriaId: "",
};

function prepararEdicion(p) {
  return {
    codigo: p.codigo, nombre: p.nombre, descripcion: p.descripcion || "", unidad: p.unidad || "",
    precioResidencial: String(p.precioResidencial), precioComercial: String(p.precioComercial),
    stock: String(p.stock), imagenUrl: p.imagenUrl || "", categoriaId: String(p.categoriaId),
  };
}

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState(formularioVacio);
  const [editando, setEditando] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  async function cargar() {
    const [listaProductos, listaCategorias] = await Promise.all([listarProductos(), listarCategorias()]);
    setProductos(listaProductos);
    setCategorias(listaCategorias);
  }

  useEffect(() => {
    let activo = true;
    Promise.all([listarProductos(), listarCategorias()])
      .then(([listaProductos, listaCategorias]) => {
        if (activo) {
          setProductos(listaProductos);
          setCategorias(listaCategorias);
          setCargando(false);
        }
      })
      .catch((e) => {
        if (activo) { setError(e.message); setCargando(false); }
      });
    return () => { activo = false; };
  }, []);

  function cambiar(campo, valor) {
    setForm((actual) => ({ ...actual, [campo]: valor }));
  }

  function cancelarEdicion() {
    setForm(formularioVacio);
    setEditando(false);
  }

  async function guardar(evento) {
    evento.preventDefault();
    setError("");
    setGuardando(true);
    const cuerpo = {
      codigo: form.codigo.trim().toUpperCase(),
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      unidad: form.unidad.trim(),
      precioResidencial: Number(form.precioResidencial),
      precioComercial: Number(form.precioComercial),
      stock: Number(form.stock),
      imagenUrl: form.imagenUrl.trim() || null,
      categoriaId: Number(form.categoriaId),
    };
    try {
      if (editando) await actualizarProducto(form.codigo, cuerpo);
      else await crearProducto(cuerpo);
      await cargar();
      cancelarEdicion();
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  }

  async function borrar(codigo) {
    if (!window.confirm(`¿Desactivar el producto ${codigo}?`)) return;
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
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div><h1>Administrar productos</h1><p className="mb-0">Crear, editar y desactivar productos del catálogo.</p></div>
        <Link className="btn btn-outline-dark" to="/admin/categorias">Administrar categorías</Link>
      </div>
      {error && <p className="alert alert-danger" role="alert">{error}</p>}
      {cargando && <p>Consultando productos y categorías...</p>}
      <form className="row g-3 mb-4" onSubmit={guardar}>
        <div className="col-12 col-md-3"><label className="form-label" htmlFor="codigo">Código</label><input id="codigo" className="form-control" maxLength={20} value={form.codigo} disabled={editando} onChange={(e) => cambiar("codigo", e.target.value)} required /></div>
        <div className="col-12 col-md-5"><label className="form-label" htmlFor="nombreProducto">Nombre</label><input id="nombreProducto" className="form-control" value={form.nombre} onChange={(e) => cambiar("nombre", e.target.value)} required /></div>
        <div className="col-12 col-md-4"><label className="form-label" htmlFor="categoriaId">Categoría</label>
          <select id="categoriaId" className="form-select" value={form.categoriaId} onChange={(e) => cambiar("categoriaId", e.target.value)} required>
            <option value="">Selecciona una categoría</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
        <div className="col-12 col-md-5"><label className="form-label" htmlFor="descripcion">Descripción</label><input id="descripcion" className="form-control" value={form.descripcion} onChange={(e) => cambiar("descripcion", e.target.value)} /></div>
        <div className="col-6 col-md-2"><label className="form-label" htmlFor="unidad">Unidad</label><input id="unidad" className="form-control" placeholder="unidad" value={form.unidad} onChange={(e) => cambiar("unidad", e.target.value)} required /></div>
        <div className="col-6 col-md-2"><label className="form-label" htmlFor="stock">Stock</label><input id="stock" className="form-control" type="number" min="0" step="1" value={form.stock} onChange={(e) => cambiar("stock", e.target.value)} required /></div>
        <div className="col-6 col-md-3"><label className="form-label" htmlFor="precioResidencial">Precio residencial</label><input id="precioResidencial" className="form-control" type="number" min="0" step="1" value={form.precioResidencial} onChange={(e) => cambiar("precioResidencial", e.target.value)} required /></div>
        <div className="col-6 col-md-3"><label className="form-label" htmlFor="precioComercial">Precio comercial</label><input id="precioComercial" className="form-control" type="number" min="0" step="1" value={form.precioComercial} onChange={(e) => cambiar("precioComercial", e.target.value)} required /></div>
        <div className="col-12 col-md-7"><label className="form-label" htmlFor="imagenUrl">URL de imagen (opcional)</label><input id="imagenUrl" className="form-control" placeholder="/img/CL001.jpg" value={form.imagenUrl} onChange={(e) => cambiar("imagenUrl", e.target.value)} /></div>
        <div className="col-12 d-flex flex-wrap gap-2">
          <button className="btn btn-dark" type="submit" disabled={guardando || categorias.length === 0}>{guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear producto"}</button>
          {editando && <button className="btn btn-outline-secondary" type="button" onClick={cancelarEdicion}>Cancelar edición</button>}
          {categorias.length === 0 && !cargando && <span className="text-danger small">Primero crea una categoría.</span>}
        </div>
      </form>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead><tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Residencial</th><th>Comercial</th><th>Stock</th><th>Acciones</th></tr></thead>
          <tbody>{productos.map((producto) => (
            <tr key={producto.codigo}>
              <td>{producto.codigo}</td><td>{producto.nombre}</td><td>{producto.categoria}</td>
              <td>{formatearPrecio(producto.precioResidencial)}</td><td>{formatearPrecio(producto.precioComercial)}</td><td>{producto.stock}</td>
              <td className="text-nowrap">
                <button className="btn btn-sm btn-outline-dark me-2" type="button" onClick={() => { setForm(prepararEdicion(producto)); setEditando(true); }}>Editar</button>
                <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => borrar(producto.codigo)}>Desactivar</button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </main>
  );
}
