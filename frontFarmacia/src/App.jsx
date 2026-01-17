import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/index';
import Login from './pages/Login';
import RestablecerContra from './pages/restablecerContra';
import ResetPassword from './pages/ResetPassword';
import Registrar from './pages/registrar';
import Checkout from './pages/Checkout';
import MisPedidos from './pages/MisPedidos';
import ProtectedRoute from './components/ProtectedRoute';
import Terminos from './pages/Legal/Terminos';
import Privacidad from './pages/Legal/Privacidad';
import Uso from './pages/Legal/Uso';
import Envio from './pages/Legal/Envio';
import Devoluciones from './pages/Legal/Devoluciones';
import CatalagoProductos from './pages/CatalagoProductos';
import Promociones from './pages/Promociones';
import PromocionesSeguimiento from './pages/PromocionesSeguimiento';
import Nosotros from './pages/EnlacesFast/Nosotros';
import Servicios from './pages/servicios';
import Blog from './pages/Blog';
import Clientes from './pages/empleado/Clientes';
import PerfilEmpleado from './pages/empleado/PerfilEmpleado';
import PerfilCliente from './pages/cliente/PerfilCliente';
import PerfilAdmin from './pages/admin/PerfilAdmin';
import BlogAdmin from './pages/admin/BlogAdmin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Inventario from './pages/admin/Inventario';
import Pedidos from './pages/admin/Pedidos';
import ControlUsuarios from './pages/admin/ControlUsuarios';
import HistorialVentas from './pages/admin/HistorialVentas';
import RegistrarProductos from './pages/admin/RegistrarProductos';
import HistorialPagos from './pages/admin/HistorialPagos';
import Repartos from './pages/admin/Repartos';
import Historial from './pages/cliente/Historial';
import CatalogoCliente from './pages/cliente/CatalogoCliente';
import Carrito from './pages/cliente/Carrito';
import OfertasCliente from './pages/cliente/OfertasCliente';
import InventarioEmpleado from './pages/empleado/InventarioEmpleado';
import PedidosEmpleado from './pages/empleado/PedidosEmpleado';
import VentaTienda from './pages/empleado/VentaTienda';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<CatalagoProductos />} />
        <Route path="/promociones" element={<Promociones />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/blog" element={<Blog />} />
        
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registrar />} />
        <Route path="/restablecer" element={<RestablecerContra />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Legal Pages */}
        <Route path="/legal/terminos" element={<Terminos />} />
        <Route path="/legal/privacidad" element={<Privacidad />} />
        <Route path="/legal/uso" element={<Nosotros />} />
        <Route path="/legal/envio" element={<Envio />} />
        <Route path="/legal/devoluciones" element={<Devoluciones />} />


        <Route path="/checkout" element={
          <ProtectedRoute rolesPermitidos={['admin', 'empleado', 'cliente']}>
            <Checkout />
        </ProtectedRoute>
        } />

        <Route path="/mis-pedidos" element={
          <ProtectedRoute rolesPermitidos={['admin', 'empleado', 'cliente']}>
            <Historial />
          </ProtectedRoute>
        } />

        <Route path="/cliente/pedidos" element={
          <ProtectedRoute rolesPermitidos={['admin', 'empleado', 'cliente']}>
            <Historial />
          </ProtectedRoute>
        } />

        {/* Ruta Solo Admin (Rol 1) */}
        <Route path="/admin" element={
          <ProtectedRoute rolesPermitidos={['admin']}>
            <h1>Panel de Administración e Inventario</h1>
          </ProtectedRoute>
        } />

        <Route path="/admin/perfil" element={
          <ProtectedRoute rolesPermitidos={['admin']}>
            <PerfilAdmin />
          </ProtectedRoute>
        } />

        {/* Gestión de Promociones - Solo Admin */}
        <Route path="/admin/promociones" element={
          <ProtectedRoute rolesPermitidos={['admin']}>
            <PromocionesSeguimiento />
          </ProtectedRoute>
        } />

        {/* Gestión del Blog - Solo Admin */}
        <Route path="/admin/blog" element={
          <ProtectedRoute rolesPermitidos={['admin']}>
            <BlogAdmin />
          </ProtectedRoute>
        } />

        {/* Dashboard Global - Solo Admin */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute rolesPermitidos={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin/inventario" element={
          <ProtectedRoute rolesPermitidos={['admin']}>
            <Inventario />
          </ProtectedRoute>
        } />

        <Route path="/admin/pedidos" element={
          <ProtectedRoute rolesPermitidos={['admin']}>
            <Pedidos />
          </ProtectedRoute>
        } />

        <Route path="/admin/usuarios" element={
          <ProtectedRoute rolesPermitidos={['admin']}>
            <ControlUsuarios />
          </ProtectedRoute>
        } />

        <Route path="/admin/ventas" element={
          <ProtectedRoute rolesPermitidos={['admin']}>
            <HistorialVentas />
          </ProtectedRoute>
        } />

        <Route path="/admin/productos/nuevo" element={
          <ProtectedRoute rolesPermitidos={['admin']}>
            <RegistrarProductos />
          </ProtectedRoute>
        } />

        <Route path="/admin/pagos" element={
          <ProtectedRoute rolesPermitidos={['admin']}>
            <HistorialPagos />
          </ProtectedRoute>
        } />

        <Route path="/admin/repartos" element={
          <ProtectedRoute rolesPermitidos={['admin']}>
            <Repartos />
          </ProtectedRoute>
        } />

        {/* Dashboard de Clientes - Empleado y Admin */}
        <Route path="/empleado/clientes" element={
          <ProtectedRoute rolesPermitidos={['admin', 'empleado']}>
            <Clientes />
          </ProtectedRoute>
        } />

        <Route path="/empleado/inventario" element={
          <ProtectedRoute rolesPermitidos={['admin', 'empleado']}>
            <InventarioEmpleado />
          </ProtectedRoute>
        } />

        <Route path="/empleado/pedidos" element={
          <ProtectedRoute rolesPermitidos={['admin', 'empleado']}>
            <PedidosEmpleado />
          </ProtectedRoute>
        } />

        <Route path="/empleado/punto-de-venta" element={
          <ProtectedRoute rolesPermitidos={['admin', 'empleado']}>
            <VentaTienda />
          </ProtectedRoute>
        } />
        {/* Redirección automática: Si entras a /admin, te manda al Dashboard */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Perfil del Empleado */}
        <Route path="/empleado/perfil" element={
          <ProtectedRoute rolesPermitidos={['admin', 'empleado']}>
            <PerfilEmpleado />
          </ProtectedRoute>
        } />
        {/* Perfil del Cliente */}
        <Route path="/cliente/perfil" element={
          <ProtectedRoute rolesPermitidos={['admin', 'empleado', 'cliente']}>
            <PerfilCliente />
          </ProtectedRoute>
        } />
        <Route path="/cliente/catalogo" element={
          <ProtectedRoute rolesPermitidos={['admin', 'empleado', 'cliente']}>
            <CatalogoCliente />
          </ProtectedRoute>
        } />

        <Route path="/cliente/ofertas" element={
          <ProtectedRoute rolesPermitidos={['admin', 'empleado', 'cliente']}>
            <OfertasCliente />
          </ProtectedRoute>
        } />

        <Route path="/cliente/carrito" element={
          <ProtectedRoute rolesPermitidos={['admin', 'empleado', 'cliente']}>
            <Carrito />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;