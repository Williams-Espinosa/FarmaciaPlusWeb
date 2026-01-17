import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingScreen from '../../components/common/LoadingScreen';
import { 
    PlusCircle, Package, Image as ImageIcon, Sparkles, 
    ArrowLeft, Save, Trash2, ShieldCheck, 
    DollarSign, Barcode, Hash, FileText,
    Tag, Check, AlertCircle
} from 'lucide-react';
import api from '../../services/api';

const RegistrarProductos = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [preview, setPreview] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        codigo_barras: '',
        categoria_id: '',
        requiere_receta: false,
        imagen: null
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categorias');
                setCategories(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, imagen: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'imagen') {
                if (formData.imagen) data.append('imagen', formData.imagen);
            } else if (key === 'requiere_receta') {
                data.append(key, formData[key] ? '1' : '0');
            } else {
                data.append(key, formData[key]);
            }
        });

        try {
            await api.post('/productos', data);
            alert('Producto registrado exitosamente');
            navigate('/admin/inventario');
        } catch (error) {
            console.error('Error creating product:', error);
            const msg = error.response?.data?.error || 'Error al conectar con el servidor';
            alert(msg);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <LoadingScreen message="Cargando catálogo de productos..." />;
    }

    return (
        <AdminLayout title="Registrar Productos">
            <main className="p-8 max-w-5xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/admin/inventario')}
                            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition shadow-sm"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Nuevo Medicamento</h1>
                            <p className="text-slate-500 font-bold text-sm">Completa el registro oficial para el catálogo maestro.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Form Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm space-y-8">
                            <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                                <FileText className="w-5 h-5 text-indigo-500" /> Información Básica
                            </h3>
                            
                            <div className="space-y-6">
                                <FormInput 
                                    label="Nombre Comercial" 
                                    icon={<Package />} 
                                    placeholder="Ej. Aspirina 500mg" 
                                    value={formData.nombre}
                                    onChange={(v) => setFormData({...formData, nombre: v})}
                                    required
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block">Categoría</label>
                                        <div className="relative">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
                                                <Tag className="w-5 h-5" />
                                            </div>
                                            <select 
                                                required
                                                value={formData.categoria_id}
                                                onChange={(e) => setFormData({...formData, categoria_id: e.target.value})}
                                                className="w-full pl-14 pr-10 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-900 transition-all appearance-none"
                                            >
                                                <option value="">Seleccionar...</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <FormInput 
                                        label="Código de Barras" 
                                        icon={<Barcode />} 
                                        placeholder="750..." 
                                        value={formData.codigo_barras}
                                        onChange={(v) => setFormData({...formData, codigo_barras: v})}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block">Descripción del Producto</label>
                                    <textarea 
                                        rows="4"
                                        placeholder="Indicaciones, dosis, efectos secundarios..."
                                        value={formData.descripcion}
                                        onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-900 transition-all resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 mb-8">
                                <DollarSign className="w-5 h-5 text-emerald-500" /> Precios e Inventario
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput 
                                    label="Precio Unitario ($)" 
                                    icon={<DollarSign />} 
                                    type="number" 
                                    step="0.01"
                                    placeholder="0.00" 
                                    value={formData.precio}
                                    onChange={(v) => setFormData({...formData, precio: v})}
                                    required
                                />
                                <FormInput 
                                    label="Stock Inicial" 
                                    icon={<Hash />} 
                                    type="number" 
                                    placeholder="0" 
                                    value={formData.stock}
                                    onChange={(v) => setFormData({...formData, stock: v})}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Image & Settings */}
                    <div className="space-y-8">
                        {/* Image Preview Card */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm overflow-hidden">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 block">Foto de Exhibición</h3>
                            <div className={`aspect-square rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden transition-all group ${preview ? 'border-indigo-200 bg-indigo-50/10' : 'border-slate-100 bg-slate-50'}`}>
                                {preview ? (
                                    <>
                                        <img src={preview} className="w-full h-full object-cover p-2 rounded-[1.8rem]" alt="Preview" />
                                        <div className="absolute inset-0 bg-indigo-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-white text-[10px] font-black uppercase tracking-widest">Cambiar Imagen</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm text-slate-300">
                                            <ImageIcon className="w-8 h-8" />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Sin Imagen</p>
                                    </div>
                                )}
                                <input 
                                    type="file" 
                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>

                        {/* Special Controls */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white space-y-8 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full"></div>
                            
                            <h3 className="text-sm font-black flex items-center gap-2 relative z-10">
                                <ShieldCheck className="w-5 h-5 text-indigo-400" /> Control Legal
                            </h3>
                            
                            <div className="space-y-6 relative z-10">
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div className={`w-14 h-8 rounded-full transition-all relative flex items-center px-1 ${formData.requiere_receta ? 'bg-red-500' : 'bg-slate-700'}`}>
                                        <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all ${formData.requiere_receta ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="hidden"
                                        checked={formData.requiere_receta}
                                        onChange={(e) => setFormData({...formData, requiere_receta: e.target.checked})}
                                    />
                                    <div>
                                        <p className="text-xs font-black uppercase">Venta bajo Receta</p>
                                        <p className="text-[10px] text-slate-400 font-bold italic">Antibióticos o Psicotrópicos</p>
                                    </div>
                                </label>
                            </div>

                            <button 
                                type="submit"
                                disabled={isSaving}
                                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 ${isSaving ? 'bg-slate-800 text-slate-500' : 'bg-indigo-600 hover:bg-white hover:text-indigo-600 shadow-xl shadow-indigo-900/40 text-white'}`}
                            >
                                {isSaving ? (
                                    <>Procesando...</>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5 transition-transform group-hover:scale-110" />
                                        Finalizar Registro
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Success Tip */}
                        <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-start gap-4">
                            <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <p className="text-[10px] font-bold text-emerald-700 leading-relaxed italic">
                                Al guardar, el producto estará disponible de inmediato para ventas en mostrador y tienda online.
                            </p>
                        </div>
                    </div>
                </form>
            </main>
        </AdminLayout>
    );
};

// Component Helper
const FormInput = ({ label, icon, placeholder, value, onChange, type = "text", ...props }) => (
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
                {...props}
            />
        </div>
    </div>
);

export default RegistrarProductos;
