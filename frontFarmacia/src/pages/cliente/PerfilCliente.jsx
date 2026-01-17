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
    Edit2,
    UserCircle,
    ArrowUpRight,
    ShoppingBag,
    History,
    ChevronRight,
    Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CustomerLayout from '../../components/cliente/CustomerLayout';
import api, { getFileUrl } from '../../services/api';

const PerfilCliente = () => {
    const [perfil, setPerfil] = useState(null);
    const [productosRecientes, setProductosRecientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ nombre: '', telefono: '', direccion: '' });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const [perfilRes, productosRes] = await Promise.all([
                    api.get('/usuarios/perfil'),
                    api.get('/pedidos/mis/productos')
                ]);

                setPerfil(perfilRes.data);
                setProductosRecientes(productosRes.data.slice(0, 6));
                setEditForm({
                    nombre: perfilRes.data.nombre,
                    telefono: perfilRes.data.telefono || '',
                    direccion: perfilRes.data.direccion || ''
                });
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('No pudimos cargar tu información personal.');
            } finally {
                setLoading(false);
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
            setError('Error al guardar cambios.');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !perfil) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 text-center">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md">
                    <AlertTriangle className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
                    <p className="text-slate-900 font-bold mb-4">{error || 'Ocurrió un error al cargar.'}</p>
                    <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold">REINTENTAR</button>
                </div>
            </div>
        );
    }

    return (
        <CustomerLayout title="Mi Cuenta Master">
            <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
                
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden shadow-2xl shadow-indigo-200">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -mr-48 -mt-48"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-8 text-center md:text-left">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-md p-1 border border-white/30">
                                    <div className="w-full h-full rounded-[1.25rem] bg-white flex items-center justify-center">
                                        <UserCircle className="w-20 h-20 text-indigo-600" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-400 border-4 border-white rounded-full flex items-center justify-center shadow-lg">
                                    <Star className="w-5 h-5 text-white fill-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-4xl sm:text-5xl font-black text-white mb-2 leading-tight">
                                    ¡Hola, {perfil.nombre.split(' ')[0]}!
                                </h1>
                                <p className="text-indigo-100 font-bold flex items-center justify-center md:justify-start gap-2">
                                    Es un gusto verte de nuevo en FarmaPlus
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    <div className="space-y-8">
                        {/* Info Card */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                                <User className="w-4 h-4 text-indigo-600" /> {isEditing ? 'Actualizando' : 'Mis Datos'}
                            </h3>
                            
                            {!isEditing ? (
                                <>
                                    <div className="space-y-5">
                                        <div className="group">
                                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Email</p>
                                            <p className="text-base font-bold text-slate-900 flex items-center gap-3 truncate">
                                                <Mail className="w-4 h-4 text-slate-400" /> {perfil.email}
                                            </p>
                                        </div>
                                        <div className="group">
                                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Teléfono</p>
                                            <p className="text-base font-bold text-slate-900 flex items-center gap-3">
                                                <Phone className="w-4 h-4 text-slate-400" /> {perfil.telefono || 'No registrado'}
                                            </p>
                                        </div>
                                        <div className="group">
                                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Localidad de Envío</p>
                                            <p className="text-base font-bold text-slate-900 flex items-center gap-3">
                                                <MapPin className="w-4 h-4 text-slate-400" /> {perfil.direccion || 'Sin dirección guardada'}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="w-full mt-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 uppercase tracking-widest"
                                    >
                                        <Edit2 className="w-4 h-4" /> Actualizar Datos
                                    </button>
                                </>
                            ) : (
                                <form onSubmit={handleUpdatePerfil} className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1 block pl-1">Tu Nombre</label>
                                        <input 
                                            type="text"
                                            value={editForm.nombre}
                                            onChange={(e) => setEditForm({...editForm, nombre: e.target.value})}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1 block pl-1">Teléfono</label>
                                        <input 
                                            type="text"
                                            value={editForm.telefono}
                                            onChange={(e) => setEditForm({...editForm, telefono: e.target.value})}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1 block pl-1">Dirección de Entrega</label>
                                        <input 
                                            type="text"
                                            value={editForm.direccion}
                                            onChange={(e) => setEditForm({...editForm, direccion: e.target.value})}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest">Cancelar</button>
                                        <button type="submit" disabled={updating} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest">{updating ? '...' : 'Guardar'}</button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Gold Badge Card */}
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 blur-[60px] rounded-full -mr-16 -mt-16"></div>
                            <h3 className="text-xs font-black uppercase tracking-widest mb-4 opacity-50 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-indigo-400" /> Estatus FarmaPlus
                            </h3>
                            <p className="text-lg font-black italic mb-2">Miembro Distinguido</p>
                            <p className="text-xs text-indigo-200 font-bold leading-relaxed mb-6">Disfrutas de atención prioritaria y descuentos de temporada exclusivos.</p>
                            <div className="flex items-center gap-2 text-[10px] font-black text-yellow-400">
                                <CheckCircle className="w-3.5 h-3.5" /> BENEFICIOS ACTIVADOS
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 min-h-[500px]">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 border border-indigo-100">
                                        <Activity className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900">Compras Recientes</h2>
                                        <p className="text-slate-500 text-sm font-bold">Tus artículos favoritos</p>
                                    </div>
                                </div>
                                <Link to="/cliente/pedidos" className="text-indigo-600 text-[10px] font-black flex items-center gap-2 hover:translate-x-1 transition-all uppercase tracking-widest">
                                    Historial Completo <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            </div>

                            {productosRecientes.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {productosRecientes.map((producto) => (
                                        <div key={producto.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-lg transition-all group">
                                            <div className="w-16 h-16 rounded-xl bg-white p-2 border border-slate-200 flex-shrink-0 group-hover:scale-110 transition">
                                                <img src={getFileUrl(producto.imagen_url) || 'https://via.placeholder.com/150'} alt={producto.nombre} className="w-full h-full object-contain mix-blend-multiply" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-black text-slate-900 line-clamp-1">{producto.nombre}</p>
                                                <p className="text-xs font-black text-indigo-600 mt-1">${producto.price || producto.precio}</p>
                                                <div className="flex items-center gap-1 text-[8px] text-slate-400 font-black mt-1 uppercase tracking-tighter">
                                                    <History className="w-3 h-3" /> Pedir de nuevo
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[2rem]">
                                    <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-400 font-bold">Aún no has realizado pedidos.</p>
                                    <Link to="/cliente/catalogo" className="inline-block mt-4 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs">Ir a la Tienda</Link>
                                </div>
                            )}

                            {/* Banner Informativo */}
                            <div className="mt-12 bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="text-center md:text-left">
                                        <h3 className="text-xl font-black mb-2 italic">Ahorra en tu próxima compra</h3>
                                        <p className="text-indigo-100 text-xs font-bold max-w-xs">¡Suscríbete y recibe cupones exclusivos!</p>
                                    </div>
                                    <button className="bg-white text-indigo-900 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest">Suscribirme</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </CustomerLayout>
    );
};

export default PerfilCliente;
