import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingScreen from '../../components/common/LoadingScreen';
import api from '../../services/api';
import { 
    Users, UserPlus, ShieldCheck, Search, Filter, 
    MoreVertical, Edit2, Trash2, Key, Mail, 
    Phone, MapPin, UserCheck, Timer, TrendingUp,
    Award, Star, Heart, X, Check, ShieldAlert
} from 'lucide-react';

const ControlUsuarios = () => {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('empleados'); // 'empleados', 'clientes', 'insights'
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    
    // Form for new user
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        telefono: '',
        direccion: '',
        rol: 'empleado' 
    });

    // Form for editing user
    const [editFormData, setEditFormData] = useState({
        id: '',
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        rol: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/usuarios');
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setTimeout(() => setLoading(false), 800);
        }
    };

    const generatePassword = () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const symbols = "!@#$%^&*()_+";
        const allChars = letters + numbers + symbols;
        
        let password = "";
        // Asegurar al menos uno de cada tipo para máxima seguridad
        password += letters.charAt(Math.floor(Math.random() * letters.length));
        password += numbers.charAt(Math.floor(Math.random() * numbers.length));
        password += symbols.charAt(Math.floor(Math.random() * symbols.length));
        
        for (let i = 0; i < 5; i++) {
            password += allChars.charAt(Math.floor(Math.random() * allChars.length));
        }
        
        // Mezclar los caracteres
        return password.split('').sort(() => 0.5 - Math.random()).join('');
    };

    const handleGenerateForNew = () => {
        const pass = generatePassword();
        setFormData({ ...formData, password: pass });
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/usuarios', formData);
            fetchUsers();
            setIsAddModalOpen(false);
            setFormData({ nombre: '', email: '', password: '', telefono: '', direccion: '', rol: 'empleado' });
        } catch (err) {
            console.error('Error adding user:', err);
            alert('Error al crear usuario.');
        }
    };

    const handleEditClick = (user) => {
        setEditFormData({
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            telefono: user.telefono || '',
            direccion: user.direccion || '',
            rol: user.rol
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/usuarios/${editFormData.id}`, editFormData);
            fetchUsers();
            setIsEditModalOpen(false);
        } catch (err) {
            console.error('Error updating user:', err);
            alert('Error al actualizar el usuario.');
        }
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await api.delete(`/usuarios/${userToDelete.id}`);
            fetchUsers();
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('Error al eliminar el usuario.');
        }
    };

    const handleResetPassword = async (user) => {
        const generatedPass = generatePassword();
        setNewPassword(generatedPass);
        setSelectedUser(user);
        
        try {
            setIsResetModalOpen(true);
            await api.put(`/usuarios/${user.id}/password`, { 
                newPassword: generatedPass
            });
        } catch (err) {
            console.error('Error resetting password:', err);
            alert('Error al restablecer la contraseña en el servidor.');
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        // El backend devuelve 'admin', 'empleado', 'cliente'
        const matchesTab = activeTab === 'empleados' ? (u.rol === 'admin' || u.rol === 'empleado') : (u.rol === 'cliente');
        
        return matchesSearch && matchesTab;
    });

    // Mock Dashboard Data
    const topEmployees = users.filter(u => u.rol === 'empleado').slice(0, 3).map((u, i) => ({ ...u, score: 95 - i * 5 }));
    const topClients = users.filter(u => u.rol === 'cliente').slice(0, 3).map((u, i) => ({ ...u, orders: 15 - i * 3 }));

    if (loading) {
        return <LoadingScreen message="Sincronizando base de datos de personal..." />;
    }

    return (
        <AdminLayout title="Gestión de Usuarios">
            <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
                
                {/* Header Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-20 -mt-20"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight mb-2">Administración de Usuarios</h1>
                            <p className="text-indigo-100 text-sm font-bold max-w-md">Control total sobre roles administrativos, personal de ventas y base de clientes.</p>
                        </div>
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition shadow-lg active:scale-95"
                        >
                            <UserPlus className="w-4 h-4" /> Alta de Usuario
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex p-1.5 bg-slate-100 rounded-[1.5rem] w-fit">
                    <TabButton active={activeTab === 'empleados'} onClick={() => setActiveTab('empleados')} icon={<ShieldCheck />} label="Empleados" />
                    <TabButton active={activeTab === 'clientes'} onClick={() => setActiveTab('clientes')} icon={<Users />} label="Clientes" />
                    <TabButton active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} icon={<TrendingUp />} label="Estrategia" />
                </div>

                {activeTab !== 'insights' ? (
                    <>
                        {/* Table Controls */}
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input 
                                    type="text" 
                                    placeholder={`Buscar ${activeTab}...`} 
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-bold text-sm transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 border border-slate-100 transition"><Filter className="w-5 h-5" /></button>
                            </div>
                        </div>

                        {/* User Table */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Identidad</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Contacto</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Rol / Nivel</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Estado</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Mantenimiento</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-indigo-50/30 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black">
                                                            {user.nombre.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-900 leading-none">{user.nombre}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">ID: FB-{user.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600"><Mail className="w-3 h-3 text-slate-300" /> {user.email}</div>
                                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600"><Phone className="w-3 h-3 text-slate-300" /> {user.telefono || 'Sin registro'}</div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                                                        user.rol === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : 
                                                        user.rol === 'empleado' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                                                        'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    }`}>
                                                        {user.rol === 'admin' ? 'Superior' : user.rol === 'empleado' ? 'Operativo' : 'Cliente'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                                        <span className="text-[10px] font-black text-slate-500 uppercase">Activo</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleResetPassword(user)}
                                                            className="p-3 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition shadow-sm"
                                                            title="Restablecer Password"
                                                        >
                                                            <Key className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleEditClick(user)}
                                                            className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition shadow-sm"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteClick(user)}
                                                            className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition shadow-sm"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Dashboard Section */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* More Active Employees */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 blur-[60px] rounded-full"></div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
                                    <Award className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900">Personal de Alto Rendimiento</h3>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Basado en eficiencia y ventas</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {topEmployees.map((emp, idx) => (
                                    <div key={emp.id} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 group hover:scale-[1.02] transition-transform">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${idx === 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900">{emp.nombre}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">Operador Senior</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="text-sm font-black text-slate-900">{emp.score}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Most Frequent Clients */}
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full"></div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-emerald-500 rounded-2xl text-white shadow-lg shadow-emerald-900/40">
                                    <Heart className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white">Clientes Fidelizados</h3>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Frecuencia de compra histórica</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {topClients.map((client, idx) => (
                                    <div key={client.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-black overflow-hidden">
                                                {client.nombre.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white">{client.nombre}</p>
                                                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-tighter">VIP Member</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-white">{client.orders}</p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase">Compras</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Modal: Alta de Usuario */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsAddModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                <UserPlus className="w-8 h-8 text-indigo-600" /> Registro de Personal
                            </h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleAddUser} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputGroup label="Nombre Completo" icon={<Users />} value={formData.nombre} onChange={(v) => setFormData({...formData, nombre: v})} placeholder="Ej. Carlos Pérez" />
                                <InputGroup label="Correo Electrónico" icon={<Mail />} value={formData.email} onChange={(v) => setFormData({...formData, email: v})} placeholder="ejemplo@farma.com" type="email" />
                                <div className="space-y-2">
                                    <InputGroup label="Contraseña" icon={<Key />} value={formData.password} onChange={(v) => setFormData({...formData, password: v})} type="text" />
                                    <button 
                                        type="button"
                                        onClick={handleGenerateForNew}
                                        className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1 hover:text-indigo-700 transition ml-1"
                                    >
                                        <Sparkles className="w-3 h-3" /> Generar Clave Automática
                                    </button>
                                </div>
                                <InputGroup label="Teléfono" icon={<Phone />} value={formData.telefono} onChange={(v) => setFormData({...formData, telefono: v})} placeholder="+52 ..." />
                                <div className="md:col-span-2">
                                    <InputGroup label="Dirección de Domicilio" icon={<MapPin />} value={formData.direccion} onChange={(v) => setFormData({...formData, direccion: v})} placeholder="Calle, Ciudad, Edo." />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block">Nivel de Acceso</label>
                                    <select 
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-900 transition-all appearance-none"
                                        value={formData.rol}
                                        onChange={(e) => setFormData({...formData, rol: e.target.value})}
                                    >
                                        <option value="admin">Administrador (Full)</option>
                                        <option value="empleado">Empleado (Operativo)</option>
                                        <option value="cliente">Cliente (Acceso Tienda)</option>
                                    </select>
                                </div>
                            </div>
                            <button className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95">
                                CREAR CREDENCIALES
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Password Reset Confirmation */}
            {isResetModalOpen && selectedUser && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsResetModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl text-center animate-in scale-in duration-300">
                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Key className="w-10 h-10 text-indigo-600" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Password Renovado</h3>
                        <p className="text-slate-500 font-bold mb-6">Se ha generado una nueva contraseña para <span className="text-indigo-600">{selectedUser.nombre}</span>.</p>
                        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-slate-200 mb-6 group">
                            <p className="text-xs font-black text-slate-400 uppercase mb-1">Nueva Clave Temporal</p>
                            <p className="text-lg font-black text-indigo-600 tracking-widest select-all">{newPassword}</p>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase justify-center mb-8">
                            <Check className="w-4 h-4" /> Notificación enviada por Email
                        </div>
                        <button 
                            onClick={() => setIsResetModalOpen(false)}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition active:scale-95 shadow-xl shadow-slate-200"
                        >
                            ENTENDIDO
                        </button>
                    </div>
                </div>
            )}

            {/* Modal: Confirmación de Eliminación */}
            {isDeleteModalOpen && userToDelete && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl text-center animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldAlert className="w-10 h-10 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">¿Confirmar Baja?</h3>
                        <p className="text-slate-500 font-bold mb-8">
                            Estás a punto de eliminar a <span className="text-red-500">{userToDelete.nombre}</span>. Esta acción no se puede deshacer.
                        </p>
                        
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={confirmDelete}
                                className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-sm hover:bg-red-700 transition active:scale-95 shadow-xl shadow-red-100 uppercase tracking-widest"
                            >
                                SÍ, ELIMINAR USUARIO
                            </button>
                            <button 
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition active:scale-95 uppercase tracking-widest"
                            >
                                CANCELAR
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal: Editar Usuario */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsEditModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                <Edit2 className="w-8 h-8 text-indigo-600" /> Actualizar Datos
                            </h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateUser} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputGroup label="Nombre Completo" icon={<Users />} value={editFormData.nombre} onChange={(v) => setEditFormData({...editFormData, nombre: v})} placeholder="Ej. Carlos Pérez" />
                                <InputGroup label="Correo Electrónico" icon={<Mail />} value={editFormData.email} onChange={(v) => setEditFormData({...editFormData, email: v})} placeholder="ejemplo@farma.com" type="email" />
                                <InputGroup label="Teléfono" icon={<Phone />} value={editFormData.telefono} onChange={(v) => setEditFormData({...editFormData, telefono: v})} placeholder="+52 ..." />
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block">Nivel de Acceso</label>
                                    <select 
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-900 transition-all appearance-none"
                                        value={editFormData.rol}
                                        onChange={(e) => setEditFormData({...editFormData, rol: e.target.value})}
                                    >
                                        <option value="admin">Administrador (Full)</option>
                                        <option value="empleado">Empleado (Operativo)</option>
                                        <option value="cliente">Cliente (Acceso Tienda)</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 space-y-2 pt-2 border-t border-slate-100">
                                    <div className="flex items-center justify-between mt-2">
                                        <div>
                                            <p className="text-xs font-black text-slate-800">Seguridad de Cuenta</p>
                                            <p className="text-[10px] text-slate-500 font-bold">Genera una nueva contraseña y notifica al usuario.</p>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => handleResetPassword(editFormData)}
                                            className="px-4 py-3 bg-amber-50 text-amber-600 rounded-xl font-black text-[10px] uppercase tracking-widest border border-amber-100 hover:bg-amber-600 hover:text-white transition shadow-sm"
                                        >
                                            REGENERAR CLAVE
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 uppercase tracking-widest">
                                Guardar Cambios
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

/* --- Atomic Components --- */

const TabButton = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-3 rounded-[1.25rem] font-black text-xs uppercase tracking-widest transition-all ${
            active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
        }`}
    >
        {React.cloneElement(icon, { size: 16 })}
        {label}
    </button>
);

const InputGroup = ({ label, icon, value, onChange, placeholder, type = "text" }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block">{label}</label>
        <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                {React.cloneElement(icon, { size: 18 })}
            </div>
            <input 
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300"
            />
        </div>
    </div>
);

export default ControlUsuarios;
