import { Route, Routes } from "react-router-dom";
import Navegacion from "./components/Navegacion";
import PiePagina from "./components/PiePagina";
import Inicio from "./pages/Inicio";
import Catalogo from "./pages/Catalogo";
import DetalleProducto from "./pages/DetalleProducto";
import Pedido from "./pages/Pedido";
import Nosotros from "./pages/Nosotros";
import Login from "./pages/Login";
import Contacto from "./pages/Contacto";
import NoEncontrada from "./pages/NoEncontrada";
import AdminProductos from "./pages/AdminProductos";
import Ordenes from "./pages/Ordenes";
import RutaProtegida from "./components/RutaProtegida";

function App() {
  return (
    <>
      <Navegacion />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/catalogo/:codigo" element={<DetalleProducto />} />
        <Route path="/pedido" element={<Pedido />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/ordenes" element={<RutaProtegida roles={["ADMIN", "VENDEDOR", "CLIENTE"]}><Ordenes /></RutaProtegida>} />
        <Route path="/admin/productos" element={<RutaProtegida roles={["ADMIN"]}><AdminProductos /></RutaProtegida>} />
        <Route path="*" element={<NoEncontrada />} />
      </Routes>
      <PiePagina />
    </>
  );
}

export default App;
