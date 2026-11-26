import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarCategorias, crearCategoria, actualizarCategoria, eliminarCategoria } from "../services/categoriaService";

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [idEditando, setIdEditando] = useState(null);
  const [error, setError] = useState("");
  const [ocupado, setOcupado] = useState(false);

  async function recargar() {
    setCategorias(await listarCategorias());
  }

  useEffect(() => {
    let activo = true;
    listarCategorias()
      .then((lista) => { if (activo) setCategorias(lista); })
      .catch((e) => { if (activo) setError(e.message); });
    return () => { activo = false; };
  }, []);

  async function guardar(evento) {
    evento.preventDefault();
    setOcupado(true);
    setError("");
    try {
      if (idEditando !== null) await actualizarCategoria(idEditando, nombre.trim());
      else await crearCategoria(nombre.trim());
      await recargar();
      setNombre("");
      setIdEditando(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setOcupado(false);
    }
  }

  async function borrar(categoria) {
    if (!window.confirm(`¿Eliminar la categoría ${categoria.nombre}?`)) return;
    setError("");
    try {
      await eliminarCategoria(categoria.id);
      await recargar();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main className="container py-4">
      <h1>Administrar categorías</h1>
      <p>Una categoría con productos asociados no se puede eliminar.</p>
      <Link className="btn btn-outline-dark mb-3" to="/admin/productos">Volver a productos</Link>
      {error && <p className="alert alert-danger" role="alert">{error}</p>}
      <form className="row g-2 align-items-end mb-4" onSubmit={guardar}>
        <div className="col-12 col-md-6"><label className="form-label" htmlFor="nombreCategoria">Nombre de la categoría</label><input id="nombreCategoria" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={100} required /></div>
        <div className="col-auto"><button className="btn btn-dark" disabled={ocupado} type="submit">{idEditando === null ? "Crear categoría" : "Guardar cambios"}</button></div>
        {idEditando !== null && <div className="col-auto"><button className="btn btn-outline-secondary" type="button" onClick={() => { setNombre(""); setIdEditando(null); }}>Cancelar</button></div>}
      </form>
      <div className="table-responsive">
        <table className="table table-striped align-middle"><thead><tr><th>ID</th><th>Nombre</th><th>Acciones</th></tr></thead>
          <tbody>{categorias.map((c) => (
            <tr key={c.id}><td>{c.id}</td><td>{c.nombre}</td><td>
              <button className="btn btn-sm btn-outline-dark me-2" type="button" onClick={() => { setNombre(c.nombre); setIdEditando(c.id); }}>Editar</button>
              <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => borrar(c)}>Eliminar</button>
            </td></tr>
          ))}</tbody>
        </table>
      </div>
    </main>
  );
}
