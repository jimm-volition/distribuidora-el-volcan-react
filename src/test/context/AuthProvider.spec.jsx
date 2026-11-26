import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import AuthProvider from "../../context/AuthProvider";
import { useAuth } from "../../context/useAuth";

function crearToken(segundosDeVida) {
  const payload = { sub: "cliente@volcan.cl", rol: "CLIENTE", exp: Math.floor(Date.now() / 1000) + segundosDeVida };
  return `x.${btoa(JSON.stringify(payload))}.firma`;
}

function MostrarSesion() {
  const { usuario, avisoSesion } = useAuth();
  return (
    <>
      <p>{usuario ? `Sesion de ${usuario.correo}` : "Sin sesion"}</p>
      <p>{avisoSesion}</p>
    </>
  );
}

const USUARIO = { correo: "cliente@volcan.cl", rol: "CLIENTE", nombre: "Cliente Demo" };

describe("AuthProvider (sesion que sobrevive al F5)", () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(() => vi.unstubAllGlobals());

  it("restaura la sesion guardada y la confirma con GET /me", async () => {
    const token = crearToken(3600);
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("usuario", JSON.stringify(USUARIO));
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ token: null, ...USUARIO }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    render(<AuthProvider><MostrarSesion /></AuthProvider>);

    expect(screen.getByText("Sesion de cliente@volcan.cl")).toBeInTheDocument();
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const [url, opciones] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/api\/v1\/auth\/me$/);
    expect(opciones.headers.Authorization).toBe(`Bearer ${token}`);
  });

  it("descarta un token vencido sin llamar a la API", () => {
    sessionStorage.setItem("token", crearToken(-10));
    sessionStorage.setItem("usuario", JSON.stringify(USUARIO));
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<AuthProvider><MostrarSesion /></AuthProvider>);

    expect(screen.getByText("Sin sesion")).toBeInTheDocument();
    expect(sessionStorage.getItem("token")).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("cierra la sesion si Auth rechaza el token (401)", async () => {
    sessionStorage.setItem("token", crearToken(3600));
    sessionStorage.setItem("usuario", JSON.stringify(USUARIO));
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 401 })));

    render(<AuthProvider><MostrarSesion /></AuthProvider>);

    await waitFor(() => expect(screen.getByText("Sin sesion")).toBeInTheDocument());
    expect(screen.getByText("Tu sesión expiró. Vuelve a ingresar.")).toBeInTheDocument();
    expect(sessionStorage.getItem("token")).toBeNull();
  });
});
