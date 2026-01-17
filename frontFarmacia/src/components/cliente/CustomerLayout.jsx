import React, { useState } from 'react';
import { 
    Home, 
    ShoppingBag, 
    Package, 
    Tag, 
    BookOpen, 
    UserCircle, 
    LogOut,
    Menu,
    X,
    User,
    ShoppingBag as LogoIcon
} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const CustomerLayout = ({ children, title }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const clientLinks = [
        { name: 'Inicio', path: '/', icon: Home },
        { name: 'Catálogo', path: '/cliente/catalogo', icon: ShoppingBag },
        { name: 'Ofertas', path: '/cliente/ofertas', icon: Tag },
        { name: 'Mi Carrito', path: '/cliente/carrito', icon: LogoIcon },
        { name: 'Mis Pedidos', path: '/cliente/pedidos', icon: Package },
        { name: 'Mi Cuenta', path: '/cliente/perfil', icon: UserCircle },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex">
            
            {/* Overlay */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Sidebar Drawer */}
            <aside className={`fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-[70] transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] border-r border-slate-100 flex flex-col`}>
                <div className="p-8 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-4">
                            <div className="bg-indigo-600 p-2.5 rounded-[1.25rem] shadow-lg shadow-indigo-100">
                                <LogoIcon className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-black text-2xl text-slate-900 tracking-tighter italic">Farma<span className="text-indigo-600">Plus</span></span>
                        </div>
                        <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg transition">
                            <X className="w-6 h-6 text-slate-500" />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                        {clientLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all group ${
                                    isActive(link.path) 
                                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                                    : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
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
                            className="w-full flex items-center justify-center gap-3 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
                        >
                            <LogOut className="w-4 h-4" /> Cerrar Sesión
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
                        className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-slate-900 hover:text-white transition shadow-sm"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <h2 className="ml-6 text-xl font-black text-slate-900 tracking-tight">{title}</h2>

                    <div className="ml-auto flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Estatus</p>
                            <p className="text-xs font-black text-indigo-600 leading-none uppercase tracking-tighter italic">Premium Member</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm relative overflow-hidden group">
                           <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                           <User className="w-6 h-6 relative z-10 group-hover:text-white transition-colors" />
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

export default CustomerLayout;
