import React, { useState, useEffect } from 'react';
import { 
    Upload,
    Tag,
    Calendar,
    Percent,
    Copy,
    Check,
    Image,
    Sparkles,
    Loader2,
    X,
    ShoppingBag,
    Home,
    Package,
    Gift,
    BookOpen,
    User,
    LogOut,
    ChevronRight,
    Users,
    TrendingUp,
    CreditCard,
    Truck
} from 'lucide-react';

export default function CrearPromociones() {
    const [productos, setProductos] = useState([
        { id: 1, nombre: 'Paracetamol 500mg' },
        { id: 2, nombre: 'Ibuprofeno 400mg' },
        { id: 3, nombre: 'Vitamina C' }
    ]);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [copied, setCopied] = useState(false);
    
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        tipo: 'porcentaje',
        descuento: '',
        codigo_descuento: '',
        producto_id: '',
        categoria_id: '',
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_fin: new Date().toISOString().split('T')[0],
        imagen: null
    });

    const user = { nombre: 'Administrador' };

    useEffect(() => {
        setFormData(prev => ({...prev, codigo_descuento: generateDiscountCode()}));
    }, []);

    const generateDiscountCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'PROMO';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
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

    const removeImage = () => {
        setFormData({...formData, imagen: null});
        setImagePreview(null);
    };

    const copyCode = () => {
        navigator.clipboard.writeText(formData.codigo_descuento);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const regenerateCode = () => {
        setFormData({...formData, codigo_descuento: generateDiscountCode()});
    };

    const handleSubmit = () => {
        if (new Date(formData.fecha_fin) < new Date(formData.fecha_inicio)) {
            alert('La fecha de finalización no puede ser anterior a la fecha de inicio');
            return;
        }
        
        setLoading(true);
        setTimeout(() => {
            alert('¡Promoción creada exitosamente!');
            setLoading(false);
        }, 1500);
    };

    const adminLinks = [
        { name: 'Dashboard Global', icon: Home },
        { name: 'Inventario', icon: Package },
        { name: 'Gestión de Pedidos', icon: ShoppingBag },
        { name: 'Control de Usuarios', icon: Users, active: false },
        { name: 'Blog Corporativo', icon: BookOpen },
        { name: 'Promociones', icon: Percent, active: true },
        { name: 'Ventas Realizadas', icon: TrendingUp },
        { name: 'Historial de Pagos', icon: CreditCard },
        { name: 'Logística de Repartos', icon: Truck },
        { name: 'Añadir Producto', icon: Gift },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            {/* Sidebar Fijo - Siempre Visible */}
            <div className="w-80 bg-white shadow-xl fixed inset-y-0 left-0 z-50 flex flex-col">
                {/* Header del Sidebar */}
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg">
                            <ShoppingBag className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-black text-xl text-slate-800 tracking-tight">AdminPanel</span>
                    </div>
                </div>

                {/* Navegación */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {adminLinks.map((link, i) => (
                        <button
                            key={i}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all text-left ${
                                link.active 
                                    ? 'bg-blue-50 text-blue-600' 
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            <link.icon className={`w-5 h-5 flex-shrink-0 ${link.active ? 'text-blue-600' : 'text-slate-400'}`} />
                            <span>{link.name}</span>
                        </button>
                    ))}
                </nav>

                {/* Botón Cerrar Sesión */}
                <div className="p-6 border-t border-slate-100">
                    <button className="w-full flex items-center justify-center gap-3 py-4 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all">
                        <LogOut className="w-4 h-4" /> CERRAR SESIÓN
                    </button>
                </div>
            </div>

            {/* Contenido Principal con margen izquierdo */}
            <div className="flex-1 ml-80">
                {/* Top Bar */}
                <div className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-8 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold">
                            <span className="hover:text-blue-600 transition cursor-pointer">Promociones</span>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-slate-900">Nueva Promoción</span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-bold text-slate-900">{user.nombre}</span>
                                <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest">Administrador</span>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-100">
                                <User className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                <main className="py-10 px-8 max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-12 mb-10 relative overflow-hidden shadow-2xl shadow-blue-200">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[80px] rounded-full -mr-32 -mt-32"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                                <span className="bg-blue-500/30 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
                                    Marketing Tool
                                </span>
                            </div>
                            <h1 className="text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                                Crear Nueva <br /> <span className="text-blue-200">Promoción</span>
                            </h1>
                            <p className="text-blue-100 font-semibold text-lg max-w-xl">
                                Impulsa tus ventas configurando descuentos atractivos para tus clientes.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Sidebar Form Info */}
                        <div className="space-y-8">
                            {/* Image Section */}
                            <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-slate-100">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Image className="w-4 h-4 text-blue-600" /> Portada
                                </h3>
                                
                                {!imagePreview ? (
                                    <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group">
                                        <div className="flex flex-col items-center justify-center py-6">
                                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                                                <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-600" />
                                            </div>
                                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
                                                Subir Imagen
                                            </p>
                                        </div>
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                ) : (
                                    <div className="relative group rounded-3xl overflow-hidden shadow-lg aspect-square">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                                            <button type="button" onClick={removeImage} className="p-3 bg-red-500 text-white rounded-2xl shadow-xl hover:bg-red-600 transform hover:scale-110 transition">
                                                <X className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Discount Code Card */}
                            <div className="bg-slate-900 p-8 rounded-[2rem] text-white overflow-hidden relative shadow-2xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[60px] rounded-full -mr-16 -mt-16"></div>
                                <h3 className="text-xs font-black uppercase tracking-widest mb-6 opacity-50 flex items-center gap-2">
                                    <Percent className="w-4 h-4 text-blue-400" /> Código Generado
                                </h3>
                                
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center relative z-10 group">
                                    <code className="text-3xl font-mono font-black text-blue-400 tracking-wider block mb-4 group-hover:text-white transition">
                                        {formData.codigo_descuento}
                                    </code>
                                    <div className="flex gap-2 justify-center">
                                        <button
                                            type="button"
                                            onClick={copyCode}
                                            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition ${
                                                copied ? 'bg-green-500 text-white' : 'bg-white/10 text-white hover:bg-blue-600'
                                            }`}
                                        >
                                            {copied ? <><Check className="w-3 h-3" /> Copiado</> : <><Copy className="w-3 h-3" /> Copiar</>}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={regenerateCode}
                                            className="w-12 py-3 bg-white/10 text-white rounded-xl hover:bg-blue-600 transition flex items-center justify-center"
                                            title="Generar nuevo"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Form Fields */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white p-10 rounded-[2.5rem] shadow-lg border border-slate-100">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 border border-blue-100">
                                        <Tag className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900">Detalles Generales</h2>
                                        <p className="text-slate-500 text-sm font-semibold uppercase tracking-widest">Información de la oferta</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block ml-1">Título Publicitario</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.titulo}
                                            onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] outline-none font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-200 transition-all placeholder:text-slate-300"
                                            placeholder="Ej: Descuento Especial Fin de Mes"
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block ml-1">Descripción Breve</label>
                                        <textarea
                                            value={formData.descripcion}
                                            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] outline-none font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-200 transition-all placeholder:text-slate-300 resize-none"
                                            rows="3"
                                            placeholder="Explica de qué trata esta promoción..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-50 mt-8">
                                        <div className="group">
                                            <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block ml-1">Tipo de Beneficio</label>
                                            <div className="relative">
                                                <select
                                                    value={formData.tipo}
                                                    onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] outline-none font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-200 appearance-none transition-all cursor-pointer"
                                                >
                                                    <option value="porcentaje">Porcentaje %</option>
                                                    <option value="2x1">2x1</option>
                                                    <option value="combo">Combo Mixto</option>
                                                    <option value="precio_fijo">Precio Liquidación</option>
                                                </select>
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <ChevronRight className="w-5 h-5 text-slate-300 rotate-90" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="group">
                                            <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block ml-1">Valor del Descuento</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={formData.descuento}
                                                    onChange={(e) => setFormData({...formData, descuento: e.target.value})}
                                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] outline-none font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-200 transition-all placeholder:text-slate-300"
                                                    placeholder="0"
                                                />
                                                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-blue-600">%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-10 rounded-[2.5rem] shadow-lg border border-slate-100">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 border border-blue-100">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900">Vigencia y Segmento</h2>
                                        <p className="text-slate-500 text-sm font-semibold uppercase tracking-widest">Temporalidad y alcance</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block ml-1">Vence el:</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.fecha_fin}
                                            onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] outline-none font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-200 transition-all"
                                        />
                                    </div>
                                    
                                    <div className="group">
                                        <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block ml-1">Producto Específico</label>
                                        <div className="relative">
                                            <select
                                                value={formData.producto_id}
                                                onChange={(e) => setFormData({...formData, producto_id: e.target.value})}
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] outline-none font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-200 appearance-none transition-all cursor-pointer"
                                            >
                                                <option value="">Todos los productos</option>
                                                {productos.map(p => (
                                                    <option key={p.id} value={p.id}>{p.nombre}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <ChevronRight className="w-5 h-5 text-slate-300 rotate-90" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-4 mt-12 pt-8 border-t border-slate-50">
                                    <button
                                        type="button"
                                        className="px-8 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-red-500 transition"
                                    >
                                        Descartar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="px-10 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-200 flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" /> Procesando...
                                            </>
                                        ) : (
                                            <>
                                                <Gift className="w-5 h-5" /> Publicar Oferta
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}