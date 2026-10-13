function TarjetaInfo({ titulo, texto }) {
  return (
    <article className="card h-100">
      <div className="card-body">
        <h3 className="h5">{titulo}</h3>
        <p className="mb-0">{texto}</p>
      </div>
    </article>
  );
}

export default TarjetaInfo;
