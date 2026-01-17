import React from 'react';
import { 
    Shield, 
    X, 
    LogOut,
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    FileText,
    Percent,
    TrendingUp,
    CreditCard,
    Truck,
    PlusCircle,
    Home
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = ({ isMenuOpen, setIsMenuOpen, handleLogout }) => {
    const location = useLocation();
    
    const adminLinks = [
        { name: 'Inicio', path: '/admin/perfil', icon: Home },
        { name: 'Dashboard Global', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Inventario', path: '/admin/inventario', icon: Package },
        { name: 'Gestión de Pedidos', path: '/admin/pedidos', icon: ShoppingCart },
        { name: 'Control de Usuarios', path: '/admin/usuarios', icon: Users },
        { name: 'Blog Corporativo', path: '/admin/blog', icon: FileText },
        { name: 'Promociones', path: '/admin/promociones', icon: Percent },
        { name: 'Ventas Realizadas', path: '/admin/ventas', icon: TrendingUp },
        { name: 'Historial de Pagos', path: '/admin/pagos', icon: CreditCard },
        { name: 'Logística de Repartos', path: '/admin/repartos', icon: Truck },
        { name: 'Añadir Producto', path: '/admin/productos/nuevo', icon: PlusCircle },
    ];

    return (
        <>
            {/* Hamburger Menu Overlay */}
            {/* Drawer Overlay */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-blue-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Sidebar Drawer */}
            <div className={`fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-[70] transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] border-r border-slate-100 flex flex-col`}>
                <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-black text-xl text-slate-900 tracking-tight">AdminPanel</span>
                        </div>
                        <button onClick={() => setIsMenuOpen(false)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition">
                            <X className="w-6 h-6 text-slate-500" />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
                        {adminLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link 
                                    key={link.name} 
                                    to={link.path}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all group ${
                                        isActive 
                                            ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-100' 
                                            : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <link.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}`} />
                                    <span className="text-sm">{link.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-slate-100">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-3 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-xs hover:bg-red-100 transition shadow-sm"
                        >
                            <LogOut className="w-4 h-4" /> CERRAR SESIÓN
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminSidebar;
