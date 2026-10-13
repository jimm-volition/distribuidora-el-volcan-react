function Hero({ titulo, subtitulo, children }) {
  return (
    <section className="hero-volcan">
      <div className="container">
        <h1>{titulo}</h1>
        {subtitulo && <p className="lead">{subtitulo}</p>}
        {children && <div className="d-flex flex-wrap gap-2">{children}</div>}
      </div>
    </section>
  );
}

export default Hero;
