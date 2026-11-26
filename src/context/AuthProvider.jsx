import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import {
  EVENTO_SESION_EXPIRADA,
  borrarSesion,
  expiracionToken,
  guardarSesion,
  leerSesion,
  limiteSesion,
  tokenVencido,
} from "../services/http";
import {
  login as loginApi,
  me as meApi,
  refrescar as refrescarApi,
  registro as registroApi,
} from "../services/authService";

const AVISO_EXPIRADA = "Tu sesión expiró. Vuelve a ingresar.";
const AVISO_MAXIMO = "Tu sesión alcanzó el tiempo máximo de 8 horas. Vuelve a ingresar.";
// Cuanto antes del vencimiento se renueva el token.
const MARGEN_RENOVACION = 5 * 60 * 1000;

// Al recargar (F5) la sesion se lee de sessionStorage de forma sincronica,
// asi la pantalla no parpadea como "no logueado". Si el token ya vencio, se descarta.
function sesionInicial() {
  const sesion = leerSesion();
  if (sesion && tokenVencido(sesion.token)) {
    borrarSesion();
    return null;
  }
  return sesion;
}

export default function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(sesionInicial);
  const [avisoSesion, setAvisoSesion] = useState("");

  const cerrarSesion = useCallback((aviso = "") => {
    borrarSesion();
    setSesion(null);
    setAvisoSesion(aviso);
  }, []);

  // Tras restaurar desde sessionStorage, se confirma el token con Auth (GET /me).
  // Si el servidor lo rechaza (firma alterada, usuario desactivado) se cierra la sesion.
  // Solo corre al montar: login y registro ya traen datos frescos del servidor.
  useEffect(() => {
    const restaurada = leerSesion();
    if (!restaurada) return;
    meApi(restaurada.token)
      .then((usuario) => {
        const datos = { correo: usuario.correo, rol: usuario.rol, nombre: usuario.nombre };
        guardarSesion(restaurada.token, datos);
        setSesion({ token: restaurada.token, usuario: datos });
      })
      .catch((error) => {
        if (error.status === 401) cerrarSesion(AVISO_EXPIRADA);
      });
  }, [cerrarSesion]);

  // Cualquier 401 de Auth o de Pedidos a una peticion con token cierra la sesion.
  useEffect(() => {
    const alExpirar = () => cerrarSesion(AVISO_EXPIRADA);
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
  }, [cerrarSesion]);

  const guardar = useCallback((respuesta) => {
    const usuario = { correo: respuesta.correo, rol: respuesta.rol, nombre: respuesta.nombre };
    guardarSesion(respuesta.token, usuario);
    setSesion({ token: respuesta.token, usuario });
    setAvisoSesion("");
    return usuario;
  }, []);

  // Renovacion del token con la pestana abierta:
  //  - MARGEN_RENOVACION antes de que venza se pide uno nuevo a POST /refresh.
  //  - Si el servidor lo rechaza (401), http.js dispara EVENTO_SESION_EXPIRADA y se cierra la sesion.
  //  - Si la sesion llego a su maximo (8 h desde el login), ya no se renueva y se cierra al vencer.
  //  - Respaldo: si la renovacion falla por red, la sesion se cierra igual a la hora de vencimiento.
  const token = sesion?.token;
  useEffect(() => {
    if (!token) return undefined;
    const exp = expiracionToken(token);
    if (exp === null) return undefined;
    const limite = limiteSesion(token);
    const ultimoToken = limite !== null && exp >= limite;
    const restante = Math.max(exp - Date.now(), 0);

    const temporizadores = [
      setTimeout(() => cerrarSesion(ultimoToken ? AVISO_MAXIMO : AVISO_EXPIRADA), restante),
    ];
    if (!ultimoToken) {
      const espera = Math.max(restante - MARGEN_RENOVACION, restante / 2);
      temporizadores.push(setTimeout(() => {
        refrescarApi(token).then(guardar).catch(() => {});
      }, espera));
    }
    return () => temporizadores.forEach(clearTimeout);
  }, [token, cerrarSesion, guardar]);

  async function ingresar(correo, password) {
    return guardar(await loginApi(correo, password));
  }

  async function registrar(datos) {
    return guardar(await registroApi(datos));
  }

  return (
    <AuthContext.Provider
      value={{
        usuario: sesion?.usuario || null,
        token: token || null,
        avisoSesion,
        ingresar,
        registrar,
        cerrarSesion: () => cerrarSesion(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
