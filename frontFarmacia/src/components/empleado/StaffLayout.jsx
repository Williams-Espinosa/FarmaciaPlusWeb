import React, { useState, useEffect } from 'react';
import { 
    Briefcase,
    Users,
    ShoppingCart,
    Package,
    UserCircle,
    LogOut,
    Menu,
    X,
    User,
    ShieldCheck,
    Truck
} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../../services/api';

const StaffLayout = ({ children, title }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [perfil, setPerfil] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const res = await api.get('/usuarios/perfil');
                setPerfil(res.data);
            } catch (err) {
                console.error('Error fetching staff profile:', err);
            }
        };
        fetchPerfil();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const employeeLinks = [
        { name: 'Punto de Venta', path: '/empleado/punto-de-venta', icon: ShoppingCart },
        { name: 'Dashboard Clientes', path: '/empleado/clientes', icon: Users },
        { name: 'Gestión de Pedidos', path: '/empleado/pedidos', icon: Truck },
        { name: 'Control de Inventario', path: '/empleado/inventario', icon: Package },
        { name: 'Mi Cuenta', path: '/empleado/perfil', icon: UserCircle },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex">
            
            {/* Overlay */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-blue-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Sidebar Drawer */}
            <aside className={`fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-[70] transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] border-r border-slate-100 flex flex-col`}>
                <div className="p-8 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-600 p-2.5 rounded-[1.25rem] shadow-lg shadow-blue-100">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-black text-2xl text-slate-900 tracking-tighter italic">Staff<span className="text-blue-600">Portal</span></span>
                        </div>
                        <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg transition">
                            <X className="w-6 h-6 text-slate-500" />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                        {employeeLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all group ${
                                    isActive(link.path) 
                                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' 
                                    : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                                }`}
                            >
                                <link.icon className={`w-5 h-5 ${isActive(link.path) ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                                <span className="flex-1">{link.name}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-auto pt-8">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-3 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-sm"
                        >
                            <LogOut className="w-4 h-4" /> CERRAR SESIÓN
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 h-20 flex items-center px-8">
                    <button 
                        onClick={() => setIsMenuOpen(true)}
                        className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-slate-900 hover:text-white transition shadow-sm"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <h2 className="ml-6 text-xl font-black text-slate-900 tracking-tight">{title || 'Panel Operativo'}</h2>

                    <div className="ml-auto flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Colaborador</p>
                            <p className="text-xs font-black text-blue-600 leading-none uppercase tracking-tighter italic">
                                {perfil?.nombre || 'Verificando...'}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm relative overflow-hidden group">
                           <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                           <ShieldCheck className="w-6 h-6 relative z-10 group-hover:text-white transition-colors" />
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default StaffLayout;
