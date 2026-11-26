import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import RutaProtegida from "../../components/RutaProtegida";

function montar(usuario) {
  return render(
    <AuthContext.Provider value={{ usuario }}>
      <MemoryRouter initialEntries={["/admin/productos"]}>
        <Routes>
          <Route path="/login" element={<p>Pantalla de login</p>} />
          <Route
            path="/admin/productos"
            element={<RutaProtegida roles={["ADMIN"]}><p>CRUD de productos</p></RutaProtegida>}
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe("RutaProtegida", () => {
  it("sin sesion redirige al login", () => {
    montar(null);
    expect(screen.getByText("Pantalla de login")).toBeInTheDocument();
  });

  it("con un rol sin permiso muestra acceso denegado", () => {
    montar({ correo: "vendedor@volcan.cl", rol: "VENDEDOR", nombre: "Operadora" });
    expect(screen.getByRole("heading", { name: "Acceso denegado" })).toBeInTheDocument();
    expect(screen.queryByText("CRUD de productos")).not.toBeInTheDocument();
  });

  it("con el rol correcto muestra la pantalla", () => {
    montar({ correo: "admin@volcan.cl", rol: "ADMIN", nombre: "Administradora" });
    expect(screen.getByText("CRUD de productos")).toBeInTheDocument();
  });
});
