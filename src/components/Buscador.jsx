function Buscador({ valor, onCambiar }) {
  return (
    <div className="mb-4">
      <label htmlFor="buscar-producto" className="form-label fw-bold">
        Buscar producto
      </label>
      <input
        id="buscar-producto"
        type="search"
        className="form-control"
        placeholder="Ej: cilindro, manguera..."
        autoComplete="off"
        value={valor}
        onChange={(evento) => onCambiar(evento.target.value)}
      />
    </div>
  );
}

export default Buscador;
