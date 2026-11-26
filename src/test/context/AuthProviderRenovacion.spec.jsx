import { act, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import AuthProvider from "../../context/AuthProvider";
import { useAuth } from "../../context/useAuth";

const USUARIO = { correo: "cliente@volcan.cl", rol: "CLIENTE", nombre: "Cliente Demo" };
const ahora = () => Math.floor(Date.now() / 1000);

function crearToken(segundosDeVida, segundosDeSesion = 8 * 3600) {
  const payload = { sub: USUARIO.correo, rol: "CLIENTE", exp: ahora() + segundosDeVida, sesionHasta: ahora() + segundosDeSesion };
  return `x.${btoa(JSON.stringify(payload))}.firma`;
}

function Sesion() {
  const { usuario, token, avisoSesion } = useAuth();
  return (
    <>
      <p>{usuario ? "Con sesion" : "Sin sesion"}</p>
      <p data-testid="token">{token}</p>
      <p>{avisoSesion}</p>
    </>
  );
}

function respuesta(cuerpo, status = 200) {
  return Promise.resolve(new Response(JSON.stringify(cuerpo), { status }));
}

describe("AuthProvider: renovacion del token", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("pide un token nuevo 5 minutos antes de que venza y lo guarda", async () => {
    const viejo = crearToken(10 * 60); // vence en 10 minutos
    const nuevo = crearToken(60 * 60);
    sessionStorage.setItem("token", viejo);
    sessionStorage.setItem("usuario", JSON.stringify(USUARIO));
    const fetchMock = vi.fn((url) =>
      url.endsWith("/refresh") ? respuesta({ token: nuevo, ...USUARIO }) : respuesta(USUARIO));
    vi.stubGlobal("fetch", fetchMock);

    render(<AuthProvider><Sesion /></AuthProvider>);
    await act(() => vi.advanceTimersByTimeAsync(4 * 60 * 1000));
    expect(fetchMock.mock.calls.some(([url]) => url.endsWith("/refresh"))).toBe(false);

    await act(() => vi.advanceTimersByTimeAsync(60 * 1000 + 100)); // minuto 5: faltan 5 para vencer
    const llamada = fetchMock.mock.calls.find(([url]) => url.endsWith("/refresh"));
    expect(llamada[1].method).toBe("POST");
    expect(llamada[1].headers.Authorization).toBe(`Bearer ${viejo}`);
    expect(screen.getByTestId("token")).toHaveTextContent(nuevo);
    expect(sessionStorage.getItem("token")).toBe(nuevo);
    expect(screen.getByText("Con sesion")).toBeInTheDocument();
  });

  it("si Auth rechaza la renovacion (401) cierra la sesion", async () => {
    sessionStorage.setItem("token", crearToken(10 * 60));
    sessionStorage.setItem("usuario", JSON.stringify(USUARIO));
    vi.stubGlobal("fetch", vi.fn((url) =>
      url.endsWith("/refresh") ? respuesta({ mensaje: "La sesion ya no es valida" }, 401) : respuesta(USUARIO)));

    render(<AuthProvider><Sesion /></AuthProvider>);
    await act(() => vi.advanceTimersByTimeAsync(5 * 60 * 1000 + 100));

    expect(screen.getByText("Sin sesion")).toBeInTheDocument();
    expect(screen.getByText("Tu sesión expiró. Vuelve a ingresar.")).toBeInTheDocument();
  });

  it("al llegar al maximo de 8 horas ya no renueva y cierra al vencer", async () => {
    // Ultimo token de la sesion: vence justo en el limite (dentro de 2 minutos).
    sessionStorage.setItem("token", crearToken(120, 120));
    sessionStorage.setItem("usuario", JSON.stringify(USUARIO));
    const fetchMock = vi.fn(() => respuesta(USUARIO));
    vi.stubGlobal("fetch", fetchMock);

    render(<AuthProvider><Sesion /></AuthProvider>);
    await act(() => vi.advanceTimersByTimeAsync(121 * 1000));

    expect(fetchMock.mock.calls.some(([url]) => url.endsWith("/refresh"))).toBe(false);
    expect(screen.getByText("Sin sesion")).toBeInTheDocument();
    expect(screen.getByText("Tu sesión alcanzó el tiempo máximo de 8 horas. Vuelve a ingresar.")).toBeInTheDocument();
  });
});
