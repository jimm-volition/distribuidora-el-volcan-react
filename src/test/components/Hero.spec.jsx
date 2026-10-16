import { render, screen } from "@testing-library/react";
import Hero from "../../components/Hero";

describe("Hero", () => {
  it("muestra el título y subtítulo recibidos por props", () => {
    render(<Hero titulo="Gas El Volcán" subtitulo="Tu gas a domicilio" />);
    expect(screen.getByRole("heading", { name: "Gas El Volcán" })).toBeInTheDocument();
    expect(screen.getByText("Tu gas a domicilio")).toBeInTheDocument();
  });
});
