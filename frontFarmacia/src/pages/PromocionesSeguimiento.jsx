import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Plus,
    Trash2,
    Edit,
    Send,
    Tag,
    Calendar,
    Percent,
    Gift,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    ArrowLeft,
    Loader2,
    Mail,
    Search,
    Image as ImageIcon,
    Copy,
    Check,
    Sparkles,
    Upload
} from 'lucide-react';
import api, { getFileUrl } from '../services/api';
import AdminLayout from '../components/admin/AdminLayout';
import LoadingScreen from '../components/common/LoadingScreen';

export default function PromocionesSeguimiento() {
    const navigate = useNavigate();
    const [promociones, setPromociones] = useState([]);
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPromo, setEditingPromo] = useState(null);
    const [sending, setSending] = useState(null);
    const [notification, setNotification] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        tipo: 'porcentaje',
        descuento: '',
        codigo_descuento: '',
        producto_id: '',
        categoria_id: '',
        fecha_inicio: '',
        fecha_fin: '',
        activo: true,
        imagen: null
    });

    useEffect(() => {
        const loadInitialData = async () => {
            const startTime = Date.now();
            setLoading(true);
            try {
                const [promoRes, prodRes, catRes] = await Promise.all([
                    api.get('/promociones'),
                    api.get('/productos'),
                    api.get('/categorias')
                ]);
                setPromociones(promoRes.data);
                setProductos(prodRes.data);
                setCategorias(catRes.data);
            } catch (err) {
                console.error('Error loading initial data:', err);
            } finally {
                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, 800 - elapsedTime);
                setTimeout(() => setLoading(false), remainingTime);
            }
        };
        loadInitialData();
    }, []);

    const fetchData = async () => {
        try {
            const [promoRes, prodRes, catRes] = await Promise.all([
                api.get('/promociones'),
                api.get('/productos'),
                api.get('/categorias')
            ]);
            setPromociones(promoRes.data);
            setProductos(prodRes.data);
            setCategorias(catRes.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({...formData, imagen: file});
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'imagen') {
                    if (formData.imagen instanceof File) {
                        data.append('imagen', formData.imagen);
                    }
                } else {
                    data.append(key, formData[key]);
                }
            });

            if (editingPromo) {
                await api.put(`/promociones/${editingPromo.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                showNotification('Promoción actualizada exitosamente', 'success');
            } else {
                await api.post('/promociones', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                showNotification('Promoción creada exitosamente', 'success');
            }
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            showNotification('Error al guardar la promoción', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (promo) => {
        setEditingPromo(promo);
        setFormData({
            titulo: promo.titulo,
            descripcion: promo.descripcion || '',
            tipo: promo.tipo,
            descuento: promo.descuento,
            codigo_descuento: promo.codigo_descuento || '',
            producto_id: promo.producto_id || '',
            categoria_id: promo.categoria_id || '',
            fecha_inicio: promo.fecha_inicio?.split('T')[0] || '',
            fecha_fin: promo.fecha_fin?.split('T')[0] || '',
            activo: promo.activo,
            imagen: null
        });
        setImagePreview(promo.imagen_url ? getFileUrl(promo.imagen_url) : null);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar esta promoción?')) return;
        try {
            await api.delete(`/promociones/${id}`);
            showNotification('Promoción eliminada', 'success');
            fetchData();
        } catch (error) {
            showNotification('Error al eliminar', 'error');
        }
    };

    const handleNotify = async (id) => {
        setSending(id);
        try {
            const res = await api.post(`/promociones/${id}/notificar`);
            showNotification(`Email enviado a ${res.data.notificados} suscriptores`, 'success');
            fetchData();
        } catch (error) {
            showNotification('Error al enviar notificaciones', 'error');
        } finally {
            setSending(null);
        }
    };

    const resetForm = () => {
        setEditingPromo(null);
        setFormData({
            titulo: '',
            descripcion: '',
            tipo: 'porcentaje',
            descuento: '',
            codigo_descuento: generateDiscountCode(),
            producto_id: '',
            categoria_id: '',
            fecha_inicio: '',
            fecha_fin: '',
            activo: true,
            imagen: null
        });
        setImagePreview(null);
    };

    const generateDiscountCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'PROMO';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const getTipoLabel = (tipo) => {
        const tipos = {
            'porcentaje': 'Descuento %',
            '2x1': '2x1',
            'combo': 'Combo',
            'precio_fijo': 'Precio Fijo'
        };
        return tipos[tipo] || tipo;
    };

    const getStatusBadge = (promo) => {
        const hoy = new Date();
        const inicio = new Date(promo.fecha_inicio);
        const fin = new Date(promo.fecha_fin);
        
        if (!promo.activo) {
            return <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">Inactiva</span>;
        }
        if (hoy < inicio) {
            return <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100 italic">Pendiente</span>;
        }
        if (hoy > fin) {
            return <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">Expirada</span>;
        }
        return <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-sm shadow-blue-50">Activa</span>;
    };

    if (loading) {
        return <LoadingScreen message="Preparando campañas de marketing..." />;
    }

    return (
        <AdminLayout title="Gestión de Promociones">

            {/* Notification */}
            {notification && (
                <div className={`fixed top-24 right-6 z-[100] px-6 py-4 rounded-[1.5rem] shadow-2xl flex items-center gap-4 animate-slide-in backdrop-blur-md border ${
                    notification.type === 'success' ? 'bg-green-500/90 text-white border-green-400' : 'bg-red-500/90 text-white border-red-400'
                }`}>
                    <div className="bg-white/20 p-2 rounded-xl">
                        {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </div>
                    <span className="font-bold text-sm tracking-tight">{notification.message}</span>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section Simplified for Index */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 sm:p-10 mb-8 relative overflow-hidden shadow-2xl shadow-blue-200 text-white">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[60px] rounded-full -mr-20 -mt-20"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-500/30 backdrop-blur-md rounded-xl border border-white/20">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">Marketing Hub</span>
                            </div>
                            <h1 className="text-3xl font-black tracking-tight mb-2">Panel de Control de <span className="text-blue-300">Ofertas</span></h1>
                            <p className="text-blue-100 text-sm font-bold">Administra tus campañas comerciales y códigos de fidelidad de manera centralizada.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/10 text-center">
                                <p className="text-[10px] font-black uppercase opacity-60 mb-1">Activas</p>
                                <p className="text-2xl font-black">{promociones.filter(p => p.activo && new Date(p.fecha_fin) >= new Date()).length}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/10 text-center">
                                <p className="text-[10px] font-black uppercase opacity-60 mb-1">Total</p>
                                <p className="text-2xl font-black">{promociones.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Promotional Table */}
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden mb-10">
                    <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-100">
                                <Tag className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-800 text-lg">Catálogo de Promociones</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Historial completo</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 focus-within:border-blue-400 transition-all shadow-sm">
                            <Search className="w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Buscar promoción..." 
                                className="outline-none text-sm font-bold text-slate-600 w-full sm:w-64"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/30">
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Portada</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Promoción</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Código</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Beneficio</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Vigencia</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 text-center">Estado</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {promociones.map(promo => (
                                    <tr key={promo.id} className="group hover:bg-slate-50/80 transition-colors duration-300">
                                        <td className="px-8 py-5">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative shadow-sm group-hover:scale-105 transition-transform">
                                                {promo.imagen_url ? (
                                                    <img src={getFileUrl(promo.imagen_url)} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ImageIcon className="w-6 h-6 text-slate-300" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="max-w-xs">
                                                <p className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{promo.titulo}</p>
                                                <p className="text-xs font-bold text-slate-400 line-clamp-1 mt-1">{promo.descripcion || 'Sin descripción'}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <code className="bg-slate-900 text-blue-400 px-3 py-1.5 rounded-xl font-mono text-xs font-black tracking-wider border border-slate-800">
                                                    {promo.codigo_descuento || 'N/A'}
                                                </code>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase text-blue-600 mb-0.5">{getTipoLabel(promo.tipo)}</span>
                                                <span className="font-black text-slate-900">
                                                    {promo.tipo === 'porcentaje' ? `${promo.descuento}% OFF` : (promo.tipo === 'precio_fijo' ? `$${promo.descuento}` : promo.tipo)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-tighter">
                                                <Calendar className="w-3 h-3 text-blue-400" />
                                                {new Date(promo.fecha_inicio).toLocaleDateString()} - {new Date(promo.fecha_fin).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex justify-center">
                                                {getStatusBadge(promo)}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center justify-end gap-2">
                                                {!promo.notificado && (
                                                    <button
                                                        onClick={() => handleNotify(promo.id)}
                                                        disabled={sending === promo.id}
                                                        className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white hover:scale-110 active:scale-95 transition-all shadow-sm shadow-indigo-50 border border-indigo-100"
                                                        title="Notificar a suscriptores"
                                                    >
                                                        {sending === promo.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleEdit(promo)}
                                                    className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white hover:scale-110 active:scale-95 transition-all shadow-sm shadow-blue-50 border border-blue-100"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(promo.id)}
                                                    className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white hover:scale-110 active:scale-95 transition-all shadow-sm shadow-red-50 border border-red-100"
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
            </main>

            {/* Premium Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
                    <div 
                        className="absolute inset-0 bg-blue-900/40 backdrop-blur-xl animate-fade-in"
                        onClick={() => !submitting && setShowModal(false)}
                    ></div>
                    
                    <div className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-zoom-in max-h-full flex flex-col border border-white/20">
                        {/* Modal Header */}
                        <div className="p-8 pb-4 flex items-center justify-between bg-white sticky top-0 z-10 border-b border-slate-50">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 shadow-md shadow-blue-50">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                        {editingPromo ? 'Personalizar Oferta' : 'Lanzar Nueva Campaña'}
                                    </h2>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">{editingPromo ? 'ID: ' + editingPromo.id : 'Marketing Manager'}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => !submitting && setShowModal(false)}
                                className="p-4 bg-slate-50 text-slate-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 sm:p-10 scrollbar-hide">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                {/* Left Side: Visuals */}
                                <div className="lg:col-span-5 space-y-8">
                                    {/* Image Upload */}
                                    <div className="bg-slate-50 rounded-[2.5rem] p-6 border-2 border-dashed border-slate-200 hover:border-blue-400 transition-colors group">
                                        <div className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-white shadow-inner mb-6">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                                                        <Upload className="w-8 h-8 text-slate-300 group-hover:text-blue-500" />
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Subir imagen publicitaria</span>
                                                </div>
                                            )}
                                        </div>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleImageChange} 
                                            className="hidden" 
                                            id="modal-image-upload" 
                                        />
                                        <label 
                                            htmlFor="modal-image-upload"
                                            className="w-full py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <ImageIcon className="w-4 h-4" /> Seleccionar Archivo
                                        </label>
                                    </div>

                                    {/* Discount Code */}
                                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full -mr-16 -mt-16"></div>
                                        <label className="text-[10px] font-black uppercase text-blue-400 tracking-widest block mb-4">Código de Cupón</label>
                                        <div className="flex gap-3">
                                            <input 
                                                type="text" 
                                                value={formData.codigo_descuento}
                                                onChange={(e) => setFormData({...formData, codigo_descuento: e.target.value})}
                                                className="bg-white/10 border border-white/10 rounded-2xl px-5 py-3.5 w-full font-mono text-xl font-bold outline-none focus:border-blue-400 transition"
                                                placeholder="PROMOXXX"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setFormData({...formData, codigo_descuento: generateDiscountCode()})}
                                                className="p-3.5 bg-blue-600 rounded-2xl text-white hover:bg-blue-700 transition"
                                            >
                                                <Sparkles className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Forms */}
                                <div className="lg:col-span-7 space-y-10">
                                    <div className="space-y-6">
                                        <div className="group">
                                            <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-2 ml-1">Título de la Oferta</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.titulo}
                                                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none font-black text-slate-900 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition placeholder:text-slate-300"
                                                placeholder="Ej: Descuento Flash 24 Horas"
                                            />
                                        </div>

                                        <div className="group">
                                            <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-2 ml-1">Descripción</label>
                                            <textarea
                                                value={formData.descripcion}
                                                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none font-bold text-slate-700 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition placeholder:text-slate-300 resize-none"
                                                rows="3"
                                                placeholder="Detalla los términos y beneficios..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="group">
                                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-2 ml-1">Modalidad</label>
                                                <select
                                                    value={formData.tipo}
                                                    onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                                                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none font-black text-slate-700 focus:bg-white focus:border-blue-200 transition cursor-pointer appearance-none"
                                                >
                                                    <option value="porcentaje">Porcentaje %</option>
                                                    <option value="2x1">2x1</option>
                                                    <option value="combo">Combo Mixto</option>
                                                    <option value="precio_fijo">Precio Liquidación</option>
                                                </select>
                                            </div>
                                            <div className="group">
                                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-2 ml-1">Valor</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={formData.descuento}
                                                        onChange={(e) => setFormData({...formData, descuento: e.target.value})}
                                                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none font-black text-slate-900 focus:bg-white focus:border-blue-200 transition"
                                                        placeholder="0.00"
                                                    />
                                                    <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-blue-600 text-sm">
                                                        {formData.tipo === 'porcentaje' ? '%' : '$'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="group">
                                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-2 ml-1">Fecha Lanzamiento</label>
                                                <input
                                                    type="date"
                                                    required
                                                    value={formData.fecha_inicio}
                                                    onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})}
                                                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none font-bold text-slate-700 focus:bg-white focus:border-blue-200 transition"
                                                />
                                            </div>
                                            <div className="group">
                                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-2 ml-1">Fecha Expiración</label>
                                                <input
                                                    type="date"
                                                    required
                                                    value={formData.fecha_fin}
                                                    onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})}
                                                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none font-bold text-slate-700 focus:bg-white focus:border-blue-200 transition"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 bg-slate-50/50 p-6 rounded-[1.5rem] border border-slate-100">
                                            <input
                                                type="checkbox"
                                                id="promo-activo"
                                                checked={formData.activo}
                                                onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                                                className="w-6 h-6 text-blue-600 rounded-lg focus:ring-blue-500 border-slate-300 transition"
                                            />
                                            <label htmlFor="promo-activo" className="text-sm font-black text-slate-700 uppercase tracking-widest select-none cursor-pointer">Activar Promoción Inmediatamente</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Modal Footer */}
                        <div className="p-8 bg-slate-50 border-t border-slate-100 sticky bottom-0 z-10 flex gap-4">
                            <button
                                type="button"
                                onClick={() => !submitting && setShowModal(false)}
                                className="flex-1 px-8 py-5 bg-white border border-slate-200 text-slate-500 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:text-red-500 hover:border-red-100 transition shadow-sm"
                            >
                                Cancelar Cambios
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex-[2] px-8 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-70"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Procesando...
                                    </>
                                ) : (
                                    <>
                                        {editingPromo ? <CheckCircle className="w-5 h-5" /> : <Gift className="w-5 h-5" />}
                                        {editingPromo ? 'Confirmar Edición' : 'Finalizar y Publicar'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
