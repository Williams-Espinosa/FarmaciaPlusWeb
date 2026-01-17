import React, { useState, useEffect } from 'react';
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Shield, 
    Activity, 
    Clock, 
    Edit2,
    CheckCircle,
    Calendar,
    Star
} from 'lucide-react';
import api from '../../services/api';
import StaffLayout from '../../components/empleado/StaffLayout';
import LoadingScreen from '../../components/common/LoadingScreen';

const PerfilEmpleado = () => {
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ nombre: '', telefono: '', direccion: '' });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const response = await api.get('/usuarios/perfil');
                setPerfil(response.data);
                setEditForm({
                    nombre: response.data.nombre,
                    telefono: response.data.telefono || '',
                    direccion: response.data.direccion || ''
                });
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('No pudimos cargar tu perfil corporativo.');
            } finally {
                setLoading(false);
            }
        };

        fetchPerfil();
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
            setError('Error al actualizar datos. Intente de nuevo.');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <LoadingScreen message="Autenticando credenciales de personal..." />;

    if (error || !perfil) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 text-center">
                <div className="bg-white p-12 rounded-[3.5rem] border border-red-100 shadow-2xl max-w-md">
                    <Shield className="w-16 h-16 text-red-500 mx-auto mb-6 opacity-20" />
                    <p className="text-slate-900 font-black mb-6 uppercase tracking-widest text-xs italic">{error || 'Fallo en la conexión segura.'}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full bg-blue-600 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-900 transition-all shadow-xl"
                    >
                        REINTENTAR ACCESO
                    </button>
                </div>
            </div>
        );
    }

    return (
        <StaffLayout title="Perfil Operativo">
            <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
                
                {/* Hero Profile Banner */}
                <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-blue-100">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -mr-48 -mt-48"></div>
                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            <div className="relative group">
                                <div className="w-40 h-40 rounded-[2.5rem] bg-white/10 backdrop-blur-md p-1 border border-white/20 relative overflow-hidden">
                                     <div className="w-full h-full rounded-[2.1rem] bg-white flex items-center justify-center shadow-inner">
                                        <User className="w-24 h-24 text-blue-800" />
                                     </div>
                                </div>
                                <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-emerald-500 border-4 border-white rounded-2xl flex items-center justify-center shadow-xl">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="text-center md:text-left space-y-3">
                                <div className="inline-flex items-center gap-2 bg-blue-600/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                                    <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Colaborador Verificado</span>
                                </div>
                                <h1 className="text-5xl font-black italic tracking-tighter leading-none uppercase">
                                    {perfil?.nombre?.split(' ')[0] || 'Personal'} <br/> <span className="text-blue-400">{perfil?.nombre?.split(' ').slice(1).join(' ') || 'FarmaPlus'}</span>
                                </h1>
                                <p className="text-blue-200 font-bold flex items-center justify-center md:justify-start gap-2 text-sm uppercase tracking-widest">
                                    <Clock className="w-4 h-4" /> Jornada en curso
                                </p>
                            </div>
                        </div>

                        <div className="hidden md:flex justify-end pr-8">
                             <div className="grid grid-cols-2 gap-4">
                                 <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
                                    <p className="text-[10px] font-black text-blue-300 uppercase mb-1">Días en Staff</p>
                                    <p className="text-2xl font-black">{Math.floor((new Date() - new Date(perfil.created_at)) / (1000 * 60 * 60 * 24))}</p>
                                 </div>
                                 <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md text-emerald-400">
                                    <p className="text-[10px] font-black uppercase mb-1">Estatus</p>
                                    <p className="text-2xl font-black">ACTIVO</p>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Information Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 group">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-3">
                                <Shield className="w-5 h-5 text-blue-600" /> {isEditing ? 'Configurando Perfil' : 'Datos del Colaborador'}
                            </h3>
                            
                            {!isEditing ? (
                                <div className="space-y-6">
                                    <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-50 group-hover:bg-white group-hover:shadow-lg transition-all duration-500">
                                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-2">Canal de Comunicación</p>
                                        <p className="text-sm font-black text-slate-900 flex items-center gap-4">
                                            <Mail className="w-5 h-5 text-slate-300" /> {perfil.email}
                                        </p>
                                    </div>
                                    <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-50 group-hover:bg-white group-hover:shadow-lg transition-all duration-500">
                                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-2">Contacto Directo</p>
                                        <p className="text-sm font-black text-slate-900 flex items-center gap-4">
                                            <Phone className="w-5 h-5 text-slate-300" /> {perfil.telefono || 'Sin registrar'}
                                        </p>
                                    </div>
                                    <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-50 group-hover:bg-white group-hover:shadow-lg transition-all duration-500">
                                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-2">Sede Asignada</p>
                                        <p className="text-sm font-black text-slate-900 flex items-center gap-4">
                                            <MapPin className="w-5 h-5 text-slate-300" /> {perfil.direccion || 'FarmaPlus Matriz'}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="w-full mt-10 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95"
                                    >
                                        <Edit2 className="w-4 h-4" /> GESTIONAR MI CUENTA
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleUpdatePerfil} className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest pl-2">Tu Identidad</label>
                                        <input 
                                            type="text"
                                            value={editForm.nombre}
                                            onChange={(e) => setEditForm({...editForm, nombre: e.target.value})}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-black text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest pl-2">Teléfono Personal</label>
                                        <input 
                                            type="text"
                                            value={editForm.telefono}
                                            onChange={(e) => setEditForm({...editForm, telefono: e.target.value})}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-black text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest pl-2">Domicilio Registrado</label>
                                        <input 
                                            type="text"
                                            value={editForm.direccion}
                                            onChange={(e) => setEditForm({...editForm, direccion: e.target.value})}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-black text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner"
                                        />
                                    </div>
                                    <div className="flex gap-4 pt-6">
                                        <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">CANCELAR</button>
                                        <button type="submit" disabled={updating} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-slate-900 transition-all active:scale-95">
                                            {updating ? '...' : 'GUARDAR'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Security Badge */}
                        <div className="bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full -mr-16 -mt-16"></div>
                             <h3 className="text-[9px] font-black uppercase tracking-[0.3em] mb-6 opacity-40">Seguridad Staff</h3>
                             <p className="text-blue-100 font-bold text-sm leading-relaxed mb-8 italic">Acceso restringido a áreas operativas. Recuerda cerrar sesión al desconectarte.</p>
                             <div className="flex items-center gap-3 text-[10px] font-black text-emerald-400">
                                 <Shield className="w-4 h-4" /> CONEXIÓN CIFRADA ACTIVA
                             </div>
                        </div>
                    </div>

                    {/* Operative Stats */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-slate-100 min-h-[400px] flex flex-col">
                            <div className="flex items-center gap-6 mb-12">
                                <div className="p-5 bg-blue-50 rounded-[2rem] text-blue-600 border border-blue-100">
                                    <Activity className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 italic">Historial de <span className="text-blue-600">Permanencia</span></h2>
                                    <p className="text-slate-400 font-bold text-sm">Resumen de vinculación con FarmaPlus</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                                <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex flex-col justify-center gap-4 group hover:bg-white hover:shadow-2xl transition-all duration-700">
                                    <div className="flex items-center gap-4">
                                        <Calendar className="w-10 h-10 text-blue-200 group-hover:text-blue-600 transition-colors" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha de Alta</p>
                                    </div>
                                    <p className="text-3xl font-black text-slate-900 tracking-tighter italic">
                                        {new Date(perfil.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                                <div className="p-8 rounded-[2.5rem] bg-blue-50/50 border border-blue-100 flex flex-col justify-center gap-4 group hover:bg-white hover:shadow-2xl transition-all duration-700">
                                    <div className="flex items-center gap-4">
                                        <Shield className="w-10 h-10 text-emerald-200 group-hover:text-emerald-500 transition-colors" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado Corporativo</p>
                                    </div>
                                    <p className="text-3xl font-black text-emerald-600 tracking-tighter italic uppercase">Personal Activo</p>
                                </div>
                            </div>

                            {/* Motivation Section */}
                            <div className="mt-12 bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-blue-600 translate-x-full group-hover:translate-x-0 transition-transform duration-700 opacity-20"></div>
                                <div className="relative z-10 text-center md:text-left">
                                    <h3 className="text-2xl font-black italic mb-2 tracking-tight">Tu esfuerzo importa</h3>
                                    <p className="text-blue-100/60 font-bold text-xs max-w-sm uppercase tracking-widest">"La excelencia no es un acto, es un hábito diario."</p>
                                </div>
                                <button className="relative z-10 bg-white text-slate-900 px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-400 hover:text-white transition-all active:scale-95 shadow-2xl">
                                    LEER RECOMENDACIONES
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Metadata */}
                <div className="pt-12 border-t border-slate-100 text-center">
                    <p className="text-[9px] text-slate-300 font-black tracking-[0.4em] uppercase">
                        Terminal de Personal FarmaPlus • v2.1.0 • Acceso Protegido
                    </p>
                </div>
            </div>
        </StaffLayout>
    );
};

export default PerfilEmpleado;
