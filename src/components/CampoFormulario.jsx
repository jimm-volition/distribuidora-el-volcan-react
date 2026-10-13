function CampoFormulario({ id, etiqueta, tipo = "text", valor, onCambiar, error, ayuda, ...resto }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-bold">{etiqueta}</label>
      <input
        id={id}
        name={id}
        type={tipo}
        className={`form-control ${error ? "is-invalid" : ""}`}
        value={valor}
        onChange={(evento) => onCambiar(id, evento.target.value)}
        aria-invalid={Boolean(error)}
        {...resto}
      />
      {ayuda && <div className="form-text">{ayuda}</div>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}

export default CampoFormulario;
