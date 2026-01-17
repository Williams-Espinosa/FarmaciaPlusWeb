import React, { useState, useEffect } from 'react';
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Shield, 
    Activity, 
    AlertTriangle, 
    CheckCircle, 
    Clock, 
    Edit2, 
    UserCircle,
    ArrowUpRight,
    ShoppingCart,
    PlusCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingScreen from '../../components/common/LoadingScreen';

const PerfilAdmin = () => {
    const [perfil, setPerfil] = useState(null);
    const [actividad, setActividad] = useState({ pedidos: [], stockBajo: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ nombre: '', telefono: '', direccion: '' });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchDatos = async () => {
            const startTime = Date.now();
            try {
                const [perfilRes, pedidosRes, productosRes] = await Promise.all([
                    api.get('/usuarios/perfil'),
                    api.get('/pedidos'),
                    api.get('/productos')
                ]);

                const pedidosRecientes = pedidosRes.data.slice(0, 5);
                const stockBajo = productosRes.data.filter(p => p.stock < 10).slice(0, 5);

                setPerfil(perfilRes.data);
                setEditForm({
                    nombre: perfilRes.data.nombre,
                    telefono: perfilRes.data.telefono || '',
                    direccion: perfilRes.data.direccion || ''
                });
                setActividad({ pedidos: pedidosRecientes, stockBajo });
            } catch (err) {
                console.error('Error fetching admin data:', err);
                setError('No se pudo cargar la información administrativa.');
            } finally {
                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, 800 - elapsedTime);
                setTimeout(() => setLoading(false), remainingTime);
            }
        };

        fetchDatos();
    }, []);

    const handleUpdatePerfil = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError(null);
        try {
            const res = await api.put('/usuarios/perfil', editForm);
            setPerfil(res.data);
            setIsEditing(false);
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const updatedUser = { ...currentUser, nombre: res.data.nombre };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('No se pudo actualizar el perfil. Reintenta más tarde.');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <LoadingScreen message="Sincronizando perfil administrativo..." />;
    }

    if (error || !perfil) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 text-center">
                <div className="bg-white p-8 rounded-3xl border border-red-100 shadow-xl max-w-md">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-slate-900 font-bold mb-4">{error || 'No se pudo cargar el perfil.'}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <AdminLayout title="FarmaPlus Admin">
            <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-[2.5rem] p-8 sm:p-12 mb-12 relative overflow-hidden shadow-2xl shadow-blue-200">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -mr-48 -mt-48"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-8 text-center md:text-left">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-md p-1 border border-white/30">
                                    <div className="w-full h-full rounded-[1.25rem] bg-white flex items-center justify-center">
                                        <UserCircle className="w-20 h-20 text-blue-600" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
                            </div>
                            <div>
                                <h1 className="text-4xl sm:text-5xl font-black text-white mb-2 leading-tight">
                                    ¡Bienvenido, <br className="sm:hidden" /> {perfil.nombre.split(' ')[0]}!
                                </h1>
                                <p className="text-blue-100 font-bold flex items-center justify-center md:justify-start gap-2">
                                    <Clock className="w-4 h-4" /> Actividad central registrada hace 2m
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Col */}
                    <div className="space-y-8">
                        {/* Information Card */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-600" /> {isEditing ? 'Editando Perfil' : 'Información Privada'}
                            </h3>
                            
                            {!isEditing ? (
                                <>
                                    <div className="space-y-5">
                                        <div className="group">
                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Email Principal</p>
                                            <p className="text-base font-bold text-slate-900 flex items-center gap-3">
                                                <Mail className="w-4 h-4 text-slate-400" /> {perfil.email}
                                            </p>
                                        </div>
                                        <div className="group">
                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Contacto Corporativo</p>
                                            <p className="text-base font-bold text-slate-900 flex items-center gap-3">
                                                <Phone className="w-4 h-4 text-slate-400" /> {perfil.telefono || 'No proporcionado'}
                                            </p>
                                        </div>
                                        <div className="group">
                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Sede de Operación</p>
                                            <p className="text-base font-bold text-slate-900 flex items-center gap-3">
                                                <MapPin className="w-4 h-4 text-slate-400" /> {perfil.direccion || 'Sede Central FarmaPlus'}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="w-full mt-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                                    >
                                        <Edit2 className="w-4 h-4" /> EDITAR PERFIL
                                    </button>
                                </>
                            ) : (
                                <form onSubmit={handleUpdatePerfil} className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 block">Nombre Completo</label>
                                        <input 
                                            type="text"
                                            value={editForm.nombre}
                                            onChange={(e) => setEditForm({...editForm, nombre: e.target.value})}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none font-bold text-sm"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 block">Teléfono</label>
                                        <input 
                                            type="text"
                                            value={editForm.telefono}
                                            onChange={(e) => setEditForm({...editForm, telefono: e.target.value})}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none font-bold text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 block">Dirección / Sede</label>
                                        <input 
                                            type="text"
                                            value={editForm.direccion}
                                            onChange={(e) => setEditForm({...editForm, direccion: e.target.value})}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none font-bold text-sm"
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button 
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-xs hover:bg-slate-200 transition"
                                            disabled={updating}
                                        >
                                            CANCELAR
                                        </button>
                                        <button 
                                            type="submit"
                                            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black text-xs hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                                            disabled={updating}
                                        >
                                            {updating ? 'GUARDANDO...' : 'GUARDAR'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/20 blur-[60px] rounded-full -mb-16 -mr-16"></div>
                            <h3 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-2 opacity-60">
                                <Shield className="w-4 h-4 text-blue-400" /> Seguridad de Nodo
                            </h3>
                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <p className="text-sm font-bold">2FA Security</p>
                                    </div>
                                    <span className="text-[10px] font-black bg-blue-500 text-white px-2 py-0.5 rounded-lg">ON</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <p className="text-sm font-bold">Alertas Push</p>
                                    </div>
                                    <span className="text-[10px] font-black bg-green-500 text-white px-2 py-0.5 rounded-lg">UP</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Col */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 border border-blue-100">
                                        <Activity className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900">Actividad Reciente</h2>
                                        <p className="text-slate-500 text-sm font-bold">Monitor central de operaciones</p>
                                    </div>
                                </div>
                                <Link to="/admin/pedidos" className="text-blue-600 text-xs font-black flex items-center gap-2 hover:translate-x-1 transition-all">
                                    GESTIONAR PEDIDOS <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {actividad.pedidos.length > 0 ? (
                                    actividad.pedidos.map(pedido => (
                                        <div key={pedido.id} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-lg transition-all group">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                                                    <ShoppingCart className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">Pedido #{pedido.id}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase">
                                                        {new Date(pedido.fecha).toLocaleDateString()} • {pedido.usuario_nombre || 'Suministro Interno'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-base font-black text-blue-600">${pedido.total}</p>
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase border ${
                                                    pedido.estado_pago === 'pagado' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                                                }`}>
                                                    {pedido.estado_pago}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-16 text-slate-400 font-bold border-2 border-dashed border-slate-100 rounded-3xl">
                                        No se han detectado movimientos recientes.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white border-2 border-red-50 p-8 rounded-[2.5rem]">
                            <h3 className="text-xs font-black text-red-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" /> Alertas de Abastecimiento
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {actividad.stockBajo.length > 0 ? (
                                    actividad.stockBajo.map(prod => (
                                        <div key={prod.id} className="p-5 rounded-2xl bg-red-50/30 border border-red-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                                            <div>
                                                <p className="text-sm font-black text-slate-900">{prod.nombre}</p>
                                                <p className="text-[10px] text-red-500 font-black">QUEDAN: {prod.stock} UNIDADES</p>
                                            </div>
                                            <Link to="/admin/inventario" className="p-2 text-slate-400 hover:text-red-500 hover:scale-125 transition">
                                                <PlusCircle className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 p-6 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                                            <CheckCircle className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-emerald-900 italic">Suministro Estable</p>
                                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Todos los productos cuentan con stock suficiente.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="mt-20 pt-12 border-t border-slate-200 text-center">
                    <p className="text-[10px] text-slate-400 font-black tracking-[0.3em] uppercase">
                        Admin Terminal FarmaPlus • Panel de Control v4.0.1 • 2025
                    </p>
                </footer>
            </main>
        </AdminLayout>
    );
};

export default PerfilAdmin;
