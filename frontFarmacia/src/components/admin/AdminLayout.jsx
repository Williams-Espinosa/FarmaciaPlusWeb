import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { Menu, User } from 'lucide-react';
import api from '../../services/api';

const AdminLayout = ({ children, title }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [perfil, setPerfil] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const res = await api.get('/usuarios/perfil');
                setPerfil(res.data);
            } catch (err) {
                console.error('Error fetching admin profile:', err);
            }
        };
        fetchPerfil();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex">
            <AdminSidebar 
                isMenuOpen={isMenuOpen} 
                setIsMenuOpen={setIsMenuOpen} 
                handleLogout={handleLogout} 
            />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-6 py-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setIsMenuOpen(true)}
                                className="p-2.5 hover:bg-slate-100 rounded-xl transition text-blue-600 bg-blue-50"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight ml-2">
                                {title || 'Panel de Administración'}
                            </h1>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-sm font-black text-slate-900 line-clamp-1">{perfil?.nombre || 'Administrador'}</span>
                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Master Admin</span>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-200 flex items-center justify-center shadow-lg shadow-blue-100">
                                <User className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                <main className="flex-1 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
